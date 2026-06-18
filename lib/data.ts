import recipesData from '@/data/recipes.json';
import postsData from '@/data/posts.json';
import { Recipe, BlogPost } from '@/types/pinterestBlogSchema';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

// Coerce raw JSON structures to fully compliant TypeScript models
const typedRecipes = recipesData as unknown as Recipe[];
const typedPosts = postsData as unknown as BlogPost[];

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
        return data as unknown as Recipe[];
      }
      console.warn('Supabase getRecipes error, falling back to local dataset:', error?.message);
    } catch (e) {
      console.error('getRecipes connection fallback active:', e);
    }
  }

  return [...typedRecipes].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
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
        return data as unknown as Recipe;
      }
      console.warn('Supabase getRecipeBySlug failed or empty, using local lookup:', error?.message);
    } catch (e) {
      console.error('getRecipeBySlug fallback active:', e);
    }
  }

  return typedRecipes.find((recipe) => recipe.slug === slug);
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
        return data as unknown as Recipe[];
      }
    } catch (e) {
      console.error('getFeaturedRecipes fallback active:', e);
    }
  }

  return typedRecipes.filter((recipe) => recipe.isFeatured);
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
        return data as unknown as Recipe[];
      }
    } catch (e) {
      console.error('getRelatedRecipes fallback active:', e);
    }
  }

  return typedRecipes.filter((recipe) => slugs.includes(recipe.slug));
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
        return data as unknown as BlogPost[];
      }
      console.warn('Supabase getPosts error, falling back to local dataset:', error?.message);
    } catch (e) {
      console.error('getPosts connection fallback active:', e);
    }
  }

  return [...typedPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
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
        return data as unknown as BlogPost;
      }
      console.warn('Supabase getPostBySlug failed or empty, using local lookup:', error?.message);
    } catch (e) {
      console.error('getPostBySlug fallback active:', e);
    }
  }

  return typedPosts.find((post) => post.slug === slug);
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
        return data as unknown as BlogPost[];
      }
    } catch (e) {
      console.error('getRelatedPosts fallback active:', e);
    }
  }

  return typedPosts.filter((post) => slugs.includes(post.slug));
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
  let allRecipes: Recipe[] = [];

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
          items: data as unknown as Recipe[],
          total,
          currentPage: page,
          totalPages,
          hasNextPage: page < totalPages,
        };
      }
    } catch (e) {
      console.error('getPaginatedRecipes Supabase fallback active:', e);
    }
  }

  // Fallback local pagination
  let filtered = [...typedRecipes];
  if (category && category !== 'All') {
    filtered = filtered.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase()
    );
  }

  const offset = (page - 1) * limit;
  const items = filtered.slice(offset, offset + limit);
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
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

  let recipesList = typedRecipes;
  let articlesList = typedPosts;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      // Fetch all published data to apply rich, deep multi-dimensional matching safely
      const [recipesRes, postsRes] = await Promise.all([
        supabase.from('recipes').select('*').eq('is_published', true),
        supabase.from('blog_posts').select('*').eq('is_published', true)
      ]);

      if (!recipesRes.error && recipesRes.data) {
        recipesList = recipesRes.data as unknown as Recipe[];
      }
      if (!postsRes.error && postsRes.data) {
        articlesList = postsRes.data as unknown as BlogPost[];
      }
    } catch (e) {
      console.error('searchContent Supabase fallback active:', e);
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

    // Dietary tag shortcuts (e.g., matching "vegan", "gluten free", "vegetarian")
    let dietaryMatch = false;
    if (tagMatch) {
      dietaryMatch = true;
    }

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
