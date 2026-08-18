import type { DisplayColumn, DisplayRow } from "@/lib/sheetView";

/**
 * Renders a table with the SAME columns, group headers, and field labels
 * as the source template sheet — nothing added, nothing renamed. Supports
 * both single-level sections (Index-1, 2, 4) and two-level section+metric
 * headers (Index-3: MSCIT/KLiC, then Timely Learning Start / Learning
 * Consistency / etc). Only "Total Points(N)" / "Bonus Points" cells are
 * filled with a live calculated value instead of being blank.
 */
export default function SheetTable({
  columns,
  rows,
}: {
  columns: DisplayColumn[];
  rows: DisplayRow[];
}) {
  if (columns.length === 0) {
    return <div className="p-10 text-center text-slate-400 text-sm">Sheet structure could not be read.</div>;
  }

  const depth = Math.max(0, ...columns.map((c) => c.groupPath.length));

  // For each header level, group consecutive columns that share the same
  // path prefix up to that level into a single spanning header cell.
  const levelRows: { label: string; span: number }[][] = [];
  for (let level = 0; level < depth; level++) {
    const spans: { label: string; span: number; key: string }[] = [];
    for (const col of columns) {
      const label = col.groupPath[level] ?? "";
      const key = col.groupPath.slice(0, level + 1).join(" / ");
      const last = spans[spans.length - 1];
      if (last && last.key === key && label !== "") {
        last.span += 1;
      } else {
        spans.push({ label, span: 1, key });
      }
    }
    levelRows.push(spans);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          {levelRows.map((spans, i) => (
            <tr key={i} className="text-center text-xs font-semibold text-slate-500 bg-slate-50">
              {spans.map((g, j) => (
                <th key={j} colSpan={g.span} className="py-2 px-3 border-b border-slate-100 whitespace-nowrap">
                  {g.label}
                </th>
              ))}
            </tr>
          ))}
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
            {columns.map((col) => (
              <th
                key={col.index}
                className={`py-2 px-3 whitespace-nowrap ${col.isTotal || col.isBonus ? "text-right" : ""}`}
              >
                {col.field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-slate-400 text-sm">
                No records match the current filters.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.alcCode} className="border-b border-slate-50 hover:bg-slate-50/60">
                {row.cells.map((value, i) => {
                  const col = columns[i];
                  return (
                    <td
                      key={col.index}
                      className={`py-2 px-3 whitespace-nowrap ${
                        col.isTotal
                          ? "text-right font-semibold text-brand-orange"
                          : col.isBonus
                          ? "text-right text-emerald-600 font-medium"
                          : "text-slate-600"
                      }`}
                    >
                      {value || "—"}
                      {col.isTotal && col.cap ? <span className="text-slate-400"> /{col.cap}</span> : null}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
