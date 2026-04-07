"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";

const ease = [0.22, 1, 0.36, 1] as const;

export const bcStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const bcStaggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export function BcSection({
  id,
  children,
  className,
  withTopBorder = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  withTopBorder?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 py-20 sm:py-24",
        withTopBorder && bcClass.divider,
        className,
      )}
    >
      <div className={bcClass.container}>{children}</div>
    </section>
  );
}

export function BcReveal({
  children,
  className,
  delay = 0,
  y = 20,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px" }}
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function BcSectionHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <header className={cn("mb-12 sm:mb-14", className)}>
      {reduce ? (
        <>
          <p className={bcClass.eyebrow}>{eyebrow}</p>
          <h2 className={bcClass.sectionTitle}>{title}</h2>
          <p className={bcClass.lead}>{description}</p>
        </>
      ) : (
        <>
          <motion.p
            className={bcClass.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.45, ease }}
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            className={bcClass.sectionTitle}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: 0.06, ease }}
          >
            {title}
          </motion.h2>
          <motion.p
            className={bcClass.lead}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: 0.12, ease }}
          >
            {description}
          </motion.p>
        </>
      )}
    </header>
  );
}

export function BcExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(bcClass.link, "inline-flex items-center gap-0.5", className)}
    >
      {children}
      <span className="inline-block translate-y-px" aria-hidden>
        ↗
      </span>
    </a>
  );
}

export function BcLogoBox({
  src,
  fallback,
  alt,
}: {
  src: string | null;
  fallback: string;
  alt: string;
}) {
  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-[var(--bc-border)] bg-[var(--bc-page)]">
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes="56px" />
      ) : (
        <span className="flex size-full items-center justify-center font-mono text-xs font-semibold text-[var(--bc-muted)]">
          {fallback}
        </span>
      )}
    </div>
  );
}

export function BcSkillPill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn(bcClass.pill, className)}>{children}</span>;
}
