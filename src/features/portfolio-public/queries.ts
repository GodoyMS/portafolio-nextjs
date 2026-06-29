import { prisma } from "@/lib/prisma";

export async function getCvUrl() {
  const cv = await prisma.cV.findUnique({ where: { id: 1 } });
  return cv?.fileUrl ?? null;
}

export async function getHomeData() {
  const [workExperience, education, featuredMain, noteworthy] = await Promise.all([
    prisma.workExperience.findMany({
      orderBy: [{ isPresent: "desc" }, { startDate: "desc" }],
      include: { links: true, badges: true },
    }),
    prisma.education.findMany({
      orderBy: [{ isPresent: "desc" }, { startDate: "desc" }],
      include: { links: true },
    }),
    prisma.project.findMany({
      where: { type: "MAIN", isFeatured: true },
      orderBy: { sortOrder: "asc" },
      include: { skills: true, links: true },
    }),
    prisma.project.findMany({
      where: { type: "NOTEWORTHY" },
      orderBy: { sortOrder: "asc" },
      include: { skills: true, links: true },
    }),
  ]);

  return {
    workExperience,
    education,
    featuredMain,
    noteworthy,
  };
}

export async function getAllProjects() {
  return prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
    include: { skills: true, links: true },
  });
}
