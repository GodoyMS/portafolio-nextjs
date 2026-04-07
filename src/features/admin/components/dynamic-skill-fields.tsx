"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export function DynamicSkillFields({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  function add() {
    onChange([...value, ""]);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function patch(i: number, v: string) {
    onChange(value.map((s, idx) => (idx === i ? v : s)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label>Skills</Label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-3.5" />
          Add skill
        </Button>
      </div>
      {value.length === 0 ? (
        <p className="text-muted-foreground text-sm">No skills yet.</p>
      ) : (
        <ul className="space-y-2">
          {value.map((skill, i) => (
            <li key={i} className="flex gap-2">
              <Input value={skill} onChange={(e) => patch(i, e.target.value)} placeholder="e.g. TypeScript" />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove skill">
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
