import { query, isConnected } from './pg.js';
import { store } from './store.js';
import { ORDER_STATUS, PRODUCT_STATUS, ROLES } from '../config/constants.js';

function parseJson(val, fallback) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val;
}

export function mapUserRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.password_hash,
    role: r.role,
    phone: r.phone || '',
    companyName: r.company_name || '',
    labCertId: r.lab_cert_id || '',
    dealerCode: r.dealer_code || '',
    gstNumber: r.gst_number || '',
    tier: r.tier || '',
    commissionMarginPct: r.commission_margin_pct !== null && r.commission_margin_pct !== undefined ? Number(r.commission_margin_pct) : undefined,
    loyaltyPoints: r.loyalty_points || 0,
    referralCode: r.referral_code || '',
    city: r.city || '',
    state: r.state || '',
    partnerCode: r.partner_code || '',
    vehicleType: r.vehicle_type || '',
    vehicleNumber: r.vehicle_number || '',
    deliveryZone: r.delivery_zone || '',
    dutyStatus: r.duty_status || 'ON_DUTY',
    totalOrders: r.total_orders || 0,
    totalSpend: r.total_spend !== null && r.total_spend !== undefined ? Number(r.total_spend) : 0,
    earnings: r.earnings !== null && r.earnings !== undefined ? Number(r.earnings) : 0,
    title: r.title || '',
    addresses: parseJson(r.addresses, []),
    status: r.status || 'ACTIVE',
    createdAt: r.created_at
  };
}

export function sanitizeUser(u) {
  if (!u) return null;
  const { password, passwordSecondary, passwordHash, password_hash, ...safe } = u;
  return safe;
}

export function mapProductRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || '',
    slug: r.slug,
    sku: r.sku,
    category: r.category,
    concerns: parseJson(r.concerns, []),
    price: Number(r.price),
    mrp: Number(r.mrp),
    volume: r.volume || '',
    rating: r.rating !== null && r.rating !== undefined ? Number(r.rating) : null,
    reviewsCount: r.reviews_count || 0,
    stock: r.stock ?? 0,
    lowStockThreshold: r.low_stock_threshold ?? 10,
    badge: r.badge || '',
    shortDescription: r.short_description || '',
    description: r.description || '',
    ingredients: parseJson(r.ingredients, []),
    ritual: r.ritual || '',
    researchNotes: r.research_notes || '',
    image: r.image,
    gallery: parseJson(r.gallery, r.image ? [r.image] : []),
    fieldPhotos: parseJson(r.field_photos, []),
    fieldVideos: parseJson(r.field_videos, []),
    processingUnitPhotos: parseJson(r.processing_unit_photos, []),
    accreditations: parseJson(r.accreditations, []),
    farmerStory: parseJson(r.farmer_story, null),
    manufacturingProcess: r.manufacturing_process || '',
    producerId: r.producer_id || null,
    producerName: r.producer_name || null,
    status: r.status || PRODUCT_STATUS.PUBLISHED,
    createdAt: r.created_at
  };
}

export function mapOrderRow(r) {
  if (!r) return null;
  const status = r.order_status || ORDER_STATUS.PROCESSING;
  return {
    id: r.id,
    customerId: r.customer_id,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    items: parseJson(r.items, []),
    subtotal: Number(r.subtotal),
    discount: Number(r.discount || 0),
    shipping: Number(r.shipping || 0),
    total: Number(r.total),
    paymentMethod: r.payment_method,
    paymentStatus: r.payment_status,
    upiRef: r.upi_ref,
    orderStatus: status,
    status,
    shippingAddress: parseJson(r.shipping_address, {}),
    promoterCode: r.promoter_code,
    promoterId: r.promoter_id,
    dealerId: r.dealer_id,
    paidAt: r.paid_at,
    deliveredAt: r.delivered_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export function mapDealerOrderRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    dealerId: r.dealer_id,
    dealerCode: r.dealer_code,
    dealerName: r.dealer_name,
    items: parseJson(r.items, []),
    totalUnits: r.total_units || 0,
    subtotal: Number(r.subtotal),
    gst: Number(r.gst || 0),
    totalAmount: Number(r.total_amount),
    status: r.status,
    courier: r.courier,
    trackingNo: r.tracking_no,
    paymentTerms: r.payment_terms,
    date: r.date_label || (r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''),
    createdAt: r.created_at
  };
}

