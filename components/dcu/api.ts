/** Posts one DCU submission and throws a readable Error on failure. */
export async function postSubmission(payload: Record<string, unknown>) {
  const res = await fetch("/api/dcu/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || `Request failed with status ${res.status}.`);
  }
  if (!res.ok) throw new Error(json.error || "Submission failed.");
  return json.submission;
}

/** Saves ONE ALC row (pencil -> save). Creates or updates the DCU's submission for that ALC. */
export async function upsertRow(payload: Record<string, unknown>) {
  const res = await fetch("/api/dcu/submissions/upsert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || `Request failed with status ${res.status}.`);
  }
  if (!res.ok) throw new Error(json.error || "Could not save.");
  return json.submission;
}
