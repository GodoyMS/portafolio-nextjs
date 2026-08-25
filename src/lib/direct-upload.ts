"use client";

import { createDirectUpload, discardDirectUpload } from "@/features/uploads/actions";
import { runAdminAction } from "@/lib/admin-errors";
import {
  type UploadFolder,
  type UploadKind,
  validateUploadFile,
} from "@/lib/upload-constraints";

export class DirectUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirectUploadError";
  }
}

const MAX_IMAGE_DIMENSION = 2400;
const MAX_IMAGE_PIXELS = 40_000_000;

async function optimizeImageForUpload(file: File): Promise<File> {
  // Preserve animation; the browser canvas API would flatten animated GIFs.
  if (file.type === "image/gif") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new DirectUploadError("The selected image is corrupt or unsupported.");
  }

  try {
    if (bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) {
      throw new DirectUploadError("Image exceeds the 40 megapixel safety limit.");
    }

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / bitmap.width, MAX_IMAGE_DIMENSION / bitmap.height);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new DirectUploadError("This browser cannot optimize the image.");
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.82)
    );
    if (!blob) throw new DirectUploadError("This browser could not optimize the image.");

    // Keep an already-efficient source when conversion would only make it larger.
    if (scale === 1 && blob.size >= file.size) return file;
    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}

function statusMessage(status: number): string {
  if (status === 403 || status === 401) {
    return "Storage rejected the upload (expired or invalid link). Try again.";
  }
  if (status === 404) {
    return "Storage could not find the upload destination. Try again.";
  }
  if (status === 413) {
    return "Storage rejected the file because it is too large.";
  }
  if (status >= 500) {
    return `Storage is unavailable (HTTP ${status}). Try again in a moment.`;
  }
  return `Storage rejected the upload (HTTP ${status}).`;
}

function putFile(params: {
  uploadUrl: string;
  file: File;
  contentType: string;
  onProgress?: (percent: number) => void;
}): Promise<void> {
  const { uploadUrl, file, contentType, onProgress } = params;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("Cache-Control", "public, max-age=31536000, immutable");
    xhr.timeout = 15 * 60 * 1000;
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100))));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }
      reject(new DirectUploadError(statusMessage(xhr.status)));
    };
    xhr.onerror = () => {
      reject(
        new DirectUploadError(
          "Could not reach file storage. Confirm R2 CORS allows PUT from this site, then try again."
        )
      );
    };
    xhr.ontimeout = () => {
      reject(new DirectUploadError("The upload timed out. Check your connection and try again."));
    };
    xhr.onabort = () => {
      reject(new DirectUploadError("The upload was cancelled."));
    };
    xhr.send(file);
  });
}

export async function uploadFileDirect(params: {
  file: File;
  kind: UploadKind;
  folder: UploadFolder;
  onProgress?: (percent: number) => void;
}): Promise<string> {
  const { kind, folder, onProgress } = params;
  const sourceChecked = validateUploadFile(params.file, kind);
  if (!sourceChecked.ok) throw new DirectUploadError(sourceChecked.error);
  const file = kind === "image" ? await optimizeImageForUpload(params.file) : params.file;
  const checked = validateUploadFile(file, kind);
  if (!checked.ok) throw new DirectUploadError(checked.error);

  const ticket = await runAdminAction(() =>
    createDirectUpload({
      kind,
      folder,
      contentType: checked.contentType,
      size: checked.size,
    })
  );
  if (!ticket.ok || !ticket.data) {
    throw new DirectUploadError(ticket.ok ? "Could not start the upload." : ticket.error);
  }

  const { uploadUrl, publicUrl, contentType } = ticket.data;
  try {
    await putFile({
      uploadUrl,
      file,
      contentType,
      onProgress,
    });
  } catch (error) {
    await runAdminAction(() => discardDirectUpload(publicUrl));
    throw error;
  }

  return publicUrl;
}

export async function discardUploadedUrls(urls: string[]) {
  await Promise.all(
    urls.map((url) => runAdminAction(() => discardDirectUpload(url)))
  );
}
