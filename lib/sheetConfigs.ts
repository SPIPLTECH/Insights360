/**
 * EXACT column layout of each index sheet, taken directly from the
 * organization's own Race-to-Recognition-Template.xlsx.
 *
 * We do NOT auto-detect headers from merged cells anymore — the template's
 * own merged-cell formatting is inconsistent in places (e.g. Index-3's
 * "MSCIT" group cell technically spans over the ALC Code/Name/District/Area
 * columns due to a merge quirk in the source file), which caused wrong
 * group labels to show up. Fixed positions guarantee the dashboard always
 * renders the exact same columns, in the exact same order, with the exact
 * same labels as the sheet — no matter what data gets typed into it later.
 *
 * If someone changes the tab's column layout, this file is the one place
 * to update it.
 */

export interface ColumnDef {
  index: number; // 0-based column index (A=0, B=1, ...)
  field: string; // exact field label, as it appears in the template
  groupPath: string[]; // [] | [section] | [section, metric]
}

export interface SheetConfig {
  headerRowCount: number; // how many header rows to skip before data starts
  coreCols: { alcCode: number; alcName: number; district: number; area: number };
  columns: ColumnDef[];
}

const CORE = { alcCode: 0, alcName: 1, district: 2, area: 3 };

const CORE_COLUMNS: ColumnDef[] = [
  { index: 0, field: "ALC Code", groupPath: [] },
  { index: 1, field: "ALC Center Name", groupPath: [] },
  { index: 2, field: "District", groupPath: [] },
  { index: 3, field: "Area", groupPath: [] },
];

// ---------------------------------------------------------------------
// Index-1  —  Business Growth  (Sheet 1, tab "Index-1")
// ---------------------------------------------------------------------
export const INDEX1_CONFIG: SheetConfig = {
  headerRowCount: 3,
  coreCols: CORE,
  columns: [
    ...CORE_COLUMNS,
    { index: 4, field: "Admissions", groupPath: ["MSCIT"] },
    { index: 5, field: "Points", groupPath: ["MSCIT"] },
    { index: 6, field: "Bonus Points", groupPath: ["MSCIT"] },
    { index: 7, field: "Admissions", groupPath: ["KLiC"] },
    { index: 8, field: "Points", groupPath: ["KLiC"] },
    { index: 9, field: "Bonus Points", groupPath: ["KLiC"] },
    { index: 10, field: "Admissions", groupPath: ["CCTP"] },
    { index: 11, field: "Points", groupPath: ["CCTP"] },
    { index: 12, field: "Bonus Points", groupPath: ["CCTP"] },
    { index: 13, field: "Total Points(350)", groupPath: [] },
    { index: 14, field: "Bonus Points", groupPath: [] },
    { index: 15, field: "Eligible/Not Eligible", groupPath: [] },
  ],
};

// ---------------------------------------------------------------------
// Index-2  —  Ecosystem Participation  (Sheet 1, tab "Index-2")
// ---------------------------------------------------------------------
export const INDEX2_CONFIG: SheetConfig = {
  headerRowCount: 3,
  coreCols: CORE,
  columns: [
    ...CORE_COLUMNS,
    { index: 4, field: "Target Achieved", groupPath: ["MoM"] },
    { index: 5, field: "Points", groupPath: ["MoM"] },
    { index: 6, field: "Bonus Points", groupPath: ["MoM"] },
    { index: 7, field: "Target Achieved", groupPath: ["AI Masterclass"] },
    { index: 8, field: "Points", groupPath: ["AI Masterclass"] },
    { index: 9, field: "Bonus Points", groupPath: ["AI Masterclass"] },
    { index: 10, field: "Target Achieved", groupPath: ["SSC / HSC"] },
    { index: 11, field: "Points", groupPath: ["SSC / HSC"] },
    { index: 12, field: "Bonus Points", groupPath: ["SSC / HSC"] },
    { index: 13, field: "Completed?", groupPath: ["ODOT 1"] },
    { index: 14, field: "Points", groupPath: ["ODOT 1"] },
    { index: 15, field: "Completed?", groupPath: ["ODOT 2"] },
    { index: 16, field: "Points", groupPath: ["ODOT 2"] },
    { index: 17, field: "Total Points(200)", groupPath: [] },
    { index: 18, field: "Bonus Points", groupPath: [] },
    { index: 19, field: "Eligible/Not Eligible", groupPath: [] },
  ],
};