export function mapSubmissionRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    producerId: r.producer_id,
    producerName: r.producer_name,
    labCertId: r.lab_cert_id || '',
    title: r.title || r.product_name || '',
    category: r.category,
    concerns: parseJson(r.concerns, []),
    price: Number(r.price || 0),
    mrp: Number(r.mrp || 0),
    volume: r.volume || '',
    stock: r.stock ?? 50,
    ingredients: r.ingredients || '',
    description: r.description || '',
    image: r.image || '',
    gallery: parseJson(r.gallery, r.image ? [r.image] : []),
    fieldPhotos: parseJson(r.field_photos, []),
    fieldVideos: parseJson(r.field_videos, []),
    processingUnitPhotos: parseJson(r.processing_unit_photos, []),
    processingUnitVideos: parseJson(r.processing_unit_videos, []),
    accreditations: parseJson(r.accreditations, []),
    farmerStory: parseJson(r.farmer_story, ''),
    lotNumber: r.lot_number || r.batch_lot || '',
    origin: r.origin || r.botanical_origin || '',
    harvestSeason: r.harvest_season || '',
    activePurity: r.active_purity || '',
    coaStatus: r.coa_status || '',
    batchDoc: r.batch_doc || '',
    manufacturingProcess: r.manufacturing_process || '',
    status: r.status || PRODUCT_STATUS.PENDING_REVIEW,
    adminNotes: r.admin_notes || '',
    submittedAt: r.submitted_at || r.created_at,
    reviewedAt: r.reviewed_at
  };
}

export function mapDeliveryRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    orderId: r.order_id,
    deliveryPartnerId: r.delivery_partner_id,
    deliveryPartnerName: r.delivery_partner_name || '',
    providerType: r.provider_type || 'IN_HOUSE',
    orderPreparationStatus: r.order_preparation_status || 'PREPARING',
    deliveryStatus: r.delivery_status || 'ASSIGNED',
    customerName: r.customer_name || '',
    customerPhone: r.customer_phone || '',
    shippingAddress: parseJson(r.shipping_address, {}),
    pickupLocation: parseJson(r.pickup_location, {}),
    items: parseJson(r.items, []),
    totalAmount: Number(r.total_amount || 0),
    deliveryNotes: r.delivery_notes || '',
    assignedAt: r.assigned_at,
    readyForPickupAt: r.ready_for_pickup_at,
    pickedUpAt: r.picked_up_at,
    outForDeliveryAt: r.out_for_delivery_at,
    deliveredAt: r.delivered_at,
    failedAt: r.failed_at,
    failureReason: r.failure_reason,
    failureRemarks: r.failure_remarks,
    flaggedForAdminReview: Boolean(r.flagged_for_admin_review),
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

// --- Users ---
export async function findUserById(id) {
  if (isConnected()) {
    const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    if (res.rows.length > 0) return mapUserRow(res.rows[0]);
    return null;
  }
  return store.users.find((u) => u.id === id) || null;
}

export async function findUserByEmail(email) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (isConnected()) {
    const res = await query('SELECT * FROM users WHERE LOWER(TRIM(email)) = $1 LIMIT 1', [cleanEmail]);
    if (res.rows.length > 0) return mapUserRow(res.rows[0]);
    return null;
  }
  return store.users.find((u) => (u.email || '').trim().toLowerCase() === cleanEmail) || null;
}

