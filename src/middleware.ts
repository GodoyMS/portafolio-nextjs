import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/** JWT must include role from Credentials sign-in (see `src/auth.ts` callbacks). */
function isAdminToken(token: unknown): boolean {
  if (!token || typeof token !== "object") return false;
  return (token as { role?: string }).role === "admin";
}

export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    console.error("AUTH_SECRET is missing; cannot validate sessions in middleware.");
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const pathname = request.nextUrl.pathname;
  const authed = Boolean(token) && isAdminToken(token);

  if (pathname === "/projects" || pathname.startsWith("/projects/")) {
    if (!authed) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    if (authed) {
      return NextResponse.redirect(new URL("/admin/work-experience", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!authed) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * `/admin/:path*` does NOT match `/admin` alone — include `/admin` explicitly.
 * Middleware uses `getToken` only (no `@/auth` import) so Prisma stays off the Edge bundle.
 */
export const config = {
  matcher: ["/admin", "/admin/:path*", "/projects", "/projects/:path*"],
};
