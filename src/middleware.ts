import { NextResponse, type NextRequest } from "next/server";
import { SITE } from "@/lib/constants";

// Canonical production domain is the apex (no "www"), e.g. "petloog.com".
const APEX_HOST = new URL(SITE.url).hostname;
const WWW_HOST = `www.${APEX_HOST}`;

function isLocalHost(host: string | null): boolean {
  if (!host) return true;
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.endsWith(".local")
  );
}

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host");
  const hostname = hostHeader?.split(":")[0]?.toLowerCase() ?? "";

  // Permanent www -> apex redirect. Preserves pathname + query string via
  // nextUrl.clone(). Only ever matches the exact "www" host, so it can't
  // loop, and never fires for local/dev hosts.
  if (hostname === WWW_HOST && !isLocalHost(hostHeader)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = APEX_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  const isProd = process.env.NODE_ENV === "production";
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // 'unsafe-eval' is only needed for `next dev`'s eval-based Fast
      // Refresh/HMR runtime — the production build never eval()s script,
      // so it's dropped there to keep the CSP's XSS protection meaningful.
      `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self' https://maps.google.com https://www.google.com",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  );

  if (isProd && !isLocalHost(request.headers.get("host"))) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  const cfRay = request.headers.get("cf-ray");
  if (cfRay) response.headers.set("X-Request-Id", cfRay);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
