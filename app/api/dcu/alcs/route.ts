import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { loadDashboardData } from "@/lib/dataService";

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });
  }

  const result = await loadDashboardData();
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: 502 });
  }

  const { columns, rows } = result.data.views.home;
  const codeIdx = columns.findIndex((c) => c.field === "ALC Code");
  const nameIdx = columns.findIndex((c) => c.field === "ALC Center Name");
  const districtIdx = columns.findIndex((c) => c.field === "District");

  const alcs = rows
    .filter((r) => r.cells[districtIdx]?.trim().toLowerCase() === user.district!.trim().toLowerCase())
    .map((r) => ({ alcCode: r.cells[codeIdx], alcName: r.cells[nameIdx] }));

  return NextResponse.json({ alcs });
}
