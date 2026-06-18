'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getBlurDataURL } from '@/lib/placeholder';
import { Clock, ChefHat, BookOpen, Star, Heart } from 'lucide-react';
import { Post } from '@/types/post';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  index?: number;
}

export default function PostCard({ post, onClick, index = 0 }: PostCardProps) {
  const isRecipe = post.type === 'recipe';
  const totalIngredients = isRecipe
    ? post.recipe?.ingredientGroups.reduce((acc, curr) => acc + curr.items.length, 0) || 0
    : 0;

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkFavorite = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem('savory_favorites') || '[]');
        setIsFavorited(favorites.includes(post.id));
      } catch (_) {}
    };
    checkFavorite();
    window.addEventListener('savory_favorites_updated', checkFavorite);
    return () => {
      window.removeEventListener('savory_favorites_updated', checkFavorite);
    };
  }, [post.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const favorites = JSON.parse(localStorage.getItem('savory_favorites') || '[]');
      let updated: string[];
      if (favorites.includes(post.id)) {
        updated = favorites.filter((id: string) => id !== post.id);
        setIsFavorited(false);
      } else {
        updated = [...favorites, post.id];
        setIsFavorited(true);
      }
      localStorage.setItem('savory_favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('savory_favorites_updated'));
    } catch (_) {}
  };

  // 3D Tilt Spring Mechanics using motion/react
  const prefersReduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateXSpring = useSpring(x, { stiffness: prefersReduced ? 0 : 180, damping: 20 });
  const rotateYSpring = useSpring(y, { stiffness: prefersReduced ? 0 : 180, damping: 20 });

  // Map mouse coordinates to degrees of rotation
  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], prefersReduced ? [0, 0] : [10, -10]);
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], prefersReduced ? [0, 0] : [-10, 10]);

  // Translate movement for realistic depth layers (depth effect on elements)
  const glintX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glintY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate values between -0.5 and 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getDifficultyColor = (diff?: 'easy' | 'medium' | 'hard') => {
    switch (diff) {
      case 'easy': return 'bg-emerald-50/80 text-emerald-805 border-emerald-200/50';
      case 'medium': return 'bg-amber-50/80 text-amber-805 border-amber-200/50';
      case 'hard': return 'bg-rose-50/80 text-rose-805 border-rose-200/50';
      default: return 'bg-stone-50/80 text-stone-800 border-stone-200/50';
    }
  };

  // Dynamic aspect ratio based on index or category to generate structural Masonry height variance
  const getMasonryHeightClass = () => {
    if (index % 3 === 0) return 'aspect-[4/5]'; // Taller cards
    if (index % 3 === 1) return 'aspect-square';  // Square cards
    return 'aspect-[4/3]';                         // Landscape cards
  };

  return (
    <motion.div 
      className="break-inside-avoid mb-6 preserve-3d cursor-pointer group"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      id={`post-card-${post.id}`}
      whileHover={prefersReduced ? undefined : { scale: 1.02, transition: { duration: 0.25 } }}
    >
      <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/70 shadow-sm group-hover:shadow-xl transition-shadow duration-300 flex flex-col h-full transform style-3d relative">
        
        {/* Tilt reflection glint overlay */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-tr from-transparent via-white to-transparent z-20"
          style={{
            backgroundPositionX: glintX,
            backgroundPositionY: glintY,
          }}
        />

        {/* Visual Cover Header */}
        <div className={`relative ${getMasonryHeightClass()} w-full bg-stone-100 overflow-hidden transform-translate-Z-20`}>
          <Image
            src={post.coverImage}
            alt={`${post.title} - featured food presentation`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
            placeholder="blur"
            blurDataURL={getBlurDataURL(post.coverImage)}
          />
          
          {/* Glassmorphic Category Badges */}
          <div className="absolute top-4 left-4 z-10 font-sans flex flex-col gap-1.5 items-start">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md bg-white/60 text-stone-900 border border-white/40 shadow-xs">
              {isRecipe ? (
                <>
                  <ChefHat className="w-3.5 h-3.5 text-amber-800" />
                  Recipe
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-stone-800" />
                  Editorial
                </>
              )}
            </span>

            {/* Custom tags as secondary glass badges */}
            {post.tags[0] && (
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide backdrop-blur-md bg-stone-900/40 text-white border border-white/10 shadow-xs uppercase font-mono">
                {post.tags[0]}
              </span>
            )}
          </div>

          {/* Rating overlay if present with glassmorphic design */}
          {post.rating && (
            <div className="absolute right-4 top-4 backdrop-blur-md bg-white/75 px-2.5 py-1 rounded-full text-xs font-bold text-stone-850 flex items-center gap-1 shadow-sm border border-white/40">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {post.rating.toFixed(1)}
            </div>
          )}

          {/* Native Save to Favorites Overlay */}
          <button
            onClick={toggleFavorite}
            className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md bg-stone-900/60 hover:bg-stone-900 hover:border-white/40 text-white border border-white/20 hover:scale-110 active:scale-95 transition-all shadow-md duration-300 cursor-pointer flex items-center justify-center"
            title={isFavorited ? "Remove from Favorites" : "Save to Favorites"}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-300 ${
                isFavorited ? "fill-[#ef4444] text-[#ef4444]" : "text-stone-100 hover:text-white"
              }`} 
            />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-1 justify-between transform-translate-Z-10">
          <div className="space-y-3">
            {/* Card tags */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[9px] font-mono tracking-widest text-stone-500 bg-stone-50 border border-stone-200/40 px-2 py-0.5 rounded-sm">
                  #{tag.toUpperCase()}
                </span>
              ))}
            </div>

            <h3 className="text-lg md:text-xl font-serif font-medium text-stone-950 group-hover:text-amber-800 transition-colors duration-200 line-clamp-2 leading-snug">
              {post.title}
            </h3>

            <p className="text-stone-600 text-xs leading-relaxed line-clamp-3 font-sans">
              {post.excerpt}
            </p>
          </div>

          {/* Bottom Metadata row */}
          <div className="mt-6 pt-4 border-t border-stone-100">
            {isRecipe && post.recipe ? (
              <div className="flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-medium">{post.recipe.totalTimeMinutes} mins</span>
                </div>
                <div className="flex items-center gap-2 font-sans">
                  <span>{totalIngredients} ingredients</span>
                  <span className="text-stone-300 font-mono">|</span>
                  <span className={`px-2 py-0.5 rounded-sm border text-[9px] uppercase font-bold tracking-wider ${getDifficultyColor(post.recipe.difficulty)}`}>
                    {post.recipe.difficulty}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-serif italic text-stone-500 font-medium">Editorial Feature</span>
                <span className="text-[9px] bg-stone-50 text-stone-600 border border-stone-150 px-2.5 py-0.5 rounded uppercase font-mono">
                  {post.editorial?.keyTakeaways.length || 3} insights
                </span>
              </div>
            )}

            {/* Author footer */}
            <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-dashed border-stone-150">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                <Image 
                  src={post.author.avatar}
                  alt={`${post.author.name} portrait`}
                  fill
                  sizes="32px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  placeholder="blur"
                  blurDataURL={getBlurDataURL(post.author.avatar)}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-stone-850 group-hover:text-amber-900 transition-colors">{post.author.name}</span>
                <span className="text-[10px] text-stone-400 font-mono tracking-wider">{post.publishedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

