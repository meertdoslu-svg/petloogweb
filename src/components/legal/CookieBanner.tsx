"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "petloog-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = (analytics: boolean) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        necessary: true,
        analytics,
        marketing: false,
        at: new Date().toISOString(),
      }),
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez tercihleri"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-primary/10 bg-[#F7F3EC]/95 p-4 shadow-[0_-12px_40px_-12px_rgba(74,42,23,0.25)] backdrop-blur-md md:p-5"
    >
      <div className="container-site flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-primary/75">
          Deneyiminizi geliştirmek için zorunlu çerezler kullanıyoruz. Analitik
          çerezler için onayınıza ihtiyaç duyarız. Detaylar için{" "}
          <Link href="/cerez" className="font-bold text-accent underline">
            Çerez Politikası
          </Link>
          &apos;nı inceleyin.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => accept(false)}>
            Yalnızca Zorunlu
          </Button>
          <Button size="sm" onClick={() => accept(true)}>
            Tümünü Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
}
