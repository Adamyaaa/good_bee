export const CONCERNS_DATA = [
  // 1. Flash Deals (Exact match with 40% OFF overlay badge)
  {
    id: 'flash-deals',
    label: 'Flash Deals ⚡',
    title: 'Flash Deals & Limited Botanical Editions',
    tagline: 'Up to 40% OFF on Clinically Proven Pure Formulations',
    badge: '40% OFF',
    isPromo: true,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    filterType: 'deals',
    filterValue: 'deals',
    subPills: [
      { id: 'all', label: 'All Flash Deals' },
      { id: 'under-500', label: 'Under ₹500' },
      { id: 'under-1000', label: 'Under ₹1000' },
      { id: 'essential-oils', label: 'Pure Essential Oils' },
      { id: 'soaps', label: 'Cold-Cured Soaps' }
    ],
    ritual: {
      headline: 'Flash Deal Pairing Guide',
      step1: 'Select cold-cured botanical bar for active cellular cleansing.',
      step2: 'Mist steam-distilled hydrosol to replenish water reserves.',
      step3: 'Seal with 2 drops of unadulterated plant oil for all-day barrier defense.'
    }
  },

  // 2. Gifting
  {
    id: 'gifting',
    label: 'Gifting',
    title: 'Artisanal Skincare Hampers & Gifting Combos',
    tagline: 'Handcrafted Botanical Sets for Pure Self-Care & Festivals',
    badge: 'Gift Sets',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    filterType: 'gifting',
    filterValue: 'gifting',
    subPills: [
      { id: 'all', label: 'All Gift Combos' },
      { id: 'luxury-milks', label: 'Artisanal Milk Bars' },
      { id: 'lip-duo', label: 'Natural Lip Care Trio' },
      { id: 'essential-pack', label: 'Pure Essential Oils' }
    ],
    ritual: {
      headline: 'Luxury Gifting Self-Care Ritual',
      step1: 'Unbox cold-cured botanical bars wrapped in biodegradable parchment.',
      step2: 'Pair with steam-distilled Damask Rose floral mist for morning dewy glow.',
      step3: 'Complete the luxury experience with Nilgiri pure beeswax lip balm.'
    }
  },

  // 3. Trending 🔥
  {
    id: 'trending',
    label: 'Trending 🔥',
    title: 'Trending Formulations & Customer Favorites',
    tagline: 'Most-Loved 100% Pure Plant Solutions Backed by 5-Star Reviews',
    badge: '🔥 Hot',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80',
    filterType: 'trending',
    filterValue: 'trending',
    subPills: [
      { id: 'all', label: 'All Trending' },
      { id: 'hair-bestseller', label: 'Brahmi & Rosemary Oil' },
      { id: 'donkey-milk', label: 'Donkey Milk & Saffron' },
      { id: 'rose-mist', label: 'Damask Rose Hydrosol' },
      { id: 'lip-tint', label: 'Tinted Pink Lotus Balm' }
    ],
    ritual: {
      headline: 'The Viral 3-Step Good Bee Ritual',
      step1: 'Cleanse with Donkey Milk Soap rich in natural ceramides and retinol-analogous lipids.',
      step2: 'Saturate dermal pores with single-origin steam-distilled Damask Rose Mist.',
      step3: 'Nourish hair roots and scalp micro-circulation with slow-infused Brahmi Oil.'
    }
  },

  // 4. Winter Care
  {
    id: 'winter-care',
    label: 'Winter Care',
    title: 'Winter Care & Deep Moisture Shield',
    tagline: 'Intense Lipid Reconstruction for Parched Winter Skin & Chapped Lips',
    badge: 'Winter SOS',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Dryness & Moisture Deficit',
    subPills: [
      { id: 'all', label: 'All Winter Formulations' },
      { id: 'milks', label: 'Rich Milk & Butter Bars' },
      { id: 'balms', label: 'Beeswax Lip Barriers' },
      { id: 'hydrosols', label: 'Cellular Floral Water' }
    ],
    ritual: {
      headline: 'Cold Weather Barrier Shield',
      step1: 'Cleanse with Donkey Milk or Shea Butter bar to prevent post-bath tightness.',
      step2: 'Spritz pure Rose Water immediately before stepping into heated rooms.',
      step3: 'Apply beeswax lip conditioning balm to lock in dermal hydration.'
    }
  },

  // 5. Hair
  {
    id: 'hair',
    label: 'Hair',
    title: 'Botanical Hair & Scalp Therapy',
    tagline: 'Targeted Follicle Stimulation, Root Strengthening & Pure Scalp Tonics',
    badge: 'Pure Scalp',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    filterType: 'category',
    filterValue: 'Hair & Wellness',
    subPills: [
      { id: 'all', label: 'All Hair Formulations' },
      { id: 'hair-oils', label: 'Slow-Cooked Hair Oils' },
      { id: 'hydrosols', label: 'Rosemary Scalp Tonics' },
      { id: 'rosemary-oil', label: 'Pure Rosemary Extract' }
    ],
    ritual: {
      headline: 'Hair & Scalp Density Ritual',
      step1: 'Warm 2 tablespoons of Brahmi & Neem Hair Oil between palms.',
      step2: 'Part hair and massage deeply into roots and crown for 10 minutes.',
      step3: 'Post-wash, spritz Rosemary Hydrosol directly onto scalp roots to seal micro-circulation.'
    }
  },

  // 6. Face
  {
    id: 'face',
    label: 'Face',
    title: 'Pure Botanical Facial Care & Ubtan Bars',
    tagline: 'Steam Distillates, Micro-Exfoliating Herbal Bars & Botanical Serums',
    badge: 'Radiant Glow',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    filterType: 'face',
    filterValue: 'face',
    subPills: [
      { id: 'all', label: 'All Facial Formulations' },
      { id: 'neem-clear', label: 'Neem & Clear Skin' },
      { id: 'rose-mist', label: 'Damask Rose Water' },
      { id: 'turmeric-bar', label: 'Turmeric Oil Bar' },
      { id: 'geranium', label: 'Geranium Balancing Oil' }
    ],
    ritual: {
      headline: 'Radiant Facial Clarifying Ritual',
      step1: 'Cleanse with Clear Skin Neem & Basil Bar for 60 seconds with lukewarm water.',
      step2: 'Hold Damask Rose Hydrosol 6 inches away; mist liberally across face and neck.',
      step3: 'Press 2 drops of Frankincense or Geranium floral oil into damp dermal pores.'
    }
  },

  // 7. Analyse Skin
  {
    id: 'analyse-skin',
    label: 'Analyse Skin',
    title: 'AI Formulation Lab & Dermal Diagnostics',
    tagline: 'Personalized Botanical Matching Algorithm for Your Unique Skin Metrics',
    badge: 'AI Diagnostic',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
    isAction: true,
    actionTarget: 'ai-formulation-lab',
    filterType: 'diagnostic',
    filterValue: 'diagnostic',
    subPills: [
      { id: 'all', label: 'AI Diagnostic Tool' },
      { id: 'barrier', label: 'Barrier Diagnostics' },
      { id: 'acne', label: 'Acne & Sebum Profile' },
      { id: 'scalp', label: 'Scalp Density Scan' }
    ],
    ritual: {
      headline: 'Custom Diagnostic Formulation Path',
      step1: 'Select your dominant skin or scalp symptom in the AI Formulation Lab.',
      step2: 'Our algorithm maps botanical active compounds specifically to your barrier profile.',
      step3: 'Receive verified batch laboratory certificates for every recommended extract.'
    }
  },

  // 8. Body
  {
    id: 'body',
    label: 'Body',
    title: 'Cold Processed Body Bars & Muscle Care',
    tagline: 'Artisanal Saponified Cleansing Bars & Fast-Acting Herbal Relief',
    badge: 'Artisanal Body',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80',
    filterType: 'category',
    filterValue: 'Cold Processed Soaps',
    subPills: [
      { id: 'all', label: 'All Body Bars & Oils' },
      { id: 'donkey-milk', label: 'Donkey Milk & Saffron' },
      { id: 'coffee-scrub', label: 'Robusta Coffee Scrub' },
      { id: 'mineral-clay', label: 'Earthy Mineral Clay' },
      { id: 'pain-relief', label: 'Active Pain Relief Roll-On' }
    ],
    ritual: {
      headline: 'Artisanal Body Restoration Bath',
      step1: 'Work up a dense, creamy micro-foam with Donkey Milk or Coffee Scrub Bar.',
      step2: 'Gently massage across limbs in circular motions to boost lymphatic circulation.',
      step3: 'Glide the steel-ball Pain Relief Roll-On over tight neck and shoulder muscles.'
    }
  },

  // 9. Eyes & Lips
  {
    id: 'eyes-lips',
    label: 'Eyes & Lips',
    title: 'Under-Eye De-Puffing & Beeswax Lip Care',
    tagline: 'Soothe Late-Night Screen Strain & Heal Chapped or Peeling Lips',
    badge: 'De-Puff & Tint',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    filterType: 'eyes-lips',
    filterValue: 'eyes-lips',
    subPills: [
      { id: 'all', label: 'All Eyes & Lips Care' },
      { id: 'pink-lotus', label: 'Tinted Pink Lotus Balm' },
      { id: 'rose-mist', label: 'Damask Rose Eye Tonic' },
      { id: 'clear-balm', label: 'Lavender No-Tint Balm' },
      { id: 'lipstick', label: 'Botanical Satin Lipstick' }
    ],
    ritual: {
      headline: 'Ocular Strain & Lip Nourishment Ritual',
      step1: 'Rest chilled Damask Rose Hydrosol cotton pads over eyelids for 5 minutes.',
      step2: 'Glide Tinted Pink Lotus Balm for a breathable moisture seal with natural flush.',
      step3: 'Apply a generous coat of No-Tint Balm before sleep for intensive overnight conditioning.'
    }
  },

  // 10. Baby
  {
    id: 'baby',
    label: 'Baby',
    title: 'Soft Baby & Ultra-Sensitive Newborn Care',
    tagline: 'Crafted with Pure Desi A2 Cow Milk, Raw Shea Butter & Calming Lavender',
    badge: 'Tear-Free Mild',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
    filterType: 'baby',
    filterValue: 'Baby & Gentle Care',
    subPills: [
      { id: 'all', label: 'All Baby Formulations' },
      { id: 'a2-milk', label: 'Soft Baby A2 Cow Milk Bar' },
      { id: 'shea-butter', label: 'Raw Shea Butter Nutrition' },
      { id: 'gentle-care', label: 'Hypoallergenic Care' }
    ],
    ritual: {
      headline: 'Gentle Baby Bathing Ritual',
      step1: 'Lather Soft Baby Soap between warm hands until a velvety milk foam appears.',
      step2: 'Gently cleanse baby\'s delicate folds without scrubbing or tugging.',
      step3: 'Rinse with warm water and pat dry with a soft organic cotton towel.'
    }
  },

  // 11. Hair Fall
  {
    id: 'hair-fall',
    label: 'Hair Fall',
    title: 'Hair Fall, Weak Roots & Scalp Shedding',
    tagline: 'Targeted Botanical Actives for Stress, Hard Water & Monsoon Shedding',
    badge: 'Root Shield',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Hair Fall & Scalp',
    subPills: [
      { id: 'all', label: 'All Hair Fall Solutions' },
      { id: 'brahmi-oil', label: 'Brahmi & Neem Hair Oil' },
      { id: 'rosemary-tonic', label: 'Rosemary Hydrosol Mist' },
      { id: 'pure-rosemary', label: 'Rosemary Pure Essential Oil' }
    ],
    ritual: {
      headline: 'Follicle Anchor & Density Ritual',
      step1: 'Warm Brahmi & Neem Hair Oil; massage deeply into scalp roots for 10 minutes.',
      step2: 'Wash gently with lukewarm water and a mild botanical cleanser.',
      step3: 'Mist clean scalp roots with steam-distilled Rosemary Hydrosol to stimulate follicle blood flow.'
    }
  }
];

export function getConcernById(id) {
  if (!id) return CONCERNS_DATA[0];
  const normalized = id.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return (
    CONCERNS_DATA.find(
      (c) =>
        c.id === id ||
        c.id === normalized ||
        c.label.toLowerCase().includes(id.toLowerCase()) ||
        (c.filterValue && c.filterValue.toLowerCase().includes(id.toLowerCase()))
    ) || CONCERNS_DATA[0]
  );
}
