'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  FileText, 
  AlertCircle,
  ListOrdered
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { createPostAction, updatePostAction } from '@/lib/actions/posts';
import { getSavedBlogs, saveBlogs, ExtendedBlogPost } from '@/lib/preseededPool';
import TemplatePicker from '@/components/admin/TemplatePicker';
import PublishControl from '@/components/admin/PublishControl';
import { toast } from 'react-hot-toast';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const isNew = id === 'new';
  const router = useRouter();

  const [isSupabase, setIsSupabase] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<'Techniques' | 'Ingredient Guides' | 'Kitchen Equipment' | 'Meal Planning'>('Techniques');
  const [author, setAuthor] = useState('Master Chef Alexander');
  const [readTime, setReadTime] = useState('5 mins read');
  const [style, setStyle] = useState<'classic' | 'chemistry' | 'spotlight' | 'bento' | 'showcase'>('classic');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800');
  const [contentStr, setContentStr] = useState('');
  
  // Section 1 scrollytelling
  const [sec1Title, setSec1Title] = useState('The Molecular Core');
  const [sec1Text, setSec1Text] = useState('Detailing the amino acids and cellular structures that react under extreme dry heat.');
  const [sec1Quote, setSec1Quote] = useState('Temperature controls flavor density.');
  const [sec1Img, setSec1Img] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800');

  // Section 2 scrollytelling
  const [sec2Title, setSec2Title] = useState('Secondary Proving Stage');
  const [sec2Text, setSec2Text] = useState('Slowing the yeast activity results in heavy lactic fermentation notes.');
  const [sec2Quote, setSec2Quote] = useState('Time is the master ingredient.');
  const [sec2Img, setSec2Img] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800');

  // Visual layout & publish controls
  const [layoutTemplate, setLayoutTemplate] = useState('classic-single');
  const [templateImages, setTemplateImages] = useState<any[]>([]);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'scheduled' | 'published'>('draft');
  const [scheduleDate, setScheduleDate] = useState('2026-06-26T10:00:00Z');

  // Autosave status
  const [hasAutosave, setHasAutosave] = useState(false);

  useEffect(() => {
    const active = isSupabaseConfigured();
    setIsSupabase(active);

    const fetchBlog = async () => {
      if (isNew) return;
      try {
        if (active) {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            populateForm(data);
          }
        } else {
          const localBlogs = getSavedBlogs();
          const match = localBlogs.find(b => b.id === id);
          if (match) {
            populateForm({
              title: match.title,
              subtitle: match.summary,
              category: match.category,
              author: match.author || 'Editor',
              reading_time_minutes: parseInt(match.readTime) || 5,
              style: match.style || 'classic',
              cover_image: match.image,
              body: Array.isArray(match.content) ? match.content.join('\n') : '',
              sections: match.sections,
              layout_template: match.layout_template || 'classic-single',
              template_images: match.template_images || [],
              status: match.status || 'draft',
              scheduled_for: match.scheduledAt
            });
          } else {
            toast.error('Blog not found in local shelf.');
            router.push('/admin/blogs');
          }
        }
      } catch (err) {
        console.error('Failed to load blog details:', err);
        toast.error('Failed to load blog records.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, isNew]);

  const populateForm = (data: any) => {
    setTitle(data.title || '');
    setSummary(data.subtitle || data.summary || '');
    setCategory(data.category || 'Techniques');
    setAuthor(data.author || 'Master Chef Alexander');
    setReadTime(data.reading_time_minutes ? `${data.reading_time_minutes} mins read` : '5 mins read');
    setStyle(data.style || 'classic');
    setCoverImage(data.cover_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800');
    setContentStr(data.body || '');
    setLayoutTemplate(data.layout_template || 'classic-single');
    setTemplateImages(data.template_images || []);
    setPublishStatus(data.status || (data.is_published ? 'published' : 'draft'));
    if (data.scheduled_for) setScheduleDate(data.scheduled_for);

    if (Array.isArray(data.sections) && data.sections.length >= 2) {
      setSec1Title(data.sections[0].title || '');
      setSec1Text(data.sections[0].text || '');
      setSec1Quote(data.sections[0].pullquote || '');
      setSec1Img(data.sections[0].image || '');

      setSec2Title(data.sections[1].title || '');
      setSec2Text(data.sections[1].text || '');
      setSec2Quote(data.sections[1].pullquote || '');
      setSec2Img(data.sections[1].image || '');
    }
  };

  // Detect autosaved backup
  useEffect(() => {
    const key = `savory_autosave_blog_${id}`;
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
        title, summary, category, author, readTime, style, coverImage, contentStr,
        sec1Title, sec1Text, sec1Quote, sec1Img, sec2Title, sec2Text, sec2Quote, sec2Img,
        layoutTemplate, templateImages, publishStatus, scheduleDate, timestamp: Date.now()
      };
      localStorage.setItem(`savory_autosave_blog_${id}`, JSON.stringify(payload));
    }, 4000);

    return () => clearInterval(interval);
  }, [
    loading, id, title, summary, category, author, readTime, style, coverImage, contentStr,
    sec1Title, sec1Text, sec1Quote, sec1Img, sec2Title, sec2Text, sec2Quote, sec2Img,
    layoutTemplate, templateImages, publishStatus, scheduleDate
  ]);

  const handleRestoreAutosave = () => {
    const key = `savory_autosave_blog_${id}`;
    const cache = localStorage.getItem(key);
    if (cache) {
      const data = JSON.parse(cache);
      setTitle(data.title);
      setSummary(data.summary);
      setCategory(data.category);
      setAuthor(data.author);
      setReadTime(data.readTime);
      setStyle(data.style);
      setCoverImage(data.coverImage);
      setContentStr(data.contentStr);
      setSec1Title(data.sec1Title);
      setSec1Text(data.sec1Text);
      setSec1Quote(data.sec1Quote);
      setSec1Img(data.sec1Img);
      setSec2Title(data.sec2Title);
      setSec2Text(data.sec2Text);
      setSec2Quote(data.sec2Quote);
      setSec2Img(data.sec2Img);
      setLayoutTemplate(data.layoutTemplate);
      setTemplateImages(data.templateImages);
      setPublishStatus(data.publishStatus);
      setScheduleDate(data.scheduleDate);

      setHasAutosave(false);
      toast.success('Restored unsaved editorial draft!');
    }
  };

  const handleDiscardAutosave = () => {
    localStorage.removeItem(`savory_autosave_blog_${id}`);
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

    const dataPayload = {
      slug,
      title,
      subtitle: summary,
      cover_image: coverImage,
      body: contentStr,
      category,
      tags: title.split(' ').slice(0, 3).map(w => w.replace(/\W/g, '')),
      reading_time_minutes: parseInt(readTime) || 5,
      is_published: publishStatus === 'published',
      published_at: publishStatus === 'published' ? new Date().toISOString() : null,
      scheduled_for: publishStatus === 'scheduled' ? scheduleDate : null,
      status: publishStatus,
      layout_template: layoutTemplate,
      template_images: templateImages
    };

    if (isSupabase) {
      toast.loading(isNew ? 'Creating Journal Post...' : 'Saving Journal updates...', { id: 'blog-save' });
      const res = isNew 
        ? await createPostAction(dataPayload)
        : await updatePostAction(id, dataPayload);

      if (res.success) {
        toast.success('Saved Journal to Supabase successfully! 📝', { id: 'blog-save' });
        localStorage.removeItem(`savory_autosave_blog_${id}`);
        router.push('/admin/blogs');
      } else {
        toast.error(res.error || 'Database submission failed.', { id: 'blog-save' });
        setSaving(false);
      }
    } else {
      const localBlogs = getSavedBlogs();
      const updatedBlog: ExtendedBlogPost = {
        id: isNew ? 'custom-b-' + Date.now() : id,
        ...dataPayload,
        summary,
        date: publishStatus === 'published' ? 'Today' : new Date(scheduleDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: `${dataPayload.reading_time_minutes} mins read`,
        image: coverImage,
        author,
        content: contentStr.split('\n').map(c => c.trim()).filter(Boolean),
        sections: formattedSections,
        style,
        scheduledAt: dataPayload.scheduled_for || undefined,
      };

      let newList = [];
      if (isNew) {
        newList = [updatedBlog, ...localBlogs];
      } else {
        newList = localBlogs.map(b => b.id === id ? updatedBlog : b);
      }

      saveBlogs(newList);
      toast.success(isNew ? 'Added Journal locally.' : 'Saved Journal updates locally.');
      localStorage.removeItem(`savory_autosave_blog_${id}`);
      router.push('/admin/blogs');
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-slide-up" id="blog-editor-root">
      
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center justify-between border-b pb-4">
        <Link
          href="/admin/blogs"
          className="group inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-stone-500 hover:text-espresso transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Journal board index</span>
        </Link>

        <span className="text-[10px] font-mono text-stone-400 uppercase font-bold tracking-widest">
          {isNew ? 'NEW JOURNAL FORM' : 'UPDATE JOURNAL ARTICLE'}
        </span>
      </div>

      {/* Unsaved Backup Alert Banner */}
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

      {/* Editor Body Form */}
      <form onSubmit={handleSubmit} className="space-y-8 text-left">
        
        {/* Core details card */}
        <div className="bg-white border border-cream-dark p-6 rounded-2xl space-y-6 shadow-3xs">
          <div className="flex items-center gap-2 border-b pb-3">
            <FileText className="w-5 h-5 text-terracotta" />
            <h3 className="font-serif font-bold text-lg text-espresso">Journal Metadata Specifications</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Journal Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Cultivating Sourdough Hydrations"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Editorial Layout Style</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-cream-dark rounded-xl text-sm font-mono"
              >
                <option value="classic">Traditional Gazette (Classic columns)</option>
                <option value="chemistry">Culinary Chemistry (Scientific ledger)</option>
                <option value="spotlight">Spotlight Q&amp;A (Interview Dialogue logs)</option>
                <option value="bento">Bento Grid (Dynamic multi-frame cards)</option>
                <option value="showcase">Visual Showcase (Wide block banners)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-cream-dark rounded-xl text-sm"
              >
                <option value="Techniques">Techniques</option>
                <option value="Ingredient Guides">Ingredient Guides</option>
                <option value="Kitchen Equipment">Kitchen Equipment</option>
                <option value="Meal Planning">Meal Planning</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Author Credits</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Agnes Meriot"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Read Estimates</label>
              <input
                type="text"
                value={readTime}
                onChange={e => setReadTime(e.target.value)}
                placeholder="e.g. 5 mins read"
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Cover Spotlight Image URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-xs font-mono text-stone-500 bg-stone-50/50"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Summary (Serif Italic)</label>
              <textarea
                rows={2}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Write a quick, high-concept sentence leading in..."
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">Main Body Content Paragraphs (one per line) *</label>
              <textarea
                rows={6}
                required
                value={contentStr}
                onChange={e => setContentStr(e.target.value)}
                placeholder="Type the paragraphs here..."
                className="w-full px-4 py-2.5 border border-cream-dark focus:border-terracotta rounded-xl text-xs font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Scrollytelling Frames card */}
        <div className="bg-white border border-cream-dark p-6 rounded-2xl space-y-4 shadow-3xs">
          <div className="flex items-center gap-1">
            <ListOrdered className="w-4 h-4 text-terracotta" />
            <span className="text-xs font-mono font-bold uppercase text-espresso">Scrollytelling Component Layout Specs (2 Sections)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3 p-4 bg-stone-50/50 rounded-xl border border-cream-dark">
              <span className="text-xs font-mono font-bold text-sage block border-b pb-1">📚 FRAME 1</span>
              <div className="space-y-2">
                <input type="text" value={sec1Title} onChange={e => setSec1Title(e.target.value)} placeholder="Title" className="w-full p-2 border border-cream-dark text-xs rounded-lg bg-white" />
                <textarea rows={2} value={sec1Text} onChange={e => setSec1Text(e.target.value)} placeholder="Explain the molecular behavior..." className="w-full p-2 border border-cream-dark text-xs rounded-lg bg-white" />
                <input type="text" value={sec1Quote} onChange={e => setSec1Quote(e.target.value)} placeholder="Pullquote text" className="w-full p-2 border border-cream-dark text-xs rounded-lg bg-white font-serif italic" />
                <input type="text" value={sec1Img} onChange={e => setSec1Img(e.target.value)} placeholder="Image asset path URL" className="w-full p-2 border border-cream-dark text-[10px] rounded-lg bg-white font-mono text-stone-500" />
              </div>
            </div>

            <div className="space-y-3 p-4 bg-stone-50/50 rounded-xl border border-cream-dark">
              <span className="text-xs font-mono font-bold text-sage block border-b pb-1">📚 FRAME 2</span>
              <div className="space-y-2">
                <input type="text" value={sec2Title} onChange={e => setSec2Title(e.target.value)} placeholder="Title" className="w-full p-2 border border-cream-dark text-xs rounded-lg bg-white" />
                <textarea rows={2} value={sec2Text} onChange={e => setSec2Text(e.target.value)} placeholder="Explain the fermentation levels..." className="w-full p-2 border border-cream-dark text-xs rounded-lg bg-white" />
                <input type="text" value={sec2Quote} onChange={e => setSec2Quote(e.target.value)} placeholder="Pullquote text" className="w-full p-2 border border-cream-dark text-xs rounded-lg bg-white font-serif italic" />
                <input type="text" value={sec2Img} onChange={e => setSec2Img(e.target.value)} placeholder="Image asset path URL" className="w-full p-2 border border-cream-dark text-[10px] rounded-lg bg-white font-mono text-stone-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Visual Template picker */}
        <div className="bg-white border border-cream-dark p-6 rounded-2xl shadow-3xs">
          <TemplatePicker
            selectedTemplate={layoutTemplate}
            onChangeTemplate={setLayoutTemplate}
            templateImages={templateImages}
            onChangeImages={setTemplateImages}
          />
        </div>

        {/* Publish schedule planner */}
        <PublishControl
          currentStatus={publishStatus}
          onChangeStatus={setPublishStatus}
          scheduledFor={publishStatus === 'scheduled' ? scheduleDate : null}
          onChangeScheduledFor={utc => {
            if (utc) setScheduleDate(utc);
          }}
        />

        {/* Footer controls */}
        <div className="border-t border-cream-dark pt-6 flex items-center justify-end gap-3">
          <Link
            href="/admin/blogs"
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
            <span>{saving ? 'Saving...' : 'Deploy Article'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
