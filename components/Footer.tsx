'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
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
      toast.error('Please enter a valid email address.');
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
        toast.error('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1A1613] text-[#F3ECE4] border-t border-[#D4704A]/25 pt-16 pb-12 px-6 print:hidden font-sans overflow-hidden" id="global-footer">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-[#D4704A]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Top: Brand info and Newsletter side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start pb-10 border-b border-stone-850">
          
          {/* Brand Info */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center font-serif font-black text-sm">
                S
              </span>
              <span className="font-serif font-bold text-lg text-white tracking-tight">
                Savory Kitchen
              </span>
            </div>
            <p className="text-[#BEB4A8] text-xs leading-relaxed max-w-sm">
              We share simple, tested recipes and warm cooking guides to help home cooks create delicious meals with confidence. No complicated kitchen science, just good food.
            </p>
            
            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://pinterest.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#221A15] border border-stone-800 flex items-center justify-center text-[#BEB4A8] hover:text-white hover:bg-[#E60023] hover:border-transparent transition-all cursor-pointer shadow-xs"
                title="Pinterest"
              >
                <PinterestIcon className="w-3.5 h-3.5 fill-current" />
              </a>
              <a 
                href="https://instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#221A15] border border-stone-800 flex items-center justify-center text-[#BEB4A8] hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce3f] hover:via-[#e1306c] hover:to-[#833ab4] hover:border-transparent transition-all cursor-pointer shadow-xs"
                title="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://tiktok.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#221A15] border border-stone-800 flex items-center justify-center text-[#BEB4A8] hover:text-white hover:bg-black hover:border-transparent transition-all cursor-pointer shadow-xs"
                title="TikTok"
              >
                <TikTokIcon className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4 text-left md:pl-6">
            <h4 className="font-serif font-bold text-sm text-white">Join Our Kitchen Newsletter</h4>
            <p className="text-[#BEB4A8] text-xs leading-relaxed max-w-sm">
              Subscribe to get fresh recipes, seasonal cooking ideas, and kitchen tips delivered straight to your inbox weekly.
            </p>
            <form onSubmit={handleSubscribe} className="max-w-sm">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address..."
                  disabled={subscribed}
                  className="w-full bg-[#27211C] border border-[#3E342B] focus:border-[#D4704A] text-white placeholder-[#8B7C72] text-xs rounded-xl px-4 py-3 pr-12 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || subscribed}
                  className="absolute right-2 p-1.5 text-[#BEB4A8] hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                  title="Subscribe"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] font-sans text-sage pt-2 font-semibold">
                  ✓ Welcome! Fresh recipes will be on the way.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom links and copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 text-xs text-[#BEB4A8]">
          <p className="text-center sm:text-left">
            &copy; {currentYear} <strong>Savory Kitchen</strong>. Simple and delicious recipes for home cooks.
          </p>
          
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/recipes" className="hover:text-white transition-colors">Recipes</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
