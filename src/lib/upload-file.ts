import { randomUUID } from "node:crypto";
import { buildObjectKey, uploadToR2 } from "@/lib/r2";

const MAX_IMAGE = 8 * 1024 * 1024;
const MAX_VIDEO = 80 * 1024 * 1024;
const MAX_PDF = 12 * 1024 * 1024;

export async function uploadImageFile(
  file: File | null | undefined,
  folder: string
): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  if (file.size > MAX_IMAGE) throw new Error("Image exceeds 8MB limit.");
  const type = file.type;
  if (!type.startsWith("image/")) throw new Error("Invalid image file.");
  const ext = type.includes("png")
    ? "png"
    : type.includes("webp")
      ? "webp"
      : type.includes("gif")
        ? "gif"
        : "jpg";
  const buf = Buffer.from(await file.arrayBuffer());
  const key = buildObjectKey(folder, `${randomUUID()}.${ext}`);
  return uploadToR2({ key, body: buf, contentType: type });
}

export async function uploadVideoFile(
  file: File | null | undefined,
  folder: string
): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  if (file.size > MAX_VIDEO) throw new Error("Video exceeds 80MB limit.");
  const type = file.type || "video/mp4";
  if (!type.startsWith("video/")) throw new Error("Invalid video file.");
  const ext = type.includes("webm") ? "webm" : "mp4";
  const buf = Buffer.from(await file.arrayBuffer());
  const key = buildObjectKey(folder, `${randomUUID()}.${ext}`);
  return uploadToR2({ key, body: buf, contentType: type });
}

export async function uploadPdfFile(file: File | null | undefined, folder: string) {
  if (!file || file.size === 0) throw new Error("PDF is required.");
  if (file.size > MAX_PDF) throw new Error("PDF exceeds 12MB limit.");
  if (file.type !== "application/pdf") throw new Error("File must be a PDF.");
  const buf = Buffer.from(await file.arrayBuffer());
  const key = buildObjectKey(folder, `${randomUUID()}.pdf`);
  return uploadToR2({ key, body: buf, contentType: "application/pdf" });
}
