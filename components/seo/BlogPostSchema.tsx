import React from 'react';
import { BlogPost } from '@/data/blogs';

interface BlogPostSchemaProps {
  post: BlogPost;
}

// Convert "June 12, 2026" to "2026-06-12" or similar ISO-8601 clean string
function parseDateToISO(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
    // fallback
  }
  return "2026-06-16";
}

export default function BlogPostSchema({ post }: BlogPostSchemaProps) {
  const publishedDate = parseDateToISO(post.date);
  const authorName = post.author || "Chef Alexandre Dumas";
  const postUrl = `https://savorykitchen.com/blog/${post.slug}`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "headline": post.title,
    "description": post.summary,
    "image": [
      post.image
    ],
    "datePublished": publishedDate,
    "dateModified": publishedDate, // default match for this design
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Savory Kitchen",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=200"
      }
    }
  };

  // Sanitize JSON to prevent </script> injection from DB content
  const safeJson = JSON.stringify(schemaJson)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
