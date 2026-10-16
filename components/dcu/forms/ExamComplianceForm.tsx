"use client";

import { useEffect, useMemo, useState } from "react";
import { CCTV_OBSERVATIONS, EXAM_EVENTS, ExamEvent, isEventConducted, normalizeEvent } from "@/lib/dcuOptions";
import type { Alc } from "../AlcSelect";
import { latestByAlc } from "../constants";
import { upsertRow } from "../api";
import AlcGridFrame, { CELL, HEAD } from "../AlcGridFrame";
import { useFormSubmit } from "../ui";
import { EditToggle, Glyph, SubmitBar } from "../../shared/kit";

type Grid = Record<string, boolean>;

function savedGrid(s: any): Grid {
  const g: Grid = {};
  if (Array.isArray(s?.examGrid)) {
    for (const x of s.examGrid) {
      const ev = normalizeEvent(x.event);
      if (ev) g[ev] = !!x.submitted;
    }
  } else if (Array.isArray(s?.examEvents)) {
    for (const e of s.examEvents) {
      const ev = normalizeEvent(e);
      if (ev) g[ev] = true;
    }
  }
  return g;
}

const LEGEND = (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
    <span className="flex items-center gap-1.5"><Glyph kind="yes" /> CCTV submitted</span>
    <span className="flex items-center gap-1.5"><Glyph kind="no" /> CCTV not submitted</span>
    <span className="flex items-center gap-1.5"><Glyph kind="na" /> Examination not allotted</span>
    <span className="flex items-center gap-1.5"><Glyph kind="pending" /> Event pending or not yet conducted</span>
  </div>
);

/**
 * Examination Compliances — two pages.
 *  Page 1: CCTV submitted / not submitted for every allotted examination event (one click per cell), then Submit.
 *  Page 2: General Observations — same ALC data (read-only) + one Bad…Best rating per ALC, then Submit.
 */
