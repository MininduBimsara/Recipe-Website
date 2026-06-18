'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rf_recently_viewed';

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  const loadRecentlyViewed = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to parse recently viewed recipes:', err);
    }
  }, []);

  useEffect(() => {
    loadRecentlyViewed();
  }, [loadRecentlyViewed]);

  const addRecentlyViewed = useCallback((slug: string) => {
    if (typeof window === 'undefined' || !slug) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: string[] = [];
      if (stored) {
        list = JSON.parse(stored) as string[];
      }

      // Filter out duplicate to move it to the front
      const filtered = list.filter((s) => s !== slug);
      const updated = [slug, ...filtered].slice(0, 6);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentlyViewed(updated);
    } catch (err) {
      console.error('Failed to update recently viewed:', err);
    }
  }, []);

  return {
    recentlyViewed,
    addRecentlyViewed,
  };
}
