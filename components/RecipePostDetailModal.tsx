'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Printer, 
  Plus, 
  Minus, 
  Users, 
  Sparkles,
  CheckCircle2, 
  Play, 
  RefreshCw 
} from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import PinterestShareButton from './recipe/PinterestShareButton';
import SaveButton from '@/features/favorites/SaveButton';
import PrintButton from './recipe/PrintButton';

interface RecipePostDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipePostDetailModal({ recipe, onClose }: RecipePostDetailModalProps) {
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [customizationPrompt, setCustomizationPrompt] = useState('');
  const [customizedSteps, setCustomizedSteps] = useState<string[] | null>(null);
  const [customizedIngredients, setCustomizedIngredients] = useState<string[] | null>(null);
  const [customizing, setCustomizing] = useState(false);

  // Esc key closure
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Scaled ingredients mathematically based on servings ratio (base is 4 servings)
  const scaleIngredient = (item: string) => {
    const ratio = servings / 4;
    
    // Find numeric quantities like 400g, 100g, 11g, 1 1/4 cups, 1/2 cup, 3-4 tbsp, 3, etc.
    // Replace with scaled quantities
    return item.replace(/^([\d\/\s\.-]+)/, (match) => {
      const trimmed = match.trim();
      
      // Simple fraction converter
      let val = 0;
      if (trimmed.includes(' ')) {
        const parts = trimmed.split(' ');
        parts.forEach(p => {
          if (p.includes('/')) {
            const [num, den] = p.split('/');
            val += parseFloat(num) / parseFloat(den);
          } else {
            val += parseFloat(p);
          }
        });
      } else if (trimmed.includes('/')) {
        const [num, den] = trimmed.split('/');
        val += parseFloat(num) / parseFloat(den);
      } else if (trimmed.includes('-')) {
        const [min, max] = trimmed.split('-');
        const mid = (parseFloat(min) + parseFloat(max)) / 2;
        val = mid;
      } else {
        val = parseFloat(trimmed);
      }

      if (isNaN(val)) return match;
      
      const scaled = val * ratio;
      // Round to 1 decimal place or format nicely
      return Number(scaled.toFixed(1)).toString() + ' ';
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleAiCustomize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customizationPrompt.trim()) return;

    setCustomizing(true);
    toast.loading('Consulting editorial AI kitchen pipeline...', { id: 'ai-custom' });

    try {
      const response = await fetch('/api/seasonal-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'customize_recipe',
          recipeTitle: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          prompt: customizationPrompt
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        setCustomizedSteps(data.result.instructions || null);
        setCustomizedIngredients(data.result.ingredients || null);
        toast.success('Successfully modified recipe with Editorial AI!', { id: 'ai-custom' });
      } else {
        toast.error('AI kitchen path blocked. Please try again.', { id: 'ai-custom' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failure to Gemini terminal.', { id: 'ai-custom' });
    } finally {
      setCustomizing(false);
    }
  };

  const currentIngredients = customizedIngredients || recipe.ingredients;
  const currentInstructions = customizedSteps || recipe.instructions;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto block" id="recipe-modal-backdrop">
      
      {/* Absolute Backdrop dim */}
      <div 
        className="fixed inset-0 bg-[#150A05]/85 backdrop-blur-md transition-opacity cursor-pointer print:hidden" 
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-12 print:p-0">
        
        {/* Animated Main Card Board */}
        <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#1E1E1E] text-espresso dark:text-[#F0EBE3] shadow-2xl overflow-hidden border border-cream-dark dark:border-stone-800 transition-all flex flex-col print:border-none print:shadow-none print:bg-white print:text-black">
          
          {/* HEADER ROW: Close & Custom engagement actions */}
          <div className="sticky top-0 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-xs px-6 py-4 border-b border-cream-dark dark:border-stone-800 z-10 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <span className="font-mono text-[10px] tracking-widest uppercase text-stone-400 dark:text-stone-500 font-bold">
              Culinary Folio Index • {recipe.category}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <PinterestShareButton recipe={recipe} />
              <SaveButton 
                recipeId={recipe.id} 
                recipeTitle={recipe.title} 
                showText={true}
                className="px-3.5 py-1.5 bg-cream dark:bg-stone-850 hover:bg-cream-dark dark:hover:bg-stone-800 text-espresso dark:text-cream border border-cream-dark dark:border-stone-800 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              />
              <PrintButton />
              <button
                onClick={onClose}
                className="p-1.5 rounded-full border border-cream-dark dark:border-stone-750 text-stone-400 dark:text-stone-500 hover:text-espresso dark:hover:text-cream hover:bg-cream dark:hover:bg-stone-850 cursor-pointer transition-colors"
                title="Close folio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE FOLIO CONTENT CONTAINER */}
          <div className="p-6 md:p-8 space-y-8 max-h-[85vh] overflow-y-auto print:max-h-none print:p-0">
            
            {/* Split layout header: Image of culinary structure + Brief info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Photo Card Frame */}
              <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-square bg-cream/10 border border-cream-dark dark:border-stone-800">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  sizes="50vw"
                  priority
                />
              </div>

              {/* Text Info */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-terracotta dark:text-terracotta-light uppercase bg-terracotta/10 px-2 py-0.5 rounded">
                    {recipe.category}
                  </span>
                  <h1 className="font-serif font-bold text-2xl md:text-3xl tracking-tight leading-tight pt-2">
                    {recipe.title}
                  </h1>
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-350 leading-relaxed font-sans pb-3 border-b border-cream-dark dark:border-stone-800">
                  {recipe.description}
                </p>

                {/* Portions & Portability controls */}
                <div className="flex items-center justify-between py-2 sm:py-3 px-4 rounded-2xl bg-cream dark:bg-stone-850 border border-cream-dark dark:border-stone-800 print:hidden">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sage" />
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-stone-405 dark:text-stone-300 font-bold block leading-none">Serving Size</span>
                      <span className="text-[10px] text-stone-400 block pt-0.5">Adjust scaling</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-stone-800 text-stone-605 dark:text-stone-300 flex items-center justify-center border border-cream-dark dark:border-stone-700 hover:border-terracotta hover:text-terracotta cursor-pointer transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm text-espresso dark:text-cream">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-stone-800 text-stone-605 dark:text-stone-300 flex items-center justify-center border border-cream-dark dark:border-stone-700 hover:border-terracotta hover:text-terracotta cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Small facts row */}
                <div className="grid grid-cols-3 gap-3 pt-1 text-center font-mono">
                  <div className="p-2.5 rounded-xl border border-cream-dark dark:border-stone-800">
                    <span className="text-[9px] uppercase text-stone-400 dark:text-stone-500 block">Active cook</span>
                    <span className="text-xs font-bold text-espresso dark:text-cream block pt-0.5">{recipe.prepTime}</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-cream-dark dark:border-stone-800">
                    <span className="text-[9px] uppercase text-stone-400 dark:text-stone-500 block">Strength</span>
                    <span className="text-xs font-bold text-espresso dark:text-cream block pt-0.5">{recipe.difficulty}</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-cream-dark dark:border-stone-800">
                    <span className="text-[9px] uppercase text-stone-400 dark:text-stone-500 block">Total calories</span>
                    <span className="text-xs font-bold text-espresso dark:text-cream block pt-0.5">{recipe.calories} kcal</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Split layout steps & ingredients list */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t border-cream-dark dark:border-stone-800">
              
              {/* Left Column: Ingredients (span 5) */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-cream-dark dark:border-stone-800 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-sage" />
                  <h3 className="font-serif font-bold text-base text-espresso dark:text-cream">
                    Ingredients Checklist
                  </h3>
                </div>
                
                <ul className="space-y-3">
                  {currentIngredients.map((item, idx) => {
                    const scaledItem = scaleIngredient(item);
                    return (
                      <li 
                        key={idx}
                        onClick={() => {
                          setCheckedIngredients(prev => ({
                            ...prev,
                            [idx]: !prev[idx]
                          }));
                        }}
                        className="flex items-start gap-2.5 text-xs text-stone-650 dark:text-stone-300 hover:text-espresso dark:hover:text-cream cursor-pointer transition-colors pt-0.5 pr-2 group font-sans select-none"
                      >
                        <input
                          type="checkbox"
                          checked={!!checkedIngredients[idx]}
                          onChange={() => {}} // handled by click on li
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 dark:border-stone-700 text-terracotta focus:ring-terracotta accent-terracotta"
                        />
                        <span className={`leading-relaxed group-hover:translate-x-0.5 transition-transform ${checkedIngredients[idx] ? 'line-through text-stone-400 dark:text-stone-550 italic' : ''}`}>
                          {scaledItem}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right Column: Steps (span 7) */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-2 border-b border-cream-dark dark:border-stone-800 pb-2">
                  <Play className="w-4 h-4 text-terracotta fill-terracotta" />
                  <h3 className="font-serif font-bold text-base text-espresso dark:text-cream">
                    Step-by-step Instructions
                  </h3>
                </div>

                <ol className="space-y-4 font-sans text-xs">
                  {currentInstructions.map((step, idx) => (
                    <li 
                      key={idx}
                      onClick={() => setActiveStep(idx === activeStep ? null : idx)}
                      className={`p-4 rounded-xl transition-all border duration-200 cursor-pointer ${
                        idx === activeStep 
                          ? 'bg-cream-light dark:bg-stone-850 border-terracotta dark:border-terracotta' 
                          : 'bg-white dark:bg-transparent border-cream-dark/50 dark:border-stone-850 hover:bg-cream/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                          idx === activeStep
                            ? 'bg-terracotta text-white'
                            : 'bg-cream dark:bg-stone-850 text-stone-550 dark:text-stone-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className={`leading-relaxed text-stone-650 dark:text-stone-300 ${
                            idx === activeStep ? 'text-espresso dark:text-white font-medium' : ''
                          }`}>
                            {step}
                          </p>
                          {idx === activeStep && (
                            <span className="inline-block text-[9px] uppercase tracking-wider font-mono font-semibold text-terracotta pt-1">
                              ✓ Currently focusing on this step
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

            </div>

            {/* AI Customization Sub-Form panel */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cream/50 dark:bg-stone-850/30 border border-cream-dark dark:border-stone-800/80 space-y-3 print:hidden">
              <div className="flex items-center gap-2 text-espresso dark:text-cream">
                <Sparkles className="w-4 h-4 text-terracotta" />
                <h4 className="font-serif font-bold text-sm">Editorial AI Kitchen conversion</h4>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
                Want to transform this master recipe? Enter a custom directive below (e.g. "make this gluten-free and convert measurements to metric system" or "suggest healthy keto substitutions for the butter and sugars").
              </p>

              <form onSubmit={handleAiCustomize} className="flex gap-2 pt-1.5">
                <input
                  type="text"
                  placeholder="e.g. Gluten-free substitute, scale metric cups..."
                  value={customizationPrompt}
                  onChange={(e) => setCustomizationPrompt(e.target.value)}
                  disabled={customizing}
                  className="flex-1 bg-white dark:bg-[#1E1E1E] border border-cream-dark dark:border-stone-750 focus:border-terracotta text-stone-705 dark:text-cream text-xs rounded-xl px-4 py-3 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={customizing || !customizationPrompt.trim()}
                  className="px-4 py-3 bg-espresso dark:bg-cream hover:bg-terracotta dark:hover:bg-terracotta text-cream dark:text-espresso hover:text-white dark:hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all shadow-xs"
                >
                  {customizing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Customize</span>
                </button>
              </form>

              {/* Clear customized settings button */}
              {(customizedSteps || customizedIngredients) && (
                <button
                  onClick={() => {
                    setCustomizedSteps(null);
                    setCustomizedIngredients(null);
                    setCustomizationPrompt('');
                    toast.success('Restored original heirloom ingredients list.');
                  }}
                  className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#E60023] hover:underline flex items-center gap-1 pt-1.5 cursor-pointer"
                >
                  ✕ Restore Original Heirloom Recipe
                </button>
              )}
            </div>

            {/* Structured Schema output (Schema.org Json-LD embed for Pintrest bots) */}
            <div className="hidden print:block">
              <div className="border-t border-stone-200 mt-8 pt-4 text-[10px] text-stone-400 font-mono text-center">
                Savory Kitchen Regional Archive • Full-stack physical culinary ledger sheet
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
