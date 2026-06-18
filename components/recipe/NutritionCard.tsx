'use client';

import React from 'react';

interface NutritionCardProps {
  calories: number;
  recipeTitle: string;
}

export default function NutritionCard({ calories, recipeTitle }: NutritionCardProps) {
  // Deterministic macro generation based on calories for realistic simulation
  const totalFat = Math.max(1, Math.round((calories * 0.35) / 9)); // Fat is 9 kcal/g
  const satFat = Math.max(0, Math.round(totalFat * 0.3));
  const cholesterol = Math.max(0, Math.round(calories * 0.15)); // mg
  const sodium = Math.max(10, Math.round(calories * 1.1)); // mg
  const totalCarb = Math.max(1, Math.round((calories * 0.45) / 4)); // Carbs are 4 kcal/g
  const fiber = Math.max(0, Math.round(totalCarb * 0.15));
  const sugars = Math.max(0, Math.round(totalCarb * 0.2));
  const protein = Math.max(1, Math.round((calories * 0.20) / 4)); // Protein is 4 kcal/g

  // Daily Value % calculations (based on standard 2,000 calorie diet guidelines)
  const totalFatDv = Math.round((totalFat / 78) * 100);
  const satFatDv = Math.round((satFat / 20) * 100);
  const cholesterolDv = Math.round((cholesterol / 300) * 100);
  const sodiumDv = Math.round((sodium / 2300) * 100);
  const totalCarbDv = Math.round((totalCarb / 275) * 100);
  const fiberDv = Math.round((fiber / 28) * 100);

  return (
    <div className="w-full bg-white dark:bg-stone-850 p-6 rounded-2xl border-2 border-espresso dark:border-cream/80 text-espresso dark:text-cream font-sans shadow-xs text-left">
      {/* Title */}
      <h3 className="font-serif font-black text-2xl border-b-6 border-espresso dark:border-cream/85 pb-1 leading-none uppercase tracking-tight">
        Nutrition Facts
      </h3>
      
      {/* Servings context */}
      <div className="text-[11px] font-sans py-1.5 border-b border-stone-300 dark:border-stone-700 flex justify-between items-end">
        <span>Serving size</span>
        <span className="font-bold">1 serving</span>
      </div>

      {/* Calories Block */}
      <div className="py-2 border-b-4 border-espresso dark:border-cream/85 flex justify-between items-baseline">
        <div className="text-left">
          <span className="font-bold text-xs uppercase block leading-none">Amount per serving</span>
          <span className="font-serif font-black text-3xl leading-none">Calories</span>
        </div>
        <span className="font-serif font-black text-4xl leading-none">{calories}</span>
      </div>

      {/* Daily Value Indicator */}
      <div className="text-[9px] font-mono font-bold text-right py-1 border-b border-stone-300 dark:border-stone-700 uppercase tracking-wider">
        % Daily Value *
      </div>

      {/* Macro details list */}
      <div className="text-xs space-y-1.5 font-sans">
        
        {/* Fat */}
        <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-bold">Total Fat</span> {totalFat}g
          </div>
          <span className="font-bold">{totalFatDv}%</span>
        </div>

        {/* Saturated Fat */}
        <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800 pl-4 text-[11px] text-stone-605 dark:text-stone-300">
          <div>
            Saturated Fat {satFat}g
          </div>
          <span className="font-bold">{satFatDv}%</span>
        </div>

        {/* Cholesterol */}
        <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-bold">Cholesterol</span> {cholesterol}mg
          </div>
          <span className="font-bold">{cholesterolDv}%</span>
        </div>

        {/* Sodium */}
        <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-bold">Sodium</span> {sodium}mg
          </div>
          <span className="font-bold">{sodiumDv}%</span>
        </div>

        {/* Carbohydrates */}
        <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-bold">Total Carbohydrate</span> {totalCarb}g
          </div>
          <span className="font-bold">{totalCarbDv}%</span>
        </div>

        {/* Dietary Fiber */}
        <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800 pl-4 text-[11px] text-stone-605 dark:text-stone-300">
          <div>
            Dietary Fiber {fiber}g
          </div>
          <span className="font-bold">{fiberDv}%</span>
        </div>

        {/* Sugars */}
        <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800 pl-4 text-[11px] text-stone-605 dark:text-stone-300">
          <div>
            Total Sugars {sugars}g
          </div>
          <span className="font-bold">-</span>
        </div>

        {/* Protein */}
        <div className="flex justify-between py-1 border-b-6 border-espresso dark:border-cream/85">
          <div>
            <span className="font-bold">Protein</span> {protein}g
          </div>
          <span className="font-bold">-</span>
        </div>

      </div>

      {/* Disclaimer disclaimer */}
      <p className="text-[9px] text-stone-500 dark:text-stone-400 leading-normal pt-2 italic">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet of 2,000 calories. Used for general nutrition advice.
      </p>
    </div>
  );
}
