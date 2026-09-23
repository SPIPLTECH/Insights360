import { ParsedSheet, cell, num, isYes, computeSectionTotal } from "./dataParser";

export interface AlcRecord {
  alcCode: string;
  alcName: string;
  district: string;
  area: string;
  totalPoints: number;
  maxPoints: number;
  bonusPoints: number;
  eligibleSections: number;
  totalSections: number;
  eligible: boolean; // true if eligible in at least one section
  fullyEligible: boolean; // true if eligible in every section
}

export interface IndexStats {
  label: string;
  records: AlcRecord[];
  totalAlcs: number;
  maxPoints: number;
  avgPoints: number;
  avgPercent: number;
  eligibleCount: number;
  eligiblePercent: number;
  districtBreakdown: { district: string; count: number; avgPoints: number }[];
  topPerformers: AlcRecord[];
}

function buildRecords(sheet: ParsedSheet, label: string): AlcRecord[] {
  const { rows, coreCols, totalPointsCols, bonusPointsCols, eligibleCols } = sheet;
  return rows.map((row) => {
    // Every value below is read directly from its sheet cell — the sheet's
    // own formulas already computed it. We only add up the sheet's own
    // "Total Points(N)" / "Bonus Points" cells when a template has more
    // than one such column (e.g. Index-3's MSCIT + KLiC sections); we
    // never derive a total from the underlying Points/Eligible cells.
    const totalPoints = totalPointsCols.reduce((sum, t) => sum + computeSectionTotal(sheet, row, t.colIndex), 0);
    const maxPoints = totalPointsCols.reduce((sum, t) => sum + (t.cap ?? 0), 0);
    const bonusPoints = bonusPointsCols.reduce((sum, b) => sum + num(cell(row, b.colIndex)), 0);
    const eligFlags = eligibleCols.map((e) => isYes(cell(row, e.colIndex)));
    const eligibleSections = eligFlags.filter(Boolean).length;
    const totalSections = eligibleCols.length;

    return {
      alcCode: cell(row, coreCols.alcCode),
      alcName: cell(row, coreCols.alcName),
      district: cell(row, coreCols.district),
      area: cell(row, coreCols.area),
      totalPoints,
      maxPoints,
      bonusPoints,
      eligibleSections,
      totalSections,
      eligible: totalSections > 0 ? eligibleSections > 0 : totalPoints > 0,
      fullyEligible: totalSections > 0 ? eligibleSections === totalSections : totalPoints >= maxPoints,
    } satisfies AlcRecord;
  });
}

function buildStats(records: AlcRecord[], label: string): IndexStats {
  const totalAlcs = records.length;
  const maxPoints = records[0]?.maxPoints ?? 0;
  const totalScore = records.reduce((s, r) => s + r.totalPoints, 0);
  const avgPoints = totalAlcs ? totalScore / totalAlcs : 0;
  const avgPercent = maxPoints ? (avgPoints / maxPoints) * 100 : 0;
  const eligibleCount = records.filter((r) => r.eligible).length;
  const eligiblePercent = totalAlcs ? (eligibleCount / totalAlcs) * 100 : 0;

  const byDistrict = new Map<string, AlcRecord[]>();
  for (const r of records) {
    const key = r.district || "Unspecified";
    if (!byDistrict.has(key)) byDistrict.set(key, []);
    byDistrict.get(key)!.push(r);
  }
  const districtBreakdown = Array.from(byDistrict.entries())
    .map(([district, recs]) => ({
      district,
      count: recs.length,
      avgPoints: recs.reduce((s, r) => s + r.totalPoints, 0) / recs.length,
    }))
    .sort((a, b) => b.count - a.count);

  const topPerformers = [...records].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 10);

  return {
    label,
    records,
    totalAlcs,
    maxPoints,
    avgPoints: round(avgPoints),
    avgPercent: round(avgPercent),
    eligibleCount,
    eligiblePercent: round(eligiblePercent),
    districtBreakdown,
    topPerformers,
  };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

