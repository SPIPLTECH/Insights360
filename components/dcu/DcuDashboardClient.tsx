"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck2,
  CalendarClock,
  ClipboardList,
  Home as HomeIcon,
  LogOut,
  Megaphone,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import type { Alc } from "./AlcSelect";
import { PageTitle } from "./ui";
import { PARAM_LABEL, ParamKey } from "./constants";
import HomeView from "./HomeView";
import MySubmissionsView from "./MySubmissionsView";
import MeetingAttendanceForm from "./forms/MeetingAttendanceForm";
import ExamComplianceForm from "./forms/ExamComplianceForm";
import ExamAllotmentForm from "./forms/ExamAllotmentForm";
import SocialMediaForm from "./forms/SocialMediaForm";

type View = "home" | ParamKey | "submitted" | "exam_allotment";

const NAV: { key: View; label: string; icon: React.ReactNode }[] = [
  { key: "home", label: "Home", icon: <HomeIcon size={16} /> },
  { key: "exam_allotment", label: "Submit Exam Event Allotment", icon: <CalendarClock size={16} /> },
  { key: "meeting_attendance", label: PARAM_LABEL.meeting_attendance, icon: <CalendarCheck2 size={16} /> },
  { key: "exam_compliance", label: PARAM_LABEL.exam_compliance, icon: <ShieldCheck size={16} /> },
  { key: "social_media", label: PARAM_LABEL.social_media, icon: <Megaphone size={16} /> },
  { key: "monthly_enrolment", label: PARAM_LABEL.monthly_enrolment, icon: <ClipboardList size={16} /> },
  { key: "submitted", label: "My Submitted Data", icon: <ClipboardList size={16} /> },
];

const VIEW_ICON: Partial<Record<View, React.ReactNode>> = {
  meeting_attendance: <CalendarCheck2 size={22} />,
  exam_compliance: <ShieldCheck size={22} />,
  social_media: <Megaphone size={22} />,
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
        setAlcs(
          [...(d.alcs ?? [])].sort((x: Alc, y: Alc) =>
            x.alcName.trim().localeCompare(y.alcName.trim(), "en", { sensitivity: "base", numeric: true }) || x.alcCode.localeCompare(y.alcCode, "en", { numeric: true })
          )
        );
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
        return <MeetingAttendanceForm alcs={alcs} submissions={submissions} onSubmitted={refreshSubmissions} />;
      case "exam_allotment":
        return <ExamAllotmentForm alcs={alcs} />;
      case "exam_compliance":
        return <ExamComplianceForm alcs={alcs} submissions={submissions} onSubmitted={refreshSubmissions} onGoToAllotment={() => setView("exam_allotment")} />;
      case "social_media":
        return <SocialMediaForm alcs={alcs} submissions={submissions} onSubmitted={refreshSubmissions} />;
      case "monthly_enrolment":
        return (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-emerald-800">
            <p className="text-lg font-semibold">Data already live in dashboard</p>
          </div>
        );
      case "submitted":
        return <MySubmissionsView submissions={submissions} onRefresh={refreshSubmissions} />;
    }
  }

  const isForm = view in PARAM_LABEL;

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="sticky top-0 z-30 bg-brand-gradient text-white px-3 py-3 md:px-4 md:py-4 shadow-md">
        <div className="w-full flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-widest font-semibold text-white/80 uppercase">DCU Portal</p>
            <h1 className="text-xl md:text-2xl font-bold mt-0.5">{district} District</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-sm font-medium">
              <UserCircle2 size={20} className="text-white/90" />
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors text-sm font-semibold rounded-xl px-3 py-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs now sit in the header, below the title */}
        <div className="w-full mt-3 -mb-1">
          <nav className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                className={`flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                  view === n.key ? "bg-white text-brand-orange shadow-sm" : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="w-full mt-3">
        <main className="min-w-0">
          {alcWarning ? (
            <div className="mx-3 md:mx-4 mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              No ALCs matched the district <strong>“{alcWarning.district}”</strong>. District names found in the sheet:{" "}
              {alcWarning.districtsInSheet.length ? alcWarning.districtsInSheet.join(", ") : "none (sheet may be empty)"}.
            </div>
          ) : null}
          <div className="card !rounded-none !border-x-0 !shadow-none px-3 py-4 md:px-4">
            {isForm ? <PageTitle title={PARAM_LABEL[view as ParamKey]} icon={VIEW_ICON[view]} /> : null}
            {view === "exam_allotment" ? <PageTitle title="Submit Exam Event Allotment" icon={<CalendarClock size={22} />} /> : null}
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
