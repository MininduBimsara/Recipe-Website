'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  Edit2, 
  RefreshCw
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { deletePostAction, togglePublishPostAction } from '@/lib/actions/posts';
import { getSavedBlogs, saveBlogs } from '@/lib/preseededPool';
import { toast } from 'react-hot-toast';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isSupabase, setIsSupabase] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadBlogs = async () => {
    setLoading(true);
    const active = isSupabaseConfigured();
    setIsSupabase(active);

    try {
      if (active) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (data) {
          setBlogs(data.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            category: p.category,
            readTime: p.reading_time_minutes ? `${p.reading_time_minutes} mins read` : '5 mins read',
            image: p.cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200',
            is_published: !!p.is_published,
            status: p.status || (p.is_published ? 'published' : 'draft'),
            created_at: p.created_at
          })));
        }
      } else {
        setBlogs(getSavedBlogs());
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
      toast.error('Error fetching blog post index.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleTogglePublish = async (id: string, currentPublishedState: boolean) => {
    const targetState = !currentPublishedState;

    if (isSupabase) {
      toast.loading('Saving publication state...', { id: 'blog-pub' });
      const res = await togglePublishPostAction(id, targetState);
      if (res.success) {
        toast.success(targetState ? 'Journal is live! 📝' : 'Journal reverted to draft.', { id: 'blog-pub' });
        setBlogs(prev => prev.map(b => b.id === id ? { ...b, is_published: targetState, status: targetState ? 'published' : 'draft' } : b));
      } else {
        toast.error(res.error || 'Publish toggle failed.', { id: 'blog-pub' });
      }
    } else {
      const updated = blogs.map(b => b.id === id ? { ...b, is_published: targetState, status: targetState ? 'published' : 'draft' } : b);
      setBlogs(updated);
      saveBlogs(updated);
      toast.success(targetState ? 'Journal published locally.' : 'Reverted to local draft.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    if (isSupabase) {
      toast.loading('Deleting entry...', { id: 'blog-del' });
      const res = await deletePostAction(id);
      if (res.success) {
        toast.success('Successfully removed Journal.', { id: 'blog-del' });
        setBlogs(prev => prev.filter(b => b.id !== id));
      } else {
        toast.error(res.error || 'Delete request failed.', { id: 'blog-del' });
      }
    } else {
      const updated = blogs.filter(b => b.id !== id);
      setBlogs(updated);
      saveBlogs(updated);
      toast.success('Removed Journal from offline shelf.');
    }
  };

  // Filter logic
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === '' || b.category === categoryFilter;
    const matchesStatus = statusFilter === '' || b.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-slide-up" id="admin-blogs-index">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-dark pb-5">
        <div className="text-left">
          <h2 className="font-serif font-black text-2xl text-espresso flex items-center gap-2">
            <FileText className="w-6 h-6 text-terracotta" /> Journal Index Board
          </h2>
          <p className="text-xs text-stone-500">Edit, search, filter, and schedule your scrollytelling visual columns.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={loadBlogs}
            className="p-2.5 bg-white border border-cream-dark hover:border-stone-400 text-espresso rounded-xl transition cursor-pointer"
            title="Refresh database index"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/blogs/new"
            className="px-4 py-2.5 bg-[#1F1E1B] hover:bg-terracotta text-[#FCFAF7] hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Journal</span>
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
            className="w-full bg-[#FAF9F5] border border-cream-dark text-stone-850 text-xs rounded-lg px-3 py-2.5 focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Techniques">Techniques</option>
            <option value="Ingredient Guides">Ingredient Guides</option>
            <option value="Kitchen Equipment">Kitchen Equipment</option>
            <option value="Meal Planning">Meal Planning</option>
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
          <div className="py-20 text-center text-xs font-mono text-stone-400">Loading journal index...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-20 text-center text-xs font-mono text-stone-400">
            No journals matched the query filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-cream-dark font-mono text-stone-500 uppercase text-[10px]">
                  <th className="p-4 font-bold">Journal</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Read Time</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark/60">
                {filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF9F6]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border bg-stone-50 shrink-0">
                          {b.image && (
                            <Image src={b.image} alt={b.title} fill className="object-cover" referrerPolicy="no-referrer" />
                          )}
                        </div>
                        <div className="text-left">
                          <span className="font-serif font-bold text-espresso text-sm leading-tight block">{b.title}</span>
                          <span className="text-[10px] font-mono text-stone-400 select-all block">/{b.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-stone-600 font-medium text-left">{b.category}</td>
                    <td className="p-4 text-stone-600 font-mono text-left">{b.readTime}</td>
                    <td className="p-4 text-left">
                      <button 
                        onClick={() => handleTogglePublish(b.id, b.is_published)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase border cursor-pointer transition-all ${
                          b.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : b.status === 'scheduled' 
                            ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' 
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {b.status || 'draft'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/blogs/${b.id}`}
                          className="p-2 hover:bg-stone-50 text-stone-500 hover:text-espresso rounded-lg transition"
                          title="Edit Blog"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-stone-50 text-stone-550 hover:text-terracotta rounded-lg transition"
                          title="Preview Layout"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(b.id, b.title)}
                          className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                          title="Delete Blog"
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
