import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/features/admin/components/project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.project.findUnique({
    where: { id },
    include: { links: true, skills: true },
  });
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
        <p className="text-muted-foreground text-sm">{row.title}</p>
      </div>
      <ProjectForm initial={row} />
    </div>
  );
}
