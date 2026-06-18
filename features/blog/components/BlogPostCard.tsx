'use client';

import React from 'react';
import Image from 'next/image';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/pinterestBlogSchema';
import { motion } from 'motion/react';

interface BlogPostCardProps {
  post: BlogPost;
  onOpenDetail?: (post: BlogPost) => void;
}

export default function BlogPostCard({ post, onOpenDetail }: BlogPostCardProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-3xl border border-cream-dark overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={() => onOpenDetail?.(post)}
      id={`blog-card-${post.id}`}
    >
      {/* Visual Header */}
      <div className="relative aspect-[16/10] w-full bg-cream overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />

        {/* Category Tag pill */}
        <div className="absolute bottom-4 left-4">
          <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest font-bold uppercase rounded-lg bg-espresso text-cream border border-espresso-light">
            {post.category}
          </span>
        </div>
      </div>

      {/* Editorial content area */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4 font-sans">
        <div className="space-y-2">
          {/* Metadata Bar */}
          <div className="flex items-center gap-4 text-[11px] text-stone-400 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sage" /> {publishedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-sage" /> {post.readingTimeMinutes} mins read
            </span>
          </div>

          <h3 className="text-xl font-serif font-semibold text-espresso leading-snug group-hover:text-terracotta transition-colors duration-200">
            {post.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {post.subtitle}
          </p>
        </div>

        {/* Read More Trigger bar */}
        <div className="pt-2 border-t border-cream-dark flex items-center justify-between text-xs font-semibold text-espresso">
          <span className="flex items-center gap-2">
            By <span className="text-terracotta">{post.author.name}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-stone-400 group-hover:text-terracotta transition-colors">
            Read Guide <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
