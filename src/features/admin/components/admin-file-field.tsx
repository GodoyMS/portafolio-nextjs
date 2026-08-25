"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { acceptAttr, formatBytes, validateUploadFile, type UploadKind } from "@/lib/upload-constraints";
import { cn } from "@/lib/utils";

export function AdminFileField({
  label,
  hint,
  kind,
  currentUrl,
  file,
  error,
  disabled,
  required,
  onFileChange,
}: {
  label: string;
  hint?: string;
  kind: UploadKind;
  currentUrl?: string | null;
  file: File | null;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  onFileChange: (file: File | null, error: string | null) => void;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const [inputKey, setInputKey] = useState(0);

  function handleChange(next: File | null) {
    if (!next) {
      setInputKey((key) => key + 1);
      onFileChange(null, required ? "Choose a file before uploading." : null);
      return;
    }
    const checked = validateUploadFile(next, kind);
    onFileChange(next, checked.ok ? null : checked.error);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        key={inputKey}
        id={id}
        type="file"
        accept={acceptAttr(kind)}
        disabled={disabled}
        required={required && !file && !currentUrl}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => handleChange(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">
            Selected: {file.name} ({formatBytes(file.size)})
          </p>
          <Button type="button" variant="ghost" size="xs" disabled={disabled} onClick={() => handleChange(null)}>
            Clear
          </Button>
        </div>
      ) : currentUrl ? (
        <CurrentAsset kind={kind} url={currentUrl} />
      ) : hint ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CurrentAsset({ kind, url }: { kind: UploadKind; url: string }) {
  return (
    <div className="border-border bg-muted/30 overflow-hidden rounded-lg border">
      {kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Current upload" className="h-32 w-full object-cover" />
      ) : kind === "video" ? (
        <video src={url} className="h-32 w-full object-cover" controls preload="metadata" />
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary block px-3 py-2 text-xs font-medium underline-offset-4 hover:underline"
        >
          Open current file
        </a>
      )}
      <p className={cn("text-muted-foreground px-3 py-1.5 text-xs", kind !== "pdf" && "border-t border-border")}>
        Current file is kept unless you choose a new one.
      </p>
    </div>
  );
}
