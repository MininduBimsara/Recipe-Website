'use client';

import React from 'react';
import Image from 'next/image';
import { getBlurDataURL } from '@/lib/placeholder';
import { Heart, Clock, Flame, Award } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { useTilt } from '@/hooks/useTilt';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'react-hot-toast';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const { ref, style, handleMouseMove, handleMouseLeave } = useTilt(10);
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
    if (!saved) {
      toast.success('Saved to your collection ♥', {
        style: {
          background: '#FFEBEA',
          color: '#D4704A',
          border: '1px solid #E59A7E',
        },
        icon: '❤️',
      });
    } else {
      toast(`Removed "${recipe.title}" from collection`);
    }
  };

  // Map arbitrary size into visual classes for Masonry
  const sizeClasses = {
    short: 'h-52 sm:h-60',
    medium: 'h-68 sm:h-76',
    tall: 'h-84 sm:h-[26rem]'
  };

  const getDifficultyColor = (diff: Recipe['difficulty']) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-100 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-450';
      case 'Medium': return 'bg-honey-light/20 text-honey-dark dark:bg-honey/10 dark:text-honey-light';
      case 'Hard': return 'bg-terracotta-light/20 text-terracotta-dark dark:bg-terracotta/10 dark:text-terracotta-light';
    }
  };

  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(recipe)}
      className="break-inside-avoid mb-6 group relative bg-white dark:bg-[#252525] border border-cream-dark dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-shadow cursor-pointer flex flex-col w-full"
      style-id={`recipe-card-${recipe.id}`}
    >
      
      {/* 1. IMAGE CONTAINER with dynamic heights */}
      <div className={`relative w-full overflow-hidden ${sizeClasses[recipe.size]} shrink-0 bg-cream/10`}>
        <Image
          src={recipe.image}
          alt={`${recipe.title} - ${recipe.description || 'delicious food recipe representation'}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          priority={recipe.id === '1' || recipe.id === '2'}
          placeholder="blur"
          blurDataURL={getBlurDataURL(recipe.image)}
        />

        {/* Solid Category Badge for accessibility contrast (top-left) */}
        <span className="absolute top-4 left-4 text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-white/90 dark:bg-stone-900/95 text-espresso dark:text-cream border border-cream-dark dark:border-stone-800 shadow-sm">
          {recipe.category}
        </span>

        {/* Dynamic Save Heart Icon Link (fades in on hover) */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-center border border-[#FAF7F2]/20 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:text-terracotta dark:hover:text-terracotta md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-xs focus:opacity-100"
          title={saved ? "Unpin recipe" : "Pin recipe"}
        >
          <Heart className={`w-4 h-4 transition-transform ${saved ? 'fill-terracotta text-terracotta scale-110' : 'group-hover:scale-105'}`} />
        </button>

        {/* Ambient overlay curtain at base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* 2. BODY TEXT DETAIL CONTAINER */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        
        {/* Title and Editorial description */}
        <div className="space-y-1.5">
          <h3 className="font-serif font-bold text-lg leading-snug text-espresso dark:text-cream group-hover:text-terracotta dark:group-hover:text-terracotta transition-colors line-clamp-2">
            {recipe.title}
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Micro-Metadata chips list */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cream/50 dark:border-stone-800">
          
          {/* Prep time chip */}
          <div className="flex items-center gap-1 bg-cream dark:bg-stone-850 px-2.5 py-1 rounded-full text-[10px] font-mono text-stone-700 dark:text-stone-300 font-bold uppercase">
            <Clock className="w-3 h-3 text-sage" />
            <span>{recipe.prepTime}</span>
          </div>

          {/* Difficulty badge */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${getDifficultyColor(recipe.difficulty)}`}>
            <Award className="w-3 h-3 shrink-0" />
            <span>{recipe.difficulty}</span>
          </div>

          {/* Calorie count */}
          <div className="flex items-center gap-1 bg-cream dark:bg-stone-850 px-2.5 py-1 rounded-full text-[10px] font-mono text-stone-700 dark:text-stone-300 font-bold uppercase ml-auto">
            <Flame className="w-3 h-3 text-terracotta" />
            <span>{recipe.calories} kcal</span>
          </div>
          
        </div>

      </div>

    </div>
  );
}