export async function createUser(u) {
  if (isConnected()) {
    await query(
      `INSERT INTO users (
        id, name, email, password_hash, role, phone, company_name, lab_cert_id,
        dealer_code, gst_number, tier, commission_margin_pct, loyalty_points,
        referral_code, city, state, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [
        u.id,
        u.name,
        u.email.toLowerCase(),
        u.passwordHash,
        u.role || ROLES.CUSTOMER,
        u.phone || null,
        u.companyName || null,
        u.labCertId || null,
        u.dealerCode || null,
        u.gstNumber || null,
        u.tier || null,
        u.commissionMarginPct ?? 0,
        u.loyaltyPoints ?? 0,
        u.referralCode || null,
        u.city || null,
        u.state || null,
        u.status || 'ACTIVE'
      ]
    );
    return findUserById(u.id);
  }
  store.users.push(u);
  return u;
}

export async function listUsers() {
  if (isConnected()) {
    const res = await query('SELECT * FROM users ORDER BY created_at DESC');
    return res.rows.map((r) => sanitizeUser(mapUserRow(r)));
  }
  return store.users.map(sanitizeUser);
}

export async function updateUserById(id, fields) {
  if (isConnected()) {
    const current = await findUserById(id);
    if (!current) return null;
    const merged = { ...current, ...fields };
    await query(
      `UPDATE users SET
        name = $1, email = $2, role = $3, phone = $4, company_name = $5,
        dealer_code = $6, gst_number = $7, tier = $8, commission_margin_pct = $9,
        city = $10, state = $11, vehicle_type = $12, vehicle_number = $13,
        delivery_zone = $14, duty_status = $15, status = $16, updated_at = CURRENT_TIMESTAMP
      WHERE id = $17`,
      [
        merged.name,
        merged.email,
        merged.role,
        merged.phone || null,
        merged.companyName || null,
        merged.dealerCode || null,
        merged.gstNumber || null,
        merged.tier || null,
        merged.commissionMarginPct ?? 0,
        merged.city || null,
        merged.state || null,
        merged.vehicleType || null,
        merged.vehicleNumber || null,
        merged.deliveryZone || null,
        merged.dutyStatus || 'ON_DUTY',
        merged.status || 'ACTIVE',
        id
      ]
    );
    return sanitizeUser(await findUserById(id));
  }
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  store.users[idx] = { ...store.users[idx], ...fields };
  return sanitizeUser(store.users[idx]);
}

// --- Products & Reviews ---
export async function listProducts(filters = {}) {
  let list;
  if (isConnected()) {
    const res = await query('SELECT * FROM products ORDER BY created_at DESC');
    list = res.rows.map(mapProductRow);
  } else {
    list = [...store.products];
  }

  const { status, category, concern, badge, search, sort } = filters;
  if (status) {
    list = list.filter((p) => (p.status || PRODUCT_STATUS.PUBLISHED) === status);
  }
  if (category && category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (concern && concern !== 'All') {
    const q = concern.toLowerCase();
    list = list.filter(
      (p) =>
        p.concerns?.some((c) => c.toLowerCase() === q || c.toLowerCase().includes(q) || q.includes(c.toLowerCase())) ||
        p.category?.toLowerCase() === q
    );
  }
  if (badge) {
    list = list.filter((p) => p.badge && p.badge.toLowerCase() === badge.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.ingredients?.some((ing) => ing.toLowerCase().includes(q))
    );
  }
  if (sort === 'price_asc' || sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc' || sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return list;
}

export async function findProduct(idOrSlug) {
  if (isConnected()) {
    const res = await query('SELECT * FROM products WHERE id = $1 OR slug = $1 LIMIT 1', [idOrSlug]);
    return res.rows.length > 0 ? mapProductRow(res.rows[0]) : null;
  }
  return store.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

export async function createProduct(p) {
  if (isConnected()) {
    await query(
      `INSERT INTO products (
        id, title, subtitle, slug, sku, category, concerns, price, mrp, volume,
        rating, reviews_count, stock, low_stock_threshold, badge, short_description,
        description, ingredients, ritual, research_notes, image, gallery,
        field_photos, field_videos, processing_unit_photos, accreditations,
        farmer_story, manufacturing_process, producer_id, producer_name, status
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,
        $17,$18,$19,$20,$21,$22,
        $23,$24,$25,$26,
        $27,$28,$29,$30,$31
      )`,
      [
        p.id,
        p.title,
        p.subtitle || '',
        p.slug,
        p.sku,
        p.category,
        JSON.stringify(p.concerns || []),
        p.price,
        p.mrp,
        p.volume || '50 ml',
        p.rating ?? null,
        p.reviewsCount || 0,
        p.stock ?? 30,
        p.lowStockThreshold ?? 10,
        p.badge || '100% Natural',
        p.shortDescription || '',
        p.description || '',
        JSON.stringify(p.ingredients || []),
        p.ritual || '',
        p.researchNotes || '',
        p.image,
        JSON.stringify(p.gallery || [p.image]),
        JSON.stringify(p.fieldPhotos || []),
        JSON.stringify(p.fieldVideos || []),
        JSON.stringify(p.processingUnitPhotos || []),
        JSON.stringify(p.accreditations || []),
        p.farmerStory ? JSON.stringify(p.farmerStory) : null,
        p.manufacturingProcess || '',
        p.producerId || null,
        p.producerName || null,
        p.status || PRODUCT_STATUS.PUBLISHED
      ]
    );
    return findProduct(p.id);
  }
  store.products.unshift(p);
  return p;
}

export async function updateProduct(idOrSlug, fields) {
  if (isConnected()) {
    const current = await findProduct(idOrSlug);
    if (!current) return null;
    const m = { ...current, ...fields };
    await query(
      `UPDATE products SET
        title = $1, subtitle = $2, category = $3, concerns = $4, price = $5, mrp = $6,
        volume = $7, stock = $8, low_stock_threshold = $9, badge = $10,
        short_description = $11, description = $12, ingredients = $13, ritual = $14,
        research_notes = $15, image = $16, gallery = $17, field_photos = $18,
        field_videos = $19, processing_unit_photos = $20, status = $21,
        rating = $22, reviews_count = $23, updated_at = CURRENT_TIMESTAMP
      WHERE id = $24`,
      [
        m.title,
        m.subtitle || '',
        m.category,
        JSON.stringify(m.concerns || []),
        Number(m.price),
        Number(m.mrp),
        m.volume || '',
        Number(m.stock ?? 0),
        Number(m.lowStockThreshold ?? 10),
        m.badge || '',
        m.shortDescription || '',
        m.description || '',
        JSON.stringify(m.ingredients || []),
        m.ritual || '',
        m.researchNotes || '',
        m.image,
        JSON.stringify(m.gallery || [m.image]),
        JSON.stringify(m.fieldPhotos || []),
        JSON.stringify(m.fieldVideos || []),
        JSON.stringify(m.processingUnitPhotos || []),
        m.status || PRODUCT_STATUS.PUBLISHED,
        m.rating ?? null,
        m.reviewsCount || 0,
        current.id
      ]
    );
    return findProduct(current.id);
  }
  const idx = store.products.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (idx === -1) return null;
  store.products[idx] = { ...store.products[idx], ...fields };
  return store.products[idx];
}

export async function deleteProduct(id) {
  if (isConnected()) {
    const res = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    return res.rowCount > 0;
  }
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  return store.products.length < before;
}

export async function listReviews(productId) {
  if (isConnected()) {
    const res = await query(
      'SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC',
      [productId]
    );
    return res.rows.map((r) => ({
      id: r.id,
      productId: r.product_id,
      userId: r.user_id,
      authorName: r.author_name,
      authorCity: r.author_city,
      rating: r.rating,
      headline: r.headline,
      comment: r.comment,
      verifiedPurchase: r.verified_purchase,
      date: r.created_at
        ? new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '',
      createdAt: r.created_at
    }));
  }
  return (store.reviews && store.reviews[productId]) || [];
}

export async function createReview(reviewObj) {
  if (isConnected()) {
    await query(
      `INSERT INTO reviews (id, product_id, user_id, author_name, author_city, rating, headline, comment, verified_purchase, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'APPROVED')`,
      [
        reviewObj.id,
        reviewObj.productId,
        reviewObj.userId || null,
        reviewObj.authorName,
        reviewObj.authorCity || 'Verified Buyer',
        reviewObj.rating,
        reviewObj.headline || '',
        reviewObj.comment,
        Boolean(reviewObj.verifiedPurchase)
      ]
    );
    const statsRes = await query(
      'SELECT COUNT(*)::int AS cnt, ROUND(AVG(rating)::numeric, 1) AS avg_rating FROM reviews WHERE product_id = $1',
      [reviewObj.productId]
    );
    const cnt = statsRes.rows[0]?.cnt || 1;
    const avg = Number(statsRes.rows[0]?.avg_rating || reviewObj.rating);
    await query('UPDATE products SET rating = $1, reviews_count = $2 WHERE id = $3', [avg, cnt, reviewObj.productId]);
    return { review: reviewObj, rating: avg, reviewsCount: cnt };
  }
  store.reviews = store.reviews || {};
  store.reviews[reviewObj.productId] = store.reviews[reviewObj.productId] || [];
  store.reviews[reviewObj.productId].unshift(reviewObj);
  const all = store.reviews[reviewObj.productId];
  const avg = Math.round((all.reduce((s, r) => s + r.rating, 0) / all.length) * 10) / 10;
  const prod = store.products.find((p) => p.id === reviewObj.productId);
  if (prod) {
    prod.rating = avg;
    prod.reviewsCount = all.length;
  }
  return { review: reviewObj, rating: avg, reviewsCount: all.length };
}

// --- Orders ---
export async function listOrders() {
  if (isConnected()) {
    const res = await query('SELECT * FROM orders ORDER BY created_at DESC');
    return res.rows.map(mapOrderRow);
  }
  return [...store.orders];
}

export async function listCustomerOrders({ userId, email }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (isConnected()) {
    const res = await query(
      `SELECT * FROM orders
       WHERE ($1::text IS NOT NULL AND customer_id = $1)
          OR ($2::text <> '' AND LOWER(TRIM(customer_email)) = $2)
       ORDER BY created_at DESC`,
      [userId || null, cleanEmail]
    );
    return res.rows.map(mapOrderRow);
  }
  return store.orders.filter(
    (o) =>
      (userId && o.customerId === userId) ||
      (cleanEmail && (o.customerEmail || '').trim().toLowerCase() === cleanEmail)
  );
}

export async function findOrder(idOrPhone) {
  const q = String(idOrPhone || '').trim();
  if (!q) return null;
  if (isConnected()) {
    const digits = q.replace(/[^0-9]/g, '');
    const res = await query(
      `SELECT * FROM orders
       WHERE LOWER(id) = LOWER($1)
          OR ($2::text <> '' AND regexp_replace(COALESCE(customer_phone,''), '[^0-9]', '', 'g') LIKE '%' || $2)
       ORDER BY created_at DESC LIMIT 1`,
      [q, digits.length >= 6 ? digits : '']
    );
    return res.rows.length > 0 ? mapOrderRow(res.rows[0]) : null;
  }
  const digits = q.replace(/[^0-9]/g, '');
  return (
    store.orders.find(
      (o) =>
        o.id?.toLowerCase() === q.toLowerCase() ||
        (digits.length >= 6 && (o.customerPhone || '').replace(/[^0-9]/g, '').includes(digits))
    ) || null
  );
}

export async function createOrder(o) {
  if (isConnected()) {
    await query(
      `INSERT INTO orders (
        id, customer_id, customer_name, customer_email, customer_phone,
        items, subtotal, discount, shipping, total, payment_method,
        payment_status, upi_ref, order_status, shipping_address,
        promoter_code, promoter_id, dealer_id, created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [
        o.id,
        o.customerId || null,
        o.customerName,
        o.customerEmail || '',
        o.customerPhone || '',
        JSON.stringify(o.items || []),
        o.subtotal,
        o.discount || 0,
        o.shipping || 0,
        o.total,
        o.paymentMethod || 'DYNAMIC_UPI_QR',
        o.paymentStatus || 'PENDING_PAYMENT',
        o.upiRef || null,
        o.orderStatus || ORDER_STATUS.PENDING_PAYMENT,
        JSON.stringify(o.shippingAddress || {}),
        o.promoterCode || null,
        o.promoterId || null,
        o.dealerId || null,
        o.createdAt || new Date().toISOString()
      ]
    );
    return findOrder(o.id);
  }
  store.orders.unshift(o);
  return o;
}

export async function updateOrder(id, fields) {
  if (isConnected()) {
    const current = await findOrder(id);
    if (!current) return null;
    const status = fields.status || fields.orderStatus || current.orderStatus;
    const paymentStatus = fields.paymentStatus || current.paymentStatus;
    const upiRef = fields.upiRef !== undefined ? fields.upiRef : current.upiRef;
    const paidAt = fields.paidAt !== undefined ? fields.paidAt : current.paidAt;
    const deliveredAt = fields.deliveredAt !== undefined ? fields.deliveredAt : current.deliveredAt;

    await query(
      `UPDATE orders SET
        order_status = $1, payment_status = $2, upi_ref = $3,
        paid_at = $4, delivered_at = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6`,
      [status, paymentStatus, upiRef, paidAt || null, deliveredAt || null, current.id]
    );
    return findOrder(current.id);
  }
  const order = store.orders.find((o) => o.id === id);
  if (!order) return null;
  if (fields.status || fields.orderStatus) {
    order.orderStatus = fields.status || fields.orderStatus;
    order.status = order.orderStatus;
  }
  if (fields.paymentStatus) order.paymentStatus = fields.paymentStatus;
  if (fields.upiRef !== undefined) order.upiRef = fields.upiRef;
  if (fields.paidAt !== undefined) order.paidAt = fields.paidAt;
  if (fields.deliveredAt !== undefined) order.deliveredAt = fields.deliveredAt;
  return order;
}

export async function deductProductStock(productId, quantity) {
  if (!productId) return;
  if (isConnected()) {
    await query(
      'UPDATE products SET stock = GREATEST(0, stock - $1), updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [Math.max(1, Number(quantity) || 1), productId]
    );
    return;
  }
  const prod = store.products.find((p) => p.id === productId);
  if (prod) prod.stock = Math.max(0, prod.stock - (Number(quantity) || 1));
}

// --- Dealer B2B Orders ---
export async function listDealerOrders(dealerCode) {
  if (isConnected()) {
    const res = dealerCode
      ? await query('SELECT * FROM dealer_orders WHERE dealer_code = $1 ORDER BY created_at DESC', [dealerCode])
      : await query('SELECT * FROM dealer_orders ORDER BY created_at DESC');
    return res.rows.map(mapDealerOrderRow);
  }
  const all = store.dealerOrders || [];
  return dealerCode ? all.filter((o) => o.dealerCode === dealerCode) : all;
}

export async function createDealerOrder(d) {
  if (isConnected()) {
    await query(
      `INSERT INTO dealer_orders (
        id, dealer_id, dealer_code, dealer_name, items, total_units,
        subtotal, gst, total_amount, status, courier, tracking_no,
        payment_terms, date_label
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        d.id,
        d.dealerId || null,
        d.dealerCode,
        d.dealerName || null,
        JSON.stringify(d.items || []),
        d.totalUnits || 0,
        d.subtotal || 0,
        d.gst || 0,
        d.totalAmount || 0,
        d.status || 'PROCESSING',
        d.courier || 'Pending Regional Dispatch',
        d.trackingNo || 'Pending Assignment',
        d.paymentTerms || 'Net-30 Invoice Dispatched',
        d.date || 'Today'
      ]
    );
    const res = await query('SELECT * FROM dealer_orders WHERE id = $1', [d.id]);
    return mapDealerOrderRow(res.rows[0]);
  }
  store.dealerOrders = store.dealerOrders || [];
  store.dealerOrders.unshift(d);
  return d;
}

// --- Supplier Submissions ---
export async function listSubmissions(producerId = null) {
  if (isConnected()) {
    const res = producerId
      ? await query('SELECT * FROM supplier_submissions WHERE producer_id = $1 ORDER BY submitted_at DESC', [producerId])
      : await query('SELECT * FROM supplier_submissions ORDER BY submitted_at DESC');
    return res.rows.map(mapSubmissionRow);
  }
  return producerId
    ? store.submissions.filter((s) => s.producerId === producerId)
    : [...store.submissions];
}

export async function findSubmission(id) {
  if (isConnected()) {
    const res = await query('SELECT * FROM supplier_submissions WHERE id = $1 LIMIT 1', [id]);
    return res.rows.length > 0 ? mapSubmissionRow(res.rows[0]) : null;
  }
  return store.submissions.find((s) => s.id === id) || null;
}

export async function createSubmission(s) {
  if (isConnected()) {
    await query(
      `INSERT INTO supplier_submissions (
        id, producer_id, producer_name, lab_cert_id, title, product_name,
        category, concerns, price, mrp, volume, stock, ingredients,
        description, image, gallery, field_photos, field_videos,
        processing_unit_photos, processing_unit_videos, accreditations,
        farmer_story, lot_number, origin, harvest_season, active_purity,
        coa_status, batch_doc, manufacturing_process, status, admin_notes, submitted_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32
      )`,
      [
        s.id,
        s.producerId || null,
        s.producerName,
        s.labCertId || null,
        s.title,
        s.title,
        s.category,
        JSON.stringify(s.concerns || []),
        Number(s.price || 0),
        Number(s.mrp || 0),
        s.volume || '50 ml',
        Number(s.stock ?? 30),
        typeof s.ingredients === 'string' ? s.ingredients : JSON.stringify(s.ingredients || []),
        s.description || '',
        s.image || '',
        JSON.stringify(s.gallery || (s.image ? [s.image] : [])),
        JSON.stringify(s.fieldPhotos || []),
        JSON.stringify(s.fieldVideos || []),
        JSON.stringify(s.processingUnitPhotos || []),
        JSON.stringify(s.processingUnitVideos || []),
        JSON.stringify(s.accreditations || []),
        s.farmerStory ? JSON.stringify(s.farmerStory) : null,
        s.lotNumber || null,
        s.origin || null,
        s.harvestSeason || null,
        s.activePurity || null,
        s.coaStatus || null,
        s.batchDoc || null,
        s.manufacturingProcess || null,
        s.status || PRODUCT_STATUS.PENDING_REVIEW,
        s.adminNotes || '',
        s.submittedAt || new Date().toISOString()
      ]
    );
    return findSubmission(s.id);
  }
  store.submissions.unshift(s);
  return s;
}

export async function updateSubmission(id, fields) {
  if (isConnected()) {
    const current = await findSubmission(id);
    if (!current) return null;
    const m = { ...current, ...fields };
    await query(
      `UPDATE supplier_submissions SET
        title = $1, product_name = $1, category = $2, concerns = $3, price = $4,
        mrp = $5, volume = $6, stock = $7, ingredients = $8, description = $9,
        image = $10, field_photos = $11, field_videos = $12,
        processing_unit_photos = $13, processing_unit_videos = $14,
        accreditations = $15, farmer_story = $16, status = $17,
        admin_notes = $18, submitted_at = $19, reviewed_at = $20, updated_at = CURRENT_TIMESTAMP
      WHERE id = $21`,
      [
        m.title,
        m.category,
        JSON.stringify(m.concerns || []),
        Number(m.price || 0),
        Number(m.mrp || 0),
        m.volume || '',
        Number(m.stock ?? 30),
        typeof m.ingredients === 'string' ? m.ingredients : JSON.stringify(m.ingredients || []),
        m.description || '',
        m.image || '',
        JSON.stringify(m.fieldPhotos || []),
        JSON.stringify(m.fieldVideos || []),
        JSON.stringify(m.processingUnitPhotos || []),
        JSON.stringify(m.processingUnitVideos || []),
        JSON.stringify(m.accreditations || []),
        m.farmerStory ? JSON.stringify(m.farmerStory) : null,
        m.status,
        m.adminNotes || '',
        m.submittedAt || new Date().toISOString(),
        m.reviewedAt || null,
        id
      ]
    );
    return findSubmission(id);
  }
  const idx = store.submissions.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  store.submissions[idx] = { ...store.submissions[idx], ...fields };
  return store.submissions[idx];
}

// --- Site Content & Platform Config ---
export async function getSiteContent() {
  if (isConnected()) {
    const res = await query("SELECT config_data FROM site_content WHERE id = 'primary_storefront' LIMIT 1");
    if (res.rows.length > 0) {
      return { ...store.siteContent, ...parseJson(res.rows[0].config_data, {}) };
    }
  }
  return { ...store.siteContent };
}

export async function saveSiteContent(patch) {
  const current = await getSiteContent();
  const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
  if (isConnected()) {
    await query(
      `INSERT INTO site_content (id, config_data, updated_at)
       VALUES ('primary_storefront', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET config_data = EXCLUDED.config_data, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(updated)]
    );
  } else {
    store.siteContent = updated;
  }
  return updated;
}

export async function getPlatformConfig() {
  if (isConnected()) {
    const res = await query("SELECT config_data FROM site_content WHERE id = 'platform_config' LIMIT 1");
    if (res.rows.length > 0) {
      const parsed = parseJson(res.rows[0].config_data, {});
      return {
        payment: { ...store.config.payment, ...(parsed.payment || {}) },
        whatsapp: { ...store.config.whatsapp, ...(parsed.whatsapp || {}) },
        rules: { ...store.config.rules, ...(parsed.rules || {}) }
      };
    }
  }
  return {
    payment: { ...store.config.payment },
    whatsapp: { ...store.config.whatsapp },
    rules: { ...store.config.rules }
  };
}

export async function savePlatformConfig(patch) {
  const current = await getPlatformConfig();
  const updated = {
    payment: { ...current.payment, ...(patch.payment || {}) },
    whatsapp: { ...current.whatsapp, ...(patch.whatsapp || {}) },
    rules: { ...current.rules, ...(patch.rules || {}) }
  };
  if (isConnected()) {
    await query(
      `INSERT INTO site_content (id, config_data, updated_at)
       VALUES ('platform_config', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET config_data = EXCLUDED.config_data, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(updated)]
    );
  } else {
    store.config = updated;
  }
  return updated;
}

// --- Delivery Partner Logistics ---
export async function listDeliveryAssignments({ partnerId, isAdmin, status, search } = {}) {
  let list;
  if (isConnected()) {
    const res = isAdmin
      ? await query('SELECT * FROM delivery_assignments ORDER BY created_at DESC')
      : await query('SELECT * FROM delivery_assignments WHERE delivery_partner_id = $1 ORDER BY created_at DESC', [partnerId]);
    list = res.rows.map(mapDeliveryRow);
  } else {
    list = store.deliveryAssignments.filter((a) => isAdmin || a.deliveryPartnerId === partnerId);
  }

  if (status && status !== 'ALL') {
    if (status === 'PREPARING') {
      list = list.filter((a) => a.deliveryStatus === 'WAITING_FOR_PICKUP');
    } else {
      list = list.filter((a) => a.deliveryStatus === status);
    }
  }

  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.orderId?.toLowerCase().includes(q) ||
        a.customerName?.toLowerCase().includes(q) ||
        a.shippingAddress?.pincode?.includes(q)
    );
  }

  return list;
}

export async function findDeliveryAssignment(idOrOrderId) {
  if (isConnected()) {
    const res = await query(
      'SELECT * FROM delivery_assignments WHERE id = $1 OR order_id = $1 LIMIT 1',
      [idOrOrderId]
    );
    return res.rows.length > 0 ? mapDeliveryRow(res.rows[0]) : null;
  }
  return store.deliveryAssignments.find((a) => a.id === idOrOrderId || a.orderId === idOrOrderId) || null;
}

export async function updateDeliveryAssignment(id, fields, historyEntry) {
  if (isConnected()) {
    const current = await findDeliveryAssignment(id);
    if (!current) return null;
    const m = { ...current, ...fields };
    await query(
      `UPDATE delivery_assignments SET
        delivery_status = $1, picked_up_at = $2, out_for_delivery_at = $3,
        delivered_at = $4, delivery_notes = $5, failed_at = $6,
        failure_reason = $7, failure_remarks = $8, flagged_for_admin_review = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10`,
      [
        m.deliveryStatus,
        m.pickedUpAt || null,
        m.outForDeliveryAt || null,
        m.deliveredAt || null,
        m.deliveryNotes || null,
        m.failedAt || null,
        m.failureReason || null,
        m.failureRemarks || null,
        Boolean(m.flaggedForAdminReview),
        current.id
      ]
    );
    if (historyEntry) {
      await query(
        `INSERT INTO delivery_status_history (
          id, assignment_id, previous_status, new_status, changed_by_user_id, changed_by_name, timestamp, remarks
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          historyEntry.id,
          current.id,
          historyEntry.previousStatus || null,
          historyEntry.newStatus,
          historyEntry.changedByUserId,
          historyEntry.changedByName || null,
          historyEntry.timestamp || new Date().toISOString(),
          historyEntry.remarks || null
        ]
      );
    }
    return findDeliveryAssignment(current.id);
  }
  const idx = store.deliveryAssignments.findIndex((a) => a.id === id || a.orderId === id);
  if (idx === -1) return null;
  store.deliveryAssignments[idx] = { ...store.deliveryAssignments[idx], ...fields };
  if (historyEntry) store.deliveryStatusHistory.unshift(historyEntry);
  return store.deliveryAssignments[idx];
}

