import { NextResponse } from "next/server";
import { getCurrentUser, homePathForRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Lets the public navbar know whether someone is signed in (and where their dashboard is). */
export async function GET() {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: { displayName: user.displayName, role: user.role, dashboardPath: homePathForRole(user.role) },
  });
}
