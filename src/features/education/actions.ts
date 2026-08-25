"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth-server";
import { ok, err, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { deleteFromR2ByPublicUrl, readManagedAssetUrl } from "@/lib/r2";
import { educationCreateSchema, educationUpdateSchema } from "./schemas";

function parseLinks(formData: FormData) {
  const linksRaw = formData.get("links");
  if (typeof linksRaw !== "string" || !linksRaw.trim()) return { ok: true as const, value: [] as { title: string; href: string }[] };
  try {
    const links = JSON.parse(linksRaw) as { title: string; href: string }[];
    if (!Array.isArray(links)) return { ok: false as const, error: "Invalid links JSON." };
    return { ok: true as const, value: links };
  } catch {
    return { ok: false as const, error: "Invalid links JSON." };
  }
}

export async function createEducation(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const links = parseLinks(formData);
    if (!links.ok) return err(links.error);
    const logo = readManagedAssetUrl(formData, "institutionLogoUrl", "portfolio/education");
    if (!logo.ok) return err(logo.error);
    const parsed = educationCreateSchema.safeParse({
      institutionName: formData.get("institutionName"),
      degreeTitle: formData.get("degreeTitle"),
      fieldOfStudy: formData.get("fieldOfStudy"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate") || null,
      isPresent: formData.has("isPresent"),
      links: links.value,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }
    const row = await prisma.education.create({
      data: {
        institutionName: parsed.data.institutionName,
        institutionLogo: logo.url ?? null,
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
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to create the education entry.");
  }
}

export async function updateEducation(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
    const id = String(formData.get("id") ?? "");
    const links = parseLinks(formData);
    if (!links.ok) return err(links.error);
    const logo = readManagedAssetUrl(formData, "institutionLogoUrl", "portfolio/education");
    if (!logo.ok) return err(logo.error);
    const parsed = educationUpdateSchema.safeParse({
      id,
      institutionName: formData.get("institutionName"),
      degreeTitle: formData.get("degreeTitle"),
      fieldOfStudy: formData.get("fieldOfStudy"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate") || null,
      isPresent: formData.has("isPresent"),
      links: links.value,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }
    const existing = await prisma.education.findUnique({ where: { id: parsed.data.id } });
    if (!existing) return err("Education entry not found. It may have been deleted.");
    const institutionLogo = logo.url ?? existing.institutionLogo;
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
    if (logo.url && logo.url !== existing.institutionLogo) {
      await deleteFromR2ByPublicUrl(existing.institutionLogo).catch(() => undefined);
    }
    revalidatePath("/");
    revalidatePath("/admin/education");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to update the education entry.");
  }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!id) return err("Missing education id.");
    const row = await prisma.education.findUnique({ where: { id } });
    if (!row) return err("Education entry not found. It may have already been deleted.");
    try {
      await deleteFromR2ByPublicUrl(row.institutionLogo);
    } catch (error) {
      console.error("Failed to delete education logo from R2:", error);
    }
    await prisma.education.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/education");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to delete the education entry.");
  }
}
