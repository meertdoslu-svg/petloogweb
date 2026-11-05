import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LazyCookieBanner } from "@/components/legal/LazyCookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

// Self-hosted Nunito (SIL OFL 1.1 — see ./fonts/nunito/OFL.txt). Static
// 400/600/700/800 instances subset to Google Fonts' latin + latin-ext
// unicode ranges (full Turkish coverage). Bundled in the repo so the build
// never depends on fetching Google Fonts.
const nunito = localFont({
  src: [
    { path: "./fonts/nunito/Nunito-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/nunito/Nunito-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/nunito/Nunito-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/nunito/Nunito-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-nunito",
  display: "swap",
});

const TITLE = `${SITE.name} | ${SITE.slogan}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE.url,
    siteName: SITE.name,
    title: TITLE,
    description: SITE.description,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "PetLoog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE.description,
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/brand/logo-128.png", type: "image/png" }],
    apple: [{ url: "/brand/logo-128.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F4EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${nunito.variable} antialiased`}>
        <a href="#icerik" className="skip-link">
          İçeriğe geç
        </a>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Header />
        <main id="icerik" className="min-h-[60vh]">
          {children}
        </main>
        <Footer />
        <LazyCookieBanner />
      </body>
    </html>
  );
}
