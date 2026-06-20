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
  BlogHeader, BlogEngagement, BlogToc, BlogSections, RelatedRecipes, BlogSectionItem 
} from './BlogWidgets';
import NutritionCard from '@/components/recipe/NutritionCard';
import PinGraphicCard from '@/components/recipe/PinGraphicCard';
import PinterestImageOverlay from '@/components/recipe/PinterestImageOverlay';
import { InArticleAd, SidebarAd, BelowRecipeAd } from '@/components/ads';

export default function HeroStack() {
  const { type, post, getSlotImage, getBlurUrl } = useTemplateState();
  const img1 = getSlotImage(1);
  const img2 = getSlotImage(2);

  const blur1 = getBlurUrl(img1.url, 1);
  const blur2 = getBlurUrl(img2.url, 2);

  return (
    <div className="w-full space-y-8 md:space-y-12" id="layout-hero-stack">
      {/* Complete Full-Bleed/Extra-Wide Hero Header */}
      <div className="-mx-6 md:-mx-12 relative group aspect-[21/9] bg-cream/10 border-b border-cream-dark/50 overflow-hidden md:rounded-b-3xl">
        <Image
          src={img1.url}
          alt={post.title}
          fill
          priority
          placeholder="blur"
          blurDataURL={blur1}
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        {type === 'recipe' && (
          <PinterestImageOverlay
            slug={post.slug}
            imageUrl={img1.url}
            title={post.title}
            description={post.pinterestDescription || post.description}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent" />
        <div className="absolute bottom-4 left-6 md:left-12 text-left text-white drop-shadow-sm select-none">
          <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-terracotta px-2 py-0.5 rounded">
            FEATURED STACK MASTERPIECE
          </span>
          <h1 className="font-serif font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {type === 'recipe' ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Primary content area: Part 1 */}
            <div className="lg:col-span-8 space-y-6">
              <p className="text-stone-605 font-serif italic text-sm leading-relaxed border-l-2 border-sage pl-3">
                {post.description}
              </p>
              
              <RecipeEngagement />
              <RecipeServings />
              <RecipeIngredients />
              <InArticleAd />
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <RecipeTips />
              <SidebarAd />
              <NutritionCard calories={post.calories} recipeTitle={post.title} />
              <RecipeAiCustomizer />
              <PinGraphicCard
                slug={post.slug}
                imageUrl={img1.url}
                title={post.title}
                description={post.pinterestDescription || post.description}
              />
            </aside>
          </div>

          {/* Midway Embedded Image Slot 2 */}
          <div className="py-6 border-y border-cream-dark/40 max-w-3xl mx-auto space-y-2">
            <div className="relative group aspect-video rounded-xl overflow-hidden border border-cream-dark shadow-xs bg-cream/10">
              <Image
                src={img2.url}
                alt="Preparation step and composition details"
                fill
                placeholder="blur"
                blurDataURL={blur2}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <PinterestImageOverlay
                slug={post.slug}
                imageUrl={img2.url}
                title={post.title}
                description={post.pinterestDescription || post.description}
              />
            </div>
            {img2.caption && (
              <p className="font-mono text-[9px] text-stone-500 uppercase text-center tracking-wider">
                🏷️ PROCESS STEP: {img2.caption}
              </p>
            )}
          </div>

          {/* Core content area: Part 2 */}
          <div className="max-w-3xl mx-auto text-left">
            <RecipeInstructions />
            <BelowRecipeAd />
          </div>

          <RecipeBottomWidgets />
          <CookingModeOverlay />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Main content split */}
          <article className="lg:col-span-9 space-y-8">
            <BlogHeader />
            <BlogEngagement />

            {/* Render sections part-1, then image, then part-2 */}
            <div className="space-y-6">
              {(post.sections || []).length > 0 ? (
                <>
                  {post.sections.slice(0, 1).map((sec: any) => (
                    <BlogSectionItem key={sec.id} section={sec} />
                  ))}

                  {/* Slot 2 inline display */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-cream-dark my-6 bg-cream/5">
                    <Image src={img2.url} alt="Process segment" fill className="object-cover" referrerPolicy="no-referrer" />
                    {img2.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-center text-white text-[9px] font-mono">
                        {img2.caption}
                      </div>
                    )}
                  </div>

                  {post.sections.slice(1).map((sec: any) => (
                    <BlogSectionItem key={sec.id} section={sec} />
                  ))}
                </>
              ) : (
                <BlogSections />
              )}
            </div>

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
