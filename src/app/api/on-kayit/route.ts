import { NextResponse } from "next/server";
import { escapeHtml, sendEmail } from "@/lib/email/resend";
import {
  auditLog,
  getClientIp,
  isProductionRuntime,
  rateLimit,
  securityHeaders,
} from "@/lib/security";
import { preRegistrationSchema, type PreRegistration } from "@/lib/validations/forms";

// Ön kayıt → e-posta (info@petloog.com). Nothing is written to any database.
export const runtime = "nodejs";

const SUCCESS = "Ön kaydın bize ulaştı. En kısa sürede seninle iletişime geçeceğiz.";
const MIN_FILL_MS = 3_000;

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: securityHeaders() });
}

function rows(data: PreRegistration): [string, string][] {
  const common: [string, string][] = [
    ["Tür", data.tur === "petshop" ? "Petshop" : "Veteriner"],
    ["İşletme adı", data.isletmeAdi],
    ["Yetkili", data.yetkili],
    ["Telefon", data.telefon],
    ["E-posta", data.email],
    ["İl / İlçe", `${data.il} / ${data.ilce}`],
    ["Adres", data.adres],
    ["Çalışma saatleri", data.calismaSaatleri],
  ];
  const specific: [string, string][] =
    data.tur === "petshop"
      ? [
          ["Teslimat mesafesi", data.teslimatMesafesi],
          ["Kapıda ödeme", data.kapidaOdeme === "evet" ? "Evet" : "Hayır"],
        ]
      : [
          ["Acil / nöbet", data.acilNobet],
          ["Uygulamada listelenme izni", data.listelenmeIzni ? "Evet" : "Hayır"],
        ];
  return [
    ...common,
    ...specific,
    ["KVKK aydınlatma metni", "Okundu, onaylandı"],
    ["Ticari iletişim izni", data.iletisimIzni ? "Evet" : "Hayır"],
  ];
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  // Simple per-IP rate limit: 3 submissions / 10 minutes (in-memory, per
  // server instance — enough to stop casual flooding).
  if (!rateLimit(`on-kayit:${ip}`, 3, 10 * 60_000).ok) {
    return json({ ok: false, message: "Çok fazla deneme yaptın. Birkaç dakika sonra tekrar dene." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Geçersiz istek." }, 400);
  }

  // Honeypot / too-fast submit → fake success, nothing sent.
  const raw = body as { website?: unknown; startedAt?: unknown };
  const tooFast =
    typeof raw.startedAt === "number" && Date.now() - raw.startedAt < MIN_FILL_MS;
  if ((typeof raw.website === "string" && raw.website.length > 0) || tooFast) {
    auditLog("on-kayit:bot_blocked", { ip, tooFast });
    return json({ ok: true, message: SUCCESS });
  }

  const parsed = preRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
    auditLog("on-kayit:validation_failed", { ip, fields: Object.keys(errors) });
    return json({ ok: false, message: "Lütfen işaretli alanları kontrol et.", errors }, 400);
  }

  const data = parsed.data;
  const list = rows(data);
  const typeLabel = data.tur === "petshop" ? "Petshop" : "Veteriner";
  const subject = `Ön kayıt: ${typeLabel} — ${data.isletmeAdi}`.slice(0, 160);
  const text = `${list.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nGönderim: ${new Date().toISOString()}`;
  const html = `<h2 style="font-family:sans-serif">Yeni ön kayıt (${typeLabel})</h2>
<table style="font-family:sans-serif;border-collapse:collapse">${list
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border:1px solid #E5D8C7;font-weight:bold">${escapeHtml(k)}</td><td style="padding:6px 12px;border:1px solid #E5D8C7">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;

  const result = await sendEmail({
    to: process.env.PREREG_MAIL_TO || "info@petloog.com",
    subject,
    text,
    html,
    replyTo: data.email,
  });

  if (result.ok) {
    auditLog("on-kayit:sent", { ip, tur: data.tur, id: result.id });
    return json({ ok: true, message: SUCCESS });
  }

  if (result.reason === "not_configured" && !isProductionRuntime()) {
    // Dev convenience only — production fails closed below.
    auditLog("on-kayit:dev_email_unconfigured", { ip, tur: data.tur });
    return json({ ok: true, message: `${SUCCESS} (dev: RESEND_API_KEY yok, e-posta gönderilmedi)` });
  }

  auditLog("on-kayit:send_failed", { ip, reason: result.reason, detail: result.detail });
  return json(
    {
      ok: false,
      message: "Ön kaydını şu an gönderemedik. Biraz sonra tekrar dene ya da info@petloog.com adresine yaz.",
    },
    503,
  );
}
