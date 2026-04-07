import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LayoutDashboard, GraduationCap, FolderKanban, FileText, LogOut } from "lucide-react";
import { adminSignOut } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/work-experience", label: "Work Experience", icon: LayoutDashboard },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/projects", label: "Projects (CRUD)", icon: FolderKanban },
  { href: "/projects", label: "All projects (view)", icon: FolderKanban },
  { href: "/admin/cv", label: "CV Upload", icon: FileText },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="bg-background flex min-h-svh">
      <aside className="border-border bg-card/30 flex w-60 flex-col border-r">
        <div className="p-4">
          <Link href="/admin" className="text-foreground font-semibold tracking-tight">
            Portfolio Admin
          </Link>
          <p className="text-muted-foreground mt-1 text-xs">Content management</p>
        </div>
        <Separator />
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-border mt-auto border-t p-2">
          <form action={adminSignOut}>
            <Button type="submit" variant="ghost" className="text-muted-foreground w-full justify-start gap-2">
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
        <div className="p-2">
          <Button variant="outline" className="w-full" size="sm" asChild>
            <Link href="/">View public site</Link>
          </Button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
