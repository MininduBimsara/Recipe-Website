'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useFavorites } from './useFavorites';
import { toast } from 'react-hot-toast';

interface SaveButtonProps {
  recipeId: string;
  recipeTitle?: string;
  className?: string;
  showText?: boolean;
}

export default function SaveButton({ 
  recipeId, 
  recipeTitle = 'Recipe', 
  className = '', 
  showText = false 
}: SaveButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const saved = isFavorite(recipeId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      removeFavorite(recipeId);
      toast.success(`Removed "${recipeTitle}" from collection`, {
        icon: '💔',
      });
    } else {
      addFavorite(recipeId);
      toast.success('Saved to your collection ♥', {
        style: {
          background: '#FFEBEA',
          color: '#D4704A',
          border: '1px solid #E59A7E',
        },
        icon: '❤️',
      });
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 1.4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className={`relative cursor-pointer transition-all focus:outline-none flex items-center justify-center gap-2 ${className}`}
      title={saved ? 'Remove from favorites' : 'Save to favorites'}
    >
      <Heart
        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
          saved
            ? 'fill-terracotta text-terracotta dark:fill-terracotta-light dark:text-terracotta-light'
            : 'text-stone-500 hover:text-terracotta dark:text-stone-400 dark:hover:text-terracotta-light'
        }`}
      />
      {showText && (
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
          {saved ? 'Saved ♥' : 'Save'}
        </span>
      )}
    </motion.button>
  );
}
