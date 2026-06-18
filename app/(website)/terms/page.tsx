import React from 'react';
import { Metadata } from 'next';
import LegalPageWrapper from '@/components/LegalPageWrapper';

export const metadata: Metadata = {
  title: "Terms & Conditions | Dishcraft",
  description: "Terms and Conditions for using Dishcraft. Read our policies on content use, disclaimers, and intellectual property protection.",
};

export default function TermsPage() {
  const lastUpdatedDate = "June 16, 2026";

  return (
    <main id="terms-conditions-view">
      <LegalPageWrapper 
        eyebrow="Legal" 
        title="Terms &amp; Conditions" 
        lastUpdated={lastUpdatedDate}
      >
        <p>
          Welcome to <strong>Dishcraft</strong>, accessible at <a href="https://dishcraft.com" className="hover:text-terracotta underline">https://dishcraft.com</a>. By accessing, bookmarking, scaling, or downloading any materials or using the interactive services hosted on this website, you agree to comply with and be bound by the following Terms and Conditions. Please review them carefully before utilizing our recipe platforms. If you do not agree with any statement herein, you must immediately halt your use of this site.
        </p>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            1. Intellectual Property &amp; Content Use
          </h2>
          <p>
            All textual descriptions, high-resolution photographs, visual recipes, structural bento elements, culinary databases, software tools, logos, and custom layout graphics shown on Dishcraft are the intellectual property of <strong>Minindu Bimsara</strong> unless otherwise explicitly credited.
          </p>
          <p>
            You are strictly forbidden from republishing complete recipes, scraping database rows, copying entire procedures, Hot-linking images, or redistributing content to other visual catalogs or print cookbooks without prior written consent. If you want to showcase our recipes on a personal portal, you may write an original paragraph and link back to the exact recipe page on Dishcraft. We deeply appreciate and support organic food community links!
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            2. Personal Use of Recipes &amp; Scaling Features
          </h2>
          <p>
            Dishcraft grants you a non-exclusive, revocable, non-transferable licence to print, bookmark, and dynamically scale ingredients recipes for non-commercial personal kitchen use. 
          </p>
          <p>
            You are welcome to bake, cook, adapt, and serve these recipes to friends, family, and home guests. However, any commercial exploitation of our exact recipe charts (e.g., using them for paid restaurant operations, pre-made meal kit packages, or paid baking courses) is prohibited unless a prior written commercial accord is formalised.
          </p>
        </section>

        <section className="space-y-4 border-l-2 border-terracotta/40 pl-4 py-1 animate-pulse">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pr-2">
            3. Disclaimer of Technical Accuracy
          </h2>
          <p>
            <strong>Critical Disclaimer for Food Blogs:</strong> Any nutritional information, caloric calculations, diet labels, prep milestones, baking schedules, and temperature advice are estimated and displayed for educational and informational purposes only. These indices do not constitute professional metabolic, chemical, or medical advice. Reader outcomes will vary depending on water mineral content, kitchen elevation, brand variations, oven performance, and individual skill.
          </p>
          <p>
            Always make sure you follow local raw food safety rules (reheating guidelines, allergen precautions, etc.). You are solely responsible for ensuring ingredients fit your personal health requirements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            4. Disclosure of Affiliate Relationships
          </h2>
          <p>
            Dishcraft participates in select culinary affiliate programmes. This means we may display curated product recommendations, baking equipment, kitchen scales, or spice kit choices that redirect you to seller platforms. We may earn a small referral commission at absolutely zero additional charge to you when you make a purchase.
          </p>
          <p>
            We only link to goods, gadgets, and stone baking surfaces that we personally use, test, and trust in our household. All sponsored material is explicitly disclosed.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            5. In-App Advertisements
          </h2>
          <p>
            We display programmatic third-party ads using Google AdSense and search channels to monetise and sustain our development operations. While we strive to screen commercials, we do not directly control individual advertisement visuals or contents. We are not liable for claims made on ad banners. Please see our Privacy Policy to understand ad cookie management.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            6. Redirects to External Websites
          </h2>
          <p>
            We include links to third-party assets, such as Pinterest, Instagram, or external culinary blogs. These links are provided for your reading convenience. Dishcraft has no authority over, and accepts no direct liability for, the practices, content accuracy, or dynamic shifts of any external site.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            7. Community Comments &amp; Review Submissions
          </h2>
          <p>
            Dishcraft provides interactive commenting nodes, star rating controls, and recipe customizing forms. By typing, reviewing, and sending a comment, you grant Dishcraft a perpetual, non-exclusive, royalty-free, global licence to display, distribute, translate, and format your thoughts.
          </p>
          <p>
            We enforce a clean-communications kitchen rule. Spambots, aggressive statements, self-promotion links, racial remarks, or comments containing offensive language will be permanently deleted without notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            8. General Limitation of Liability
          </h2>
          <p>
            Minindu Bimsara and Dishcraft, as well as our hosts and digital creators, are not legally liable for any kitchen accidents, physical injuries, allergic reactions, raw food illnesses, oven damage, burned levain loaves, or flat souffle outcomes resulting from your use of advice written on this site. You use all recipes and guides at your own leisure and risk.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            9. Amendments to Terms and Conditions
          </h2>
          <p>
            We reserve the right to modify these Terms at any time without physical notifications. By continuing to spend time on and scrape recipes from this blog after we post modifications, you express full compliance with the updated terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            10. Governing Jurisdiction
          </h2>
          <p>
            These Terms, along with any external disputes relating to recipes and Dishcraft legal processes, shall be governed by, interpreted, and resolved in accordance with the laws of <strong>Sri Lanka</strong>, under the exclusive jurisdiction of the judicial systems in <strong>Colombo</strong>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1C1A] dark:text-cream pt-4">
            11. Contact Details
          </h2>
          <p>
            For any queries or formal permission requests concerning the redistribution of our premium recipes, please send an email to:
          </p>
          <div className="bg-cream/40 dark:bg-stone-850/40 p-5 rounded-2xl border border-cream-dark dark:border-stone-800 text-xs sm:text-sm space-y-2.5 font-mono text-stone-605 dark:text-stone-300">
            <div><span className="font-bold text-espresso dark:text-cream">Publisher:</span> Minindu Bimsara</div>
            <div><span className="font-bold text-espresso dark:text-cream">Electronic desk:</span> minindubim@gmail.com</div>
            <div><span className="font-bold text-espresso dark:text-cream">Primary URL:</span> https://dishcraft.com</div>
          </div>
        </section>

      </LegalPageWrapper>
    </main>
  );
}
