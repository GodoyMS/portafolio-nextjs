"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";
import { ResumeButton } from "./resume-button";

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

export function HeroProfileSection({ cvUrl }: { cvUrl: string | null }) {
  const reduce = useReducedMotion();

  const heroRadial =
    "radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in oklch, var(--primary) 14%, transparent), transparent)";

  return (
    <>
      <section className="relative h-screen overflow-hidden border-b border-border/60 bg-background text-muted-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: heroRadial }}
        />
        <div className="relative mx-auto flex h-full max-w-[1000px] flex-col justify-center px-6 py-16 sm:py-20 lg:px-12 lg:py-28">
          <div id="about" className="scroll-mt-28">
            <motion.p
              className="font-mono text-sm tracking-widest text-primary"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              Hi, my name is
            </motion.p>
            <h1 className="mt-2 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[4.75rem] lg:leading-[1.15]">
              <AnimatedName text={siteConfig.personName} />
              <span className="text-muted-foreground">.</span>
            </h1>
            <motion.h2
              className="text-3xl font-bold tracking-tight text-muted-foreground sm:text-4xl lg:text-[3.8rem]"
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
              className="mt-10 max-w-xl"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              I’m a software engineer specializing in building (and occasionally designing)
              exceptional digital experiences. Currently, I’m focused on building accessible,
              human-centered healthcare products at{" "}
              <Link
                className="text-primary transition-colors hover:underline"
                href="https://openloophealth.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Openloop Health
              </Link>
              .
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
              <Button variant="portfolio" className="min-h-10 px-5 py-2.5" asChild>
                <Link href="#work">
                  View experience
                  <ArrowDownRight className="size-3.5" aria-hidden />
                </Link>
              </Button>

              <ResumeButton href={cvUrl} size="default" className="min-h-10 px-5 py-2.5" />

              {siteConfig.socialEmail ? (
                <Button variant="portfolio" className="min-h-10 px-5 py-2.5" asChild>
                  <a
                    href={`mailto:${siteConfig.socialEmail}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Say hello
                  </a>
                </Button>
              ) : null}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
