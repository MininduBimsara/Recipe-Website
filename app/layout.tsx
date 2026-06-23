import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import NewsletterPopup from '@/components/NewsletterPopup';
import ConsentBanner from '@/components/ads/ConsentBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pebbleplate.page'),
  title: 'PebblePlate - Easy Home Recipes & Cooking Guides',
  description: 'Explore simple, kitchen-tested recipes, weekend baking ideas, and helpful cooking tips for home cooks of all skill levels.',
  openGraph: {
    type: 'website',
    title: 'PebblePlate - Easy Home Recipes & Cooking Guides',
    description: 'Explore simple, kitchen-tested recipes, weekend baking ideas, and helpful cooking tips for home cooks of all skill levels.',
    url: 'https://pebbleplate.page',
    siteName: 'PebblePlate',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PebblePlate - Easy Home Recipes & Cooking Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PebblePlate - Easy Home Recipes & Cooking Guides',
    description: 'Explore simple, kitchen-tested recipes, weekend baking ideas, and helpful cooking tips for home cooks of all skill levels.',
    images: ['/og-image.png'],
  },
  other: {
    "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "",
    "p:domain_verify": "71f28e7dfb70d839994868e5b51ff611",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white dark:bg-[#1A1A1A] text-espresso dark:text-[#F0EBE3] flex flex-col justify-between" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          <Header />
          <div className="flex-1 w-full flex flex-col">
            {children}
          </div>
          <Footer />
          <NewsletterPopup />
          <ConsentBanner />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'dark:bg-stone-850 dark:text-cream dark:border-stone-750 font-sans text-xs',
              duration: 4000,
              style: {
                borderRadius: '12px',
                background: '#2C1810',
                color: '#FAF7F2',
                border: '1px solid #FAF7F2',
                fontSize: '13px',
              }
            }} 
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
