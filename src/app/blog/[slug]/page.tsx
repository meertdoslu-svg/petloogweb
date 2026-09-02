import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getPublishedPost,
  getPublishedPosts,
  getRelatedPublishedPosts,
} from "@/lib/blogPosts";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

// Posts are authored from PetLoog Admin, so this page can't be fully
// static — revalidate periodically rather than on every request. A slug
// not covered by generateStaticParams below still renders on demand
// (Next's default dynamicParams=true), so a newly published post is
// reachable immediately without a redeploy.
export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    // Only admin-uploaded raster covers make good og:image previews (most
    // platforms don't render SVG); the local SVG illustrations fall back
    // to the default OG image.
    image: post.coverImage.endsWith(".svg") ? undefined : post.coverImage || undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const related = await getRelatedPublishedPosts(post);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <article className="container-site py-10 md:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Anasayfa", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleLd,
        ]}
      />
      <Breadcrumb
        items={[
          { label: "Anasayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <header className="max-w-3xl">
        <p className="text-sm font-bold text-accent">{post.category}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-primary md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-primary/60">
          <span>{post.author}</span>
          <span>·</span>
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          <span>·</span>
          <span>{post.readingMinutes} dk okuma</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#EEE8DF] px-3 py-1 text-xs font-bold text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose-petloog mt-10 max-w-3xl whitespace-pre-line">
        {post.content}
      </div>

      <section className="mt-10 rounded-[24px] bg-surface p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-extrabold text-primary">Paylaş</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <ShareLink
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(absoluteUrl(`/blog/${post.slug}`))}`}
            label="X"
          />
          <ShareLink
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl(`/blog/${post.slug}`))}`}
            label="Facebook"
          />
          <ShareLink
            href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${absoluteUrl(`/blog/${post.slug}`)}`)}`}
            label="WhatsApp"
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-primary">İlgili Yazılar</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-soft)]"
            >
              <h3 className="font-extrabold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm text-primary/70">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

function ShareLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-[#EEE8DF] px-4 py-2 text-sm font-bold text-primary"
    >
      {label}
    </a>
  );
}
