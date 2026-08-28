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
  petshopApplicationSchema,
  validateUploadMeta,
} from "@/lib/validations/forms";

const BUCKET = "application-documents";
const MAX_DOCS = 8;

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
  const limited = rateLimit(`petshop-app:${ip}`, 4, 60_000);
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
    auditLog("petshop.bot_blocked", { ip });
    return NextResponse.json(
      {
        ok: true,
        message: "Başvurunuz alındı. Admin onayı bekleniyor.",
        data: { status: "pending_review" },
      },
      { headers: securityHeaders() },
    );
  }

  const logo = collectFiles(formData, "logo", 1)[0];
  const kapak = collectFiles(formData, "kapak", 1)[0];
  const belgeler = collectFiles(formData, "belgeler", MAX_DOCS);

  const candidate = {
    magazaAdi: formData.get("magazaAdi"),
    yetkili: formData.get("yetkili"),
    telefon: formData.get("telefon"),
    email: formData.get("email"),
    vergiNo: formData.get("vergiNo"),
    iban: formData.get("iban"),
    il: formData.get("il"),
    ilce: formData.get("ilce"),
    adres: formData.get("adres"),
    kategori: formData.get("kategori"),
    calismaSaatleri: formData.get("calismaSaatleri"),
    teslimatBolgeleri: formData.get("teslimatBolgeleri"),
    logo: logo ? fileMeta(logo) : undefined,
    kapak: kapak ? fileMeta(kapak) : undefined,
    belgeler: belgeler.length ? belgeler.map(fileMeta) : [],
    kvkkOnay: formData.get("kvkkOnay") === "true",
  };

  const parsed = petshopApplicationSchema.safeParse(candidate);
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
  for (const file of [logo!, ...(kapak ? [kapak] : []), ...belgeler]) {
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
      auditLog("petshop.supabase_unavailable", { ip });
      return NextResponse.json(
        {
          ok: false,
          message: "Başvurunuz şu anda alınamıyor. Lütfen daha sonra tekrar deneyin.",
        },
        { status: 503, headers: securityHeaders() },
      );
    }
    // Dev-only convenience — never reached in production (see check above).
    auditLog("petshop.dev_supabase_unconfigured", { ip });
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
    const path = `petshop/${applicationId}/${label}-${randomUUID()}.${ext}`;
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
      logo: await uploadOne(logo!, "logo"),
      kapak: kapak ? await uploadOne(kapak, "kapak") : null,
      belgeler: await Promise.all(
        belgeler.map((file, i) => uploadOne(file, `belge-${i}`)),
      ),
    };

    const data = parsed.data;
    const row = {
      store_name: sanitizeText(data.magazaAdi),
      owner_name: sanitizeText(data.yetkili),
      phone: sanitizeText(data.telefon),
      email: sanitizeText(data.email),
      tax_no: sanitizeText(data.vergiNo),
      iban: sanitizeText(data.iban),
      city: sanitizeText(data.il),
      district: sanitizeText(data.ilce),
      address: sanitizeText(data.adres),
      category: sanitizeText(data.kategori),
      working_hours: sanitizeText(data.calismaSaatleri),
      delivery_zones: sanitizeText(data.teslimatBolgeleri),
      documents,
      status: "pending_review",
      ip,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await client
      .from("petshop_applications")
      .insert(row);
    if (insertError) throw new Error(insertError.message);

    auditLog("petshop.submitted", { ip, email: row.email });

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
    auditLog("petshop.insert_failed", {
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
