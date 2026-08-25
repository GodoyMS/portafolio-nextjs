import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.personName} — software engineer portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Brand mark, inlined so the OG route stays self-contained (see `LogoMark`). */
function Mark() {
  return (
    <svg width={72} height={72} viewBox="0 0 32 32" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M29 16L22.5 27.26L9.5 27.26L3 16L9.5 4.74L22.5 4.74Z"
        stroke="#3c988d"
        strokeWidth={2.47}
      />
      <path d="M11.07 11.07L16 16L11.07 20.93" stroke="#64ffda" strokeWidth={3.03} />
      <path d="M17.91 21.94L21.94 21.94" stroke="#64ffda" strokeWidth={3.03} />
    </svg>
  );
}

export default function OpenGraphImage() {
  const { personName, personTitle, heroTagline } = siteConfig;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0a192f 0%, #112240 55%, #0a192f 100%)",
          padding: 72,
          fontFamily:
            'ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div style={{ display: "flex", marginBottom: 28 }}>
          <Mark />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ccd6f6",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            maxWidth: 1000,
          }}
        >
          {personName}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            fontWeight: 600,
            color: "#64ffda",
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
          }}
        >
          {personTitle}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 26,
            color: "#8892b0",
            maxWidth: 920,
            lineHeight: 1.45,
          }}
        >
          {heroTagline}
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 48,
            fontSize: 18,
            color: "#233554",
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}
        >
          Senior software engineer · Portfolio
        </div>
      </div>
    ),
    { ...size },
  );
}
