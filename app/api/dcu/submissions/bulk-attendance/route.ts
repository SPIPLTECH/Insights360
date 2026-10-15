import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { getCurrentUser } from "@/lib/auth";
import { meetingAttendanceMarks, round1 } from "@/lib/marks";

const MAX_MEETINGS = 15;

const NO_NAME = "(Name not in sheet)";

/** Meeting Attendance — one request, many ALCs. Marks are calculated exactly like the single-entry route. */
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });
  }

  const body = await req.json();
  const total = Number(body.totalMeetings);
  if (!Number.isInteger(total) || total <= 0) {
    return NextResponse.json({ error: "Total meetings scheduled must be a whole number greater than 0." }, { status: 400 });
  }
  if (total > MAX_MEETINGS) {
    return NextResponse.json({ error: `Total meetings scheduled cannot be more than ${MAX_MEETINGS}.` }, { status: 400 });
  }

  const entries: any[] = Array.isArray(body.entries) ? body.entries : [];
  if (entries.length === 0) {
    return NextResponse.json({ error: "Enter attended meetings for at least one ALC." }, { status: 400 });
  }

  const fileUrls = Array.isArray(body.fileUrls) ? body.fileUrls : [];
  const seen = new Set<string>();
  const docs: any[] = [];
  for (const e of entries) {
    const alcCode = String(e?.alcCode ?? "").trim();
    const alcName = String(e?.alcName ?? "").trim() || NO_NAME; // some ALCs have no name in the sheet
    const attended = Number(e?.attendedMeetings);
    if (!alcCode) {
      return NextResponse.json({ error: "Every entry needs an ALC code." }, { status: 400 });
    }
    if (seen.has(alcCode)) {
      return NextResponse.json({ error: `ALC ${alcCode} is listed more than once.` }, { status: 400 });
    }
    seen.add(alcCode);
    if (!Number.isInteger(attended) || attended < 0) {
      return NextResponse.json({ error: `ALC ${alcCode}: meetings attended must be a whole number (0 or more).` }, { status: 400 });
    }
    if (attended > total) {
      return NextResponse.json({ error: `ALC ${alcCode}: meetings attended cannot be more than meetings scheduled.` }, { status: 400 });
    }
    const attendancePercent = round1((attended / total) * 100);
    docs.push({
      district: user.district,
      alcCode,
      alcName,
      parameterType: "meeting_attendance",
      status: "pending",
      submittedBy: user.sub,
      fileUrls,
      totalMeetings: total,
      attendedMeetings: attended,
      attendancePercent,
      calculatedMarks: meetingAttendanceMarks(attendancePercent),
    });
  }

  await connectDB();
  await Submission.insertMany(docs);
  return NextResponse.json({ count: docs.length }, { status: 201 });
}
