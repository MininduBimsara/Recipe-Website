import React from 'react';

interface LegalPageWrapperProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageWrapper({
  eyebrow,
  title,
  lastUpdated,
  children
}: LegalPageWrapperProps) {
  return (
    <article className="min-h-[80vh] w-full bg-white dark:bg-stone-900 px-6 py-16 md:py-24 flex justify-center" id="legal-layout-container">
      <div className="w-full max-w-3xl space-y-10">
        {/* Header Block */}
        <div className="space-y-4 text-center md:text-left">
          <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-terracotta" id="legal-eyebrow">
            {eyebrow}
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-espresso dark:text-white tracking-tight leading-none" id="legal-heading">
            {title}
          </h1>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <time className="font-mono text-xs text-stone-500" dateTime={lastUpdated}>
              Last updated: {lastUpdated}
            </time>
          </div>
        </div>

        {/* Decorative Divider */}
        <hr className="border-stone-200 dark:border-stone-800" />

        {/* Text Editorial Content */}
        <div className="font-sans text-stone-705 dark:text-stone-300 text-sm sm:text-base leading-relaxed space-y-8 select-text" id="legal-content-body">
          {children}
        </div>
      </div>
    </article>
  );
}