export default function ExamComplianceForm({ alcs, submissions, onSubmitted }: { alcs: Alc[]; submissions: any[]; onSubmitted: () => void }) {
  const [allot, setAllot] = useState<Record<string, ExamEvent[]>>({});
  const [configured, setConfigured] = useState(true);
  const [page, setPage] = useState<1 | 2>(1);
  const [grids, setGrids] = useState<Record<string, Grid>>({});
  const [obs, setObs] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [savingRow, setSavingRow] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const { loading, message, setMessage, run } = useFormSubmit();
  const latest = useMemo(() => latestByAlc(submissions, "exam_compliance"), [submissions]);
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    fetch("/api/dcu/allotments")
      .then((r) => r.json())
      .then((d) => {
        setAllot(d.allotments ?? {});
        setConfigured(!!d.configured);
      })
      .catch(() => {});
  }, []);

  const allottedOf = (code: string): ExamEvent[] => (configured ? allot[code] ?? [] : [...EXAM_EVENTS]);
  const eligibleOf = (code: string) => allottedOf(code).filter((e) => isEventConducted(e, now));

  /** Current CCTV tick-state for an ALC: draft if touched, else what was saved, else all "not submitted". */
  function gridOf(a: Alc): Grid {
    if (grids[a.alcCode]) return grids[a.alcCode];
    const saved = savedGrid(latest.get(a.alcCode));
    const g: Grid = {};
    for (const e of eligibleOf(a.alcCode)) g[e] = saved[e] === true;
    return g;
  }
  const obsOf = (a: Alc) => obs[a.alcCode] ?? latest.get(a.alcCode)?.cctvObservation ?? "";

  /** Saved ALCs are locked (pencil to edit); ALCs without saved data are always open. */
  const isOpen = (a: Alc) => !latest.get(a.alcCode) || editing[a.alcCode] === true;
  const pencil = (a: Alc) =>
    latest.get(a.alcCode) ? (
      <EditToggle
        editing={editing[a.alcCode] === true}
        saving={savingRow === a.alcCode}
        onSave={() => submitAll(a)}
        onEdit={() => { setMessage(null); setEditing((p) => ({ ...p, [a.alcCode]: true })); }}
        onCancel={() => {
          setEditing((p) => { const n = { ...p }; delete n[a.alcCode]; return n; });
          setGrids((p) => { const n = { ...p }; delete n[a.alcCode]; return n; });
          setObs((p) => { const n = { ...p }; delete n[a.alcCode]; return n; });
        }}
      />
    ) : null;

  function toggle(a: Alc, ev: ExamEvent) {
    const g = gridOf(a);
    setMessage(null);
    setGrids((p) => ({ ...p, [a.alcCode]: { ...g, [ev]: !g[ev] } }));
  }

  /** One cell of the examination grid. `editable` = page 1 (click to toggle); page 2 is read-only. */
  function cell(a: Alc, ev: ExamEvent, editable: boolean) {
    const td = `${CELL} text-center`;
    if (!allottedOf(a.alcCode).includes(ev)) return <td key={ev} className={td}><Glyph kind="na" /></td>;
    if (!isEventConducted(ev, now)) return <td key={ev} className={td}><span className="inline-flex"><Glyph kind="pending" /></span></td>;
    const val = gridOf(a)[ev] === true;
    return (
      <td key={ev} className={td}>
        {editable && isOpen(a) ? (
          <button type="button" title="Click to change" onClick={() => toggle(a, ev)} className="rounded-full ring-2 ring-transparent hover:ring-brand-orange/50">
            <Glyph kind={val ? "yes" : "no"} />
          </button>
        ) : (
          <span className="inline-flex"><Glyph kind={val ? "yes" : "no"} /></span>
        )}
      </td>
    );
  }

  const eventHeads = EXAM_EVENTS.map((e) => <th key={e} className={`${HEAD} text-center`}>{e}</th>);

  function goToObservations() {
    setMessage(null);
    setDone(false);
    setPage(2);
  }

  async function submitAll(only?: Alc) {
    const rowRun = only ? async (t: () => Promise<void>, ok?: string) => { setSavingRow(only.alcCode); const r = await run(t, ok); setSavingRow(null); return r; } : run;
    await rowRun(async () => {
      const todo = only ? [only] : alcs.filter((a) => isOpen(a));
      if (todo.length === 0) throw new Error("Click the pencil on an ALC to edit it, then submit.");
      const missing = todo.filter((a) => !obsOf(a));
      if (missing.length) {
        throw new Error(`Select the observation for ${missing.length} ALC${missing.length > 1 ? "s" : ""}: ${missing.slice(0, 3).map((a) => a.alcName).join(", ")}${missing.length > 3 ? "…" : ""}`);
      }
      for (const a of todo) {
        const g = gridOf(a);
        await upsertRow({
          parameterType: "exam_compliance",
          alcCode: a.alcCode,
          alcName: a.alcName,
          grid: eligibleOf(a.alcCode).map((event) => ({ event, submitted: g[event] === true })),
          observation: obsOf(a),
        });
      }
      const clear = <T,>(p: Record<string, T>): Record<string, T> => { if (!only) return {}; const n = { ...p }; delete n[only.alcCode]; return n; };
      setGrids(clear);
      setObs(clear);
      setEditing(clear);
      setDone(true);
      onSubmitted();
    }, "Examination compliance submitted for MRCU review.");
  }

  /* ---------------- Page 2 : General Observations ---------------- */
  if (page === 2) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">General Observations</h3>
          <p className="text-sm text-slate-500 mt-0.5">Select one overall rating per ALC. It is entered once, whether the ALC conducted two examinations or seven.</p>
        </div>
        <AlcGridFrame
          alcs={alcs}
          minWidth={1100}
          sortAtTopRight
          top={LEGEND}
          head={
            <tr>
              <th className={HEAD}>ALC Code</th>
              <th className={HEAD}>ALC Name</th>
              {eventHeads}
              <th className={HEAD}>General Observation</th>
              <th className={HEAD}>Action</th>
            </tr>
          }
        >
          {(rows) =>
            rows.map((a) => (
              <tr key={a.alcCode}>
                <td className={`${CELL} px-3 font-semibold text-slate-800`}>{a.alcCode}</td>
                <td className={`${CELL} px-3 text-slate-700`}>{a.alcName}</td>
                {EXAM_EVENTS.map((ev) => cell(a, ev, false))}
                <td className={CELL}>
                  {isOpen(a) ? (
                  <select
                    value={obsOf(a)}
                    onChange={(e) => { setMessage(null); setObs((p) => ({ ...p, [a.alcCode]: e.target.value })); }}
                    className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  >
                    <option value="">Select…</option>
                    {CCTV_OBSERVATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  ) : (
                    <span className="font-semibold text-slate-700">{obsOf(a)}</span>
                  )}
                </td>
                <td className={CELL}>{pencil(a)}</td>
              </tr>
            ))
          }
        </AlcGridFrame>
        <SubmitBar loading={loading} message={message} onSubmit={() => submitAll()} label="Submit" onBack={() => { setMessage(null); setPage(1); }} backLabel="← Back to CCTV" />
        {done ? <p className="text-xs text-slate-400">You can go back and edit any row, then submit again.</p> : null}
      </div>
    );
  }

  /* ---------------- Page 1 : CCTV submission ---------------- */
  return (
    <div className="space-y-4">
      <AlcGridFrame
        alcs={alcs}
        minWidth={1000}
        sortAtTopRight
        top={
          <div className="space-y-2">
            {LEGEND}
            {!configured ? <p className="text-xs rounded-xl bg-amber-50 text-amber-700 px-3 py-2">Examination allotment is not uploaded yet — all examinations are shown as allotted.</p> : null}
          </div>
        }
        head={
          <tr>
            <th className={HEAD}>ALC Code</th>
            <th className={HEAD}>ALC Name</th>
            {eventHeads}
            <th className={HEAD}>Action</th>
          </tr>
        }
      >
        {(rows) =>
          rows.map((a) => (
            <tr key={a.alcCode}>
              <td className={`${CELL} px-3 font-semibold text-slate-800`}>{a.alcCode}</td>
              <td className={`${CELL} px-3 text-slate-700`}>{a.alcName}</td>
              {EXAM_EVENTS.map((ev) => cell(a, ev, true))}
              <td className={CELL}>{pencil(a)}</td>
            </tr>
          ))
        }
      </AlcGridFrame>
      <SubmitBar loading={false} message={message} onSubmit={goToObservations} label="Submit & Continue →" />
    </div>
  );
}
