import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { MODULES, SITE } from "@/lib/constants";
import { listLegalDocuments } from "@/lib/legal/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const staticRoutes = [
    "",
    "/hakkimizda",
    "/sistemlerimiz",
    "/blog",
    "/iletisim",
    "/kayit/veteriner",
    "/kayit/petshop",
    "/kvkk",
    // "/gizlilik" is intentionally omitted: it serves the same document as
    // "/privacy" and canonicalizes to it (see src/app/gizlilik/page.tsx),
    // so only the canonical URL is listed here to avoid duplicate indexing.
    // The page itself stays live and linked from the footer/Yasal Merkez.
    "/cerez",
    "/yasal",
    "/privacy",
    "/terms",
    "/support",
    "/help",
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...MODULES.map((m) => ({
      url: `${base}/moduller/${m.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...BLOG_POSTS.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...listLegalDocuments()
      .filter((doc) => !["kvkk", "gizlilik", "cerez"].includes(doc.slug))
      .map((doc) => ({
        url: `${base}/yasal/${doc.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
  ];
}
