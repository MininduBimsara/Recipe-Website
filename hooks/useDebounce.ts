'use client';

import { useState, useEffect } from 'react';

/**
 * Standard utility hook to debounce dynamic values. Often used to avoid rapid, 
 * performance-heavy queries in search boxes.
 * 
 * @param value - The value to debounce.
 * @param delay - Time delay in milliseconds.
 * @returns The debounced representation of the input value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
