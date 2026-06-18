'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChefHat, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-[75vh] w-full flex flex-col items-center justify-center p-6 text-center bg-[#FDFCF9] dark:bg-stone-900" id="custom-404-canvas">
      <div className="max-w-md w-full space-y-8">
        {/* Animated Badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center anim-pulse">
          <ChefHat className="w-8 h-8" />
        </div>

        {/* Text Frame */}
        <div className="space-y-3">
          <h1 className="font-serif font-black text-5xl text-espresso-dark dark:text-white tracking-tight leading-none">
            Page Not Found
          </h1>
          <p className="text-sm font-sans text-stone-605 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
            We searched high and low on our recipe shelves, but this page seems to have simmered away completely.
          </p>
        </div>

        {/* Custom searching utility box */}
        <form onSubmit={handleSearchSubmit} className="space-y-3 p-4 bg-white dark:bg-stone-850 rounded-2xl border border-cream-dark dark:border-stone-800 shadow-3xs" id="not-found-search-form">
          <label htmlFor="notfound-search-input" className="block text-left font-mono text-[9px] text-stone-500 font-bold uppercase tracking-widest pl-1">
            Search for something else
          </label>
          <div className="relative flex items-center">
            <input
              id="notfound-search-input"
              type="text"
              placeholder="e.g. Sourdough, Crepes, Burrata..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#FAF9F5] dark:bg-stone-900 border border-cream-dark dark:border-stone-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 text-xs rounded-xl pl-4 pr-10 py-3.5 text-stone-800 dark:text-stone-200 transition-colors placeholder:text-stone-400"
            />
            <button
              type="submit"
              className="absolute right-2 p-2 rounded-lg bg-espresso hover:bg-terracotta text-white transition-all cursor-pointer outline-offset-2 ring-terracotta focus:outline-hidden focus-visible:ring-2 focus-visible:ring-terracotta"
              title="Search recipe database"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Back Link Option */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold uppercase tracking-wider text-stone-600 hover:text-terracotta transition-colors group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-terracotta p-1"
          >
            <span>Return to master table</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
