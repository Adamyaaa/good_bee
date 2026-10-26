export const CONCERNS_DATA = [
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
  {
    id: 'hair-fall',
    label: 'Hair Fall',
    title: 'Hair Fall & Scalp Weakness',
    tagline: 'For Your Unique Hair & Scalp Needs',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Hair Fall & Scalp',
    subPills: [
      { id: 'all', label: 'All Hair Formulations' },
      { id: 'hair-oils', label: 'Hair Growth Oils' },
      { id: 'hydrosols', label: 'Scalp Mists & Tonics' },
      { id: 'rosemary', label: 'Pure Rosemary Extracted' }
    ],
    ritual: {
      headline: 'Hair & Scalp Density Ritual',
      step1: 'Warm 2 tablespoons of Brahmi & Neem Hair Oil between palms.',
      step2: 'Part hair and massage deeply into roots and crown for 10 minutes.',
      step3: 'Post-wash, spritz Rosemary Hydrosol directly onto scalp roots to seal micro-circulation.'
    }
  },
  {
    id: 'under-eye',
    label: 'Under Eye',
    title: 'Under-Eye Dark Circles & Screen Strain',
    tagline: 'For Late Night Laptop Screen Fatigue & Morning Puffiness',
    badge: 'De-Puffs',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Under-Eye Care',
    subPills: [
      { id: 'all', label: 'All Eye & Face Care' },
      { id: 'rose-hydrosol', label: 'Damask Rose Hydrosols' },
      { id: 'frankincense', label: 'Frankincense Cellular Oils' },
      { id: 'depuff', label: 'Instant Cooling Rituals' }
    ],
    ritual: {
      headline: 'Ocular Strain & Dark Circle Ritual',
      step1: 'Saturate two cotton pads with chilled Damask Rose Hydrosol Mist.',
      step2: 'Rest over closed eyelids for 5 minutes to soothe dilated micro-capillaries.',
      step3: 'Gently dab 1 drop of Frankincense-infused carrier oil around the orbital bone.'
    }
  },
  {
    id: 'acne-pimples',
    label: 'Acne & Pimples',
    title: 'Active Pimples, Acne & Red Flare-ups',
    tagline: 'For Clear Pores & Natural Microbial Balance',
    badge: 'Clear Skin',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Acne & Blemishes',
    subPills: [
      { id: 'all', label: 'All Clarifying Formulations' },
      { id: 'clear-soap', label: 'Cold-Cured Neem & Basil' },
      { id: 'charcoal', label: 'Charcoal Pore Flush' },
      { id: 'lemongrass', label: 'Lemongrass Antimicrobial' }
    ],
    ritual: {
      headline: 'Anti-Blemish Flush Ritual',
      step1: 'Lather Clear Skin Soap between palms; gently massage into t-zone for 60 seconds.',
      step2: 'Spritz Rosemary Hydrosol Mist across face to balance pore pH without stinging.',
      step3: 'Spot-treat active flare-ups with diluted Lemongrass or Geranium essential oil.'
    }
  },
  {
    id: 'skin-barrier',
    label: 'Skin Barrier',
    title: 'Compromised Barrier & Body Roughness',
    tagline: 'For Dryness, Tanning & Cellular Lipid Repair',
    badge: 'Ceramides',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Barrier Repair',
    subPills: [
      { id: 'all', label: 'All Barrier Formulations' },
      { id: 'donkey-milk', label: 'Donkey Milk Ceramides' },
      { id: 'earth-clay', label: 'Natural Mineral Clay' },
      { id: 'joint-relief', label: 'Joint & Muscle Roll-On' }
    ],
    ritual: {
      headline: 'Cellular Lipid Reconstruction Ritual',
      step1: 'Cleanse with Donkey Milk Cold Processed Bar to cushion the lipid matrix.',
      step2: 'Spritz Damask Rose Hydrosol generously onto damp face and body.',
      step3: 'Lock in restorative moisture while skin is still dewy using beeswax-infused balms.'
    }
  },
  {
    id: 'lip-care',
    label: 'Lip Care',
    title: 'Chapped, Peeling & Pigmented Lips',
    tagline: 'For 24h Natural Beeswax Hydration & Rosy Tint',
    badge: '100% Beeswax',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Lip & Facial Care',
    subPills: [
      { id: 'all', label: 'All Lip Care' },
      { id: 'pink-lotus', label: 'Tinted Pink Lotus' },
      { id: 'lavender', label: 'Lavender & Vitamin E' },
      { id: 'lipstick', label: 'Botanical Natural Lipsticks' }
    ],
    ritual: {
      headline: 'Dewy Botanical Lip Ritual',
      step1: 'Gently buff lips using a warm damp muslin cloth after morning shower.',
      step2: 'Glide Tinted Pink Lotus Balm for a breathable moisture seal with natural flush.',
      step3: 'Apply a generous coat of No-Tint Balm before sleep for intensive overnight conditioning.'
    }
  },
  {
    id: 'youth-radiance',
    label: 'Youth & Glow',
    title: 'Fine Lines, Dullness & Youth Radiance',
    tagline: 'For Cellular Firmness & Botanical Collagen Support',
    badge: 'Radiance',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Youth & Radiance',
    subPills: [
      { id: 'all', label: 'All Youth Formulations' },
      { id: 'frankincense', label: 'Frankincense Resin Extract' },
      { id: 'donkey-milk', label: 'Donkey Milk Bars' },
      { id: 'rose-water', label: 'Damask Rose Water' }
    ],
    ritual: {
      headline: 'Cellular Vitality & Collagen Ritual',
      step1: 'Bathe with Donkey Milk Soap rich in natural retinol-analogous ceramides.',
      step2: 'Hydrate with antioxidant-dense Damask Rose Floral Mist.',
      step3: 'Press 2 drops of Frankincense Pure Essential Oil into face and décolletage.'
    }
  },
  {
    id: 'pigmentation',
    label: 'Pigmentation',
    title: 'Uneven Tone, Sun Spots & Pigmentation',
    tagline: 'For Natural Luminous Clarity & Melanin Harmonization',
    badge: 'Tone Repair',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Pigmentation & Tone',
    subPills: [
      { id: 'all', label: 'All Tone Formulations' },
      { id: 'turmeric', label: 'Turmeric Oil Infused' },
      { id: 'sunnipindi', label: 'Sunnipindi Heritage Bath' },
      { id: 'geranium', label: 'Geranium Balancing Oil' }
    ],
    ritual: {
      headline: 'Melanin Harmonization Ritual',
      step1: 'Cleanse with Turmeric Oil Cold Processed Soap to fade post-sun dullness.',
      step2: 'Use Sunnipindi Soap 3x weekly for gentle multi-grain enzymatic polishing.',
      step3: 'Massage with diluted Geranium oil to unify cutaneous undertones.'
    }
  },
  {
    id: 'baby-care',
    label: 'Baby Care',
    title: 'Gentle Newborn & Sensitive Infant Skin',
    tagline: 'Formulated with Pure A2 Cow Milk & Raw Shea Butter',
    badge: 'Tear-Free',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
    filterType: 'concern',
    filterValue: 'Baby & Gentle Care',
    subPills: [
      { id: 'all', label: 'All Baby Formulations' },
      { id: 'a2-milk', label: 'A2 Cow Milk Bars' },
      { id: 'shea', label: 'Raw Shea Butter Infusion' },
      { id: 'hypoallergenic', label: 'Pure Hypoallergenic' }
    ],
    ritual: {
      headline: 'Gentle Newborn Bathing Ritual',
      step1: 'Lather Soft Baby Soap between warm hands until a velvety foam appears.',
      step2: 'Gently cleanse baby\'s delicate folds without scrubbing or tugging.',
      step3: 'Rinse with warm water and pat dry with a soft organic cotton towel.'
    }
  },
  {
    id: 'winter-care',
    label: 'Winter Care',
    title: 'Deep Winter Dryness & Cold Wind Chapping',
    tagline: 'Intense Moisture Sealing for Winter Weather',
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
  {
    id: 'body-soaps',
    label: 'Body Soaps',
    title: 'Cold Processed Artisanal Botanical Soaps',
    tagline: '45-Day Cured Without Harsh SLS or Synthetic Detergents',
    badge: 'Cold Cured',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    filterType: 'category',
    filterValue: 'Cold Processed Soaps',
    subPills: [
      { id: 'all', label: 'All Soaps (8 Bars)' },
      { id: 'luxury-milks', label: 'Donkey & Cow Milk' },
      { id: 'herbal-neem', label: 'Neem & Clear Skin' },
      { id: 'scrub-coffee', label: 'Robusta Coffee Scrub' }
    ],
    ritual: {
      headline: 'Artisanal Cold-Process Bath Ritual',
      step1: 'Wet bar and work up creamy, rich botanical micro-bubbles in hands.',
      step2: 'Massage across wet limbs; allow natural plant glycerin to soften the skin.',
      step3: 'Store on a dry wooden soap dish between uses for maximum bar longevity.'
    }
  },
  {
    id: 'pure-oils',
    label: 'Pure Oils',
    title: 'Steam-Distilled Pure Essential & Therapeutic Oils',
    tagline: 'Single-Origin Botanical Extractions with Batch Transparency',
    badge: '100% Pure',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80',
    filterType: 'category',
    filterValue: 'Pure Essential Oils',
    subPills: [
      { id: 'all', label: 'All Essential Oils' },
      { id: 'rosemary-oil', label: 'Rosemary Terpene Oil' },
      { id: 'frankincense-oil', label: 'Frankincense Resin' },
      { id: 'geranium-oil', label: 'Geranium Floral Oil' },
      { id: 'lemongrass-oil', label: 'Lemongrass Herbal' }
    ],
    ritual: {
      headline: 'Aromatherapeutic Facial & Scalp Ritual',
      step1: 'Always dilute 2–3 drops into a cold-pressed carrier oil (Jojoba, Brahmi, or Coconut).',
      step2: 'Warm between palms and inhale aromatic terpenes deeply for sensory grounding.',
      step3: 'Press gently onto target skin or scalp roots before evening rest.'
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
        c.filterValue.toLowerCase().includes(id.toLowerCase())
    ) || CONCERNS_DATA[0]
  );
}
