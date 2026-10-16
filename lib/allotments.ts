import ExamAllotment from "@/models/ExamAllotment";
import { normalizeEvent, ExamEvent } from "@/lib/dcuOptions";

/** alcCode -> allotted events. `configured` is false until at least one allotment has been uploaded. */
export async function loadAllotments(): Promise<{ map: Record<string, ExamEvent[]>; configured: boolean }> {
  const docs = (await ExamAllotment.find({}).lean()) as any[];
  const map: Record<string, ExamEvent[]> = {};
  for (const d of docs) {
    map[d.alcCode] = Array.from(new Set((d.events ?? []).map(normalizeEvent).filter(Boolean))) as ExamEvent[];
  }
  return { map, configured: docs.length > 0 };
}
