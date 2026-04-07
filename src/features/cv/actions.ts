"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth-server";
import { ok, err, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { deleteFromR2ByPublicUrl } from "@/lib/r2";
import { uploadPdfFile } from "@/lib/upload-file";

export async function replaceCv(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
    const file = formData.get("file") as File | null;
    let fileUrl: string;
    try {
      fileUrl = await uploadPdfFile(file, "portfolio/cv");
    } catch (e) {
      return err(e instanceof Error ? e.message : "Upload failed.");
    }
    const existing = await prisma.cV.findUnique({ where: { id: 1 } });
    if (existing?.fileUrl) await deleteFromR2ByPublicUrl(existing.fileUrl);
    await prisma.cV.upsert({
      where: { id: 1 },
      create: { id: 1, fileUrl },
      update: { fileUrl },
    });
    revalidatePath("/");
    revalidatePath("/admin/cv");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to upload CV.");
  }
}
