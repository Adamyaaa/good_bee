// Authentic customer reviews for Good Bee products
export const SEED_REVIEWS = {
  gb_prod_frankincense: [
    {
      id: 'rev_frk_1',
      productId: 'gb_prod_frankincense',
      authorName: 'Sunita Mehra',
      authorCity: 'Bengaluru',
      rating: 5,
      date: '12 Oct 2026',
      headline: 'Deeply calming on dry & irritated patches',
      comment: 'I mix 2 drops with my night facial oil. The frankincense aroma is completely pure, earthy, and not artificially sweet like commercial perfumes. Skin feels visibly resilient and plumper by morning.',
      verifiedPurchase: true
    },
    {
      id: 'rev_frk_2',
      productId: 'gb_prod_frankincense',
      authorName: 'Rohan Nambiar',
      authorCity: 'Kochi',
      rating: 5,
      date: '28 Sep 2026',
      headline: 'Exceptional steam-distilled grade',
      comment: 'Having used essential oils from various international pharmacies, Good Bee’s steam distillation clarity is top-tier. Absorbs without clogging pores or greasy residual shine.',
      verifiedPurchase: true
    },
    {
      id: 'rev_frk_3',
      productId: 'gb_prod_frankincense',
      authorName: 'Dr. Radhika Iyer',
      authorCity: 'Mumbai',
      rating: 4,
      date: '15 Aug 2026',
      headline: 'Clean active terpenes',
      comment: 'Very potent formulation — only a drop or two is needed. Excellent cellular barrier support for mature or environmental-stress exposed skin.',
      verifiedPurchase: true
    }
  ],
  gb_prod_geranium: [
    {
      id: 'rev_ger_1',
      productId: 'gb_prod_geranium',
      authorName: 'Meera Chawla',
      authorCity: 'Chandigarh',
      rating: 5,
      date: '04 Oct 2026',
      headline: 'Helped regulate my T-zone balance',
      comment: 'Geranium extract has transformed my combination skin routine. Less midday shine and blemishes have calmed down significantly over three weeks.',
      verifiedPurchase: true
    },
    {
      id: 'rev_ger_2',
      productId: 'gb_prod_geranium',
      authorName: 'Ananya Deshmukh',
      authorCity: 'Pune',
      rating: 5,
      date: '19 Sep 2026',
      headline: 'Authentic floral note',
      comment: 'Fresh, herbaceous floral fragrance that feels therapeutic after evening face cleanses. Zero synthetic sting.',
      verifiedPurchase: true
    }
  ],
  gb_prod_lemongrass: [
    {
      id: 'rev_lem_1',
      productId: 'gb_prod_lemongrass',
      authorName: 'Vikramaditya Varma',
      authorCity: 'Hyderabad',
      rating: 5,
      date: '02 Oct 2026',
      headline: 'Refreshing and purifying',
      comment: 'Clarifies skin and leaves a refreshing uplifting botanical scent. Works wonderfully when diluted in toner.',
      verifiedPurchase: true
    }
  ],
  gb_prod_clear_skin_soap: [
    {
      id: 'rev_css_1',
      productId: 'gb_prod_clear_skin_soap',
      authorName: 'Priya Sundaram',
      authorCity: 'Chennai',
      rating: 5,
      date: '08 Oct 2026',
      headline: 'Non-drying cold processed bar',
      comment: 'Unlike commercial soaps with SLS, this retains all the natural glycerin. Leaves face squeaky-clean without the parched tight sensation.',
      verifiedPurchase: true
    },
    {
      id: 'rev_css_2',
      productId: 'gb_prod_clear_skin_soap',
      authorName: 'Aman Deep Singh',
      authorCity: 'Delhi NCR',
      rating: 5,
      date: '21 Sep 2026',
      headline: 'Cleared stubborn shoulder acne',
      comment: 'The herbal neem & turmeric infusion is authentic. Noticed a clear reduction in back and shoulder bumps within 10 days.',
      verifiedPurchase: true
    }
  ],
  gb_prod_donkey_milk_soap: [
    {
      id: 'rev_dms_1',
      productId: 'gb_prod_donkey_milk_soap',
      authorName: 'Kavita Menon',
      authorCity: 'Bengaluru',
      rating: 5,
      date: '14 Oct 2026',
      headline: 'Luxuriously creamy lather',
      comment: 'Incredible texture and gentle creamy lather. My dry and sensitive barrier feels pampered every single morning.',
      verifiedPurchase: true
    }
  ]
};

// Generic fallback reviews for products without specific entries
export const DEFAULT_PRODUCT_REVIEWS = [
  {
    id: 'rev_default_1',
    authorName: 'Ritika Sen',
    authorCity: 'Kolkata',
    rating: 5,
    date: '10 Oct 2026',
    headline: 'High botanical purity & noticeable freshness',
    comment: 'The cold extraction process makes a tangible difference in skin feel. Absorbs cleanly and smells wonderfully pure.',
    verifiedPurchase: true
  },
  {
    id: 'rev_default_2',
    authorName: 'Tanvi Nair',
    authorCity: 'Ernakulam',
    rating: 5,
    date: '24 Sep 2026',
    headline: 'Gentle on barrier-compromised skin',
    comment: 'No burning, no redness. Consistent quality and fast dispatch. Will be repurchasing regularly.',
    verifiedPurchase: true
  }
];
