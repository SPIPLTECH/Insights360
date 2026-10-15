export type ParamKey = "meeting_attendance" | "exam_compliance" | "social_media" | "monthly_enrolment";

export const PARAM_LABEL: Record<ParamKey, string> = {
  meeting_attendance: "Meeting Attendance",
  exam_compliance: "Examination Compliances CCTV",
  social_media: "Social Media",
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
    case "exam_compliance":
      return [
        s.cctvSubmitted === false
          ? "CCTV submitted: No"
          : s.examEvents?.length
          ? `CCTV: ${s.examEvents.join(", ")}`
          : s.examEvent && `${s.examEvent} exam`,
        s.cctvObservation && `Observation: ${s.cctvObservation}`,
      ]
        .filter(Boolean)
        .join(" · ");
    case "social_media":
      if (s.postedOnSocialMedia === false) return "Posted: No";
      return s.socialPlatform ? `Posted: Yes (${s.socialPlatform})` : "Posted: Yes";
    case "monthly_enrolment":
      return `${(s.months ?? []).length} month(s): ${(s.months ?? []).map((m: any) => m.month).join(", ")}`;
    default:
      return "";
  }
}

/** Marks to show the DCU: real marks once reviewed, "—" while pending. */
export function marksLabel(s: any): string {
  if (s.status === "accepted") return `${s.calculatedMarks}/25`;
  if (s.status === "rejected") return "0/25";
  return "—";
}
