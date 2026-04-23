"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Menu } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";
import { ResumeButton } from "./resume-button";

const navItems = [
  { href: "#work", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#designs", label: "Designs" },
] as const;

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="shrink-0 border-border md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,20rem)] border-border bg-background">
        <SheetHeader className="text-left">
          <SheetTitle className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2 pb-6" aria-label="Primary">
          {navItems.map(({ href, label }) => (
            <SheetClose key={href} asChild>
              <Link
                href={href}
                className={cn(
                  bcClass.navLink,
                  "rounded-md px-3 py-3 text-base transition-colors hover:bg-muted/60",
                )}
              >
                {label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader({ cvUrl }: { cvUrl: string | null }) {
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(bcClass.headerBar, "sticky top-0 z-50")}
    >
      <div
        className={cn(
          bcClass.container,
          "flex min-h-14 items-center justify-between gap-3 py-2 md:gap-4 md:py-0",
        )}
      >
        <Link
          href="/"
          className={cn(bcClass.brandLink, "min-w-0 max-w-[min(100%,12rem)] truncate sm:max-w-none")}
        >
          {siteConfig.personName}
        </Link>

        {/* Desktop */}
        <nav
          className="hidden items-center gap-5 md:flex md:gap-6"
          aria-label="Primary"
        >
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} className={bcClass.navLink}>
              {label}
            </Link>
          ))}
          <ResumeButton href={cvUrl} size="sm" />
        </nav>

        {/* Mobile */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <ResumeButton href={cvUrl} size="sm" className="min-w-0" />
          <MobileNav />
        </div>
      </div>
    </motion.header>
  );
}