export function calculateIndex1Stats(sheet: ParsedSheet): IndexStats {
  return buildStats(buildRecords(sheet, "Business Growth"), "Business Growth");
}
export function calculateIndex2Stats(sheet: ParsedSheet): IndexStats {
  return buildStats(buildRecords(sheet, "Ecosystem Participation"), "Ecosystem Participation");
}
export function calculateIndex3Stats(sheet: ParsedSheet): IndexStats {
  return buildStats(buildRecords(sheet, "Learning Excellence"), "Learning Excellence");
}
export function calculateIndex4Stats(sheet: ParsedSheet): IndexStats {
  return buildStats(buildRecords(sheet, "Professional Excellence"), "Professional Excellence");
}

// Note: the combined Home Dashboard (Total Points / Bonus Points, ranked
// across all ALCs) is NOT built here. It comes straight from the sheet's
// own "Home Dashboard" tab (see sheetConfigs.ts → HOME_CONFIG and
// dataService.ts), which already has its own formulas — the app just
// displays that tab's cells as-is, with zero recalculation.

// ---------------------------------------------------------------------
// Award Level (Platinum / Gold / Silver / Bronze) — the ONLY calculated
// exception on the Home tab.
//
// Rule: an ALC is only eligible for ANY level if it clears the min-points
// bar in EVERY one of the 4 indexes (Index1 >= 88, Index2 >= 50,
// Index3 >= 30, Index4 >= 25). If even one index is below its minimum,
// the ALC is "Not Eligible" — no matter how high its total points are.
//
// Only once ALL 4 minimums are cleared does the combined total (out of
// 850, i.e. the sum of the 4 index totals) get compared against the
// award bands below to pick the level.
// ---------------------------------------------------------------------

export const INDEX_MIN_POINTS = {
  index1: 88,
  index2: 50,
  index3: 30,
  index4: 25,
} as const;

export type AwardLevel = "Platinum" | "Gold" | "Silver" | "Bronze" | "Not Eligible";

function levelForTotal(total: number): AwardLevel {
  if (total >= 765) return "Platinum";
  if (total >= 637) return "Gold";
  if (total >= 510) return "Silver";
  if (total >= 425) return "Bronze";
  return "Not Eligible";
}

/**
 * Computes the Award Level for every ALC by matching records (by
 * alcCode) across the 4 index stats. Returns a map of alcCode -> level,
 * to be used ONLY to override the Home Dashboard's "Level" column cell
 * (which otherwise comes as-is from the sheet). Nothing else about the
 * 4 index pages or their own totals is touched.
 */
export function computeAwardLevels(
  index1: IndexStats,
  index2: IndexStats,
  index3: IndexStats,
  index4: IndexStats
): Map<string, AwardLevel> {
  const byCode1 = new Map(index1.records.map((r) => [r.alcCode, r]));
  const byCode2 = new Map(index2.records.map((r) => [r.alcCode, r]));
  const byCode3 = new Map(index3.records.map((r) => [r.alcCode, r]));
  const byCode4 = new Map(index4.records.map((r) => [r.alcCode, r]));

  const allCodes = new Set<string>([
    ...byCode1.keys(),
    ...byCode2.keys(),
    ...byCode3.keys(),
    ...byCode4.keys(),
  ]);

  const result = new Map<string, AwardLevel>();

  for (const code of allCodes) {
    const p1 = byCode1.get(code)?.totalPoints ?? 0;
    const p2 = byCode2.get(code)?.totalPoints ?? 0;
    const p3 = byCode3.get(code)?.totalPoints ?? 0;
    const p4 = byCode4.get(code)?.totalPoints ?? 0;

    const meetsMin =
      p1 >= INDEX_MIN_POINTS.index1 &&
      p2 >= INDEX_MIN_POINTS.index2 &&
      p3 >= INDEX_MIN_POINTS.index3 &&
      p4 >= INDEX_MIN_POINTS.index4;

    if (!meetsMin) {
      result.set(code, "Not Eligible");
      continue;
    }

    const total = p1 + p2 + p3 + p4;
    result.set(code, levelForTotal(total));
  }

  return result;
}