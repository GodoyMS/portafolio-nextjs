import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/components/providers";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: siteConfig.personName,
    template: `%s · ${siteConfig.personName}`,
  },
  description: siteConfig.heroIntro,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", inter.variable)} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-full font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
