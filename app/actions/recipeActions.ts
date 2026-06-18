'use server';

import { RECIPES_DB, Recipe } from '@/data/recipes';

export async function fetchRecipesAction(
  offset: number = 0,
  limit: number = 9,
  category?: string,
  search?: string
): Promise<{ recipes: Recipe[]; hasMore: boolean }> {
  let list = [...RECIPES_DB];

  // Filter by category if matched standard categories
  if (category && category !== 'All') {
    list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by text search if provided
  if (search && search.trim() !== '') {
    const term = search.toLowerCase().trim();
    list = list.filter(r => 
      r.title.toLowerCase().includes(term) || 
      r.description.toLowerCase().includes(term) ||
      r.ingredients.some(i => i.toLowerCase().includes(term))
    );
  }

  const sliced = list.slice(offset, offset + limit);
  const hasMore = offset + limit < list.length;

  // Add artificial culinary pipeline delay for realistic UX transitions
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    recipes: sliced,
    hasMore
  };
}
