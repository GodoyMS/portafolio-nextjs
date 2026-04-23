import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

/**
 * @see https://securitytxt.org/
 */
export function GET() {
  const email =
    process.env.SECURITY_CONTACT_EMAIL?.trim() || siteConfig.socialEmail?.trim() || "";
  const lines = [
    "# Security contact for this site",
    email ? `Contact: mailto:${email}` : "Contact: Set SECURITY_CONTACT_EMAIL or NEXT_PUBLIC_SOCIAL_EMAIL",
    "Preferred-Languages: en",
    "",
  ];
  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
