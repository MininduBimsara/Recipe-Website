-- =====================================================================
-- PEBBLEPLATE - SUPABASE DATABASE SEED SCRIPT (NO IMAGES)
-- Run this inside the Supabase SQL Editor to refresh all recipes.
-- Cover images and instruction step images are set to NULL / empty strings.
-- =====================================================================

TRUNCATE TABLE public.recipes CASCADE;

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'classic-french-tarte-au-citron', 'Classic French Tarte au Citron', 'An exquisite, silky-smooth lemon tart featuring a perfectly crisp pâte sablée sweet pastry crust and a bright, buttery lemon curd that strikes the perfect note between sweet and tangy.', NULL, 'DESSERT', 'FRENCH', 'MEDIUM',
  45, 25, 8, 320, ARRAY['baking', 'citrus', 'french pastry', 'tart', 'desserts']::text[], '[{"quantity":150,"unit":"g","name":"All-purpose Flour","notes":"Sifted"},{"quantity":90,"unit":"g","name":"Unsalted Butter","notes":"Cold, cubed for pastry"},{"quantity":50,"unit":"g","name":"Powdered Sugar","notes":""},{"quantity":1,"unit":"pc","name":"Egg yolk","notes":"For the dough binder"},{"quantity":4,"unit":"pc","name":"Large organic lemons","notes":"Zested and juiced"},{"quantity":150,"unit":"g","name":"Granulated sugar","notes":"For lemon curd balance"},{"quantity":3,"unit":"pc","name":"Whole organic eggs","notes":"Room temp"},{"quantity":125,"unit":"g","name":"Unsalted Butter","notes":"Room temp, cubed for curd whisking"}]'::jsonb, '[{"stepNumber":1,"body":"Combine the flour, powdered sugar, and a pinch of salt in a food processor. Add the 90g of cold cubed butter and pulse until the mixture resembles wet sand.","tip":"Avoid over-processing to ensure the crust remains light and beautifully flaky.","imageSrc":""},{"stepNumber":2,"body":"Add the egg yolk and 1-2 teaspoons of ice-cold water, pulsing until the pastry dough starts to cling together. Press the dough into a disk, wrap in wax paper, and chill in the refrigerator for at least 30 minutes.","tip":"Chilling prevents the butter from melting, ensuring a stable shortcrust structure.","imageSrc":""},{"stepNumber":3,"body":"Roll the chilled pastry out on a floured surface to 3mm thickness, fit it into a 9-inch loose-bottomed tart tin, and blind-bake with pie weights at 375°F (190°C) for 15 minutes, then 10 minutes uncovered until golden brown.","tip":"Use dried beans or ceramic weights over parchment paper for the blind-bake.","imageSrc":""},{"stepNumber":4,"body":"Whisk lemon juice, lemon zest, whole eggs, and granulated sugar in a heatproof bowl. Cook over a water bath (double boiler) on low heat, stirring continuously until the custard thickens to coat the spoon.","tip":"Heat gently; cooking too fast will scramble the eggs instead of creating a smooth custard.","imageSrc":""},{"stepNumber":5,"body":"Remove the custard from heat, sieve it into a clean bowl, and allow it to cool slightly. Whisk in the 125g room temp butter cubes one by one until silky and emulsified. Pour into the baked shell and chill for 4 hours.","tip":"For an elegant presentation, garnish with fresh raspberries or a dust of powdered sugar right before serving.","imageSrc":""}]'::jsonb,
  '["For a perfectly flat crust that never bubbles up, prick the bottom of the rolled pastry thoroughly with a table fork before blind-baking.","Sieving the lemon curd before whisking in the room temperature butter removes any small white egg bits, creating a supreme editorial glaze texture."]'::jsonb, 'Elevate your baking skills with our easy French Lemon Tart Recipe! A crisp buttery pâte sablée crust filled with a sublime silky-smooth, vibrant lemon curd. Perfect for weekend hosting or dessert cravings! 🍋✨', true, true, '2026-05-12T08:00:00Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'rustic-sourdough-boule', 'Rustic Sourdough Boule', 'A high-hydration, crusty artisanal sourdough bread displaying an airy open crumb structure, a chewy texture, and that signature wild yeast tangy flavor profile.', NULL, 'BAKING', 'AMERICAN', 'HARD',
  120, 45, 10, 180, ARRAY['baking', 'bread', 'sourdough', 'fermentation', 'wild yeast']::text[], '[{"quantity":400,"unit":"g","name":"Artisanal Bread Flour","notes":"High protein count, 12%+"},{"quantity":100,"unit":"g","name":"Whole Wheat Flour","notes":"Stoneground for deeper flavor"},{"quantity":375,"unit":"g","name":"Water","notes":"Filtered, warm 80°F"},{"quantity":100,"unit":"g","name":"Active Sourdough Starter","notes":"Fed 4-6 hours prior, fully bubbly"},{"quantity":10,"unit":"g","name":"Fine Sea Salt","notes":"Avoid iodized salt"}]'::jsonb, '[{"stepNumber":1,"body":"Autolyse stage: Mix the bread flour, whole wheat flour, and 350g of water together in a large bowl. Let rest for 45 minutes to encourage gluten alignment before adding yeast and salt.","tip":"Do not skip autolysing; it greatly reduces your overall active kneading or stretching time.","imageSrc":""},{"stepNumber":2,"body":"Add the bubbly starter, salt, and remaining 25g of water. Pinch and fold the dough together with your fingers until fully incorporated and wet.","tip":"Keep a bowl of warm water nearby to wet your hands, keeping the high hydration dough from sticking.","imageSrc":""},{"stepNumber":3,"body":"Perform bulk fermentation: Over the next 4 hours, execute 4 sets of stretch-and-folds spaced 30 minutes apart, letting dough rise under a wet kitchen towel.","tip":"Pull the dough gently upwards until you feel tension, then fold it back on itself without tearing.","imageSrc":""},{"stepNumber":4,"body":"Shape dough gently into a round boule, surface tension tightening it. Place seam-side up in a floured banneton basket, wrap in a plastic bag, and retard overnight inside the fridge (12-16 hours).","tip":"Cold fermentation sweetens and develops that deeply satisfying tangy sourdough flavor profile.","imageSrc":""},{"stepNumber":5,"body":"Preheat a heavy Dutch oven at 500°F (260°C). Turn the chilled dough out onto parchment, score the top with a razor lame at a 45-degree angle, transfer to preheated pot, cover with a heavy lid, and bake for 20 minutes. Remove lid, reduce heat to 450°F, and bake for 22 more minutes.","tip":"Baking covered locks in moisture, creating pristine expansion (the ''oven spring'') and a crispy caramelized glass crust.","imageSrc":""}]'::jsonb,
  '["To obtain a stunning blistering crust, spray 2-3 mists of water inside the hot Dutch oven lid right as you seal the bread to capture maximum steam.","Resist cutting the loaf open for at least 2 hours. Sourdough continues cooking internally as it cools; cutting too soon results in a gummy, wet crumb structure."]'::jsonb, 'The ultimate home Sourdough bread recipe! 🥖 Crispy, blistered, gorgeous golden crust with an airy crumb and tangy, wild yeast complexity. Includes comprehensive stretch-and-fold guides! Save this pin for weekend baking! #sourdough #breadart', false, true, '2026-05-20T09:00:00Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'mediterranean-shakshuka', 'Mediterranean Shakshuka', 'A comforting, vibrant skillet of eggs gently poached in a rich, spiced sauce of San Marzano tomatoes, bell peppers, garlic, and fresh premium olive oil, accented with crumbly feta and cilantro.', NULL, 'BREAKFAST', 'MEDITERRANEAN', 'EASY',
  15, 20, 4, 260, ARRAY['shakshuka', 'mediterranean', 'eggs', 'brunch', 'one-pan']::text[], '[{"quantity":2,"unit":"tbsp","name":"Extra Virgin Olive Oil","notes":"First cold pressed"},{"quantity":1,"unit":"pc","name":"Yellow Onion","notes":"Diced fine"},{"quantity":1,"unit":"pc","name":"Red Bell Pepper","notes":"Seeded and chopped"},{"quantity":3,"unit":"pc","name":"Garlic cloves","notes":"Minced"},{"quantity":1,"unit":"tsp","name":"Ground Cumin","notes":"Toasted and freshly ground"},{"quantity":1,"unit":"tsp","name":"Smoked Paprika","notes":"Sweet spanish style"},{"quantity":1,"unit":"can","name":"San Marzano Whole Peeled Tomatoes","notes":"28 oz, crushed by hand"},{"quantity":6,"unit":"pc","name":"Large eggs","notes":"Pasture-raised"},{"quantity":50,"unit":"g","name":"Feta cheese","notes":"Authentic sheep milk sheep feta"},{"quantity":0.25,"unit":"cup","name":"Fresh coriander/cilantro","notes":"Chopped rough"}]'::jsonb, '[{"stepNumber":1,"body":"Heat the extra virgin olive oil in a large cast-iron skillet over medium heat. Add the diced onion and bell pepper, sautéing until soft, sweet, and translucent (about 6 minutes).","tip":"Sautéing sluggishly on lower heat draws out maximum natural sugar from peppers and onions.","imageSrc":""},{"stepNumber":2,"body":"Add the minced garlic, ground cumin, smoked paprika, and a pinch of black pepper. Stir continuously for 1 minute until the kitchen is filled with warm, aromatic toasted spice notes.","tip":"Blooming spices directly in warm oils releases oil-soluble flavor molecules that deepens the tomato base.","imageSrc":""},{"stepNumber":3,"body":"Pour in the hand-crushed whole tomatoes along with all their pure juices. Simmer uncovered for 10-12 minutes until the sauce thickens and consolidates into a rich, savory emulsion.","tip":"Scrape the browned spicy bits off the bottom of the cast iron continuously with a flat wooden spatula.","imageSrc":""},{"stepNumber":4,"body":"Use a large culinary spoon to make 6 small well-shaped indentations in the bubbling sauce. Crack an egg directly into each well. Cover the skillet tightly with a lid and cook on medium-low for 5-8 minutes.","tip":"Watch closely: you want the whites fully set but the golden yolks incredibly wet, runny, and silky.","imageSrc":""},{"stepNumber":5,"body":"Remove the skillet from high heat. Garnish generously with crumbled feta cheese, chopped cilantro, fresh ground pepper, and a final drizzle of extra-virgin olive oil. Serve sizzling hot directly inside cast iron alongside sourdough bread.","tip":"Thick slices of toasted sourdough bread are perfect for dipping and sweeping up the rich sauce.","imageSrc":""}]'::jsonb,
  '["Adding a small pinch of honey or organic brown sugar balances out any tinny acidity in the tomatoes without making the dish taste sweet.","Slightly crushing the garlic instead of mincing fine allows the juices to enter slowly, keeping the vegetable from burning in the hot iron."]'::jsonb, 'The only Shakshuka recipe you''ll ever need! Eggs poached to runny perfection in a savory, smoky bell pepper and tomato stew. Finished with sheep milk feta! Beautiful weekend brunch 🍳🌿 #shakshuka #brunchideas #eggrecipes', true, true, '2026-05-28T09:30:00Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'artisanal-sourdough-levain', 'Rustic Sourdough Boule (78% Hydration)', 'An editorial guide to perfecting a blistered, open-crumb organic levain using stoneground heritage grains at home.', NULL, 'BREAKFAST', 'FRENCH', 'HARD',
  24, 42, 4, 180, ARRAY['Sourdough', 'Bread Baking', 'Organic Flour', 'Levain', 'Rustic Boule', 'Baking Guide']::text[], '["400g Artisanal Bread Flour (organic)","100g Whole Wheat Heritage Flour","390g Spring Water (90°F)","100g Active Sourdough Starter","11g Fine Sea Salt"]'::jsonb, '["Autolyse: Mix flours and water, let rest for 60 minutes.","Incorporate: Mix starter and salt fully into the autolysed dough.","Bulk Fermentation: Perform 4 sets of stretch-and-folds spaced 30 minutes apart.","Shaping and Cold Proof: Pre-shape, rest for 20 minutes, shape into a tight boule, then proof overnight on canvas baskets in the fridge.","Bake: Bake inside a preheated ceramic Dutch oven at 450°F covered for 20 minutes, then uncovered for 22 minutes until standard deep chestnut blister."]'::jsonb,
  '["Use filtered spring water to prevent chlorine from slowing down yeast cultures.","For heavy blistering, spray water inside the Dutch oven lid before sealing."]'::jsonb, 'Perfect your bread-baking skills with this Rustic Sourdough Boule. Featuring a 78% hydration open-crumb levain using stoneground heritage grains. Great for organic baking, rich in taste and crunchy crust!', false, true, '2026-06-12T08:00:00Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'heirloom-tomato-burrata-galette', 'Heirloom Tomato & Burrata Galette', 'A crisp, flaky laminated pastry crust topped with roasted summer heirloom tomatoes, balsamic glaze, and fresh creamy burrata.', NULL, 'LUNCH', 'ITALIAN', 'MEDIUM',
  45, 35, 4, 320, ARRAY['Galette', 'Heirloom Tomatoes', 'Burrata Cheese', 'Laminated Pastry', 'Summer Lunch', 'Balsamic Glaze']::text[], '["1 1/4 cups All-Purpose Flour","1/2 cup Unsalted Butter (frozen cubes)","3-4 tbsp Ice Water","3 Heirloom Tomatoes (sliced thinly)","1 ball Fresh Creamy Burrata","2 tbsp Aged Balsamic Glaze","Fresh Basil sprigs"]'::jsonb, '["Pastry: Cut butter into flour till pea-sized. Add ice water, shape into a disc, and chill for 1 hour.","Assemble: Roll pastry into a 12-inch circle. Layer sliced tomatoes in the center, leaving a 2-inch border.","Fold & Bake: Fold edges inwards. Brush pastry with egg wash. Bake at 400°F (200°C) for 35 minutes until deep golden crust.","Finish: Top hot galette with burrata, drizzle balsamic, and scatter basil before immediate serving."]'::jsonb,
  '["Salt the tomato slices and let them drain on paper towels for 15 minutes before assembly to avoid a soggy bottom."]'::jsonb, 'Beautiful Heirloom Tomato & Burrata Galette with a crisp flaky laminated pastry crust, roasted tomatoes, sweet balsamic glaze, and creamy fresh burrata. Perfect summer lunch recipe!', false, true, '2026-06-14T11:30:00Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'pan-seared-scallops-saffron-risotto', 'Pan-Seared Scallops on Saffron Risotto', 'Golden, perfectly carmelized wild sea scallops served over a luxurious, rich saffron-infused Arborio rice bowl.', NULL, 'DINNER', 'AMERICAN', 'HARD',
  40, 15, 4, 540, NULL, '["1 cup Arborio Rice","1/2 tsp Saffron Threads","4 cups Simmering Vegetable Stock","8 Dry Wild Sea Scallops","2 tbsp Ghee (for scallop sear)","1/2 cup Dry White Wine","1/2 cup Freshly Grated Parmigiano-Reggiano"]'::jsonb, '["Saffron broth: Steep saffron threads in warm simmering stock.","Risotto: Sauté shallots, toast arborio rice, deglaze with white wine, and add stock slowly ladle-by-ladle, stirring continuously for 20 minutes.","Scallops: Pat scallops dry, season with flaky salt, and sear in a smoking hot cast iron with butter for exactly 2 minutes per side.","Serve: Fold parmesan into risotto, spoon onto a shallow bowl, and place scallops gracefully on top."]'::jsonb,
  '["To get a perfect crust on scallops, ensure they are dry and your frying pan is thoroughly preheated."]'::jsonb, '', false, true, '2026-06-24T16:56:10.160Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'pistachio-matcha-mille-crepe', 'Pistachio Matcha Mille-Crêpe Cake', 'Twenty layers of paper-thin matcha crepes stacked together with a whipped, emerald Sicilian pistachio pastry cream.', NULL, 'DESSERTS', 'AMERICAN', 'HARD',
  60, 15, 4, 420, NULL, '["3 Eggs","1 1/2 cups Milk","1 cup Flour","2 tbsp Organic Culinary Matcha","2 cups Whipping Cream","4 tbsp Pure Sicilian Pistachio Paste","1/3 cup Powdered Honey"]'::jsonb, '["Crêpe Batter: Whisk eggs, milk, flour, and matcha together until silky smooth. Strain to remove any lumps.","Cook: Pour brief batter in an 8-inch skillet, cooking thin crêpes for 30 seconds per side. Make 20-22 sheets.","Pistachio Cream: Whip heavy cream, powdered honey, and pistachio paste together until stiff peaks form.","Assemble: Stack crêpes on a cake stand, spreading a thin layer of pistachio cream between each slice. Cool for 4 hours."]'::jsonb,
  '["Chill the crêpes completely before assembly to prevent the whipped pastry cream from melting."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'avocado-creme-toast-poached-egg', 'Whipped Avocado Toast & Poached Egg', 'Crisp levain sourdough layered with a whipped, lime-zested avocado emulsion and a perfect organic slow-poached egg.', NULL, 'QUICK & EASY', 'AMERICAN', 'EASY',
  15, 15, 4, 290, NULL, '["2 thick slices Levain Sourdough","2 Haas Hass Avocados","1 Lime (zested and juiced)","2 Organic Free-range Eggs","Flaky Sea Salt & Chili Flakes","Micro-greens for finishing"]'::jsonb, '["Whip Avocado: Purée avocados, lime juice, sea salt, and olive oil in a blender until extremely fluffy and neon-green.","Poach Egg: Brink water with 1 tbsp vinegar to a bare simmer. Create a gentle whirlpool and slip egg in for 3 minutes.","Toast Sourdough: Toast sourdough slices with extra virgin olive oil till deep brown.","Compose: Smear whipped avocado generously, place poached egg, and shower with red chili flakes and micro-greens."]'::jsonb,
  '["A splash of vinegar in poaching water keeps egg whites tightly bound without affecting flavor."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'roasted-butternut-sage-buddha', 'Roasted Butternut Squash & Sage Buddha Bowl', 'A wholesome, plant-based power bowl centering caramelized maple squash, tricolor quinoa, and toasted pumpkin seed butter dressing.', NULL, 'VEGETARIAN', 'AMERICAN', 'EASY',
  30, 15, 4, 380, NULL, '["1 Butternut Squash (cubed)","10 Sage leaves (crisped in olive oil)","1 cup Tricolor Quinoa (uncooked)","2 cups Fresh Baby Spinach","3 tbsp Toasted Pumpkin Seeds","Maple Tahini Dressing (Tahini + Maple syrup + Lemon juice)"]'::jsonb, '["Roast: Toss butternut squash cubes with olive oil, maple syrup, salt, and bake at 400°F (200°C) for 25 minutes.","Grains: Boil quinoa in salted vegetable broth. Fluff and fold in fresh baby spinach to wilt.","Crisp Sage: Fry sage leaves in smoking hot olive oil until brittle and fragrant.","Plate: Assemble quinoa, roasted squash, seeds in bowls. Drizzle tahini dressing and scatter crispy sage."]'::jsonb,
  '["Replace butternut squash with sweet potato or pumpkin depending on regional autumn harvest Availability."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'herb-crsuted-salmon-mealprep', 'Herb-Crusted King Salmon & Asparagus', 'High-protein, heart-healthy wild Atlantic salmon baked with a crunchy parsley-pecan shell, served with pencil asparagus.', NULL, 'MEAL PREP', 'AMERICAN', 'MEDIUM',
  25, 15, 4, 480, NULL, '["4 Wild-caught King Salmon filets","1/2 cup Pecans (finely chopped)","3 tbsp Fresh Parsley & Dill","1 tbsp Dijon Mustard","1 bunch English Asparagus","1 Lemon (sliced)"]'::jsonb, '["Prep Shell: Mix chopped pecans, minced herbs, and olive oil in a small bowl.","Salmon Paint: Coat the top of salmon filets with a thin trace of Dijon mustard to act as glue.","Crust: Press the herb-pecan mixture firmly onto the mustard coat.","Bake: Lay salmon and asparagus onto a sheet pan. Bake at 375°F (190°C) for 12-15 minutes until salmon flakes with a fork."]'::jsonb,
  '["This meal holds beautifully in glass containers for up to 4 days. Reheat gently to prevent drying."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'smoked-rosemary-grapefruit-paloma', 'Smoked Rosemary Grapefruit Paloma', 'An aromatic, craft mocktail combining fresh pressed pink grapefruit juice, sparkling tonic, and burned rosemary smoke.', NULL, 'DRINKS', 'AMERICAN', 'EASY',
  10, 15, 4, 90, NULL, '["1 Fresh Pink Grapefruit (juiced)","1/2 oz Organic Agave Nectar","3 oz Artisanal Club Soda or Tonic","2 sprigs Fresh Rosemary","Salt rim & slice of lime"]'::jsonb, '["Rim: Wipe grease of lime around glass rim, Dip in coarse sea salt.","Mix: Shake grapefruit juice, agave, and one sprig rosemary in an ice-filled shaker.","Pour: Strain into the salted glass over a block of clear sphere ice. Top with club soda.","Smoke: Light the remaining rosemary hook with a torch till smoking, and drop it smoldering into the glass."]'::jsonb,
  '["Smoked herbs add deep autumnal woods flavor profile to citrus mocktails."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'french-croque-madame-editorial', 'Artisan Croque Madame', 'The Parisian bistro classic: thick pullman brioche, gruyère cheese bamel sauce, smoked ham, topped with a direct sunny-side egg.', NULL, 'LUNCH', 'AMERICAN', 'MEDIUM',
  20, 15, 4, 610, NULL, '["4 slices Thick Brioche or Pullman bread","4 slices Smoked Black Forest Ham","1 cup Gruyère Cheese (grated)","1 cup Béchamel Sauce (Butter, Flour, Milk, Nutmeg)","2 Fresh Farm Eggs"]'::jsonb, '["Bechamel: Whisk hot milk into butter-flour roux. Season with freshly grated nutmeg and Gruyère.","Sandwich: Paint brioche with French mustard, spread ham, cheese, and sandwich together.","Bake: Coat the top of the sandwich with rest of Gruyère and béchamel. Broil at 420°F until bubbling.","Egg: Fry farm eggs separately till edges are crispy and drop onto sandwiches. Serve instantly."]'::jsonb,
  '["Broil until cheese turns dark-brown speckled for that authentic French tavern texture."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'chilled-coconut-chia-pudding', 'Vanilla Bean Coconut Chia Pudding', 'An elegant superfood cup layered with Madagascar vanilla bean paste, hydrated chia seeds, and direct fresh mango gelée.', NULL, 'BREAKFAST', 'AMERICAN', 'EASY',
  15, 15, 4, 220, NULL, '["1/4 cup Black Chia Seeds","1 cup Organic Coconut Milk","1 tsp Madagascar Vanilla Bean Paste","1 tbsp Maple Syrup","1/2 cup Fresh Alphonso Mango (pureed)"]'::jsonb, '["Mix: Combine chia seeds, coconut milk, vanilla paste, and maple syrup in glass jar. Whisk well.","Chill: Refrigerate for at least 4 hours, stirring once after 20 minutes.","Layer: Place mango puree inside glass cup bases, scoop set vanilla chia, top with fresh berries."]'::jsonb,
  '["Whisking early prevents chia seeds from clumping at the glass bottoms."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'sicilian-citrus-fennel-salad', 'Sicilian Blood Orange & Fennel Salad', 'A vibrant, crisp salad featuring hand-shaved fennel bulb, organic blood orange rounds, castelvetrano olives, and raw mint.', NULL, 'LUNCH', 'AMERICAN', 'EASY',
  15, 15, 4, 140, NULL, '["1 Fennel Bulb (sliced razor-thin)","2 Blood Oranges (peeled and sliced)","1/2 cup Castelvetrano Green Olives","3 tbsp Cold Pressed Olive Oil","Heirloom Sea Salt & Fresh Mint"]'::jsonb, '["Shave: Use a mandoline to shave fennel bulb incredibly thin. Soak in ice water to curl.","Oranges: Trim oranges and skin carefully. Cut circular discs.","Dress: Toss drained dry fennel, oranges, olives, and olive oil with fresh torn mint leaves."]'::jsonb,
  '["Ice water crisping is the golden Parisian restaurant secret for making raw fennel sweet and crunchy."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'slow-braised-beef-shortrib', 'Red Wine Slow-Braised Beef Short Ribs', 'Heirloom short ribs slowly braised for 8 hours in rich Cabernet Sauvignon bone reduction broth, resting on parsnip puree.', NULL, 'DINNER', 'AMERICAN', 'HARD',
  8, 15, 4, 780, NULL, '["4 large marbled Beef Short Ribs","1 bottle dryness Cabernet Sauvignon","1 quart Roasted Veal Bone Broth","Mirepoix (Celery, Onions, Carrots)","Parsnips & heavy cream"]'::jsonb, '["Sear: Brown short ribs on high heat inside enamel Dutch Oven. Set aside.","Sauté: Caramelize mirepoix vegetables. Deglaze with red wine, reduce by 50%.","Braise: Nest short ribs back, submerge in roasted bone broth. Cover and bake at 275°F for 4.5 hours.","Reduce: Strain cooking liquor and reduce until slick, spoonable demi-glace. Serve over whipped parsnips."]'::jsonb,
  '["Leave ribs overnight in fridge before cooking for ultimate skin crisp sears later."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'meyer-lemon-meringue-tartlets', 'Meyer Lemon Meringue Sweet Tartlets', 'A crisp, sweet sablée shell containing zesty Meyer lemon curd and pillowed with toasted French torch meringue ridges.', NULL, 'DESSERTS', 'AMERICAN', 'HARD',
  45, 15, 4, 310, NULL, '["Pâte Sablée Crusts (pre-baked)","4 Meyer Lemons (juiced & zested)","4 Egg yolks (for curd)","3 Egg whites (for meringue)","1/2 cup Butter (whisked cold in bits)"]'::jsonb, '["Curd: Cook lemon juice, zest, sugar, and egg yolks over double-boiler. Whisk in cold butter cubes slowly till dense.","Fill: Spoon lemon curd into pre-baked crust shells. Chill to set.","Meringue: Whip egg whites with sugar till glossy peaks. Pipe onto tarts and torch until charred marshmallow finish."]'::jsonb,
  '["Meyer lemons offer a sweeter, orange-floral citrus hybrid profile superior to regular Eureka lemons."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'authentic-tuscan-pici-cacio-pepe', 'Tuscan Hand-Rolled Pici Cacio e Pepe', 'Pristine hand-rolled thick pici pasta tossed with raw Pecorino Romano cheese paste and cracked black peppercorn broth.', NULL, 'QUICK & EASY', 'AMERICAN', 'MEDIUM',
  25, 15, 4, 490, NULL, '["300g Semola Semolina Flour","150g Warm Water","1 cup Pecorino Romano (grated fine)","2 tbsp Whole Black Peppercorns"]'::jsonb, '["Pasta: Mix flour and water, knead 10 mins. Roll dough thin and slice. Hand twist individual strand thick worms (pici).","Peppercorns: Toast peppercorns in dry skillet, then crush in stone pestle mortar.","Emulsion: Boil pici. Mix cheese with ladle of pasta cooking water to form paste. Fold pasta, cheese, and black pepper till silky grease sauce."]'::jsonb,
  '["Never heat the cheese paste directly; emulsify using residual heat of pasta water to avoid clumping."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'roasted-cauliflower-tahini-hummus', 'Roasted Cauliflower Steaks & Herb Tahini', 'Thick organic cauliflower steaks roasted with smoked paprika, served on luxurious bed of white bean hummus.', NULL, 'VEGETARIAN', 'AMERICAN', 'EASY',
  25, 15, 4, 270, NULL, '["1 head Cauliflower (sliced into 1-inch thick steaks)","1 can Cannellini Beans","1/3 cup Sesame Tahini paste","Fresh Rosemary, Thyme, Paprika"]'::jsonb, '["Roast: Season cauliflower steaks with salt, smoked paprika, garlic powder, and roast on parchment sheets at 400°F for 22 minutes.","Hummus: Purée cannellini beans, garlic clove, lemon, and tahini.","Assemble: Spread white bean base on large plates, rest roasted cauliflower steaks, and paint with fresh green herb tahini sauce."]'::jsonb,
  '["Bake cauliflowers at high heat to achieve crispy charred tips while preserving internal butter tenderness."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'cold-brew-matcha-lemonade', 'Cold-Brewed Emerald Matcha Lemonade', 'An ultra-refreshing summer draft pairing ceremonial-grade sweet Japanese matcha over a base of fresh squeezed lemon water.', NULL, 'DRINKS', 'AMERICAN', 'EASY',
  5, 15, 4, 80, NULL, '["1.5 tsp Ceremonial-Grade Matcha","1 cup Cold Water","1/2 cup Fresh Lemon Juice","2 tbsp Organic Honey or Simple Syrup","Mint leaves & Lemon wheel"]'::jsonb, '["Lemon Base: Whisk fresh lemon juice and honey with cold water in glass shaker.","Matcha Brew: In a separate cup, shake matcha with ice-cold water vigorously to dissolve bubbles.","Layer: Fill glass with crushed ice, pour lemon base first, then gently float emerald matcha layer on top."]'::jsonb,
  '["Use high quality ceremonial grade matcha for sweet, non-grassy emerald green aesthetic layers."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'turmeric-ginger-glow-latte', 'Turmeric Ginger Sunshine Tonic', 'A comforting, warm milk-steer laced with cold-pressed turmeric roots, spicy black ginger, black pepper flakes, and honey cream.', NULL, 'DRINKS', 'AMERICAN', 'EASY',
  10, 15, 4, 140, NULL, '["1.5 cups Coconut or Oat Milk","1 tsp Raw Turmeric Powder (or pressed juice)","1/2 tsp Grated Ginger juice","1 pinch Cracked Black Pepper","1 tsp Raw Honey"]'::jsonb, '["Heat: Steer/warm coconut milk in a saucier pot under boiling heat.","Whisk: Whisk turmeric, ginger juice, black pepper (essential for curcumin activation), and honey.","Froth: Froth with a hand-milk whisk and garnish with dusting of cinnamon dust."]'::jsonb,
  '["Adding black pepper enhances turmeric bio-absorption by up to 2000%."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

