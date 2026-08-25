import { cn } from "@/lib/utils";

/**
 * Brand mark — a flat-top hexagon (hexagonal architecture) enclosing a shell
 * prompt `>_`. Geometry mirrors `scripts/generate-icons.mjs`, which renders the
 * same drawing to `src/app/icon.svg`, `favicon.ico` and `apple-icon.png`.
 *
 * Strokes use `currentColor`, so the mark inherits whatever text color it sits in.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
      aria-hidden
    >
      <path
        d="M29 16L22.5 27.26L9.5 27.26L3 16L9.5 4.74L22.5 4.74Z"
        strokeWidth={2.47}
        strokeOpacity={0.55}
      />
      <path d="M11.07 11.07L16 16L11.07 20.93" strokeWidth={3.03} />
      <path d="M17.91 21.94L21.94 21.94" strokeWidth={3.03} />
    </svg>
  );
}
