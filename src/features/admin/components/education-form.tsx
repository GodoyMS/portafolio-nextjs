"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Education, EducationLink } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DynamicLinkFields, type LinkRow } from "./dynamic-link-fields";
import { createEducation, updateEducation } from "@/features/education/actions";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";

type EducationWithLinks = Education & { links: EducationLink[] };

function toDateInput(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function EducationForm({ initial }: { initial?: EducationWithLinks | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(initial);

  const [institutionName, setInstitutionName] = useState(initial?.institutionName ?? "");
  const [degreeTitle, setDegreeTitle] = useState(initial?.degreeTitle ?? "");
  const [fieldOfStudy, setFieldOfStudy] = useState(initial?.fieldOfStudy ?? "");
  const [startDate, setStartDate] = useState(initial ? toDateInput(initial.startDate) : "");
  const [endDate, setEndDate] = useState(initial?.endDate ? toDateInput(initial.endDate) : "");
  const [isPresent, setIsPresent] = useState(initial?.isPresent ?? false);
  const [links, setLinks] = useState<LinkRow[]>(
    initial?.links.map((l) => ({ title: l.title, href: l.href })) ?? []
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("institutionName", institutionName);
    fd.set("degreeTitle", degreeTitle);
    fd.set("fieldOfStudy", fieldOfStudy);
    fd.set("startDate", startDate);
    if (!isPresent && endDate) fd.set("endDate", endDate);
    else fd.delete("endDate");
    if (isPresent) fd.set("isPresent", "on");
    else fd.delete("isPresent");
    fd.set("links", JSON.stringify(links.filter((l) => l.title && l.href)));
    if (initial?.id) fd.set("id", initial.id);

    startTransition(async () => {
      const res = isEdit ? await updateEducation(fd) : await createEducation(fd);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(isEdit ? "Education updated." : "Education created.");
      router.push("/admin/education");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-8">
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
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="institutionLogo">Logo</Label>
          <Input id="institutionLogo" name="institutionLogo" type="file" accept="image/*" />
          {initial?.institutionLogo ? (
            <p className="text-muted-foreground text-xs">Current logo is kept unless you upload a new file.</p>
          ) : null}
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
            disabled={isPresent}
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
