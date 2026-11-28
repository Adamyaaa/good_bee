import { Router } from 'express';
import {
  listProducts,
  findProduct,
  createProduct,
  listReviews,
  createReview,
  listCustomerOrders
} from '../db/repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

// GET /api/v1/products - Public listing with filters
router.get('/', async (req, res, next) => {
  try {
    const { category, concern, search, badge, sort } = req.query;
    const list = await listProducts({
      status: PRODUCT_STATUS.PUBLISHED,
      category,
      concern,
      badge,
      search,
      sort
    });

    res.json({
      count: list.length,
      products: list
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/products/:slug - Product detail
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await findProduct(slug);

    if (!product || (product.status && product.status !== PRODUCT_STATUS.PUBLISHED)) {
      return res.status(404).json({ error: 'Product not found in Good Bee published catalog.' });
    }

    const allPublished = await listProducts({ status: PRODUCT_STATUS.PUBLISHED });
    const related = allPublished
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category === product.category || p.concerns?.some((c) => product.concerns?.includes(c)))
      )
      .slice(0, 3);

    res.json({ product, related });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/products - Direct Admin Creation
router.post('/', requireAuth, requireRole([ROLES.ADMIN]), async (req, res, next) => {
  try {
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

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

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

    const created = await createProduct(newProduct);
    res.status(201).json({ product: created });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/products/:id/reviews - Authentic customer reviews for a formulation
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const product = await findProduct(req.params.id);
    const targetId = product ? product.id : req.params.id;
    const reviews = await listReviews(targetId);
    res.json({
      count: reviews.length,
      reviews
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/products/:id/reviews - Submit review (STRICTLY GATED TO VERIFIED PURCHASERS)
router.post('/:id/reviews', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, headline, comment, authorCity } = req.body;

    const product = await findProduct(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ error: 'Valid star rating between 1 and 5 is required.' });
    }

    if (!headline || !comment) {
      return res.status(400).json({ error: 'Review title and detailed feedback are required.' });
    }

    const userOrders = await listCustomerOrders({ userId: req.user.id, email: req.user.email });
    const hasPurchased = userOrders.some(
      (o) =>
        o.items &&
        o.items.some(
          (it) =>
            it.productId === product.id ||
            it.id === product.id ||
            it.product?.id === product.id ||
            it.title === product.title ||
            it.product?.title === product.title
        )
    );

    if (!hasPurchased) {
      return res.status(403).json({
        error: 'Only verified purchasers of this formulation can leave a review. Please order this formulation first.'
      });
    }

    const newReview = {
      id: `rev_${Date.now()}`,
      productId: product.id,
      userId: req.user.id,
      authorName: req.user.name || 'Verified Customer',
      authorCity: authorCity || req.user.city || 'Verified Buyer',
      rating: Number(rating),
      headline: headline.trim(),
      comment: comment.trim(),
      verifiedPurchase: true,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    const result = await createReview(newReview);
    res.status(201).json({
      review: result.review,
      rating: result.rating,
      reviewsCount: result.reviewsCount,
      message: 'Authentic review verified and published!'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
