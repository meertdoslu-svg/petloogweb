import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { BackgroundDecor } from "@/components/layout/BackgroundDecor";
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
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.slogan}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "PetLoog; mobil uygulama, veteriner, pet market, AI, kasko ve mahalle dostu ile evcil dostunuz için tek platform.",
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "PetLoog",
    "pet uygulaması",
    "veteriner sistemi",
    "pet market",
    "pet kasko",
    "mahalle dostu",
  ],
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.slogan}`,
    description:
      "Evcil dostunuz için tek platform. PetLoog kurumsal ekosistemi.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "PetLoog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.slogan}`,
    description: SITE.slogan,
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
  themeColor: "#F7F3EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${nunito.variable} antialiased`}>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <BackgroundDecor />
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <LazyCookieBanner />
      </body>
    </html>
  );
}
