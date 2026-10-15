"use client";

import { useMemo, useState } from "react";
import type { Alc } from "../AlcSelect";
import { FormFooter, inputClass, useFormSubmit } from "../ui";

type YesNo = "Yes" | "No";
type Row = { posted: YesNo | ""; instagram: string; facebook: string };

const EMPTY: Row = { posted: "", instagram: "", facebook: "" };
const isUrl = (v: string) => /^https?:\/\/\S+$/i.test(v);
const CELL = "px-2 py-1.5 border border-slate-300";
const HEAD = "px-3 py-2 border border-slate-300";

/**
 * Social Media Presence - bulk entry.
 * Every ALC of the district is listed; DCU picks Yes/No in its row. On "Yes" the Instagram and
 * Facebook boxes (same row) open up. Rows left without a choice are skipped. One Submit sends all.
 */
export default function SocialMediaForm({ alcs, onSubmitted }: { alcs: Alc[]; onSubmitted: () => void }) {
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [query, setQuery] = useState("");
  const { loading, message, run } = useFormSubmit();

  const get = (code: string): Row => rows[code] ?? EMPTY;
  const patch = (code: string, p: Partial<Row>) => setRows((prev) => ({ ...prev, [code]: { ...(prev[code] ?? EMPTY), ...p } }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alcs;
    return alcs.filter(
      (a) => a.alcCode.toLowerCase().includes(q) || a.alcName.toLowerCase().includes(q) || (a.taluka ?? "").toLowerCase().includes(q)
    );
  }, [alcs, query]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let count = 0;
    const ok = await run(async () => {
      const entries: any[] = [];
      for (const a of alcs) {
        const r = get(a.alcCode);
        if (!r.posted) continue;
        const insta = r.instagram.trim();
        const fb = r.facebook.trim();
        if (r.posted === "Yes") {
          if (!insta || !fb) throw new Error(`ALC ${a.alcCode} (${a.alcName}): both Instagram and Facebook links are required.`);
          if (!isUrl(insta) || !isUrl(fb)) throw new Error(`ALC ${a.alcCode} (${a.alcName}): links must start with http:// or https://`);
        }
        entries.push({
          alcCode: a.alcCode,
          alcName: a.alcName,
          postedOnSocialMedia: r.posted === "Yes",
          instagramLink: r.posted === "Yes" ? insta : "",
          facebookLink: r.posted === "Yes" ? fb : "",
        });
      }
      if (entries.length === 0) throw new Error("Select Yes or No for at least one ALC.");
      if (!window.confirm(`Submit social media details for ${entries.length} ALC${entries.length > 1 ? "s" : ""}?`)) {
        throw new Error("Submission cancelled.");
      }

      const res = await fetch("/api/dcu/submissions/bulk-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const text = await res.text();
      let json: any = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || `Request failed with status ${res.status}.`);
      }
      if (!res.ok) throw new Error(json.error || "Submission failed.");
      count = entries.length;
    }, "Submitted for MRCU review.");
    if (ok) {
      setRows({});
      setQuery("");
      onSubmitted();
    }
    void count;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-xs font-semibold text-slate-500 shrink-0">Search ALC</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ALC code, name or taluka…"
          className={`${inputClass} !mt-0`}
          autoComplete="off"
        />
      </div>

      <div className="-mx-5 md:-mx-7 max-h-[34rem] overflow-auto border-y border-slate-300">
        <table className="w-full table-fixed border-collapse text-sm min-w-[900px]">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "23%" }} />
            <col style={{ width: "23%" }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-slate-100 text-left text-xs font-semibold text-slate-600">
            <tr>
              <th className={HEAD}>ALC Center Code</th>
              <th className={HEAD}>ALC Name</th>
              <th className={HEAD}>ALC Taluka</th>
              <th className={HEAD}>Posted on Social Media?</th>
              <th className={HEAD}>Instagram Link</th>
              <th className={HEAD}>Facebook Link</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const r = get(a.alcCode);
              const yes = r.posted === "Yes";
              return (
                <tr key={a.alcCode}>
                  <td className={`${CELL} px-3 font-semibold text-slate-800`}>{a.alcCode}</td>
                  <td className={`${CELL} px-3 text-slate-700`}>{a.alcName}</td>
                  <td className={`${CELL} px-3 text-slate-500`}>{a.taluka || ""}</td>
                  <td className={CELL}>
                    <div className="flex gap-1.5">
                      {(["Yes", "No"] as YesNo[]).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => patch(a.alcCode, opt === "No" ? { posted: "No", instagram: "", facebook: "" } : { posted: "Yes" })}
                          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
                            r.posted === opt
                              ? "bg-brand-gradient text-white border-transparent"
                              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className={CELL}>
                    <input
                      value={r.instagram}
                      onChange={(e) => patch(a.alcCode, { instagram: e.target.value })}
                      disabled={!yes}
                      placeholder="https://instagram.com/..."
                      className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 disabled:text-slate-400 disabled:bg-slate-100"
                    />
                  </td>
                  <td className={CELL}>
                    <input
                      value={r.facebook}
                      onChange={(e) => patch(a.alcCode, { facebook: e.target.value })}
                      disabled={!yes}
                      placeholder="https://facebook.com/..."
                      className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 disabled:text-slate-400 disabled:bg-slate-100"
                    />
                  </td>
                </tr>
              );
            })}
            {alcs.length > 0 && filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-400 border border-slate-300">
                  No ALC matches “{query}”.
                </td>
              </tr>
            ) : null}
            {alcs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-400 border border-slate-300">
                  Loading ALCs…
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <FormFooter loading={loading} message={message} />
    </form>
  );
}
