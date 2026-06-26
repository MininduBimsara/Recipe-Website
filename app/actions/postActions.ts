'use server';

import { BLOG_POSTS_DB } from '@/data/blogs';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { ExtendedBlogPost } from '@/lib/preseededPool';

export async function fetchPostsAction(
  offset: number = 0,
  limit: number = 6,
  category?: string
): Promise<{ posts: ExtendedBlogPost[]; hasMore: boolean; totalCount: number }> {

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('is_published', true);

      if (category && category !== 'All') {
        query = query.ilike('category', `%${category}%`);
      }

      // Order by published_at DESC, fallback to created_at DESC
      query = query
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      if (data) {
        const mappedPosts: ExtendedBlogPost[] = data.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          summary: p.subtitle || p.body?.slice(0, 150) || '',
          category: p.category ? (p.category.charAt(0).toUpperCase() + p.category.slice(1).toLowerCase()) as any : 'Techniques',
          readTime: p.reading_time_minutes ? `${p.reading_time_minutes} mins read` : '5 mins read',
          image: p.cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
          is_published: !!p.is_published,
          status: p.status || (p.is_published ? 'published' : 'draft'),
          created_at: p.created_at,
          date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently',
          author: 'Chef Alexandre Dumas',
          content: p.body ? [p.body] : []
        }));

        const hasMore = count !== null ? (offset + limit < count) : false;

        return {
          posts: mappedPosts,
          hasMore,
          totalCount: count || 0
        };
      }
    } catch (e) {
      console.warn('[fetchPostsAction] Supabase failure, falling back to local database:', e);
    }
  }

  // Local fallback
  let list = [...BLOG_POSTS_DB].map((p: any) => ({
    ...p,
    summary: p.summary || p.subtitle || '',
    readTime: p.readTime || (p.readingTimeMinutes ? `${p.readingTimeMinutes} mins read` : '5 mins read'),
    image: p.image || p.coverImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    is_published: true,
    status: 'published',
    created_at: p.publishedAt,
    date: p.date || (p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'),
    author: p.author?.name || 'Chef Alexandre Dumas'
  }));

  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  const sliced = list.slice(offset, offset + limit);
  const hasMore = offset + limit < list.length;

  return {
    posts: sliced,
    hasMore,
    totalCount: list.length
  };
}
