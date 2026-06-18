import { createClient } from '@supabase/supabase-js'

export function isSupabaseAdminConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
         (!!process.env.SUPABASE_SECRET_KEY || !!process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-db.supabase.co';
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY || 
                         process.env.SUPABASE_SERVICE_ROLE_KEY || 
                         'sb_secret_placeholder_signature_key';
  
  return createClient(supabaseUrl, supabaseSecret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
