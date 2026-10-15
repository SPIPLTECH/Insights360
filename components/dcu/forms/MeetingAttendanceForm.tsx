"use client";

import { useMemo, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import type { Alc } from "../AlcSelect";
import { Field, FormFooter, inputClass, useFormSubmit } from "../ui";

// Max number of meetings a DCU can enter as "scheduled".
const MAX_MEETINGS = 15;

/**
 * Meeting Attendance - bulk entry.
 * 1) DCU enters "Total No. of Meetings Scheduled" once.
 * 2) Every ALC of the district is listed; DCU types "No. of Meetings Attended" in each box
 *    (scroll the list or use search). Boxes left empty are skipped.
 * 3) One Submit sends all filled rows. Marks are calculated exactly as before.
 */
export default function MeetingAttendanceForm({ alcs, onSubmitted }: { alcs: Alc[]; onSubmitted: () => void }) {
  const [total, setTotal] = useState("");
  const [values, setValues] = useState<Record<string, string>>({}); // alcCode -> attended (as typed)
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const { loading, message, run } = useFormSubmit();

  const totalN = Number(total);
  const hasTotal = total !== "" && totalN > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alcs;
    return alcs.filter(
      (a) =>
        a.alcCode.toLowerCase().includes(q) ||
        a.alcName.toLowerCase().includes(q) ||
        (a.taluka ?? "").toLowerCase().includes(q)
    );
  }, [alcs, query]);

  const filledCount = useMemo(() => alcs.filter((a) => (values[a.alcCode] ?? "") !== "").length, [alcs, values]);

  // Total can be at most MAX_MEETINGS. If it is lowered, any attended value above it is pulled down.
  function handleTotalChange(v: string) {
    if (v === "") {
      setTotal("");
      return;
    }
    const n = Math.min(MAX_MEETINGS, Math.max(0, Math.floor(Number(v))));
    setTotal(String(n));
    setValues((prev) => {
      const next: Record<string, string> = {};
      for (const [k, val] of Object.entries(prev)) next[k] = val !== "" && Number(val) > n ? String(n) : val;
      return next;
    });
  }

  // Attended can never be more than total.
  function handleAttendedChange(alcCode: string, v: string) {
    if (v === "") {
      setValues((prev) => ({ ...prev, [alcCode]: "" }));
      return;
    }
    const n = Math.min(totalN, Math.max(0, Math.floor(Number(v))));
    setValues((prev) => ({ ...prev, [alcCode]: String(n) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await run(
      async () => {
        if (!Number.isInteger(totalN) || totalN <= 0) throw new Error("Enter total meetings scheduled (a whole number above 0).");
        if (totalN > MAX_MEETINGS) throw new Error(`Total meetings scheduled cannot be more than ${MAX_MEETINGS}.`);

        const entries = alcs
          .filter((a) => (values[a.alcCode] ?? "") !== "")
          .map((a) => ({ alcCode: a.alcCode, alcName: a.alcName, attendedMeetings: Number(values[a.alcCode]) }));
        if (entries.length === 0) throw new Error("Enter attended meetings for at least one ALC.");
        if (entries.some((x) => !Number.isInteger(x.attendedMeetings) || x.attendedMeetings < 0 || x.attendedMeetings > totalN)) {
          throw new Error("Meetings attended must be a whole number from 0 up to the total scheduled.");
        }
        if (!window.confirm(`Submit attendance for ${entries.length} ALC${entries.length > 1 ? "s" : ""} (${totalN} meetings scheduled)?`)) {
          throw new Error("Submission cancelled.");
        }

        const fileUrls: string[] = [];
        if (file) fileUrls.push(await uploadToCloudinary(file));

        const res = await fetch("/api/dcu/submissions/bulk-attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ totalMeetings: totalN, entries, fileUrls }),
        });
        const text = await res.text();
        let json: any = {};
        try {
          json = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(text || `Request failed with status ${res.status}.`);
        }
        if (!res.ok) throw new Error(json.error || "Submission failed.");
      },
      `Attendance submitted for ${filledCount} ALC${filledCount === 1 ? "" : "s"} for MRCU review.`
    );
    if (ok) {
      setValues({});
      setQuery("");
      setFile(null);
      setFileKey((k) => k + 1);
      onSubmitted();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="total-meetings" className="text-base font-bold text-slate-800">
          Total No. of Meetings Scheduled?
        </label>
        <input
          id="total-meetings"
          type="number"
          min={1}
          max={MAX_MEETINGS}
          step={1}
          value={total}
          onChange={(e) => handleTotalChange(e.target.value)}
          className="w-28 border-2 border-slate-400 rounded-xl px-3 py-2 text-xl font-bold text-slate-900 text-center bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          placeholder={`1-${MAX_MEETINGS}`}
        />
      </div>

      <div className="space-y-3">
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


        <div className="-mx-5 md:-mx-7 max-h-[32rem] overflow-auto border-y border-slate-300">
          <table className="w-full table-fixed border-collapse text-sm">
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "34%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "30%" }} />
            </colgroup>
            <thead className="sticky top-0 z-10 bg-slate-100 text-left text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-3 py-2 border border-slate-300">ALC Center Code</th>
                <th className="px-3 py-2 border border-slate-300">ALC Name</th>
                <th className="px-3 py-2 border border-slate-300">ALC Taluka</th>
                <th className="px-3 py-2 border border-slate-300">No. of Meetings Attended</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.alcCode}>
                  <td className="px-3 py-2 border border-slate-300 font-semibold text-slate-800">{a.alcCode}</td>
                  <td className="px-3 py-2 border border-slate-300 text-slate-700">{a.alcName}</td>
                  <td className="px-3 py-2 border border-slate-300 text-slate-500">{a.taluka || ""}</td>
                  <td className="px-2 py-1.5 border border-slate-300">
                    <input
                      type="number"
                      min={0}
                      max={hasTotal ? totalN : undefined}
                      step={1}
                      value={values[a.alcCode] ?? ""}
                      onChange={(e) => handleAttendedChange(a.alcCode, e.target.value)}
                      disabled={!hasTotal}
                      placeholder="Enter Meetings attended"
                      className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 disabled:text-slate-400"
                    />
                  </td>
                </tr>
              ))}
              {alcs.length > 0 && filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-slate-400 border border-slate-300">
                    No ALC matches “{query}”.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="max-w-md">
        <Field label="Upload Attendance Sheet (Optional)">
          <input
            key={fileKey}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-600 hover:file:bg-slate-200"
          />
        </Field>
      </div>

      <FormFooter loading={loading} message={message} />
    </form>
  );
}
