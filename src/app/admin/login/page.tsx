import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/components/admin-login-form";
import { Spinner } from "@/components/ui/spinner";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.role) redirect("/admin");

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="border-border bg-card w-full max-w-sm space-y-6 rounded-xl border p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
          <p className="text-muted-foreground text-sm">Sign in to manage content.</p>
        </div>
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
