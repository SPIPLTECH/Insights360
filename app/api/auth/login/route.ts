import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { usernameError, MAX_FAILED_ATTEMPTS } from "@/lib/usernamePolicy";
import { verifyPassword, signToken, homePathForRole, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    const formatError = usernameError(String(username));
    if (formatError) {
      return NextResponse.json({ error: formatError }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ username: String(username).toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    if (user.disabled) {
      return NextResponse.json({ error: "This account is disabled after too many failed attempts. Please contact the administrator." }, { status: 403 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      const updated = await User.findByIdAndUpdate(user._id, { $inc: { failedAttempts: 1 } }, { new: true });
      const attempts = updated?.failedAttempts ?? 1;
      if (attempts > MAX_FAILED_ATTEMPTS) {
        await User.findByIdAndUpdate(user._id, { $set: { disabled: true } });
        return NextResponse.json({ error: "Too many failed attempts. This account has been disabled. Please contact the administrator." }, { status: 403 });
      }
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    if (user.failedAttempts) {
      await User.findByIdAndUpdate(user._id, { $set: { failedAttempts: 0 } });
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
      redirectTo: homePathForRole(user.role),
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
