'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Clock, 
  Award, 
  RefreshCw, 
  ArrowRight,
  UtensilsCrossed,
  ArrowUpRight
} from 'lucide-react';
import { RECIPES_DB, Recipe } from '@/data/recipes';
import { BLOG_POSTS_DB, BlogPost } from '@/data/blogs';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-hot-toast';

// AI Generated suggestion interface
interface AiSuggestion {
  title: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Core query state and debounce
  const initialQuery = searchParams?.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce<string>(query, 300);

  // 2. Active overlay state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // 3. AI inspiration suggestions state
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const [triggeredAiQuery, setTriggeredAiQuery] = useState('');

  // Update URL search address when raw query states change, to keep shareable URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (debouncedQuery) {
      params.set('q', debouncedQuery);
    } else {
      params.delete('q');
    }
    router.replace(`/search?${params.toString()}`);
    // Reset AI suggestions when a new search starts
    setAiSuggestions([]);
    setTriggeredAiQuery('');
  }, [debouncedQuery, router, searchParams]);

  // Synchronize on back/forward browser navigation
  useEffect(() => {
    const term = searchParams?.get('q') || '';
    if (term !== query) {
      setQuery(term);
    }
  }, [searchParams]);

  // Handle ingredient matching search logic
  const normalizedSearch = debouncedQuery.toLowerCase().trim();

  const matchingRecipes = RECIPES_DB.filter((recipe) => {
    if (!normalizedSearch) return false;
    return (
      recipe.title.toLowerCase().includes(normalizedSearch) ||
      recipe.description.toLowerCase().includes(normalizedSearch) ||
      recipe.category.toLowerCase().includes(normalizedSearch) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(normalizedSearch))
    );
  });

  const matchingBlogs = BLOG_POSTS_DB.filter((post) => {
    if (!normalizedSearch) return false;
    return (
      post.title.toLowerCase().includes(normalizedSearch) ||
      post.summary.toLowerCase().includes(normalizedSearch) ||
      post.category.toLowerCase().includes(normalizedSearch)
    );
  });

  // Highlight matched substrings helper
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    // Escaping search terms to prevent RegExp crashes
    const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-honey/30 text-espresso font-semibold rounded-[4px] px-1 py-0.5 dark:bg-honey/20 dark:text-cream">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Call API for Gemini ideas if catalog search yields nothing
  const handleFetchAiSuggestions = async () => {
    setLoadingAi(true);
    setAiSuggestions([]);
    setTriggeredAiQuery(debouncedQuery);
    try {
      const response = await fetch(`/api/suggest-recipes?q=${encodeURIComponent(debouncedQuery)}`);
      const data = await response.json();
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
        toast.success(`Found 3 recipe suggestions for "${debouncedQuery}"! ✨`);
      } else {
        toast.error('Could not construct suggestions.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Could not connect to the recipe server.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-6 max-w-7xl mx-auto flex flex-col space-y-12" id="search-main-container">
      
      {/* Header section with central searching field */}
      <header className="text-center py-8 border-b border-cream-dark/60 dark:border-stone-850 flex flex-col items-center justify-center space-y-5" id="search-header">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#7C9A7E] dark:text-[#A0BCA2] font-extrabold uppercase flex items-center gap-1.5">
          <UtensilsCrossed className="w-3.5 h-3.5 text-honey animate-bounce" /> SEARCH OUR RECIPES
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-espresso dark:text-cream tracking-tight max-w-2xl leading-none">
          Explore the Kitchen
        </h1>
        <p className="font-sans text-xs text-stone-500 max-w-md leading-relaxed">
          Search our collection of easy recipes and cooking tips to find exactly what you want to cook.
        </p>

        {/* Floating search input wrapper */}
        <div className="relative w-full max-w-xl shadow-xs hover:shadow-md transition-shadow rounded-full overflow-hidden bg-white dark:bg-stone-850 border border-cream-dark dark:border-stone-750" id="search-bar-frame">
          <input
            type="text"
            id="search-input-box"
            placeholder="Search recipes, ingredients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-espresso dark:text-cream placeholder-stone-400 py-3.5 pl-12 pr-12 focus:outline-none"
          />
          <Search className="absolute left-4.5 top-4 w-4.5 h-4.5 text-stone-400" />
          
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-3.5 px-1.5 py-0.5 rounded-full bg-cream-dark/40 hover:bg-cream-dark text-espresso dark:text-cream text-[9px] font-mono font-bold uppercase transition"
              title="Clear text"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {/* Main split results row display */}
      <main className="w-full" id="search-results-board">
        
        {/* State A: Initial instruction display if search is empty */}
        {!debouncedQuery && (
          <div className="py-16 text-center text-stone-400 dark:text-stone-550 space-y-3" id="blank-search-state">
            <span className="font-mono text-3xl block">🔍</span>
            <p className="font-serif text-espresso dark:text-cream font-bold text-lg">Your Search query goes here.</p>
            <p className="font-sans text-xs max-w-md mx-auto leading-relaxed">
              Type keywords above to find related recipes and blog posts.
            </p>
          </div>
        )}

        {/* State B: Active Search results */}
        {debouncedQuery && (
          <div className="space-y-12">
            
            {/* Header counters */}
            <div className="flex items-center justify-between border-b border-cream-dark/30 dark:border-stone-850/40 pb-3" id="results-meta-toolbar">
              <span className="font-mono text-[10px] text-stone-405 dark:text-stone-550 font-extrabold uppercase">
                🔍 RESULTS FOR &ldquo;{debouncedQuery.toUpperCase()}&rdquo;
              </span>
              <span className="font-mono text-[10px] text-sage font-bold">
                FOUND {matchingRecipes.length} RECIPES / {matchingBlogs.length} BLOG POSTS
              </span>
            </div>

            {/* Split panels - Recipes on left, Blogs on right (only if results exist) */}
            {(matchingRecipes.length > 0 || matchingBlogs.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12" id="results-split-layout">
                
                {/* COLUMN 1: MATCHING RECIPES (span 6) */}
                <section className="lg:col-span-6 space-y-6 text-left" id="matching-recipes-column">
                  <div className="flex items-center gap-2 border-b border-cream-dark/40 dark:border-stone-800 pb-2">
                    <span className="w-2.5 h-2.5 bg-terracotta rounded-full" />
                    <h2 className="font-serif font-bold text-xl text-espresso dark:text-cream">
                      Recipes ({matchingRecipes.length})
                    </h2>
                  </div>

                  {matchingRecipes.length === 0 ? (
                    <div className="p-6 text-center text-stone-400 font-mono text-xs border border-dashed border-cream-dark dark:border-stone-850 rounded-2xl bg-white/20">
                      No recipes correspond to this keyword.
                    </div>
                  ) : (
                    <div className="space-y-4" id="matching-recipes-list">
                      {matchingRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          id={`recipe-result-${recipe.slug}`}
                          onClick={() => router.push(`/recipes/${recipe.slug}`)}
                          className="group p-4 bg-white dark:bg-stone-850 border border-cream-dark/50 dark:border-stone-800/80 rounded-2xl flex gap-4 hover:shadow-lg transition cursor-pointer text-left items-start"
                        >
                          {/* Image Thumbnail */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-cream/10 border border-cream-dark/30">
                            <Image
                              src={recipe.image}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Content summary */}
                          <div className="flex-1 space-y-1">
                            <span className="text-[8px] font-mono font-bold tracking-widest text-terracotta-dark dark:text-terracotta-light bg-terracotta/10 dark:bg-terracotta/20 border border-terracotta/20 dark:border-terracotta/10 px-1.5 py-0.5 rounded">
                              {recipe.category}
                            </span>
                            <h3 className="font-serif font-bold text-sm sm:text-base text-espresso dark:text-cream group-hover:text-terracotta transition-colors pt-0.5 leading-snug">
                              {highlightText(recipe.title, debouncedQuery)}
                            </h3>
                            <p className="text-stone-500 dark:text-stone-400 text-xs line-clamp-1 py-0.5">
                              {highlightText(recipe.description, debouncedQuery)}
                            </p>

                            {/* Micro tags highlight */}
                            <div className="flex items-center gap-3 pt-1 font-mono text-[9px] text-stone-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-sage" /> {recipe.prepTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-sage" /> {recipe.difficulty}
                              </span>
                            </div>
                          </div>
                          
                          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-terracotta group-hover:translate-x-1 transition self-center hidden sm:block" />
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* COLUMN 2: MATCHING BLOG CHRONICLES (span 6) */}
                <section className="lg:col-span-6 space-y-6 text-left" id="matching-blogs-column">
                  <div className="flex items-center gap-2 border-b border-cream-dark/40 dark:border-stone-800 pb-2">
                    <span className="w-2.5 h-2.5 bg-sage rounded-full" />
                    <h2 className="font-serif font-bold text-xl text-espresso dark:text-cream">
                      From the Blog ({matchingBlogs.length})
                    </h2>
                  </div>

                  {matchingBlogs.length === 0 ? (
                    <div className="p-6 text-center text-stone-400 font-mono text-xs border border-dashed border-cream-dark dark:border-stone-850 rounded-2xl bg-white/20">
                      No matching blog posts.
                    </div>
                  ) : (
                    <div className="space-y-4" id="matching-blogs-list">
                      {matchingBlogs.map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          id={`blog-result-${post.slug}`}
                          className="group p-4 bg-white dark:bg-stone-850 border border-cream-dark/50 dark:border-stone-800/80 rounded-2xl flex gap-4 hover:shadow-lg transition cursor-pointer text-left items-start block"
                        >
                          {/* Image Thumbnail */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-cream/10 border border-cream-dark/30">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Details details */}
                          <div className="flex-1 space-y-1">
                            <span className="text-[8px] font-mono font-bold tracking-widest text-sage-dark dark:text-sage-light bg-sage/10 dark:bg-sage/20 border border-sage/20 dark:border-sage/10 px-1.5 py-0.5 rounded">
                              {post.category}
                            </span>
                            <h3 className="font-serif font-bold text-sm sm:text-base text-espresso dark:text-cream group-hover:text-terracotta transition-colors pt-0.5 leading-snug">
                              {highlightText(post.title, debouncedQuery)}
                            </h3>
                            <p className="text-stone-500 dark:text-stone-400 text-xs line-clamp-1 py-0.5 leading-relaxed">
                              {highlightText(post.summary, debouncedQuery)}
                            </p>

                            <div className="flex items-center justify-between pt-1 font-mono text-[9px] text-stone-400 font-bold">
                              <span>BY {post.author.toUpperCase()}</span>
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          
                          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-terracotta group-hover:translate-x-1 transition self-center hidden sm:block" />
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

              </div>
            )}

            {/* State C: Empty Search results — Call AI Inspiration! */}
            {matchingRecipes.length === 0 && matchingBlogs.length === 0 && (
              <div 
                className="p-8 sm:p-12 text-center border border-cream-dark dark:border-stone-800 rounded-3xl bg-white dark:bg-stone-850 shadow-sm max-w-3xl mx-auto flex flex-col items-center space-y-6" 
                id="empty-results-ai-prompt"
              >
                
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-espresso dark:text-cream leading-tight">
                    No results for &ldquo;{debouncedQuery}&rdquo; — let AI inspire you!
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans max-w-md mx-auto leading-relaxed">
                    We didn't find any direct matches in our catalog, but our AI assistant can suggest 3 quick recipe ideas for your keyword.
                  </p>
                </div>

                {/* Generate button with active states */}
                <button
                  onClick={handleFetchAiSuggestions}
                  disabled={loadingAi}
                  className="px-6 py-3.5 bg-espresso dark:bg-cream hover:bg-terracotta dark:hover:bg-terracotta text-cream dark:text-espresso hover:text-white dark:hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40"
                  id="generate-ai-ideas-btn"
                >
                  {loadingAi ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-honey" />
                  )}
                  <span>Get AI Recipe Ideas</span>
                </button>

                {/* Skeleton Loader panel compiling */}
                <AnimatePresence>
                  {loadingAi && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full space-y-4 pt-6 border-t border-cream-dark dark:border-stone-800"
                    >
                      <div className="flex items-center justify-center gap-2 font-mono text-xs text-stone-400 italic">
                        <RefreshCw className="w-4.5 h-4.5 animate-spin text-terracotta" />
                        <span>Asking our AI for suggestions...</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((s) => (
                          <div key={s} className="bg-cream-light/30 dark:bg-stone-900/40 p-4 rounded-2xl space-y-2.5 animate-pulse border border-cream-dark/20 text-left">
                            <div className="h-4.5 bg-stone-200 dark:bg-stone-800 rounded w-2/3" />
                            <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded w-full" />
                            <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded w-5/6" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Display Gemini synthesized suggestions */}
                <AnimatePresence>
                  {aiSuggestions.length > 0 && !loadingAi && triggeredAiQuery === debouncedQuery && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full pt-6 border-t border-cream-dark dark:border-stone-800 text-left space-y-4"
                      id="ai-suggestions-grid-parent"
                    >
                      
                      <div className="flex items-center gap-2 text-sage dark:text-sage-light font-mono text-[10px] font-bold uppercase pb-1">
                        <Sparkles className="w-4 h-4 text-honey animate-pulse" />
                        <span>Suggested by AI</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="suggestions-box-grid">
                        {aiSuggestions.map((sug, idx) => (
                          <div
                            key={idx}
                            className="bg-cream-light/40 dark:bg-stone-900/30 border border-cream-dark dark:border-stone-800/80 p-5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <span className="inline-block text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-terracotta/10 text-terracotta dark:text-terracotta-light">
                                #{idx + 1} AI CONCEPT
                              </span>
                              
                              <h4 className="font-serif font-bold text-sm sm:text-base text-espresso dark:text-cream leading-tight">
                                {sug.title}
                              </h4>
                              
                              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans leading-relaxed text-justify">
                                {sug.description}
                              </p>
                            </div>

                            {/* footer Specs */}
                            <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 pt-2 border-t border-cream-dark/30 dark:border-stone-800/40 font-bold">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-sage" /> {sug.prepTime}
                              </span>
                              <span className="text-terracotta">{sug.difficulty.toUpperCase()}</span>
                            </div>

                          </div>
                        ))}
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}

// Suspense fallback
function SearchPageFallback() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      <span className="font-mono text-xs text-stone-405">Loading search...</span>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
