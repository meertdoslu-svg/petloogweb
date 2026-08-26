import { NextResponse } from "next/server";
import {
  auditLog,
  getClientIp,
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
  if (supabase) {
    const { error } = await supabase.from("contact_messages").insert(payload);
    if (error) {
      auditLog("contact.insert_failed", { ip, error: error.message });
    }
  }

  auditLog("contact.submitted", { ip, email: payload.email });

  return NextResponse.json(
    { ok: true, message: "Mesajınız alındı. En kısa sürede dönüş yapacağız." },
    { headers: securityHeaders() },
  );
}
