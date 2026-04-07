"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { bcClass } from "../bc-theme";
import { BcSection } from "./bc-ui";

/** Easing aligned with v4.brittanychiang.com reveal curves */
const BC_EASE = [0.645, 0.045, 0.355, 1] as const;

const proseClass =
  "text-[0.95rem] leading-relaxed text-muted-foreground sm:text-base";

const proseContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
} as const;

const proseItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: BC_EASE },
  },
} as const;

const skillsList = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.08 },
  },
} as const;

const skillsItem = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: BC_EASE },
  },
} as const;

const headingReveal = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: BC_EASE },
  },
} as const;

const picReveal = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: BC_EASE, delay: 0.12 },
  },
} as const;

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary underline decoration-primary/40 underline-offset-[0.2em] transition-colors hover:decoration-primary"
    >
      {children}
    </a>
  );
}

function aboutParagraphs(): { id: string; className?: string; content: ReactNode }[] {
  const { personName, heroIntro, aboutEmployerName, aboutEmployerUrl } = siteConfig;

  return [
    {
      id: "intro",
      content: (
        <>
          Hello! My name is <span className="font-medium text-foreground">{personName}</span> and I enjoy
          creating things that live on the internet. {heroIntro}
        </>
      ),
    },
    {
      id: "journey",
      content: (
        <>
          Fast-forward to today, and I&apos;ve had the privilege of shipping software with startups, product
          teams, and collaborators across different industries. My main focus these days is building
          accessible, human-centered products at{" "}
          <InlineLink href={aboutEmployerUrl}>{aboutEmployerName}</InlineLink> — blending solid engineering
          with thoughtful UX.
        </>
      ),
    },
    {
      id: "values",
      content: (
        <>
          I care about performance, clear information architecture, and interfaces that work for everyone,
          including people who rely on assistive tech or slower devices.
        </>
      ),
    },
    {
      id: "skills-intro",
      className: "!mt-6",
      content: <>Here are a few technologies I&apos;ve been working with recently:</>,
    },
  ];
}

function FramedPortrait({ heroImage }: { heroImage: string }) {
  const reduce = useReducedMotion();

  return (
    <div className="group relative mx-auto w-full max-w-[300px] lg:mx-0">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none hidden dark:block absolute left-4 top-4 z-0 h-full w-full rounded-md border-2 border-primary/90 transition-transform duration-500",
          !reduce && "group-hover:translate-x-1 group-hover:translate-y-1",
        )}
      />
      <div
        className={cn(
          "relative z-10 overflow-hidden rounded-md bg-muted/30 ring-1 ring-border transition-transform duration-500",
          !reduce && "group-hover:-translate-y-0.5",
        )}
      >
        <div className="relative isolate aspect-square">
          {reduce ? (
            <Image
              src={heroImage}
              alt={`${siteConfig.personName} — profile photo`}
              fill
              sizes="(min-width: 1024px) 450px, 85vw"
              className="object-cover object-top"
              priority
            />
          ) : (
            <>
              {/* multiply(source=photo, backdrop=primary): every channel blends — whites pick up primary too (unlike luminosity) */}
              <div className="absolute inset-0 z-0 dark:bg-primary" aria-hidden />
              <div
                className="absolute inset-0 z-1 opacity-100 transition-opacity duration-500 ease-out mix-blend-multiply group-hover:opacity-0"
              >
                <Image
                  src={heroImage}
                  alt={`${siteConfig.personName} — profile photo`}
                  fill
                  sizes="(min-width: 1024px) 450px, 85vw"
                  className="object-cover    object-top brightness-110 contrast-[1.03]"
                  priority
                />
              </div>
              <Image
                src={heroImage}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 450px, 85vw"
                className=" absolute inset-0 z-2 object-cover object-top transition-opacity duration-500 ease-out opacity-0 group-hover:opacity-100"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfileSection() {
  const reduce = useReducedMotion();
  const heroImage =
    process.env.NEXT_PUBLIC_HERO_IMAGE && process.env.NEXT_PUBLIC_HERO_IMAGE.length > 0
      ? process.env.NEXT_PUBLIC_HERO_IMAGE
      : "/hero-portrait.svg";

  const skills = siteConfig.stackItems;
  const paragraphs = aboutParagraphs();

  return (
    <BcSection id="about" className="relative">
      {reduce ? (
        <>
          <h2 className={bcClass.numberedHeading}>
            <span className={bcClass.numberedHeadingIndex}>01.</span>
            About Me
          </h2>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] lg:items-start lg:gap-16">
            <div className="min-w-0 space-y-4">
              {paragraphs.map(({ id, className, content }) => (
                <p key={id} className={cn(proseClass, className)}>
                  {content}
                </p>
              ))}
              {skills.length > 0 ? (
                <ul
                  className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-8"
                  aria-label="Tech stack"
                >
                  {skills.map((item) => (
                    <li
                      key={item}
                      className="relative pl-6 font-mono text-sm  before:absolute before:left-0 before:text-primary before:content-['▹']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <aside className="lg:justify-self-end">
              <FramedPortrait heroImage={heroImage} />
            </aside>
          </div>
        </>
      ) : (
        <>
          <motion.h2
            className={bcClass.numberedHeading}
            variants={headingReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-12% 0px" }}
          >
            <span className={bcClass.numberedHeadingIndex}>01.</span>
            About Me
          </motion.h2>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] lg:items-start lg:gap-16">
            <div className="min-w-0">
              <motion.div
                variants={proseContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-10% 0px" }}
              >
                {paragraphs.map(({ id, className, content }) => (
                  <motion.p key={id} variants={proseItem} className={cn(proseClass, className)}>
                    {content}
                  </motion.p>
                ))}

                {skills.length > 0 ? (
                  <motion.ul
                    variants={skillsList}
                    className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-8"
                    aria-label="Tech stack"
                  >
                    {skills.map((item) => (
                      <motion.li
                        key={item}
                        variants={skillsItem}
                        className="relative pl-6 font-mono text-sm text-muted-foreground before:absolute before:left-0 before:text-primary before:content-['▹']"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : null}
              </motion.div>
            </div>

            <motion.aside
              className="mx-auto w-full max-w-[300px] lg:mx-0 lg:max-w-none lg:justify-self-end"
              variants={picReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-10% 0px" }}
            >
              <FramedPortrait heroImage={heroImage} />
            </motion.aside>
          </div>
        </>
      )}
    </BcSection>
  );
}
