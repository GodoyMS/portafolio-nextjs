import { z } from "zod";

const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().url().optional()
);

export const projectLinkSchema = z.object({
  title: z.string().min(1),
  href: z.string().url(),
});

export const projectBaseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  year: z.coerce.number().int().min(1970).max(new Date().getFullYear() + 2),
  type: z.enum(["MAIN", "NOTEWORTHY"]),
  isFeatured: z.boolean(),
  githubUrl: optionalUrl,
  productionUrl: optionalUrl,
  playstoreUrl: optionalUrl,
  skills: z.array(z.string().min(1)).default([]),
  links: z.array(projectLinkSchema).default([]),
});

export const projectCreateSchema = projectBaseSchema;

export const projectUpdateSchema = projectBaseSchema.extend({
  id: z.string().min(1),
});
