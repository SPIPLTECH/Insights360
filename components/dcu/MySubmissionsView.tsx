"use client";

import { useState } from "react";
import { PageTitle } from "./ui";
import { PARAM_LABEL, STATUS_BADGE, marksLabel, summarizeSubmission } from "./constants";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "meeting_attendance", label: "Meeting" },
  { key: "exam_compliance", label: "Examination" },
  { key: "social_media", label: "Social" },
  { key: "monthly_enrolment", label: "Monthly" },
];

export default function MySubmissionsView({ submissions, onRefresh }: { submissions: any[]; onRefresh: () => void }) {
  const [filter, setFilter] = useState("all");
  const rows = filter === "all" ? submissions : submissions.filter((s) => s.parameterType === filter);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <PageTitle title="My Submitted Data" subtitle="Everything your district has submitted, with MRCU status." />
        <button onClick={onRefresh} className="text-xs font-semibold text-brand-orange mt-1 shrink-0">
          Refresh
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-colors ${
              filter === f.key
                ? "bg-brand-gradient text-white border-transparent"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
            <span className="ml-1.5 opacity-70">
              {f.key === "all" ? submissions.length : submissions.filter((s) => s.parameterType === f.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
              <th className="py-2 pr-3">ALC</th>
              <th className="py-2 pr-3">Parameter</th>
              <th className="py-2 pr-3">Details</th>
              <th className="py-2 pr-3">Marks</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s._id} className="border-b border-slate-50 align-top">
                <td className="py-2.5 pr-3">
                  <span className="font-semibold text-slate-800">{s.alcCode}</span>
                  <span className="text-slate-500"> — {s.alcName}</span>
                </td>
                <td className="py-2.5 pr-3">{PARAM_LABEL[s.parameterType as keyof typeof PARAM_LABEL]}</td>
                <td className="py-2.5 pr-3 text-slate-500 min-w-[200px]">{summarizeSubmission(s)}</td>
                <td className="py-2.5 pr-3">{marksLabel(s)}</td>
                <td className="py-2.5 pr-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${STATUS_BADGE[s.status]}`}>{s.status}</span>
                  {s.status === "rejected" && s.reviewNote ? (
                    <p className="text-xs text-slate-400 mt-1">{s.reviewNote}</p>
                  ) : null}
                </td>
                <td className="py-2.5 pr-3 text-slate-400 whitespace-nowrap">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  No submissions here yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
