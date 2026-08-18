export type RawGrid = string[][];

/**
 * Server-side only Google Sheets access layer.
 * Never import this file from a client component.
 *
 * AUTH STRATEGY: Google Sheets API key (read-only, public-link sheets).
 * This is used instead of a service-account JWT because service-account
 * key creation is blocked by an org policy (iam.disableServiceAccountKeyCreation)
 * on this GCP project. An API key can only read a sheet if that sheet's
 * link-sharing is set to "Anyone with the link -> Viewer". It cannot write,
 * and it cannot read sheets that are still restricted, so per-file access
 * control is effectively "is this sheet link-public or not."
 *
 * If you later get org-policy access (or move to a personal Google account
 * project) and want tighter access control, swap this file back to a
 * service-account JWT flow - the rest of the app (dataService.ts,
 * dataParser.ts, calculations.ts) does not need to change either way.
 */

export class SheetsConfigError extends Error {}
export class SheetsFetchError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
  }
}

const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

function getApiKey(): string {
  const key = process.env.GOOGLE_SHEETS_API_KEY;
  if (!key) {
    throw new SheetsConfigError("Missing GOOGLE_SHEETS_API_KEY environment variable.");
  }
  return key;
}

async function fetchRange(spreadsheetId: string, range: string): Promise<RawGrid> {
  if (!spreadsheetId) {
    throw new SheetsConfigError(`Missing spreadsheet id for range "${range}".`);
  }
  const apiKey = getApiKey();
  const url = `${SHEETS_API_BASE}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(
    range
  )}?valueRenderOption=FORMATTED_VALUE&key=${apiKey}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (err) {
    throw new SheetsFetchError(`Network error contacting Google Sheets API (range: ${range}).`, err);
  }

  if (!res.ok) {
    let bodyMessage = "";
    try {
      const body = await res.json();
      bodyMessage = body?.error?.message ?? "";
    } catch {
      // ignore body parse failure
    }

    if (res.status === 404) {
      throw new SheetsFetchError(
        `Spreadsheet or sheet tab not found (range: ${range}). Check the Sheet ID and that the tab name matches exactly.`
      );
    }
    if (res.status === 403) {
      throw new SheetsFetchError(
        `Access denied (range: ${range}). The API key needs the sheet's link-sharing set to ` +
          `"Anyone with the link -> Viewer", and the Google Sheets API must be enabled for this key's project.` +
          (bodyMessage ? ` Google says: ${bodyMessage}` : "")
      );
    }
    if (res.status === 400) {
      throw new SheetsFetchError(
        `Bad request (range: ${range}).${bodyMessage ? ` Google says: ${bodyMessage}` : " Check GOOGLE_SHEETS_API_KEY is valid."}`
      );
    }
    throw new SheetsFetchError(
      `Failed to fetch data from Google Sheets (range: ${range}, status: ${res.status}).${
        bodyMessage ? ` Google says: ${bodyMessage}` : ""
      }`
    );
  }

  const json = (await res.json()) as { values?: unknown[][] };
  const values = json.values ?? [];
  return values.map((row) => row.map((c) => (c === null || c === undefined ? "" : String(c))));
}

const SHEET_1_ID = () => process.env.GOOGLE_SHEET_1_ID ?? "";

// Wide ranges - actual data-detection happens in the parser, since header
// rows are multi-row / merged and row counts vary.
export async function getHomeRaw(): Promise<RawGrid> {
  return fetchRange(SHEET_1_ID(), "Home Dashboard!A1:S2000");
}

export async function getIndex1Raw(): Promise<RawGrid> {
  return fetchRange(SHEET_1_ID(), "Index-1!A1:R2000");
}

export async function getIndex2Raw(): Promise<RawGrid> {
  return fetchRange(SHEET_1_ID(), "Index-2!A1:X2000");
}

export async function getIndex3Raw(): Promise<RawGrid> {
  return fetchRange(SHEET_1_ID(), "Index-3!A1:AO2000");
}

// All tabs (Home Dashboard, Index-1, Index-2, Index-3, Index-4) now live in
// the SAME spreadsheet — only one Sheet ID is needed.
export async function getIndex4Raw(): Promise<RawGrid> {
  return fetchRange(SHEET_1_ID(), "Index-4!A1:Q2000");
}
