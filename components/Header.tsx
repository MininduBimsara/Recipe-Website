'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  Heart,
  Clock,
  Award,
  Sparkles,
  RefreshCw,
  ArrowRight,
  UtensilsCrossed
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFavorites } from '@/hooks/useFavorites';
import { RECIPES_DB, Recipe } from '@/data/recipes';
import { BLOG_POSTS_DB, BlogPost } from '@/data/blogs';
import { useDebounce } from '@/hooks/useDebounce';

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */
const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.868-2.062-4.876-5.006-4.876-3.41 0-5.411 2.558-5.411 5.2 0 1.029.397 2.133.892 2.733.098.118.112.222.083.339l-.341 1.401c-.055.228-.182.277-.42.165-1.572-.733-2.555-3.033-2.555-4.881 0-3.974 2.887-7.623 8.322-7.623 4.37 0 7.768 3.114 7.768 7.278 0 4.341-2.737 7.834-6.536 7.834-1.277 0-2.477-.663-2.887-1.446l-.787 3.002c-.285 1.096-1.054 2.47-1.569 3.3l1.103.328C18.835 24 24 18.835 24 12 24 5.373 18.835 0 12 0z"/>
  </svg>
);

const GourmetLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="50" cy="50" r="44" strokeWidth="1.5" className="stroke-terracotta/40" />
    <circle cx="50" cy="50" r="39" strokeWidth="1" strokeDasharray="2 2" className="stroke-stone-350" />
    <path d="M50 24 C38 34 38 52 50 74 C62 52 62 34 50 24 Z" className="fill-sage/10 stroke-sage" strokeWidth="2" />
    <path d="M50 24 L50 74" className="stroke-sage" strokeWidth="1.5" />
    <circle cx="50" cy="34" r="2" className="fill-honey stroke-none" />
    <circle cx="44" cy="46" r="1.5" className="fill-terracotta stroke-none" />
    <circle cx="56" cy="46" r="1.5" className="fill-terracotta stroke-none" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Full-screen Search Modal                                            */
/* ------------------------------------------------------------------ */
interface AiSuggestion {
  title: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce<string>(query, 280);

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const [triggeredAiQuery, setTriggeredAiQuery] = useState('');

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Reset AI suggestions when query changes
  useEffect(() => {
    setAiSuggestions([]);
    setTriggeredAiQuery('');
  }, [debouncedQuery]);

  const normalizedSearch = debouncedQuery.toLowerCase().trim();

  const matchingRecipes: Recipe[] = RECIPES_DB.filter((r) => {
    if (!normalizedSearch) return false;
    return (
      r.title.toLowerCase().includes(normalizedSearch) ||
      r.description.toLowerCase().includes(normalizedSearch) ||
      r.category.toLowerCase().includes(normalizedSearch) ||
      r.ingredients.some((ing) => ing.toLowerCase().includes(normalizedSearch))
    );
  }).slice(0, 6);

  const matchingBlogs: BlogPost[] = BLOG_POSTS_DB.filter((p) => {
    if (!normalizedSearch) return false;
    return (
      p.title.toLowerCase().includes(normalizedSearch) ||
      p.summary.toLowerCase().includes(normalizedSearch) ||
      p.category.toLowerCase().includes(normalizedSearch)
    );
  }).slice(0, 4);

