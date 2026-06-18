import React from 'react';
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Savory Kitchen - Easy Home Recipes & Cooking Guides',
  description: 'Explore simple, kitchen-tested recipes, weekend baking ideas, and helpful cooking tips for home cooks of all skill levels.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://savorykitchen.com',
  },
  openGraph: {
    type: 'website',
    title: 'Savory Kitchen - Easy Home Recipes & Cooking Guides',
    description: 'Explore simple, kitchen-tested recipes, weekend baking ideas, and helpful cooking tips for home cooks of all skill levels.',
    url: 'https://savorykitchen.com',
    siteName: 'Savory Kitchen',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
