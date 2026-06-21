import React from 'react';
import { Recipe } from '@/data/recipes';
import { parseToISODuration } from '@/utils/seo';
import { ratingsStore } from '@/lib/ratings';

interface RecipeSchemaProps {
  recipe: Recipe;
}

export default function RecipeSchema({ recipe }: RecipeSchemaProps) {
  const publishedDate = recipe.publishedAt || "2026-06-16T12:00:00Z";
  const craftKeywords = recipe.tags ? recipe.tags.join(", ") : `${recipe.category}, ${recipe.title}, Recipe`;
  const authorName = recipe.author || "Chef Alexandre Dumas";

  // Formulate prep, cook, total times using our SEO utility
  const prepTimeISO = parseToISODuration(recipe.prepTime);
  const cookTimeISO = recipe.cookTime ? parseToISODuration(recipe.cookTime) : undefined;
  const totalTimeISO = recipe.totalTime ? parseToISODuration(recipe.totalTime) : undefined;

  // HowToStep formulation
  const instructionsSchema = recipe.instructions.map((step, index) => ({
    "@type": "HowToStep",
    "name": `Step ${index + 1}`,
    "text": step,
    "url": `https://pebbleplate.page/recipes/${recipe.slug}#step-${index + 1}`,
    "image": recipe.image
  }));

  // Fetch live aggregates from our shared ratingsStore
  const liveRating = ratingsStore[recipe.slug];
  const aggregateRatingSchema = liveRating && liveRating.count > 0 ? {
    "@type": "AggregateRating",
    "ratingValue": String(Number((liveRating.sum / liveRating.count).toFixed(1))),
    "ratingCount": String(liveRating.count),
    "bestRating": "5",
    "worstRating": "1"
  } : undefined;

  const schemaJson: any = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.title,
    "image": [
      recipe.image
    ],
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Savory Kitchen",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=200"
      }
    },
    "datePublished": publishedDate,
    "description": recipe.pinterestDescription || recipe.description,
    "prepTime": prepTimeISO,
    "keywords": craftKeywords,
    "recipeYield": "4 servings",
    "recipeCategory": recipe.category,
    "recipeCuisine": recipe.recipeCuisine || "American",
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": `${recipe.calories} calories`
    },
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": instructionsSchema
  };

  // Add optional time fields if defined
  if (cookTimeISO) {
    schemaJson.cookTime = cookTimeISO;
  }
  if (totalTimeISO) {
    schemaJson.totalTime = totalTimeISO;
  }

  // Add aggregateRating if live reviews exist
  if (aggregateRatingSchema) {
    schemaJson.aggregateRating = aggregateRatingSchema;
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
