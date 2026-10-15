import { getIndex4Raw } from "./googleSheets";
import { INDEX4_CONFIG } from "./sheetConfigs";
import type { ParameterType } from "@/models/Submission";

/**
 * WRITE layer for the Google Sheet (googleSheets.ts is read-only).
 * Writing goes ONLY through the Google Apps Script web app (doPost in Code.gs).
 * No OAuth, no refresh token.
 *
 * .env.local needs:
 *   GOOGLE_MARKS_SCRIPT_URL=<web app URL ending in /exec>
 *   GOOGLE_MARKS_SCRIPT_SECRET=<same value as SECRET in Script properties>
 */

const INDEX4_TAB = "Index-4";

function colLetter(index: number): string {
  let n = index + 1;
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function findColumns(groupLabel: string) {
  const valueCol = INDEX4_CONFIG.columns.find(
    (c) => c.groupPath[0] === groupLabel && c.field !== "Points"
  );
  const pointsCol = INDEX4_CONFIG.columns.find(
    (c) => c.groupPath[0] === groupLabel && c.field === "Points"
  );
  if (!valueCol || !pointsCol) {
    throw new Error(`Could not locate columns for Index-4 group "${groupLabel}" in sheetConfigs.ts`);
  }
  return { valueCol: colLetter(valueCol.index), pointsCol: colLetter(pointsCol.index) };
}

const PARAMETER_GROUPS: Record<ParameterType, string> = {
  meeting_attendance: "Meeting Attendance",
  exam_compliance: "Examination Compliance CCTV",
  social_media: "Social Media Presence",
  monthly_enrolment: "Month wise enrolment consistency",
};

/** Finds the 1-indexed sheet row for a given ALC Code in the Index-4 tab. */
async function findAlcRow(alcCode: string): Promise<number> {
  const grid = await getIndex4Raw();
  for (let i = INDEX4_CONFIG.headerRowCount; i < grid.length; i++) {
    if ((grid[i]?.[INDEX4_CONFIG.coreCols.alcCode] ?? "").trim() === alcCode.trim()) {
      return i + 1;
    }
  }
  throw new Error(`ALC Code "${alcCode}" not found in the Index-4 sheet.`);
}

/** Writes the value cell and the Points cell for one parameter of one ALC. */
export async function writeIndex4Marks(params: {
  alcCode: string;
  parameterType: ParameterType;
  value: string;
  points: number;
}) {
  const { alcCode, parameterType, value, points } = params;
  const { valueCol, pointsCol } = findColumns(PARAMETER_GROUPS[parameterType]);
  const row = await findAlcRow(alcCode);

  await writeViaMarksScript([
    { cell: `${valueCol}${row}`, value },
    { cell: `${pointsCol}${row}`, value: points },
  ]);
}

async function writeViaMarksScript(updates: { cell: string; value: string | number }[]) {
  const url = process.env.GOOGLE_MARKS_SCRIPT_URL;
  const secret = process.env.GOOGLE_MARKS_SCRIPT_SECRET;
  if (!url) throw new Error("Missing GOOGLE_MARKS_SCRIPT_URL in .env.local (the Apps Script web app URL).");
  if (!secret) throw new Error("Missing GOOGLE_MARKS_SCRIPT_SECRET in .env.local (must match SECRET in Script properties).");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret, tab: INDEX4_TAB, updates }),
    redirect: "follow",
    cache: "no-store",
  });
  const text = await res.text();
  let json: { ok?: boolean; error?: string } = {};
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`MarksWriter returned a non-JSON response (deployment access must be "Anyone"): ${text.slice(0, 200)}`);
  }
  if (!json.ok) throw new Error(`MarksWriter write failed: ${json.error ?? "unknown error"}`);
}