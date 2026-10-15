"use client";

import { useState } from "react";
import AlcSelect, { Alc } from "../AlcSelect";
import { postSubmission } from "../api";
import { FormFooter, useFormSubmit } from "../ui";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const blankRow = () => ({ month: "", mscitAdmissions: "", klicAdmissions: "" });

/** Monthly Enrolment Consistency — same fields/logic that were already live. */
export default function MonthlyEnrolmentForm({ alcs, onSubmitted }: { alcs: Alc[]; onSubmitted: () => void }) {
  const [alcCode, setAlcCode] = useState("");
  const [months, setMonths] = useState([blankRow()]);
  const { loading, message, run } = useFormSubmit();

  const update = (i: number, patch: Partial<ReturnType<typeof blankRow>>) =>
    setMonths((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await run(async () => {
      const alc = alcs.find((a) => a.alcCode === alcCode);
      if (!alc) throw new Error("Please select an ALC first.");
      const cleaned = months
        .filter((m) => m.month)
        .map((m) => ({
          month: m.month,
          mscitAdmissions: Number(m.mscitAdmissions || 0),
          klicAdmissions: Number(m.klicAdmissions || 0),
        }));
      if (cleaned.length === 0) throw new Error("Add at least one month's data.");

      await postSubmission({
        alcCode: alc.alcCode,
        alcName: alc.alcName,
        parameterType: "monthly_enrolment",
        months: cleaned,
        fileUrls: [],
      });
    });
    if (ok) {
      setAlcCode("");
      setMonths([blankRow()]);
      onSubmitted();
    }
  }

  const cellClass =
    "mt-1 w-full border border-slate-200 rounded-xl px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      <AlcSelect alcs={alcs} value={alcCode} onChange={setAlcCode} />

      <div className="space-y-3">
        {months.map((m, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
            <div>
              <label className="text-xs font-semibold text-slate-500">Month</label>
              <select value={m.month} onChange={(e) => update(i, { month: e.target.value })} className={cellClass}>
                <option value="">—</option>
                {MONTHS.map((mo) => (
                  <option key={mo} value={mo}>
                    {mo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">MSCIT Admissions</label>
              <input
                type="number"
                min={0}
                value={m.mscitAdmissions}
                onChange={(e) => update(i, { mscitAdmissions: e.target.value })}
                className={cellClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">KLiC Admissions</label>
              <input
                type="number"
                min={0}
                value={m.klicAdmissions}
                onChange={(e) => update(i, { klicAdmissions: e.target.value })}
                className={cellClass}
              />
            </div>
            <button
              type="button"
              onClick={() => setMonths((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : p))}
              className="text-rose-500 text-xs font-semibold px-2 py-2 text-left"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setMonths((p) => [...p, blankRow()])}
          className="text-brand-orange text-xs font-semibold"
        >
          + Add another month
        </button>
      </div>

      <FormFooter loading={loading} message={message} />
    </form>
  );
}
