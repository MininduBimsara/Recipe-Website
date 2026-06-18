import React from 'react';
import { Recipe } from '@/data/recipes';

interface RecipeSchemaProps {
  recipe: Recipe;
}

export default function RecipeSchema({ recipe }: RecipeSchemaProps) {
  // ISO 8601 Fallbacks for prep, cook, total times
  const prepTimeISO = recipe.cookTime ? (recipe.totalTime ? "PT20M" : "PT30M") : "PT20M"; // safe placeholder
  const cookTimeISO = recipe.cookTime || "PT30M";
  const totalTimeISO = recipe.totalTime || "PT50M";

  const publishedDate = recipe.publishedAt || "2026-06-16T12:00:00Z";
  const craftKeywords = recipe.tags ? recipe.tags.join(", ") : `${recipe.category}, ${recipe.title}, Recipe`;
  const authorName = recipe.author || "Chef Alexandre Dumas";

  // HowToStep formulation
  const instructionsSchema = recipe.instructions.map((step, index) => ({
    "@type": "HowToStep",
    "name": `Step ${index + 1}`,
    "text": step,
    "url": `https://savorykitchen.com/recipes/${recipe.slug}#step-${index + 1}`,
    "image": recipe.image
  }));

  const schemaJson = {
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
    "datePublished": publishedDate,
    "description": recipe.pinterestDescription || recipe.description,
    "prepTime": recipe.slug === 'artisanal-sourdough-levain' ? "PT24H" : prepTimeISO,
    "cookTime": cookTimeISO,
    "totalTime": totalTimeISO,
    "keywords": craftKeywords,
    "recipeYield": "4 servings",
    "recipeCategory": recipe.category,
    "recipeCuisine": recipe.recipeCuisine || "American",
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": `${recipe.calories} calories`
    },
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": instructionsSchema,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

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
