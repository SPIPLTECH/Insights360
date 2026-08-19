import { ParsedSheet, cell, computeSectionTotal } from "./dataParser";

/**
 * Builds an exact-format table view of a parsed template sheet: the same
 * columns, in the same order, with the same group/metric labels as the
 * source spreadsheet (sheetConfigs.ts). Only the "Total Points(N)" /
 * "Bonus Points" cells are replaced with a live calculated value, since
 * those are meant to be formula/summary cells, not raw typed data.
 */

export interface DisplayColumn {
  index: number;
  field: string;
  groupPath: string[];
  isTotal: boolean;
  isBonus: boolean;
  cap: number | null;
}

export interface DisplayRow {
  alcCode: string;
  cells: string[]; // one entry per DisplayColumn, in order
}

export interface SheetView {
  columns: DisplayColumn[];
  rows: DisplayRow[];
}

export function buildSheetView(sheet: ParsedSheet, sortByTotalDesc = false): SheetView {
  const columns: DisplayColumn[] = sheet.columns.map((c) => ({
    index: c.index,
    field: c.field,
    groupPath: c.groupPath,
    isTotal: c.isTotal,
    isBonus: c.isBonus,
    cap: c.cap,
  }));

  const rows: DisplayRow[] = sheet.rows.map((row) => {
    const cells = columns.map((col) => {
      if (col.isTotal) {
        return String(computeSectionTotal(sheet, row, col.index));
      }
      return cell(row, col.index);
    });
    return { alcCode: cell(row, sheet.coreCols.alcCode), cells };
  });

  // Sabse zyada Total Points wala row sabse upar (descending order).
  // Sirf tab lagu hota hai jab caller explicitly sortByTotalDesc true bheje
  // (Home Dashboard ke liye) — baaki sab jagah rows apne original sheet
  // order me hi rehti hain, kuch bhi extra calculate nahi hota.
  if (sortByTotalDesc) {
    const totalColIndexes = columns.filter((c) => c.isTotal).map((c) => c.index);
    if (totalColIndexes.length > 0) {
      const totalOf = (r: DisplayRow) =>
        columns.reduce((sum, col, i) => {
          if (!totalColIndexes.includes(col.index)) return sum;
          const n = parseFloat(r.cells[i]);
          return sum + (isNaN(n) ? 0 : n);
        }, 0);
      rows.sort((a, b) => totalOf(b) - totalOf(a));
    }
  }

  return { columns, rows };
}