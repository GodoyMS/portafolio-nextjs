"use client";

import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import type { WorkExperience, WorkExperienceBadge, WorkExperienceLink } from "@prisma/client";
import { RichTextView } from "@/components/rich-text-view";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";
import {
  BcExternalLink,
  BcLogoBox,
  BcSection,
  BcSectionHeader,
  BcSkillPill,
  BcReveal,
  bcStaggerContainer,
  bcStaggerItem,
} from "./bc-ui";

type Row = WorkExperience & { links: WorkExperienceLink[]; badges: WorkExperienceBadge[] };

function JobCard({ job }: { job: Row }) {
  return (
    <article
      className={cn(
        bcClass.card,
        "grid gap-6 p-6 lg:grid-cols-[auto_1fr] lg:gap-8",
      )}
    >
      <div className="flex gap-4 lg:flex-col lg:items-start">
        <BcLogoBox src={job.companyImage} fallback={job.company.slice(0, 2).toUpperCase()} alt="" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {job.companyLink ? (
              <a
                href={job.companyLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(bcClass.linkInline, "text-lg font-semibold")}
              >
                {job.company}
              </a>
            ) : (
              <span className={cn(bcClass.heading, "text-lg font-semibold")}>{job.company}</span>
            )}
            <span className="text-sm text-[var(--bc-muted)]">{job.role}</span>
          </div>
          <p className={cn(bcClass.date, "mt-1")}>
            {format(job.startDate, "MMM yyyy")}
            {" — "}
            {job.isPresent ? "Present" : job.endDate ? format(job.endDate, "MMM yyyy") : "—"}
          </p>
          {job.links.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {job.links.map((l) => (
                <li key={l.id}>
                  <BcExternalLink href={l.href}>{l.title}</BcExternalLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <RichTextView doc={job.description} tone="portfolio" />
        {job.badges.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {job.badges.map((b) => (
              <li key={b.id}>
                <BcSkillPill className="uppercase">{b.label}</BcSkillPill>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function WorkSection({ items }: { items: Row[] }) {
  const reduce = useReducedMotion();

  return (
    <BcSection id="work">
      <BcSectionHeader
        eyebrow="02 — Experience"
        title="Work"
        description="Recent roles, impact, and the technologies I used day to day."
      />
      {items.length === 0 ? (
        <BcReveal>
          <p className="text-sm text-[var(--bc-muted)]">Experience coming soon.</p>
        </BcReveal>
      ) : reduce ? (
        <div className="space-y-10">
          {items.map((job) => (
            <BcReveal key={job.id} y={16}>
              <JobCard job={job} />
            </BcReveal>
          ))}
        </div>
      ) : (
        <motion.div
          className="space-y-10"
          variants={bcStaggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-6% 0px" }}
        >
          {items.map((job) => (
            <motion.div key={job.id} variants={bcStaggerItem}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </BcSection>
  );
}
