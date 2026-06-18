'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RatingWidgetProps {
  recipeSlug: string;
}

export default function RatingWidget({ recipeSlug }: RatingWidgetProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [average, setAverage] = useState<number>(4.8);
  const [count, setCount] = useState<number>(12);
  const [loading, setLoading] = useState(false);

  // Load existing user rating and current average from API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user has already rated in localStorage
    const savedRatingStr = localStorage.getItem(`rf_rating_${recipeSlug}`);
    if (savedRatingStr) {
      setRating(Number(savedRatingStr));
      setHasRated(true);
    }

    // Fetch live ratings from memory-backed API route
    const fetchCurrentRatings = async () => {
      try {
        const response = await fetch(`/api/rate-recipe?slug=${recipeSlug}`);
        const data = await response.json();
        if (data.success) {
          setAverage(data.average);
          setCount(data.count);
        }
      } catch (err) {
        console.error('Failed to load live ratings:', err);
      }
    };

    fetchCurrentRatings();
  }, [recipeSlug]);

  const handleRate = async (newRating: number) => {
    if (hasRated || loading) return;

    setLoading(true);
    setRating(newRating);

    try {
      const response = await fetch('/api/rate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: recipeSlug, rating: newRating }),
      });

      const data = await response.json();

      if (data.success) {
        setAverage(data.average);
        setCount(data.count);
        setHasRated(true);

        if (typeof window !== 'undefined') {
          localStorage.setItem(`rf_rating_${recipeSlug}`, String(newRating));
        }

        toast.success(`Thank you for rating! You gave it ${newRating} stars. ⭐`);
      } else {
        toast.error('Failed to submit rating. Please try again.');
        setRating(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failure to rating server.');
      setRating(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-stone-850 border border-cream-dark dark:border-stone-800 text-left space-y-4" id={`rating-root-${recipeSlug}`}>
      <div className="space-y-1">
        <h4 className="font-serif font-bold text-sm text-espresso dark:text-cream">
          Rate This Recipe
        </h4>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
          {hasRated 
            ? "Your rating has been logged. Thank you for supporting our digital bread journal!"
            : "Share your rating with the baking community. Your feedback improves our formula."
          }
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Star Input */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((starIdx) => {
            const isHighlighted = hoveredStar !== null 
              ? starIdx <= hoveredStar 
              : rating !== null && starIdx <= rating;

            return (
              <button
                key={starIdx}
                type="button"
                onMouseEnter={() => !hasRated && setHoveredStar(starIdx)}
                onMouseLeave={() => !hasRated && setHoveredStar(null)}
                onClick={() => handleRate(starIdx)}
                disabled={hasRated || loading}
                className={`p-1 focus:outline-none transition-transform duration-100 ${
                  hasRated ? 'cursor-default' : 'hover:scale-110 cursor-pointer'
                }`}
                title={`Rate ${starIdx} stars`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    isHighlighted
                      ? 'text-honey fill-honey'
                      : 'text-stone-300 dark:text-stone-700'
                  }`}
                />
              </button>
            );
          })}

          <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400 pl-2">
            {hoveredStar ? `${hoveredStar} / 5` : rating ? `${rating} / 5` : '0 / 5'}
          </span>
        </div>

        {/* Live Aggregates */}
        <div className="text-left sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-espresso dark:text-cream">
            <Star className="w-3.5 h-3.5 text-honey fill-honey" />
            <span>{average.toFixed(1)} OUT OF 5</span>
          </div>
          <span className="text-[10px] font-mono text-stone-400 dark:text-stone-400 font-bold uppercase">
            ({count} Community Ratings)
          </span>
        </div>
      </div>
    </div>
  );
}
