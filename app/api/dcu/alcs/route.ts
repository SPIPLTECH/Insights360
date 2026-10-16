import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDistrictAlcs } from "@/lib/districtAlcs";

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });
  }

  const r = await getDistrictAlcs(user.district);
  if (!r.ok) return NextResponse.json({ error: r.message }, { status: 502 });

  // Nothing matched? Tell the UI which district names the sheet really uses,
  // so a spelling problem is visible instead of a silent empty list.
  if (r.alcs.length === 0) {
    return NextResponse.json({ alcs: r.alcs, warning: { district: user.district, districtsInSheet: r.districtsInSheet } });
  }
  return NextResponse.json({ alcs: r.alcs });
}
