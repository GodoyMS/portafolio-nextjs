/**
 * Public portfolio layout helpers — all colors come from core tokens
 * (`--background`, `--foreground`, `--primary`, `--muted-foreground`, etc. in `globals.css`).
 */

export const bcClass = {
  page: "bg-background text-muted-foreground antialiased",
  heading: "text-foreground",
  eyebrow: "font-mono text-xs tracking-[0.2em] text-primary uppercase",
  sectionTitle: "mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl",
  /** v4-style “01. About Me” heading */
  numberedHeading:
    "mb-10 flex flex-wrap items-baseline gap-x-3 sm:mb-14 text-[clamp(1.35rem,2.8vw,1.65rem)] font-semibold tracking-tight text-foreground",
  numberedHeadingIndex: "font-mono text-base text-primary tabular-nums sm:text-lg",
  lead: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
  card: "rounded-lg  duration-300 ",
  cardFlat: "rounded-lg border border-border bg-card/60",
  link: "font-mono text-xs text-primary underline-offset-4 transition-colors hover:opacity-85",
  linkInline:
    "text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary",
  pill: "inline-flex rounded border border-border bg-muted/80 px-2.5 py-1 font-mono text-[10px] tracking-wide text-muted-foreground",
  date: "font-mono text-xs tracking-wide text-muted-foreground uppercase",
  headerBar:
    "border-b border-border/60 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80",
  divider: "border-t border-border/60",
  container: "mx-auto max-w-[1000px] px-6 lg:px-12",
  navLink:
    "text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none",
  brandLink:
    "text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary",
  richText:
    "text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-foreground",
} as const;
