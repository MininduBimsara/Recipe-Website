'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Utensils, 
  AlertCircle,
  CheckCircle,
  Undo
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { createRecipeAction, updateRecipeAction } from '@/lib/actions/recipes';
import { getSavedRecipes, saveRecipes } from '@/lib/preseededPool';
import TemplatePicker from '@/components/admin/TemplatePicker';
import PublishControl from '@/components/admin/PublishControl';
import { toast } from 'react-hot-toast';

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const isNew = id === 'new';
  const router = useRouter();

  const [isSupabase, setIsSupabase] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Desserts' | 'Quick & Easy' | 'Vegetarian' | 'Meal Prep' | 'Drinks'>('Dinner');
  const [cuisine, setCuisine] = useState('Italian');
  const [prepTime, setPrepTime] = useState('15 mins');
  const [cookTime, setCookTime] = useState('25 mins');
  const [calories, setCalories] = useState('350');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800');
  const [ingredientsStr, setIngredientsStr] = useState('');
  const [instructionsStr, setInstructionsStr] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  
  // Visual template & publication states
  const [layoutTemplate, setLayoutTemplate] = useState('classic-single');
  const [templateImages, setTemplateImages] = useState<any[]>([]);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'scheduled' | 'published'>('draft');
  const [scheduleDate, setScheduleDate] = useState('2026-06-25T12:00:00Z');

  // Autosave detection state
  const [hasAutosave, setHasAutosave] = useState(false);

  useEffect(() => {
    const active = isSupabaseConfigured();
    setIsSupabase(active);

    const fetchRecipe = async () => {
      if (isNew) return;
      try {
        if (active) {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            populateForm(data);
          }
        } else {
          const localRecipes = getSavedRecipes();
          const match = localRecipes.find(r => r.id === id);
          if (match) {
            populateForm({
              title: match.title,
              description: match.description,
              category: match.category,
              cuisine: match.recipeCuisine,
              prep_time: parseInt(match.prepTime) || 15,
              cook_time: parseInt(match.cookTime) || 20,
              calories: match.calories,
              difficulty: match.difficulty,
              cover_image: match.image,
              ingredients: match.ingredients,
              instructions: match.instructions,
              tags: match.tags,
              layout_template: match.layout_template || 'classic-single',
              template_images: match.template_images || [],
              status: match.status || (match.is_published ? 'published' : 'draft'),
              scheduled_for: match.scheduledAt
            });
          } else {
            toast.error('Recipe not found in local shelf.');
            router.push('/admin/recipes');
          }
        }
      } catch (err) {
        console.error('Failed to load recipe details:', err);
        toast.error('Failed to load recipe records.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, isNew]);

  const populateForm = (data: any) => {
    setTitle(data.title || '');
    setDesc(data.description || '');
    setCategory(data.category || 'Dinner');
    setCuisine(data.cuisine || 'Italian');
    setPrepTime(data.prep_time ? `${data.prep_time} mins` : '15 mins');
    setCookTime(data.cook_time ? `${data.cook_time} mins` : '25 mins');
    setCalories(String(data.calories || 350));
    setDifficulty((data.difficulty?.charAt(0).toUpperCase() + data.difficulty?.slice(1)) || 'Easy');
    setCoverImage(data.cover_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800');
    setIngredientsStr(Array.isArray(data.ingredients) ? data.ingredients.join('\n') : '');
    setInstructionsStr(Array.isArray(data.instructions) ? data.instructions.join('\n') : '');
    setTagsStr(Array.isArray(data.tags) ? data.tags.join(', ') : '');
    setLayoutTemplate(data.layout_template || 'classic-single');
    setTemplateImages(data.template_images || []);
    setPublishStatus(data.status || (data.is_published ? 'published' : 'draft'));
    if (data.scheduled_for) setScheduleDate(data.scheduled_for);
  };

  // Detect autosaved progress on mount
  useEffect(() => {
    const key = `savory_autosave_recipe_${id}`;
    const cache = localStorage.getItem(key);
    if (cache) {
      setHasAutosave(true);
    }
  }, [id]);

  // Set autosave periodically
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const payload = {
        title, desc, category, cuisine, prepTime, cookTime, calories, difficulty,
        coverImage, ingredientsStr, instructionsStr, tagsStr, layoutTemplate, templateImages,
        publishStatus, scheduleDate, timestamp: Date.now()
      };
      localStorage.setItem(`savory_autosave_recipe_${id}`, JSON.stringify(payload));
    }, 4000);

    return () => clearInterval(interval);
  }, [
    loading, id, title, desc, category, cuisine, prepTime, cookTime, calories, difficulty,
    coverImage, ingredientsStr, instructionsStr, tagsStr, layoutTemplate, templateImages,
    publishStatus, scheduleDate
  ]);

  const handleRestoreAutosave = () => {
    const key = `savory_autosave_recipe_${id}`;
    const cache = localStorage.getItem(key);
    if (cache) {
      const data = JSON.parse(cache);
      setTitle(data.title);
      setDesc(data.desc);
      setCategory(data.category);
      setCuisine(data.cuisine);
      setPrepTime(data.prepTime);
      setCookTime(data.cookTime);
      setCalories(data.calories);
      setDifficulty(data.difficulty);
      setCoverImage(data.coverImage);
      setIngredientsStr(data.ingredientsStr);
      setInstructionsStr(data.instructionsStr);
      setTagsStr(data.tagsStr);
      setLayoutTemplate(data.layoutTemplate);
      setTemplateImages(data.templateImages);
      setPublishStatus(data.publishStatus);
      setScheduleDate(data.scheduleDate);
      
      setHasAutosave(false);
      toast.success('Restored unsaved autosave draft!');
    }
  };

  const handleDiscardAutosave = () => {
    localStorage.removeItem(`savory_autosave_recipe_${id}`);
    setHasAutosave(false);
    toast.success('Cleared draft cache.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const prepMin = parseInt(prepTime) || 15;
    const cookMin = parseInt(cookTime) || 20;

    const dataPayload = {
      slug,
      title,
      description: desc || 'Delicious homemade recipe blueprint.',
      cover_image: coverImage,
      category,
      cuisine,
      difficulty: difficulty.toLowerCase(),
      prep_time: prepMin,
      cook_time: cookMin,
      servings: 4,
      calories: parseInt(calories) || 300,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      ingredients: ingredientsStr.split('\n').map(i => i.trim()).filter(Boolean),
      instructions: instructionsStr.split('\n').map(i => i.trim()).filter(Boolean),
      chef_secrets: ['Serve warm and garnish dynamically.'],
      pinterest_description: title + ' - a gourmet creation recipe.',
      is_featured: false,
      is_published: publishStatus === 'published',
      published_at: publishStatus === 'published' ? new Date().toISOString() : null,
      scheduled_for: publishStatus === 'scheduled' ? scheduleDate : null,
      status: publishStatus,
      layout_template: layoutTemplate,
      template_images: templateImages
    };

    if (isSupabase) {
      toast.loading(isNew ? 'Creating Recipe...' : 'Saving updates...', { id: 'recipe-save' });
      const res = isNew 
        ? await createRecipeAction(dataPayload)
        : await updateRecipeAction(id, dataPayload);

      if (res.success) {
        toast.success('Pushed successfully to database! 🍳', { id: 'recipe-save' });
        localStorage.removeItem(`savory_autosave_recipe_${id}`);
        router.push('/admin/recipes');
      } else {
        toast.error(res.error || 'Database submission failed.', { id: 'recipe-save' });
        setSaving(false);
      }
    } else {
      const localRecipes = getSavedRecipes();
      const updatedRecipe = {
        id: isNew ? 'custom-r-' + Date.now() : id,
        ...dataPayload,
        recipeCuisine: cuisine,
        prepTime: `${prepMin} mins`,
        cookTime: `${cookMin} mins`,
        image: coverImage,
        author: 'Guest Chef',
        tips: dataPayload.chef_secrets,
        pinterestDescription: dataPayload.pinterest_description,
        totalTime: `PT${cookMin}M`,
        scheduledAt: dataPayload.scheduled_for || undefined,
        publishedAt: dataPayload.published_at || undefined,
      };

      let newList = [];
      if (isNew) {
        newList = [updatedRecipe, ...localRecipes];
      } else {
        newList = localRecipes.map(r => r.id === id ? updatedRecipe : r);
      }

      saveRecipes(newList);
      toast.success(isNew ? 'Added Recipe locally.' : 'Saved updates locally.');
      localStorage.removeItem(`savory_autosave_recipe_${id}`);
      router.push('/admin/recipes');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-mono text-stone-400">
        Loading database records...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-slide-up" id="recipe-editor-root">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b pb-4">
        <Link
          href="/admin/recipes"
          className="group inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-stone-500 hover:text-espresso transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Recipe board index</span>
        </Link>

        <span className="text-[10px] font-mono text-stone-400 uppercase font-bold tracking-widest">
          {isNew ? 'NEW RECIPE FORM' : 'UPDATE RECIPE SHEET'}
        </span>
      </div>

      {/* Recovery alert */}
      {hasAutosave && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-left animate-fade-in">
          <div className="flex items-start gap-2.5 text-xs text-amber-800 leading-normal">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Unsaved draft detected</p>
              <p className="text-amber-700 mt-0.5">We found an unsaved local backup that differs from the active version.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRestoreAutosave}
              className="px-3 py-1.5 bg-[#B35C2E] hover:bg-terracotta text-white rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
            >
              Restore Draft
            </button>
            <button
              onClick={handleDiscardAutosave}
              className="px-3 py-1.5 bg-white border border-amber-300 text-stone-600 hover:border-stone-400 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <form onSubmit={handleSubmit} className="space-y-8 text-left">
        
        {/* Core fields card */}
        <div className="bg-white border border-cream-dark p-6 rounded-2xl space-y-6 shadow-3xs">
          <div className="flex items-center gap-2 border-b pb-3">
            <Utensils className="w-5 h-5 text-terracotta" />
            <h3 className="font-serif font-bold text-lg text-espresso">Recipe Metadata Spec Sheet</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Recipe Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Garlic Herb Roasted Potatoes"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Brief Description</label>
              <textarea
                rows={2}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Brief summary introducing the texture, scent, or flavor details..."
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-cream-dark rounded-xl text-sm"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Desserts">Desserts</option>
                <option value="Quick & Easy">Quick &amp; Easy</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Meal Prep">Meal Prep</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Cuisine Origin</label>
              <input
                type="text"
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
                placeholder="e.g. French, Mediterranean"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Prep Time</label>
              <input
                type="text"
                value={prepTime}
                onChange={e => setPrepTime(e.target.value)}
                placeholder="e.g. 15 mins"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Cook Time</label>
              <input
                type="text"
                value={cookTime}
                onChange={e => setCookTime(e.target.value)}
                placeholder="e.g. 30 mins"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Calories (Kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                placeholder="350"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-cream-dark rounded-xl text-sm"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Spotlight Image URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-xs font-mono text-stone-500 bg-stone-50/50"
              />
            </div>
          </div>
        </div>

        {/* Ingredients & Instructions card */}
        <div className="bg-white border border-cream-dark p-6 rounded-2xl space-y-6 shadow-3xs">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-espresso">Ingredients &amp; Instructions</h3>
            <p className="text-[10px] text-stone-400 font-sans leading-normal">Enter each item/step on a new line.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-605 uppercase tracking-wide">Ingredients Listing (One per line) *</label>
              <textarea
                rows={5}
                required
                value={ingredientsStr}
                onChange={e => setIngredientsStr(e.target.value)}
                placeholder="1 cup arborio rice&#10;3 cups vegetable stock&#10;1/2 cup parmesan cheese"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-xs font-mono leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-605 uppercase tracking-wide">Instructions Steps (One step per line) *</label>
              <textarea
                rows={5}
                required
                value={instructionsStr}
                onChange={e => setInstructionsStr(e.target.value)}
                placeholder="Warm the olive oil in a deep pot and sear garlic for 1 minute.&#10;Stir in the arborio rice coating every grain in oil.&#10;Slowly add warm vegetable stock one cup at a time."
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-xs font-sans leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-605 uppercase tracking-wide">Tags &amp; Keywords (comma-separated)</label>
              <input
                type="text"
                value={tagsStr}
                onChange={e => setTagsStr(e.target.value)}
                placeholder="Dinner, Cheesy, Risotto, Fasting"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Layout Visual Template picker */}
        <div className="bg-white border border-cream-dark p-6 rounded-2xl shadow-3xs">
          <TemplatePicker
            selectedTemplate={layoutTemplate}
            onChangeTemplate={setLayoutTemplate}
            templateImages={templateImages}
            onChangeImages={setTemplateImages}
          />
        </div>

        {/* Schedule & Publication engine */}
        <PublishControl
          currentStatus={publishStatus}
          onChangeStatus={setPublishStatus}
          scheduledFor={publishStatus === 'scheduled' ? scheduleDate : null}
          onChangeScheduledFor={utc => {
            if (utc) setScheduleDate(utc);
          }}
        />

        {/* Submit controls bar */}
        <div className="border-t border-cream-dark pt-6 flex items-center justify-end gap-3">
          <Link
            href="/admin/recipes"
            className="px-5 py-2.5 bg-white border border-cream-dark hover:border-stone-400 text-stone-605 hover:text-espresso rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-espresso hover:bg-terracotta disabled:bg-stone-500 text-cream hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Deploy Blueprint'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
