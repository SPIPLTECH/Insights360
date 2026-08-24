/**
 * Diagnostic: writes a value into ONE specific Index-4 cell, then reads
 * that exact cell back every 5 seconds for a minute, printing what's
 * actually in it each time. This tells us for certain whether the sheet
 * itself is reverting the value (and how fast), independent of anyone
 * visually watching the tab.
 *
 * Run with:  npx tsx scripts/testSheetWrite.ts <ALC_CODE>
 * e.g.       npx tsx scripts/testSheetWrite.ts 14210072
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { writeIndex4Marks } from "../lib/googleSheetsWrite";
import { getIndex4Raw } from "../lib/googleSheets";
import { INDEX4_CONFIG } from "../lib/sheetConfigs";

async function readCell(alcCode: string) {
  const grid = await getIndex4Raw();
  for (let i = INDEX4_CONFIG.headerRowCount; i < grid.length; i++) {
    if ((grid[i]?.[INDEX4_CONFIG.coreCols.alcCode] ?? "").trim() === alcCode.trim()) {
      const valueCol = INDEX4_CONFIG.columns.find(
        (c) => c.groupPath[0] === "Meeting Attendance" && c.field !== "Points"
      )!;
      const pointsCol = INDEX4_CONFIG.columns.find(
        (c) => c.groupPath[0] === "Meeting Attendance" && c.field === "Points"
      )!;
      return { value: grid[i][valueCol.index], points: grid[i][pointsCol.index] };
    }
  }
  return null;
}

async function main() {
  const alcCode = process.argv[2];
  if (!alcCode) {
    console.error("Usage: npx tsx scripts/testSheetWrite.ts <ALC_CODE>");
    process.exit(1);
  }

  console.log(`Writing test value to Meeting Attendance for ALC ${alcCode} ...`);
  await writeIndex4Marks({
    alcCode,
    parameterType: "meeting_attendance",
    value: "77%",
    points: 19.25,
  });
  console.log("Write done. Now polling the same cell every 5s for 60s:\n");

  for (let i = 0; i < 12; i++) {
    const cell = await readCell(alcCode);
    console.log(`[t=${i * 5}s]`, cell);
    await new Promise((r) => setTimeout(r, 5000));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});