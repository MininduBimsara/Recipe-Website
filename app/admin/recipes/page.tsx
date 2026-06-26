'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Utensils, 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  Edit2, 
  RefreshCw,
  Link2,
  X
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { deleteRecipeAction, togglePublishRecipeAction, updateRecipeSocialsAction, bulkTogglePublishRecipesAction } from '@/lib/actions/recipes';
import { getSavedRecipes, saveRecipes } from '@/lib/preseededPool';
import { toast } from 'react-hot-toast';

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isSupabase, setIsSupabase] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Social Links Modal State
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<any>(null);
  const [pinterestUrl, setPinterestUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isSavingSocials, setIsSavingSocials] = useState(false);

  const loadRecipes = async () => {
    setLoading(true);
    const active = isSupabaseConfigured();
    setIsSupabase(active);

    try {
      if (active) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false });

        if (data) {
          setRecipes(data.map((r: any) => ({
            id: r.id,
            slug: r.slug,
            title: r.title,
            category: r.category,
            difficulty: r.difficulty || 'Easy',
            cuisine: r.cuisine || 'Classic',
            image: r.cover_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
            is_published: !!r.is_published,
            status: r.status || (r.is_published ? 'published' : 'draft'),
            created_at: r.created_at,
            pinterest_url: r.pinterest_url || '',
            instagram_url: r.instagram_url || ''
          })));
        }
      } else {
        setRecipes(getSavedRecipes());
      }
    } catch (err) {
      console.error('Failed to load recipes:', err);
      toast.error('Error fetching recipe database index.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleTogglePublish = async (id: string, currentPublishedState: boolean) => {
    const targetState = !currentPublishedState;
    
    if (isSupabase) {
      toast.loading('Saving publication state...', { id: 'recipe-pub' });
      const res = await togglePublishRecipeAction(id, targetState);
      if (res.success) {
        toast.success(targetState ? 'Recipe went live! 🍳' : 'Recipe reverted to draft.', { id: 'recipe-pub' });
        setRecipes(prev => prev.map(r => r.id === id ? { ...r, is_published: targetState, status: targetState ? 'published' : 'draft' } : r));
      } else {
        toast.error(res.error || 'State toggle failed.', { id: 'recipe-pub' });
      }
    } else {
      const updated = recipes.map(r => r.id === id ? { ...r, is_published: targetState, status: targetState ? 'published' : 'draft' } : r);
      setRecipes(updated);
      saveRecipes(updated);
      toast.success(targetState ? 'Recipe published locally.' : 'Reverted to local draft.');
    }
  };

  const handleBulkTogglePublish = async (targetState: boolean) => {
    if (selectedIds.length === 0) return;
    
    if (isSupabase) {
      toast.loading('Applying bulk publication state...', { id: 'bulk-pub' });
      const res = await bulkTogglePublishRecipesAction(selectedIds, targetState);
      if (res.success) {
        toast.success(`Successfully ${targetState ? 'published' : 'unpublished'} ${selectedIds.length} recipes.`, { id: 'bulk-pub' });
        setRecipes(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, is_published: targetState, status: targetState ? 'published' : 'draft' } : r));
      } else {
        toast.error(res.error || 'Bulk state toggle failed.', { id: 'bulk-pub' });
      }
    } else {
      const updated = recipes.map(r => selectedIds.includes(r.id) ? { ...r, is_published: targetState, status: targetState ? 'published' : 'draft' } : r);
      setRecipes(updated);
      saveRecipes(updated);
      toast.success(`Bulk updated ${selectedIds.length} recipes locally.`);
    }
    setSelectedIds([]);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    if (isSupabase) {
      toast.loading('Deleting entry...', { id: 'recipe-del' });
      const res = await deleteRecipeAction(id);
      if (res.success) {
        toast.success('Successfully removed Recipe.', { id: 'recipe-del' });
        setRecipes(prev => prev.filter(r => r.id !== id));
      } else {
        toast.error(res.error || 'Delete request failed.', { id: 'recipe-del' });
      }
    } else {
      const updated = recipes.filter(r => r.id !== id);
      setRecipes(updated);
      saveRecipes(updated);
      toast.success('Removed Recipe from offline shelf.');
    }
  };

  const handleSaveSocials = async () => {
    if (!activeRecipe) return;
    setIsSavingSocials(true);
    
    if (isSupabase) {
      toast.loading('Saving social links...', { id: 'save-socials' });
      const res = await updateRecipeSocialsAction(activeRecipe.id, {
        pinterest_url: pinterestUrl,
        instagram_url: instagramUrl
      });
      if (res.success) {
        toast.success('Social links saved.', { id: 'save-socials' });
        setRecipes(prev => prev.map(r => r.id === activeRecipe.id ? { ...r, pinterest_url: pinterestUrl, instagram_url: instagramUrl } : r));
        setSocialModalOpen(false);
      } else {
        toast.error(res.error || 'Failed to save socials.', { id: 'save-socials' });
      }
    } else {
      const updated = recipes.map(r => r.id === activeRecipe.id ? { ...r, pinterest_url: pinterestUrl, instagram_url: instagramUrl } : r);
      setRecipes(updated);
      saveRecipes(updated);
      toast.success('Social links saved locally.');
      setSocialModalOpen(false);
    }
    setIsSavingSocials(false);
  };

  // Filter logic
  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === '' || r.category === categoryFilter;
    const matchesStatus = statusFilter === '' || r.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-slide-up" id="admin-recipes-index">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-dark pb-5">
        <div className="text-left">
          <h2 className="font-serif font-black text-2xl text-espresso flex items-center gap-2">
            <Utensils className="w-6 h-6 text-terracotta" /> Recipe Index Board
          </h2>
          <p className="text-xs text-stone-500">Create, search, filter, and quick-publish your visual culinary blueprints.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={loadRecipes}
            className="p-2.5 bg-white border border-cream-dark hover:border-stone-400 text-espresso rounded-xl transition cursor-pointer"
            title="Refresh database index"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/recipes/new"
            className="px-4 py-2.5 bg-[#1F1E1B] hover:bg-terracotta text-[#FCFAF7] hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Formula</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 border border-cream-dark rounded-xl shadow-3xs">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by title or slug key..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#FAF9F5] border border-cream-dark focus:border-terracotta text-stone-850 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full bg-[#FAF9F5] border border-cream-dark text-stone-800 text-xs rounded-lg px-3 py-2.5 focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
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

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-[#FAF9F5] border border-cream-dark text-stone-800 text-xs rounded-lg px-3 py-2.5 focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-white border border-terracotta/30 p-3 rounded-xl flex items-center justify-between shadow-sm animate-fade-slide-up">
          <span className="text-xs font-mono font-bold text-stone-600">
            {selectedIds.length} recipe{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => handleBulkTogglePublish(true)}
              className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] uppercase tracking-wider font-bold rounded-xl transition cursor-pointer"
            >
              Publish Selected
            </button>
            <button 
              onClick={() => handleBulkTogglePublish(false)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-[10px] uppercase tracking-wider font-bold rounded-xl transition cursor-pointer"
            >
              Unpublish Selected
            </button>
          </div>
        </div>
      )}

      {/* Main List Table */}
      <div className="bg-white border border-cream-dark rounded-2xl shadow-3xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-stone-400">Loading recipe blueprints...</div>
        ) : filteredRecipes.length === 0 ? (
          <div className="py-20 text-center text-xs font-mono text-stone-400">
            No recipes matched the query filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-cream-dark font-mono text-stone-500 uppercase text-[10px]">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-stone-300 text-terracotta focus:ring-terracotta cursor-pointer"
                      checked={filteredRecipes.length > 0 && selectedIds.length === filteredRecipes.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(filteredRecipes.map(r => r.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-4 font-bold">Recipe</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Difficulty</th>
                  <th className="p-4 font-bold">Cuisine</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark/60">
                {filteredRecipes.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF9F6]/30 transition-colors">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox"
                        className="rounded border-stone-300 text-terracotta focus:ring-terracotta cursor-pointer"
                        checked={selectedIds.includes(r.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, r.id]);
                          } else {
                            setSelectedIds(prev => prev.filter(id => id !== r.id));
                          }
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border bg-stone-50 shrink-0">
                          {r.image && (
                            <Image src={r.image} alt={r.title} fill className="object-cover" referrerPolicy="no-referrer" />
                          )}
                        </div>
                        <div className="text-left">
                          <span className="font-serif font-bold text-espresso text-sm leading-tight block">{r.title}</span>
                          <span className="text-[10px] font-mono text-stone-400 select-all block">/{r.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-stone-600 font-medium text-left">{r.category}</td>
                    <td className="p-4 text-left">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold border ${
                        r.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        r.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {r.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-stone-600 font-mono text-left">{r.cuisine}</td>
                    <td className="p-4 text-left">
                      <button 
                        onClick={() => handleTogglePublish(r.id, r.is_published)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase border cursor-pointer transition-all ${
                          r.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : r.status === 'scheduled' 
                            ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' 
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {r.status || 'draft'}
                      </button>
                    </td>
                    <td className="p-4 text-right relative">
                      <div className="flex items-center justify-end gap-1.5 relative">
                        <button
                          onClick={() => {
                            if (socialModalOpen && activeRecipe?.id === r.id) {
                              setSocialModalOpen(false);
                            } else {
                              setActiveRecipe(r);
                              setPinterestUrl(r.pinterest_url || '');
                              setInstagramUrl(r.instagram_url || '');
                              setSocialModalOpen(true);
                            }
                          }}
                          className={`p-2 rounded-lg transition cursor-pointer ${socialModalOpen && activeRecipe?.id === r.id ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-stone-50 text-stone-500 hover:text-emerald-600'}`}
                          title="Link Socials"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/recipes/${r.id}`}
                          className="p-2 hover:bg-stone-50 text-stone-500 hover:text-espresso rounded-lg transition"
                          title="Edit Recipe"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/recipes/${r.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-stone-50 text-stone-550 hover:text-terracotta rounded-lg transition"
                          title="Preview Layout"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(r.id, r.title)}
                          className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                          title="Delete Recipe"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Inline Popover for Socials */}
                        {socialModalOpen && activeRecipe?.id === r.id && (
                          <div className="absolute right-[110%] top-0 z-[100] w-[280px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-cream-dark overflow-hidden animate-fade-slide-up text-left cursor-default">
                            <div className="px-4 py-3 border-b border-cream-dark flex items-center justify-between bg-[#FAF9F6]">
                              <h3 className="font-serif font-bold text-espresso text-[13px]">Link Socials</h3>
                              <button onClick={() => setSocialModalOpen(false)} className="text-stone-400 hover:text-espresso cursor-pointer p-1">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="p-4 space-y-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-stone-500">Pinterest URL</label>
                                <input 
                                  type="url" 
                                  placeholder="https://pinterest.com/pin/..." 
                                  value={pinterestUrl}
                                  onChange={(e) => setPinterestUrl(e.target.value)}
                                  className="w-full bg-[#FAF9F5] border border-cream-dark focus:border-terracotta text-stone-850 text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-stone-500">Instagram URL</label>
                                <input 
                                  type="url" 
                                  placeholder="https://instagram.com/p/..." 
                                  value={instagramUrl}
                                  onChange={(e) => setInstagramUrl(e.target.value)}
                                  className="w-full bg-[#FAF9F5] border border-cream-dark focus:border-terracotta text-stone-850 text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="px-4 py-3 border-t border-cream-dark bg-[#FAF9F6] flex justify-end gap-2">
                              <button 
                                onClick={() => setSocialModalOpen(false)}
                                className="px-3 py-1.5 text-[10px] font-mono font-bold text-stone-500 hover:text-espresso uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={handleSaveSocials}
                                disabled={isSavingSocials}
                                className="px-3 py-1.5 bg-espresso hover:bg-terracotta text-cream hover:text-white rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all shadow-3xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                              >
                                {isSavingSocials ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
