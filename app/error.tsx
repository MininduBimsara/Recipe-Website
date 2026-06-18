'use client';

import React, { useEffect } from 'react';
import { ChefHat, RotateCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to a standard monitoring service
    console.error('Unhandled culinary rendering error caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 text-center bg-[#FDFCF9] dark:bg-stone-900" id="global-error-block">
      <div className="max-w-md space-y-6">
        {/* Visual Badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center animate-bounce">
          <ChefHat className="w-8 h-8" />
        </div>
        
        {/* Error Typography */}
        <div className="space-y-3">
          <h1 className="font-serif font-extrabold text-3xl text-espresso-dark dark:text-white tracking-tight">
            Something burned — lets try again
          </h1>
          <p className="text-sm font-sans text-stone-605 dark:text-stone-300 leading-relaxed font-semibold max-w-sm mx-auto">
            Our virtual kitchen hit a thermal spike while prepping this page. Rest assured, the sous chef is on it.
          </p>
          {error.message && (
            <p className="text-[11px] font-mono bg-cream-dark/50 dark:bg-stone-800 text-stone-500 py-2 px-3 rounded-lg overflow-x-auto max-w-full">
              System: {error.message}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-espresso dark:bg-stone-800 hover:bg-terracotta hover:text-white text-[#FFF] dark:text-[#E2DED5] rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 hover:shadow-md"
            title="Clean baking tray and restart page rendering"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Spruce up & try again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
