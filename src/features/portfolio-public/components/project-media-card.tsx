"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProjectMediaCard({
  image,
  video,
  title,
  className,
}: {
  image: string | null;
  video: string | null;
  title: string;
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !video) return;
    if (hover) {
      void el.play().catch(() => {
        /* autoplay policies */
      });
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [hover, video]);

  const showVideo = Boolean(video && hover);

  return (
    <motion.div
      className={cn(
        "relative aspect-video overflow-hidden rounded-t-lg border-b border-[var(--bc-border)] bg-[color-mix(in_oklch,var(--bc-card)_50%,transparent)]",
        className,
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={reduce ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {showVideo ? (
        <video ref={ref} src={video!} className="size-full object-cover" muted playsInline loop preload="none" />
      ) : image ? (
        <Image src={image} alt={title} fill className="object-cover" sizes="(min-width: 1024px) 480px, 100vw" />
      ) : (
        <div className="flex size-full items-center justify-center bg-[var(--bc-page)] text-xs font-medium text-[var(--bc-muted)]">
          {title}
        </div>
      )}
    </motion.div>
  );
}
