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

export function buildSheetView(sheet: ParsedSheet): SheetView {
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

  return { columns, rows };
}
