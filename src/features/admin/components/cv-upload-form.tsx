"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { replaceCv } from "@/features/cv/actions";
import { Spinner } from "@/components/ui/spinner";

export function CvUploadForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const res = await replaceCv(fd);
      if (!res.ok) toast.error(res.error);
      else {
        toast.success("CV uploaded. Previous file was removed from storage.");
        form.reset();
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">PDF file</Label>
        <Input id="file" name="file" type="file" accept="application/pdf" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Spinner className="size-4" />
            Uploading…
          </>
        ) : (
          "Replace CV"
        )}
      </Button>
    </form>
  );
}
