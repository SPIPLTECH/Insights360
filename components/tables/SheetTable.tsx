import type { DisplayColumn, DisplayRow } from "@/lib/sheetView";

/**
 * Renders a table with the SAME columns, group headers, and field labels
 * as the source template sheet — nothing added, nothing renamed in the
 * underlying data. Supports both single-level sections (Index-1, 2, 4)
 * and two-level section+metric headers (Index-3: MSCIT/KLiC, then Timely
 * Learning Start / Learning Consistency / etc). Only "Total Points(N)" /
 * "Bonus Points" cells are filled with a live calculated value instead of
 * being blank.
 *
 * Display-only tweaks (no data/calculation changes):
 * - "Bonus Points" header shows as "B.Points" (with a hover tooltip that
 *   says "Bonus Points"), "Eligible/Not Eligible" header shows as
 *   "Eligibility Status" with Yes/No values.
 * - Each top-level index group gets its own light header color.
 * - Header rows are sticky (stacked below `headerOffset`, e.g. the
 *   sticky search/filter bar above the table).
 * - Data rows alternate a light-orange tint so a single ALC's full row
 *   is easy to trace across all the way to the right.
 * - ALC Center Name wraps instead of forcing the column (and the gap
 *   before District) to stretch to the longest name in the sheet.
 * - Decimal number values are displayed rounded to 2 decimal places
 *   (e.g. 345.9987978 -> 345.99). Underlying data is untouched.
 *
 * hideEligibilityColumn (opt-in, used ONLY by Home Dashboard):
 * - Removes the "Eligibility Status" column entirely from header + body.
 * - The "Points" column that the eligibility status governs is instead
 *   colored green (Eligible) or red (Not Eligible) directly on the
 *   points number itself. No data/calculation change — purely display.
 *
 * hideBonusColumn (opt-in, used ONLY by Home Dashboard):
 * - Removes every "Bonus Points" column entirely (each per-index section's
 *   own Bonus Points AND the grand-total "Bonus Points" column) from
 *   header + body. No data/calculation change — purely display.
 *
 * hideTotalCap (opt-in, used ONLY by Home Dashboard):
 * - Removes the "/850" (max points) suffix from every Total Points cell,
 *   because the column heading already says "Total Points(850)".
 *
 * Column-group separators:
 * - Every top-level group (Index 1, Index 2, Index 3, Index 4 ...) gets a
 *   vertical line on both its left and right edge, so each index's whole
 *   block of columns is visually distinct as one column group.
 */

// Light, distinct pastel colors cycled across the top-level index groups,
// applied to the header only (per request) — data rows stay neutral/orange.
const GROUP_COLORS = [
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
  "bg-sky-50 text-sky-700",
  "bg-orange-50 text-orange-700",
  "bg-violet-50 text-violet-700",
];

// The 4 identity columns (always the leading columns on every view) stay
// pinned to the left while scrolling right through the index columns, so
// you can always tell which ALC a row belongs to. Fixed pixel widths are
// required so the sticky "left" offsets line up exactly between the
// header and the body.
const FROZEN_FIELDS: { field: string; width: number }[] = [
  { field: "ALC Code", width: 100 },
  { field: "ALC Center Name", width: 210 },
  { field: "District", width: 110 },
  { field: "Area", width: 90 },
];

function buildFrozenMap(columns: DisplayColumn[]) {
  const map = new Map<number, { width: number; left: number }>();
  let left = 0;
  for (let i = 0; i < FROZEN_FIELDS.length; i++) {
    const col = columns[i];
    if (!col || col.field.toLowerCase() !== FROZEN_FIELDS[i].field.toLowerCase()) break;
    const { width } = FROZEN_FIELDS[i];
    map.set(col.index, { width, left });
    left += width;
  }
  return map;
}

function displayFieldLabel(field: string) {
  if (/^bonus points$/i.test(field)) return "B.Points";
  if (/^eligible\/not eligible$/i.test(field)) return "Eligibility Status";
  return field;
}

function displayCellValue(col: DisplayColumn, value: string) {
  if (/^eligible\/not eligible$/i.test(col.field)) {
    if (/^eligible$/i.test(value)) return "Yes";
    if (/^not eligible$/i.test(value)) return "No";
  }
  // Round any decimal number to 2 places (e.g. 345.9987978 -> 345.99)
  if (value && !isNaN(Number(value)) && value.includes(".")) {
    return Number(value).toFixed(2);
  }
  return value;
}

const isNameCol = (col: DisplayColumn) => /^alc center name$/i.test(col.field);
const isEligibilityCol = (col: DisplayColumn) => /^eligible\/not eligible$/i.test(col.field);
const isPointsCol = (col: DisplayColumn) => /^points$/i.test(col.field);
const isBonusCol = (col: DisplayColumn) => /^bonus points$/i.test(col.field);

