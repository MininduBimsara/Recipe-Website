'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Clock, Filter, Leaf, Globe2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Recipe, RECIPES_DB } from '@/data/recipes';
import { getSavedRecipes } from '@/lib/preseededPool';
import RecipeCard from '@/components/RecipeCard';
import { useDebounce } from '@/hooks/useDebounce';

const RECIPE_CATEGORIES = [
  'All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Quick & Easy', 'Vegetarian', 'Meal Prep', 'Drinks'
] as const;

const CUISINES = ['All', 'French', 'Italian', 'Mediterranean', 'Indian', 'Asian', 'American', 'Nordic'];

const DIETARY_PREFS = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Carb', 'Keto', 'Dairy-Free'];

export default function RecipesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeCuisine, setActiveCuisine] = useState<string>('All');
  const [activeDiet, setActiveDiet] = useState<string>('All');
  const [searchPhrase, setSearchPhrase] = useState('');
  const [pantryIngredients, setPantryIngredients] = useState(''); // Comma-separated pantry ingredients
  
  const debouncedSearch = useDebounce<string>(searchPhrase, 300);
  const debouncedPantry = useDebounce<string>(pantryIngredients, 300);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [showAdvanceFilters, setShowAdvanceFilters] = useState(false);

  // Scrollbar variables and logic
  const categoryScrollerRef = useRef<HTMLDivElement>(null);
  const [thumbWidth, setThumbWidth] = useState('20%');
  const [thumbLeft, setThumbLeft] = useState('0%');
  const [showScroller, setShowScroller] = useState(false);

  const updateScrollState = () => {
    if (categoryScrollerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const visibleRatio = clientWidth / scrollWidth;
        const progress = scrollLeft / maxScroll;
        const calculatedWidth = Math.max(10, Math.min(80, visibleRatio * 100));
        const leftPos = progress * (100 - calculatedWidth);
        
        setThumbWidth(`${calculatedWidth}%`);
        setThumbLeft(`${leftPos}%`);
        setShowScroller(true);
      } else {
        setShowScroller(false);
      }
    }
  };

  const handleScrollLeft = () => {
    if (categoryScrollerRef.current) {
      categoryScrollerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (categoryScrollerRef.current) {
      categoryScrollerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => {
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollState();
    }, 150);
    return () => clearTimeout(timer);
  }, [recipes, activeCategory]);

  // Sync state initially
  useEffect(() => {
    if (searchParams) {
      setActiveCategory(searchParams.get('category') || 'All');
      setSearchPhrase(searchParams.get('q') || '');
    }
  }, [searchParams]);

  // Load and apply multi-faceted filter matching client-side
  useEffect(() => {
    // 1. Merge hardcoded recipes with User created & preseeded queue
    const customRecipes = getSavedRecipes();
    const merged = [...RECIPES_DB, ...customRecipes];

    // Remove duplicates by ID or Slug
    const seen = new Set<string>();
    const uniqueList = merged.filter(r => {
      if (seen.has(r.id) || seen.has(r.slug)) {
        return false;
      }
      seen.add(r.id);
      seen.add(r.slug);
      return true;
    });

    // 2. Perform filters
    let filtered = uniqueList.filter(recipe => {
      // Check if scheduled in future
      const isCustom = 'status' in recipe;
      if (isCustom) {
        const ext = recipe as any;
        if (ext.status === 'scheduled') {
          const schedTime = ext.scheduledAt ? new Date(ext.scheduledAt).getTime() : 0;
          const now = Date.now();
          if (schedTime > now) {
            return false; // hide future scheduled items
          }
        }
      }

      // Category Match
      if (activeCategory !== 'All') {
        if (recipe.category.toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }
      }

      // Cuisine Match
      if (activeCuisine !== 'All') {
        const cuis = (recipe.recipeCuisine || '').toLowerCase();
        if (!cuis.includes(activeCuisine.toLowerCase())) {
          return false;
        }
      }

      // Dietary Match
      if (activeDiet !== 'All') {
        const dietQuery = activeDiet.toLowerCase();
        const tagsJoined = (recipe.tags || []).join(' ').toLowerCase();
        const catQuery = recipe.category.toLowerCase();
        
        let match = false;
        if (dietQuery === 'vegetarian' && (tagsJoined.includes('vegetarian') || catQuery === 'vegetarian')) match = true;
        if (dietQuery === 'vegan' && (tagsJoined.includes('vegan') || tagsJoined.includes('plant-based'))) match = true;
        if (dietQuery === 'gluten-free' && (tagsJoined.includes('gluten-free') || tagsJoined.includes('gf'))) match = true;
        if (dietQuery === 'low-carb' && (tagsJoined.includes('low-carb') || tagsJoined.includes('keto'))) match = true;
        if (dietQuery === 'keto' && tagsJoined.includes('keto')) match = true;
        if (dietQuery === 'dairy-free' && tagsJoined.includes('dairy-free')) match = true;
        
        if (!match) return false;
      }

      // Search Phrase keyword Match (matches on title, description, or tags)
      if (debouncedSearch) {
        const word = debouncedSearch.toLowerCase();
        const titleMatch = recipe.title.toLowerCase().includes(word);
        const descMatch = recipe.description.toLowerCase().includes(word);
        const tagsMatch = (recipe.tags || []).join(' ').toLowerCase().includes(word);
        if (!titleMatch && !descMatch && !tagsMatch) {
          return false;
        }
      }

      // Pantry Ingredients Matcher (Ingredient Availability Matcher!)
      if (debouncedPantry) {
        const pantryItems = debouncedPantry.toLowerCase().split(',').map(item => item.trim()).filter(Boolean);
        if (pantryItems.length > 0) {
          // Check if recipes ingredients contain ANY of the pantry items
          const recipeIngredientsJoined = recipe.ingredients.join(' ').toLowerCase();
          const matchesAny = pantryItems.some(item => recipeIngredientsJoined.includes(item));
          if (!matchesAny) {
            return false;
          }
        }
      }

      return true;
    });

    setRecipes(filtered);
    setVisibleCount(12);

    // Sync URLs
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (debouncedSearch) params.set('q', debouncedSearch);
    router.replace(`/recipes?${params.toString()}`, { scroll: false });
  }, [activeCategory, activeCuisine, activeDiet, debouncedSearch, debouncedPantry]);

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(e.target.value);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const currentBatch = recipes.slice(0, visibleCount);
  const hasMore = visibleCount < recipes.length;

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-espresso py-10 px-6 max-w-7xl mx-auto flex flex-col space-y-8" id="recipes-index-board">
      
      {/* Visual Masthead and Header design */}
      <header className="text-center py-12 border-b border-stone-200 flex flex-col items-center justify-center space-y-4" id="recipes-masthead">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#7C9A7E] font-extrabold uppercase flex items-center gap-1.5">
          RECIPE CATALOG
        </span>
        <h1 className="font-serif font-bold text-4.5xl sm:text-5xl md:text-6xl text-espresso tracking-tight max-w-3xl leading-[1.05]">
          Our Recipes
        </h1>
        <p className="font-sans text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
          Find the perfect recipe by ingredient, cuisine, or dietary preference. Let's make something delicious!
        </p>
      </header>

      {/* Primary Filter Rows */}
      <section className="space-y-4" id="filter-bar-deck">
        
        {/* Row A: Categories & Text Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 py-2 border-b border-stone-150" id="row-a">
          {/* Categories select scroller wrapper */}
          <div className="flex flex-col gap-2 flex-1 min-w-0" id="category-scroller-wrapper">
            <div 
              ref={categoryScrollerRef}
              onScroll={updateScrollState}
              className="flex overflow-x-auto no-scrollbar items-center gap-2 py-1 scroll-smooth" 
              id="category-scroller"
            >
              {RECIPE_CATEGORIES.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase whitespace-nowrap cursor-pointer transition-all ${
                      isActive
                        ? 'bg-terracotta text-white scale-102 shadow-xs'
                        : 'bg-white border text-stone-605 hover:bg-stone-50 hover:scale-101'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Custom Horizontal Scrollbar Controls */}
            {showScroller && (
              <div className="flex items-center gap-2 px-1 py-1" id="category-scrollbar-controls">
                <button
                  onClick={handleScrollLeft}
                  className="p-1 rounded-full text-stone-400 hover:text-espresso hover:bg-stone-100 transition cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 h-0.5 bg-stone-200 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-espresso rounded-full transition-all duration-100"
                    style={{ left: thumbLeft, width: thumbWidth }}
                  />
                </div>
                <button
                  onClick={handleScrollRight}
                  className="p-1 rounded-full text-stone-400 hover:text-espresso hover:bg-stone-100 transition cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 w-full lg:max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search recipes (e.g., pasta, cake)..."
                value={searchPhrase}
                onChange={handleSearchChange}
                className="w-full bg-white border outline-none text-xs rounded-xl py-2.5 pl-4 pr-10 focus:border-terracotta transition shadow-xs"
              />
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
            </div>

            <button
              onClick={() => setShowAdvanceFilters(!showAdvanceFilters)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-bold uppercase transition bg-white cursor-pointer ${
                showAdvanceFilters ? 'border-terracotta text-terracotta bg-stone-50' : 'text-stone-550 hover:bg-stone-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Row B: Advanced filters sliding panel */}
        {showAdvanceFilters && (
          <div className="p-6 bg-stone-50/50 border rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn" id="advanced-filters-deck">
            
            {/* 1. Cuisine Picker */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-550 flex items-center gap-1.5 uppercase tracking-wider">
                <Globe2 className="w-3.5 h-3.5 text-[#B35C2E]" /> Filter by Cuisine
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CUISINES.map(c => (
                  <button
                    key={c}
                    onClick={() => setActiveCuisine(c)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border transition cursor-pointer ${
                      activeCuisine === c 
                        ? 'bg-[#B35C2E]/10 border-terracotta text-terracotta' 
                        : 'bg-white text-stone-505 hover:bg-stone-50'
                    }`}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Dietary Choices picker */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-550 flex items-center gap-1.5 uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-sage" /> Dietary Preferences
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_PREFS.map(d => (
                  <button
                    key={d}
                    onClick={() => setActiveDiet(d)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border transition cursor-pointer ${
                      activeDiet === d 
                        ? 'bg-sage/10 border-sage text-[#4A634D]' 
                        : 'bg-white text-stone-505 hover:bg-stone-50'
                    }`}
                  >
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. pantry search */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-550 flex items-center gap-1.5 uppercase tracking-wider">
                🔑 What's in your pantry?
              </span>
              <input
                type="text"
                placeholder="Enter ingredients (e.g., cheese, garlic)..."
                value={pantryIngredients}
                onChange={e => setPantryIngredients(e.target.value)}
                className="w-full bg-white border text-xs p-2.5 rounded-xl outline-none focus:border-sage font-mono text-stone-650"
              />
              <p className="text-[9px] text-stone-400 leading-normal">
                Enter ingredients you want to use, separated by commas.
              </p>
            </div>

          </div>
        )}

      </section>

      {/* Primary catalog grid */}
      <main className="w-full" id="recipes-catalog-grid">
        {recipes.length === 0 ? (
          <div className="py-20 text-center border border-dashed rounded-3xl bg-white space-y-4" id="empty-recipe-state">
            <h3 className="font-serif font-bold text-xl text-espresso">No recipes match your filters</h3>
            <p className="text-stone-500 text-xs font-sans max-w-md mx-auto">
              We couldn't find any recipes for Cuisine: {activeCuisine}, Diet: {activeDiet}, or Search: {searchPhrase}. Try reset.
            </p>
            <button
              onClick={() => {
                setSearchPhrase('');
                setPantryIngredients('');
                setActiveCategory('All');
                setActiveCuisine('All');
                setActiveDiet('All');
              }}
              className="px-6 py-3 bg-espresso text-cream rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-terracotta hover:text-white cursor-pointer transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full" id="masonry-recipes-wrapper">
            {currentBatch.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSelect={(rec) => {
                  router.push(`/recipes/${rec.slug}`);
                }}
              />
            ))}
          </div>
        )}

        {/* Load more logic */}
        {hasMore && recipes.length > 0 && (
          <div className="flex items-center justify-center pt-12 print:hidden" id="pagination-controls">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3.5 rounded-full border text-stone-700 bg-white hover:bg-stone-50 text-xs font-mono font-bold uppercase tracking-widest cursor-pointer transition-all hover:scale-102"
            >
              Load More Recipes ({visibleCount} of {recipes.length})
            </button>
          </div>
        )}
      </main>

    </div>
  );
}
