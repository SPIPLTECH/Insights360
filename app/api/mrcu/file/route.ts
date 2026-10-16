import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, canAccessMrcu } from "@/lib/auth";

export const dynamic = "force-dynamic";

const page = (title: string, body: string, status: number) =>
  new NextResponse(
    `<!doctype html><meta charset="utf-8"><title>${title}</title><body style="font-family:system-ui,sans-serif;max-width:560px;margin:12vh auto;padding:0 20px;color:#334155"><h2 style="color:#be123c">${title}</h2><p>${body}</p>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );

const MIME: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

/**
 * MRCU "View file": fetches the DCU's uploaded sheet from Cloudinary on the server and serves it inline with
 * the correct Content-Type, so the browser PDF viewer opens it. Only Cloudinary URLs are allowed.
 */
export async function GET(req: NextRequest) {
  const user = getCurrentUser();
  if (!canAccessMrcu(user)) return page("Not allowed", "Please log in as MRCU.", 401);

  const raw = new URL(req.url).searchParams.get("url") ?? "";
  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return page("Invalid link", "The file link is not valid.", 400);
  }
  if (target.protocol !== "https:" || target.hostname !== "res.cloudinary.com") {
    return page("Invalid link", "Only files uploaded to Cloudinary can be opened here.", 400);
  }

  // PDFs uploaded with "auto" can sit under /image/ or /raw/ — try the stored URL first, then the other.
  const candidates = [target.toString()];
  if (target.pathname.includes("/image/upload/")) candidates.push(target.toString().replace("/image/upload/", "/raw/upload/"));
  else if (target.pathname.includes("/raw/upload/")) candidates.push(target.toString().replace("/raw/upload/", "/image/upload/"));

  let lastStatus = 0;
  for (const url of candidates) {
    try {
      const up = await fetch(url, { cache: "no-store" });
      lastStatus = up.status;
      if (!up.ok) continue;
      const buf = await up.arrayBuffer();
      const ext = (new URL(url).pathname.split(".").pop() ?? "").toLowerCase();
      let type = up.headers.get("content-type") ?? "";
      if (!type || type.includes("octet-stream") || type.includes("text/html")) type = MIME[ext] ?? "application/octet-stream";
      return new NextResponse(buf, {
        headers: {
          "Content-Type": type,
          "Content-Disposition": `inline; filename="attendance-sheet.${ext || "pdf"}"`,
          "Cache-Control": "private, max-age=300",
        },
      });
    } catch {
      /* try next candidate */
    }
  }

  if (lastStatus === 401 || lastStatus === 403) {
    return page(
      "Cloudinary is blocking this file",
      "Cloudinary does not deliver PDF/ZIP files by default. In the Cloudinary console open <b>Settings → Security</b> and tick <b>“PDF and ZIP files delivery”</b> (allow), save, then reload this file.",
      502
    );
  }
  return page("File not found", `The file could not be fetched (status ${lastStatus || "network error"}). It may have been deleted, or the DCU did not upload a valid file.`, 502);
}
