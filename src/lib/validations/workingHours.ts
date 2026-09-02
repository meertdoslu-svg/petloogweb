import { z } from "zod";

// Same day-key convention and {open,close,closed} shape as the production
// `merchants.working_hours` JSONB column (see petloog main app migration
// 127_sprint18_market_getir_discovery.sql / 189_merchant_working_hours_closed_day.sql).
// An application approved from here is expected to feed a real merchant/vet
// row later, so matching the shape up front avoids a translation step.
export const WORKING_DAYS = [
  { key: "pzt", label: "Pazartesi" },
  { key: "sal", label: "Salı" },
  { key: "car", label: "Çarşamba" },
  { key: "per", label: "Perşembe" },
  { key: "cum", label: "Cuma" },
  { key: "cmt", label: "Cumartesi" },
  { key: "paz", label: "Pazar" },
] as const;

export type WorkingDayKey = (typeof WORKING_DAYS)[number]["key"];

// 30-minute slots, 08:00–23:30 (matches the spec's example range).
export const TIME_SLOTS: string[] = Array.from({ length: 32 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
});

const timeSlotSchema = z.enum(TIME_SLOTS as [string, ...string[]]);

const daySchema = z
  .object({
    closed: z.boolean(),
    open: timeSlotSchema.optional(),
    close: timeSlotSchema.optional(),
  })
  .refine((day) => day.closed || (day.open && day.close), {
    message: "Açık günlerde açılış ve kapanış saati seçin",
  })
  .refine(
    (day) => day.closed || !day.open || !day.close || day.open < day.close,
    { message: "Kapanış saati açılış saatinden sonra olmalı" },
  );

export const workingHoursSchema = z
  .object({
    pzt: daySchema,
    sal: daySchema,
    car: daySchema,
    per: daySchema,
    cum: daySchema,
    cmt: daySchema,
    paz: daySchema,
  })
  .refine((hours) => WORKING_DAYS.some(({ key }) => !hours[key].closed), {
    message: "En az bir çalışma günü seçin",
  });

export type WorkingHours = z.infer<typeof workingHoursSchema>;

export const DEFAULT_WORKING_HOURS: WorkingHours = WORKING_DAYS.reduce(
  (acc, { key }) => {
    acc[key] = { closed: key === "paz", open: "09:00", close: "18:00" };
    return acc;
  },
  {} as WorkingHours,
);

// Human-readable fallback string, used only to keep legacy text columns
// populated where a schema still requires text (nothing in this app reads
// it back — the structured JSONB is the source of truth).
export function workingHoursToDisplayText(hours: WorkingHours): string {
  return WORKING_DAYS.map(({ key, label }) => {
    const day = hours[key];
    return day.closed ? `${label} Kapalı` : `${label} ${day.open}–${day.close}`;
  }).join(", ");
}
