"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ResumeButton({
  href,
  className,
  variant = "portfolio",
  size = "default",
}: {
  href: string | null;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}) {
  if (!href) {
    return (
      <Button type="button" variant="portfolio" size={size} disabled className={cn(className)}>
        Resume
      </Button>
    );
  }
  return (
    <Button variant={variant} size={size} className={cn(className)} asChild>
      <Link href={href} target="_blank" rel="noopener noreferrer" prefetch={false}>
        Resume
      </Link>
    </Button>
  );
}
