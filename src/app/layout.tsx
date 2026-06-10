import { Inter } from "next/font/google";
import type { Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/components/providers";
import { buildRootMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = buildRootMetadata();

/** Default to dark browser chrome; `next-themes` still toggles `.dark` for the UI. */
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a192f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <head>
        <Script id="portfolio-theme-init" strategy="beforeInteractive">
          {`(function(){try{var raw=localStorage.getItem("portfolio-theme");var t=raw?JSON.parse(raw):null;if(t==="light"){document.documentElement.classList.remove("dark");}else{document.documentElement.classList.add("dark");}}catch(e){document.documentElement.classList.add("dark");}})();`}
        </Script>
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-full font-sans antialiased",
          inter.variable,
        )}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
