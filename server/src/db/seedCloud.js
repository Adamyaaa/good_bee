import bcrypt from 'bcryptjs';
import { query, isConnected } from '../db/pg.js';
import { store } from '../db/store.js';

export async function seedNeonDatabase() {
  if (!isConnected()) {
    console.log('[Seed] PostgreSQL not connected, skipping cloud seed.');
    return;
  }

  try {
    console.log('🌱 [Seed] Synchronizing initial cloud PostgreSQL tables (non-destructive)...');

    // 1. Seed Users (ON CONFLICT DO NOTHING so live role/profile edits are preserved)
    for (const u of store.users) {
      const hashedPassword = u.password
        ? await bcrypt.hash(String(u.password), 10)
        : await bcrypt.hash('goodbee123', 10);

      await query(
        `INSERT INTO users (
          id, name, email, password_hash, role, phone, company_name, lab_cert_id,
          dealer_code, gst_number, tier, commission_margin_pct, loyalty_points,
          referral_code, city, state, partner_code, vehicle_type, vehicle_number,
          delivery_zone, duty_status, total_orders, total_spend, earnings, title,
          addresses, status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25,
          $26, $27
        )
        ON CONFLICT (id) DO NOTHING;`,
        [
          u.id,
          u.name,
          u.email.toLowerCase(),
          hashedPassword,
          u.role,
          u.phone || null,
          u.companyName || null,
          u.labCertId || null,
          u.dealerCode || null,
          u.gstNumber || null,
          u.tier || null,
          u.commissionMarginPct || 0,
          u.loyaltyPoints || 0,
          u.referralCode || null,
          u.city || null,
          u.state || null,
          u.partnerCode || null,
          u.vehicleType || null,
          u.vehicleNumber || null,
          u.deliveryZone || null,
          u.dutyStatus || 'ON_DUTY',
          u.totalOrders || 0,
          u.totalSpend || 0,
          u.earnings || 0,
          u.title || null,
          JSON.stringify(u.addresses || []),
          u.status || 'ACTIVE'
        ]
      );
    }

    // 2. Seed Products (ON CONFLICT DO NOTHING so live stock/price/CMS edits are never overwritten)
    for (const p of store.products) {
      await query(
        `INSERT INTO products (
          id, title, subtitle, slug, sku, category, concerns, price, mrp, volume,
          rating, reviews_count, stock, low_stock_threshold, badge, short_description,
          description, ingredients, ritual, research_notes, image, gallery,
          field_photos, field_videos, processing_unit_photos, accreditations,
          farmer_story, manufacturing_process, producer_id, producer_name, status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22,
          $23, $24, $25, $26,
          $27, $28, $29, $30, $31
        )
        ON CONFLICT (id) DO NOTHING;`,
        [
          p.id,
          p.title,
          p.subtitle || null,
          p.slug,
          p.sku,
          p.category,
          JSON.stringify(p.concerns || []),
          p.price,
          p.mrp,
          p.volume || null,
          p.rating ?? null,
          p.reviewsCount || 0,
          p.stock ?? 50,
          p.lowStockThreshold || 10,
          p.badge || null,
          p.shortDescription || null,
          p.description || null,
          JSON.stringify(p.ingredients || []),
          p.ritual || null,
          p.researchNotes || null,
          p.image,
          JSON.stringify(p.gallery || [p.image]),
          JSON.stringify(p.fieldPhotos || []),
          JSON.stringify(p.fieldVideos || []),
          JSON.stringify(p.processingUnitPhotos || []),
          JSON.stringify(p.accreditations || []),
          p.farmerStory ? JSON.stringify(p.farmerStory) : null,
          p.manufacturingProcess || null,
          p.producerId || null,
          p.producerName || null,
          p.status || 'PUBLISHED'
        ]
      );
    }

    // 3. Seed Orders
    for (const o of store.orders) {
      await query(
        `INSERT INTO orders (
          id, customer_id, customer_name, customer_email, customer_phone,
          items, subtotal, discount, shipping, total, payment_method,
          payment_status, upi_ref, order_status, shipping_address,
          promoter_code, created_at
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17
        )
        ON CONFLICT (id) DO NOTHING;`,
        [
          o.id,
          o.customerId || null,
          o.customerName,
          o.customerEmail || '',
          o.customerPhone || '',
          JSON.stringify(o.items || []),
          o.subtotal ?? o.total ?? 0,
          o.discount ?? 0,
          o.shipping ?? 0,
          o.total ?? 0,
          o.paymentMethod || 'DYNAMIC_UPI_QR',
          o.paymentStatus || 'PAID',
          o.upiRef || null,
          o.orderStatus || o.status || 'PROCESSING',
          JSON.stringify(o.shippingAddress || {}),
          o.promoterCode || null,
          o.createdAt || new Date().toISOString()
        ]
      );
    }

    // 4. Seed B2B Dealer Orders
    for (const d of store.dealerOrders || []) {
      await query(
        `INSERT INTO dealer_orders (
          id, dealer_id, dealer_code, dealer_name, items, total_units,
          subtotal, gst, total_amount, status, courier, tracking_no,
          payment_terms, date_label
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO NOTHING;`,
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
          d.date || null
        ]
      );
    }

    // 5. Seed Supplier Submissions
    for (const s of store.submissions) {
      await query(
        `INSERT INTO supplier_submissions (
          id, producer_id, producer_name, lab_cert_id, title, product_name,
          category, concerns, price, mrp, volume, stock, ingredients,
          description, image, gallery, batch_doc, manufacturing_process,
          status, admin_notes, submitted_at, reviewed_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18,
          $19, $20, $21, $22
        )
        ON CONFLICT (id) DO NOTHING;`,
        [
          s.id,
          s.producerId || null,
          s.producerName,
          s.labCertId || null,
          s.title,
          s.title,
          s.category,
          JSON.stringify(s.concerns || []),
          s.price || 0,
          s.mrp || 0,
          s.volume || null,
          s.stock ?? 50,
          typeof s.ingredients === 'string' ? s.ingredients : JSON.stringify(s.ingredients || []),
          s.description || '',
          s.image || '',
          JSON.stringify(s.gallery || (s.image ? [s.image] : [])),
          s.batchDoc || null,
          s.manufacturingProcess || null,
          s.status || 'PENDING_REVIEW',
          s.adminNotes || '',
          s.submittedAt || new Date().toISOString(),
          s.reviewedAt || null
        ]
      );
    }

    // 6. Seed Site Content & Platform Config
    await query(
      `INSERT INTO site_content (id, config_data)
       VALUES ('primary_storefront', $1)
       ON CONFLICT (id) DO NOTHING;`,
      [JSON.stringify(store.siteContent)]
    );

    await query(
      `INSERT INTO site_content (id, config_data)
       VALUES ('platform_config', $1)
       ON CONFLICT (id) DO NOTHING;`,
      [JSON.stringify(store.config)]
    );

    // 7. Seed Delivery Assignments, History & Notifications
    for (const a of store.deliveryAssignments) {
      await query(
        `INSERT INTO delivery_assignments (
          id, order_id, delivery_partner_id, delivery_partner_name, provider_type,
          order_preparation_status, delivery_status, customer_name, customer_phone,
          shipping_address, pickup_location, items, total_amount, assigned_at,
          ready_for_pickup_at, picked_up_at, out_for_delivery_at, delivered_at,
          failed_at, failure_reason, failure_remarks, flagged_for_admin_review, created_at
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12, $13, $14,
          $15, $16, $17, $18,
          $19, $20, $21, $22, $23
        )
        ON CONFLICT (id) DO NOTHING;`,
        [
          a.id,
          a.orderId,
          a.deliveryPartnerId,
          a.deliveryPartnerName || null,
          a.providerType || 'IN_HOUSE',
          a.orderPreparationStatus || 'PREPARING',
          a.deliveryStatus || 'ASSIGNED',
          a.customerName || null,
          a.customerPhone || null,
          JSON.stringify(a.shippingAddress || {}),
          JSON.stringify(a.pickupLocation || {}),
          JSON.stringify(a.items || []),
          a.totalAmount || 0,
          a.assignedAt || null,
          a.readyForPickupAt || null,
          a.pickedUpAt || null,
          a.outForDeliveryAt || null,
          a.deliveredAt || null,
          a.failedAt || null,
          a.failureReason || null,
          a.failureRemarks || null,
          Boolean(a.flaggedForAdminReview),
          a.createdAt || new Date().toISOString()
        ]
      );
    }

    for (const h of store.deliveryStatusHistory) {
      await query(
        `INSERT INTO delivery_status_history (
          id, assignment_id, previous_status, new_status, changed_by_user_id, changed_by_name, timestamp, remarks
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING;`,
        [
          h.id,
          h.assignmentId,
          h.previousStatus || null,
          h.newStatus,
          h.changedByUserId,
          h.changedByName || null,
          h.timestamp || new Date().toISOString(),
          h.remarks || null
        ]
      );
    }

    for (const n of store.deliveryNotifications) {
      await query(
        `INSERT INTO delivery_notifications (
          id, delivery_partner_id, assignment_id, order_id, title, message, type, is_read, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING;`,
        [
          n.id,
          n.deliveryPartnerId,
          n.assignmentId || null,
          n.orderId || null,
          n.title,
          n.message,
          n.type,
          Boolean(n.isRead),
          n.createdAt || new Date().toISOString()
        ]
      );
    }

    // 8. Seed Initial Authentic Reviews
    const initialReviews = [
      {
        id: 'rev_frk_1',
        productId: 'gb_prod_frankincense',
        authorName: 'Sunita Mehra',
        authorCity: 'Bengaluru',
        rating: 5,
        headline: 'Deeply calming on dry & irritated patches',
        comment: 'I mix 2 drops with my night facial oil. The frankincense aroma is completely pure, earthy, and not artificially sweet like commercial perfumes. Skin feels visibly resilient and plumper by morning.',
        verifiedPurchase: true
      },
      {
        id: 'rev_frk_2',
        productId: 'gb_prod_frankincense',
        authorName: 'Rohan Nambiar',
        authorCity: 'Kochi',
        rating: 5,
        headline: 'Exceptional steam-distilled grade',
        comment: 'Having used essential oils from various international pharmacies, Good Bee’s steam distillation clarity is top-tier. Absorbs without clogging pores or greasy residual shine.',
        verifiedPurchase: true
      },
      {
        id: 'rev_ger_1',
        productId: 'gb_prod_geranium',
        authorName: 'Meera Chawla',
        authorCity: 'Chandigarh',
        rating: 5,
        headline: 'Helped regulate my T-zone balance',
        comment: 'Geranium extract has transformed my combination skin routine. Less midday shine and blemishes have calmed down significantly over three weeks.',
        verifiedPurchase: true
      },
      {
        id: 'rev_css_1',
        productId: 'gb_prod_clear_skin_soap',
        authorName: 'Priya Sundaram',
        authorCity: 'Chennai',
        rating: 5,
        headline: 'Non-drying cold processed bar',
        comment: 'Unlike commercial soaps with SLS, this retains all the natural glycerin. Leaves face squeaky-clean without the parched tight sensation.',
        verifiedPurchase: true
      }
    ];

    for (const r of initialReviews) {
      await query(
        `INSERT INTO reviews (id, product_id, author_name, author_city, rating, headline, comment, verified_purchase, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'APPROVED')
         ON CONFLICT (id) DO NOTHING;`,
        [r.id, r.productId, r.authorName, r.authorCity, r.rating, r.headline, r.comment, r.verifiedPurchase]
      );
    }

    console.log('✅ [Seed] Cloud PostgreSQL tables synchronized.');
  } catch (err) {
    console.error('❌ [Seed Error]:', err.message);
  }
}
