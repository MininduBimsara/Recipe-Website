import React, { Suspense } from 'react';
import { Metadata } from 'next';
import BlogIndexClient from '@/components/BlogIndexClient';

export const metadata: Metadata = {
  title: 'Culinary Chronicles & Grain Investigations | Savory Gazette',
  description: 'Artisan baking deep dives, gluten investigations, critical hydration metrics, and molecular culinary analyses written by French master bakers.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://savorykitchen.com/blog',
  },
};

function BlogIndexFallback() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      <span className="font-mono text-xs text-stone-400">Loading Gazettes ...</span>
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
