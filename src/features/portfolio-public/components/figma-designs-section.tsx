"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";
import {
  BcReveal,
  BcSection,
  BcSectionHeader,
  bcStaggerContainer,
  bcStaggerItem,
} from "./bc-ui";

type FigmaProject = {
  title: string;
  description: string;
  image: string;
  href: string;
};

const figmaProjects: FigmaProject[] = [
  {
    title: "Geo Asistencia Alyabe",
    description:
      "Mobile app and admin dashboard ecosystem for attendance tracking, reports, schedules, vacation management, headquarters setup, calendar administration, and real-time employee location visibility.",
    image: "/projects/figma/geo.png",
    href: "https://www.figma.com/design/hQ7450teVrPzIsdq92EM3T/Geo-Asistencia-Demo",
  },
  {
    title: "Provento Group AB",
    description:
      "Professional enterprise website concept for a Stockholm household services company, focused on service discovery, trust-building presentation, and streamlined appointment booking journeys.",
    image: "/projects/figma/provento.png",
    href: "https://www.figma.com/design/Cqfas7RT5AyaecHq5VkYXP/Provento-Group",
  },
];

function FigmaProjectCard({ project }: { project: FigmaProject }) {
  return (
    <article
      className={cn(
        bcClass.cardFlat,
        "flex overflow-hidden  border-border/70 bg-card/70 flex-col md:flex-row ",
      )}
    >
      <div className="flex flex-col justify-center items-center mb-0 md:mb-0">
        <div className="relative   md:max-w-2xl w-full p-4  rounded-lg">
          <Image
            src={project.image}
            alt={project.title}
            width={400}
            height={400}
            className="object-cover rounded-lg   "
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-5 p-5 sm:p-6 lg:p-8">
        <div className="space-y-3">
          <p className={bcClass.eyebrow}>Figma Use Case</p>
          <h3
            className={cn(
              bcClass.heading,
              "text-xl font-semibold tracking-tight sm:text-2xl",
            )}
          >
            {project.title}
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
            {project.description}
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="portfolio"
            size="lg"
            className="h-10 px-4 sm:px-5"
            asChild
          >
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} in Figma`}
            >
              <Image src="/icons/figma.svg" alt="Figma" width={20} height={20} />
              {/* <Figma className="size-4" aria-hidden /> */}
              View Design
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function FigmaDesignsSection() {
  const reduce = useReducedMotion();

  return (
    <BcSection id="designs">
      <BcSectionHeader
        eyebrow="05 — Figma Designs"
        title="Design use cases"
        description="High-fidelity product explorations focused on real user flows, admin operations, and business outcomes."
      />

      {reduce ? (
        <div className="grid gap-6">
          {figmaProjects.map((project) => (
            <BcReveal key={project.title} y={16}>
              <FigmaProjectCard project={project} />
            </BcReveal>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-6"
          variants={bcStaggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-6% 0px" }}
        >
          {figmaProjects.map((project) => (
            <motion.div key={project.title} variants={bcStaggerItem}>
              <FigmaProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </BcSection>
  );
}
