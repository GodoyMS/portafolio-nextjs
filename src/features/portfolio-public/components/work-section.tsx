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

function ExperienceTimelineLine() {
  return (
    <div
      className="pointer-events-none hidden md:block absolute left-5.5 top-8 bottom-8 w-px -translate-x-1/2 bg-border/75 sm:left-6"
      aria-hidden
    />
  );
}

function TimelineDot() {
  return (
    <div
      className="relative z-1 hidden md:flex w-11 shrink-0 justify-center sm:w-12"
      aria-hidden
    >
      <span
        className={cn(
          "mt-6 size-2.5 shrink-0 rounded-full border-2 border-primary/35 bg-background",
          "shadow-[0_0_0_4px_var(--background)] ring-1 ring-border/40",
        )}
      />
    </div>
  );
}

function JobCard({ job }: { job: Row }) {
  const dateRange = (
    <>
      {format(job.startDate, "MMM yyyy")}
      {" — "}
      {job.isPresent ? "Present" : job.endDate ? format(job.endDate, "MMM yyyy") : "—"}
    </>
  );

  return (
    <article
      className={cn(
        bcClass.card,
        "grid min-w-0 gap-6 py-6 sm:gap-8",
        "lg:grid-cols-[minmax(15rem,32%)_minmax(0,1fr)] lg:items-start",
      )}
    >
      <div className="min-w-0 lg:contents">
        <div className="flex min-h-14 gap-4 lg:col-start-1 lg:row-start-1 lg:min-h-0">
          <BcLogoBox src={job.companyImage} fallback={job.company.slice(0, 2).toUpperCase()} alt="" />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
            <div className="space-y-0.5">
              {job.companyLink ? (
                <a
                  href={job.companyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    bcClass.linkInline,
                    "block text-base font-semibold leading-snug tracking-tight sm:text-[1.05rem]",
                  )}
                >
                  {job.company}
                </a>
              ) : (
                <span
                  className={cn(
                    bcClass.heading,
                    "block text-base font-semibold leading-snug tracking-tight sm:text-[1.05rem]",
                  )}
                >
                  {job.company}
                </span>
              )}
              <p className="text-sm leading-snug text-muted-foreground">{job.role}</p>
            </div>
            <p className={cn(bcClass.date, "pt-0.5")}>{dateRange}</p>
            {job.links.length > 0 ? (
              <ul className="flex flex-wrap gap-x-3 gap-y-2 pt-1">
                {job.links.map((l) => (
                  <li key={l.id}>
                    <BcExternalLink href={l.href}>{l.title}</BcExternalLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <div className="min-w-0 space-y-4 mt-4 lg:mt-0 border-t border-border/50 pt-6 lg:col-start-2 lg:row-start-1 lg:border-t-0 lg:pt-0">
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
      </div>
    </article>
  );
}

function WorkTimelineRow({ job }: { job: Row }) {
  return (
    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-3 sm:gap-x-5 lg:gap-x-6">
      <TimelineDot />
      <JobCard job={job} />
    </div>
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
          <p className="text-sm text-muted-foreground">Experience coming soon.</p>
        </BcReveal>
      ) : reduce ? (
        <div className="relative">
          {items.length > 1 ? <ExperienceTimelineLine /> : null}
          {items.map((job, i) => (
            <BcReveal key={job.id} y={16} className={cn(i > 0 && "mt-10")}>
              <WorkTimelineRow job={job} />
            </BcReveal>
          ))}
        </div>
      ) : (
        <div className="relative">
          {items.length > 1 ? <ExperienceTimelineLine /> : null}
          <motion.div
            className="space-y-0"
            variants={bcStaggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-6% 0px" }}
          >
            {items.map((job, i) => (
              <motion.div
                key={job.id}
                variants={bcStaggerItem}
                className={cn(i > 0 && "mt-10")}
              >
                <WorkTimelineRow job={job} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </BcSection>
  );
}
