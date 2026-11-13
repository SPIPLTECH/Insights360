/**
 * Export ALL districts' real DCU-uploaded data to Excel (no points, no calculations).
 *
 * Put this file at:   <project-root>/scripts/export-all-data.ts
 * Run from root:      npx tsx --env-file=.env.local scripts/export-all-data.ts
 * Output:             <project-root>/All_Districts_Data_YYYY-MM-DD.xlsx
 *
 * Sheets:
 *   1) Meeting Attendance
 *   2) Examination Compliance
 *   3) Social Media Presence
 *   4) Monthly Enrollment (already in Google Sheet -> exported as-is)
 */
import ExcelJS from "exceljs";
import path from "path";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { loadAllotments } from "@/lib/allotments";
import { loadIndex4Table } from "@/lib/index4Data";

const findCol = (headers: string[], re: RegExp, fallback: number) => {
  const i = headers.findIndex((h) => re.test(String(h)));
  return i >= 0 ? i : fallback;
};

function addSheet(wb: ExcelJS.Workbook, name: string, headers: string[], rows: any[][]) {
  const ws = wb.addWorksheet(name);
  ws.addRow(headers);
  const head = ws.getRow(1);
  head.font = { bold: true };
  head.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  head.height = 30;
  rows.forEach((r) => ws.addRow(r));
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headers.length } };
  ws.columns.forEach((col, i) => {
    const longest = rows.reduce((m, r) => Math.max(m, String(r[i] ?? "").length), String(headers[i]).length);
    col.width = Math.min(Math.max(longest + 2, 12), 50);
  });
}

async function main() {
  // ---- ALC master list (Code, Name, Taluka, District) from the Google-sheet Index 4 table ----
  const t: any = await loadIndex4Table();
  if (!t.ok) throw new Error(`Google Sheet load failed: ${t.message}`);
  const H: string[] = t.table.headers;
  const R: any[][] = t.table.rows;

  const cCode = findCol(H, /code/i, 0);
  const cName = findCol(H, /name/i, 1);
  const cTal = findCol(H, /taluka/i, 2);
  const cDist = findCol(H, /district/i, 3);

  const master = R.map((r) => ({
    code: String(r[cCode] ?? "").trim(),
    name: r[cName] ?? "",
    taluka: r[cTal] ?? "",
    district: r[cDist] ?? "",
  })).sort(
    (a, b) =>
      String(a.district).localeCompare(String(b.district)) || String(a.name).localeCompare(String(b.name))
  );

  // ---- Latest DCU submission per ALC + parameter (real uploaded data) ----
  await connectDB();
  const all: any[] = await Submission.find({}).sort({ createdAt: -1 }).lean();
  const latest = new Map<string, any>();
  for (const s of all) {
    const key = `${String(s.alcCode).trim()}|${s.parameterType}`;
    if (!latest.has(key)) latest.set(key, s);
  }
  const get = (code: string, type: string) => latest.get(`${code}|${type}`);
  const { map: allot } = await loadAllotments();

  const idCols = (m: any) => [m.code, m.name, m.taluka, m.district];

  // 1) Meeting Attendance
  const meeting = master.map((m) => {
    const s = get(m.code, "meeting_attendance");
    return [
      ...idCols(m),
      s?.totalMeetings ?? "",
      s?.attendedMeetings ?? "",
      s?.attendancePercent != null ? `${s.attendancePercent}%` : "",
    ];
  });

  // 2) Examination Compliance
  const exam = master.map((m) => {
    const s = get(m.code, "exam_compliance");
    const allotted = ((allot as any)?.[m.code] ?? []).join(", ");
    const submitted = Array.isArray(s?.examEvents) ? s.examEvents.join(", ") : "";
    return [...idCols(m), allotted, s ? submitted || "None" : "", s?.cctvObservation ?? ""];
  });

  // 3) Social Media Presence
  const social = master.map((m) => {
    const s = get(m.code, "social_media");
    return [...idCols(m), s?.instagramLink ?? "", s?.facebookLink ?? "", s?.socialPresence ?? ""];
  });

  // ---- Build workbook ----
  const wb = new ExcelJS.Workbook();
  const id = ["ALC Code", "ALC Name", "ALC Taluka", "ALC District"];

  addSheet(
    wb,
    "1) Meeting Attendance",
    [...id, "No. of Meetings Conducted/Scheduled", "No. of Meetings Attended", "Attendance %"],
    meeting
  );
  addSheet(
    wb,
    "2) Examination Compliance",
    [
      ...id,
      "Examination Allotment",
      "Examination Compliance CCTV Submitted",
      "General Observation (Bad, Poor, Average, Good, Best)",
    ],
    exam
  );
  addSheet(
    wb,
    "3) Social Media Presence",
    [...id, "Instagram Link", "Facebook Link", "Social Media Presence (Regular/Irregular)"],
    social
  );
  addSheet(wb, "4) Monthly Enrollment", H, R);

  const file = path.join(process.cwd(), `All_Districts_Data_${new Date().toISOString().slice(0, 10)}.xlsx`);
  await wb.xlsx.writeFile(file);
  console.log(`✅ Downloaded: ${file}`);
  console.log(`   ALCs: ${master.length} | Submissions read: ${all.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Export failed:", e?.message ?? e);
    process.exit(1);
  });