/**
 * Strict TypeScript interfaces and enums for PebblePlate's Recipe and Blog schemas.
 * Fully optimized for Google Rich Guidelines, Schema.org Recipe markup, and Pinterest Rich Pin ingestion.
 */

export enum RecipeCategory {
  Dessert = "DESSERT",
  Breakfast = "BREAKFAST",
  Lunch = "LUNCH",
  Dinner = "DINNER",
  Appetizer = "APPETIZER",
  Beverage = "BEVERAGE",
  Snack = "SNACK",
  Salad = "SALAD",
  Soup = "SOUP",
  Baking = "BAKING",
}

export enum Cuisine {
  Italian = "ITALIAN",
  French = "FRENCH",
  Mexican = "MEXICAN",
  Asian = "ASIAN",
  Mediterranean = "MEDITERRANEAN",
  American = "AMERICAN",
  Indian = "INDIAN",
  MiddleEastern = "MIDDLE_EASTERN",
  Nordic = "NORDIC",
  Fusion = "FUSION",
}

export enum Difficulty {
  Easy = "EASY",
  Medium = "MEDIUM",
  Hard = "HARD",
}

export enum Unit {
  Gram = "g",
  Kilogram = "kg",
  Milliliter = "ml",
  Liter = "l",
  Teaspoon = "tsp",
  Tablespoon = "tbsp",
  Cup = "cup",
  Ounce = "oz",
  Pound = "lb",
  Piece = "pc",
  Pinch = "pinch",
  ToTaste = "to taste",
  Slice = "slice",
}

export interface Ingredient {
  quantity: number;
  unit: Unit | string;
  name: string;
  notes?: string;
}

export interface InstructionStep {
  stepNumber: number;
  body: string;
  tip?: string;
  imageSrc?: string;
}

export interface NutritionFacts {
  calories: number;
  protein: string;       // e.g. "12g"
  carbs: string;         // e.g. "45g"
  fat: string;           // e.g. "14g"
  saturatedFat?: string; // e.g. "4g"
  sodium?: string;       // e.g. "120mg"
  fiber?: string;        // e.g. "5g"
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  social: {
    pinterest?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  heroBlurHash?: string;
  category: RecipeCategory;
  cuisine: Cuisine;
  difficulty: Difficulty;
  prepTime: number;                // in minutes
  cookTime: number;                // in minutes
  totalTime: number;               // in minutes
  servings: number;
  calories: number;
  tags: string[];
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  chefSecrets: string[];
  nutritionFacts: NutritionFacts;
  publishedAt: string;
  updatedAt: string;
  author: Author;
  pinterestDescription?: string;   // Tailored specifically for Pinterest pins
  isFeatured: boolean;
  relatedRecipes?: string[];       // Slugs of related recipes
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;                  // e.g. 2 for h2, 3 for h3
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
  heroBlurHash?: string;
  body: string;                    // MDX / Markdown String representation
  category: string;
  tags: string[];
  toc: TableOfContentsItem[];
  publishedAt: string;
  readingTimeMinutes: number;
  relatedPosts?: string[];         // Slugs of related posts
  author: Author;
}
