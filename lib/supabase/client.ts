import { createBrowserClient } from '@supabase/ssr'

export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
         (!!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Check your .env.local file.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

