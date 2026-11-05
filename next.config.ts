import type { NextConfig } from "next";

// v1 refresh: every old-concept URL redirects permanently with an explicit
// 301 (Next's `permanent: true` would send 308).
const LEGACY_REDIRECTS: { source: string; destination: string }[] = [
  // Old product/module pages
  { source: "/sistemlerimiz", destination: "/" },
  { source: "/moduller", destination: "/" },
  { source: "/moduller/veteriner", destination: "/isletmeler?tur=veteriner" },
  { source: "/moduller/petshop", destination: "/isletmeler?tur=petshop" },
  { source: "/moduller/:slug*", destination: "/" }, // mobil, ai, pet-market, pet-taksi, mahalle-dostu, yuva, kasko, admin
  // Old registration forms → single pre-registration page
  { source: "/kayit", destination: "/isletmeler" },
  { source: "/kayit/veteriner", destination: "/isletmeler?tur=veteriner" },
  { source: "/kayit/petshop", destination: "/isletmeler?tur=petshop" },
  // Legal texts that only covered removed features
  { source: "/yasal/ai-politikasi", destination: "/yasal" },
  { source: "/yasal/pet-taksi", destination: "/yasal" },
  { source: "/yasal/topluluk-kurallari", destination: "/yasal" },
  { source: "/yasal/yuva-kurallari", destination: "/yasal" },
  // Old-concept blog posts (moved to draft)
  { source: "/blog/petloog-ekosistemi-nedir", destination: "/blog" },
  { source: "/blog/dijital-veteriner-hasta-takibi", destination: "/blog" },
  { source: "/blog/pet-market-stok-yonetimi", destination: "/blog" },
  // Removed old OG image
  { source: "/og-default.svg", destination: "/og-default.png" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Always render <title>/<meta> in the initial <head> (no streamed
  // metadata) so every crawler and link-preview bot sees descriptions on
  // dynamic pages like /isletmeler and /blog.
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, statusCode: 301 as const }));
  },
  async headers() {
    const immutable = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      { source: "/brand/:path*", headers: immutable },
      { source: "/images/:path*", headers: immutable },
      { source: "/favicon.svg", headers: immutable },
    ];
  },
};

export default nextConfig;
