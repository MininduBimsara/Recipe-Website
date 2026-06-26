'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Clock, ArrowRight, Layers } from 'lucide-react';
import { getSavedBlogs, ExtendedBlogPost } from '@/lib/preseededPool';
import { InFeedAd } from '@/components/ads';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { fetchPostsAction } from '@/app/actions/postActions';

const BLOG_CATEGORIES = [
  'All',
  'Techniques',
  'Ingredient Guides',
  'Kitchen Equipment',
  'Meal Planning'
] as const;

export default function BlogIndexClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [blogs, setBlogs] = useState<ExtendedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(Number(searchParams?.get('page')) || 1);
  const limit = 6;

  // Retrieve current active category from query params
  const activeCategory = searchParams?.get('category') || 'All';

  // Handler to push category update to URL without page reloading
  const handleCategoryFilter = (category: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    params.delete('page');
    router.push(`/blog?${params.toString()}`);
    setPage(1);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (page > 1) params.set('page', page.toString());
    router.replace(`/blog?${params.toString()}`, { scroll: false });
  }, [activeCategory, page, router]);

  // Load data from server action when category or page changes
  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      const offset = (page - 1) * limit;
      try {
        const res = await fetchPostsAction(
          offset,
          limit,
          activeCategory
        );
        if (active) {
          if (!isSupabaseConfigured()) {
            // Merge local fallback from server action with client-side localStorage blogs
            const customBlogsList = getSavedBlogs();

            // Combine both lists, putting local/custom storage ones first so they override
            const combined = [...customBlogsList, ...res.posts];
            
            // Remove duplicates
            const seen = new Set();
            const uniqueCombined = combined.filter(b => {
              if (seen.has(b.id) || seen.has(b.slug)) return false;
              seen.add(b.id);
              seen.add(b.slug);
              return true;
            });

            // Filter client-side
            const filteredBlogs = uniqueCombined.filter(post => {
              const isCustom = 'status' in post || 'is_published' in post;
              if (isCustom) {
                const ext = post as ExtendedBlogPost;
                if (ext.is_published === false || ext.status === 'draft') {
                  return false;
                }
                if (ext.status === 'scheduled') {
                  const schedTime = ext.scheduledAt ? new Date(ext.scheduledAt).getTime() : 0;
                  const now = Date.now();
                  if (schedTime > now) {
                    return false;
                  }
                }
              }

              if (activeCategory !== 'All' && post.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
              return true;
            });

            // Sliced combined for page
            const paginatedCombined = filteredBlogs.slice(offset, offset + limit);
            
            setBlogs(paginatedCombined);
            setTotalCount(filteredBlogs.length);
            setHasMore(offset + limit < filteredBlogs.length);
          } else {
            setBlogs(res.posts);
            setHasMore(res.hasMore);
            setTotalCount(res.totalCount);
          }
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [page, activeCategory]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="w-full min-h-screen py-10 px-6 max-w-7xl mx-auto flex flex-col space-y-12" id="blog-index-container">
      
      {/* Editorial Masthead Design (Hero) */}
      <header className="text-center py-12 md:py-16 border-b border-cream-dark/60 dark:border-stone-850 flex flex-col items-center justify-center space-y-4" id="masthead-hero">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#7C9A7E] dark:text-[#A0BCA2] font-extrabold uppercase flex items-center gap-1.5 animate-pulse">
          <BookOpen className="w-3.5 h-3.5 text-honey" /> OUR BLOG
        </span>
        <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl text-espresso dark:text-cream tracking-tight max-w-3xl leading-[1.05]">
          The Savory <span className="text-terracotta italic font-sans font-extralight tracking-tight">Chronicle</span>
        </h1>
        <p className="font-sans text-xs sm:text-sm text-stone-700 dark:text-stone-300 max-w-xl leading-relaxed">
          Simple weeknight dinners, sweet treats, and helpful cooking tips for home cooks of all experience levels.
        </p>
      </header>

      {/* Filter Bar Row */}
      <section className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-cream-dark/30 dark:border-stone-850/30 sticky top-[69px] md:top-[85px] bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md z-20" id="filter-bar-section">
        <div className="flex overflow-x-auto no-scrollbar items-center gap-2.5 py-1">
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                id={`filter-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleCategoryFilter(cat)}
                className={`px-4 py-2.5 rounded-full font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? 'bg-terracotta text-cream scale-103 shadow-sm border-transparent'
                    : 'bg-white/80 dark:bg-stone-850/80 border border-cream-dark dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-cream/50 dark:hover:bg-stone-800 hover:scale-102'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Info indicators */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-stone-400 dark:text-stone-400 font-bold" id="grid-meta-indicator">
          <Layers className="w-3.5 h-3.5 text-sage" />
          <span>DISPLAYING {totalCount} ARTICLES</span>
        </div>
      </section>

      {/* Grid view of Blog posts - 2 column desktop, 1 column mobile */}
      <main className="w-full" id="blog-grid-main">
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs text-stone-400">Loading articles...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-cream-dark dark:border-stone-850 rounded-3xl bg-white/50 dark:bg-stone-900/30 space-y-4" id="empty-blog-state">
            <h3 className="font-serif font-bold text-lg text-espresso dark:text-cream">No Articles Found</h3>
            <p className="text-stone-400 dark:text-stone-500 text-xs font-sans">
              There are currently no editorial tips under the &ldquo;{activeCategory}&rdquo; banner.
            </p>
            <button
              onClick={() => handleCategoryFilter('All')}
              className="px-5 py-2.5 bg-espresso dark:bg-cream text-cream dark:text-espresso rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-terracotta dark:hover:bg-terracotta hover:text-white dark:hover:text-white cursor-pointer"
            >
              Reset to All
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10" id="blog-posts-grid">
              <AnimatePresence mode="popLayout">
                {blogs.flatMap((post, idx) => {
                  const elements = [
                  <motion.article
                    key={post.id}
                    id={`article-card-${post.slug}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group bg-white dark:bg-stone-850 rounded-3xl overflow-hidden border border-cream-dark/60 dark:border-stone-800/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left font-sans"
                  >
                  
                  {/* Part 1: Hero Image area */}
                  <div className="relative aspect-video w-full overflow-hidden bg-cream-dark/20" id={`image-frame-${post.id}`}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                      referrerPolicy="no-referrer"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Category Overlay Tag */}
                    <div className="absolute top-4 left-4" id={`badge-overlay-${post.id}`}>
                      <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#FAF7F2] uppercase bg-terracotta px-3 py-1.5 rounded-full shadow-md">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Part 2: Details Context area */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4" id={`text-frame-${post.id}`}>
                    <div className="space-y-2.5">
                      {/* Meta date and author */}
                      <div className="flex items-center gap-3 font-mono text-[9px] text-stone-400 dark:text-stone-500 font-bold" id={`meta-strip-${post.id}`}>
                        <span>BY {post.author.toUpperCase()}</span>
                        <span>•</span>
                        <span>{post.date.toUpperCase()}</span>
                      </div>

                      {/* Header Title linking to detail slug */}
                      <Link href={`/blog/${post.slug}`} className="block">
                        <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream leading-snug tracking-tight hover:text-terracotta dark:hover:text-terracotta-light transition-colors cursor-pointer">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Summary text */}
                      <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm font-sans leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    {/* Part 3: Lower Action reading metadata row */}
                    <div className="flex items-center justify-between pt-4 border-t border-cream-dark/40 dark:border-stone-800/60" id={`footer-strip-${post.id}`}>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-sage" />
                        <span>{post.readTime}</span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        id={`read-link-${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold uppercase text-terracotta hover:text-espresso dark:text-terracotta-light dark:hover:text-cream transition-colors group/link cursor-pointer"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>

                  </div>

                  </motion.article>
                ];
                if (idx % 4 === 3) {
                  elements.push(
                    <motion.div
                      key={`ad-${post.id}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full"
                    >
                      <InFeedAd />
                    </motion.div>
                  );
                }
                return elements;
              })}
            </AnimatePresence>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4 pb-4">
                <button
                  onClick={() => {
                    setPage(prev => Math.max(1, prev - 1));
                    window.scrollTo(0, 0);
                  }}
                  disabled={page === 1}
                  className="px-5 py-2.5 bg-white dark:bg-stone-850 border border-cream-dark dark:border-stone-800 text-espresso dark:text-cream rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:border-terracotta disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Previous
                </button>
                <span className="font-mono text-xs text-stone-500 font-bold">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => {
                    setPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo(0, 0);
                  }}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 bg-white dark:bg-stone-850 border border-cream-dark dark:border-stone-800 text-espresso dark:text-cream rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:border-terracotta disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
}
