'use client';

import React from 'react';
import Image from 'next/image';
import { getBlurDataURL } from '@/lib/placeholder';
import { Clock, Flame, Award } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { useTilt } from '@/hooks/useTilt';
// import { useFavorites } from '@/hooks/useFavorites';
// import { toast } from 'react-hot-toast';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const { ref, style, handleMouseMove, handleMouseLeave } = useTilt(10);
  // const { isFavorite, toggleFavorite } = useFavorites();
  // const saved = isFavorite(recipe.id);

  // const handleFavoriteClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   toggleFavorite(recipe.id);
  //   if (!saved) {
  //     toast.success('Saved to your collection ♥', {
  //       style: {
  //         background: '#FFEBEA',
  //         color: '#D4704A',
  //         border: '1px solid #E59A7E',
  //       },
  //       icon: '❤️',
  //     });
  //   } else {
  //     toast(`Removed "${recipe.title}" from collection`);
  //   }
  // };

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

        {/* Compact Pinterest Save button overlay (fades in on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (typeof window === 'undefined') return;
            const pageUrl = `${window.location.origin}/recipes/${recipe.slug}`;
            const coverImage = recipe.image;
            const pDescription = recipe.pinterestDescription || recipe.description || recipe.title;
            const queryParams = new URLSearchParams({
              url: pageUrl,
              media: coverImage,
              description: pDescription,
            });
            const pinterestUrl = `https://pinterest.com/pin/create/button/?${queryParams.toString()}`;
            const width = 600;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;
            window.open(
              pinterestUrl,
              'pinterest-share-popup',
              `width=${width},height=${height},top=${top},left=${left},toolbar=0,status=0,resizable=yes`
            );
          }}
          className="absolute top-4 right-14 w-9 h-9 rounded-full bg-[#E60023] hover:bg-[#AD0018] text-white flex items-center justify-center border border-[#FAF7F2]/20 dark:border-stone-800 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-xs focus:opacity-100 z-10"
          title="Save to Pinterest"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.868-2.062-4.876-5.006-4.876-3.41 0-5.411 2.558-5.411 5.2 0 1.029.397 2.133.892 2.733.098.118.112.222.083.339l-.341 1.401c-.055.228-.182.277-.42.165-1.572-.733-2.555-3.033-2.555-4.881 0-3.974 2.887-7.623 8.322-7.623 4.37 0 7.768 3.114 7.768 7.278 0 4.341-2.737 7.834-6.536 7.834-1.277 0-2.477-.663-2.887-1.446l-.787 3.002c-.285 1.096-1.054 2.47-1.569 3.3l1.103.328C18.835 24 24 18.835 24 12 24 5.373 18.835 0 12 0C12 0 12 0 12 0z" />
          </svg>
        </button>

        {/* Dynamic Save Heart Icon Link (fades in on hover) - Commented out for now as requested */}
        {/* 
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-center border border-[#FAF7F2]/20 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:text-terracotta dark:hover:text-terracotta md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-xs focus:opacity-100 z-10"
          title={saved ? "Unpin recipe" : "Pin recipe"}
        >
          <Heart className={`w-4 h-4 transition-transform ${saved ? 'fill-terracotta text-terracotta scale-110' : 'group-hover:scale-105'}`} />
        </button>
        */}

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
