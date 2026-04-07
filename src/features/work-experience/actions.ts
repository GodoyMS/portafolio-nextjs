"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth-server";
import { ok, err, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { deleteFromR2ByPublicUrl } from "@/lib/r2";
import { uploadImageFile } from "@/lib/upload-file";
import { EMPTY_TIPTAP_DOC } from "@/lib/empty-rich-text";
import { workExperienceCreateSchema, workExperienceUpdateSchema } from "./schemas";
import type { Prisma } from "@prisma/client";

export async function createWorkExperience(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const companyImageFile = formData.get("companyImage") as File | null;
    const descriptionRaw = formData.get("description");
    let description: unknown = EMPTY_TIPTAP_DOC;
    if (typeof descriptionRaw === "string" && descriptionRaw.trim()) {
      try {
        description = JSON.parse(descriptionRaw) as unknown;
      } catch {
        return err("Invalid description JSON.");
      }
    }
    let links: { title: string; href: string }[] = [];
    let badges: { label: string }[] = [];
    const linksRaw = formData.get("links");
    const badgesRaw = formData.get("badges");
    if (typeof linksRaw === "string" && linksRaw.trim()) {
      try {
        links = JSON.parse(linksRaw) as { title: string; href: string }[];
      } catch {
        return err("Invalid links JSON.");
      }
    }
    if (typeof badgesRaw === "string" && badgesRaw.trim()) {
      try {
        badges = JSON.parse(badgesRaw) as { label: string }[];
      } catch {
        return err("Invalid badges JSON.");
      }
    }

    const parsed = workExperienceCreateSchema.safeParse({
      role: formData.get("role"),
      company: formData.get("company"),
      companyLink: formData.get("companyLink") ?? undefined,
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate") || null,
      isPresent: formData.has("isPresent"),
      description,
      links,
      badges,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }

    let companyImage: string | undefined;
    try {
      companyImage = await uploadImageFile(companyImageFile, "portfolio/company");
    } catch (e) {
      return err(e instanceof Error ? e.message : "Image upload failed.");
    }

    const row = await prisma.workExperience.create({
      data: {
        role: parsed.data.role,
        company: parsed.data.company,
        companyLink: parsed.data.companyLink ?? null,
        companyImage: companyImage ?? null,
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
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to create.");
  }
}

export async function updateWorkExperience(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
    const id = String(formData.get("id") ?? "");
    const companyImageFile = formData.get("companyImage") as File | null;
    const descriptionRaw = formData.get("description");
    let description: unknown = EMPTY_TIPTAP_DOC;
    if (typeof descriptionRaw === "string" && descriptionRaw.trim()) {
      try {
        description = JSON.parse(descriptionRaw) as unknown;
      } catch {
        return err("Invalid description JSON.");
      }
    }
    let links: { title: string; href: string }[] = [];
    let badges: { label: string }[] = [];
    const linksRaw = formData.get("links");
    const badgesRaw = formData.get("badges");
    if (typeof linksRaw === "string" && linksRaw.trim()) {
      try {
        links = JSON.parse(linksRaw) as { title: string; href: string }[];
      } catch {
        return err("Invalid links JSON.");
      }
    }
    if (typeof badgesRaw === "string" && badgesRaw.trim()) {
      try {
        badges = JSON.parse(badgesRaw) as { label: string }[];
      } catch {
        return err("Invalid badges JSON.");
      }
    }

    const parsed = workExperienceUpdateSchema.safeParse({
      id,
      role: formData.get("role"),
      company: formData.get("company"),
      companyLink: formData.get("companyLink") ?? undefined,
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate") || null,
      isPresent: formData.has("isPresent"),
      description,
      links,
      badges,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }

    const existing = await prisma.workExperience.findUnique({ where: { id: parsed.data.id } });
    if (!existing) return err("Not found.");

    let companyImage = existing.companyImage;
    if (companyImageFile && companyImageFile.size > 0) {
      try {
        await deleteFromR2ByPublicUrl(existing.companyImage);
        companyImage = (await uploadImageFile(companyImageFile, "portfolio/company")) ?? null;
      } catch (e) {
        return err(e instanceof Error ? e.message : "Image upload failed.");
      }
    }

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
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to update.");
  }
}

export async function deleteWorkExperience(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const row = await prisma.workExperience.findUnique({
      where: { id },
      include: { links: true, badges: true },
    });
    if (!row) return err("Not found.");
    await deleteFromR2ByPublicUrl(row.companyImage);
    await prisma.workExperience.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/work-experience");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to delete.");
  }
}
