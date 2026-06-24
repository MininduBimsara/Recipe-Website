'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Recipe } from '@/data/recipes';
import { BlogPost } from '@/data/blogs';
import { toast } from 'react-hot-toast';
import { getBlurDataURL, blurHashToDataURL } from '@/lib/placeholder';

interface TemplateStateContextType {
  // Shared
  type: 'recipe' | 'blog';
  post: any;
  getBlurUrl: (url: string | undefined, slot: number) => string;
  getSlotImage: (slot: number) => { url: string; caption: string };

  // Recipe-specific Interactivity
  servings: number;
  setServings: React.Dispatch<React.SetStateAction<number>>;
  unitSystem: 'imperial' | 'metric';
  setUnitSystem: React.Dispatch<React.SetStateAction<'imperial' | 'metric'>>;
  checkedIngredients: Record<string, boolean>;
  setCheckedIngredients: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  activeStep: number | null;
  setActiveStep: React.Dispatch<React.SetStateAction<number | null>>;
  cookingModeOpen: boolean;
  setCookingModeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cookingStepIdx: number;
  setCookingStepIdx: React.Dispatch<React.SetStateAction<number>>;
  isSpeaking: boolean;
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  customizationPrompt: string;
  setCustomizationPrompt: React.Dispatch<React.SetStateAction<string>>;
  customizedSteps: string[] | null;
  setCustomizedSteps: React.Dispatch<React.SetStateAction<string[] | null>>;
  customizedIngredients: string[] | null;
  setCustomizedIngredients: React.Dispatch<React.SetStateAction<string[] | null>>;
  customizing: boolean;
  
  formatIngredient: (item: string) => string;
  playVoiceStep: (text: string) => void;
  stopVoiceSpeech: () => void;
  handleAiCustomize: (e: React.FormEvent) => Promise<void>;

  // Blog-specific Interactivity
  activeSectionId: string;
  setActiveSectionId: React.Dispatch<React.SetStateAction<string>>;
  handlePinAction: (imageUrl: string, titleStr: string) => void;
  handleCopyLink: () => void;
  handlePrint: () => void;
}

const TemplateStateContext = createContext<TemplateStateContextType | undefined>(undefined);

