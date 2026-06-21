import React, { Suspense } from 'react';
import { Metadata } from 'next';
import RecipesClient from './RecipesClient';

export const metadata: Metadata = {
  title: 'Browse All Recipes | PebblePlate',
  description: 'Search and filter our library of simple, kitchen-tested recipes by category, cuisine, dietary preference, or ingredients you have in your pantry.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://pebbleplate.page/recipes',
  },
  openGraph: {
    type: 'website',
    title: 'Browse All Recipes | PebblePlate',
    description: 'Search and filter our library of simple, kitchen-tested recipes by category, cuisine, dietary preference, or ingredients you have in your pantry.',
    url: 'https://pebbleplate.page/recipes',
    siteName: 'PebblePlate',
  },
};

function RecipesFallback() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      <span className="font-mono text-xs text-stone-400">Loading recipes...</span>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<RecipesFallback />}>
      <RecipesClient />
    </Suspense>
  );
}
