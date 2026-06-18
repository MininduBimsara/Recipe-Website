import React from 'react';
import { Metadata } from 'next';
import LegalPageWrapper from '@/components/LegalPageWrapper';

export const metadata: Metadata = {
  title: "Privacy Policy | Savory Kitchen",
  description: "Privacy Policy for Savory Kitchen. Learn how we collect, use, and protect your personal information and browser cookie metrics.",
};

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = "June 16, 2026";
  
  return (
    <main id="privacy-policy-view">
      <LegalPageWrapper 
        eyebrow="Legal" 
        title="Privacy Policy" 
        lastUpdated={lastUpdatedDate}
      >
        <p>
          At <strong>Savory Kitchen</strong>, accessible at <a href="https://savorykitchen.com" className="hover:text-terracotta underline">https://savorykitchen.com</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains the types of information collected and recorded by Savory Kitchen and how we use it. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
        </p>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            1. Information we collect
          </h2>
          <p>
            Savory Kitchen is dedicated to maintaining high standards of data minimisation. When you register for our weekly newsletter, request culinary customizations via our AI, or submit inquiries through the contact form, we collect information that you explicitly submit, such as your name and email address.
          </p>
          <p>
            When you visit the site, certain technical metrics are cataloged automatically. This includes standard network communication protocol logs, which might contain your IP address, browser footprint, operating systems, and basic interactive metadata. We do not sell, rent, or distribute this personal information to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            2. Log files
          </h2>
          <p>
            Savory Kitchen follows a standard procedure of using log files. These files log visitors when they navigate websites. All hosting providers perform this as a part of standard analytics tracking and modern security audits. 
          </p>
          <p>
            The information collected by log files includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamps, referring/exit pages, and optionally the number of clicks. These metrics are completely decoupled from any personally identifiable information and are strictly analysed to monitor website performance, troubleshoot server errors, and manage general site administration.
          </p>
        </section>

        <section className="space-y-4 border-l-2 border-terracotta/40 pl-4 py-1">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pr-2">
            3. Cookies and Web Beacons
          </h2>
          <p>
            Like many other modern food blogs, Savory Kitchen uses &apos;cookies&apos; to enrich reader experiences. These cookies store individual preferences, selected unit adjustments (such as Metric or US Customary choices), and specific pages visited by the reader. 
          </p>
          <p>
            <strong>Critical Disclosure regarding Advertising Partners:</strong> Third-party advertising partners, including Google, may use cookies to serve advertisements based on your prior visits to this website or other platforms on the internet. Google&apos;s use of specialised advertising cookies enables it and its allied ad partners to display advertising tailored directly to your cooking, food, and design interests. Guests can opt out of personalised advertising at any time by configuring their browser and visiting Google&apos;s Ads Settings page: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta underline">https://www.google.com/settings/ads</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            4. Google AdSense & Monetisation
          </h2>
          <p>
            We use Google AdSense as an advertising provider to display relevant programmatic commercials to our readers. AdSense helps support the site so we can continue creating new recipes and guides free of charge.
          </p>
          <p>
            Google AdSense may deploy DART cookies to index page coordinates and serve appropriate ad placements based on your internet footprint. AdSense operates as an autonomous data collection agent in this capacity. To learn more about how Google safeguards and utilizes web parameters when you browse Savory Kitchen, you can read their official partner site policy guidelines at: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta underline">https://policies.google.com/technologies/partner-sites</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            5. Google Analytics Services
          </h2>
          <p>
            We leverage Google Analytics as an underlying service framework to monitor and measure performance traffic. Google Analytics deposits cookies on your browser to measure how visitors interact with our site, such as pages visited and time spent on recipes. This helps us improve our content and layout.
          </p>
          <p>
            All gathered metrics exist purely as aggregated, anonymized trends. You may opt out of this system by installing the official Google Analytics Opt-out Browser Add-on in your active browser client.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            6. Third-Party Links & Off-site Redirection
          </h2>
          <p>
            Savory Kitchen may display relevant links pointing to external sites, such as curated Pinterest boards, affiliate shopping products, or food science research papers. This Privacy Policy is strictly limited to parameters indexed on <a href="https://savorykitchen.com" className="hover:text-terracotta underline">https://savorykitchen.com</a>. 
          </p>
          <p>
            We encourage you to inspect the respective legal pages and cookie policies of any third-party website you visit, as we do not govern their operational data routines.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            7. Protection of Children&apos;s Privacy
          </h2>
          <p>
            We place a high value on protecting children as they navigate online portals. Savory Kitchen does not knowingly collect, index, or request any personal identification variables from children under the age of 13.
          </p>
          <p>
            If you are a parent or legal guardian and discover that your minor has submitted personal metrics to our server registry, we advise you to contact us immediately at <a href="mailto:minindubim@gmail.com" className="hover:text-terracotta underline">minindubim@gmail.com</a>. We will perform immediate server-side purging of those parameters from our global database profiles.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            8. Your Privacy Rights & Opt-out Decisions
          </h2>
          <p>
            Depending on your physical location and jurisdiction (such as CCPA in California or GDPR in the EU), you are entitled to distinct visual data protections and rights. These include options to view, update, correct, or demand the deletion of any personal parameters held by Savory Kitchen.
          </p>
          <p>
            To exercise any of these compliance opt-out structures, please dispatch a short electronic mail detailing your request directly to: <a href="mailto:minindubim@gmail.com" className="hover:text-terracotta underline">minindubim@gmail.com</a>. We handle GDPR/CCPA requests without billing fees.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            9. Changes to this Privacy Policy
          </h2>
          <p>
            We reserve full rights to adjust, update, or rewrite specific clauses in this Privacy Policy to ensure alignment with state regulations or programmatic ad networks. We notify visitors of updates by refreshing the visible &quot;Last updated&quot; timestamp displayed at the top of this article.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso dark:text-cream pt-4">
            10. Contact Us
          </h2>
          <p>
            For answers to your culinary privacy queries, compliance assessments, or log explanations, please reach the desk directly via:
          </p>
          <div className="bg-cream/40 dark:bg-stone-850/40 p-5 rounded-2xl border border-cream-dark dark:border-stone-800 text-xs sm:text-sm space-y-2.5 font-mono text-stone-605 dark:text-stone-300">
            <div><span className="font-bold text-espresso dark:text-cream">Publisher:</span> Minindu Bimsara</div>
            <div><span className="font-bold text-espresso dark:text-cream">Electronic desk:</span> minindubim@gmail.com</div>
            <div><span className="font-bold text-espresso dark:text-cream">Website Home:</span> https://savorykitchen.com</div>
          </div>
        </section>

      </LegalPageWrapper>
    </main>
  );
}
