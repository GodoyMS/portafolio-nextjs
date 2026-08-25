export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 250 * 1024 * 1024;
export const MAX_PDF_BYTES = 20 * 1024 * 1024;

export const UPLOAD_FOLDERS = [
  "portfolio/projects",
  "portfolio/education",
  "portfolio/company",
  "portfolio/cv",
] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];
export type UploadKind = "image" | "video" | "pdf";

const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const VIDEO_MIME_TO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/ogg": "ogv",
};

const PDF_MIME_TO_EXT: Record<string, string> = {
  "application/pdf": "pdf",
};

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  ogv: "video/ogg",
  ogg: "video/ogg",
  pdf: "application/pdf",
};

const FOLDER_KINDS: Record<UploadFolder, readonly UploadKind[]> = {
  "portfolio/projects": ["image", "video"],
  "portfolio/education": ["image"],
  "portfolio/company": ["image"],
  "portfolio/cv": ["pdf"],
};

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function folderAllowsKind(folder: UploadFolder, kind: UploadKind): boolean {
  return FOLDER_KINDS[folder].includes(kind);
}

export function maxBytesForKind(kind: UploadKind): number {
  if (kind === "image") return MAX_IMAGE_BYTES;
  if (kind === "video") return MAX_VIDEO_BYTES;
  return MAX_PDF_BYTES;
}

export function allowedTypesLabel(kind: UploadKind): string {
  if (kind === "image") return "JPEG, PNG, WebP, GIF, or AVIF";
  if (kind === "video") return "MP4, WebM, or MOV";
  return "PDF";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  const mb = bytes / (1024 * 1024);
  if (mb < 100) return `${mb.toFixed(2)} MB`;
  return `${mb.toFixed(1)} MB`;
}

function extFromFilename(filename: string): string {
  const base = filename.split("?")[0]?.split("#")[0] ?? "";
  const dot = base.lastIndexOf(".");
  if (dot < 0) return "";
  return base.slice(dot + 1).toLowerCase();
}

export function inferContentType(file: { name: string; type: string }): string {
  const type = file.type.trim().toLowerCase();
  if (type && type !== "application/octet-stream") return type;
  const ext = extFromFilename(file.name);
  return EXT_TO_MIME[ext] ?? type;
}

export function extensionForContentType(kind: UploadKind, contentType: string): string | null {
  const type = contentType.trim().toLowerCase();
  if (kind === "image") return IMAGE_MIME_TO_EXT[type] ?? null;
  if (kind === "video") return VIDEO_MIME_TO_EXT[type] ?? null;
  return PDF_MIME_TO_EXT[type] ?? null;
}

export type FileValidationOk = {
  ok: true;
  contentType: string;
  extension: string;
  size: number;
};

export type FileValidationErr = { ok: false; error: string };

export function validateUploadFile(
  file: { name: string; type: string; size: number } | null | undefined,
  kind: UploadKind
): FileValidationOk | FileValidationErr {
  if (!file || file.size <= 0) {
    return { ok: false, error: "Choose a file before uploading." };
  }
  const max = maxBytesForKind(kind);
  if (file.size > max) {
    const noun = kind === "image" ? "Image" : kind === "video" ? "Video" : "PDF";
    return {
      ok: false,
      error: `${noun} is too large (${formatBytes(file.size)}). Use a file of ${Math.floor(max / (1024 * 1024))} MB or less.`,
    };
  }
  const contentType = inferContentType(file);
  const extension = extensionForContentType(kind, contentType);
  if (!extension) {
    return {
      ok: false,
      error: `This file type is not allowed. Use ${allowedTypesLabel(kind)}.`,
    };
  }
  if (kind === "image" && !contentType.startsWith("image/")) {
    return { ok: false, error: `This file type is not allowed. Use ${allowedTypesLabel("image")}.` };
  }
  if (kind === "video" && !contentType.startsWith("video/")) {
    return { ok: false, error: `This file type is not allowed. Use ${allowedTypesLabel("video")}.` };
  }
  return { ok: true, contentType, extension, size: file.size };
}

export function acceptAttr(kind: UploadKind): string {
  if (kind === "image") return "image/jpeg,image/png,image/webp,image/gif,image/avif";
  if (kind === "video") return "video/mp4,video/webm,video/quicktime";
  return "application/pdf";
}