export async function listDeliveryHistoryEntries(assignmentId = null, limit = 10) {
  if (isConnected()) {
    const res = assignmentId
      ? await query('SELECT * FROM delivery_status_history WHERE assignment_id = $1 ORDER BY timestamp DESC', [assignmentId])
      : await query('SELECT * FROM delivery_status_history ORDER BY timestamp DESC LIMIT $1', [limit]);
    return res.rows.map((r) => ({
      id: r.id,
      assignmentId: r.assignment_id,
      previousStatus: r.previous_status,
      newStatus: r.new_status,
      changedByUserId: r.changed_by_user_id,
      changedByName: r.changed_by_name,
      timestamp: r.timestamp,
      remarks: r.remarks
    }));
  }
  if (assignmentId) {
    return store.deliveryStatusHistory.filter((h) => h.assignmentId === assignmentId);
  }
  return store.deliveryStatusHistory.slice(0, limit);
}

export async function listDeliveryNotifications({ partnerId, isAdmin }) {
  if (isConnected()) {
    const res = isAdmin
      ? await query('SELECT * FROM delivery_notifications ORDER BY created_at DESC')
      : await query('SELECT * FROM delivery_notifications WHERE delivery_partner_id = $1 ORDER BY created_at DESC', [partnerId]);
    return res.rows.map((r) => ({
      id: r.id,
      deliveryPartnerId: r.delivery_partner_id,
      assignmentId: r.assignment_id,
      orderId: r.order_id,
      title: r.title,
      message: r.message,
      type: r.type,
      isRead: Boolean(r.is_read),
      createdAt: r.created_at
    }));
  }
  return store.deliveryNotifications.filter((n) => isAdmin || n.deliveryPartnerId === partnerId);
}

