"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

interface Alc {
  alcCode: string;
  alcName: string;
}

type ParamTab = "meeting_attendance" | "exam_compliance" | "social_media" | "monthly_enrolment";

const TABS: { key: ParamTab; label: string }[] = [
  { key: "meeting_attendance", label: "Meeting Attendance" },
  { key: "exam_compliance", label: "Examination Compliance CCTV" },
  { key: "social_media", label: "Social Media Presence" },
  { key: "monthly_enrolment", label: "Monthly Enrolment Consistency" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  accepted: "bg-emerald-50 text-emerald-600",
  rejected: "bg-rose-50 text-rose-600",
};

const PARAM_LABEL: Record<string, string> = {
  meeting_attendance: "Meeting Attendance",
  exam_compliance: "Examination Compliance CCTV",
  social_media: "Social Media Presence",
  monthly_enrolment: "Monthly Enrolment Consistency",
};

export default function DcuDashboardClient({ district, displayName }: { district: string; displayName: string }) {
  const router = useRouter();
  const [alcs, setAlcs] = useState<Alc[]>([]);
  const [alcCode, setAlcCode] = useState("");
  const [tab, setTab] = useState<ParamTab>("meeting_attendance");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  // form state
  const [attendancePercent, setAttendancePercent] = useState("");
  const [proofDate, setProofDate] = useState("");
  const [attendanceFile, setAttendanceFile] = useState<File | null>(null);

  const [auditNotes, setAuditNotes] = useState("");
  const [auditFile, setAuditFile] = useState<File | null>(null);

  // Social media individual links
  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [otherLink, setOtherLink] = useState("");

  const [months, setMonths] = useState<{ month: string; mscitAdmissions: string; klicAdmissions: string }[]>([
    { month: "", mscitAdmissions: "", klicAdmissions: "" },
  ]);

  const selectedAlc = useMemo(() => alcs.find((a) => a.alcCode === alcCode), [alcs, alcCode]);

  useEffect(() => {
    fetch("/api/dcu/alcs")
      .then((r) => r.json())
      .then((d) => setAlcs(d.alcs ?? []));
    refreshSubmissions();
  }, []);

  function refreshSubmissions() {
    fetch("/api/dcu/submissions")
      .then((r) => r.json())
      .then((d) => setSubmissions(d.submissions ?? []));
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dcu/login");
    router.refresh();
  }

  function addMonthRow() {
    setMonths((m) => [...m, { month: "", mscitAdmissions: "", klicAdmissions: "" }]);
  }
  function removeMonthRow(i: number) {
    setMonths((m) => m.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!selectedAlc) {
      setMessage({ type: "error", text: "Please select an ALC first." });
      return;
    }
    setLoading(true);
    try {
      const fileUrls: string[] = [];
      const payload: any = {
        alcCode: selectedAlc.alcCode,
        alcName: selectedAlc.alcName,
        parameterType: tab,
      };

      if (tab === "meeting_attendance") {
        if (!attendancePercent) throw new Error("Enter the attendance %.");
        if (attendanceFile) fileUrls.push(await uploadToCloudinary(attendanceFile));
        payload.attendancePercent = Number(attendancePercent);
        payload.proofDate = proofDate;
      } else if (tab === "exam_compliance") {
        if (auditFile) fileUrls.push(await uploadToCloudinary(auditFile));
        payload.auditNotes = auditNotes;
      } else if (tab === "social_media") {
        const platforms = [];
        const links = [];
        
        if (instagramLink) { platforms.push("Instagram"); links.push(instagramLink); }
        if (facebookLink) { platforms.push("Facebook"); links.push(facebookLink); }
        if (youtubeLink) { platforms.push("YouTube"); links.push(youtubeLink); }
        if (otherLink) { platforms.push("Other"); links.push(otherLink); }

        if (platforms.length === 0) throw new Error("Please provide at least one social media link.");
        
        payload.socialPlatform = platforms.join(", ");
        payload.socialLink = links.join(", ");
      } else if (tab === "monthly_enrolment") {
        const cleaned = months
          .filter((m) => m.month)
          .map((m) => ({
            month: m.month,
            mscitAdmissions: Number(m.mscitAdmissions || 0),
            klicAdmissions: Number(m.klicAdmissions || 0),
          }));
        if (cleaned.length === 0) throw new Error("Add at least one month's data.");
        payload.months = cleaned;
      }

      payload.fileUrls = fileUrls;

      const res = await fetch("/api/dcu/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed.");

      setMessage({ type: "ok", text: "Submitted for MRCU review." });
      refreshSubmissions();
      // reset relevant form fields
      setAttendancePercent("");
      setProofDate("");
      setAttendanceFile(null);
      setAuditNotes("");
      setAuditFile(null);
      setInstagramLink("");
      setFacebookLink("");
      setYoutubeLink("");
      setOtherLink("");
      setMonths([{ month: "", mscitAdmissions: "", klicAdmissions: "" }]);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-brand-gradient text-white px-5 py-6 md:px-10 md:py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest font-semibold text-white/80 uppercase">Insights360™ · DCU Portal</p>
            <h1 className="text-xl md:text-2xl font-bold mt-1">{district} District</h1>
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

      <div className="max-w-5xl mx-auto px-4 md:px-0 mt-6 space-y-6">
        <div className="card p-5 md:p-6">
          <label className="text-xs font-semibold text-slate-500">Select ALC</label>
          <select
            value={alcCode}
            onChange={(e) => setAlcCode(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
          >
            <option value="">— Choose an ALC —</option>
            {alcs.map((a) => (
              <option key={a.alcCode} value={a.alcCode}>
                {a.alcCode} — {a.alcName}
              </option>
            ))}
          </select>
        </div>

        <div className="card p-5 md:p-6">
          <div className="flex flex-wrap gap-2 mb-5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                  tab === t.key ? "bg-brand-gradient text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "meeting_attendance" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Attendance %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={attendancePercent}
                    onChange={(e) => setAttendancePercent(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="e.g. 80"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Proof Date</label>
                  <input
                    type="date"
                    value={proofDate}
                    onChange={(e) => setProofDate(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Attendance Sheet (file)</label>
                  <input
                    type="file"
                    onChange={(e) => setAttendanceFile(e.target.files?.[0] ?? null)}
                    className="mt-1 w-full text-sm"
                  />
                </div>
              </>
            )}

            {tab === "exam_compliance" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Audit Report (file)</label>
                  <input
                    type="file"
                    onChange={(e) => setAuditFile(e.target.files?.[0] ?? null)}
                    className="mt-1 w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Notes (optional)</label>
                  <textarea
                    value={auditNotes}
                    onChange={(e) => setAuditNotes(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>
              </>
            )}

            {tab === "social_media" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 mb-2">Provide links for the platforms you use (at least one is required).</p>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Instagram Link</label>
                  <input
                    value={instagramLink}
                    onChange={(e) => setInstagramLink(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Facebook Link</label>
                  <input
                    value={facebookLink}
                    onChange={(e) => setFacebookLink(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">YouTube Link</label>
                  <input
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Other Link</label>
                  <input
                    value={otherLink}
                    onChange={(e) => setOtherLink(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {tab === "monthly_enrolment" && (
              <div className="space-y-3">
                {months.map((m, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Month</label>
                      <select
                        value={m.month}
                        onChange={(e) =>
                          setMonths((prev) => prev.map((p, idx) => (idx === i ? { ...p, month: e.target.value } : p)))
                        }
                        className="mt-1 w-full border border-slate-200 rounded-xl px-2 py-2 text-sm"
                      >
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
                        onChange={(e) =>
                          setMonths((prev) =>
                            prev.map((p, idx) => (idx === i ? { ...p, mscitAdmissions: e.target.value } : p))
                          )
                        }
                        className="mt-1 w-full border border-slate-200 rounded-xl px-2 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">KLiC Admissions</label>
                      <input
                        type="number"
                        min={0}
                        value={m.klicAdmissions}
                        onChange={(e) =>
                          setMonths((prev) =>
                            prev.map((p, idx) => (idx === i ? { ...p, klicAdmissions: e.target.value } : p))
                          )
                        }
                        className="mt-1 w-full border border-slate-200 rounded-xl px-2 py-2 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMonthRow(i)}
                      className="text-rose-500 text-xs font-semibold px-2 py-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addMonthRow} className="text-brand-orange text-xs font-semibold">
                  + Add another month
                </button>
              </div>
            )}

            {message ? (
              <p className={`text-sm ${message.type === "ok" ? "text-emerald-600" : "text-rose-500"}`}>
                {message.text}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="bg-brand-gradient text-white font-semibold text-sm rounded-xl px-5 py-2.5 disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Submit for MRCU Review"}
            </button>
          </form>
        </div>

        <div className="card p-5 md:p-6">
          <h2 className="font-bold text-slate-800 mb-3">Your Submissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3">ALC</th>
                  <th className="py-2 pr-3">Parameter</th>
                  <th className="py-2 pr-3">Marks</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s._id} className="border-b border-slate-50">
                    <td className="py-2 pr-3">
                      {s.alcCode} — {s.alcName}
                    </td>
                    <td className="py-2 pr-3">{PARAM_LABEL[s.parameterType]}</td>
                    <td className="py-2 pr-3">{s.calculatedMarks}/25</td>
                    <td className="py-2 pr-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${STATUS_BADGE[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No submissions yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}