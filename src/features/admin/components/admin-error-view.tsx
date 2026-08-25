"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { describeAdminError } from "@/lib/admin-errors";
import { OctagonXIcon } from "lucide-react";

export function AdminErrorView({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message = describeAdminError(error);
  const digest = error.digest;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 py-10">
      <Alert variant="destructive" className="border-destructive/40">
        <OctagonXIcon />
        <AlertTitle>This page couldn’t load</AlertTitle>
        <AlertDescription>
          {message}
          {digest ? <span className="mt-2 block text-xs opacity-80">Reference: {digest}</span> : null}
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={retry}>
          Try again
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin">Back to admin</Link>
        </Button>
      </div>
    </div>
  );
}
