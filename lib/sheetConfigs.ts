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
    { index: 7, field: "Eligible/Not Eligible", groupPath: ["MSCIT"] },
    { index: 8, field: "Admissions", groupPath: ["KLiC"] },
    { index: 9, field: "Points", groupPath: ["KLiC"] },
    { index: 10, field: "Bonus Points", groupPath: ["KLiC"] },
    { index: 11, field: "Eligible/Not Eligible", groupPath: ["KLiC"] },
    { index: 12, field: "Admissions", groupPath: ["CCTP"] },
    { index: 13, field: "Points", groupPath: ["CCTP"] },
    { index: 14, field: "Bonus Points", groupPath: ["CCTP"] },
    { index: 15, field: "Eligible/Not Eligible", groupPath: ["CCTP"] },
    { index: 16, field: "Total Points(350)", groupPath: [] },
    { index: 17, field: "Bonus Points", groupPath: [] },
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
    { index: 7, field: "Eligible/Not Eligible", groupPath: ["MoM"] },
    { index: 8, field: "Target Achieved", groupPath: ["AI Masterclass"] },
    { index: 9, field: "Points", groupPath: ["AI Masterclass"] },
    { index: 10, field: "Bonus Points", groupPath: ["AI Masterclass"] },
    { index: 11, field: "Eligible/Not Eligible", groupPath: ["AI Masterclass"] },
    { index: 12, field: "Target Achieved", groupPath: ["SSC / HSC"] },
    { index: 13, field: "Points", groupPath: ["SSC / HSC"] },
    { index: 14, field: "Bonus Points", groupPath: ["SSC / HSC"] },
    { index: 15, field: "Eligible/Not Eligible", groupPath: ["SSC / HSC"] },
    { index: 16, field: "Completed?", groupPath: ["ODOT 1"] },
    { index: 17, field: "Points", groupPath: ["ODOT 1"] },
    { index: 18, field: "Eligible/Not Eligible", groupPath: ["ODOT 1"] },
    { index: 19, field: "Completed?", groupPath: ["ODOT 2"] },
    { index: 20, field: "Points", groupPath: ["ODOT 2"] },
    { index: 21, field: "Eligible/Not Eligible", groupPath: ["ODOT 2"] },
    { index: 22, field: "Total Points(200)", groupPath: [] },
    { index: 23, field: "Bonus Points", groupPath: [] },
  ],
};

// ---------------------------------------------------------------------
// Index-3  —  Learning Excellence  (Sheet 1, tab "Index-3")
// Two top-level sections (MSCIT, KLiC), each with their own metrics.
// ---------------------------------------------------------------------
export const INDEX3_CONFIG: SheetConfig = {
  headerRowCount: 4,
  coreCols: CORE,
  columns: [
    ...CORE_COLUMNS,
    // ---- MSCIT section ----
    { index: 4, field: "Target Achieved", groupPath: ["MSCIT", "Timely Learning Start"] },
    { index: 5, field: "Points", groupPath: ["MSCIT", "Timely Learning Start"] },
    { index: 6, field: "Bonus Points", groupPath: ["MSCIT", "Timely Learning Start"] },
    { index: 7, field: "Eligible/Not Eligible", groupPath: ["MSCIT", "Timely Learning Start"] },
    { index: 8, field: "Consistency?", groupPath: ["MSCIT", "Learning Consistency"] },
    { index: 9, field: "Points", groupPath: ["MSCIT", "Learning Consistency"] },
    { index: 10, field: "Bonus Points", groupPath: ["MSCIT", "Learning Consistency"] },
    { index: 11, field: "Eligible/Not Eligible", groupPath: ["MSCIT", "Learning Consistency"] },
    { index: 12, field: "Target Achieved", groupPath: ["MSCIT", "Course Completion"] },
    { index: 13, field: "Points", groupPath: ["MSCIT", "Course Completion"] },
    { index: 14, field: "Bonus Points", groupPath: ["MSCIT", "Course Completion"] },
    { index: 15, field: "Eligible/Not Eligible", groupPath: ["MSCIT", "Course Completion"] },
    { index: 16, field: "Yes/No", groupPath: ["MSCIT", "Biometric Attendance"] },
    { index: 17, field: "Points", groupPath: ["MSCIT", "Biometric Attendance"] },
    { index: 18, field: "Installed", groupPath: ["MSCIT", "Learner App"] },
    { index: 19, field: "Points", groupPath: ["MSCIT", "Learner App"] },
    { index: 20, field: "Yes/No", groupPath: ["MSCIT", "Certification Success"] },
    { index: 21, field: "Points", groupPath: ["MSCIT", "Certification Success"] },
    { index: 22, field: "Total Points(120)", groupPath: ["MSCIT"] },
    // col 23 is an unused spacer in the template — intentionally skipped
    // ---- KLiC section ----
    { index: 24, field: "Target Achieved", groupPath: ["KLiC", "Timely Learning Start"] },
    { index: 25, field: "Points", groupPath: ["KLiC", "Timely Learning Start"] },
    { index: 26, field: "Bonus Points", groupPath: ["KLiC", "Timely Learning Start"] },
    { index: 27, field: "Eligible/Not Eligible", groupPath: ["KLiC", "Timely Learning Start"] },
    { index: 28, field: "Consistency?", groupPath: ["KLiC", "Learning Consistency"] },
    { index: 29, field: "Points", groupPath: ["KLiC", "Learning Consistency"] },
    { index: 30, field: "Bonus Points", groupPath: ["KLiC", "Learning Consistency"] },
    { index: 31, field: "Eligible/Not Eligible", groupPath: ["KLiC", "Learning Consistency"] },
    { index: 32, field: "Target Achieved", groupPath: ["KLiC", "Course Completion"] },
    { index: 33, field: "Points", groupPath: ["KLiC", "Course Completion"] },
    { index: 34, field: "Bonus Points", groupPath: ["KLiC", "Course Completion"] },
    { index: 35, field: "Eligible/Not Eligible", groupPath: ["KLiC", "Course Completion"] },
    { index: 36, field: "Yes/No", groupPath: ["KLiC", "Certification Success"] },
    { index: 37, field: "Points", groupPath: ["KLiC", "Certification Success"] },
    { index: 38, field: "Total Points(80)", groupPath: ["KLiC"] },
    // col 39 is an unused spacer in the template — intentionally skipped
    { index: 40, field: "Total Points(200)", groupPath: [] },
    { index: 41, field: "Bonus Points", groupPath: [] },
  ],
};

