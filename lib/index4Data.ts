import { loadDashboardData } from "./dataService";

/**
 * Index 4 raw data — exactly what sits in the Google Sheet's Index-4 tab,
 * WITHOUT any points / total / eligibility columns.
 * Rows stay in the exact sheet order (first ALC to last ALC); nothing is sorted or recalculated.
 */

export interface Index4Table {
  headers: string[];
  rows: string[][];
  fetchedAt: string;
}

// Sheet column positions (see INDEX4_CONFIG in sheetConfigs.ts) -> export header.
// Every "Points", "Total Points(100)" and "Eligible/Not Eligible" column is left out.
const DATA_COLUMNS: { index: number; header: string }[] = [
  { index: 0, header: "ALC Code" },
  { index: 1, header: "ALC Center Name" },
  { index: 2, header: "District" },
  { index: 3, header: "Area" },
  { index: 4, header: "Meeting Attendance (%)" },
  { index: 6, header: "Examination Compliance CCTV (Yes/No)" },
  { index: 8, header: "Social Media Presence (Yes/No)" },
  { index: 10, header: "Month wise Enrolment Consistency (Consistent Months)" },
];

export async function loadIndex4Table(): Promise<
  { ok: true; table: Index4Table } | { ok: false; status: number; message: string }
> {
  const result = await loadDashboardData();
  if (!result.ok) {
    return { ok: false, status: result.error.code === "CONFIG" ? 500 : 502, message: result.error.message };
  }
  const view = result.data.views.index4;
  const positions = DATA_COLUMNS.map((d) => view.columns.findIndex((c) => c.index === d.index));

  const rows = view.rows.map((r) => positions.map((p) => (p >= 0 ? (r.cells[p] ?? "").toString().replace(/\s+/g, " ").trim() : "")));

  return {
    ok: true,
    table: { headers: DATA_COLUMNS.map((d) => d.header), rows, fetchedAt: result.data.fetchedAt },
  };
}
