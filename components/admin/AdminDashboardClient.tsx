"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// widths of the 8 columns (add up to 100%) so the table always fills the card
const COL_WIDTHS = ["11%", "25%", "11%", "7%", "12%", "13%", "10%", "11%"];

type Table = { headers: string[]; rows: string[][]; fetchedAt: string };

export default function AdminDashboardClient({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [table, setTable] = useState<Table | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [district, setDistrict] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/index4", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not load Index 4 data.");
      setTable(json);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/admin/export/index4", { cache: "no-store" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Download failed.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Index4_Data_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDownloading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const districts = useMemo(
    () => Array.from(new Set((table?.rows ?? []).map((r) => r[2]).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [table]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (table?.rows ?? []).filter(
      (r) => (!district || r[2] === district) && (!q || r[0].toLowerCase().includes(q) || r[1].toLowerCase().includes(q))
    );
  }, [table, district, query]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-brand-gradient text-white px-5 py-5 md:px-10 md:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-widest font-semibold text-white/80 uppercase">Admin Portal</p>
            <h1 className="text-xl md:text-2xl font-bold mt-0.5">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:block text-sm font-medium">{displayName}</span>
            <button onClick={load} className="bg-white/15 hover:bg-white/25 transition-colors text-sm rounded-xl px-3 py-2">
              Refresh
            </button>
            <button onClick={handleLogout} className="bg-white/15 hover:bg-white/25 transition-colors text-sm rounded-xl px-3 py-2">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6 space-y-5">
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-600 px-4 py-3 text-sm flex justify-between gap-3">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-semibold opacity-60 hover:opacity-100" aria-label="Dismiss">
              ✕
            </button>
          </div>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Stat label="ALCs" value={table ? table.rows.length : "—"} />
          <Stat label="Districts" value={table ? districts.length : "—"} />
          <div className="card p-4 col-span-2 md:col-span-1 flex items-center">
            <button
              onClick={handleDownload}
              disabled={downloading || !table}
              className="w-full bg-brand-gradient text-white font-semibold text-sm rounded-xl px-4 py-3 disabled:opacity-50"
            >
              {downloading ? "Preparing…" : "⬇ Index 4 Data (Excel)"}
            </button>
          </div>
        </div>

        <section className="card p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Index 4 · Professional Excellence</h2>
            </div>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ALC code / name"
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-full md:w-56"
              />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
              >
                <option value="">All districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && !table ? (
            <p className="text-sm text-slate-400 py-10 text-center">Loading Index 4 data…</p>
          ) : !table ? null : (
            <>
              <div className="overflow-y-auto overflow-x-auto max-h-[65vh] rounded-xl border border-slate-200">
                <table className="w-full table-fixed border-collapse text-[13px]">
                  <colgroup>
                    {COL_WIDTHS.map((w, i) => (
                      <col key={i} style={{ width: w }} />
                    ))}
                  </colgroup>
                  <thead className="sticky top-0 bg-slate-100 text-slate-700">
                    <tr>
                      {table.headers.map((h) => (
                        <th key={h} className="px-2.5 py-2 text-left font-semibold whitespace-normal align-bottom border border-slate-300">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={r[0] + i} className="odd:bg-white even:bg-slate-50/60">
                        {r.map((c, j) => (
                          <td key={j} className={`px-2.5 py-1.5 border border-slate-200 align-top ${j === 1 || j === 2 ? "whitespace-normal leading-snug" : "whitespace-nowrap"}`}>
                            {c || <span className="text-slate-300">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={table.headers.length} className="text-center text-slate-400 py-8">
                          No ALCs match.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Showing {filtered.length} of {table.rows.length} · fetched {new Date(table.fetchedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
