'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFavorites } from '@/hooks/useFavorites';

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.868-2.062-4.876-5.006-4.876-3.41 0-5.411 2.558-5.411 5.2 0 1.029.397 2.133.892 2.733.098.118.112.222.083.339l-.341 1.401c-.055.228-.182.277-.42.165-1.572-.733-2.555-3.033-2.555-4.881 0-3.974 2.887-7.623 8.322-7.623 4.37 0 7.768 3.114 7.768 7.278 0 4.341-2.737 7.834-6.536 7.834-1.277 0-2.477-.663-2.887-1.446l-.787 3.002c-.285 1.096-1.054 2.47-1.569 3.3l1.103.328C18.835 24 24 18.835 24 12 24 5.373 18.835 0 12 0z"/>
  </svg>
);

const GourmetLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Clean circular border */}
    <circle cx="50" cy="50" r="44" strokeWidth="1.5" className="stroke-terracotta/40" />
    <circle cx="50" cy="50" r="39" strokeWidth="1" strokeDasharray="2 2" className="stroke-stone-350" />
    {/* Elegant stylized olive branch/herb leaf passing through */}
    <path d="M50 24 C38 34 38 52 50 74 C62 52 62 34 50 24 Z" className="fill-sage/10 stroke-sage" strokeWidth="2" />
    <path d="M50 24 L50 74" className="stroke-sage" strokeWidth="1.5" />
    {/* Balanced circular buds that reflect ratings/guides */}
    <circle cx="50" cy="34" r="2" className="fill-honey stroke-none" />
    <circle cx="44" cy="46" r="1.5" className="fill-terracotta stroke-none" />
    <circle cx="56" cy="46" r="1.5" className="fill-terracotta stroke-none" />
  </svg>
);

