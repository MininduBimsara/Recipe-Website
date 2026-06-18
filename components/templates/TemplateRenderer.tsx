'use client';

import React from 'react';
import { TemplateStateProvider } from './TemplateStateContext';
import ClassicSingle from './ClassicSingle';
import SideBySide from './SideBySide';
import EditorialTrio from './EditorialTrio';
import HeroStack from './HeroStack';
import MagazineSplit from './MagazineSplit';
import StickyMobileShareBar from '@/components/recipe/StickyMobileShareBar';

interface TemplateRendererProps {
  post: any;
  type: 'recipe' | 'blog';
}

export default function TemplateRenderer({ post, type }: TemplateRendererProps) {
  if (!post) return null;

  // Read layout template configuration, defaulting to 'classic-single'
  const templateId = post.layout_template || 'classic-single';

  return (
    <TemplateStateProvider post={post} type={type}>
      <div className="w-full min-h-screen py-6 bg-[#FCFAF7] dark:bg-[#1A1A1A] select-none text-espresso print:mx-0 print:p-0 print:bg-white pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
