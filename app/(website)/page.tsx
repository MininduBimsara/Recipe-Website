import React from 'react';
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'PebblePlate - Easy Home Recipes & Cooking Guides',
  description: 'Explore simple, kitchen-tested recipes, weekend baking ideas, and helpful cooking tips for home cooks of all skill levels.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://pebbleplate.page',
  },
  openGraph: {
    type: 'website',
    title: 'PebblePlate - Easy Home Recipes & Cooking Guides',
    description: 'Explore simple, kitchen-tested recipes, weekend baking ideas, and helpful cooking tips for home cooks of all skill levels.',
    url: 'https://pebbleplate.page',
    siteName: 'PebblePlate',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PebblePlate - Easy Home Recipes & Cooking Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PebblePlate - Easy Home Recipes & Cooking Guides',
    description: 'Explore simple, kitchen-tested recipes, weekend baking ideas, and helpful cooking tips for home cooks of all skill levels.',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
