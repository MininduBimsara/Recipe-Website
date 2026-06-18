'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Loader2, 
  ChefHat, 
  AlertCircle,
  Printer
} from 'lucide-react';
import { Recipe } from '@/types/pinterestBlogSchema';

interface AdaptedRecipePayload {
  chefNote: string;
  ingredientGroups: Array<{
    title?: string;
    items: string[];
  }>;
  steps: Array<{
    stepNumber: number;
    instruction: string;
    tip?: string;
  }>;
}

interface AiCustomizerProps {
  recipe: Recipe;
  onAdoptionComplete?: (adapted: AdaptedRecipePayload | null) => void;
}

export default function AiCustomizer({ recipe, onAdoptionComplete }: AiCustomizerProps) {
  const [customText, setCustomText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adaptedData, setAdaptedData] = useState<AdaptedRecipePayload | null>(null);

  const presets = [
    { label: '🌱 Adapt to Vegan', query: 'Adapt this recipe to be strictly vegan. Substitute butter, cream, milk, or eggs with stable plant-based alternates.' },
    { label: '🌾 Make it Gluten-Free', query: 'Make this recipe completely gluten-free. Swap all-purpose flour for a dependable gluten-free flour blend and xanthum gum guidance.' },
    { label: '⚖️ Convert to Metric Grams', query: 'Convert all dry cup, tablespoon, and pound measurements into reliable metric grams and milliliters.' },
    { label: '👥 Double the Servings', query: 'Double this recipe perfectly. Scale all ingredient amounts by a factor of 2. Adjust baking times or skillet space advice as required.' },
    { label: '🔥 Air Fryer conversion', query: 'Adapt the cooking style specifically for an Air Fryer. Readjust temperatures, cooking times, and shelf-layering advice.' }
  ];

  const handleAdapt = async (queryText: string) => {
    if (!queryText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // Re-map ingredients array into the structure that the API expects.
      const ingredientGroups = [
        {
          title: "Ingredients",
          items: recipe.ingredients.map(ing => `${ing.quantity} ${ing.unit} ${ing.name} ${ing.notes ? `(${ing.notes})` : ''}`.trim())
        }
      ];

      const steps = recipe.instructions.map(inst => ({
        stepNumber: inst.stepNumber,
        instruction: inst.body,
        tip: inst.tip
      }));

      const response = await fetch('/api/gemini/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeTitle: recipe.title,
          ingredientGroups: ingredientGroups,
          steps: steps,
          customization: queryText
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete custom adaptation.');
      }

      const formatted: AdaptedRecipePayload = {
        chefNote: data.shortChefNote,
        ingredientGroups: data.ingredientGroups,
        steps: data.steps
      };

      setAdaptedData(formatted);
      if (onAdoptionComplete) {
        onAdoptionComplete(formatted);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected server error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAdaptedData(null);
    setCustomText('');
    setError(null);
    if (onAdoptionComplete) {
      onAdoptionComplete(null);
    }
  };

  return (
    <div className="bg-cream border border-cream-dark rounded-3xl p-6 font-sans" id="ai-customizer-container">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-terracotta fill-terracotta-light" />
        <h3 className="text-lg font-serif font-semibold text-espresso">AI Gastronomy Assistant</h3>
        <span className="text-[10px] bg-terracotta/10 text-terracotta font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Gemini Active</span>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed mb-5">
        Need to adjust this {recipe.title} recipe for allergen profiles, scale yield servings, or swap measuring systems? Select preset shortcuts or instruct Chef Gemini below.
      </p>

      {/* Input query box */}
      {!adaptedData && !isLoading && (
        <div className="space-y-4">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  setCustomText(preset.query);
                  handleAdapt(preset.query);
                }}
                className="text-xs bg-white border border-cream-dark text-espresso hover:border-terracotta hover:text-terracotta-dark px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shadow-2xs"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              className="w-full text-sm bg-white border border-cream-dark rounded-xl p-4 pr-12 focus:outline-hidden focus:border-terracotta focus:ring-1 focus:ring-terracotta/45 min-h-[90px] placeholder:text-stone-400"
              placeholder='e.g., "Make this recipe keto-friendly, replacing flours and sugary sweeteners with almond meal equivalents..."'
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
            <button
              onClick={() => handleAdapt(customText)}
              disabled={!customText.trim()}
              className="absolute right-3.5 bottom-3.5 p-2 rounded-xl bg-espresso text-cream hover:bg-terracotta disabled:bg-stone-100 disabled:text-stone-400 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading state with cyclic quotes */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-espresso">Tailoring ingredients & calculations...</p>
            <p className="text-xs text-stone-400 font-serif italic animate-pulse">
              Running deep chemical and physical culinary conversions...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-800 mb-4">
          <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Adaptation Failure</p>
            <p className="text-rose-600/95 mt-1">{error}</p>
            <button 
              onClick={() => handleAdapt(customText)} 
              className="mt-2 text-espresso font-bold underline hover:text-stone-700 cursor-pointer"
            >
              Retry Adaptation
            </button>
          </div>
        </div>
      )}

      {/* Adapted Payload Display */}
      {adaptedData && (
        <div className="bg-white border border-cream-dark rounded-2xl p-5 space-y-5 shadow-inner">
          {/* Chef Note banner */}
          <div className="bg-cream rounded-xl p-4 border border-cream-dark flex items-start gap-3">
            <ChefHat className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-terracotta">Chef’s Conversion Note</span>
              <p className="text-xs font-serif text-espresso leading-relaxed mt-1 italic">
                &ldquo;{adaptedData.chefNote}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-cream-dark">
            <span className="text-xs font-semibold text-stone-450 tracking-wider uppercase font-mono">Conversational Adjustment Enabled</span>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="p-1.5 px-2.5 hover:bg-cream border border-cream-dark text-espresso hover:text-terracotta text-[10px] uppercase tracking-wider font-mono font-bold rounded flex items-center gap-1 transition cursor-pointer"
                title="Print customized Recipe"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 px-2.5 hover:bg-cream border border-cream-dark text-espresso hover:text-terracotta text-[10px] uppercase tracking-wider font-mono font-bold rounded flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Original
              </button>
            </div>
          </div>

          {/* Modified Ingredients and steps */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-mono">Recalculated Ingredients</h4>
              <div className="space-y-3">
                {adaptedData.ingredientGroups.map((group, gIndex) => (
                  <div key={gIndex} className="bg-cream-light p-3 rounded-lg border border-cream-dark">
                    {group.title && (
                      <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-terracotta">{group.title}</span>
                    )}
                    <ul className="text-xs text-stone-700 space-y-1.5 mt-1.5 list-disc pl-4.5">
                      {group.items.map((item, iIndex) => (
                        <li key={iIndex} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-mono">Recalculated Steps</h4>
              <div className="space-y-3.5">
                {adaptedData.steps.map((step, sIndex) => (
                  <div key={sIndex} className="flex gap-3">
                    <span className="w-5.5 h-5.5 rounded-full bg-espresso text-cream flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs leading-relaxed text-stone-700">{step.instruction}</p>
                      {step.tip && (
                        <p className="text-[11px] font-serif text-terracotta mt-1 italic">
                          💡 Note: {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
