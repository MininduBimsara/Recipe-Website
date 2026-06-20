import { AdUnit } from "./AdUnit";

// Header leaderboard (728×90 desktop / responsive mobile)
// Wrap in hidden md:block so it never loads above the fold on mobile, complying with AdSense policies.
export function HeaderBannerAd() {
  return (
    <div className="hidden md:block w-full">
      <AdUnit
        slotId={process.env.NEXT_PUBLIC_AD_SLOT_HEADER_BANNER ?? ""}
        format="horizontal"
        reservedHeight={90}
        className="my-4 mx-auto max-w-4xl"
      />
    </div>
  );
}

// In-article ad — placed after the 2nd instruction step or 3rd blog paragraph
export function InArticleAd() {
  return (
    <AdUnit
      slotId={process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE ?? ""}
      format="fluid"
      reservedHeight={280}
      className="my-8"
    />
  );
}

// Sidebar ad (300×250 or 300×600 on tall screens)
export function SidebarAd() {
  return (
    <AdUnit
      slotId={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR ?? ""}
      format="rectangle"
      reservedHeight={250}
      className="w-full sticky top-40"
    />
  );
}

// Below recipe card — shown after instructions end
export function BelowRecipeAd() {
  return (
    <AdUnit
      slotId={process.env.NEXT_PUBLIC_AD_SLOT_BELOW_RECIPE ?? ""}
      format="auto"
      reservedHeight={250}
      className="my-8"
    />
  );
}

// Between blog posts in the feed (native/in-feed ad)
export function InFeedAd() {
  return (
    <AdUnit
      slotId={process.env.NEXT_PUBLIC_AD_SLOT_BETWEEN_POSTS ?? ""}
      format="fluid"
      reservedHeight={200}
      className="my-6"
    />
  );
}
