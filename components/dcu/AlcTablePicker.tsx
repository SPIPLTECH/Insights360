"use client";

import { useMemo, useState } from "react";
import type { Alc } from "./AlcSelect";

/**
 * "Select ALC" as a list — same look as the Meeting Attendance table:
 * ALC Center Code | ALC Name | ALC Taluka, a few rows visible, the rest on scroll.
 * `alcs` already contains only the logged-in DCU's district (filtered in /api/dcu/alcs).
 * Click a row to select it; click the selected row again to un-select.
 */
export default function AlcTablePicker({
  alcs,
  value,
  onChange,
}: {
  alcs: Alc[];
  value: string;
  onChange: (alcCode: string) => void;
}) {
  const [query, setQuery] = useState("");

  const selected = useMemo(() => alcs.find((a) => a.alcCode === value), [alcs, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alcs;
    return alcs.filter(
      (a) =>
        a.alcCode.toLowerCase().includes(q) ||
        a.alcName.toLowerCase().includes(q) ||
        (a.taluka ?? "").toLowerCase().includes(q)
    );
  }, [alcs, query]);

  return (
    <div>
      <label className="text-xs font-semibold text-slate-500">Select ALC</label>

      <div className="mt-1 border border-slate-200 rounded-2xl bg-white p-4 space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ALC code, name or taluka…"
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          autoComplete="off"
        />

        {selected ? (
          <p className="text-sm font-bold text-slate-900 bg-brand-50 border border-brand-orange/40 rounded-xl px-3 py-2">
            Selected: {selected.alcCode} — {selected.alcName}
            {selected.taluka ? ` (${selected.taluka})` : ""}
          </p>
        ) : (
          <p className="text-xs text-slate-400">
            {alcs.length === 0
              ? "Loading ALCs…"
              : `${alcs.length} ALCs${query.trim() ? ` · Showing ${filtered.length}` : ""} · Click a row to select`}
          </p>
        )}

        <div className="max-h-72 overflow-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-3 py-2 whitespace-nowrap">ALC Center Code</th>
                <th className="px-3 py-2">ALC Name</th>
                <th className="px-3 py-2">ALC Taluka</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const isSel = a.alcCode === value;
                return (
                  <tr
                    key={a.alcCode}
                    tabIndex={0}
                    aria-selected={isSel}
                    onClick={() => onChange(isSel ? "" : a.alcCode)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onChange(isSel ? "" : a.alcCode);
                      }
                    }}
                    className={`border-t border-slate-100 cursor-pointer focus:outline-none focus:bg-brand-50 ${
                      isSel ? "bg-brand-50 ring-1 ring-inset ring-brand-orange/50" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-3 py-2 font-semibold text-slate-800 whitespace-nowrap">{a.alcCode}</td>
                    <td className="px-3 py-2 text-slate-700">{a.alcName}</td>
                    <td className="px-3 py-2 text-slate-500">{a.taluka || ""}</td>
                  </tr>
                );
              })}
              {alcs.length > 0 && filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-slate-400">
                    No ALC matches “{query}”.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
