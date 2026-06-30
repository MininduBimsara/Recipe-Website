import { Recipe, BlogPost } from '@/types/pinterestBlogSchema';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

function normalizeDbRecipe(recipe: any): Recipe {
  if (!recipe) return recipe;
  return {
    ...recipe,
    coverImage: recipe.coverImage || recipe.cover_image || '',
    prepTime: recipe.prepTime || (recipe.prep_time ? `${recipe.prep_time} mins` : '15 mins'),
    cookTime: recipe.cookTime || (recipe.cook_time !== undefined ? `${recipe.cook_time} mins` : '0 mins'),
    pinterestDescription: recipe.pinterestDescription || recipe.pinterest_description || '',
    isFeatured: recipe.isFeatured !== undefined ? recipe.isFeatured : (recipe.is_featured || false),
  } as unknown as Recipe;
}

function normalizeDbBlogPost(post: any): BlogPost {
  if (!post) return post;
  
  let content = post.content || [];
  if (content.length === 0 && typeof post.body === 'string' && post.body.trim()) {
    content = post.body
      .split(/\r?\n/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);
  }

  return {
    ...post,
    coverImage: post.coverImage || post.cover_image || '',
    summary: post.summary || post.subtitle || '',
    readTime: post.readTime || (post.reading_time_minutes ? `${post.reading_time_minutes} mins read` : '5 mins read'),
    layoutTemplate: post.layoutTemplate || post.layout_template || 'classic-single',
    content,
  } as unknown as BlogPost;
}

/**
 * Returns all active, structured recipes in chronological order of publish date.
 */
export async function getRecipes(): Promise<Recipe[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!error && data) {
        return data.map(normalizeDbRecipe);
      }
      if (error) console.error('Supabase getRecipes error:', error.message);
    } catch (e) {
      console.error('getRecipes error:', e);
    }
  }
  return [];
}

/**
 * Resolves a single recipe by its unique, search-engine-friendly slug.
 */
export async function getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (!error && data) {
        return normalizeDbRecipe(data);
      }
      if (error) console.error('Supabase getRecipeBySlug error:', error.message);
    } catch (e) {
      console.error('getRecipeBySlug error:', e);
    }
  }
  return undefined;
}

/**
 * Returns all featured gourmet recipes.
 */
export async function getFeaturedRecipes(): Promise<Recipe[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true);

      if (!error && data) {
        return data.map(normalizeDbRecipe);
      }
      if (error) console.error('Supabase getFeaturedRecipes error:', error.message);
    } catch (e) {
      console.error('getFeaturedRecipes error:', e);
    }
  }
  return [];
}

/**
 * Resolves related recipe objects from a slug collection.
 */
export async function getRelatedRecipes(slugs: string[] | undefined): Promise<Recipe[]> {
  if (!slugs || slugs.length === 0) return [];
  
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .in('slug', slugs);

      if (!error && data) {
        return data.map(normalizeDbRecipe);
      }
      if (error) console.error('Supabase getRelatedRecipes error:', error.message);
    } catch (e) {
      console.error('getRelatedRecipes error:', e);
    }
  }
  return [];
}

/**
 * Returns all editorial posts in chronological order of publish date.
 */
export async function getPosts(): Promise<BlogPost[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!error && data) {
        return data.map(normalizeDbBlogPost);
      }
      if (error) console.error('Supabase getPosts error:', error.message);
    } catch (e) {
      console.error('getPosts error:', e);
    }
  }
  return [];
}

/**
 * Resolves a single editorial post by its unique slug.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (!error && data) {
        return normalizeDbBlogPost(data);
      }
      if (error) console.error('Supabase getPostBySlug error:', error.message);
    } catch (e) {
      console.error('getPostBySlug error:', e);
    }
  }
  return undefined;
}

/**
 * Resolves related post objects from a slug collection.
 */
