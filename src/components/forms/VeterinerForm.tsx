"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import {
  validateUploadMeta,
  veterinerApplicationSchema,
  type VeterinerApplicationInput,
} from "@/lib/validations/forms";

const HIZMETLER = [
  "Genel Muayene",
  "Aşı",
  "Cerrahi",
  "Diş",
  "Acil",
  "Pet Kuaför",
] as const;

type FileMeta = { name: string; type: string; size: number };

export function VeterinerForm() {
  const [status, setStatus] = useState<"form" | "loading" | "pending">("form");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VeterinerApplicationInput>({
    resolver: zodResolver(veterinerApplicationSchema),
    defaultValues: {
      hizmetTurleri: [],
      kvkkOnay: false,
      sozlesmeOnay: false,
    },
  });

  const selectedServices = watch("hizmetTurleri") || [];

  const onFile =
    (field: keyof VeterinerApplicationInput, multiple = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      if (multiple) {
        const metas: FileMeta[] = [];
        for (const file of files) {
          const err = validateUploadMeta(file);
          if (err) {
            setError(err);
            return;
          }
          metas.push({ name: file.name, type: file.type, size: file.size });
        }
        setValue("fotograflar", metas, { shouldValidate: true });
        return;
      }

      const file = files[0];
      const err = validateUploadMeta(file);
      if (err) {
        setError(err);
        return;
      }
      setValue(
        field,
        { name: file.name, type: file.type, size: file.size } as never,
        { shouldValidate: true },
      );
      setError("");
    };

  const onSubmit = handleSubmit(async (values) => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/applications/veteriner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Başvuru başarısız");
      setStatus("pending");
    } catch (err) {
      setStatus("form");
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  });

  const pendingView = useMemo(
    () => (
      <div className="rounded-[28px] bg-surface p-8 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-2xl font-extrabold text-accent">
          ✓
        </div>
        <h2 className="text-2xl font-extrabold text-primary">
          Admin Onayı Bekleniyor
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-primary/70">
          Veteriner kayıt başvurunuz alındı. Belgeleriniz incelendikten sonra
          bilgilendirileceksiniz.
        </p>
      </div>
    ),
    [],
  );

  if (status === "pending") return pendingView;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Section title="Klinik Bilgileri">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Klinik Adı" error={errors.klinikAdi?.message}>
            <input className={inputClass} {...register("klinikAdi")} />
          </Field>
          <Field
            label="Yetkili Veteriner"
            error={errors.yetkiliVeteriner?.message}
          >
            <input className={inputClass} {...register("yetkiliVeteriner")} />
          </Field>
          <Field label="TC Kimlik" error={errors.tcKimlik?.message}>
            <input className={inputClass} {...register("tcKimlik")} />
          </Field>
          <Field label="Diploma No" error={errors.diplomaNo?.message}>
            <input className={inputClass} {...register("diplomaNo")} />
          </Field>
          <Field label="Telefon" error={errors.telefon?.message}>
            <input className={inputClass} {...register("telefon")} />
          </Field>
          <Field label="E-posta" error={errors.email?.message}>
            <input type="email" className={inputClass} {...register("email")} />
          </Field>
        </div>
      </Section>

      <Section title="Adres">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="İl" error={errors.il?.message}>
            <input className={inputClass} {...register("il")} />
          </Field>
          <Field label="İlçe" error={errors.ilce?.message}>
            <input className={inputClass} {...register("ilce")} />
          </Field>
        </div>
        <Field label="Adres" error={errors.adres?.message}>
          <textarea rows={3} className={inputClass} {...register("adres")} />
        </Field>
      </Section>

      <Section title="Mali Bilgiler">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Vergi No" error={errors.vergiNo?.message}>
            <input className={inputClass} {...register("vergiNo")} />
          </Field>
          <Field label="IBAN" error={errors.iban?.message}>
            <input
              className={inputClass}
              placeholder="TRxxxxxxxxxxxxxxxxxxxxxxxx"
              {...register("iban")}
            />
          </Field>
        </div>
      </Section>

      <Section title="Hizmet & Saatler">
        <Field label="Çalışma Saatleri" error={errors.calismaSaatleri?.message}>
          <input
            className={inputClass}
            placeholder="Pzt–Cmt 09:00–19:00"
            {...register("calismaSaatleri")}
          />
        </Field>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-primary">
            Hizmet Türleri
          </legend>
          <div className="flex flex-wrap gap-2">
            {HIZMETLER.map((h) => {
              const active = selectedServices.includes(h);
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    const next = active
                      ? selectedServices.filter((x) => x !== h)
                      : [...selectedServices, h];
                    setValue("hizmetTurleri", next, { shouldValidate: true });
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                    active
                      ? "bg-accent text-white"
                      : "bg-[#EEE8DF] text-primary"
                  }`}
                >
                  {h}
                </button>
              );
            })}
          </div>
          {errors.hizmetTurleri?.message ? (
            <p className="mt-1 text-xs text-danger">
              {errors.hizmetTurleri.message}
            </p>
          ) : null}
        </fieldset>
      </Section>

      <Section title="Belgeler">
        <div className="grid gap-4 md:grid-cols-2">
          <FileField
            label="Vergi Levhası"
            error={errors.vergiLevhasi?.message as string | undefined}
            onChange={onFile("vergiLevhasi")}
          />
          <FileField
            label="İmza Sirküsü"
            error={errors.imzaSirkusu?.message as string | undefined}
            onChange={onFile("imzaSirkusu")}
          />
          <FileField
            label="Ruhsat"
            error={errors.ruhsat?.message as string | undefined}
            onChange={onFile("ruhsat")}
          />
          <FileField
            label="Logo"
            error={errors.logo?.message as string | undefined}
            onChange={onFile("logo")}
          />
          <FileField
            label="Fotoğraflar"
            multiple
            error={errors.fotograflar?.message as string | undefined}
            onChange={onFile("fotograflar", true)}
          />
        </div>
      </Section>

      <Section title="Onaylar">
        <label className="flex items-start gap-3 text-sm text-primary/80">
          <input type="checkbox" className="mt-1" {...register("kvkkOnay")} />
          <span>
            <Link href="/kvkk" className="font-bold text-accent underline">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum ve onaylıyorum.
          </span>
        </label>
        {errors.kvkkOnay?.message ? (
          <p className="text-xs text-danger">{errors.kvkkOnay.message}</p>
        ) : null}
        <label className="flex items-start gap-3 text-sm text-primary/80">
          <input
            type="checkbox"
            className="mt-1"
            {...register("sozlesmeOnay")}
          />
          <span>
            <Link
              href="/yasal/veteriner-sozlesmesi"
              className="font-bold text-accent underline"
            >
              PetLoog Veteriner Hizmet Sözleşmesi
            </Link>
            &apos;ni kabul ediyorum.
          </span>
        </label>
        {errors.sozlesmeOnay?.message ? (
          <p className="text-xs text-danger">{errors.sozlesmeOnay.message}</p>
        ) : null}
      </Section>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button type="submit" size="lg" disabled={status === "loading"}>
        {status === "loading" ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </Button>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-soft)] md:p-6">
      <h3 className="mb-4 text-lg font-extrabold text-primary">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-bold text-primary">{label}</span>
      {children}
      {error ? <span className="block text-xs text-danger">{error}</span> : null}
    </label>
  );
}

function FileField({
  label,
  error,
  multiple,
  onChange,
}: {
  label: string;
  error?: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-bold text-primary">{label}</span>
      <input
        type="file"
        multiple={multiple}
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        onChange={onChange}
        className="block w-full text-sm text-primary/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#EEE8DF] file:px-4 file:py-2 file:font-bold file:text-primary"
      />
      {error ? <span className="block text-xs text-danger">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-primary/10 bg-white px-4 py-3 text-sm text-primary shadow-sm";
