/**
 * One-time clean-up of General Observations given WITHOUT exam events / CCTV:
 *   - exam events not allotted      -> observation + marks cleared, sheet "NA" / 0
 *   - events allotted, no CCTV done -> observation + its marks cleared, sheet "No" / 0
 * Every other ALC is left untouched.
 *
 *   Dry run (default, writes nothing):  npx tsx --env-file=.env.local scripts/reset-invalid-observations.ts
 *   Apply:                              npx tsx --env-file=.env.local scripts/reset-invalid-observations.ts --apply
 *   DB only (skip the sheet):           add --no-sheet
 */
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { loadAllotments } from "@/lib/allotments";
import { isEventConducted, ExamEvent } from "@/lib/dcuOptions";
import { resetExamForAlc, hasCctvSubmitted } from "@/lib/examReset";

async function main() {
  const apply = process.argv.includes("--apply");
  const writeSheet = !process.argv.includes("--no-sheet");
  await connectDB();
  const { map } = await loadAllotments();

  const subs: any[] = await Submission.find({ parameterType: "exam_compliance" }).sort({ createdAt: -1 }).lean();
  const latestOf = new Map<string, any>();
  for (const s of subs) if (!latestOf.has(s.alcCode)) latestOf.set(s.alcCode, s); // sorted newest first

  const targets: { alcCode: string; district: string; kind: "not_allotted" | "no_cctv"; reason: string; obs: string }[] = [];
  for (const [alcCode, s] of latestOf) {
    const allotted = map[alcCode] ?? [];
    const eligible = allotted.filter((e) => isEventConducted(e as ExamEvent));
    const obs = subs.filter((x) => x.alcCode === alcCode).map((x) => x.cctvObservation).find(Boolean) ?? "";
    const hasMarks = subs.some((x) => x.alcCode === alcCode && ((x.observationMarks ?? 0) > 0 || (x.calculatedMarks ?? 0) > 0));
    if (eligible.length === 0) {
      if (obs || hasMarks) targets.push({ alcCode, district: s.district, kind: "not_allotted", obs, reason: allotted.length === 0 ? "exam events NOT allotted" : "allotted events not conducted yet" });
    } else if (!hasCctvSubmitted(s) && obs) {
      targets.push({ alcCode, district: s.district, kind: "no_cctv", obs, reason: "events allotted but CCTV NOT submitted" });
    }
  }
  targets.sort((a, b) => a.district.localeCompare(b.district) || a.alcCode.localeCompare(b.alcCode));

  console.log(`${apply ? "APPLY" : "DRY RUN"} - ${targets.length} ALC(s) to reset`);
  for (const t of targets) {
    const r = await resetExamForAlc(t.alcCode, { kind: t.kind, dryRun: !apply, writeSheet });
    console.log(`${t.district} | ${t.alcCode} | ${t.reason} | observation was "${t.obs}" | records=${r.records} | sheet=${r.sheet}${r.error ? " | " + r.error : ""}`);
  }
  if (!apply) console.log("\nNothing changed. Re-run with --apply to reset.");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