export async function getRelatedPosts(slugs: string[] | undefined): Promise<BlogPost[]> {
  if (!slugs || slugs.length === 0) return [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .in('slug', slugs);

      if (!error && data) {
        return data.map(normalizeDbBlogPost);
      }
      if (error) console.error('Supabase getRelatedPosts error:', error.message);
    } catch (e) {
      console.error('getRelatedPosts error:', e);
    }
  }
  return [];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export async function getPaginatedRecipes(
  page = 1,
  limit = 6,
  category?: string
): Promise<PaginatedResult<Recipe>> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('recipes')
        .select('*', { count: 'exact' })
        .eq('is_published', true);

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query
        .order('published_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        const total = count || data.length;
        const totalPages = Math.ceil(total / limit);
        return {
          items: data.map(normalizeDbRecipe),
          total,
          currentPage: page,
          totalPages,
          hasNextPage: page < totalPages,
        };
      }
      if (error) console.error('Supabase getPaginatedRecipes error:', error.message);
    } catch (e) {
      console.error('getPaginatedRecipes error:', e);
    }
  }

  return {
    items: [],
    total: 0,
    currentPage: page,
    totalPages: 0,
    hasNextPage: false,
  };
}

export interface SearchResults {
  recipes: Recipe[];
  posts: BlogPost[];
}

/**
 * High-performance dual-mode search supporting ingredients, categories, dietary properties, and tag strings.
 */
export async function searchContent(query: string): Promise<SearchResults> {
  const normQuery = query.toLowerCase().trim();
  if (!normQuery) {
    return { recipes: [], posts: [] };
  }

  let recipesList: Recipe[] = [];
  let articlesList: BlogPost[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      // Fetch all published data to apply rich, deep multi-dimensional matching safely
      const [recipesRes, postsRes] = await Promise.all([
        supabase.from('recipes').select('*').eq('is_published', true),
        supabase.from('blog_posts').select('*').eq('is_published', true)
      ]);

      if (!recipesRes.error && recipesRes.data) {
        recipesList = recipesRes.data.map(normalizeDbRecipe);
      }
      if (!postsRes.error && postsRes.data) {
        articlesList = postsRes.data.map(normalizeDbBlogPost);
      }
    } catch (e) {
      console.error('searchContent error:', e);
    }
  }

  // Apply rich structured multi-dimensional client filtering
  const recipes = recipesList.filter((r) => {
    const rAny = r as any;
    const titleMatch = r.title.toLowerCase().includes(normQuery);
    const descMatch = r.description?.toLowerCase().includes(normQuery) || false;
    const categoryMatch = r.category.toLowerCase().includes(normQuery);
    const cuisineMatch = (rAny.recipeCuisine || rAny.cuisine)?.toLowerCase().includes(normQuery) || false;
    const tagMatch = r.tags?.some((tag) => tag.toLowerCase().includes(normQuery)) || false;
    
    // Deep ingredients match (can be string array or object array with name field)
    const ingredientMatch = r.ingredients?.some((ing: any) => {
      const nameStr = typeof ing === 'string' ? ing : (ing.name || '');
      return nameStr.toLowerCase().includes(normQuery);
    }) || false;

    return titleMatch || descMatch || categoryMatch || cuisineMatch || tagMatch || ingredientMatch;
  });

  const posts = articlesList.filter((p) => {
    const pAny = p as any;
    const titleMatch = p.title.toLowerCase().includes(normQuery);
    const subtitleMatch = (pAny.subtitle || pAny.summary)?.toLowerCase().includes(normQuery) || false;
    const summaryMatch = (pAny.summary || pAny.subtitle)?.toLowerCase().includes(normQuery) || false;
    const tagMatch = p.tags?.some((tag) => tag.toLowerCase().includes(normQuery)) || false;
    
    // Support markdown text search
    let bodyMatch = false;
    if (Array.isArray(pAny.content)) {
      bodyMatch = pAny.content.some((c: string) => c.toLowerCase().includes(normQuery));
    } else if (typeof pAny.body === 'string') {
      bodyMatch = pAny.body.toLowerCase().includes(normQuery);
    }

    return titleMatch || subtitleMatch || summaryMatch || tagMatch || bodyMatch;
  });

  return { recipes, posts };
}
