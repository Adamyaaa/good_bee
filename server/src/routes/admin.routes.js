import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS, ORDER_STATUS } from '../config/constants.js';

const router = Router();

// Gated strictly to ADMIN
router.use(requireAuth, requireRole([ROLES.ADMIN]));

// GET /api/v1/admin/analytics - High-level metrics
router.get('/analytics', (req, res) => {
  const totalRevenue = store.orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingApprovalsCount = store.submissions.filter(
    (s) => s.status === PRODUCT_STATUS.PENDING_REVIEW
  ).length;

  const lowStockProducts = store.products.filter(
    (p) => p.stock <= (p.lowStockThreshold || store.config.rules.lowStockSafetyThreshold)
  );

  res.json({
    revenue: totalRevenue,
    ordersCount: store.orders.length,
    customersCount: store.users.filter((u) => u.role === ROLES.CUSTOMER).length,
    producersCount: store.users.filter((u) => u.role === ROLES.PRODUCER).length,
    dealersCount: store.users.filter((u) => u.role === ROLES.DEALER).length,
    promotersCount: store.users.filter((u) => u.role === ROLES.PROMOTER).length,
    publishedProductsCount: store.products.filter((p) => p.status === PRODUCT_STATUS.PUBLISHED).length,
    pendingApprovalsCount,
    lowStockCount: lowStockProducts.length,
    recentOrders: store.orders.slice(0, 5),
    lowStockList: lowStockProducts
  });
});

// GET /api/v1/admin/submissions - Full submission review queue
router.get('/submissions', (req, res) => {
  res.json({ submissions: store.submissions });
});

// POST /api/v1/admin/submissions/:id/decide - Approve or Reject Producer submission
router.post('/submissions/:id/decide', (req, res) => {
  const { id } = req.params;
  const { decision, reason = '' } = req.body; // 'APPROVE' or 'REJECT'

  const submission = store.submissions.find((s) => s.id === id);
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found in review queue.' });
  }

  if (decision === 'APPROVE') {
    submission.status = PRODUCT_STATUS.APPROVED;
    submission.adminNotes = reason || 'Formulation and batch specification verified. Approved for public catalog.';
    submission.reviewedAt = new Date().toISOString();

    // Automatically create a published catalog product
    const slug = submission.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProduct = {
      id: `gb_prod_${Date.now()}`,
      title: submission.title,
      subtitle: 'Artisanal Partner Formulation',
      slug,
      sku: `GB-${submission.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      category: submission.category,
      concerns: submission.concerns || ['Barrier Repair'],
      price: submission.price,
      mrp: submission.mrp,
      volume: submission.volume,
      rating: 5.0,
      reviewsCount: 1,
      stock: submission.stock,
      lowStockThreshold: store.config.rules.lowStockSafetyThreshold,
      badge: 'Partner Craft',
      status: PRODUCT_STATUS.PUBLISHED,
      producerId: submission.producerId,
      producerName: submission.producerName,
      shortDescription: submission.description,
      description: submission.description,
      ingredients: typeof submission.ingredients === 'string' ? [submission.ingredients] : submission.ingredients,
      ritual: 'Apply gently to clean skin daily.',
      researchNotes: `Batch authenticated by Good Bee Quality Review on ${new Date().toLocaleDateString()}.`,
      image: submission.image,
      gallery: [submission.image]
    };

    store.products.unshift(newProduct);

    return res.json({
      message: 'Product approved and immediately published to the Good Bee storefront catalog!',
      submission,
      publishedProduct: newProduct
    });
  } else if (decision === 'REJECT') {
    submission.status = PRODUCT_STATUS.REJECTED;
    submission.adminNotes = reason || 'Does not meet 100% natural purity standard or required documentation.';
    submission.reviewedAt = new Date().toISOString();

    return res.json({
      message: 'Product rejected. Producer has been notified with the feedback comment.',
      submission
    });
  } else {
    return res.status(400).json({ error: 'Invalid decision. Must be APPROVE or REJECT.' });
  }
});

// GET /api/v1/admin/inventory - Inventory matrix
router.get('/inventory', (req, res) => {
  const inventory = store.products.map((p) => ({
    id: p.id,
    sku: p.sku,
    title: p.title,
    category: p.category,
    stock: p.stock,
    price: p.price,
    threshold: p.lowStockThreshold || store.config.rules.lowStockSafetyThreshold,
    isLowStock: p.stock <= (p.lowStockThreshold || store.config.rules.lowStockSafetyThreshold),
    status: p.status
  }));

  res.json({ inventory });
});

// PUT /api/v1/admin/inventory/:id - Adjust stock
router.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { stock, threshold } = req.body;

  const product = store.products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  if (stock !== undefined) product.stock = Number(stock);
  if (threshold !== undefined) product.lowStockThreshold = Number(threshold);

  res.json({ message: 'Inventory updated successfully.', product });
});

// GET /api/v1/admin/rules - Get configurable rules
router.get('/rules', (req, res) => {
  res.json({ rules: store.config.rules });
});

// PUT /api/v1/admin/rules - Update configurable rules
router.put('/rules', (req, res) => {
  const allowed = [
    'dealerCommissionPct',
    'promoterCommissionPct',
    'loyaltyPointsPerRupee',
    'loyaltyRedeemValuePerPoint',
    'lowStockSafetyThreshold'
  ];

  allowed.forEach((k) => {
    if (req.body[k] !== undefined) {
      store.config.rules[k] = Number(req.body[k]);
    }
  });

  res.json({ message: 'Platform business rules updated successfully.', rules: store.config.rules });
});

export default router;