INSERT INTO public.recipes (
  slug, title, description, cover_image, category, cuisine, difficulty,
  prep_time, cook_time, servings, calories, tags, ingredients, instructions,
  chef_secrets, pinterest_description, is_featured, is_published, published_at, status, layout_template
) VALUES (
  'mediterranean-shakshuka-feta', 'Tashkabula Shakshuka with Feta Flakes', 'A steaming hot skillet of spiced red bell peppers, roasted heirloom tomatoes, soft poached farm eggs, and sheep milk feta cheese.', NULL, 'BREAKFAST', 'AMERICAN', 'MEDIUM',
  20, 15, 4, 340, NULL, '["4 Organic Eggs","1 can San Marzano tomatoes (crushed)","1 Red Bell Pepper (chopped)","3 cloves Garlic (minced)","1 tsp Ground Cumin & Paprika","1/2 cup Feta cheese (crumbled)","Fresh Coriander Cilantro"]'::jsonb, '["Base: Sauté bell peppers, garlic, cumin, and paprika in premium olive oil until fragrant. Pour in San Marzano tomatoes, cook 10 minutes.","Poach: Nest 4 wells, crack eggs inside. Cover skillet, cooking over low heat for 6 minutes.","Plate: Shower steaming skillet with feta crumbles, red chili, and fresh coriander. Dip with crusty artisanal levain."]'::jsonb,
  '["Ensure tomato broth is simmering, not boiling, to prevent egg yolks from turning solid before egg whites."]'::jsonb, '', false, true, '2026-06-24T16:56:10.161Z'::timestamp with time zone, 'published', 'classic-single'
);

