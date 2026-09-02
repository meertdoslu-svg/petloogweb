import type { BlogPost } from "@/types";
import { getSupabasePublicServerClient } from "@/lib/supabase/server";
import { BLOG_POSTS } from "@/lib/blog";

// Supabase-backed blog reads (public.blog_posts, published rows only —
// enforced by both this query and the table's RLS policy). Falls back to
// the hardcoded BLOG_POSTS (src/lib/blog.ts) whenever Supabase isn't
// configured, so local dev and any transient outage still show a working
// blog instead of an empty one.

type BlogPostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[] | null;
  reading_minutes: number | null;
  author_name: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
};

const COLUMNS =
  "slug, title, excerpt, content, category, tags, reading_minutes, author_name, cover_image_url, published_at, created_at";

function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function rowToPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content,
    category: row.category ?? "Genel",
    tags: row.tags ?? [],
    author: row.author_name ?? "PetLoog",
    publishedAt: (row.published_at ?? row.created_at).slice(0, 10),
    coverImage: row.cover_image_url ?? "",
    readingMinutes: row.reading_minutes ?? estimateReadingMinutes(row.content),
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return BLOG_POSTS;

  const { data, error } = await supabase
    .from("blog_posts")
    .select(COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return BLOG_POSTS;
  return (data as BlogPostRow[]).map(rowToPost);
}

export async function getPublishedPost(slug: string): Promise<BlogPost | undefined> {
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return BLOG_POSTS.find((p) => p.slug === slug);

  const { data, error } = await supabase
    .from("blog_posts")
    .select(COLUMNS)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) return BLOG_POSTS.find((p) => p.slug === slug);
  if (!data) return undefined;
  return rowToPost(data as BlogPostRow);
}

export async function getRelatedPublishedPosts(
  post: BlogPost,
  limit = 2,
): Promise<BlogPost[]> {
  const all = await getPublishedPosts();
  return all
    .filter(
      (p) =>
        p.slug !== post.slug &&
        (p.category === post.category || p.tags.some((t) => post.tags.includes(t))),
    )
    .slice(0, limit);
}
