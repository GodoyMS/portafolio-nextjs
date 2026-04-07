"use client";

import { useState, useTransition } from "react";
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
import { createProject, updateProject } from "@/features/projects/actions";
import { Spinner } from "@/components/ui/spinner";

type ProjectWithRelations = Project & { links: ProjectLink[]; skills: ProjectSkill[] };

export function ProjectForm({ initial }: { initial?: ProjectWithRelations | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(initial);

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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("title", title);
    fd.set("description", description);
    fd.set("year", year);
    fd.set("type", type);
    if (isFeatured) fd.set("isFeatured", "on");
    else fd.delete("isFeatured");
    fd.set("githubUrl", githubUrl);
    fd.set("productionUrl", productionUrl);
    fd.set("playstoreUrl", playstoreUrl);
    fd.set("skills", JSON.stringify(skills.map((s) => s.trim()).filter(Boolean)));
    fd.set("links", JSON.stringify(links.filter((l) => l.title && l.href)));
    if (initial?.id) fd.set("id", initial.id);

    startTransition(async () => {
      const res = isEdit ? await updateProject(fd) : await createProject(fd);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(isEdit ? "Project updated." : "Project created.");
      router.push("/admin/projects");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-8">
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
        <div className="space-y-2">
          <Label htmlFor="imagePreview">Image preview</Label>
          <Input id="imagePreview" name="imagePreview" type="file" accept="image/*" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoDemo">Video demo (optional)</Label>
          <Input id="videoDemo" name="videoDemo" type="file" accept="video/*" />
        </div>
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

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Spinner className="size-4" />
              Saving…
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
