"use client";

import { useEffect, useMemo, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import type { Alc } from "../AlcSelect";
import { latestByAlc } from "../constants";
import { upsertRow } from "../api";
import AlcGridFrame, { AlcCells, CELL, HEAD } from "../AlcGridFrame";
import { Field } from "../ui";
import { EditToggle, NoticeModal, SubmitBar } from "../../shared/kit";
import { useFormSubmit } from "../ui";

const MAX_MEETINGS = 15;
type Draft = { attended: string };

/** Meeting Attendance — total once, then type attended per ALC and tick to save. Saved rows show a pencil. */
export default function MeetingAttendanceForm({ alcs, submissions, onSubmitted }: { alcs: Alc[]; submissions: any[]; onSubmitted: () => void }) {
  const [total, setTotal] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [savingRow, setSavingRow] = useState<string | null>(null);
  const { loading, message, setMessage, run } = useFormSubmit();
  const latest = useMemo(() => latestByAlc(submissions, "meeting_attendance"), [submissions]);

  useEffect(() => {
    if (total) return;
    const any = Array.from(latest.values()).find((s) => s.totalMeetings);
    if (any) setTotal(String(any.totalMeetings));
  }, [latest, total]);

  const totalN = Number(total);
  const hasTotal = Number.isInteger(totalN) && totalN > 0;

  function handleTotal(v: string) {
    if (v === "") return setTotal("");
    const n = Math.max(0, Math.floor(Number(v)));
    if (n > MAX_MEETINGS) {
      setNotice(`You have entered more than ${MAX_MEETINGS} meetings conducted/scheduled. Please enter the correct no. of meetings.`);
      return;
    }
    setTotal(String(n));
  }

  /** One Submit for the whole table: only new / changed rows are sent. */
  async function submitAll(only?: Alc) {
    const rowRun = only ? async (t: () => Promise<void>, ok?: string) => { setSavingRow(only.alcCode); const r = await run(t, ok); setSavingRow(null); return r; } : run;
    await rowRun(async () => {
      if (!hasTotal) throw new Error("Enter total meetings first.");
      const todo = only ? [only] : alcs.filter((a) => a.alcCode in drafts && drafts[a.alcCode].attended !== "");
      if (todo.length === 0) throw new Error("Enter meetings attended for at least one ALC.");
      for (const a of todo) {
        if ((drafts[a.alcCode]?.attended ?? "") === "") throw new Error(`${a.alcName}: enter meetings attended.`);
        const n = Number(drafts[a.alcCode]?.attended);
        if (!Number.isInteger(n) || n < 0 || n > totalN) throw new Error(`${a.alcName}: enter 0 to ${totalN}.`);
      }
      let url = uploadedUrl;
      if (file && !url) {
        url = await uploadToCloudinary(file);
        setUploadedUrl(url);
      }
      for (const a of todo) {
        await upsertRow({ parameterType: "meeting_attendance", alcCode: a.alcCode, alcName: a.alcName, totalMeetings: totalN, attendedMeetings: Number(drafts[a.alcCode].attended), ...(url ? { fileUrls: [url] } : {}) });
      }
      setDrafts((p) => { if (!only) return {}; const n = { ...p }; delete n[only.alcCode]; return n; });
      onSubmitted();
    }, "Meeting attendance submitted for MRCU review.");
  }

  return (
    <div className="space-y-4">
    <AlcGridFrame
      alcs={alcs}
      minWidth={800}
      sortAtTopRight
      top={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="total-meetings" className="text-sm font-bold text-slate-800">Total No. of Meetings Conducted/Scheduled?</label>
            <input id="total-meetings" type="number" min={1} max={MAX_MEETINGS} step={1} value={total} onChange={(e) => handleTotal(e.target.value)} placeholder={`1-${MAX_MEETINGS}`}
              className="w-16 border border-slate-400 rounded-lg px-2 py-1 text-sm font-bold text-slate-900 text-center bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
          </div>
        </div>
      }
      head={
        <tr>
          <th className={HEAD}>ALC Center Code</th>
          <th className={HEAD}>ALC Name</th>
          <th className={HEAD}>ALC Taluka</th>
          <th className={`${HEAD} text-center`}>No. of Meetings Attended</th>
          <th className={HEAD}>Action</th>
        </tr>
      }
    >
      {(rows) =>
        rows.map((a) => {
          const s = latest.get(a.alcCode);
          const editing = !s || a.alcCode in drafts;
          const d = drafts[a.alcCode] ?? { attended: s ? String(s.attendedMeetings ?? "") : "" };
          return (
            <tr key={a.alcCode}>
              <AlcCells a={a} />
              <td className={`${CELL} text-center`}>
                {editing ? (
                  <input type="number" min={0} max={hasTotal ? totalN : undefined} step={1} value={d.attended} disabled={!hasTotal} placeholder="—"
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v !== "" && Math.floor(Number(v)) > totalN) {
                        setNotice(`Meetings attended cannot be more than the ${totalN} meetings conducted/scheduled. Please enter the correct no. of meetings.`);
                        return;
                      }
                      setMessage(null);
                      setDrafts((p) => ({ ...p, [a.alcCode]: { attended: v === "" ? "" : String(Math.max(0, Math.floor(Number(v)))) } }));
                    }}
                    className="w-16 mx-auto block border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-center bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 disabled:text-slate-400" />
                ) : (
                  <span className="font-semibold text-slate-800">{s.attendedMeetings} <span className="font-normal text-slate-400">of {s.totalMeetings}</span></span>
                )}
              </td>
              <td className={CELL}>
                {s ? <EditToggle editing={editing} saving={savingRow === a.alcCode} onSave={() => submitAll(a)} onEdit={() => setDrafts((p) => ({ ...p, [a.alcCode]: { attended: String(s.attendedMeetings ?? "") } }))} onCancel={() => setDrafts((p) => { const n = { ...p }; delete n[a.alcCode]; return n; })} /> : null}
              </td>
            </tr>
          );
        })
      }
    </AlcGridFrame>
    <div className="max-w-md">
      <Field label="Upload Attendance Sheet (Optional)">
        <input type="file" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setUploadedUrl(null); }}
          className="mt-1 w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-600 hover:file:bg-slate-200" />
      </Field>
    </div>
    <SubmitBar loading={loading} message={message} onSubmit={() => submitAll()} />
    <NoticeModal message={notice} onClose={() => setNotice(null)} />
    </div>
  );
}
