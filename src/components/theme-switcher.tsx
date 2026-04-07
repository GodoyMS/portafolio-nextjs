"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const value = theme ?? "system";
  const active = options.find((o) => o.value === value) ?? options[2];
  const ActiveIcon = active.Icon;

  if (!mounted) {
    return (
      <div
        className="h-8 min-w-[7.5rem] rounded-lg border border-border bg-background/85"
        aria-hidden
      />
    );
  }

  return (
    <Select value={value} onValueChange={setTheme}>
      <SelectTrigger
        size="sm"
        aria-label="Color theme"
        className="min-w-[7.5rem] border-border bg-background/85 text-muted-foreground focus-visible:border-primary/60 focus-visible:ring-primary/30"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent align="end" position="popper" className="min-w-[var(--radix-select-trigger-width)]">
        {options.map(({ value: v, label, Icon }) => (
          <SelectItem key={v} value={v} className="gap-2">
            <Icon className="size-3.5 text-primary" aria-hidden />
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
