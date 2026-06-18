'use client';

import React, { useState } from 'react';
import { ChefHat, Search, SlidersHorizontal } from 'lucide-react';
import { Recipe, RecipeCategory } from '@/types/pinterestBlogSchema';
import RecipeCard from './RecipeCard';

interface RecipeGridProps {
  initialRecipes: Recipe[];
  onOpenDetail?: (recipe: Recipe) => void;
}

export default function RecipeGrid({ initialRecipes, onOpenDetail }: RecipeGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', ...Object.values(RecipeCategory)];

  const filteredRecipes = initialRecipes.filter((recipe) => {
    const matchesCategory = selectedCategory === 'ALL' || recipe.category === selectedCategory;
    const matchesSearch = 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8" id="recipe-grid-stage">
      {/* Category selector and Search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-cream-dark pb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-espresso-light mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-sage" /> Filters:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-espresso text-cream border-espresso shadow-xs'
                  : 'bg-white border-cream-dark text-stone-600 hover:border-sage hover:text-espresso'
              }`}
            >
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative max-w-md w-full">
          <input
            type="search"
            placeholder="Search gourmets, ingredients, cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-sans bg-white border border-cream-dark rounded-xl pl-9 pr-6 py-2.5 focus:outline-hidden focus:border-terracotta focus:ring-1 focus:ring-terracotta/40 placeholder:text-stone-400"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
        </div>
      </div>

      {/* Grid Display */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-cream-light border border-dashed border-cream-dark rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-cream-dark flex items-center justify-center text-stone-400">
            <ChefHat className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h4 className="font-serif font-semibold text-espresso text-lg">No recipes found</h4>
            <p className="text-xs text-stone-400 font-sans">
              We couldn&apos;t find any recipes matching your specific filters & queries. Let&apos;s try adjusting the keywords.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
