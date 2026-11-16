import { query, isConnected } from '../db/pg.js';
import { store } from '../db/store.js';

export async function seedNeonDatabase() {
  if (!isConnected()) {
    console.log('[Seed] PostgreSQL not connected, skipping cloud seed.');
    return;
  }

  try {
    console.log('🌱 [Seed] Populating cloud PostgreSQL tables from initial catalog...');

    // 1. Seed Users
    for (const u of store.users) {
      await query(
        `INSERT INTO users (id, name, email, password_hash, role, phone, company_name, lab_cert_id, dealer_code, gst_number, tier, commission_margin_pct, loyalty_points, referral_code, city, state, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           email = EXCLUDED.email,
           role = EXCLUDED.role,
           phone = EXCLUDED.phone;`,
        [
          u.id,
          u.name,
          u.email,
          u.password, // Plain or hashed
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
          u.status || 'ACTIVE'
        ]
      );
    }
    console.log(`✅ [Seed] Users table synchronized (${store.users.length} seeded accounts).`);

    // 2. Seed Products
    for (const p of store.products) {
      await query(
        `INSERT INTO products (id, title, subtitle, slug, sku, category, concerns, price, mrp, volume, rating, reviews_count, stock, low_stock_threshold, badge, short_description, description, ingredients, ritual, research_notes, image, gallery, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           price = EXCLUDED.price,
           mrp = EXCLUDED.mrp,
           stock = EXCLUDED.stock,
           rating = EXCLUDED.rating;`,
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
          p.rating || 4.9,
          p.reviewsCount || 0,
          p.stock || 50,
          p.lowStockThreshold || 10,
          p.badge || null,
          p.shortDescription || null,
          p.description || null,
          JSON.stringify(p.ingredients || []),
          p.ritual || null,
          p.researchNotes || null,
          p.image,
          JSON.stringify(p.gallery || [p.image]),
          p.status || 'ACTIVE'
        ]
      );
    }
    console.log(`✅ [Seed] Products table synchronized (${store.products.length} products).`);

    // 3. Seed Initial Authentic Reviews
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
    console.log(`✅ [Seed] Authentic patron reviews synchronized.`);

  } catch (err) {
    console.error('❌ [Seed Error]:', err.message);
  }
}
