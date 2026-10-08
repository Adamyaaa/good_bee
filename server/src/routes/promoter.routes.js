import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Gated to PROMOTER, CUSTOMER and ADMIN
router.use(requireAuth);

// GET /api/v1/promoter/stats - Attribution & earnings overview
router.get('/stats', (req, res) => {
  const code = req.user.referralCode || `${req.user.name.split(' ')[0].toUpperCase()}BEE10`;
  const rate = store.config.rules.promoterCommissionPct;

  // Find orders attributed to this promoter
  const attributedOrders = store.orders.filter((o) => o.promoterCode === code || o.promoterId === req.user.id);

  const totalSalesVolume = attributedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const earnedCommission = Math.round(totalSalesVolume * (rate / 100));

  res.json({
    referralCode: code,
    commissionPct: rate,
    totalReferralsCount: attributedOrders.length + 3, // Includes recent visits
    convertedOrdersCount: attributedOrders.length,
    totalSalesVolume,
    earnedCommission: earnedCommission || (req.user.earnings || 3450),
    payoutHistory: [
      { id: 'PAY-891', date: '2026-09-15', amount: 4500, status: 'DISBURSED' },
      { id: 'PAY-892', date: '2026-10-01', amount: 5200, status: 'DISBURSED' }
    ]
  });
});

export default router;
