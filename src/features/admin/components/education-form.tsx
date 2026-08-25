"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Education, EducationLink } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DynamicLinkFields, type LinkRow } from "./dynamic-link-fields";
import { AdminFileField } from "./admin-file-field";
import { AdminFormError } from "./admin-form-error";
import { createEducation, updateEducation } from "@/features/education/actions";
import { educationCreateSchema } from "@/features/education/schemas";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { describeAdminError, runAdminAction } from "@/lib/admin-errors";
import { discardUploadedUrls, uploadFileDirect } from "@/lib/direct-upload";

type EducationWithLinks = Education & { links: EducationLink[] };

function toDateInput(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function EducationForm({ initial }: { initial?: EducationWithLinks | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ label: string; percent?: number } | null>(null);

  const [institutionName, setInstitutionName] = useState(initial?.institutionName ?? "");
  const [degreeTitle, setDegreeTitle] = useState(initial?.degreeTitle ?? "");
  const [fieldOfStudy, setFieldOfStudy] = useState(initial?.fieldOfStudy ?? "");
  const [startDate, setStartDate] = useState(initial ? toDateInput(initial.startDate) : "");
  const [endDate, setEndDate] = useState(initial?.endDate ? toDateInput(initial.endDate) : "");
  const [isPresent, setIsPresent] = useState(initial?.isPresent ?? false);
  const [links, setLinks] = useState<LinkRow[]>(
    initial?.links.map((l) => ({ title: l.title, href: l.href })) ?? []
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    if (logoError) {
      setFormError(logoError);
      toast.error(logoError);
      return;
    }

    const parsed = educationCreateSchema.safeParse({
      institutionName,
      degreeTitle,
      fieldOfStudy,
      startDate,
      endDate: isPresent ? null : endDate || null,
      isPresent,
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
      let institutionLogoUrl: string | undefined;
      if (logoFile) {
        setProgress({ label: "Uploading logo…", percent: 0 });
        institutionLogoUrl = await uploadFileDirect({
          file: logoFile,
          kind: "image",
          folder: "portfolio/education",
          onProgress: (percent) => setProgress({ label: "Uploading logo…", percent }),
        });
        uploaded.push(institutionLogoUrl);
      }
      setProgress({ label: isEdit ? "Saving education…" : "Creating education…" });
      const fd = new FormData();
      fd.set("institutionName", parsed.data.institutionName);
      fd.set("degreeTitle", parsed.data.degreeTitle);
      fd.set("fieldOfStudy", parsed.data.fieldOfStudy);
      fd.set("startDate", startDate);
      if (!parsed.data.isPresent && endDate) fd.set("endDate", endDate);
      if (parsed.data.isPresent) fd.set("isPresent", "on");
      fd.set("links", JSON.stringify(parsed.data.links));
      if (initial?.id) fd.set("id", initial.id);
      if (institutionLogoUrl) fd.set("institutionLogoUrl", institutionLogoUrl);

      const res = await runAdminAction(async () =>
        isEdit ? await updateEducation(fd) : await createEducation(fd)
      );
      if (!res.ok) {
        await discardUploadedUrls(uploaded);
        setFormError(res.error);
        toast.error(res.error);
        return;
      }
      toast.success(isEdit ? "Education updated." : "Education created.");
      router.push("/admin/education");
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
          <Label htmlFor="institutionName">Institution name</Label>
          <Input
            id="institutionName"
            name="institutionName"
            required
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <AdminFileField
            label="Logo"
            kind="image"
            currentUrl={initial?.institutionLogo}
            file={logoFile}
            error={logoError}
            disabled={pending}
            onFileChange={(file, error) => {
              setLogoFile(file);
              setLogoError(error);
            }}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="degreeTitle">Degree title</Label>
          <Input
            id="degreeTitle"
            name="degreeTitle"
            required
            value={degreeTitle}
            onChange={(e) => setDegreeTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fieldOfStudy">Field of study</Label>
          <Input
            id="fieldOfStudy"
            name="fieldOfStudy"
            required
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
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
          <Checkbox id="eduPresent" checked={isPresent} onCheckedChange={(v) => setIsPresent(v === true)} />
          <Label htmlFor="eduPresent" className="font-normal">
            Present
          </Label>
        </div>
      </div>

      <DynamicLinkFields value={links} onChange={setLinks} />

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
