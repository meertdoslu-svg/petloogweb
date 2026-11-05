import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { Card, PageHeader } from "@/components/ui/Section";
import { getPublishedPosts } from "@/lib/blogPosts";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ kategori?: string }> };

// Posts are authored from PetLoog Admin — revalidate periodically.
export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Patinle mahallede yaşam: beslenme, veteriner ziyaretleri, pati dostu mekanlar ve Sahne'den hikâyeler.",
  path: "/blog",
});

export default async function BlogPage({ searchParams }: Props) {
  const { kategori = "" } = await searchParams;
  const allPosts = await getPublishedPosts();
  const posts = kategori
    ? allPosts.filter((p) => p.category.toLowerCase() === kategori.toLowerCase())
    : allPosts;
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana sayfa", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <Breadcrumb items={[{ label: "Ana sayfa", href: "/" }, { label: "Blog" }]} />
      <PageHeader
        eyebrow="Blog"
        title="Patinle mahallede yaşam"
        lead="Beslenme, veteriner ziyaretleri, pati dostu mekanlar ve Sahne'den hikâyeler."
      />

      {categories.length > 1 ? (
        <nav aria-label="Kategoriler" className="mt-8 flex flex-wrap gap-2">
          {[{ label: "Tümü", value: "" }, ...categories.map((c) => ({ label: c, value: c }))].map(
            (c) => (
              <Link
                key={c.label}
                href={c.value ? `/blog?kategori=${encodeURIComponent(c.value)}` : "/blog"}
                aria-current={kategori === c.value ? "page" : undefined}
                className={
                  kategori === c.value
                    ? "inline-flex min-h-11 items-center rounded-full bg-secondary px-4 font-bold text-surface"
                    : "inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 font-bold text-primary"
                }
              >
                {c.label}
              </Link>
            ),
          )}
        </nav>
      ) : null}

      {posts.length ? (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="h-full overflow-hidden rounded-3xl border border-line bg-surface">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt=""
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[16/10] bg-line/60" aria-hidden />
                )}
                <div className="p-5">
                  <p className="text-sm font-extrabold text-secondary">{post.category}</p>
                  <h2 className="mt-1.5 text-lg font-extrabold text-primary">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 text-muted">{post.excerpt}</p>
                  <p className="mt-4 text-sm text-muted">{post.readingMinutes} dk okuma</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="mt-10 flex flex-col items-start gap-3 md:p-8">
          <Icon name="paw" size={32} className="text-amber" />
          <h2 className="text-xl font-extrabold text-primary">Yeni yazılar yolda</h2>
          <p className="max-w-xl text-muted">
            İlk yazılarımızı hazırlıyoruz. O zamana kadar Sahne&apos;ye göz
            atabilirsin.
          </p>
          <Link href="/sahne" className="font-extrabold text-primary underline">
            Sahne nasıl çalışır?
          </Link>
        </Card>
      )}
    </div>
  );
}
