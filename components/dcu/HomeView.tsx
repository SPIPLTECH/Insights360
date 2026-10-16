"use client";

import { CalendarCheck2, ClipboardList, Megaphone, ShieldCheck } from "lucide-react";
import { PARAM_LABEL, ParamKey } from "./constants";
import ExportView from "./ExportView";

const PARAM_ICON: Record<ParamKey, React.ReactNode> = {
  meeting_attendance: <CalendarCheck2 size={18} />,
  exam_compliance: <ShieldCheck size={18} />,
  social_media: <Megaphone size={18} />,
  monthly_enrolment: <ClipboardList size={18} />,
};

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
              className="flex items-center justify-between gap-2 text-left rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-brand-orange hover:bg-brand-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-brand-orange">{PARAM_ICON[k]}</span>
                {PARAM_LABEL[k]}
              </span>
              <span className="text-brand-orange">→</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <ExportView district={district} />
      </div>
    </div>
  );
}
