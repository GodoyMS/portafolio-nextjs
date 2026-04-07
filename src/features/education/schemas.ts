import { z } from "zod";

const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().url().optional()
);

export const educationLinkSchema = z.object({
  title: z.string().min(1),
  href: z.string().url(),
});

export const educationBaseSchema = z.object({
  institutionName: z.string().min(1),
  degreeTitle: z.string().min(1),
  fieldOfStudy: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  isPresent: z.boolean(),
  links: z.array(educationLinkSchema).default([]),
});

export const educationCreateSchema = educationBaseSchema.superRefine((data, ctx) => {
  if (!data.isPresent && !data.endDate) {
    ctx.addIssue({ code: "custom", message: "End date is required unless Present is checked.", path: ["endDate"] });
  }
});

export const educationUpdateSchema = educationCreateSchema.extend({
  id: z.string().min(1),
});
