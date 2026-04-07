/**
 * Public portfolio styling uses CSS variables `--bc-*` from `globals.css`
 * (light in `:root`, dark in `.dark`). Toggle via `next-themes`.
 */

export const bcClass = {
  page: "bg-[var(--bc-page)] text-[var(--bc-muted)] antialiased",
  heading: "text-[var(--bc-heading)]",
  eyebrow: "font-mono text-xs tracking-[0.2em] text-[var(--bc-accent)] uppercase",
  sectionTitle: "mt-2 text-xl font-semibold tracking-tight text-[var(--bc-heading)] sm:text-2xl",
  lead: "mt-3 max-w-xl text-sm leading-relaxed text-[var(--bc-muted)]",
  card: "rounded-lg border border-[var(--bc-border)] bg-[color-mix(in_oklch,var(--bc-card)_90%,transparent)] transition-[border-color,box-shadow] duration-300 hover:border-[color-mix(in_oklch,var(--bc-accent)_25%,var(--bc-border))] hover:shadow-[0_0_0_1px_var(--bc-card-hover-ring)]",
  cardFlat:
    "rounded-lg border border-[var(--bc-border)] bg-[color-mix(in_oklch,var(--bc-card)_60%,transparent)]",
  link: "font-mono text-xs text-[var(--bc-accent)] underline-offset-4 transition-colors hover:opacity-85",
  linkInline:
    "text-[var(--bc-heading)] underline decoration-[var(--bc-border)] underline-offset-4 transition-colors hover:text-[var(--bc-accent)] hover:decoration-[var(--bc-accent)]",
  pill: "inline-flex rounded border border-[var(--bc-border)] bg-[var(--bc-pill-bg)] px-2.5 py-1 font-mono text-[10px] tracking-wide text-[var(--bc-muted)]",
  date: "font-mono text-xs tracking-wide text-[var(--bc-muted)] uppercase",
  headerBar:
    "border-b border-[var(--bc-border-subtle)] bg-[var(--bc-header-bg)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_oklch,var(--bc-page)_80%,transparent)]",
  divider: "border-t border-[var(--bc-border-subtle)]",
  container: "mx-auto max-w-[1000px] px-6 lg:px-12",
  navLink:
    "text-sm text-[var(--bc-muted)] transition-colors hover:text-[var(--bc-accent)] focus-visible:text-[var(--bc-accent)] focus-visible:outline-none",
  brandLink:
    "text-sm font-semibold tracking-tight text-[var(--bc-heading)] transition-colors hover:text-[var(--bc-accent)]",
  outlineButton:
    "inline-flex items-center gap-2 rounded border border-[var(--bc-accent-border)] bg-transparent px-5 py-2.5 font-mono text-xs tracking-wide text-[var(--bc-accent)] uppercase transition-colors hover:bg-[var(--bc-accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--bc-accent-focus)] focus-visible:outline-none",
  resumeOutline:
    "border-[var(--bc-accent-border)] !bg-transparent font-mono text-[var(--bc-accent)] uppercase hover:bg-[var(--bc-accent-soft)] hover:text-[var(--bc-accent)]",
  richText:
    "text-[var(--bc-muted)] [&_a]:text-[var(--bc-accent)] [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-[var(--bc-heading)]",
} as const;
