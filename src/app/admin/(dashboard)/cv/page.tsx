import { prisma } from "@/lib/prisma";
import { CvUploadForm } from "@/features/admin/components/cv-upload-form";

export default async function AdminCvPage() {
  const cv = await prisma.cV.findUnique({ where: { id: 1 } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CV upload</h1>
        <p className="text-muted-foreground text-sm">
          Only one CV is stored. Uploading replaces the previous file and deletes it from R2.
        </p>
      </div>
      {cv ? (
        <div className="border-border bg-card/50 max-w-md rounded-lg border p-4 text-sm">
          <p className="text-muted-foreground">Current file</p>
          <a
            href={cv.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary mt-1 inline-block font-medium underline-offset-4 hover:underline"
          >
            Open / download
          </a>
          <p className="text-muted-foreground mt-2 text-xs">
            Last updated: {cv.updatedAt.toISOString().slice(0, 10)}
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No CV uploaded yet.</p>
      )}
      <CvUploadForm />
    </div>
  );
}
