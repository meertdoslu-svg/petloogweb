import Image from "next/image";

// Deliberately hardcoded, not derived from any request/query parameter —
// this page must never become an open redirect. The app deep link and the
// site root are the only two destinations it can ever send a visitor to.
const APP_DEEP_LINK = "petloog://";
const WEB_FALLBACK_HREF = "https://petloog.com";

type AuthConfirmResultProps = {
  status: "success" | "error";
};

export function AuthConfirmResult({ status }: AuthConfirmResultProps) {
  const isSuccess = status === "success";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-[28px] bg-surface p-8 text-center shadow-[var(--shadow-card)] sm:p-10">
      <Image
        src="/brand/logo-256.png"
        alt="PetLoog"
        width={72}
        height={72}
        className="mb-5 shrink-0 object-contain"
        priority
      />

      {isSuccess ? (
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-2xl font-extrabold text-success"
          aria-hidden
        >
          ✓
        </div>
      ) : (
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E9DDCF] text-2xl font-extrabold text-secondary"
          aria-hidden
        >
          !
        </div>
      )}

      <h1 className="text-2xl font-extrabold text-primary">
        {isSuccess ? "E-posta adresiniz doğrulandı" : "Doğrulama bağlantısı geçersiz"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-primary/70">
        {isSuccess
          ? "Hesabınız başarıyla aktifleştirildi. PetLoog'a dönerek devam edebilirsiniz."
          : "Doğrulama bağlantısı geçersiz veya süresi dolmuş olabilir."}
      </p>

      <div className="mt-7 flex w-full flex-col gap-3">
        <a
          href={APP_DEEP_LINK}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-bold text-white shadow-[var(--shadow-btn)] transition hover:brightness-105 active:scale-[0.98]"
        >
          PetLoog&apos;u Aç
        </a>
        {isSuccess ? (
          <a
            href={WEB_FALLBACK_HREF}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/15 bg-white px-6 py-3 text-sm font-bold text-primary transition hover:bg-white/80"
          >
            Ana Sayfaya Git
          </a>
        ) : null}
      </div>
    </div>
  );
}
