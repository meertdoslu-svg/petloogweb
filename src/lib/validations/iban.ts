// Turkish IBAN normalization + validation (format + MOD-97 checksum).

export function normalizeIban(raw: string): string {
  return raw.replace(/\s+/g, "").toUpperCase();
}

const TR_IBAN_FORMAT = /^TR[0-9]{24}$/;

export function isValidTrIbanFormat(iban: string): boolean {
  return TR_IBAN_FORMAT.test(normalizeIban(iban));
}

// ISO 7064 MOD-97-10 check: move the first 4 chars to the end, convert each
// letter to two digits (A=10 ... Z=35), then the resulting decimal string
// must be congruent to 1 mod 97. Computed digit-by-digit to avoid needing
// BigInt for a ~34-digit number.
export function isValidIbanChecksum(iban: string): boolean {
  const normalized = normalizeIban(iban);
  if (normalized.length < 4) return false;

  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  let numeric = "";
  for (const char of rearranged) {
    if (char >= "0" && char <= "9") {
      numeric += char;
    } else if (char >= "A" && char <= "Z") {
      numeric += String(char.charCodeAt(0) - 55);
    } else {
      return false;
    }
  }

  let remainder = 0;
  for (const digit of numeric) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

export function isValidTrIban(raw: string): boolean {
  const iban = normalizeIban(raw);
  return isValidTrIbanFormat(iban) && isValidIbanChecksum(iban);
}

// "TR12 3456 7890 1234 5678 9012 34" — grouped in 4s for display in inputs.
export function formatIbanForDisplay(raw: string): string {
  const normalized = normalizeIban(raw);
  return normalized.replace(/(.{4})/g, "$1 ").trim();
}

// "TR12 **** **** **** **** **12 34" — first 4 and last 4 characters
// visible, everything between masked, then re-grouped in 4s for display
// (the last-4-visible boundary doesn't land on a group edge, which is why
// the tail reads "**12 34" rather than "**** 1234").
export function maskIban(raw: string): string {
  const normalized = normalizeIban(raw);
  if (normalized.length !== 26) return normalized;
  const masked =
    normalized.slice(0, 4) +
    "*".repeat(normalized.length - 8) +
    normalized.slice(-4);
  return masked.replace(/(.{4})/g, "$1 ").trim();
}
