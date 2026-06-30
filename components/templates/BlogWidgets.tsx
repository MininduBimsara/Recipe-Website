'use client';

import React from 'react';
import { useTemplateState } from './TemplateStateContext';
import { 
  Pin, Calendar, Clock, User, ArrowLeft, Share2, Copy, Printer, ArrowUpRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import RecipeCard from '@/components/RecipeCard';
import { InArticleAd } from '@/components/ads';
import MarkdownContent from './MarkdownContent';

export function BlogHeader() {
  const { post } = useTemplateState();

  return (
    <header className="text-left space-y-3 max-w-3xl">
      <div className="space-y-1">
        <span className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase text-terracotta bg-terracotta/10 px-2.5 py-1 rounded">
          #{post.category}
        </span>
        <h1 className="font-serif font-extrabold text-2xl sm:text-3xl md:text-4xl text-espresso leading-tight tracking-tight">
          {post.title}
        </h1>
      </div>

      <p className="text-stone-700 text-xs sm:text-sm font-serif italic border-l-4 border-sage pl-3 py-1 bg-cream/15 leading-relaxed">
        {post.summary}
      </p>

      <div className="flex flex-wrap items-center gap-3.5 py-2 border-y border-cream-dark/50 text-stone-500 font-mono text-[10px] font-semibold">
        <div className="flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-sage" />
          <span>BY {String(typeof post.author === 'string' ? post.author : (post.author?.name || 'Chef Isabella')).toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-sage" />
          <span>{String(post.date || post.publishedAt || post.published_at || 'June 17, 2026').toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1 ml-auto text-terracotta">
          <Clock className="w-3.5 h-3.5" />
          <span>{post.readTime || '5 Mins Read'}</span>
        </div>
      </div>
    </header>
  );
}

export function BlogEngagement() {
  const { post, handlePinAction, handleCopyLink, handlePrint } = useTemplateState();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-cream-dark/30 print:hidden">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] text-stone-500 font-bold tracking-wider mr-2 uppercase">
          • ENGAGE & SAVE
        </span>

        <button
          onClick={() => handlePinAction(post.image, post.title)}
          className="px-3 py-1.5 hover:bg-[#E60023]/10 text-espresso hover:text-[#E60023] border border-cream-dark rounded-full font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          title="Pin article cover"
        >
          <Pin className="w-3 h-3 fill-current" />
          <span>Save Pin</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="px-3 py-1.5 hover:bg-sage/10 text-espresso hover:text-sage border border-cream-dark rounded-full font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          title="Copy link address"
        >
          <Copy className="w-3  h-3" />
          <span>Copy Link</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 hover:bg-honey/10 text-espresso hover:text-honey border border-cream-dark rounded-full font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          title="Print page layout"
        >
          <Printer className="w-3 h-3" />
          <span>Print Gazette</span>
        </button>
      </div>
    </div>
  );
}

export function BlogToc() {
  const { post, activeSectionId, setActiveSectionId } = useTemplateState();
  const sections = post.sections || [];

  if (sections.length === 0) return null;

  return (
    <div className="bg-white/80 p-4 rounded-xl border border-cream-dark backdrop-blur-xs shadow-3xs sticky top-30 space-y-3">
      <h3 className="font-serif font-black text-xs text-stone-800 uppercase tracking-widest border-b border-cream-dark pb-1.5">
        Table of Contents
      </h3>
      <ul className="space-y-2 text-left">
        {sections.map((sec: any) => {
          const isActive = activeSectionId === sec.id;
          return (
            <li key={sec.id}>
              <a
                href={`#${sec.id}`}
                onClick={(e) => {
                  setActiveSectionId(sec.id);
                }}
                className={`block pl-2 border-l transition-all text-xs font-mono tracking-tight py-0.5 ${
                  isActive
                    ? 'border-terracotta text-terracotta font-extrabold translate-x-1'
                    : 'border-cream-dark text-stone-500 hover:text-espresso hover:border-stone-400'
                }`}
              >
                {sec.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function BlogSectionItem({ section }: { section: any }) {
  const { post, handlePinAction } = useTemplateState();

  return (
    <motion.section
      id={section.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-5 border-b border-cream-dark/30 last:border-0 scroll-mt-24 space-y-3"
    >
      {section.headingType === 'h2' ? (
        <h2 className="font-serif font-bold text-lg sm:text-xl text-espresso tracking-tight border-l-2 border-terracotta pl-2.5">
          {section.title}
        </h2>
      ) : (
        <h3 className="font-serif font-semibold text-base text-espresso/90 tracking-tight">
          {section.title}
        </h3>
      )}

      <MarkdownContent
        content={section.text}
        className="font-sans text-stone-700 text-xs sm:text-sm leading-relaxed text-justify"
      />

      {section.pullquote && (
        <blockquote className="my-3 p-3 bg-cream/15 rounded-r-xl border-l-2 border-terracotta italic font-serif text-stone-750 text-xs sm:text-sm leading-relaxed">
          &ldquo;{section.pullquote}&rdquo;
        </blockquote>
      )}

      {section.image && (
        <div className="relative group rounded-xl overflow-hidden border border-cream-dark bg-cream/5 mt-2">
          <div className="relative aspect-video w-full">
            <Image
              src={section.image}
              alt={section.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handlePinAction(section.image!, section.title)}
                className="px-3 py-1.5 bg-[#E60023] hover:bg-[#AD0018] text-white text-[9px] font-mono font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-md scale-95 hover:scale-100 transition-all cursor-pointer"
              >
                <Pin className="w-3 h-3 fill-white" />
                <span>Pin Tip</span>
              </button>
            </div>
          </div>
          {section.imageCaption && (
            <div className="p-2 bg-cream-light/30 border-t border-cream-dark/30 text-center">
              <span className="font-mono text-[8px] text-stone-500 font-bold uppercase">
                🏷️ FIELD PLATE: {section.imageCaption}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}

export function BlogSections() {
  const { post } = useTemplateState();
  const sections = post.sections || [];

  if (sections.length === 0) {
    // Render backward compatibility markdown text
    const paragraphs = Array.isArray(post.content) ? post.content : [];
    return (
      <div className="space-y-4">
        {paragraphs.map((para: string, idx: number) => (
          <React.Fragment key={idx}>
            <MarkdownContent
              content={para}
              className="font-sans text-stone-700 text-xs sm:text-sm leading-relaxed text-justify"
            />
            {idx === 2 && <InArticleAd />}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((sec: any, idx: number) => (
        <React.Fragment key={sec.id}>
          <BlogSectionItem section={sec} />
          {idx === 2 && <InArticleAd />}
        </React.Fragment>
      ))}
    </div>
  );
}

export function RelatedRecipes() {
  const { post } = useTemplateState();
  // We can pass and render preseeded related recipes if provided
  const currentRelatedIds = post.relatedRecipeIds || [];
  if (currentRelatedIds.length === 0) return null;

  return (
    <div className="space-y-4 pt-8 border-t border-cream-dark/40 print:hidden text-left" id="related-recipes-drawer">
      <div className="space-y-1">
        <span className="text-[10px] font-mono font-black text-sage tracking-widest uppercase">
          • Sourdough culinary connections
        </span>
        <h3 className="font-serif font-extrabold text-lg text-espresso tracking-tight">
          Integrate the formulas
        </h3>
      </div>
      <p className="text-[11.5px] text-stone-500 font-sans leading-relaxed max-w-xl">
        Practice gluten tension science or master wild crumb hydration bounds using our hand-selected matching formulas.
      </p>

      {/* Since we don't have direct DB imports inside widgets, we can provide fallback link or dynamic layout cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentRelatedIds.map((id: string) => (
          <div key={id} className="p-4 bg-white border border-cream-dark rounded-xl flex flex-col justify-between hover:border-terracotta/40 transition-colors">
            <div className="space-y-1">
              <span className="font-mono text-[8px] font-semibold text-terracotta uppercase">Matching Formula #{id}</span>
              <h4 className="font-serif font-bold text-xs text-stone-900 group-hover:text-terracotta line-clamp-1">
                Heirloom Baking Course
              </h4>
              <p className="text-[10.5px] text-stone-505 line-clamp-2">Authentic sourdough techniques with live laboratory instructions.</p>
            </div>
            <Link 
              href="/recipes"
              className="mt-3.5 self-start text-[9px] font-mono font-bold uppercase tracking-wider text-sage flex items-center gap-1 hover:underline"
            >
              <span>Explore Recipe Directory</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
