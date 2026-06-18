'use client';

import React from 'react';
import { useTemplateState } from './TemplateStateContext';
import { 
  Users, Minus, Plus, Scale, CheckCircle2, Check, Play, 
  Volume2, Maximize2, RefreshCw, Sparkles, Award, Printer, Copy, 
  X, ChevronLeft, ChevronRight, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import SaveButton from '@/features/favorites/SaveButton';
import RecentlyViewedStrip from '@/features/recentlyViewed/RecentlyViewedStrip';
import RatingWidget from '@/components/recipe/RatingWidget';
import PrintButton from '@/components/recipe/PrintButton';
import PinterestShareButton from '@/components/recipe/PinterestShareButton';

export function RecipeEngagement() {
  const { post, handleCopyLink } = useTemplateState();
  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-y border-cream-dark/60 print:hidden justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <PinterestShareButton recipe={post} />
        <SaveButton 
          recipeId={post.id} 
          recipeTitle={post.title} 
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
    </div>
  );
}

export function RecipeServings() {
  const { 
    servings, setServings, unitSystem, setUnitSystem 
  } = useTemplateState();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch select-none">
      {/* Servings count regulatory controller */}
      <div className="p-4 rounded-xl bg-white border border-cream-dark flex flex-col justify-between space-y-3 shadow-3xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sage/10 rounded-lg text-sage">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-espresso leading-none">Yields</h4>
              <span className="text-[9px] text-stone-500 pt-0.5 block font-sans">Scale quantities</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 rounded-lg bg-cream hover:bg-cream-dark text-espresso flex items-center justify-center transition-colors font-bold cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-mono font-bold text-sm text-espresso">
              {servings}
            </span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 rounded-lg bg-cream hover:bg-cream-dark text-espresso flex items-center justify-center transition-colors font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric / Imperial conversions */}
      <div className="p-4 rounded-xl bg-white border border-cream-dark flex flex-col justify-between space-y-3 shadow-3xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-terracotta/10 rounded-lg text-terracotta">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-espresso leading-none">Measurement Unit</h4>
              <span className="text-[9px] text-stone-500 pt-0.5 block font-sans">Toggle custom metric bounds</span>
            </div>
          </div>
          
          <div className="p-0.5 bg-[#FAF6F0] rounded-lg flex items-center gap-1 border border-cream-dark">
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                unitSystem === 'imperial' 
                  ? 'bg-espresso text-white shadow-xs' 
                  : 'text-stone-500 hover:text-espresso'
              }`}
            >
              US
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                unitSystem === 'metric' 
                  ? 'bg-espresso text-white shadow-xs' 
                  : 'text-stone-500 hover:text-espresso'
              }`}
            >
              Metric
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RecipeIngredients() {
  const { 
    post, formatIngredient, checkedIngredients, setCheckedIngredients, customizedIngredients 
  } = useTemplateState();

  const ingredients = customizedIngredients || post.ingredients || [];

  return (
    <div className="bg-white p-5 rounded-xl border border-cream-dark space-y-4 shadow-3xs">
      <div className="flex items-center gap-2 border-b border-cream-dark pb-2">
        <CheckCircle2 className="w-4 h-4 text-sage shrink-0" />
        <div className="text-left">
          <h3 className="font-serif font-bold text-base text-espresso leading-none">
            Recipe Ingredients
          </h3>
          <span className="text-[9px] font-mono text-stone-500 uppercase">Check off completed items</span>
        </div>
      </div>
      
      <ul className="space-y-2 text-left">
        {ingredients.map((item: string, idx: number) => {
          const formatted = formatIngredient(item);
          const isItemChecked = !!checkedIngredients[idx];
          return (
            <li 
              key={idx}
              onClick={() => {
                setCheckedIngredients(prev => ({
                  ...prev,
                  [idx]: !prev[idx]
                }));
              }}
              className="flex items-start gap-2.5 text-xs text-stone-850 hover:text-espresso cursor-pointer transition-colors pb-1 group font-sans select-none"
            >
              <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                isItemChecked
                  ? 'bg-sage border-sage text-white'
                  : 'border-stone-350 bg-white group-hover:border-terracotta'
              }`}>
                {isItemChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className={`leading-snug transition-all text-[12px] ${
                isItemChecked 
                  ? 'line-through text-stone-400 font-serif italic' 
                  : 'text-stone-700 font-medium'
              }`}>
                {formatted}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RecipeInstructions() {
  const { 
    post, activeStep, setActiveStep, customizedSteps, 
    isSpeaking, playVoiceStep, setCookingStepIdx, setCookingModeOpen, cookingStepIdx
  } = useTemplateState();

  const instructions = customizedSteps || post.instructions || [];

  return (
    <div className="bg-white p-5 rounded-xl border border-cream-dark space-y-4 shadow-3xs">
      <div className="flex items-center justify-between border-b border-cream-dark pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="text-left">
            <h3 className="font-serif font-bold text-base text-espresso leading-none">
              Step-by-step Directions
            </h3>
            <span className="text-[9px] font-mono text-stone-500 uppercase">Interactive guidance track</span>
          </div>
        </div>
        <button
          onClick={() => {
            setCookingStepIdx(0);
            setCookingModeOpen(true);
          }}
          className="px-3 py-1 bg-espresso hover:bg-terracotta text-cream hover:text-white rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs"
        >
          <Maximize2 className="w-2.5 h-2.5" />
          <span>Hands-free Reader</span>
        </button>
      </div>

      <ol className="space-y-3 font-sans text-xs text-left">
        {instructions.map((step: string, idx: number) => {
          const isStepFocused = idx === activeStep;
          return (
            <li 
              key={idx}
              onClick={() => setActiveStep(isStepFocused ? null : idx)}
              className={`p-3 rounded-lg transition-all border duration-200 cursor-pointer ${
                isStepFocused 
                  ? 'bg-[#FCFAF6] border-terracotta/60 shadow-2xs' 
                  : 'bg-white border-cream-dark/50 hover:bg-[#FAF9F5]/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                  isStepFocused
                    ? 'bg-terracotta text-white'
                    : 'bg-cream text-stone-705'
                }`}>
                  {idx + 1}
                </span>
                
                <div className="space-y-1.5 flex-1">
                  <p className={`leading-relaxed text-stone-705 text-[12px] ${
                    isStepFocused ? 'text-espresso font-semibold font-serif' : ''
                  }`}>
                    {step}
                  </p>
                  
                  {isStepFocused && (
                    <div className="flex items-center gap-3 pt-1.5 border-t border-cream-dark/40">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCookingStepIdx(idx);
                          setCookingModeOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-terracotta hover:underline"
                      >
                        <Maximize2 className="w-2.5 h-2.5" /> Reader Mode
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playVoiceStep(step);
                        }}
                        className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider ${
                          isSpeaking && cookingStepIdx === idx ? 'text-[#E60023]' : 'text-sage hover:text-sage-dark'
                        }`}
                      >
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>{isSpeaking && cookingStepIdx === idx ? 'Stop Speech' : 'Read Aloud'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function RecipeTips() {
  const { post } = useTemplateState();
  if (!post.tips || post.tips.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-cream-dark text-left space-y-2 shadow-3xs">
      <span className="text-[9px] font-mono text-sage font-extrabold flex items-center gap-1 tracking-widest uppercase">
        <Award className="w-3.5 h-3.5" /> Chef's Cooking Tips
      </span>
      <ul className="space-y-1.5 pl-1 font-serif text-[12.5px] leading-relaxed text-stone-700 italic">
        {post.tips.map((tip: string, index: number) => (
          <li key={index} className="flex gap-2">
            <span className="text-terracotta select-none">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RecipeAiCustomizer() {
  const { 
    customizationPrompt, setCustomizationPrompt, customizing, 
    customizedSteps, customizedIngredients, setCustomizedSteps, 
    setCustomizedIngredients, handleAiCustomize 
  } = useTemplateState();

  return (
    <div className="p-5 rounded-2xl bg-white border border-cream-dark space-y-3 print:hidden shadow-3xs">
      <div className="flex items-center gap-2.5 text-espresso">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-terracotta to-honey/30 text-white flex items-center justify-center shrink-0 shadow-3xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-left">
          <h4 className="font-serif font-bold text-sm leading-tight">AI Recipe Customizer</h4>
          <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500">AI Personalization</span>
        </div>
      </div>
      <p className="text-[11px] text-stone-600 leading-relaxed text-left font-sans">
        Adapt this recipe for high-protein, keto, vegan or gluten-free profiles in one click.
      </p>

      {customizing && (
        <div className="flex items-center gap-2 py-2 px-3 bg-cream-light rounded-lg border border-cream-dark/50 animate-pulse">
          <span className="text-[10px] font-mono font-bold text-stone-750">AI is tailoring recipe...</span>
        </div>
      )}

      <form onSubmit={handleAiCustomize} className="flex gap-1.5 pt-1">
        <input
          type="text"
          placeholder="e.g. Vegan conversion, keto, double flour..."
          value={customizationPrompt}
          onChange={(e) => setCustomizationPrompt(e.target.value)}
          disabled={customizing}
          className="flex-1 bg-[#FAF9F5] border border-cream-dark focus:border-terracotta text-stone-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={customizing || !customizationPrompt.trim()}
          className="px-4 py-2.5 bg-espresso hover:bg-terracotta text-cream hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer disabled:opacity-40 transition-all shadow-3xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Tailor</span>
        </button>
      </form>

      {(customizedSteps || customizedIngredients) && (
        <button
          onClick={() => {
            setCustomizedSteps(null);
            setCustomizedIngredients(null);
            setCustomizationPrompt('');
            toast.success('Restored original recipe settings.');
          }}
          className="text-[9px] font-mono uppercase font-bold tracking-wider text-[#E60023] hover:underline flex items-center gap-1 pt-1.5 cursor-pointer text-left"
        >
          ✕ Discard customizations
        </button>
      )}
    </div>
  );
}

export function RecipeBottomWidgets() {
  const { post } = useTemplateState();
  return (
    <div className="space-y-8 pt-8 border-t border-cream-dark/40">
      <RatingWidget recipeSlug={post.slug} />
      <RecentlyViewedStrip currentSlug={post.slug} />
    </div>
  );
}

export function CookingModeOverlay() {
  const { 
    cookingModeOpen, setCookingModeOpen, cookingStepIdx, setCookingStepIdx, 
    isSpeaking, playVoiceStep, stopVoiceSpeech, customizedSteps, post 
  } = useTemplateState();

  if (!cookingModeOpen) return null;

  const steps = customizedSteps || post.instructions || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#FCFAF7] z-50 overflow-y-auto flex flex-col justify-between">
        <header className="px-6 py-4 bg-white border-b border-cream-dark flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono tracking-widest font-bold uppercase bg-terracotta/10 text-terracotta px-2.5 py-1 rounded">
              Voice Reader Assistant
            </span>
            <span className="text-xs font-serif font-bold text-stone-605 max-w-[200px] sm:max-w-md line-clamp-1">
              {post.title}
            </span>
          </div>
          
          <button
            onClick={() => {
              stopVoiceSpeech();
              setCookingModeOpen(false);
            }}
            className="w-8 h-8 rounded-full border border-cream-dark hover:border-terracotta flex items-center justify-center text-stone-600 hover:text-terracotta transition-colors shadow-3xs cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto px-6 py-8 w-full">
          <div className="w-full space-y-8 text-center">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {steps.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    stopVoiceSpeech();
                    setCookingStepIdx(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-350 ${
                    idx === cookingStepIdx ? 'w-6 bg-terracotta' : 'w-2 bg-stone-300'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-0.5">
              <span className="font-mono text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                Stage Directions
              </span>
              <h2 className="font-serif font-extrabold text-2xl text-espresso">
                Step {cookingStepIdx + 1} of {steps.length}
              </h2>
            </div>

            <div className="p-6 sm:p-10 bg-white rounded-2xl border border-cream-dark shadow-md max-w-xl mx-auto">
              <p className="font-serif text-lg sm:text-xl text-stone-850 tracking-tight leading-relaxed italic">
                "{steps[cookingStepIdx]}"
              </p>
            </div>

            <div className="flex items-center justify-center gap-3.5">
              <button
                onClick={() => {
                  stopVoiceSpeech();
                  if (cookingStepIdx > 0) setCookingStepIdx(prev => prev - 1);
                }}
                disabled={cookingStepIdx === 0}
                className="p-3 bg-white border border-cream-dark rounded-full hover:bg-[#FAF6F1] text-espresso disabled:opacity-45 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => playVoiceStep(steps[cookingStepIdx])}
                className={`px-5 py-3 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-transform duration-200 active:scale-95 ${
                  isSpeaking ? 'bg-[#E60023] text-white animate-pulse' : 'bg-espresso text-cream hover:bg-terracotta hover:text-white'
                }`}
              >
                <Volume2 className="w-4 h-4 fill-current" />
                <span>{isSpeaking ? 'Mute Speech' : 'Read Aloud'}</span>
              </button>

              <button
                onClick={() => {
                  stopVoiceSpeech();
                  if (cookingStepIdx < steps.length - 1) {
                    setCookingStepIdx(prev => prev + 1);
                  } else {
                    toast.success('Completed recipe course!');
                    setCookingModeOpen(false);
                  }
                }}
                className="p-3 bg-white border border-cream-dark rounded-full hover:bg-[#FAF6F1] text-espresso transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </AnimatePresence>
  );
}
