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

// Explicit, not just the current default: this route needs node:crypto
// (randomUUID) and File/FormData handling that assume the Node.js
// serverless runtime, not Edge.
export const runtime = "nodejs";

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
    auditLog("application:veteriner:bot_blocked", { ip });
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

  let workingHours: unknown = {};
  try {
    workingHours = JSON.parse(String(formData.get("workingHours") ?? "{}"));
  } catch {
    workingHours = {};
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
    workingHours,
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
    auditLog("application:veteriner:validation_failed", {
      ip,
      fields: Object.keys(parsed.error.flatten().fieldErrors),
    });
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
  const requiredFiles = [vergiLevhasi, imzaSirkusu].filter(
    (f): f is File => Boolean(f),
  );
  for (const file of [
    ...requiredFiles,
    ...(ruhsat ? [ruhsat] : []),
    ...(logo ? [logo] : []),
    ...fotograflar,
  ]) {
    const err = validateUploadMeta(file);
    if (err) {
      auditLog("application:veteriner:validation_failed", { ip, reason: "upload_meta" });
      return NextResponse.json(
        { ok: false, message: err },
        { status: 400, headers: securityHeaders() },
      );
    }
  }

  // Everything below touches Supabase (client construction, Storage,
  // Database) — all wrapped in one try/catch so ANY failure here (not just
  // a clean {error} from the SDK, but a thrown/rejected exception from
  // client construction or a network call) always produces a diagnosable
  // server log entry and a clean, generic JSON response — never an opaque
  // platform-level crash with an empty body.
  let stage: "config" | "storage" | "database" = "config";
  let clientRef: NonNullable<ReturnType<typeof getSupabaseServerClient>> | null = null;
  const uploadedPaths: string[] = [];

  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      if (isProductionRuntime()) {
        auditLog("application:veteriner:config_missing", { ip });
        return NextResponse.json(
          {
            ok: false,
            message: "Başvurunuz şu anda alınamıyor. Lütfen daha sonra tekrar deneyin.",
          },
          { status: 503, headers: securityHeaders() },
        );
      }
      // Dev-only convenience — never reached in production (see check above).
      auditLog("application:veteriner:dev_supabase_unconfigured", { ip });
      return NextResponse.json(
        {
          ok: true,
          message: "Başvurunuz alındı. Admin onayı bekleniyor. (dev: Supabase yapılandırılmadı, hiçbir şey kaydedilmedi)",
          data: { status: "pending_review" },
        },
        { headers: securityHeaders() },
      );
    }

    // Local const so the nested closure below keeps TypeScript's non-null
    // narrowing (it doesn't propagate the outer `let` into a function).
    const client = supabase;
    clientRef = client;
    const applicationId = randomUUID();

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

    stage = "storage";
    const documents = {
      vergiLevhasi: await uploadOne(vergiLevhasi!, "vergi-levhasi"),
      imzaSirkusu: await uploadOne(imzaSirkusu!, "imza-sirkusu"),
      ruhsat: ruhsat ? await uploadOne(ruhsat, "ruhsat") : null,
      logo: logo ? await uploadOne(logo, "logo") : null,
      fotograflar: await Promise.all(
        fotograflar.map((file, i) => uploadOne(file, `fotograf-${i}`)),
      ),
    };

    stage = "database";
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
      iban: data.iban,
      working_hours: data.workingHours,
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

    auditLog("application:veteriner:submitted", { ip, email: row.email });

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
    if (uploadedPaths.length && clientRef) {
      await clientRef.storage
        .from(BUCKET)
        .remove(uploadedPaths)
        .catch(() => {});
    }
    auditLog(`application:veteriner:${stage}_failed`, {
      ip,
      stage,
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
