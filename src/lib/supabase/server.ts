import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/client";

// The site never uses the Supabase service role key. The only Supabase
// access left is anon-key based: /auth/confirm (e-mail confirmation) and
// reading published blog posts. RLS on blog_posts only exposes published
// rows to the anon key, so a query that forgets a status filter can't leak
// a draft.
export function getSupabasePublicServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!isSupabaseConfigured()) return null;

  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
