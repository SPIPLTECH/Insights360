import Submission from "@/models/Submission";
import { writeIndex4Marks } from "@/lib/googleSheetsWrite";

/** Fields that make an exam_compliance record "empty" (ALC has no allotted + conducted exam event). */
export const EXAM_EMPTY_FIELDS = {
  cctvObservation: "",
  observationMarks: 0,
  examGrid: [],
  examEligibleCount: 0,
  examEvents: [],
  cctvSubmitted: false,
  cctvSubmittedCount: 0,
  cctvPart1Marks: 0,
  calculatedMarks: 0,
};

export const hasCctvSubmitted = (r: any) =>
  (Array.isArray(r?.examGrid) && r.examGrid.some((g: any) => g?.submitted)) || (r?.cctvSubmittedCount ?? 0) > 0 || (r?.examEvents?.length ?? 0) > 0;

/**
 * Resets the General Observation of an ALC and updates the Google Sheet for records MRCU already reviewed.
 *  - "not_allotted": no allotted + conducted exam event -> everything cleared, sheet "NA" / 0.
 *  - "no_cctv":      events allotted but no CCTV submitted -> only observation + its marks cleared, sheet "No" / part-1 marks (0).
 * With dryRun=true nothing is written.
 */
export async function resetExamForAlc(alcCode: string, opts: { kind?: "not_allotted" | "no_cctv"; dryRun?: boolean; writeSheet?: boolean } = {}) {
  const kind = opts.kind ?? "not_allotted";
  const docs: any[] = await Submission.find({ alcCode, parameterType: "exam_compliance" }).sort({ createdAt: -1 });
  const dirty = docs.filter((d) =>
    kind === "not_allotted"
      ? d.cctvObservation || (d.observationMarks ?? 0) > 0 || (d.calculatedMarks ?? 0) > 0 || (d.examGrid?.length ?? 0) > 0
      : d.cctvObservation || (d.observationMarks ?? 0) > 0
  );
  const latest = docs[0];
  const needsSheet = !!latest && latest.status !== "pending" && (dirty.length > 0 || latest.sheetSynced === false);
  const out = { alcCode, records: dirty.length, sheet: "skipped" as "skipped" | "written" | "failed" | "dry-run", error: "" };
  if (opts.dryRun) {
    if (needsSheet && opts.writeSheet !== false) out.sheet = "dry-run";
    return out;
  }
  for (const d of dirty) {
    if (kind === "not_allotted") d.set(EXAM_EMPTY_FIELDS);
    else d.set({ cctvObservation: "", observationMarks: 0, calculatedMarks: d.cctvPart1Marks ?? 0 });
    await d.save();
  }
  if (needsSheet && opts.writeSheet !== false) {
    try {
      await writeIndex4Marks({
        alcCode,
        parameterType: "exam_compliance",
        value: kind === "not_allotted" ? "NA" : "No",
        points: kind === "not_allotted" ? 0 : latest.cctvPart1Marks ?? 0,
      });
      latest.sheetSynced = true;
      latest.sheetError = null;
      await latest.save();
      out.sheet = "written";
    } catch (e: any) {
      out.sheet = "failed";
      out.error = e?.message ?? "sheet write failed";
      latest.sheetSynced = false;
      latest.sheetError = out.error;
      await latest.save();
    }
  }
  return out;
}
