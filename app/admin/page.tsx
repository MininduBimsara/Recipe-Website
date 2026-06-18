'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Utensils, 
  FileText, 
  Calendar, 
  Users, 
  Plus, 
  Sparkles, 
  ArrowRight,
  Clock,
  RotateCcw
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { 
  getSavedRecipes, 
  getSavedBlogs,
  PRESEEDED_SCHEDULED_RECIPES,
  PRESEEDED_SCHEDULED_BLOGS
} from '@/lib/preseededPool';
import StatCard from '@/components/admin/StatCard';
import { toast } from 'react-hot-toast';

interface QuickStats {
  recipesCount: number;
  blogsCount: number;
  scheduledCount: number;
  subscribersCount: number;
}

export default function AdminDashboardPage() {
  const [isSupabase, setIsSupabase] = useState(false);
  const [stats, setStats] = useState<QuickStats>({ recipesCount: 0, blogsCount: 0, scheduledCount: 0, subscribersCount: 0 });
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardStats = async () => {
    setLoading(true);
    const active = isSupabaseConfigured();
    setIsSupabase(active);

    try {
      if (active) {
        const supabase = createClient();
        const [recipesRes, postsRes, subsRes] = await Promise.all([
          supabase.from('recipes').select('id, title, status, created_at, category, slug', { count: 'exact' }),
          supabase.from('blog_posts').select('id, title, status, created_at, category, slug', { count: 'exact' }),
          supabase.from('newsletter_subscribers').select('id', { count: 'exact' })
        ]);

        const recipes = recipesRes.data || [];
        const blogs = postsRes.data || [];
        const subscribersCount = subsRes.count || 0;

        const scheduledRecipes = recipes.filter(r => r.status === 'scheduled').length;
        const scheduledBlogs = blogs.filter(b => b.status === 'scheduled').length;

        setStats({
          recipesCount: recipesRes.count || 0,
          blogsCount: postsRes.count || 0,
          scheduledCount: scheduledRecipes + scheduledBlogs,
          subscribersCount
        });

        // Combine and sort recent items
        const unifiedRecent = [
          ...recipes.map(r => ({ ...r, type: 'recipe', badgeColor: 'bg-amber-50 text-amber-700 border-amber-100' })),
          ...blogs.map(b => ({ ...b, type: 'blog', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' }))
        ]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);

        setRecentItems(unifiedRecent);
      } else {
        // Local Storage Fallback
        const recipes = getSavedRecipes();
        const blogs = getSavedBlogs();
        const scheduledCount = recipes.filter(r => r.status === 'scheduled').length + blogs.filter(b => b.status === 'scheduled').length;
        
        setStats({
          recipesCount: recipes.length,
          blogsCount: blogs.length,
          scheduledCount,
          subscribersCount: 0
        });

        const unifiedRecent = [
          ...recipes.map(r => ({ ...r, type: 'recipe', badgeColor: 'bg-amber-50 text-amber-700 border-amber-100', created_at: new Date().toISOString() })),
          ...blogs.map(b => ({ ...b, type: 'blog', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', created_at: new Date().toISOString() }))
        ].slice(0, 5);

        setRecentItems(unifiedRecent);
      }
    } catch (err) {
      console.error('Failed to query stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const handleResetToPreseeded = () => {
    if (confirm('Are you sure you want to reset and restore the 10 pre-scheduled Recipes and 10 pre-scheduled Blogs? This will replace your current list.')) {
      localStorage.setItem('savory_custom_recipes', JSON.stringify(PRESEEDED_SCHEDULED_RECIPES));
      localStorage.setItem('savory_custom_blogs', JSON.stringify(PRESEEDED_SCHEDULED_BLOGS));
      loadDashboardStats();
      toast.success('Successfully restored the 10 Recipe + 10 Blog scheduled queues! 🚀');
    }
  };

  return (
    <div className="space-y-8 animate-fade-slide-up" id="admin-dashboard-container">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-cream-dark rounded-2xl shadow-3xs">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-mono text-sage font-black uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-honey" /> Console Desk Overview
          </span>
          <h2 className="font-serif font-black text-2xl text-espresso">
            Welcome to Savory HQ, Executive Editor
          </h2>
          <p className="text-stone-500 text-xs max-w-xl">
            Streamline your culinary workspace, view subscriber volumes, and design responsive content cards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!isSupabase && (
            <button
              onClick={handleResetToPreseeded}
              className="px-4 py-2.5 bg-white border border-[#B35C2E]/20 text-terracotta hover:bg-[#B35C2E]/5 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore 20 Seeded</span>
            </button>
          )}
          <Link
            href="/admin/recipes/new"
            className="px-4 py-2.5 bg-espresso hover:bg-terracotta text-cream hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Recipe Formula</span>
          </Link>
          <Link
            href="/admin/blogs/new"
            className="px-4 py-2.5 bg-white border border-cream-dark text-espresso hover:bg-cream-light hover:border-stone-400 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Journal Draft</span>
          </Link>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="overview-analytics-grid">
        <StatCard title="Total Recipes" value={stats.recipesCount} icon={Utensils} loading={loading} />
        <StatCard title="Journal Posts" value={stats.blogsCount} icon={FileText} loading={loading} />
        <StatCard title="Scheduled Releases" value={stats.scheduledCount} icon={Calendar} loading={loading} trend="Live calendar sync" />
        <StatCard title="Newsletter Subs" value={stats.subscribersCount} icon={Users} loading={loading} />
      </div>

      {/* Bottom Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Drafts */}
        <div className="lg:col-span-8 bg-white p-6 border border-cream-dark rounded-2xl shadow-3xs space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-cream-dark/65 pb-3">
            <h3 className="font-serif font-bold text-lg text-espresso flex items-center gap-2">
              <Clock className="w-5 h-5 text-terracotta" /> Recent Editor Workspace Entries
            </h3>
            <span className="text-xs text-stone-400 font-mono">Latest 5 updates</span>
          </div>

          {loading ? (
            <div className="py-10 text-center font-mono text-xs text-stone-400">Scanning content indexes...</div>
          ) : recentItems.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-stone-100 rounded-xl text-center text-xs font-mono text-stone-400">
              No content logs. Tap one of the &ldquo;Add&rdquo; triggers above to begin.
            </div>
          ) : (
            <div className="divide-y divide-cream-dark/50">
              {recentItems.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between hover:bg-[#FAF9F6]/40 px-2 rounded-lg transition-colors">
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${item.badgeColor}`}>
                        {item.type}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-espresso line-clamp-1">{item.title}</h4>
                    </div>
                    <p className="text-[10px] text-stone-400 font-mono">
                      Category: {item.category} • Created {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${
                      item.status === 'published' 
                        ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' 
                        : item.status === 'scheduled' 
                        ? 'bg-sky-50 text-sky-600 border-sky-100' 
                        : 'bg-stone-50 text-stone-500 border-stone-200'
                    }`}>
                      {item.status || 'draft'}
                    </span>
                    <Link
                      href={`/admin/${item.type === 'recipe' ? 'recipes' : 'blogs'}/${item.id}`}
                      className="p-1.5 hover:bg-stone-50 text-stone-400 hover:text-terracotta rounded-lg transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Database Status Console */}
        <div className="lg:col-span-4 bg-white p-5 border border-cream-dark rounded-2xl shadow-3xs space-y-4 text-left">
          <div className="border-b pb-2">
            <h4 className="font-serif font-bold text-sm text-espresso">System Connectivity</h4>
            <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest pt-0.5">Integration telemetry</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border">
              <span className="text-xs font-mono text-stone-600">Supabase DB</span>
              <span className={`flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                isSupabase 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                {isSupabase ? 'CONNECTED' : 'LOCAL DEV'}
              </span>
            </div>

            <div className="p-3 bg-cream/10 border border-cream-dark/50 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-sage font-black uppercase tracking-wider block">Admin Privileges</span>
              <p className="text-[10.5px] text-stone-500 font-sans leading-relaxed">
                System edits are currently restricted to Admin UUID:
              </p>
              <div className="bg-[#FAF9F5] p-2 rounded border border-cream-dark font-mono text-[9px] text-stone-600 break-all select-all">
                c7fdab45-32f0-4b92-8d21-6fe025e431d7
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
