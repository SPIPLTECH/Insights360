"use client";

import { PARAM_LABEL, ParamKey } from "./constants";

export default function HomeView({
  district,
  alcCount,
  submissions,
  onNavigate,
}: {
  district: string;
  alcCount: number;
  submissions: any[];
  onNavigate: (view: ParamKey | "submitted") => void;
}) {
  const count = (status: string) => submissions.filter((s) => s.status === status).length;

  const stats = [
    { label: "ALCs in district", value: alcCount, tone: "text-slate-800" },
    { label: "Total submitted", value: submissions.length, tone: "text-slate-800" },
    { label: "Pending review", value: count("pending"), tone: "text-amber-600" },
    { label: "Accepted", value: count("accepted"), tone: "text-emerald-600" },
    { label: "Rejected", value: count("rejected"), tone: "text-rose-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Welcome, {district} DCU</h2>
        <p className="text-sm text-slate-400 mt-0.5">Submit Index-4 data for your ALCs. MRCU reviews each submission.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className={`text-2xl font-bold ${s.tone}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">Quick actions</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {(Object.keys(PARAM_LABEL) as ParamKey[]).map((k) => (
            <button
              key={k}
              onClick={() => onNavigate(k)}
              className="text-left rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-brand-orange hover:bg-brand-50 transition-colors"
            >
              {PARAM_LABEL[k]} <span className="text-brand-orange">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
