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
  RefreshCw
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { deleteRecipeAction, togglePublishRecipeAction } from '@/lib/actions/recipes';
import { getSavedRecipes, saveRecipes } from '@/lib/preseededPool';
import { toast } from 'react-hot-toast';

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isSupabase, setIsSupabase] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
            created_at: r.created_at
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
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
