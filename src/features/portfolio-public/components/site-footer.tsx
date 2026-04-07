"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        bcClass.divider,
        "py-10 font-mono text-xs tracking-wide text-muted-foreground",
      )}
    >
      <div
        className={cn(
          bcClass.container,
          "flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className="max-w-lg space-y-2 text-center sm:text-left">
          <p>© {year} {siteConfig.personName}</p>
          <p className="leading-relaxed text-primary/85">
            Passionately crafted — engineered with care, curiosity, and respect for the craft.
          </p>
        </div>
        <div className="shrink-0">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
