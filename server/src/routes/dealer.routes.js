import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

// Gated to DEALER and ADMIN
router.use(requireAuth, requireRole([ROLES.DEALER, ROLES.ADMIN]));

// GET /api/v1/dealer/catalog - Wholesale pricing catalog with per-dealer custom margin
router.get('/catalog', (req, res) => {
  // Find current user's personalized margin if assigned, otherwise fallback to global rule
  const matchedUser = store.users.find((u) => u.id === req.user.id);
  const effectiveMargin = (matchedUser && matchedUser.commissionMarginPct !== undefined)
    ? Number(matchedUser.commissionMarginPct)
    : (req.user.commissionMarginPct !== undefined ? Number(req.user.commissionMarginPct) : store.config.rules.dealerCommissionPct);

  const discountRate = effectiveMargin / 100;

  const catalog = store.products
    .filter((p) => p.status === PRODUCT_STATUS.PUBLISHED)
    .map((p) => {
      const wholesalePrice = Math.round(p.price * (1 - discountRate));
      return {
        ...p,
        retailPrice: p.price,
        wholesalePrice,
        dealerMarginPct: effectiveMargin,
        minOrderQuantity: 5
      };
    });

  res.json({
    dealerName: matchedUser?.name || req.user.name,
    dealerCompany: matchedUser?.companyName || req.user.companyName,
    dealerTier: matchedUser?.tier || req.user.tier || 'Standard Wholesale Partner',
    discountPct: effectiveMargin,
    catalog
  });
});

// GET /api/v1/dealer/orders - Dealer purchase order history
router.get('/orders', (req, res) => {
  const dealerOrders = store.orders.filter((o) => o.dealerId === req.user.id);
  res.json({ orders: dealerOrders });
});

export default router;
