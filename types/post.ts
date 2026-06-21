/**
 * PebblePlate - Content Schema Definitions
 * 
 * Elegant, robust TypeScript interfaces designed for a high-performance food blog.
 * Supports both structured Recipes (with ingredients, instructions, cooking times,
 * and nutrition) and Editorial "Tips & Tricks" posts.
 */

export type PostType = 'recipe' | 'editorial';

export interface Author {
  name: string;
  avatar: string;
  bio?: string;
  socials?: {
    pinterest?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface NutritionInfo {
  calories: number;
  protein?: string; // e.g. "15g"
  carbs?: string;   // e.g. "42g"
  fat?: string;     // e.g. "12g"
  fiber?: string;   // e.g. "4g"
}

export interface IngredientGroup {
  title?: string; // e.g., "For the Dough", "For the Glaze" (optional for simple lists)
  items: string[]; // e.g., ["2 cups all-purpose flour", "1 tbsp baking powder"]
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
  tip?: string; // Helpful intermediate tips for this specific step
  image?: string; // Step-specific visual asset (great for Pinterest step pins)
}

export interface RecipeContent {
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  yields: string; // e.g. "12 scones" or "4 servings"
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Grouped ingredients for complex recipes, or a single group for simple ones
  ingredientGroups: IngredientGroup[];
  
  // Step-by-step instructions
  steps: RecipeStep[];
  
  // Optional health profile & nutrition
  nutrition?: NutritionInfo;
  suitableForDiets?: string[]; // e.g. ["Gluten-Free", "Vegan", "Keto", "Vegetarian"]
  
  // Kitchen implements required
  equipment?: string[]; // e.g. ["Cast iron skillet", "Stand mixer"]
}

export interface EditorialInsight {
  title: string;
  content: string;
  iconName?: string; // Name of Lucide icon to render visually
}

export interface EditorialContent {
  subtitle: string;
  introduction: string;
  
  // Focus areas or deep-dive insights
  insights: EditorialInsight[];
  
  // Detailed core body text formatted in Markdown or HTML strings
  bodyMarkdown: string;
  
  // Quick summary takeaways
  keyTakeaways: string[];
}

export interface Post {
  id: string;
  type: PostType;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  author: Author;
  tags: string[];
  rating?: number; // Editorial or reader rating out of 5
  pinterestPinUrl?: string; // Targeted Pinterest pin reference path for visual savers
  
  // Conditional payloads depending on Type
  recipe?: RecipeContent;
  editorial?: EditorialContent;
}

// Pinterest Integration helper to generate Schema.org JSON-LD structured data for Recipes
export function generateRecipeSchemaJsonLd(post: Post): string {
  if (post.type !== 'recipe' || !post.recipe) return '';
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
    "recipeCategory": "Dessert", // Can be customized per tag
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

  return JSON.stringify(schema, null, 2);
}
