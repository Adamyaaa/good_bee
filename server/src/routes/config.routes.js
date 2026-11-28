import { Router } from 'express';
import { getPlatformConfig, savePlatformConfig, getSiteContent } from '../db/repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';
import { WhatsAppService } from '../services/whatsappService.js';

const router = Router();

// GET /api/v1/config/public - Public settings + storefront CMS
router.get('/public', async (req, res, next) => {
  try {
    const [config, siteContent] = await Promise.all([getPlatformConfig(), getSiteContent()]);
    const phone = siteContent.whatsappNumber || config.whatsapp.phoneNumber || '+91-9963075000';
    const greeting = siteContent.whatsappGreeting || config.whatsapp.welcomeMessage;

    res.json({
      whatsapp: {
        phoneNumber: phone,
        conciergeUrl: WhatsAppService.createConciergeUrl('', phone, greeting),
        enabled: config.whatsapp.enableConcierge !== false
      },
      payment: {
        currency: config.payment.currency || 'INR',
        allowDynamicQr: config.payment.allowDynamicQr !== false,
        upiVpa: siteContent.upiVpa || config.payment.upiVpa,
        payeeName: siteContent.payeeName || config.payment.payeeName
      },
      site: siteContent
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/config/admin - Admin view of all settings
router.get('/admin', requireAuth, requireRole([ROLES.ADMIN]), async (req, res, next) => {
  try {
    const config = await getPlatformConfig();
    res.json({ config });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/config/admin - Admin update payment and WhatsApp settings
router.put('/admin', requireAuth, requireRole([ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { payment, whatsapp, rules } = req.body;
    const config = await savePlatformConfig({ payment, whatsapp, rules });
    res.json({
      message: 'Configuration updated successfully.',
      config
    });
  } catch (err) {
    next(err);
  }
});

export default router;
