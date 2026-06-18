'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks scrolling positions in real-time using IntersectionObserver to map which
 * editorial section or step is currently in focus for a dynamic side-nav table of contents.
 * 
 * @param sectionIds - List of HTML elements IDs to register.
 * @param headingSelector - Selector string to recognize sections. Defaults to "section[id]".
 * @returns The active element Id string.
 */
export function useTableOfContents(sectionIds: string[], headingSelector: string = 'section[id]') {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (sectionIds.length === 0) return;

    // We can observe the section wrapper elements
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-20% 0px -60% 0px', // triggers when section is in the upper part of the screen
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find entries that are intersecting
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
      
      if (intersectingEntries.length > 0) {
        // Find the one closest to the top of the viewport
        const topmost = intersectingEntries.reduce((prev, curr) => {
          return curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev;
        });
        setActiveId(topmost.target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeId;
}
