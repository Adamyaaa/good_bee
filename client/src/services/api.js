import QRCode from 'qrcode';

// Rich seed data for resilient offline/Netlify preview
export const INITIAL_PRODUCTS = [
  {
    id: 'gb_prod_01',
    title: 'Golden Royal Propolis Restorative Nectar',
    subtitle: 'Bio-Fermented Honey & Plant Squalane Active Elixir',
    slug: 'golden-royal-propolis-restorative-nectar',
    sku: 'GB-PRO-NEC-30',
    category: 'Concentrated Serums',
    concerns: ['Barrier Repair', 'Youth & Radiance', 'Dryness & Moisture Deficit'],
    price: 1890,
    mrp: 2200,
    volume: '30 ml / 1.0 fl. oz.',
    rating: 4.9,
    reviewsCount: 128,
    stock: 45,
    lowStockThreshold: 15,
    badge: 'Bestseller',
    shortDescription: 'A multi-active lipid restoring nectar infused with ethically collected bio-propolis and pure olive squalane for intense barrier rejuvenation.',
    description: 'Formulated after meticulous active-stabilization research, this nectar blends bio-active propolis flavonoids with deep-penetrating plant squalane. It strengthens the skin lipid mantle, replenishes lost hydration, and shields against micro-environmental stress without clogging pores.',
    ingredients: [
      'Raw Artisanal Propolis Extract (15%)',
      'Olive-Derived Squalane',
      'Cold-Pressed Rosehip Fruit Oil',
      'Centella Asiatica (Gotu Kola) Meristem Cell Extract',
      'Tocopherol (Pure Vitamin E)'
    ],
    ritual: 'Dispense 3–4 drops onto freshly misted skin. Gently press using warm palms into face and decolletage until fully absorbed. Suitable for AM and PM.',
    researchNotes: 'Cold-extracted under nitrogen shield to preserve delicate bio-flavonoids and enzymes.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-009d1b643a60?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'gb_prod_02',
    title: 'Botanical Ceramide Lipid Barrier Cream',
    subtitle: 'Oat Kernel Phytosterols & Meadowfoam Seed Infusion',
    slug: 'botanical-ceramide-lipid-barrier-cream',
    sku: 'GB-CRM-BAR-50',
    category: 'Face Care',
    concerns: ['Barrier Repair', 'Dryness & Moisture Deficit', 'Acne & Blemishes'],
    price: 1650,
    mrp: 1950,
    volume: '50 g / 1.7 oz.',
    rating: 4.8,
    reviewsCount: 94,
    stock: 38,
    lowStockThreshold: 12,
    badge: 'Editor Choice',
    shortDescription: 'A cushion-soft emulsion mimicking natural skin lipids to lock in cellular moisture and soothe sensitized skin.',
    description: 'Engineered with natural plant ceramides from colloidal oat lipids and meadowfoam oil. Provides 72-hour moisture retention while reinforcing weakened skin barriers resulting from pollution or over-cleansing.',
    ingredients: [
      'Colloidal Oat Lipid Ceramides (NP, AP, EOP analogues)',
      'Limnanthes Alba (Meadowfoam) Seed Oil',
      'Niacinamide-rich Fermented Rice Water',
      'Shea Butter Glycerides',
      'Chamomile Flower Extract'
    ],
    ritual: 'Smooth a pea-sized amount over face and neck as the final sealing step in your skincare routine.',
    researchNotes: 'Biomimetic lamellar emulsion matches skin stratum corneum structure for rapid absorption.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'gb_prod_03',
    title: 'Saffron & Licorice Radiance Concentrate',
    subtitle: 'Crocus Sativus Floral Extract & Bio-Glucosides',
    slug: 'saffron-licorice-radiance-concentrate',
    sku: 'GB-SER-SAF-30',
    category: 'Concentrated Serums',
    concerns: ['Pigmentation & Tone', 'Youth & Radiance'],
    price: 2450,
    mrp: 2900,
    volume: '30 ml / 1.0 fl. oz.',
    rating: 5.0,
    reviewsCount: 76,
    stock: 22,
    lowStockThreshold: 10,
    badge: 'New Release',
    shortDescription: 'Concentrated natural brighteners that visibly fade hyperpigmentation and impart an incandescent, lit-from-within glow.',
    description: 'Pure hand-harvested Kashmiri saffron filaments synergized with high-purity glabridin from organic licorice roots. Gently disrupts melanin clustering without photosensitivity.',
    ingredients: [
      'Kashmiri Saffron Stigma Infusion (Crocus Sativus)',
      'Standardized Licorice Root Extract (Glycyrrhiza Glabra)',
      'Kumkumadi Botanicals',
      'Kakadu Plum Bio-Vitamin C',
      'Pure Vegetable Glycerin'
    ],
    ritual: 'Press 3 drops into cleansed skin each evening. Follow with Botanical Ceramide Barrier Cream.',
    researchNotes: 'Chromatographic purity testing ensures ultra-concentrated crocin retention without artificial coloring.',
    image: 'https://images.unsplash.com/photo-1608248597359-009d1b643a60?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608248597359-009d1b643a60?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'gb_prod_04',
    title: 'Honey Blossom Enzyme Clarifying Cleanser',
    subtitle: 'Raw Honey Enzymes & Willow Bark BHA Cleanser',
    slug: 'honey-blossom-enzyme-clarifying-cleanser',
    sku: 'GB-CLN-BLS-120',
    category: 'Cleansers',
    concerns: ['Acne & Blemishes', 'Pigmentation & Tone'],
    price: 1190,
    mrp: 1390,
    volume: '120 ml / 4.0 fl. oz.',
    rating: 4.7,
    reviewsCount: 110,
    stock: 54,
    lowStockThreshold: 15,
    badge: 'Pure Ritual',
    shortDescription: 'Gentle low-pH gel cleanser dissolving congestion, excess sebum and makeup while maintaining lipid moisture balance.',
    description: 'Combines naturally active fruit enzymes and raw honey humectants with Salix Alba (Willow Bark) natural salicylic acid for clear, balanced pores without stripping.',
    ingredients: [
      'Raw Forest Wildflower Honey',
      'White Willow Bark Extract (Natural Salicin)',
      'Papaya Ferment Glucoside',
      'Decyl Glucoside (Gentle Coconut Surfactant)',
      'Neroli Hydrosol'
    ],
    ritual: 'Lather gently onto damp skin with circular motions for 60 seconds. Rinse thoroughly with cool water.',
    researchNotes: 'pH optimized at 5.2 to preserve the skin acid mantle and beneficial cutaneous microbiome.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'gb_prod_05',
    title: 'Centella & Green Tea Calming Essence',
    subtitle: 'Subcritical Green Tea & Madecassoside Mist',
    slug: 'centella-green-tea-calming-essence',
    sku: 'GB-ESS-CEN-100',
    category: 'Face Care',
    concerns: ['Acne & Blemishes', 'Barrier Repair'],
    price: 1350,
    mrp: 1550,
    volume: '100 ml / 3.4 fl. oz.',
    rating: 4.8,
    reviewsCount: 68,
    stock: 30,
    lowStockThreshold: 12,
    badge: 'Calming Essential',
    shortDescription: 'A lightweight antioxidant veil that halts irritation, redness, and oxidative stressors within seconds of application.',
    description: 'Infused with high-purity madecassoside and shade-grown green tea catechins. Restores equilibrium following sun exposure or seasonal weather changes.',
    ingredients: [
      'Centella Asiatica Hydro-Extract (82%)',
      'Camellia Sinensis (Green Tea) Leaf Water',
      'Aloe Barbadensis Leaf Juice',
      'Hyaluronic Acid (Triple Molecular Weight)',
      'Allantoin'
    ],
    ritual: 'Mist directly over face or pat with fingertips as the first preparatory step post-cleansing.',
    researchNotes: 'Triple-weight botanical hyaluronic acid penetrates both superficial and deeper dermal planes.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'gb_prod_06',
    title: 'Rosehip & Bakuchiol Cell Rejuvenation Elixir',
    subtitle: '100% Natural Plant Retinol-Alternative Night Oil',
    slug: 'rosehip-bakuchiol-cell-rejuvenation-elixir',
    sku: 'GB-ELX-BAK-30',
    category: 'Restorative Elixirs',
    concerns: ['Youth & Radiance', 'Pigmentation & Tone'],
    price: 2190,
    mrp: 2600,
    volume: '30 ml / 1.0 fl. oz.',
    rating: 4.9,
    reviewsCount: 88,
    stock: 19,
    lowStockThreshold: 8,
    badge: 'Night Ritual',
    shortDescription: 'The gentle, natural alternative to retinol. Stimulates collagen turnover without dryness, flaking, or irritation.',
    description: 'Contains 2% pure standardized Bakuchiol isolated from the seeds of Psoralea Corylifolia, blended into cold-milled Chilean rosehip seed oil.',
    ingredients: [
      'Standardized Bakuchiol (2.0%)',
      'Wild Chilean Rosehip Seed Oil (Rosa Canina)',
      'Jojoba Seed Oil',
      'Sea Buckthorn Fruit CO2 Extract',
      'Helichrysum (Immortelle) Floral Oil'
    ],
    ritual: 'Warm 2–3 drops between palms at bedtime and press firmly into cleansed skin.',
    researchNotes: 'Non-photosensitizing profile allows safe use across all four seasons.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80'
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
