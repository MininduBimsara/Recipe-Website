import React from 'react';

/**
 * Clean reusable shimmering block for generic skeleton construction.
 */
export function ShimmerBlock({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`bg-linear-to-r from-stone-200 via-stone-100 to-stone-200 dark:from-stone-800 dark:via-stone-700 dark:to-stone-800 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`}
    />
  );
}

/**
 * SKELETON: List of Recipes (Grid)
 * Matches the layout of the /recipes page grid
 */
export function RecipeListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div className="space-y-4">
        <ShimmerBlock className="h-10 w-48" />
        <ShimmerBlock className="h-5 w-96 max-w-full" />
      </div>
      
      {/* Search and filter bars */}
      <div className="flex flex-col sm:flex-row gap-4">
        <ShimmerBlock className="h-12 flex-1 rounded-full" />
        <ShimmerBlock className="h-12 w-32 rounded-full" />
      </div>
      
      {/* Category button pills */}
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ShimmerBlock key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>

      {/* Recipe Grid columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-stone-850 rounded-3xl border border-cream-dark dark:border-stone-800 overflow-hidden space-y-4 p-4 shadow-3xs">
            <ShimmerBlock className="aspect-video w-full rounded-2xl" />
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <ShimmerBlock className="h-4 w-20 rounded" />
                <ShimmerBlock className="h-4 w-24 rounded" />
              </div>
              <ShimmerBlock className="h-7 w-5/6 rounded" />
              <ShimmerBlock className="h-5 w-full rounded" />
              <div className="flex gap-4 pt-3 border-t border-cream-dark dark:border-stone-800">
                <ShimmerBlock className="h-4 w-16 rounded" />
                <ShimmerBlock className="h-4 w-16 rounded" />
                <ShimmerBlock className="h-4 w-16 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SKELETON: Recipe Detail page
 * Matches the detailed /recipes/[slug] page
 */
export function RecipeDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-8 space-y-10">
      {/* Top back & category line */}
      <div className="flex items-center justify-between pb-4 border-b border-cream-dark dark:border-stone-800">
        <ShimmerBlock className="h-5 w-48 rounded" />
        <ShimmerBlock className="h-5 w-24 rounded" />
      </div>

      {/* Hero Image Box */}
      <ShimmerBlock className="aspect-video xl:aspect-[21/9] w-full rounded-3xl" />

      {/* Title & description area */}
      <div className="space-y-4">
        <ShimmerBlock className="h-12 w-3/4 rounded-lg" />
        <ShimmerBlock className="h-6 w-full rounded" />
        <ShimmerBlock className="h-6 w-5/6 rounded" />
      </div>

      {/* Controller section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        <ShimmerBlock className="h-28 rounded-2xl" />
        <ShimmerBlock className="h-28 rounded-2xl" />
      </div>

      {/* List grids columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Ingredients columns */}
        <div className="md:col-span-5 space-y-4 bg-white dark:bg-stone-850 p-6 rounded-2xl border border-cream-dark dark:border-stone-800">
          <ShimmerBlock className="h-8 w-40 rounded" />
          <hr className="border-cream-dark dark:border-stone-800" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <ShimmerBlock className="h-5 w-5 rounded shrink-0" />
              <ShimmerBlock className="h-5 w-full rounded" />
            </div>
          ))}
        </div>

        {/* Directions columns */}
        <div className="md:col-span-7 space-y-5 bg-white dark:bg-stone-850 p-6 rounded-2xl border border-cream-dark dark:border-stone-800">
          <ShimmerBlock className="h-8 w-44 rounded" />
          <hr className="border-cream-dark dark:border-stone-800" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <ShimmerBlock className="h-8 w-8 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <ShimmerBlock className="h-5 w-1/3 rounded" />
                <ShimmerBlock className="h-5 w-full rounded" />
                <ShimmerBlock className="h-5 w-5/6 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * SKELETON: Blog List page
 * Matches the /blog Gazette page
 */
export function BlogListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      <div className="space-y-4">
        <ShimmerBlock className="h-10 w-52" />
        <ShimmerBlock className="h-5 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-stone-850 rounded-3xl border border-cream-dark dark:border-stone-800 overflow-hidden space-y-4 p-4 shadow-3xs">
            <ShimmerBlock className="aspect-video w-full rounded-2xl" />
            <div className="space-y-2.5">
              <ShimmerBlock className="h-4 w-16 rounded" />
              <ShimmerBlock className="h-7 w-11/12 rounded" />
              <ShimmerBlock className="h-5 w-full rounded" />
              <ShimmerBlock className="h-5 w-4/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SKELETON: Blog Detail page
 */
export function BlogDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Navigation Line */}
      <ShimmerBlock className="h-6 w-40 rounded" />

      {/* Main Title Header */}
      <div className="space-y-4">
        <ShimmerBlock className="h-14 w-11/12 rounded" />
        <div className="flex gap-4 items-center">
          <ShimmerBlock className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <ShimmerBlock className="h-4 w-32 rounded" />
            <ShimmerBlock className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>

      {/* Photo Frame */}
      <ShimmerBlock className="aspect-video w-full rounded-3xl" />

      {/* Markdown Block elements */}
      <div className="space-y-4">
        <ShimmerBlock className="h-6 w-full rounded" />
        <ShimmerBlock className="h-6 w-full rounded" />
        <ShimmerBlock className="h-6 w-5/6 rounded" />
        <ShimmerBlock className="h-6 w-full rounded" />
        <ShimmerBlock className="h-6 w-2/3 rounded" />
      </div>
    </div>
  );
}
