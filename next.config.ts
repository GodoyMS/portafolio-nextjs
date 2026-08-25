import type { NextConfig } from "next";
import { securityHeadersList } from "./src/lib/security-headers";

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

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    qualities: [75, 85],
    minimumCacheTTL: 60 * 60 * 24 * 31,
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
  experimental: {
    serverActions: {
      // Server Actions only exchange upload metadata; bytes go directly to R2.
      bodySizeLimit: "2mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeadersList(),
      },
    ];
  },
};

export default nextConfig;
