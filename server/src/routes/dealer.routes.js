import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

// Gated to DEALER and ADMIN
router.use(requireAuth, requireRole([ROLES.DEALER, ROLES.ADMIN]));

// GET /api/v1/dealer/catalog - Wholesale pricing catalog
router.get('/catalog', (req, res) => {
  const discountRate = store.config.rules.dealerCommissionPct / 100;

  const catalog = store.products
    .filter((p) => p.status === PRODUCT_STATUS.PUBLISHED)
    .map((p) => {
      const wholesalePrice = Math.round(p.price * (1 - discountRate));
      return {
        ...p,
        retailPrice: p.price,
        wholesalePrice,
        dealerMarginPct: store.config.rules.dealerCommissionPct,
        minOrderQuantity: 5
      };
    });

  res.json({
    dealerTier: req.user.tier || 'Standard Wholesale Partner',
    discountPct: store.config.rules.dealerCommissionPct,
    catalog
  });
});

// GET /api/v1/dealer/orders - Dealer purchase order history
router.get('/orders', (req, res) => {
  const dealerOrders = store.orders.filter((o) => o.dealerId === req.user.id);
  res.json({ orders: dealerOrders });
});

export default router;
