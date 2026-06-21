'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlurDataURL } from '@/lib/placeholder';
import { 
  ArrowLeft, 
  Printer, 
  Plus, 
  Minus, 
  Users, 
  Sparkles,
  CheckCircle2, 
  Play, 
  RefreshCw,
  Clock,
  Flame,
  Award,
  Pin,
  Copy,
  Maximize2,
  Volume2,
  VolumeX,
  Volume1,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Scale
} from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { getSavedRecipes } from '@/lib/preseededPool';
import { toast } from 'react-hot-toast';
import PinterestShareButton from '@/components/recipe/PinterestShareButton';
import PrintButton from '@/components/recipe/PrintButton';
import RatingWidget from '@/components/recipe/RatingWidget';
import RecentlyViewedStrip from '@/features/recentlyViewed/RecentlyViewedStrip';
import SaveButton from '@/features/favorites/SaveButton';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeInteractiveClientProps {
  recipe?: Recipe;
  fallbackSlug?: string;
}

export default function RecipeInteractiveClient({ recipe: initialRecipe, fallbackSlug }: RecipeInteractiveClientProps) {
  const [localRecipe, setLocalRecipe] = useState<Recipe | null>(initialRecipe || null);
  const [hasCheckedLocal, setHasCheckedLocal] = useState(false);

  useEffect(() => {
    if (!localRecipe && fallbackSlug) {
      const saved = getSavedRecipes();
      const match = saved.find(r => r.slug === fallbackSlug);
      if (match) {
        setLocalRecipe(match);
      }
      setHasCheckedLocal(true);
    } else {
      setHasCheckedLocal(true);
    }
  }, [initialRecipe, fallbackSlug, localRecipe]);

  const activeRecipe = localRecipe;

  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [customizationPrompt, setCustomizationPrompt] = useState('');
  const [customizedSteps, setCustomizedSteps] = useState<string[] | null>(null);
  const [customizedIngredients, setCustomizedIngredients] = useState<string[] | null>(null);
  const [customizing, setCustomizing] = useState(false);
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  
  // Immersive cooking mode states
  const [cookingModeOpen, setCookingModeOpen] = useState(false);
  const [cookingStepIdx, setCookingStepIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scrolledPastHeader, setScrolledPastHeader] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const handleScroll = () => {
        setScrolledPastHeader(window.scrollY > 400);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (synthRef.current) {
          synthRef.current.cancel();
        }
      };
    }
  }, []);

  if (!activeRecipe) {
    if (hasCheckedLocal) {
      return (
        <div className="py-24 text-center space-y-6 max-w-md mx-auto px-6" id="client-not-found-recipe">
          <h2 className="font-serif font-bold text-3xl text-espresso">Recipe Not Found</h2>
          <p className="text-stone-500 text-sm">We couldn't locate this recipe, even in your local creations shelf.</p>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-espresso text-cream rounded-full text-xs font-mono font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> View Recipes Directory
          </Link>
        </div>
      );
    }
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-6" id="client-loading-recipe">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-500 text-xs font-mono uppercase tracking-widest">Loading Recipe Canvas...</p>
      </div>
    );
  }

  const recipe = activeRecipe;

  // Format and translate ingredient parameters flawlessly
  const formatIngredient = (item: string, system: 'imperial' | 'metric') => {
    const ratio = servings / 4;
    
    // Scale quantity value first
    let scaled = item.replace(/^([\d\/\s\.-]+)/, (match) => {
      const trimmed = match.trim();
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
      const scaledVal = val * ratio;
      return Number(scaledVal.toFixed(1)).toString() + ' ';
    });

    if (system === 'imperial') return scaled;

    // Convert standard units dry/liquid to metric for refined kitchen precision
    let converted = scaled;
    
    // Cups to grams / milliliters
    converted = converted.replace(/(\d+(\.\d+)?)\s*cups?\b/gi, (match, valStr) => {
      const val = parseFloat(valStr);
      if (isNaN(val)) return match;
      
      const itemLower = item.toLowerCase();
      if (itemLower.includes('flour')) {
        return `${Math.round(val * 125)}g`;
      } else if (itemLower.includes('sugar')) {
        return `${Math.round(val * 200)}g`;
      } else if (itemLower.includes('butter') || itemLower.includes('margarine')) {
        return `${Math.round(val * 227)}g`;
      } else {
        return `${Math.round(val * 240)}ml`;
      }
    });

    // Ounces to Grams (oz)
    converted = converted.replace(/(\d+(\.\d+)?)\s*oz\b/gi, (match, valStr) => {
      const val = parseFloat(valStr);
      if (isNaN(val)) return match;
      return `${Math.round(val * 28.3)}g`;
    });

    // Pounds to Grams/Kg (lbs)
    converted = converted.replace(/(\d+(\.\d+)?)\s*lbs?\b/gi, (match, valStr) => {
      const val = parseFloat(valStr);
      if (isNaN(val)) return match;
      const calculatedG = Math.round(val * 453.6);
      return calculatedG >= 1000 ? `${(calculatedG / 1000).toFixed(1)}kg` : `${calculatedG}g`;
    });

    return converted;
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Recipe path secured and copied! 📋');
    }
  };

  const playVoiceStep = (text: string) => {
    if (typeof window === 'undefined' || !synthRef.current) return;

    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[^a-zA-Z0-9\s.,!?]/g, '');
    const utterance = new SpeechSynthesisUtterance(`Step ${cookingStepIdx + 1}. ${cleanText}`);
    
    // Set natural editorial tone
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  const stopVoiceSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const handleAiCustomize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customizationPrompt.trim()) return;

    setCustomizing(true);
    toast.loading('Consulting PebblePlate digital AI pipeline...', { id: 'ai-custom' });

    try {
      const p = customizationPrompt.toLowerCase();
      let modifiedIngredients = [...recipe.ingredients];
      let modifiedInstructions = [...recipe.instructions];

      if (p.includes('vegan') || p.includes('plant') || p.includes('dairy-free') || p.includes('vegetar')) {
        modifiedIngredients = recipe.ingredients.map(item => {
          let temp = item;
          temp = temp.replace(/\bbutter\b/gi, 'plant-based vegan butter');
          temp = temp.replace(/\bmilk\b/gi, 'organic oat milk');
          temp = temp.replace(/\bheavy cream\b/gi, 'rich cashew cream');
          temp = temp.replace(/\bcream\b/gi, 'coconut cream');
          temp = temp.replace(/\begg\b/gi, 'flaxseed/starch egg substitute');
          temp = temp.replace(/\beggs\b/gi, 'flax eggs (flaxseed + water)');
          temp = temp.replace(/\bcheese\b/gi, 'vegan cultured cheese');
          temp = temp.replace(/\bparmesan\b/gi, 'nutritional yeast flakes');
          temp = temp.replace(/\bhoney\b/gi, 'pure maple syrup');
          temp = temp.replace(/\bbeef\b/gi, 'seared portobello mushroom');
          temp = temp.replace(/\bchicken\b/gi, 'marinated organic tofu strips');
          temp = temp.replace(/\bbacon\b/gi, 'crisp maple Tempeh strips');
          temp = temp.replace(/\bham\b/gi, 'savory smoked Tempeh');
          return temp;
        });
        modifiedInstructions = recipe.instructions.map(step => {
          let temp = step;
          temp = temp.replace(/\bbutter\b/gi, 'plant-based butter')
                     .replace(/\bmilk\b/gi, 'oat milk')
                     .replace(/\begg\b/gi, 'flax gel')
                     .replace(/\beggs\b/gi, 'flax gel')
                     .replace(/\bcream\b/gi, 'plant cream')
                     .replace(/\bbeef\b/gi, 'portobello mushrooms')
                     .replace(/\bchicken\b/gi, 'tofu strips');
          return temp;
        });
        modifiedInstructions.push("[Vegan Adjustment] Fully adapted temperature bounds and fat ratios for non-dairy performance.");
      } else if (p.includes('gluten') || p.includes('gf') || p.includes('coeliac')) {
        modifiedIngredients = recipe.ingredients.map(item => {
          let temp = item;
          temp = temp.replace(/\bflour\b/gi, '1-to-1 Premium Gluten-Free Baking Flour');
          temp = temp.replace(/\bbrioche\b/gi, 'gluten-free brioche slices');
          temp = temp.replace(/\bbread\b/gi, 'artisanal gluten-free bread');
          temp = temp.replace(/\bsoy sauce\b/gi, 'tamari gluten-free soy sauce');
          temp = temp.replace(/\bpasta\b/gi, 'brown-rice gluten-free pasta');
          return temp;
        });
        modifiedInstructions = recipe.instructions.map(step => {
          let temp = step;
          temp = temp.replace(/\bflour\b/gi, 'gluten-free flour blend')
                     .replace(/\bknead\b/gi, 'mix gently (gluten-free dough does not structure gluten)');
          return temp;
        });
        modifiedInstructions.push("[Gluten-Free Adjustment] Let the batter rest for 10 minutes to allow GF flours to hydrate perfectly.");
      } else if (p.includes('keto') || p.includes('low carb') || p.includes('low-carb')) {
        modifiedIngredients = recipe.ingredients.map(item => {
          let temp = item;
          temp = temp.replace(/\bsugar\b/gi, 'monkfruit sweetener erythritol');
          temp = temp.replace(/\bflour\b/gi, 'blanched almond flour (or coconut flour)');
          temp = temp.replace(/\bhoney\b/gi, 'allulose liquid maple alternative');
          temp = temp.replace(/\bpotatoes\b/gi, 'steamed cauliflower florets');
          temp = temp.replace(/\bpotato\b/gi, 'cauliflower mash');
          temp = temp.replace(/\bmaple syrup\b/gi, 'sugar-free maple syrup');
          return temp;
        });
        modifiedInstructions = recipe.instructions.map(step => {
          let temp = step;
          temp = temp.replace(/\bsugar\b/gi, 'monkfruit sweetener')
                     .replace(/\bflour\b/gi, 'almond flour')
                     .replace(/\bpotato\b/gi, 'cauliflower alternative');
          return temp;
        });
        modifiedInstructions.push("[Keto/Low Carb Adjustment] Keep watch on browning time, as almond flours caramelize slightly quicker.");
      } else if (p.includes('double') || p.includes('scale') || p.includes('multipl') || p.includes('2x')) {
        modifiedIngredients = recipe.ingredients.map(item => {
          let temp = item;
          temp = temp.replace(/^(\d+)\/(\d+)\b/g, (match, num, den) => {
            const val = Number(num) / Number(den);
            const doubleVal = val * 2;
            return doubleVal === 1 ? '1' : doubleVal.toFixed(1).replace(/\.0$/, '');
          });
          temp = temp.replace(/\b(\d+)\s+and\s+(\d+)\/(\d+)\b/g, (match, whole, num, den) => {
            const val = Number(whole) + (Number(num) / Number(den));
            return (val * 2).toFixed(1).replace(/\.0$/, '');
          });
          temp = temp.replace(/^(\d+)\b/g, (match, val) => {
            return (Number(val) * 2).toString();
          });
          return temp + " (X2 Double Volume)";
        });
        modifiedInstructions.push("[Scaling Guard] Ensure your skillet or oven tray is wide enough to avoid overcrowding the doubled quantities.");
      } else if (p.includes('air fryer') || p.includes('fryer')) {
        modifiedIngredients = recipe.ingredients.map(item => {
          return item + " (with light avocado oil spray for crispy convection)";
        });
        modifiedInstructions = recipe.instructions.map(step => {
          let temp = step;
          temp = temp.replace(/preheat oven to (\d+)°F/gi, 'preheat air fryer basket to 375°F')
                     .replace(/bake/gi, 'air fry in basket (single layer)')
                     .replace(/roast/gi, 'convection air fry');
          return temp;
        });
        modifiedInstructions.push("[Air Fryer Guard] Spread ingredients evenly in a single layer to let high-speed convection do its magic!");
      } else {
        modifiedIngredients = recipe.ingredients.map(item => item + ` (${customizationPrompt})`);
        modifiedInstructions.push(`[Custom Chef Note] Successfully tailored culinary profile to support: "${customizationPrompt}".`);
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      setCustomizedSteps(modifiedInstructions);
      setCustomizedIngredients(modifiedIngredients);
      toast.success('Successfully modified recipe variables!', { id: 'ai-custom' });
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during local modification.', { id: 'ai-custom' });
    } finally {
      setCustomizing(false);
    }
  };

  const currentIngredients = customizedIngredients || recipe.ingredients;
  const currentInstructions = customizedSteps || recipe.instructions;

  // Immersive Step navigation
  const nextCookingStep = () => {
    stopVoiceSpeech();
    if (cookingStepIdx < currentInstructions.length - 1) {
      setCookingStepIdx(prev => prev + 1);
    } else {
      toast.success('You have completed this master formula! Happy plating! 🎉');
      setCookingModeOpen(false);
    }
  };

  const prevCookingStep = () => {
    stopVoiceSpeech();
    if (cookingStepIdx > 0) {
      setCookingStepIdx(prev => prev - 1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FBF9F4] text-espresso pb-24" id="recipe-detailed-container">
      
      {/* 1. FLOATING MINI BRAND & NAVIGATION HEADER (Sticky on scroll) */}
      <AnimatePresence>
        {scrolledPastHeader && (
          <motion.div 
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-[60px] sm:top-[73px] left-0 right-0 py-3 bg-white/95 backdrop-blur-md border-b border-cream-dark/60 z-40 px-6 print:hidden shadow-sm"
          >
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase bg-terracotta/10 text-terracotta px-2.5 py-1 rounded-md font-bold">
                  {recipe.category}
                </span>
                <span className="font-serif font-bold text-sm text-espresso line-clamp-1">
                  {recipe.title}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCookingStepIdx(0);
                    setCookingModeOpen(true);
                  }}
                  className="px-4 py-1.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Interactive Cooking Mode</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="max-w-5xl mx-auto px-6 pt-8 space-y-10">
        
        {/* Navigation line */}
        <div className="flex items-center justify-between border-b border-cream-dark pb-4 print:hidden">
          <Link
            href="/recipes"
            className="group inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase text-stone-600 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to master database</span>
          </Link>
          <span className="font-mono text-[9px] text-stone-500 font-bold uppercase tracking-widest bg-stone-100 px-2 py-1 rounded">
            Savory formula • {recipe.category}
          </span>
        </div>

        {/* 3. HERO HEROINE IMAGE + FLOATING STATS GRID */}
        <div className="relative rounded-3xl overflow-hidden aspect-video xl:aspect-[21/9] bg-cream-dark/20 border border-cream-dark shadow-md" id="recipe-featured-billboard">
          <Image
            src={recipe.image}
            alt={`${recipe.title} - finished dish showing key ingredients`}
            fill
            priority
            placeholder="blur"
            blurDataURL={getBlurDataURL(recipe.image)}
            className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.03]"
            referrerPolicy="no-referrer"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 md:p-8 flex flex-col justify-end">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFF] bg-terracotta px-3 py-1 rounded-full">
                {recipe.category}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-espresso bg-cream px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> {recipe.prepTime} Active
              </span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight drop-shadow-md leading-tight text-left">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* 4. TITLE DESCRIPTION HEADER PANEL */}
        <section className="space-y-4 text-left">
          <p className="text-stone-700 font-sans text-base sm:text-lg leading-relaxed max-w-4xl border-l-4 border-sage pl-4 italic">
            {recipe.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 py-4 border-y border-cream-dark print:hidden justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <PinterestShareButton recipe={recipe} />
              <SaveButton 
                recipeId={recipe.id} 
                recipeTitle={recipe.title} 
                showText={true}
                className="px-4 py-2 bg-white hover:bg-[#FAF6F0] text-espresso border border-cream-dark rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-white hover:bg-[#FAF6F0] text-espresso border border-cream-dark rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5 text-sage" />
                <span>Copy Path</span>
              </button>
              <PrintButton />
            </div>

            {/* Immersive Hands-Free Quick launcher button */}
            <button
              onClick={() => {
                setCookingStepIdx(0);
                setCookingModeOpen(true);
              }}
              className="px-5 py-2.5 bg-espresso hover:bg-terracotta text-cream hover:text-white rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer hover:scale-102"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Interactive Hands-Free Reader</span>
            </button>
          </div>
        </section>

        {/* 5. CULINARY METRIC & SERVINGS REGULATORY CARD */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch select-none">
          {/* Servings regulatory controller */}
          <div className="md:col-span-6 p-5 rounded-2xl bg-white border border-cream-dark flex flex-col justify-between space-y-4 shadow-3xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sage/10 rounded-xl text-sage">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-espresso leading-none">Yield Controller</h4>
                  <span className="text-[10px] text-stone-500 pt-1 block font-sans">Scale ingredients dynamically</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-10 h-10 rounded-xl bg-cream hover:bg-cream-dark text-espresso flex items-center justify-center transition-colors font-bold cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-mono font-bold text-base text-espresso">
                  {servings}
                </span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-10 h-10 rounded-xl bg-cream hover:bg-cream-dark text-espresso flex items-center justify-center transition-colors font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-left font-mono text-[10px] text-stone-500 border-t border-cream-dark pt-3">
              Base recipe formulated for <span className="text-espresso font-bold">4 servings</span>. Currently scaled to <span className="text-terracotta font-bold">{(servings / 4).toFixed(2)}x</span> concentration.
            </div>
          </div>

          {/* Metric / Imperial Conversion Regulator */}
          <div className="md:col-span-6 p-5 rounded-2xl bg-white border border-cream-dark flex flex-col justify-between space-y-4 shadow-3xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-terracotta/10 rounded-xl text-terracotta">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-espresso leading-none">Unit Precision</h4>
                  <span className="text-[10px] text-stone-500 pt-1 block font-sans">Choose metric weight measures</span>
                </div>
              </div>
              
              <div className="p-1 bg-[#FAF6F0] rounded-xl flex items-center gap-1 border border-cream-dark">
                <button
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    unitSystem === 'imperial' 
                      ? 'bg-espresso text-white shadow-xs' 
                      : 'text-stone-500 hover:text-espresso'
                  }`}
                >
                  US Standard
                </button>
                <button
                  onClick={() => setUnitSystem('metric')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    unitSystem === 'metric' 
                      ? 'bg-espresso text-white shadow-xs' 
                      : 'text-stone-500 hover:text-espresso'
                  }`}
                >
                  Metric
                </button>
              </div>
            </div>
            <div className="text-left font-mono text-[10px] text-stone-500 border-t border-cream-dark pt-3">
              Imperial uses <span className="text-espresso font-bold">cups, oz</span>. Metric converts weights and measures directly to <span className="text-terracotta font-bold">grams, milliliters</span>.
            </div>
          </div>
        </section>

        {/* 6. COHESIVE COLUMNS: CHECKLIST & INTERACTIVE STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-4 items-start">
          
          {/* Ingredients Checklist Panel */}
          <section className="md:col-span-5 bg-white p-6 rounded-2xl border border-cream-dark space-y-5 shadow-3xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-dark pb-3.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sage shrink-0" />
                <div className="text-left">
                  <h3 className="font-serif font-bold text-lg text-espresso leading-tight">
                    Ingredients Formula
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Check off completed items</span>
                </div>
              </div>

              {/* Interactive Unit Conversion Switch Widget */}
              <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-900 p-0.5 rounded-lg border border-stone-200 dark:border-stone-800 self-end sm:self-auto" id="ingredients-unit-toggle">
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-2 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    unitSystem === 'imperial'
                      ? 'bg-espresso text-white shadow-3xs dark:bg-stone-800'
                      : 'text-stone-500 hover:text-espresso dark:hover:text-stone-200'
                  }`}
                  title="Switch to US Customary units (cups, oz, lbs)"
                >
                  US Customary
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`px-2 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    unitSystem === 'metric'
                      ? 'bg-espresso text-white shadow-3xs dark:bg-stone-800'
                      : 'text-stone-500 hover:text-espresso dark:hover:text-stone-200'
                  }`}
                  title="Switch to Metric units (grams, ml, kg)"
                >
                  Metric
                </button>
              </div>
            </div>
            
            <ul className="space-y-3.5">
              {currentIngredients.map((item, idx) => {
                const scaledAndConverted = formatIngredient(item, unitSystem);
                const isItemChecked = !!checkedIngredients[idx];
                return (
                  <motion.li 
                    key={idx}
                    onClick={() => {
                      setCheckedIngredients(prev => ({
                        ...prev,
                        [idx]: !prev[idx]
                      }));
                    }}
                    className="flex items-start gap-3 text-xs text-stone-850 hover:text-espresso cursor-pointer transition-colors pb-0.5 group font-sans select-none text-left"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                      isItemChecked
                        ? 'bg-sage border-sage text-white'
                        : 'border-stone-300 bg-white group-hover:border-terracotta'
                    }`}>
                      {isItemChecked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                    </div>
                    <span className={`leading-relaxed pt-0.5 transition-all text-[12.5px] ${
                      isItemChecked 
                        ? 'line-through text-stone-400 font-serif italic' 
                        : 'text-stone-700 font-medium'
                    }`}>
                      {scaledAndConverted}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </section>

          {/* Stepped Directions Column with Embedded Sound Assist */}
          <section className="md:col-span-7 bg-white p-6 rounded-2xl border border-cream-dark space-y-5 shadow-3xs">
            <div className="flex items-center justify-between border-b border-cream-dark pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="text-left">
                  <h3 className="font-serif font-bold text-lg text-espresso leading-tight">
                    Step-by-step Execution
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Interactive guidance track</span>
                </div>
              </div>

              <span className="text-[10px] font-mono bg-cream text-espresso font-extrabold px-2.5 py-1 rounded">
                {currentInstructions.length} Steps Total
              </span>
            </div>

            <ol className="space-y-4 font-sans text-xs text-left">
              {currentInstructions.map((step, idx) => {
                const isStepFocused = idx === activeStep;
                return (
                  <motion.li 
                    key={idx}
                    onClick={() => setActiveStep(isStepFocused ? null : idx)}
                    className={`p-4 rounded-xl transition-all border duration-200 cursor-pointer ${
                      isStepFocused 
                        ? 'bg-[#FCFAF6] border-terracotta/65 shadow-2xs' 
                        : 'bg-white border-cream-dark/50 hover:bg-[#FAF9F5]/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold shrink-0 transition-colors ${
                        isStepFocused
                          ? 'bg-terracotta text-white'
                          : 'bg-cream text-stone-700'
                      }`}>
                        {idx + 1}
                      </span>
                      
                      <div className="space-y-2 flex-1">
                        <p className={`leading-relaxed text-stone-700 text-[13px] ${
                          isStepFocused ? 'text-espresso font-medium font-serif' : ''
                        }`}>
                          {step}
                        </p>
                        
                        {isStepFocused && (
                          <div className="flex items-center gap-3 pt-2 border-t border-cream-dark/40">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCookingStepIdx(idx);
                                setCookingModeOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta hover:underline"
                            >
                              <Maximize2 className="w-3 h-3" /> Focus Reader Mode
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playVoiceStep(step);
                              }}
                              className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                                isSpeaking && cookingStepIdx === idx ? 'text-[#E60023]' : 'text-sage hover:text-sage-dark'
                              }`}
                            >
                              <Volume2 className="w-3 h-3 animate-pulse" />
                              <span>{isSpeaking && cookingStepIdx === idx ? 'Stop Speech' : 'Read Step Aloud'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </section>

        </div>

        {/* 7. HIGH-END EDITORIAL CHEF'S BOX */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-cream-dark text-left space-y-3 shadow-3xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full blur-xl pointer-events-none" />
            <span className="text-[10px] font-mono text-sage font-extrabold flex items-center gap-1.5 tracking-widest uppercase">
              <Award className="w-4 h-4 text-honey" /> Chef's Editorial Secrets & Adjustments
            </span>
            <ul className="space-y-2.5 pl-1 font-serif text-[13.5px] leading-relaxed text-stone-700 italic">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-terracotta select-none">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 8. AI CUSTOMIZATION SEGMENT */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-cream-dark/80 space-y-4 print:hidden shadow-3xs">
          <div className="flex items-center gap-3 text-espresso">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-terracotta to-honey/35 text-white flex items-center justify-center shrink-0 shadow-3xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-serif font-bold text-base leading-snug">PebblePlate Editorial Customizer Engine</h4>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">Runway AI Culinary Modifiers</span>
            </div>
          </div>
          <p className="text-xs text-stone-605 leading-relaxed text-left font-sans">
            Need alternative dietary coordinates? State your preference (e.g. <em>"suggest high-protein alternatives for flour and bake vegan"</em> or <em>"translate steps into a simplified professional baker standard"</em>). The Editorial Artificial Intelligence system will rewrite the culinary blueprint instantly.
          </p>

          {customizing && (
            <div className="flex items-center gap-2.5 py-3.5 px-4 bg-cream-light dark:bg-stone-850 rounded-xl border border-cream-dark/50 dark:border-stone-800 animate-pulse">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                <span className="w-2 h-2 rounded-full bg-sage" />
                <span className="w-2 h-2 rounded-full bg-honey" />
              </div>
              <span className="text-[11px] font-mono font-bold text-stone-650 dark:text-stone-300">Gemini is thinking... rewriting culinary formula...</span>
            </div>
          )}

          <form onSubmit={handleAiCustomize} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="e.g. Vegan friendly conversion, keto sugar ratios, gluten-free blueprint..."
              value={customizationPrompt}
              onChange={(e) => setCustomizationPrompt(e.target.value)}
              disabled={customizing}
              className="flex-1 bg-[#FAF9F5] border border-cream-dark focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-stone-800 text-xs rounded-xl px-4 py-3.5 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={customizing || !customizationPrompt.trim()}
              className="px-5 py-3.5 bg-espresso hover:bg-terracotta text-cream hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all shadow-3xs"
            >
              {customizing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Scale Formula</span>
            </button>
          </form>

          {/* Restore original heirloom recipe settings */}
          {(customizedSteps || customizedIngredients) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setCustomizedSteps(null);
                setCustomizedIngredients(null);
                setCustomizationPrompt('');
                toast.success('Restored original heirloom recipe properties.');
              }}
              className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#E60023] hover:underline flex items-center gap-1.5 pt-2 cursor-pointer"
            >
              ✕ Discard custom adaptation & reload heirloom blueprint
            </motion.button>
          )}
        </div>

        {/* 9. RATINGS MODULE */}
        <RatingWidget recipeSlug={recipe.slug} />

        {/* 10. RECENTLY VIEWED STRIP */}
        <RecentlyViewedStrip currentSlug={recipe.slug} />

      </div>

      {/* 11. FULLSCREEN OVERLAY IMMERSIVE HANDS-FREE reader MODE */}
      <AnimatePresence>
        {cookingModeOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FCFAF7] z-50 overflow-y-auto flex flex-col justify-between"
          >
            {/* Immersive Top Bar */}
            <header className="px-6 py-4 bg-white border-b border-cream-dark flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono tracking-widest font-bold uppercase bg-terracotta/10 text-terracotta px-2.5 py-1 rounded">
                  Immersive Cook Assistant
                </span>
                <span className="text-xs font-serif font-bold text-stone-600 line-clamp-1 max-w-[200px] sm:max-w-md">
                  {recipe.title}
                </span>
              </div>
              
              <button
                onClick={() => {
                  stopVoiceSpeech();
                  setCookingModeOpen(false);
                }}
                className="w-10 h-10 rounded-full border border-cream-dark hover:border-terracotta hover:bg-[#FAF6F1] flex items-center justify-center text-stone-600 hover:text-terracotta transition-colors shadow-3xs cursor-pointer"
                title="Exit Interactive Mode"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Immersive Content Dashboard */}
            <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-12 w-full">
              <div className="w-full space-y-10 text-center">
                
                {/* Visual Circle Level Step Tracker */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {currentInstructions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        stopVoiceSpeech();
                        setCookingStepIdx(idx);
                      }}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === cookingStepIdx 
                          ? 'w-8 bg-terracotta' 
                          : idx < cookingStepIdx 
                            ? 'w-2.5 bg-sage' 
                            : 'w-2.5 bg-stone-250 hover:bg-stone-350'
                      }`}
                      title={`Go to step ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Big Step Number Headline */}
                <div className="space-y-1">
                  <span className="font-mono text-xs text-stone-400 font-black uppercase tracking-widest">
                    Execution Stage
                  </span>
                  <h2 className="font-serif font-extrabold text-4xl sm:text-5xl text-espresso">
                    Step {cookingStepIdx + 1} of {currentInstructions.length}
                  </h2>
                </div>

                {/* BIG DISPLAY INSTRUCTION BOX */}
                <div className="p-8 sm:p-12 bg-white rounded-3xl border border-cream-dark/85 shadow-lg relative max-w-3xl mx-auto">
                  <p className="font-serif text-xl sm:text-2xl md:text-3xl text-espresso tracking-tight leading-relaxed font-semibold italic text-slate-800">
                    "{currentInstructions[cookingStepIdx]}"
                  </p>
                </div>

                {/* Interactive Speech & Assistance row */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => playVoiceStep(currentInstructions[cookingStepIdx])}
                    className={`px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                      isSpeaking 
                        ? 'bg-[#E60023] hover:bg-[#B3001B] text-white animate-pulse' 
                        : 'bg-sage hover:bg-sage-dark text-white'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Stop Speech Assistant</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Read Instruction Aloud</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </main>

            {/* Immersive Controls Sticky Footer */}
            <footer className="bg-white border-t border-cream-dark px-6 py-5 shadow-sm">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <button
                  onClick={prevCookingStep}
                  disabled={cookingStepIdx === 0}
                  className="px-5 py-3 h-11 border border-cream-dark bg-[#FCFAF8] hover:bg-cream text-espresso rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Stage</span>
                </button>

                <div className="hidden sm:block font-mono text-[10px] text-stone-500 font-extrabold uppercase tracking-wider">
                  Hands-Free Digital Voice Cooking Mode Active
                </div>

                <button
                  onClick={nextCookingStep}
                  className="px-5 py-3 h-11 bg-espresso hover:bg-terracotta text-cream hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{cookingStepIdx === currentInstructions.length - 1 ? 'Finish & Plate' : 'Next Stage'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
