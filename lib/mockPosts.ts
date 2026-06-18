import { Post } from '@/types/post';

export const mockPosts: Post[] = [
  {
    id: 'recipe-1',
    type: 'recipe',
    slug: 'pan-seared-tuscan-garlic-chicken',
    title: 'Pan-Seared Creamy Tuscan Garlic Chicken',
    excerpt: 'Golden pan-cooked chicken breasts nestled in a rich garlic, sun-dried tomato, and fresh spinach cream sauce. A 30-minute weeknight masterpiece.',
    coverImage: 'https://picsum.photos/seed/chicken/800/600',
    publishedAt: '2026-06-12',
    author: {
      name: 'Chef Vanessa Alistoria',
      avatar: 'https://picsum.photos/seed/vchef/150/150',
      bio: 'Classical French trained chef focused on quick, high-vibrancy Italian farmhouse cuisine.',
      socials: {
        pinterest: 'https://pinterest.com/vanessa_savory',
        instagram: 'https://instagram.com/vanessa_savory'
      }
    },
    tags: ['Chicken', 'Dinner', 'Low-Carb', 'Gluten-Free', '30-Minutes'],
    rating: 4.9,
    pinterestPinUrl: 'https://pinterest.com/pin/create/button/?url=https://savory-kitchen.com/pan-seared-tuscan-garlic-chicken',
    recipe: {
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      totalTimeMinutes: 30,
      yields: '4 servings',
      difficulty: 'medium',
      suitableForDiets: ['Low-Carb', 'Gluten-Free', 'Keto-Friendly'],
      equipment: ['12-inch heavy-bottomed skillet', 'Meat mallet', 'Silicone tongs'],
      ingredientGroups: [
        {
          title: 'For the Chicken & Sear',
          items: [
            '2 large master-cut chicken breasts (approx. 1.5 lbs), halved horizontally',
            '1 tbsp extra virgin olive oil',
            '1 tbsp unsalted grass-fed butter',
            '1 tsp Italian herb seasoning blend',
            '1/2 tsp smoked sweet paprika',
            '1/2 tsp kosher salt & fresh cracked black pepper'
          ]
        },
        {
          title: 'For the Creamy Tuscan Sauce',
          items: [
            '5 cloves garlic, finely minced using a microplane',
            '1/2 cup sun-dried tomatoes in oil, julienned',
            '1 cup organic chicken bone broth',
            '1 cup organic heavy whipping cream',
            '2.5 cups fresh baby spinach leaves, organic',
            '1/2 cup freshly grated Parmigiano-Reggiano'
          ]
        }
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: 'Pat the chicken breasts dry with a paper towel. Place them under plastic wrap and lightly beat with meat mallet to uniform 1/2-inch thickness. Season both sides generously with Italian seasoning, paprika, salt, and pepper.',
          durationMinutes: 5,
          tip: 'Uniform thickness is key! This ensures the chicken cooks evenly without drying out the edges.'
        },
        {
          stepNumber: 2,
          instruction: 'Heat olive oil and butter in your skillet over medium-high heat. Once the pan is searing hot, add the chicken. Cook for 5-6 minutes on each side until gorgeous and golden brown. Ensure internal temp reaches 165°F (74°C). Remove chicken and rest on a warm plate.',
          durationMinutes: 12,
          tip: 'Don\'t overcrowd the skillet. Set chicken pieces apart. If needed, sear in two separate batches to avoid boiling instead of browning!'
        },
        {
          stepNumber: 3,
          instruction: 'Reduce heat to medium. In the same skillet with the leftover pan juices, add the minced garlic and sauté for 1 minute until highly fragrant. Add sun-dried tomatoes and sauté for 1-2 minutes to release sweet essential oils.',
          durationMinutes: 3,
          tip: 'Stir rapidly to prevent minced garlic from burning—burnt garlic turns bitter.'
        },
        {
          stepNumber: 4,
          instruction: 'Pour in the chicken bone broth, scraping the browned bits (fond) off the bottom of the skillet. Bring to a simmer. Pour in the heavy whipping cream and let the sauce cook down and simmer for 3 minutes to emulsify.',
          durationMinutes: 4,
          tip: 'The browned bits are concentrated flavor gold! Don\'t leave any stuck to the pan.'
        },
        {
          stepNumber: 5,
          instruction: 'Add spinach leaves and let them wilt gently in the simmering sauce. Stir in the freshly grated Parmigiano-Reggiano, allowing it to melt seamlessly into the cream. Rest chicken breasts back into the sauce, spooning the Tuscan cream generously over them. Simmer 1 minute more.',
          durationMinutes: 3,
          tip: 'Serve immediately with optional garnishes of fresh torn basil and additional grated cheese.'
        }
      ],
      nutrition: {
        calories: 485,
        protein: '38g',
        carbs: '7g',
        fat: '32g',
        fiber: '2g'
      }
    }
  },
  {
    id: 'recipe-2',
    type: 'recipe',
    slug: 'bakerystyle-lemon-blueberry-scones',
    title: 'Bakery-Style Lemon Blueberry Scones',
    excerpt: 'Ultra-flakey, golden-crusted scones loaded with sweet wild blueberries, bursting with fresh lemon zest, and drizzled with a sweet citrus glaze.',
    coverImage: 'https://picsum.photos/seed/scones/800/600',
    publishedAt: '2026-06-15',
    author: {
      name: 'Baker James Courtland',
      avatar: 'https://picsum.photos/seed/bakerychef/150/150',
      bio: 'Pastry specialist, sourdough collector, and believer that cold butter makes the world go round.',
      socials: {
        pinterest: 'https://pinterest.com/james_pastry',
        instagram: 'https://instagram.com/james_pastry'
      }
    },
    tags: ['Baking', 'Breakfast', 'Sweet', 'Blueberry', 'Pastry'],
    rating: 4.8,
    pinterestPinUrl: 'https://pinterest.com/pin/create/button/?url=https://savory-kitchen.com/bakerystyle-lemon-blueberry-scones',
    recipe: {
      prepTimeMinutes: 20,
      cookTimeMinutes: 18,
      totalTimeMinutes: 38,
      yields: '8 large scones',
      difficulty: 'hard',
      suitableForDiets: ['Vegetarian'],
      equipment: ['Baking sheet', 'Pastry cutter', 'Microplane', 'Parchment paper'],
      ingredientGroups: [
        {
          title: 'The Scone Pastry',
          items: [
            '2 cups (250g) unbleached all-purpose flour',
            '1/2 cup (100g) organic granulated sugar',
            '2.5 tsp baking powder',
            '1/2 tsp kosher salt',
            '1/2 cup (1 stick) unsalted grass-fed butter, frozen solid',
            '1/2 cup organic heavy whipping cream (plus 2 tbsp for brushing)',
            '1 large pasture egg',
            '1 tbsp fresh organic lemon zest',
            '1 cup fresh wild blueberries, chilled'
          ]
        },
        {
          title: 'The Fresh Lemon Glaze',
          items: [
            '1 cup organic powdered confectioner sugar',
            '2-3 tbsp fresh squeezed organic lemon juice',
            '1/2 tbsp heavy cream'
          ]
        }
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: 'Preheat oven to 400°F (204°C). Line a large baking sheet with quality parchment paper. In a large mixing bowl, whisk together the flour, granulated sugar, baking powder, salt, and lemon zest.',
          durationMinutes: 5,
          tip: 'Whisking the lemon zest with the sugar prior to adding dry ingredients releases citrus aromatic oils into the pastry structure!'
        },
        {
          stepNumber: 2,
          instruction: 'Grate the frozen solid butter using a box grater directly into the dry ingredient mixture. Using a pastry cutter or two knives, cut the butter into the flour until it resembles coarse, pea-sized crumbs.',
          durationMinutes: 5,
          tip: 'Do not use your hands! Warm fingers will melt the delicate butter. Keep the butter cold to guarantee flakiness.'
        },
        {
          stepNumber: 3,
          instruction: 'In a small bowl, whisk 1/2 cup heavy cream and the egg together. Drizzle into the flour mixture, then add the fresh blueberries. Fold gently with a spatula just until a cohesive shaggy dough is formed.',
          durationMinutes: 4,
          tip: 'Avoid over-mixing, or the gluten will over-develop and make the scones dense instead of tender.'
        },
        {
          stepNumber: 4,
          instruction: 'Turn dough out onto a lightly floured surface. Work it gently into an 8-inch round disk about 1-inch thick. Use a sharp floured bench scraper or chef knife to slice the disk into 8 equal triangular wedges. Space wedges 2 inches apart on the baking sheet.',
          durationMinutes: 6,
          tip: 'Press straight down when slicing the wedges. Do not saw back and forth, as sawing seals the edges and prevents the layers from rising!'
        },
        {
          stepNumber: 5,
          instruction: 'Brush the tops lightly with extra heavy cream and sprinkle with turbinado sugar. Bake for 18-20 minutes until glorious rise and golden brown on top. Let cool on baking sheet for 5 minutes, then drizzle with whisked lemon glaze.',
          durationMinutes: 18,
          tip: 'Store leftovers in an airtight container for up to 3 days, or freeze the unbaked wedges for perfect scones anytime.'
        }
      ],
      nutrition: {
        calories: 320,
        protein: '4g',
        carbs: '46g',
        fat: '14g',
        fiber: '1g'
      }
    }
  },
  {
    id: 'editorial-1',
    type: 'editorial',
    slug: 'the-art-of-golden-sourdough',
    title: 'The Art of Golden Sourdough: Master the Hydration Circle',
    excerpt: 'An editorial exploration of baker-level hydration ratios, bulk fermentation cues, and heat mechanics to unlock deep-crusted, open-crumb sourdough at home.',
    coverImage: 'https://picsum.photos/seed/sourdough/800/600',
    publishedAt: '2026-06-14',
    author: {
      name: 'Chef James Courtland',
      avatar: 'https://picsum.photos/seed/bakerychef/150/150',
      bio: 'Pastry specialist, sourdough collector, and believer that cold butter makes the world go round.',
      socials: {
        pinterest: 'https://pinterest.com/james_pastry',
        instagram: 'https://instagram.com/james_pastry'
      }
    },
    tags: ['Baking', 'Sourdough', 'Kitchen Secrets', 'Editorial'],
    rating: 5.0,
    pinterestPinUrl: 'https://pinterest.com/pin/create/button/?url=https://savory-kitchen.com/the-art-of-golden-sourdough',
    editorial: {
      subtitle: 'Why Temperature, Not Time, Rules Your Ferment',
      introduction: 'Baking sourdough is not a recipe; it is a live partnership with wild yeast and lactic acid bacteria. For home bakers, translating this complex biological system into a predictable kitchen routine is the holy grail. Let\'s demystify hydration and steam mechanics.',
      insights: [
        {
          title: 'The Golden Hydration Sweetspot',
          content: 'New bakers often think higher hydration (78%+ water to flour) always equals better crumb. Actually, 70-72% hydration allows superior flour gluten development for beginners, generating excellent gas-retention structure that holds a taller, rounder oven spring.',
          iconName: 'Droplet'
        },
        {
          title: 'Judging the Bulk Ferment Peak',
          content: 'Never rely on clock-time for bulk fermentation! Yeast activity doubles with every 10 degree rise in ambient kitchen temperature. Instead, look for visual triggers: a 30-50% rise in bulk size, rounded aerated dome margins, domed gas bubbles, and a light jiggle when shaken.',
          iconName: 'TrendingUp'
        },
        {
          title: 'Steam: The Crust\'s Protective Armor',
          content: 'During the first 20 minutes of baking, steam gelatinizes surface starches in the crust, keeping it elastic so the loaf can expand fully. Without rich moisture, the crust seals prematurely, causing dense, choked crumb structures.',
          iconName: 'Flame'
        }
      ],
      bodyMarkdown: `
### Step-by-Step Action Plan for Deep Crusts

#### 1. Autolyse with Purpose
Combine your flour and water first, and let it rest for 45–60 minutes before adding the salt or active levain. This allows the proteins in the wheat (gliadin and glutenin) to absorb moisture and align without salt restricting their expansion. You'll build up strength with almost zero physical kneading.

#### 2. The Lamination Secret
Instead of heavy slap-and-folding, stretch your wet dough out flat onto a moist kitchen counter into a large, thin sheet during bulk fermentation. Fold ingredients in (like roasted garlic or herbs) and fold it back up. This aligns the crumb cell walls flatly for huge pockets when baked.

#### 3. Scoring Depth
Use a sharp razor blade held at a **30-degree angle** relative to the dough's surface, slicing 1/4 inch deep. Slicing with an angled blade creates an 'ear' flap. Steam lifts this flap, pushing a beautiful golden crust pattern outwards and upwards.
      `,
      keyTakeaways: [
        'A lower hydration ratio (70%) generates easier shaping for novices.',
        'Always judge bulk ferment by texture, rounded margins, and gas indicators—never look only at the kitchen clock.',
        'Preheat your heavy cast iron Dutch oven at 500°F (260°C) for a minimum of 45 minutes prior to bake.'
      ]
    }
  },
  {
    id: 'editorial-2',
    type: 'editorial',
    slug: '5-prep-secrets-from-pro-kitchens',
    title: '5 Prep Hacks to Speed Up Your Evenings',
    excerpt: 'How running a home kitchen like a high-volume culinary workstation can turn hectic weeknight prep into a therapeutic, rapid, and clean ritual.',
    coverImage: 'https://picsum.photos/seed/prep/800/600',
    publishedAt: '2026-06-10',
    author: {
      name: 'Chef Vanessa Alistoria',
      avatar: 'https://picsum.photos/seed/vchef/150/150',
      bio: 'Classical French trained chef focused on quick, high-vibrancy Italian cuisine.',
      socials: {
        pinterest: 'https://pinterest.com/vanessa_savory',
        instagram: 'https://instagram.com/vanessa_savory'
      }
    },
    tags: ['Kitchen Hacks', 'Cozy Cooking', 'Organizational Skills'],
    rating: 4.7,
    pinterestPinUrl: 'https://pinterest.com/pin/create/button/?url=https://savory-kitchen.com/5-prep-secrets-from-pro-kitchens',
    editorial: {
      subtitle: 'The Power of Mis En Place Mastery',
      introduction: 'Professional chefs are not inherently faster at slicing; they succeed because of rigorous structural discipline on their cutting boards. Let\'s capture the professional secrets that translate directly to a home kitchen.',
      insights: [
        {
          title: 'The Damp Towel Foundation',
          content: 'A shifting cutting board is highly dangerous and slows down your cutting work dramatically. Always place a damp paper towel or clean kitchen rag flatly underneath your cutting board to anchor it completely to the kitchen counter.',
          iconName: 'Layers'
        },
        {
          title: 'The Garbage Bowl Ritual',
          content: 'Save yourself dozens of trips to the garbage can! Keep a single wide stainless steel mixing bowl on your work board designated strictly for scrap, peelings, and trimmings. Keep your board clear, dry, and clean, and throw the waste away just once at the end.',
          iconName: 'Trash2'
        },
        {
          title: 'Grouping Ingredients by Cook-Time',
          content: 'Do not store a dozen separate tiny bowls of diced onion, carrot, garlic, celery, etc. Group them together in bowls according to when they enter the pan! For example: bowl 1 (onion + carrot for sofrito), bowl 2 (garlic + tomato paste for searing), bowl 3 (tender herbs for finishing).',
          iconName: 'Clock'
        }
      ],
      bodyMarkdown: `
### The Board Layout Principle: Top-Left to Bottom-Right

Keep your prep board divided like a spatial matrix:
1. **Unprepared Produce Zone (Top-Left)**: Raw, unpeeled whole vegetables enter here.
2. **Cutting Target (Center)**: The absolute center of your board is dedicated purely to the active slice. No food rests here.
3. **Mise En Place Stack (Top-Right)**: Golden slices, chopped aromatics, and completed items are pushed up here out of the way.
4. **Scrap Stream (Bottom-Left)**: Onion skins and garlic tops roll easily down here, directly adjacent to the garbage bowl.
      `,
      keyTakeaways: [
        'Secure your cutting board with a damp cloth to double your knife stroke speed and stability.',
        'Employ a local garbage bowl on your work surface to prevent counter clutter.',
        'Consolidate chopped vegetables in single dishes relative to their cook-times.'
      ]
    }
  }
];
