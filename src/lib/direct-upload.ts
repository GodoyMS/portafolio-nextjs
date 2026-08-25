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
  const { file, kind, folder, onProgress } = params;
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
