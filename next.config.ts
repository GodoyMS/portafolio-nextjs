import type { NextConfig } from "next";

function r2Hostname(): string | undefined {
  const raw = process.env.R2_PUBLIC_BASE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

const host = r2Hostname();

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: host
      ? [
          {
            protocol: "https",
            hostname: host,
            pathname: "/**",
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
