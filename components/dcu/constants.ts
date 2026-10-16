export type ParamKey = "meeting_attendance" | "exam_compliance" | "social_media" | "monthly_enrolment";

export const PARAM_LABEL: Record<ParamKey, string> = {
  meeting_attendance: "Meeting Attendance",
  exam_compliance: "Examination Compliances",
  social_media: "Social Media Presence",
  monthly_enrolment: "Monthly Enrolment Consistency",
};

export const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  accepted: "bg-emerald-50 text-emerald-600",
  rejected: "bg-rose-50 text-rose-600",
};

/** One-line human summary of what the DCU submitted. */
export function summarizeSubmission(s: any): string {
  switch (s.parameterType as ParamKey) {
    case "meeting_attendance":
      return s.totalMeetings != null
        ? `${s.attendedMeetings} of ${s.totalMeetings} meetings (${s.attendancePercent}%)`
        : `${s.attendancePercent}% attendance`;
    case "exam_compliance": {
      const grid: { event: string; submitted: boolean }[] | undefined = s.examGrid;
      const cctv = grid
        ? `CCTV ${grid.filter((g) => g.submitted).length}/${grid.length} exams`
        : s.examEvents?.length
        ? `CCTV: ${s.examEvents.join(", ")}`
        : s.cctvSubmitted === false
        ? "CCTV not submitted"
        : "";
      return [cctv, s.cctvObservation && `Observation: ${s.cctvObservation}`].filter(Boolean).join(" · ");
    }
    case "social_media":
      if (s.socialPresence) return `Presence: ${s.socialPresence}`;
      if (s.postedOnSocialMedia === false) return "Posted: No";
      return s.socialPlatform ? `Posted: Yes (${s.socialPlatform})` : "Posted: Yes";
    case "monthly_enrolment":
      return `${(s.months ?? []).length} month(s): ${(s.months ?? []).map((m: any) => m.month).join(", ")}`;
    default:
      return "";
  }
}

/** Latest submission per ALC for one parameter (submissions arrive newest-first). */
export function latestByAlc(submissions: any[], type: ParamKey): Map<string, any> {
  const m = new Map<string, any>();
  for (const s of submissions) if (s.parameterType === type && !m.has(s.alcCode)) m.set(s.alcCode, s);
  return m;
}

/** Marks to show the DCU: real marks once reviewed, "—" while pending. */
export function marksLabel(s: any): string {
  if (s.status === "accepted") return `${s.calculatedMarks}/25`;
  if (s.status === "rejected") return "0/25";
  return "—";
}
