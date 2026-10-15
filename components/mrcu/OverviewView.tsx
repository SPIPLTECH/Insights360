"use client";

import { PARAM_LABEL, ParamKey } from "@/components/dcu/constants";

const CATEGORIES = Object.keys(PARAM_LABEL) as ParamKey[];

function tally(list: any[]) {
  return {
    pending: list.filter((s) => s.status === "pending").length,
    accepted: list.filter((s) => s.status === "accepted").length,
    rejected: list.filter((s) => s.status === "rejected").length,
    total: list.length,
  };
}

export default function OverviewView({
  submissions,
  unsyncedCount,
  retrying,
  onRetryAll,
  onOpen,
}: {
  submissions: any[];
  unsyncedCount: number;
  retrying: boolean;
  onRetryAll: () => void;
  onOpen: (c: ParamKey) => void;
}) {
  const all = tally(submissions);
  const districts = Array.from(new Set(submissions.map((s) => s.district as string))).sort();

  const headline = [
    { label: "Pending review", value: all.pending, tone: "text-amber-600" },
    { label: "Accepted", value: all.accepted, tone: "text-emerald-600" },
    { label: "Rejected", value: all.rejected, tone: "text-rose-600" },
    { label: "Total received", value: all.total, tone: "text-slate-800" },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Review Overview</h2>
        <p className="text-sm text-slate-400 mt-0.5">All DCU submissions across districts, category-wise.</p>
      </div>

      {unsyncedCount > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-sm text-amber-800">
            <strong>{unsyncedCount}</strong> reviewed submission{unsyncedCount > 1 ? "s are" : " is"} saved but not yet written to the Google Sheet.
          </p>
          <button
            onClick={onRetryAll}
            disabled={retrying}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg px-4 py-2 disabled:opacity-60 shrink-0"
          >
            {retrying ? "Retrying…" : "Retry sheet sync"}
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {headline.map((h) => (
          <div key={h.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className={`text-2xl font-bold ${h.tone}`}>{h.value}</p>
            <p className="text-xs text-slate-400 mt-1">{h.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">By category</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {CATEGORIES.map((c) => {
            const t = tally(submissions.filter((s) => s.parameterType === c));
            return (
              <button
                key={c}
                onClick={() => onOpen(c)}
                className="text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-brand-orange hover:bg-brand-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-sm">{PARAM_LABEL[c]}</span>
                  <span className="text-brand-orange text-sm">Review →</span>
                </div>
                <div className="flex gap-4 mt-3 text-xs">
                  <span className="text-amber-600">
                    <strong className="text-base">{t.pending}</strong> pending
                  </span>
                  <span className="text-emerald-600">
                    <strong className="text-base">{t.accepted}</strong> accepted
                  </span>
                  <span className="text-rose-600">
                    <strong className="text-base">{t.rejected}</strong> rejected
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">By district</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                <th className="py-2 pr-3">District</th>
                <th className="py-2 pr-3">Pending</th>
                <th className="py-2 pr-3">Accepted</th>
                <th className="py-2 pr-3">Rejected</th>
                <th className="py-2 pr-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => {
                const t = tally(submissions.filter((s) => s.district === d));
                return (
                  <tr key={d} className="border-b border-slate-50">
                    <td className="py-2.5 pr-3 font-semibold text-slate-700">{d}</td>
                    <td className="py-2.5 pr-3 text-amber-600">{t.pending}</td>
                    <td className="py-2.5 pr-3 text-emerald-600">{t.accepted}</td>
                    <td className="py-2.5 pr-3 text-rose-600">{t.rejected}</td>
                    <td className="py-2.5 pr-3">{t.total}</td>
                  </tr>
                );
              })}
              {districts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No submissions received yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
