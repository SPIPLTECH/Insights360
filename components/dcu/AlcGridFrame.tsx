"use client";

import { useMemo, useState } from "react";
import type { Alc } from "./AlcSelect";
import { inputClass } from "./ui";

/** Number at the end of an ALC code (e.g. "ALC-0123" → 123). */
const codeNum = (c: string) => {
  const m = String(c).match(/(\d+)\s*$/);
  return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
};

export const HEAD = "px-3 py-2 border border-slate-300";
export const CELL = "px-2 py-1.5 border border-slate-300";

/** Same look as the original tables: search box + full-width bordered grid. */
export default function AlcGridFrame({
  alcs,
  minWidth = 900,
  sortAtTopRight = false,
  top,
  head,
  children,
}: {
  alcs: Alc[];
  minWidth?: number;
  sortAtTopRight?: boolean;
  top?: React.ReactNode;
  head: React.ReactNode;
  children: (rows: Alc[]) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "code">("name");
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...alcs].sort((a, b) =>
      sort === "code"
        ? codeNum(a.alcCode) - codeNum(b.alcCode) || a.alcCode.localeCompare(b.alcCode, undefined, { numeric: true })
        : a.alcName.localeCompare(b.alcName, undefined, { sensitivity: "base" }) || a.alcCode.localeCompare(b.alcCode, undefined, { numeric: true })
    );
    if (!q) return sorted;
    return sorted.filter((a) => a.alcCode.toLowerCase().includes(q) || a.alcName.toLowerCase().includes(q) || (a.taluka ?? "").toLowerCase().includes(q));
  }, [alcs, query, sort]);

  const sortUi = (
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500">Sort by</span>
        {([["name", "ALC Name (A–Z)"], ["code", "ALC Code ↑"]] as const).map(([k, label]) => (
          <button key={k} type="button" onClick={() => setSort(k)} className={`rounded-lg border px-3 py-1.5 font-semibold transition-colors ${sort === k ? "bg-brand-gradient text-white border-transparent" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>
            {label}
          </button>
        ))}
      </div>
  );

  return (
    <div className="space-y-3">
      {sortAtTopRight ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>{top}</div>
          {sortUi}
        </div>
      ) : (
        top
      )}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-xs font-semibold text-slate-500 shrink-0">Search ALC</label>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by ALC code, name or taluka…" className={`${inputClass} !mt-0`} autoComplete="off" />
      </div>
      {sortAtTopRight ? null : sortUi}
      <div className="-mx-3 md:-mx-4 max-h-[34rem] overflow-auto border-y border-slate-300">
        <table className="w-full border-collapse text-sm" style={{ minWidth }}>
          <thead className="sticky top-0 z-10 bg-slate-100 text-left text-xs font-semibold text-slate-600">{head}</thead>
          <tbody>
            {alcs.length === 0 ? (
              <tr><td colSpan={20} className={`${CELL} px-3 py-6 text-center text-slate-400`}>Loading ALCs…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={20} className={`${CELL} px-3 py-6 text-center text-slate-400`}>No ALC matches “{query}”.</td></tr>
            ) : (
              children(rows)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AlcCells({ a }: { a: Alc }) {
  return (
    <>
      <td className={`${CELL} px-3 font-semibold text-slate-800`}>{a.alcCode}</td>
      <td className={`${CELL} px-3 text-slate-700`}>{a.alcName}</td>
      <td className={`${CELL} px-3 text-slate-500`}>{a.taluka || ""}</td>
    </>
  );
}
