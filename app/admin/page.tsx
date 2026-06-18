'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  Calendar, 
  Clock, 
  BookOpen, 
  Utensils, 
  FileText, 
  ListOrdered, 
  CheckCircle, 
  ChevronsRight, 
  ExternalLink,
  ChevronRight,
  Send,
  ArrowRight,
  Coffee,
  Heart,
  Tag,
  Eye,
  Settings
} from 'lucide-react';
import TemplatePicker from '@/components/admin/TemplatePicker';
import PublishControl from '@/components/admin/PublishControl';
import { 
  ExtendedBlogPost, 
  ExtendedRecipe, 
  getSavedRecipes, 
  saveRecipes, 
  getSavedBlogs, 
  saveBlogs,
  PRESEEDED_SCHEDULED_RECIPES,
  PRESEEDED_SCHEDULED_BLOGS
} from '@/lib/preseededPool';
import { BLOG_POSTS_DB } from '@/data/blogs';
import { RECIPES_DB } from '@/data/recipes';
import { toast } from 'react-hot-toast';

// Supabase integrations
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { createRecipeAction, deleteRecipeAction, togglePublishRecipeAction } from '@/lib/actions/recipes';
import { createPostAction, deletePostAction, togglePublishPostAction } from '@/lib/actions/posts';
import { signOutAction } from '@/lib/actions/auth';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'scheduler' | 'create-blog' | 'create-recipe' | 'live-deck'>('scheduler');
  
  // Visual structures state
  const [blogLayout, setBlogLayout] = useState('classic-single');
  const [blogTemplateImages, setBlogTemplateImages] = useState<any[]>([]);
  const [blogPublishStatus, setBlogPublishStatus] = useState<'draft' | 'scheduled' | 'published'>('draft');

  const [recipeLayout, setRecipeLayout] = useState('classic-single');
  const [recipeTemplateImages, setRecipeTemplateImages] = useState<any[]>([]);
  const [recipePublishStatus, setRecipePublishStatus] = useState<'draft' | 'scheduled' | 'published'>('draft');

  // Custom states matching local storage
  const [recipesList, setRecipesList] = useState<ExtendedRecipe[]>([]);
  const [blogsList, setBlogsList] = useState<ExtendedBlogPost[]>([]);

  // 1. New Recipe form states
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDesc, setRecipeDesc] = useState('');
  const [recipeCategory, setRecipeCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Desserts' | 'Quick & Easy' | 'Vegetarian' | 'Meal Prep' | 'Drinks'>('Dinner');
  const [recipeCuisine, setRecipeCuisine] = useState('Italian');
  const [recipePrep, setRecipePrep] = useState('15 mins');
  const [recipeCook, setRecipeCook] = useState('25 mins');
  const [recipeCalories, setRecipeCalories] = useState('350');
  const [recipeDifficulty, setRecipeDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [recipeImage, setRecipeImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800');
  const [recipeIngredientsStr, setRecipeIngredientsStr] = useState('1 cup arborio rice\n3 cups vegetable stock\n1/2 cup parmesan cheese\n1 tbsp olive oil\n2 cloves garlic grated');
  const [recipeInstructionsStr, setRecipeInstructionsStr] = useState('Warm the olive oil in a deep pot and sear grated garlic for 1 minute.\nStir in the arborio rice coating every grain in fragrant oils.\nSlowly drip-in vegetable stock one cup at a time stirring occasionally.\nTurn off heat and fold in parmesan cheese before hot serving platter spreads.');
  const [recipeTagsStr, setRecipeTagsStr] = useState('Risotto, Rice, Cheesy, Comfort Food');
  const [recipeScheduleDate, setRecipeScheduleDate] = useState('2026-06-25T12:00:00Z');
  const [recipePublishImmediate, setRecipePublishImmediate] = useState(false);

  // 2. New Blog form states
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogCategory, setBlogCategory] = useState<'Techniques' | 'Ingredient Guides' | 'Kitchen Equipment' | 'Meal Planning'>('Techniques');
  const [blogAuthor, setBlogAuthor] = useState('Master Chef Alexander');
  const [blogReadTime, setBlogReadTime] = useState('5 mins read');
  const [blogStyle, setBlogStyle] = useState<'classic' | 'chemistry' | 'spotlight' | 'bento' | 'showcase'>('classic');
  const [blogImage, setBlogImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800');
  const [blogContentStr, setBlogContentStr] = useState('First core paragraph showing beautiful culinary chemistry or master techniques.\nSecond complementary paragraph discussing hydration levels and crust bubbles.');
  // Sections structure for scrollytelling
  const [sec1Title, setSec1Title] = useState('The Molecular Core');
  const [sec1Text, setSec1Text] = useState('Detailing the amino acids and cellular structures that react under extreme dry heat.');
  const [sec1Quote, setSec1Quote] = useState('Temperature controls flavor density.');
  const [sec1Img, setSec1Img] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800');
  
  const [sec2Title, setSec2Title] = useState('Secondary Proving Stage');
  const [sec2Text, setSec2Text] = useState('Slowing the yeast activity results in heavy lactic fermentation notes.');
  const [sec2Quote, setSec2Quote] = useState('Time is the master ingredient.');
  const [sec2Img, setSec2Img] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800');

  const [blogScheduleDate, setBlogScheduleDate] = useState('2026-06-26T10:00:00Z');
  const [blogPublishImmediate, setBlogPublishImmediate] = useState(false);

  // Connection indicator state
  const [isSupabase, setIsSupabase] = useState(false);

  // Load from Supabase (or LocalStorage as fallback) safely after mounting
  useEffect(() => {
    const active = isSupabaseConfigured();
    setIsSupabase(active);

    if (active) {
      const supabase = createClient();
      const loadSupabaseData = async () => {
        try {
          const [recipesRes, postsRes] = await Promise.all([
            supabase.from('recipes').select('*').order('created_at', { ascending: false }),
            supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
          ]);

          if (recipesRes.data) {
            const mappedRecipes = recipesRes.data.map((r: any) => ({
              id: r.id,
              slug: r.slug,
              title: r.title,
              description: r.description,
              pinterestDescription: r.pinterest_description,
              category: r.category as any,
              prepTime: r.prep_time ? `${r.prep_time} mins` : '15 mins',
              cookTime: r.cook_time ? `${r.cook_time} mins` : '20 mins',
              totalTime: `PT${r.cook_time || 20}M`,
              recipeCuisine: r.cuisine || 'Classic',
              tags: r.tags || [],
              author: 'Master Chef',
              calories: r.calories || 300,
              difficulty: (r.difficulty?.charAt(0).toUpperCase() + r.difficulty?.slice(1)) as any || 'Easy',
              image: r.cover_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
              size: 'medium' as const,
              ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
              instructions: Array.isArray(r.instructions) ? r.instructions : [],
              tips: Array.isArray(r.chef_secrets) ? r.chef_secrets : [],
              scheduledAt: r.published_at || undefined,
              status: r.is_published ? ('published' as const) : ('scheduled' as const)
            }));
            setRecipesList(mappedRecipes);
          } else {
            setRecipesList(getSavedRecipes());
          }

          if (postsRes.data) {
            const mappedBlogs = postsRes.data.map((p: any) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              summary: p.subtitle || p.summary || 'Editorial post',
              category: p.category as any,
              date: p.published_at ? new Date(p.published_at).toLocaleDateString() : 'Draft',
              readTime: p.reading_time_minutes ? `${p.reading_time_minutes} mins read` : '5 mins read',
              image: p.cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=850',
              author: 'Editor',
              content: typeof p.body === 'string' ? p.body.split('\n') : (p.content || []),
              style: 'classic' as const,
              scheduledAt: p.published_at || undefined,
              status: p.is_published ? ('published' as const) : ('scheduled' as const)
            }));
            setBlogsList(mappedBlogs);
          } else {
            setBlogsList(getSavedBlogs());
          }
        } catch (err) {
          console.error('Failed to load live Supabase datasets, loading local backups:', err);
          setRecipesList(getSavedRecipes());
          setBlogsList(getSavedBlogs());
        }
      };

      loadSupabaseData();
    } else {
      setRecipesList(getSavedRecipes());
      setBlogsList(getSavedBlogs());
    }
  }, []);

  // Save changes wrapper
  const updateRecipes = (newList: ExtendedRecipe[]) => {
    setRecipesList(newList);
    saveRecipes(newList);
  };

  const updateBlogs = (newList: ExtendedBlogPost[]) => {
    setBlogsList(newList);
    saveBlogs(newList);
  };

  // Add custom recipe
  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeTitle.trim()) {
      toast.error('Please enter a recipe title.');
      return;
    }

    const uniqueSlug = recipeTitle.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const prepMin = parseInt(recipePrep) || 15;
    const cookMin = parseInt(recipeCook) || 20;

    const newRecipe: ExtendedRecipe = {
      id: 'custom-r-' + Date.now(),
      slug: uniqueSlug,
      title: recipeTitle,
      description: recipeDesc || 'Delicious homemade food blueprint.',
      pinterestDescription: recipeTitle + ' - a gourmet creation recipe.',
      category: recipeCategory,
      prepTime: `${prepMin} mins`,
      cookTime: `${cookMin} mins`,
      totalTime: `PT${cookMin}M`,
      recipeCuisine: recipeCuisine,
      tags: recipeTagsStr.split(',').map(t => t.trim()).filter(Boolean),
      author: 'Author Guest Chef',
      calories: parseInt(recipeCalories) || 300,
      difficulty: recipeDifficulty,
      image: recipeImage,
      size: 'medium',
      ingredients: recipeIngredientsStr.split('\n').map(i => i.trim()).filter(Boolean),
      instructions: recipeInstructionsStr.split('\n').map(i => i.trim()).filter(Boolean),
      tips: ['Serve immediately while piping hot for beautiful presentation.'],
      scheduledAt: recipePublishStatus === 'scheduled' ? recipeScheduleDate : undefined,
      status: recipePublishStatus === 'draft' ? undefined : recipePublishStatus as any,
      publishedAt: recipePublishStatus === 'published' ? new Date().toISOString() : recipeScheduleDate,
      layout_template: recipeLayout,
      template_images: recipeTemplateImages
    };

    if (isSupabase) {
      toast.loading('Saving recipe Formula to Supabase...', { id: 'db-save' });
      const dbData = {
        slug: uniqueSlug,
        title: recipeTitle,
        description: recipeDesc || 'Delicious homemade food blueprint.',
        cover_image: recipeImage,
        category: recipeCategory,
        cuisine: recipeCuisine,
        difficulty: recipeDifficulty.toLowerCase(),
        prep_time: prepMin,
        cook_time: cookMin,
        servings: 4,
        calories: parseInt(recipeCalories) || 300,
        tags: newRecipe.tags,
        ingredients: newRecipe.ingredients,
        instructions: newRecipe.instructions,
        chef_secrets: newRecipe.tips,
        pinterest_description: newRecipe.pinterestDescription,
        is_featured: false,
        is_published: recipePublishStatus === 'published',
        published_at: recipePublishStatus === 'published' ? new Date().toISOString() : null,
        scheduled_for: recipePublishStatus === 'scheduled' ? recipeScheduleDate : null,
        status: recipePublishStatus,
        layout_template: recipeLayout,
        template_images: recipeTemplateImages
      };

      const res = await createRecipeAction(dbData);
      if (res.success) {
        toast.success('Successfully added Recipe to Supabase! 🥐', { id: 'db-save' });
        const addedRecipe = { ...newRecipe, id: res.data?.id || newRecipe.id };
        setRecipesList(prev => [addedRecipe, ...prev]);
        setRecipeTitle('');
        setRecipeDesc('');
        setActiveTab('scheduler');
      } else {
        toast.error(res.error || 'Failed to save to Supabase', { id: 'db-save' });
      }
    } else {
      const updated = [newRecipe, ...recipesList];
      updateRecipes(updated);
      toast.success('Successfully added Recipe to the Content Shelf! 🥐');
      setRecipeTitle('');
      setRecipeDesc('');
      setActiveTab('scheduler');
    }
  };

  // Add custom styled blog
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) {
      toast.error('Please enter a blog post title.');
      return;
    }

    const uniqueSlug = blogTitle.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const formattedSections = [
      {
        id: 'sec1-' + Date.now(),
        title: sec1Title,
        text: sec1Text,
        pullquote: sec1Quote || undefined,
        image: sec1Img || undefined,
        imageCaption: 'Macro Laboratory Frame 01',
        headingType: 'h2' as const
      },
      {
        id: 'sec2-' + Date.now(),
        title: sec2Title,
        text: sec2Text,
        pullquote: sec2Quote || undefined,
        image: sec2Img || undefined,
        imageCaption: 'Proving Ferment Frame 02',
        headingType: 'h2' as const
      }
    ];

    const newBlog: ExtendedBlogPost = {
      id: 'custom-b-' + Date.now(),
      slug: uniqueSlug,
      title: blogTitle,
      summary: blogSummary || 'Savory Kitchen investigative culinary writing.',
      category: blogCategory,
      date: blogPublishStatus === 'published' ? 'Today' : new Date(blogScheduleDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: blogReadTime,
      image: blogImage,
      author: blogAuthor,
      content: blogContentStr.split('\n').map(c => c.trim()).filter(Boolean),
      sections: formattedSections,
      style: blogStyle,
      scheduledAt: blogPublishStatus === 'scheduled' ? blogScheduleDate : undefined,
      status: blogPublishStatus === 'draft' ? undefined : blogPublishStatus as any,
      layout_template: blogLayout,
      template_images: blogTemplateImages
    };

    if (isSupabase) {
      toast.loading('Saving editorial Post to Supabase...', { id: 'db-save-b' });
      const dbData = {
        slug: uniqueSlug,
        title: blogTitle,
        subtitle: blogSummary,
        cover_image: blogImage,
        body: blogContentStr,
        category: blogCategory,
        tags: blogTitle.split(' ').slice(0, 3).map(w => w.replace(/\W/g, '')),
        reading_time_minutes: parseInt(blogReadTime) || 5,
        is_published: blogPublishStatus === 'published',
        published_at: blogPublishStatus === 'published' ? new Date().toISOString() : null,
        scheduled_for: blogPublishStatus === 'scheduled' ? blogScheduleDate : null,
        status: blogPublishStatus,
        layout_template: blogLayout,
        template_images: blogTemplateImages
      };

      const res = await createPostAction(dbData);
      if (res.success) {
        toast.success(`Successfully spawned ${blogStyle} Styled Blog Post to Supabase! 📝`, { id: 'db-save-b' });
        const addedBlog = { ...newBlog, id: res.data?.id || newBlog.id };
        setBlogsList(prev => [addedBlog, ...prev]);
        setBlogTitle('');
        setBlogSummary('');
        setActiveTab('scheduler');
      } else {
        toast.error(res.error || 'Failed to save to Supabase', { id: 'db-save-b' });
      }
    } else {
      const updated = [newBlog, ...blogsList];
      updateBlogs(updated);
      toast.success(`Successfully spawned ${blogStyle} Styled Blog Post to the Shelf! 📝`);
      setBlogTitle('');
      setBlogSummary('');
      setActiveTab('scheduler');
    }
  };

  // Immediate publication conversion
  const publishImmediately = async (id: string, type: 'recipe' | 'blog') => {
    if (isSupabase) {
      toast.loading('Updating publication status...', { id: 'pub-now' });
      if (type === 'recipe') {
        const res = await togglePublishRecipeAction(id, true);
        if (res.success) {
          setRecipesList(prev => prev.map(r => r.id === id ? { ...r, status: 'published', publishedAt: new Date().toISOString() } : r));
          toast.success('Recipe published live in Supabase!', { id: 'pub-now' });
        } else {
          toast.error(res.error || 'Failed to update recipe', { id: 'pub-now' });
        }
      } else {
        const res = await togglePublishPostAction(id, true);
        if (res.success) {
          setBlogsList(prev => prev.map(b => b.id === id ? { ...b, status: 'published' } : b));
          toast.success('Journal published live in Supabase!', { id: 'pub-now' });
        } else {
          toast.error(res.error || 'Failed to update blog post', { id: 'pub-now' });
        }
      }
    } else {
      if (type === 'recipe') {
        const updated = recipesList.map(r => {
          if (r.id === id) {
            return { ...r, status: 'published' as const, scheduledAt: undefined, publishedAt: new Date().toISOString() };
          }
          return r;
        });
        updateRecipes(updated);
        toast.success('Recipe converted to immediate live release! 🔔');
      } else {
        const updated = blogsList.map(b => {
          if (b.id === id) {
            return { ...b, status: 'published' as const, scheduledAt: undefined, date: 'Traditional Release' };
          }
          return b;
        });
        updateBlogs(updated);
        toast.success('Journal released to immediate live feeds! 📰');
      }
    }
  };

  // Delete element
  const deleteElement = async (id: string, type: 'recipe' | 'blog') => {
    if (isSupabase) {
      toast.loading('Removing entry from database...', { id: 'del-now' });
      if (type === 'recipe') {
        const res = await deleteRecipeAction(id);
        if (res.success) {
          setRecipesList(prev => prev.filter(r => r.id !== id));
          toast.success('Removed Recipe from Supabase.', { id: 'del-now' });
        } else {
          toast.error(res.error || 'Failed to delete', { id: 'del-now' });
        }
      } else {
        const res = await deletePostAction(id);
        if (res.success) {
          setBlogsList(prev => prev.filter(b => b.id !== id));
          toast.success('Removed Blog post from Supabase.', { id: 'del-now' });
        } else {
          toast.error(res.error || 'Failed to delete', { id: 'del-now' });
        }
      }
    } else {
      if (type === 'recipe') {
        const updated = recipesList.filter(r => r.id !== id);
        updateRecipes(updated);
        toast.success('Removed Recipe from scheduling boards.');
      } else {
        const updated = blogsList.filter(b => b.id !== id);
        updateBlogs(updated);
        toast.success('Removed Blog draft from lists.');
      }
    }
  };

  // Restore seeded lists
  const handleResetToPreseeded = () => {
    if (confirm('Are you sure you want to reset and restore the 10 pre-scheduled Recipes and 10 pre-scheduled Blogs? This will replace your current list.')) {
      localStorage.setItem('savory_custom_recipes', JSON.stringify(PRESEEDED_SCHEDULED_RECIPES));
      localStorage.setItem('savory_custom_blogs', JSON.stringify(PRESEEDED_SCHEDULED_BLOGS));
      setRecipesList(PRESEEDED_SCHEDULED_RECIPES);
      setBlogsList(PRESEEDED_SCHEDULED_BLOGS);
      toast.success('Successfully restored the 10 Recipe + 10 Blog scheduled queues! 🚀');
    }
  };

  const scheduledRecipes = recipesList.filter(r => r.status === 'scheduled');
  const scheduledBlogs = blogsList.filter(b => b.status === 'scheduled');
  const liveRecipes = recipesList.filter(r => r.status === 'published');
  const liveBlogs = blogsList.filter(b => b.status === 'published');

  return (
    <div className="w-full min-h-screen bg-stone-50 text-espresso py-12 px-6 font-sans select-none animate-fade-in" id="admin-workspace-page">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Masthead Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-200 pb-8 gap-6" id="admin-masthead-section">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-terracotta font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Settings className="w-4 h-4 animate-spin-slow" />
              <span>SAVORY GAZETTE CENTRAL DESK</span>
            </div>
            <h1 className="font-serif font-extrabold text-4xl tracking-tight text-espresso">
              Content Planner &amp; Stylist
            </h1>
            <p className="text-stone-500 text-sm max-w-2xl leading-relaxed">
              Design and balance visual gastrology reports. Schedule upcoming recipe spreadsheets, toggle publication logs, or orchestrate high-concept bento design grids.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${
                isSupabase 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                  : 'bg-[#B35C2E]/10 text-terracotta border-orange-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                {isSupabase ? 'SUPABASE SECURE LIVE STORAGE' : 'LOCAL OFFLINE DEVELOPMENT MODE'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetToPreseeded}
              className="px-4 py-2 text-[11px] border border-[#B35C2E]/20 text-terracotta hover:bg-[#B35C2E]/5 font-mono font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
              id="admin-reset-preseeded-btn"
            >
              🔄 Restore 20 Seeded
            </button>
            <button 
              onClick={() => {
                signOutAction();
              }}
              className="px-4 py-2 text-[11px] bg-stone-900 border border-stone-850 text-[#E6D5C3] font-mono hover:bg-stone-800 font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Dynamic Tab Selector Tabs */}
        <div className="flex border-b border-stone-150 overflow-x-auto pb-px scrollbar-none" id="admin-tab-controls-container">
          {[
            { id: 'scheduler', name: '🗓️ Scheduler Queue (' + (scheduledRecipes.length + scheduledBlogs.length) + ')', icon: Calendar },
            { id: 'create-blog', name: '✍️ Create Styled Blog Post', icon: FileText },
            { id: 'create-recipe', name: '🍳 Create Recipe formula', icon: Utensils },
            { id: 'live-deck', name: '⚡ Live Content Shelf', icon: CheckCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive 
                    ? 'border-terracotta text-terracotta bg-stone-50/50' 
                    : 'border-transparent text-stone-550 hover:text-espresso hover:border-stone-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* TAB WORKSPACES */}
        <main className="min-h-[400px]">

          {/* TAB 1: SCHEDULER QUEUE */}
          {activeTab === 'scheduler' && (
            <div className="space-y-8" id="scheduler-tab-workspace">
              
              <div className="p-6 bg-white border border-[#EAE3D4] rounded-3xl space-y-3 shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1.5 flex-1 text-left">
                  <span className="text-[10px] font-mono text-sage font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-honey" /> Visual Calendaring &amp; release channels
                  </span>
                  <p className="text-stone-650 text-xs max-w-2xl leading-relaxed">
                    Map layout templates, align Pinterest imagery, and trigger auto-publish scripts. These publications release automatically on schedule clock hits!
                  </p>
                </div>
                <Link
                  href="/admin/schedule"
                  className="px-4 py-2.5 bg-[#1F1E1B] hover:bg-terracotta text-[#FCFAF7] hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-3xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Open Editorial Release Calendar</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Scheduled Recipes */}
                <section className="space-y-4" id="scheduled-recipes-column">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-serif font-bold text-xl text-espresso flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-terracotta" /> Upstream Recipes
                    </h3>
                    <span className="font-mono text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-bold">
                      {scheduledRecipes.length} SCHEDULED
                    </span>
                  </div>

                  {scheduledRecipes.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-stone-200 rounded-2xl text-center text-sm font-mono text-stone-400">
                      No recipes scheduled. Create one above!
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                      {scheduledRecipes.map((item) => (
                        <div key={item.id} className="p-4 bg-white border border-stone-200 rounded-2xl hover:shadow-xs transition flex gap-3 flex-col sm:flex-row justify-between justify-items-start">
                          <div className="flex gap-3">
                            {item.image && (
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border bg-stone-100">
                                <Image src={item.image} alt={item.title} fill className="object-cover" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            <div className="space-y-1">
                              <h4 className="text-sm font-serif font-extrabold text-espresso line-clamp-1">{item.title}</h4>
                              <p className="text-[11px] text-stone-405 font-mono flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#B35C2E]" /> {new Date(item.scheduledAt || item.publishedAt || '').toLocaleDateString()}
                              </p>
                              <div className="flex gap-1.5 flex-wrap">
                                <span className="inline-block px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase rounded bg-sky-50 text-sky-600 border border-sky-100">
                                  {item.recipeCuisine || 'Cuisine'}
                                </span>
                                <span className="inline-block px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase rounded bg-stone-100 text-stone-600">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:self-center shrink-0">
                            <button
                              onClick={() => publishImmediately(item.id, 'recipe')}
                              className="px-2.5 py-1.5 bg-espresso text-cream hover:bg-terracotta text-[9px] font-mono font-bold uppercase tracking-wider rounded-lg transition shrink-0"
                            >
                              Release Now
                            </button>
                            <button
                              onClick={() => deleteElement(item.id, 'recipe')}
                              className="p-1.5 hover:text-red-600 hover:bg-red-50 text-stone-400 rounded-lg transition"
                              title="Delete Scheduled Draft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/recipes/${item.slug}`}
                              className="p-1.5 hover:text-terracotta hover:bg-stone-50 text-stone-400 rounded-lg transition"
                              title="Preview Article Layout"
                              target="_blank"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Scheduled Blogs */}
                <section className="space-y-4" id="scheduled-blogs-column">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-serif font-bold text-xl text-espresso flex items-center gap-2">
                      <FileText className="w-5 h-5 text-terracotta" /> Upstream Journals
                    </h3>
                    <span className="font-mono text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-bold">
                      {scheduledBlogs.length} SCHEDULED
                    </span>
                  </div>

                  {scheduledBlogs.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-stone-200 rounded-2xl text-center text-sm font-mono text-stone-400">
                      No journals scheduled. Write one above!
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                      {scheduledBlogs.map((item) => (
                        <div key={item.id} className="p-4 bg-white border border-stone-200 rounded-2xl hover:shadow-xs transition flex gap-3 flex-col sm:flex-row justify-between justify-items-start">
                          <div className="flex gap-3">
                            {item.image && (
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border bg-stone-100">
                                <Image src={item.image} alt={item.title} fill className="object-cover" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            <div className="space-y-1 bg-stone-0">
                              <h4 className="text-sm font-serif font-extrabold text-espresso line-clamp-1">{item.title}</h4>
                              <p className="text-[11px] text-stone-405 font-mono flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#B35C2E]" /> {new Date(item.scheduledAt || '').toLocaleDateString()}
                              </p>
                              <div className="flex gap-1.5 flex-wrap">
                                <span className="inline-block px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  {item.style?.toUpperCase() || 'CLASSIC'} LAYOUT
                                </span>
                                <span className="inline-block px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase rounded bg-stone-100 text-stone-600">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:self-center shrink-0">
                            <button
                              onClick={() => publishImmediately(item.id, 'blog')}
                              className="px-2.5 py-1.5 bg-espresso text-cream hover:bg-terracotta text-[9px] font-mono font-bold uppercase tracking-wider rounded-lg transition shrink-0"
                            >
                              Release Now
                            </button>
                            <button
                              onClick={() => deleteElement(item.id, 'blog')}
                              className="p-1.5 hover:text-red-600 hover:bg-red-50 text-stone-400 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/blog/${item.slug}`}
                              className="p-1.5 hover:text-terracotta hover:bg-stone-50 text-stone-400 rounded-lg transition"
                              title="Preview Article Layout"
                              target="_blank"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              </div>
            </div>
          )}

          {/* TAB 2: CREATE JOURNAL */}
          {activeTab === 'create-blog' && (
            <div className="max-w-4xl mx-auto bg-[#FCFAF7] border border-stone-200 p-8 rounded-[2rem] space-y-6" id="create-blog-form-root">
              <div className="space-y-1 pb-4 border-b">
                <span className="font-mono text-[9px] text-terracotta font-bold uppercase tracking-widest block">JOURNAL SPARKER</span>
                <h3 className="font-serif font-bold text-2xl text-espresso">Draft dynamic Editorial Columns</h3>
                <p className="text-stone-500 text-xs">Select from 5 structural visual layouts to dress the post content differently.</p>
              </div>

              <form onSubmit={handleCreateBlog} className="grid grid-cols-1 md:grid-cols-2 gap-6" id="create-blog-form">
                
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">POST TITLE *</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={e => setBlogTitle(e.target.value)}
                    placeholder="e.g., Cultivating Lactate: The Sourdough Microbiology Lab"
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">EDITORIAL TYPE LAYOUT STYLE *</label>
                  <select
                    value={blogStyle}
                    onChange={e => setBlogStyle(e.target.value as any)}
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm font-mono"
                  >
                    <option value="classic">Traditional Gazette (Classic columns)</option>
                    <option value="chemistry">Culinary Chemistry (Scientific data ledger)</option>
                    <option value="spotlight">Spotlight Q&A (Interview Dialogue logs)</option>
                    <option value="bento">Bento Grid (Dynamic multi-frame cards)</option>
                    <option value="showcase">Visual Showcase (Wide block banners)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">CATEGORY *</label>
                  <select
                    value={blogCategory}
                    onChange={e => setBlogCategory(e.target.value as any)}
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm"
                  >
                    <option value="Techniques">Techniques</option>
                    <option value="Ingredient Guides">Ingredient Guides</option>
                    <option value="Kitchen Equipment">Kitchen Equipment</option>
                    <option value="Meal Planning">Meal Planning</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">AUTHOR CREDITS</label>
                  <input
                    type="text"
                    value={blogAuthor}
                    onChange={e => setBlogAuthor(e.target.value)}
                    placeholder="e.g., Agnes Meriot"
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">READESTIMATES</label>
                  <input
                    type="text"
                    value={blogReadTime}
                    onChange={e => setBlogReadTime(e.target.value)}
                    placeholder="e.g., 5 mins read"
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">COVER SPOTLIGHT IMAGE URL</label>
                  <input
                    type="text"
                    value={blogImage}
                    onChange={e => setBlogImage(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm text-stone-600 font-mono"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">SUMMARY SUMMARY LEADING IN (SERIF ITALIC)</label>
                  <textarea
                    rows={2}
                    value={blogSummary}
                    onChange={e => setBlogSummary(e.target.value)}
                    placeholder="Provide a quick editorial lead sentence summarizing the scientific inquiry..."
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600 font-bold uppercase">// Main Article Paragraph Paragraphs (one per line) *</label>
                  <textarea
                    rows={3}
                    required
                    value={blogContentStr}
                    onChange={e => setBlogContentStr(e.target.value)}
                    placeholder="Type the paragraphs here..."
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-xs font-sans leading-relaxed"
                  />
                </div>

                {/* Scrolly Sections configuration */}
                <div className="md:col-span-2 border-t pt-4 mt-2 space-y-4">
                  <div className="flex items-center gap-1">
                    <ListOrdered className="w-4 h-4 text-terracotta" />
                    <span className="text-xs font-mono font-extrabold uppercase text-espresso">SCROLLYTELLING COMPONENT LAYOUT SPECS (2 SECTIONS)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 border rounded-2xl">
                    <div className="space-y-3">
                      <span className="text-xs font-mono font-bold text-sage block border-b pb-1">📚 FRAME 1</span>
                      <input type="text" value={sec1Title} onChange={e => setSec1Title(e.target.value)} placeholder="Title" className="w-full p-2.5 border text-xs rounded-lg" />
                      <textarea rows={2} value={sec1Text} onChange={e => setSec1Text(e.target.value)} placeholder="Explain the molecular behavior..." className="w-full p-2.5 border text-xs rounded-lg" />
                      <input type="text" value={sec1Quote} onChange={e => setSec1Quote(e.target.value)} placeholder="Pullquote" className="w-full p-2.5 border text-xs rounded-lg font-serif italic" />
                      <input type="text" value={sec1Img} onChange={e => setSec1Img(e.target.value)} placeholder="Image URL" className="w-full p-2.5 border text-[10px] rounded-lg font-mono text-stone-400" />
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-mono font-bold text-sage block border-b pb-1">📚 FRAME 2</span>
                      <input type="text" value={sec2Title} onChange={e => setSec2Title(e.target.value)} placeholder="Title" className="w-full p-2.5 border text-xs rounded-lg" />
                      <textarea rows={2} value={sec2Text} onChange={e => setSec2Text(e.target.value)} placeholder="Explain the fermentation levels..." className="w-full p-2.5 border text-xs rounded-lg" />
                      <input type="text" value={sec2Quote} onChange={e => setSec2Quote(e.target.value)} placeholder="Pullquote" className="w-full p-2.5 border text-xs rounded-lg font-serif italic" />
                      <input type="text" value={sec2Img} onChange={e => setSec2Img(e.target.value)} placeholder="Image URL" className="w-full p-2.5 border text-[10px] rounded-lg font-mono text-stone-400" />
                    </div>
                  </div>
                </div>

                {/* Premium Layout Template Selection */}
                <div className="md:col-span-2 border-t border-cream-dark pt-5">
                  <TemplatePicker
                    selectedTemplate={blogLayout}
                    onChangeTemplate={setBlogLayout}
                    templateImages={blogTemplateImages}
                    onChangeImages={setBlogTemplateImages}
                  />
                </div>

                {/* Premium Release Planner Controls */}
                <div className="md:col-span-2">
                  <PublishControl
                    currentStatus={blogPublishStatus}
                    onChangeStatus={setBlogPublishStatus}
                    scheduledFor={blogScheduleDate}
                    onChangeScheduledFor={(utc) => {
                      if (utc) setBlogScheduleDate(utc);
                    }}
                  />
                </div>

                <div className="md:col-span-2 border-t pt-5 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1F1E1B] hover:bg-terracotta text-cream hover:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-3xs transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Sprout Styled Draft Post
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 3: CREATE RECIPE */}
          {activeTab === 'create-recipe' && (
            <div className="max-w-4xl mx-auto bg-[#FCFAF7] border border-stone-200 p-8 rounded-[2rem] space-y-6" id="create-recipe-form-root">
              <div className="space-y-1 pb-4 border-b">
                <span className="font-mono text-[9px] text-terracotta font-bold uppercase tracking-widest block font-bold">KITCHEN FACTORY</span>
                <h3 className="font-serif font-bold text-2xl text-espresso">Deploy structured Recipe Sheets</h3>
                <p className="text-stone-500 text-xs">Enter systematic ingredients and instructions, supporting metric conversion tags.</p>
              </div>

              <form onSubmit={handleCreateRecipe} className="grid grid-cols-1 md:grid-cols-2 gap-6" id="create-recipe-form">
                
                <div className="md:col-span-2 space-y-1.5 border-0">
                  <label className="text-xs font-mono font-bold text-stone-605">RECIPE TITLE *</label>
                  <input
                    type="text"
                    required
                    value={recipeTitle}
                    onChange={e => setRecipeTitle(e.target.value)}
                    placeholder="e.g., Cast Iron Searing Ribeye with Garlic Confit butter"
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-605">CATEGORY SEED *</label>
                  <select
                    value={recipeCategory}
                    onChange={e => setRecipeCategory(e.target.value as any)}
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm"
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

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-605">CUISINE ORIGIN *</label>
                  <select
                    value={recipeCuisine}
                    onChange={e => setRecipeCuisine(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-sm font-mono"
                  >
                    <option value="French">French</option>
                    <option value="Italian">Italian</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Indian">Indian</option>
                    <option value="Asian">Asian / Fusion</option>
                    <option value="American">American</option>
                    <option value="Nordic">Nordic</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">PREP SPEED LIMIT</label>
                  <input type="text" value={recipePrep} onChange={e => setRecipePrep(e.target.value)} placeholder="e.g., 20 mins" className="w-full p-3 border rounded-xl text-sm" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">COOK DURATION</label>
                  <input type="text" value={recipeCook} onChange={e => setRecipeCook(e.target.value)} placeholder="e.g., PT30M" className="w-full p-3 border rounded-xl text-sm" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">TOTAL ENERGY CALORIES (Kcal)</label>
                  <input type="number" value={recipeCalories} onChange={e => setRecipeCalories(e.target.value)} className="w-full p-3 border rounded-xl text-sm" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">DIFFICULTY RANK *</label>
                  <select
                    value={recipeDifficulty}
                    onChange={e => setRecipeDifficulty(e.target.value as any)}
                    className="w-full p-3 border rounded-xl text-sm font-mono"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600">PINTEREST RESOLUTION IMAGE URL</label>
                  <input type="text" value={recipeImage} onChange={e => setRecipeImage(e.target.value)} className="w-full p-3 border rounded-xl text-[11px] font-mono text-stone-500" />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600 font-bold uppercase">// Ingredients listing (one ingredient per line) *</label>
                  <p className="text-[10px] text-stone-400 font-mono -mt-1 leading-normal">Tip: Formulate values like &ldquo;1 cup flour&rdquo; or &ldquo;12 oz steak&rdquo; to trigger automatic metric custom sizers on detail pages!</p>
                  <textarea
                    rows={3}
                    required
                    value={recipeIngredientsStr}
                    onChange={e => setRecipeIngredientsStr(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600 font-bold uppercase">// Cooking steps instructions (one step per line) *</label>
                  <textarea
                    rows={3}
                    required
                    value={recipeInstructionsStr}
                    onChange={e => setRecipeInstructionsStr(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 bg-white rounded-xl text-xs font-sans leading-relaxed"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-stone-600 uppercase">Tags &amp; Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={recipeTagsStr}
                    onChange={e => setRecipeTagsStr(e.target.value)}
                    placeholder="Vegan, Gluten-Free, Dinner, Ribeye, Fasting"
                    className="w-full p-3 border rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Premium Layout Template Selection */}
                <div className="md:col-span-2 border-t border-cream-dark pt-5">
                  <TemplatePicker
                    selectedTemplate={recipeLayout}
                    onChangeTemplate={setRecipeLayout}
                    templateImages={recipeTemplateImages}
                    onChangeImages={setRecipeTemplateImages}
                  />
                </div>

                {/* Premium Release Planner Controls */}
                <div className="md:col-span-2">
                  <PublishControl
                    currentStatus={recipePublishStatus}
                    onChangeStatus={setRecipePublishStatus}
                    scheduledFor={recipeScheduleDate}
                    onChangeScheduledFor={(utc) => {
                      if (utc) setRecipeScheduleDate(utc);
                    }}
                  />
                </div>

                <div className="md:col-span-2 border-t pt-5 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1F1E1B] hover:bg-terracotta text-cream hover:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-3xs transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Sprout Recipe Sheet
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 4: LIVE CONTENT DECK */}
          {activeTab === 'live-deck' && (
            <div className="space-y-8" id="live-deck-tab-workspace">
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-2xl text-espresso flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-sage" /> Live Release Board
                  </h3>
                  <p className="text-stone-505 text-sm">Review content items currently active in public directory interfaces.</p>
                </div>
                <div className="flex gap-4 font-mono text-xs">
                  <span className="p-2 border rounded-xl bg-stone-50"><span className="font-bold">{liveRecipes.length}</span> Active Recipes</span>
                  <span className="p-2 border rounded-xl bg-stone-50"><span className="font-bold">{liveBlogs.length}</span> Active Blogs</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Active Recipes list */}
                <div className="space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-stone-500 tracking-wider">🟢 LATEST ACTIVE LIVE RECIPES</h4>
                  {liveRecipes.length === 0 ? (
                    <div className="p-10 text-center border-2 border-dashed rounded-2xl text-xs text-stone-400 font-mono">
                      No live custom recipes created yet. Launch one from the Recipe tab!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {liveRecipes.map(r => (
                        <div key={r.id} className="p-4 border bg-white rounded-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <h5 className="text-sm font-bold text-espresso font-serif">{r.title}</h5>
                            <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-600">{r.category}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Link href={`/recipes/${r.slug}`} target="_blank" className="p-2 hover:bg-stone-50 text-stone-400 hover:text-terracotta rounded-lg">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button onClick={() => deleteElement(r.id, 'recipe')} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Blogs list */}
                <div className="space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-stone-500 tracking-wider">🟢 LATEST ACTIVE LIVE ARTICLES</h4>
                  {liveBlogs.length === 0 ? (
                    <div className="p-10 text-center border-2 border-dashed rounded-2xl text-xs text-stone-400 font-mono">
                      No live custom articles created yet. Spawn one from the write-up tab!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {liveBlogs.map(b => (
                        <div key={b.id} className="p-4 border bg-white rounded-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <h5 className="text-sm font-bold text-espresso font-serif">{b.title}</h5>
                            <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">{b.style?.toUpperCase() || 'CLASSIC'} LAYOUT</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Link href={`/blog/${b.slug}`} target="_blank" className="p-2 hover:bg-stone-50 text-stone-400 hover:text-terracotta rounded-lg">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button onClick={() => deleteElement(b.id, 'blog')} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
