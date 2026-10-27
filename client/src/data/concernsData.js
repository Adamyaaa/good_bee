export const CONCERNS_DATA = [
  // 1. Flash Deals ⚡
  {
    id: 'flash-deals',
    label: 'Flash Deals ⚡',
    title: 'Flash Deals & Limited Botanical Editions',
    tagline: 'Up to 40% OFF on Clinically Proven Pure Formulations',
    badge: '40% OFF',
    isPromo: true,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    editorialBanner: {
      whisperTopic: "Season's Whisper:",
      whisperSubtitle: "Dry Winter Skin, High Prices & Compromised Care",
      replyTopic: "Fresh Botanical Replies:",
      replySubtitle: "Flat 40% OFF on 100% Pure Plant Formulations",
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-[#EBF6F7] via-[#DEF0F3] to-[#C9E7EC]'
    },
    ritualHeadline: 'Flash Deals: Handpicked Bestsellers at Unbeatable Value',
    productIds: [
      'gb_prod_frankincense',
      'gb_prod_geranium',
      'gb_prod_rosemary_oil',
      'gb_prod_donkey_milk_soap',
      'gb_prod_pink_lip_balm',
      'gb_prod_rose_mist',
      'gb_prod_clear_skin_soap',
      'gb_prod_hair_oil'
    ],
    subPills: [
      { id: 'all', label: 'All Deals (8)' },
      { id: 'under-500', label: 'Under ₹500', productIds: ['gb_prod_clear_skin_soap', 'gb_prod_pink_lip_balm', 'gb_prod_donkey_milk_soap'] },
      { id: 'essential-oils', label: 'Pure Essential Oils', productIds: ['gb_prod_frankincense', 'gb_prod_geranium', 'gb_prod_rosemary_oil'] },
      { id: 'hair-face', label: 'Hair & Face Mists', productIds: ['gb_prod_hair_oil', 'gb_prod_rose_mist'] }
    ],
    ritual: {
      headline: 'Flash Deal Pairing Guide',
      step1: 'Select cold-cured botanical bar for active cellular cleansing.',
      step2: 'Mist steam-distilled hydrosol to replenish water reserves.',
      step3: 'Seal with 2 drops of unadulterated plant oil for all-day barrier defense.'
    }
  },

  // 2. Hair Care
  {
    id: 'hair-care',
    label: 'Hair Care',
    title: 'Botanical Hair & Scalp Therapy',
    tagline: 'Targeted Follicle Stimulation, Root Strengthening & Pure Scalp Tonics',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    editorialBanner: {
      whisperTopic: "Hair's Whisper:",
      whisperSubtitle: "Excessive Hairfall, Weak Roots & Scalp Flaking",
      replyTopic: "Pure Plant Replies:",
      replySubtitle: "Nilgiri Rosemary, Slow-Cooked Brahmi & Follicle Strength",
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-[#EAF5F0] via-[#DCEDE4] to-[#C7E3D3]'
    },
    ritualHeadline: 'Your 3-Step Routine for Strong Roots & Zero Hair Fall',
    productIds: [
      'gb_prod_hair_oil',
      'gb_prod_rosemary_mist',
      'gb_prod_rosemary_oil'
    ],
    subPills: [
      { id: 'all', label: 'All Hair Care (3)' },
      { id: 'hair-oil', label: 'Brahmi & Neem Hair Oil', productIds: ['gb_prod_hair_oil'] },
      { id: 'hydrosol', label: 'Rosemary Hydrosol Mist', productIds: ['gb_prod_rosemary_mist'] },
      { id: 'essential-extract', label: 'Rosemary Pure Essential Oil', productIds: ['gb_prod_rosemary_oil'] }
    ],
    ritual: {
      headline: 'Hair & Scalp Density Ritual',
      step1: 'Warm 2 tablespoons of Brahmi & Neem Hair Oil between palms.',
      step2: 'Part hair and massage deeply into roots and crown for 10 minutes.',
      step3: 'Post-wash, spritz Rosemary Hydrosol directly onto scalp roots to seal micro-circulation.'
    }
  },

  // 3. Face Care
  {
    id: 'face-care',
    label: 'Face Care',
    title: 'Pure Botanical Facial Care & Ubtan Bars',
    tagline: 'Steam Distillates, Micro-Exfoliating Herbal Bars & Botanical Serums',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    editorialBanner: {
      whisperTopic: "Skin's Whisper:",
      whisperSubtitle: "Acne Breakouts, Red Flare-Ups & Clogged Pores",
      replyTopic: "Fresh Botanicals Reply:",
      replySubtitle: "Cold Neem Leaves, Damask Rose Water & Pure Herbal Clarity",
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-[#FFF8E7] via-[#FFF3D1] to-[#FCEABB]'
    },
    ritualHeadline: 'Your Daily Diagnostic Facial Routine for Luminous Clarity',
    productIds: [
      'gb_prod_clear_skin_soap',
      'gb_prod_turmeric_soap',
      'gb_prod_rose_mist',
      'gb_prod_geranium',
      'gb_prod_lemongrass',
      'gb_prod_sunnipindi_soap',
      'gb_prod_charcoal_soap'
    ],
    subPills: [
      { id: 'all', label: 'All Face Care (7)' },
      { id: 'cleansers', label: 'Clarifying Face Bars', productIds: ['gb_prod_clear_skin_soap', 'gb_prod_turmeric_soap', 'gb_prod_charcoal_soap', 'gb_prod_sunnipindi_soap'] },
      { id: 'hydrosol', label: 'Damask Rose Facial Mist', productIds: ['gb_prod_rose_mist'] },
      { id: 'pure-oils', label: 'Balancing Floral Oils', productIds: ['gb_prod_geranium', 'gb_prod_lemongrass'] }
    ],
    ritual: {
      headline: 'Radiant Facial Clarifying Ritual',
      step1: 'Cleanse with Clear Skin Neem & Basil Bar for 60 seconds with lukewarm water.',
      step2: 'Hold Damask Rose Hydrosol 6 inches away; mist liberally across face and neck.',
      step3: 'Press 2 drops of Geranium or Lemongrass floral oil into damp dermal pores.'
    }
  },

  // 4. Lip Care
  {
    id: 'lip-care',
    label: 'Lip Care',
    title: 'Natural Beeswax Lip Care & Dewy Tints',
    tagline: 'Soothe AC Dehydration, Dry Chapped Skin & Uneven Lip Tone',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    editorialBanner: {
      whisperTopic: "Lip's Whisper:",
      whisperSubtitle: "Chapped, Peeling & Matte-Lipstick Dehydration",
      replyTopic: "Pure Beeswax Replies:",
      replySubtitle: "Nilgiri Raw Waxes, Pink Lotus Petals & All-Day Moisture Seal",
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-[#FDF2F4] via-[#FCE4E8] to-[#F9CFD7]'
    },
    ritualHeadline: 'Your 24-Hour Regimen for Soft, Naturally Rosy Lips',
    productIds: [
      'gb_prod_pink_lip_balm',
      'gb_prod_clear_lip_balm',
      'gb_prod_lipstick',
      'gb_prod_rose_mist'
    ],
    subPills: [
      { id: 'all', label: 'All Lip Care (4)' },
      { id: 'tinted', label: 'Tinted Pink Lotus Balm', productIds: ['gb_prod_pink_lip_balm'] },
      { id: 'clear', label: 'Lavender No-Tint Balm', productIds: ['gb_prod_clear_lip_balm'] },
      { id: 'lipstick', label: 'Natural Botanical Lipstick', productIds: ['gb_prod_lipstick'] },
      { id: 'hydrating-mist', label: 'Damask Rose Refresh Mist', productIds: ['gb_prod_rose_mist'] }
    ],
    ritual: {
      headline: 'Ocular Strain & Lip Nourishment Ritual',
      step1: 'Buff lips gently with a warm damp cloth after morning shower.',
      step2: 'Glide Tinted Pink Lotus Balm for a breathable moisture seal with natural flush.',
      step3: 'Apply a generous coat of No-Tint Balm before sleep for intensive overnight conditioning.'
    }
  },

  // 5. Body Soaps
  {
    id: 'body-soaps',
    label: 'Body Soaps',
    title: 'Cold Processed Artisanal Botanical Soaps',
    tagline: '45-Day Cured Without Harsh SLS or Synthetic Detergents',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    editorialBanner: {
      whisperTopic: "Body's Whisper:",
      whisperSubtitle: "Chemical Stripping, Itchy Scaly Redness & Rough Barrier",
      replyTopic: "45-Day Cured Replies:",
      replySubtitle: "Raw Donkey Milk, Natural Glycerin & Kashmir Saffron",
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-[#F5F2EB] via-[#EFE9DC] to-[#E3D9C3]'
    },
    ritualHeadline: 'Heritage Bathing Bars for Restored Cellular Lipids',
    productIds: [
      'gb_prod_donkey_milk_soap',
      'gb_prod_clear_skin_soap',
      'gb_prod_coffee_soap',
      'gb_prod_baby_soap',
      'gb_prod_turmeric_soap',
      'gb_prod_charcoal_soap',
      'gb_prod_earthy_soap',
      'gb_prod_sunnipindi_soap',
      'gb_prod_pain_relief_rollon'
    ],
    subPills: [
      { id: 'all', label: 'All Cold-Cured Soaps (9)' },
      { id: 'milk-bars', label: 'Luxury Milk Bars', productIds: ['gb_prod_donkey_milk_soap', 'gb_prod_baby_soap'] },
      { id: 'herbal-detox', label: 'Herbal Neem & Charcoal', productIds: ['gb_prod_clear_skin_soap', 'gb_prod_charcoal_soap'] },
      { id: 'exfoliating', label: 'Coffee Scrub & Sunnipindi', productIds: ['gb_prod_coffee_soap', 'gb_prod_sunnipindi_soap'] },
      { id: 'pain-relief', label: 'Active Herbal Relief Roll-On', productIds: ['gb_prod_pain_relief_rollon'] }
    ],
    ritual: {
      headline: 'Artisanal Cold-Process Bath Ritual',
      step1: 'Wet bar and work up creamy, rich botanical micro-bubbles in hands.',
      step2: 'Massage across wet limbs; allow natural plant glycerin to soften the skin.',
      step3: 'Store on a dry wooden soap dish between uses for maximum bar longevity.'
    }
  },

  // 6. Winter Care (Exact Nat Habit Aesthetic Match)
  {
    id: 'winter-care',
    label: 'Winter Care',
    title: 'Winter Care & Deep Moisture Shield',
    tagline: 'Intense Lipid Reconstruction for Parched Winter Skin & Chapped Lips',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=400&q=80',
    editorialBanner: {
      whisperTopic: "Winter's Whisper:",
      whisperSubtitle: "Dryness, Hairfall & Flaky Skin",
      replyTopic: "Fresh Botanicals Reply:",
      replySubtitle: "Moisture, Nourishment & Protection",
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-[#D6ECEF] via-[#E4F3F5] to-[#BEE3E8]'
    },
    ritualHeadline: 'Your Morning Ritual for Soft, Winter-Proof Skin',
    productIds: [
      'gb_prod_donkey_milk_soap',
      'gb_prod_baby_soap',
      'gb_prod_pink_lip_balm',
      'gb_prod_clear_lip_balm',
      'gb_prod_rose_mist',
      'gb_prod_frankincense'
    ],
    subPills: [
      { id: 'all', label: 'All Winter Care (6)' },
      { id: 'rich-milks', label: 'Rich Milk & Butter Bars', productIds: ['gb_prod_donkey_milk_soap', 'gb_prod_baby_soap'] },
      { id: 'lip-balms', label: 'Beeswax Lip Barriers', productIds: ['gb_prod_pink_lip_balm', 'gb_prod_clear_lip_balm'] },
      { id: 'hydrosols', label: 'Damask Rose Floral Mist', productIds: ['gb_prod_rose_mist'] },
      { id: 'frankincense', label: 'Frankincense Resin Oil', productIds: ['gb_prod_frankincense'] }
    ],
    ritual: {
      headline: 'Cold Weather Barrier Shield',
      step1: 'Cleanse with Donkey Milk or Shea Butter bar to prevent post-bath tightness.',
      step2: 'Spritz pure Rose Water immediately before stepping into heated rooms.',
      step3: 'Apply beeswax lip conditioning balm to lock in dermal hydration.'
    }
  },

  // 7. Pure Oils
  {
    id: 'pure-oils',
    label: 'Pure Oils',
    title: 'Steam-Distilled Pure Essential & Therapeutic Oils',
    tagline: 'Single-Origin Botanical Extractions with Batch Transparency',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80',
    editorialBanner: {
      whisperTopic: "Aromatic Whisper:",
      whisperSubtitle: "Stress Fatigue, Dilated Pores & Unbalanced Sebum",
      replyTopic: "Pure Distillates Reply:",
      replySubtitle: "Hydro-Distilled Plant Terpenes & Cellular Vitality",
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-[#FDF3E8] via-[#FAE7D0] to-[#F5D8B3]'
    },
    ritualHeadline: 'Therapeutic Botanical Drops for Face, Hair & Mind',
    productIds: [
      'gb_prod_frankincense',
      'gb_prod_geranium',
      'gb_prod_lemongrass',
      'gb_prod_rosemary_oil'
    ],
    subPills: [
      { id: 'all', label: 'All Essential Oils (4)' },
      { id: 'rosemary', label: 'Rosemary Scalp Active', productIds: ['gb_prod_rosemary_oil'] },
      { id: 'frankincense', label: 'Frankincense Youth Resin', productIds: ['gb_prod_frankincense'] },
      { id: 'geranium', label: 'Geranium Balancing Floral', productIds: ['gb_prod_geranium'] },
      { id: 'lemongrass', label: 'Lemongrass Citrus Herbal', productIds: ['gb_prod_lemongrass'] }
    ],
    ritual: {
      headline: 'Aromatherapeutic Facial & Scalp Ritual',
      step1: 'Always dilute 2–3 drops into a cold-pressed carrier oil (Jojoba, Brahmi, or Coconut).',
      step2: 'Warm between palms and inhale aromatic terpenes deeply for sensory grounding.',
      step3: 'Press gently onto target skin or scalp roots before evening rest.'
    }
  },

  // 8. Baby Care
  {
    id: 'baby-care',
    label: 'Baby Care',
    title: 'Soft Baby & Ultra-Sensitive Newborn Care',
    tagline: 'Crafted with Pure Desi A2 Cow Milk, Raw Shea Butter & Calming Lavender',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
    editorialBanner: {
      whisperTopic: "Baby's Whisper:",
      whisperSubtitle: "Delicate Newborn Skin, Diaper Rash & Harsh Detergents",
      replyTopic: "Desi A2 Milk Replies:",
      replySubtitle: "Ultra-Gentle Saponification, Raw Shea & Zero Toxins",
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-[#F4F1FD] via-[#EDE7FC] to-[#DDD1F8]'
    },
    ritualHeadline: 'Gentle, Tear-Free Bathing Regimen for Sensitive Skin',
    productIds: [
      'gb_prod_baby_soap',
      'gb_prod_donkey_milk_soap'
    ],
    subPills: [
      { id: 'all', label: 'All Baby Care (2)' },
      { id: 'a2-milk', label: 'Soft Baby A2 Cow Milk Bar', productIds: ['gb_prod_baby_soap'] },
      { id: 'donkey-milk', label: 'Donkey Milk & Saffron Bar', productIds: ['gb_prod_donkey_milk_soap'] }
    ],
    ritual: {
      headline: 'Gentle Baby Bathing Ritual',
      step1: 'Lather Soft Baby Soap between warm hands until a velvety milk foam appears.',
      step2: 'Gently cleanse baby\'s delicate folds without scrubbing or tugging.',
      step3: 'Rinse with warm water and pat dry with a soft organic cotton towel.'
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
        id.toLowerCase().includes(c.id)
    ) || CONCERNS_DATA[0]
  );
}
