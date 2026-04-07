"use client";

import { useMemo, useState, useTransition } from "react";
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
import { createWorkExperience, updateWorkExperience } from "@/features/work-experience/actions";
import { EMPTY_TIPTAP_DOC } from "@/lib/empty-rich-text";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";

type WorkExperienceWithRelations = WorkExperience & {
  links: WorkExperienceLink[];
  badges: WorkExperienceBadge[];
};

function toDateInput(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function WorkExperienceForm({ initial }: { initial?: WorkExperienceWithRelations | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(initial);

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

  const descriptionJson = useMemo(() => JSON.stringify(description), [description]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("role", role);
    fd.set("company", company);
    fd.set("companyLink", companyLink);
    fd.set("startDate", startDate);
    if (!isPresent && endDate) fd.set("endDate", endDate);
    else fd.delete("endDate");
    if (isPresent) fd.set("isPresent", "on");
    else fd.delete("isPresent");
    fd.set("description", descriptionJson);
    fd.set("links", JSON.stringify(links.filter((l) => l.title && l.href)));
    fd.set("badges", JSON.stringify(badges.filter((b) => b.label.trim())));
    if (initial?.id) fd.set("id", initial.id);
    startTransition(async () => {
      const res = isEdit ? await updateWorkExperience(fd) : await createWorkExperience(fd);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(isEdit ? "Experience updated." : "Experience created.");
      router.push("/admin/work-experience");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-8">
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
        <div className="space-y-2">
          <Label htmlFor="companyImage">Company image</Label>
          <Input id="companyImage" name="companyImage" type="file" accept="image/*" />
          {initial?.companyImage ? (
            <p className="text-muted-foreground text-xs">Current file is kept unless you choose a new image.</p>
          ) : null}
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
            disabled={isPresent}
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
