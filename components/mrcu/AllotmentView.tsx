"use client";

import { useEffect, useState } from "react";
import { CalendarRange, Upload } from "lucide-react";
import { EXAM_EVENTS } from "@/lib/dcuOptions";
import { SectionHeader } from "../shared/kit";

/**
 * Examination allotment manager. Paste one ALC per line:  ALC_CODE, Feb, Apr, Jun
 * Events listed = allotted. Every other event shows "NA" on the DCU screen.
 */
export default function AllotmentView() {
  const [current, setCurrent] = useState<Record<string, string[]>>({});
  const [text, setText] = useState("");
  const [replaceAll, setReplaceAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = () =>
    fetch("/api/mrcu/allotments", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCurrent(d.allotments ?? {}))
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);

  async function upload() {
    const entries = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [alcCode, ...events] = l.split(/[,\t;]+/).map((x) => x.trim()).filter(Boolean);
        return { alcCode, events };
      })
      .filter((e) => e.alcCode && !/^alc/i.test(e.alcCode));
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/mrcu/allotments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries, replaceAll }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed.");
      setMsg({ ok: true, text: `Allotment saved for ${json.count} ALC(s).` });
      setText("");
      load();
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setBusy(false);
    }
  }

  const codes = Object.keys(current).sort();

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<CalendarRange size={22} />}
        title="Examination Allotment"
        description="Tell the system which ALC was allotted which examination. DCUs see NA for every examination that is not listed for their ALC."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Paste allotments (ALC code, then events: {EXAM_EVENTS.join(", ")})
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder={"12345, Feb, Apr, Jul\n12346, Apr, Jun"}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={replaceAll} onChange={(e) => setReplaceAll(e.target.checked)} />
            Replace the whole existing list (otherwise only the pasted ALCs are updated)
          </label>
          {msg ? (
            <p className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>{msg.text}</p>
          ) : null}
          <button
            onClick={upload}
            disabled={busy || !text.trim()}
            className="flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Upload size={16} /> {busy ? "Saving…" : "Save allotment"}
          </button>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Current allotment ({codes.length} ALCs)</p>
          <div className="max-h-96 overflow-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-100 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2.5">ALC</th>
                  <th className="px-3 py-2.5">Allotted examinations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {codes.map((c) => (
                  <tr key={c}>
                    <td className="px-3 py-2 font-semibold text-slate-800">{c}</td>
                    <td className="px-3 py-2 text-slate-600">{current[c].join(", ") || "—"}</td>
                  </tr>
                ))}
                {codes.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-8 text-center text-slate-400">
                      Nothing uploaded yet. Until you do, DCUs see every examination as allotted.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
