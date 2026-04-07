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
        headers: securityHeadersList(),
      },
    ];
  },
};

export default nextConfig;
