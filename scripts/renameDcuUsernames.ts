/**
 * One-time rename: removes the underscore from DCU usernames.
 *   dcu_nagpur@mkcl.org  ->  dcunagpur@mkcl.org   (same for every DCU)
 * Only the username changes — password, district, role and all submissions stay as they are.
 *
 * Run once:   npx tsx scripts/renameDcuUsernames.ts
 * Safe to re-run (already-renamed users are skipped).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import User from "../models/User";
import { usernameError } from "../lib/usernamePolicy";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "insights360" });

  const users = await User.find({ role: "dcu" });
  for (const u of users) {
    const old: string = u.username;
    const m = old.match(/^dcu_(.+)(@mkcl\.org)$/i);
    if (!m) {
      console.log(`- ${old}: nothing to change`);
      continue;
    }
    const next = `dcu${m[1]}${m[2]}`.toLowerCase();
    const bad = usernameError(next);
    if (bad) {
      console.log(`! ${old}: cannot rename to "${next}" — ${bad}`);
      continue;
    }
    if (await User.exists({ username: next })) {
      console.log(`! ${old}: "${next}" already exists, skipped`);
      continue;
    }
    await User.updateOne({ _id: u._id }, { $set: { username: next } });
    console.log(`✔ ${old}  ->  ${next}`);
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
