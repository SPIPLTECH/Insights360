import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { getCurrentUser, canAccessMrcu } from "@/lib/auth";
import { writeIndex4Marks } from "@/lib/googleSheetsWrite";
import { monthlyEnrolmentSlabMarks } from "@/lib/marks";

/** Works out what goes into the sheet (value text + points) for a decision. */
function computeSheetPayload(submission: any, accepted: boolean) {
  let finalMarks = accepted ? submission.calculatedMarks : 0;
  let sheetValue: string;

  switch (submission.parameterType) {
    case "meeting_attendance":
      sheetValue = `${submission.attendancePercent ?? 0}%`;
      break;

    case "monthly_enrolment": {
      const distinctMonths = new Set((submission.months ?? []).map((m: any) => m.month)).size;
      sheetValue = `${distinctMonths} months`;
      if (accepted) finalMarks = monthlyEnrolmentSlabMarks(distinctMonths);
      break;
    }

    case "social_media":
      // Regular / Irregular once MRCU accepts; "No" if rejected.
      sheetValue = accepted ? submission.socialPresence ?? (submission.postedOnSocialMedia !== false ? "Yes" : "No") : "No";
      break;

    case "exam_compliance":
      // "Yes" if at least one allotted exam had CCTV submitted AND MRCU accepted it. Points = Part 1 + Part 2.
      sheetValue = accepted && submission.cctvSubmitted !== false ? "Yes" : "No";
      break;

    default:
      sheetValue = accepted ? "Yes" : "No";
  }
  return { finalMarks, sheetValue };
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getCurrentUser();
    if (!canAccessMrcu(user)) {
      return NextResponse.json({ error: "Not authenticated as MRCU." }, { status: 401 });
    }

    const { decision, note } = (await req.json()) as { decision?: "accept" | "reject"; note?: string };

    await connectDB();
    const submission = await Submission.findById(params.id);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    const isRetry = submission.status !== "pending" && submission.sheetSynced === false;

    if (submission.status !== "pending" && !isRetry) {
      return NextResponse.json({ error: `This submission was already ${submission.status}.` }, { status: 409 });
    }

    // On a normal review we need a decision; on a retry we reuse the saved one.
    let accepted: boolean;
    if (isRetry) {
      accepted = submission.status === "accepted";
    } else {
      if (decision !== "accept" && decision !== "reject") {
        return NextResponse.json({ error: 'decision must be "accept" or "reject".' }, { status: 400 });
      }
      accepted = decision === "accept";
    }

    const { finalMarks, sheetValue } = computeSheetPayload(submission, accepted);

    // STEP 1: save the MRCU decision + points in the database FIRST.
    // The decision is never lost, even if Google is down / misconfigured.
    if (!isRetry) {
      submission.status = accepted ? "accepted" : "rejected";
      submission.reviewedBy = user.sub as any;
      submission.reviewedAt = new Date();
      submission.reviewNote = note ?? null;
      if (accepted) submission.calculatedMarks = finalMarks;
      submission.sheetSynced = false;
      submission.sheetError = null;
      await submission.save();
    }

    // STEP 2: push to Google Sheet. A failure here does NOT undo the decision.
    try {
      await writeIndex4Marks({
        alcCode: submission.alcCode,
        parameterType: submission.parameterType,
        value: sheetValue,
        points: finalMarks,
      });
      submission.sheetSynced = true;
      submission.sheetError = null;
      await submission.save();
      return NextResponse.json({ submission, sheetSynced: true });
    } catch (sheetErr: any) {
      console.error("Sheet sync failed:", sheetErr);
      submission.sheetSynced = false;
      submission.sheetError = sheetErr?.message ?? "Sheet sync failed.";
      await submission.save();
      return NextResponse.json({
        submission,
        sheetSynced: false,
        warning: "Decision saved, but the Google Sheet could not be updated. Retry sync later.",
      });
    }
  } catch (err: any) {
    console.error("MRCU review failed:", err);
    return NextResponse.json({ error: err?.message ?? "Review failed." }, { status: 500 });
  }
}
