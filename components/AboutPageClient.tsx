'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  ArrowRight, ChefHat, Clock, Lightbulb, BookOpen, Flame, Leaf,
  FlaskConical, PenLine, UtensilsCrossed, CheckCircle2,
} from 'lucide-react';

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.868-2.062-4.876-5.006-4.876-3.41 0-5.411 2.558-5.411 5.2 0 1.029.397 2.133.892 2.733.098.118.112.222.083.339l-.341 1.401c-.055.228-.182.277-.42.165-1.572-.733-2.555-3.033-2.555-4.881 0-3.974 2.887-7.623 8.322-7.623 4.37 0 7.768 3.114 7.768 7.278 0 4.341-2.737 7.834-6.536 7.834-1.277 0-2.477-.663-2.887-1.446l-.787 3.002c-.285 1.096-1.054 2.47-1.569 3.3l1.103.328C18.835 24 24 18.835 24 12 24 5.373 18.835 0 12 0z" />
  </svg>
);

// ── Animated stat counter ─────────────────────────────────────────
function StatItem({
  to,
  suffix = '',
  label,
  isStatic = false,
}: {
  to: number;
  suffix?: string;
  label: string;
  isStatic?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(isStatic ? to : 0);

  useEffect(() => {
    if (!inView || isStatic) return;
    let frame: number;
    const start = Date.now();
    const duration = 1300;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * to));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, isStatic]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center py-8 px-4 gap-1.5">
      <span className="font-serif font-black text-4xl sm:text-5xl text-espresso dark:text-cream tracking-tight tabular-nums">
        {count}{suffix}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold">
        {label}
      </span>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────
const PILLARS = [
  {
    Icon: ChefHat,
    accentBg: 'bg-sage/10',
    accentText: 'text-sage',
    hoverBg: 'group-hover:bg-sage',
    borderHover: 'hover:border-sage/40',
    title: 'Tested, then tested again',
    body: 'Every recipe is made at least twice before publishing. The failures from round one become the tips in the final write-up.',
    tip: 'If we can\'t reliably repeat a result ourselves, we don\'t publish it.',
  },
  {
    Icon: Clock,
    accentBg: 'bg-honey/10',
    accentText: 'text-honey',
    hoverBg: 'group-hover:bg-honey',
    borderHover: 'hover:border-honey/40',
    title: 'Honest time estimates',
    body: 'Prep times reflect a real home kitchen — not a restaurant prep station with three people chopping in parallel.',
    tip: 'We time ourselves with no advance prep, exactly as a reader cooks.',
  },
  {
    Icon: Lightbulb,
    accentBg: 'bg-terracotta/10',
    accentText: 'text-terracotta',
    hoverBg: 'group-hover:bg-terracotta',
    borderHover: 'hover:border-terracotta/40',
    title: 'No hidden techniques',
    body: 'The tips that make the actual difference are written directly into the recipe — never saved for a paid course or locked behind a login.',
    tip: 'If we know why something works, we explain it. Knowledge isn\'t a paywall.',
  },
];

const PROCESS_STEPS = [
  {
    Icon: FlaskConical,
    title: 'The Idea',
    detail: 'We start with a dish worth making — not a keyword to chase. The first question is: would we genuinely want to eat this on a Tuesday?',
  },
  {
    Icon: UtensilsCrossed,
    title: 'First Cook',
    detail: 'Into the kitchen. Timers running, notebook open. We follow the method literally, the way a reader would on their very first attempt.',
  },
  {
    Icon: PenLine,
    title: 'Note the Failures',
    detail: 'Something almost always breaks on the first run. We write it down precisely — what went wrong and what we think caused it.',
  },
  {
    Icon: ChefHat,
    title: 'Revise & Retest',
    detail: 'The adjusted recipe runs again. We compare against round-one notes and keep iterating until the outcome is consistently reliable.',
  },
  {
    Icon: CheckCircle2,
    title: 'Publish',
    detail: 'Only when the dish is genuinely worth making a second time does it go on PebblePlate — with every failure from the process written into the tips.',
  },
];

const TICKER_ITEMS = [
  'Launched 2025',
  '100+ tested recipes',
  'Zero auto-generated content',
  'Always free',
  'Tested twice minimum',
  'No paywalls ever',
  'Real kitchen timings',
];

// ── Page ─────────────────────────────────────────────────────────
export default function AboutPageClient() {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  return (
    <main className="bg-white dark:bg-stone-900 min-h-screen text-espresso dark:text-[#E2DED5] overflow-hidden">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 md:pt-32 pb-20 flex flex-col items-center text-center" id="about-hero">
        {/* soft glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-terracotta/5 dark:bg-terracotta/8 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/logo.png"
              alt="PebblePlate logo"
              width={110}
              height={110}
              className="object-contain drop-shadow-lg"
              priority
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-7 space-y-4"
        >
          <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-terracotta">
            Our story
          </span>
          <h1 className="font-serif font-black text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight">
            Food worth<br />
            <em className="not-italic text-terracotta">making again</em>
          </h1>
          <p className="font-sans text-base sm:text-lg max-w-lg mx-auto text-stone-500 dark:text-stone-400 leading-relaxed">
            A recipe destination built on one principle — every recipe published here must earn a second trip to the kitchen.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-12 flex flex-col items-center gap-1.5"
        >
          <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-px h-9 bg-gradient-to-b from-stone-300 dark:from-stone-600 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── ANIMATED STATS ──────────────────────────────────── */}
      <section className="border-y border-cream-dark dark:border-stone-800 bg-[#FAF7F2] dark:bg-[#161616]" id="about-stats">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-cream-dark dark:divide-stone-800">
          <StatItem to={100} suffix="+" label="Tested recipes" />
          <StatItem to={2}   suffix="×" label="Minimum retests" />
          <StatItem to={0}   suffix=""  label="Paywalls" isStatic />
          <StatItem to={2025} suffix="" label="Established" />
        </div>
      </section>

      {/* ── MANIFESTO ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28" id="about-story">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24 items-start">
          <div className="md:sticky md:top-28 space-y-5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-sage font-bold">The Manifesto</span>
            <blockquote className="font-serif font-bold text-3xl sm:text-4xl text-espresso dark:text-cream leading-tight tracking-tight">
              &ldquo;If we wouldn&apos;t cook it again ourselves, it doesn&apos;t go up.&rdquo;
            </blockquote>
            <div className="h-px w-14 bg-terracotta/50" />
            <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">— The PebblePlate standard</p>
          </div>

          <div className="space-y-5 font-sans text-stone-600 dark:text-stone-300 text-sm sm:text-[15px] leading-[1.9]">
            <p>
              PebblePlate was built in 2025 out of a simple frustration: most recipe websites are packed with auto-generated content, bloated with ads, and written by people who have never actually stood over a hot stove testing whether the method works.
            </p>
            <p>
              Every recipe here starts in a real kitchen. It gets made, tasted, adjusted, and made again — until the result is reliably good, not just occasionally impressive. The notes from that process are the parts we care most about writing.
            </p>
            <p>
              Our catalogue covers weeknight staples to weekend projects, with a deep focus on bread, slow-cooked dishes, and recipes that reward patience. If a technique is non-obvious, we explain it. If a substitution works, we say so. If something commonly goes wrong, we warn you before it happens.
            </p>
            <div className="pl-4 border-l-2 border-terracotta/40 py-1">
              <p className="italic text-espresso dark:text-cream font-medium">
                No paywalls. No locked secrets. No upsells. Just well-tested recipes — free for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY PILLARS ──────────────────────────────── */}
      <section className="bg-[#FAF7F2] dark:bg-[#161616] border-y border-cream-dark dark:border-stone-800 py-20 px-6" id="about-pillars">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-sage font-bold">Editorial Standard</span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">How we construct recipes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PILLARS.map((pillar, i) => {
              const isHovered = hoveredPillar === i;
              const { Icon } = pillar;
              return (
                <motion.div
                  key={i}
                  onHoverStart={() => setHoveredPillar(i)}
                  onHoverEnd={() => setHoveredPillar(null)}
                  animate={{ y: isHovered ? -5 : 0 }}
                  transition={{ duration: 0.18 }}
                  className={`group bg-white dark:bg-[#1E1E1E] rounded-2xl border border-cream-dark dark:border-stone-800 ${pillar.borderHover} p-6 flex flex-col gap-5 cursor-default transition-[border-color,box-shadow] duration-200 ${isHovered ? 'shadow-lg' : 'shadow-sm'}`}
                >
                  <div className={`w-11 h-11 rounded-xl ${pillar.accentBg} ${pillar.accentText} ${pillar.hoverBg} group-hover:text-white flex items-center justify-center transition-colors duration-200`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-serif font-bold text-base">{pillar.title}</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{pillar.body}</p>
                  </div>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-cream-dark dark:border-stone-700">
                          <p className="text-[11px] text-stone-400 dark:text-stone-500 italic leading-relaxed">
                            {pillar.tip}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RECIPE PROCESS ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28" id="about-process">
        <div className="space-y-10">
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-bold">The Process</span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">From idea to published</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-0">
            {/* Step tabs */}
            <div className="flex md:flex-col overflow-x-auto md:overflow-visible shrink-0 md:w-60 border-b md:border-b-0 md:border-r border-cream-dark dark:border-stone-800">
              {PROCESS_STEPS.map((step, i) => {
                const active = activeStep === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`flex items-center gap-3 px-4 py-3.5 text-left shrink-0 border-b-2 md:border-b-0 md:border-r-2 transition-all ${
                      active
                        ? 'border-terracotta bg-terracotta/5 dark:bg-terracotta/10'
                        : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors ${
                      active ? 'bg-terracotta text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`font-serif font-semibold text-sm whitespace-nowrap transition-colors ${
                      active ? 'text-terracotta' : 'text-stone-400 dark:text-stone-500'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Step content panel */}
            <div className="flex-1 md:pl-10 min-h-[220px] flex items-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-5 w-full"
                >
                  {(() => {
                    const { Icon, title, detail } = PROCESS_STEPS[activeStep];
                    return (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                            Step {activeStep + 1} of {PROCESS_STEPS.length}
                          </span>
                          <h3 className="font-serif font-bold text-xl sm:text-2xl">{title}</h3>
                          <p className="font-sans text-sm sm:text-base text-stone-500 dark:text-stone-400 leading-relaxed max-w-md">
                            {detail}
                          </p>
                        </div>
                        {/* dot nav */}
                        <div className="flex gap-2 pt-1">
                          {PROCESS_STEPS.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveStep(i)}
                              className={`h-1.5 rounded-full transition-all duration-200 ${
                                i === activeStep ? 'bg-terracotta w-6' : 'bg-stone-200 dark:bg-stone-700 w-1.5 hover:bg-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO — WHAT'S ON THE MENU ──────────────────────── */}
      <section className="bg-[#FAF7F2] dark:bg-[#161616] border-y border-cream-dark dark:border-stone-800 py-20 px-6" id="about-coverage">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-honey font-bold">What&apos;s on the menu</span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">What you&apos;ll find here</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Wide card */}
            <div className="sm:col-span-2 group bg-white dark:bg-[#1E1E1E] rounded-2xl border border-cream-dark dark:border-stone-800 hover:border-terracotta/40 p-7 flex flex-col gap-4 transition-[border-color,box-shadow] hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-terracotta/10 text-terracotta group-hover:bg-terracotta group-hover:text-white flex items-center justify-center transition-colors duration-200">
                <Flame className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg">Weeknight dinners</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  Fast, reliable meals for busy evenings — built on pantry staples, minimal washing up, and results that taste like you tried harder than you did.
                </p>
              </div>
            </div>

            {/* Tall card — Weekend projects */}
            <div className="group bg-white dark:bg-[#1E1E1E] rounded-2xl border border-cream-dark dark:border-stone-800 hover:border-sage/40 p-7 flex flex-col gap-4 transition-[border-color,box-shadow] hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-sage/10 text-sage group-hover:bg-sage group-hover:text-white flex items-center justify-center transition-colors duration-200">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base">Weekend projects</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Bread, slow braises, layered pastries — recipes that reward time and teach real technique along the way.
                </p>
              </div>
            </div>

            {/* Seasonal */}
            <div className="group bg-white dark:bg-[#1E1E1E] rounded-2xl border border-cream-dark dark:border-stone-800 hover:border-honey/40 p-7 flex flex-col gap-4 transition-[border-color,box-shadow] hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-honey/10 text-honey group-hover:bg-honey group-hover:text-white flex items-center justify-center transition-colors duration-200">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base">Seasonal cooking</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Following what&apos;s actually in season — better flavour, lower cost, and less time chasing hard-to-find ingredients.
                </p>
              </div>
            </div>

            {/* Always free — dark accent card */}
            <div className="sm:col-span-2 bg-espresso dark:bg-stone-800 rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Image src="/logo.png" alt="PebblePlate" width={32} height={32} className="object-contain brightness-0 invert opacity-90" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-white">Everything is free. Always.</h3>
                <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
                  No subscriptions, no locked recipes, no premium tier. Every method, tip, and technique is published openly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-6" id="about-cta">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 font-bold">Get in touch</span>
          <h2 className="font-serif font-bold text-4xl sm:text-5xl text-espresso dark:text-cream tracking-tight leading-tight">
            Have a question<br />or a recipe idea?
          </h2>
          <p className="font-sans text-stone-500 dark:text-stone-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            Spotted an error, tried a recipe, or want to suggest something? We read every message and reply personally.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-espresso hover:bg-terracotta text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              <span>Send a message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://www.pinterest.com/PebblePlate/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white dark:bg-stone-800 hover:bg-stone-50 text-stone-700 dark:text-stone-200 text-xs font-mono font-bold uppercase tracking-widest rounded-xl border border-cream-dark dark:border-stone-700 transition-colors shadow-sm"
            >
              <PinterestIcon className="w-4 h-4 text-[#E60023]" />
              <span>Follow on Pinterest</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── SCROLLING TICKER ────────────────────────────────── */}
      <div className="border-t border-cream-dark dark:border-stone-800 py-4 overflow-hidden bg-[#FAF7F2] dark:bg-[#161616]">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-6 whitespace-nowrap w-max"
        >
          {[...Array(2)].flatMap((_, rep) =>
            TICKER_ITEMS.map((item, i) => (
              <React.Fragment key={`${rep}-${i}`}>
                <span className="font-mono text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold">
                  {item}
                </span>
                <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-600 flex-shrink-0 inline-block" />
              </React.Fragment>
            ))
          )}
        </motion.div>
      </div>

    </main>
  );
}
