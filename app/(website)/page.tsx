'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBlurDataURL } from '@/lib/placeholder';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Award, 
  Heart,
  RefreshCw,
  BookOpen,
  ArrowUpRight,
  Search,
  CookingPot,
  ChefHat,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RECIPES_DB } from '@/data/recipes';
import { BLOG_POSTS_DB } from '@/data/blogs';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'react-hot-toast';

// Custom lightweight SVG illustrations wrapped in circular badges for visual balance
const CookingIllustration = () => (
  <div className="w-12 h-12 rounded-full bg-sage/10 dark:bg-sage/20 flex items-center justify-center text-sage dark:text-sage-light border border-sage/20 shadow-2xs shrink-0">
    <CookingPot className="w-5 h-5" />
  </div>
);

const BakerIllustration = () => (
  <div className="w-12 h-12 rounded-full bg-terracotta/10 dark:bg-terracotta/20 flex items-center justify-center text-terracotta dark:text-terracotta-light border border-terracotta/20 shadow-2xs shrink-0">
    <ChefHat className="w-5 h-5" />
  </div>
);

const LeafyIllustration = () => (
  <div className="w-12 h-12 rounded-full bg-sage/10 dark:bg-sage/20 flex items-center justify-center text-sage dark:text-sage-light border border-sage/20 shadow-2xs shrink-0">
    <Leaf className="w-5 h-5" />
  </div>
);

