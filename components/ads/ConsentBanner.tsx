"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ConsentBanner() {
  const [consent, setConsent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const isEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    setConsent(localStorage.getItem("rf_consent"));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAccept = () => {
    localStorage.setItem("rf_consent", "accepted");
    setConsent("accepted");
    // Force a reload or notify active ad units to mount/render
    window.location.reload();
  };

  const handleReject = () => {
    localStorage.setItem("rf_consent", "rejected");
    setConsent("rejected");
    // Reload to ensure script doesn't load and placeholders align
    window.location.reload();
  };

  return (
    <>
      {/* Conditionally load Google AdSense script ONLY when consent is accepted */}
      {consent === "accepted" && isEnabled && publisherId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}

      {/* Renders banner only if no choice is stored in localStorage yet */}
      {consent === null && (
        <div 
          className="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-6 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-cream-dark dark:border-stone-800 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in font-sans text-left"
          id="adsense-consent-banner"
        >
          <div className="max-w-3xl space-y-1.5">
            <h4 className="font-serif font-bold text-sm md:text-base text-espresso dark:text-cream leading-tight">
              Cookie and Ad Preferences
            </h4>
            <p className="text-stone-600 dark:text-stone-400 text-[11px] md:text-xs leading-relaxed">
              We use cookies and third-party tools to improve our website experience and show relevant cooking tips and advertisements. 
              By clicking &ldquo;Accept All&rdquo;, you consent to the use of cookies and customized advertising campaigns. 
              You can reject non-essential parameters at any time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2.5 rounded-xl border border-cream-dark dark:border-stone-800 hover:bg-cream-light/30 dark:hover:bg-stone-800/40 text-stone-700 dark:text-stone-300 font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 rounded-xl bg-espresso dark:bg-cream text-cream dark:text-espresso hover:bg-terracotta dark:hover:bg-terracotta hover:text-white dark:hover:text-white font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </div>
      )}
    </>
  );
}
