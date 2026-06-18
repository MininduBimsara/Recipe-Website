'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Returns the current authenticated user if they are the designated admin.
 * Throws / returns null otherwise. Use at the top of every mutating Server Action.
 */
export async function requireAdminSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId) {
    console.error('[Security] ADMIN_USER_ID env var is not set.');
    return null;
  }

  if (error || !user || user.id !== adminUserId) {
    return null;
  }
  return user;
}

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

    // Verify the authenticated user is the designated admin
    const adminUserId = process.env.ADMIN_USER_ID;
    if (!adminUserId || data.user?.id !== adminUserId) {
      await supabase.auth.signOut();
      return { success: false, error: 'Unauthorized: You are not the designated administrator.' };
    }

    return { success: true, session: data.session };
  } catch (err: any) {
    return { success: false, error: 'An error occurred during authentication.' };
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
