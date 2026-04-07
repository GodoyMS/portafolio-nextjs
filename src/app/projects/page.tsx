import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAllProjects } from "@/features/portfolio-public/queries";
import { FadeIn } from "@/features/portfolio-public/components/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectType } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All projects (admin)",
};

export default async function AllProjectsPage() {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "admin") {
    redirect("/admin/login?callbackUrl=/projects");
  }

  const projects = await getAllProjects();

  return (
    <div className="bg-background min-h-svh">
      <div className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/projects">← Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Public site</Link>
            </Button>
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <FadeIn>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All projects</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Staff-only list (same data as the public homepage sections, plus hidden main projects). The public site only exposes <code className="text-foreground">/</code>.
          </p>
        </FadeIn>
        <div className="mt-10 space-y-6">
          {projects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects yet.</p>
          ) : (
            projects.map((p, i) => (
              <FadeIn key={p.id} delay={i * 0.03}>
                <article className="border-border/80 bg-card/10 rounded-xl border p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{p.title}</h2>
                    <Badge variant={p.type === ProjectType.MAIN ? "default" : "secondary"}>{p.type}</Badge>
                    {p.isFeatured ? <Badge variant="outline">Featured</Badge> : null}
                    <span className="text-muted-foreground text-xs font-mono">{p.year}</span>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.skills.map((s) => (
                      <span
                        key={s.id}
                        className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    {p.productionUrl ? (
                      <a
                        href={p.productionUrl}
                        className="text-primary underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Production
                      </a>
                    ) : null}
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        className="text-primary underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    ) : null}
                    {p.playstoreUrl ? (
                      <a
                        href={p.playstoreUrl}
                        className="text-primary underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Play Store
                      </a>
                    ) : null}
                    {p.links.map((l) => (
                      <a
                        key={l.id}
                        href={l.href}
                        className="text-primary underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.title}
                      </a>
                    ))}
                  </div>
                </article>
              </FadeIn>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
