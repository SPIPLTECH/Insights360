/**
 * One-time migration: renames existing login usernames to the new format
 * (<name>@mkcl.org). ONLY the username field changes — password hash, role,
 * district, displayName and every submission stay exactly as they are
 * (submissions point to users by id, not by username).
 *
 * Run once, with MONGODB_URI in .env.local:   npx tsx scripts/migrateUsernames.ts
 * Safe to re-run: already-migrated users are skipped.
 *
 *   mrcu_admin     -> mrcuve@mkcl.org
 *   dcu_nagpur     -> dcu_nagpur@mkcl.org   (same for every other dcu_*)
 *   admin          -> admin@mkcl.org        (any other old username gets @mkcl.org added)
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import User from "../models/User";
import { USERNAME_DOMAIN, usernameError } from "../lib/usernamePolicy";

const EXPLICIT: Record<string, string> = { mrcu_admin: "mrcuve@mkcl.org" };

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "insights360" });

  const users = await User.find({});
  for (const u of users) {
    const old: string = u.username;
    if (old.endsWith(USERNAME_DOMAIN)) {
      console.log(`- ${old}: already new format, skipped`);
      continue;
    }
    const next = EXPLICIT[old] ?? `${old}${USERNAME_DOMAIN}`;
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
