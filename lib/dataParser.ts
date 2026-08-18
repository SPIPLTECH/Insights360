import { RawGrid } from "./googleSheets";
import { SheetConfig, ColumnDef } from "./sheetConfigs";

/**
 * Reads a sheet's data rows using a FIXED, known column layout (see
 * sheetConfigs.ts) instead of guessing header positions from merged
 * cells. The template's header rows are decorative (group titles, merged
 * cells) and stay constant — only the data rows underneath change as the
 * organization edits the sheet. This guarantees the dashboard always
 * mirrors exactly what's typed into the sheet, in the same columns.
 */

export interface ParsedColumn {
  index: number;
  field: string;
  groupPath: string[];
  isTotal: boolean;
  isBonus: boolean;
  isEligible: boolean;
  cap: number | null;
}

export interface ParsedSheet {
  columns: ParsedColumn[];
  coreCols: { alcCode: number; alcName: number; district: number; area: number };
  totalPointsCols: { colIndex: number; group: string; cap: number | null }[];
  bonusPointsCols: { colIndex: number; group: string }[];
  eligibleCols: { colIndex: number; group: string }[];
  rows: string[][];
}

function classify(col: ColumnDef): ParsedColumn {
  const isTotal = /^total points/i.test(col.field);
  const isBonus = /^bonus points$/i.test(col.field);
  const isEligible = /eligible/i.test(col.field);
  const capMatch = col.field.match(/\((\d+)\)/);
  return {
    index: col.index,
    field: col.field,
    groupPath: col.groupPath,
    isTotal,
    isBonus,
    isEligible,
    cap: capMatch ? Number(capMatch[1]) : null,
  };
}

export function parseTemplateSheet(grid: RawGrid, config: SheetConfig): ParsedSheet {
  const columns = config.columns.map(classify);

  const totalPointsCols = columns
    .filter((c) => c.isTotal && c.groupPath.length === 0)
    .map((c) => ({ colIndex: c.index, group: c.groupPath[c.groupPath.length - 1] ?? c.field, cap: c.cap }));
  const bonusPointsCols = columns
    .filter((c) => c.isBonus && c.groupPath.length === 0)
    .map((c) => ({ colIndex: c.index, group: c.groupPath[c.groupPath.length - 1] ?? c.field }));
  const eligibleCols = columns
    .filter((c) => c.isEligible)
    .map((c) => ({ colIndex: c.index, group: c.groupPath[c.groupPath.length - 1] ?? c.field }));

  const rows: string[][] = [];
  for (let r = config.headerRowCount; r < grid.length; r++) {
    const row = grid[r] ?? [];
    const code = (row[config.coreCols.alcCode] ?? "").toString().trim();
    if (code) rows.push(row);
  }

  return { columns, coreCols: config.coreCols, totalPointsCols, bonusPointsCols, eligibleCols, rows };
}

export function cell(row: string[], colIndex: number): string {
  if (colIndex < 0) return "";
  return (row[colIndex] ?? "").toString().trim();
}

export function num(value: string): number {
  if (!value) return 0;
  const n = Number(String(value).replace(/[,%\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function isYes(value: string): boolean {
  return /^(y|yes|eligible|true|1)$/i.test(value.trim());
}

/**
 * A "Total Points(N)" (and "Bonus Points") column is read directly from
 * the sheet's own cell — never recalculated in code. The Google Sheet
 * already has its own formulas for these; the dashboard is a pure mirror
 * of whatever value is sitting in that cell, so it always matches the
 * sheet exactly (including if the org changes the sheet's formula later).
 */
export function computeSectionTotal(sheet: ParsedSheet, row: string[], totalColIndex: number): number {
  return num(cell(row, totalColIndex));
}
