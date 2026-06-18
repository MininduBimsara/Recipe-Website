'use client';

import React from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface PinGraphicCardProps {
  slug: string;
  imageUrl: string;
  title: string;
  description?: string;
}

export default function PinGraphicCard({ slug, imageUrl, title, description }: PinGraphicCardProps) {
  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const pageUrl = `${window.location.origin}/recipes/${slug}`;
    const coverImage = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;
    const pDescription = description || `Save this delicious recipe for ${title} to make later!`;

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
      toast.error('Popup blocker active. Please allow popups for Pinterest.');
    }
  };

  return (
    <div 
      onClick={handlePin}
      className="group relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-cream-dark/65 bg-espresso text-cream flex flex-col justify-end p-6 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Background Recipe Image */}
      <Image
        src={imageUrl}
        alt={`Pin this ${title} recipe`}
        fill
        className="object-cover opacity-75 group-hover:scale-102 transition-transform duration-700 ease-out brightness-[0.7]"
        referrerPolicy="no-referrer"
      />

      {/* Styled Overlay Content */}
      <div className="relative z-10 space-y-3 text-left">
        <span className="inline-block text-[10px] font-mono tracking-widest uppercase bg-[#E60023] text-white px-3 py-1 rounded-full font-bold shadow-xs">
          📌 Save to Pinterest
        </span>
        <h4 className="font-serif font-black text-2xl leading-tight text-white drop-shadow-sm group-hover:text-cream transition-colors">
          Pin This {title} Recipe
        </h4>
        <p className="text-stone-300 text-xs font-sans leading-relaxed line-clamp-3">
          Love this? Tap here to pin this recipe and save it to your favorite food board for later!
        </p>
        
        {/* Call to action trigger */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-espresso font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl group-hover:bg-[#E60023] group-hover:text-white transition-colors duration-300">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.868-2.062-4.876-5.006-4.876-3.41 0-5.411 2.558-5.411 5.2 0 1.029.397 2.133.892 2.733.098.118.112.222.083.339l-.341 1.401c-.055.228-.182.277-.42.165-1.572-.733-2.555-3.033-2.555-4.881 0-3.974 2.887-7.623 8.322-7.623 4.37 0 7.768 3.114 7.768 7.278 0 4.341-2.737 7.834-6.536 7.834-1.277 0-2.477-.663-2.887-1.446l-.787 3.002c-.285 1.096-1.054 2.47-1.569 3.3l1.103.328C18.835 24 24 18.835 24 12 24 5.373 18.835 0 12 0C12 0 12 0 12 0z" />
            </svg>
            <span>Pin Recipe</span>
          </span>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/35 to-black/10 pointer-events-none" />
    </div>
  );
}