  const hasResults = matchingRecipes.length > 0 || matchingBlogs.length > 0;

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return <>{text}</>;
    const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-honey/30 text-espresso font-semibold rounded px-0.5 dark:bg-honey/20 dark:text-cream not-italic">
              {part}
            </mark>
          ) : part
        )}
      </>
    );
  };

  const handleFetchAiSuggestions = async () => {
    setLoadingAi(true);
    setAiSuggestions([]);
    setTriggeredAiQuery(debouncedQuery);
    try {
      const res = await fetch(`/api/suggest-recipes?q=${encodeURIComponent(debouncedQuery)}`);
      const data = await res.json();
      if (data.suggestions) setAiSuggestions(data.suggestions);
    } catch {
      // silent — user can retry
    } finally {
      setLoadingAi(false);
    }
  };

  const navigateTo = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex flex-col"
      id="search-modal-overlay"
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-espresso/60 dark:bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal panel — slides down from top */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative z-10 bg-white dark:bg-[#1A1A1A] w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Search bar header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-cream-dark dark:border-stone-800">
          <Search className="w-5 h-5 text-terracotta shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                navigateTo(`/search?q=${encodeURIComponent(query.trim())}`);
              }
            }}
            placeholder="Search recipes, ingredients, blog posts..."
            className="flex-1 bg-transparent text-base md:text-lg text-espresso dark:text-cream placeholder-stone-400 focus:outline-none font-sans"
            id="search-modal-input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-terracotta transition-colors cursor-pointer"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-espresso dark:hover:text-cream hover:bg-cream dark:hover:bg-stone-800 transition cursor-pointer"
            title="Close search (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results area — scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Empty state */}
          {!debouncedQuery && (
            <div className="py-16 text-center space-y-3 text-stone-400">
              <UtensilsCrossed className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-700" />
              <p className="font-serif text-espresso dark:text-cream font-semibold text-base">
                What are you craving today?
              </p>
              <p className="text-xs font-sans">
                Try &ldquo;pasta&rdquo;, &ldquo;sourdough&rdquo;, or an ingredient like &ldquo;lemon&rdquo;
              </p>
            </div>
          )}

          {/* Results */}
          {debouncedQuery && (
            <div className="px-6 py-6 space-y-8 max-w-5xl mx-auto w-full">

              {/* Count bar */}
              {hasResults && (
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest border-b border-cream-dark/40 dark:border-stone-800 pb-3">
                  <span>Results for &ldquo;{debouncedQuery}&rdquo;</span>
                  <span className="text-sage">{matchingRecipes.length} recipes · {matchingBlogs.length} posts</span>
                </div>
              )}

              {/* Recipes */}
              {matchingRecipes.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-terracotta" />
                    <h3 className="font-serif font-bold text-sm text-espresso dark:text-cream">Recipes</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchingRecipes.map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => navigateTo(`/recipes/${recipe.slug}`)}
                        className="group text-left flex items-start gap-3 p-3 rounded-xl border border-cream-dark/50 dark:border-stone-800 bg-cream/20 dark:bg-stone-850/50 hover:border-terracotta/40 hover:shadow-sm transition cursor-pointer w-full"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                          <Image src={recipe.image} alt={recipe.title} fill className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-mono font-bold tracking-widest text-terracotta uppercase">{recipe.category}</span>
                          <p className="font-serif font-bold text-sm text-espresso dark:text-cream group-hover:text-terracotta transition-colors line-clamp-1 leading-snug">
                            {highlightText(recipe.title, debouncedQuery)}
                          </p>
                          <div className="flex items-center gap-3 mt-1 font-mono text-[9px] text-stone-400">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepTime}</span>
                            <span className="flex items-center gap-1"><Award className="w-3 h-3" />{recipe.difficulty}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-terracotta group-hover:translate-x-0.5 transition self-center shrink-0" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Blog posts */}
              {matchingBlogs.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-sage" />
                    <h3 className="font-serif font-bold text-sm text-espresso dark:text-cream">From the Blog</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchingBlogs.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => navigateTo(`/blog/${post.slug}`)}
                        className="group text-left flex items-start gap-3 p-3 rounded-xl border border-cream-dark/50 dark:border-stone-800 bg-cream/20 dark:bg-stone-850/50 hover:border-sage/40 hover:shadow-sm transition cursor-pointer w-full"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                          <Image src={post.image} alt={post.title} fill className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-mono font-bold tracking-widest text-sage uppercase">{post.category}</span>
                          <p className="font-serif font-bold text-sm text-espresso dark:text-cream group-hover:text-terracotta transition-colors line-clamp-1 leading-snug">
                            {highlightText(post.title, debouncedQuery)}
                          </p>
                          <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">{post.readTime} · {post.author}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-terracotta group-hover:translate-x-0.5 transition self-center shrink-0" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* No results → AI suggestions */}
              {!hasResults && debouncedQuery && (
                <div className="text-center py-8 space-y-5">
                  <div className="space-y-1">
                    <p className="font-serif font-bold text-espresso dark:text-cream text-base">
                      No results for &ldquo;{debouncedQuery}&rdquo;
                    </p>
                    <p className="text-xs text-stone-400 font-sans">
                      Let our AI suggest some recipe ideas for you.
                    </p>
                  </div>
                  <button
                    onClick={handleFetchAiSuggestions}
                    disabled={loadingAi}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-espresso dark:bg-cream hover:bg-terracotta dark:hover:bg-terracotta text-cream dark:text-espresso hover:text-white dark:hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-all disabled:opacity-40"
                  >
                    {loadingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-honey" />}
                    Get AI Recipe Ideas
                  </button>

                  {/* AI Results grid */}
                  <AnimatePresence>
                    {aiSuggestions.length > 0 && !loadingAi && triggeredAiQuery === debouncedQuery && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4 border-t border-cream-dark dark:border-stone-800"
                      >
                        {aiSuggestions.map((sug, idx) => (
                          <div key={idx} className="bg-cream/40 dark:bg-stone-900/40 border border-cream-dark dark:border-stone-800 p-4 rounded-2xl space-y-2">
                            <span className="text-[8px] font-mono font-bold text-terracotta uppercase">#{idx + 1} AI Idea</span>
                            <p className="font-serif font-bold text-sm text-espresso dark:text-cream leading-snug">{sug.title}</p>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">{sug.description}</p>
                            <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 pt-1 border-t border-cream-dark/30 dark:border-stone-800/40">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-sage" />{sug.prepTime}</span>
                              <span className="text-terracotta font-bold">{sug.difficulty.toUpperCase()}</span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between px-6 py-2.5 border-t border-cream-dark/60 dark:border-stone-800 bg-cream/30 dark:bg-stone-900/30">
          <span className="text-[10px] font-mono text-stone-400">Press <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-bold">Esc</kbd> to close</span>
          {debouncedQuery && (
            <button
              onClick={() => navigateTo(`/search?q=${encodeURIComponent(debouncedQuery)}`)}
              className="text-[10px] font-mono font-bold text-terracotta hover:underline cursor-pointer"
            >
              See all results →
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                              */
/* ------------------------------------------------------------------ */
export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { favorites } = useFavorites();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => setMounted(true), 0);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Open search with Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Search tab removed — integrated into modal
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Blog', href: '/blog' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (href === '/blog' || href === '/recipes' || href === '/') {
      if (pathname === href) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (pathname !== '/' && href.startsWith('/#')) {
      e.preventDefault();
      router.push(href);
      return;
    }
    if (href.startsWith('/#')) {
      const elementId = href.replace('/#', '');
      const target = document.getElementById(elementId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 border-b print:hidden ${
          scrolled 
            ? 'py-2.5 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md shadow-sm border-cream-dark/50 dark:border-stone-800' 
            : 'py-4 bg-white dark:bg-[#1A1A1A] border-cream-dark dark:border-stone-800'
        }`}
        id="global-header"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LEFT: Logo */}
          <a 
            href="/" 
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Image 
              src="/logo.png" 
              alt="PebblePlate Logo" 
              width={40}
              height={40}
              className="object-contain transition-all duration-300 group-hover:scale-105" 
              priority
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-tight tracking-tight text-espresso dark:text-cream">
                PebblePlate
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400">
                pebbleplate.page
              </span>
            </div>
          </a>

          {/* CENTRE: Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs uppercase tracking-widest font-mono text-stone-600 dark:text-stone-300 hover:text-terracotta dark:hover:text-terracotta transition-colors relative group py-2 font-bold"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* RIGHT: Search, Favorites, Pinterest, Hamburger */}
          <div className="flex items-center gap-3">
            
            {/* Search icon — opens modal */}
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cream-dark dark:border-stone-700 bg-cream/40 dark:bg-stone-800/40 hover:border-terracotta/50 hover:bg-cream dark:hover:bg-stone-800 transition-all cursor-pointer"
              title="Search recipes  (⌘K)"
              id="open-search-modal-btn"
            >
              <Search className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 group-hover:text-terracotta transition-colors" />
              <span className="hidden sm:block text-[10px] font-mono text-stone-400 dark:text-stone-500 group-hover:text-terracotta transition-colors">
                Search
              </span>
              <kbd className="hidden lg:block text-[8px] font-mono px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-400 border border-stone-200 dark:border-stone-600">
                ⌘K
              </kbd>
            </button>

            {/* Favorites heart */}
            <Link 
              href="/favorites"
              className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-terracotta dark:hover:text-terracotta group cursor-pointer"
              title="Saved Recipes"
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-terracotta text-terracotta' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-cream text-[8px] font-bold rounded-full flex items-center justify-center border border-white dark:border-stone-900">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Pinterest follow button */}
            <a
              href="https://pinterest.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E60023] hover:bg-[#AD0018] text-white text-[11px] font-bold uppercase tracking-wider font-mono cursor-pointer transition-all shadow-sm"
              title="Follow our Board"
            >
              <PinterestIcon className="w-3.5 h-3.5 fill-white" />
              <span>Follow</span>
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-stone-600 dark:text-stone-300 hover:text-terracotta dark:hover:text-terracotta cursor-pointer transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen search modal */}
      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden print:hidden" id="mobile-drawer-root">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#150A05]/60 backdrop-blur-xs"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-[#1A1A1A] p-6 flex flex-col justify-between shadow-2xl border-r border-cream-dark dark:border-stone-800"
            >
              <div className="space-y-8">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-cream-dark dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="/logo.png" 
                      alt="PebblePlate Logo" 
                      width={32}
                      height={32}
                      className="object-contain shrink-0" 
                    />
                    <span className="font-serif font-bold text-base text-espresso dark:text-cream">PebblePlate</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-stone-400 dark:text-stone-500 hover:text-espresso dark:hover:text-cream cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search trigger inside drawer */}
                <button
                  onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-cream dark:bg-stone-800 border border-cream-dark dark:border-stone-700 rounded-xl text-sm text-stone-400 font-sans hover:border-terracotta/50 transition cursor-pointer text-left"
                >
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Search recipes...</span>
                </button>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-4">
                  {[
                    ...navLinks,
                    { name: 'About', href: '/about' },
                    { name: 'Contact', href: '/contact' }
                  ].map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="flex items-center justify-between py-2 text-stone-700 dark:text-stone-300 font-serif font-semibold text-sm hover:text-terracotta dark:hover:text-terracotta border-b border-cream-dark/30 dark:border-stone-800/20"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="space-y-4 pt-4 border-t border-cream-dark dark:border-stone-800">
                <div className="flex items-center justify-center gap-4 text-[11px] font-sans font-semibold text-stone-500 mb-1" id="drawer-legal-bar">
                  <a href="/privacy-policy" onClick={(e) => handleLinkClick(e, '/privacy-policy')} className="hover:text-terracotta transition-colors">
                    Privacy Policy
                  </a>
                  <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
                  <a href="/terms" onClick={(e) => handleLinkClick(e, '/terms')} className="hover:text-terracotta transition-colors">
                    Terms
                  </a>
                </div>
                <a
                  href="https://pinterest.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E60023] hover:bg-[#AD0018] text-white text-xs font-bold uppercase tracking-wider font-mono cursor-pointer transition-colors shadow-sm"
                >
                  <PinterestIcon className="w-4.5 h-4.5 fill-white" />
                  <span>Follow on Pinterest</span>
                </a>
                <p className="text-[10px] text-center text-stone-500 dark:text-stone-400 tracking-wide font-sans">
                  PebblePlate • 2026
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
