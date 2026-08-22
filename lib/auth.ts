import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export interface AuthTokenPayload {
  sub: string; // user id
  role: "dcu" | "mrcu";
  district: string | null;
  username: string;
  displayName: string;
}

const COOKIE_NAME = "insights360_token";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET environment variable.");
  return secret;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "12h" });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;

/** Server Components / Route Handlers: read + verify the current user from the cookie. */
export function getCurrentUser(): AuthTokenPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
