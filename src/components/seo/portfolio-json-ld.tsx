import { siteConfig } from "@/lib/site-config";
import { buildSeoDescription, getSiteUrl } from "@/lib/seo";

/**
 * Person + WebSite structured data for public homepage (Google rich results).
 */
export function PortfolioJsonLd() {
  const origin = getSiteUrl();
  const description = buildSeoDescription();
  const sameAs = [siteConfig.socialGithub, siteConfig.socialLinkedin].filter(
    (u): u is string => Boolean(u && u.length > 0),
  );

  const person: Record<string, unknown> = {
    "@type": "Person",
    name: siteConfig.personName,
    jobTitle: siteConfig.personTitle,
    description: siteConfig.heroIntro,
    knowsAbout: siteConfig.stackItems,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.aboutEmployerName,
      url: siteConfig.aboutEmployerUrl,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.locationLabel,
    },
  };

  if (origin) {
    person["@id"] = `${origin}/#person`;
    person.url = `${origin}/`;
    if (sameAs.length) person.sameAs = sameAs;
    if (siteConfig.socialEmail) person.email = `mailto:${siteConfig.socialEmail}`;
  } else if (sameAs.length) {
    person.sameAs = sameAs;
  }

  const graph: Record<string, unknown>[] = [person];

  if (origin) {
    graph.unshift({
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: `${siteConfig.personName} — Portfolio`,
      description,
      publisher: { "@id": `${origin}/#person` },
      inLanguage: "en-US",
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      async
      // eslint-disable-next-line react/no-danger -- JSON-LD requires raw script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
