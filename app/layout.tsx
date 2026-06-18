import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import NewsletterPopup from '@/components/NewsletterPopup';

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
  title: 'Savory Kitchen - Cooking Blog & Structural Architecture Planner',
  description: 'An interactive, high-performance recipe & culinary blog featuring automated AI customization, complete with an interactive full-stack architecture guidebook.',
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
