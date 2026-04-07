"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project, ProjectLink, ProjectSkill } from "@prisma/client";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";
import {
  BcExternalLink,
  BcSection,
  BcSectionHeader,
  BcSkillPill,
  BcReveal,
  bcStaggerContainer,
  bcStaggerItem,
} from "./bc-ui";

type Row = Project & { skills: ProjectSkill[]; links: ProjectLink[] };

function NoteCard({ project: p }: { project: Row }) {
  return (
    <article
      className={cn(
        bcClass.cardFlat,
        "flex h-full flex-col p-5 transition-[border-color,transform] duration-300 hover:border-[color-mix(in_oklch,var(--bc-accent)_20%,var(--bc-border))]",
      )}
    >
      <h3 className={cn(bcClass.heading, "font-semibold tracking-tight")}>{p.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-[var(--bc-muted)]">{p.description}</p>
      {p.skills.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.skills.slice(0, 5).map((s) => (
            <li key={s.id}>
              <BcSkillPill className="text-[0.65rem] uppercase">{s.name}</BcSkillPill>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-4">
        {p.productionUrl ? <BcExternalLink href={p.productionUrl}>Live</BcExternalLink> : null}
        {p.githubUrl ? <BcExternalLink href={p.githubUrl}>GitHub</BcExternalLink> : null}
        {p.links.map((l) => (
          <BcExternalLink key={l.id} href={l.href}>
            {l.title}
          </BcExternalLink>
        ))}
      </div>
    </article>
  );
}

export function NoteworthySection({ items }: { items: Row[] }) {
  const reduce = useReducedMotion();
  if (items.length === 0) return null;

  return (
    <BcSection id="other-projects" className="pb-28 sm:pb-32">
      <BcSectionHeader
        eyebrow="05 — More"
        title="Other noteworthy projects"
        description="Smaller experiments, client work, and ideas worth highlighting."
      />
      {reduce ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <BcReveal key={p.id} y={14}>
              <NoteCard project={p} />
            </BcReveal>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={bcStaggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-6% 0px" }}
        >
          {items.map((p) => (
            <motion.div key={p.id} variants={bcStaggerItem} className="h-full">
              <NoteCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </BcSection>
  );
}
