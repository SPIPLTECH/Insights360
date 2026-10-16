"use client";

import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { EXAM_EVENTS, ExamEvent } from "@/lib/dcuOptions";
import type { Alc } from "../AlcSelect";
import AlcGridFrame, { CELL, HEAD } from "../AlcGridFrame";
import { useFormSubmit } from "../ui";
import { EditToggle, SubmitBar } from "../../shared/kit";

/**
 * Exam Event Allotment — the DCU marks, for every ALC of the district, which examination events were allotted.
 * Empty box = not allotted (shows "NA" in Examination Compliances); red filled box with a tick = allotted.
 */
export default function ExamAllotmentForm({ alcs, onSaved }: { alcs: Alc[]; onSaved?: () => void }) {
  const [saved, setSaved] = useState<Record<string, ExamEvent[]>>({});
  const [drafts, setDrafts] = useState<Record<string, ExamEvent[]>>({});
  const [loaded, setLoaded] = useState(false);
  const [savingRow, setSavingRow] = useState<string | null>(null);
  const { loading, message, setMessage, run } = useFormSubmit();

  const load = useCallback(() => {
    fetch("/api/dcu/allotments")
      .then((r) => r.json())
      .then((d) => setSaved(d.allotments ?? {}))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);
  useEffect(load, [load]);

  /** Locked (pencil) only when events were actually allotted and saved. ALCs with nothing allotted stay open. */
  const isSaved = (code: string) => (saved[code]?.length ?? 0) > 0;
  const isOpen = (code: string) => !isSaved(code) || code in drafts;
  const eventsOf = (code: string): ExamEvent[] => drafts[code] ?? saved[code] ?? [];

  function toggle(code: string, ev: ExamEvent) {
    const cur = eventsOf(code);
    setMessage(null);
    setDrafts((p) => ({ ...p, [code]: cur.includes(ev) ? cur.filter((e) => e !== ev) : [...cur, ev] }));
  }

  /** Saves one row (`only`) or, with no argument, every row that is new or being edited. */
  async function submit(only?: Alc) {
    const rowRun = only
      ? async (t: () => Promise<void>, ok?: string) => {
          setSavingRow(only.alcCode);
          const r = await run(t, ok);
          setSavingRow(null);
          return r;
        }
      : run;
    await rowRun(async () => {
      let todo = only ? [only] : alcs.filter((a) => (a.alcCode in drafts) || (isOpen(a.alcCode) && eventsOf(a.alcCode).length > 0));
      // Nothing ticked anywhere and nothing saved yet: save every ALC as "not allotted" so the district is marked as submitted.
      if (todo.length === 0 && !only && Object.keys(saved).length === 0) todo = alcs;
      if (todo.length === 0) throw new Error("Tick at least one examination, or click the pencil on an ALC to change it.");
      const res = await fetch("/api/dcu/allotments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: todo.map((a) => ({ alcCode: a.alcCode, events: eventsOf(a.alcCode) })) }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save the allotment.");
      setDrafts((p) => {
        if (!only) return {};
        const n = { ...p };
        delete n[only.alcCode];
        return n;
      });
      load();
      onSaved?.();
    }, "Examination allotment saved.");
  }

  return (
    <div className="space-y-4">
      <AlcGridFrame
        alcs={alcs}
        minWidth={1000}
        sortAtTopRight
        top={
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-rose-500 text-white"><Check size={13} strokeWidth={3.5} /></span> Tick for Examination Event allotted
            </span>
            <span className="flex items-center gap-1.5">
             
            </span>
          </div>
        }
        head={
          <tr>
            <th className={HEAD}>ALC Code</th>
            <th className={HEAD}>ALC Name</th>
            {EXAM_EVENTS.map((e) => (
              <th key={e} className={`${HEAD} text-center`}>{e}</th>
            ))}
            <th className={HEAD}>Action</th>
          </tr>
        }
      >
        {(rows) =>
          rows.map((a) => {
            const open = isOpen(a.alcCode);
            const cur = eventsOf(a.alcCode);
            return (
              <tr key={a.alcCode}>
                <td className={`${CELL} px-3 font-semibold text-slate-800`}>{a.alcCode}</td>
                <td className={`${CELL} px-3 text-slate-700`}>{a.alcName}</td>
                {EXAM_EVENTS.map((ev) => {
                  const on = cur.includes(ev);
                  return (
                    <td key={ev} className={`${CELL} text-center`}>
                      <button
                        type="button"
                        disabled={!open || !loaded}
                        onClick={() => toggle(a.alcCode, ev)}
                        aria-pressed={on}
                        title={open ? (on ? "Allotted — click to remove" : "Click to mark as allotted") : on ? "Allotted" : "Not allotted"}
                        className={`mx-auto grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                          on ? "bg-rose-500 text-white" : "border-2 border-slate-300 bg-white"
                        } ${open ? (on ? "hover:bg-rose-600" : "hover:border-rose-400") : "cursor-default opacity-90"}`}
                      >
                        {on ? <Check size={17} strokeWidth={3.5} /> : null}
                      </button>
                    </td>
                  );
                })}
                <td className={CELL}>
                  {isSaved(a.alcCode) ? (
                    <EditToggle
                      editing={open}
                      saving={savingRow === a.alcCode}
                      onSave={() => submit(a)}
                      onEdit={() => { setMessage(null); setDrafts((p) => ({ ...p, [a.alcCode]: [...(saved[a.alcCode] ?? [])] })); }}
                      onCancel={() => setDrafts((p) => { const n = { ...p }; delete n[a.alcCode]; return n; })}
                    />
                  ) : null}
                </td>
              </tr>
            );
          })
        }
      </AlcGridFrame>
      <SubmitBar loading={loading} message={message} onSubmit={() => submit()} />
    </div>
  );
}
