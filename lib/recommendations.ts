import { SheetView, DisplayColumn, DisplayRow } from "./sheetView";

/**
 * Recommendation engine — built purely on top of the already-computed
 * SheetView (same columns/values shown in the tables, nothing re-fetched
 * or invented). For every ALC we compare it against the current Rank-1
 * ALC (highest "Total Points(N)" in that view) and describe, in plain
 * language, how many more points are needed to reach the top.
 */

export interface RecommendationRow {
  alcCode: string;
  alcName: string;
  district: string;
  area: string;
  message: string;
}

function num(v: string): number {
  if (!v) return 0;
  const n = Number(String(v).replace(/[,%\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function findAlcNameColIndex(columns: DisplayColumn[]): number {
  return columns.findIndex((c) => /^alc center name$/i.test(c.field));
}

function findDistrictColIndex(columns: DisplayColumn[]): number {
  return columns.findIndex((c) => /^district$/i.test(c.field));
}

function findAreaColIndex(columns: DisplayColumn[]): number {
  return columns.findIndex((c) => /^area$/i.test(c.field));
}

function findGrandTotalColIndex(columns: DisplayColumn[]): number {
  // Same rule used everywhere else in the app: the grand total column is
  // the one with isTotal=true and no group (groupPath.length === 0).
  return columns.findIndex((c) => c.isTotal && c.groupPath.length === 0);
}

/**
 * Home Dashboard → "Overall Recommendation" tab.
 * Message example: "You need 340 Points to come first."
 */
export function buildOverallRecommendations(view: SheetView): RecommendationRow[] {
  const { columns, rows } = view;
  const nameIdx = findAlcNameColIndex(columns);
  const districtIdx = findDistrictColIndex(columns);
  const areaIdx = findAreaColIndex(columns);
  const totalIdx = findGrandTotalColIndex(columns);
  if (totalIdx < 0 || rows.length === 0) return [];

  const totals = rows.map((r) => num(r.cells[totalIdx]));
  const topTotal = Math.max(...totals);

  return rows.map((row, i) => {
    const myTotal = totals[i];
    const gap = Math.round((topTotal - myTotal) * 100) / 100;
    const message =
      gap <= 0
        ? `You are currently Rank 1 with ${myTotal} Points!`
        : `You need ${gap} Points to come first.`;
    return {
      alcCode: row.alcCode,
      alcName: nameIdx >= 0 ? row.cells[nameIdx] : "",
      district: districtIdx >= 0 ? row.cells[districtIdx] : "",
      area: areaIdx >= 0 ? row.cells[areaIdx] : "",
      message,
    };
  });
}

/**
 * Index-1 / Index-2 / Index-3 / Index-4 → "Index N Recommendations" tab.
 * Compares every parameter's own "Points" column (whatever parameters
 * that particular index has) against the current Rank-1 ALC's points in
 * that same parameter, and lists only the parameters where the ALC is
 * behind.
 *
 * Message example:
 * "You need 50 Points in MSCIT, 30 Points in KLiC and 10 Points in CCTP
 * out of 350."
 */
export function buildIndexRecommendations(view: SheetView): RecommendationRow[] {
  const { columns, rows } = view;
  const nameIdx = findAlcNameColIndex(columns);
  const districtIdx = findDistrictColIndex(columns);
  const areaIdx = findAreaColIndex(columns);
  const totalIdx = findGrandTotalColIndex(columns);
  if (totalIdx < 0 || rows.length === 0) return [];

  const cap = columns[totalIdx].cap ?? 0;

  // Every parameter-level "Points" column (not the Bonus Points column,
  // not the grand total) — i.e. one entry per scoring parameter the
  // index actually has (MSCIT/KLiC/CCTP for Index-1, MoM/AI
  // Masterclass/SSC-HSC/ODOT for Index-2, etc).
  const paramCols = columns
    .map((c, i) => ({ c, i }))
    .filter(
      ({ c }) =>
        /^points$/i.test(c.field) && !c.isBonus && !c.isTotal && c.groupPath.length > 0
    );

  const paramLabel = (c: DisplayColumn) => c.groupPath.join(" - ");

  const totals = rows.map((r) => num(r.cells[totalIdx]));
  const topIdx = totals.indexOf(Math.max(...totals));
  const topRow = rows[topIdx];

  return rows.map((row, i) => {
    const myTotal = totals[i];
    const topTotal = totals[topIdx];

    if (myTotal >= topTotal) {
      return {
        alcCode: row.alcCode,
        alcName: nameIdx >= 0 ? row.cells[nameIdx] : "",
        district: districtIdx >= 0 ? row.cells[districtIdx] : "",
        area: areaIdx >= 0 ? row.cells[areaIdx] : "",
        message: `You are currently Rank 1 with ${myTotal} Points out of ${cap}!`,
      };
    }

    const gaps = paramCols
      .map(({ c, i: colIdx }) => {
        const mine = num(row.cells[colIdx]);
        const top = num(topRow.cells[colIdx]);
        const gap = Math.round((top - mine) * 100) / 100;
        return { label: paramLabel(c), gap };
      })
      .filter((g) => g.gap > 0);

    let message: string;
    if (gaps.length === 0) {
      message = `You need ${Math.round((topTotal - myTotal) * 100) / 100} more Points out of ${cap} to come first.`;
    } else {
      const parts = gaps.map((g) => `${g.gap} Points in ${g.label}`);
      const joined =
        parts.length === 1
          ? parts[0]
          : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
      message = `You need ${joined} out of ${cap}.`;
    }

    return {
      alcCode: row.alcCode,
      alcName: nameIdx >= 0 ? row.cells[nameIdx] : "",
      district: districtIdx >= 0 ? row.cells[districtIdx] : "",
      area: areaIdx >= 0 ? row.cells[areaIdx] : "",
      message,
    };
  });
}