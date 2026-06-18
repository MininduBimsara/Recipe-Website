export interface RatingData {
  count: number;
  sum: number;
}

// Shared in-memory rating store.
// In a fully persistent deployment, this would be retrieved from a database (e.g. Supabase).
export const ratingsStore: Record<string, RatingData> = {
  'artisanal-sourdough-levain': { count: 32, sum: 156.8 },
  'heirloom-tomato-burrata-galette': { count: 18, sum: 86.4 },
};