export default function SheetTable({
  columns,
  rows,
  hideEligibilityColumn = false,
  hideBonusColumn = false,
  hideTotalCap = false,
}: {
  columns: DisplayColumn[];
  rows: DisplayRow[];
  hideEligibilityColumn?: boolean;
  /** Removes every "Bonus Points" column (per-section AND the grand-total
   * one) entirely from header + body. Opt-in, used by Home Dashboard. */
  hideBonusColumn?: boolean;
  /** Hides the small "/850" (max points) suffix shown next to every
   * Total Points value. Opt-in, used ONLY by Home Dashboard (the header
   * already says "Total Points(850)"). Index 1-4 pages are unaffected. */
  hideTotalCap?: boolean;
}) {
  if (columns.length === 0) {
    return <div className="p-10 text-center text-slate-400 text-sm">Sheet structure could not be read.</div>;
  }

  // Pair each "Points" column with the "Eligibility Status" column that
  // follows it (within the same group, sequence is Points -> B.Points ->
  // Eligibility Status). Keyed by the Points column's original col.index.
  const pointsToEligibility = new Map<number, DisplayColumn>();
  {
    let lastPoints: DisplayColumn | null = null;
    for (const col of columns) {
      if (isPointsCol(col)) {
        lastPoints = col;
      } else if (isEligibilityCol(col) && lastPoints) {
        pointsToEligibility.set(lastPoints.index, col);
        lastPoints = null;
      }
    }
  }

  // Columns actually rendered — drop Eligibility Status and/or Bonus
  // Points entirely when the matching flag is on (Home Dashboard only).
  // Everything else (frozen columns, group headers, colors) is computed
  // off this list so spans/colors still line up correctly with fewer
  // columns.
  const columnsToRender = columns.filter((c) => {
    if (hideEligibilityColumn && isEligibilityCol(c)) return false;
    if (hideBonusColumn && isBonusCol(c)) return false;
    return true;
  });

  const depth = Math.max(0, ...columnsToRender.map((c) => c.groupPath.length));

  // Mark the first and last column of every top-level group (e.g. "Index
  // 1", "Index 2"...) so we can draw a vertical line on both sides of
  // each group, making each index's block of columns visually distinct.
  const groupEdge = new Map<number, { start: boolean; end: boolean }>();
  {
    let lastLabel: string | null = null;
    let lastCol: DisplayColumn | null = null;
    columnsToRender.forEach((col) => {
      const label = col.groupPath[0] ?? "";
      if (label && label !== lastLabel) {
        if (lastCol && lastLabel) {
          groupEdge.set(lastCol.index, { ...(groupEdge.get(lastCol.index) ?? { start: false, end: false }), end: true });
        }
        groupEdge.set(col.index, { start: true, end: false });
        lastLabel = label;
      } else if (!label && lastLabel) {
        if (lastCol) {
          groupEdge.set(lastCol.index, { ...(groupEdge.get(lastCol.index) ?? { start: false, end: false }), end: true });
        }
        lastLabel = null;
      }
      lastCol = col;
    });
    if (lastCol && lastLabel) {
      groupEdge.set((lastCol as DisplayColumn).index, {
        ...(groupEdge.get((lastCol as DisplayColumn).index) ?? { start: false, end: false }),
        end: true,
      });
    }
  }
  const groupBorderClass = (col: DisplayColumn) => {
    const edge = groupEdge.get(col.index);
    if (!edge) return "";
    return `${edge.start ? "border-l-2 border-l-slate-300" : ""} ${edge.end ? "border-r-2 border-r-slate-300" : ""}`;
  };

  // For each header level, group consecutive columns that share the same
  // path prefix up to that level into a single spanning header cell. Each
  // span also remembers the first original column it starts at, so we can
  // tell whether it's one of the frozen leading identity columns.
  const levelRows: { label: string; span: number; startCol: DisplayColumn }[][] = [];
  for (let level = 0; level < depth; level++) {
    const spans: { label: string; span: number; key: string; startCol: DisplayColumn }[] = [];
    columnsToRender.forEach((col, colIdx) => {
      const label = col.groupPath[level] ?? "";
      const key = col.groupPath.slice(0, level + 1).join(" / ");
      const last = spans[spans.length - 1];
      if (last && last.key === key && label !== "") {
        last.span += 1;
      } else {
        spans.push({ label, span: 1, key, startCol: columnsToRender[colIdx] });
      }
    });
    levelRows.push(spans);
  }

  // Assign a color to each distinct top-level group label, in first-seen order.
  const topLevelColor = new Map<string, string>();
  if (levelRows[0]) {
    for (const g of levelRows[0]) {
      if (g.label && !topLevelColor.has(g.label)) {
        topLevelColor.set(g.label, GROUP_COLORS[topLevelColor.size % GROUP_COLORS.length]);
      }
    }
  }

  const frozenMap = buildFrozenMap(columnsToRender);

  return (
    // Bounded, self-scrolling panel (like a frozen-header spreadsheet grid):
    // this is what makes the sticky header 100% reliable — the header sticks
    // to the top of THIS panel's own scroll, instead of depending on the
    // page/window scroll (which an "overflow-x-auto"-only wrapper silently
    // hijacks as its scroll reference, causing the header to float in the
    // wrong place).
    <div className="overflow-auto max-h-[70vh] rounded-b-2xl">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-white" style={{ position: "sticky", top: 0, zIndex: 20 }}>
          {levelRows.map((spans, i) => (
            <tr key={i} className="text-center text-sm md:text-base font-extrabold">
              {spans.map((g, j) => {
                const frozen = g.span === 1 ? frozenMap.get(g.startCol.index) : undefined;
                return (
                  <th
                    key={j}
                    colSpan={g.span}
                    style={
                      frozen
                        ? { position: "sticky", left: frozen.left, width: frozen.width, minWidth: frozen.width, zIndex: 30 }
                        : undefined
                    }
                    className={`h-10 px-3 border-b border-slate-200 whitespace-nowrap ${
                      i === 0 && g.label ? "border-l-2 border-r-2 border-slate-300" : ""
                    } ${
                      g.label ? topLevelColor.get(g.label) ?? "bg-slate-50 text-slate-600" : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    {g.label}
                  </th>
                );
              })}
            </tr>
          ))}
          <tr className="text-center text-sm md:text-base uppercase tracking-wide text-slate-700 font-extrabold">
            {columnsToRender.map((col) => {
              const frozen = frozenMap.get(col.index);
              return (
                <th
                  key={col.index}
                  title={isBonusCol(col) ? "Bonus Points" : undefined}
                  style={
                    frozen
                      ? { position: "sticky", left: frozen.left, width: frozen.width, minWidth: frozen.width, zIndex: 30 }
                      : undefined
                  }
                  className={`h-10 px-3 whitespace-nowrap bg-slate-50 border-b border-slate-200 ${groupBorderClass(
                    col
                  )} ${isNameCol(col) ? "text-left" : ""}`}
                >
                  {displayFieldLabel(col.field)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columnsToRender.length} className="py-10 text-center text-slate-400 text-sm">
                No records match the current filters.
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => {
              const rowBg = rowIdx % 2 === 0 ? "bg-white" : "bg-orange-100";
              return (
                <tr key={row.alcCode} className={rowBg}>
                  {columnsToRender.map((col) => {
                    const value = row.cells[col.index] ?? "";
                    const displayValue = displayCellValue(col, value);
                    const frozen = frozenMap.get(col.index);

                    // If this is a Points column governed by an eligibility
                    // status (Home Dashboard mode), color the number itself.
                    let eligibilityColor = "";
                    if (hideEligibilityColumn && isPointsCol(col)) {
                      const eligCol = pointsToEligibility.get(col.index);
                      if (eligCol) {
                        const eligRaw = row.cells[eligCol.index] ?? "";
                        const eligValue = displayCellValue(eligCol, eligRaw);
                        if (eligValue === "Yes") eligibilityColor = "text-emerald-600 font-bold";
                        else if (eligValue === "No") eligibilityColor = "text-rose-500 font-bold";
                      }
                    }

                    return (
                      <td
                        key={col.index}
                        style={
                          frozen
                            ? { position: "sticky", left: frozen.left, width: frozen.width, minWidth: frozen.width, zIndex: 10 }
                            : undefined
                        }
                        className={`py-2 px-3 align-middle ${frozen ? `${rowBg} border-r border-slate-100` : ""} ${groupBorderClass(
                          col
                        )} ${
                          isNameCol(col)
                            ? "text-left max-w-[210px] whitespace-normal break-words text-slate-700"
                            : "text-center whitespace-nowrap"
                        } ${
                          eligibilityColor
                            ? eligibilityColor
                            : col.isTotal
                            ? "font-semibold text-brand-orange"
                            : col.isBonus
                            ? "text-emerald-600 font-medium"
                            : isEligibilityCol(col)
                            ? displayValue === "Yes"
                              ? "text-emerald-600 font-medium"
                              : displayValue === "No"
                              ? "text-rose-500 font-medium"
                              : "text-slate-600"
                            : "text-slate-600"
                        }`}
                      >
                        {displayValue || "—"}
                        {col.isTotal && col.cap && !hideTotalCap ? <span className="text-slate-400"> /{col.cap}</span> : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}