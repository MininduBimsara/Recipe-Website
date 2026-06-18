'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Clock, ChefHat, Heart } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Recipe } from '@/types/pinterestBlogSchema';
import { useFavorites } from '@/hooks/useFavorites';

interface RecipeCardProps {
  recipe: Recipe;
  onOpenDetail?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onOpenDetail }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(recipe.id);

  // 3D Tilt spring effect using motion/react
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { damping: 25, stiffness: 300 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 25, stiffness: 300 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer bg-white rounded-3xl border border-cream-dark shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 animate-tilt-in"
      onClick={() => onOpenDetail?.(recipe)}
      id={`recipe-card-${recipe.id}`}
    >
      {/* Visual Header Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
        <Image
          src={recipe.coverImage}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/45 via-transparent to-transparent opacity-80" />

        {/* Difficulty Badge Top Left */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest font-bold uppercase rounded-lg bg-espresso/80 text-cream border border-espresso-light backdrop-blur-xs">
            {recipe.difficulty}
          </span>
          <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest font-bold uppercase rounded-lg bg-terracotta text-cream border border-terracotta-light">
            {recipe.cuisine}
          </span>
        </div>

        {/* Bookmark Overlay Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-cream-light/90 hover:bg-cream border border-cream-dark text-espresso shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
          title={favorited ? "Remove from Favorites" : "Save to Favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              favorited ? "fill-terracotta text-terracotta" : "text-stone-500 hover:text-stone-800"
            }`}
          />
        </button>

        {/* Category Pill Bottom Left */}
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] bg-honey text-espresso font-semibold font-sans tracking-wide uppercase px-2 py-0.5 rounded">
            {recipe.category}
          </span>
        </div>
      </div>

      {/* Culinary Descriptive Details */}
      <div className="p-5 space-y-3 font-sans">
        <h3 className="text-xl font-serif font-semibold text-espresso leading-snug group-hover:text-terracotta transition-colors duration-200">
          {recipe.title}
        </h3>
        
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        {/* Metric Specifications */}
        <div className="pt-3 border-t border-cream-dark flex items-center justify-between text-[11px] text-stone-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sage" />
            <span>{recipe.totalTime} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-sage" />
            <span>{recipe.ingredients.length} parts</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-espresso">{recipe.calories}</span>
            <span className="text-[10px]">cal</span>
          </div>
        </div>

        {/* Small Author attribution */}
        <div className="flex items-center gap-2 pt-2 text-[10px] text-stone-400">
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
          <span>By {recipe.author.name}</span>
        </div>
      </div>
    </motion.div>
  );
}
