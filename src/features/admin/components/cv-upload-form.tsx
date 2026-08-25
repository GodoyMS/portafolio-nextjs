"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { replaceCv } from "@/features/cv/actions";
import { AdminFileField } from "./admin-file-field";
import { AdminFormError } from "./admin-form-error";
import { Spinner } from "@/components/ui/spinner";
import { describeAdminError, runAdminAction } from "@/lib/admin-errors";
import { discardUploadedUrls, uploadFileDirect } from "@/lib/direct-upload";

export function CvUploadForm({ currentUrl }: { currentUrl?: string | null }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ label: string; percent?: number } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    if (fileError) {
      setFormError(fileError);
      toast.error(fileError);
      return;
    }
    if (!file) {
      const message = "Choose a PDF before uploading.";
      setFormError(message);
      toast.error(message);
      return;
    }

    setPending(true);
    setFormError(null);
    const uploaded: string[] = [];
    try {
      setProgress({ label: "Uploading PDF…", percent: 0 });
      const fileUrl = await uploadFileDirect({
        file,
        kind: "pdf",
        folder: "portfolio/cv",
        onProgress: (percent) => setProgress({ label: "Uploading PDF…", percent }),
      });
      uploaded.push(fileUrl);
      setProgress({ label: "Saving CV…" });
      const fd = new FormData();
      fd.set("fileUrl", fileUrl);
      const res = await runAdminAction(() => replaceCv(fd));
      if (!res.ok) {
        await discardUploadedUrls(uploaded);
        setFormError(res.error);
        toast.error(res.error);
        return;
      }
      toast.success("CV uploaded. Previous file was removed from storage.");
      setFile(null);
      router.refresh();
    } catch (error) {
      await discardUploadedUrls(uploaded);
      const message = describeAdminError(error);
      setFormError(message);
      toast.error(message);
    } finally {
      setPending(false);
      setProgress(null);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4" noValidate>
      <AdminFormError message={formError} />
      <AdminFileField
        label="PDF file"
        kind="pdf"
        currentUrl={currentUrl}
        file={file}
        error={fileError}
        disabled={pending}
        required
        onFileChange={(next, error) => {
          setFile(next);
          setFileError(error);
        }}
      />
      {progress ? (
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            {progress.label}
            {typeof progress.percent === "number" ? ` ${progress.percent}%` : null}
          </p>
          {typeof progress.percent === "number" ? (
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div className="bg-primary h-full transition-[width]" style={{ width: `${progress.percent}%` }} />
            </div>
          ) : null}
        </div>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Spinner className="size-4" />
            {progress?.label ?? "Uploading…"}
          </>
        ) : (
          "Replace CV"
        )}
      </Button>
    </form>
  );
}
