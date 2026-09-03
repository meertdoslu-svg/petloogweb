import type { EmailOtpType } from "@supabase/supabase-js";
import { AuthConfirmHashFallback } from "@/components/auth/AuthConfirmHashFallback";
import { AuthConfirmResult } from "@/components/auth/AuthConfirmResult";
import { auditLog } from "@/lib/security";
import { buildMetadata } from "@/lib/seo";
import { getSupabasePublicServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export const metadata = buildMetadata({
  title: "E-posta Doğrulama",
  description: "PetLoog hesap e-posta doğrulaması.",
  path: "/auth/confirm",
  noIndex: true,
});

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstString(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export default async function AuthConfirmPage({ searchParams }: Props) {
  const params = await searchParams;

  // Supabase's own error redirects (e.g. from the default {{ .ConfirmationURL }}
  // → GoTrue /verify hop) always land here as plain query params — the
  // token itself never reaches us in that case, so there's nothing to log
  // beyond "it failed".
  const errorParam = firstString(params.error);
  if (errorParam) {
    auditLog("auth:confirm_failed", { source: "redirect_error" });
    return (
      <div className="container-site py-14 md:py-20">
        <AuthConfirmResult status="error" />
      </div>
    );
  }

  // The documented, recommended flow for a custom confirmation page:
  // {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=... —
  // verified server-side via a single verifyOtp call. token_hash/type are
  // one-time-use and never logged.
  const tokenHash = firstString(params.token_hash);
  const type = firstString(params.type) as EmailOtpType | undefined;

  if (tokenHash && type) {
    const supabase = getSupabasePublicServerClient();
    if (!supabase) {
      auditLog("auth:confirm_failed", { source: "config_missing", type });
      return (
        <div className="container-site py-14 md:py-20">
          <AuthConfirmResult status="error" />
        </div>
      );
    }

    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

    if (error) {
      auditLog("auth:confirm_failed", { source: "verify_otp", type, code: error.code });
    } else {
      auditLog("auth:confirm_succeeded", { type });
    }

    return (
      <div className="container-site py-14 md:py-20">
        <AuthConfirmResult status={error ? "error" : "success"} />
      </div>
    );
  }

  // Neither a query-param error nor token_hash/type was present. If this
  // project's email template still points at Supabase's default
  // {{ .ConfirmationURL }} (implicit flow), the tokens instead arrive in
  // the URL fragment, which only the browser can read — hand off to a
  // small client component rather than showing a dead end.
  return (
    <div className="container-site py-14 md:py-20">
      <AuthConfirmHashFallback />
    </div>
  );
}
