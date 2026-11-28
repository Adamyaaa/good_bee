import { Router } from 'express';
import {
  listProducts,
  findUserById,
  getPlatformConfig,
  listDealerOrders,
  createDealerOrder
} from '../db/repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

// Gated to DEALER and ADMIN
router.use(requireAuth, requireRole([ROLES.DEALER, ROLES.ADMIN]));

// GET /api/v1/dealer/catalog
router.get('/catalog', async (req, res, next) => {
  try {
    const [matchedUser, products, config] = await Promise.all([
      findUserById(req.user.id),
      listProducts({ status: PRODUCT_STATUS.PUBLISHED }),
      getPlatformConfig()
    ]);

    const effectiveMargin =
      matchedUser && matchedUser.commissionMarginPct !== undefined
        ? Number(matchedUser.commissionMarginPct)
        : req.user.commissionMarginPct !== undefined
        ? Number(req.user.commissionMarginPct)
        : config.rules?.dealerCommissionPct || 18;

    const discountRate = effectiveMargin / 100;
    const catalog = products.map((p) => ({
      ...p,
      retailPrice: p.price,
      wholesalePrice: Math.round(p.price * (1 - discountRate)),
      dealerMarginPct: effectiveMargin,
      minOrderQuantity: 5
    }));

    res.json({
      dealerName: matchedUser?.name || req.user.name,
      dealerCompany: matchedUser?.companyName || req.user.companyName,
      dealerTier: matchedUser?.tier || req.user.tier || 'Standard Wholesale Partner',
      discountPct: effectiveMargin,
      catalog
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/dealer/orders
router.get('/orders', async (req, res, next) => {
  try {
    const dealerCode =
      req.user.role === ROLES.ADMIN && req.query.dealerCode
        ? req.query.dealerCode
        : req.user.dealerCode || req.query.dealerCode || 'DLR-MUM-01';
    const orders = await listDealerOrders(dealerCode);
    res.json({ count: orders.length, orders });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/dealer/orders
router.post('/orders', async (req, res, next) => {
  try {
    const body = req.body || {};
    const dealerCode = req.user.dealerCode || body.dealerCode || 'DLR-MUM-01';
    const newOrder = {
      id: body.id || `GB-PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      dealerId: req.user.id,
      dealerCode,
      dealerName: req.user.companyName || req.user.name,
      date: body.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalUnits: Number(body.totalUnits || 0),
      subtotal: Number(body.subtotal || 0),
      gst: Number(body.gst || 0),
      totalAmount: Number(body.totalAmount || 0),
      status: body.status || 'PROCESSING',
      courier: body.courier || 'Pending Regional Dispatch',
      trackingNo: body.trackingNo || 'Pending Assignment',
      paymentTerms: body.paymentTerms || 'Net-30 Invoice Dispatched',
      items: Array.isArray(body.items) ? body.items : []
    };

    const created = await createDealerOrder(newOrder);
    res.status(201).json({ message: 'Purchase order created successfully.', order: created });
  } catch (err) {
    next(err);
  }
});

export default router;
