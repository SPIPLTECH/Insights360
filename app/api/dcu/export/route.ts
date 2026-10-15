import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getCurrentUser } from "@/lib/auth";
import { loadDashboardData } from "@/lib/dataService";
import type { SheetView, DisplayColumn } from "@/lib/sheetView";
import { sameDistrict } from "@/lib/districts";

// Must run on the Node.js runtime (ExcelJS needs Node APIs, not the Edge runtime).
export const runtime = "nodejs";
// Never cache — every export must reflect whatever is on the dashboard right now.
export const revalidate = 0;

/**
 * Builds a single readable header string for an Excel column out of a
 * DisplayColumn's groupPath + field, e.g. ["MSCIT"], "Points" -> "MSCIT - Points".
 * Purely a label for the exported file; does not change any dashboard logic.
 */
function columnHeader(col: DisplayColumn): string {
  return col.groupPath.length > 0 ? `${col.groupPath.join(" / ")} - ${col.field}` : col.field;
}

/**
 * Finds the index (within a SheetView's columns) of the "District" column,
 * so we can filter rows down to only the requesting DCU's own district.
 */
function findDistrictColIndex(view: SheetView): number {
  return view.columns.findIndex((c) => /^district$/i.test(c.field));
}

/**
 * Adds one worksheet to the workbook for a given SheetView, restricted to
 * rows belonging to `district` (case-insensitive, trimmed match).
 */
function addDistrictSheet(workbook: ExcelJS.Workbook, sheetName: string, view: SheetView, district: string) {
  const worksheet = workbook.addWorksheet(sheetName);

  const headers = view.columns.map(columnHeader);
  worksheet.addRow(headers);
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  headerRow.height = 26;
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const districtColIdx = findDistrictColIndex(view);

  const rows =
    districtColIdx >= 0
      ? view.rows.filter((r) => sameDistrict(r.cells[districtColIdx], district))
      : view.rows;

  rows.forEach((r) => {
    worksheet.addRow(r.cells);
  });

  worksheet.columns.forEach((column) => {
    let maxLen = 12;
    column.eachCell?.({ includeEmpty: true }, (c) => {
      const len = c.value ? String(c.value).length : 0;
      if (len > maxLen) maxLen = len;
    });
    column.width = Math.min(maxLen + 2, 40);
  });
}

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    return NextResponse.json({ ok: false, error: { message: "Not authorized." } }, { status: 401 });
  }

  const result = await loadDashboardData();
  if (!result.ok) {
    const status = result.error.code === "CONFIG" ? 500 : 502;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  const { views } = result.data;
  const district = user.district;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Insights360 · DCU Portal";
  workbook.created = new Date();

  addDistrictSheet(workbook, "Main Dashboard", views.home, district);
  addDistrictSheet(workbook, "Index 1", views.index1, district);
  addDistrictSheet(workbook, "Index 2", views.index2, district);
  addDistrictSheet(workbook, "Index 3", views.index3, district);
  addDistrictSheet(workbook, "Index 4", views.index4, district);

  const buffer = await workbook.xlsx.writeBuffer();

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const safeDistrict = district.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${safeDistrict}_Insights360_Export_${stamp}.xlsx`;

  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}