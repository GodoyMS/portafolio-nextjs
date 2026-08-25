"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth-server";
import { ok, err, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { deleteFromR2ByPublicUrl, readManagedAssetUrl, replaceManagedAsset } from "@/lib/r2";
import { projectCreateSchema, projectUpdateSchema } from "./schemas";
import { ProjectType } from "@prisma/client";

function parseJsonArray<T>(raw: FormDataEntryValue | null, label: string): { ok: true; value: T[] } | { ok: false; error: string } {
  if (typeof raw !== "string" || !raw.trim()) return { ok: true, value: [] };
  try {
    const parsed = JSON.parse(raw) as T[];
    if (!Array.isArray(parsed)) return { ok: false, error: `Invalid ${label} JSON.` };
    return { ok: true, value: parsed };
  } catch {
    return { ok: false, error: `Invalid ${label} JSON.` };
  }
}

export async function createProject(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const skillsRaw = parseJsonArray<string>(formData.get("skills"), "skills");
    if (!skillsRaw.ok) return err(skillsRaw.error);
    const linksRaw = parseJsonArray<{ title: string; href: string }>(formData.get("links"), "links");
    if (!linksRaw.ok) return err(linksRaw.error);
    const image = readManagedAssetUrl(formData, "imagePreviewUrl", "portfolio/projects");
    if (!image.ok) return err(image.error);
    const video = readManagedAssetUrl(formData, "videoDemoUrl", "portfolio/projects");
    if (!video.ok) return err(video.error);
    const parsed = projectCreateSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      year: formData.get("year"),
      type: formData.get("type") ?? "MAIN",
      isFeatured: formData.has("isFeatured"),
      githubUrl: formData.get("githubUrl") ?? undefined,
      productionUrl: formData.get("productionUrl") ?? undefined,
      playstoreUrl: formData.get("playstoreUrl") ?? undefined,
      skills: skillsRaw.value,
      links: linksRaw.value,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }
    const count = await prisma.project.count();
    const row = await prisma.project.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        imagePreview: image.url ?? null,
        videoDemo: video.url ?? null,
        year: parsed.data.year,
        type: parsed.data.type as ProjectType,
        isFeatured: parsed.data.isFeatured,
        githubUrl: parsed.data.githubUrl ?? null,
        productionUrl: parsed.data.productionUrl ?? null,
        playstoreUrl: parsed.data.playstoreUrl ?? null,
        sortOrder: count,
        skills: { create: parsed.data.skills.map((name) => ({ name })) },
        links: { create: parsed.data.links.map((l) => ({ title: l.title, href: l.href })) },
      },
    });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return ok({ id: row.id });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to create the project.");
  }
}

export async function updateProject(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
    const id = String(formData.get("id") ?? "");
    const skillsRaw = parseJsonArray<string>(formData.get("skills"), "skills");
    if (!skillsRaw.ok) return err(skillsRaw.error);
    const linksRaw = parseJsonArray<{ title: string; href: string }>(formData.get("links"), "links");
    if (!linksRaw.ok) return err(linksRaw.error);
    const image = readManagedAssetUrl(formData, "imagePreviewUrl", "portfolio/projects");
    if (!image.ok) return err(image.error);
    const video = readManagedAssetUrl(formData, "videoDemoUrl", "portfolio/projects");
    if (!video.ok) return err(video.error);
    const parsed = projectUpdateSchema.safeParse({
      id,
      title: formData.get("title"),
      description: formData.get("description"),
      year: formData.get("year"),
      type: formData.get("type") ?? "MAIN",
      isFeatured: formData.has("isFeatured"),
      githubUrl: formData.get("githubUrl") ?? undefined,
      productionUrl: formData.get("productionUrl") ?? undefined,
      playstoreUrl: formData.get("playstoreUrl") ?? undefined,
      skills: skillsRaw.value,
      links: linksRaw.value,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }
    const existing = await prisma.project.findUnique({ where: { id: parsed.data.id } });
    if (!existing) return err("Project not found. It may have been deleted.");
    const imagePreview = await replaceManagedAsset(existing.imagePreview, image.url);
    const videoDemo = await replaceManagedAsset(existing.videoDemo, video.url);
    await prisma.projectSkill.deleteMany({ where: { projectId: id } });
    await prisma.projectLink.deleteMany({ where: { projectId: id } });
    await prisma.project.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        imagePreview,
        videoDemo,
        year: parsed.data.year,
        type: parsed.data.type as ProjectType,
        isFeatured: parsed.data.isFeatured,
        githubUrl: parsed.data.githubUrl ?? null,
        productionUrl: parsed.data.productionUrl ?? null,
        playstoreUrl: parsed.data.playstoreUrl ?? null,
        skills: { create: parsed.data.skills.map((name) => ({ name })) },
        links: { create: parsed.data.links.map((l) => ({ title: l.title, href: l.href })) },
      },
    });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to update the project.");
  }
}

export async function reorderProjects(orderedIds: string[]): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!Array.isArray(orderedIds) || orderedIds.some((id) => typeof id !== "string" || !id)) {
      return err("Invalid project order.");
    }
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.project.update({ where: { id }, data: { sortOrder: index } })
      )
    );
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to reorder projects.");
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!id) return err("Missing project id.");
    const row = await prisma.project.findUnique({ where: { id } });
    if (!row) return err("Project not found. It may have already been deleted.");
    try {
      await deleteFromR2ByPublicUrl(row.imagePreview);
      await deleteFromR2ByPublicUrl(row.videoDemo);
    } catch (error) {
      console.error("Failed to delete project media from R2:", error);
    }
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return err("You are not signed in or your session expired. Sign in again and retry.");
    }
    return err(e instanceof Error ? e.message : "Failed to delete the project.");
  }
}
