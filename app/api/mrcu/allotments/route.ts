import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCurrentUser, canAccessMrcu } from "@/lib/auth";
import ExamAllotment from "@/models/ExamAllotment";
import { loadAllotments } from "@/lib/allotments";
import { normalizeEvent } from "@/lib/dcuOptions";

export async function GET() {
  const user = getCurrentUser();
  if (!canAccessMrcu(user)) return NextResponse.json({ error: "Not authenticated as MRCU." }, { status: 401 });
  await connectDB();
  const { map, configured } = await loadAllotments();
  return NextResponse.json({ allotments: map, configured });
}

/** Body: { entries: [{ alcCode, events: ["Feb","Apr"] }], replaceAll?: boolean } */
export async function PUT(req: NextRequest) {
  const user = getCurrentUser();
  if (!canAccessMrcu(user)) return NextResponse.json({ error: "Not authenticated as MRCU." }, { status: 401 });

  const body = await req.json();
  const entries: any[] = Array.isArray(body.entries) ? body.entries : [];
  if (entries.length === 0) return NextResponse.json({ error: "No allotment rows found." }, { status: 400 });

  const ops = new Map<string, string[]>();
  for (const e of entries) {
    const code = String(e?.alcCode ?? "").trim();
    if (!code) continue;
    const events = Array.from(new Set((Array.isArray(e.events) ? e.events : []).map((x: string) => normalizeEvent(x)).filter(Boolean))) as string[];
    ops.set(code, events);
  }
  if (ops.size === 0) return NextResponse.json({ error: "No valid ALC codes found." }, { status: 400 });

  await connectDB();
  if (body.replaceAll) await ExamAllotment.deleteMany({});
  await ExamAllotment.bulkWrite(
    Array.from(ops, ([alcCode, events]) => ({
      updateOne: { filter: { alcCode }, update: { $set: { alcCode, events } }, upsert: true },
    }))
  );
  return NextResponse.json({ count: ops.size });
}