// ---------------------------------------------------------------------
// Index-3  —  Learning Excellence  (Sheet 1, tab "Index-3")
// Two top-level sections (MSCIT, KLiC), each with their own metrics.
// UPDATED: column positions now match the actual template exactly
// (0-based) — a "Bonus Points" column follows each section's
// Total Points column, matching the real sheet layout.
// ---------------------------------------------------------------------
export const INDEX3_CONFIG: SheetConfig = {
  headerRowCount: 4,
  coreCols: CORE,
  columns: [
    ...CORE_COLUMNS,
    // ---- MSCIT section ----
    { index: 4, field: "Target Achieved", groupPath: ["MSCIT", "Timely Learning Start"] },
    { index: 5, field: "Points", groupPath: ["MSCIT", "Timely Learning Start"] },
    { index: 6, field: "Consistency?", groupPath: ["MSCIT", "Learning Consistency"] },
    { index: 7, field: "Points", groupPath: ["MSCIT", "Learning Consistency"] },
    { index: 8, field: "Target Achieved", groupPath: ["MSCIT", "Course Completion"] },
    { index: 9, field: "Points", groupPath: ["MSCIT", "Course Completion"] },
    { index: 10, field: "Yes/No", groupPath: ["MSCIT", "Biometric Attendance"] },
    { index: 11, field: "Points", groupPath: ["MSCIT", "Biometric Attendance"] },
    { index: 12, field: "Installed", groupPath: ["MSCIT", "Learner App"] },
    { index: 13, field: "Points", groupPath: ["MSCIT", "Learner App"] },
    { index: 14, field: "Success%", groupPath: ["MSCIT", "Certification Success"] },
    { index: 15, field: "Points", groupPath: ["MSCIT", "Certification Success"] },
    { index: 16, field: "Total Points(120)", groupPath: ["MSCIT"] },
    { index: 17, field: "MSCIT Credit Points", groupPath: ["MSCIT"] },

    // ---- KLiC section ----
    { index: 19, field: "Target Achieved", groupPath: ["KLiC", "Timely Learning Start"] },
    { index: 20, field: "Points", groupPath: ["KLiC", "Timely Learning Start"] },
    { index: 21, field: "Consistency?", groupPath: ["KLiC", "Learning Consistency"] },
    { index: 22, field: "Points", groupPath: ["KLiC", "Learning Consistency"] },
    { index: 23, field: "Target Achieved", groupPath: ["KLiC", "Course Completion"] },
    { index: 24, field: "Points", groupPath: ["KLiC", "Course Completion"] },
    { index: 25, field: "Yes/No", groupPath: ["KLiC", "Certification Success"] },
    { index: 26, field: "Points", groupPath: ["KLiC", "Certification Success"] },
    { index: 27, field: "Total Points(80)", groupPath: ["KLiC"] },
    { index: 28, field: "KLiC Credits Points", groupPath: ["KLiC"] },

    { index: 30, field: "Total Points(200)", groupPath: [] },
    { index: 31, field: "Total Credit Points", groupPath: [] },
    { index: 32, field: "Eligible/Not Eligible", groupPath: [] },
  ],
};

// ---------------------------------------------------------------------
// Index-4  —  Professional Excellence Index  (same spreadsheet, tab "Index-4")
// ---------------------------------------------------------------------
export const INDEX4_CONFIG: SheetConfig = {
  headerRowCount: 3,
  coreCols: CORE,
  columns: [
    ...CORE_COLUMNS,
    { index: 4, field: "Attendace %", groupPath: ["Meeting Attendance"] },
    { index: 5, field: "Points", groupPath: ["Meeting Attendance"] },
    { index: 6, field: "Yes/No", groupPath: ["Examination Compliance CCTV"] },
    { index: 7, field: "Points", groupPath: ["Examination Compliance CCTV"] },
    { index: 8, field: "Yes/No", groupPath: ["Social Media Presence"] },
    { index: 9, field: "Points", groupPath: ["Social Media Presence"] },
    { index: 10, field: "Yes/No", groupPath: ["Month wise enrolment consistency"] },
    { index: 11, field: "Points", groupPath: ["Month wise enrolment consistency"] },
    { index: 12, field: "Total Points(100)", groupPath: [] },
    { index: 13, field: "Eligible/Not Eligible", groupPath: [] },
  ],
};

// ---------------------------------------------------------------------
// Home Dashboard  (Sheet 1, tab "Home Dashboard")
// This tab already has its own formulas for Points/Bonus/Eligible/Total/
// Level per ALC — the dashboard just mirrors these cells, nothing here
// is recalculated in code.
//
// groupPath is split into 2 levels ["Index N", "Section Name"] so the
// table header renders as 3 stacked rows: Index N -> Section Name ->
// Points/Bonus Points/Eligibility Status.
// ---------------------------------------------------------------------
export const HOME_CONFIG: SheetConfig = {
  headerRowCount: 2,
  coreCols: CORE,
  columns: [
    ...CORE_COLUMNS,
    { index: 4, field: "Points", groupPath: ["Index 1", "Business Growth"] },
    { index: 5, field: "Bonus Points", groupPath: ["Index 1", "Business Growth"] },
    { index: 6, field: "Eligible/Not Eligible", groupPath: ["Index 1", "Business Growth"] },
    { index: 7, field: "Points", groupPath: ["Index 2", "Ecosystem Participation"] },
    { index: 8, field: "Bonus Points", groupPath: ["Index 2", "Ecosystem Participation"] },
    { index: 9, field: "Eligible/Not Eligible", groupPath: ["Index 2", "Ecosystem Participation"] },
    { index: 10, field: "Points", groupPath: ["Index 3", "Learning Excellence"] },
    { index: 11, field: "Bonus Points", groupPath: ["Index 3", "Learning Excellence"] },
    { index: 12, field: "Eligible/Not Eligible", groupPath: ["Index 3", "Learning Excellence"] },
    { index: 13, field: "Points", groupPath: ["Index 4", "Professional Excellence"] },
    { index: 14, field: "Bonus Points", groupPath: ["Index 4", "Professional Excellence"] },
    { index: 15, field: "Eligible/Not Eligible", groupPath: ["Index 4", "Professional Excellence"] },
    { index: 16, field: "Total Points(850)", groupPath: [] },
    { index: 17, field: "Bonus Points", groupPath: [] },
    { index: 18, field: "Level", groupPath: [] },
  ],
};