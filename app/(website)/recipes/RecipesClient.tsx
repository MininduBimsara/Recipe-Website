'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Clock, Filter, Leaf, Globe2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { getSavedRecipes } from '@/lib/preseededPool';
import RecipeCard from '@/components/RecipeCard';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchRecipesAction } from '@/app/actions/recipeActions';
import { isSupabaseConfigured } from '@/lib/supabase/client';

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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 12;
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

  // Load data from server action when filters or page changes
  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      const offset = (page - 1) * limit;
      try {
        const res = await fetchRecipesAction(
          offset,
          limit,
          activeCategory,
          debouncedSearch,
          activeCuisine,
          activeDiet,
          debouncedPantry
        );
        if (active) {
          if (!isSupabaseConfigured()) {
            // Merge local fallback from server action with client-side localStorage recipes
            const customRecipes = getSavedRecipes();
            // Filter custom recipes client-side using the same filters
            const filteredCustom = customRecipes.filter(recipe => {
              if (activeCategory !== 'All' && recipe.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
              if (activeCuisine !== 'All' && !(recipe.recipeCuisine || '').toLowerCase().includes(activeCuisine.toLowerCase())) return false;
              if (activeDiet !== 'All') {
                const tagsJoined = (recipe.tags || []).join(' ').toLowerCase();
                const catQuery = recipe.category.toLowerCase();
                let dietMatch = false;
                const dietQuery = activeDiet.toLowerCase();
                if (dietQuery === 'vegetarian' && (tagsJoined.includes('vegetarian') || catQuery === 'vegetarian')) dietMatch = true;
                if (dietQuery === 'vegan' && (tagsJoined.includes('vegan') || tagsJoined.includes('plant-based'))) dietMatch = true;
                if (dietQuery === 'gluten-free' && (tagsJoined.includes('gluten-free') || tagsJoined.includes('gf'))) dietMatch = true;
                if (dietQuery === 'low-carb' && (tagsJoined.includes('low-carb') || tagsJoined.includes('keto'))) dietMatch = true;
                if (dietQuery === 'keto' && tagsJoined.includes('keto')) dietMatch = true;
                if (dietQuery === 'dairy-free' && tagsJoined.includes('dairy-free')) dietMatch = true;
                if (!dietMatch) return false;
              }
              if (debouncedSearch) {
                const word = debouncedSearch.toLowerCase();
                const titleMatch = recipe.title.toLowerCase().includes(word);
                const descMatch = recipe.description.toLowerCase().includes(word);
                const tagsMatch = (recipe.tags || []).join(' ').toLowerCase().includes(word);
                if (!titleMatch && !descMatch && !tagsMatch) return false;
              }
              if (debouncedPantry) {
                const pantryItems = debouncedPantry.toLowerCase().split(',').map(item => item.trim()).filter(Boolean);
                if (pantryItems.length > 0) {
                  const recipeIngredientsJoined = recipe.ingredients.join(' ').toLowerCase();
                  if (!pantryItems.some(item => recipeIngredientsJoined.includes(item))) return false;
                }
              }
              return true;
            });

            // Combine both lists
            const combined = [...res.recipes, ...filteredCustom];
            
            // Remove duplicates
            const seen = new Set();
            const uniqueCombined = combined.filter(r => {
              if (seen.has(r.id) || seen.has(r.slug)) return false;
              seen.add(r.id);
              seen.add(r.slug);
              return true;
            });

            // Sliced combined for page
            const paginatedCombined = uniqueCombined.slice(offset, offset + limit);
            
            setRecipes(paginatedCombined);
            setTotalCount(uniqueCombined.length);
            setHasMore(offset + limit < uniqueCombined.length);
          } else {
            setRecipes(res.recipes);
            setHasMore(res.hasMore);
            setTotalCount(res.totalCount);
          }
        }
      } catch (err) {
        console.error('Error fetching recipes:', err);
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
  }, [page, activeCategory, activeCuisine, activeDiet, debouncedSearch, debouncedPantry]);

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (debouncedSearch) params.set('q', debouncedSearch);
    router.replace(`/recipes?${params.toString()}`, { scroll: false });
  }, [activeCategory, debouncedSearch]);

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(e.target.value);
    setPage(1);
  };

  const handlePantryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPantryIngredients(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePageClick = (p: number) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

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
                    onClick={() => { setActiveCuisine(c); setPage(1); }}
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
                    onClick={() => { setActiveDiet(d); setPage(1); }}
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
                onChange={handlePantryChange}
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full" id="recipes-loading-skeleton">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-cream-dark rounded-3xl overflow-hidden p-4 space-y-4 animate-pulse">
                <div className="bg-stone-200 h-52 sm:h-60 rounded-2xl w-full" />
                <div className="space-y-2">
                  <div className="bg-stone-200 h-3 rounded-md w-1/3" />
                  <div className="bg-stone-200 h-5 rounded-md w-3/4" />
                  <div className="bg-stone-200 h-4 rounded-md w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
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
                setPage(1);
              }}
              className="px-6 py-3 bg-espresso text-cream rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-terracotta hover:text-white cursor-pointer transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full" id="masonry-recipes-wrapper">
            {recipes.map((recipe) => (
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

        {/* Pagination Controls */}
        {totalPages > 1 && !loading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 pb-6 border-t border-stone-200 print:hidden" id="pagination-controls">
            <span className="font-mono text-[10px] text-stone-500 font-medium">
              SHOWING {recipes.length} OF {totalCount} RECIPES (PAGE {page} OF {totalPages})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-3.5 py-2.5 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition bg-white text-espresso hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (
                  totalPages > 6 &&
                  p !== 1 &&
                  p !== totalPages &&
                  Math.abs(p - page) > 1
                ) {
                  if (p === 2 && page > 3) {
                    return <span key="ell-1" className="px-2 text-stone-400 font-mono text-xs">...</span>;
                  }
                  if (p === totalPages - 1 && page < totalPages - 2) {
                    return <span key="ell-2" className="px-2 text-stone-400 font-mono text-xs">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={p}
                    onClick={() => handlePageClick(p)}
                    className={`w-9 h-9 rounded-xl font-mono text-[10px] font-bold uppercase transition flex items-center justify-center cursor-pointer ${
                      page === p
                        ? 'bg-espresso text-white scale-105'
                        : 'bg-white border text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-3.5 py-2.5 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition bg-white text-espresso hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
