import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

/** Canonical origin without trailing slash, e.g. https://example.com */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/$/, "");
    return host.startsWith("http") ? host : `https://${host}`;
  }
  return "";
}

export function getMetadataBase(): URL | undefined {
  const base = getSiteUrl();
  if (!base) return undefined;
  try {
    return new URL(`${base}/`);
  } catch {
    return undefined;
  }
}

/** Long-form description tuned for senior engineer portfolio SERP snippets */
export function buildSeoDescription(): string {
  const { personName, personTitle, heroTagline, heroIntro, locationLabel, stackItems } = siteConfig;
  const stack = stackItems.slice(0, 12).join(", ");
  return [
    `${personName} — ${personTitle} and senior software engineer in ${locationLabel}.`,
    heroTagline,
    heroIntro,
    `Technical focus: ${stack}.`,
    "Professional portfolio: work history, education, featured engineering projects, and noteworthy builds — full-stack web development, scalable systems, accessibility, and product-minded delivery.",
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSeoKeywords(): string[] {
  const extra = [
    "software engineer",
    "senior software engineer",
    "staff software engineer",
    "principal engineer",
    "full stack engineer",
    "full-stack developer",
    "web development",
    "TypeScript",
    "React developer",
    "Next.js",
    "Node.js",
    "portfolio",
    "software architecture",
    "cloud",
    "API design",
    siteConfig.personName,
    siteConfig.personTitle,
    siteConfig.locationLabel,
    ...siteConfig.stackItems,
  ];
  return [...new Set(extra.map((s) => s.trim()).filter(Boolean))];
}

export function buildDefaultTitle(): string {
  return `${siteConfig.personName} | ${siteConfig.personTitle} · Software engineer portfolio`;
}

export function buildRootMetadata(): Metadata {
  const base = getMetadataBase();
  const origin = getSiteUrl();
  const title = buildDefaultTitle();
  const description = buildSeoDescription();

  const metadata: Metadata = {
    title: {
      default: title,
      template: `%s · ${siteConfig.personName}`,
    },
    description,
    keywords: buildSeoKeywords(),
    applicationName: `${siteConfig.personName} — Portfolio`,
    authors: origin ? [{ name: siteConfig.personName, url: `${origin}/` }] : [{ name: siteConfig.personName }],
    creator: siteConfig.personName,
    publisher: siteConfig.personName,
    category: "technology",
    classification: "Portfolio",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: `${siteConfig.personName} — Portfolio`,
      title,
      description,
      ...(origin ? { url: `${origin}/` } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(process.env.NEXT_PUBLIC_TWITTER_HANDLE
        ? { creator: `@${process.env.NEXT_PUBLIC_TWITTER_HANDLE.replace(/^@/, "")}` }
        : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
  };

  if (base) {
    metadata.metadataBase = base;
  }

  return metadata;
}
