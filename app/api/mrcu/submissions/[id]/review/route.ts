import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { getCurrentUser } from "@/lib/auth";
import { writeIndex4Marks } from "@/lib/googleSheetsWrite";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
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
    let finalMarks = accepted ? submission.calculatedMarks : 0;
    let sheetValue: string;

    // What goes into the sheet's "value" column, per parameter.
    switch (submission.parameterType) {
      case "meeting_attendance":
        sheetValue = `${submission.attendancePercent ?? 0}%`;
        break;

      case "monthly_enrolment":
        // Yaha hum aapke 'months' array ki length nikal rahe hain
        const monthsCount = submission.months ? submission.months.length : 0;
        sheetValue = `${monthsCount} months`;
        
        // Calculate points based on the monthwise consistency criteria if accepted
        if (accepted) {
          if (monthsCount >= 10) {
            finalMarks = 25;
          } else if (monthsCount >= 8) {
            finalMarks = 20;
          } else if (monthsCount >= 6) {
            finalMarks = 15;
          } else if (monthsCount >= 4) {
            finalMarks = 10;
          } else {
            finalMarks = 0;
          }
        }
        break;

      default:
        sheetValue = accepted ? "Yes" : "No";
    }

    // Write to the live Google Sheet FIRST 
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
    
    // Update calculated marks with our newly generated finalMarks
    if (accepted) submission.calculatedMarks = finalMarks;
    
    await submission.save();

    return NextResponse.json({ submission });
  } catch (err: any) {
    console.error("MRCU review failed:", err);
    return NextResponse.json({ error: err?.message ?? "Review failed." }, { status: 500 });
  }
}