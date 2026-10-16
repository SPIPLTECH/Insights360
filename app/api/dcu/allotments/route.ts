import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { loadAllotments } from "@/lib/allotments";

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });
  }
  await connectDB();
  const { map, configured } = await loadAllotments();
  return NextResponse.json({ allotments: map, configured });
}
