import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedPosts } from "@/lib/blogPosts";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ q?: string; kategori?: string }> };

// Posts are authored from PetLoog Admin, so this page can't be fully
// static — revalidate periodically rather than on every request.
export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "PetLoog blog: ekosistem, veteriner, market ve pet yaşamı yazıları.",
  path: "/blog",
});

export default async function BlogPage({ searchParams }: Props) {
  const { q = "", kategori = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const allPosts = await getPublishedPosts();

  const posts = allPosts.filter((post) => {
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some((t) => t.toLowerCase().includes(query));
    const matchesCategory =
      !kategori || post.category.toLowerCase() === kategori.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <Breadcrumb items={[{ label: "Anasayfa", href: "/" }, { label: "Blog" }]} />
      <h1 className="text-3xl font-extrabold text-primary md:text-5xl">Blog</h1>
      <p className="mt-3 max-w-2xl text-primary/70">
        SEO uyumlu içerikler: kategori, etiket, arama ve ilgili yazılar.
      </p>

      <form className="mt-8 flex flex-col gap-3 sm:flex-row" action="/blog">
        <input
          name="q"
          defaultValue={q}
          placeholder="Yazılarda ara..."
          className="w-full rounded-full border border-primary/10 bg-white px-5 py-3 text-sm shadow-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white"
        >
          Ara
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
            !kategori ? "bg-accent text-white" : "bg-[#EEE8DF] text-primary"
          }`}
        >
          Tümü
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?kategori=${encodeURIComponent(cat)}`}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              kategori === cat
                ? "bg-accent text-white"
                : "bg-[#EEE8DF] text-primary"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="overflow-hidden rounded-[24px] bg-surface shadow-[var(--shadow-soft)]"
          >
            {post.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImage}
                alt={post.title}
                className="aspect-[16/10] w-full object-cover"
              />
            ) : (
              <div className="aspect-[16/10] bg-gradient-to-br from-[#efe6d8] to-[#d9e4c8]" />
            )}
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-accent">
                {post.category}
              </p>
              <h2 className="mt-2 text-lg font-extrabold text-primary">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-primary/70">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-primary/55">
                <span>{post.author}</span>
                <span>{post.readingMinutes} dk</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!posts.length ? (
        <p className="mt-8 text-sm text-primary/60">Sonuç bulunamadı.</p>
      ) : null}
    </div>
  );
}
