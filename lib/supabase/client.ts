import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
  // Preferred keys (as provided by user / .env):
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_PUBLISH_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_PUBLISH_KEY (or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY).'
    );
  }
  return createClient(url, anonKey);
}

