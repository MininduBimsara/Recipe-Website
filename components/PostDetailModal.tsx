'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, BookOpen, Calendar, Clock, User } from 'lucide-react';
import { BlogPost } from '@/data/blogs';

interface PostDetailModalProps {
  post: BlogPost;
  onClose: () => void;
}

export default function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto block" id="blog-modal-backdrop">
      <div 
        className="fixed inset-0 bg-[#150A05]/85 backdrop-blur-md transition-opacity cursor-pointer print:hidden" 
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-12 print:p-0">
        
        <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#1E1E1E] text-espresso dark:text-[#F0EBE3] shadow-2xl overflow-hidden border border-cream-dark dark:border-stone-800 transition-all flex flex-col print:border-none print:shadow-none">
          
          {/* HEADER Action bar */}
          <div className="sticky top-0 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-xs px-6 py-4 border-b border-cream-dark dark:border-stone-800 z-10 flex items-center justify-between print:hidden">
            <span className="font-mono text-[10px] tracking-widest uppercase text-stone-400 dark:text-stone-550 font-bold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sage" /> Editorial Archive Book
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full border border-cream-dark dark:border-stone-750 text-stone-400 dark:text-stone-500 hover:text-espresso dark:hover:text-cream hover:bg-cream dark:hover:bg-stone-850 cursor-pointer transition-colors"
              title="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ARTICLE VIEW BODY */}
          <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto print:max-h-none print:p-0">
            
            {/* Category tag & Title */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#D4704A] dark:text-[#EAB29C] uppercase bg-terracotta/10 px-2 py-0.5 rounded">
                #{post.category}
              </span>
              <h1 className="font-serif font-bold text-2xl md:text-3xl tracking-tight leading-tight pt-1">
                {post.title}
              </h1>
            </div>

            {/* Micro author metadata strip */}
            <div className="flex flex-wrap items-center gap-4 py-2 border-y border-cream-dark dark:border-stone-800 text-stone-450 dark:text-stone-400 font-mono text-[10px]">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-sage" />
                <span className="font-bold">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sage" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Clock className="w-3.5 h-3.5 text-terracotta" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Splash image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-cream/10 border border-cream-dark dark:border-stone-800">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Editorial paragraphs list */}
            <div className="space-y-4 font-sans text-stone-650 dark:text-stone-300 text-sm leading-relaxed text-justify">
              
              {/* Highlight first paragraph */}
              <p className="text-stone-800 dark:text-cream text-base font-serif italic py-2 leading-relaxed border-l-4 border-sage-light pl-4 bg-cream/30 dark:bg-stone-850/30 rounded-r-xl">
                {post.summary}
              </p>

              {post.content.map((paragraph, index) => (
                <p key={index} className="pt-1">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Printable Footnote */}
            <div className="hidden print:block text-center text-[10px] text-stone-400 font-mono pt-4 border-t border-stone-100">
              PebblePlate Magazine • Web Edition Article
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
