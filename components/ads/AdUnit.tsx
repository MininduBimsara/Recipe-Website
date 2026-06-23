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

  // Don't render anything until hydrated — avoids blank space flash during SSR
  if (!mounted) return null;

  // Ads disabled or missing config/consent
  if (!isEnabled || !publisherId || !slotId || consent !== "accepted") {
    if (!showPlaceholders) return null;

    const statusText =
      consent === "rejected"
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

  // Enforce Google AdSense content policies:
  // MAX 3 display ads per page — do not add more placements.
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
