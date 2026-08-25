"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth-server";
import { ok, err, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { deleteFromR2ByPublicUrl, readManagedAssetUrl, replaceManagedAsset } from "@/lib/r2";
import { EMPTY_TIPTAP_DOC } from "@/lib/empty-rich-text";
import { workExperienceCreateSchema, workExperienceUpdateSchema } from "./schemas";
import type { Prisma } from "@prisma/client";

function parseJson<T>(raw: FormDataEntryValue | null, label: string, fallback: T): { ok: true; value: T } | { ok: false; error: string } {
  if (typeof raw !== "string" || !raw.trim()) return { ok: true, value: fallback };
  try {
    return { ok: true, value: JSON.parse(raw) as T };
  } catch {
    return { ok: false, error: `Invalid ${label} JSON.` };
  }
}

export async function createWorkExperience(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const description = parseJson<unknown>(formData.get("description"), "description", EMPTY_TIPTAP_DOC);
    if (!description.ok) return err(description.error);
    const links = parseJson<{ title: string; href: string }[]>(formData.get("links"), "links", []);
    if (!links.ok) return err(links.error);
    const badges = parseJson<{ label: string }[]>(formData.get("badges"), "badges", []);
    if (!badges.ok) return err(badges.error);
    if (!Array.isArray(links.value)) return err("Invalid links JSON.");
    if (!Array.isArray(badges.value)) return err("Invalid badges JSON.");
    const image = readManagedAssetUrl(formData, "companyImageUrl", "portfolio/company");
    if (!image.ok) return err(image.error);

    const parsed = workExperienceCreateSchema.safeParse({
      role: formData.get("role"),
      company: formData.get("company"),
      companyLink: formData.get("companyLink") ?? undefined,
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate") || null,
      isPresent: formData.has("isPresent"),
      description: description.value,
      links: links.value,
      badges: badges.value,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }

    const row = await prisma.workExperience.create({
      data: {
        role: parsed.data.role,
        company: parsed.data.company,
        companyLink: parsed.data.companyLink ?? null,
        companyImage: image.url ?? null,
        startDate: parsed.data.startDate,
        endDate: parsed.data.isPresent ? null : parsed.data.endDate ?? null,
        isPresent: parsed.data.isPresent,
        description: parsed.data.description as Prisma.InputJsonValue,
        links: { create: parsed.data.links.map((l) => ({ title: l.title, href: l.href })) },
        badges: { create: parsed.data.badges.map((b) => ({ label: b.label })) },
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/work-experience");
    return ok({ id: row.id });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to create the work experience.");
  }
}

export async function updateWorkExperience(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
    const id = String(formData.get("id") ?? "");
    const description = parseJson<unknown>(formData.get("description"), "description", EMPTY_TIPTAP_DOC);
    if (!description.ok) return err(description.error);
    const links = parseJson<{ title: string; href: string }[]>(formData.get("links"), "links", []);
    if (!links.ok) return err(links.error);
    const badges = parseJson<{ label: string }[]>(formData.get("badges"), "badges", []);
    if (!badges.ok) return err(badges.error);
    if (!Array.isArray(links.value)) return err("Invalid links JSON.");
    if (!Array.isArray(badges.value)) return err("Invalid badges JSON.");
    const image = readManagedAssetUrl(formData, "companyImageUrl", "portfolio/company");
    if (!image.ok) return err(image.error);

    const parsed = workExperienceUpdateSchema.safeParse({
      id,
      role: formData.get("role"),
      company: formData.get("company"),
      companyLink: formData.get("companyLink") ?? undefined,
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate") || null,
      isPresent: formData.has("isPresent"),
      description: description.value,
      links: links.value,
      badges: badges.value,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }

    const existing = await prisma.workExperience.findUnique({ where: { id: parsed.data.id } });
    if (!existing) return err("Work experience not found. It may have been deleted.");

    const companyImage = await replaceManagedAsset(existing.companyImage, image.url);

    await prisma.$transaction([
      prisma.workExperienceLink.deleteMany({ where: { workExperienceId: id } }),
      prisma.workExperienceBadge.deleteMany({ where: { workExperienceId: id } }),
    ]);

    await prisma.workExperience.update({
      where: { id },
      data: {
        role: parsed.data.role,
        company: parsed.data.company,
        companyLink: parsed.data.companyLink ?? null,
        companyImage,
        startDate: parsed.data.startDate,
        endDate: parsed.data.isPresent ? null : parsed.data.endDate ?? null,
        isPresent: parsed.data.isPresent,
        description: parsed.data.description as Prisma.InputJsonValue,
        links: { create: parsed.data.links.map((l) => ({ title: l.title, href: l.href })) },
        badges: { create: parsed.data.badges.map((b) => ({ label: b.label })) },
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/work-experience");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to update the work experience.");
  }
}

export async function deleteWorkExperience(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!id) return err("Missing work experience id.");
    const row = await prisma.workExperience.findUnique({
      where: { id },
      include: { links: true, badges: true },
    });
    if (!row) return err("Work experience not found. It may have already been deleted.");
    try {
      await deleteFromR2ByPublicUrl(row.companyImage);
    } catch (error) {
      console.error("Failed to delete company image from R2:", error);
    }
    await prisma.workExperience.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/work-experience");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to delete the work experience.");
  }
}
