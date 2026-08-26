"use client";

import dynamic from "next/dynamic";

const CookieBanner = dynamic(
  () =>
    import("@/components/legal/CookieBanner").then((m) => m.CookieBanner),
  { ssr: false },
);

export function LazyCookieBanner() {
  return <CookieBanner />;
}
