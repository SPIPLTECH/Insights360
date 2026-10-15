"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Alc } from "./AlcSelect";
import { PageTitle } from "./ui";
import { PARAM_LABEL, ParamKey } from "./constants";
import HomeView from "./HomeView";
import MySubmissionsView from "./MySubmissionsView";
import ExportView from "./ExportView";
import MeetingAttendanceForm from "./forms/MeetingAttendanceForm";
import ExamComplianceForm from "./forms/ExamComplianceForm";
import SocialMediaForm from "./forms/SocialMediaForm";

type View = "home" | ParamKey | "submitted" | "export";

const NAV: { key: View; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "meeting_attendance", label: PARAM_LABEL.meeting_attendance },
  { key: "exam_compliance", label: PARAM_LABEL.exam_compliance },
  { key: "social_media", label: PARAM_LABEL.social_media },
  { key: "monthly_enrolment", label: PARAM_LABEL.monthly_enrolment },
  { key: "submitted", label: "My Submitted Data" },
  { key: "export", label: "Export Data of Dashboard" },
];

const FORM_SUBTITLE: Partial<Record<View, string>> = {
  meeting_attendance: "Enter the total meetings scheduled once, then type how many each ALC attended. Attendance % and marks are calculated automatically.",
};

export default function DcuDashboardClient({ district, displayName }: { district: string; displayName: string }) {
  const router = useRouter();
  const [view, setView] = useState<View>("home");
  const [alcs, setAlcs] = useState<Alc[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [alcWarning, setAlcWarning] = useState<{ district: string; districtsInSheet: string[] } | null>(null);

  const refreshSubmissions = useCallback(() => {
    fetch("/api/dcu/submissions")
      .then((r) => r.json())
      .then((d) => setSubmissions(d.submissions ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/dcu/alcs")
      .then((r) => r.json())
      .then((d) => {
        setAlcs(d.alcs ?? []);
        setAlcWarning(d.warning ?? null);
      })
      .catch(() => {});
    refreshSubmissions();
  }, [refreshSubmissions]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function renderView() {
    switch (view) {
      case "home":
        return (
          <HomeView district={district} alcCount={alcs.length} submissions={submissions} onNavigate={(v) => setView(v)} />
        );
      case "meeting_attendance":
        return <MeetingAttendanceForm alcs={alcs} onSubmitted={refreshSubmissions} />;
      case "exam_compliance":
        return <ExamComplianceForm alcs={alcs} onSubmitted={refreshSubmissions} />;
      case "social_media":
        return <SocialMediaForm alcs={alcs} onSubmitted={refreshSubmissions} />;
      case "monthly_enrolment":
        return (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-emerald-800">
            <p className="text-lg font-semibold">Data already live in dashboard</p>
          </div>
        );
      case "submitted":
        return <MySubmissionsView submissions={submissions} onRefresh={refreshSubmissions} />;
      case "export":
        return <ExportView district={district} />;
    }
  }

  const isForm = view in PARAM_LABEL;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-brand-gradient text-white px-5 py-5 md:px-10 md:py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-widest font-semibold text-white/80 uppercase">DCU Portal</p>
            <h1 className="text-xl md:text-2xl font-bold mt-0.5">{district} District</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-sm font-medium">
              <span className="text-xl" aria-hidden>
                🧑‍💼
              </span>
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white/15 hover:bg-white/25 transition-colors text-sm rounded-xl px-3 py-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs now sit in the header, below the title */}
        <nav className="max-w-6xl mx-auto mt-4 -mb-1 flex gap-2 overflow-x-auto pb-1">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              className={`whitespace-nowrap text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                view === n.key ? "bg-white text-brand-orange shadow-sm" : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6">
        <main className="min-w-0">
          {alcWarning ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              No ALCs matched the district <strong>“{alcWarning.district}”</strong>. District names found in the sheet:{" "}
              {alcWarning.districtsInSheet.length ? alcWarning.districtsInSheet.join(", ") : "none (sheet may be empty)"}.
            </div>
          ) : null}
          <div className="card p-5 md:p-7">
            {isForm ? <PageTitle title={PARAM_LABEL[view as ParamKey]} subtitle={FORM_SUBTITLE[view]} /> : null}
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
