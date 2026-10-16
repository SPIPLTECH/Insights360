import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { getCurrentUser } from "@/lib/auth";
import { loadAllotments } from "@/lib/allotments";
import {
  CCTV_OBSERVATIONS,
  SOCIAL_PRESENCE_OPTIONS,
  ExamEvent,
  isEventConducted,
  normalizeEvent,
} from "@/lib/dcuOptions";
import { cctvGridMarks, meetingAttendanceMarks, observationMarks, round1, round3, socialPresenceMarks } from "@/lib/marks";

const NO_NAME = "(Name not in sheet)";
const MAX_MEETINGS = 15;
const isHttpUrl = (v: string) => /^https?:\/\/\S+$/i.test(v);
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

/**
 * One ALC, one parameter, saved from the row's pencil -> save button.
 *  - If the ALC's latest submission for this parameter is still PENDING it is updated in place.
 *  - If MRCU already accepted/rejected it, the edit becomes a new PENDING submission (re-review).
 * Marks are always calculated here, never trusted from the browser.
 */
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });
  }

  const body = await req.json();
  const parameterType = String(body.parameterType ?? "");
  const alcCode = String(body.alcCode ?? "").trim();
  const alcName = String(body.alcName ?? "").trim() || NO_NAME;
  if (!alcCode) return bad("ALC code is required.");

  let fields: Record<string, any> = {};
  let fileUrls: string[] | undefined;

  await connectDB();

  switch (parameterType) {
    case "meeting_attendance": {
      const total = Number(body.totalMeetings);
      const attended = Number(body.attendedMeetings);
      if (!Number.isInteger(total) || total <= 0) return bad("Total meetings scheduled must be a whole number above 0.");
      if (total > MAX_MEETINGS) return bad(`Total meetings scheduled cannot be more than ${MAX_MEETINGS}.`);
      if (!Number.isInteger(attended) || attended < 0) return bad("Meetings attended must be a whole number (0 or more).");
      if (attended > total) return bad("Meetings attended cannot be more than meetings scheduled.");
      const attendancePercent = round1((attended / total) * 100);
      fields = {
        totalMeetings: total,
        attendedMeetings: attended,
        attendancePercent,
        calculatedMarks: meetingAttendanceMarks((attended / total) * 100), // exact ratio, not the rounded % (avoids double rounding)
      };
      if (Array.isArray(body.fileUrls)) fileUrls = body.fileUrls.filter((u: unknown) => typeof u === "string");
      break;
    }

    case "exam_compliance": {
      const observation = String(body.observation ?? "");
      if (!(CCTV_OBSERVATIONS as readonly string[]).includes(observation)) return bad("Select the annual observation (Bad … Best).");

      const { map } = await loadAllotments();
      const allotted = map[alcCode] ?? []; // ALCs with nothing allotted show NA in every event
      const eligible = allotted.filter((e) => isEventConducted(e as ExamEvent));

      const sent = new Map<string, boolean>();
      for (const g of Array.isArray(body.grid) ? body.grid : []) {
        const ev = normalizeEvent(g?.event);
        if (ev) sent.set(ev, g?.submitted === true);
      }
      const examGrid = eligible.map((event) => ({ event, submitted: sent.get(event) === true }));
      const submittedEvents = examGrid.filter((g) => g.submitted).map((g) => g.event);
      const part1 = cctvGridMarks(submittedEvents.length, eligible.length);
      const part2 = observationMarks(observation);
      fields = {
        examGrid,
        examEligibleCount: eligible.length,
        examEvents: submittedEvents,
        cctvSubmitted: submittedEvents.length > 0,
        cctvSubmittedCount: submittedEvents.length,
        cctvPart1Marks: part1,
        cctvObservation: observation,
        observationMarks: part2,
        calculatedMarks: round3(part1 + part2),
      };
      break;
    }

    case "social_media": {
      const presence = String(body.presence ?? "");
      if (!(SOCIAL_PRESENCE_OPTIONS as readonly string[]).includes(presence)) return bad("Select Regular or Irregular.");
      const insta = String(body.instagramLink ?? "").trim();
      const fb = String(body.facebookLink ?? "").trim();
      if (insta && !isHttpUrl(insta)) return bad("Instagram link must start with http:// or https://");
      if (fb && !isHttpUrl(fb)) return bad("Facebook link must start with http:// or https://");
      if (presence === "Regular" && !insta && !fb) return bad("Add at least one Instagram or Facebook link as proof of regular presence.");
      fields = {
        socialPresence: presence,
        postedOnSocialMedia: true,
        instagramLink: insta,
        facebookLink: fb,
        socialPlatform: [insta && "Instagram", fb && "Facebook"].filter(Boolean).join(", ") || "None",
        socialLink: [insta, fb].filter(Boolean).join(", "),
        calculatedMarks: socialPresenceMarks(presence),
      };
      break;
    }

    default:
      return bad("Unknown parameterType.");
  }

  const latest: any = await Submission.findOne({ district: user.district, alcCode, parameterType }).sort({ createdAt: -1 });

  if (latest && latest.status === "pending") {
    latest.set({ ...fields, alcName: alcName !== NO_NAME ? alcName : latest.alcName });
    if (fileUrls) latest.fileUrls = fileUrls;
    await latest.save();
    return NextResponse.json({ submission: latest.toObject() });
  }

  const created = await Submission.create({
    district: user.district,
    alcCode,
    alcName,
    parameterType,
    status: "pending",
    submittedBy: user.sub,
    fileUrls: fileUrls ?? latest?.fileUrls ?? [],
    ...fields,
  });
  return NextResponse.json({ submission: created.toObject() }, { status: 201 });
}
