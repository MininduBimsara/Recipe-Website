'use server'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInAction(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    // Local fallback mode: simple cookie-based authentication
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@savorykitchen.com';
    if (email === adminEmail && password === 'savory123') {
      const cookieStore = await cookies();
      cookieStore.set('savory_admin_session', 'true', { maxAge: 60 * 60 * 24 });
      return { success: true, local: true };
    }
    return { success: false, error: 'Incorrect credentials for offline fallback mode (try email: admin@savorykitchen.com, pass: savory123)' };
  }

  try {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, session: data.session };
  } catch (err: any) {
    return { success: false, error: err.message || 'An error occurred during authentication.' };
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('savory_admin_session');

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Supabase signout failed:', err);
    }
  }

  redirect('/admin/login');
}
