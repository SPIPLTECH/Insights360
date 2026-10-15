"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CCTV_OBSERVATIONS, EXAM_EVENTS } from "@/lib/dcuOptions";
import type { Alc } from "../AlcSelect";
import { FormFooter, inputClass, useFormSubmit } from "../ui";

type YesNo = "Yes" | "No";
type CctvRow = { submitted: YesNo | ""; events: string[] };

const CELL = "px-2 py-1.5 border border-slate-300";
const HEAD = "px-3 py-2 border border-slate-300";
const DRAFT_KEY = "dcu_exam_compliance_draft";

async function postBulk(part: 1 | 2, entries: any[]) {
  const res = await fetch("/api/dcu/submissions/bulk-exam", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ part, entries }),
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || `Request failed with status ${res.status}.`);
  }
  if (!res.ok) throw new Error(json.error || "Submission failed.");
}

/**
 * Examination Compliance CCTV — 2 pages, bulk entry (each part is worth 12.5 of 25).
 *  Part 1: per ALC -> CCTV Submitted (Yes/No) + exam events.   [Submit] -> [NEXT General Observations]
 *  Part 2: per ALC -> General Observation (Bad … Best).         [Submit]
 * Whatever the DCU has entered stays stored (in this browser tab) while moving between pages / tabs.
 */
