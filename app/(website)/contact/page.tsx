import React from 'react';
import { Metadata } from 'next';
import { Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: "Contact | Dishcraft",
  description: "Get in touch with Minindu Bimsara at Dishcraft. Questions about recipes, collaborations, or just want to say hi — I read everything.",
};

export default function ContactPage() {
  return (
    <main className="bg-white dark:bg-stone-900 min-h-screen text-espresso dark:text-[#E2DED5] py-16 md:py-24" id="contact-page-canvas">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-terracotta">
            Get in touch
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl tracking-tight leading-none text-espresso dark:text-white">
            Let&apos;s talk food
          </h1>
          <p className="font-sans text-sm sm:text-base text-stone-605 dark:text-stone-300">
            I read every message personally and aim to reply within 48 hours. Let&apos;s collaborate or perfect a recipe formula!
          </p>
        </div>

        {/* Content Section - Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
          
          {/* LEFT COLUMN — Direct info cards */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Card 1: Direct contact */}
            <div className="space-y-3 text-left">
              <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-terracotta block">
                Reach me directly
              </span>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-full bg-cream dark:bg-stone-850 flex items-center justify-center border border-cream-dark dark:border-stone-800 text-terracotta shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <a 
                  href="mailto:minindubim@gmail.com"
                  className="font-sans font-bold text-lg text-espresso dark:text-cream hover:underline hover:text-terracotta transition-all"
                  id="direct-email-link"
                >
                  minindubim@gmail.com
                </a>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 pl-13 leading-relaxed">
                For rapid recipe questions, baking ratios, collaborations, or high-fidelity media publications.
              </p>
            </div>

            <hr className="border-stone-200 dark:border-stone-800/80" />

            {/* Card 2: Response metrics */}
            <div className="space-y-3 text-left">
              <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-terracotta block">
                Response time
              </span>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-full bg-cream dark:bg-stone-850 flex items-center justify-center border border-cream-dark dark:border-stone-800 text-sage shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <span className="font-sans font-bold text-sm text-stone-700 dark:text-stone-200">
                  Within 48 hours on weekdays
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 pl-13 leading-relaxed">
                I test recipes and shoot bento-layout galleries during the week, but checking the digital postbox is part of my morning routine.
              </p>
            </div>

            <hr className="border-stone-200 dark:border-stone-800/80" />

            {/* Card 3: Mail themes */}
            <div className="space-y-4 text-left bg-cream/35 dark:bg-stone-850/20 p-6 rounded-2xl border border-cream-dark dark:border-stone-800/60">
              <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-terracotta block">
                What people write about
              </span>
              <ul className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-3 font-medium">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
                  <span>Recipe scaling and ingredient substitutions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
                  <span>Brand integrations and sponsored partnerships</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
                  <span>Digital cooking course and editorial press enquiries</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Sending notes when a bread bake turns out perfectly!</span>
                </li>
              </ul>
            </div>

          </div>

          {/* RIGHT COLUMN — Forms with client validation interaction */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </main>
  );
}
