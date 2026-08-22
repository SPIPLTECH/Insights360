/**
 * Marks calculation for the 4 Index-4 (Professional Excellence) parameters.
 * Each is out of 25 points. Kept in one place so the DCU-side "preview"
 * and the MRCU-side "final" calculation always agree.
 */

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Meeting Attendance: proportional to attendance %. e.g. 80% -> 20/25. */
export function meetingAttendanceMarks(attendancePercent: number): number {
  const pct = Math.max(0, Math.min(100, attendancePercent));
  return round1((pct / 100) * 25);
}

/** Examination Compliance CCTV: binary — full marks only on MRCU accept. */
export function binaryMarks(accepted: boolean): number {
  return accepted ? 25 : 0;
}

/**
 * Month-wise Enrolment Consistency: 10, 11 or 12 distinct months submitted
 * -> full 25. Fewer than 10 -> proportional out of 25 (months/10 * 25).
 */
export function monthlyEnrolmentMarks(distinctMonthsCount: number): number {
  const months = Math.max(0, Math.min(12, distinctMonthsCount));
  if (months >= 10) return 25;
  return round1((months / 10) * 25);
}
