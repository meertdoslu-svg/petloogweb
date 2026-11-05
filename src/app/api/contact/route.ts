import { NextResponse } from "next/server";
import { escapeHtml, sendEmail } from "@/lib/email/resend";
import {
  auditLog,
  getClientIp,
  isProductionRuntime,
  rateLimit,
  securityHeaders,
} from "@/lib/security";
import { contactSchema } from "@/lib/validations/forms";

// İletişim formu → e-posta (info@petloog.com) via Resend, same as /api/on-kayit.
// Nothing is written to any database.
export const runtime = "nodejs";

const SUCCESS = "Mesajın bize ulaştı. En kısa sürede sana dönüş yapacağız.";

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: securityHeaders() });
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000).ok) {
    return json({ ok: false, message: "Çok fazla deneme yaptın. Birkaç dakika sonra tekrar dene." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Geçersiz istek." }, 400);
  }

  // Honeypot → fake success, nothing sent.
  const raw = body as { website?: unknown };
  if (typeof raw?.website === "string" && raw.website.length > 0) {
    auditLog("contact:bot_blocked", { ip });
    return json({ ok: true, message: SUCCESS });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
    auditLog("contact:validation_failed", { ip, fields: Object.keys(errors) });
    return json({ ok: false, message: "Lütfen işaretli alanları kontrol et.", errors }, 400);
  }

  const d = parsed.data;
  const rows: [string, string][] = [
    ["Ad soyad", d.name],
    ["E-posta", d.email],
    ["Telefon", d.phone || "-"],
    ["Konu", d.subject],
    ["Mesaj", d.message],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nGönderim: ${new Date().toISOString()}`;
  const html = `<h2 style="font-family:sans-serif">Yeni iletişim mesajı</h2>
<table style="font-family:sans-serif;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border:1px solid #E5D8C7;font-weight:bold;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 12px;border:1px solid #E5D8C7;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;

  const result = await sendEmail({
    to: process.env.CONTACT_MAIL_TO || "info@petloog.com",
    subject: `İletişim: ${d.subject}`.slice(0, 160),
    text,
    html,
    replyTo: d.email,
  });

  if (result.ok) {
    auditLog("contact:sent", { ip, id: result.id });
    return json({ ok: true, message: SUCCESS });
  }

  if (result.reason === "not_configured" && !isProductionRuntime()) {
    auditLog("contact:dev_email_unconfigured", { ip });
    return json({ ok: true, message: `${SUCCESS} (dev: RESEND_API_KEY yok, e-posta gönderilmedi)` });
  }

  auditLog("contact:send_failed", { ip, reason: result.reason, detail: result.detail });
  return json(
    {
      ok: false,
      message: "Mesajını şu an gönderemedik. Biraz sonra tekrar dene ya da info@petloog.com adresine yaz.",
    },
    503,
  );
}
