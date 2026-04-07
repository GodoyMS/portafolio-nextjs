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
import { format } from "date-fns";
import { WorkExperienceRowActions } from "@/features/admin/components/work-experience-row-actions";

export default async function AdminWorkExperiencePage() {
  const rows = await prisma.workExperience.findMany({
    orderBy: [{ isPresent: "desc" }, { startDate: "desc" }],
    include: { links: true, badges: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Work Experience</h1>
          <p className="text-muted-foreground text-sm">Create, edit, or remove roles.</p>
        </div>
        <Button asChild>
          <Link href="/admin/work-experience/new">Add experience</Link>
        </Button>
      </div>
      {rows.length === 0 ? (
        <div className="border-border bg-card/40 rounded-xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground text-sm">No work experience yet.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/work-experience/new">Add your first role</Link>
          </Button>
        </div>
      ) : (
        <div className="border-border overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.role}</TableCell>
                  <TableCell>{r.company}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(r.startDate, "MMM yyyy")}
                    {" — "}
                    {r.isPresent ? "Present" : r.endDate ? format(r.endDate, "MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <WorkExperienceRowActions id={r.id} />
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
