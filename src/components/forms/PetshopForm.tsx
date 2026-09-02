"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { CityDistrictSelect } from "@/components/forms/shared/CityDistrictSelect";
import { NeighborhoodMultiSelect } from "@/components/forms/shared/NeighborhoodMultiSelect";
import { WorkingHoursPicker } from "@/components/forms/shared/WorkingHoursPicker";
import { submitFormData } from "@/lib/http";
import {
  petshopApplicationSchema,
  validateUploadMeta,
  type PetshopApplicationInput,
} from "@/lib/validations/forms";
import { DEFAULT_WORKING_HOURS } from "@/lib/validations/workingHours";

export function PetshopForm() {
  const [status, setStatus] = useState<"form" | "loading" | "pending">("form");
  const [error, setError] = useState("");

  // The real File objects live here, separate from react-hook-form's values
  // (which only track {name,type,size} for validation/UI purposes) — these
  // are what actually get uploaded on submit.
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [kapakFile, setKapakFile] = useState<File | null>(null);
  const [vergiLevhasiFile, setVergiLevhasiFile] = useState<File | null>(null);
  const [belgelerFiles, setBelgelerFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PetshopApplicationInput>({
    resolver: zodResolver(petshopApplicationSchema),
    defaultValues: {
      kvkkOnay: false,
      belgeler: [],
      website: "",
      il: "",
      ilce: "",
      teslimatIl: "",
      teslimatIlce: "",
      teslimatMahalleleri: [],
      workingHours: DEFAULT_WORKING_HOURS,
    },
  });

  const il = watch("il");
  const ilce = watch("ilce");
  const teslimatIl = watch("teslimatIl");
  const teslimatIlce = watch("teslimatIlce");
  const teslimatMahalleleri = watch("teslimatMahalleleri") || [];
  const workingHours = watch("workingHours");

  const onFile =
    (field: "logo" | "kapak" | "vergiLevhasi" | "belgeler") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      if (field === "belgeler") {
        const metas: { name: string; type: string; size: number }[] = [];
        for (const file of files) {
          const err = validateUploadMeta(file);
          if (err) {
            setError(err);
            return;
          }
          metas.push({ name: file.name, type: file.type, size: file.size });
        }
        setBelgelerFiles(files);
        setValue("belgeler", metas, { shouldValidate: true });
        setError("");
        return;
      }

      const file = files[0];
      const err = validateUploadMeta(file);
      if (err) {
        setError(err);
        return;
      }
      if (field === "logo") setLogoFile(file);
      if (field === "kapak") setKapakFile(file);
      if (field === "vergiLevhasi") setVergiLevhasiFile(file);
      setValue(
        field,
        { name: file.name, type: file.type, size: file.size },
        { shouldValidate: true },
      );
      setError("");
    };

  const onSubmit = handleSubmit(async (values) => {
    if (status === "loading") return; // duplicate-click guard
    setStatus("loading");
    setError("");

    const formData = new FormData();
    formData.append("magazaAdi", values.magazaAdi);
    formData.append("yetkili", values.yetkili);
    formData.append("telefon", values.telefon);
    formData.append("email", values.email);
    formData.append("vergiNo", values.vergiNo);
    formData.append("iban", values.iban);
    formData.append("il", values.il);
    formData.append("ilce", values.ilce);
    formData.append("adres", values.adres);
    formData.append("kategori", values.kategori);
    formData.append("workingHours", JSON.stringify(values.workingHours));
    formData.append("teslimatIl", values.teslimatIl);
    formData.append("teslimatIlce", values.teslimatIlce);
    formData.append(
      "teslimatMahalleleri",
      JSON.stringify(values.teslimatMahalleleri),
    );
    formData.append("kvkkOnay", String(values.kvkkOnay));
    formData.append("website", values.website ?? "");

    if (logoFile) formData.append("logo", logoFile);
    if (kapakFile) formData.append("kapak", kapakFile);
    if (vergiLevhasiFile) formData.append("vergiLevhasi", vergiLevhasiFile);
    belgelerFiles.forEach((file) => formData.append("belgeler", file));

    const result = await submitFormData<{ message?: string }>(
      "/api/applications/petshop",
      formData,
    );

    if (!result.ok) {
      setStatus("form");
      setError(result.message);
      return;
    }

    setStatus("pending");
  });

  const pendingView = useMemo(
    () => (
      <div className="rounded-[28px] bg-surface p-8 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-2xl font-extrabold text-secondary">
          ✓
        </div>
        <h2 className="text-2xl font-extrabold text-primary">
          Başvurunuz Alındı
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-primary/70">
          PetShop kayıt başvurunuz PetLoog ekibi tarafından incelenecektir.
          İnceleme tamamlandığında e-posta ile bilgilendirileceksiniz.
        </p>
      </div>
    ),
    [],
  );

  if (status === "pending") return pendingView;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Section title="İşletme Bilgileri">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Mağaza Adı" error={errors.magazaAdi?.message}>
            <input className={inputClass} {...register("magazaAdi")} />
          </Field>
          <Field label="Yetkili" error={errors.yetkili?.message}>
            <input className={inputClass} {...register("yetkili")} />
          </Field>
          <Field label="Telefon" error={errors.telefon?.message}>
            <input className={inputClass} {...register("telefon")} />
          </Field>
          <Field label="E-posta" error={errors.email?.message}>
            <input type="email" className={inputClass} {...register("email")} />
          </Field>
          <Field label="Kategori" error={errors.kategori?.message}>
            <input
              className={inputClass}
              placeholder="Mama, Aksesuar, Kuaför..."
              {...register("kategori")}
            />
          </Field>
        </div>
      </Section>

      <Section title="Adres">
        <CityDistrictSelect
          il={il}
          ilce={ilce}
          onIlChange={(next) => {
            setValue("il", next, { shouldValidate: true });
            setValue("ilce", "", { shouldValidate: true });
          }}
          onIlceChange={(next) => setValue("ilce", next, { shouldValidate: true })}
          ilError={errors.il?.message}
          ilceError={errors.ilce?.message}
        />
        <Field label="Tam Adres" error={errors.adres?.message}>
          <textarea
            rows={3}
            className={inputClass}
            placeholder="Mahalle, cadde, sokak, bina no..."
            {...register("adres")}
          />
        </Field>
      </Section>

      <Section title="Teslimat Bölgeleri">
        <p className="text-sm text-primary/60">
          Mağazanızın teslimat yaptığı il, ilçe ve mahalleleri seçin — bu,
          işletme adresinizden farklı olabilir.
        </p>
        <CityDistrictSelect
          il={teslimatIl}
          ilce={teslimatIlce}
          onIlChange={(next) => {
            setValue("teslimatIl", next, { shouldValidate: true });
            setValue("teslimatIlce", "", { shouldValidate: true });
            setValue("teslimatMahalleleri", [], { shouldValidate: true });
          }}
          onIlceChange={(next) => {
            setValue("teslimatIlce", next, { shouldValidate: true });
            setValue("teslimatMahalleleri", [], { shouldValidate: true });
          }}
          ilLabel="Teslimat İli"
          ilceLabel="Teslimat İlçesi"
          ilError={errors.teslimatIl?.message}
          ilceError={errors.teslimatIlce?.message}
        />
        <NeighborhoodMultiSelect
          il={teslimatIl}
          ilce={teslimatIlce}
          selected={teslimatMahalleleri}
          onChange={(next) =>
            setValue("teslimatMahalleleri", next, { shouldValidate: true })
          }
          error={errors.teslimatMahalleleri?.message as string | undefined}
        />
      </Section>

      <Section title="Çalışma Saatleri">
        <WorkingHoursPicker
          value={workingHours}
          onChange={(next) => setValue("workingHours", next, { shouldValidate: true })}
          error={
            (errors.workingHours as { message?: string } | undefined)?.message
          }
        />
      </Section>

      <Section title="Ödeme Bilgileri">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Vergi No" error={errors.vergiNo?.message}>
            <input className={inputClass} {...register("vergiNo")} />
          </Field>
          <Field label="IBAN" error={errors.iban?.message}>
            <input
              className={inputClass}
              placeholder="TR00 0000 0000 0000 0000 0000 00"
              {...register("iban")}
            />
          </Field>
        </div>
      </Section>

      <Section title="Görseller">
        <div className="grid gap-4 md:grid-cols-2">
          <FileField
            label="Logo"
            error={errors.logo?.message as string | undefined}
            onChange={onFile("logo")}
          />
          <FileField
            label="Kapak"
            error={errors.kapak?.message as string | undefined}
            onChange={onFile("kapak")}
          />
        </div>
      </Section>

      <Section title="Belgeler">
        <div className="grid gap-4 md:grid-cols-2">
          <FileField
            label="Vergi Levhası"
            error={errors.vergiLevhasi?.message as string | undefined}
            onChange={onFile("vergiLevhasi")}
          />
          <FileField
            label="Diğer Belgeler (Opsiyonel)"
            multiple
            error={errors.belgeler?.message as string | undefined}
            onChange={onFile("belgeler")}
          />
        </div>
      </Section>

      <Section title="Onay">
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
      </Section>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        {...register("website")}
      />

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
