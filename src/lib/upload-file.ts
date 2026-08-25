import { randomUUID } from "node:crypto";
import "server-only";
import sharp from "sharp";
import { buildObjectKey, uploadToR2 } from "@/lib/r2";

const MAX_IMAGE = 20 * 1024 * 1024;
const MAX_VIDEO = 80 * 1024 * 1024;
const MAX_PDF = 12 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2400;
const MAX_IMAGE_PIXELS = 40_000_000;
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

async function optimizeImage(file: File): Promise<Buffer> {
  const input = Buffer.from(await file.arrayBuffer());

  try {
    return await sharp(input, {
      animated: true,
      failOn: "warning",
      limitInputPixels: MAX_IMAGE_PIXELS,
    })
      .rotate()
      .resize({
        width: MAX_IMAGE_DIMENSION,
        height: MAX_IMAGE_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
        alphaQuality: 90,
        effort: 5,
        smartSubsample: true,
      })
      .toBuffer();
  } catch {
    throw new Error("Image is corrupt, unsupported, or exceeds the 40 megapixel limit.");
  }
}

export async function uploadImageFile(
  file: File | null | undefined,
  folder: string
): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  if (file.size > MAX_IMAGE) throw new Error("Image exceeds 20MB limit.");
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Use a JPEG, PNG, WebP, AVIF, or GIF image.");
  }

  const body = await optimizeImage(file);
  const key = buildObjectKey(folder, `${randomUUID()}.webp`);
  return uploadToR2({ key, body, contentType: "image/webp" });
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
