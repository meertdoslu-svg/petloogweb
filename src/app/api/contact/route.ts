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
import { contactSchema } from "@/lib/validations/forms";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limited = rateLimit(`contact:${ip}`, 5, 60_000);
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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Form doğrulaması başarısız.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400, headers: securityHeaders() },
    );
  }

  if (parsed.data.website) {
    auditLog("contact.bot_blocked", { ip });
    return NextResponse.json(
      { ok: true, message: "Mesajınız alındı. En kısa sürede dönüş yapacağız." },
      { headers: securityHeaders() },
    );
  }

  const payload = {
    name: sanitizeText(parsed.data.name),
    email: sanitizeText(parsed.data.email),
    phone: parsed.data.phone ? sanitizeText(parsed.data.phone) : null,
    subject: sanitizeText(parsed.data.subject),
    message: sanitizeText(parsed.data.message),
    ip,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    if (isProductionRuntime()) {
      auditLog("contact.supabase_unavailable", { ip });
      return NextResponse.json(
        {
          ok: false,
          message:
            "Mesajınızı şu anda alamıyoruz. Lütfen daha sonra tekrar deneyin ya da bizi telefon/WhatsApp ile arayın.",
        },
        { status: 503, headers: securityHeaders() },
      );
    }
    // Dev-only convenience: no Supabase project configured locally, so
    // there's nothing to persist to. Never reached in production — see
    // isProductionRuntime() above, which fails closed instead.
    auditLog("contact.dev_supabase_unconfigured", { ip });
    return NextResponse.json(
      { ok: true, message: "Mesajınız alındı. En kısa sürede dönüş yapacağız." },
      { headers: securityHeaders() },
    );
  }

  const { error } = await supabase.from("contact_messages").insert(payload);
  if (error) {
    auditLog("contact.insert_failed", { ip, error: error.message });
    return NextResponse.json(
      {
        ok: false,
        message: "Mesajınız kaydedilemedi. Lütfen tekrar deneyin.",
      },
      { status: 500, headers: securityHeaders() },
    );
  }

  auditLog("contact.submitted", { ip, email: payload.email });

  return NextResponse.json(
    { ok: true, message: "Mesajınız alındı. En kısa sürede dönüş yapacağız." },
    { headers: securityHeaders() },
  );
}