// ---------------------------------------------------------------------
// Index-4  —  Professional Excellence Index  (same spreadsheet, tab "Index-4")
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// Home Dashboard  (Sheet 1, tab "Home Dashboard")
// This tab already has its own formulas for Points/Bonus/Eligible/Total/
// Level per ALC — the dashboard just mirrors these cells, nothing here
// is recalculated in code.
// ---------------------------------------------------------------------
export const HOME_CONFIG: SheetConfig = {
  headerRowCount: 2,
  coreCols: CORE,
  columns: [
    ...CORE_COLUMNS,
    { index: 4, field: "Points", groupPath: ["Index-1 Business Growth"] },
    { index: 5, field: "Bonus Points", groupPath: ["Index-1 Business Growth"] },
    { index: 6, field: "Eligible/Not Eligible", groupPath: ["Index-1 Business Growth"] },
    { index: 7, field: "Points", groupPath: ["Index 2 - Ecosystem Participation"] },
    { index: 8, field: "Bonus Points", groupPath: ["Index 2 - Ecosystem Participation"] },
    { index: 9, field: "Eligible/Not Eligible", groupPath: ["Index 2 - Ecosystem Participation"] },
    { index: 10, field: "Points", groupPath: ["Index 3 - Learning Excellence"] },
    { index: 11, field: "Bonus Points", groupPath: ["Index 3 - Learning Excellence"] },
    { index: 12, field: "Eligible/Not Eligible", groupPath: ["Index 3 - Learning Excellence"] },
    { index: 13, field: "Points", groupPath: ["Index 4 - Professional Excellence Index"] },
    { index: 14, field: "Bonus Points", groupPath: ["Index 4 - Professional Excellence Index"] },
    { index: 15, field: "Eligible/Not Eligible", groupPath: ["Index 4 - Professional Excellence Index"] },
    { index: 16, field: "Total Points(850)", groupPath: [] },
    { index: 17, field: "Bonus Points", groupPath: [] },
    { index: 18, field: "Level", groupPath: [] },
  ],
};

export const INDEX4_CONFIG: SheetConfig = {
  headerRowCount: 3,
  coreCols: CORE,
  columns: [
    ...CORE_COLUMNS,
    { index: 4, field: "Attendace %", groupPath: ["Meeting Attendance"] },
    { index: 5, field: "Points", groupPath: ["Meeting Attendance"] },
    { index: 6, field: "Eligible/Not Eligible", groupPath: ["Meeting Attendance"] },
    { index: 7, field: "Yes/No", groupPath: ["Examination Compliance CCTV"] },
    { index: 8, field: "Points", groupPath: ["Examination Compliance CCTV"] },
    { index: 9, field: "Eligible/Not Eligible", groupPath: ["Examination Compliance CCTV"] },
    { index: 10, field: "Yes/No", groupPath: ["Social Media Presence"] },
    { index: 11, field: "Points", groupPath: ["Social Media Presence"] },
    { index: 12, field: "Eligible/Not Eligible", groupPath: ["Social Media Presence"] },
    { index: 13, field: "Yes/No", groupPath: ["Month wise enrolment consistency"] },
    { index: 14, field: "Points", groupPath: ["Month wise enrolment consistency"] },
    { index: 15, field: "Eligible/Not Eligible", groupPath: ["Month wise enrolment consistency"] },
    { index: 16, field: "Total Points(100)", groupPath: [] },
  ],
};