export async function markDeliveryNotificationRead(id, { partnerId, isAdmin }) {
  if (isConnected()) {
    const res = await query('SELECT * FROM delivery_notifications WHERE id = $1 LIMIT 1', [id]);
    if (res.rows.length === 0) return { status: 404 };
    const row = res.rows[0];
    if (row.delivery_partner_id !== partnerId && !isAdmin) return { status: 403 };
    await query('UPDATE delivery_notifications SET is_read = TRUE WHERE id = $1', [id]);
    return {
      status: 200,
      notification: {
        id: row.id,
        deliveryPartnerId: row.delivery_partner_id,
        assignmentId: row.assignment_id,
        orderId: row.order_id,
        title: row.title,
        message: row.message,
        type: row.type,
        isRead: true,
        createdAt: row.created_at
      }
    };
  }
  const notif = store.deliveryNotifications.find((n) => n.id === id);
  if (!notif) return { status: 404 };
  if (notif.deliveryPartnerId !== partnerId && !isAdmin) return { status: 403 };
  notif.isRead = true;
  return { status: 200, notification: notif };
}

export async function markAllDeliveryNotificationsRead({ partnerId, isAdmin }) {
  if (isConnected()) {
    if (isAdmin) {
      await query('UPDATE delivery_notifications SET is_read = TRUE');
    } else {
      await query('UPDATE delivery_notifications SET is_read = TRUE WHERE delivery_partner_id = $1', [partnerId]);
    }
    return;
  }
  store.deliveryNotifications.forEach((n) => {
    if (isAdmin || n.deliveryPartnerId === partnerId) n.isRead = true;
  });
}
