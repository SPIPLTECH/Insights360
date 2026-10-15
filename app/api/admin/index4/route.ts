import { NextResponse } from "next/server";
import { getCurrentUser, canAccessAdmin } from "@/lib/auth";
import { loadIndex4Table } from "@/lib/index4Data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin dashboard: Index 4 data as JSON (no points). */
export async function GET() {
  if (!canAccessAdmin(getCurrentUser())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const r = await loadIndex4Table();
  if (!r.ok) return NextResponse.json({ error: r.message }, { status: r.status });
  return NextResponse.json(r.table);
}
