import { z } from "zod";

const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().url().optional()
);

export const workExperienceLinkSchema = z.object({
  title: z.string().min(1),
  href: z.string().url(),
});

export const workExperienceBadgeSchema = z.object({
  label: z.string().min(1),
});

export const workExperienceBaseSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  companyLink: optionalUrl,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  isPresent: z.boolean(),
  description: z.unknown(),
  links: z.array(workExperienceLinkSchema).default([]),
  badges: z.array(workExperienceBadgeSchema).default([]),
});

export const workExperienceCreateSchema = workExperienceBaseSchema.superRefine((data, ctx) => {
  if (!data.isPresent && !data.endDate) {
    ctx.addIssue({ code: "custom", message: "End date is required unless Present is checked.", path: ["endDate"] });
  }
});

export const workExperienceUpdateSchema = workExperienceCreateSchema.extend({
  id: z.string().min(1),
});
