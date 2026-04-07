"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export type LinkRow = { title: string; href: string };

export function DynamicLinkFields({
  value,
  onChange,
}: {
  value: LinkRow[];
  onChange: (next: LinkRow[]) => void;
}) {
  function add() {
    onChange([...value, { title: "", href: "https://" }]);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function patch(i: number, field: keyof LinkRow, v: string) {
    onChange(value.map((row, idx) => (idx === i ? { ...row, [field]: v } : row)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label>External links</Label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-3.5" />
          Add link
        </Button>
      </div>
      {value.length === 0 ? (
        <p className="text-muted-foreground text-sm">No links yet.</p>
      ) : (
        <ul className="space-y-2">
          {value.map((row, i) => (
            <li key={i} className="border-border flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input value={row.title} onChange={(e) => patch(i, "title", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">URL</Label>
                  <Input value={row.href} onChange={(e) => patch(i, "href", e.target.value)} />
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove link">
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
