import { MetadataRoute } from 'next';
import { RECIPES_DB } from '@/data/recipes';
import { BLOG_POSTS_DB } from '@/data/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://savorykitchen.com';

  // 1. Static Index Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-06-16'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 2. Dynamic Recipe Routes (weekly, priority 0.9)
  const recipesMap: MetadataRoute.Sitemap = RECIPES_DB.map((recipe) => {
    const rawDate = recipe.publishedAt || '2026-06-16T12:00:00Z';
    return {
      url: `${baseUrl}/recipes/${recipe.slug}`,
      lastModified: new Date(rawDate),
      changeFrequency: 'weekly',
      priority: 0.9,
    };
  });

  // 3. Dynamic Blog Routes (monthly, priority 0.7)
  const blogsMap: MetadataRoute.Sitemap = BLOG_POSTS_DB.map((post) => {
    // Parse "June 12, 2026" or fallback
    let lastModifiedDate = new Date('2026-06-16');
    try {
      const parsed = Date.parse(post.date);
      if (!isNaN(parsed)) {
        lastModifiedDate = new Date(parsed);
      }
    } catch {
      // fallback
    }

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: lastModifiedDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...recipesMap, ...blogsMap];
}
