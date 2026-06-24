import React from 'react';
import { Recipe } from '@/types/pinterestBlogSchema';
import { parseToISODuration } from '@/utils/seo';
import { ratingsStore } from '@/lib/ratings';

interface RecipeSchemaProps {
  recipe: Recipe;
}

export default function RecipeSchema({ recipe }: RecipeSchemaProps) {
  if (!recipe) return null;

  // Resolve snake_case vs camelCase fields for local and database entries
  const title = recipe.title || '';
  const description = recipe.pinterestDescription || (recipe as any).pinterest_description || recipe.description || '';
  const publishedDate = recipe.publishedAt || (recipe as any).published_at || "2026-06-16T12:00:00Z";
  const tags = recipe.tags || [];
  const craftKeywords = tags.length > 0 ? tags.join(", ") : `${recipe.category || ''}, ${title}, Recipe`;
  const category = recipe.category || "Culinary";
  const cuisine = recipe.cuisine || (recipe as any).recipeCuisine || "American";
  const calories = recipe.calories;

  // Resolve cover image safely
  const image = recipe.coverImage || (recipe as any).cover_image || (recipe as any).image || "";

  // Resolve author name safely
  let authorName = "Chef Alexandre Dumas";
  if (recipe.author) {
    if (typeof recipe.author === 'string') {
      authorName = recipe.author;
    } else if (typeof recipe.author === 'object') {
      authorName = (recipe.author as any).name || authorName;
    }
  }

  // Resolve prep, cook, total times dynamically (numbers or strings)
  const prepTimeVal = recipe.prepTime ?? (recipe as any).prep_time;
  const cookTimeVal = recipe.cookTime ?? (recipe as any).cook_time;
  let totalTimeVal = recipe.totalTime ?? (recipe as any).total_time;

  if (!totalTimeVal && typeof prepTimeVal === 'number' && typeof cookTimeVal === 'number') {
    totalTimeVal = prepTimeVal + cookTimeVal;
  }

  const prepTimeISO = prepTimeVal !== undefined ? parseToISODuration(prepTimeVal) : 'PT20M';
  const cookTimeISO = cookTimeVal !== undefined ? parseToISODuration(cookTimeVal) : undefined;
  const totalTimeISO = totalTimeVal !== undefined ? parseToISODuration(totalTimeVal) : undefined;

  // Resolve ingredients (can be string[] or Ingredient[])
  const rawIngredients = recipe.ingredients || [];
  const ingredientsSchema = rawIngredients.map((ing: any) => {
    if (typeof ing === 'string') return ing;
    if (typeof ing === 'object' && ing !== null) {
      const qty = ing.quantity ? `${ing.quantity} ` : '';
      const unit = ing.unit ? `${ing.unit} ` : '';
      const name = ing.name || '';
      const notes = ing.notes ? `, ${ing.notes}` : '';
      return `${qty}${unit}${name}${notes}`.trim();
    }
    return '';
  }).filter(Boolean);

  // Resolve instructions (can be string[] or InstructionStep[])
  const rawInstructions = recipe.instructions || [];
  const instructionsSchema = rawInstructions.map((step: any, index: number) => {
    const text = typeof step === 'string' ? step : (step.body || '');
    // Ensure each HowToStep has a valid image, falling back to the recipe's cover image if not provided on the step
    const stepImage = (typeof step === 'object' && step !== null)
      ? (step.imageSrc || image)
      : image;

    return {
      "@type": "HowToStep",
      "name": `Step ${index + 1}`,
      "text": text,
      "url": `https://pebbleplate.page/recipes/${recipe.slug}#step-${index + 1}`,
      ...(stepImage ? { "image": stepImage } : {})
    };
  });

  // Resolve aggregate rating (using ratingsStore with a high quality baseline default if no live count exists)
  const liveRating = ratingsStore[recipe.slug] || { count: 1, sum: 4.8 };
  const aggregateRatingSchema = {
    "@type": "AggregateRating",
    "ratingValue": String(Number((liveRating.sum / liveRating.count).toFixed(1))),
    "ratingCount": String(liveRating.count),
    "bestRating": "5",
    "worstRating": "1"
  };

  // Resolve servings / recipe yield
  const servingsVal = recipe.servings ?? (recipe as any).servings;
  const recipeYield = servingsVal ? `${servingsVal} servings` : "4 servings";

  // Resolve nutrition facts
  const nutritionVal = recipe.nutritionFacts || (recipe as any).nutrition;
  const nutritionSchema = nutritionVal ? {
    "@type": "NutritionInformation",
    "calories": `${nutritionVal.calories || calories || 0} calories`,
    ...(nutritionVal.protein ? { "proteinContent": nutritionVal.protein } : {}),
    ...(nutritionVal.fat ? { "fatContent": nutritionVal.fat } : {}),
    ...(nutritionVal.carbs ? { "carbohydrateContent": nutritionVal.carbs } : {}),
    ...(nutritionVal.saturatedFat ? { "saturatedFatContent": nutritionVal.saturatedFat } : {}),
    ...(nutritionVal.fiber ? { "fiberContent": nutritionVal.fiber } : {}),
    ...(nutritionVal.sodium ? { "sodiumContent": nutritionVal.sodium } : {}),
  } : calories ? {
    "@type": "NutritionInformation",
    "calories": `${calories} calories`
  } : undefined;

  const schemaJson: any = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": title,
    "image": [image].filter(Boolean),
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "PebblePlate",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pebbleplate.page/logo.png"
      }
    },
    "datePublished": publishedDate,
    "description": description,
    "prepTime": prepTimeISO,
    "keywords": craftKeywords,
    "recipeYield": recipeYield,
    "recipeCategory": category,
    "recipeCuisine": cuisine,
    "recipeIngredient": ingredientsSchema,
    "recipeInstructions": instructionsSchema
  };

  // Add optional time fields if defined
  if (cookTimeISO) {
    schemaJson.cookTime = cookTimeISO;
  }
  if (totalTimeISO) {
    schemaJson.totalTime = totalTimeISO;
  }

  // Add aggregateRating schema
  schemaJson.aggregateRating = aggregateRatingSchema;

  // Add nutrition facts if defined
  if (nutritionSchema) {
    schemaJson.nutrition = nutritionSchema;
  }

  // Sanitize JSON to prevent </script> injection from DB content
  const safeJson = JSON.stringify(schemaJson)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
