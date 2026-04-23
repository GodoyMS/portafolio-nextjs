import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/** JWT must include role from Credentials sign-in (see `src/auth.ts` callbacks). */
function isAdminToken(token: unknown): boolean {
  if (!token || typeof token !== "object") return false;
  return (token as { role?: string }).role === "admin";
}

function isProtectedPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/projects";
}

function withSecurityHeaders(res: NextResponse, pathname: string): NextResponse {
  if (pathname === "/admin/login" || pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const secret = process.env.AUTH_SECRET;

  if (process.env.NODE_ENV === "production" && !secret && isProtectedPath(pathname)) {
    return new NextResponse(
      "Authentication is not configured (AUTH_SECRET is required in production).",
      {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }

  if (!secret) {
    console.error("AUTH_SECRET is missing; cannot validate sessions in middleware.");
    return withSecurityHeaders(NextResponse.next(), pathname);
  }

  const token = await getToken({
    req: request,
    secret,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const authed = Boolean(token) && isAdminToken(token);

  if (pathname === "/projects") {
    if (!authed) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return withSecurityHeaders(NextResponse.redirect(login), pathname);
    }
    return withSecurityHeaders(NextResponse.next(), pathname);
  }

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    if (authed) {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/admin/work-experience", request.url)),
        pathname,
      );
    }
    return withSecurityHeaders(NextResponse.next(), pathname);
  }

  if (pathname.startsWith("/admin")) {
    if (!authed) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return withSecurityHeaders(NextResponse.redirect(login), pathname);
    }
    return withSecurityHeaders(NextResponse.next(), pathname);
  }

  return withSecurityHeaders(NextResponse.next(), pathname);
}

/**
 * `/admin/:path*` does NOT match `/admin` alone — include `/admin` explicitly.
 * Middleware uses `getToken` only (no `@/auth` import) so Prisma stays off the Edge bundle.
 */
export const config = {
  matcher: ["/admin", "/admin/:path*", "/projects"],
};