export function TemplateStateProvider({ 
  children, 
  post, 
  type 
}: { 
  children: React.ReactNode; 
  post: any; 
  type: 'recipe' | 'blog';
}) {
  // Normalize post to ensure consistent array-of-strings schemas
  const normalizedPost = React.useMemo(() => {
    if (!post) return post;
    
    // Normalize ingredients individually
    let normalizedIngredients = post.ingredients || [];
    normalizedIngredients = normalizedIngredients.map((item: any) => {
      if (item && typeof item === 'object') {
        const qty = item.quantity ? `${item.quantity} ` : '';
        const unit = item.unit ? `${item.unit} ` : '';
        const name = item.name || '';
        const notes = item.notes ? `, ${item.notes}` : '';
        return `${qty}${unit}${name}${notes}`;
      }
      return String(item || '');
    });

    // Normalize instructions individually
    let normalizedInstructions = post.instructions || [];
    normalizedInstructions = normalizedInstructions.map((item: any) => {
      if (item && typeof item === 'object') {
        return item.body || '';
      }
      return String(item || '');
    });

    // Normalize coverImage vs image
    const image = post.image || post.coverImage || post.cover_image || '';

    return {
      ...post,
      ingredients: normalizedIngredients,
      instructions: normalizedInstructions,
      image,
    };
  }, [post]);

  // 1. Image slots resolution
  const getSlotImage = (slot: number) => {
    const images = normalizedPost.template_images || [];
    const found = images.find((img: any) => img.slot === slot);
    if (found && found.url) {
      return { url: found.url, caption: found.caption || '' };
    }
    // Fallbacks
    if (slot === 1) {
      return { url: normalizedPost.image || normalizedPost.cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=850', caption: '' };
    }
    if (slot === 2) {
      return { url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=650', caption: 'Step 2 preparation' };
    }
    return { url: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=650', caption: 'Beautiful plated presentation' };
  };

  const getBlurUrl = (url: string | undefined, slot: number) => {
    const images = normalizedPost.template_images || [];
    const found = images.find((img: any) => img.slot === slot);
    if (found && found.blur_hash) {
      const decoded = blurHashToDataURL(found.blur_hash);
      if (decoded) return decoded;
    }
    return getBlurDataURL(url);
  };

  // 2. Recipe states
  const [servings, setServings] = useState(4);
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  // Immersive cooking mode
  const [cookingModeOpen, setCookingModeOpen] = useState(false);
  const [cookingStepIdx, setCookingStepIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // AI customizer states
  const [customizationPrompt, setCustomizationPrompt] = useState('');
  const [customizedSteps, setCustomizedSteps] = useState<string[] | null>(null);
  const [customizedIngredients, setCustomizedIngredients] = useState<string[] | null>(null);
  const [customizing, setCustomizing] = useState(false);

  // 3. Blog states
  const [activeSectionId, setActiveSectionId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Format ingredient
  const formatIngredient = (item: string) => {
    const ratio = servings / 4;
    
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
      return Number(scaledVal.toFixed(2)).toString() + ' ';
    });

    if (unitSystem === 'imperial') {
      let converted = scaled;
      
      // Convert metric to imperial
      converted = converted.replace(/(\d+(\.\d+)?)\s*g\b/gi, (match, valStr) => {
        const val = parseFloat(valStr);
        if (isNaN(val)) return match;
        const itemLower = item.toLowerCase();
        
        if (itemLower.includes('flour')) return `${Number((val / 125).toFixed(2))} cups`;
        if (itemLower.includes('sugar')) return `${Number((val / 200).toFixed(2))} cups`;
        if (itemLower.includes('butter') || itemLower.includes('margarine')) return `${Number((val / 227).toFixed(2))} cups`;
        
        return `${Number((val / 28.3495).toFixed(1))} oz`;
      });

      converted = converted.replace(/(\d+(\.\d+)?)\s*ml\b/gi, (match, valStr) => {
        const val = parseFloat(valStr);
        if (isNaN(val)) return match;
        
        if (val >= 60) {
          return `${Number((val / 240).toFixed(2))} cups`;
        } else if (val >= 15) {
          return `${Number((val / 15).toFixed(1))} tbsp`;
        } else {
          return `${Number((val / 5).toFixed(1))} tsp`;
        }
      });
      
      converted = converted.replace(/(\d+(\.\d+)?)\s*kg\b/gi, (match, valStr) => {
        const val = parseFloat(valStr);
        if (isNaN(val)) return match;
        return `${Number((val * 2.20462).toFixed(2))} lbs`;
      });

      return converted;
    }

    // Convert imperial to metric for refined kitchen precision
    let converted = scaled;
    converted = converted.replace(/(\d+(\.\d+)?)\s*cups?\b/gi, (match, valStr) => {
      const val = parseFloat(valStr);
      if (isNaN(val)) return match;
      
      const itemLower = item.toLowerCase();
      if (itemLower.includes('flour')) return `${Math.round(val * 125)}g`;
      if (itemLower.includes('sugar')) return `${Math.round(val * 200)}g`;
      if (itemLower.includes('butter') || itemLower.includes('margarine')) return `${Math.round(val * 227)}g`;
      return `${Math.round(val * 240)}ml`;
    });

    converted = converted.replace(/(\d+(\.\d+)?)\s*(ounces?|oz)\b/gi, (match, valStr) => {
      const val = parseFloat(valStr);
      if (isNaN(val)) return match;
      return `${Math.round(val * 28.3)}g`;
    });

    converted = converted.replace(/(\d+(\.\d+)?)\s*(pounds?|lbs?)\b/gi, (match, valStr) => {
      const val = parseFloat(valStr);
      if (isNaN(val)) return match;
      const calculatedG = Math.round(val * 453.6);
      return calculatedG >= 1000 ? `${(calculatedG / 1000).toFixed(1)}kg` : `${calculatedG}g`;
    });
    
    converted = converted.replace(/(\d+(\.\d+)?)\s*(tbsp|tablespoons?)\b/gi, (match, valStr) => {
      const val = parseFloat(valStr);
      if (isNaN(val)) return match;
      return `${Math.round(val * 15)}ml`;
    });

    converted = converted.replace(/(\d+(\.\d+)?)\s*(tsp|teaspoons?)\b/gi, (match, valStr) => {
      const val = parseFloat(valStr);
      if (isNaN(val)) return match;
      return `${Math.round(val * 5)}ml`;
    });

    return converted;
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
      let modifiedIngredients = [...(normalizedPost.ingredients || [])];
      let modifiedInstructions = [...(normalizedPost.instructions || [])];

      if (p.includes('vegan') || p.includes('plant') || p.includes('dairy-free') || p.includes('vegetar')) {
        modifiedIngredients = (normalizedPost.ingredients || []).map((item: string) => {
          let temp = item;
          temp = temp.replace(/\bbutter\b/gi, 'plant-based vegan butter')
                     .replace(/\bmilk\b/gi, 'organic oat milk')
                     .replace(/\bheavy cream\b/gi, 'rich cashew cream')
                     .replace(/\bcream\b/gi, 'coconut cream')
                     .replace(/\begg\b/gi, 'flaxseed/starch egg substitute')
                     .replace(/\beggs\b/gi, 'flax eggs')
                     .replace(/\bcheese\b/gi, 'vegan cheese')
                     .replace(/\bhoney\b/gi, 'pure maple syrup')
                     .replace(/\bbeef\b/gi, 'portobello mushroom')
                     .replace(/\bchicken\b/gi, 'tofu strips');
          return temp;
        });
        modifiedInstructions = (normalizedPost.instructions || []).map((step: string) => {
          return step.replace(/\bbutter\b/gi, 'plant-based butter')
                     .replace(/\bmilk\b/gi, 'oat milk')
                     .replace(/\begg\b/gi, 'flax gel')
                     .replace(/\beggs\b/gi, 'flax gel')
                     .replace(/\bcream\b/gi, 'plant cream');
        });
        modifiedInstructions.push("[Vegan Adjustment] Fully adapted temperature bounds and fat ratios for non-dairy performance.");
      } else if (p.includes('gluten') || p.includes('gf')) {
        modifiedIngredients = (normalizedPost.ingredients || []).map((item: string) => {
          return item.replace(/\bflour\b/gi, '1-to-1 Premium Gluten-Free Baking Flour');
        });
        modifiedInstructions = (normalizedPost.instructions || []).map((step: string) => {
          return step.replace(/\bflour\b/gi, 'gluten-free flour blend');
        });
        modifiedInstructions.push("[Gluten-Free Adjustment] Let batter rest for 10 minutes to allow GF flours to hydrate perfectly.");
      } else {
        modifiedIngredients = (normalizedPost.ingredients || []).map((item: string) => item + ` (${customizationPrompt})`);
        modifiedInstructions.push(`[Custom Chef Note] Adjusted visual balances for: "${customizationPrompt}".`);
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      setCustomizedSteps(modifiedInstructions);
      setCustomizedIngredients(modifiedIngredients);
      toast.success('Successfully modified recipe variables!', { id: 'ai-custom' });
    } catch (err) {
      console.error(err);
      toast.error('Could not customize recipe variables.', { id: 'ai-custom' });
    } finally {
      setCustomizing(false);
    }
  };

  // Blog interactives
  const handlePinAction = (imageUrl: string, titleStr: string) => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const pinterestUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
      shareUrl
    )}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(
      `PebblePlate Tip: ${titleStr} — from "${normalizedPost.title}"`
    )}`;
    window.open(pinterestUrl, '_blank', 'width=750,height=600,toolbar=0,status=0');
    toast.success('Saving on Pinterest! 📌');
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied! 📋');
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  return (
    <TemplateStateContext.Provider value={{
      type,
      post: normalizedPost,
      getBlurUrl,
      getSlotImage,
      servings,
      setServings,
      unitSystem,
      setUnitSystem,
      checkedIngredients,
      setCheckedIngredients,
      activeStep,
      setActiveStep,
      cookingModeOpen,
      setCookingModeOpen,
      cookingStepIdx,
      setCookingStepIdx,
      isSpeaking,
      setIsSpeaking,
      customizationPrompt,
      setCustomizationPrompt,
      customizedSteps,
      setCustomizedSteps,
      customizedIngredients,
      setCustomizedIngredients,
      customizing,
      formatIngredient,
      playVoiceStep,
      stopVoiceSpeech,
      handleAiCustomize,
      activeSectionId,
      setActiveSectionId,
      handlePinAction,
      handleCopyLink,
      handlePrint
    }}>
      {children}
    </TemplateStateContext.Provider>
  );
}

export function useTemplateState() {
  const context = useContext(TemplateStateContext);
  if (!context) {
    throw new Error('useTemplateState must be used inside TemplateStateProvider');
  }
  return context;
}
