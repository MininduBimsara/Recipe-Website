export interface BlogSection {
  id: string;
  title: string;
  headingType: 'h2' | 'h3';
  text: string;
  pullquote?: string;
  image?: string;
  imageCaption?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: 'Techniques' | 'Ingredient Guides' | 'Kitchen Equipment' | 'Meal Planning';
  date: string;
  readTime: string;
  image: string;
  author: string;
  content: string[]; // Backwards compatibility for general maps
  sections?: BlogSection[]; // Standard rich scrollytelling layouts
  relatedRecipeIds?: string[]; // Related RECIPES_DB IDs
}

export const BLOG_POSTS_DB: BlogPost[] = [
  {
    id: 'b1',
    slug: 'science-of-gluten-shaping',
    title: 'The Chemistry of Hydration & Gluten Tension',
    summary: 'An investigative study on how flour hydration levels govern crumb density, pocket shape, and crust thickness during the final cold retard process.',
    category: 'Techniques',
    date: 'June 12, 2026',
    readTime: '6 mins read',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    author: 'Chef Alexandre Dumas',
    content: [
      'Flour hydration is not merely a recipe percentage option: it is the master thermodynamic valve that decides your loaf’s entire fate. At 65% hydration, gluten strands are highly tightly-knit, giving a dense, uniform crumb structures perfect for sandwich bread slices. At 75% or 80%, protein compounds slide freely, allowing steam pouches to form huge airy air holes — our coveted sourdough irregular open crumb.',
      'But how do you handle wet, sloppy, sticky high-hydration doughs without collapsing their micro-cells? The mystery rests within structural stretch and fold cycles. Doing short stretches instead of violent kneading layers the proteins into continuous thin laminations, strengthening the surface membrane.',
      'Finally, cold retarding. Placing your shaped dough inside wood-pulp baskets in the refrigerator at 38°F slows down yeast carbon-dioxide generation while lactic acid bacteria continue working diligently, creating amazing sour flavors while drying out the crust shell so that it blisters beautifully when hit with oven steam.'
    ],
    relatedRecipeIds: ['1', '5'],
    sections: [
      {
        id: 'gluten-basics',
        title: 'Understanding Gluten Cross-Linking',
        headingType: 'h2',
        text: 'To bakers, gluten is not a static powder. It is an elastic, cohesive network formed when two specific proteins—gliadin and glutenin—hydrate and bind together. Gliadin provides extensibility (the ability to stretch without tearing), while glutenin contributes elasticity and strength (the resistance to deform). When water joins the grain mixture, these protein chains unwind and form sulfur-to-sulfur crosslinks.',
        pullquote: 'Without proper protein alignment, the steam generated in a 450°F oven will simply bubble out, leaving you with a dense clay tablet rather than a blistering levain.'
      },
      {
        id: 'hydration-thermodynamics',
        title: 'The Magic 78% Hydration Metric',
        headingType: 'h2',
        text: 'Hydration ratio is calculated relative to total flour weight. A 78% hydration dough uses 390 grams of water for every 500 grams of flour. In this wet environment, gluten strands can slide and align themselves without structural friction. However, excess water acts as a lubricant, reducing structural strength. We compensate by performing timed stretches instead of rough kneading.',
        image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800',
        imageCaption: 'Artisanal baker handling a highly hydrated dough using wet palm folds on a marble slab.'
      },
      {
        id: 'cold-fermentation-kinetics',
        title: 'Why Cold Fermentation Restructures Sugar',
        headingType: 'h3',
        text: 'When we proof our sourdough starter overnight inside a 36°F to 38°F refrigerator, yeast activity drops off a cliff. However, wild lactobacilli remain active, converting simple starches into lactic and acetic acids. These acids digest complex flour proteins, tenderizing the crumb while providing that signature sourdough tang.'
      },
      {
        id: 'scoring-thermodynamics',
        title: 'Scoring Angle and Crust Blistering',
        headingType: 'h2',
        text: 'Lame scoring must be executed at a precise 30-degree angle to create an "ear." A vertical score splits the loaf open symmetrically, while an offset angled cut directs steam under a single flap, lifting it high to form a crunchy, thin protective crown.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
        imageCaption: 'A fresh blistered bread ear cooling on wire mesh.'
      }
    ]
  },
  {
    id: 'b2',
    slug: 'flour-ash-content-critical-fact',
    title: 'Ash Content: Flour Classification Standards',
    summary: 'A meticulous deep dive on T55, T80, and heavy Whole Grain mineral percentages, and how flour ash weights decide water retention rates.',
    category: 'Ingredient Guides',
    date: 'May 28, 2026',
    readTime: '4 mins read',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
    author: 'Agnes Meriot',
    content: [
      'In French and Italian baking, flour is graded by "Type" or ash content (Type 55, Type 80, Type 110, Italian Tipo 00, etc.). This numerical type refers specifically to the mineral ash weight left over after baking 100 grams of raw wheat inside clinical test muffle ovens.',
      'Small minerals (like ash) congregate inside the outer wheat bran, while pure white starch is locked in the inner endosperm. Thus, a T55 flour has very little ash (0.55%), meaning it is super white and low-mineral. T110 is heavy whole wheat, rich in bran scraps with high ash (1.1%).',
      'High ash flours have amazing rustic woodsy fragrances, but the sharp bran flecks act as microscopic razor blades slicing the delicate elastic gluten sheets. Compensate by letting whole wheat dough autolyse for an extra hour to soften the bran edges, and always increase water hydration by 3-5% for every type classification jump.'
    ],
    relatedRecipeIds: ['1', '4'],
    sections: [
      {
        id: 'what-is-ash',
        title: 'What Exactly is Flour "Ash"?',
        headingType: 'h2',
        text: 'In metallurgical and agricultural testing, flour is incinerated at 1100°F until all carbon and organic molecules burn off. The small, indestructible pile of mineral powder left behind—consisting of potassium, iron, phosphorus, and magnesium—is weighed. If 100 grams of flour yields 0.55 grams of mineral ash, it is classified as Type 55. If it yields 1.10 grams, it is Type 110.',
        pullquote: 'Ash content represents the trace elements of the soil. More ash means the grain was milled closer to the outer bran shell, holding natural soil nutrients.'
      },
      {
        id: 'bran-razors',
        title: 'Bran Micro-particles: Gluten’s Natural Enemy',
        headingType: 'h2',
        text: 'Outer wheat bran is packed with dietary fiber and healthy proteins, but it is physically jagged. In a wet dough dough, these wheat shells act like millions of micro-scalpels, chopping the expanding web of delicate gas-holding gluten bubbles. This is why high-ash whole-wheat loaves are notorious for failing to rise.',
        image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
        imageCaption: 'Locally grown stoneground grain flours before getting sifted.'
      },
      {
        id: 'hydration-adaptation',
        title: 'Adjusting Hydration to Ash Levels',
        headingType: 'h3',
        text: 'Because bran is highly hydrophilic (it pulls moisture away from gluten proteins), high-ash flours require much more water. When converting a standard recipe from T55 (0.55% ash) to T80 (0.80% ash), add 4% more water by weight to prevent a dry, unworkable dough texture.'
      }
    ]
  },
  {
    id: 'b3',
    slug: 'cast-iron-manifesto-heat-retention',
    title: 'The Cast-Iron Manifesto: Heat Retention Rules',
    summary: 'A critical analysis of cooking pans, exploring why cast iron and seasoned carbon steel outperform aluminum in searing.',
    category: 'Kitchen Equipment',
    date: 'July 05, 2026',
    readTime: '5 mins read',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    author: 'Marcus Vance, PhD',
    content: [
      'Cast iron pans have high heat capacity, allowing them to retain massive thermal energy when preheated.',
      'Surface moisture must vaporize immediately for searing to take place. Cast iron maintains stable temperature even as raw, cold food hits its surface.',
      'A well-seasoned cast iron pan forms a natural, polymerized oil layer that is non-stick and highly stable.'
    ],
    relatedRecipeIds: ['3', '2'],
    sections: [
      {
        id: 'thermal-mass-science',
        title: 'The Physics of Heavy Thermal Mass',
        headingType: 'h2',
        text: 'Why do thin aluminum non-stick pans fail to sear protein? It comes down to thermal mass. Although aluminum is a superstar at conducting heat quickly, it has low density. When a cold scallop or steak lands on an aluminum pan, the temperature drops instantly, boiling the food in its own juices. A 6-pound cast iron pan, however, holds a massive reserve of kinetic heat energy, instantly flash-vaporizing any cold surface liquid.',
        pullquote: 'Preheating cast iron is akin to charging a massive thermal battery.'
      },
      {
        id: 'polymerization-process',
        title: 'Oil Polymerization: Science of Seasoning',
        headingType: 'h2',
        text: 'Seasoning is not simply baked oil. It is a chemical process where thin coatings of unsaturated fatty acids are heated past their smoke point in contact with iron, undergoing thermal polymerization and oxidation. This turns liquid lipids into dry, glass-like hard polymers that bond into the cast profile’s porous craters.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
        imageCaption: 'A fully cured back cast iron skillet sparkling after oil dressing.'
      },
      {
        id: 'cleaning-myths',
        title: 'Dispelling the Dish Soap Myth',
        headingType: 'h3',
        text: 'Modern dish soaps do not contain lye (the destructive sodium hydroxide component of historical soap). Polymerized seasoning is highly resilient; standard warm water and mild modern dish soaps will not lift properly cured oil. Wash your skillet without fear!'
      }
    ]
  },
  {
    id: 'b4',
    slug: 'meal-prep-thermodynamics-separations',
    title: 'Thermodynamics of Prep: Smart Hot-Cold Separations',
    summary: 'Mastering temperature control, steam dissipation, and glass sealant mechanics to keep prep food crisp.',
    category: 'Meal Planning',
    date: 'August 10, 2026',
    readTime: '5 mins read',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    author: 'Chef Alexandre Dumas',
    content: [
      'Placing steaming-hot foods directly into sealed meal containers creates internal condensation, making vegetables limp and encouraging bacterial growth.',
      'Let your proteins rest fully and cooling them down to room temperature before packing in containers.',
      'Store wet sauces and dry salads in separate sub-chambers of glass containers to prevent soggy ingredients.'
    ],
    relatedRecipeIds: ['7', '6'],
    sections: [
      {
        id: 'steam-hazard',
        title: 'Steam: The Crisp Destroyer',
        headingType: 'h2',
        text: 'When warm food is placed inside a closed container, it releases water vapor. This trapped steam has nowhere to go, so it condenses on the container ceiling and rains down on your grains and proteins, destroying crunchy textures. Standard protocol is to let roasted ingredients cool on wide wire sheet frames to evaporate surface steam first.',
        pullquote: 'Trapped vapor turns a crispy roasted brussels sprout into soggy mush.'
      },
      {
        id: 'osmotic-pressure',
        title: 'Osmotic Pressure & Separators',
        headingType: 'h2',
        text: 'Salting your prep ingredients too early causes them to release cellular water due to osmotic pressure gradients. Keep fresh salad dressings and high-sodium sauces in miniature separate glass jars until the exact moment of consumption to keep leafy greens crisp and proud.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
        imageCaption: 'Glass compartmentalized prepped bento jars displaying perfect dry-wet isolation.'
      }
    ]
  },
  {
    id: 'b5',
    slug: 'perfecting-maillard-crusts-pan',
    title: 'Maillard Reaction & The Perfect Sear',
    summary: 'Unpacking amino-acid structural bonds under heating parameters, and how surface moisture prevents gorgeous crisping on proteins.',
    category: 'Techniques',
    date: 'April 19, 2026',
    readTime: '8 mins read',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800',
    author: 'Marcus Vance, PhD',
    content: [
      'Why does seared steak or scallops taste sweet, smoky, and nutty, while boiled foods taste plain? The answer is the Maillard Reaction — a chemical bonding dance between raw amino acids and reducing sugars under intense heat starting at 285°F (140°C).',
      'The enemy of Maillard is water. It takes massive thermal energy (540 calories per gram) simply to vaporize surface water from a product. If your scallop is wet when hitting the skillet, the pan’s energy is wasted boiling that moisture instead of searing the meat, leading to grey, tough, rubbery boiled bakes.',
      'To achieve perfect golden-brown outer crust crusts on scallops or steak: pat dry completely on parchment sheet layers, apply kosher salt immediately beforehand, and use a cast-iron pan preheated with ghee or tallow, which keeps a much higher smoke point than delicate olive oils or standard butter blocks.'
    ],
    relatedRecipeIds: ['3', '7'],
    sections: [
      {
        id: 'maillard-reaction',
        title: 'What is the Maillard Reaction?',
        headingType: 'h2',
        text: 'First described by Louis-Camille Maillard in 1912, this reaction occurs between a reducing sugar and an amino acid. Under dry high-heat regimes, they react to produce hundreds of small, aromatic volatile flavor compounds. These molecules cross-link into heterocyclic brown pigments called melanoidins.',
        pullquote: 'Maillard creates flavors that are not present in the raw state.'
      },
      {
        id: 'moisture-barrier',
        title: 'The Latent Heat of Vaporization Barrier',
        headingType: 'h2',
        text: 'The latent heat of vaporization of water is extremely high—2260 Joules per gram. This means water consumes massive thermal energy to turn into vapor. If your protein is damp, the temperature of the protein surface cannot rise above 212°F (100°C), while the Maillard Reaction requires at least 285°F. Your scallop will steam, not brown.',
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800',
        imageCaption: 'Glistening pan-seared sea scallops sear-cooking inside a skillet.'
      }
    ]
  }
];
