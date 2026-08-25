"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth-server";
import { ok, err, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { deleteFromR2ByPublicUrl, readManagedAssetUrl } from "@/lib/r2";

export async function replaceCv(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
    const file = readManagedAssetUrl(formData, "fileUrl", "portfolio/cv");
    if (!file.ok) return err(file.error);
    if (!file.url) return err("Choose a PDF before uploading.");
    const existing = await prisma.cV.findUnique({ where: { id: 1 } });
    if (existing?.fileUrl && existing.fileUrl !== file.url) {
      try {
        await deleteFromR2ByPublicUrl(existing.fileUrl);
      } catch (error) {
        console.error("Failed to delete previous CV from R2:", error);
      }
    }
    await prisma.cV.upsert({
      where: { id: 1 },
      create: { id: 1, fileUrl: file.url },
      update: { fileUrl: file.url },
    });
    revalidatePath("/");
    revalidatePath("/admin/cv");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to upload the CV.");
  }
}
