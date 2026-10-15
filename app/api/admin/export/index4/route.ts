import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getCurrentUser, canAccessAdmin } from "@/lib/auth";
import { loadIndex4Table } from "@/lib/index4Data";

export const runtime = "nodejs"; // ExcelJS needs Node APIs
export const dynamic = "force-dynamic";

/** Admin only: download Index 4 data (no points) as .xlsx */
export async function GET() {
  if (!canAccessAdmin(getCurrentUser())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const r = await loadIndex4Table();
  if (!r.ok) return NextResponse.json({ error: r.message }, { status: r.status });

  const { headers, rows } = r.table;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Index 4 Data");

  ws.addRow(headers);
  const head = ws.getRow(1);
  head.font = { bold: true };
  head.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  head.height = 34;
  rows.forEach((row) => ws.addRow(row));

  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headers.length } };
  ws.columns.forEach((col, i) => {
    const longest = rows.reduce((m, row) => Math.max(m, (row[i] ?? "").length), 0);
    col.width = Math.min(Math.max(longest + 2, i >= 4 ? 22 : 12), 45);
  });

  const buf = await wb.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="Index4_Data_${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
