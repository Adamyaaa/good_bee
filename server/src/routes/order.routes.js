import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';
import { DynamicQrService } from '../services/qrService.js';
import { WhatsAppService } from '../services/whatsappService.js';
import { ORDER_STATUS } from '../config/constants.js';

const router = Router();

// POST /api/v1/orders - Create an order
router.post('/', async (req, res) => {
  const {
    items = [],
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    promoterCode,
    paymentMethod = 'DYNAMIC_UPI_QR'
  } = req.body;

  if (!items.length) {
    return res.status(400).json({ error: 'Order must contain at least one item.' });
  }

  // Calculate pricing & validate items
  let subtotal = 0;
  const verifiedItems = items.map((item) => {
    const product = store.products.find((p) => p.id === item.productId || p.slug === item.productId);
    const unitPrice = product ? product.price : item.price;
    const quantity = item.quantity || 1;
    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;
    return {
      productId: product ? product.id : item.productId,
      title: product ? product.title : item.title,
      price: unitPrice,
      quantity,
      subtotal: lineTotal,
      image: product ? product.image : item.image
    };
  });

  const discount = promoterCode ? Math.round(subtotal * 0.1) : 0; // 10% welcome promoter coupon
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const orderId = `GB-ORD-${Date.now().toString().slice(-6)}`;

  const newOrder = {
    id: orderId,
    customerId: req.user ? req.user.id : null,
    customerName: customerName || (req.user ? req.user.name : 'Valued Patron'),
    customerEmail: customerEmail || (req.user ? req.user.email : ''),
    customerPhone: customerPhone || (req.user ? req.user.phone : ''),
    shippingAddress: shippingAddress || {
      street: '402, High Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    items: verifiedItems,
    subtotal,
    discount,
    shipping,
    total,
    promoterCode: promoterCode || null,
    paymentMethod,
    paymentStatus: 'PENDING_PAYMENT',
    upiRef: null,
    orderStatus: ORDER_STATUS.PENDING_PAYMENT,
    createdAt: new Date().toISOString()
  };

  store.orders.unshift(newOrder);

  // Generate dynamic QR code immediately for dynamic QR checkout
  let qrData = null;
  if (paymentMethod === 'DYNAMIC_UPI_QR') {
    qrData = await DynamicQrService.generateUpiPaymentQr({
      orderId: newOrder.id,
      amount: newOrder.total,
      customNote: `Good Bee Order ${newOrder.id}`
    });
  }

  const whatsappSupportUrl = WhatsAppService.createOrderSupportUrl(newOrder.id, newOrder.total);

  res.status(201).json({
    order: newOrder,
    dynamicQr: qrData,
    whatsappSupportUrl
  });
});

// GET /api/v1/orders/:id - Get order details
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const order = store.orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  res.json({ order });
});

// POST /api/v1/orders/:id/dynamic-qr - Regenerate or fetch fresh Dynamic UPI QR
router.post('/:id/dynamic-qr', async (req, res) => {
  const { id } = req.params;
  const order = store.orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  const qrData = await DynamicQrService.generateUpiPaymentQr({
    orderId: order.id,
    amount: order.total,
    customNote: `Good Bee Order ${order.id}`
  });

  res.json({ dynamicQr: qrData });
});

// POST /api/v1/orders/:id/verify-qr - Customer confirms payment with UPI Ref or screen verification
router.post('/:id/verify-qr', (req, res) => {
  const { id } = req.params;
  const { upiRef = `UPI-TXN-${Date.now().toString().slice(-6)}` } = req.body;
  const order = store.orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  order.paymentStatus = 'PAID';
  order.orderStatus = ORDER_STATUS.PAYMENT_VERIFIED;
  order.upiRef = upiRef;
  order.paidAt = new Date().toISOString();

  // Deduct inventory
  order.items.forEach((item) => {
    const product = store.products.find((p) => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  });

  res.json({
    message: 'Payment confirmed successfully via Dynamic UPI QR.',
    order
  });
});

export default router;