export default function ExamComplianceForm({ alcs, onSubmitted }: { alcs: Alc[]; onSubmitted: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [cctv, setCctv] = useState<Record<string, CctvRow>>({});
  const [obs, setObs] = useState<Record<string, string>>({});
  const [part1Done, setPart1Done] = useState(false);
  const [query, setQuery] = useState("");
  const loaded = useRef(false);
  const f1 = useFormSubmit();
  const f2 = useFormSubmit();

  // restore draft
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setCctv(d.cctv ?? {});
        setObs(d.obs ?? {});
        setPart1Done(!!d.part1Done);
        setStep(d.step === 2 && d.part1Done ? 2 : 1);
      }
    } catch {}
    loaded.current = true;
  }, []);

  // save draft
  useEffect(() => {
    if (!loaded.current) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ cctv, obs, part1Done, step }));
    } catch {}
  }, [cctv, obs, part1Done, step]);

  const getC = (code: string): CctvRow => cctv[code] ?? { submitted: "", events: [] };
  const patchC = (code: string, p: Partial<CctvRow>) => {
    setCctv((prev) => ({ ...prev, [code]: { ...(prev[code] ?? { submitted: "", events: [] }), ...p } }));
    setPart1Done(false); // changed after submit -> must be submitted again before NEXT
    f1.setMessage(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alcs;
    return alcs.filter(
      (a) => a.alcCode.toLowerCase().includes(q) || a.alcName.toLowerCase().includes(q) || (a.taluka ?? "").toLowerCase().includes(q)
    );
  }, [alcs, query]);

  async function submitPart1(e: React.FormEvent) {
    e.preventDefault();
    const ok = await f1.run(async () => {
      const entries: any[] = [];
      for (const a of alcs) {
        const r = getC(a.alcCode);
        if (!r.submitted) continue;
        if (r.submitted === "Yes" && r.events.length === 0) {
          throw new Error(`ALC ${a.alcCode} (${a.alcName}): select at least one exam event.`);
        }
        entries.push({
          alcCode: a.alcCode,
          alcName: a.alcName,
          cctvSubmitted: r.submitted === "Yes",
          examEvents: r.submitted === "Yes" ? r.events : [],
        });
      }
      if (entries.length === 0) throw new Error("Select Yes or No for at least one ALC.");
      if (!window.confirm(`Submit CCTV details for ${entries.length} ALC${entries.length > 1 ? "s" : ""}?`)) {
        throw new Error("Submission cancelled.");
      }
      await postBulk(1, entries);
    }, "CCTV details submitted. Click NEXT to fill the General Observations.");
    if (ok) {
      setPart1Done(true);
      onSubmitted();
    }
  }

  async function submitPart2(e: React.FormEvent) {
    e.preventDefault();
    const ok = await f2.run(async () => {
      const entries = alcs
        .filter((a) => obs[a.alcCode])
        .map((a) => ({ alcCode: a.alcCode, alcName: a.alcName, observation: obs[a.alcCode] }));
      if (entries.length === 0) throw new Error("Select a General Observation for at least one ALC.");
      if (!window.confirm(`Submit General Observations for ${entries.length} ALC${entries.length > 1 ? "s" : ""}?`)) {
        throw new Error("Submission cancelled.");
      }
      await postBulk(2, entries);
    }, "General Observations submitted for MRCU review.");
    if (ok) onSubmitted();
  }

  const search = (
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
  );

  const emptyRows = (cols: number) =>
    alcs.length === 0 ? (
      <tr>
        <td colSpan={cols} className="px-3 py-6 text-center text-slate-400 border border-slate-300">
          Loading ALCs…
        </td>
      </tr>
    ) : filtered.length === 0 ? (
      <tr>
        <td colSpan={cols} className="px-3 py-6 text-center text-slate-400 border border-slate-300">
          No ALC matches “{query}”.
        </td>
      </tr>
    ) : null;

  const stepper = (
    <div className="flex flex-wrap gap-2 text-xs font-semibold">
      <span className={`px-3 py-1.5 rounded-lg ${step === 1 ? "bg-brand-gradient text-white" : "bg-slate-100 text-slate-500"}`}>
        1 · CCTV Submitted
      </span>
      <span className={`px-3 py-1.5 rounded-lg ${step === 2 ? "bg-brand-gradient text-white" : "bg-slate-100 text-slate-500"}`}>
        2 · General Observations
      </span>
    </div>
  );

  // ------------------------------------------------------------ PART 1
  if (step === 1) {
    return (
      <form onSubmit={submitPart1} className="space-y-3">
        {stepper}
        {search}

        <div className="-mx-5 md:-mx-7 max-h-[34rem] overflow-auto border-y border-slate-300">
          <table className="w-full table-fixed border-collapse text-sm min-w-[1000px]">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "48%" }} />
            </colgroup>
            <thead className="sticky top-0 z-10 bg-slate-100 text-left text-xs font-semibold text-slate-600">
              <tr>
                <th className={HEAD}>ALC Code</th>
                <th className={HEAD}>ALC Name</th>
                <th className={HEAD}>Taluka</th>
                <th className={HEAD}>CCTV Submitted (Yes/No)</th>
                <th className={HEAD}>Select Exam Events</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const r = getC(a.alcCode);
                const yes = r.submitted === "Yes";
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
                            onClick={() =>
                              r.submitted === opt
                                ? patchC(a.alcCode, { submitted: "", events: [] }) // click again = deselect
                                : patchC(a.alcCode, opt === "No" ? { submitted: "No", events: [] } : { submitted: "Yes" })
                            }
                            className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
                              r.submitted === opt
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
                      <div className="flex flex-wrap gap-1.5">
                        {EXAM_EVENTS.map((ev) => {
                          const on = r.events.includes(ev);
                          return (
                            <button
                              key={ev}
                              type="button"
                              disabled={!yes}
                              onClick={() =>
                                patchC(a.alcCode, { events: on ? r.events.filter((x) => x !== ev) : [...r.events, ev] })
                              }
                              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300 disabled:border-slate-200 ${
                                on
                                  ? "bg-brand-gradient text-white border-transparent"
                                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              {ev}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {emptyRows(5)}
            </tbody>
          </table>
        </div>

        <FormFooter loading={f1.loading} message={f1.message} />

        {part1Done ? (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl px-6 py-2.5 transition-colors"
          >
            NEXT · General Observations →
          </button>
        ) : null}
      </form>
    );
  }

  // ------------------------------------------------------------ PART 2
  return (
    <form onSubmit={submitPart2} className="space-y-3">
      {stepper}
      {search}

      <div className="-mx-5 md:-mx-7 max-h-[34rem] overflow-auto border-y border-slate-300">
        <table className="w-full table-fixed border-collapse text-sm min-w-[900px]">
          <colgroup>
            <col style={{ width: "11%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "52%" }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-slate-100 text-left text-xs font-semibold text-slate-600">
            <tr>
              <th className={HEAD}>ALC Code</th>
              <th className={HEAD}>ALC Name</th>
              <th className={HEAD}>Taluka</th>
              <th className={HEAD}>General Observations</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.alcCode}>
                <td className={`${CELL} px-3 font-semibold text-slate-800`}>{a.alcCode}</td>
                <td className={`${CELL} px-3 text-slate-700`}>{a.alcName}</td>
                <td className={`${CELL} px-3 text-slate-500`}>{a.taluka || ""}</td>
                <td className={CELL}>
                  <div className="flex gap-1.5">
                    {CCTV_OBSERVATIONS.map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => {
                          setObs((prev) => {
                            const next = { ...prev };
                            if (prev[a.alcCode] === o) delete next[a.alcCode]; // click again = deselect
                            else next[a.alcCode] = o;
                            return next;
                          });
                          f2.setMessage(null);
                        }}
                        className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
                          obs[a.alcCode] === o
                            ? "bg-brand-gradient text-white border-transparent"
                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {emptyRows(4)}
          </tbody>
        </table>
      </div>

      <FormFooter loading={f2.loading} message={f2.message} />

      <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
        ← Back to CCTV Submitted
      </button>
    </form>
  );
}
