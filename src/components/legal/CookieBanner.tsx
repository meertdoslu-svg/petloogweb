"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "petloog-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Storage blocked — don't nag on every page.
    }
  }, []);

  const accept = (analytics: boolean) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          necessary: true,
          analytics,
          marketing: false,
          at: new Date().toISOString(),
        }),
      );
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Çerez tercihleri"
      className="fixed inset-x-3 bottom-3 z-[60] rounded-3xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] md:inset-x-auto md:right-5 md:bottom-5 md:max-w-md md:p-5"
    >
      <p className="text-sm leading-relaxed text-muted">
        Siteyi çalıştırmak için zorunlu çerezler kullanıyoruz. Analitik çerezler
        için onayını isteriz. Ayrıntılar{" "}
        <Link href="/cerez" className="font-extrabold text-primary underline">
          Çerez politikası
        </Link>
        &apos;nda.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => accept(false)}>
          Yalnızca zorunlu
        </Button>
        <Button onClick={() => accept(true)}>Kabul et</Button>
      </div>
    </div>
  );
}
