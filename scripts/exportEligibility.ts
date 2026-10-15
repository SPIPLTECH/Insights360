/**
 * Local export — District-wise Eligible / Not Eligible report for Index 1 to 4, as an Excel file.
 * Reads the Google Sheet directly (same .env.local as the app). Nothing is deployed or changed on the server.
 *
 * Run from the project root (VS Code terminal):
 *     npx tsx scripts/exportEligibility.ts
 *
 * Output:  exports/Eligibility_Report_<date>.xlsx
 *   - "Summary"            : district-wise Eligible / Not Eligible COUNT for every index
 *   - "Index 1" … "Index 4": every ALC (district -> status -> ALC code) with its status
 *   - "Index 1 Names" … "Index 4 Names": district-wise ALC code + name, Eligible and Not Eligible side by side
 *
 * Status is exactly what the sheet's "Eligible/Not Eligible" column says for that index.
 * Anything that is not "Eligible" (including an empty cell) is counted as Not Eligible.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config(); // .env as a fallback
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import { loadDashboardData } from "../lib/dataService";
import type { SheetView } from "../lib/sheetView";

type Status = "Eligible" | "Not Eligible";
interface AlcRow {
  district: string;
  alcCode: string;
  alcName: string;
  area: string;
  status: Status;
}

const INDEXES: { key: "index1" | "index2" | "index3" | "index4"; label: string; title: string }[] = [
  { key: "index1", label: "Index 1", title: "Business Growth" },
  { key: "index2", label: "Index 2", title: "Ecosystem Participation" },
  { key: "index3", label: "Index 3", title: "Learning Excellence" },
  { key: "index4", label: "Index 4", title: "Professional Excellence" },
];

const isEligibleText = (v: string) => /^(y|yes|eligible|true|1)$/i.test(v.trim());

function extractRows(view: SheetView): AlcRow[] {
  const find = (re: RegExp) => view.columns.findIndex((c) => re.test(c.field));
  const iCode = find(/^alc code$/i);
  const iName = find(/^alc (center )?name$/i);
  const iDistrict = find(/^district$/i);
  const iArea = find(/^area$/i);
  // the index's overall "Eligible/Not Eligible" column (last one, if there are several)
  let iElig = -1;
  view.columns.forEach((c, i) => {
    if (/eligible/i.test(c.field)) iElig = i;
  });
  if (iElig < 0) throw new Error("Could not find the 'Eligible/Not Eligible' column in this index.");

  const get = (cells: string[], i: number) => (i >= 0 ? (cells[i] ?? "").toString().replace(/\s+/g, " ").trim() : "");
  return view.rows.map((r) => ({
    district: get(r.cells, iDistrict) || "(No district)",
    alcCode: get(r.cells, iCode) || r.alcCode,
    alcName: get(r.cells, iName),
    area: get(r.cells, iArea),
    status: isEligibleText(get(r.cells, iElig)) ? "Eligible" : "Not Eligible",
  }));
}

const GREEN = "FFE2F5E8";
const RED = "FFFDE7E7";
const HEAD = "FFE8ECF4";

function styleHeader(row: ExcelJS.Row, height = 24) {
  row.font = { bold: true };
  row.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  row.height = height;
  row.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEAD } };
  });
}

function allBorders(ws: ExcelJS.Worksheet) {
  ws.eachRow((row) =>
    row.eachCell((c) => {
      c.border = {
        top: { style: "thin", color: { argb: "FFBFC7D5" } },
        left: { style: "thin", color: { argb: "FFBFC7D5" } },
        bottom: { style: "thin", color: { argb: "FFBFC7D5" } },
        right: { style: "thin", color: { argb: "FFBFC7D5" } },
      };
    })
  );
}

export async function writeWorkbook(views: Record<string, SheetView>, outFile: string) {
  const data = INDEXES.map((ix) => ({ ...ix, rows: extractRows(views[ix.key]) }));

  const districts = Array.from(new Set(data.flatMap((d) => d.rows.map((r) => r.district)))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  const wb = new ExcelJS.Workbook();

  // ---------------- Summary ----------------
  const ws = wb.addWorksheet("Summary");
  ws.addRow(["District", ...data.flatMap((d) => [`${d.label} · ${d.title}`, "", ""])]);
  ws.addRow(["", ...data.flatMap(() => ["Eligible", "Not Eligible", "Total ALCs"])]);
  data.forEach((_, i) => ws.mergeCells(1, 2 + i * 3, 1, 4 + i * 3));
  ws.mergeCells(1, 1, 2, 1);
  styleHeader(ws.getRow(1));
  styleHeader(ws.getRow(2));

  const totals = data.map(() => ({ e: 0, n: 0 }));
  for (const district of districts) {
    const cells: (string | number)[] = [district];
    data.forEach((d, i) => {
      const rows = d.rows.filter((r) => r.district === district);
      const e = rows.filter((r) => r.status === "Eligible").length;
      const n = rows.length - e;
      totals[i].e += e;
      totals[i].n += n;
      cells.push(e, n, rows.length);
    });
    ws.addRow(cells);
  }
  const totalRow = ws.addRow(["TOTAL", ...totals.flatMap((t) => [t.e, t.n, t.e + t.n])]);
  totalRow.font = { bold: true };
  ws.columns.forEach((col, i) => (col.width = i === 0 ? 22 : 14));
  ws.views = [{ state: "frozen", xSplit: 1, ySplit: 2 }];
  ws.eachRow((row, n) => {
    if (n > 2) row.eachCell((c, col) => {
      if (col > 1) c.alignment = { horizontal: "center" };
    });
  });
  allBorders(ws);

  // ---------------- One sheet per index ----------------
  for (const d of data) {
    const sh = wb.addWorksheet(d.label);
    sh.addRow(["District", "ALC Code", "ALC Center Name", "Area", "Eligible / Not Eligible"]);
    styleHeader(sh.getRow(1));
    const sorted = [...d.rows].sort(
      (a, b) =>
        a.district.localeCompare(b.district, undefined, { sensitivity: "base" }) ||
        (a.status === b.status ? 0 : a.status === "Eligible" ? -1 : 1) ||
        a.alcCode.localeCompare(b.alcCode, undefined, { numeric: true })
    );
    for (const r of sorted) {
      const row = sh.addRow([r.district, r.alcCode, r.alcName, r.area, r.status]);
      row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: r.status === "Eligible" ? GREEN : RED } };
    }
    sh.columns = [{ width: 20 }, { width: 14 }, { width: 44 }, { width: 14 }, { width: 22 }];
    sh.views = [{ state: "frozen", ySplit: 1 }];
    sh.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 5 } };
    allBorders(sh);
  }

  // ---------------- District-wise names (Eligible | Not Eligible side by side) ----------------
  for (const d of data) {
    const sh = wb.addWorksheet(`${d.label} Names`);
    const lists = districts.map((district) => {
      const rows = d.rows
        .filter((r) => r.district === district)
        .sort((a, b) => a.alcCode.localeCompare(b.alcCode, undefined, { numeric: true }));
      const fmt = (r: AlcRow) => `${r.alcCode} - ${r.alcName || "(Name not in sheet)"}`;
      return {
        district,
        eligible: rows.filter((r) => r.status === "Eligible").map(fmt),
        not: rows.filter((r) => r.status !== "Eligible").map(fmt),
      };
    });

    sh.addRow(lists.flatMap((l) => [l.district, ""]));
    sh.addRow(lists.flatMap((l) => [`Eligible (${l.eligible.length})`, `Not Eligible (${l.not.length})`]));
    lists.forEach((_, i) => sh.mergeCells(1, 1 + i * 2, 1, 2 + i * 2));
    styleHeader(sh.getRow(1));
    styleHeader(sh.getRow(2));
    lists.forEach((_, i) => {
      sh.getRow(2).getCell(1 + i * 2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREEN } };
      sh.getRow(2).getCell(2 + i * 2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: RED } };
    });

    const maxLen = Math.max(0, ...lists.map((l) => Math.max(l.eligible.length, l.not.length)));
    for (let i = 0; i < maxLen; i++) {
      sh.addRow(lists.flatMap((l) => [l.eligible[i] ?? "", l.not[i] ?? ""]));
    }
    sh.columns = lists.flatMap(() => [{ width: 40 }, { width: 40 }]);
    sh.views = [{ state: "frozen", ySplit: 2 }];
    allBorders(sh);
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  await wb.xlsx.writeFile(outFile);
  return { districts: districts.length, alcs: data[0].rows.length };
}

async function main() {
  console.log("Reading Google Sheet…");
  const result = await loadDashboardData();
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);

  const date = new Date().toISOString().slice(0, 10);
  const outFile = path.resolve("exports", `Eligibility_Report_${date}.xlsx`);
  const info = await writeWorkbook(result.data.views as any, outFile);
  console.log(`✔ Done — ${info.alcs} ALCs, ${info.districts} districts`);
  console.log(`  ${outFile}`);
}

if (require.main === module) {
  main().catch((e) => {
    console.error("✘", e?.message ?? e);
    process.exit(1);
  });
}
