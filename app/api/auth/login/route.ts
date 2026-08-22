import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ username: String(username).toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const token = signToken({
      sub: user._id.toString(),
      role: user.role,
      district: user.district,
      username: user.username,
      displayName: user.displayName,
    });

    const res = NextResponse.json({
      role: user.role,
      district: user.district,
      displayName: user.displayName,
    });
    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12h, matches JWT expiry
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Login failed." }, { status: 500 });
  }
}
