"use client";

import { useMemo, useState } from "react";
import { SOCIAL_PRESENCE_OPTIONS } from "@/lib/dcuOptions";
import type { Alc } from "../AlcSelect";
import { latestByAlc } from "../constants";
import { upsertRow } from "../api";
import AlcGridFrame, { AlcCells, CELL, HEAD } from "../AlcGridFrame";
import { EditToggle, SubmitBar } from "../../shared/kit";
import { useFormSubmit } from "../ui";

type Draft = { presence: string; instagram: string; facebook: string };
const EMPTY: Draft = { presence: "", instagram: "", facebook: "" };

const Link = ({ href }: { href?: string }) =>
  href ? <a href={href} target="_blank" rel="noreferrer" className="text-brand-orange underline text-xs font-semibold">Open link</a> : <span className="text-slate-300">—</span>;

const linkInput =
  "w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40";

/** Social Media Presence — Instagram, Facebook, then Presence (Regular 25 / Irregular 12.5). New row: fill + tick; saved row: pencil. */
export default function SocialMediaForm({ alcs, submissions, onSubmitted }: { alcs: Alc[]; submissions: any[]; onSubmitted: () => void }) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [savingRow, setSavingRow] = useState<string | null>(null);
  const { loading, message, setMessage, run } = useFormSubmit();
  const latest = useMemo(() => latestByAlc(submissions, "social_media"), [submissions]);

  const initial = (a: Alc): Draft => {
    const s = latest.get(a.alcCode);
    return s ? { presence: s.socialPresence ?? "", instagram: s.instagramLink ?? "", facebook: s.facebookLink ?? "" } : EMPTY;
  };

  const setDraft = (code: string, d: Draft) => { setMessage(null); setDrafts((p) => ({ ...p, [code]: d })); };

  /** One Submit for the whole table: only new / changed rows are sent. */
  async function submitAll(only?: Alc) {
    const rowRun = only ? async (t: () => Promise<void>, ok?: string) => { setSavingRow(only.alcCode); const r = await run(t, ok); setSavingRow(null); return r; } : run;
    await rowRun(async () => {
      const todo = only ? [only] : alcs.filter((a) => a.alcCode in drafts);
      if (todo.length === 0) throw new Error("Fill at least one ALC row before submitting.");
      for (const a of todo) {
        if (!(drafts[a.alcCode] ?? initial(a)).presence) throw new Error(`${a.alcName}: select Regular or Irregular.`);
      }
      for (const a of todo) {
        const d = drafts[a.alcCode] ?? initial(a);
        await upsertRow({ parameterType: "social_media", alcCode: a.alcCode, alcName: a.alcName, presence: d.presence, instagramLink: d.instagram, facebookLink: d.facebook });
      }
      setDrafts((p) => { if (!only) return {}; const n = { ...p }; delete n[only.alcCode]; return n; });
      onSubmitted();
    }, "Social media presence submitted for MRCU review.");
  }

  return (
    <div className="space-y-4">
    <AlcGridFrame
      alcs={alcs}
      minWidth={1000}
      sortAtTopRight
      head={
        <tr>
          <th className={HEAD}>ALC Center Code</th>
          <th className={HEAD}>ALC Name</th>
          <th className={HEAD}>ALC Taluka</th>
          <th className={HEAD}>Instagram Link</th>
          <th className={HEAD}>Facebook Link</th>
          <th className={HEAD}>Presence on Social Media?</th>
          <th className={HEAD}>Action</th>
        </tr>
      }
    >
      {(rows) =>
        rows.map((a) => {
          const s = latest.get(a.alcCode);
          const editing = !s || a.alcCode in drafts;
          const d = drafts[a.alcCode] ?? initial(a);
          return (
            <tr key={a.alcCode}>
              <AlcCells a={a} />
              <td className={CELL}>
                {editing ? <input value={d.instagram} onChange={(e) => setDraft(a.alcCode, { ...d, instagram: e.target.value })} placeholder="https://instagram.com/..." className={linkInput} /> : <Link href={s?.instagramLink} />}
              </td>
              <td className={CELL}>
                {editing ? <input value={d.facebook} onChange={(e) => setDraft(a.alcCode, { ...d, facebook: e.target.value })} placeholder="https://facebook.com/..." className={linkInput} /> : <Link href={s?.facebookLink} />}
              </td>
              <td className={CELL}>
                {editing ? (
                  <div className="flex gap-1.5">
                    {SOCIAL_PRESENCE_OPTIONS.map((o) => (
                      <button key={o} type="button" onClick={() => setDraft(a.alcCode, { ...d, presence: o })}
                        className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${d.presence === o ? "bg-brand-gradient text-white border-transparent" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>
                        {o}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="font-semibold text-slate-700">{s?.socialPresence ?? "—"}</span>
                )}
              </td>
              <td className={CELL}>
                {s ? <EditToggle editing={editing} saving={savingRow === a.alcCode} onSave={() => submitAll(a)} onEdit={() => setDraft(a.alcCode, initial(a))} onCancel={() => setDrafts((p) => { const n = { ...p }; delete n[a.alcCode]; return n; })} /> : null}
              </td>
            </tr>
          );
        })
      }
    </AlcGridFrame>
    <SubmitBar loading={loading} message={message} onSubmit={() => submitAll()} />
    </div>
  );
}
