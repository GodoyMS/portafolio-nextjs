import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME;
const publicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");

function requireR2Config(): {
  client: S3Client;
  bucket: string;
  publicBase: string;
} {
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
  });
  return { client, bucket, publicBase };
}

export function publicUrlToObjectKey(publicUrl: string): string | null {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  if (!publicUrl.startsWith(base + "/")) return null;
  const key = publicUrl.slice(base.length + 1);
  return key ? decodeURIComponent(key) : null;
}

export async function uploadToR2(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  const { client, bucket, publicBase } = requireR2Config();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    })
  );
  return `${publicBase}/${params.key}`;
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
