import { SheetView, DisplayColumn, DisplayRow } from "./sheetView";

/**
 * Recommendation engine — built purely on top of the already-computed
 * SheetView (same columns/values shown in the tables, nothing re-fetched
 * or invented). For every ALC we compare it against the current Rank-1
 * ALC (highest "Total Points(N)" in that view) and describe, in plain
 * language, how many more points are needed to reach the top.
 *
 * Index-1 (Business Growth) addition: since Index-1's three parameters
 * (MS-CIT / KLiC / CCTP) are a direct, publicly-defined function of
 * Admissions — Points = (Admissions ÷ Target) × Max Points, with
 * separate Urban/Rural targets per the Race to Recognition framework —
 * a Points gap in Index-1 can be safely converted back into an
 * approximate Admissions gap. We do NOT do this for Index-2/3/4: those
 * are participation/compliance/learning-journey metrics, not a fixed
 * admissions formula, so inventing an "admissions needed" number for
 * them would be a guess, not a fact. Their messages are unchanged.
 *
 * Minimum-eligibility addition: every index has its own minimum points
 * floor to be considered "cleared" for that index (per the Race to
 * Recognition framework's Contents-at-a-Glance table):
 *   Index 1 — Business Growth        → min 88  / 350
 *   Index 2 — Ecosystem Participation → min 50  / 200
 *   Index 3 — Learning Excellence     → min 30  / 200
 *   Index 4 — Professional Excellence → min 25  / 100
 * When an ALC's current score for an index is BELOW that index's
 * minimum, the recommendation tells the ALC, in one sentence, exactly
 * how many Points it needs overall to clear the index, and how to get
 * there: the gap is split across every parameter the ALC still has room
 * in, IN PROPORTION to how far behind each one is, then converted to
 * Admissions for Index-1's parameters (MS-CIT/KLiC/CCTP) or left as
 * Points for every other index. Once the ALC's score meets or exceeds
 * that index's minimum, the message simply says "Index N cleared".
 */

/** One line of live counts, e.g. label "MSCIT", text "Admissions 180 / 425 (42%) · Points 85 / 200". */
export interface DetailLine {
  label: string;
  text: string;
}

/** A group of DetailLines (e.g. "Index 1 · Business Growth — 300 / 350"). */
export interface DetailSection {
  title: string;
  defaultOpen: boolean;
  /** e.g. "Achieved" or "Need 110 to complete" (score vs. the index's max points). */
  status?: string;
  lines: DetailLine[];
}

export interface RecommendationRow {
  alcCode: string;
  alcName: string;
  district: string;
  area: string;
  message: string;
  /** Live counts (admissions, targets achieved, points...) read from the sheet views. */
  details: DetailSection[];
}

