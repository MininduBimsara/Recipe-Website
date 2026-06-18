import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Safely merges multiple Tailwind CSS and clsx class declarations 
 * into a single unified class string. Resolving any conflicting Tailwind utility classes.
 * 
 * @param inputs - List of class names or conditional class objects.
 * @returns Standardised list of classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
