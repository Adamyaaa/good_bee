import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
  listOrders,
  updateOrder,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listSubmissions,
  findSubmission,
  updateSubmission,
  getPlatformConfig,
  savePlatformConfig,
  getSiteContent,
  saveSiteContent,
  listUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById
} from '../db/repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

// Gated strictly to ADMIN
router.use(requireAuth, requireRole([ROLES.ADMIN]));

// GET /api/v1/admin/analytics - High-level metrics
router.get('/analytics', async (req, res, next) => {
  try {
    const [orders, products, submissions, users, config] = await Promise.all([
      listOrders(),
      listProducts(),
      listSubmissions(),
      listUsers(),
      getPlatformConfig()
    ]);

    const threshold = config.rules?.lowStockSafetyThreshold || 15;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'PAID' || o.paymentStatus === 'PAYMENT_VERIFIED')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const grossOrderValue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter((o) => (o.status || o.orderStatus) === 'PROCESSING').length;
    const pendingApprovalsCount = submissions.filter((s) => s.status === PRODUCT_STATUS.PENDING_REVIEW).length;
    const lowStockProducts = products.filter((p) => (p.stock ?? 0) <= (p.lowStockThreshold || threshold));

    res.json({
      revenue: totalRevenue,
      ordersCount: orders.length,
      customersCount: users.filter((u) => u.role === ROLES.CUSTOMER).length,
      producersCount: users.filter((u) => u.role === ROLES.PRODUCER).length,
      dealersCount: users.filter((u) => u.role === ROLES.DEALER).length,
      promotersCount: users.filter((u) => u.role === ROLES.PROMOTER).length,
      publishedProductsCount: products.filter((p) => p.status === PRODUCT_STATUS.PUBLISHED).length,
      pendingApprovalsCount,
      lowStockCount: lowStockProducts.length,
      metrics: {
        totalRevenue: grossOrderValue || totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        activeProducts: products.length,
        lowStockAlerts: lowStockProducts.length,
        averageOrderValue: Math.round((grossOrderValue || totalRevenue) / Math.max(orders.length, 1))
      },
      recentOrders: orders.slice(0, 5),
      lowStockList: lowStockProducts
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/orders
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await listOrders();
    res.json({ count: orders.length, orders });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const updated = await updateOrder(id, {
      status,
      paymentStatus,
      ...(status === 'DELIVERED' ? { deliveredAt: new Date().toISOString() } : {})
    });
    if (!updated) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({
      message: `Order #${id} status updated to ${updated.status}.`,
      order: updated
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/products
router.get('/products', async (req, res, next) => {
  try {
    const products = await listProducts();
    res.json({ count: products.length, products });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/products
router.post('/products', async (req, res, next) => {
  try {
    const body = req.body;
    const baseSlug = (body.title || 'formulation')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newProduct = {
      id: `gb_prod_${Date.now()}`,
      title: body.title || 'Untitled Formulation',
      subtitle: body.subtitle || '100% Natural Formulation',
      slug,
      sku: body.sku || `GB-${Date.now().toString().slice(-5)}`,
      category: body.category || 'Cold Processed Soaps',
      concerns: Array.isArray(body.concerns)
        ? body.concerns
        : typeof body.concerns === 'string'
        ? body.concerns.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Barrier Repair'],
      price: Number(body.price) || 290,
      mrp: Number(body.mrp) || Math.round((Number(body.price) || 290) * 1.25),
      volume: body.volume || '100 g',
      rating: null,
      reviewsCount: 0,
      stock: Number(body.stock ?? 30),
      lowStockThreshold: Number(body.lowStockThreshold || 10),
      badge: body.badge || '100% Natural',
      status: PRODUCT_STATUS.PUBLISHED,
      shortDescription: body.shortDescription || body.description || '100% Natural botanical formulation.',
      description: body.description || body.shortDescription || '100% Natural botanical formulation.',
      ingredients: Array.isArray(body.ingredients)
        ? body.ingredients
        : typeof body.ingredients === 'string'
        ? body.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Pure Botanical Extracts'],
      ritual: body.ritual || 'Massage gently into skin during your morning or evening routine.',
      researchNotes: body.researchNotes || 'Active-stabilization verified pure botanical extract.',
      image: body.image || '/images_ref/Clear-skin-300x300.webp',
      gallery: Array.isArray(body.gallery) && body.gallery.length > 0 ? body.gallery : [body.image || '/images_ref/Clear-skin-300x300.webp']
    };

    const created = await createProduct(newProduct);
    res.status(201).json({ message: 'Product added successfully to live catalog.', product: created });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/products/:id
router.put('/products/:id', async (req, res, next) => {
  try {
    const body = req.body;
    const patch = { ...body };
    if (body.price !== undefined) patch.price = Number(body.price);
    if (body.mrp !== undefined) patch.mrp = Number(body.mrp);
    if (body.stock !== undefined) patch.stock = Number(body.stock);
    if (body.lowStockThreshold !== undefined) patch.lowStockThreshold = Number(body.lowStockThreshold);
    if (typeof body.ingredients === 'string') {
      patch.ingredients = body.ingredients.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (typeof body.concerns === 'string') {
      patch.concerns = body.concerns.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updated = await updateProduct(req.params.id, patch);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Product updated successfully.', product: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/admin/products/:id
router.delete('/products/:id', async (req, res, next) => {
  try {
    const deleted = await deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Product removed from catalog.' });
  } catch (err) {
    next(err);
  }
});

// GET & PUT /api/v1/admin/site-content
router.get('/site-content', async (req, res, next) => {
  try {
    const content = await getSiteContent();
    res.json({ content });
  } catch (err) {
    next(err);
  }
});

router.put('/site-content', async (req, res, next) => {
  try {
    const content = await saveSiteContent(req.body || {});
    res.json({ message: 'Site content and live copy updated successfully.', content });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/submissions - Full submission review queue
router.get('/submissions', async (req, res, next) => {
  try {
    const submissions = await listSubmissions();
    res.json({ count: submissions.length, submissions });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/submissions/:id/decide - Approve, Reject, or Request Revision
router.post('/submissions/:id/decide', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, reason = '' } = req.body;

    const submission = await findSubmission(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found in review queue.' });
    }

    const config = await getPlatformConfig();

    if (decision === 'APPROVE') {
      const updatedSub = await updateSubmission(id, {
        status: PRODUCT_STATUS.APPROVED,
        adminNotes: reason || 'Formulation and batch specification verified. Approved for public catalog.',
        reviewedAt: new Date().toISOString()
      });

      const baseSlug = (submission.title || 'formulation')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      const newProduct = {
        id: `gb_prod_${Date.now()}`,
        title: submission.title,
        subtitle: 'Artisanal Partner Formulation',
        slug,
        sku: `GB-${submission.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        category: submission.category,
        concerns: submission.concerns || ['Barrier Repair'],
        price: submission.price,
        mrp: submission.mrp || Math.round(submission.price * 1.25),
        volume: submission.volume || '50 ml',
        rating: null,
        reviewsCount: 0,
        stock: submission.stock ?? 50,
        lowStockThreshold: config.rules?.lowStockSafetyThreshold || 10,
        badge: 'Partner Craft',
        status: PRODUCT_STATUS.PUBLISHED,
        producerId: submission.producerId,
        producerName: submission.producerName,
        shortDescription: submission.description,
        description: submission.description,
        ingredients:
          typeof submission.ingredients === 'string'
            ? submission.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
            : submission.ingredients || [],
        ritual: 'Apply gently to clean skin daily.',
        researchNotes: submission.batchDoc
          ? `${submission.batchDoc} verified by Good Bee Quality Review.`
          : 'Batch authenticated by Good Bee Quality Review.',
        manufacturingProcess: submission.manufacturingProcess || 'Artisanal low-temperature botanical processing.',
        image: submission.image || '/images_ref/Clear-skin-300x300.webp',
        gallery: submission.gallery && submission.gallery.length > 0 ? submission.gallery : [submission.image || '/images_ref/Clear-skin-300x300.webp'],
        fieldPhotos: submission.fieldPhotos || [],
        fieldVideos: submission.fieldVideos || [],
        processingUnitPhotos: submission.processingUnitPhotos || [],
        accreditations: submission.accreditations || [],
        farmerStory: submission.farmerStory || null
      };

      const publishedProduct = await createProduct(newProduct);

      return res.json({
        message: 'Product approved and immediately published to the Good Bee storefront catalog!',
        submission: updatedSub,
        publishedProduct
      });
    } else if (decision === 'REJECT') {
      const updatedSub = await updateSubmission(id, {
        status: PRODUCT_STATUS.REJECTED,
        adminNotes: reason || 'Does not meet 100% natural purity standard or required documentation.',
        reviewedAt: new Date().toISOString()
      });

      return res.json({
        message: 'Product rejected. Producer has been notified with the feedback comment.',
        submission: updatedSub
      });
    } else if (decision === 'REVISION') {
      const updatedSub = await updateSubmission(id, {
        status: 'REVISIONS_REQUESTED',
        adminNotes: reason || 'Please provide higher-resolution product images and certified batch lab reports.',
        reviewedAt: new Date().toISOString()
      });

      return res.json({
        message: 'Revision requested from producer with feedback notes.',
        submission: updatedSub
      });
    } else {
      return res.status(400).json({ error: 'Invalid decision. Must be APPROVE, REJECT, or REVISION.' });
    }
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/inventory - Inventory matrix
router.get('/inventory', async (req, res, next) => {
  try {
    const [products, config] = await Promise.all([listProducts(), getPlatformConfig()]);
    const defaultThreshold = config.rules?.lowStockSafetyThreshold || 10;
    const inventory = products.map((p) => {
      const threshold = p.lowStockThreshold || defaultThreshold;
      return {
        id: p.id,
        sku: p.sku,
        title: p.title,
        category: p.category,
        image: p.image,
        stock: p.stock ?? 0,
        price: p.price,
        mrp: p.mrp,
        threshold,
        lowStockThreshold: threshold,
        isLowStock: (p.stock ?? 0) <= threshold,
        status: p.status
      };
    });

    res.json({ count: inventory.length, inventory });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/inventory/:id - Adjust stock/price
router.put('/inventory/:id', async (req, res, next) => {
  try {
    const { stock, threshold, lowStockThreshold, price, mrp } = req.body;
    const patch = {};
    if (stock !== undefined) patch.stock = Number(stock);
    if (threshold !== undefined) patch.lowStockThreshold = Number(threshold);
    if (lowStockThreshold !== undefined) patch.lowStockThreshold = Number(lowStockThreshold);
    if (price !== undefined) patch.price = Number(price);
    if (mrp !== undefined) patch.mrp = Number(mrp);

    const product = await updateProduct(req.params.id, patch);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Inventory updated successfully.', product });
  } catch (err) {
    next(err);
  }
});

// GET & PUT /api/v1/admin/rules
router.get('/rules', async (req, res, next) => {
  try {
    const config = await getPlatformConfig();
    res.json({ rules: config.rules });
  } catch (err) {
    next(err);
  }
});

router.put('/rules', async (req, res, next) => {
  try {
    const allowed = [
      'dealerCommissionPct',
      'promoterCommissionPct',
      'loyaltyPointsPerRupee',
      'loyaltyRedeemValuePerPoint',
      'lowStockSafetyThreshold'
    ];
    const rulesPatch = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) rulesPatch[k] = Number(req.body[k]);
    });
    const updated = await savePlatformConfig({ rules: rulesPatch });
    res.json({ message: 'Platform business rules updated successfully.', rules: updated.rules });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/wholesalers
router.get('/wholesalers', async (req, res, next) => {
  try {
    const [users, config] = await Promise.all([listUsers(), getPlatformConfig()]);
    const defaultPct = config.rules?.dealerCommissionPct || 18;
    const wholesalers = users
      .filter((u) => u.role === ROLES.DEALER)
      .map((w) => ({
        ...w,
        companyName: w.companyName || w.name,
        dealerCode: w.dealerCode || `DLR-${w.id.slice(-4).toUpperCase()}`,
        gstNumber: w.gstNumber || '27AABCU0000R1ZX',
        tier: w.tier || 'Gold Tier Partner',
        commissionMarginPct: w.commissionMarginPct !== undefined ? Number(w.commissionMarginPct) : defaultPct,
        city: w.city || 'Mumbai',
        state: w.state || 'Maharashtra'
      }));

    res.json({
      wholesalers,
      count: wholesalers.length,
      defaultMarginPct: defaultPct
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/wholesalers/:id/commission
router.put('/wholesalers/:id/commission', async (req, res, next) => {
  try {
    const { marginPct } = req.body;
    if (marginPct === undefined || isNaN(marginPct)) {
      return res.status(400).json({ error: 'Valid numeric margin percentage is required.' });
    }
    const clampedMargin = Math.min(Math.max(Number(marginPct), 5), 45);
    const dealer = await findUserById(req.params.id);
    if (!dealer || dealer.role !== ROLES.DEALER) {
      return res.status(404).json({ error: 'Wholesaler not found.' });
    }

    const updated = await updateUserById(req.params.id, { commissionMarginPct: clampedMargin });
    res.json({
      message: `Updated commission margin for ${updated.companyName || updated.name} to ${clampedMargin}%`,
      wholesaler: updated
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/wholesalers
router.post('/wholesalers', async (req, res, next) => {
  try {
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

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'A partner with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash('dealer', 10);
    const newDealer = {
      id: `usr_dealer_${Date.now()}`,
      name,
      companyName: companyName || name,
      email: email.trim().toLowerCase(),
      passwordHash,
      password: passwordHash,
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

    const created = await createUser(newDealer);
    res.status(201).json({
      message: `Wholesaler ${created.companyName} registered with ${created.commissionMarginPct}% margin.`,
      wholesaler: created
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/wholesalers/:id
router.put('/wholesalers/:id', async (req, res, next) => {
  try {
    const dealer = await findUserById(req.params.id);
    if (!dealer || dealer.role !== ROLES.DEALER) {
      return res.status(404).json({ error: 'Wholesaler not found.' });
    }
    const patch = {};
    const updatable = ['name', 'companyName', 'email', 'phone', 'dealerCode', 'gstNumber', 'tier', 'commissionMarginPct', 'city', 'state', 'status'];
    updatable.forEach((f) => {
      if (req.body[f] !== undefined) {
        patch[f] = f === 'commissionMarginPct' ? Math.min(Math.max(Number(req.body[f]), 5), 45) : req.body[f];
      }
    });
    const updated = await updateUserById(req.params.id, patch);
    res.json({ message: 'Wholesaler profile updated successfully.', wholesaler: updated });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const users = await listUsers();
    res.json({ users, count: users.length });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/users/:id/role
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, companyName, tier, commissionMarginPct } = req.body;

    const validRoles = [ROLES.CUSTOMER, ROLES.PRODUCER, ROLES.DEALER, ROLES.MEDIA_MANAGER, ROLES.DELIVERY_PARTNER];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Allowed roles are: ${validRoles.join(', ')}` });
    }

    const existing = await findUserById(id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const patch = { role };
    if (companyName !== undefined) patch.companyName = companyName;
    if (tier !== undefined) patch.tier = tier;
    if (commissionMarginPct !== undefined) patch.commissionMarginPct = Number(commissionMarginPct);

    const updated = await updateUserById(id, patch);
    res.json({
      message: `User role elevated to ${role} successfully!`,
      user: updated
    });
  } catch (err) {
    next(err);
  }
});

export default router;
