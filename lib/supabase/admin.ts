import { createClient } from '@supabase/supabase-js'

export function isSupabaseAdminConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
         (!!process.env.SUPABASE_SECRET_KEY || !!process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY ||
                         process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecret) {
    throw new Error(
      '[Supabase Admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY. Check your .env.local file.'
    );
  }

  return createClient(supabaseUrl, supabaseSecret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

