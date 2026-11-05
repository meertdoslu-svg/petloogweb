import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/constants";

// Mirrors the real in-app flow (petloog app: Profil → Hesap → "Hesabımı Sil"
// → app/account-deletion.tsx). Update together with the app.
const STEPS = [
  "PetLoog uygulamasını aç ve Profil sekmesine gir.",
  "Hesap bölümünde \"Hesabımı Sil\"e dokun.",
  "Hesabın silinince ne olacağını oku ve \"Yukarıdaki sonuçları okudum ve hesabımı silmek istiyorum.\" kutusunu işaretle.",
  "\"Hesabımı Kalıcı Olarak Sil\" düğmesine dokun.",
  "Açılan onay penceresinde yeniden \"Hesabımı Sil\"i seç. Hesabın silinir ve oturumun kapanır.",
];

export function AccountDeletionSteps() {
  return (
    <section
      aria-labelledby="hesap-silme-adimlar"
      className="rounded-3xl border border-line bg-surface p-5 md:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-danger/12 text-danger">
          <Icon name="trash" size={22} />
        </span>
        <h2 id="hesap-silme-adimlar" className="text-xl font-extrabold text-primary">
          Uygulamadan hesabını sil: Profil → Hesabımı Sil
        </h2>
      </div>
      <ol className="mt-5 space-y-3">
        {STEPS.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-extrabold text-surface">
              {i + 1}
            </span>
            <p className="pt-1 leading-relaxed text-primary">{step}</p>
          </li>
        ))}
      </ol>
      <div className="mt-5 space-y-2 rounded-2xl bg-bg p-4 leading-relaxed text-muted">
        <p>Bu işlem geri alınamaz.</p>
        <p>
          Mağaza üzerinden aldığın bir abonelik varsa, hesap silme onu otomatik
          iptal etmez; mağaza ayarlarından ayrıca iptal etmelisin.
        </p>
        <p>
          Uygulamaya giremiyorsan talebini{" "}
          <a href={`mailto:${SITE.legalEmail}`} className="font-extrabold text-primary underline">
            {SITE.legalEmail}
          </a>{" "}
          adresine, hesabına bağlı e-posta adresinden gönderebilirsin.
        </p>
      </div>
    </section>
  );
}
