'use server';

import { RECIPES_DB, Recipe } from '@/data/recipes';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function fetchRecipesAction(
  offset: number = 0,
  limit: number = 12,
  category?: string,
  search?: string,
  cuisine?: string,
  diet?: string,
  pantry?: string
): Promise<{ recipes: Recipe[]; hasMore: boolean; totalCount: number }> {
  
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('recipes')
        .select('*', { count: 'exact' })
        .eq('is_published', true);

      // 1. Category Filter (Case-insensitive matching singular/plural)
      if (category && category !== 'All') {
        let catPattern = category.toLowerCase();
        if (catPattern.endsWith('s')) {
          catPattern = catPattern.slice(0, -1); // "desserts" -> "dessert"
        }
        query = query.ilike('category', `%${catPattern}%`);
      }

      // 2. Cuisine Filter
      if (cuisine && cuisine !== 'All') {
        query = query.ilike('cuisine', `%${cuisine}%`);
      }

      // 3. Search Phrase Filter
      if (search && search.trim() !== '') {
        const term = search.trim();
        query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
      }

      // 4. Dietary Preferences Filter
      if (diet && diet !== 'All') {
        const d = diet.toLowerCase();
        if (d === 'vegetarian') {
          query = query.or('tags.cs.{"vegetarian"},category.ilike.%vegetarian%');
        } else if (d === 'vegan') {
          query = query.or('tags.cs.{"vegan"},tags.cs.{"plant-based"}');
        } else if (d === 'gluten-free') {
          query = query.or('tags.cs.{"gluten-free"},tags.cs.{"gf"}');
        } else if (d === 'low-carb') {
          query = query.or('tags.cs.{"low-carb"},tags.cs.{"keto"}');
        } else if (d === 'keto') {
          query = query.contains('tags', ['keto']);
        } else if (d === 'dairy-free') {
          query = query.contains('tags', ['dairy-free']);
        }
      }

      // Pagination Range & Order (Chronological descending)
      query = query
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      if (data) {
        // Map database cover_image/times to frontend Recipe format
        const mappedRecipes: Recipe[] = data.map((r: any) => {
          // Parse steps
          const instructions = Array.isArray(r.instructions)
            ? r.instructions.map((step: any) => typeof step === 'string' ? step : step.body || '')
            : [];
          
          return {
            id: r.id,
            slug: r.slug,
            title: r.title,
            description: r.description || '',
            category: r.category ? (r.category.charAt(0).toUpperCase() + r.category.slice(1).toLowerCase()) : 'Culinary',
            prepTime: r.prep_time ? `${r.prep_time} mins` : '15 mins',
            cookTime: r.cook_time ? `${r.cook_time} mins` : '20 mins',
            calories: r.calories || 300,
            difficulty: r.difficulty ? (r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1).toLowerCase()) : 'Easy',
            image: r.cover_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
            size: r.layout_template?.includes('tall') ? 'tall' : r.layout_template?.includes('short') ? 'short' : 'medium',
            ingredients: Array.isArray(r.ingredients) 
              ? r.ingredients.map((ing: any) => typeof ing === 'string' ? ing : `${ing.quantity || ''} ${ing.unit || ''} ${ing.name || ''} ${ing.notes || ''}`.trim())
              : [],
            instructions: instructions,
            tips: Array.isArray(r.chef_secrets) ? r.chef_secrets : [],
            pinterestDescription: r.pinterest_description || '',
            recipeCuisine: r.cuisine || '',
            tags: r.tags || [],
            author: 'Chef Alexandre Dumas'
          } as Recipe;
        });

        // Pantry filtering done post-query if pantry exists
        let finalRecipes = mappedRecipes;
        if (pantry && pantry.trim() !== '') {
          const pantryItems = pantry.toLowerCase().split(',').map(item => item.trim()).filter(Boolean);
          if (pantryItems.length > 0) {
            finalRecipes = mappedRecipes.filter(recipe => {
              const recipeIngredientsJoined = recipe.ingredients.join(' ').toLowerCase();
              return pantryItems.some(item => recipeIngredientsJoined.includes(item));
            });
          }
        }

        const hasMore = count !== null ? (offset + limit < count) : false;

        return {
          recipes: finalRecipes,
          hasMore,
          totalCount: count || 0
        };
      }
    } catch (e) {
      console.warn('[fetchRecipesAction] Supabase failure, falling back to local database:', e);
    }
  }

  // Local fallback
  let list = [...RECIPES_DB];

  // Category match
  if (category && category !== 'All') {
    list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  // Cuisine match
  if (cuisine && cuisine !== 'All') {
    list = list.filter(r => (r.recipeCuisine || '').toLowerCase().includes(cuisine.toLowerCase()));
  }

  // Search match
  if (search && search.trim() !== '') {
    const term = search.toLowerCase().trim();
    list = list.filter(r => 
      r.title.toLowerCase().includes(term) || 
      r.description.toLowerCase().includes(term) ||
      r.ingredients.some(i => i.toLowerCase().includes(term))
    );
  }

  // Diet match
  if (diet && diet !== 'All') {
    const dietQuery = diet.toLowerCase();
    list = list.filter(recipe => {
      const tagsJoined = (recipe.tags || []).join(' ').toLowerCase();
      const catQuery = recipe.category.toLowerCase();
      
      let match = false;
      if (dietQuery === 'vegetarian' && (tagsJoined.includes('vegetarian') || catQuery === 'vegetarian')) match = true;
      if (dietQuery === 'vegan' && (tagsJoined.includes('vegan') || tagsJoined.includes('plant-based'))) match = true;
      if (dietQuery === 'gluten-free' && (tagsJoined.includes('gluten-free') || tagsJoined.includes('gf'))) match = true;
      if (dietQuery === 'low-carb' && (tagsJoined.includes('low-carb') || tagsJoined.includes('keto'))) match = true;
      if (dietQuery === 'keto' && tagsJoined.includes('keto')) match = true;
      if (dietQuery === 'dairy-free' && tagsJoined.includes('dairy-free')) match = true;
      return match;
    });
  }

  // Pantry match
  if (pantry && pantry.trim() !== '') {
    const pantryItems = pantry.toLowerCase().split(',').map(item => item.trim()).filter(Boolean);
    if (pantryItems.length > 0) {
      list = list.filter(recipe => {
        const recipeIngredientsJoined = recipe.ingredients.join(' ').toLowerCase();
        return pantryItems.some(item => recipeIngredientsJoined.includes(item));
      });
    }
  }

  const sliced = list.slice(offset, offset + limit);
  const hasMore = offset + limit < list.length;

  return {
    recipes: sliced,
    hasMore,
    totalCount: list.length
  };
}
