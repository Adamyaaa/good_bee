import QRCode from 'qrcode';

// Rich seed data for resilient offline/Netlify preview
export const INITIAL_PRODUCTS = [
  // 1. Frankincense Essential Oil
  {
    id: 'gb_prod_frankincense',
    title: 'Good Bee Frankincense Pure Essential Oil',
    subtitle: '100% Natural Steam-Distilled Resin Extract',
    slug: 'good-bee-frankincense-pure-essential-oil',
    sku: 'GB-OIL-FRK-15',
    category: 'Pure Essential Oils',
    concerns: ['Youth & Radiance', 'Barrier Repair', 'Dryness & Moisture Deficit'],
    price: 1450,
    mrp: 1750,
    volume: '15 ml / 0.5 fl. oz.',
    rating: 4.9,
    reviewsCount: 86,
    stock: 40,
    lowStockThreshold: 10,
    badge: '100% Natural',
    shortDescription: 'Pure hydro-distilled frankincense resin oil known for profound cellular renewal, soothing inflammation, and toning mature skin.',
    description: 'Extracted from pure wild-harvested Boswellia carterii resin through low-temperature steam distillation to preserve active aromatic boswellic terpenes. A grounding natural elixir that restores cellular radiance and calms stressed skin barriers.',
    ingredients: [
      '100% Pure Boswellia Carterii (Frankincense) Steam-Distilled Resin Oil'
    ],
    ritual: 'Blend 2 drops into your night cream or carrier oil (such as jojoba or rosehip) and gently press over clean face and neck.',
    researchNotes: 'Gas chromatography verified 100% pure single-origin harvest with zero synthetic adulterants or carrier dilutions.',
    image: '/images_ref/Frankin-300x300.webp',
    gallery: [
      '/images_ref/Frankin-300x300.webp',
      '/assets/goodbee-frankincense-oil.jpg'
    ]
  },
  // 2. Geranium Essential Oil
  {
    id: 'gb_prod_geranium',
    title: 'Good Bee Geranium Pure Essential Oil',
    subtitle: '100% Natural Steam-Distilled Floral Extract',
    slug: 'good-bee-geranium-pure-essential-oil',
    sku: 'GB-OIL-GER-15',
    category: 'Pure Essential Oils',
    concerns: ['Pigmentation & Tone', 'Acne & Blemishes', 'Dryness & Moisture Deficit'],
    price: 1250,
    mrp: 1500,
    volume: '15 ml / 0.5 fl. oz.',
    rating: 4.8,
    reviewsCount: 64,
    stock: 35,
    lowStockThreshold: 8,
    badge: 'Bestseller',
    shortDescription: 'Balancing floral essential oil renowned for sebum harmonization, complexion clarity, and botanical antioxidant defense.',
    description: 'Distilled from lush Pelargonium graveolens leaves and blossoms. Delivers natural geraniol and citronellol compounds to gently balance sebum production and encourage an even, luminous complexion.',
    ingredients: [
      '100% Pure Pelargonium Graveolens (Geranium) Steam-Distilled Flower & Leaf Oil'
    ],
    ritual: 'Add 1-2 drops to daily moisturizer or facial massage oil to restore equilibrium to combination or dry skin.',
    researchNotes: 'Bio-fractionally tested to confirm therapeutic geraniol ester retention and full batch transparency.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.17-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.17-300x300.webp',
      '/assets/goodbee-geranium-oil.jpg'
    ]
  },
  // 3. Lemongrass Essential Oil
  {
    id: 'gb_prod_lemongrass',
    title: 'Good Bee Lemongrass Pure Essential Oil',
    subtitle: '100% Natural Steam-Distilled Herbal Extract',
    slug: 'good-bee-lemongrass-pure-essential-oil',
    sku: 'GB-OIL-LMG-15',
    category: 'Pure Essential Oils',
    concerns: ['Acne & Blemishes', 'Pigmentation & Tone'],
    price: 850,
    mrp: 1050,
    volume: '15 ml / 0.5 fl. oz.',
    rating: 4.9,
    reviewsCount: 72,
    stock: 50,
    lowStockThreshold: 12,
    badge: 'Purifying Ritual',
    shortDescription: 'Zesty purifying botanical essence targeting pore congestion, microbial balance, and radiant skin invigoration.',
    description: 'Steam distilled from fresh organic Cymbopogon flexuosus grasses. Packed with natural citral isomers that deeply clarify clogged pores, balance oily T-zones, and refresh dull cutaneous texture.',
    ingredients: [
      '100% Pure Cymbopogon Flexuosus (Lemongrass) Steam-Distilled Herbal Oil'
    ],
    ritual: 'Dilute 1 drop into 15ml facial oil or clay mask. Also ideal for evening steam facial purification.',
    researchNotes: 'High citral fraction verified for natural antimicrobial and tone-clarifying action.',
    image: '/images_ref/Lemongrass-300x300.webp',
    gallery: [
      '/images_ref/Lemongrass-300x300.webp',
      '/assets/goodbee-lemongrass-oil.jpg'
    ]
  },
  // 4. Rosemary Essential Oil
  {
    id: 'gb_prod_rosemary_oil',
    title: 'Good Bee Rosemary Pure Essential Oil',
    subtitle: '100% Natural Steam-Distilled Botanical Oil',
    slug: 'good-bee-rosemary-pure-essential-oil',
    sku: 'GB-OIL-RSM-15',
    category: 'Pure Essential Oils',
    concerns: ['Acne & Blemishes', 'Youth & Radiance'],
    price: 950,
    mrp: 1150,
    volume: '15 ml / 0.5 fl. oz.',
    rating: 4.9,
    reviewsCount: 92,
    stock: 45,
    lowStockThreshold: 10,
    badge: 'Hair & Scalp Ritual',
    shortDescription: 'Potent steam-distilled rosemary leaf oil activating hair follicles, scalp micro-circulation, and skin vitality.',
    description: 'Extracted from pure Rosmarinus officinalis leaves. Known for natural 1,8-cineole and camphor compounds that invigorate dormant hair follicles and balance cutaneous sebum.',
    ingredients: [
      '100% Pure Rosmarinus Officinalis (Rosemary) Steam-Distilled Leaf Oil'
    ],
    ritual: 'Dilute 3–4 drops into cold-pressed Brahmi or coconut carrier oil and gently massage into scalp and hairline.',
    researchNotes: 'Steam extracted at low atmospheric pressure to protect volatile monoterpenes.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.17-1-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.17-1-300x300.webp'
    ]
  },
  // 5. Clear Skin Soap
  {
    id: 'gb_prod_clear_skin_soap',
    title: 'Good Bee Clear Skin Cold Processed Soap',
    subtitle: 'Neem + Eucalyptus & Pure Himalayan Deodar Blend',
    slug: 'good-bee-clear-skin-cold-processed-soap',
    sku: 'GB-SOP-CLR-100',
    category: 'Cold Processed Soaps',
    concerns: ['Acne & Blemishes', 'Barrier Repair'],
    price: 275,
    mrp: 325,
    volume: '100 g / 3.5 oz.',
    rating: 4.9,
    reviewsCount: 215,
    stock: 65,
    lowStockThreshold: 15,
    badge: 'Bestseller',
    shortDescription: 'Source Identified Cold Processed Soap saying NO to chemical soap bathing. Cold-pressed neem and eucalyptus with pure beeswax.',
    description: 'Handcrafted through traditional cold process method without harsh surfactants or synthetic detergents. Cold-pressed Neem, Safflower, Sesame, Sunflower, Coconut, and Castor oils are cured for 6 weeks with pure Beeswax, Himalayan Deodar, and Eucalyptus essential oils for clear, tranquil skin.',
    ingredients: [
      'Cold-Pressed Neem Oil',
      'Safflower Oil',
      'Sesame Oil',
      'Sunflower Oil',
      'Pure Coconut Oil',
      'Castor Oil',
      'Natural Bee Wax',
      'Pure Himalayan Deodar Essential Oil',
      'Eucalyptus Essential Oil Blend'
    ],
    ritual: 'Lather between wet palms or with a natural sisal loofah. Gently massage rich botanical foam over body and face, then rinse thoroughly.',
    researchNotes: 'Source Identified cold-cure saponification maintains 100% natural glycerin and botanical unsaponifiables.',
    image: '/images_ref/Clear-skin-300x300.webp',
    gallery: [
      '/images_ref/Clear-skin-300x300.webp'
    ]
  },
  // 6. Donkey Milk Soap
  {
    id: 'gb_prod_donkey_milk_soap',
    title: 'Good Bee Donkey Milk Cold Processed Soap',
    subtitle: 'Almond Oil, Donkey Milk & Pure Bee Wax Bar',
    slug: 'good-bee-donkey-milk-cold-processed-soap',
    sku: 'GB-SOP-DNK-100',
    category: 'Cold Processed Soaps',
    concerns: ['Barrier Repair', 'Dryness & Moisture Deficit', 'Youth & Radiance'],
    price: 380,
    mrp: 450,
    volume: '100 g / 3.5 oz.',
    rating: 5.0,
    reviewsCount: 178,
    stock: 45,
    lowStockThreshold: 10,
    badge: 'Ultra-Luxury Milk',
    shortDescription: 'Source Identified Cold Processed Soap combining nutrient-dense Donkey Milk, sweet almond oil, and pure beeswax.',
    description: 'Renowned for biological similarity to human skin lipids. Rich in natural vitamins A, B1, B2, C, D, and E, plus retinol-analogous ceramides. Gently scented with Himalayan Deodar, French Lavender, and Palma Rosa essential oils.',
    ingredients: [
      'Pure Natural Donkey Milk',
      'Sweet Almond Oil',
      'Sesame Oil',
      'Safflower Oil',
      'Sunflower Oil',
      'Coconut Oil',
      'Castor Oil',
      'Canola & Palm Fruit Lipids',
      'Natural Bee Wax',
      'Himalayan Deodar Oil',
      'Lavender Oil',
      'Palma Rosa Oil'
    ],
    ritual: 'Work into a silky, cushioning lather. Ideal for daily bathing of dry, sensitive, or delicate skin barriers.',
    researchNotes: 'Natural lysozyme and immunoglobulins in fresh donkey milk gently shield against cutaneous bacteria.',
    image: '/images_ref/Donkey-Milk-Soap-300x300.webp',
    gallery: [
      '/images_ref/Donkey-Milk-Soap-300x300.webp'
    ]
  },
  // 7. Coffee Soap
  {
    id: 'gb_prod_coffee_soap',
    title: 'Good Bee Coffee Cold Processed Soap',
    subtitle: 'Finely Ground Coffee Dust, Deodar & Citronella',
    slug: 'good-bee-coffee-cold-processed-soap',
    sku: 'GB-SOP-COF-100',
    category: 'Cold Processed Soaps',
    concerns: ['Acne & Blemishes', 'Pigmentation & Tone'],
    price: 260,
    mrp: 310,
    volume: '100 g / 3.5 oz.',
    rating: 4.8,
    reviewsCount: 164,
    stock: 50,
    lowStockThreshold: 12,
    badge: 'Exfoliating Bar',
    shortDescription: 'Source Identified Cold Processed Soap with micro-milled robusta coffee dust for gentle micro-circulation and skin polishing.',
    description: 'Combines roasted botanical coffee dust with nourishing cold-pressed oils and pure beeswax. Exfoliates dead skin cells, stimulates cutaneous lymphatic drainage, and refreshes with Himalayan Deodar and Citronella essential oils.',
    ingredients: [
      'Robusta Roasted Coffee Dust',
      'Safflower Oil',
      'Sesame Oil',
      'Sunflower Oil',
      'Coconut Oil',
      'Castor & Canola Oils',
      'Natural Bee Wax',
      'Himalayan Deodar Oil',
      'Citronella Essential Oil'
    ],
    ritual: 'Gently glide the textured bar in circular motions over damp arms, shoulders, and legs. Rinse with warm water.',
    researchNotes: 'Polyphenol caffeic acid provides antioxidant defense while physical granules gently remove keratolytic build-up.',
    image: '/images_ref/Coffee-300x300.webp',
    gallery: [
      '/images_ref/Coffee-300x300.webp'
    ]
  },
  // 8. Soft Baby Soap
  {
    id: 'gb_prod_baby_soap',
    title: 'Good Bee Soft Baby Cold Processed Soap',
    subtitle: 'A2 Cow Milk + Pure Shea Butter & Lavender Aroma',
    slug: 'good-bee-soft-baby-cold-processed-soap',
    sku: 'GB-SOP-BBY-100',
    category: 'Cold Processed Soaps',
    concerns: ['Barrier Repair', 'Dryness & Moisture Deficit'],
    price: 340,
    mrp: 395,
    volume: '100 g / 3.5 oz.',
    rating: 5.0,
    reviewsCount: 188,
    stock: 40,
    lowStockThreshold: 10,
    badge: 'Gentle Baby Care',
    shortDescription: 'Source Identified Cold Processed Soap crafted specifically for ultra-delicate newborn and infant skin.',
    description: 'Formulated with organic A2 Cow Milk and unrefined African Shea Butter. Free from artificial foaming agents, artificial perfumes, and harsh chemicals. Naturally soothing lavender aroma eases bedtime rituals.',
    ingredients: [
      'Pure Indigenous A2 Cow Milk',
      'Raw Shea Butter',
      'Safflower Oil',
      'Sesame Oil',
      'Sunflower Oil',
      'Coconut Oil',
      'Castor Oil',
      'Natural Bee Wax',
      'Pure Natural Lavender Aroma'
    ],
    ritual: 'Create a mild, creamy foam in lukewarm water. Gently wash baby head-to-toe and rinse gently.',
    researchNotes: 'pH cushioned with natural A2 milk proteins to protect infant acid mantle.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.25-1-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.25-1-300x300.webp'
    ]
  },
  // 9. Turmeric Oil Soap
  {
    id: 'gb_prod_turmeric_soap',
    title: 'Good Bee Turmeric Oil Cold Processed Soap',
    subtitle: 'Turmeric Oil Infused Bee Wax & Himalayan Deodar',
    slug: 'good-bee-turmeric-oil-cold-processed-soap',
    sku: 'GB-SOP-TRM-100',
    category: 'Cold Processed Soaps',
    concerns: ['Pigmentation & Tone', 'Acne & Blemishes'],
    price: 295,
    mrp: 345,
    volume: '100 g / 3.5 oz.',
    rating: 4.9,
    reviewsCount: 167,
    stock: 55,
    lowStockThreshold: 15,
    badge: 'Radiance Bar',
    shortDescription: 'Source Identified Cold Processed Soap infused with pure turmeric rhizome and leaf oils for radiant, blemish-free skin.',
    description: 'Blends wild turmeric extract directly infused into pure beeswax. Synergized with Himalayan Deodar and Palma Rosa essential oils to clarify hyperpigmentation, fade sun tan, and protect against environmental bacteria.',
    ingredients: [
      'Turmeric Oil Infused Bee Wax',
      'Turmeric Leaf Essential Oil',
      'Pure Coconut Oil',
      'Sesame Oil',
      'Safflower Oil',
      'Castor Oil',
      'Sunflower Oil',
      'Himalayan Deodar Oil',
      'Palma Rosa Oil'
    ],
    ritual: 'Massage lather into face and body. Leave on for 60 seconds before rinsing to let turmeric curcuminoids nourish.',
    researchNotes: 'Curcumin-rich natural oil infusion maintains natural lipid barrier while evening out tone.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.26-1-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.26-1-300x300.webp'
    ]
  },
  // 10. Activated Charcoal Soap
  {
    id: 'gb_prod_charcoal_soap',
    title: 'Good Bee Activated Charcoal Cold Processed Soap',
    subtitle: 'Microporous Charcoal, Shea Butter & Citronella',
    slug: 'good-bee-activated-charcoal-cold-processed-soap',
    sku: 'GB-SOP-CHR-100',
    category: 'Cold Processed Soaps',
    concerns: ['Acne & Blemishes', 'Pigmentation & Tone'],
    price: 285,
    mrp: 340,
    volume: '100 g / 3.5 oz.',
    rating: 4.8,
    reviewsCount: 139,
    stock: 48,
    lowStockThreshold: 12,
    badge: 'Deep Detox',
    shortDescription: 'Source Identified Cold Processed Soap with activated bamboo charcoal to draw out city pollution and pore impurities.',
    description: 'Combines steam-activated porous charcoal with moisturizing Shea Butter and Beeswax. Deodorizes naturally with pure Himalayan Deodar, Citronella, and Lavender essential oils without over-drying the epidermis.',
    ingredients: [
      'Activated Bamboo Charcoal',
      'Shea Butter',
      'Safflower Oil',
      'Castor Oil',
      'Sunflower Oil',
      'Coconut Oil',
      'Natural Bee Wax',
      'Himalayan Deodar Oil',
      'Citronella Oil',
      'Lavender Oil'
    ],
    ritual: 'Lather over congested areas (T-zone, chest, back). Rinse with cool water.',
    researchNotes: 'High surface-area charcoal acts like a microscopic sponge to lift heavy metals and micro-particulates.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.13-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.13-300x300.webp'
    ]
  },
  // 11. Earthy Mineral Soap
  {
    id: 'gb_prod_earthy_soap',
    title: 'Good Bee Earthy Cold Processed Soap',
    subtitle: 'Natural Mineral Clay, Bee Wax & Palma Rosa',
    slug: 'good-bee-earthy-cold-processed-soap',
    sku: 'GB-SOP-ERTH-100',
    category: 'Cold Processed Soaps',
    concerns: ['Acne & Blemishes', 'Barrier Repair'],
    price: 270,
    mrp: 320,
    volume: '100 g / 3.5 oz.',
    rating: 4.7,
    reviewsCount: 95,
    stock: 42,
    lowStockThreshold: 10,
    badge: 'Mineral Clay',
    shortDescription: 'Source Identified Cold Processed Soap infused with sun-cured mineral clay for calming oily and irritated skin.',
    description: 'Enriched with natural mineral clay and pure Beeswax. Absorbs excess sebum, remineralizes the skin, and leaves an earthy calming scent of Himalayan Deodar, Citronella, and Palma Rosa.',
    ingredients: [
      'Sun-Cured Mineral Clay',
      'Safflower Oil',
      'Sesame Oil',
      'Sunflower Oil',
      'Coconut Oil',
      'Castor Oil',
      'Natural Bee Wax',
      'Himalayan Deodar Oil',
      'Citronella Oil',
      'Palma Rosa Oil'
    ],
    ritual: 'Work into a velvety lather and massage over damp skin. Rinse thoroughly.',
    researchNotes: 'Rich in silica, magnesium, and calcium to replenish vital cutaneous electrolytes.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-300x300.webp'
    ]
  },
  // 12. Sunnipindi Soap
  {
    id: 'gb_prod_sunnipindi_soap',
    title: 'Good Bee Sunnipindi Cold Processed Soap',
    subtitle: 'Pumpkin + Multi-Dal Heritage Bath Formula',
    slug: 'good-bee-sunnipindi-cold-processed-soap',
    sku: 'GB-SOP-SUN-100',
    category: 'Cold Processed Soaps',
    concerns: ['Pigmentation & Tone', 'Dryness & Moisture Deficit'],
    price: 290,
    mrp: 350,
    volume: '100 g / 3.5 oz.',
    rating: 4.9,
    reviewsCount: 153,
    stock: 52,
    lowStockThreshold: 12,
    badge: 'Traditional Heritage',
    shortDescription: 'Source Identified Cold Processed Soap recreating ancient Ayurvedic herbal bath powder into a gentle cleansing bar.',
    description: 'Combines pumpkin seed oil with stone-ground multi-dal pulses (green gram, chickpea) and pure Beeswax. Provides natural gentle micro-buffing without scratching delicate dermal layers.',
    ingredients: [
      'Pumpkin Seed Extract',
      'Multi-Dal Herbal Infusion',
      'Safflower Oil',
      'Sesame Oil',
      'Sunflower Oil',
      'Coconut Oil',
      'Castor Oil',
      'Natural Bee Wax',
      'Himalayan Deodar Oil',
      'Lavender Oil',
      'Palma Rosa Oil'
    ],
    ritual: 'Glide over wet skin to experience the gentle pulse texture. Rinse thoroughly.',
    researchNotes: 'Natural saponins in multi-pulses cleanse gently while retaining moisture.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.23-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.23-300x300.webp'
    ]
  },
  // 13. Tinted Pink Moisturizing Lip Balm
  {
    id: 'gb_prod_pink_lip_balm',
    title: 'Good Bee Tinted Pink Moisturizing Lip Balm',
    subtitle: 'Enriched with Vitamin E, Pink Lotus & Pure Beeswax',
    slug: 'good-bee-tinted-pink-moisturizing-lip-balm',
    sku: 'GB-LIP-TNK-5',
    category: 'Lip & Facial Care',
    concerns: ['Dryness & Moisture Deficit', 'Youth & Radiance'],
    price: 349,
    mrp: 425,
    volume: '5 g / 0.18 oz.',
    rating: 4.9,
    reviewsCount: 142,
    stock: 75,
    lowStockThreshold: 20,
    badge: 'Bestseller',
    shortDescription: '100% Natural moisturizing lip balm providing an effortless rosy flush, enriched with sweet almond oil and pure beeswax.',
    description: 'Infused with cold-pressed sweet almond oil, rosehip seed oil, pink lotus petal extract, and natural beeswax. Deeply seals in moisture, prevents cracked or peeling lips, and gives a healthy dewy pink tint without synthetic dyes.',
    ingredients: [
      'Ethically Sourced Natural Beeswax',
      'Sweet Almond Oil',
      'Cold-Pressed Rosehip Fruit Oil',
      'Pink Lotus (Nelumbo Nucifera) Petal Extract',
      'Tocopherol (Natural Vitamin E)',
      'Raw Shea Butter'
    ],
    ritual: 'Glide evenly across lips throughout the day or layer before sleep for intensive overnight conditioning.',
    researchNotes: 'Natural beeswax creates a flexible, breathable moisture seal without petroleum petrolatum occlusives.',
    image: '/images_ref/Pink-Lotus-300x300.webp',
    gallery: [
      '/images_ref/Pink-Lotus-300x300.webp'
    ]
  },
  // 14. No-Tint Moisturizing Lip Balm
  {
    id: 'gb_prod_clear_lip_balm',
    title: 'Good Bee No-Tint Moisturizing Lip Balm',
    subtitle: 'Enriched with Vitamin E, French Lavender & Pure Beeswax',
    slug: 'good-bee-no-tint-moisturizing-lip-balm',
    sku: 'GB-LIP-CLR-5',
    category: 'Lip & Facial Care',
    concerns: ['Dryness & Moisture Deficit', 'Barrier Repair'],
    price: 299,
    mrp: 375,
    volume: '5 g / 0.18 oz.',
    rating: 4.8,
    reviewsCount: 98,
    stock: 60,
    lowStockThreshold: 15,
    badge: 'Essential Care',
    shortDescription: 'Uncolored natural barrier conditioning balm for chapped, sensitive lips. Enriched with apricot oil, beeswax, and lavender.',
    description: 'A pure, restorative balm with zero tint or glitter. Cures dry flaking lips using cold-pressed apricot kernel oil, shea butter, unrefined beeswax, and pure calming lavender essential oil.',
    ingredients: [
      'Natural Bee Wax',
      'Cold-Pressed Apricot Kernel Oil',
      'Raw Shea Butter',
      'Sweet Almond Oil',
      'French Lavender Floral Oil',
      'Tocopherol (Pure Vitamin E)'
    ],
    ritual: 'Apply liberally whenever lips feel dry or exposed to wind and sun.',
    researchNotes: 'Hypoallergenic barrier formulation suitable for adults and children.',
    image: '/images_ref/Levendor-300x300.webp',
    gallery: [
      '/images_ref/Levendor-300x300.webp'
    ]
  },
  // 15. Botanical Natural Lipstick
  {
    id: 'gb_prod_lipstick',
    title: 'Good Bee Natural Botanical Lipstick',
    subtitle: 'Rich Carmine Coral & Pure Beeswax Formula',
    slug: 'good-bee-natural-botanical-lipstick',
    sku: 'GB-LIP-STK-4',
    category: 'Lip & Facial Care',
    concerns: ['Youth & Radiance', 'Dryness & Moisture Deficit'],
    price: 699,
    mrp: 850,
    volume: '4 g / 0.14 oz.',
    rating: 4.9,
    reviewsCount: 54,
    stock: 35,
    lowStockThreshold: 10,
    badge: 'Pure Pigments',
    shortDescription: 'Creamy satin lipstick crafted from mineral and plant pigments, pure beeswax, and cold-pressed plant ceramides.',
    description: 'Delivers saturated, weightless color with a nourishing buttery feel. Crafted without lead, parabens, phthalates, or petroleum waxes. Keeps lips supple and hydrated all day long.',
    ingredients: [
      'Pure Beeswax',
      'Castor Seed Oil',
      'Candelilla Wax',
      'Natural Iron Oxides & Mineral Pigments',
      'Jojoba Seed Oil',
      'Vitamin E'
    ],
    ritual: 'Swipe directly onto lips from tube for full coverage or dab with fingertip for a soft blotted stain.',
    researchNotes: 'Clean cosmetic formulation using FDA-approved cosmetic minerals and unbleached beeswax.',
    image: '/images_ref/Lipstick-600x600.webp',
    gallery: [
      '/images_ref/Lipstick-600x600.webp'
    ]
  },
  // 16. Brahmi & Neem Hair Oil with Rosemary
  {
    id: 'gb_prod_hair_oil',
    title: 'Good Bee Brahmi & Neem Hair Oil',
    subtitle: '100% Natural with Rosemary Essential Oil (100ml)',
    slug: 'good-bee-brahmi-neem-hair-oil',
    sku: 'GB-HAR-BRH-100',
    category: 'Hair & Wellness',
    concerns: ['Youth & Radiance', 'Acne & Blemishes'],
    price: 750,
    mrp: 890,
    volume: '100 ml / 3.4 fl. oz.',
    rating: 4.9,
    reviewsCount: 118,
    stock: 50,
    lowStockThreshold: 12,
    badge: 'Scalp Vitality',
    shortDescription: '100% Natural intensive hair oil combining slow-cooked Brahmi, Neem leaves, Amla, Kalonji, and Rosemary essential oil.',
    description: 'Traditional slow-infusion oil formulated after herbal research. Nourishes scalp micro-circulation, stops flaking and itchiness, strengthens roots, and prevents premature graying without mineral oils or silicones.',
    ingredients: [
      'Pure Cold-Pressed Sesame & Coconut Oil',
      'Brahmi (Bacopa Monnieri) Whole Herb',
      'Neem (Azadirachta Indica) Fresh Leaves',
      'Amla (Indian Gooseberry) Fruit',
      'Kalonji (Black Seed) Oil',
      'Methi (Fenugreek) Seeds',
      'Rosemary (Rosmarinus Officinalis) Pure Essential Oil'
    ],
    ritual: 'Warm 1–2 tablespoons between palms. Part hair and massage deeply into roots for 10 minutes. Leave on for 1 hour or overnight before shampooing.',
    researchNotes: 'Chromatographic extraction retains heat-sensitive saponins and rosmarinic acid.',
    image: '/images_ref/Rosmary-2-300x300.webp',
    gallery: [
      '/images_ref/Rosmary-2-300x300.webp'
    ]
  },
  // 17. Rosemary Hydrosol Mist
  {
    id: 'gb_prod_rosemary_mist',
    title: 'Good Bee Rosemary Hydrosol Mist',
    subtitle: '100% Natural Steam-Distilled Face & Scalp Tonic (100ml)',
    slug: 'good-bee-rosemary-hydrosol-mist',
    sku: 'GB-MST-RSM-100',
    category: 'Botanical Mists',
    concerns: ['Acne & Blemishes', 'Pigmentation & Tone'],
    price: 499,
    mrp: 599,
    volume: '100 ml / 3.4 fl. oz.',
    rating: 4.8,
    reviewsCount: 83,
    stock: 45,
    lowStockThreshold: 12,
    badge: 'Pore Clarifying',
    shortDescription: 'Pure steam-distilled rosemary hydrosol with zero added chemicals. Clarifies dilated pores, balances sebum, and refreshes skin.',
    description: '100% pure plant water captured during the hydro-distillation of fresh rosemary leaves. Naturally astringent, antimicrobial, and soothing for combination, acne-prone skin and dull scalp roots.',
    ingredients: [
      '100% Pure Steam-Distilled Rosmarinus Officinalis (Rosemary) Floral Water',
      'Zero Added Chemicals or Fragrances'
    ],
    ritual: 'Spritz directly onto clean face post-wash or use as an energizing midday desk mist.',
    researchNotes: 'Contains water-soluble plant flavonoids and rosmarinic compounds that penetrate immediately.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp'
    ]
  },
  // 18. Damask Rose Hydrosol Mist
  {
    id: 'gb_prod_rose_mist',
    title: 'Good Bee Damask Rose Hydrosol Mist',
    subtitle: '100% Natural Steam-Distilled Floral Water (100ml)',
    slug: 'good-bee-damask-rose-hydrosol-mist',
    sku: 'GB-MST-ROS-100',
    category: 'Botanical Mists',
    concerns: ['Dryness & Moisture Deficit', 'Barrier Repair', 'Youth & Radiance'],
    price: 549,
    mrp: 650,
    volume: '100 ml / 3.4 fl. oz.',
    rating: 4.9,
    reviewsCount: 127,
    stock: 55,
    lowStockThreshold: 15,
    badge: 'Signature Dew',
    shortDescription: '100% Natural hydro-distilled indigenous Damask rose water. Instantly cools, hydrates, and tightens pores without tightness.',
    description: 'Made from fresh desi Damask rose petals collected at dawn. Captures the delicate water-soluble volatile rose essence to balance cutaneous pH, soothe sun sensitivity, and leave an incandescent petal-soft glow.',
    ingredients: [
      '100% Pure Steam-Distilled Rosa Damascena (Damask Rose) Petal Hydrosol',
      'Zero Preservatives or Artificial Fragrance'
    ],
    ritual: 'Close eyes and mist liberally across face and neck. Gently press with warm palms.',
    researchNotes: 'Single-distillate batch preserving natural geraniol molecules and cellular hydration index.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.01-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.01-300x300.webp'
    ]
  },
  // 19. Pain Relief Roll-On Oil
  {
    id: 'gb_prod_pain_relief_rollon',
    title: 'Good Bee Pain Relief Active Roll-On Oil',
    subtitle: '100% Natural Herbal Roll-On for Neck & Joint Tension (10ml)',
    slug: 'good-bee-pain-relief-active-roll-on-oil',
    sku: 'GB-ROL-PAN-10',
    category: 'Hair & Wellness',
    concerns: ['Barrier Repair'],
    price: 220,
    mrp: 260,
    volume: '10 ml / 0.34 fl. oz.',
    rating: 4.8,
    reviewsCount: 112,
    stock: 60,
    lowStockThreshold: 15,
    badge: 'Targeted Relief',
    shortDescription: 'Fast-acting botanical roll-on oil for headaches, neck stiffness, and muscle fatigue. Portable and non-sticky.',
    description: 'Crafted with wintergreen, eucalyptus, camphor, and mint herbal extracts. The steel roll-on ball delivers targeted cooling-warming relief to temples, neck, and sore joints without greasiness.',
    ingredients: [
      'Gandhapura (Wintergreen) Oil',
      'Nilgiri (Eucalyptus) Oil',
      'Pudina (Mint) Terpenes',
      'Kapoor (Camphor)',
      'Pure Sesame Carrier Base'
    ],
    ritual: 'Gently roll over temples, back of neck, or stiff muscles. Massage lightly with fingertips.',
    researchNotes: 'Natural methyl salicylate penetrates dermal layers quickly to soothe tension.',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-1-300x300.webp',
    gallery: [
      '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-1-300x300.webp'
    ]
  }
];

export class GoodBeeApi {
  static async fetchProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/v1/products${query ? '?' + query : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) return data.products;
      }
    } catch (e) {
      // Fallback to offline store
    }

    // Client-side filtering fallback for Netlify static preview
    let list = [...INITIAL_PRODUCTS];
    if (params.category && params.category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.concern && params.concern !== 'All') {
      list = list.filter((p) => p.concerns.some((c) => c.toLowerCase() === params.concern.toLowerCase()));
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }
    return list;
  }

  static async generateClientDynamicQr(orderId, amount) {
    const vpa = 'goodbee.official@okaxis';
    const payeeName = 'GOOD BEE Skincare Laboratory';
    const note = `Good Bee Order ${orderId}`;
    const upiIntentString = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(
      payeeName
    )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}&tr=${encodeURIComponent(orderId)}`;

    const qrDataUrl = await QRCode.toDataURL(upiIntentString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#1A1918',
        light: '#FAF7F2'
      }
    });

    return {
      orderId,
      amount,
      vpa,
      payeeName,
      upiIntentString,
      qrDataUrl
    };
  }
}
