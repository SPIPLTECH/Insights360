import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { getCurrentUser } from "@/lib/auth";
import { binaryMarks } from "@/lib/marks";

const isHttpUrl = (v: string) => /^https?:\/\/\S+$/i.test(v);

const NO_NAME = "(Name not in sheet)";

/** Social Media Presence — one request, many ALCs. Same rules/marks as the single-entry route. */
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    return NextResponse.json({ error: "Not authenticated as a DCU." }, { status: 401 });
  }

  const body = await req.json();
  const entries: any[] = Array.isArray(body.entries) ? body.entries : [];
  if (entries.length === 0) {
    return NextResponse.json({ error: "Select Yes or No for at least one ALC." }, { status: 400 });
  }

  const seen = new Set<string>();
  const docs: any[] = [];
  for (const e of entries) {
    const alcCode = String(e?.alcCode ?? "").trim();
    const alcName = String(e?.alcName ?? "").trim() || NO_NAME; // some ALCs have no name in the sheet
    if (!alcCode) {
      return NextResponse.json({ error: "Every entry needs an ALC code." }, { status: 400 });
    }
    if (seen.has(alcCode)) {
      return NextResponse.json({ error: `ALC ${alcCode} is listed more than once.` }, { status: 400 });
    }
    seen.add(alcCode);
    if (typeof e.postedOnSocialMedia !== "boolean") {
      return NextResponse.json({ error: `ALC ${alcCode}: select Yes or No.` }, { status: 400 });
    }

    const doc: any = {
      district: user.district,
      alcCode,
      alcName,
      parameterType: "social_media",
      status: "pending",
      submittedBy: user.sub,
      fileUrls: [],
      postedOnSocialMedia: e.postedOnSocialMedia,
    };
    if (e.postedOnSocialMedia) {
      const insta = String(e.instagramLink ?? "").trim();
      const fb = String(e.facebookLink ?? "").trim();
      if (!insta || !fb) {
        return NextResponse.json({ error: `ALC ${alcCode}: both Instagram and Facebook links are required.` }, { status: 400 });
      }
      if (!isHttpUrl(insta) || !isHttpUrl(fb)) {
        return NextResponse.json({ error: `ALC ${alcCode}: links must start with http:// or https://` }, { status: 400 });
      }
      doc.instagramLink = insta;
      doc.facebookLink = fb;
      doc.socialPlatform = "Instagram, Facebook";
      doc.socialLink = `${insta}, ${fb}`;
      doc.calculatedMarks = binaryMarks(true);
    } else {
      doc.socialPlatform = "None";
      doc.socialLink = "";
      doc.calculatedMarks = 0;
    }
    docs.push(doc);
  }

  await connectDB();
  await Submission.insertMany(docs);
  return NextResponse.json({ count: docs.length }, { status: 201 });
}
