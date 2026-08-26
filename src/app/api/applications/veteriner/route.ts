import { NextResponse } from "next/server";
import {
  auditLog,
  getClientIp,
  rateLimit,
  sanitizeText,
  securityHeaders,
} from "@/lib/security";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { veterinerApplicationSchema } from "@/lib/validations/forms";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limited = rateLimit(`vet-app:${ip}`, 4, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Çok fazla istek. Lütfen biraz sonra deneyin." },
      { status: 429, headers: securityHeaders() },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Geçersiz istek gövdesi." },
      { status: 400, headers: securityHeaders() },
    );
  }

  const parsed = veterinerApplicationSchema.safeParse(body);
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
    documents: {
      vergiLevhasi: data.vergiLevhasi,
      imzaSirkusu: data.imzaSirkusu,
      ruhsat: data.ruhsat,
      logo: data.logo ?? null,
      fotograflar: data.fotograflar ?? [],
    },
    status: "pending_review",
    ip,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("veteriner_applications").insert(row);
    if (error) {
      auditLog("veteriner.insert_failed", { ip, error: error.message });
    }
  }

  auditLog("veteriner.submitted", { ip, email: row.email });

  return NextResponse.json(
    {
      ok: true,
      message: "Başvurunuz alındı. Admin onayı bekleniyor.",
      data: { status: "pending_review" },
    },
    { headers: securityHeaders() },
  );
}
