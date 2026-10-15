"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface Alc {
  alcCode: string;
  alcName: string;
  taluka?: string;
}

/** "Search/Select ALC" — type a code or name to filter, click to pick. */
export default function AlcSelect({
  alcs,
  value,
  onChange,
}: {
  alcs: Alc[];
  value: string;
  onChange: (alcCode: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => alcs.find((a) => a.alcCode === value), [alcs, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alcs;
    return alcs.filter((a) => a.alcCode.toLowerCase().includes(q) || a.alcName.toLowerCase().includes(q));
  }, [alcs, query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <label className="text-xs font-semibold text-slate-500">Search / Select ALC</label>
      <input
        value={open ? query : selected ? `${selected.alcCode} — ${selected.alcName}` : query}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (value) onChange("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={alcs.length ? "Type ALC code or name…" : "Loading ALCs…"}
        className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
        autoComplete="off"
      />
      {open ? (
        <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-auto bg-white border border-slate-200 rounded-xl shadow-lg">
          {filtered.slice(0, 100).map((a) => (
            <li key={a.alcCode}>
              <button
                type="button"
                onClick={() => {
                  onChange(a.alcCode);
                  setQuery("");
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-brand-50 ${
                  a.alcCode === value ? "bg-brand-50 font-semibold" : ""
                }`}
              >
                <span className="font-semibold text-slate-800">{a.alcCode}</span>
                <span className="text-slate-500"> — {a.alcName}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 ? <li className="px-3 py-3 text-sm text-slate-400">No ALC matches “{query}”.</li> : null}
          {filtered.length > 100 ? (
            <li className="px-3 py-2 text-xs text-slate-400 border-t border-slate-100">
              Showing first 100 of {filtered.length} — keep typing to narrow down.
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
