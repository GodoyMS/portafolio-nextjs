"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth-server";
import { ok, err, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { deleteFromR2ByPublicUrl } from "@/lib/r2";
import { uploadImageFile } from "@/lib/upload-file";
import { educationCreateSchema, educationUpdateSchema } from "./schemas";

export async function createEducation(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const logoFile = formData.get("institutionLogo") as File | null;
    let links: { title: string; href: string }[] = [];
    const linksRaw = formData.get("links");
    if (typeof linksRaw === "string" && linksRaw.trim()) {
      try {
        links = JSON.parse(linksRaw) as { title: string; href: string }[];
      } catch {
        return err("Invalid links JSON.");
      }
    }
    const parsed = educationCreateSchema.safeParse({
      institutionName: formData.get("institutionName"),
      degreeTitle: formData.get("degreeTitle"),
      fieldOfStudy: formData.get("fieldOfStudy"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate") || null,
      isPresent: formData.has("isPresent"),
      links,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }
    let institutionLogo: string | undefined;
    try {
      institutionLogo = await uploadImageFile(logoFile, "portfolio/education");
    } catch (e) {
      return err(e instanceof Error ? e.message : "Logo upload failed.");
    }
    const row = await prisma.education.create({
      data: {
        institutionName: parsed.data.institutionName,
        institutionLogo: institutionLogo ?? null,
        degreeTitle: parsed.data.degreeTitle,
        fieldOfStudy: parsed.data.fieldOfStudy,
        startDate: parsed.data.startDate,
        endDate: parsed.data.isPresent ? null : parsed.data.endDate ?? null,
        isPresent: parsed.data.isPresent,
        links: { create: parsed.data.links.map((l) => ({ title: l.title, href: l.href })) },
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/education");
    return ok({ id: row.id });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to create.");
  }
}

export async function updateEducation(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
    const id = String(formData.get("id") ?? "");
    const logoFile = formData.get("institutionLogo") as File | null;
    let links: { title: string; href: string }[] = [];
    const linksRaw = formData.get("links");
    if (typeof linksRaw === "string" && linksRaw.trim()) {
      try {
        links = JSON.parse(linksRaw) as { title: string; href: string }[];
      } catch {
        return err("Invalid links JSON.");
      }
    }
    const parsed = educationUpdateSchema.safeParse({
      id,
      institutionName: formData.get("institutionName"),
      degreeTitle: formData.get("degreeTitle"),
      fieldOfStudy: formData.get("fieldOfStudy"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate") || null,
      isPresent: formData.has("isPresent"),
      links,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }
    const existing = await prisma.education.findUnique({ where: { id: parsed.data.id } });
    if (!existing) return err("Not found.");
    let institutionLogo = existing.institutionLogo;
    if (logoFile && logoFile.size > 0) {
      try {
        await deleteFromR2ByPublicUrl(existing.institutionLogo);
        institutionLogo = (await uploadImageFile(logoFile, "portfolio/education")) ?? null;
      } catch (e) {
        return err(e instanceof Error ? e.message : "Logo upload failed.");
      }
    }
    await prisma.educationLink.deleteMany({ where: { educationId: id } });
    await prisma.education.update({
      where: { id },
      data: {
        institutionName: parsed.data.institutionName,
        institutionLogo,
        degreeTitle: parsed.data.degreeTitle,
        fieldOfStudy: parsed.data.fieldOfStudy,
        startDate: parsed.data.startDate,
        endDate: parsed.data.isPresent ? null : parsed.data.endDate ?? null,
        isPresent: parsed.data.isPresent,
        links: { create: parsed.data.links.map((l) => ({ title: l.title, href: l.href })) },
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/education");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to update.");
  }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const row = await prisma.education.findUnique({ where: { id } });
    if (!row) return err("Not found.");
    await deleteFromR2ByPublicUrl(row.institutionLogo);
    await prisma.education.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/education");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to delete.");
  }
}
