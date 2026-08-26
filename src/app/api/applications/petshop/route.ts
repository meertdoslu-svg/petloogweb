import { NextResponse } from "next/server";
import {
  auditLog,
  getClientIp,
  rateLimit,
  sanitizeText,
  securityHeaders,
} from "@/lib/security";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { petshopApplicationSchema } from "@/lib/validations/forms";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limited = rateLimit(`petshop-app:${ip}`, 4, 60_000);
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

  const parsed = petshopApplicationSchema.safeParse(body);
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
    documents: {
      logo: data.logo,
      kapak: data.kapak ?? null,
      belgeler: data.belgeler,
    },
    status: "pending_review",
    ip,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("petshop_applications").insert(row);
    if (error) {
      auditLog("petshop.insert_failed", { ip, error: error.message });
    }
  }

  auditLog("petshop.submitted", { ip, email: row.email });

  return NextResponse.json(
    {
      ok: true,
      message: "Başvurunuz alındı. Admin onayı bekleniyor.",
      data: { status: "pending_review" },
    },
    { headers: securityHeaders() },
  );
}
