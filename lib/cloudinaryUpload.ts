"use client";

/**
 * Uploads a file straight from the browser to Cloudinary using an
 * UNSIGNED upload preset — no server round-trip / no API secret exposed
 * client-side. Set these two env vars (both must be NEXT_PUBLIC_ so the
 * browser can read them):
 *
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
 *
 * Create the unsigned preset at: Cloudinary Console → Settings → Upload →
 * Upload presets → Add upload preset → Signing Mode: "Unsigned".
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) {
    throw new Error("Cloudinary is not configured (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary upload failed: ${body}`);
  }
  const json = (await res.json()) as { secure_url: string };
  return json.secure_url;
}
