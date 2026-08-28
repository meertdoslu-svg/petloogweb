import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { SITE } from "@/lib/constants";

type BuildMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  /** Overrides the canonical URL without changing the page's own path (e.g. /gizlilik canonicalizing to /privacy). */
  canonicalPath?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/og-default.png",
  canonicalPath,
  noIndex = false,
}: BuildMetaInput): Metadata {
  const url = absoluteUrl(path);
  const canonicalUrl = absoluteUrl(canonicalPath ?? path);
  const fullTitle = title.includes(SITE.name)
    ? title
    : `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "tr_TR",
      type: "website",
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image)],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/brand/logo.png"),
    email: SITE.email,
    telephone: SITE.phone,
    sameAs: Object.values(SITE.social),
    description: SITE.slogan,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
