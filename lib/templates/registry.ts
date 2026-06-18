export interface LayoutTemplate {
  id: string
  name: string
  description: string
  imageSlots: number           // how many images this template needs
  thumbnail: string            // preview image path or fallback SVG representation
  bestFor: string              // hint shown to the author
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'classic-single',
    name: 'Classic Single',
    description: 'One hero image at top, full-width text below. Clean and simple.',
    imageSlots: 1,
    thumbnail: 'classic-single', // Key to render preview SVG
    bestFor: 'Quick recipes, short tips, anything text-focused',
  },
  {
    id: 'side-by-side',
    name: 'Side by Side',
    description: 'Two images alternating left/right with text wrapping beside each.',
    imageSlots: 2,
    thumbnail: 'side-by-side',
    bestFor: 'Before/after, two-stage recipes, comparison posts',
  },
  {
    id: 'editorial-trio',
    name: 'Editorial Trio',
    description: 'Three images: one large hero, two smaller below in a row.',
    imageSlots: 3,
    thumbnail: 'editorial-trio',
    bestFor: 'Photo-rich tutorials, multi-step dishes, visual stories',
  },
  {
    id: 'hero-stack',
    name: 'Hero Stack',
    description: 'Full-bleed hero image, then text, then a second inline image mid-content.',
    imageSlots: 2,
    thumbnail: 'hero-stack',
    bestFor: 'Long-form blog posts, technique deep-dives',
  },
  {
    id: 'magazine-split',
    name: 'Magazine Split',
    description: 'Image and title share a 50/50 split hero, single column below.',
    imageSlots: 1,
    thumbnail: 'magazine-split',
    bestFor: 'Featured recipes, signature dishes, premium feel',
  },
]

export function getTemplate(id: string): LayoutTemplate {
  return LAYOUT_TEMPLATES.find(t => t.id === id) ?? LAYOUT_TEMPLATES[0]
}
