import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission, { ParameterType, MonthEntry } from "@/models/Submission";
import { getCurrentUser } from "@/lib/auth";
import { meetingAttendanceMarks, binaryMarks, monthlyEnrolmentMarks } from "@/lib/marks";

function requireDcu() {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) return null;
  return user;
}

export async function GET() {
  const user = requireDcu();
  if (!user) return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });

  await connectDB();
  const submissions = await Submission.find({ district: user.district }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ submissions });
}

export async function POST(req: NextRequest) {
  const user = requireDcu();
  if (!user) return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });

  const body = await req.json();
  const { alcCode, alcName, parameterType } = body as {
    alcCode: string;
    alcName: string;
    parameterType: ParameterType;
  };

  if (!alcCode || !alcName || !parameterType) {
    return NextResponse.json({ error: "alcCode, alcName and parameterType are required." }, { status: 400 });
  }

  await connectDB();

  const doc: any = {
    district: user.district,
    alcCode,
    alcName,
    parameterType,
    status: "pending",
    submittedBy: user.sub,
    fileUrls: Array.isArray(body.fileUrls) ? body.fileUrls : [],
  };

  switch (parameterType) {
    case "meeting_attendance": {
      const attendancePercent = Number(body.attendancePercent);
      if (Number.isNaN(attendancePercent)) {
        return NextResponse.json({ error: "attendancePercent must be a number." }, { status: 400 });
      }
      doc.attendancePercent = attendancePercent;
      doc.proofDate = body.proofDate ?? "";
      doc.calculatedMarks = meetingAttendanceMarks(attendancePercent);
      break;
    }
    case "exam_compliance": {
      doc.auditNotes = body.auditNotes ?? "";
      doc.calculatedMarks = binaryMarks(true); // marks-if-accepted; MRCU decides accept/reject
      break;
    }
    case "social_media": {
      if (!body.socialPlatform || !body.socialLink) {
        return NextResponse.json({ error: "socialPlatform and socialLink are required." }, { status: 400 });
      }
      doc.socialPlatform = body.socialPlatform;
      doc.socialLink = body.socialLink;
      doc.calculatedMarks = binaryMarks(true);
      break;
    }
    case "monthly_enrolment": {
      const months = Array.isArray(body.months) ? (body.months as MonthEntry[]) : [];
      if (months.length === 0) {
        return NextResponse.json({ error: "At least one month entry is required." }, { status: 400 });
      }
      doc.months = months;
      const distinctMonths = new Set(months.map((m) => m.month)).size;
      doc.calculatedMarks = monthlyEnrolmentMarks(distinctMonths);
      break;
    }
    default:
      return NextResponse.json({ error: "Unknown parameterType." }, { status: 400 });
  }

  const submission = await Submission.create(doc);
  return NextResponse.json({ submission }, { status: 201 });
}
