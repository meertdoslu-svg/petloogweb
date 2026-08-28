import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  auditLog,
  getClientIp,
  isProductionRuntime,
  rateLimit,
  sanitizeText,
  securityHeaders,
} from "@/lib/security";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  EXTENSION_BY_MIME,
  validateUploadMeta,
  veterinerApplicationSchema,
} from "@/lib/validations/forms";

const BUCKET = "application-documents";
const MAX_PHOTOS = 8;

function fileMeta(file: File) {
  return { name: file.name, type: file.type, size: file.size };
}

function collectFiles(formData: FormData, field: string, max: number): File[] {
  return formData
    .getAll(field)
    .filter((v): v is File => v instanceof File && v.size > 0)
    .slice(0, max);
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limited = rateLimit(`vet-app:${ip}`, 4, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Çok fazla istek. Lütfen biraz sonra deneyin." },
      { status: 429, headers: securityHeaders() },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Geçersiz istek gövdesi." },
      { status: 400, headers: securityHeaders() },
    );
  }

  // Honeypot: real users never see/fill this hidden field. Bots that submit
  // it get a fake success so they don't learn to avoid it — nothing is
  // stored.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    auditLog("veteriner.bot_blocked", { ip });
    return NextResponse.json(
      {
        ok: true,
        message: "Başvurunuz alındı. Admin onayı bekleniyor.",
        data: { status: "pending_review" },
      },
      { headers: securityHeaders() },
    );
  }

  const vergiLevhasi = collectFiles(formData, "vergiLevhasi", 1)[0];
  const imzaSirkusu = collectFiles(formData, "imzaSirkusu", 1)[0];
  const ruhsat = collectFiles(formData, "ruhsat", 1)[0];
  const logo = collectFiles(formData, "logo", 1)[0];
  const fotograflar = collectFiles(formData, "fotograflar", MAX_PHOTOS);

  let hizmetTurleri: unknown = [];
  try {
    hizmetTurleri = JSON.parse(String(formData.get("hizmetTurleri") ?? "[]"));
  } catch {
    hizmetTurleri = [];
  }

  const candidate = {
    klinikAdi: formData.get("klinikAdi"),
    yetkiliVeteriner: formData.get("yetkiliVeteriner"),
    tcKimlik: formData.get("tcKimlik"),
    diplomaNo: formData.get("diplomaNo"),
    telefon: formData.get("telefon"),
    email: formData.get("email"),
    il: formData.get("il"),
    ilce: formData.get("ilce"),
    adres: formData.get("adres"),
    vergiNo: formData.get("vergiNo"),
    iban: formData.get("iban"),
    calismaSaatleri: formData.get("calismaSaatleri"),
    hizmetTurleri,
    vergiLevhasi: vergiLevhasi ? fileMeta(vergiLevhasi) : undefined,
    imzaSirkusu: imzaSirkusu ? fileMeta(imzaSirkusu) : undefined,
    ruhsat: ruhsat ? fileMeta(ruhsat) : undefined,
    logo: logo ? fileMeta(logo) : undefined,
    fotograflar: fotograflar.length ? fotograflar.map(fileMeta) : undefined,
    kvkkOnay: formData.get("kvkkOnay") === "true",
    sozlesmeOnay: formData.get("sozlesmeOnay") === "true",
  };

  const parsed = veterinerApplicationSchema.safeParse(candidate);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Başvuru doğrulaması başarısız.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400, headers: securityHeaders() },
    );
  }

  // Defense in depth: re-validate the real files server-side (MIME + size)
  // even though the schema above already checked their reported metadata —
  // never trust the client alone.
  const requiredFiles = [vergiLevhasi, imzaSirkusu, ruhsat].filter(
    (f): f is File => Boolean(f),
  );
  for (const file of [...requiredFiles, ...(logo ? [logo] : []), ...fotograflar]) {
    const err = validateUploadMeta(file);
    if (err) {
      return NextResponse.json(
        { ok: false, message: err },
        { status: 400, headers: securityHeaders() },
      );
    }
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    if (isProductionRuntime()) {
      auditLog("veteriner.supabase_unavailable", { ip });
      return NextResponse.json(
        {
          ok: false,
          message: "Başvurunuz şu anda alınamıyor. Lütfen daha sonra tekrar deneyin.",
        },
        { status: 503, headers: securityHeaders() },
      );
    }
    // Dev-only convenience — never reached in production (see check above).
    auditLog("veteriner.dev_supabase_unconfigured", { ip });
    return NextResponse.json(
      {
        ok: true,
        message: "Başvurunuz alındı. Admin onayı bekleniyor. (dev: Supabase yapılandırılmadı, hiçbir şey kaydedilmedi)",
        data: { status: "pending_review" },
      },
      { headers: securityHeaders() },
    );
  }

  // Narrow once into a local const so the nested closures below keep
  // TypeScript's non-null narrowing (it doesn't propagate `supabase` itself
  // into function declarations).
  const client = supabase;
  const applicationId = randomUUID();
  const uploadedPaths: string[] = [];

  async function uploadOne(file: File, label: string) {
    const ext = EXTENSION_BY_MIME[file.type as keyof typeof EXTENSION_BY_MIME];
    // Storage path is fully server-generated (uuid + fixed label), never
    // derived from the browser-supplied filename.
    const path = `veteriner/${applicationId}/${label}-${randomUUID()}.${ext}`;
    const { error } = await client.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);
    uploadedPaths.push(path);
    return {
      originalName: sanitizeText(file.name).slice(0, 180),
      mimeType: file.type,
      size: file.size,
      bucket: BUCKET,
      path,
    };
  }

  try {
    const documents = {
      vergiLevhasi: await uploadOne(vergiLevhasi!, "vergi-levhasi"),
      imzaSirkusu: await uploadOne(imzaSirkusu!, "imza-sirkusu"),
      ruhsat: await uploadOne(ruhsat!, "ruhsat"),
      logo: logo ? await uploadOne(logo, "logo") : null,
      fotograflar: await Promise.all(
        fotograflar.map((file, i) => uploadOne(file, `fotograf-${i}`)),
      ),
    };

    const data = parsed.data;
    const row = {
      clinic_name: sanitizeText(data.klinikAdi),
      vet_name: sanitizeText(data.yetkiliVeteriner),
      tc_kimlik: sanitizeText(data.tcKimlik),
      diploma_no: sanitizeText(data.diplomaNo),
      phone: sanitizeText(data.telefon),
      email: sanitizeText(data.email),
      city: sanitizeText(data.il),
      district: sanitizeText(data.ilce),
      address: sanitizeText(data.adres),
      tax_no: sanitizeText(data.vergiNo),
      iban: sanitizeText(data.iban),
      working_hours: sanitizeText(data.calismaSaatleri),
      services: data.hizmetTurleri.map(sanitizeText),
      documents,
      status: "pending_review",
      ip,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await client
      .from("veteriner_applications")
      .insert(row);
    if (insertError) throw new Error(insertError.message);

    auditLog("veteriner.submitted", { ip, email: row.email });

    return NextResponse.json(
      {
        ok: true,
        message: "Başvurunuz alındı. Admin onayı bekleniyor.",
        data: { status: "pending_review" },
      },
      { headers: securityHeaders() },
    );
  } catch (err) {
    // Don't leave orphaned private documents behind for an application that
    // was never actually recorded.
    if (uploadedPaths.length) {
      await client.storage
        .from(BUCKET)
        .remove(uploadedPaths)
        .catch(() => {});
    }
    auditLog("veteriner.insert_failed", {
      ip,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      {
        ok: false,
        message: "Başvurunuz kaydedilemedi. Lütfen tekrar deneyin.",
      },
      { status: 500, headers: securityHeaders() },
    );
  }
}
