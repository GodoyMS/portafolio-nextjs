"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Project, ProjectLink, ProjectSkill } from "@prisma/client";

type ProjectTypeValue = "MAIN" | "NOTEWORTHY";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DynamicLinkFields, type LinkRow } from "./dynamic-link-fields";
import { DynamicSkillFields } from "./dynamic-skill-fields";
import { AdminFileField } from "./admin-file-field";
import { AdminFormError } from "./admin-form-error";
import { createProject, updateProject } from "@/features/projects/actions";
import { projectCreateSchema } from "@/features/projects/schemas";
import { Spinner } from "@/components/ui/spinner";
import { describeAdminError, runAdminAction } from "@/lib/admin-errors";
import { discardUploadedUrls, uploadFileDirect } from "@/lib/direct-upload";

type ProjectWithRelations = Project & { links: ProjectLink[]; skills: ProjectSkill[] };

export function ProjectForm({ initial }: { initial?: ProjectWithRelations | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ label: string; percent?: number } | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [year, setYear] = useState(initial?.year ? String(initial.year) : String(new Date().getFullYear()));
  const [type, setType] = useState<ProjectTypeValue>(initial?.type ?? "MAIN");
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? "");
  const [productionUrl, setProductionUrl] = useState(initial?.productionUrl ?? "");
  const [playstoreUrl, setPlaystoreUrl] = useState(initial?.playstoreUrl ?? "");
  const [skills, setSkills] = useState<string[]>(initial?.skills.map((s) => s.name) ?? []);
  const [links, setLinks] = useState<LinkRow[]>(
    initial?.links.map((l) => ({ title: l.title, href: l.href })) ?? []
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    const fileError = imageError || videoError;
    if (fileError) {
      setFormError(fileError);
      toast.error(fileError);
      return;
    }

    const parsed = projectCreateSchema.safeParse({
      title,
      description,
      year,
      type,
      isFeatured,
      githubUrl,
      productionUrl,
      playstoreUrl,
      skills: skills.map((s) => s.trim()).filter(Boolean),
      links: links.filter((l) => l.title && l.href),
    });
    if (!parsed.success) {
      const message = parsed.error.issues.map((i) => i.message).join(" ");
      setFormError(message);
      toast.error(message);
      return;
    }

    setPending(true);
    setFormError(null);
    const uploaded: string[] = [];
    try {
      let imagePreviewUrl: string | undefined;
      let videoDemoUrl: string | undefined;
      if (imageFile) {
        setProgress({ label: "Uploading image…", percent: 0 });
        imagePreviewUrl = await uploadFileDirect({
          file: imageFile,
          kind: "image",
          folder: "portfolio/projects",
          onProgress: (percent) => setProgress({ label: "Uploading image…", percent }),
        });
        uploaded.push(imagePreviewUrl);
      }
      if (videoFile) {
        setProgress({ label: "Uploading video…", percent: 0 });
        videoDemoUrl = await uploadFileDirect({
          file: videoFile,
          kind: "video",
          folder: "portfolio/projects",
          onProgress: (percent) => setProgress({ label: "Uploading video…", percent }),
        });
        uploaded.push(videoDemoUrl);
      }

      setProgress({ label: isEdit ? "Saving project…" : "Creating project…" });
      const fd = new FormData();
      fd.set("title", parsed.data.title);
      fd.set("description", parsed.data.description);
      fd.set("year", String(parsed.data.year));
      fd.set("type", parsed.data.type);
      if (parsed.data.isFeatured) fd.set("isFeatured", "on");
      if (parsed.data.githubUrl) fd.set("githubUrl", parsed.data.githubUrl);
      if (parsed.data.productionUrl) fd.set("productionUrl", parsed.data.productionUrl);
      if (parsed.data.playstoreUrl) fd.set("playstoreUrl", parsed.data.playstoreUrl);
      fd.set("skills", JSON.stringify(parsed.data.skills));
      fd.set("links", JSON.stringify(parsed.data.links));
      if (initial?.id) fd.set("id", initial.id);
      if (imagePreviewUrl) fd.set("imagePreviewUrl", imagePreviewUrl);
      if (videoDemoUrl) fd.set("videoDemoUrl", videoDemoUrl);

      const res = await runAdminAction(async () =>
        isEdit ? await updateProject(fd) : await createProject(fd)
      );
      if (!res.ok) {
        await discardUploadedUrls(uploaded);
        setFormError(res.error);
        toast.error(res.error);
        return;
      }
      toast.success(isEdit ? "Project updated." : "Project created.");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      await discardUploadedUrls(uploaded);
      const message = describeAdminError(error);
      setFormError(message);
      toast.error(message);
    } finally {
      setPending(false);
      setProgress(null);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-8" noValidate>
      <AdminFormError message={formError} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <AdminFileField
          label="Image preview"
          kind="image"
          currentUrl={initial?.imagePreview}
          file={imageFile}
          error={imageError}
          disabled={pending}
          onFileChange={(file, error) => {
            setImageFile(file);
            setImageError(error);
          }}
        />
        <AdminFileField
          label="Video demo (optional)"
          hint="Large videos upload directly to storage. MP4, WebM, or MOV up to 250 MB."
          kind="video"
          currentUrl={initial?.videoDemo}
          file={videoFile}
          error={videoError}
          disabled={pending}
          onFileChange={(file, error) => {
            setVideoFile(file);
            setVideoError(error);
          }}
        />
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            required
            min={1970}
            max={2100}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as ProjectTypeValue)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MAIN">MAIN</SelectItem>
              <SelectItem value="NOTEWORTHY">NOTEWORTHY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox id="isFeatured" checked={isFeatured} onCheckedChange={(v) => setIsFeatured(v === true)} />
          <Label htmlFor="isFeatured" className="font-normal">
            Featured
          </Label>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            name="githubUrl"
            type="url"
            placeholder="https://github.com/..."
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="productionUrl">Production URL</Label>
          <Input
            id="productionUrl"
            name="productionUrl"
            type="url"
            placeholder="https://"
            value={productionUrl}
            onChange={(e) => setProductionUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="playstoreUrl">Play Store URL</Label>
          <Input
            id="playstoreUrl"
            name="playstoreUrl"
            type="url"
            placeholder="https://play.google.com/..."
            value={playstoreUrl}
            onChange={(e) => setPlaystoreUrl(e.target.value)}
          />
        </div>
      </div>

      <DynamicSkillFields value={skills} onChange={setSkills} />
      <DynamicLinkFields value={links} onChange={setLinks} />

      {progress ? (
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            {progress.label}
            {typeof progress.percent === "number" ? ` ${progress.percent}%` : null}
          </p>
          {typeof progress.percent === "number" ? (
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div className="bg-primary h-full transition-[width]" style={{ width: `${progress.percent}%` }} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Spinner className="size-4" />
              {progress?.label ?? "Saving…"}
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Create"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
