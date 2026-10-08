import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';
import { WhatsAppService } from '../services/whatsappService.js';

const router = Router();

// GET /api/v1/config/public - Public settings (WhatsApp phone, concierge enabled, currency)
router.get('/public', (req, res) => {
  res.json({
    whatsapp: {
      phoneNumber: store.config.whatsapp.phoneNumber,
      conciergeUrl: WhatsAppService.createConciergeUrl(),
      enabled: store.config.whatsapp.enableConcierge
    },
    payment: {
      currency: store.config.payment.currency,
      allowDynamicQr: store.config.payment.allowDynamicQr,
      payeeName: store.config.payment.payeeName
    }
  });
});

// GET /api/v1/config/admin - Admin view of all settings
router.get('/admin', requireAuth, requireRole([ROLES.ADMIN]), (req, res) => {
  res.json({ config: store.config });
});

// PUT /api/v1/config/admin - Admin update payment and WhatsApp settings
router.put('/admin', requireAuth, requireRole([ROLES.ADMIN]), (req, res) => {
  const { payment, whatsapp } = req.body;

  if (payment) {
    store.config.payment = {
      ...store.config.payment,
      ...payment
    };
  }

  if (whatsapp) {
    store.config.whatsapp = {
      ...store.config.whatsapp,
      ...whatsapp
    };
  }

  res.json({
    message: 'Configuration updated successfully.',
    config: store.config
  });
});

export default router;
