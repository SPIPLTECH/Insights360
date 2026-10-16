import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { loadAllotments } from "@/lib/allotments";
import { getDistrictAlcs } from "@/lib/districtAlcs";
import { normalizeEvent } from "@/lib/dcuOptions";
import ExamAllotment from "@/models/ExamAllotment";

function dcuOnly() {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) return null;
  return user;
}

/** Allotment of this DCU's district. `submitted` = the DCU has saved the allotment at least once. */
export async function GET() {
  const user = dcuOnly();
  if (!user) return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });

  const d = await getDistrictAlcs(user.district!);
  if (!d.ok) return NextResponse.json({ error: d.message }, { status: 502 });

  await connectDB();
  const { map } = await loadAllotments();
  const mine: Record<string, string[]> = {};
  for (const a of d.alcs) if (a.alcCode in map) mine[a.alcCode] = map[a.alcCode];
  return NextResponse.json({ allotments: mine, submitted: Object.keys(mine).length > 0 });
}

/** Body: { entries: [{ alcCode, events: ["Feb","Apr"] }] } — only ALCs of the DCU's own district are accepted. */
export async function PUT(req: NextRequest) {
  const user = dcuOnly();
  if (!user) return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });

  const body = await req.json();
  const entries: any[] = Array.isArray(body.entries) ? body.entries : [];
  if (entries.length === 0) return NextResponse.json({ error: "No rows to save." }, { status: 400 });

  const d = await getDistrictAlcs(user.district!);
  if (!d.ok) return NextResponse.json({ error: d.message }, { status: 502 });
  const mine = new Set(d.alcs.map((a) => a.alcCode));

  const ops = new Map<string, string[]>();
  for (const e of entries) {
    const code = String(e?.alcCode ?? "").trim();
    if (!code || !mine.has(code)) continue;
    const events = Array.from(new Set((Array.isArray(e.events) ? e.events : []).map((x: string) => normalizeEvent(x)).filter(Boolean))) as string[];
    ops.set(code, events);
  }
  if (ops.size === 0) return NextResponse.json({ error: "No ALC of your district found in the rows." }, { status: 400 });

  await connectDB();
  await ExamAllotment.bulkWrite(
    Array.from(ops, ([alcCode, events]) => ({
      updateOne: { filter: { alcCode }, update: { $set: { alcCode, events } }, upsert: true },
    }))
  );
  return NextResponse.json({ count: ops.size });
}