export interface IndexViews {
  index1?: SheetView;
  index2?: SheetView;
  index3?: SheetView;
  index4?: SheetView;
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

// ---------------------------------------------------------------------
// Minimum points required to CLEAR each index (Race to Recognition
// framework, Contents-at-a-Glance table).
// ---------------------------------------------------------------------
const INDEX_MIN_POINTS: Record<keyof IndexViews, number> = {
  index1: 88,
  index2: 50,
  index3: 30,
  index4: 25,
};

// ---------------------------------------------------------------------
// Index-1 Admissions targets, straight from the Race to Recognition
// framework (Business Growth Index · 350 Points). Used ONLY to convert
// an Index-1 Points gap into an approximate Admissions gap — the Points
// themselves (and every other index's numbers) are never touched.
// ---------------------------------------------------------------------
const INDEX1_ADMISSION_TARGETS: Record<"urban" | "rural", Record<"mscit" | "klic" | "cctp", number>> = {
  urban: { mscit: 425, klic: 250, cctp: 150 },
  rural: { mscit: 250, klic: 125, cctp: 75 },
};

// Max points of each Index-1 parameter (framework: 200 + 100 + 50 = 350).
// The sheet's "Points" columns don't carry a cap in their header, so these
// are needed to convert a Points gap into an Admissions gap.
const INDEX1_MAX_POINTS: Record<"mscit" | "klic" | "cctp", number> = {
  mscit: 200,
  klic: 100,
  cctp: 50,
};

function normalizeParamKey(label: string): "mscit" | "klic" | "cctp" | null {
  const clean = label.toLowerCase().replace(/[\s\-_.]/g, "");
  if (clean.includes("mscit")) return "mscit";
  if (clean.includes("klic")) return "klic";
  if (clean.includes("cctp")) return "cctp";
  return null;
}

function normalizeArea(area: string): "urban" | "rural" {
  return /rural/i.test(area) ? "rural" : "urban";
}

/**
 * If this Index-1 parameter column's label matches MS-CIT/KLiC/CCTP,
 * converts a Points gap into an approximate Admissions gap using that
 * parameter's Urban/Rural target and this column's own Max Points. Returns
 * null when the column isn't a recognisable Index-1 admissions parameter
 * (e.g. this is actually Index 2/3/4) — callers fall back to the
 * points-only message in that case.
 */
function admissionsGapFor(col: DisplayColumn, area: string, pointsGap: number): number | null {
  if (pointsGap <= 0) return null;
  const paramKey = normalizeParamKey(col.groupPath[col.groupPath.length - 1] ?? col.field);
  if (!paramKey) return null;
  const maxPoints = INDEX1_MAX_POINTS[paramKey];
  if (!maxPoints || maxPoints <= 0) return null;
  const target = INDEX1_ADMISSION_TARGETS[normalizeArea(area)][paramKey];
  if (!target) return null;
  const admissionsGap = Math.ceil((pointsGap / maxPoints) * target);
  return admissionsGap > 0 ? admissionsGap : null;
}

// ---------------------------------------------------------------------
// Live counts ("details") — pure display of what is already in the sheet
// views (admissions, target achieved, completed?, attendance %, points...).
// Nothing is re-fetched; refreshes automatically with every dashboard poll.
// ---------------------------------------------------------------------

function fmt(v: string | undefined): string {
  const t = (v ?? "").toString().trim();
  if (!t) return "—";
  if (!isNaN(Number(t)) && t.includes(".")) return String(Number(Number(t).toFixed(2)));
  return t;
}

/**
 * Builds one DetailLine per parameter group of a sheet view (e.g. MSCIT /
 * KLiC / CCTP for Index-1, MoM / AI Masterclass / ... for Index-2).
 * Index-1 (has an "Admissions" column) additionally shows Admissions vs
 * Target (by Urban/Rural), % achieved and admissions remaining.
 */
function buildDetailLines(view: SheetView, row: DisplayRow, area: string): DetailLine[] {
  const groups = new Map<string, { label: string; cols: { c: DisplayColumn; i: number }[] }>();
  view.columns.forEach((c, i) => {
    if (c.groupPath.length === 0 || c.isTotal || c.isBonus || /eligible/i.test(c.field)) return;
    const key = c.groupPath.join(" | ");
    if (!groups.has(key)) groups.set(key, { label: c.groupPath.join(" › "), cols: [] });
    groups.get(key)!.cols.push({ c, i });
  });

  const lines: DetailLine[] = [];
  groups.forEach((g) => {
    const parts: string[] = [];
    const paramKey = normalizeParamKey(g.cols[0].c.groupPath[g.cols[0].c.groupPath.length - 1] ?? "");
    const admCol = g.cols.find(({ c }) => /^admissions$/i.test(c.field));
    const pointsCol = g.cols.find(({ c }) => /^points$/i.test(c.field));

    if (admCol && paramKey) {
      const adm = num(row.cells[admCol.i]);
      const target = INDEX1_ADMISSION_TARGETS[normalizeArea(area)][paramKey];
      const pct = target > 0 ? Math.round((adm / target) * 100) : 0;
      parts.push(`Admissions ${fmt(row.cells[admCol.i])} / ${target} (${pct}%)`);
      if (adm >= target) {
        parts.push(adm > target ? `Target achieved (+${adm - target} beyond)` : "Target achieved");
      } else {
        parts.push(`${target - adm} more to reach target`);
      }
      if (pointsCol) parts.push(`Points ${fmt(row.cells[pointsCol.i])} / ${INDEX1_MAX_POINTS[paramKey]}`);
    } else {
      g.cols.forEach(({ c, i }) => {
        if (pointsCol && c === pointsCol.c) return;
        parts.push(`${c.field}: ${fmt(row.cells[i])}`);
      });
      if (pointsCol) parts.push(`Points: ${fmt(row.cells[pointsCol.i])}`);
    }
    lines.push({ label: g.label, text: parts.join(" · ") });
  });
  return lines;
}

const INDEX_SECTION_TITLES: Record<keyof IndexViews, string> = {
  index1: "Index 1 · Business Growth",
  index2: "Index 2 · Ecosystem Participation",
  index3: "Index 3 · Learning Excellence",
  index4: "Index 4 · Professional Excellence",
};

function sectionFor(key: keyof IndexViews, view: SheetView, alcCode: string, area: string): DetailSection | null {
  const row = view.rows.find((r) => r.alcCode === alcCode);
  if (!row) return null;
  const totalIdx = findGrandTotalColIndex(view.columns);
  const totalText =
    totalIdx >= 0 ? ` — ${fmt(row.cells[totalIdx])} / ${view.columns[totalIdx].cap ?? ""}` : "";
  let status: string | undefined;
  if (totalIdx >= 0) {
    const cap = view.columns[totalIdx].cap ?? 0;
    const score = num(row.cells[totalIdx]);
    const minPoints = INDEX_MIN_POINTS[key];
    if (score < minPoints) {
      // Below the index's own eligibility floor — flag it distinctly from
      // "just short of the max", since clearing the minimum comes first.
      status = `Below Minimum (${score} / ${minPoints} required)`;
    } else if (cap > 0) {
      status = score >= cap ? "Achieved" : `Need ${Math.round((cap - score) * 100) / 100} to complete`;
    }
  }
  return {
    status,
    title: `${INDEX_SECTION_TITLES[key]}${totalText}`,
    defaultOpen: key === "index1",
    lines: buildDetailLines(view, row, area),
  };
}

/**
 * Home Dashboard → "Overall Recommendation" tab.
 * Message example: "You need 340 Points to come first."
 * Plus (optional) per-index live counts when the Index 1-4 views are passed.
 */
export function buildOverallRecommendations(view: SheetView, indexViews: IndexViews = {}): RecommendationRow[] {
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
    const myArea = areaIdx >= 0 ? row.cells[areaIdx] : "";
    const details: DetailSection[] = [];
    (["index1", "index2", "index3", "index4"] as (keyof IndexViews)[]).forEach((key) => {
      const v = indexViews[key];
      if (!v) return;
      const sec = sectionFor(key, v, row.alcCode, myArea);
      if (sec) details.push(sec);
    });
    return {
      alcCode: row.alcCode,
      alcName: nameIdx >= 0 ? row.cells[nameIdx] : "",
      district: districtIdx >= 0 ? row.cells[districtIdx] : "",
      area: myArea,
      message,
      details,
    };
  });
}

