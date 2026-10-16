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

/**
 * Examination Compliance CCTV (out of 25).
 *   marks = 25 x (CCTV submitted / exam events selected) x quality factor
 * Quality factor comes from the CCTV observation. Change the numbers here
 * to change the scoring - nothing else needs to be touched.
 *   e.g. 4 events selected, 3 submitted, "Good" -> 25 x 0.75 x 0.75 = 14.1
 */
export const CCTV_QUALITY_FACTOR: Record<string, number> = {
  Best: 1,
  Good: 0.75,
  Average: 0.5,
  Poor: 0.25,
};

export function examComplianceMarks(selectedCount: number, submittedCount: number, observation?: string | null): number {
  if (selectedCount <= 0 || submittedCount <= 0) return 0;
  const submitted = Math.min(submittedCount, selectedCount);
  const factor = CCTV_QUALITY_FACTOR[observation ?? ""] ?? 0;
  return round1(25 * (submitted / selectedCount) * factor);
}

/** Binary marks: full marks only on MRCU accept (used by Social Media). */
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

/**
 * Month-wise Enrolment Consistency — SLAB marks. This is the rule that is
 * actually written to the Google Sheet when MRCU accepts, and it is also what
 * the MRCU dashboard shows as "marks if accepted", so both always agree.
 *   10+ months -> 25, 8-9 -> 20, 6-7 -> 15, 4-5 -> 10, below 4 -> 0
 * (monthlyEnrolmentMarks above is the older proportional rule and is no
 * longer used.)
 */
export function monthlyEnrolmentSlabMarks(distinctMonthsCount: number): number {
  const n = Math.max(0, Math.min(12, distinctMonthsCount));
  if (n >= 10) return 25;
  if (n >= 8) return 20;
  if (n >= 6) return 15;
  if (n >= 4) return 10;
  return 0;
}


/**
 * Examination Compliance CCTV — 2 parts, 12.5 each (total 25).
 *
 * Part 1 · CCTV Submitted (Yes/No) + exam events:
 *   events with CCTV submitted: 4 or more -> 12.5 (full), 3 -> 9.375, 2 -> 6.25, 1 -> 3.125,
 *   0 / blank / "No" -> 0.   (= 12.5 x min(events, 4) / 4)
 * Part 2 · General Observations (out of 12.5):
 *   Bad 0 · Poor 0.25 · Average 0.50 · Good 0.75 · Best full   (fraction x 12.5)
 */
export const EXAM_PART_MAX = 12.5;
export const FULL_MARKS_EVENTS = 4;

export const OBSERVATION_FRACTION: Record<string, number> = {
  Bad: 0,
  Poor: 0.25,
  Average: 0.5,
  Good: 0.75,
  Best: 1,
};

export function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function cctvEventsMarks(submitted: boolean, eventsCount: number): number {
  if (!submitted || eventsCount <= 0) return 0;
  return round3((EXAM_PART_MAX * Math.min(eventsCount, FULL_MARKS_EVENTS)) / FULL_MARKS_EVENTS);
}

export function observationMarks(observation?: string | null): number {
  return round3(EXAM_PART_MAX * (OBSERVATION_FRACTION[observation ?? ""] ?? 0));
}


/**
 * Examination Compliances (out of 25) — Part 1 (CCTV, 12.5) + Part 2 (annual observation, 12.5).
 * Part 1 = 12.5 x (events with CCTV submitted / events allotted & already conducted).
 */
export function cctvGridMarks(submittedCount: number, eligibleCount: number): number {
  if (eligibleCount <= 0 || submittedCount <= 0) return 0;
  return round3((EXAM_PART_MAX * Math.min(submittedCount, eligibleCount)) / eligibleCount);
}

/** Social Media Presence (out of 25): Regular = 25, Irregular = 15.5. */
export const SOCIAL_PRESENCE_MARKS: Record<string, number> = { Regular: 25, Irregular: 15.5 };
export function socialPresenceMarks(presence?: string | null): number {
  return SOCIAL_PRESENCE_MARKS[presence ?? ""] ?? 0;
}
