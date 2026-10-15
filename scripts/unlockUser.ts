/** Re-enables a locked account:  npx tsx scripts/unlockUser.ts dcu_nagpur@mkcl.org */
import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import User from "../models/User";

async function main() {
  const username = (process.argv[2] || "").toLowerCase().trim();
  if (!username) throw new Error("Usage: npx tsx scripts/unlockUser.ts <username>");
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "insights360" });
  const r = await User.updateOne({ username }, { $set: { disabled: false, failedAttempts: 0 } });
  console.log(r.matchedCount ? `✔ ${username} unlocked` : `! ${username} not found`);
  await mongoose.disconnect();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
