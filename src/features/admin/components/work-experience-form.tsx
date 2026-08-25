"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { WorkExperience, WorkExperienceBadge, WorkExperienceLink } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/rich-text-editor";
import { DynamicLinkFields, type LinkRow } from "./dynamic-link-fields";
import { DynamicBadgeFields, type BadgeRow } from "./dynamic-badge-fields";
import { AdminFileField } from "./admin-file-field";
import { AdminFormError } from "./admin-form-error";
import { createWorkExperience, updateWorkExperience } from "@/features/work-experience/actions";
import { workExperienceCreateSchema } from "@/features/work-experience/schemas";
import { EMPTY_TIPTAP_DOC } from "@/lib/empty-rich-text";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { describeAdminError, runAdminAction } from "@/lib/admin-errors";
import { discardUploadedUrls, uploadFileDirect } from "@/lib/direct-upload";

type WorkExperienceWithRelations = WorkExperience & {
  links: WorkExperienceLink[];
  badges: WorkExperienceBadge[];
};

function toDateInput(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function WorkExperienceForm({ initial }: { initial?: WorkExperienceWithRelations | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ label: string; percent?: number } | null>(null);

  const [role, setRole] = useState(initial?.role ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [companyLink, setCompanyLink] = useState(initial?.companyLink ?? "");
  const [startDate, setStartDate] = useState(initial ? toDateInput(initial.startDate) : "");
  const [endDate, setEndDate] = useState(initial?.endDate ? toDateInput(initial.endDate) : "");
  const [isPresent, setIsPresent] = useState(initial?.isPresent ?? false);
  const [description, setDescription] = useState<unknown>(initial?.description ?? EMPTY_TIPTAP_DOC);
  const [links, setLinks] = useState<LinkRow[]>(
    initial?.links.map((l) => ({ title: l.title, href: l.href })) ?? []
  );
  const [badges, setBadges] = useState<BadgeRow[]>(initial?.badges.map((b) => ({ label: b.label })) ?? []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const descriptionJson = useMemo(() => JSON.stringify(description), [description]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    if (imageError) {
      setFormError(imageError);
      toast.error(imageError);
      return;
    }

    const parsed = workExperienceCreateSchema.safeParse({
      role,
      company,
      companyLink,
      startDate,
      endDate: isPresent ? null : endDate || null,
      isPresent,
      description,
      links: links.filter((l) => l.title && l.href),
      badges: badges.filter((b) => b.label.trim()),
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
      let companyImageUrl: string | undefined;
      if (imageFile) {
        setProgress({ label: "Uploading image…", percent: 0 });
        companyImageUrl = await uploadFileDirect({
          file: imageFile,
          kind: "image",
          folder: "portfolio/company",
          onProgress: (percent) => setProgress({ label: "Uploading image…", percent }),
        });
        uploaded.push(companyImageUrl);
      }
      setProgress({ label: isEdit ? "Saving experience…" : "Creating experience…" });
      const fd = new FormData();
      fd.set("role", parsed.data.role);
      fd.set("company", parsed.data.company);
      if (parsed.data.companyLink) fd.set("companyLink", parsed.data.companyLink);
      fd.set("startDate", startDate);
      if (!parsed.data.isPresent && endDate) fd.set("endDate", endDate);
      if (parsed.data.isPresent) fd.set("isPresent", "on");
      fd.set("description", descriptionJson);
      fd.set("links", JSON.stringify(parsed.data.links));
      fd.set("badges", JSON.stringify(parsed.data.badges));
      if (initial?.id) fd.set("id", initial.id);
      if (companyImageUrl) fd.set("companyImageUrl", companyImageUrl);

      const res = await runAdminAction(async () =>
        isEdit ? await updateWorkExperience(fd) : await createWorkExperience(fd)
      );
      if (!res.ok) {
        await discardUploadedUrls(uploaded);
        setFormError(res.error);
        toast.error(res.error);
        return;
      }
      toast.success(isEdit ? "Experience updated." : "Experience created.");
      router.push("/admin/work-experience");
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
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" required value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" required value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyLink">Company link</Label>
          <Input
            id="companyLink"
            name="companyLink"
            type="url"
            placeholder="https://"
            value={companyLink}
            onChange={(e) => setCompanyLink(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <AdminFileField
            label="Company image"
            kind="image"
            currentUrl={initial?.companyImage}
            file={imageFile}
            error={imageError}
            disabled={pending}
            onFileChange={(file, error) => {
              setImageFile(file);
              setImageError(error);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className={isPresent ? "text-muted-foreground" : undefined}>
            End date
          </Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            disabled={isPresent || pending}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox id="isPresent" checked={isPresent} onCheckedChange={(v) => setIsPresent(v === true)} />
          <Label htmlFor="isPresent" className="font-normal">
            Present
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      <DynamicLinkFields value={links} onChange={setLinks} />
      <DynamicBadgeFields value={badges} onChange={setBadges} />

      {progress ? (
        <p className="text-muted-foreground text-sm">
          {progress.label}
          {typeof progress.percent === "number" ? ` ${progress.percent}%` : null}
        </p>
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
