'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="px-3.5 py-2 bg-white dark:bg-stone-850 hover:bg-cream/40 dark:hover:bg-stone-800 text-espresso dark:text-cream border border-cream-dark dark:border-stone-800 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
      title="Print recipe instructions card"
    >
      <Printer className="w-3.5 h-3.5 text-sage" />
      <span>Print Recipe</span>
    </button>
  );
}
