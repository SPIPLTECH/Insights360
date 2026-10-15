import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission, { ParameterType, MonthEntry } from "@/models/Submission";
import { getCurrentUser } from "@/lib/auth";
import { meetingAttendanceMarks, binaryMarks, monthlyEnrolmentSlabMarks, examComplianceMarks, round1 } from "@/lib/marks";
import { EXAM_EVENTS, CCTV_OBSERVATIONS } from "@/lib/dcuOptions";

const isHttpUrl = (v: unknown) => typeof v === "string" && /^https?:\/\/\S+$/i.test(v.trim());

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
      const total = Number(body.totalMeetings);
      const attended = Number(body.attendedMeetings);
      if (!Number.isInteger(total) || total <= 0) {
        return NextResponse.json({ error: "Total meetings scheduled must be a whole number greater than 0." }, { status: 400 });
      }
      if (total > 15) {
        return NextResponse.json({ error: "Total meetings scheduled cannot be more than 15." }, { status: 400 });
      }
      if (!Number.isInteger(attended) || attended < 0) {
        return NextResponse.json({ error: "Meetings attended must be a whole number (0 or more)." }, { status: 400 });
      }
      if (attended > total) {
        return NextResponse.json({ error: "Meetings attended cannot be more than meetings scheduled." }, { status: 400 });
      }
      const attendancePercent = round1((attended / total) * 100);
      doc.totalMeetings = total;
      doc.attendedMeetings = attended;
      doc.attendancePercent = attendancePercent;
      doc.calculatedMarks = meetingAttendanceMarks(attendancePercent);
      break;
    }
    case "exam_compliance": {
      // Exam Compliance is now submitted in 2 bulk parts (see /api/dcu/submissions/bulk-exam).
      return NextResponse.json({ error: "Use the Examination Compliances CCTV page to submit this." }, { status: 400 });
    }
    case "social_media": {
      if (typeof body.postedOnSocialMedia !== "boolean") {
        return NextResponse.json({ error: "Please select whether the ALC posted on social media (Yes/No)." }, { status: 400 });
      }
      doc.postedOnSocialMedia = body.postedOnSocialMedia;
      if (body.postedOnSocialMedia) {
        const insta = String(body.instagramLink ?? "").trim();
        const fb = String(body.facebookLink ?? "").trim();
        if (!insta || !fb) {
          return NextResponse.json({ error: "Both Instagram and Facebook links are required." }, { status: 400 });
        }
        if (!isHttpUrl(insta) || !isHttpUrl(fb)) {
          return NextResponse.json({ error: "Links must start with http:// or https://" }, { status: 400 });
        }
        doc.instagramLink = insta;
        doc.facebookLink = fb;
        doc.socialPlatform = [insta && "Instagram", fb && "Facebook"].filter(Boolean).join(", ");
        doc.socialLink = [insta, fb].filter(Boolean).join(", ");
        doc.calculatedMarks = binaryMarks(true);
      } else {
        doc.socialPlatform = "None";
        doc.socialLink = "";
        doc.calculatedMarks = 0; // not posted -> no marks even if accepted
      }
      break;
    }
    case "monthly_enrolment": {
      const months = Array.isArray(body.months) ? (body.months as MonthEntry[]) : [];
      if (months.length === 0) {
        return NextResponse.json({ error: "At least one month entry is required." }, { status: 400 });
      }
      doc.months = months;
      const distinctMonths = new Set(months.map((m) => m.month)).size;
      doc.calculatedMarks = monthlyEnrolmentSlabMarks(distinctMonths);
      break;
    }
    default:
      return NextResponse.json({ error: "Unknown parameterType." }, { status: 400 });
  }

  const submission = await Submission.create(doc);
  return NextResponse.json({ submission }, { status: 201 });
}
