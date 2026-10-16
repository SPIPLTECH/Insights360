/** Dropdown options shared by the DCU forms (client) and the API (server). */
export const EXAM_EVENTS = ["Feb", "Apr", "Jun", "Jul", "Aug", "Oct", "Dec"] as const;
export type ExamEvent = (typeof EXAM_EVENTS)[number];
export const EXAM_MANDATORY_OPTIONS = ["Mandatory", "Not Mandatory"] as const;
export const CCTV_OBSERVATIONS = ["Bad", "Poor", "Average", "Good", "Best"] as const;
export const SOCIAL_PRESENCE_OPTIONS = ["Regular", "Irregular"] as const;

/** Calendar month (0 = Jan) in which each examination event takes place. */
export const EXAM_EVENT_MONTH: Record<ExamEvent, number> = {
  Feb: 1,
  Apr: 3,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Oct: 9,
  Dec: 11,
};

/** Maps old spellings ("April", "June", "July"...) to the short event names. */
export function normalizeEvent(raw: string): ExamEvent | null {
  const k = String(raw ?? "").trim().toLowerCase().slice(0, 3);
  return (EXAM_EVENTS as readonly string[]).find((e) => e.toLowerCase() === k) as ExamEvent | undefined ?? null;
}

/** An event counts as "conducted" once its month has started. Before that it shows as "—" (pending). */
export function isEventConducted(event: ExamEvent, now: Date = new Date()): boolean {
  return now.getMonth() >= EXAM_EVENT_MONTH[event];
}
