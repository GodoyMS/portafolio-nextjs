import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProjectRowActions } from "@/features/admin/components/project-row-actions";

export default async function AdminProjectsPage() {
  const rows = await prisma.project.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    include: { skills: true, links: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">Main and noteworthy portfolio pieces.</p>
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
        <div className="border-border overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.year}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.type}</Badge>
                  </TableCell>
                  <TableCell>{r.isFeatured ? "Yes" : "—"}</TableCell>
                  <TableCell className="text-right">
                    <ProjectRowActions id={r.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
