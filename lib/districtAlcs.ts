import { loadDashboardData } from "@/lib/dataService";
import { sameDistrict } from "@/lib/districts";
import type { SheetView } from "@/lib/sheetView";
import { talukaOf } from "@/lib/alcTalukas";

export type DistrictAlc = { alcCode: string; alcName: string; taluka: string };

const colIndex = (view: SheetView, test: (field: string) => boolean) => view.columns.findIndex((c) => test(c.field));

/** All ALCs of one district (taken from the dashboard sheet). Shared by the ALC list and the allotment routes. */
export async function getDistrictAlcs(
  district: string
): Promise<{ ok: true; alcs: DistrictAlc[]; districtsInSheet: string[] } | { ok: false; message: string }> {
  const result = await loadDashboardData();
  if (!result.ok) return { ok: false, message: result.error.message };

  const { home, index1, index2, index3, index4 } = result.data.views;

  // ALC code -> district, taken from every tab. Some tabs leave the District
  // cell blank for a row, so we use the first non-empty value we can find.
  const districtByCode = new Map<string, string>();
  for (const view of [home, index1, index2, index3, index4]) {
    const codeIdx = colIndex(view, (f) => f === "ALC Code");
    const distIdx = colIndex(view, (f) => /^district$/i.test(f));
    if (codeIdx < 0 || distIdx < 0) continue;
    for (const r of view.rows) {
      const code = (r.cells[codeIdx] ?? "").trim();
      const dist = (r.cells[distIdx] ?? "").trim();
      if (code && dist && !districtByCode.has(code)) districtByCode.set(code, dist);
    }
  }

  const codeIdx = colIndex(home, (f) => f === "ALC Code");
  const nameIdx = colIndex(home, (f) => f === "ALC Center Name");

  const seen = new Set<string>();
  const alcs: DistrictAlc[] = [];
  for (const r of home.rows) {
    const alcCode = (r.cells[codeIdx] ?? "").trim();
    if (!alcCode || seen.has(alcCode)) continue;
    if (sameDistrict(districtByCode.get(alcCode), district)) {
      seen.add(alcCode);
      alcs.push({ alcCode, alcName: (r.cells[nameIdx] ?? "").trim(), taluka: talukaOf(alcCode) });
    }
  }
  return { ok: true, alcs, districtsInSheet: Array.from(new Set(districtByCode.values())).sort() };
}
