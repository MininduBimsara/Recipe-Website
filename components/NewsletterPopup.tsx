'use client';

import React, { useState, useEffect } from 'react';
import { Mail, X, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only show once per session
    const alreadyShown = sessionStorage.getItem('rf_newsletter_shown');
    if (alreadyShown === 'true') return;

    // Trigger popup after exactly 45 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('rf_newsletter_shown', 'true');
    }, 45000); // 45000ms = 45 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscribed(true);
        toast.success('Welcome to our newsletter! 📬', {
          id: 'newsletter-toast',
        });
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        toast.error(data.error || 'Subscription failed. Please retry.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed. Please retry later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 print:hidden" id="newsletter-popup-wrap">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-espresso-dark/60 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-[#FAF7F2] dark:bg-[#1E1E1E] rounded-3xl p-6 sm:p-8 border border-cream-dark dark:border-stone-850 shadow-2xl space-y-6 text-left overflow-hidden"
          >
            {/* Visual design accent ring */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-sage/5 dark:bg-sage/10 rounded-full blur-xl pointer-events-none" />

            {/* Exit Close controller */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-espresso dark:text-stone-500 dark:hover:text-cream rounded-full transition-colors cursor-pointer"
              title="Close subscription dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {subscribed ? (
              <div className="space-y-4 py-6 text-center">
                <div className="w-12 h-12 bg-sage/10 text-sage dark:text-sage-light flex items-center justify-center rounded-full mx-auto">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-xl text-espresso dark:text-cream">
                    You Are Signed Up!
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
                    Check your inbox soon for fresh recipes, cooking tips, and seasonal ideas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 bg-terracotta/15 px-2.5 py-1 rounded-full text-[10px] font-mono text-terracotta dark:text-terracotta-light font-bold uppercase tracking-widest">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Kitchen Newsletter</span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-espresso dark:text-cream leading-tight">
                    Get weekly recipes in your inbox
                  </h3>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
                  Join our list of home cooks. Receive weekly recipes, quick weeknight dinner ideas, and helpful kitchen tips direct to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      disabled={isLoading}
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white dark:bg-[#150A05] border border-cream-dark dark:border-stone-800 text-stone-800 dark:text-cream text-xs rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-terracotta transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-1.5 top-1.5 p-2 bg-espresso dark:bg-cream hover:bg-terracotta dark:hover:bg-terracotta text-cream dark:text-espresso hover:text-white dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Subscribe"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="block text-[9px] text-center text-stone-400 dark:text-stone-400 font-sans font-medium uppercase tracking-wide">
                    🔒 Respect secure content policy • One-click cancel instantly
                  </span>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
