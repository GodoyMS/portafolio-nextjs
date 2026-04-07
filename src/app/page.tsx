import type { Metadata } from "next";
import { SiteFooter } from "@/features/portfolio-public/components/site-footer";
import { SiteHeader } from "@/features/portfolio-public/components/site-header";
import { HeroProfileSection } from "@/features/portfolio-public/components/hero-profile-section";
import { WorkSection } from "@/features/portfolio-public/components/work-section";
import { EducationSection } from "@/features/portfolio-public/components/education-section";
import { MainProjectsSection } from "@/features/portfolio-public/components/main-projects-section";
import { NoteworthySection } from "@/features/portfolio-public/components/noteworthy-section";
import { getCvUrl, getHomeData } from "@/features/portfolio-public/queries";
import { bcClass } from "@/features/portfolio-public/bc-theme";
import { cn } from "@/lib/utils";
import ProfileSection from "@/features/portfolio-public/components/profile-section";
import { PortfolioJsonLd } from "@/components/seo/portfolio-json-ld";
import { buildDefaultTitle, buildSeoDescription, getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const origin = getSiteUrl();
  const title = buildDefaultTitle();
  const description = buildSeoDescription();
  return {
    title,
    description,
    alternates: origin ? { canonical: `${origin}/` } : undefined,
    openGraph: {
      title,
      description,
      url: origin ? `${origin}/` : undefined,
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function HomePage() {
  const [cvUrl, data] = await Promise.all([getCvUrl(), getHomeData()]);

  return (
    <div className={cn(bcClass.page, "min-h-svh")}>
      <PortfolioJsonLd />
      <SiteHeader cvUrl={cvUrl} />
      <main>
        <HeroProfileSection cvUrl={cvUrl} />
       <ProfileSection/>
        <WorkSection items={data.workExperience} />
        <EducationSection items={data.education} />
        <MainProjectsSection featured={data.featuredMain} />
        <NoteworthySection items={data.noteworthy} />
      </main>
      <SiteFooter />
    </div>
  );
}
