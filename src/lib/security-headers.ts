/**
 * Security header values for `next.config` (evaluated at build time).
 */

function r2Hostname(): string | undefined {
  const raw = process.env.R2_PUBLIC_BASE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

const isProd = process.env.NODE_ENV === "production";

export function buildContentSecurityPolicy(): string {
  const imgParts = ["'self'", "data:", "blob:", "https:"];
  const r2 = r2Hostname();
  if (r2) imgParts.push(`https://${r2}`);

  const scriptParts = ["'self'", "'unsafe-inline'"];
  if (!isProd) scriptParts.push("'unsafe-eval'");

  const pieces = [
    "default-src 'self'",
    `script-src ${scriptParts.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgParts.join(" ")}`,
    "font-src 'self'",
    "connect-src 'self' https:",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ];

  if (isProd) pieces.push("upgrade-insecure-requests");

  return pieces.join("; ");
}

export function securityHeadersList(): { key: string; value: string }[] {
  const base: { key: string; value: string }[] = [
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
    { key: "Cross-Origin-Resource-Policy", value: "same-site" },
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy() },
  ];

  if (isProd && process.env.DISABLE_HSTS !== "true") {
    const hsts = ["max-age=31536000", "includeSubDomains"];
    if (process.env.HSTS_PRELOAD === "true") hsts.push("preload");
    base.push({ key: "Strict-Transport-Security", value: hsts.join("; ") });
  }

  return base;
}
