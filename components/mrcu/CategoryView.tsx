"use client";

import { Fragment, useMemo, useState } from "react";
import { PARAM_LABEL, ParamKey } from "@/components/dcu/constants";
import { CATEGORY_COLUMNS, OBSERVATION_BADGE, marksCell } from "./columns";
import ReviewActions from "./ReviewActions";

const STATUS_TABS = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

type Panel = { id: string; kind: "months" | "reject" } | null;

export default function CategoryView({
  category,
  submissions,
  busyId,
  onReview,
  onRetry,
}: {
  category: ParamKey;
  submissions: any[];
  busyId: string | null;
  onReview: (id: string, decision: "accept" | "reject", note?: string) => Promise<void>;
  onRetry: (id: string) => Promise<void>;
}) {
  const [status, setStatus] = useState("pending");
  const [district, setDistrict] = useState("all");
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState<Panel>(null);
  const [reason, setReason] = useState("");

  const inCategory = useMemo(() => submissions.filter((s) => s.parameterType === category), [submissions, category]);
  const districts = useMemo(() => Array.from(new Set(inCategory.map((s) => s.district as string))).sort(), [inCategory]);

  // district + search filters first, so the status-tab counts match what is searched
  const base = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inCategory.filter(
      (s) =>
        (district === "all" || s.district === district) &&
        (!q || s.alcCode.toLowerCase().includes(q) || s.alcName.toLowerCase().includes(q))
    );
  }, [inCategory, district, query]);

  const rows = status === "all" ? base : base.filter((s) => s.status === status);
  const count = (k: string) => (k === "all" ? base.length : base.filter((s) => s.status === k).length);

  const columns = CATEGORY_COLUMNS[category];
  const isMonthly = category === "monthly_enrolment";
  const totalCols = 2 + columns.length + (isMonthly ? 1 : 0) + 3;

  const observationCounts = useMemo(() => {
    if (category !== "exam_compliance") return null;
    const c: Record<string, number> = { Best: 0, Good: 0, Average: 0, Poor: 0, Bad: 0 };
    rows.forEach((s) => {
      if (s.cctvObservation in c) c[s.cctvObservation] += 1;
    });
    return c;
  }, [rows, category]);

  async function accept(s: any) {
    // Exam compliance has 2 parts (12.5 each) — warn if one of them has not been submitted yet.
    const p1 = s.cctvPart1Marks != null;
    const p2 = s.observationMarks != null;
    const partial =
      s.parameterType === "exam_compliance" && (p1 || p2) && !(p1 && p2)
        ? `\n\nNote: ${p1 ? "Part 2 (General Observation)" : "Part 1 (CCTV Submitted)"} is not submitted yet. Only ${s.calculatedMarks}/25 will be written to the sheet.`
        : "";
    if (!window.confirm(`Accept ${s.alcCode} — ${s.alcName} and update the Google Sheet?${partial}`)) return;
    await onReview(s._id, "accept");
  }

  async function confirmReject(s: any) {
    await onReview(s._id, "reject", reason.trim() || undefined);
    setPanel(null);
    setReason("");
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">{PARAM_LABEL[category]}</h2>
        <p className="text-sm text-slate-400 mt-0.5">Review submissions from all districts. Accept or reject updates the Google Sheet.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ALC code or name…"
          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
        />
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white sm:w-52"
        >
          <option value="all">All districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-colors ${
              status === t.key
                ? "bg-brand-gradient text-white border-transparent"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.label} <span className="opacity-70 ml-1">{count(t.key)}</span>
          </button>
        ))}
      </div>

      {observationCounts ? (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <span className="text-xs font-semibold text-slate-500">CCTV observations in this list:</span>
          {Object.entries(observationCounts).map(([k, v]) => (
            <span key={k} className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${OBSERVATION_BADGE[k]}`}>
              {k} · {v}
            </span>
          ))}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
              <th className="py-2 pr-3">District</th>
              <th className="py-2 pr-3">ALC</th>
              {columns.map((c) => (
                <th key={c.header} className="py-2 pr-3 whitespace-nowrap">
                  {c.header}
                </th>
              ))}
              {isMonthly ? <th className="py-2 pr-3">Month-wise</th> : null}
              <th className="py-2 pr-3">Marks</th>
              <th className="py-2 pr-3">Submitted</th>
              <th className="py-2 pr-3">Status / Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const open = panel && panel.id === s._id ? panel.kind : null;
              return (
                <Fragment key={s._id}>
                  <tr className="border-b border-slate-50 align-top">
                    <td className="py-3 pr-3 whitespace-nowrap text-slate-500">{s.district}</td>
                    <td className="py-3 pr-3 min-w-[180px]">
                      <span className="font-semibold text-slate-800">{s.alcCode}</span>
                      <span className="block text-xs text-slate-500">{s.alcName}</span>
                    </td>
                    {columns.map((c) => (
                      <td key={c.header} className="py-3 pr-3">
                        {c.cell(s)}
                      </td>
                    ))}
                    {isMonthly ? (
                      <td className="py-3 pr-3">
                        <button
                          onClick={() => setPanel(open === "months" ? null : { id: s._id, kind: "months" })}
                          className="text-xs font-semibold text-brand-orange underline"
                        >
                          {open === "months" ? "Hide" : "View"}
                        </button>
                      </td>
                    ) : null}
                    <td className="py-3 pr-3 whitespace-nowrap">{marksCell(s)}</td>
                    <td className="py-3 pr-3 text-slate-400 whitespace-nowrap">
                      {new Date(s.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 pr-3 min-w-[150px]">
                      <ReviewActions
                        s={s}
                        busy={busyId === s._id}
                        onAccept={() => accept(s)}
                        onOpenReject={() => {
                          setReason("");
                          setPanel({ id: s._id, kind: "reject" });
                        }}
                        onRetry={() => onRetry(s._id)}
                      />
                    </td>
                  </tr>

                  {open === "months" ? (
                    <tr className="bg-slate-50">
                      <td colSpan={totalCols} className="px-4 py-3">
                        <table className="text-xs">
                          <thead>
                            <tr className="text-left text-slate-400">
                              <th className="pr-6 py-1">Month</th>
                              <th className="pr-6 py-1">MSCIT admissions</th>
                              <th className="py-1">KLiC admissions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(s.months ?? []).map((m: any, i: number) => (
                              <tr key={i}>
                                <td className="pr-6 py-1 font-semibold text-slate-700">{m.month}</td>
                                <td className="pr-6 py-1">{m.mscitAdmissions}</td>
                                <td className="py-1">{m.klicAdmissions}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  ) : null}

                  {open === "reject" ? (
                    <tr className="bg-rose-50/60">
                      <td colSpan={totalCols} className="px-4 py-3">
                        <label className="text-xs font-semibold text-slate-600">Reason for rejection (optional — DCU will see it)</label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          maxLength={300}
                          rows={2}
                          className="mt-1 w-full max-w-xl border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                          placeholder="e.g. Attendance sheet not matching the numbers"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => confirmReject(s)}
                            disabled={busyId === s._id}
                            className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg px-4 py-2 disabled:opacity-50"
                          >
                            {busyId === s._id ? "Saving…" : "Confirm reject"}
                          </button>
                          <button
                            onClick={() => setPanel(null)}
                            className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg px-4 py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={totalCols} className="py-12 text-center text-slate-400">
                  No {status === "all" ? "" : status} submissions found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
