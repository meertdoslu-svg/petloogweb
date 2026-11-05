"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CityDistrictSelect } from "@/components/forms/shared/CityDistrictSelect";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { parseApiResponse } from "@/lib/http";
import { cn } from "@/lib/utils";
import {
  DELIVERY_OPTIONS,
  EMERGENCY_OPTIONS,
  preRegistrationSchema,
} from "@/lib/validations/forms";

type Tur = "petshop" | "veteriner";
type Errors = Partial<Record<string, string>>;

const EMPTY = {
  isletmeAdi: "",
  yetkili: "",
  telefon: "",
  email: "",
  il: "",
  ilce: "",
  adres: "",
  calismaSaatleri: "",
  teslimatMesafesi: "",
  kapidaOdeme: "",
  acilNobet: "",
  listelenmeIzni: false,
  kvkkOnay: false,
  iletisimIzni: false,
  website: "",
};

type Values = typeof EMPTY;

export const inputClass =
  "w-full min-h-12 rounded-2xl border border-line bg-surface px-4 py-3 text-base text-primary placeholder:text-muted/60 aria-[invalid=true]:border-danger";

export function PreRegistrationForm({ initialTur }: { initialTur: Tur }) {
  const [tur, setTur] = useState<Tur>(initialTur);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef<number>(0);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success" || status === "error") statusRef.current?.focus();
  }, [status]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const buildPayload = () => {
    const common = {
      tur,
      isletmeAdi: values.isletmeAdi,
      yetkili: values.yetkili,
      telefon: values.telefon,
      email: values.email,
      il: values.il,
      ilce: values.ilce,
      adres: values.adres,
      calismaSaatleri: values.calismaSaatleri,
      kvkkOnay: values.kvkkOnay,
      iletisimIzni: values.iletisimIzni,
      website: values.website,
      startedAt: startedAt.current,
    };
    return tur === "petshop"
      ? { ...common, teslimatMesafesi: values.teslimatMesafesi, kapidaOdeme: values.kapidaOdeme }
      : { ...common, acilNobet: values.acilNobet, listelenmeIzni: values.listelenmeIzni };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const payload = buildPayload();
    const parsed = preRegistrationSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
      const next: Errors = {};
      for (const [k, v] of Object.entries(fieldErrors)) next[k] = v?.[0];
      setErrors(next);
      setStatus("idle");
      const first = Object.keys(next)[0];
      if (first) document.getElementById(`f-${first}`)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/on-kayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await parseApiResponse<{
        message?: string;
        errors?: Record<string, string[]>;
      }>(res);
      if (!result.ok) {
        if (result.data?.errors) {
          const next: Errors = {};
          for (const [k, v] of Object.entries(result.data.errors)) next[k] = v?.[0];
          setErrors(next);
        }
        throw new Error(result.message);
      }
      setStatus("success");
      setMessage(result.data?.message || "Ön kaydın bize ulaştı.");
      setValues(EMPTY);
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error && err.message
          ? err.message
          : "Bir sorun oldu. Biraz sonra tekrar dene.",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-3xl border border-success/40 bg-success/10 p-6 outline-none"
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-surface">
            <Icon name="check" size={22} strokeWidth={2.25} />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-primary">Teşekkürler!</h2>
            <p className="mt-1 text-muted">{message}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setStatus("idle");
                setMessage("");
                startedAt.current = Date.now();
              }}
            >
              Yeni bir ön kayıt gönder
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <fieldset>
        <legend className="text-base font-extrabold text-primary">İşletme türün</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(
            [
              { id: "petshop", label: "Petshop", icon: "store" },
              { id: "veteriner", label: "Veteriner", icon: "stethoscope" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.id}
              className={cn(
                "flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 px-4 font-extrabold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-amber",
                tur === opt.id
                  ? "border-secondary bg-secondary text-surface"
                  : "border-line bg-surface text-primary",
              )}
            >
              <input
                type="radio"
                name="tur"
                value={opt.id}
                checked={tur === opt.id}
                onChange={() => {
                  setTur(opt.id);
                  setErrors({});
                }}
                className="sr-only"
              />
              <Icon name={opt.icon} size={22} />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-extrabold text-primary">İşletme ve yetkili bilgileri</legend>
        <Field id="isletmeAdi" label="İşletme adı" error={errors.isletmeAdi}>
          <input
            id="f-isletmeAdi"
            className={inputClass}
            value={values.isletmeAdi}
            onChange={(e) => set("isletmeAdi", e.target.value)}
            autoComplete="organization"
            aria-invalid={Boolean(errors.isletmeAdi)}
            aria-describedby={errors.isletmeAdi ? "e-isletmeAdi" : undefined}
          />
        </Field>
        <Field id="yetkili" label="Yetkili ad-soyad" error={errors.yetkili}>
          <input
            id="f-yetkili"
            className={inputClass}
            value={values.yetkili}
            onChange={(e) => set("yetkili", e.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.yetkili)}
            aria-describedby={errors.yetkili ? "e-yetkili" : undefined}
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="telefon" label="Telefon" error={errors.telefon}>
            <input
              id="f-telefon"
              type="tel"
              inputMode="tel"
              placeholder="05xx xxx xx xx"
              className={inputClass}
              value={values.telefon}
              onChange={(e) => set("telefon", e.target.value)}
              autoComplete="tel"
              aria-invalid={Boolean(errors.telefon)}
              aria-describedby={errors.telefon ? "e-telefon" : undefined}
            />
          </Field>
          <Field id="email" label="E-posta" error={errors.email}>
            <input
              id="f-email"
              type="email"
              inputMode="email"
              className={inputClass}
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "e-email" : undefined}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-extrabold text-primary">Konum</legend>
        <CityDistrictSelect
          il={values.il}
          ilce={values.ilce}
          onIlChange={(il) => {
            setValues((v) => ({ ...v, il, ilce: "" }));
            setErrors((e) => ({ ...e, il: undefined, ilce: undefined }));
          }}
          onIlceChange={(ilce) => set("ilce", ilce)}
          ilError={errors.il}
          ilceError={errors.ilce}
        />
        <Field id="adres" label="Adres" error={errors.adres}>
          <textarea
            id="f-adres"
            rows={3}
            className={inputClass}
            value={values.adres}
            onChange={(e) => set("adres", e.target.value)}
            autoComplete="street-address"
            aria-invalid={Boolean(errors.adres)}
            aria-describedby={errors.adres ? "e-adres" : undefined}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-extrabold text-primary">
          {tur === "petshop" ? "Petshop bilgileri" : "Klinik bilgileri"}
        </legend>
        <Field
          id="calismaSaatleri"
          label="Çalışma saatleri"
          hint="Örnek: Hafta içi 09:00–20:00, cumartesi 10:00–18:00, pazar kapalı"
          error={errors.calismaSaatleri}
        >
          <input
            id="f-calismaSaatleri"
            className={inputClass}
            value={values.calismaSaatleri}
            onChange={(e) => set("calismaSaatleri", e.target.value)}
            aria-invalid={Boolean(errors.calismaSaatleri)}
            aria-describedby={cn("h-calismaSaatleri", errors.calismaSaatleri && "e-calismaSaatleri")}
          />
        </Field>

        {tur === "petshop" ? (
          <>
            <Field id="teslimatMesafesi" label="Teslimat mesafesi" error={errors.teslimatMesafesi}>
              <select
                id="f-teslimatMesafesi"
                className={inputClass}
                value={values.teslimatMesafesi}
                onChange={(e) => set("teslimatMesafesi", e.target.value)}
                aria-invalid={Boolean(errors.teslimatMesafesi)}
                aria-describedby={errors.teslimatMesafesi ? "e-teslimatMesafesi" : undefined}
              >
                <option value="">Seç</option>
                {DELIVERY_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <RadioGroup
              id="kapidaOdeme"
              legend="Kapıda ödeme kabul ediyor musun?"
              value={values.kapidaOdeme}
              onChange={(v) => set("kapidaOdeme", v)}
              options={[
                { value: "evet", label: "Evet" },
                { value: "hayir", label: "Hayır" },
              ]}
              error={errors.kapidaOdeme}
            />
          </>
        ) : (
          <>
            <RadioGroup
              id="acilNobet"
              legend="Acil / nöbet hizmeti"
              value={values.acilNobet}
              onChange={(v) => set("acilNobet", v)}
              options={EMERGENCY_OPTIONS.map((o) => ({ value: o, label: o }))}
              error={errors.acilNobet}
              stacked
            />
            <Checkbox
              id="listelenmeIzni"
              checked={values.listelenmeIzni}
              onChange={(v) => set("listelenmeIzni", v)}
              error={errors.listelenmeIzni}
              required
            >
              Kliniğimin adı, adresi, telefonu ve çalışma saatlerinin PetLoog
              uygulamasında listelenmesine izin veriyorum.{" "}
              <span className="text-danger">(zorunlu)</span>
            </Checkbox>
          </>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="sr-only">Onaylar</legend>
        <Checkbox
          id="kvkkOnay"
          checked={values.kvkkOnay}
          onChange={(v) => set("kvkkOnay", v)}
          error={errors.kvkkOnay}
          required
        >
          <Link href="/kvkk" target="_blank" className="font-extrabold text-primary underline">
            KVKK aydınlatma metnini
          </Link>{" "}
          okudum. Ön kaydımın değerlendirilmesi için bilgilerimin işlenmesini
          onaylıyorum. <span className="text-danger">(zorunlu)</span>
        </Checkbox>
        <Checkbox
          id="iletisimIzni"
          checked={values.iletisimIzni}
          onChange={(v) => set("iletisimIzni", v)}
        >
          PetLoog&apos;dan kampanya ve duyurularla ilgili e-posta, SMS ve telefon
          ile iletişim almak istiyorum. (isteğe bağlı)
        </Checkbox>
      </fieldset>

      {/* Honeypot — hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Web sitesi
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </label>
      </div>

      {status === "error" && message ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-primary outline-none"
        >
          <Icon name="alert" size={22} className="mt-0.5 shrink-0 text-danger" />
          <p>{message}</p>
        </div>
      ) : null}

      {Object.values(errors).some(Boolean) && status !== "error" ? (
        <p role="alert" className="font-bold text-danger">
          Lütfen işaretli alanları kontrol et.
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full md:w-auto" disabled={status === "loading"}>
        {status === "loading" ? "Gönderiliyor…" : "Ön kaydı gönder"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={`f-${id}`} className="block font-bold text-primary">
        {label}
      </label>
      {hint ? (
        <p id={`h-${id}`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`e-${id}`} className="text-sm font-bold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RadioGroup({
  id,
  legend,
  value,
  onChange,
  options,
  error,
  stacked = false,
}: {
  id: string;
  legend: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  stacked?: boolean;
}) {
  return (
    <fieldset aria-describedby={error ? `e-${id}` : undefined}>
      <legend className="font-bold text-primary">{legend}</legend>
      <div className={cn("mt-2 grid gap-2", stacked ? "grid-cols-1" : "grid-cols-2")}>
        {options.map((o, i) => (
          <label
            key={o.value}
            className={cn(
              "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border bg-surface px-4",
              value === o.value ? "border-secondary" : "border-line",
              error && "border-danger",
            )}
          >
            <input
              id={i === 0 ? `f-${id}` : undefined}
              type="radio"
              name={id}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="h-5 w-5 accent-[#6B442A]"
            />
            <span className="font-semibold text-primary">{o.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={`e-${id}`} className="mt-1.5 text-sm font-bold text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function Checkbox({
  id,
  checked,
  onChange,
  error,
  required,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={`f-${id}`}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          aria-required={required}
          aria-describedby={error ? `e-${id}` : undefined}
          className="mt-0.5 h-6 w-6 shrink-0 accent-[#6B442A]"
        />
        <label htmlFor={`f-${id}`} className="leading-relaxed text-muted">
          {children}
        </label>
      </div>
      {error ? (
        <p id={`e-${id}`} className="mt-1.5 pl-9 text-sm font-bold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
