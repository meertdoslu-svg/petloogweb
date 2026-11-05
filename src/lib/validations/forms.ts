import { z } from "zod";
import { isValidCity, isValidDistrict } from "@/lib/data/turkeyLocations";

const phoneRegex = /^(\+90|0)?5\d{9}$/;

function normalizePhone(v: string) {
  return v.replace(/[\s()-]/g, "");
}

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı").max(80),
  email: z.string().trim().email("Geçerli bir e-posta gir").max(120),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || phoneRegex.test(normalizePhone(v)), {
      message: "Geçerli bir cep telefonu gir",
    }),
  subject: z.string().trim().min(3, "Konu en az 3 karakter olmalı").max(120),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı").max(2000),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ---------------------------------------------------------------------------
// Ön kayıt (petshop / veteriner) — sent by e-mail only, never stored.
// No document upload by design.
// ---------------------------------------------------------------------------

export const DELIVERY_OPTIONS = [
  "1 km'ye kadar",
  "3 km'ye kadar",
  "5 km'ye kadar",
  "10 km'ye kadar",
  "Teslimat yapmıyoruz",
] as const;

export const EMERGENCY_OPTIONS = [
  "7/24 acil hizmet veriyoruz",
  "Belirli günlerde nöbet tutuyoruz",
  "Acil/nöbet hizmetimiz yok",
] as const;

const required = (label: string, min = 2, max = 120) =>
  z
    .string({ error: `${label} gerekli` })
    .trim()
    .min(min, `${label} gerekli`)
    .max(max, `${label} en fazla ${max} karakter olabilir`);

const baseFields = {
  isletmeAdi: required("İşletme adı"),
  yetkili: required("Yetkili ad-soyad", 3, 80),
  telefon: z
    .string()
    .trim()
    .refine((v) => phoneRegex.test(normalizePhone(v)), "Geçerli bir cep telefonu gir (05xx xxx xx xx)"),
  email: z.string().trim().email("Geçerli bir e-posta gir").max(120),
  il: z.string().trim().refine(isValidCity, "İl seç"),
  ilce: z.string().trim().min(1, "İlçe seç"),
  adres: required("Adres", 10, 300),
  calismaSaatleri: required("Çalışma saatleri", 3, 200),
  kvkkOnay: z.literal(true, { error: "Devam etmek için aydınlatma metnini onaylaman gerekiyor" }),
  iletisimIzni: z.boolean().default(false),
  // Spam protection
  website: z.string().max(0).optional(),
  startedAt: z.number().optional(),
};

export const preRegistrationSchema = z
  .discriminatedUnion("tur", [
    z.object({
      tur: z.literal("petshop"),
      ...baseFields,
      teslimatMesafesi: z.enum(DELIVERY_OPTIONS, { error: "Teslimat mesafesini seç" }),
      kapidaOdeme: z.enum(["evet", "hayir"], { error: "Kapıda ödeme seçimini yap" }),
    }),
    z.object({
      tur: z.literal("veteriner"),
      ...baseFields,
      acilNobet: z.enum(EMERGENCY_OPTIONS, { error: "Acil/nöbet durumunu seç" }),
      listelenmeIzni: z.boolean().default(false),
    }),
  ])
  .superRefine((data, ctx) => {
    if (isValidCity(data.il) && !isValidDistrict(data.il, data.ilce)) {
      ctx.addIssue({ code: "custom", path: ["ilce"], message: "İlçe seç" });
    }
  });

export type PreRegistrationInput = z.input<typeof preRegistrationSchema>;
export type PreRegistration = z.output<typeof preRegistrationSchema>;