export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { favorites } = useFavorites();

  // Prevent hydration mismatch
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Blog', href: '/blog' },
    { name: 'Search', href: '/search' }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);

    // If traveling to dedicated subpages (blog, recipes, search, home)
    if (href === '/blog' || href === '/recipes' || href === '/search' || href === '/') {
      if (pathname === href) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Directing queries to home page anchors if we are in search or blog pages
    if (pathname !== '/' && href.startsWith('/#')) {
      e.preventDefault();
      router.push(href);
      return;
    }

    // Inside the home page - scroll smoothly
    if (href.startsWith('/#')) {
      const elementId = href.replace('/#', '');
      const target = document.getElementById(elementId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 border-b print:hidden ${
          scrolled 
            ? 'py-2.5 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md shadow-sm border-cream-dark/50 dark:border-stone-800' 
            : 'py-4 bg-white dark:bg-[#1A1A1A] border-cream-dark dark:border-stone-800'
        }`}
        id="global-header"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LEFT: Logo — the blog name in Playfair Display with a small leaf SVG icon */}
          <a 
            href="/" 
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-cream dark:bg-stone-850 flex items-center justify-center transition-all duration-300 group-hover:scale-105 border border-cream-dark dark:border-stone-800">
              <GourmetLogoIcon className="w-7 h-7 text-sage group-hover:text-terracotta transition-colors duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-tight tracking-tight text-espresso dark:text-cream">
                Savory Kitchen
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400">
                Easy Home Recipes
              </span>
            </div>
          </a>

          {/* CENTRE: Nav links — hide on mobile, replace with helicopter hum menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs uppercase tracking-widest font-mono text-stone-600 dark:text-stone-300 hover:text-terracotta dark:hover:text-terracotta transition-colors relative group py-2 font-bold"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* RIGHT: Search, Dark Mode, Pinterest Follow, Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            
            {/* Search Icon button */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 overflow-hidden pr-2"
                  >
                    <input
                      type="text"
                      placeholder="Search recipes..."
                      className="w-full bg-cream dark:bg-stone-800 border border-cream-dark dark:border-stone-700 rounded-full px-3 py-1 text-xs focus:outline-none focus:border-terracotta text-stone-800 dark:text-cream font-sans"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.currentTarget as HTMLInputElement).value;
                          setSearchOpen(false);
                          router.push('/search?q=' + encodeURIComponent(val));
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-600 dark:text-stone-300 hover:text-terracotta dark:hover:text-terracotta cursor-pointer transition-colors"
                title="Search regional archive"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

             {/* Bookmarks Counter (Quick link to favorites subpage) */}
            <Link 
              href="/favorites"
              className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-terracotta dark:hover:text-terracotta group cursor-pointer"
              title="Show Saved Recipes collection"
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-terracotta text-terracotta' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-cream text-[8px] font-bold rounded-full flex items-center justify-center border border-white dark:border-stone-900">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Pinterest follow button (red, with Pinterest SVG icon) */}
            <a
              href="https://pinterest.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E60023] hover:bg-[#AD0018] text-white text-[11px] font-bold uppercase tracking-wider font-mono cursor-pointer transition-all shadow-sm"
              title="Follow our Board"
            >
              <PinterestIcon className="w-3.5 h-3.5 fill-white" />
              <span>Follow</span>
            </a>

            {/* Hamburger Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-stone-600 dark:text-stone-300 hover:text-terracotta dark:hover:text-terracotta cursor-pointer transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-IN DRAWER MENU with Framer Motion (x: -100% → 0) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden print:hidden" id="mobile-drawer-root">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#150A05]/60 backdrop-blur-xs"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-[#1A1A1A] p-6 flex flex-col justify-between shadow-2xl border-r border-cream-dark dark:border-stone-800"
            >
              <div className="space-y-8">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-cream-dark dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <GourmetLogoIcon className="w-6 h-6 text-sage" />
                    <span className="font-serif font-bold text-base text-espresso dark:text-cream">Savory Kitchen</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-stone-400 dark:text-stone-500 hover:text-espresso dark:hover:text-cream cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Bar for Mobile Drawer */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    className="w-full bg-cream dark:bg-stone-800 border border-cream-dark dark:border-stone-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-terracotta text-stone-800 dark:text-cream font-sans"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.currentTarget as HTMLInputElement).value;
                        setMobileMenuOpen(false);
                        router.push('/search?q=' + encodeURIComponent(val));
                      }
                    }}
                  />
                  <Search className="absolute right-3.5 top-2.5 w-4.5 h-4.5 text-stone-400" />
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-4">
                  {[
                    ...navLinks,
                    { name: 'About', href: '/about' },
                    { name: 'Contact', href: '/contact' }
                  ].map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="flex items-center justify-between py-2 text-stone-700 dark:text-stone-300 font-serif font-semibold text-sm hover:text-terracotta dark:hover:text-terracotta border-b border-cream-dark/30 dark:border-stone-800/20"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer info / Pinterest Link */}
              <div className="space-y-4 pt-4 border-t border-cream-dark dark:border-stone-800">
                {/* Secondary compliance links to qualify for AdSense reviews */}
                <div className="flex items-center justify-center gap-4 text-[11px] font-sans font-semibold text-stone-500 mb-1" id="drawer-legal-bar">
                  <a href="/privacy-policy" onClick={(e) => handleLinkClick(e, '/privacy-policy')} className="hover:text-terracotta transition-colors">
                    Privacy Policy
                  </a>
                  <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
                  <a href="/terms" onClick={(e) => handleLinkClick(e, '/terms')} className="hover:text-terracotta transition-colors">
                    Terms
                  </a>
                </div>

                <a
                  href="https://pinterest.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E60023] hover:bg-[#AD0018] text-white text-xs font-bold uppercase tracking-wider font-mono cursor-pointer transition-colors shadow-sm"
                >
                  <PinterestIcon className="w-4.5 h-4.5 fill-white" />
                  <span>Follow on Pinterest</span>
                </a>
                <p className="text-[10px] text-center text-stone-500 dark:text-stone-400 tracking-wide font-sans">
                  Savory Kitchen • 2026
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
