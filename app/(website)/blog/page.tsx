import React, { Suspense } from 'react';
import { Metadata } from 'next';
import BlogIndexClient from '@/components/BlogIndexClient';

export const metadata: Metadata = {
  title: 'Savory Kitchen Blog - Culinary Tips & Home Baking Guides',
  description: 'Explore cooking tips, kitchen guides, and delicious recipes from home bakers and culinary enthusiasts.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://savorykitchen.com/blog',
  },
};

function BlogIndexFallback() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      <span className="font-mono text-xs text-stone-400">Loading blog posts...</span>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogIndexFallback />}>
      <BlogIndexClient />
    </Suspense>
  );
}
