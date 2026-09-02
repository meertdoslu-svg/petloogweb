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

export const runtime = "nodejs";

const SUCCESS_MESSAGE =
  "Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.";

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
    auditLog("contact:validation_failed", {
      ip,
      fields: Object.keys(parsed.error.flatten().fieldErrors),
    });
    return NextResponse.json(
      {
        ok: false,
        message: "Form doğrulaması başarısız.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400, headers: securityHeaders() },
    );
  }

  // Honeypot: real users never see/fill this hidden field. Bots that submit
  // it get a fake success so they don't learn to avoid it — nothing is
  // stored.
  if (parsed.data.website) {
    auditLog("contact:bot_blocked", { ip });
    return NextResponse.json(
      { ok: true, message: SUCCESS_MESSAGE },
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

  // Everything below touches Supabase — wrapped in one try/catch so ANY
  // failure here (client construction included, not just a clean {error}
  // from the SDK) always produces a diagnosable server log entry and a
  // clean, generic JSON response.
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      if (isProductionRuntime()) {
        auditLog("contact:config_missing", { ip });
        return NextResponse.json(
          {
            ok: false,
            message:
              "Mesajınızı şu anda alamıyoruz. Lütfen daha sonra tekrar deneyin ya da bize e-posta ile yazın.",
          },
          { status: 503, headers: securityHeaders() },
        );
      }
      // Dev-only convenience — never reached in production (see check above).
      auditLog("contact:dev_supabase_unconfigured", { ip });
      return NextResponse.json(
        { ok: true, message: SUCCESS_MESSAGE },
        { headers: securityHeaders() },
      );
    }

    const { error } = await supabase.from("contact_messages").insert(payload);
    if (error) throw new Error(error.message);

    auditLog("contact:submitted", { ip, email: payload.email });

    return NextResponse.json(
      { ok: true, message: SUCCESS_MESSAGE },
      { headers: securityHeaders() },
    );
  } catch (err) {
    auditLog("contact:database_failed", {
      ip,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      {
        ok: false,
        message: "Mesajınız kaydedilemedi. Lütfen tekrar deneyin.",
      },
      { status: 500, headers: securityHeaders() },
    );
  }
}
