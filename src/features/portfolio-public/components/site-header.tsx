"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";
import { ResumeButton } from "./resume-button";

export function SiteHeader({ cvUrl }: { cvUrl: string | null }) {
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(bcClass.headerBar, "sticky top-0 z-50")}
    >
      <div className={cn(bcClass.container, "flex h-14 items-center justify-between")}>
        <Link
          href="/"
          className={bcClass.brandLink}
        >
          {siteConfig.personName}
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-3 sm:gap-4" aria-label="Primary">
          <Link href="#work" className={bcClass.navLink}>
            Experience
          </Link>
          <Link href="#education" className={cn(bcClass.navLink, "hidden sm:inline")}>
            Education
          </Link>
          <Link href="#projects" className={bcClass.navLink}>
            Projects
          </Link>
          <ThemeSwitcher />
          <ResumeButton href={cvUrl} size="sm" variant="outline" className={bcClass.resumeOutline} />
        </nav>
      </div>
    </motion.header>
  );
}
