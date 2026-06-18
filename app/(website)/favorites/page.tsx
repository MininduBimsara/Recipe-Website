'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { useFavorites } from '@/features/favorites/useFavorites';
import { RECIPES_DB, Recipe } from '@/data/recipes';
import RecipeCard from '@/components/RecipeCard';
import RecentlyViewedStrip from '@/features/recentlyViewed/RecentlyViewedStrip';

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    // Map favorites IDs to full RECIPES_DB objects
    const mapped = favorites
      .map((favId) => RECIPES_DB.find((recipe) => recipe.id === favId))
      .filter((recipe): recipe is Recipe => !!recipe);

    setFavoriteRecipes(mapped);
  }, [favorites, isMounted]);

  if (!isMounted) {
    return (
      <div className="w-full min-h-screen py-16 flex items-center justify-center bg-cream-light/25 dark:bg-[#1A1A1A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-t-terracotta border-cream-dark rounded-full animate-spin" />
          <span className="font-mono text-xs text-stone-400">Loading collection archives...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen py-8 md:py-16 bg-cream-light/20 dark:bg-[#1A1A1A] px-6 select-none" id="favorites-page-root">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigation & Title row */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-cream-dark/50 dark:border-stone-850 pb-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase text-stone-505 dark:text-stone-300 hover:text-terracotta dark:hover:text-terracotta-light transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Pantry Board</span>
            </Link>
            
            <span className="font-mono text-[10px] text-stone-400 dark:text-stone-550 font-bold uppercase tracking-widest">
              CURATED COLLECTION
            </span>
          </div>

          <div className="text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-terracotta/10 px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-widest uppercase text-terracotta dark:text-terracotta-light">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{favoriteRecipes.length} SAVED SAVORIES</span>
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-espresso dark:text-cream leading-tight">
              My Recipe Book
            </h1>
            <p className="text-stone-550 dark:text-stone-300 text-sm leading-relaxed max-w-xl font-sans">
              Your handpicked list of bakes, gourmet formulas, and sourdough experiments. Kept private in your browser for instant retrieval in the kitchen.
            </p>
          </div>
        </div>

        {/* Content Body */}
        {favoriteRecipes.length === 0 ? (
          <div className="p-12 sm:p-20 text-center rounded-[2.5rem] border border-dashed border-cream-dark dark:border-stone-850 bg-white dark:bg-[#1E1E1E] space-y-6 max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-cream dark:bg-stone-850 flex items-center justify-center mx-auto text-stone-400 dark:text-stone-550">
              <Heart className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl text-espresso dark:text-cream">
                Nothing saved yet &mdash; start exploring!
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-405 leading-relaxed font-sans max-w-md mx-auto">
                Pin your favorite master formulas, metrics, and case studies while browsing to build your personalized digital bread journal.
              </p>
            </div>

            <Link
              href="/#recipes-section"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-espresso dark:bg-cream hover:bg-terracotta dark:hover:bg-terracotta text-cream dark:text-espresso hover:text-white dark:hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              <span>Explore Master Recipes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full min-h-[300px]">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={(rec) => router.push(`/recipes/${rec.slug}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed strip at bottom */}
        <RecentlyViewedStrip />

      </div>
    </main>
  );
}
