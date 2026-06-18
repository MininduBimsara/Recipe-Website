import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Clock, Lightbulb, ArrowRight } from 'lucide-react';

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.868-2.062-4.876-5.006-4.876-3.41 0-5.411 2.558-5.411 5.2 0 1.029.397 2.133.892 2.733.098.118.112.222.083.339l-.341 1.401c-.055.228-.182.277-.42.165-1.572-.733-2.555-3.033-2.555-4.881 0-3.974 2.887-7.623 8.322-7.623 4.37 0 7.768 3.114 7.768 7.278 0 4.341-2.737 7.834-6.536 7.834-1.277 0-2.477-.663-2.887-1.446l-.787 3.002c-.285 1.096-1.054 2.47-1.569 3.3l1.103.328C18.835 24 24 18.835 24 12 24 5.373 18.835 0 12 0z" />
  </svg>
);

export const metadata: Metadata = {
  title: "About Minindu Bimsara | Dishcraft",
  description: "Meet Minindu Bimsara, the recipe developer and food writer behind Dishcraft. Learn about the story behind the blog and the philosophy behind every recipe.",
};

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-stone-900 min-h-screen text-espresso dark:text-[#E2DED5]" id="about-page-main">
      
      {/* SECTION 1 — HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12 flex flex-col items-center text-center space-y-6" id="about-hero">
        <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-terracotta">
          The person behind the recipes
        </span>
        <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl max-w-2xl leading-tight">
          Hi, I&apos;m Minindu Bimsara
        </h1>
        <p className="font-sans text-base sm:text-lg max-w-xl text-stone-605 dark:text-stone-300">
          Recipe developer, home cook, and the person who actually does the dishes after every shoot.
        </p>
        
        <div className="pt-4 flex flex-col items-center space-y-3">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-cream-dark dark:border-stone-800 shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=350"
              alt="Minindu Bimsara Portrait"
              fill
              className="object-cover"
              sizes="160px"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-sm">Minindu Bimsara</h4>
            <p className="font-mono text-[11px] uppercase tracking-widest text-stone-500">
              Based in Colombo, cooking since forever
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — THE STORY */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-cream-dark/50 dark:border-stone-800/50" id="about-story">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Left Column - Quote */}
          <div className="md:col-span-5 md:sticky md:top-28">
            <blockquote className="font-serif italic text-2xl sm:text-3xl text-terracotta leading-snug tracking-tight">
              &ldquo;Every recipe on this site has been made in my actual kitchen, eaten at my actual table, and adjusted until it was worth making again.&rdquo;
            </blockquote>
          </div>

          {/* Right Column - Text */}
          <div className="md:col-span-7 font-sans text-stone-705 dark:text-stone-300 text-sm sm:text-base leading-relaxed space-y-6">
            <p>
              My journey in the kitchen didn&apos;t start in a pristine culinary institute. It began right at home, surrounded by the warm, earthy aromas of cardamoms, cinnamon spice blends, and the daily rhythm of pan-searing. Moving into my own kitchen, I realized that cooking at home should feel like an enriching act of craft, rather than a frantic exercise. 
            </p>
            <p>
              I started <strong>Dishcraft</strong> in 2025 because I got tired of recipe websites cluttered with auto-generated content and unreliable guides. Out of that frustration, this digital catalog was born—a pristine archive where heirloom baking ratios, flour hydration scales, and artisanal thermal techniques are meticulously documented and made accessible to everyone.
            </p>
            <p>
              Whether you are an aspiring baker aiming for that perfect bubbly crumb structure or a busy professional preparing comforting table-side meals, I write with you in mind. No restaurant secrets are locked away in gatekeeping courses. Everything is laid out transparently and structured clearly for dynamic scaling.
            </p>
            <p>
              And to share a quick kitchen disaster story that keeps me humble: I once accidentally baked a premium artisanal levain loaf with three tablespoons of active citric acid instead of salt. Let&apos;s just say, wild yeast does not enjoy a sour environment that intense!
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3 — WHAT YOU'LL FIND HERE */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-cream-dark/50 dark:border-stone-800/50 space-y-10" id="about-offerings">
        <div className="text-center md:text-left space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-sage font-bold">The Editorial Standard</span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">How we construct recipes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-cream-dark dark:border-stone-800 space-y-4 shadow-3xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-sage/10 text-sage flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base">Tested recipes</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Every recipe is made at least twice before it goes up. I write down what went wrong the first time so you don&apos;t have to find out.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-cream-dark dark:border-stone-800 space-y-4 shadow-3xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-honey/10 text-honey flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base">Real time estimates</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Prep times are real, not aspirational. I time myself, not a professional kitchen with three sous chefs prepping beforehand.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-cream-dark dark:border-stone-800 space-y-4 shadow-3xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base">Chef&apos;s secrets included</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                The key tips that make the actual difference are always written clearly in the recipe, never hidden or locked in a paid tutorial.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4 — LET'S CONNECT */}
      <section className="bg-cream dark:bg-stone-850 py-16 px-6" id="about-cta">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-espresso dark:text-cream tracking-tight">
            Want to get in touch?
          </h2>
          <p className="font-sans text-stone-605 dark:text-stone-305 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Whether you tried a recipe, have a question, or just want to say hi—I genuinely read every single message and answer personally.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-espresso text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-terracotta transition-colors shadow-3xs hover:shadow-xs focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              <span>Send me a message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://pinterest.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-stone-800 hover:bg-stone-50 text-stone-700 dark:text-stone-200 text-xs font-mono font-bold uppercase tracking-widest rounded-xl border border-cream-dark dark:border-stone-700 transition-colors shadow-3xs"
            >
              <PinterestIcon className="w-4 h-4 text-[#E60023]" />
              <span>Follow on Pinterest</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 5 — QUICK FACTS */}
      <section className="bg-white dark:bg-stone-900 py-10 px-6" id="about-facts">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-[11px] sm:text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest space-y-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-bold leading-relaxed">
            <span>Based in Colombo, Sri Lanka</span>
            <span className="hidden sm:inline">•</span>
            <span>Blogging since 2025</span>
            <span className="hidden sm:inline">•</span>
            <span>Recipes tested: 100+</span>
            <span className="hidden sm:inline">•</span>
            <span>Favourite dish: Artisanal sourdough & spicy street curries</span>
          </p>
        </div>
      </section>

    </main>
  );
}
