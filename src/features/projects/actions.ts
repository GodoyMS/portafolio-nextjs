"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth-server";
import { ok, err, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { deleteFromR2ByPublicUrl } from "@/lib/r2";
import { uploadImageFile, uploadVideoFile } from "@/lib/upload-file";
import { projectCreateSchema, projectUpdateSchema } from "./schemas";
import { ProjectType } from "@prisma/client";

export async function createProject(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const imageFile = formData.get("imagePreview") as File | null;
    const videoFile = formData.get("videoDemo") as File | null;
    let skills: string[] = [];
    let links: { title: string; href: string }[] = [];
    const skillsRaw = formData.get("skills");
    const linksRaw = formData.get("links");
    if (typeof skillsRaw === "string" && skillsRaw.trim()) {
      try {
        skills = JSON.parse(skillsRaw) as string[];
      } catch {
        return err("Invalid skills JSON.");
      }
    }
    if (typeof linksRaw === "string" && linksRaw.trim()) {
      try {
        links = JSON.parse(linksRaw) as { title: string; href: string }[];
      } catch {
        return err("Invalid links JSON.");
      }
    }
    const parsed = projectCreateSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      year: formData.get("year"),
      type: formData.get("type") ?? "MAIN",
      isFeatured: formData.has("isFeatured"),
      githubUrl: formData.get("githubUrl") ?? undefined,
      productionUrl: formData.get("productionUrl") ?? undefined,
      playstoreUrl: formData.get("playstoreUrl") ?? undefined,
      skills,
      links,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }
    let imagePreview: string | undefined;
    let videoDemo: string | undefined;
    try {
      imagePreview = await uploadImageFile(imageFile, "portfolio/projects");
      videoDemo = await uploadVideoFile(videoFile, "portfolio/projects");
    } catch (e) {
      return err(e instanceof Error ? e.message : "Upload failed.");
    }
    const row = await prisma.project.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        imagePreview: imagePreview ?? null,
        videoDemo: videoDemo ?? null,
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
    return ok({ id: row.id });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to create.");
  }
}

export async function updateProject(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
    const id = String(formData.get("id") ?? "");
    const imageFile = formData.get("imagePreview") as File | null;
    const videoFile = formData.get("videoDemo") as File | null;
    let skills: string[] = [];
    let links: { title: string; href: string }[] = [];
    const skillsRaw = formData.get("skills");
    const linksRaw = formData.get("links");
    if (typeof skillsRaw === "string" && skillsRaw.trim()) {
      try {
        skills = JSON.parse(skillsRaw) as string[];
      } catch {
        return err("Invalid skills JSON.");
      }
    }
    if (typeof linksRaw === "string" && linksRaw.trim()) {
      try {
        links = JSON.parse(linksRaw) as { title: string; href: string }[];
      } catch {
        return err("Invalid links JSON.");
      }
    }
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
      skills,
      links,
    });
    if (!parsed.success) {
      return err(parsed.error.issues.map((i) => i.message).join(" "));
    }
    const existing = await prisma.project.findUnique({ where: { id: parsed.data.id } });
    if (!existing) return err("Not found.");
    let imagePreview = existing.imagePreview;
    let videoDemo = existing.videoDemo;
    try {
      if (imageFile && imageFile.size > 0) {
        await deleteFromR2ByPublicUrl(existing.imagePreview);
        imagePreview = (await uploadImageFile(imageFile, "portfolio/projects")) ?? null;
      }
      if (videoFile && videoFile.size > 0) {
        await deleteFromR2ByPublicUrl(existing.videoDemo);
        videoDemo = (await uploadVideoFile(videoFile, "portfolio/projects")) ?? null;
      }
    } catch (e) {
      return err(e instanceof Error ? e.message : "Upload failed.");
    }
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
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to update.");
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const row = await prisma.project.findUnique({ where: { id } });
    if (!row) return err("Not found.");
    await deleteFromR2ByPublicUrl(row.imagePreview);
    await deleteFromR2ByPublicUrl(row.videoDemo);
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return ok();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return err("Unauthorized.");
    return err(e instanceof Error ? e.message : "Failed to delete.");
  }
}
