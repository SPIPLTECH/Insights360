import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { getCurrentUser } from "@/lib/auth";
import { writeIndex4Marks } from "@/lib/googleSheetsWrite";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!user || user.role !== "mrcu") {
    return NextResponse.json({ error: "Not authenticated as MRCU." }, { status: 401 });
  }

  const { decision, note } = (await req.json()) as { decision: "accept" | "reject"; note?: string };
  if (decision !== "accept" && decision !== "reject") {
    return NextResponse.json({ error: 'decision must be "accept" or "reject".' }, { status: 400 });
  }

  await connectDB();
  const submission = await Submission.findById(params.id);
  if (!submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }
  if (submission.status !== "pending") {
    return NextResponse.json({ error: `This submission was already ${submission.status}.` }, { status: 409 });
  }

  const accepted = decision === "accept";
  const finalMarks = accepted ? submission.calculatedMarks : 0;

  // What goes into the sheet's "value" column (Attendace % / Yes-No), per parameter.
  let sheetValue: string;
  switch (submission.parameterType) {
    case "meeting_attendance":
      sheetValue = `${submission.attendancePercent ?? 0}%`;
      break;
    case "monthly_enrolment":
      sheetValue = accepted ? "Yes" : "No";
      break;
    default:
      sheetValue = accepted ? "Yes" : "No";
  }

  // Write to the live Google Sheet FIRST — if this fails, we don't want to
  // silently mark the submission as reviewed while the sheet stays stale.
  await writeIndex4Marks({
    alcCode: submission.alcCode,
    parameterType: submission.parameterType,
    value: sheetValue,
    points: finalMarks,
  });

  submission.status = accepted ? "accepted" : "rejected";
  submission.reviewedBy = user.sub as any;
  submission.reviewedAt = new Date();
  submission.reviewNote = note ?? null;
  if (accepted) submission.calculatedMarks = finalMarks;
  await submission.save();

  return NextResponse.json({ submission });
}
