import type { ReactNode } from "react";
import type { ParamKey } from "@/components/dcu/constants";

export interface Col {
  header: string;
  cell: (s: any) => ReactNode;
}

export const OBSERVATION_BADGE: Record<string, string> = {
  Bad: "bg-slate-200 text-slate-700",
  Best: "bg-emerald-50 text-emerald-700",
  Good: "bg-sky-50 text-sky-700",
  Average: "bg-amber-50 text-amber-700",
  Poor: "bg-rose-50 text-rose-600",
};

const dash = <span className="text-slate-300">—</span>;

function YesNoBadge({ value }: { value: boolean | null | undefined }) {
  if (value == null) return dash;
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
        value ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
      }`}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

function LinkCell({ href }: { href?: string }) {
  if (!href) return dash;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-brand-orange underline text-xs font-semibold">
      Open link
    </a>
  );
}

export const distinctMonths = (s: any): string[] => Array.from(new Set<string>((s.months ?? []).map((m: any) => m.month)));
const sum = (s: any, key: "mscitAdmissions" | "klicAdmissions") =>
  (s.months ?? []).reduce((t: number, m: any) => t + (Number(m[key]) || 0), 0);

/** Category-specific middle columns for the MRCU review tables. */
export const CATEGORY_COLUMNS: Record<ParamKey, Col[]> = {
  meeting_attendance: [
    { header: "Scheduled", cell: (s) => s.totalMeetings ?? dash },
    { header: "Attended", cell: (s) => s.attendedMeetings ?? dash },
    { header: "Attendance %", cell: (s) => <strong>{s.attendancePercent ?? 0}%</strong> },
    {
      header: "Attendance sheet",
      cell: (s) =>
        s.fileUrls?.[0] ? (
          <a href={s.fileUrls[0]} target="_blank" rel="noreferrer" className="text-brand-orange underline text-xs font-semibold">
            View file
          </a>
        ) : (
          dash
        ),
    },
  ],
  exam_compliance: [
    {
      header: "Exam events",
      cell: (s) => (s.examEvents?.length ? s.examEvents.join(", ") : s.cctvSubmitted === false ? "—" : s.examEvent || dash),
    },
    {
      header: "Part 1 · CCTV (12.5)",
      cell: (s) =>
        s.cctvPart1Marks != null ? (
          <span className="inline-flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5">
              <YesNoBadge value={s.cctvSubmitted} />
              {s.cctvSubmitted && s.examEvents?.length ? <span className="text-xs text-slate-500">{s.examEvents.length} event(s)</span> : null}
            </span>
            <strong className="text-xs">{s.cctvPart1Marks}/12.5</strong>
          </span>
        ) : s.observationMarks != null ? (
          <span className="text-xs font-semibold text-amber-600">Not submitted yet</span>
        ) : s.cctvSubmittedCount != null ? (
          <strong>
            {s.cctvSubmittedCount} of {s.examEvents?.length ?? 0}
          </strong> // old-format submissions
        ) : (
          <YesNoBadge value={s.cctvSubmitted} />
        ),
    },
    {
      header: "Part 2 · Observation (12.5)",
      cell: (s) =>
        s.cctvObservation ? (
          <span className="inline-flex flex-col gap-0.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg w-fit ${OBSERVATION_BADGE[s.cctvObservation] ?? "bg-slate-100 text-slate-600"}`}>
              {s.cctvObservation}
            </span>
            {s.observationMarks != null ? <strong className="text-xs">{s.observationMarks}/12.5</strong> : null}
          </span>
        ) : s.cctvPart1Marks != null ? (
          <span className="text-xs font-semibold text-amber-600">Not submitted yet</span>
        ) : (
          dash
        ),
    },
  ],
  social_media: [
    { header: "Posted", cell: (s) => <YesNoBadge value={s.postedOnSocialMedia ?? (s.socialLink ? true : null)} /> },
    {
      header: "Instagram",
      cell: (s) =>
        s.instagramLink ? (
          <LinkCell href={s.instagramLink} />
        ) : !s.facebookLink && s.socialLink ? (
          <span className="text-xs text-slate-500 break-all">{s.socialLink}</span>
        ) : (
          dash
        ),
    },
    { header: "Facebook", cell: (s) => <LinkCell href={s.facebookLink} /> },
  ],
  monthly_enrolment: [
    { header: "Months", cell: (s) => <strong>{distinctMonths(s).length}</strong> },
    { header: "Month names", cell: (s) => <span className="text-xs text-slate-500">{distinctMonths(s).join(", ") || "—"}</span> },
    { header: "MSCIT total", cell: (s) => sum(s, "mscitAdmissions") },
    { header: "KLiC total", cell: (s) => sum(s, "klicAdmissions") },
  ],
};

/** Marks column: preview while pending, final once reviewed. */
export function marksCell(s: any): ReactNode {
  if (s.status === "pending")
    return (
      <span>
        <strong>{s.calculatedMarks}/25</strong>
        <span className="block text-[11px] text-slate-400">if accepted</span>
      </span>
    );
  if (s.status === "accepted") return <strong className="text-emerald-600">{s.calculatedMarks}/25</strong>;
  return <strong className="text-rose-500">0/25</strong>;
}
