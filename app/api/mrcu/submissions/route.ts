import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getCurrentUser();
  if (!user || user.role !== "mrcu") {
    return NextResponse.json({ error: "Not authenticated as MRCU." }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // pending | accepted | rejected | (omit = all)
  const district = searchParams.get("district");

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (district) filter.district = district;

  const submissions = await Submission.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ submissions });
}
