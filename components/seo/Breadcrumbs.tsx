import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  post: {
    title: string;
    slug: string;
  };
  type: 'recipe' | 'blog';
}

export default function Breadcrumbs({ post, type }: BreadcrumbsProps) {
  const isRecipe = type === 'recipe';
  const categoryLabel = isRecipe ? 'Recipes' : 'Blog';
  const categoryPath = isRecipe ? '/recipes' : '/blog';
  const postPath = `${categoryPath}/${post.slug}`;
  const baseUrl = 'https://savorykitchen.com';

  // BreadcrumbList JSON-LD Schema
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryLabel,
        "item": `${baseUrl}${categoryPath}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `${baseUrl}${postPath}`
      }
    ]
  };

  // Sanitize to prevent script injection
  const safeJson = JSON.stringify(schemaJson)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <>
      {/* Breadcrumb Schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson }}
      />

      {/* Visual Breadcrumb markup */}
      <nav 
        aria-label="Breadcrumb"
        className="w-full py-3 px-1 flex items-center gap-1.5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 select-none text-left print:hidden"
      >
        <Link 
          href="/" 
          className="hover:text-terracotta dark:hover:text-cream transition-colors"
        >
          Home
        </Link>
        
        <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700 shrink-0" />
        
        <Link 
          href={categoryPath}
          className="hover:text-terracotta dark:hover:text-cream transition-colors"
        >
          {categoryLabel}
        </Link>
        
        <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700 shrink-0" />
        
        <span className="text-espresso dark:text-cream font-black truncate max-w-[150px] sm:max-w-xs md:max-w-md">
          {post.title}
        </span>
      </nav>
    </>
  );
}
