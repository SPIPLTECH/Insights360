import { NextResponse } from "next/server";
import { loadDashboardData, REVALIDATE_SECONDS } from "@/lib/dataService";

export const revalidate = 0; // we manage freshness manually via fetch polling on the client

export async function GET() {
  const result = await loadDashboardData();

  if (!result.ok) {
    const status = result.error.code === "CONFIG" ? 500 : 502;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json(
    { ok: true, data: result.data },
    {
      headers: {
        "Cache-Control": `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 3}`,
      },
    }
  );
}
