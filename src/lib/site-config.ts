export const siteConfig = {
  personName: process.env.NEXT_PUBLIC_PERSON_NAME ?? "Your Name",
  personTitle: process.env.NEXT_PUBLIC_PERSON_TITLE ?? "Full Stack developer",
  /** Large slate headline under your name (v4-style tagline). */
  heroTagline:
    process.env.NEXT_PUBLIC_HERO_TAGLINE ?? "I build things for the web.",
  heroIntro:
    process.env.NEXT_PUBLIC_HERO_INTRO ??
    "Hello! I build fast, accessible web products with a focus on UX and performance.",
  locationLabel: process.env.NEXT_PUBLIC_LOCATION_LABEL ?? "Peru",
  stackItems: (process.env.NEXT_PUBLIC_STACK_ITEMS ?? "React,Next.js,TypeScript,Node.js")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  /** Current focus (About section second paragraph), e.g. company name + careers URL */
  aboutEmployerName:
    process.env.NEXT_PUBLIC_ABOUT_EMPLOYER_NAME ?? "Openloop Health",
  aboutEmployerUrl:
    process.env.NEXT_PUBLIC_ABOUT_EMPLOYER_URL ?? "https://openloophealth.com",
  socialGithub: process.env.NEXT_PUBLIC_SOCIAL_GITHUB,
  socialLinkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
  socialEmail: process.env.NEXT_PUBLIC_SOCIAL_EMAIL,
} as const;
