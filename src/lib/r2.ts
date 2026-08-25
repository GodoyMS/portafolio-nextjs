import {
  DeleteObjectCommand,
  GetBucketCorsCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
  type CORSRule,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isUploadFolder, type UploadFolder } from "@/lib/upload-constraints";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME;
const publicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");

let cachedConfig:
  | {
      client: S3Client;
      bucket: string;
      publicBase: string;
    }
  | undefined;

function requireR2Config(): {
  client: S3Client;
  bucket: string;
  publicBase: string;
} {
  if (cachedConfig) return cachedConfig;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    throw new Error(
      "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_BASE_URL."
    );
  }
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
    // Prevent signed checksum headers that browsers cannot produce on PUT.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  cachedConfig = { client, bucket, publicBase };
  return cachedConfig;
}

export function publicUrlToObjectKey(publicUrl: string): string | null {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  try {
    const parsed = new URL(publicUrl);
    const allowed = new URL(base);
    if (parsed.origin !== allowed.origin) return null;
    const prefix = allowed.pathname.replace(/\/$/, "");
    if (prefix && !parsed.pathname.startsWith(prefix + "/") && parsed.pathname !== prefix) {
      return null;
    }
    const relative = prefix ? parsed.pathname.slice(prefix.length) : parsed.pathname;
    const key = decodeURIComponent(relative.replace(/^\/+/, ""));
    if (!key || key.includes("..") || key.startsWith("/")) return null;
    return key;
  } catch {
    return null;
  }
}

export function isManagedAssetUrl(publicUrl: string, folder?: UploadFolder): boolean {
  const key = publicUrlToObjectKey(publicUrl);
  if (!key) return false;
  if (folder) {
    const prefix = folder.replace(/^\/+|\/+$/g, "") + "/";
    if (!key.startsWith(prefix)) return false;
  } else {
    const parts = key.split("/");
    const top = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : "";
    if (!isUploadFolder(top)) return false;
  }
  return true;
}

export function readManagedAssetUrl(
  formData: FormData,
  field: string,
  folder: UploadFolder
): { ok: true; url?: string } | { ok: false; error: string } {
  const raw = formData.get(field);
  if (raw == null || raw === "") return { ok: true };
  if (typeof raw !== "string") return { ok: false, error: `Invalid ${field} value.` };
  const url = raw.trim();
  if (!url) return { ok: true };
  if (!isManagedAssetUrl(url, folder)) {
    return { ok: false, error: "Uploaded file URL is not from this site’s storage." };
  }
  return { ok: true, url };
}

export async function createPresignedPut(params: {
  key: string;
  contentType: string;
  expiresIn?: number;
}): Promise<{ uploadUrl: string; publicUrl: string }> {
  const { client, bucket, publicBase } = requireR2Config();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    ContentType: params.contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });
  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: params.expiresIn ?? 60 * 10,
    unhoistableHeaders: new Set(["x-amz-checksum-crc32", "x-amz-sdk-checksum-algorithm"]),
  });
  return { uploadUrl, publicUrl: `${publicBase}/${params.key}` };
}

export async function deleteFromR2ByPublicUrl(publicUrl: string | null | undefined) {
  if (!publicUrl) return;
  const key = publicUrlToObjectKey(publicUrl);
  if (!key) return;
  const { client, bucket } = requireR2Config();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

export function buildObjectKey(folder: string, filename: string) {
  const safeFolder = folder.replace(/^\/+|\/+$/g, "");
  return `${safeFolder}/${filename}`;
}

function configuredUploadOrigins(): string[] {
  const origins = new Set<string>(["http://localhost:3000", "http://127.0.0.1:3000"]);
  for (const raw of [
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.APP_URL,
  ]) {
    if (!raw) continue;
    try {
      origins.add(new URL(raw).origin);
    } catch {
      /* ignore invalid env URLs */
    }
  }
  return [...origins];
}

let corsSetup: Promise<void> | null = null;

export function ensureR2BrowserCors(requestOrigin?: string | null): Promise<void> {
  if (!corsSetup) {
    corsSetup = putBrowserCors(requestOrigin).catch((error) => {
      corsSetup = null;
      console.error("Failed to ensure R2 CORS for browser uploads:", error);
    });
  }
  return corsSetup;
}

async function putBrowserCors(requestOrigin?: string | null) {
  const { client, bucket } = requireR2Config();
  const origins = new Set(configuredUploadOrigins());
  if (requestOrigin) {
    try {
      origins.add(new URL(requestOrigin).origin);
    } catch {
      /* ignore */
    }
  }

  let existing: CORSRule[] = [];
  try {
    const current = await client.send(new GetBucketCorsCommand({ Bucket: bucket }));
    existing = current.CORSRules ?? [];
  } catch {
    existing = [];
  }

  for (const rule of existing) {
    for (const origin of rule.AllowedOrigins ?? []) {
      if (origin && origin !== "*") origins.add(origin);
    }
  }

  const methods = new Set<string>(["PUT", "GET", "HEAD"]);
  for (const rule of existing) {
    for (const method of rule.AllowedMethods ?? []) methods.add(method);
  }

  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: [...origins],
            AllowedMethods: [...methods],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag", "Location"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    })
  );
}
