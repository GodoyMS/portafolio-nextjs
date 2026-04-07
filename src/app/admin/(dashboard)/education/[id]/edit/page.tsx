import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EducationForm } from "@/features/admin/components/education-form";

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.education.findUnique({
    where: { id },
    include: { links: true },
  });
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit education</h1>
        <p className="text-muted-foreground text-sm">{row.institutionName}</p>
      </div>
      <EducationForm initial={row} />
    </div>
  );
}
