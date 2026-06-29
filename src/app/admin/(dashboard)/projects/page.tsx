import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProjectsTableDnd } from "@/features/admin/components/projects-table-dnd";

export default async function AdminProjectsPage() {
  const rows = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
    include: { skills: true, links: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">
            Drag rows to reorder. Order is reflected on the landing page.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">Add project</Link>
        </Button>
      </div>
      {rows.length === 0 ? (
        <div className="border-border bg-card/40 rounded-xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground text-sm">No projects yet.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/projects/new">Add your first project</Link>
          </Button>
        </div>
      ) : (
        <ProjectsTableDnd initialRows={rows} />
      )}
    </div>
  );
}
