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
import { InArticleAd, SidebarAd, BelowRecipeAd } from '@/components/ads';

export default function MagazineSplit() {
  const { type, post, getSlotImage, getBlurUrl } = useTemplateState();
  const heroImage = getSlotImage(1);
  const blurUrl = getBlurUrl(heroImage.url, 1);

  return (
    <div className="w-full space-y-8 md:space-y-12" id="layout-magazine-split">
      {/* Magazine 50/50 Split Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-cream-dark/40 bg-white shadow-xs">
        {/* Left Side: Editorial Image */}
        <div className="relative group aspect-square md:aspect-auto md:min-h-[380px] bg-cream/10">
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
        </div>

        {/* Right Side: Bold Typography Intro */}
        <div className="p-6 sm:p-10 flex flex-col justify-center text-left bg-gradient-to-br from-white to-cream-light/30 space-y-4">
          <div className="space-y-1.5">
            <span className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase bg-terracotta/10 text-terracotta px-2.5 py-1 rounded">
              MAGAZINE GAZETTE COVER
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-espresso tracking-tight leading-tight">
              {post.title}
            </h1>
          </div>

          <p className="font-serif italic text-stone-705 text-xs sm:text-sm leading-relaxed border-l-2 border-sage pl-3">
            {post.description || post.summary}
          </p>

          <div className="pt-2 border-t border-cream-dark flex items-center gap-3 font-mono text-[9px] text-stone-500 font-bold">
            <span>BY {post.author ? post.author.toUpperCase() : 'HEIRLOOM CHEF'}</span>
            <span>•</span>
            <span>{post.prepTime ? post.prepTime.toUpperCase() : '5 MINS READ'}</span>
          </div>
        </div>
      </div>

      {type === 'recipe' ? (
        <div className="max-w-3xl mx-auto space-y-8 text-left">
          <RecipeEngagement />
          <RecipeServings />
          <RecipeIngredients />
          <InArticleAd />
          <RecipeInstructions />
          <BelowRecipeAd />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <RecipeTips />
              <RecipeAiCustomizer />
            </div>
            <div className="space-y-6">
              <NutritionCard calories={post.calories} recipeTitle={post.title} />
              <SidebarAd />
              <PinGraphicCard
                slug={post.slug}
                imageUrl={heroImage.url}
                title={post.title}
                description={post.pinterestDescription || post.description}
              />
            </div>
          </div>

          <RecipeBottomWidgets />
          <CookingModeOverlay />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <article className="lg:col-span-9 space-y-6">
            <BlogEngagement />
            <BlogSections />
            <RelatedRecipes />
          </article>

          <aside className="lg:col-span-3 hidden lg:block">
            <BlogToc />
            <SidebarAd />
          </aside>
        </div>
      )}
    </div>
  );
}
