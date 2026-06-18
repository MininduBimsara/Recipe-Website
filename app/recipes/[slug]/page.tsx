import React from 'react';
import { Metadata } from 'next';
import { RECIPES_DB } from '@/data/recipes';
import { getRecipeBySlug } from '@/lib/data';
import RecipeSchema from '@/components/seo/RecipeSchema';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>;
};

// Next.js static params generation for high-performance builds
export async function generateStaticParams() {
  return RECIPES_DB.map((recipe) => ({
    slug: recipe.slug,
  }));
}

// 1. Dynamic metadata generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: 'Recipe Not Found | Savory Kitchen',
      description: 'Could not locate this recipe in the Savory Kitchen digital archives.',
    };
  }

  const title = `${recipe.title} | Savory Kitchen`;
  const description = recipe.pinterestDescription || recipe.description;
  const canonicalUrl = `https://savorykitchen.com/recipes/${recipe.slug}`;
  const keywordsStr = recipe.tags ? recipe.tags.join(', ') : `${recipe.category}, ${recipe.title}, Recipe`;

  const imageUrl = (recipe as any).image || recipe.coverImage;

  return {
    title,
    description,
    keywords: keywordsStr,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    other: {
      'article:published_time': recipe.publishedAt || '2026-06-16T12:00:00Z',
    },
  };
}

// 2. Server page component
export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  return (
    <>
      {/* Dynamic JSON-LD embedded Server-side if recipe exists */}
      {recipe && <RecipeSchema recipe={recipe as any} />}
      
      {/* Interactive visual detail page elements with multi-layout dispatcher */}
      <TemplateRenderer post={recipe} type="recipe" />
    </>
  );
}

