"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PARAM_LABEL: Record<string, string> = {
  meeting_attendance: "Meeting Attendance",
  exam_compliance: "Examination Compliance CCTV",
  social_media: "Social Media Presence",
  monthly_enrolment: "Monthly Enrolment Consistency",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  accepted: "bg-emerald-50 text-emerald-600",
  rejected: "bg-rose-50 text-rose-600",
};

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

export default function MrcuDashboardClient({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [status, setStatus] = useState("pending");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function refresh() {
    fetch(`/api/mrcu/submissions?status=${status}`)
      .then((r) => r.json())
      .then((d) => setSubmissions(d.submissions ?? []));
  }

  useEffect(refresh, [status]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/mrcu/login");
    router.refresh();
  }

  async function review(id: string, decision: "accept" | "reject") {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/mrcu/submissions/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Review failed.");
      refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function renderDetails(s: any) {
    switch (s.parameterType) {
      case "meeting_attendance":
        return (
          <>
            Attendance: <strong>{s.attendancePercent}%</strong> · Proof date: {s.proofDate || "—"}
          </>
        );
      case "exam_compliance":
        return <>Notes: {s.auditNotes || "—"}</>;
      case "social_media":
        return (
          <>
            {s.socialPlatform} —{" "}
            <a href={s.socialLink} target="_blank" rel="noreferrer" className="text-brand-orange underline">
              {s.socialLink}
            </a>
          </>
        );
      case "monthly_enrolment":
        return (
          <>
            {(s.months ?? []).length} month(s) submitted:{" "}
            {(s.months ?? []).map((m: any) => m.month).join(", ")}
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-brand-gradient text-white px-5 py-6 md:px-10 md:py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest font-semibold text-white/80 uppercase">Insights360™ · MRCU Portal</p>
            <h1 className="text-xl md:text-2xl font-bold mt-1">Review Queue</h1>
            <p className="text-sm text-white/85">{displayName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/15 hover:bg-white/25 transition-colors text-sm rounded-xl px-3 py-2"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-0 mt-6">
        <div className="flex gap-2 mb-4">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatus(t.key)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                status === t.key ? "bg-brand-gradient text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error ? <p className="text-sm text-rose-500 mb-3">{error}</p> : null}

        <div className="space-y-3">
          {submissions.map((s) => (
            <div key={s._id} className="card p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-800">
                    {s.alcCode} — {s.alcName}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{s.district}</span>
                  <span className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-lg font-semibold">
                    {PARAM_LABEL[s.parameterType]}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${STATUS_BADGE[s.status]}`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{renderDetails(s)}</p>
                {s.fileUrls?.length ? (
                  <div className="flex gap-3 mt-2">
                    {s.fileUrls.map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" className="text-xs text-brand-orange underline">
                        Proof file {i + 1}
                      </a>
                    ))}
                  </div>
                ) : null}
                <p className="text-xs text-slate-400 mt-1">
                  Marks-if-accepted: <strong>{s.calculatedMarks}/25</strong> · Submitted{" "}
                  {new Date(s.createdAt).toLocaleString()}
                </p>
              </div>

              {s.status === "pending" ? (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => review(s._id, "accept")}
                    disabled={busyId === s._id}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl px-4 py-2 disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => review(s._id, "reject")}
                    disabled={busyId === s._id}
                    className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl px-4 py-2 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
          ))}
          {submissions.length === 0 ? (
            <div className="card p-8 text-center text-slate-400 text-sm">No {status} submissions.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
