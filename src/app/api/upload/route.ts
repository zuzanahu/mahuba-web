import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { ALLOWED_IMAGE_TYPES } from "@/constants/allowedImageTypes";

/**
 * POST /api/upload
 *
 * Accepts a `multipart/form-data` request with a single `file` field,
 * writes the file to `public/uploads/`, and returns its public path.
 *
 * @remarks
 * Used by {@link PostMetadataForm} for cover-image uploads and will be
 * reused by the future ImageBlock editor.
 *
 * Only {@link ALLOWED_IMAGE_TYPES} are accepted; anything else is rejected with 415.
 * SVG is intentionally excluded — it can embed scripts and is unsafe to serve
 * as user-uploaded content without sanitization.
 *
 * @returns `{ path: "/uploads/<filename>" }` on success.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}` },
      { status: 415 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(join(uploadsDir, file.name), buffer);

  return NextResponse.json({ path: `/uploads/${file.name}` });
}
