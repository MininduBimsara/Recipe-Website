'use server'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { requireAdminSession } from '@/lib/actions/auth'
import { revalidatePath } from 'next/cache'

export async function createRecipeAction(recipeData: any) {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: 'Unauthorized' };

  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true, data: recipeData };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('recipes')
      .insert([recipeData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/recipes');
    revalidatePath('/');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error creating recipe in Supabase.' };
  }
}

export async function updateRecipeAction(id: string, recipeData: any) {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: 'Unauthorized' };

  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true, data: recipeData };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('recipes')
      .update(recipeData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(`/recipes/${recipeData.slug || ''}`);
    revalidatePath('/recipes');
    revalidatePath('/');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error updating recipe.' };
  }
}

export async function deleteRecipeAction(id: string) {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: 'Unauthorized' };

  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/recipes');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error deleting recipe.' };
  }
}

export async function togglePublishRecipeAction(id: string, isPublished: boolean) {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: 'Unauthorized' };

  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('recipes')
      .update({
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/recipes');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error updating recipe state.' };
  }
}

