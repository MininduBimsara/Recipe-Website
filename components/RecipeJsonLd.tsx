import React from 'react';
import { Post } from '@/types/post';

interface RecipeJsonLdProps {
  post: Post;
}

export default function RecipeJsonLd({ post }: RecipeJsonLdProps) {
  if (post.type !== 'recipe' || !post.recipe) return null;
  const r = post.recipe;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": post.title,
    "image": [post.coverImage],
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "datePublished": post.publishedAt,
    "description": post.excerpt,
    "prepTime": `PT${r.prepTimeMinutes}M`,
    "cookTime": `PT${r.cookTimeMinutes}M`,
    "totalTime": `PT${r.totalTimeMinutes}M`,
    "recipeYield": r.yields,
    "recipeCategory": post.tags[0] || "Culinary",
    "keywords": post.tags.join(", "),
    "recipeIngredient": r.ingredientGroups.flatMap(group => group.items),
    "recipeInstructions": r.steps.map(step => ({
      "@type": "HowToStep",
      "text": step.instruction
    })),
    ...(r.nutrition ? {
      "nutrition": {
        "@type": "NutritionInformation",
        "calories": `${r.nutrition.calories} calories`,
        "proteinContent": r.nutrition.protein,
        "fatContent": r.nutrition.fat,
        "carbohydrateContent": r.nutrition.carbs
      }
    } : {})
  };

  return (
    <script
      id={`recipe-jsonld-${post.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
