import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WorkExperienceForm } from "@/features/admin/components/work-experience-form";

export default async function EditWorkExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.workExperience.findUnique({
    where: { id },
    include: { links: true, badges: true },
  });
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit work experience</h1>
        <p className="text-muted-foreground text-sm">{row.company} — {row.role}</p>
      </div>
      <WorkExperienceForm initial={row} />
    </div>
  );
}
