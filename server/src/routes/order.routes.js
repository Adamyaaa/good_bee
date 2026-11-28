import { Router } from 'express';
import {
  listProducts,
  createOrder,
  findOrder,
  listCustomerOrders,
  updateOrder,
  deductProductStock,
  getSiteContent
} from '../db/repo.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { DynamicQrService } from '../services/qrService.js';
import { WhatsAppService } from '../services/whatsappService.js';
import { ORDER_STATUS } from '../config/constants.js';

const router = Router();

// POST /api/v1/orders - Create an order
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      items = [],
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      promoterCode,
      paymentMethod = 'DYNAMIC_UPI_QR',
      discount: requestedDiscount
    } = req.body;

    if (!items.length) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    const allProducts = await listProducts();
    const siteContent = await getSiteContent().catch(() => ({}));
    const freeThreshold = Number(siteContent.freeDeliveryThreshold || 999);

    let subtotal = 0;
    const verifiedItems = items.map((item) => {
      const targetId = item.productId || item.id || item.product?.id || item.slug;
      const product = allProducts.find((p) => p.id === targetId || p.slug === targetId);
      const unitPrice = product ? product.price : Number(item.price || item.product?.price || 0);
      const quantity = Math.max(1, Number(item.quantity || 1));
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;
      return {
        productId: product ? product.id : targetId,
        title: product ? product.title : (item.title || item.product?.title || 'Good Bee Formulation'),
        volume: product ? product.volume : (item.volume || item.product?.volume || ''),
        price: unitPrice,
        quantity,
        subtotal: lineTotal,
        image: product ? product.image : (item.image || item.product?.image || '')
      };
    });

    // Apply coupon / promoter discount if provided
    let discount = 0;
    if (promoterCode && Array.isArray(siteContent.coupons)) {
      const coupon = siteContent.coupons.find(
        (c) => c.active && c.code.toUpperCase() === String(promoterCode).trim().toUpperCase()
      );
      if (coupon && subtotal >= (coupon.minOrder || 0)) {
        discount = Math.round(subtotal * (Number(coupon.discountPct || 0) / 100));
      }
    }
    if (!discount && promoterCode) {
      discount = Math.round(subtotal * 0.1);
    } else if (!discount && typeof requestedDiscount === 'number' && requestedDiscount > 0) {
      discount = Math.min(subtotal, Math.round(requestedDiscount));
    }

    const shipping = subtotal >= freeThreshold ? 0 : 99;
    const total = Math.max(0, subtotal - discount + shipping);
    const orderId = `GB-ORD-${Date.now().toString().slice(-6)}`;

    const newOrder = {
      id: orderId,
      customerId: req.user ? req.user.id : null,
      customerName: customerName || (req.user ? req.user.name : 'Valued Patron'),
      customerEmail: (customerEmail || (req.user ? req.user.email : '')).trim().toLowerCase(),
      customerPhone: customerPhone || (req.user ? req.user.phone : ''),
      shippingAddress: shippingAddress || {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      items: verifiedItems,
      subtotal,
      discount,
      shipping,
      total,
      promoterCode: promoterCode || null,
      paymentMethod,
      paymentStatus:
        paymentMethod === 'CASH_ON_DELIVERY' || paymentMethod === 'COD'
          ? 'PENDING_ON_DELIVERY'
          : 'PENDING_PAYMENT',
      upiRef: null,
      orderStatus:
        paymentMethod === 'CASH_ON_DELIVERY' || paymentMethod === 'COD'
          ? ORDER_STATUS.PROCESSING
          : ORDER_STATUS.PENDING_PAYMENT,
      createdAt: new Date().toISOString()
    };

    const created = await createOrder(newOrder);

    let qrData = null;
    if (paymentMethod === 'DYNAMIC_UPI_QR') {
      qrData = await DynamicQrService.generateUpiPaymentQr({
        orderId: created.id,
        amount: created.total,
        customNote: `Good Bee Order ${created.id}`
      });
    }

    const whatsappSupportUrl = WhatsAppService.createOrderSupportUrl(
      created.id,
      created.total,
      siteContent.whatsappNumber
    );

    res.status(201).json({
      order: created,
      dynamicQr: qrData,
      whatsappSupportUrl
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/my - Authenticated customer order history
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const orders = await listCustomerOrders({ userId: req.user.id, email: req.user.email });
    res.json({ count: orders.length, orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/track?q=... - Public order tracking by Order ID or phone
router.get('/track', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'Order ID or phone number is required.' });
    }
    const order = await findOrder(q);
    if (!order) {
      return res.status(404).json({ error: 'No matching order found for that ID or mobile number.' });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/:id - Get order details
router.get('/:id', async (req, res, next) => {
  try {
    const order = await findOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/orders/:id/dynamic-qr - Regenerate or fetch fresh Dynamic UPI QR
router.post('/:id/dynamic-qr', async (req, res, next) => {
  try {
    const order = await findOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const qrData = await DynamicQrService.generateUpiPaymentQr({
      orderId: order.id,
      amount: order.total,
      customNote: `Good Bee Order ${order.id}`
    });

    res.json({ dynamicQr: qrData });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/orders/:id/verify-qr - Confirm UPI payment & deduct inventory
router.post('/:id/verify-qr', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { upiRef = `UPI-TXN-${Date.now().toString().slice(-6)}` } = req.body || {};
    const existing = await findOrder(id);

    if (!existing) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const wasPaid = existing.paymentStatus === 'PAID' || existing.paymentStatus === 'PAYMENT_VERIFIED';

    const order = await updateOrder(existing.id, {
      paymentStatus: 'PAID',
      orderStatus: ORDER_STATUS.PROCESSING,
      upiRef,
      paidAt: new Date().toISOString()
    });

    if (!wasPaid && Array.isArray(existing.items)) {
      for (const item of existing.items) {
        await deductProductStock(item.productId || item.id, item.quantity);
      }
    }

    res.json({
      message: 'Payment confirmed successfully via Dynamic UPI QR.',
      order
    });
  } catch (err) {
    next(err);
  }
});

export default router;
