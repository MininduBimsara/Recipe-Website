'use client';

import React from 'react';
import { BlogPost } from '@/types/pinterestBlogSchema';
import BlogPostCard from './BlogPostCard';

interface BlogPostGridProps {
  posts: BlogPost[];
  onOpenDetail?: (post: BlogPost) => void;
}

export default function BlogPostGrid({ posts, onOpenDetail }: BlogPostGridProps) {
  return (
    <div className="space-y-4" id="blog-grid-stage">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </div>
  );
}
