import { z } from "zod";

const phoneRegex = /^(\+90|0)?[1-9][0-9]{9}$/;
const tcRegex = /^[1-9][0-9]{10}$/;
const ibanRegex = /^TR[0-9]{24}$/i;

// "website" on every schema below is a honeypot: a real visitor never sees
// or fills this field, so any non-empty value marks the submission as bot
// traffic (checked server-side, see the relevant API route).
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı").max(80),
  email: z.string().trim().email("Geçerli bir e-posta girin").max(120),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || phoneRegex.test(v.replace(/\s/g, "")), {
      message: "Geçerli bir telefon girin",
    }),
  subject: z.string().trim().min(3, "Konu en az 3 karakter olmalı").max(120),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı").max(2000),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

const fileMetaSchema = z.object({
  name: z.string().min(1).max(180),
  type: z.string().min(1).max(120),
  size: z.number().positive().max(8 * 1024 * 1024, "Dosya en fazla 8MB olabilir"),
});

export const veterinerApplicationSchema = z.object({
  klinikAdi: z.string().trim().min(2).max(120),
  yetkiliVeteriner: z.string().trim().min(2).max(120),
  tcKimlik: z.string().trim().regex(tcRegex, "Geçerli TC Kimlik No girin"),
  diplomaNo: z.string().trim().min(3).max(40),
  telefon: z
    .string()
    .trim()
    .regex(phoneRegex, "Geçerli telefon girin"),
  email: z.string().trim().email(),
  il: z.string().trim().min(2).max(40),
  ilce: z.string().trim().min(2).max(40),
  adres: z.string().trim().min(10).max(300),
  vergiNo: z.string().trim().min(10).max(11),
  iban: z.string().trim().regex(ibanRegex, "Geçerli TR IBAN girin"),
  calismaSaatleri: z.string().trim().min(3).max(200),
  hizmetTurleri: z.array(z.string()).min(1, "En az bir hizmet seçin"),
  vergiLevhasi: fileMetaSchema,
  imzaSirkusu: fileMetaSchema,
  ruhsat: fileMetaSchema,
  logo: fileMetaSchema.optional(),
  fotograflar: z.array(fileMetaSchema).max(8).optional(),
  kvkkOnay: z.boolean().refine((v) => v === true, {
    message: "KVKK onayı zorunludur",
  }),
  sozlesmeOnay: z.boolean().refine((v) => v === true, {
    message: "Sözleşme onayı zorunludur",
  }),
  captchaToken: z.string().min(1).optional(),
  website: z.string().max(0).optional(),
});

export type VeterinerApplicationInput = z.infer<
  typeof veterinerApplicationSchema
>;

export const petshopApplicationSchema = z.object({
  magazaAdi: z.string().trim().min(2).max(120),
  yetkili: z.string().trim().min(2).max(120),
  telefon: z.string().trim().regex(phoneRegex, "Geçerli telefon girin"),
  email: z.string().trim().email(),
  vergiNo: z.string().trim().min(10).max(11),
  iban: z.string().trim().regex(ibanRegex, "Geçerli TR IBAN girin"),
  il: z.string().trim().min(2).max(40),
  ilce: z.string().trim().min(2).max(40),
  adres: z.string().trim().min(10).max(300),
  kategori: z.string().trim().min(2).max(80),
  calismaSaatleri: z.string().trim().min(3).max(200),
  teslimatBolgeleri: z.string().trim().min(3).max(300),
  logo: fileMetaSchema,
  kapak: fileMetaSchema.optional(),
  belgeler: z.array(fileMetaSchema).min(1, "En az bir belge yükleyin").max(8),
  kvkkOnay: z.boolean().refine((v) => v === true, {
    message: "KVKK onayı zorunludur",
  }),
  captchaToken: z.string().min(1).optional(),
  website: z.string().max(0).optional(),
});

export type PetshopApplicationInput = z.infer<typeof petshopApplicationSchema>;

export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

// Storage object extensions are derived from this fixed, validated MIME
// allow-list — never from the browser-supplied filename — so an uploaded
// file's on-disk path can't be influenced by attacker-controlled input.
export const EXTENSION_BY_MIME: Record<
  (typeof ALLOWED_UPLOAD_TYPES)[number],
  string
> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export function validateUploadMeta(file: {
  name: string;
  type: string;
  size: number;
}) {
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type as (typeof ALLOWED_UPLOAD_TYPES)[number])) {
    return "Yalnızca JPG, PNG, WEBP veya PDF yüklenebilir";
  }
  if (file.size > 8 * 1024 * 1024) {
    return "Dosya boyutu 8MB’ı aşamaz";
  }
  return null;
}
