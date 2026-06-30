'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'motion/react';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Printer, 
  Clock, 
  Calendar, 
  User, 
  Pin, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { BlogPost, BlogSection } from '@/data/blogs';
import MarkdownContent, { parseInlineMarkdown } from './templates/MarkdownContent';
import { getSavedBlogs } from '@/lib/preseededPool';
import { Recipe } from '@/data/recipes';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import RecipeCard from '@/components/RecipeCard';
import { toast } from 'react-hot-toast';

// 1. Interactive Scrollytelling Section component
interface ScrollySectionProps {
  section: BlogSection;
  onPin: (imgUrl: string, title: string) => void;
  blogTitle: string;
}

function ScrollySection({ section, onPin, blogTitle }: ScrollySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isCurrentlyInView = useInView(containerRef, { once: false, amount: 0.15 });

  return (
    <motion.section
      id={section.id}
      ref={containerRef}
      initial={{ opacity: 0, y: 35 }}
      animate={isCurrentlyInView ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-8 first:pt-4 border-b border-cream-dark/30 dark:border-stone-850/30 last:border-0 scroll-mt-28 space-y-5"
    >
      {section.headingType === 'h2' ? (
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream tracking-tight border-l-3 border-terracotta pl-3">
          {section.title}
        </h2>
      ) : (
        <h3 className="font-serif font-bold text-lg text-espresso/90 dark:text-cream/90 tracking-tight">
          {section.title}
        </h3>
      )}

      <MarkdownContent
        content={section.text}
        className="font-sans text-stone-705 dark:text-stone-300 text-sm sm:text-base leading-relaxed text-justify"
      />

      {section.pullquote && (
        <blockquote className="my-6 p-5 sm:p-6 bg-cream/40 dark:bg-stone-850/40 rounded-r-3xl border-l-4 border-terracotta italic font-serif text-espresso/85 dark:text-[#EAE3D9] text-base sm:text-lg leading-relaxed shadow-xs">
          &ldquo;{section.pullquote}&rdquo;
        </blockquote>
      )}

      {section.image && (
        <div className="relative group rounded-3xl overflow-hidden border border-cream-dark/50 dark:border-stone-800 bg-cream/5 mt-4">
          <div className="relative aspect-video w-full">
            <Image
              src={section.image}
              alt={section.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                id={`pin-btn-${section.id}`}
                onClick={() => onPin(section.image!, section.title)}
                className="px-4 py-2.5 bg-[#E60023] hover:bg-[#AD0018] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-lg select-none scale-95 group-hover:scale-100 transition-all cursor-pointer"
              >
                <Pin className="w-3.5 h-3.5 font-bold fill-white" />
                <span>Pin This Tip</span>
              </button>
            </div>
          </div>
          {section.imageCaption && (
            <div className="p-3 bg-cream-light/50 dark:bg-stone-850/50 border-t border-cream-dark/30 dark:border-stone-800/40 text-center">
              <span className="font-mono text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase">
                🏷️ FIELD PLATE: {section.imageCaption}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}

interface BlogPostInteractiveClientProps {
  post?: BlogPost;
  relatedRecipes: Recipe[];
  fallbackSlug?: string;
}

export default function BlogPostInteractiveClient({ post: initialPost, relatedRecipes, fallbackSlug }: BlogPostInteractiveClientProps) {
  const router = useRouter();
  const [localPost, setLocalPost] = useState<BlogPost | null>(initialPost || null);
  const [hasCheckedLocal, setHasCheckedLocal] = useState(false);

  useEffect(() => {
    if (!localPost && fallbackSlug) {
      const saved = getSavedBlogs();
      const match = saved.find(b => b.slug === fallbackSlug);
      if (match) {
        setLocalPost(match);
      }
      setHasCheckedLocal(true);
    } else {
      setHasCheckedLocal(true);
    }
  }, [initialPost, fallbackSlug, localPost]);

  const activePost = localPost;

  const sectionIds = activePost?.sections?.map((s) => s.id) || [];
  const activeSectionId = useTableOfContents(sectionIds);

  if (!activePost) {
    if (hasCheckedLocal) {
      return (
        <div className="py-24 text-center space-y-6 max-w-md mx-auto px-6" id="client-not-found-blog">
          <h2 className="font-serif font-bold text-3xl text-espresso dark:text-cream">Article Not Found</h2>
          <p className="text-stone-500 text-sm">We couldn't locate this article, even in your local drafts shelf.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-espresso text-cream dark:bg-cream dark:text-espresso rounded-full text-xs font-mono font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> View Gazette Archives
          </Link>
        </div>
      );
    }
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-6" id="client-loading-blog">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-500 text-xs font-mono uppercase tracking-widest">Loading Article Canvas...</p>
      </div>
    );
  }

  const post = activePost;

  const handlePinAction = (imageUrl: string, titleStr: string) => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const pinterestUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
      shareUrl
    )}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(
      `PebblePlate Tip: ${titleStr} — from "${post.title}"`
    )}`;
    window.open(pinterestUrl, '_blank', 'width=750,height=600,toolbar=0,status=0');
    toast.success('Opening Pinterest Save board! 📌');
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard! 📋');
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  return (
    <div className="w-full min-h-screen py-8 md:py-12 bg-cream-light/20 dark:bg-[#1A1A1A] px-6 select-none" id="blog-detail-root-container">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between border-b border-cream-dark/50 dark:border-stone-850 pb-4 print:hidden" id="navigation-parent">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase text-stone-600 dark:text-stone-300 hover:text-terracotta dark:hover:text-terracotta-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Articles Archives</span>
          </Link>

          <span className="font-mono text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400 font-extrabold tracking-widest uppercase">
            {post.category} CASE STUDY
          </span>
        </div>

        {/* Title & Masthead */}
        <header className="text-left space-y-4 max-w-4xl" id="article-main-masthead">
          <div className="space-y-2">
            <span className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase text-terracotta dark:text-terracotta-light bg-terracotta/10 px-2.5 py-1 rounded">
              #{post.category}
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-espresso dark:text-cream leading-[1.1] tracking-tight">
              {post.title}
            </h1>
          </div>

          <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base md:text-lg font-serif italic border-l-4 border-sage pl-4 bg-cream/10 dark:bg-stone-850/20 py-2.5 rounded-r-2xl leading-relaxed">
            {post.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-cream-dark/50 dark:border-stone-850 text-stone-500 dark:text-stone-400 font-mono text-[10px] sm:text-[11px] font-bold" id="author-meta-block">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-sage" />
              <span>BY {post.author.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sage" />
              <span>{post.date.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-terracotta dark:text-terracotta-light">
              <Clock className="w-4 h-4" />
              <span>{post.readTime.toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Social Share Row */}
        <section className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-cream-dark/30 dark:border-stone-850/40 print:hidden" id="social-share-strip">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-stone-500 dark:text-stone-400 font-bold tracking-wider mr-2 uppercase">
              • ENGAGE & SAVE
            </span>

            <button
              onClick={() => handlePinAction(post.image, post.title)}
              className="px-3.5 py-2 hover:bg-[#E60023]/10 text-espresso dark:text-cream hover:text-[#E60023] border border-cream-dark dark:border-stone-800 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
              title="Pin entire article"
              id="top-pinterest-share"
            >
              <Pin className="w-3.5 h-3.5 fill-current" />
              <span>Save Pin</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 hover:bg-sage/10 text-espresso dark:text-cream hover:text-sage border border-cream-dark dark:border-stone-800 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
              title="Copy link address"
              id="copy-link-share"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 hover:bg-honey/10 text-espresso dark:text-cream hover:text-honey border border-cream-dark dark:border-stone-800 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
              title="Print recipes and instructions"
              id="print-share"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Article</span>
            </button>
          </div>
        </section>

        {/* Splash Banner */}
        <div className="relative rounded-[2rem] overflow-hidden aspect-[21/9] bg-cream-dark/20 border border-cream-dark dark:border-stone-800" id="splash-cover-image">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            referrerPolicy="no-referrer"
            sizes="100vw"
          />
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative items-start" id="main-editorial-grid">
          
          <aside className="lg:col-span-3 lg:sticky lg:top-28 hidden lg:block space-y-6 select-none print:hidden" id="toc-sidebar">
            <div className="p-6 bg-white dark:bg-stone-850 rounded-3xl border border-cream-dark/60 dark:border-stone-800 flex flex-col space-y-4">
              <span className="font-mono text-[10px] tracking-widest text-[#D4704A] font-extrabold uppercase">
                📖 OUTLINE INDEX
              </span>

              <nav className="flex flex-col space-y-1">
                {post.sections?.map((sec) => {
                  const isActive = activeSectionId === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      id={`toc-link-${sec.id}`}
                      className={`text-xs font-mono py-1.5 px-3 rounded-lg flex items-center justify-between border transition-all ${
                        isActive
                          ? 'bg-cream text-espresso border-cream-dark/50 font-bold dark:bg-stone-800 dark:text-cream dark:border-stone-750'
                          : 'text-stone-405 dark:text-stone-500 border-transparent hover:text-espresso dark:hover:text-cream'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span className="truncate pr-1">{sec.title}</span>
                      <ArrowUpRight className={`w-3 h-3 shrink-0 transition-opacity ${isActive ? 'opacity-100 text-terracotta' : 'opacity-0'}`} />
                    </a>
                  );
                })}
              </nav>
            </div>
            
            <div className="p-5 bg-sage/5 dark:bg-[#7C9A7E]/10 rounded-2xl border border-sage/10 text-left space-y-2">
              <span className="text-[10px] font-mono text-sage dark:text-sage-light font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-honey" /> EDITORIAL TIP
              </span>
              <p className="font-sans text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
                Scrolling past headers automatically marks your index location in real time. Click headings above to snap scroll.
              </p>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-6 text-left" id="article-content-body">
            {/* Top Style Indicator Tag */}
            <div className="flex items-center gap-2 pb-1 border-b border-cream-dark/45 dark:border-stone-800">
              <span className="font-mono text-[9px] font-bold tracking-widest uppercase bg-sage/10 text-sage dark:text-sage-light px-2.5 py-1 rounded">
                Layout Style: {((post as any).style || 'classic').toUpperCase()}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {((post as any).style === 'chemistry' && '🔬 Scientific Lab Ledger Layout') ||
                 ((post as any).style === 'spotlight' && '🎙️ Dialogue & Interview Q&A Layout') ||
                 ((post as any).style === 'bento' && '🍱 CSS Bento Dashboard Layout') ||
                 ((post as any).style === 'showcase' && '📸 Fullscreen Parallax Media Layout') ||
                 '📰 Traditional Gazette Column Layout'}
              </span>
            </div>

            {/* Render Chemistry Style */}
            {((post as any).style === 'chemistry') && (
              <div className="space-y-8" id="chemistry-layout-render">
                {/* Laboratory header banner */}
                <div className="p-6 bg-[#EDF3ED] dark:bg-stone-900 border border-[#CBDBCB] dark:border-stone-800 rounded-3xl space-y-3 font-mono">
                  <span className="text-xs text-sage font-extrabold uppercase tracking-wider block">🔬 KITCHEN RESEARCH LAB SPECIFICATION</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] text-stone-600 dark:text-stone-300">
                    <div><span className="font-bold text-espresso block">RETARDATION CELL:</span> 38°F (3.3°C)</div>
                    <div><span className="font-bold text-espresso block">HYDRATION MARGIN:</span> 78.5% Standard</div>
                    <div><span className="font-bold text-espresso block">FERMENT STATUS:</span> Active Cultures</div>
                    <div><span className="font-bold text-espresso block">pH TARGET:</span> 4.2 - 4.5 Optimal</div>
                  </div>
                </div>

                <div className="divide-y-2 divide-dashed divide-cream-dark/40 dark:divide-stone-850/30">
                  {post.sections?.map((section) => (
                    <div key={section.id} id={section.id} className="py-6 scroll-mt-28 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-sage font-extrabold bg-[#7C9A7E]/10 px-2 py-0.5 rounded">FORMULA SECTION</span>
                        <h2 className="font-serif font-bold text-lg text-espresso dark:text-cream">{section.title}</h2>
                      </div>
                      <MarkdownContent
                        content={section.text}
                        className="font-mono text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-[#FAFAF9] dark:bg-stone-900/60 p-4 rounded-2xl border border-cream-dark/60 dark:border-stone-800"
                      />
                      {section.pullquote && (
                        <div className="bg-sage/5 border-l-3 border-sage p-4 font-mono text-[11px] italic text-[#4A634D] dark:text-[#A8C7AA]">
                          {`// CALCULATED METRIC: `}&ldquo;{section.pullquote}&rdquo;
                        </div>
                      )}
                      {section.image && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-cream-dark">
                          <Image src={section.image} alt={section.title} fill className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Render Spotlight Style */}
            {((post as any).style === 'spotlight') && (
              <div className="space-y-6" id="spotlight-layout-render">
                <div className="p-6 bg-amber-50/40 dark:bg-stone-900/40 border border-amber-200/50 rounded-3xl italic font-serif text-sm text-espresso/90 dark:text-cream/90">
                  🎙️ This article is presented in our traditional Q&A interview format, taking you directly into the mind of culinary thought-leaders.
                </div>
                {post.sections?.map((section) => (
                  <div key={section.id} id={section.id} className="p-6 bg-white dark:bg-stone-900/30 border border-cream-dark dark:border-stone-800 rounded-3xl space-y-4 scroll-mt-28">
                    <h3 className="font-serif font-extrabold text-lg text-terracotta border-b border-cream-dark pb-2">{section.title}</h3>
                    <div className="space-y-3">
                      {section.text.split('\n').map((paragraph, pIdx) => {
                        const isQuestion = paragraph.trim().startsWith('Question:') || paragraph.trim().startsWith('Q:');
                        const isAnswer = paragraph.trim().startsWith('Answer:') || paragraph.trim().startsWith('A:');
                        return (
                          <p 
                            key={pIdx} 
                            className={`text-sm sm:text-base leading-relaxed ${
                              isQuestion 
                                ? 'font-serif font-bold text-espresso dark:text-cream bg-amber-50/20 p-3 rounded-xl border-l-3 border-honey' 
                                : isAnswer 
                                ? 'font-sans text-stone-700 dark:text-stone-300 pl-4 border-l-2 border-stone-200' 
                                : 'font-sans text-stone-605'
                            }`}
                          >
                            {parseInlineMarkdown(paragraph)}
                          </p>
                        );
                      })}
                    </div>
                    {section.pullquote && (
                      <blockquote className="border-y-2 border-cream-dark dark:border-stone-800 py-3 italic font-serif text-center text-espresso dark:text-cream text-lg">
                        &ldquo;{section.pullquote}&rdquo;
                      </blockquote>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Render Bento Layout Style */}
            {((post as any).style === 'bento') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="bento-layout-render">
                <div className="md:col-span-2 p-6 bg-[#FDFBF7] dark:bg-stone-900/20 border border-cream-dark/70 dark:border-stone-800 rounded-3xl space-y-2">
                  <span className="font-mono text-[9px] font-bold text-terracotta tracking-wider uppercase block">🍱 MULTI-FRAME BENTO DECK</span>
                  <h3 className="font-serif font-bold text-xl text-espresso dark:text-cream">Core Insights & Techniques</h3>
                  <p className="font-sans text-xs text-stone-500 leading-relaxed">This visual dashboard organizes the article’s molecular techniques and core summaries into structural grids.</p>
                </div>
                {post.sections?.map((section, sidx) => (
                  <div 
                    key={section.id} 
                    id={section.id} 
                    className={`p-6 bg-white dark:bg-stone-850 border border-cream-dark/65 dark:border-stone-800 rounded-3xl space-y-4 flex flex-col justify-between scroll-mt-28 ${
                      sidx % 3 === 0 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      <span className="font-mono text-[9px] text-sage font-bold uppercase tracking-widest block">📊 INDEX FRAME 0{sidx + 1}</span>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-espresso dark:text-cream">{section.title}</h4>
                      <MarkdownContent content={section.text} className="font-sans text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed text-justify" />
                    </div>

                    {section.pullquote && (
                      <div className="p-3 bg-cream-light/30 dark:bg-stone-900/40 rounded-xl text-[11px] font-serif italic text-espresso border border-cream-dark">
                        &ldquo;{section.pullquote}&rdquo;
                      </div>
                    )}

                    {section.image && (
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden mt-2">
                        <Image src={section.image} alt={section.title} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Render Showcase Style */}
            {((post as any).style === 'showcase') && (
              <div className="space-y-12" id="showcase-layout-render">
                {post.sections?.map((section, sidx) => (
                  <div key={section.id} id={section.id} className="space-y-6 scroll-mt-28">
                    {section.image && (
                      <div className="relative aspect-[21/10] w-full rounded-[2.5rem] overflow-hidden border border-cream-dark shadow-xs group">
                        <Image src={section.image} alt={section.title} fill className="object-cover group-hover:scale-101 transition-transform duration-700" referrerPolicy="no-referrer" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white flex flex-col justify-end">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#A0BCA2] font-bold">SHOWCASE FRAME 0{sidx + 1}</span>
                          <h4 className="font-serif font-bold text-lg sm:text-xl md:text-2xl">{section.title}</h4>
                        </div>
                      </div>
                    )}
                    <div className="max-w-3xl mx-auto space-y-4 px-4">
                      {!section.image && <h4 className="font-serif font-bold text-lg sm:text-xl text-espresso dark:text-cream">{section.title}</h4>}
                      <MarkdownContent
                        content={section.text}
                        className="font-sans text-sm sm:text-base text-stone-701 dark:text-stone-300 leading-relaxed text-justify"
                      />
                      {section.pullquote && (
                        <blockquote className="my-4 border-l-4 border-terracotta pl-4 italic font-serif text-stone-600 dark:text-stone-400 text-base leading-relaxed">
                          &ldquo;{section.pullquote}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render Default Classic Style */}
            {(!['chemistry', 'spotlight', 'bento', 'showcase'].includes((post as any).style || '')) && (
              <>
                {!post.sections || post.sections.length === 0 ? (
                  <div className="space-y-6 pt-3 pr-4 text-justify font-sans text-stone-650 dark:text-stone-300 text-sm leading-relaxed" id="backwards-fallback-content">
                    {post.content.map((paragraph, index) => (
                      <MarkdownContent
                        key={index}
                        content={paragraph}
                        className="pt-2 font-sans text-stone-650 dark:text-stone-300 text-sm leading-relaxed text-justify"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-cream-dark/20 dark:divide-stone-850/30" id="sections-scroll-parent">
                    {post.sections.map((section) => (
                      <ScrollySection
                        key={section.id}
                        section={section}
                        onPin={handlePinAction}
                        blogTitle={post.title}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            <div className="hidden print:block text-center text-[10px] text-stone-400 font-mono py-8 border-t border-stone-200 mt-12">
              PebblePlate Editorial Article &bull; All recipes available at pebbleplate.page
            </div>
          </main>

        </div>

        {/* RELATED RECIPES COMPONENT */}
        {relatedRecipes.length > 0 && (
          <section className="pt-12 border-t border-cream-dark dark:border-stone-850 space-y-8 select-none print:hidden" id="related-recipes-drawer">
            
            <div className="text-left space-y-1">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#7C9A7E] font-extrabold uppercase block">
                • CULINARY PAIRING SUGGESTIONS
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-espresso dark:text-cream tracking-tight">
                Try These Recipes In Your Own Kitchen
              </h2>
            </div>

            <div className="columns-1 sm:columns-2 gap-8 [column-fill:_balance]" id="related-recipes-grid">
              {relatedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={(rec) => router.push(`/recipes/${rec.slug}`)}
                />
              ))}
            </div>

          </section>
        )}

      </div>

    </div>
  );
}
