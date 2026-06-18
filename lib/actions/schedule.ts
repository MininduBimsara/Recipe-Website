'use server';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

/**
 * Normalizes local datetime string in authors timezone to UTC ISO String
 */
export async function convertLocalToUtcAction(localDateTime: string, timezone: string): Promise<string> {
  // Input: "2026-06-25T14:30"
  const formattedInput = localDateTime.replace(' ', 'T'); 
  const zonedDate = fromZonedTime(formattedInput, timezone);
  return zonedDate.toISOString();
}

/**
 * Normalizes UTC ISO String back to a local datetime string for input editing
 */
export async function convertUtcToLocalAction(utcString: string, timezone: string): Promise<string> {
  const utcDate = new Date(utcString);
  const zoned = toZonedTime(utcDate, timezone);
  
  const year = zoned.getFullYear();
  const month = String(zoned.getMonth() + 1).padStart(2, '0');
  const day = String(zoned.getDate()).padStart(2, '0');
  const hour = String(zoned.getHours()).padStart(2, '0');
  const min = String(zoned.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hour}:${min}`;
}

/**
 * Returns combined list of all recipes and blog posts with their status and publish dates
 */
export async function getScheduleBacklogAction() {
  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true, queue: [] };
  }

  try {
    const supabase = await createClient();

    // Query both tables
    const { data: recipes, error: err1 } = await supabase
      .from('recipes')
      .select('id, title, slug, is_published, published_at, scheduled_for, status, category');

    const { data: posts, error: err2 } = await supabase
      .from('blog_posts')
      .select('id, title, slug, is_published, published_at, scheduled_for, status, category');

    if (err1 || err2) {
      throw new Error((err1?.message || '') + ' ' + (err2?.message || ''));
    }

    // Combine and normalize structures
    const unified = [
      ...(recipes || []).map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        type: 'recipe' as const,
        category: r.category,
        is_published: !!r.is_published,
        published_at: r.published_at,
        scheduled_for: r.scheduled_for,
        status: r.status || (r.is_published ? 'published' : 'draft'),
      })),
      ...(posts || []).map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: 'blog' as const,
        category: p.category,
        is_published: !!p.is_published,
        published_at: p.published_at,
        scheduled_for: p.scheduled_for,
        status: p.status || (p.is_published ? 'published' : 'draft'),
      })),
    ];

    return { success: true, queue: unified };
  } catch (err: any) {
    console.error('getScheduleBacklogAction error:', err);
    return { success: false, error: err.message || 'Error querying scheduling calendar backlog.' };
  }
}

/**
 * Updates a recipe or post's release configuration (Draft, Scheduled or Published)
 */
export async function updateReleaseScheduleAction(
  type: 'recipe' | 'blog',
  id: string,
  payload: {
    status: 'draft' | 'scheduled' | 'published';
    scheduled_at_utc?: string | null;
  }
) {
  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true };
  }

  try {
    const supabase = await createClient();
    const table = type === 'recipe' ? 'recipes' : 'blog_posts';

    const updates: any = {};
    
    if (payload.status === 'draft') {
      updates.status = 'draft';
      updates.is_published = false;
      updates.scheduled_for = null;
    } else if (payload.status === 'scheduled') {
      updates.status = 'scheduled';
      updates.is_published = false;
      updates.scheduled_for = payload.scheduled_at_utc || null;
    } else if (payload.status === 'published') {
      updates.status = 'published';
      updates.is_published = true;
      updates.scheduled_for = null;
      updates.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/blog');
    revalidatePath('/recipes');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error updating release schedules.' };
  }
}

/**
 * Auto-publish runner simulation helper
 * Scans for items that are 'scheduled' and scheduled_for <= NOW, and publishes them immediately.
 */
export async function runAutoPublishSimulationAction() {
  if (!isSupabaseConfigured()) {
    return { success: true, message: 'Supabase is not configured. Simulation succeeded locally.' };
  }

  try {
    const supabase = await createClient();
    const nowString = new Date().toISOString();

    // 1. Fetch scheduled recipes ready for release
    const { data: recipes, error: err1 } = await supabase
      .from('recipes')
      .select('id')
      .eq('status', 'scheduled')
      .lte('scheduled_for', nowString);

    // 2. Fetch scheduled posts ready for release
    const { data: posts, error: err2 } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('status', 'scheduled')
      .lte('scheduled_for', nowString);

    if (err1 || err2) {
      throw new Error('Simulation scan failed: ' + (err1?.message || '') + ' ' + (err2?.message || ''));
    }

    let publishedCount = 0;

    // Publish recipes
    if (recipes && recipes.length > 0) {
      const ids = recipes.map((r) => r.id);
      const { error } = await supabase
        .from('recipes')
        .update({
          status: 'published',
          is_published: true,
          scheduled_for: null,
          published_at: nowString,
        })
        .in('id', ids);

      if (error) throw error;
      publishedCount += ids.length;
    }

    // Publish blog posts
    if (posts && posts.length > 0) {
      const ids = posts.map((p) => p.id);
      const { error } = await supabase
        .from('blog_posts')
        .update({
          status: 'published',
          is_published: true,
          scheduled_for: null,
          published_at: nowString,
        })
        .in('id', ids);

      if (error) throw error;
      publishedCount += ids.length;
    }

    revalidatePath('/blog');
    revalidatePath('/recipes');
    revalidatePath('/');

    return { 
      success: true, 
      publishedCount, 
      message: `Successfully released ${publishedCount} scheduled items to the public gazette!` 
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Auto-publish routine crashed.' };
  }
}
