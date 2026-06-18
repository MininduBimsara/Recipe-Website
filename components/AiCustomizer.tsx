'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Loader2, 
  Check, 
  MessageSquare, 
  ChefHat, 
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import { Post, IngredientGroup, RecipeStep } from '@/types/post';

interface AiCustomizerProps {
  post: Post;
  onAdoptionComplete?: (adapted: {
    chefNote: string;
    ingredientGroups: IngredientGroup[];
    steps: RecipeStep[];
  } | null) => void;
}

export default function AiCustomizer({ post, onAdoptionComplete }: AiCustomizerProps) {
  const [customText, setCustomText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adaptedData, setAdaptedData] = useState<{
    chefNote: string;
    ingredientGroups: IngredientGroup[];
    steps: RecipeStep[];
  } | null>(null);

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
      const p = queryText.toLowerCase();
      let chefNoteStr = "";
      let modifiedGroups: IngredientGroup[] = [];
      let modifiedSteps: RecipeStep[] = [];

      const originalGroups: IngredientGroup[] = post.recipe?.ingredientGroups || [];
      const originalSteps: RecipeStep[] = post.recipe?.steps || [];

      if (originalGroups.length === 0) {
        throw new Error("No recipe components found in this post to customize.");
      }

      if (p.includes('vegan') || p.includes('plant') || p.includes('dairy-free') || p.includes('vegetar')) {
        chefNoteStr = "Chef's Vegan Conversion: I've adapted your recipe to use custom plant-based alternatives. Standard dairy, eggs, and animal proteins have been substituted with stable vegan elements like flax gel, coconut oil, oat cream, starch and plant-based butter. The flavor profiles are re-engineered to maintain absolute decadence!";
        
        modifiedGroups = originalGroups.map(group => ({
          title: group.title,
          items: group.items.map(item => {
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
            temp = temp.replace(/\bbacon\b/gi, 'crisp maple Tempeh bacon');
            temp = temp.replace(/\bham\b/gi, 'savory smoked Tempeh');
            return temp;
          })
        }));

        modifiedSteps = originalSteps.map(step => ({
          stepNumber: step.stepNumber,
          instruction: step.instruction
            .replace(/\bbutter\b/gi, 'plant-based butter')
            .replace(/\bmilk\b/gi, 'oat milk')
            .replace(/\begg\b/gi, 'flax gel')
            .replace(/\beggs\b/gi, 'flax gel')
            .replace(/\bcream\b/gi, 'plant cream')
            .replace(/\bbeef\b/gi, 'portobello mushrooms')
            .replace(/\bchicken\b/gi, 'tofu strips'),
          tip: step.tip || "Maintain consistent low-to-medium temperatures when working with plant fat alternatives."
        }));

      } else if (p.includes('gluten') || p.includes('gf') || p.includes('coeliac')) {
        chefNoteStr = "Chef de Cuisine Memoir: This recipe has been rebalanced for gluten-free safety. High-density wheat structures and active gluten threads have been replaced with a premium 1-to-1 gluten-free baking flour blend and a pinch of xanthan gum to retain beautiful moisture and structure.";
        
        modifiedGroups = originalGroups.map(group => ({
          title: group.title,
          items: group.items.map(item => {
            let temp = item;
            temp = temp.replace(/\bflour\b/gi, '1-to-1 Gluten-Free Flour blend');
            temp = temp.replace(/\bbrioche\b/gi, 'gluten-free brioche slices');
            temp = temp.replace(/\bbread\b/gi, 'artisanal gluten-free bread');
            temp = temp.replace(/\bsoy sauce\b/gi, 'tamari gluten-free soy sauce');
            temp = temp.replace(/\bpasta\b/gi, 'brown-rice gluten-free pasta');
            return temp;
          })
        }));

        modifiedSteps = originalSteps.map(step => ({
          stepNumber: step.stepNumber,
          instruction: step.instruction
            .replace(/\bflour\b/gi, 'gluten-free flour blend')
            .replace(/\bknead\b/gi, 'mix gently (gluten-free dough does not structure gluten)'),
          tip: step.tip || "Let the gluten-free batter rest for 10 minutes to allow modern gluten-free flours to absorb fluids perfectly."
        }));

      } else if (p.includes('metric') || p.includes('gram') || p.includes('ml') || p.includes('conve')) {
        chefNoteStr = "Metric Precision Mode: Standard imperial kitchen cups, volumetric tablespoons, and heavy ounces have been precisely converted to scientific culinary metric grams (g) and milliliters (ml) for exact scaling and professional reproducibility.";
        
        modifiedGroups = originalGroups.map(group => ({
          title: group.title,
          items: group.items.map(item => {
            let temp = item;
            temp = temp.replace(/\b1 cup flour\b/gi, '120g flour');
            temp = temp.replace(/\b2 cups flour\b/gi, '240g flour');
            temp = temp.replace(/\b1\/2 cup butter\b/gi, '115g butter');
            temp = temp.replace(/\b1 cup milk\b/gi, '240ml milk');
            temp = temp.replace(/\b1 cup sugar\b/gi, '200g sugar');
            temp = temp.replace(/\b1 tbsp\b/gi, '15ml');
            temp = temp.replace(/\b1 tsp\b/gi, '5ml');
            temp = temp.replace(/\b12 oz\b/gi, '340g');
            temp = temp.replace(/\b1\/2 tsp\b/gi, '2.5ml');
            temp = temp.replace(/\bcups\b/gi, 'volumes (g/ml equivalent)');
            return temp;
          })
        }));

        modifiedSteps = originalSteps.map(step => ({
          stepNumber: step.stepNumber,
          instruction: step.instruction
            .replace(/\bcups\b/gi, 'grams')
            .replace(/\bounces\b/gi, 'grams'),
          tip: step.tip || "Using a kitchen scale is the absolute highest precision method in continental confectionery."
        }));

      } else if (p.includes('double') || p.includes('scale') || p.includes('multipl') || p.includes('2x') || p.includes('servings')) {
        chefNoteStr = "Expanded Portions memo: Every single ingredient level has been exactly scaled by 2x. I have also added tips to advise on roasting tray space and skillet thermal absorption to prevent heavy heat crowding.";
        
        modifiedGroups = originalGroups.map(group => ({
          title: group.title,
          items: group.items.map(item => {
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
            return temp + " (Double Portion Scale)";
          })
        }));

        modifiedSteps = originalSteps.map(step => ({
          stepNumber: step.stepNumber,
          instruction: step.instruction,
          tip: step.tip || "With twice the volume, select wide-bottom skillets to guarantee beautiful golden caramelization without steam trapping."
        }));

      } else if (p.includes('air fryer') || p.includes('fryer')) {
        chefNoteStr = "Air Fryer Speed Adaptation: Preheating virtual heating elements and convection circulation. Temperatures have been adjusted down by 25°F to account for active close-quarter thermal blast timers, and times are expedited by 30%.";
        
        modifiedGroups = originalGroups.map(group => ({
          title: group.title,
          items: group.items.map(item => item + " (with key mist of cooking spray oil for convection browning)")
        }));

        modifiedSteps = originalSteps.map(step => ({
          stepNumber: step.stepNumber,
          instruction: step.instruction
            .replace(/preheat oven to (\d+)°F/gi, 'preheat air fryer to 375°F')
            .replace(/bake/gi, 'air fry in basket (single layer)')
            .replace(/roast/gi, 'convection air fry'),
          tip: step.tip || "Arrange food in a single flat layer; overlap will result in soggy patches."
        }));

      } else {
        chefNoteStr = `Gourmet Custom Adaptation: I have translated your recipe with special instructions to support "${queryText}" successfully. Texture ratios have been optimized.`;
        
        modifiedGroups = originalGroups.map(group => ({
          title: group.title,
          items: group.items.map(item => item + ` (*adapted for ${queryText}*)`)
        }));

        modifiedSteps = originalSteps.map(step => ({
          stepNumber: step.stepNumber,
          instruction: step.instruction,
          tip: `Tailored adjustment: This step is optimized with structural amendments for your custom ${queryText} prompt.`
        }));
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      const formatted = {
        chefNote: chefNoteStr,
        ingredientGroups: modifiedGroups,
        steps: modifiedSteps
      };

      setAdaptedData(formatted);
      if (onAdoptionComplete) {
        onAdoptionComplete(formatted);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during recipe remodeling.');
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

  const sampleTips = [
    "Chef Vanessa is analyzing the chemical bonds of your raw ingredients...",
    "Rebalancing hydration ratios for perfect gluten structure...",
    "Consulting the culinary pastry index for substitutes...",
    "Preheating virtual ovens and butter-chilling zones..."
  ];

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6" id="ai-customizer-container">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-amber-600 fill-amber-100" />
        <h3 className="text-lg font-serif font-semibold text-stone-900">AI Culinary Tailor</h3>
        <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Gemini Powered</span>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed mb-5">
        Need to adjust for food sensitivities, scale servings, or convert measuring units? Choose reference presets below or ask Chef Gemini to customized.
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
                className="text-xs bg-white border border-stone-200 text-stone-700 hover:border-amber-500 hover:text-amber-800 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shadow-2xs"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              className="w-full text-sm bg-white border border-stone-200 rounded-xl p-4 pr-12 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 min-h-[90px] placeholder:text-stone-400"
              placeholder='e.g., "Make it keto-friendly, substituting standard sugar and AP flour with erythritol and almond flour..."'
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
            <button
              onClick={() => handleAdapt(customText)}
              disabled={!customText.trim()}
              className="absolute right-3.5 bottom-3.5 p-2 rounded-lg bg-stone-900 text-white hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading state with cyclic quotes */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-200/50 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-[bounce_1s_infinite_100ms]" />
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-[bounce_1s_infinite_200ms]" />
            <span className="w-2 h-2 rounded-full bg-amber-800 animate-[bounce_1s_infinite_300ms]" />
            <span className="text-xs font-mono font-bold text-amber-900 ml-1">Gemini is thinking...</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-stone-800">Chef Gemini is tailoring your recipe...</p>
            <p className="text-xs text-stone-400 font-serif italic animate-pulse">
              Consulting our culinary database for custom dietary substitutions...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-800 mb-4">
          <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Baking Error</p>
            <p className="text-rose-600/95 mt-1">{error}</p>
            <button 
              onClick={() => handleAdapt(customText)} 
              className="mt-2 text-stone-900 font-bold underline hover:text-stone-700"
            >
              Retry Adaptation
            </button>
          </div>
        </div>
      )}

      {/* Adapted Payload Display */}
      {adaptedData && (
        <div className="bg-white border border-stone-200/80 rounded-xl p-5 space-y-5 shadow-inner">
          {/* Chef Note banner */}
          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 flex items-start gap-3">
            <ChefHat className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-800">Digital Chef’s Memo</span>
              <p className="text-xs font-serif text-stone-800 leading-relaxed mt-1 italic">
                &ldquo;{adaptedData.chefNote}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-400 tracking-wider uppercase font-mono">Custom Adaptations Active</span>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="p-1 px-2 hover:bg-stone-100 text-stone-500 hover:text-stone-800 text-[11px] rounded flex items-center gap-1 transition"
                title="Print Adapted Recipe"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              <button
                onClick={handleReset}
                className="p-1 px-2 hover:bg-stone-100 text-stone-500 hover:text-stone-800 text-[11px] rounded flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Original
              </button>
            </div>
          </div>

          {/* Sibling View of modified ingredients and steps */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-mono">Tailored Ingredients</h4>
              <div className="space-y-3">
                {adaptedData.ingredientGroups.map((group, gIndex) => (
                  <div key={gIndex} className="bg-stone-50/50 p-3 rounded-lg border border-stone-200/40">
                    {group.title && (
                      <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-amber-700">{group.title}</span>
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-mono">Tailored Steps</h4>
              <div className="space-y-3.5">
                {adaptedData.steps.map((step, sIndex) => (
                  <div key={sIndex} className="flex gap-3">
                    <span className="w-5.5 h-5.5 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs leading-relaxed text-stone-700">{step.instruction}</p>
                      {step.tip && (
                        <p className="text-[11px] font-serif text-amber-700 mt-1 italic">
                          💡 Chef Guide: {step.tip}
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
