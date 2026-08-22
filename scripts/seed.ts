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
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

// district = exact value as it appears in the "District" column of the
// Google Sheet (used to filter each DCU's ALC list) — kept as "Gondia" to
// match the sheet, even though the login username is "dcu_gondiya".
const ACCOUNTS: { username: string; password: string; role: "dcu" | "mrcu"; district: string | null; displayName: string }[] = [
  { username: "mrcu_admin", password: "mrcu@12345wxyz&*#pqr", role: "mrcu", district: null, displayName: "MRCU Admin" },
  { username: "dcu_nagpur", password: "ngp@rty$%^ko6932pqrs", role: "dcu", district: "Nagpur", displayName: "Nagpur DCU" },
  { username: "dcu_bhandara", password: "bh%$#dh953bk12", role: "dcu", district: "Bhandara", displayName: "Bhandara DCU" },
  { username: "dcu_wardha", password: "wardh%^&*ghsj@0986", role: "dcu", district: "Wardha", displayName: "Wardha DCU" },
  { username: "dcu_gadchiroli", password: "gadc^&%$#987pgk", role: "dcu", district: "Gadchiroli", displayName: "Gadchiroli DCU" },
  { username: "dcu_gondiya", password: "gon76$%#tyk#@l", role: "dcu", district: "Gondia", displayName: "Gondiya DCU" },
  { username: "dcu_chandrapur", password: "tgh$#kj&*87635", role: "dcu", district: "Chandrapur", displayName: "Chandrapur DCU" },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "insights360" });
  console.log("Connected to MongoDB.");

  for (const acc of ACCOUNTS) {
    const passwordHash = await bcrypt.hash(acc.password, 10);
    await User.findOneAndUpdate(
      { username: acc.username },
      { username: acc.username, passwordHash, role: acc.role, district: acc.district, displayName: acc.displayName },
      { upsert: true, new: true }
    );
    console.log(`✔ ${acc.role.toUpperCase()} ready — username: ${acc.username}`);
  }

  await mongoose.disconnect();
  console.log("Done. All 7 accounts (1 MRCU + 6 DCU) are seeded.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});