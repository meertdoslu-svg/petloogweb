import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LazyCookieBanner } from "@/components/legal/LazyCookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "600", "700", "800"],
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
