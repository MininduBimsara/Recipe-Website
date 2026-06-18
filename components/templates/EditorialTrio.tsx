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

export default function EditorialTrio() {
  const { type, post, getSlotImage, getBlurUrl } = useTemplateState();
  const img1 = getSlotImage(1);
  const img2 = getSlotImage(2);
  const img3 = getSlotImage(3);

  const blur1 = getBlurUrl(img1.url, 1);
  const blur2 = getBlurUrl(img2.url, 2);
  const blur3 = getBlurUrl(img3.url, 3);

  return (
    <div className="w-full space-y-8 md:space-y-12" id="layout-editorial-trio">
      {/* Trio Top Slot: Large Hero Image */}
      <div className="relative group aspect-[16/7] md:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-cream-dark/40 bg-cream/10 shadow-xs">
        <Image
          src={img1.url}
          alt={post.title}
          fill
          priority
          placeholder="blur"
          blurDataURL={blur1}
          className="object-cover animate-fade-in"
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
        {img1.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs p-3 text-center text-white text-[10px] font-mono">
            {img1.caption}
          </div>
        )}
      </div>

      {type === 'recipe' ? (
        <div className="space-y-8 md:space-y-12">
          {/* Main text block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <span className="text-[9px] font-mono uppercase tracking-widest text-sage bg-sage/10 px-2 py-0.5 rounded font-extrabold">
                  EDITORIAL CHAMPIONSHIP TRIO
                </span>
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-espresso tracking-tight">
                  {post.title}
                </h1>
                <p className="text-stone-605 font-serif italic text-sm leading-relaxed border-l-2 border-sage pl-3">
                  {post.description}
                </p>
              </div>

              <RecipeEngagement />
              <RecipeServings />
              <RecipeIngredients />
              <RecipeInstructions />
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <RecipeTips />
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

          {/* Trio Bottom Rows: Side-by-Side Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-cream-dark/30">
            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-cream-dark/40 shadow-xs bg-cream/10">
              <Image
                src={img2.url}
                alt="Detailed step preparation"
                fill
                placeholder="blur"
                blurDataURL={blur2}
                className="object-cover hover:scale-[1.01] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <PinterestImageOverlay
                slug={post.slug}
                imageUrl={img2.url}
                title={post.title}
                description={post.pinterestDescription || post.description}
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-[8px] font-mono text-center text-white">
                SLOT #2: {img2.caption || 'Active culinary preparation detail'}
              </div>
            </div>

            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-cream-dark/40 shadow-xs bg-cream/10">
              <Image
                src={img3.url}
                alt="Plating design presentation"
                fill
                placeholder="blur"
                blurDataURL={blur3}
                className="object-cover hover:scale-[1.01] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <PinterestImageOverlay
                slug={post.slug}
                imageUrl={img3.url}
                title={post.title}
                description={post.pinterestDescription || post.description}
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-[8px] font-mono text-center text-white">
                SLOT #3: {img3.caption || 'Final plating presentation and highlights'}
              </div>
            </div>
          </div>

          <RecipeBottomWidgets />
          <CookingModeOverlay />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <aside className="lg:col-span-3 hidden lg:block">
            <BlogToc />

            <div className="mt-6 space-y-4">
              <div className="aspect-square relative rounded-xl overflow-hidden border border-cream-dark">
                <Image
                  src={img2.url}
                  alt="Process shot"
                  fill
                  placeholder="blur"
                  blurDataURL={blur2}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="aspect-square relative rounded-xl overflow-hidden border border-cream-dark">
                <Image
                  src={img3.url}
                  alt="Plated shot"
                  fill
                  placeholder="blur"
                  blurDataURL={blur3}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </aside>

          <article className="lg:col-span-9 space-y-6">
            <BlogHeader />
            <BlogEngagement />
            <BlogSections />

            {/* Showcase pair below sections */}
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-cream-dark">
                <Image src={img2.url} alt="Showcase A" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-cream-dark">
                <Image src={img3.url} alt="Showcase B" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>

            <RelatedRecipes />
          </article>
        </div>
      )}
    </div>
  );
}
