import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { getCurrentUser } from "@/lib/auth";
import { EXAM_EVENTS, CCTV_OBSERVATIONS } from "@/lib/dcuOptions";
import { cctvEventsMarks, observationMarks, round3 } from "@/lib/marks";

const NO_NAME = "(Name not in sheet)";

/**
 * Examination Compliance CCTV — bulk, in 2 parts (each part is out of 12.5, total 25).
 *   part 1: { alcCode, alcName, cctvSubmitted: boolean, examEvents: string[] }
 *   part 2: { alcCode, alcName, observation: "Bad"|"Poor"|"Average"|"Good"|"Best" }
 *
 * One exam submission per ALC holds BOTH parts. Whichever part comes first creates a pending
 * submission; the other part is added to that same pending submission. If the ALC's latest
 * submission was already ACCEPTED, the new pending one starts from its values so the total
 * (part 1 + part 2) is always complete when MRCU reviews it.
 */
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });
  }

  const body = await req.json();
  const part = Number(body.part);
  if (part !== 1 && part !== 2) {
    return NextResponse.json({ error: "part must be 1 or 2." }, { status: 400 });
  }
  const entries: any[] = Array.isArray(body.entries) ? body.entries : [];
  if (entries.length === 0) {
    return NextResponse.json({ error: "Fill in at least one ALC." }, { status: 400 });
  }

  // ---- validate ----
  const seen = new Set<string>();
  for (const e of entries) {
    const code = String(e?.alcCode ?? "").trim();
    const name = String(e?.alcName ?? "").trim() || NO_NAME; // some ALCs have no name in the sheet
    if (!code) return NextResponse.json({ error: "Every entry needs an ALC code." }, { status: 400 });
    if (seen.has(code)) return NextResponse.json({ error: `ALC ${code} is listed more than once.` }, { status: 400 });
    seen.add(code);
    e.alcCode = code;
    e.alcName = name;

    if (part === 1) {
      if (typeof e.cctvSubmitted !== "boolean") {
        return NextResponse.json({ error: `ALC ${code}: select CCTV Submitted Yes or No.` }, { status: 400 });
      }
      const events: string[] = Array.isArray(e.examEvents) ? Array.from(new Set<string>(e.examEvents)) : [];
      if (events.some((ev) => !(EXAM_EVENTS as readonly string[]).includes(ev))) {
        return NextResponse.json({ error: `ALC ${code}: invalid exam event.` }, { status: 400 });
      }
      if (e.cctvSubmitted && events.length === 0) {
        return NextResponse.json({ error: `ALC ${code}: select at least one exam event.` }, { status: 400 });
      }
      e.examEvents = e.cctvSubmitted ? events : [];
    } else if (!(CCTV_OBSERVATIONS as readonly string[]).includes(e.observation)) {
      return NextResponse.json({ error: `ALC ${code}: select a General Observation.` }, { status: 400 });
    }
  }

  await connectDB();

  // latest exam submission of each of these ALCs (this district only)
  const existing = await Submission.find({
    district: user.district,
    parameterType: "exam_compliance",
    alcCode: { $in: entries.map((e) => e.alcCode) },
  })
    .sort({ createdAt: -1 })
    .lean();
  const latest = new Map<string, any>();
  for (const s of existing as any[]) if (!latest.has(s.alcCode)) latest.set(s.alcCode, s);

  const inserts: any[] = [];
  const updates: any[] = [];

  for (const e of entries) {
    const cur = latest.get(e.alcCode);
    const isPending = cur?.status === "pending";
    // start from the existing values only if they are in the new 2-part format
    const usable = cur && (isPending || cur.status === "accepted") && (cur.cctvPart1Marks != null || cur.observationMarks != null);
    const base = usable ? cur : null;

    const state: Record<string, any> = {};
    for (const k of ["cctvSubmitted", "examEvents", "cctvSubmittedCount", "cctvPart1Marks", "cctvObservation", "observationMarks"]) {
      if (base && base[k] !== undefined) state[k] = base[k];
    }

    if (part === 1) {
      state.cctvSubmitted = e.cctvSubmitted;
      state.examEvents = e.examEvents;
      state.cctvSubmittedCount = e.examEvents.length;
      state.cctvPart1Marks = cctvEventsMarks(e.cctvSubmitted, e.examEvents.length);
    } else {
      state.cctvObservation = e.observation;
      state.observationMarks = observationMarks(e.observation);
    }
    const calculatedMarks = round3((state.cctvPart1Marks ?? 0) + (state.observationMarks ?? 0));

    if (isPending) {
      updates.push({
        updateOne: { filter: { _id: cur._id, status: "pending" }, update: { $set: { ...state, calculatedMarks } } },
      });
    } else {
      inserts.push({
        district: user.district,
        alcCode: e.alcCode,
        alcName: e.alcName,
        parameterType: "exam_compliance",
        status: "pending",
        submittedBy: user.sub,
        fileUrls: [],
        ...state,
        calculatedMarks,
      });
    }
  }

  if (inserts.length) await Submission.insertMany(inserts);
  if (updates.length) await Submission.bulkWrite(updates);
  return NextResponse.json({ count: entries.length }, { status: 201 });
}
