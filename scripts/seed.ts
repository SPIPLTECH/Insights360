/**
 * One-time (re-runnable) seed script — creates the 6 district DCU logins
 * and the 1 MRCU login in MongoDB Atlas, with the credentials below.
 *
 * Run with:  npx tsx scripts/seed.ts   (or: npm run seed)
 * (needs "tsx" — already added to devDependencies)
 *
 * Re-running this script is safe — it upserts by username, so it just
 * resets the password/role/district if the user already exists.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { usernameError } from "../lib/usernamePolicy";


// district = exact value as it appears in the "District" column of the
// Google Sheet (used to filter each DCU's ALC list) — kept as "Gondia" to
// match the sheet, even though the login username is "dcugondiya@mkcl.org".
const ACCOUNTS: { username: string; password: string; role: "dcu" | "mrcu" | "admin"; district: string | null; displayName: string }[] = [
  { username: "mrcuve@mkcl.org", password: "mrcu@12345wxyz&*#pqr", role: "mrcu", district: null, displayName: "MRCU Admin" },
  { username: "dcunagpur@mkcl.org", password: "ngp@rty$%^ko6932pqrs", role: "dcu", district: "Nagpur", displayName: "Nagpur DCU" },
  { username: "dcubhandara@mkcl.org", password: "bh%$#dh953bk12", role: "dcu", district: "Bhandara", displayName: "Bhandara DCU" },
  { username: "dcuwardha@mkcl.org", password: "wardh%^&*ghsj@0986", role: "dcu", district: "Wardha", displayName: "Wardha DCU" },
  { username: "dcugadchiroli@mkcl.org", password: "gadc^&%$#987pgk", role: "dcu", district: "Gadchiroli", displayName: "Gadchiroli DCU" },
  { username: "dcugondiya@mkcl.org", password: "gon76$%#tyk#@l", role: "dcu", district: "Gondia", displayName: "Gondiya DCU" },
  { username: "dcuchandrapur@mkcl.org", password: "tgh$#kj&*87635", role: "dcu", district: "Chandrapur", displayName: "Chandrapur DCU" },
];

// Admin login — password comes from .env.local (ADMIN_USERNAME / ADMIN_PASSWORD), not hard-coded here.
if (process.env.ADMIN_PASSWORD) {
  ACCOUNTS.push({
    username: (process.env.ADMIN_USERNAME || "admin@mkcl.org").toLowerCase(),
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
    district: null,
    displayName: "Admin",
  });
} else {
  console.log("ℹ ADMIN_PASSWORD not set in .env.local — skipping admin account.");
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "insights360" });
  console.log("Connected to MongoDB.");

  for (const acc of ACCOUNTS) {
    const bad = usernameError(acc.username);
    if (bad) throw new Error(`Invalid username "${acc.username}": ${bad}`);
    const passwordHash = await bcrypt.hash(acc.password, 10);
    await User.findOneAndUpdate(
      { username: acc.username },
      { username: acc.username, passwordHash, role: acc.role, district: acc.district, displayName: acc.displayName, failedAttempts: 0, disabled: false },
      { upsert: true, new: true }
    );
    console.log(`✔ ${acc.role.toUpperCase()} ready — username: ${acc.username}`);
  }

  await mongoose.disconnect();
  console.log(`Done. ${ACCOUNTS.length} accounts seeded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});