import { getIndex4Raw } from "./googleSheets";
import { INDEX4_CONFIG } from "./sheetConfigs";
import type { ParameterType } from "@/models/Submission";

/**
 * WRITE layer for the Google Sheet — separate from googleSheets.ts, which
 * is READ-ONLY (API-key based, per its own comments). Writing requires a
 * real Google account's OAuth2 access, since API keys can't write.
 *
 * ONE-TIME SETUP (do this once, then set the 3 env vars below):
 *   1. Google Cloud Console → APIs & Services → Credentials → Create
 *      Credentials → OAuth client ID → type "Desktop app".
 *   2. Use the OAuth 2.0 Playground (https://developers.google.com/oauthplayground)
 *      → gear icon → "Use your own OAuth credentials" → paste your client
 *      ID/secret → in the left panel select the "Google Sheets API v4"
 *      scope (https://www.googleapis.com/auth/spreadsheets) → Authorize
 *      using a Google account that has EDIT access to the target sheet →
 *      Exchange authorization code for tokens → copy the Refresh token.
 *   3. Set in .env.local:
 *        GOOGLE_OAUTH_CLIENT_ID=...
 *        GOOGLE_OAUTH_CLIENT_SECRET=...
 *        GOOGLE_OAUTH_REFRESH_TOKEN=...
 *      (GOOGLE_SHEET_1_ID is already set for reads — reused here.)
 */

const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const INDEX4_TAB = "Index-4";

// Column letters for each parameter's "value" and "points" cells, taken
// directly from INDEX4_CONFIG (0-based index -> A=0,B=1,...). Keeping this
// derived from the config (rather than hardcoded letters) means if the
// template's column order ever changes, this stays correct automatically.
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

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET / GOOGLE_OAUTH_REFRESH_TOKEN — required to write to Google Sheets (see comment at top of lib/googleSheetsWrite.ts)."
    );
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to refresh Google OAuth access token: ${body}`);
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

/** Finds the 1-indexed sheet row for a given ALC Code in the Index-4 tab. */
async function findAlcRow(alcCode: string): Promise<number> {
  const grid = await getIndex4Raw();
  for (let i = INDEX4_CONFIG.headerRowCount; i < grid.length; i++) {
    if ((grid[i]?.[INDEX4_CONFIG.coreCols.alcCode] ?? "").trim() === alcCode.trim()) {
      return i + 1; // 1-indexed sheet row
    }
  }
  throw new Error(`ALC Code "${alcCode}" not found in the Index-4 sheet.`);
}

/**
 * Writes the "value" cell (e.g. "80%", "Yes"/"No") and the "Points" cell
 * for one Index-4 parameter, for one ALC. Called only after an MRCU accept
 * (marks = calculatedMarks) or reject (marks = 0, value reflects the
 * rejected state).
 */
export async function writeIndex4Marks(params: {
  alcCode: string;
  parameterType: ParameterType;
  value: string; // what goes in the "Attendace %" / "Yes/No" column
  points: number;
}) {
  const { alcCode, parameterType, value, points } = params;
  const { valueCol, pointsCol } = findColumns(PARAMETER_GROUPS[parameterType]);
  const row = await findAlcRow(alcCode);
  const accessToken = await getAccessToken();

  const res = await fetch(
    `${SHEETS_API_BASE}/${encodeURIComponent(process.env.GOOGLE_SHEET_1_ID ?? "")}/values:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valueInputOption: "USER_ENTERED",
        data: [
          { range: `${INDEX4_TAB}!${valueCol}${row}`, values: [[value]] },
          { range: `${INDEX4_TAB}!${pointsCol}${row}`, values: [[points]] },
        ],
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to write Index-4 marks to Google Sheet for ALC ${alcCode}: ${body}`);
  }
}
