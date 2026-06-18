'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { useRecentlyViewed } from './useRecentlyViewed';
import { RECIPES_DB } from '@/data/recipes';

interface RecentlyViewedStripProps {
  currentSlug?: string;
}

export default function RecentlyViewedStrip({ currentSlug }: RecentlyViewedStripProps) {
  const { recentlyViewed, addRecentlyViewed } = useRecentlyViewed();

  // If we are on a recipe detail page with a currentSlug, add it to history
  useEffect(() => {
    if (currentSlug) {
      addRecentlyViewed(currentSlug);
    }
  }, [currentSlug, addRecentlyViewed]);

  // Map slugs to full recipe objects from DB
  const listToRender = recentlyViewed
    .filter((slug) => slug !== currentSlug) // exclude current page
    .map((slug) => RECIPES_DB.find((r) => r.slug === slug))
    .filter((recipe): recipe is NonNullable<typeof recipe> => !!recipe);

  if (listToRender.length === 0) return null;

  return (
    <div className="pt-8 border-t border-cream-dark dark:border-stone-850 space-y-4 text-left print:hidden" id="recently-viewed-strip">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-sage" />
        <span className="font-mono text-[10px] tracking-widest text-stone-500 dark:text-stone-400 font-bold uppercase block">
          • RECENTLY VISITED fórmulaS
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-cream-dark scrollbar-track-transparent snap-x">
        {listToRender.map((recipe) => (
          <Link
            key={recipe.slug}
            href={`/recipes/${recipe.slug}`}
            className="flex-shrink-0 w-64 bg-white dark:bg-[#252525] border border-cream-dark/50 dark:border-stone-800 rounded-2xl overflow-hidden hover:shadow-md transition-all group snap-start"
          >
            <div className="relative h-32 w-full overflow-hidden bg-cream/10">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="256px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2.5 left-2.5 text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-1 rounded bg-[#1A1A1A]/60 backdrop-blur-xs text-white">
                {recipe.category}
              </span>
            </div>
            
            <div className="p-3.5 space-y-2">
              <h5 className="font-serif font-bold text-xs text-espresso dark:text-cream leading-snug line-clamp-1 group-hover:text-terracotta dark:group-hover:text-terracotta-light transition-colors">
                {recipe.title}
              </h5>
              
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-stone-500 dark:text-stone-400 font-semibold uppercase">
                <Clock className="w-3 h-3 text-sage" />
                <span>{recipe.prepTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
