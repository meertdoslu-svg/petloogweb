"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthConfirmResult } from "@/components/auth/AuthConfirmResult";

// Defensive fallback only: the confirmation link is expected to carry
// ?token_hash=&type= (verified server-side in page.tsx). But if this
// project's email template still uses Supabase's default
// {{ .ConfirmationURL }} (implicit flow), the session tokens instead
// arrive in the URL *fragment* (#access_token=...&refresh_token=...),
// which is never sent to the server — only the browser can see it. This
// component only ever runs when the server saw no recognizable query
// params at all.
export function AuthConfirmHashFallback() {
  const [status, setStatus] = useState<"checking" | "success" | "error">(
    "checking",
  );

  useEffect(() => {
    const rawHash = window.location.hash;
    // Clear the fragment from the visible URL/history immediately — it can
    // contain live tokens and must not linger in the address bar or be
    // re-sent on refresh.
    window.history.replaceState(null, "", window.location.pathname);

    if (!rawHash || rawHash.length < 2) {
      setStatus("error");
      return;
    }

    const hashParams = new URLSearchParams(rawHash.slice(1));
    if (hashParams.get("error") || hashParams.get("error_code")) {
      setStatus("error");
      return;
    }

    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    if (!accessToken || !refreshToken) {
      setStatus("error");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      return;
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        setStatus(error ? "error" : "success");
      });
  }, []);

  if (status === "checking") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-[28px] bg-surface p-10 text-center shadow-[var(--shadow-card)]">
        <p className="text-sm font-semibold text-primary/60">Doğrulanıyor...</p>
      </div>
    );
  }

  return <AuthConfirmResult status={status} />;
}
