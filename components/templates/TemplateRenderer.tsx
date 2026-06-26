'use client';

import React, { useEffect, useState } from 'react';
import { TemplateStateProvider } from './TemplateStateContext';
import ClassicSingle from './ClassicSingle';
import SideBySide from './SideBySide';
import EditorialTrio from './EditorialTrio';
import HeroStack from './HeroStack';
import MagazineSplit from './MagazineSplit';
import StickyMobileShareBar from '@/components/recipe/StickyMobileShareBar';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Link from 'next/link';

interface TemplateRendererProps {
  post: any;
  type: 'recipe' | 'blog';
  slug?: string;
}

export default function TemplateRenderer({ post: initialPost, type, slug }: TemplateRendererProps) {
  const [post, setPost] = useState<any>(initialPost);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkLocalStatus = async () => {
      const currentSlug = slug || initialPost?.slug;
      if (!currentSlug) {
        setLoading(false);
        return;
      }

      if (type === 'blog') {
        const { getSavedBlogs } = await import('@/lib/preseededPool');
        const local = getSavedBlogs().find(b => b.slug === currentSlug);
        if (local) {
          if (local.is_published === false || local.status === 'draft') {
            setPost(null);
          } else {
            setPost(local);
          }
          setLoading(false);
          return;
        }
      } else if (type === 'recipe') {
        const { getSavedRecipes } = await import('@/lib/preseededPool');
        const local = getSavedRecipes().find(r => r.slug === currentSlug);
        if (local) {
          if (local.is_published === false || local.status === 'draft') {
            setPost(null);
          } else {
            setPost(local);
          }
          setLoading(false);
          return;
        }
      }
      
      if (initialPost) {
        setPost(initialPost);
      } else {
        setPost(null);
      }
      setLoading(false);
    };

    checkLocalStatus();
  }, [initialPost, slug, type]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FCFAF7] dark:bg-[#1A1A1A]">
        <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FCFAF7] dark:bg-[#1A1A1A] space-y-4 py-20 px-6 text-center">
        <h2 className="font-serif font-bold text-2xl text-espresso dark:text-cream">Content Unpublished</h2>
        <p className="text-stone-550 dark:text-stone-400 text-xs sm:text-sm max-w-md leading-relaxed">
          This culinary blueprint or column has been saved to draft or unpublished by the system administrator.
        </p>
        <Link 
          href={type === 'blog' ? '/blog' : '/recipes'} 
          className="px-5 py-2.5 bg-espresso text-cream hover:bg-terracotta hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  // Read layout template configuration, defaulting to 'classic-single'
  const templateId = post.layout_template || 'classic-single';

  return (
    <TemplateStateProvider post={post} type={type}>
      <div className="w-full min-h-screen py-6 bg-[#FCFAF7] dark:bg-[#1A1A1A] select-none text-espresso print:mx-0 print:p-0 print:bg-white pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <Breadcrumbs post={post} type={type} />
          <TemplateDispatcher templateId={templateId} />
        </div>
        <StickyMobileShareBar />
      </div>
    </TemplateStateProvider>
  );
}

function TemplateDispatcher({ templateId }: { templateId: string }) {
  switch (templateId) {
    case 'side-by-side':
      return <SideBySide />;
    case 'editorial-trio':
      return <EditorialTrio />;
    case 'hero-stack':
      return <HeroStack />;
    case 'magazine-split':
      return <MagazineSplit />;
    case 'classic-single':
    default:
      return <ClassicSingle />;
  }
}