// ---------------------------------------------------------------------
// Max points of every scoring parameter, straight from the Race to
// Recognition framework (same numbers as the framework tables on the
// home page). Used so "Achieved" means the parameter's FULL points are
// earned, and "Need X" is the remaining points to the max.
// ---------------------------------------------------------------------
const PARAM_MAX_POINTS: Record<string, number> = {
  // Index 1 (350)
  mscit: 200, klic: 100, cctp: 50,
  // Index 2 (200)
  mom: 50, "ai masterclass": 60, "ssc / hsc": 60, "odot 1": 15, "odot 2": 15,
  // Index 4 (100) — each parameter is out of 25
  "meeting attendance": 25,
  "examination compliance cctv": 25,
  "social media presence": 25,
  "month wise enrolment consistency": 25,
};

function maxPointsFor(col: DisplayColumn): number | null {
  const path = col.groupPath;
  // Index 3: [MSCIT | KLiC, <parameter>] — every parameter is out of 20.
  if (path.length === 2 && /^(mscit|klic)$/i.test(path[0])) return 20;
  const key = (path[path.length - 1] ?? "").toLowerCase().replace(/[()]/g, "").replace(/\s+/g, " ").trim();
  return PARAM_MAX_POINTS[key] ?? null;
}

/**
 * Figures out which index a view belongs to (from its own columns, not an
 * external label) so we know which minimum-eligibility floor applies:
 *   - has an "Admissions" column                → Index 1 (min 88)
 *   - any column has a 2-level groupPath         → Index 3 (min 30)
 *   - grand-total cap is 100                     → Index 4 (min 25)
 *   - otherwise (grand-total cap is 200)         → Index 2 (min 50)
 */
function minPointsForView(columns: DisplayColumn[], totalCap: number, hasAdmissions: boolean): number {
  if (hasAdmissions) return INDEX_MIN_POINTS.index1;
  if (columns.some((c) => c.groupPath.length === 2)) return INDEX_MIN_POINTS.index3;
  if (totalCap === 100) return INDEX_MIN_POINTS.index4;
  return INDEX_MIN_POINTS.index2;
}

/** Same detection as minPointsForView, just returning the display name. */
function indexLabelForView(columns: DisplayColumn[], totalCap: number, hasAdmissions: boolean): string {
  if (hasAdmissions) return "Index 1";
  if (columns.some((c) => c.groupPath.length === 2)) return "Index 3";
  if (totalCap === 100) return "Index 4";
  return "Index 2";
}

