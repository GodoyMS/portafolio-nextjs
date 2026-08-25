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
        "relative aspect-video overflow-hidden rounded-t-lg border-b border-border bg-card/50",
        className,
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={reduce ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 480px, (min-width: 640px) calc(100vw - 6rem), calc(100vw - 3rem)"
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-background text-xs font-medium text-muted-foreground">
          {title}
        </div>
      )}
      {showVideo ? (
        <video
          ref={ref}
          src={video!}
          className="absolute inset-0 size-full object-cover"
          muted
          playsInline
          loop
          preload="none"
          aria-label={`${title} demo`}
        />
      ) : null}
    </motion.div>
  );
}
