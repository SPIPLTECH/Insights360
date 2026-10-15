import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { loadDashboardData } from "@/lib/dataService";
import { sameDistrict } from "@/lib/districts";
import type { SheetView } from "@/lib/sheetView";
import { talukaOf } from "@/lib/alcTalukas";

const colIndex = (view: SheetView, test: (field: string) => boolean) => view.columns.findIndex((c) => test(c.field));

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });
  }

  const result = await loadDashboardData();
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: 502 });
  }

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
  const alcs: { alcCode: string; alcName: string; taluka: string }[] = [];
  for (const r of home.rows) {
    const alcCode = (r.cells[codeIdx] ?? "").trim();
    if (!alcCode || seen.has(alcCode)) continue;
    if (sameDistrict(districtByCode.get(alcCode), user.district)) {
      seen.add(alcCode);
      alcs.push({ alcCode, alcName: (r.cells[nameIdx] ?? "").trim(), taluka: talukaOf(alcCode) });
    }
  }

  // Nothing matched? Tell the UI which district names the sheet really uses,
  // so a spelling problem is visible instead of a silent empty list.
  if (alcs.length === 0) {
    return NextResponse.json({
      alcs,
      warning: {
        district: user.district,
        districtsInSheet: Array.from(new Set(districtByCode.values())).sort(),
      },
    });
  }

  return NextResponse.json({ alcs });
}