/**
 * Index-1 / Index-2 / Index-3 / Index-4 → "Index N Recommendations" tab.
 *
 * Below-minimum case: if the ALC's current total for this index is BELOW
 * the index's own minimum-to-clear floor (88 / 50 / 30 / 25), the message
 * is one sentence: the total Points needed to clear the index, followed
 * by a proportional, per-parameter breakdown of how to get there —
 * Admissions for Index-1's MS-CIT/KLiC/CCTP, Points for every other
 * index's parameters.
 *
 * Above-minimum case: the index's minimum is already cleared, so the
 * message is simply "Index N cleared".
 *
 * Message examples:
 * Below minimum, Index-1:
 *   "You need 27.6 Points to clear Index 1, Put 32 Admissions in MSCIT,
 *   21 Admissions in KLiC and 14 Admissions in CCTP to clear Index 1."
 * Below minimum, Index-2:
 *   "You need 18 Points to clear Index 2, Put 10 Points in MoM and
 *   8 Points in AI Masterclass to clear Index 2."
 * Above minimum:
 *   "Index 1 cleared"
 */
export function buildIndexRecommendations(view: SheetView): RecommendationRow[] {
  const { columns, rows } = view;
  const nameIdx = findAlcNameColIndex(columns);
  const districtIdx = findDistrictColIndex(columns);
  const areaIdx = findAreaColIndex(columns);
  const totalIdx = findGrandTotalColIndex(columns);
  if (totalIdx < 0 || rows.length === 0) return [];

  // Admissions-based conversion only makes sense on Index-1 (has an "Admissions" column).
  const hasAdmissions = columns.some((c) => /^admissions$/i.test(c.field));
  const totalCap = columns[totalIdx].cap ?? 0;
  const minPoints = minPointsForView(columns, totalCap, hasAdmissions);
  const indexLabel = indexLabelForView(columns, totalCap, hasAdmissions);

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
    const myArea = areaIdx >= 0 ? row.cells[areaIdx] : "";

    // Index tabs: sirf message, koi extra details section nahi.
    const details: DetailSection[] = [];

    // Per-parameter gap vs this parameter's own full points (fallback:
    // Rank-1 ALC's points, if the full max isn't known for that column).
    const paramGaps = paramCols.map(({ c, i: colIdx }) => {
      const mine = num(row.cells[colIdx]);
      const full = maxPointsFor(c) ?? num(topRow.cells[colIdx]);
      const gap = Math.round((full - mine) * 100) / 100;
      return { c, gap };
    });

    let message: string;

    if (myTotal < minPoints) {
      // BELOW MINIMUM ELIGIBILITY: ignore Rank-1 / full-max comparisons —
      // tell the ALC, in one sentence, exactly how many Points it needs
      // to clear this index's own floor, and how to get there: the
      // overall Points gap is split across every parameter the ALC still
      // has room in, IN PROPORTION to how far behind each one is (so no
      // single parameter is asked to carry more than its own remaining
      // gap), then converted to Admissions for Index-1's parameters
      // (MS-CIT/KLiC/CCTP), or left as Points for every other index.
      const needed = Math.round((minPoints - myTotal) * 100) / 100;
      const behind = paramGaps.filter((g) => g.gap > 0);
      const totalGap = behind.reduce((sum, g) => sum + g.gap, 0);

      const parts = behind.map(({ c, gap }) => {
        const share = totalGap > 0 ? Math.round(((needed * gap) / totalGap) * 100) / 100 : 0;
        const label = paramLabel(c);
        if (hasAdmissions) {
          const admissions = admissionsGapFor(c, myArea, share) ?? 0;
          return `${admissions} Admissions in ${label}`;
        }
        return `${share} Points in ${label}`;
      });

      const joined =
        parts.length === 0
          ? ""
          : parts.length === 1
          ? parts[0]
          : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;

      message =
        parts.length > 0
          ? `You need ${needed} Points to clear ${indexLabel}, Put ${joined} to clear ${indexLabel}.`
          : `You need ${needed} Points to clear ${indexLabel}.`;
    } else {
      // Already cleared this index's minimum — straight to the point.
      message = `${indexLabel} cleared`;
    }

    return {
      alcCode: row.alcCode,
      alcName: nameIdx >= 0 ? row.cells[nameIdx] : "",
      district: districtIdx >= 0 ? row.cells[districtIdx] : "",
      area: myArea,
      message,
      details,
    };
  });
}