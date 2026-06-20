import { Recipe } from '@/data/recipes';
import { BlogPost } from '@/data/blogs';

// Custom interface extending BlogPost to support our 5 distinct editorial styles
export type EditorialStyle = 'classic' | 'chemistry' | 'spotlight' | 'bento' | 'showcase';

export interface ExtendedBlogPost extends BlogPost {
  style?: EditorialStyle;
  scheduledAt?: string; // Date string for scheduling queue
  status?: 'published' | 'scheduled' | 'draft';
  layout_template?: string;
  template_images?: any[];
}

export interface ExtendedRecipe extends Recipe {
  scheduledAt?: string;
  status?: 'published' | 'scheduled' | 'draft';
  layout_template?: string;
  template_images?: any[];
}

// 10 Pre-populated Scheduled Recipes
export const PRESEEDED_SCHEDULED_RECIPES: ExtendedRecipe[] = [
  {
    id: 'sched-r-1',
    slug: 'roasted-cauliflower-romesco',
    title: 'Roasted Cauliflower Steaks with Hazelnut Romesco',
    description: 'Thick, caramelized cauliflower slices served over a smoky, creamy Catalan red pepper and hazelnut sauce.',
    pinterestDescription: 'Caramelized Roasted Cauliflower Steaks with smokey Catalan Romesco sauce - rich and plant-based dinner!',
    publishedAt: '2026-06-25T12:00:00Z',
    category: 'Dinner',
    prepTime: '20 mins',
    cookTime: 'PT25M',
    totalTime: 'PT45M',
    recipeCuisine: 'Spanish',
    tags: ['Cauliflower', 'Romesco', 'Hazelnut', 'Vegan', 'Gluten-Free', 'Vegetarian'],
    author: 'Chef Vanessa Alistoria',
    calories: 280,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=850',
    size: 'medium',
    ingredients: [
      '1 large head of organic Cauliflower (sliced into 1-inch steaks)',
      '3 tbsp Extra Virgin Olive Oil',
      '2 roasted Red Bell Peppers (skinned and seeded)',
      '1/2 cup toasted Blanched Hazelnuts',
      '2 cloves Garlic',
      '1 tbsp Red Wine Vinegar',
      '1/2 tsp Smoked Sweet Paprika',
      'Sea salt and fresh pepper'
    ],
    instructions: [
      'Preheat oven to 425°F (220°C). Lay cauliflower steaks on a parchment baking sheet, brush with olive oil, salt, and pepper.',
      'Roast cauliflower for 25 minutes, flipping halfway, until golden and beautifully caramelized.',
      'Romesco Sauce: Blend bell peppers, hazelnuts, garlic, vinegar, paprika, and remaining olive oil inside a food processor until smooth but slightly texturized.',
      'Plating: Spoon warm hazelnut Romesco generously onto plate, overlay hot cauliflower steak, and garnish with wild thyme.'
    ],
    tips: [
      'Don’t toss out the small cauliflower florets that crumble off! Roast them along with the steaks for extra crispy bites.'
    ],
    scheduledAt: '2026-06-25T12:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-r-2',
    slug: 'cardamom-pistachio-kulfi-pops',
    title: 'Cardamom Pistachio Kulfi Pops',
    description: 'Traditional slow-reduced, velvety Indian ice cream dense with aromatic seed ground green cardamom and toasted raw pistachios.',
    pinterestDescription: 'Vibrant homemade Cardamom Pistachio Kulfi Pops. A pure slow-cooked Indian summer dessert formula.',
    publishedAt: '2026-06-22T15:00:00Z',
    category: 'Desserts',
    prepTime: '15 mins',
    cookTime: 'PT45M',
    totalTime: 'PT6H',
    recipeCuisine: 'Indian',
    tags: ['Kulfi Pops', 'Pistachios', 'Cardamom', 'Vegetarian', 'Indian Desserts'],
    author: 'Baker James Courtland',
    calories: 220,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1567206563064-6f60000a2f54?auto=format&fit=crop&q=80&w=850',
    size: 'short',
    ingredients: [
      '4 cups Organic Farm-Fresh Whole Milk',
      '1/2 cup Organic Sweetened Condensed Milk',
      '1/4 cup Granulated Sugar',
      '1 tsp freshly ground Green Cardamom Cardamom seeds',
      '1/3 cup Raw Pistachios (finely sliced and toasted)',
      'A few strands of Organic Saffron'
    ],
    instructions: [
      'Milk reduction: Simmer whole milk inside a wide heavy saucepan over low heat, stirring continually for 35 minutes until reduced by half.',
      'Flavors: Stir in condensed milk, sugar, cardamom, and saffron. Simmer for another 10 minutes to dissolve completely.',
      'Nuts: Add roasted sliced pistachios, turn off heat, and allow the kulfi base to cool to room temperature.',
      'Freeze: Pour into pop molds. Insert reusable bamboo sticks and freeze for 6 hours until solid.'
    ],
    tips: [
      'Do not boil the milk on high heat. Scraping down the dry milk solids (rabri) from the pan sides back into the milk gives authentic texture!'
    ],
    scheduledAt: '2026-06-22T15:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-r-3',
    slug: 'sichuan-chili-crisp-noodles',
    title: 'Sichuan Chili Crisp Hand-Pulled Noodles',
    description: 'Springy, chewy hand-stretched ribbon wheat noodles dressed in a robust aromatic pool of garlic, Sichuan peppercorns, and roasted chili oil.',
    pinterestDescription: 'Hot spicy Sichuan Chili Crisp Hand-Pulled Noodles dressed with roasted chili oil and aromatic peppercorns.',
    publishedAt: '2026-06-21T18:00:00Z',
    category: 'Dinner',
    prepTime: '30 mins',
    cookTime: 'PT10M',
    totalTime: 'PT40M',
    recipeCuisine: 'Asian',
    tags: ['Noodles', 'Sichuan Chili Crisp', 'Chinese Cuisine', 'Quick & Easy', 'Vegan'],
    author: 'Agnes Meriot',
    calories: 410,
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=850',
    size: 'tall',
    ingredients: [
      '300g Fresh Ribbon Wheat Noodles',
      '3 tbsp House Chili Crisp Oil',
      '2 tbsp Low-sodium Soy Sauce',
      '1 tbsp Chinese Black Chinkiang Vinegar',
      '2 cloves Garlic (finely grated)',
      '1 Scallion (green part finely cut)',
      '1/2 tsp toasted Sesame seeds',
      'Baby Bok Choy (steamed)'
    ],
    instructions: [
      'Whisk chili crisp, soy sauce, black vinegar, and grated garlic in a wide serving bowl.',
      'Boil ribbon wheat noodles in high water for 4-5 minutes until perfectly al dente. Add bok choy during the final minute.',
      'Drain noodles well. Toss directly into the prepared chili bowl, stirring swiftly to fully coat every strand.',
      'Garnish with fresh green onions and sesame seeds before warm presentation.'
    ],
    tips: [
      'Save 2 tablespoons of starchy noodle cooking water to blend into the sauce for silky emulsification.'
    ],
    scheduledAt: '2026-06-21T18:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-r-4',
    slug: 'charred-octopus-ink-aioli',
    title: 'Charred Octopus with Squid-Ink Aioli',
    description: 'Perfectly tenderized braised Mediterranean octopus, charred on cast-iron, served alongside high-contrast black garlic squid-ink aioli.',
    pinterestDescription: 'Elevated Charred Octopus with rich Squid-Ink Aioli. Perfect Mediterranean seafood gourmet recipe!',
    publishedAt: '2026-06-30T19:30:00Z',
    category: 'Lunch',
    prepTime: '25 mins',
    cookTime: 'PT60M',
    totalTime: 'PT1H25M',
    recipeCuisine: 'Mediterranean',
    tags: ['Octopus', 'Seafood', 'Squid Ink', 'Gluten-Free', 'Low-Carb', 'Keto-Friendly'],
    author: 'Chef Alexandre Dumas',
    calories: 340,
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=850',
    size: 'medium',
    ingredients: [
      '1.5 lbs whole Octopus tentacles (cleaned)',
      '1/2 Lemon',
      '1 Bay leaf',
      '1/2 cup Olive oil',
      '1 egg yolk',
      '1 tsp Squid Ink (certified culinary)',
      '1 clove Roasted Garlic',
      'Fingering Potatoes (roasted for side layout)'
    ],
    instructions: [
      'Braising: Simmer octopus in a deep pot with lemon, bay leaf, and a splash of water for 45 minutes until fork-tender. Cool down completely.',
      'Squid Ink Aioli: Whisk egg yolk, roasted garlic, vinegar, and squid ink. Slowly drip-in olive oil while whisking continuously until thick cream consistency forms.',
      'Charring: Sear dry octopus tentacles in a smoking hot cast-iron skillet with a dash of oil for 3 minutes on each side until deeply blistered.',
      'Serve tentacle atop lines of jet-black squid-ink aioli, backed by roasted fingerling potato rounds.'
    ],
    tips: [
      'Do not boil the octopus too vigorously or its delicate skin will peel off before the charring stage.'
    ],
    scheduledAt: '2026-06-30T19:30:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-r-5',
    slug: 'lavender-honey-cold-brew',
    title: 'Lavender Honey-Infused Cold Brew',
    description: 'Slow-dripped organic Ethiopian coffee infused with steeped organic lavender flower syrup and freshly shaken raw blossom honey.',
    pinterestDescription: 'Cool, soothing summer Lavender Honey Cold Brew. Shaken sweet honey floral iced coffee!',
    publishedAt: '2026-06-19T07:00:00Z',
    category: 'Drinks',
    prepTime: '10 mins',
    cookTime: 'PT5M',
    totalTime: 'PT12H',
    recipeCuisine: 'American',
    tags: ['Cold Brew', 'Coffee', 'Lavender', 'Honey Drink', 'Beverages', 'Vegetarian'],
    author: 'Agnes Meriot',
    calories: 85,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=850',
    size: 'short',
    ingredients: [
      '1 cup coarse ground Ethiopian Guji single-origin coffee',
      '4 cups Cold Spring Water',
      '1 tbsp organic culinary Lavender buds',
      '1/4 cup organic raw wildflower Honey',
      'Organic Almond Milk (optional topper)'
    ],
    instructions: [
      'Infusion: Steep coffee grounds in cold spring water for 12 hours. Filter through a double paper filter to yield a clear, silky extract.',
      'Lavender Honey Syrup: Warm 1/4 cup water with lavender buds and honey until dissolved. Let steep off-heat for 10 minutes, then strain.',
      'Assembly: Fill a tall display glass with clear ice. Pour lavender-honey syrup at the bottom, fill with cold brew, and cap with almond milk.'
    ],
    tips: [
      'Ensure you purchase "culinary" grade lavender. Ornamental lavenders are often chemically treated and taste overly soapy.'
    ],
    scheduledAt: '2026-06-19T07:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-r-6',
    slug: 'pumpkin-seed-fig-loaf',
    title: 'Organic Pumpkin Seed & Black Fig Loaf',
    description: 'High-fiber, mineral-dense bread loaf loaded with roasted green pepitas, honey-steeped Mission figs, and milled whole rye flour.',
    pinterestDescription: 'Incredibly wholesome Organic Pumpkin Seed & Black Fig Loaf. A crisp rustic seed-studded artisan bread!',
    publishedAt: '2026-06-23T06:00:00Z',
    category: 'Breakfast',
    prepTime: '30 mins',
    cookTime: 'PT40M',
    totalTime: 'PT4H',
    recipeCuisine: 'Nordic',
    tags: ['Rye Loaf', 'Seeds', 'Dried Figs', 'Artisan Bread', 'High-Fiber', 'Baking'],
    author: 'Baker James Courtland',
    calories: 210,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=850',
    size: 'tall',
    ingredients: [
      '200g Whole Rye Flour',
      '300g Strong Baker’s Wheat Flour',
      '400ml Lukewarm water',
      '7g active instant dry yeast',
      '1 cup dried Mission Figs (sliced and soaked)',
      '1/2 cup roasted green Pumpkin Seeds',
      '1 tbsp dark molasses'
    ],
    instructions: [
      'Dough: Dissolve yeast and molasses in warm water. Whisk flours, folding in yeast mixture to form a sticky, wet dough.',
      'Inclusions: Cover and let rest for 1 hour. Scatter pepitas and sliced figs into the dough, folding repeatedly to distribute.',
      'Rise: Shovel into a greased parchment loaf pan. Cover and let double in size for 1.5 hours.',
      'Bake: Score down the center. Bake at 400°F (200°C) for 40 minutes until hollow sound when tapped underneath.'
    ],
    tips: [
      'Hydrate the dried figs in warm tea or dark honey-water first to prevent them from sapping moisture from the surrounding bread crumbs.'
    ],
    scheduledAt: '2026-06-23T06:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-r-7',
    slug: 'sea-bass-yuzu-beurre-blanc',
    title: 'Pan-Seared Sea Bass with Yuzu Beurre Blanc',
    description: 'Crispy skin Chilean sea bass served on a pool of rich, emulsified butter-shallot sauce spiked with essential yuzu juice.',
    pinterestDescription: 'Perfect Pan-Seared Chilean Sea Bass with Yuzu Beurre Blanc. Flakey white fish with elegant citrus butter sauce!',
    publishedAt: '2026-06-28T13:00:00Z',
    category: 'Dinner',
    prepTime: '15 mins',
    cookTime: 'PT20M',
    totalTime: 'PT35M',
    recipeCuisine: 'Fusion',
    tags: ['Sea Bass', 'Yuzu', 'Beurre Blanc', 'Seafood', 'Gluten-Free', 'French-Japanese'],
    author: 'Chef Alexandre Dumas',
    calories: 420,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=850',
    size: 'medium',
    ingredients: [
      '2 Chilean Sea Bass fillets (approx. 6oz each)',
      '1 tbsp grapeseed oil (high smoke point)',
      '2 shallots (finely diced)',
      '1/4 cup dry white wine',
      '2 tbsp Yuzu juice (fresh or bottled extract)',
      '1/2 cup cold unsalted Butter (cubed)',
      '1 tbsp heavy whipping cream'
    ],
    instructions: [
      'Yuzu Beurre Blanc: Simmer shallots, wine, and yuzu juice in a small pan until down to 1 tablespoon of liquid.',
      'Emulsify: Whisk in 1 tablespoon of cream. Drop heat to ultra-low. Whisk in cold butter cubes one by one until a glossy, creamy sauce forms.',
      'Fish sear: Pat sea bass skin completely dry. Sear skins-down in hot oil, holding flat with a fish spatula for 4 minutes. Flip and complete cook for 3 minutes.',
      'Plating: Spoon warm yuzu emulsion onto plates, crown with crispy-skin sea bass, and serve immediately.'
    ],
    tips: [
      'Beurre blanc is fragile! Never let the sauce boil once butter is introduced, or the emulsion will break into liquid oil.'
    ],
    scheduledAt: '2026-06-28T13:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-r-8',
    slug: 'roasted-fig-goat-cheese-crostini',
    title: 'Roasted Fig & Goat Cheese Crostini',
    description: 'Crispy baguette toast topped with artisanal whipped chive goat cheese, grilled sweet fresh figs, and organic thyme syrup.',
    pinterestDescription: 'Elegant Sweet Fig & Goat Cheese Crostini appetizer with wild thyme drizzles! Warm party food snack.',
    publishedAt: '2026-06-20T11:00:00Z',
    category: 'Lunch',
    prepTime: '10 mins',
    cookTime: 'PT8M',
    totalTime: 'PT18M',
    recipeCuisine: 'French',
    tags: ['Appetizer', 'Figs', 'Goat Cheese', 'Crostini', 'Vegetarian', 'Quick & Easy'],
    author: 'Chef Vanessa Alistoria',
    calories: 160,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=850',
    size: 'short',
    ingredients: [
      '1 French Baguette (sliced 1/2-inch thick)',
      '6 Fresh Black Mission Figs (halved lengthways)',
      '150g soft artisanal Goat Cheese (chevre)',
      '2 tbsp wild Honey',
      '1 tbsp organic extra olive oil',
      'Fresh sprigs of thyme'
    ],
    instructions: [
      'Heat a grill pan over medium-high heat. Lightly brush cut figs with olive oil, grill 2 minutes on each cut face until charred grid-lines appear.',
      'Bake baguette rounds at 375°F for 6 minutes until crisp and slightly toasted.',
      'Whisk goat cheese with fresh thyme leaves until smooth. Spread over baguette pieces.',
      'Top each with a warm grilled fig half, drizzle with raw wildflower honey, and crack freshly milled black pepper.'
    ],
    tips: [
      'If fresh figs aren’t in season, you can substitute with a premium dried-fig compote reduction.'
    ],
    scheduledAt: '2026-06-20T11:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-r-9',
    slug: 'golden-milk-chai-latte',
    title: 'Spiced Golden Milk Chai Latte',
    description: 'Comforting, anti-inflammatory blend of freshly grated organic turmeric, ginger, black pepper, and whole chai tea spices simmered in creamy oat milk.',
    pinterestDescription: 'Relaxing Spiced Golden Milk Chai Latte with turmeric, ginger, and oat milk. The ultimate turmeric wellness elixir!',
    publishedAt: '2026-06-24T08:30:00Z',
    category: 'Drinks',
    prepTime: '5 mins',
    cookTime: 'PT10M',
    totalTime: 'PT15M',
    recipeCuisine: 'Indian',
    tags: ['Golden Milk', 'Turmeric Chai', 'Beverages', 'Vegan', 'Vegetarian', 'Quick & Easy'],
    author: 'Agnes Meriot',
    calories: 140,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1538587888044-79f13ddd7e49?auto=format&fit=crop&q=80&w=850',
    size: 'short',
    ingredients: [
      '2 cups Creamy Barista Oat Milk',
      '1 tbsp fresh Turmeric root (finely grated)',
      '1 tsp fresh Ginger root (grated)',
      '1 Cinnamon stick',
      '2 Cardamom pods (crushed)',
      'A tiny pinch of fresh Black Pepper',
      '1 tbsp maple syrup'
    ],
    instructions: [
      'Combine: Add oat milk, turmeric, ginger, cinnamon stick, black pepper, and crushed cardamom in a small saucepan over medium heat.',
      'Simmer: Bring to a bare simmer for 8 minutes. Avoid rolling boils to prevent separating the oat starches.',
      'Sweeten: Stir in dark maple syrup. Remove cinnamon stick, and double-strain the spiced golden elixir into mugs.',
      'Garnish: Dust with extra powdered cinnamon and serve steaming hot.'
    ],
    tips: [
      'Never skip the black pepper! Piperine inside black pepper increases the body’s absorption of beneficial curcumin (found in turmeric) by up to 2,000%.'
    ],
    scheduledAt: '2026-06-24T08:30:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-r-10',
    slug: 'smashed-sesame-cucumber-salad',
    title: 'Smashed Cucumber Salad with Toasted Sesame Oil',
    description: 'Crisp, jagged Persian cucumbers quick-marinated in garlic, roasted dark sesame oil, sesame seeds, and rice vinegar.',
    pinterestDescription: 'Smashed Persian Cucumber Salad dressing with garlic, toasted sesame, and vinegar. Quick, cold plant-based side!',
    publishedAt: '2026-06-27T17:00:00Z',
    category: 'Meal Prep',
    prepTime: '10 mins',
    cookTime: 'PT0M',
    totalTime: 'PT10M',
    recipeCuisine: 'Asian',
    tags: ['Salad', 'Cucumbers', 'Sesame Oil', 'Quick & Easy', 'Gluten-Free', 'Vegan', 'Vegetarian'],
    author: 'Chef Vanessa Alistoria',
    calories: 90,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&q=80&w=850',
    size: 'short',
    ingredients: [
      '4 crisp Persian Cucumbers',
      '1/2 tsp kosher salt',
      '1 clove fresh Garlic (finely grated)',
      '1 tbsp toasted dark Sesame Oil',
      '1.5 tbsp unpolished Rice Vinegar',
      '1 tsp roasted white/black Sesame seeds',
      '1 tsp chili flakes (optional color & heat)'
    ],
    instructions: [
      'Smashed: Wrap cucumbers in cling film. Hit gently with a rolling pin or flat knife bottom until they split open and fracture into chunks.',
      'Salting: Toss shattered cucumber sections with salt. Rest inside a sieve for 5 minutes. Shake well to purge extra cucumber water.',
      'Dressing: Blend garlic, sesame oil, rice vinegar, and toasted seeds in a serving bowl.',
      'Serve: Stir in dry cucumbers, coat fully in the sesame glaze, and top with toasted sesame and immediate serving.'
    ],
    tips: [
      'Smashing cucumbers creates irregular, rough surfaces which allow the dynamic sesame garlic dressing to cling far better than knife-cut slices!'
    ],
    scheduledAt: '2026-06-27T17:00:00Z',
    status: 'scheduled'
  }
];

