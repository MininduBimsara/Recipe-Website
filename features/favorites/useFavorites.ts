'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rf_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error('Failed to parse favorites from localStorage:', err);
    }
  }, []);

  useEffect(() => {
    loadFavorites();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadFavorites();
      }
    };

    const handleCustomChange = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rf_favorites_updated', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rf_favorites_updated', handleCustomChange);
    };
  }, [loadFavorites]);

  const addFavorite = useCallback((id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let updated: string[] = [];
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (!parsed.includes(id)) {
          updated = [...parsed, id];
        } else {
          updated = parsed;
        }
      } else {
        updated = [id];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setFavorites(updated);
      window.dispatchEvent(new Event('rf_favorites_updated'));
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
  }, []);

  const removeFavorite = useCallback((id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        const updated = parsed.filter((favId) => favId !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setFavorites(updated);
        window.dispatchEvent(new Event('rf_favorites_updated'));
      }
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  // Backward compatibility wrapper for toggleFavorite
  const toggleFavorite = useCallback((id: string) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite, // Legacy or shorthand toggle
  };
}