export default function HomePage() {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // 1. Core State Managers for Seasonal AI Analysis
  const [aiMonth, setAiMonth] = useState('');
  const [aiSpotlightText, setAiSpotlightText] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');

  // Curated items from DB
  const mainFeature = RECIPES_DB.find(r => r.slug === 'artisanal-sourdough-levain') || RECIPES_DB[0];
  const secondaryFeature = RECIPES_DB.find(r => r.slug === 'pistachio-matcha-mille-crepe') || RECIPES_DB[3];

  // Initialize month helper
  useEffect(() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    setAiMonth(months[new Date().getMonth()]);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPhrase.trim()) {
      router.push(`/recipes?q=${encodeURIComponent(searchPhrase.trim())}`);
    } else {
      router.push('/recipes');
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    if (keyword === 'Breakfast' || keyword === 'Desserts') {
      router.push(`/recipes?category=${keyword}`);
    } else {
      router.push(`/recipes?q=${keyword}`);
    }
  };

  // Fetch seasonal AI summary from our server endpoint
  const handleFetchAiSpotlight = async () => {
    setLoadingAi(true);
    setAiSpotlightText('');
    try {
      const response = await fetch('/api/seasonal-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'seasonal_ideas', month: aiMonth }),
      });
      const data = await response.json();
      if (data.success && data.text) {
        setAiSpotlightText(data.text);
        toast.success(`Culinary harvest profiles for ${aiMonth} updated! 🌟`);
      } else {
        toast.error('Failed to parse AI harvest payload.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not load seasonal profile.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = isFavorite(id);
    toggleFavorite(id);
    if (!saved) {
      toast.success('Added to collection ♥', {
        style: { background: '#FFEBEA', color: '#D4704A', border: '1px solid #E59A7E' },
        icon: '❤️',
      });
    } else {
      toast(`Removed "${title}" from collection`);
    }
  };

  return (
    <main className="w-full flex flex-col pt-0 bg-[#FBF9F4] dark:bg-[#121212] overflow-x-hidden" id="savory-kitchen-root">

      {/* SECTION 1: EDITORIAL SPLIT HERO (Matches first uploaded layout image) */}
      <section className="relative w-full border-b border-cream-dark/50 dark:border-stone-850 grid grid-cols-1 md:grid-cols-2" id="editorial-hero">
        
        {/* Left Side: Stunning Large Food Image */}
        <div className="relative aspect-[4/3] md:aspect-auto min-h-[380px] md:min-h-[640px] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
          <Image
            src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=1200"
            alt="Delicious layered hot flapjacks pouring organic honey syrup - primary above-fold presentation"
            fill
            priority
            placeholder="blur"
            blurDataURL={getBlurDataURL("https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445")}
            className="object-cover"
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Subtle gradient to render smooth transition on small devices */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent md:hidden" />
        </div>

        {/* Right Side: Editorial Warm Cream Layout with Elegant Search */}
        <div className="bg-[#FAF6F0] dark:bg-stone-900/40 w-full flex flex-col justify-center px-8 py-14 sm:px-12 md:px-16 lg:px-20 text-left space-y-6 md:space-y-8">
          <div className="space-y-4">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-terracotta dark:text-terracotta-light font-bold uppercase block leading-none">
              OVER 50+ SIMPLE HOME-COOKED RECIPES
            </span>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-espresso dark:text-cream leading-[1.08] tracking-tight">
              What are you cooking tonight?
            </h1>
          </div>

          <p className="text-stone-700 dark:text-stone-305 font-sans text-xs sm:text-sm md:text-base leading-relaxed max-w-lg">
            Find easy weeknight dinners, sweet desserts, and simple baking ideas. Tested in our kitchen so they turn out perfect in yours.
          </p>

          {/* Clean Integrated Capsule Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md bg-white dark:bg-stone-850 rounded-full p-1.5 border border-cream-dark/80 dark:border-stone-750 flex items-center shadow-xs focus-within:ring-2 focus-within:ring-terracotta/20 focus-within:border-terracotta transition-all">
            <div className="flex items-center pl-4 pr-2 flex-grow">
              <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0 mr-2.5" />
              <input
                type="text"
                placeholder="Search recipes, ingredients..."
                value={searchPhrase}
                onChange={(e) => setSearchPhrase(e.target.value)}
                className="w-full bg-transparent text-espresso dark:text-cream text-xs focus:outline-none placeholder-stone-400 dark:placeholder-stone-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-espresso dark:bg-cream text-white dark:text-espresso text-xs font-mono font-bold tracking-wider uppercase hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Suggestive Badges Underneath */}
          <div className="flex flex-wrap items-center gap-2 max-w-md pt-1">
            {['Breakfast', 'Easy Dinners', 'Baking', 'Vegetarian', 'Desserts'].map((keyword) => {
              // Convert labels to query values
              const displayLabel = keyword;
              const actualSearchQuery = keyword === 'Easy Dinners' ? '30 mins' : keyword === 'Baking' ? 'galette' : keyword === 'Vegetarian' ? 'Vegetarian' : keyword;
              return (
                <button
                  key={keyword}
                  onClick={() => handleSuggestionClick(actualSearchQuery)}
                  className="px-4 py-2.5 rounded-full border border-cream-dark/80 dark:border-stone-750 text-stone-606 bg-white/60 dark:bg-stone-850/50 hover:bg-white dark:hover:bg-stone-800 text-[10px] sm:text-xs font-sans transition-all cursor-pointer font-medium"
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: BENTO GRID PRESENTATION */}
      <section className="py-28 px-6 md:px-12 bg-[#FBF9F4] dark:bg-stone-900/10" id="today-menu-bento">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header indicator */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-left space-y-1 max-w-xl">
              <span className="font-mono text-[10px] tracking-widest text-[#7C9A7E] dark:text-[#A0BCA2] font-extrabold uppercase">
                • TODAY'S FEATURED RECIPES
              </span>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-espresso dark:text-cream tracking-tight">
                Delicious Cooking Inspiration
              </h2>
            </div>
            <CookingIllustration />
                 {/* Premium Bento Grid Structure (12 Columns, responsive and fluid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:auto-rows-[190px] lg:auto-rows-[215px]">
            
            <div className="col-span-1 md:col-span-6 md:row-span-2 bg-[#21352A] rounded-[2rem] p-8 sm:p-12 flex flex-col justify-between text-left text-[#FAF7F2] relative overflow-hidden group shadow-md min-h-[220px] md:min-h-0" id="bento-menu-anchor">
              <div className="space-y-4 relative z-10">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#A2BCA0] font-bold uppercase block">
                  TODAY'S FEATURE
                </span>
                <h3 className="font-serif font-medium text-4xl sm:text-5xl leading-[1.1] tracking-tight max-w-md">
                  What should we cook today?
                </h3>
              </div>
              <div className="relative z-10 pt-6">
                <Link
                  href="/recipes"
                  className="px-6 py-3 rounded-full bg-white text-[#21352A] hover:bg-terracotta hover:text-white text-xs font-sans font-semibold tracking-wide inline-flex items-center gap-2 transition-all duration-300 shadow-sm"
                >
                  <span>Browse recipes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {/* Subtle background overlay */}
              <div className="absolute inset-0 bg-radial-gradient(circle at top right, rgba(230,225,212,0.06), transparent 70%) pointer-events-none" />
            </div>

            {/* Bento Item 2: Salad Bowl (Horizontal row 1) */}
            <Link
              href="/recipes/roasted-butternut-sage-buddha"
              className="col-span-1 md:col-span-3 md:row-span-1 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-xs border border-cream-dark/40 dark:border-stone-850 aspect-[4/3] md:aspect-auto min-h-[160px] md:min-h-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
                alt="Colorful fresh organic garden salad bowl"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-5 text-white text-left">
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#FAF7F2] font-semibold block">Vegetarian</span>
                <span className="font-serif font-bold text-sm tracking-tight line-clamp-1">Butternut Buddha Bowl</span>
              </div>
            </Link>

            {/* Bento Item 3: Tall Vertical Ramen Bowl (covers height of 2 rows on the right) */}
            <Link
              href="/recipes?q=ramen"
              className="col-span-1 md:col-span-3 md:row-span-2 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-md border border-cream-dark/40 dark:border-stone-850 aspect-[3/4] md:aspect-auto min-h-[280px] md:min-h-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800"
                alt="Slow simmered Japanese ramen bowl with egg"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <div className="absolute bottom-6 left-5 right-5 text-white text-left">
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#FAF7F2] font-semibold block mb-1">Dinner Classic</span>
                <h4 className="font-serif font-bold text-lg leading-tight tracking-tight mb-2">Comfort Shoyu Ramen Bowl</h4>
                <span className="font-sans text-[10px] text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sage" /> 30 mins
                </span>
              </div>
            </Link>

            {/* Bento Item 4: Strawberry Whipped Creams (Horizontal row 2) */}
            <Link
              href="/recipes/pistachio-matcha-mille-crepe"
              className="col-span-1 md:col-span-3 md:row-span-1 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-xs border border-cream-dark/40 dark:border-stone-850 aspect-[4/3] md:aspect-auto min-h-[160px] md:min-h-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800"
                alt="Beautiful sweet strawberry whipped crèmes in glass pots"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-5 text-white text-left">
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#FAF7F2] font-semibold block">Desserts</span>
                <span className="font-serif font-bold text-sm tracking-tight line-clamp-1">Mille-Crêpe Strawberry Parfait</span>
              </div>
            </Link>

            {/* Bento Item 5: Cocktails List (Row 3, Left side wide card) */}
            <Link
              href="/recipes/smoked-rosemary-grapefruit-paloma"
              className="col-span-1 md:col-span-6 md:row-span-1 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-xs border border-cream-dark/40 dark:border-stone-850 aspect-[16/9] md:aspect-auto min-h-[160px] md:min-h-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1200"
                alt="Fresh citrus cocktails with rosemary dynamic details"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                referrerPolicy="no-referrer"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
              <div className="absolute bottom-5 left-6 text-white text-left">
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#FAF7F2] font-semibold block mb-0.5">Drinks</span>
                <h4 className="font-serif font-bold text-md sm:text-lg tracking-tight leading-none">Smoked Rosemary Grapefruit Paloma</h4>
              </div>
            </Link>

            {/* Bento Item 6: Wood Fired Pizza (Row 3, Right side horizontal card) */}
            <Link
              href="/recipes/heirloom-tomato-burrata-galette"
              className="col-span-1 md:col-span-6 md:row-span-1 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-xs border border-cream-dark/40 dark:border-stone-850 aspect-[16/9] md:aspect-auto min-h-[160px] md:min-h-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200"
                alt="Crisp wood fired stone baked pizza flatbread"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                referrerPolicy="no-referrer"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
              <div className="absolute bottom-5 left-6 text-white text-left">
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#FAF7F2] font-semibold block mb-0.5">Baking</span>
                <h4 className="font-serif font-bold text-md sm:text-lg tracking-tight leading-none">Heirloom Tomato & Burrata Galette</h4>
              </div>
            </Link>

          </div>       </div>

        </div>
      </section>

      {/* SECTION 3: FEATURED RECIPES */}
      <section className="py-28 bg-white dark:bg-[#1A1A1A]" id="curated-showcase-section">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="flex items-center justify-between max-w-2xl mx-auto border-b border-cream-dark dark:border-stone-800 pb-6">
            <div className="text-left space-y-2 flex-1">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#7C9A7E] dark:text-[#A0BCA2] font-extrabold uppercase py-1">
                • OUR FAVORITES
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-espresso dark:text-cream tracking-tight">
                Our Most Loved Recipes
              </h2>
            </div>
            <BakerIllustration />
          </div>

          {/* Feature 1: Rustic Sourdough Boule */}
          <div className="group relative rounded-[3rem] border border-cream-dark dark:border-stone-800 bg-[#FAF7F1] dark:bg-stone-850 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 max-w-full">
            
            {/* Image (span 7) */}
            <div className="relative lg:col-span-7 h-[280px] sm:h-[350px] lg:h-[480px] overflow-hidden bg-cream/10">
              <Image
                src={mainFeature.image}
                alt={mainFeature.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                referrerPolicy="no-referrer"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Description context body (span 5) */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-5">
                <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-sage-dark dark:text-sage-light uppercase bg-sage/10 dark:bg-sage/20 border border-sage/20 dark:border-sage/10 px-3 py-1.5 rounded-full">
                  #{mainFeature.category} Recipe
                </span>
                
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-espresso dark:text-cream leading-tight">
                  {mainFeature.title}
                </h3>

                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                  {mainFeature.description}
                </p>

                {/* Checklist criteria */}
                <div className="space-y-2 border-t border-cream-dark/50 dark:border-stone-800/80 pt-4 font-sans text-xs text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                    <span>Perfect crispy crust and soft texture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                    <span>Simple step-by-step bread baking guide</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-4">
                <div className="flex items-center gap-4 text-stone-700 dark:text-stone-300 font-mono text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sage" />
                    <span>{mainFeature.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-terracotta" />
                    <span>{mainFeature.calories} kcal</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto text-sage">
                    <Award className="w-4 h-4" />
                    <span className="uppercase">{mainFeature.difficulty}</span>
                  </div>
                </div>

                <Link
                  href={`/recipes/${mainFeature.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-terracotta hover:bg-terracotta text-terracotta hover:text-white dark:border-terracotta-light dark:hover:bg-terracotta-light dark:text-terracotta-light dark:hover:text-espresso text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer shadow-3xs"
                >
                  <span>Get the Recipe</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

          {/* Feature 2: Pistachio Mille Crepe */}
          <div className="group relative rounded-[3rem] border border-cream-dark dark:border-stone-800 bg-[#FAF7F1] dark:bg-stone-850 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 max-w-full">
            
            {/* Text description (span 5) */}
            <div className="lg:col-span-5 p-8 sm:p-12 order-2 lg:order-1 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-5">
                <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-terracotta-dark dark:text-terracotta-light uppercase bg-terracotta/10 dark:bg-terracotta/20 border border-terracotta/20 dark:border-terracotta/10 px-3 py-1.5 rounded-full">
                  #{secondaryFeature.category} Recipe
                </span>
                
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-espresso dark:text-cream leading-tight">
                  {secondaryFeature.title}
                </h3>

                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                  {secondaryFeature.description}
                </p>

                {/* Highlight parameters list */}
                <div className="space-y-2 border-t border-cream-dark/50 dark:border-stone-800/80 pt-4 font-sans text-xs text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                    <span>Delicious stacked crepe layers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                    <span>Creamy pistachio filling</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-4">
                <div className="flex items-center gap-4 text-stone-700 dark:text-stone-300 font-mono text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sage" />
                    <span>{secondaryFeature.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-terracotta" />
                    <span>{secondaryFeature.calories} kcal</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto text-sage">
                    <Award className="w-4 h-4" />
                    <span className="uppercase">{secondaryFeature.difficulty}</span>
                  </div>
                </div>

                <Link
                  href={`/recipes/${secondaryFeature.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-terracotta hover:bg-terracotta text-terracotta hover:text-white dark:border-terracotta-light dark:hover:bg-terracotta-light dark:text-terracotta-light dark:hover:text-espresso text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer shadow-3xs"
                >
                  <span>Get the Recipe</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Image (span 7) */}
            <div className="relative lg:col-span-7 h-[280px] sm:h-[350px] lg:h-[480px] order-1 lg:order-2 overflow-hidden bg-cream/10">
              <Image
                src={secondaryFeature.image}
                alt={secondaryFeature.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                referrerPolicy="no-referrer"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: IN-SEASON COOKING IDEAS */}
      <section className="py-24 bg-white dark:bg-[#1A1A1A] border-t border-cream-dark/40 dark:border-stone-850 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="rounded-3.5xl border border-cream-dark dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-850 p-8 sm:p-12 shadow-sm relative overflow-hidden flex flex-col text-left space-y-6">
            
            {/* Glowing spotlight emblem */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-sage/10 dark:bg-sage/5 rounded-bl-[4rem] border-b border-l border-cream-dark dark:border-stone-800 flex items-center justify-center pointer-events-none">
              <Sparkles className="w-6 h-6 text-honey" />
            </div>

            <div className="flex items-center justify-between gap-4 max-w-lg">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#7C9A7E] font-extrabold uppercase">
                  • FRESH FROM THE GARDEN
                </span>
                <h3 className="font-serif font-black text-2.5xl sm:text-3xl text-espresso dark:text-cream tracking-tight">
                  In-Season Cooking Ideas
                </h3>
                <p className="text-xs sm:text-sm text-stone-550 dark:text-stone-450 leading-relaxed font-sans">
                  Not sure what ingredients are fresh this month? Let our AI suggest delicious seasonal ingredients and simple cooking ideas.
                </p>
              </div>
              <LeafyIllustration />
            </div>

            {/* Fetch controls */}
            <div className="flex items-center gap-3 pt-2 print:hidden">
              <button
                onClick={handleFetchAiSpotlight}
                disabled={loadingAi}
                className="px-6 py-3.5 bg-espresso dark:bg-cream hover:bg-terracotta dark:hover:bg-terracotta text-cream dark:text-espresso hover:text-white dark:hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40 transition-all shadow-xs shrink-0"
              >
                {loadingAi ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-sage" />
                )}
                <span>Get Seasonal Ideas for {aiMonth || 'this month'}</span>
              </button>
            </div>

            {/* Loading elements */}
            <AnimatePresence>
              {loadingAi && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-4 border-t border-cream-dark dark:border-stone-800"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-terracotta rounded-full animate-bounce" />
                    <span className="text-xs font-mono italic text-stone-400">Thinking of delicious ideas for {aiMonth || 'this month'}...</span>
                  </div>
                  <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-1/3 animate-pulse" />
                  <div className="h-3.5 bg-stone-100 dark:bg-stone-800 rounded w-5/6 animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Render Output block */}
            <AnimatePresence>
              {aiSpotlightText && !loadingAi && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-6 border-t border-cream-dark dark:border-stone-800 font-sans text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap text-left pr-4"
                >
                  <div className="space-y-4 max-w-3xl prose prose-stone dark:prose-invert">
                    <div className="p-4 bg-cream/35 dark:bg-stone-900/40 rounded-2xl border border-cream-dark dark:border-stone-800/60 font-sans text-stone-850 dark:text-stone-200 italic text-justify leading-relaxed">
                      📌 Seasonal Cooking Ideas: Here are some fresh ingredients and meal ideas for your kitchen this month.
                    </div>
                    <div className="text-xs sm:text-sm font-sans leading-relaxed text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                      {aiSpotlightText}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* SECTION 5: KITCHEN TIPS & BLOG */}
      <section className="py-28 bg-[#FBF9F4] dark:bg-stone-900/20 px-6 border-t border-cream-dark/50 dark:border-stone-850" id="blog-strip-section">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 col-auto">
            <div className="text-left space-y-2">
              <span className="font-mono text-[10px] tracking-widest text-[#7C9A7E] dark:text-[#A0BCA2] font-extrabold uppercase font-bold">
                • FROM THE BLOG
              </span>
              <h2 className="font-serif font-extrabold text-2xl md:text-3.5xl text-espresso dark:text-cream tracking-tight leading-none">
                Kitchen Tips & Cooking Guides
              </h2>
            </div>
            
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold uppercase text-terracotta hover:text-espresso dark:text-terracotta-light dark:hover:text-cream transition-colors group/link cursor-pointer underline-offset-4 hover:underline"
            >
              <span>Visit Our Blog</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </div>

          {/* Grid stack */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS_DB.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-stone-850 border border-cream-dark/60 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden bg-cream-dark/10">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-750 group-hover:scale-101"
                      referrerPolicy="no-referrer"
                      sizes="33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#FAF7F2] uppercase bg-terracotta px-2.5 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-1 text-left space-y-2">
                    <div className="flex items-center gap-2 font-mono text-[9px] text-stone-400 dark:text-stone-500 font-bold">
                      <span>BY {post.author.toUpperCase()}</span>
                      <span>•</span>
                      <span>{post.date.toUpperCase()}</span>
                    </div>
                    <h3 className="font-serif font-black text-lg text-espresso dark:text-cream leading-snug tracking-tight group-hover:text-terracotta transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-stone-700 dark:text-stone-300 text-xs font-sans leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-cream-light dark:border-stone-800/40 flex items-center justify-between text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sage" /> {post.readTime}
                  </span>
                  <span className="text-terracotta hover:underline font-semibold text-[10px] uppercase">Read Article →</span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
