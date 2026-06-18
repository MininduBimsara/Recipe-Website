'use client';

import React from 'react';
import { toast } from 'react-hot-toast';

interface PinterestShareButtonProps {
  recipe: {
    title: string;
    description: string;
    image: string; // matches recipe.image (which maps to recipe.coverImage)
    pinterestDescription?: string;
  };
  className?: string;
}

export default function PinterestShareButton({ recipe, className = '' }: PinterestShareButtonProps) {
  const handlePin = () => {
    if (typeof window === 'undefined') return;

    const pageUrl = window.location.href;
    const coverImage = recipe.image;
    const pDescription = recipe.pinterestDescription || recipe.description || recipe.title;

    const queryParams = new URLSearchParams({
      url: pageUrl,
      media: coverImage,
      description: pDescription,
    });

    const pinterestUrl = `https://pinterest.com/pin/create/button/?${queryParams.toString()}`;

    // Open in a popup window (600x700) using window.open()
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
    <button
      onClick={handlePin}
      className={`px-3.5 py-2 bg-[#E60023] hover:bg-[#AD0018] text-white rounded-full font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs ${className}`}
      title="Save to Pinterest"
    >
      <svg className="w-3.5 h-3.5 fill-current grayscale-0" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.868-2.062-4.876-5.006-4.876-3.41 0-5.411 2.558-5.411 5.2 0 1.029.397 2.133.892 2.733.098.118.112.222.083.339l-.341 1.401c-.055.228-.182.277-.42.165-1.572-.733-2.555-3.033-2.555-4.881 0-3.974 2.887-7.623 8.322-7.623 4.37 0 7.768 3.114 7.768 7.278 0 4.341-2.737 7.834-6.536 7.834-1.277 0-2.477-.663-2.887-1.446l-.787 3.002c-.285 1.096-1.054 2.47-1.569 3.3l1.103.328C18.835 24 24 18.835 24 12 24 5.373 18.835 0 12 0C12 0 12 0 12 0z" />
      </svg>
      <span>Pin It</span>
    </button>
  );
}
