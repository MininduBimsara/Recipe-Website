'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Copy, 
  ExternalLink, 
  Trash2, 
  RefreshCw, 
  Info,
  Check
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const BUCKET_NAME = 'recipes-media';

// Pre-seeded high quality Unsplash URLs for local development fallback
const LOCAL_MOCK_ASSETS = [
  { name: 'Searing Steak Ribeye', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sourdough Rise Dough', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fresh Salad Mix', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' },
  { name: 'Morning Pour Coffee', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800' },
  { name: 'Italian pasta dish', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fresh baked croissants', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800' }
];

export default function AdminMediaPage() {
  const [isSupabase, setIsSupabase] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filesList, setFilesList] = useState<any[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkConfig = () => {
    const active = isSupabaseConfigured();
    setIsSupabase(active);
    return active;
  };

  const loadMediaFiles = async () => {
    setLoading(true);
    const active = checkConfig();

    if (!active) {
      // Offline fallback: load mock assets
      setFilesList(LOCAL_MOCK_ASSETS.map((asset, index) => ({
        id: `mock-img-${index}`,
        name: asset.name,
        url: asset.url,
        created_at: new Date().toISOString(),
        metadata: { size: 450000 }
      })));
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      // List files inside 'recipes-media' bucket
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        // Bucket probably doesn't exist yet, show a warning
        if (error.message.includes('not found')) {
          console.warn(`Bucket "${BUCKET_NAME}" was not found. Please create it in Supabase.`);
        }
        throw error;
      }

      if (data) {
        const mapped = data
          .filter(f => f.name !== '.emptyFolderPlaceholder')
          .map(f => {
            const { data: { publicUrl } } = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(f.name);
            return {
              id: f.id,
              name: f.name,
              url: publicUrl,
              created_at: f.created_at,
              metadata: f.metadata
            };
          });
        setFilesList(mapped);
      }
    } catch (err: any) {
      console.error('Failed to list storage assets:', err);
      // Fallback display anyway
      setFilesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMediaFiles();
  }, []);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Simple validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload image files only.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }

    if (!isSupabase) {
      // Local development simulation
      setUploading(true);
      setTimeout(() => {
        const fakeUrl = URL.createObjectURL(file);
        const simulatedFile = {
          id: `local-uploaded-${Date.now()}`,
          name: file.name,
          url: fakeUrl,
          created_at: new Date().toISOString(),
          metadata: { size: file.size }
        };
        setFilesList(prev => [simulatedFile, ...prev]);
        setUploading(false);
        toast.success('Simulated file upload locally! 📸');
      }, 1000);
      return;
    }

    try {
      setUploading(true);
      toast.loading('Uploading file to Supabase...', { id: 'media-upload' });
      const supabase = createClient();
      
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      toast.success('Successfully uploaded image! 🌄', { id: 'media-upload' });
      loadMediaFiles();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Storage upload failed. Make sure bucket exists and RLS allows inserts.', { id: 'media-upload' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (name: string, isMock: boolean) => {
    if (!confirm(`Permanently delete asset "${name}"?`)) return;

    if (isMock || !isSupabase) {
      setFilesList(prev => prev.filter(f => f.name !== name));
      toast.success('Removed mock asset.');
      return;
    }

    try {
      toast.loading('Removing file...', { id: 'media-del' });
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([name]);

      if (error) throw error;
      toast.success('Deleted asset from storage.', { id: 'media-del' });
      loadMediaFiles();
    } catch (err: any) {
      console.error('Delete asset error:', err);
      toast.error(err.message || 'Failed to remove storage item.', { id: 'media-del' });
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    toast.success('Copied image URL to clipboard!');
    setTimeout(() => {
      setCopiedLink(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-slide-up" id="admin-media-manager">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-dark pb-5">
        <div className="text-left">
          <h2 className="font-serif font-black text-2xl text-espresso flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-terracotta" /> Media Asset Library
          </h2>
          <p className="text-xs text-stone-500">Upload or fetch copyable image public CDN URLs to paste directly in editors.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={loadMediaFiles}
            className="p-2.5 bg-white border border-cream-dark hover:border-stone-400 text-espresso rounded-xl transition cursor-pointer"
            title="Refresh assets index"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="px-4 py-2.5 bg-[#1F1E1B] hover:bg-terracotta text-[#FCFAF7] hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* RLS/Storage Bucket Guidance card */}
      {isSupabase && (
        <div className="p-4 bg-sage/5 border border-sage/20 rounded-2xl flex items-start gap-2.5 text-left text-xs text-sage-dark leading-relaxed">
          <Info className="w-4.5 h-4.5 text-sage shrink-0 mt-0.5" />
          <div>
            <p className="font-bold font-mono uppercase text-[10px]">Supabase Storage Configuration Requirement</p>
            <p className="mt-0.5">
              Make sure you have created a public bucket named <span className="font-mono font-bold text-espresso">&ldquo;{BUCKET_NAME}&rdquo;</span> inside your Supabase console, with proper RLS policies allowing authenticated users to upload/delete files.
            </p>
          </div>
        </div>
      )}

      {/* Grid gallery */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-stone-400">Loading library assets...</div>
      ) : filesList.length === 0 ? (
        <div className="py-20 text-center text-xs font-mono text-stone-400 bg-white border rounded-2xl">
          No assets found. Click &ldquo;Upload Asset&rdquo; above to add images.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6" id="media-assets-grid">
          {filesList.map((file) => {
            const isMock = file.id.startsWith('mock-');
            const formattedSize = file.metadata?.size 
              ? `${(file.metadata.size / 1024).toFixed(1)} KB` 
              : 'External URL';

            return (
              <div 
                key={file.id} 
                className="bg-white border border-cream-dark rounded-2xl overflow-hidden shadow-3xs flex flex-col justify-between group hover:border-stone-400 transition"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-video w-full bg-stone-50 border-b border-cream-dark overflow-hidden">
                  <Image 
                    src={file.url} 
                    alt={file.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    sizes="(max-width: 768px) 50vw, 25vw"
                    referrerPolicy="no-referrer"
                  />
                  {isMock && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-terracotta/10 border border-orange-200 text-terracotta rounded text-[8px] font-mono font-bold uppercase">
                      SAMPLE
                    </span>
                  )}
                </div>

                {/* Details Footer */}
                <div className="p-3 space-y-2 text-left">
                  <div className="space-y-0.5">
                    <p className="font-serif font-bold text-xs text-espresso truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[9px] font-mono text-stone-400">
                      {formattedSize}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1 border-t border-cream-dark/50 pt-2 justify-end">
                    <button
                      onClick={() => handleCopy(file.url)}
                      className="p-1.5 hover:bg-stone-55 hover:text-espresso text-stone-400 rounded-lg transition"
                      title="Copy public link"
                    >
                      {copiedLink === file.url ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-stone-55 hover:text-espresso text-stone-400 rounded-lg transition"
                      title="Open image in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(file.name, isMock)}
                      className="p-1.5 hover:bg-red-50 text-stone-400 hover:text-red-650 rounded-lg transition"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
