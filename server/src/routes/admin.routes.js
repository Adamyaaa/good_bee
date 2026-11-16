import { Router } from 'express';
import { store } from '../db/store.js';
import { query, isConnected } from '../db/pg.js';
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
      ingredients: typeof submission.ingredients === 'string' ? submission.ingredients.split(',').map((s) => s.trim()) : submission.ingredients,
      ritual: 'Apply gently to clean skin daily.',
      researchNotes: submission.batchDoc
        ? `${submission.batchDoc} verified by Good Bee Quality Review on ${new Date().toLocaleDateString()}.`
        : `Batch authenticated by Good Bee Quality Review on ${new Date().toLocaleDateString()}.`,
      manufacturingProcess: submission.manufacturingProcess || 'Artisanal low-temperature botanical processing.',
      image: submission.image,
      gallery: submission.gallery && submission.gallery.length > 0 ? submission.gallery : [submission.image]
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
  } else if (decision === 'REVISION') {
    submission.status = 'REVISIONS_REQUESTED';
    submission.adminNotes = reason || 'Please provide higher-resolution product images and certified batch lab reports.';
    submission.reviewedAt = new Date().toISOString();

    return res.json({
      message: 'Revision requested from producer with feedback notes.',
      submission
    });
  } else {
    return res.status(400).json({ error: 'Invalid decision. Must be APPROVE, REJECT, or REVISION.' });
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

// GET /api/v1/admin/wholesalers - List 10 to 15 wholesalers with individual commission margins
router.get('/wholesalers', (req, res) => {
  const wholesalers = store.users
    .filter((u) => u.role === ROLES.DEALER)
    .map((w) => ({
      id: w.id,
      name: w.name,
      companyName: w.companyName || w.name,
      email: w.email,
      phone: w.phone,
      dealerCode: w.dealerCode || `DLR-${w.id.slice(-4).toUpperCase()}`,
      gstNumber: w.gstNumber || '27AABCU0000R1ZX',
      tier: w.tier || 'Gold Tier Partner',
      commissionMarginPct: w.commissionMarginPct !== undefined ? Number(w.commissionMarginPct) : store.config.rules.dealerCommissionPct,
      city: w.city || 'Mumbai',
      state: w.state || 'Maharashtra',
      totalOrders: w.totalOrders || 0,
      totalSpend: w.totalSpend || 0,
      status: w.status || 'ACTIVE',
      createdAt: w.createdAt
    }));

  res.json({
    wholesalers,
    count: wholesalers.length,
    defaultMarginPct: store.config.rules.dealerCommissionPct
  });
});

// PUT /api/v1/admin/wholesalers/:id/commission - Update individual wholesaler margin %
router.put('/wholesalers/:id/commission', (req, res) => {
  const { id } = req.params;
  const { marginPct } = req.body;

  if (marginPct === undefined || isNaN(marginPct)) {
    return res.status(400).json({ error: 'Valid numeric margin percentage is required.' });
  }

  const clampedMargin = Math.min(Math.max(Number(marginPct), 5), 45); // Safety clamp 5% - 45%

  const dealer = store.users.find((u) => u.id === id && u.role === ROLES.DEALER);
  if (!dealer) {
    return res.status(404).json({ error: 'Wholesaler not found.' });
  }

  dealer.commissionMarginPct = clampedMargin;

  res.json({
    message: `Updated commission margin for ${dealer.companyName || dealer.name} to ${clampedMargin}%`,
    wholesaler: dealer
  });
});

// POST /api/v1/admin/wholesalers - Onboard new wholesaler
router.post('/wholesalers', (req, res) => {
  const {
    name,
    companyName,
    email,
    phone,
    dealerCode,
    gstNumber,
    tier = 'Gold Tier Partner',
    commissionMarginPct = 20,
    city = 'Mumbai',
    state = 'Maharashtra'
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Wholesaler name and email are required.' });
  }

  const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'A partner with this email already exists.' });
  }

  const newDealer = {
    id: `usr_dealer_${Date.now()}`,
    name,
    companyName: companyName || name,
    email,
    password: 'dealer',
    role: ROLES.DEALER,
    dealerCode: dealerCode || `DLR-${city.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
    gstNumber: gstNumber || `27AABC${Math.floor(1000 + Math.random() * 9000)}R1ZM`,
    tier,
    commissionMarginPct: Number(commissionMarginPct) || 20,
    city,
    state,
    phone: phone || '+919876543200',
    totalOrders: 0,
    totalSpend: 0,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  store.users.push(newDealer);

  res.status(201).json({
    message: `Wholesaler ${newDealer.companyName} registered with ${newDealer.commissionMarginPct}% margin.`,
    wholesaler: newDealer
  });
});

// PUT /api/v1/admin/wholesalers/:id - Update wholesaler details
router.put('/wholesalers/:id', (req, res) => {
  const { id } = req.params;
  const dealer = store.users.find((u) => u.id === id && u.role === ROLES.DEALER);
  if (!dealer) {
    return res.status(404).json({ error: 'Wholesaler not found.' });
  }

  const updatable = [
    'name',
    'companyName',
    'email',
    'phone',
    'dealerCode',
    'gstNumber',
    'tier',
    'commissionMarginPct',
    'city',
    'state',
    'status'
  ];

  updatable.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'commissionMarginPct') {
        dealer[field] = Math.min(Math.max(Number(req.body[field]), 5), 45);
      } else {
        dealer[field] = req.body[field];
      }
    }
  });

  res.json({ message: 'Wholesaler profile updated successfully.', wholesaler: dealer });
});

// GET /api/v1/admin/users - List all users across all roles with cloud sync
router.get('/users', async (req, res) => {
  if (isConnected()) {
    try {
      const dbRes = await query('SELECT id, name, email, role, phone, company_name, tier, loyalty_points, status, created_at FROM users ORDER BY created_at DESC');
      const mapped = dbRes.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role,
        phone: r.phone,
        companyName: r.company_name,
        tier: r.tier,
        loyaltyPoints: r.loyalty_points,
        status: r.status,
        createdAt: r.created_at
      }));
      return res.json({ users: mapped, count: mapped.length });
    } catch (err) {
      console.warn('[Admin GET Users DB Error]', err.message);
    }
  }

  // Fallback to store.users
  const userList = store.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    companyName: u.companyName,
    tier: u.tier,
    loyaltyPoints: u.loyaltyPoints,
    status: u.status || 'ACTIVE',
    createdAt: u.createdAt
  }));
  res.json({ users: userList, count: userList.length });
});

// PUT /api/v1/admin/users/:id/role - Admin-only endpoint to elevate or reassign roles
// Valid target roles: CUSTOMER (Good Being Club), PRODUCER (Vendor/Labs), DEALER (Wholesaler)
router.put('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role, companyName, tier, commissionMarginPct } = req.body;

  const validRoles = [ROLES.CUSTOMER, ROLES.PRODUCER, ROLES.DEALER];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Allowed roles are: ${validRoles.join(', ')}` });
  }

  // 1. Update in Cloud PostgreSQL if connected
  if (isConnected()) {
    try {
      const dbRes = await query(
        `UPDATE users
         SET role = $1,
             company_name = COALESCE($2, company_name),
             tier = COALESCE($3, tier),
             commission_margin_pct = COALESCE($4, commission_margin_pct),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING id, name, email, role, phone, company_name, tier, loyalty_points, status`,
        [role, companyName || null, tier || null, commissionMarginPct || null, id]
      );

      if (dbRes.rows.length > 0) {
        const row = dbRes.rows[0];
        // Also update local store
        const storeUser = store.users.find(u => u.id === id);
        if (storeUser) {
          storeUser.role = role;
          if (companyName) storeUser.companyName = companyName;
          if (tier) storeUser.tier = tier;
        }

        return res.json({
          message: `User role elevated to ${role} successfully in Cloud PostgreSQL!`,
          user: {
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role,
            phone: row.phone,
            companyName: row.company_name,
            tier: row.tier,
            loyaltyPoints: row.loyalty_points
          }
        });
      }
    } catch (err) {
      console.warn('[Admin Role Update DB Error]', err.message);
    }
  }

  // 2. Fallback update in store.users
  const user = store.users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  user.role = role;
  if (companyName) user.companyName = companyName;
  if (tier) user.tier = tier;
  if (commissionMarginPct) user.commissionMarginPct = Number(commissionMarginPct);

  res.json({
    message: `User role elevated to ${role} successfully!`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      companyName: user.companyName,
      tier: user.tier,
      loyaltyPoints: user.loyaltyPoints
    }
  });
});

export default router;