// 10 Pre-populated Scheduled Blog/Editorial Chronicles representing 5 Different Styles
export const PRESEEDED_SCHEDULED_BLOGS: ExtendedBlogPost[] = [
  {
    id: 'sched-b-1',
    slug: 'demystifying-maillard-chemical-matrix',
    title: 'Demystifying Maillard: The Amino Acid Browning Matrix',
    summary: 'An investigative laboratory deep dive into how heat restructures meat proteins and sugars into over eight hundred entirely new flavor molecules.',
    category: 'Techniques',
    date: 'June 25, 2026',
    readTime: '7 mins read',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    author: 'Chef Alexandre Dumas',
    content: [
      'The Maillard reaction is not simple browning: it is a complex cascade of chemical rearrangements beginning when an amine group reacts with a reactive carbon carbonyl shell of reducing sugar sheets.',
      'Different heat thresholds yield various molecules: at 285°F, basic color changes commence. At 310°F, pyrazines and furans unlock deep woodsy, roasted bean aromas. At 350°F, caramelization begins, adding sweet butter highlights.'
    ],
    style: 'chemistry',
    scheduledAt: '2026-06-25T11:00:00Z',
    status: 'scheduled',
    relatedRecipeIds: ['recipe-1', 'sched-r-4']
  },
  {
    id: 'sched-b-2',
    slug: 'microclimate-proving-outside-kitchen',
    title: 'Microclimate Retarding: Proving Outside the Kitchen',
    summary: 'How utilizing rustic basement masonry, open verandas, or cool cellars can unlock regional ambient yeast strains for customized sourdough sourness.',
    category: 'Techniques',
    date: 'June 28, 2026',
    readTime: '5 mins read',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    author: 'Baker James Courtland',
    content: [
      'Modern refrigeration is comfortable, but it creates a homogeneous microbial spectrum. True sourdough complexity blooms in native seasonal drafts where regional wild yeasts are given localized humidity ranges.',
      'We chart stone vaults, wood drawers, or earthen pantries to observe how moisture peaks and falls over sunset, adapting our fold ratios correspondingly.'
    ],
    style: 'classic',
    scheduledAt: '2026-06-28T09:00:00Z',
    status: 'scheduled',
    relatedRecipeIds: ['1', 'sched-r-6']
  },
  {
    id: 'sched-b-3',
    slug: 'foraging-wild-herbs-urban-guide',
    title: 'Foraging in the Wild: An Urban Herbalist Guide',
    summary: 'A highly visual photographic essay on identifying, washing, and preparing urban garlic mustard, wild dandelion leaves, and chickweed.',
    category: 'Ingredient Guides',
    date: 'June 22, 2026',
    readTime: '4 mins read',
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&q=80&w=800',
    author: 'Agnes Meriot',
    content: [
      'Urban zones harbor resilient botanical treasures. Wood sorrel, dandelions, and wild garlic thrive in forgotten park borders, carrying sharp mustard and heavy citrus profiles.',
      'Learn how to inspect leaf crowns, wash contaminants securely using visual step layouts, and fold them into warm summer salads.'
    ],
    style: 'showcase',
    scheduledAt: '2026-06-22T08:00:00Z',
    status: 'scheduled',
    relatedRecipeIds: ['sched-r-10', '2']
  },
  {
    id: 'sched-b-4',
    slug: 'standard-water-sanitation-yeast-ferments',
    title: 'Standard Water Sanitation for Yeast Ferments',
    summary: 'Why common municipal tap chlorine and alkaline salts act as lethal cellular blocks slows down yeast culture and starter replication.',
    category: 'Techniques',
    date: 'June 20, 2026',
    readTime: '4 mins read',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800',
    author: 'Chef Alexandre Dumas',
    content: [
      'Many bread-bakers struggle with inactive starters without realizing their water is treated. Chlorine acts as a sanitary shield specifically intended to retard germ expansion.',
      'We compare reverse osmosis systems, boil degassing, and natural mineral salts to achieve optimal pH for yeast activation.'
    ],
    style: 'chemistry',
    scheduledAt: '2026-06-20T08:00:00Z',
    status: 'scheduled',
    relatedRecipeIds: ['1']
  },
  {
    id: 'sched-b-5',
    slug: 'knife-steel-metallurgy-high-rc-alloys',
    title: 'Knife Steel Metallurgy: HRC 62 vs Soft Alloys',
    summary: 'A visual bento grid dashboard looking at carbon structures, hardness scales, and edge angles defining high-performance German and Japanese blades.',
    category: 'Kitchen Equipment',
    date: 'June 24, 2026',
    readTime: '6 mins read',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=800',
    author: 'Baker James Courtland',
    content: [
      'High Rockwell Carbon (HRC 60-63) lets Japanese tools feature razor-thin 15-degree blades, but makes them brittle. German alloy steels are softer (HRC 56-58), resilient to impact, but require regular honing.',
      'Our bento breakdown lists sharpening angles, stone-grits, and rust prevention oils for long-term steel conservation.'
    ],
    style: 'bento',
    scheduledAt: '2026-06-24T14:00:00Z',
    status: 'scheduled'
  },
  {
    id: 'sched-b-6',
    slug: 'sommelier-juliette-moreau-chat',
    title: 'A Chat with Master Sommelier Juliette Moreau',
    summary: 'An exclusive dialogue with Parisian sommelier Juliette Moreau on matching high-acid citrus desserts with rare dessert vins.',
    category: 'Meal Planning',
    date: 'June 19, 2026',
    readTime: '8 mins read',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    author: 'Chef Vanessa Alistoria',
    content: [
      'Question: How do you balance the heavy citrus notes of a French tarte au citron without overwhelming the tongue?',
      'Answer: You must choose a late-harvest Sauternes or a Muscat. The secret is matching both wine acid and fruit sugars side-by-side.'
    ],
    style: 'spotlight',
    scheduledAt: '2026-06-19T16:00:00Z',
    status: 'scheduled',
    relatedRecipeIds: ['recipe-lemon-tart']
  },
  {
    id: 'sched-b-7',
    slug: 'cultivating-lactate-sour-microbiology',
    title: 'Cultivating Lactate: The Sourdough Microbiology Lab',
    summary: 'Looking at how temperature sliders govern the fight between Saccharomyces cerevisiae yeast colonies and lactobacilli lactic/acetic acid secretion.',
    category: 'Techniques',
    date: 'June 27, 2026',
    readTime: '5 mins read',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
    author: 'Chef Alexandre Dumas',
    content: [
      'Temperature dictates chemical profiles. Warm water (85°F) favors lactic acid bacteria, yielding creamy cottage-cheese yoghurt profiles. Cool water (68°F) favors acetic acid bacteria, giving a robust, vinegar-like sourness.',
      'We display molecular formula blocks detailing cellular carbon fermentation pathways.'
    ],
    style: 'chemistry',
    scheduledAt: '2026-06-27T10:00:00Z',
    status: 'scheduled',
    relatedRecipeIds: ['1']
  },
  {
    id: 'sched-b-8',
    slug: 'sourcing-heirlooms-summer-harvest',
    title: 'Seasonal Harvest: Sourcing Heirlooms in Summer',
    summary: 'An editorial manifesto on seeking out true Cherokee Purple, Brandywine, and Green Zebra heirloom tomatoes at community farms.',
    category: 'Ingredient Guides',
    date: 'June 29, 2026',
    readTime: '4 mins read',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    author: 'Chef Vanessa Alistoria',
    content: [
      'Commercial round tomatoes are engineered for shipping durability, sacrificing flavor. Sourcing organic heirlooms in midsummer yields thick, sweet, pulpy juices rich in glutamic acids.',
      'A classic layout with high-contrast text columns exploring agricultural lineage and soil density.'
    ],
    style: 'classic',
    scheduledAt: '2026-06-29T09:30:00Z',
    status: 'scheduled',
    relatedRecipeIds: ['2', 'sched-r-8']
  },
  {
    id: 'sched-b-9',
    slug: 'cast-iron-seasoning-polymers',
    title: 'Understanding Cast Iron Seasoning Polymers',
    summary: 'A visual bento dashboard on how unsaturated fatty acids transform into a glass-like protective slick nonstick membrane via extreme oven heat.',
    category: 'Kitchen Equipment',
    date: 'June 23, 2026',
    readTime: '5 mins read',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
    author: 'Chef Alexandre Dumas',
    content: [
      'Seasoning is not grease: it is a cross-linked network of baked oil molecules. Unsaturated cooking oils like grape-seed or flaxseed polymerize into solid, durable sheets when heated above their smoke limits.',
      'Our bento grid decomposes how to wash, scrub, oil coat, and oven-bake cast iron plates to keep nonstick skins clean.'
    ],
    style: 'bento',
    scheduledAt: '2026-06-23T15:00:00Z',
    status: 'scheduled',
    relatedRecipeIds: ['recipe-1', 'sched-r-4']
  },
  {
    id: 'sched-b-10',
    slug: 'macro-ratios-nutritional-design-sheets',
    title: 'Macro Ratios: Designing Nutritional Balance sheets',
    summary: 'A question-and-answer series with nutritionist Agnes Meriot on structuring carbohydrates, healthy fats, and clean amino profile sheets.',
    category: 'Meal Planning',
    date: 'June 21, 2526',
    readTime: '5 mins read',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    author: 'Agnes Meriot',
    content: [
      'Question: How should a high-hydration grain diet count protein weight against fiber mass?',
      'Answer: Always target a 5-to-1 starch-to-fiber ratio while using whole flour mills to safeguard insulin curves.'
    ],
    style: 'spotlight',
    scheduledAt: '2026-06-21T11:30:00Z',
    status: 'scheduled'
  }
];

export function getSavedRecipes(): ExtendedRecipe[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('savory_custom_recipes');
  if (!stored) {
    localStorage.setItem('savory_custom_recipes', JSON.stringify(PRESEEDED_SCHEDULED_RECIPES));
    return PRESEEDED_SCHEDULED_RECIPES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return PRESEEDED_SCHEDULED_RECIPES;
  }
}

export function saveRecipes(recipes: ExtendedRecipe[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('savory_custom_recipes', JSON.stringify(recipes));
}

export function getSavedBlogs(): ExtendedBlogPost[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('savory_custom_blogs');
  if (!stored) {
    localStorage.setItem('savory_custom_blogs', JSON.stringify(PRESEEDED_SCHEDULED_BLOGS));
    return PRESEEDED_SCHEDULED_BLOGS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return PRESEEDED_SCHEDULED_BLOGS;
  }
}

export function saveBlogs(blogs: ExtendedBlogPost[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('savory_custom_blogs', JSON.stringify(blogs));
}

