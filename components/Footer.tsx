'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Send, 
  MapPin, 
  Mail, 
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  Layers,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.868-2.062-4.876-5.006-4.876-3.41 0-5.411 2.558-5.411 5.2 0 1.029.397 2.133.892 2.733.098.118.112.222.083.339l-.341 1.401c-.055.228-.182.277-.42.165-1.572-.733-2.555-3.033-2.555-4.881 0-3.974 2.887-7.623 8.322-7.623 4.37 0 7.768 3.114 7.768 7.278 0 4.341-2.737 7.834-6.536 7.834-1.277 0-2.477-.663-2.887-1.446l-.787 3.002c-.285 1.096-1.054 2.47-1.569 3.3l1.103.328C18.835 24 24 18.835 24 12 24 5.373 18.835 0 12 0z"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.18 1.12 1.04 2.7 1.49 4.21 1.59v3.83c-1.68-.05-3.32-.57-4.68-1.56-.16-.12-.31-.25-.46-.38v7.07c.07 3.63-2.28 7.15-5.87 7.97-4.04.93-8.31-1.44-9.31-5.46a8.044 8.044 0 0 1 4.79-9.5c.81-.32 1.68-.49 2.55-.49v3.87c-.89.04-1.81.25-2.58.74-1.65 1.05-2.25 3.31-1.39 5.09.83 1.72 2.84 2.67 4.71 2.21 1.78-.45 3.01-2.19 2.92-4.03l.03-15.12z"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid savory email!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        toast.success('Successfully subscribed to Savory Newsletter! 🥐');
        setEmail('');
      } else {
        toast.error('Gourmet pipeline error. Try again later.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network block. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1A1613] text-[#F3ECE4] border-t-2 border-[#D4704A]/30 pt-20 pb-10 px-6 print:hidden font-sans overflow-hidden" id="newsletter-section">
      {/* Visual Ambient Light glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#D4704A]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#7C9A7E]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Gourmet Manifesto Ribbon banner info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-[#302720] items-center">
          <div className="lg:col-span-2 text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4704A]/10 border border-[#D4704A]/25 text-[#EAB29C] text-[10px] font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artisanal Kitchen Blueprint Engine</span>
            </div>
            <h3 className="font-serif font-black text-2xl lg:text-3xl text-white tracking-tight leading-none">
              A Symphony of Gluten &amp; Digital Precision
            </h3>
            <p className="text-[#BEB4A8] text-xs max-w-2xl font-sans leading-relaxed">
              We translate centuries-old baking chemistry and slow-roasted culinary science into beautiful digital experiences. Our articles, flour weight charts, and design systems are curated meticulously to inspire real kitchen confidence.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:justify-end">
            <div className="p-4 bg-[#231E19] border border-[#302720] rounded-2xl text-left space-y-1.5 min-w-[130px] shadow-sm">
              <span className="text-[#7C9A7E] font-mono text-[9px] font-bold uppercase tracking-widest block">Active Sourdough</span>
              <span className="font-serif font-black text-lg text-[#F3ECE4] leading-none">Levain 78%</span>
            </div>
            <div className="p-4 bg-[#231E19] border border-[#302720] rounded-2xl text-left space-y-1.5 min-w-[130px] shadow-sm">
              <span className="text-[#D4704A] font-mono text-[9px] font-bold uppercase tracking-widest block">Release Target</span>
              <span className="font-serif font-black text-lg text-[#F3ECE4] leading-none">Weekly Gazette</span>
            </div>
          </div>
        </div>

        {/* Core Multi-Column Deep Index */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
          
          {/* COLUMN 1: Brand & Contacts */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-[#D4704A] text-white flex items-center justify-center font-serif font-black text-base shadow-sm">
                  S
                </span>
                <span className="font-serif font-black text-lg text-white tracking-tight">
                  Savory Kitchen
                </span>
              </div>
              <p className="text-[#BEB4A8] text-xs leading-relaxed font-sans">
                A highly optimized food blog system supporting deep SEO recipe schemas, automated countdown publication pipelines, Pinterest bento grids, and offline-ready local cache architectures.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#302720]/60 text-[#BEB4A8] font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#7C9A7E] shrink-0" />
                <span>Editorial Desk, Napa Valley</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#7C9A7E] shrink-0" />
                <a href="mailto:contact@savorykitchen.io" className="hover:text-white transition-colors">contact@savorykitchen.io</a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Gourmet Portal Map */}
          <div className="space-y-4 lg:pl-6">
            <h4 className="font-serif font-extrabold text-white text-xs uppercase tracking-widest border-l-2 border-[#7C9A7E] pl-2.5 py-0.5">
              Deep Index Map
            </h4>
            <ul className="space-y-3 text-xs text-[#BEB4A8]">
              <li>
                <Link 
                  href="/" 
                  className="hover:text-[#FAF7F2] transition-colors flex items-center gap-2 group cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#7C9A7E] transition-transform group-hover:translate-x-0.5" />
                  <span>Home &amp; Portal Hub</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/recipes" 
                  className="hover:text-[#FAF7F2] transition-colors flex items-center gap-2 group cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#7C9A7E] transition-transform group-hover:translate-x-0.5" />
                  <span>Artisanal Recipes</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="hover:text-[#FAF7F2] transition-colors flex items-center gap-2 group cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#7C9A7E] transition-transform group-hover:translate-x-0.5" />
                  <span>Science &amp; Advice</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className="hover:text-[#FAF7F2] transition-colors flex items-center gap-2 group cursor-pointer text-[#E59A7E] font-semibold"
                >
                  <ArrowRight className="w-3 h-3 text-[#D4704A] transition-transform group-hover:translate-x-0.5" />
                  <span>HQ Management Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Popular Curations */}
          <div className="space-y-4">
            <h4 className="font-serif font-extrabold text-white text-xs uppercase tracking-widest border-l-2 border-[#D4704A] pl-2.5 py-0.5">
              Popular Selections
            </h4>
            <ul className="space-y-3.5 text-xs text-[#BEB4A8]">
              <li className="flex justify-between items-center group">
                <span className="group-hover:text-white transition-colors cursor-pointer">Rustic Levain Baking</span>
                <span className="text-[9px] font-mono text-[#EAB29C] bg-[#D4704A]/10 px-2 py-0.5 rounded-md font-bold uppercase transition-all">Sourdough</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="group-hover:text-white transition-colors cursor-pointer">Fine French Pastry</span>
                <span className="text-[9px] font-mono text-[#A0BCA2] bg-[#7C9A7E]/10 px-2 py-0.5 rounded-md font-bold uppercase transition-all">Desserts</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="group-hover:text-white transition-colors cursor-pointer">Hydration Conversions</span>
                <span className="text-[9px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md font-bold uppercase transition-all">Lab Science</span>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif font-extrabold text-white text-xs uppercase tracking-widest border-l-2 border-amber-400 pl-2.5 py-0.5">
              Weekly Board Notes
            </h4>
            <p className="text-[#BEB4A8] text-xs leading-relaxed font-sans">
              Join 12,000+ bakers who receive weekly fermentation calendars, direct Pinterest links, and custom flour hydration calculators. 
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address..."
                  disabled={subscribed}
                  className="w-full bg-[#27211C] border border-[#3E342B] focus:border-[#D4704A] text-white placeholder-[#8B7C72] text-xs rounded-xl px-4 py-3.5 pr-12 focus:outline-none transition-colors shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || subscribed}
                  className="absolute right-2 top-2 p-1.5 text-[#BEB4A8] hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                  title="Subscribe to updates"
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] font-sans text-[#A0BCA2] flex items-center gap-1 animate-fade-in font-bold leading-normal">
                  ✓ Sourdough formulas on the way! Welcome inside.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Social connections line of cards */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-[#302720] relative">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BEB4A8] font-bold">Follow Our Boards:</span>
            <div className="flex items-center gap-2.5">
              <a 
                href="https://pinterest.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-[#3E342B] bg-[#221A15] flex items-center justify-center text-[#BEB4A8] hover:text-white hover:bg-[#E60023] hover:border-[#E60023] transition-all cursor-pointer shadow-sm"
                title="Pinterest Curated Boards"
              >
                <PinterestIcon className="w-4 h-4 fill-current" />
              </a>
              <a 
                href="https://instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-[#3E342B] bg-[#221A15] flex items-center justify-center text-[#BEB4A8] hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce3f] hover:via-[#e1306c] hover:to-[#833ab4] hover:border-transparent transition-all cursor-pointer shadow-sm"
                title="Instagram Culinary feed"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-[#3E342B] bg-[#221A15] flex items-center justify-center text-[#BEB4A8] hover:text-white hover:bg-black hover:border-black transition-all cursor-pointer shadow-sm"
                title="TikTok video catalog"
              >
                <TikTokIcon className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>
          
          <div className="text-[#8B7C72] text-[11px] font-mono bg-[#221A15] px-4 py-1.5 rounded-full border border-[#302720]">
            <span>Platform Engine: <strong className="text-white">Next.js 15 App Router</strong></span>
          </div>
        </div>

        {/* Dynamic AdSense links and copyright */}
        <div className="flex flex-col items-center justify-between gap-8 pt-8 border-t border-[#302720]/80">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-5 text-xs text-[#BEB4A8]">
            <p className="font-sans text-center lg:text-left leading-relaxed">
              &copy; {currentYear} <strong>Dishcraft / Savory Kitchen</strong>. Defined for fine-grained sourdough metrics, editorial Pinterest layout cards, and robust software architecture blueprints.
            </p>
            <p className="flex items-center gap-1.5 font-sans text-[#BEB4A8] text-[11px] shrink-0 bg-[#27211C] px-3.5 py-1.5 rounded-full border border-[#3E342B]/80 font-semibold shadow-xs">
              Crafted in Napa with <Heart className="w-3.5 h-3.5 text-[#D4704A] fill-[#D4704A] animate-pulse" /> and Gemini intelligent API
            </p>
          </div>

          {/* AdSense compliant legal links row */}
          <nav aria-label="Legal policy links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-[#A0BCA2] font-semibold" id="footer-legal-nav">
            <Link href="/about" className="hover:text-white transition-all uppercase tracking-wider">About Desk</Link>
            <span className="text-[#3E342B]" aria-hidden="true">/</span>
            <Link href="/contact" className="hover:text-white transition-all uppercase tracking-wider">Contact</Link>
            <span className="text-[#3E342B]" aria-hidden="true">/</span>
            <Link href="/privacy-policy" className="hover:text-white transition-all uppercase tracking-wider">Privacy Policy</Link>
            <span className="text-[#3E342B]" aria-hidden="true">/</span>
            <Link href="/terms" className="hover:text-white transition-all uppercase tracking-wider">Terms &amp; Conditions</Link>
          </nav>
        </div>

      </div>
    </footer>
  );
}

