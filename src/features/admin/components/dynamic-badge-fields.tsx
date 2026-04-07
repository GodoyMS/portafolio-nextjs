"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export type BadgeRow = { label: string };

export function DynamicBadgeFields({
  value,
  onChange,
}: {
  value: BadgeRow[];
  onChange: (next: BadgeRow[]) => void;
}) {
  function add() {
    onChange([...value, { label: "" }]);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function patch(i: number, v: string) {
    onChange(value.map((row, idx) => (idx === i ? { label: v } : row)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label>Badges</Label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-3.5" />
          Add badge
        </Button>
      </div>
      {value.length === 0 ? (
        <p className="text-muted-foreground text-sm">No badges yet.</p>
      ) : (
        <ul className="space-y-2">
          {value.map((row, i) => (
            <li key={i} className="flex gap-2">
              <Input value={row.label} onChange={(e) => patch(i, e.target.value)} placeholder="e.g. React" />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove badge">
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
