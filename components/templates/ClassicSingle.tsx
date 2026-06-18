'use client';

import React from 'react';
import Image from 'next/image';
import { useTemplateState } from './TemplateStateContext';
import { 
  RecipeEngagement, RecipeServings, RecipeIngredients, 
  RecipeInstructions, RecipeTips, RecipeAiCustomizer, 
  RecipeBottomWidgets, CookingModeOverlay 
} from './RecipeWidgets';
import { 
  BlogHeader, BlogEngagement, BlogToc, BlogSections, RelatedRecipes 
} from './BlogWidgets';
import NutritionCard from '@/components/recipe/NutritionCard';
import PinGraphicCard from '@/components/recipe/PinGraphicCard';
import PinterestImageOverlay from '@/components/recipe/PinterestImageOverlay';

export default function ClassicSingle() {
  const { type, post, getSlotImage, getBlurUrl } = useTemplateState();
  const heroImage = getSlotImage(1);
  const blurUrl = getBlurUrl(heroImage.url, 1);

  return (
    <div className="w-full space-y-6 md:space-y-10" id="layout-classic-single">
      {/* 1. Large 16:9 Hero Image */}
      <div className="relative group aspect-[16/9] w-full rounded-2xl overflow-hidden border border-cream-dark/40 bg-cream/10 md:shadow-xs">
        <Image
          src={heroImage.url}
          alt={post.title}
          fill
          priority
          placeholder="blur"
          blurDataURL={blurUrl}
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        {type === 'recipe' && (
          <PinterestImageOverlay
            slug={post.slug}
            imageUrl={heroImage.url}
            title={post.title}
            description={post.pinterestDescription || post.description}
          />
        )}
        {heroImage.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs p-3 text-center text-white text-[10px] font-mono tracking-wider">
            {heroImage.caption}
          </div>
        )}
      </div>

      {type === 'recipe' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content: Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-terracotta bg-terracotta/10 px-2.5 py-1 rounded inline-block">
                #{post.category}
              </span>
              <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-espresso tracking-tight leading-none">
                {post.title}
              </h1>
              <p className="text-stone-605 font-serif italic text-sm leading-relaxed border-l-3 border-sage pl-3">
                {post.description}
              </p>
            </div>

            <RecipeEngagement />
            <RecipeServings />
            <RecipeIngredients />
            <RecipeInstructions />
            <RecipeBottomWidgets />
          </div>

          {/* Sidebar Controls: Right Column */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-4 rounded-xl bg-white border border-cream-dark space-y-3 shadow-3xs text-left">
              <h4 className="font-mono text-[10px] font-black uppercase text-stone-500 tracking-wider">
                📋 Recipe Details
              </h4>
              <div className="space-y-1 bg-cream-light/45 p-3 rounded-lg border border-cream-dark/30 font-mono text-[11px] font-bold text-stone-702">
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <span className="text-terracotta">{post.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prep duration:</span>
                  <span className="text-sage">{post.prepTime}</span>
                </div>
                {post.cookTime && (
                  <div className="flex justify-between">
                    <span>Cook duration:</span>
                    <span>
                      {typeof post.cookTime === 'number'
                        ? `${post.cookTime} mins`
                        : String(post.cookTime).replace('PT', '').replace('M', ' mins')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Calories count:</span>
                  <span>{post.calories} kcal</span>
                </div>
              </div>
            </div>

            <NutritionCard calories={post.calories} recipeTitle={post.title} />
            <RecipeTips />
            <RecipeAiCustomizer />
            <PinGraphicCard
              slug={post.slug}
              imageUrl={heroImage.url}
              title={post.title}
              description={post.pinterestDescription || post.description}
            />
          </aside>
          
          <CookingModeOverlay />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Column for sections */}
          <article className="lg:col-span-8 space-y-6">
            <BlogHeader />
            <BlogEngagement />
            <BlogSections />
            <RelatedRecipes />
          </article>

          {/* Table of contents sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <BlogToc />
          </aside>
        </div>
      )}
    </div>
  );
}
