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

export default function SideBySide() {
  const { type, post, getSlotImage, getBlurUrl } = useTemplateState();
  const img1 = getSlotImage(1);
  const img2 = getSlotImage(2);

  const blur1 = getBlurUrl(img1.url, 1);
  const blur2 = getBlurUrl(img2.url, 2);

  return (
    <div className="w-full space-y-12 md:space-y-16" id="layout-side-by-side">
      {type === 'recipe' ? (
        <div className="space-y-12">
          {/* Alternating Row 1: Image Left, Title/Ingredients Right */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Image 1 */}
            <div className="md:col-span-5 relative group aspect-[4/3] rounded-2xl overflow-hidden border border-cream-dark/40 bg-cream/10 shadow-sm">
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
              <PinterestImageOverlay
                slug={post.slug}
                imageUrl={img1.url}
                title={post.title}
                description={post.pinterestDescription || post.description}
              />
              {img1.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-center text-white text-[9px] font-mono">
                  {img1.caption}
                </div>
              )}
            </div>

            {/* Right Column: Title + Ingredients */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-3 text-left">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#E60023] bg-red-500/10 px-2 py-0.5 rounded">
                  ALT SPLIT VIEW
                </span>
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-espresso leading-none">
                  {post.title}
                </h1>
                <p className="text-stone-605 font-serif italic text-sm leading-relaxed">
                  {post.description}
                </p>
              </div>

              <RecipeServings />
              <RecipeIngredients />
            </div>
          </section>

          <RecipeEngagement />

          {/* Alternating Row 2: Instructions Left, Image 2 Right */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Directions */}
            <div className="md:col-span-7 space-y-6">
              <RecipeInstructions />
              <RecipeAiCustomizer />
            </div>

            {/* Right Column: Active Preparation Image 2 */}
            <div className="md:col-span-5 space-y-6">
              <div className="relative group aspect-[4/3] rounded-2xl overflow-hidden border border-cream-dark/40 bg-cream/10 shadow-sm">
                <Image
                  src={img2.url}
                  alt="Process illustration"
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
                {img2.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-center text-white text-[9px] font-mono">
                    {img2.caption}
                  </div>
                )}
              </div>

              <RecipeTips />
              <NutritionCard calories={post.calories} recipeTitle={post.title} />
              <PinGraphicCard
                slug={post.slug}
                imageUrl={img1.url}
                title={post.title}
                description={post.pinterestDescription || post.description}
              />
              <div className="p-4 bg-white rounded-xl border border-cream-dark/60 text-left font-sans text-xs text-stone-500 leading-relaxed shadow-3xs">
                💡 <span className="font-bold text-espresso">Kitchen Scale tip:</span> Consistent dough pressure or liquid metrics require checking the quantities side-by-side with our US Customary or Metric toggle.
              </div>
            </div>
          </section>

          <RecipeBottomWidgets />
          <CookingModeOverlay />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <BlogToc />
            <div className="mt-6 aspect-[3/4] relative rounded-xl overflow-hidden border border-cream-dark">
              <Image
                src={img2.url}
                alt="Secondary decoration"
                fill
                placeholder="blur"
                blurDataURL={blur2}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <article className="lg:col-span-9 space-y-8">
            <BlogHeader />
            <BlogEngagement />

            {/* Alternating blog sections view */}
            <div className="space-y-8">
              {(post.sections || []).length > 0 ? (
                post.sections.map((sec: any, idx: number) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div 
                      key={sec.id} 
                      className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-cream-dark/25 pb-6 last:border-0 ${
                        isEven ? '' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className={`md:col-span-7 ${isEven ? 'order-1' : 'order-1 md:order-2'}`}>
                        <h3 className="font-serif font-black text-base text-espresso leading-tight mb-2">
                          {sec.title}
                        </h3>
                        <p className="text-stone-701 font-sans text-xs leading-relaxed text-left text-justify">
                          {sec.text}
                        </p>
                        {sec.pullquote && (
                          <blockquote className="my-2 p-2 bg-cream/20 rounded border-l-2 border-terracotta italic font-serif text-[11px] leading-relaxed">
                            &ldquo;{sec.pullquote}&rdquo;
                          </blockquote>
                        )}
                      </div>

                      <div className={`md:col-span-5 relative aspect-video rounded-lg overflow-hidden border border-cream-dark bg-cream/10 ${
                        isEven ? 'order-2' : 'order-2 md:order-1'
                      }`}>
                        <Image
                          src={sec.image || (idx === 0 ? img1.url : img2.url)}
                          alt={sec.title}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <BlogSections />
              )}
            </div>

            <RelatedRecipes />
          </article>
        </div>
      )}
    </div>
  );
}
