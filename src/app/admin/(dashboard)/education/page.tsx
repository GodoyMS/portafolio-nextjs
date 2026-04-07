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
import { EducationRowActions } from "@/features/admin/components/education-row-actions";

export default async function AdminEducationPage() {
  const rows = await prisma.education.findMany({
    orderBy: [{ isPresent: "desc" }, { startDate: "desc" }],
    include: { links: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Education</h1>
          <p className="text-muted-foreground text-sm">Manage degrees and programs.</p>
        </div>
        <Button asChild>
          <Link href="/admin/education/new">Add education</Link>
        </Button>
      </div>
      {rows.length === 0 ? (
        <div className="border-border bg-card/40 rounded-xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground text-sm">No education entries yet.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/education/new">Add your first entry</Link>
          </Button>
        </div>
      ) : (
        <div className="border-border overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.institutionName}</TableCell>
                  <TableCell>
                    {r.degreeTitle}
                    <span className="text-muted-foreground block text-xs">{r.fieldOfStudy}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(r.startDate, "MMM yyyy")}
                    {" — "}
                    {r.isPresent ? "Present" : r.endDate ? format(r.endDate, "MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <EducationRowActions id={r.id} />
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
