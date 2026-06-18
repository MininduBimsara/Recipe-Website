'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInAction(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user?.id !== 'c7fdab45-32f0-4b92-8d21-6fe025e431d7') {
      await supabase.auth.signOut();
      return { success: false, error: 'Unauthorized: You are not the designated administrator.' };
    }

    return { success: true, session: data.session };
  } catch (err: any) {
    return { success: false, error: err.message || 'An error occurred during authentication.' };
  }
}

export async function signOutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Supabase signout failed:', err);
  }

  redirect('/admin/login');
}
