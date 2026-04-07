import { SiteHeader } from "@/features/portfolio-public/components/site-header";
import { HeroProfileSection } from "@/features/portfolio-public/components/hero-profile-section";
import { WorkSection } from "@/features/portfolio-public/components/work-section";
import { EducationSection } from "@/features/portfolio-public/components/education-section";
import { MainProjectsSection } from "@/features/portfolio-public/components/main-projects-section";
import { NoteworthySection } from "@/features/portfolio-public/components/noteworthy-section";
import { getCvUrl, getHomeData } from "@/features/portfolio-public/queries";
import { siteConfig } from "@/lib/site-config";
import { bcClass } from "@/features/portfolio-public/bc-theme";
import { cn } from "@/lib/utils";
import ProfileSection from "@/features/portfolio-public/components/profile-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cvUrl, data] = await Promise.all([getCvUrl(), getHomeData()]);

  return (
    <div className={cn(bcClass.page, "min-h-svh")}>
      <SiteHeader cvUrl={cvUrl} />
      <main>
        <HeroProfileSection cvUrl={cvUrl} workExperience={data.workExperience} />
       <ProfileSection/>
        <WorkSection items={data.workExperience} />
        <EducationSection items={data.education} />
        <MainProjectsSection featured={data.featuredMain} />
        <NoteworthySection items={data.noteworthy} />
      </main>
      <footer
        className={cn(
          bcClass.divider,
          "py-10 text-center font-mono text-xs tracking-wide text-[var(--bc-muted)]",
        )}
      >
        © {new Date().getFullYear()} {siteConfig.personName}
        <span className="text-[var(--bc-border)]"> · </span>
        <span className="text-[color-mix(in_oklch,var(--bc-accent)_80%,var(--bc-muted))]">Crafted with Next.js</span>
      </footer>
    </div>
  );
}
