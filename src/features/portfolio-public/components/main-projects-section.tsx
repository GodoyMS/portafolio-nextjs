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
import { ProjectMediaCard } from "./project-media-card";

type Row = Project & { skills: ProjectSkill[]; links: ProjectLink[] };

function FeaturedCard({ project: p }: { project: Row }) {
  return (
    <article className={cn(bcClass.card, "flex h-full flex-col overflow-hidden p-0")}>
      <ProjectMediaCard image={p.imagePreview} video={p.videoDemo} title={p.title} />
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={cn(bcClass.heading, "text-lg font-semibold tracking-tight")}>{p.title}</h3>
          <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
        {p.skills.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {p.skills.map((s) => (
              <li key={s.id}>
                <BcSkillPill>{s.name}</BcSkillPill>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-2">
          {p.productionUrl ? <BcExternalLink href={p.productionUrl}>Live</BcExternalLink> : null}
          {p.githubUrl ? <BcExternalLink href={p.githubUrl}>GitHub</BcExternalLink> : null}
          {p.playstoreUrl ? <BcExternalLink href={p.playstoreUrl}>Play Store</BcExternalLink> : null}
          {p.links.map((l) => (
            <BcExternalLink key={l.id} href={l.href}>
              {l.title}
            </BcExternalLink>
          ))}
        </div>
      </div>
    </article>
  );
}

export function MainProjectsSection({ featured }: { featured: Row[] }) {
  const reduce = useReducedMotion();

  return (
    <BcSection id="projects">
      <BcSectionHeader
        eyebrow="04 — Projects"
        title="Featured work"
        description="Selected products and builds — hover cards when a demo clip is available."
      />
      {featured.length === 0 ? (
        <BcReveal>
          <p className="text-sm text-muted-foreground">No featured main projects yet.</p>
        </BcReveal>
      ) : reduce ? (
        <div className="grid gap-8 lg:grid-cols-2">
          {featured.map((p) => (
            <BcReveal key={p.id} y={18}>
              <FeaturedCard project={p} />
            </BcReveal>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-8 lg:grid-cols-2"
          variants={bcStaggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-6% 0px" }}
        >
          {featured.map((p) => (
            <motion.div key={p.id} variants={bcStaggerItem} className="h-full">
              <FeaturedCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </BcSection>
  );
}
