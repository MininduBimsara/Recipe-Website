export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Desserts' | 'Quick & Easy' | 'Vegetarian' | 'Meal Prep' | 'Drinks';
  prepTime: string;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  size: 'short' | 'medium' | 'tall';
  ingredients: string[];
  instructions: string[];
  tips: string[];
  pinterestDescription?: string;
  publishedAt?: string;
  cookTime?: string;
  totalTime?: string;
  recipeCuisine?: string;
  tags?: string[];
  author?: string;
}

export const RECIPES_DB: Recipe[] = [
  {
    id: '1',
    slug: 'artisanal-sourdough-levain',
    title: 'Rustic Sourdough Boule (78% Hydration)',
    description: 'An editorial guide to perfecting a blistered, open-crumb organic levain using stoneground heritage grains at home.',
    pinterestDescription: 'Perfect your bread-baking skills with this Rustic Sourdough Boule. Featuring a 78% hydration open-crumb levain using stoneground heritage grains. Great for organic baking, rich in taste and crunchy crust!',
    publishedAt: '2026-06-12T08:00:00Z',
    category: 'Breakfast',
    prepTime: '24 hrs',
    cookTime: 'PT42M',
    totalTime: 'PT24H42M',
    recipeCuisine: 'French',
    tags: ['Sourdough', 'Bread Baking', 'Organic Flour', 'Levain', 'Rustic Boule', 'Baking Guide'],
    author: 'Chef Alexandre Dumas',
    calories: 180,
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800',
    size: 'tall',
    ingredients: [
      '400g Artisanal Bread Flour (organic)',
      '100g Whole Wheat Heritage Flour',
      '390g Spring Water (90°F)',
      '100g Active Sourdough Starter',
      '11g Fine Sea Salt'
    ],
    instructions: [
      'Autolyse: Mix flours and water, let rest for 60 minutes.',
      'Incorporate: Mix starter and salt fully into the autolysed dough.',
      'Bulk Fermentation: Perform 4 sets of stretch-and-folds spaced 30 minutes apart.',
      'Shaping and Cold Proof: Pre-shape, rest for 20 minutes, shape into a tight boule, then proof overnight on canvas baskets in the fridge.',
      'Bake: Bake inside a preheated ceramic Dutch oven at 450°F covered for 20 minutes, then uncovered for 22 minutes until standard deep chestnut blister.'
    ],
    tips: [
      'Use filtered spring water to prevent chlorine from slowing down yeast cultures.',
      'For heavy blistering, spray water inside the Dutch oven lid before sealing.'
    ]
  },
  {
    id: '2',
    slug: 'heirloom-tomato-burrata-galette',
    title: 'Heirloom Tomato & Burrata Galette',
    description: 'A crisp, flaky laminated pastry crust topped with roasted summer heirloom tomatoes, balsamic glaze, and fresh creamy burrata.',
    pinterestDescription: 'Beautiful Heirloom Tomato & Burrata Galette with a crisp flaky laminated pastry crust, roasted tomatoes, sweet balsamic glaze, and creamy fresh burrata. Perfect summer lunch recipe!',
    publishedAt: '2026-06-14T11:30:00Z',
    category: 'Lunch',
    prepTime: '45 mins',
    cookTime: 'PT35M',
    totalTime: 'PT1H20M',
    recipeCuisine: 'Italian',
    tags: ['Galette', 'Heirloom Tomatoes', 'Burrata Cheese', 'Laminated Pastry', 'Summer Lunch', 'Balsamic Glaze'],
    author: 'Chef Alexandre Dumas',
    calories: 320,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=800',
    size: 'medium',
    ingredients: [
      '1 1/4 cups All-Purpose Flour',
      '1/2 cup Unsalted Butter (frozen cubes)',
      '3-4 tbsp Ice Water',
      '3 Heirloom Tomatoes (sliced thinly)',
      '1 ball Fresh Creamy Burrata',
      '2 tbsp Aged Balsamic Glaze',
      'Fresh Basil sprigs'
    ],
    instructions: [
      'Pastry: Cut butter into flour till pea-sized. Add ice water, shape into a disc, and chill for 1 hour.',
      'Assemble: Roll pastry into a 12-inch circle. Layer sliced tomatoes in the center, leaving a 2-inch border.',
      'Fold & Bake: Fold edges inwards. Brush pastry with egg wash. Bake at 400°F (200°C) for 35 minutes until deep golden crust.',
      'Finish: Top hot galette with burrata, drizzle balsamic, and scatter basil before immediate serving.'
    ],
    tips: [
      'Salt the tomato slices and let them drain on paper towels for 15 minutes before assembly to avoid a soggy bottom.'
    ]
  },
  {
    id: '3',
    slug: 'pan-seared-scallops-saffron-risotto',
    title: 'Pan-Seared Scallops on Saffron Risotto',
    description: 'Golden, perfectly carmelized wild sea scallops served over a luxurious, rich saffron-infused Arborio rice bowl.',
    category: 'Dinner',
    prepTime: '40 mins',
    calories: 540,
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800',
    size: 'short',
    ingredients: [
      '1 cup Arborio Rice',
      '1/2 tsp Saffron Threads',
      '4 cups Simmering Vegetable Stock',
      '8 Dry Wild Sea Scallops',
      '2 tbsp Ghee (for scallop sear)',
      '1/2 cup Dry White Wine',
      '1/2 cup Freshly Grated Parmigiano-Reggiano'
    ],
    instructions: [
      'Saffron broth: Steep saffron threads in warm simmering stock.',
      'Risotto: Sauté shallots, toast arborio rice, deglaze with white wine, and add stock slowly ladle-by-ladle, stirring continuously for 20 minutes.',
      'Scallops: Pat scallops dry, season with flaky salt, and sear in a smoking hot cast iron with butter for exactly 2 minutes per side.',
      'Serve: Fold parmesan into risotto, spoon onto a shallow bowl, and place scallops gracefully on top.'
    ],
    tips: [
      'To get a perfect crust on scallops, ensure they are dry and your frying pan is thoroughly preheated.'
    ]
  },
  {
    id: '4',
    slug: 'pistachio-matcha-mille-crepe',
    title: 'Pistachio Matcha Mille-Crêpe Cake',
    description: 'Twenty layers of paper-thin matcha crepes stacked together with a whipped, emerald Sicilian pistachio pastry cream.',
    category: 'Desserts',
    prepTime: '60 mins',
    calories: 420,
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
    size: 'tall',
    ingredients: [
      '3 Eggs',
      '1 1/2 cups Milk',
      '1 cup Flour',
      '2 tbsp Organic Culinary Matcha',
      '2 cups Whipping Cream',
      '4 tbsp Pure Sicilian Pistachio Paste',
      '1/3 cup Powdered Honey'
    ],
    instructions: [
      'Crêpe Batter: Whisk eggs, milk, flour, and matcha together until silky smooth. Strain to remove any lumps.',
      'Cook: Pour brief batter in an 8-inch skillet, cooking thin crêpes for 30 seconds per side. Make 20-22 sheets.',
      'Pistachio Cream: Whip heavy cream, powdered honey, and pistachio paste together until stiff peaks form.',
      'Assemble: Stack crêpes on a cake stand, spreading a thin layer of pistachio cream between each slice. Cool for 4 hours.'
    ],
    tips: [
      'Chill the crêpes completely before assembly to prevent the whipped pastry cream from melting.'
    ]
  },
  {
    id: '5',
    slug: 'avocado-creme-toast-poached-egg',
    title: 'Whipped Avocado Toast & Poached Egg',
    description: 'Crisp levain sourdough layered with a whipped, lime-zested avocado emulsion and a perfect organic slow-poached egg.',
    category: 'Quick & Easy',
    prepTime: '15 mins',
    calories: 290,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
    size: 'short',
    ingredients: [
      '2 thick slices Levain Sourdough',
      '2 Haas Hass Avocados',
      '1 Lime (zested and juiced)',
      '2 Organic Free-range Eggs',
      'Flaky Sea Salt & Chili Flakes',
      'Micro-greens for finishing'
    ],
    instructions: [
      'Whip Avocado: Purée avocados, lime juice, sea salt, and olive oil in a blender until extremely fluffy and neon-green.',
      'Poach Egg: Brink water with 1 tbsp vinegar to a bare simmer. Create a gentle whirlpool and slip egg in for 3 minutes.',
      'Toast Sourdough: Toast sourdough slices with extra virgin olive oil till deep brown.',
      'Compose: Smear whipped avocado generously, place poached egg, and shower with red chili flakes and micro-greens.'
    ],
    tips: [
      'A splash of vinegar in poaching water keeps egg whites tightly bound without affecting flavor.'
    ]
  },
  {
    id: '6',
    slug: 'roasted-butternut-sage-buddha',
    title: 'Roasted Butternut Squash & Sage Buddha Bowl',
    description: 'A wholesome, plant-based power bowl centering caramelized maple squash, tricolor quinoa, and toasted pumpkin seed butter dressing.',
    category: 'Vegetarian',
    prepTime: '30 mins',
    calories: 380,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    size: 'medium',
    ingredients: [
      '1 Butternut Squash (cubed)',
      '10 Sage leaves (crisped in olive oil)',
      '1 cup Tricolor Quinoa (uncooked)',
      '2 cups Fresh Baby Spinach',
      '3 tbsp Toasted Pumpkin Seeds',
      'Maple Tahini Dressing (Tahini + Maple syrup + Lemon juice)'
    ],
    instructions: [
      'Roast: Toss butternut squash cubes with olive oil, maple syrup, salt, and bake at 400°F (200°C) for 25 minutes.',
      'Grains: Boil quinoa in salted vegetable broth. Fluff and fold in fresh baby spinach to wilt.',
      'Crisp Sage: Fry sage leaves in smoking hot olive oil until brittle and fragrant.',
      'Plate: Assemble quinoa, roasted squash, seeds in bowls. Drizzle tahini dressing and scatter crispy sage.'
    ],
    tips: [
      'Replace butternut squash with sweet potato or pumpkin depending on regional autumn harvest Availability.'
    ]
  },
  {
    id: '7',
    slug: 'herb-crsuted-salmon-mealprep',
    title: 'Herb-Crusted King Salmon & Asparagus',
    description: 'High-protein, heart-healthy wild Atlantic salmon baked with a crunchy parsley-pecan shell, served with pencil asparagus.',
    category: 'Meal Prep',
    prepTime: '25 mins',
    calories: 480,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
    size: 'medium',
    ingredients: [
      '4 Wild-caught King Salmon filets',
      '1/2 cup Pecans (finely chopped)',
      '3 tbsp Fresh Parsley & Dill',
      '1 tbsp Dijon Mustard',
      '1 bunch English Asparagus',
      '1 Lemon (sliced)'
    ],
    instructions: [
      'Prep Shell: Mix chopped pecans, minced herbs, and olive oil in a small bowl.',
      'Salmon Paint: Coat the top of salmon filets with a thin trace of Dijon mustard to act as glue.',
      'Crust: Press the herb-pecan mixture firmly onto the mustard coat.',
      'Bake: Lay salmon and asparagus onto a sheet pan. Bake at 375°F (190°C) for 12-15 minutes until salmon flakes with a fork.'
    ],
    tips: [
      'This meal holds beautifully in glass containers for up to 4 days. Reheat gently to prevent drying.'
    ]
  },
  {
    id: '8',
    slug: 'smoked-rosemary-grapefruit-paloma',
    title: 'Smoked Rosemary Grapefruit Paloma',
    description: 'An aromatic, craft mocktail combining fresh pressed pink grapefruit juice, sparkling tonic, and burned rosemary smoke.',
    category: 'Drinks',
    prepTime: '10 mins',
    calories: 90,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    size: 'short',
    ingredients: [
      '1 Fresh Pink Grapefruit (juiced)',
      '1/2 oz Organic Agave Nectar',
      '3 oz Artisanal Club Soda or Tonic',
      '2 sprigs Fresh Rosemary',
      'Salt rim & slice of lime'
    ],
    instructions: [
      'Rim: Wipe grease of lime around glass rim, Dip in coarse sea salt.',
      'Mix: Shake grapefruit juice, agave, and one sprig rosemary in an ice-filled shaker.',
      'Pour: Strain into the salted glass over a block of clear sphere ice. Top with club soda.',
      'Smoke: Light the remaining rosemary hook with a torch till smoking, and drop it smoldering into the glass.'
    ],
    tips: [
      'Smoked herbs add deep autumnal woods flavor profile to citrus mocktails.'
    ]
  },
  {
    id: '9',
    slug: 'french-croque-madame-editorial',
    title: 'Artisan Croque Madame',
    description: 'The Parisian bistro classic: thick pullman brioche, gruyère cheese bamel sauce, smoked ham, topped with a direct sunny-side egg.',
    category: 'Lunch',
    prepTime: '20 mins',
    calories: 610,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    size: 'tall',
    ingredients: [
      '4 slices Thick Brioche or Pullman bread',
      '4 slices Smoked Black Forest Ham',
      '1 cup Gruyère Cheese (grated)',
      '1 cup Béchamel Sauce (Butter, Flour, Milk, Nutmeg)',
      '2 Fresh Farm Eggs'
    ],
    instructions: [
      'Bechamel: Whisk hot milk into butter-flour roux. Season with freshly grated nutmeg and Gruyère.',
      'Sandwich: Paint brioche with French mustard, spread ham, cheese, and sandwich together.',
      'Bake: Coat the top of the sandwich with rest of Gruyère and béchamel. Broil at 420°F until bubbling.',
      'Egg: Fry farm eggs separately till edges are crispy and drop onto sandwiches. Serve instantly.'
    ],
    tips: [
      'Broil until cheese turns dark-brown speckled for that authentic French tavern texture.'
    ]
  },
  
  // PAGE 2 (DUMMY LAZY LOAD ARCHIVE ITEMS)
  {
    id: '10',
    slug: 'chilled-coconut-chia-pudding',
    title: 'Vanilla Bean Coconut Chia Pudding',
    description: 'An elegant superfood cup layered with Madagascar vanilla bean paste, hydrated chia seeds, and direct fresh mango gelée.',
    category: 'Breakfast',
    prepTime: '15 mins',
    calories: 220,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
    size: 'short',
    ingredients: [
      '1/4 cup Black Chia Seeds',
      '1 cup Organic Coconut Milk',
      '1 tsp Madagascar Vanilla Bean Paste',
      '1 tbsp Maple Syrup',
      '1/2 cup Fresh Alphonso Mango (pureed)'
    ],
    instructions: [
      'Mix: Combine chia seeds, coconut milk, vanilla paste, and maple syrup in glass jar. Whisk well.',
      'Chill: Refrigerate for at least 4 hours, stirring once after 20 minutes.',
      'Layer: Place mango puree inside glass cup bases, scoop set vanilla chia, top with fresh berries.'
    ],
    tips: [
      'Whisking early prevents chia seeds from clumping at the glass bottoms.'
    ]
  },
  {
    id: '11',
    slug: 'sicilian-citrus-fennel-salad',
    title: 'Sicilian Blood Orange & Fennel Salad',
    description: 'A vibrant, crisp salad featuring hand-shaved fennel bulb, organic blood orange rounds, castelvetrano olives, and raw mint.',
    category: 'Lunch',
    prepTime: '15 mins',
    calories: 140,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
    size: 'medium',
    ingredients: [
      '1 Fennel Bulb (sliced razor-thin)',
      '2 Blood Oranges (peeled and sliced)',
      '1/2 cup Castelvetrano Green Olives',
      '3 tbsp Cold Pressed Olive Oil',
      'Heirloom Sea Salt & Fresh Mint'
    ],
    instructions: [
      'Shave: Use a mandoline to shave fennel bulb incredibly thin. Soak in ice water to curl.',
      'Oranges: Trim oranges and skin carefully. Cut circular discs.',
      'Dress: Toss drained dry fennel, oranges, olives, and olive oil with fresh torn mint leaves.'
    ],
    tips: [
      'Ice water crisping is the golden Parisian restaurant secret for making raw fennel sweet and crunchy.'
    ]
  },
  {
    id: '12',
    slug: 'slow-braised-beef-shortrib',
    title: 'Red Wine Slow-Braised Beef Short Ribs',
    description: 'Heirloom short ribs slowly braised for 8 hours in rich Cabernet Sauvignon bone reduction broth, resting on parsnip puree.',
    category: 'Dinner',
    prepTime: '8 hrs',
    calories: 780,
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    size: 'tall',
    ingredients: [
      '4 large marbled Beef Short Ribs',
      '1 bottle dryness Cabernet Sauvignon',
      '1 quart Roasted Veal Bone Broth',
      'Mirepoix (Celery, Onions, Carrots)',
      'Parsnips & heavy cream'
    ],
    instructions: [
      'Sear: Brown short ribs on high heat inside enamel Dutch Oven. Set aside.',
      'Sauté: Caramelize mirepoix vegetables. Deglaze with red wine, reduce by 50%.',
      'Braise: Nest short ribs back, submerge in roasted bone broth. Cover and bake at 275°F for 4.5 hours.',
      'Reduce: Strain cooking liquor and reduce until slick, spoonable demi-glace. Serve over whipped parsnips.'
    ],
    tips: [
      'Leave ribs overnight in fridge before cooking for ultimate skin crisp sears later.'
    ]
  },
  {
    id: '13',
    slug: 'meyer-lemon-meringue-tartlets',
    title: 'Meyer Lemon Meringue Sweet Tartlets',
    description: 'A crisp, sweet sablée shell containing zesty Meyer lemon curd and pillowed with toasted French torch meringue ridges.',
    category: 'Desserts',
    prepTime: '45 mins',
    calories: 310,
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800',
    size: 'short',
    ingredients: [
      'Pâte Sablée Crusts (pre-baked)',
      '4 Meyer Lemons (juiced & zested)',
      '4 Egg yolks (for curd)',
      '3 Egg whites (for meringue)',
      '1/2 cup Butter (whisked cold in bits)'
    ],
    instructions: [
      'Curd: Cook lemon juice, zest, sugar, and egg yolks over double-boiler. Whisk in cold butter cubes slowly till dense.',
      'Fill: Spoon lemon curd into pre-baked crust shells. Chill to set.',
      'Meringue: Whip egg whites with sugar till glossy peaks. Pipe onto tarts and torch until charred marshmallow finish.'
    ],
    tips: [
      'Meyer lemons offer a sweeter, orange-floral citrus hybrid profile superior to regular Eureka lemons.'
    ]
  },
  {
    id: '14',
    slug: 'authentic-tuscan-pici-cacio-pepe',
    title: 'Tuscan Hand-Rolled Pici Cacio e Pepe',
    description: 'Pristine hand-rolled thick pici pasta tossed with raw Pecorino Romano cheese paste and cracked black peppercorn broth.',
    category: 'Quick & Easy',
    prepTime: '25 mins',
    calories: 490,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800',
    size: 'medium',
    ingredients: [
      '300g Semola Semolina Flour',
      '150g Warm Water',
      '1 cup Pecorino Romano (grated fine)',
      '2 tbsp Whole Black Peppercorns'
    ],
    instructions: [
      'Pasta: Mix flour and water, knead 10 mins. Roll dough thin and slice. Hand twist individual strand thick worms (pici).',
      'Peppercorns: Toast peppercorns in dry skillet, then crush in stone pestle mortar.',
      'Emulsion: Boil pici. Mix cheese with ladle of pasta cooking water to form paste. Fold pasta, cheese, and black pepper till silky grease sauce.'
    ],
    tips: [
      'Never heat the cheese paste directly; emulsify using residual heat of pasta water to avoid clumping.'
    ]
  },
  {
    id: '15',
    slug: 'roasted-cauliflower-tahini-hummus',
    title: 'Roasted Cauliflower Steaks & Herb Tahini',
    description: 'Thick organic cauliflower steaks roasted with smoked paprika, served on luxurious bed of white bean hummus.',
    category: 'Vegetarian',
    prepTime: '25 mins',
    calories: 270,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?auto=format&fit=crop&q=80&w=800',
    size: 'medium',
    ingredients: [
      '1 head Cauliflower (sliced into 1-inch thick steaks)',
      '1 can Cannellini Beans',
      '1/3 cup Sesame Tahini paste',
      'Fresh Rosemary, Thyme, Paprika'
    ],
    instructions: [
      'Roast: Season cauliflower steaks with salt, smoked paprika, garlic powder, and roast on parchment sheets at 400°F for 22 minutes.',
      'Hummus: Purée cannellini beans, garlic clove, lemon, and tahini.',
      'Assemble: Spread white bean base on large plates, rest roasted cauliflower steaks, and paint with fresh green herb tahini sauce.'
    ],
    tips: [
      'Bake cauliflowers at high heat to achieve crispy charred tips while preserving internal butter tenderness.'
    ]
  },
  {
    id: '16',
    slug: 'cold-brew-matcha-lemonade',
    title: 'Cold-Brewed Emerald Matcha Lemonade',
    description: 'An ultra-refreshing summer draft pairing ceremonial-grade sweet Japanese matcha over a base of fresh squeezed lemon water.',
    category: 'Drinks',
    prepTime: '5 mins',
    calories: 80,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800',
    size: 'short',
    ingredients: [
      '1.5 tsp Ceremonial-Grade Matcha',
      '1 cup Cold Water',
      '1/2 cup Fresh Lemon Juice',
      '2 tbsp Organic Honey or Simple Syrup',
      'Mint leaves & Lemon wheel'
    ],
    instructions: [
      'Lemon Base: Whisk fresh lemon juice and honey with cold water in glass shaker.',
      'Matcha Brew: In a separate cup, shake matcha with ice-cold water vigorously to dissolve bubbles.',
      'Layer: Fill glass with crushed ice, pour lemon base first, then gently float emerald matcha layer on top.'
    ],
    tips: [
      'Use high quality ceremonial grade matcha for sweet, non-grassy emerald green aesthetic layers.'
    ]
  },
  {
    id: '17',
    slug: 'turmeric-ginger-glow-latte',
    title: 'Turmeric Ginger Sunshine Tonic',
    description: 'A comforting, warm milk-steer laced with cold-pressed turmeric roots, spicy black ginger, black pepper flakes, and honey cream.',
    category: 'Drinks',
    prepTime: '10 mins',
    calories: 140,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800',
    size: 'short',
    ingredients: [
      '1.5 cups Coconut or Oat Milk',
      '1 tsp Raw Turmeric Powder (or pressed juice)',
      '1/2 tsp Grated Ginger juice',
      '1 pinch Cracked Black Pepper',
      '1 tsp Raw Honey'
    ],
    instructions: [
      'Heat: Steer/warm coconut milk in a saucier pot under boiling heat.',
      'Whisk: Whisk turmeric, ginger juice, black pepper (essential for curcumin activation), and honey.',
      'Froth: Froth with a hand-milk whisk and garnish with dusting of cinnamon dust.'
    ],
    tips: [
      'Adding black pepper enhances turmeric bio-absorption by up to 2000%.'
    ]
  },
  {
    id: '18',
    slug: 'mediterranean-shakshuka-feta',
    title: 'Tashkabula Shakshuka with Feta Flakes',
    description: 'A steaming hot skillet of spiced red bell peppers, roasted heirloom tomatoes, soft poached farm eggs, and sheep milk feta cheese.',
    category: 'Breakfast',
    prepTime: '20 mins',
    calories: 340,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1590412200988-a436bb7050a8?auto=format&fit=crop&q=80&w=800',
    size: 'medium',
    ingredients: [
      '4 Organic Eggs',
      '1 can San Marzano tomatoes (crushed)',
      '1 Red Bell Pepper (chopped)',
      '3 cloves Garlic (minced)',
      '1 tsp Ground Cumin & Paprika',
      '1/2 cup Feta cheese (crumbled)',
      'Fresh Coriander Cilantro'
    ],
    instructions: [
      'Base: Sauté bell peppers, garlic, cumin, and paprika in premium olive oil until fragrant. Pour in San Marzano tomatoes, cook 10 minutes.',
      'Poach: Nest 4 wells, crack eggs inside. Cover skillet, cooking over low heat for 6 minutes.',
      'Plate: Shower steaming skillet with feta crumbles, red chili, and fresh coriander. Dip with crusty artisanal levain.'
    ],
    tips: [
      'Ensure tomato broth is simmering, not boiling, to prevent egg yolks from turning solid before egg whites.'
    ]
  }
];
