"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { assertAdmin } from "@/lib/auth-server";
import { ok, err, type ActionResult } from "@/lib/action-result";
import {
  buildObjectKey,
  createPresignedPut,
  deleteFromR2ByPublicUrl,
  ensureR2BrowserCors,
  isManagedAssetUrl,
} from "@/lib/r2";
import {
  UPLOAD_FOLDERS,
  extensionForContentType,
  folderAllowsKind,
  maxBytesForKind,
  type UploadKind,
} from "@/lib/upload-constraints";

const requestSchema = z.object({
  kind: z.enum(["image", "video", "pdf"]),
  folder: z.enum(UPLOAD_FOLDERS),
  contentType: z.string().min(1).max(120),
  size: z.number().int().positive(),
});

export type DirectUploadTicket = {
  uploadUrl: string;
  publicUrl: string;
  contentType: string;
};

export async function createDirectUpload(
  input: z.input<typeof requestSchema>
): Promise<ActionResult<DirectUploadTicket>> {
  try {
    await assertAdmin();
    const parsed = requestSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }
    const { kind, folder, size } = parsed.data;
    const contentType = parsed.data.contentType.trim().toLowerCase();
    if (!folderAllowsKind(folder, kind as UploadKind)) {
      return err("This file type cannot be uploaded to that folder.");
    }
    const max = maxBytesForKind(kind);
    if (size > max) {
      return err(`File is too large. Maximum size is ${Math.floor(max / (1024 * 1024))} MB.`);
    }
    const extension = extensionForContentType(kind, contentType);
    if (!extension) {
      return err("This file type is not allowed.");
    }
    const headerList = await headers();
    const origin = headerList.get("origin") ?? headerList.get("referer");
    await ensureR2BrowserCors(origin);
    const key = buildObjectKey(folder, `${randomUUID()}.${extension}`);
    const ticket = await createPresignedPut({ key, contentType });
    return ok({ ...ticket, contentType });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized. Sign in again and retry.");
    return err(e instanceof Error ? e.message : "Could not start the upload.");
  }
}

export async function discardDirectUpload(publicUrl: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (typeof publicUrl !== "string" || !isManagedAssetUrl(publicUrl)) {
      return err("Invalid asset URL.");
    }
    await deleteFromR2ByPublicUrl(publicUrl);
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Could not discard the upload.");
  }
}
