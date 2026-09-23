import { getHomeRaw, getIndex1Raw, getIndex2Raw, getIndex3Raw, getIndex4Raw, SheetsConfigError, SheetsFetchError } from "./googleSheets";
import { parseTemplateSheet } from "./dataParser";
import { HOME_CONFIG, INDEX1_CONFIG, INDEX2_CONFIG, INDEX3_CONFIG, INDEX4_CONFIG } from "./sheetConfigs";
import { buildSheetView, SheetView } from "./sheetView";
import {
  calculateIndex1Stats,
  calculateIndex2Stats,
  calculateIndex3Stats,
  calculateIndex4Stats,
  computeAwardLevels,
} from "./calculations";

export const REVALIDATE_SECONDS = Number(process.env.REVALIDATE_SECONDS ?? 8);

export interface FullDashboardData {
  fetchedAt: string;
  index1: ReturnType<typeof calculateIndex1Stats>;
  index2: ReturnType<typeof calculateIndex2Stats>;
  index3: ReturnType<typeof calculateIndex3Stats>;
  index4: ReturnType<typeof calculateIndex4Stats>;
  // Exact-format table views, matching the source template's own column
  // layout/labels 1:1 (used to render Home/Index-1..4 pages without
  // inventing any columns, or calculating any values, that aren't
  // already in the template — every cell (including Total Points and
  // Bonus Points) is read straight from its sheet cell.
  //
  // The ONE exception is the Home tab's "Level" cell: it is overridden
  // in code (see below) so that Platinum/Gold/Silver/Bronze can only be
  // assigned when an ALC clears the min-points bar in ALL 4 indexes —
  // a rule the sheet's own per-row formula cannot express reliably
  // across tabs. See computeAwardLevels() in calculations.ts.
  views: {
    home: SheetView;
    index1: SheetView;
    index2: SheetView;
    index3: SheetView;
    index4: SheetView;
  };
}

export interface DataServiceError {
  code: "CONFIG" | "FETCH" | "UNKNOWN";
  message: string;
  source?: string;
}

export async function loadDashboardData(): Promise<
  { ok: true; data: FullDashboardData } | { ok: false; error: DataServiceError }
> {
  try {
    const [rawHome, raw1, raw2, raw3, raw4] = await Promise.all([
      getHomeRaw().catch((e) => rethrowLabeled(e, "Google Sheet 1 / Home Dashboard")),
      getIndex1Raw().catch((e) => rethrowLabeled(e, "Google Sheet 1 / Index-1")),
      getIndex2Raw().catch((e) => rethrowLabeled(e, "Google Sheet 1 / Index-2")),
      getIndex3Raw().catch((e) => rethrowLabeled(e, "Google Sheet 1 / Index-3")),
      getIndex4Raw().catch((e) => rethrowLabeled(e, "Google Sheet / Index-4")),
    ]);

    const parsedHome = parseTemplateSheet(rawHome, HOME_CONFIG);
    const parsed1 = parseTemplateSheet(raw1, INDEX1_CONFIG);
    const parsed2 = parseTemplateSheet(raw2, INDEX2_CONFIG);
    const parsed3 = parseTemplateSheet(raw3, INDEX3_CONFIG);
    const parsed4 = parseTemplateSheet(raw4, INDEX4_CONFIG);

    const index1 = calculateIndex1Stats(parsed1);
    const index2 = calculateIndex2Stats(parsed2);
    const index3 = calculateIndex3Stats(parsed3);
    const index4 = calculateIndex4Stats(parsed4);

    const views = {
      // Home Dashboard: sabse zyada Total Points wala ALC sabse top pe,
      // uske niche usse kam wala, aage bhi wahi order (descending).
      home: buildSheetView(parsedHome, true),
      index1: buildSheetView(parsed1),
      index2: buildSheetView(parsed2),
      index3: buildSheetView(parsed3),
      index4: buildSheetView(parsed4),
    };

    // ---- Level override (Home tab only) --------------------------------
    // Everything else on views.home stays exactly as read from the sheet.
    // Only the "Level" column's cell values are replaced, per-row, with
    // the eligibility-gated result: an ALC only gets Platinum / Gold /
    // Silver / Bronze if it clears the min-points bar in ALL 4 indexes;
    // otherwise it is marked "Not Eligible", regardless of total points.
    const levelColIndex = views.home.columns.findIndex((c) => /^level$/i.test(c.field));
    if (levelColIndex >= 0) {
      const awardLevels = computeAwardLevels(index1, index2, index3, index4);
      for (const row of views.home.rows) {
        const level = awardLevels.get(row.alcCode);
        if (level) {
          row.cells[levelColIndex] = level;
        }
      }
    }
    // ---------------------------------------------------------------------

    return {
      ok: true,
      data: { fetchedAt: new Date().toISOString(), index1, index2, index3, index4, views },
    };
  } catch (err: any) {
    if (err instanceof SheetsConfigError) {
      return { ok: false, error: { code: "CONFIG", message: err.message } };
    }
    if (err instanceof SheetsFetchError) {
      return { ok: false, error: { code: "FETCH", message: err.message } };
    }
    return { ok: false, error: { code: "UNKNOWN", message: err?.message ?? "Unknown error while loading data." } };
  }
}

function rethrowLabeled(err: any, source: string): never {
  if (err instanceof SheetsFetchError || err instanceof SheetsConfigError) {
    err.message = `[${source}] ${err.message}`;
  }
  throw err;
}