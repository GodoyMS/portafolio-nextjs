"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OctagonXIcon } from "lucide-react";

export function AdminFormError({
  message,
  title = "Couldn’t save",
}: {
  message: string | null | undefined;
  title?: string;
}) {
  if (!message) return null;
  return (
    <Alert variant="destructive" className="border-destructive/40">
      <OctagonXIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
