"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import type {
  WorkExperience,
  WorkExperienceBadge,
  WorkExperienceLink,
} from "@prisma/client";
import { ArrowDownRight, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";
import { BcExternalLink, BcSkillPill } from "./bc-ui";
import { IconGithub, IconLinkedin } from "./bc-icons";
import { ResumeButton } from "./resume-button";

type WorkRow = WorkExperience & {
  links: WorkExperienceLink[];
  badges: WorkExperienceBadge[];
};

const nav = [
  { n: "01", label: "About", href: "#about" },
  { n: "02", label: "Experience", href: "#work" },
  { n: "03", label: "Education", href: "#education" },
  { n: "04", label: "Projects", href: "#projects" },
] as const;

function AnimatedName({ text }: { text: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <span className={bcClass.heading}>{text}</span>;
  }
  return (
    <span className="inline-block">
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className={cn("inline-block", bcClass.heading)}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.12 + i * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function AnimatedLine({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <p className={className}>{text}</p>;
  }
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="mr-[0.3em] inline-block"
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

function BcOutlineButton({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const Comp = external ? "a" : Link;
  const extra = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

  return (
    <Comp
      href={href}
      className={cn(bcClass.outlineButton, className)}
      {...extra}
    >
      {children}
    </Comp>
  );
}

export function HeroProfileSection({
  cvUrl,
  workExperience,
}: {
  cvUrl: string | null;
  workExperience: WorkRow[];
}) {
  const reduce = useReducedMotion();

  return (
    <>
      <section
        className="relative overflow-hidden h-screen border-b border-[var(--bc-border-subtle)]"
        style={{ backgroundColor: "var(--bc-page)", color: "var(--bc-muted)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, var(--bc-radial-glow), transparent)",
          }}
        />
        <div className="relative h-full flex flex-col justify-center mx-auto max-w-[1000px] px-6 py-16 sm:py-20 lg:px-12 lg:py-28">
          <div id="about" className="scroll-mt-28">
            <motion.p
              className="font-mono text-sm tracking-widest text-[var(--bc-accent)]"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              Hi, my name is
            </motion.p>
            <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl  lg:text-[4.75rem] lg:leading-[1.15]">
              <AnimatedName text={siteConfig.personName} />
              <span className="text-[var(--bc-muted)]">.</span>
            </h1>
            <motion.h2
              className=" text-3xl font-bold  tracking-tight text-[var(--bc-muted)] sm:text-4xl lg:text-[3.8rem]"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {siteConfig.heroTagline}
            </motion.h2>
            <motion.p
             className="max-w-xl mt-10"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              I’m a software engineer specializing in building (and occasionally
              designing) exceptional digital experiences. Currently, I’m focused
              on building accessible, human-centered healthcare products at <Link className="hover:underline text-[var(--bc-accent)]" href="https://openloophealth.com" target="_blank" rel="noopener noreferrer">Openloop Health</Link>.
            </motion.p>
          

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-3"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <BcOutlineButton href="#work">
                View experience
                <ArrowDownRight className="size-3.5" aria-hidden />
              </BcOutlineButton>
              
              <ResumeButton
                href={cvUrl}
                variant="outline"
                size="default"
                className={cn(
                  bcClass.resumeOutline,
                  "font-mono text-xs tracking-wide",
                )}
              />
              {siteConfig.socialEmail ? (
                <BcOutlineButton
                  href={`mailto:${siteConfig.socialEmail}`}
                  external
                >
                  Say hello
                </BcOutlineButton>
              ) : null}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
