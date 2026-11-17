import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

// GET /api/v1/products - Public listing with filters
router.get('/', (req, res) => {
  const { category, concern, search, badge, sort } = req.query;

  let list = store.products.filter((p) => p.status === PRODUCT_STATUS.PUBLISHED);

  if (category && category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (concern && concern !== 'All') {
    const q = concern.toLowerCase();
    list = list.filter((p) =>
      p.concerns.some((c) => c.toLowerCase() === q || c.toLowerCase().includes(q) || q.includes(c.toLowerCase())) ||
      p.category.toLowerCase() === q
    );
  }

  if (badge) {
    list = list.filter((p) => p.badge && p.badge.toLowerCase() === badge.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(q))
    );
  }

  if (sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    count: list.length,
    products: list
  });
});

// GET /api/v1/products/:slug - Product detail
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const product = store.products.find(
    (p) => (p.slug === slug || p.id === slug) && p.status === PRODUCT_STATUS.PUBLISHED
  );

  if (!product) {
    return res.status(404).json({ error: 'Product not found in Good Bee published catalog.' });
  }

  // Related products based on shared concern or category
  const related = store.products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.status === PRODUCT_STATUS.PUBLISHED &&
        (p.category === product.category ||
          p.concerns.some((c) => product.concerns.includes(c)))
    )
    .slice(0, 3);

  res.json({ product, related });
});

// POST /api/v1/products - Direct Admin Creation
router.post('/', requireAuth, requireRole([ROLES.ADMIN]), (req, res) => {
  const {
    title,
    subtitle,
    category,
    concerns = [],
    price,
    mrp,
    volume,
    stock = 25,
    shortDescription,
    description,
    ingredients = [],
    ritual,
    researchNotes,
    image,
    badge
  } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ error: 'Title, category and price are required.' });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newProduct = {
    id: `gb_prod_${Date.now()}`,
    title,
    subtitle: subtitle || 'Pure Botanical Formulation',
    slug,
    sku: `GB-${category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
    category,
    concerns: Array.isArray(concerns) ? concerns : [concerns],
    price: Number(price),
    mrp: Number(mrp) || Math.round(Number(price) * 1.2),
    volume: volume || '50 ml',
    rating: null,
    reviewsCount: 0,
    stock: Number(stock),
    lowStockThreshold: 10,
    badge: badge || 'New Release',
    status: PRODUCT_STATUS.PUBLISHED,
    shortDescription: shortDescription || '',
    description: description || '',
    ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
    ritual: ritual || '',
    researchNotes: researchNotes || '',
    image: image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    gallery: [image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80']
  };

  store.products.unshift(newProduct);
  res.status(201).json({ product: newProduct });
});

// GET /api/v1/products/:id/reviews - Authentic customer reviews for a formulation
router.get('/:id/reviews', (req, res) => {
  const { id } = req.params;
  const list = (store.reviews && store.reviews[id]) || [];
  res.json({
    count: list.length,
    reviews: list
  });
});

// POST /api/v1/products/:id/reviews - Submit review (STRICTLY GATED TO VERIFIED PURCHASERS)
router.post('/:id/reviews', requireAuth, (req, res) => {
  const { id } = req.params;
  const { rating, headline, comment, authorCity } = req.body;

  const product = store.products.find((p) => p.id === id || p.slug === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ error: 'Valid star rating between 1 and 5 is required.' });
  }

  if (!headline || !comment) {
    return res.status(400).json({ error: 'Review title and detailed feedback are required.' });
  }

  // Check verified purchaser status in store.orders
  const userEmail = req.user.email?.toLowerCase();
  const userId = req.user.id;
  const hasPurchased = store.orders.some((o) => {
    const isCustomerOrder =
      (o.customerId && o.customerId === userId) ||
      (o.customerEmail && o.customerEmail.toLowerCase() === userEmail);
    if (!isCustomerOrder) return false;
    return o.items && o.items.some((it) => it.productId === product.id || it.id === product.id || it.title === product.title);
  });

  if (!hasPurchased) {
    return res.status(403).json({
      error: 'Only verified purchasers of this formulation can leave a review. Please order this formulation first.'
    });
  }

  const newReview = {
    id: `rev_${Date.now()}`,
    productId: product.id,
    userId,
    authorName: req.user.name || 'Verified Customer',
    authorCity: authorCity || 'Verified Buyer',
    rating: Number(rating),
    headline: headline.trim(),
    comment: comment.trim(),
    verifiedPurchase: true,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    createdAt: new Date().toISOString()
  };

  store.reviews = store.reviews || {};
  store.reviews[product.id] = store.reviews[product.id] || [];
  store.reviews[product.id].unshift(newReview);

  // Recalculate authentic rating & count
  const allProdReviews = store.reviews[product.id];
  const avg = allProdReviews.reduce((sum, r) => sum + r.rating, 0) / allProdReviews.length;
  product.rating = Math.round(avg * 10) / 10;
  product.reviewsCount = allProdReviews.length;

  res.status(201).json({
    review: newReview,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    message: 'Authentic review verified and published!'
  });
});

export default router;
