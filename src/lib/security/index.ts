type RateBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateBucket>();

export function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("cf-connecting-ip") || headers.get("x-real-ip") || "unknown";
}

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  current.count += 1;
  buckets.set(key, current);
  return { ok: true, remaining: limit - current.count };
}

export function sanitizeText(input: string) {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

// Vercel captures stdout/stderr as Function Logs — this is a private,
// server-only surface (never returned to the client), so it's always safe
// and necessary to log here, including in production. Previously this only
// logged outside production, which meant a real production incident left
// zero trace anywhere. Callers must keep `meta` free of secrets/PII (no
// keys, tokens, full document contents, or raw IBAN — see call sites).
export function auditLog(event: string, meta: Record<string, unknown> = {}) {
  const payload = {
    event,
    at: new Date().toISOString(),
    ...meta,
  };
  const isFailure = /failed|error|crash/i.test(event);
  if (isFailure) {
    console.error("[audit]", payload);
  } else {
    console.info("[audit]", payload);
  }
  return payload;
}

/**
 * Production must fail closed: if a required server dependency (Supabase)
 * isn't configured, the API must return an error rather than pretend a
 * submission was saved. Non-production environments may stay
 * developer-friendly (see call sites) since there's no real data to lose.
 */
export function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

export function securityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-XSS-Protection": "0",
  };
}
