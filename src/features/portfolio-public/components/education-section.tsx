"use client";

import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import type { Education, EducationLink } from "@prisma/client";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";
import {
  BcExternalLink,
  BcLogoBox,
  BcSection,
  BcSectionHeader,
  BcReveal,
  bcStaggerContainer,
  bcStaggerItem,
} from "./bc-ui";

type Row = Education & { links: EducationLink[] };

function EduCard({ edu }: { edu: Row }) {
  return (
    <article
      className={cn(bcClass.card, "flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-6")}
    >
      <BcLogoBox
        src={edu.institutionLogo}
        fallback={edu.institutionName.slice(0, 2).toUpperCase()}
        alt=""
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className={cn(bcClass.heading, "text-lg font-semibold tracking-tight")}>{edu.institutionName}</h3>
          {edu.links.map((l) => (
            <BcExternalLink key={l.id} href={l.href}>
              {l.title}
            </BcExternalLink>
          ))}
        </div>
        <p className={cn(bcClass.heading, "mt-1")}>
          {edu.degreeTitle}
          <span className="text-[var(--bc-muted)]"> · {edu.fieldOfStudy}</span>
        </p>
        <p className={cn(bcClass.date, "mt-2")}>
          {format(edu.startDate, "MMM yyyy")}
          {" — "}
          {edu.isPresent ? "Present" : edu.endDate ? format(edu.endDate, "MMM yyyy") : "—"}
        </p>
      </div>
    </article>
  );
}

export function EducationSection({ items }: { items: Row[] }) {
  const reduce = useReducedMotion();

  return (
    <BcSection id="education">
      <BcSectionHeader
        eyebrow="03 — Education"
        title="Learning"
        description="Formal training that shaped how I think about systems and software."
      />
      {items.length === 0 ? (
        <BcReveal>
          <p className="text-sm text-[var(--bc-muted)]">Education entries coming soon.</p>
        </BcReveal>
      ) : reduce ? (
        <div className="space-y-8">
          {items.map((edu) => (
            <BcReveal key={edu.id} y={16}>
              <EduCard edu={edu} />
            </BcReveal>
          ))}
        </div>
      ) : (
        <motion.div
          className="space-y-8"
          variants={bcStaggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-6% 0px" }}
        >
          {items.map((edu) => (
            <motion.div key={edu.id} variants={bcStaggerItem}>
              <EduCard edu={edu} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </BcSection>
  );
}
