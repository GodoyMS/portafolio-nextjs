"use client";
import React from "react";
import { BcSection, BcSectionHeader, BcSkillPill } from "./bc-ui";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { bcClass } from "../bc-theme";

const ProfileSection = () => {
  const reduce = useReducedMotion();
  const heroImage =
    process.env.NEXT_PUBLIC_HERO_IMAGE &&
    process.env.NEXT_PUBLIC_HERO_IMAGE.length > 0
      ? process.env.NEXT_PUBLIC_HERO_IMAGE
      : "/hero-portrait.svg";
  return (
    <BcSection>
      <BcSectionHeader
        eyebrow="01 — Profile"
        title="About"
        description="I'm a software engineer with a passion for building scalable and efficient systems."
      />
      <motion.div
        className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-md border border-[var(--bc-border-subtle)] shadow-[var(--bc-portrait-shadow)] lg:mx-0 lg:max-w-[280px]"
        initial={reduce ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover object-top"
          sizes="(min-width: 1024px) 280px, 320px"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--bc-page) 0%, transparent 45%)",
          }}
        />
      </motion.div>

      {/* Stacks */}
      {siteConfig.stackItems.length > 0 ? (
        <div>
          <p className={bcClass.eyebrow}>Tech I use</p>
          <h3 className={bcClass.sectionTitle}>Main stack</h3>
          <ul className="mt-5 flex flex-wrap gap-2">
            {siteConfig.stackItems.map((item) => (
              <li key={item}>
                <BcSkillPill className="px-3 py-1.5 text-xs">
                  {item}
                </BcSkillPill>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </BcSection>
  );
};

export default ProfileSection;
