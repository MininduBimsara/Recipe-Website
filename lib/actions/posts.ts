'use server'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPostAction(postData: any) {
  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true, data: postData };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/blog');
    revalidatePath('/');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error creating blog post in Supabase.' };
  }
}

export async function updatePostAction(id: string, postData: any) {
  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true, data: postData };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(`/blog/${postData.slug || ''}`);
    revalidatePath('/blog');
    revalidatePath('/');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error updating blog post.' };
  }
}

export async function deletePostAction(id: string) {
  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/blog');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error deleting blog post.' };
  }
}

export async function togglePublishPostAction(id: string, isPublished: boolean) {
  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('blog_posts')
      .update({
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/blog');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error updating post state.' };
  }
}
