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
