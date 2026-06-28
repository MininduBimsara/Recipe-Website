'use client';

import React from 'react';
import { useTemplateState } from '@/components/templates/TemplateStateContext';
import { Copy } from 'lucide-react';
// import { Heart } from 'lucide-react';
// import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'react-hot-toast';

export default function StickyMobileShareBar() {
  const { post, type, handleCopyLink } = useTemplateState();
  // const { isFavorite, toggleFavorite } = useFavorites();

  if (type !== 'recipe') return null;

  // const saved = isFavorite(post.id);

  // const handleFavoriteClick = () => {
  //   toggleFavorite(post.id);
  //   if (!saved) {
  //     toast.success('Saved to your collection ♥', {
  //       style: {
  //         background: '#FFEBEA',
  //         color: '#D4704A',
  //         border: '1px solid #E59A7E',
  //       },
  //       icon: '❤️',
  //     });
  //   } else {
  //     toast(`Removed from collection`);
  //   }
  // };

  const handlePin = () => {
    if (typeof window === 'undefined') return;

    const pageUrl = window.location.href;
    const coverImage = post.image || (post.template_images && post.template_images[0]?.url);
    const pDescription = post.pinterestDescription || post.description || post.title;

    const queryParams = new URLSearchParams({
      url: pageUrl,
      media: coverImage,
      description: pDescription,
    });

    const pinterestUrl = `https://pinterest.com/pin/create/button/?${queryParams.toString()}`;

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      pinterestUrl,
      'pinterest-share-popup',
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,status=0,resizable=yes`
    );

    if (popup) {
      toast.success('Opening Pinterest Save board! 📌');
    } else {
      toast.error('Flash popup blocker active. Please allow popups for Pinterest.');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1A1A1A]/95 border-t border-cream-dark/60 dark:border-stone-850 backdrop-blur-md px-4 py-3 md:hidden flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden select-none">
      {/* Pin It (Pinterest) */}
      <button
        onClick={handlePin}
        className="flex-1 py-3 bg-[#E60023] hover:bg-[#AD0018] text-white rounded-xl font-mono text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs active:scale-98"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.868-2.062-4.876-5.006-4.876-3.41 0-5.411 2.558-5.411 5.2 0 1.029.397 2.133.892 2.733.098.118.112.222.083.339l-.341 1.401c-.055.228-.182.277-.42.165-1.572-.733-2.555-3.033-2.555-4.881 0-3.974 2.887-7.623 8.322-7.623 4.37 0 7.768 3.114 7.768 7.278 0 4.341-2.737 7.834-6.536 7.834-1.277 0-2.477-.663-2.887-1.446l-.787 3.002c-.285 1.096-1.054 2.47-1.569 3.3l1.103.328C18.835 24 24 18.835 24 12 24 5.373 18.835 0 12 0C12 0 12 0 12 0z" />
        </svg>
        <span>Pin It</span>
      </button>

      {/* Save to Collection — disabled for now */}
      {/* <button
        onClick={handleFavoriteClick}
        className={`flex-1 py-3 rounded-xl font-mono text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors border active:scale-98 ${
          saved
            ? 'bg-red-500/10 text-terracotta border-terracotta/40'
            : 'bg-white dark:bg-[#2A2A2A] text-espresso dark:text-cream border-cream-dark/60 dark:border-stone-800'
        }`}
      >
        <Heart className={`w-4 h-4 ${saved ? 'fill-terracotta text-terracotta' : 'text-stone-500'}`} />
        <span>{saved ? 'Saved' : 'Save'}</span>
      </button> */}

      {/* Copy Path / Link */}
      <button
        onClick={handleCopyLink}
        className="flex-1 py-3 bg-white dark:bg-[#2A2A2A] text-espresso dark:text-cream border border-cream-dark/60 dark:border-stone-800 rounded-xl font-mono text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-98"
      >
        <Copy className="w-4 h-4 text-sage" />
        <span>Copy URL</span>
      </button>
    </div>
  );
}
