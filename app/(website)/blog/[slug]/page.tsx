import React from 'react';
import { Metadata } from 'next';
import { BLOG_POSTS_DB } from '@/data/blogs';
import { RECIPES_DB } from '@/data/recipes';
import { getPostBySlug } from '@/lib/data';
import BlogPostSchema from '@/components/seo/BlogPostSchema';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>;
};

// Static parameters for blog pages optimization
export async function generateStaticParams() {
  return BLOG_POSTS_DB.map((post) => ({
    slug: post.slug,
  }));
}

// Dynamically generate Meta values
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | PebblePlate',
      description: 'Could not locate this article in the PebblePlate digital archives.',
    };
  }

  const title = `${post.title} | PebblePlate`;
  const description = (post as any).summary || post.subtitle;
  const canonicalUrl = `https://pebbleplate.page/blog/${post.slug}`;

  // Match corresponding formatted ISO UTC publishes
  const publishedISO = post.slug === 'science-of-gluten-shaping' 
    ? '2026-06-12T08:00:00Z' 
    : (post.slug === 'flour-ash-content-critical-fact' 
      ? '2026-05-28T10:00:00Z' 
      : '2026-06-16T12:00:00Z');

  const imageUrl = (post as any).image || post.coverImage;

  return {
    title,
    description,
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
          alt: post.title,
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
      'article:published_time': publishedISO,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <>
      {/* Article Schema embedded server side if post exists */}
      {post && <BlogPostSchema post={post as any} />}

      {/* Main interactive visualization block with layout templates */}
      <TemplateRenderer post={post} type="blog" />
    </>
  );
}

