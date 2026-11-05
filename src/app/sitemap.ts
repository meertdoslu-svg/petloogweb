import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blogPosts";
import { SITE } from "@/lib/constants";
import { listLegalDocuments } from "@/lib/legal/registry";

export const revalidate = 3600;

// Legal docs that are served from a dedicated short route instead.
const SHORT_ROUTE_SLUGS = ["kvkk", "gizlilik", "cerez", "kullanim-kosullari", "destek"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  // Only canonical URLs. Aliases (/gizlilik, /destek, /help) canonicalize to
  // /privacy and /support; old-concept URLs 301 (see next.config.ts).
  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/sahne", priority: 0.9 },
    { path: "/isletmeler", priority: 0.8 },
    { path: "/hakkimizda", priority: 0.7 },
    { path: "/blog", priority: 0.6 },
    { path: "/iletisim", priority: 0.6 },
    { path: "/support", priority: 0.6 },
    { path: "/privacy", priority: 0.5 },
    { path: "/terms", priority: 0.5 },
    { path: "/kvkk", priority: 0.5 },
    { path: "/cerez", priority: 0.4 },
    { path: "/yasal", priority: 0.4 },
  ];

  const posts = await getPublishedPosts();

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...listLegalDocuments()
      .filter((doc) => !SHORT_ROUTE_SLUGS.includes(doc.slug))
      .map((doc) => ({
        url: `${base}/yasal/${doc.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      })),
  ];
}
