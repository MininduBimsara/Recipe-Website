"use client";

import { useEffect, useRef, useState } from "react";

type AdFormat = "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";

interface AdUnitProps {
  slotId: string;
  format?: AdFormat;
  className?: string;
  /** Reserve this height in px to prevent layout shift while ad loads */
  reservedHeight?: number;
}

export function AdUnit({ slotId, format = "auto", className, reservedHeight = 250 }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [consent, setConsent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const isEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const showPlaceholders = process.env.NEXT_PUBLIC_ADSENSE_SHOW_PLACEHOLDERS === "true";

  useEffect(() => {
    setConsent(localStorage.getItem("rf_consent"));
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only push to adsbygoogle if ads are enabled, consent is accepted, and publisher / slot IDs are set
    if (!mounted || !isEnabled || !publisherId || !slotId || consent !== "accepted") {
      return;
    }

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, [mounted, consent, isEnabled, publisherId, slotId]);

  // If component is not mounted, render empty container to preserve spacing
  if (!mounted) {
    return (
      <div
        style={{ minHeight: reservedHeight }}
        className={`ad-placeholder ${className ?? ""}`}
        aria-hidden="true"
      />
    );
  }

  // When ads are disabled or config/consent is missing: render a reserved placeholder
  if (!isEnabled || !publisherId || !slotId || consent !== "accepted") {
    if (showPlaceholders) {
      const statusText = consent === "rejected" 
        ? "Consent Rejected" 
        : consent === "accepted" 
          ? "Ads Disabled" 
          : "Pending Consent";
      return (
        <div
          style={{ minHeight: reservedHeight }}
          className={`ad-placeholder border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 flex flex-col items-center justify-center rounded-2xl p-4 text-center my-6 select-none ${className ?? ""}`}
          aria-hidden="true"
        >
          <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-1">
            Advertisement Slot ({statusText})
          </span>
          <span className="text-[9px] font-mono text-stone-500 dark:text-stone-400 block truncate max-w-full">
            ID: {slotId || "None"}
          </span>
        </div>
      );
    }

    return (
      <div
        style={{ minHeight: reservedHeight }}
        className={`ad-placeholder ${className ?? ""}`}
        aria-hidden="true"
      />
    );
  }

  // Enforce Google AdSense content policies in code:
  // 1. MAX 3 display ads per page - Placements across templates respect this limit.
  // Warning for future developers: DO NOT add more than 3 display ads per page.
  // 2. Ensure clear policy labeling: render "Advertisement" above every active ad container.
  return (
    <div className={`ad-wrapper overflow-hidden my-6 select-none ${className ?? ""}`}>
      <p className="text-[10px] text-stone-400 dark:text-stone-500 text-center mb-1 font-mono uppercase tracking-wider">
        Advertisement
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: reservedHeight }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
