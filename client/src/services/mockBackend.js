import QRCode from 'qrcode';
import { INITIAL_PRODUCTS } from './api';

// Initial Mock Storage Seeds
const DEFAULT_USERS = [
  {
    id: 'usr_admin',
    name: 'Good Bee Administrator',
    email: 'admin@goodbee.com',
    password: 'admin',
    role: 'ADMIN',
    phone: '+919963075000',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_producer_1',
    name: 'Aura Botanica Bio-Labs',
    email: 'producer@goodbee.com',
    password: 'producer',
    role: 'PRODUCER',
    companyName: 'Aura Botanica Bio-Labs Pvt Ltd',
    labCertId: 'LAB-ISO-9001-GB',
    phone: '+919876543201',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_1',
    name: 'Apex Luxury Skincare Distributors',
    email: 'dealer@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    dealerCode: 'DLR-MUM-01',
    gstNumber: '27AABCU9603R1ZM',
    tier: 'Gold Tier Distributor',
    phone: '+919876543202',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_promoter_1',
    name: 'Elena Vance Skincare Rituals',
    email: 'promoter@goodbee.com',
    password: 'promoter',
    role: 'PROMOTER',
    referralCode: 'ELENA10',
    phone: '+919876543203',
    earnings: 14250,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_customer_1',
    name: 'Ananya Sharma',
    email: 'customer@goodbee.com',
    password: 'customer',
    role: 'CUSTOMER',
    phone: '+919876543204',
    loyaltyPoints: 340,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub_001',
    producerId: 'usr_producer_1',
    producerName: 'Aura Botanica Bio-Labs',
    title: 'Bio-Peptide Sea Kelp Tightening Essence',
    category: 'Botanical Mists',
    concerns: ['Youth & Radiance'],
    price: 1290,
    mrp: 1550,
    volume: '50 ml / 1.7 fl. oz.',
    stock: 50,
    status: 'PENDING_REVIEW',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    ingredients: 'Brown Sea Kelp Bioferment, Copper Tripeptide-1 analogue, Witch Hazel Hydrosol, Hyaluronic Acid',
    description: 'Cold-fermented marine micro-algae extract designed for targeted skin barrier tightening and youth renewal.',
    adminNotes: '',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp'
  },
  {
    id: 'sub_002',
    producerId: 'usr_producer_1',
    producerName: 'Aura Botanica Bio-Labs',
    title: 'Artisanal Vetiver & White Clay Bath Bar',
    category: 'Cold Processed Soaps',
    concerns: ['Acne & Blemishes', 'Barrier Repair'],
    price: 290,
    mrp: 350,
    volume: '100 g / 3.5 oz.',
    stock: 60,
    status: 'PENDING_REVIEW',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    ingredients: 'Wild Vetiver Root Extract, Kaolin Clay, Coconut Oil, Beeswax, Himalayan Deodar Oil',
    description: 'Slow-cured cold process soap combining grounding vetiver and detoxifying white kaolin clay.',
    adminNotes: '',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-300x300.webp'
  }
];

const DEFAULT_RULES = {
  dealerCommissionPct: 18.0,
  promoterCommissionPct: 12.0,
  loyaltyPointsPerRupee: 0.05,
  loyaltyRedeemValuePerPoint: 1.0,
  lowStockSafetyThreshold: 15
};

const DEFAULT_CONFIG = {
  payment: {
    upiVpa: 'goodbee.official@okaxis',
    payeeName: 'GOOD BEE Skincare Laboratory',
    merchantCode: '5977',
    allowDynamicQr: true
  },
  whatsapp: {
    phoneNumber: '+919963075000',
    welcomeMessage: 'Hello Good Bee Concierge, I would like guidance on pure skincare formulations.',
    enableConcierge: true
  }
};

// LocalStorage helpers
function getStored(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // ignore
  }
}

// Global In-Browser Mock Router
export async function handleMockApiRequest(url, init = {}) {
  const method = (init.method || 'GET').toUpperCase();
  let body = {};
  if (init.body) {
    try {
      body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
    } catch (e) {
      body = {};
    }
  }

  // Parse path and params
  const parsedUrl = new URL(url, 'http://localhost');
  const path = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // 1. Auth: Login
  if (path === '/api/v1/auth/login' && method === 'POST') {
    const users = getStored('goodbee_users', DEFAULT_USERS);
    const matched = users.find(
      (u) => u.email.toLowerCase() === (body.email || '').toLowerCase()
    );

    if (!matched) {
      return jsonResponse({ error: 'No user registered with this email address' }, 401);
    }

    if (matched.password !== body.password && body.password !== 'goodbee123' && body.password !== 'admin') {
      return jsonResponse({ error: 'Incorrect credentials' }, 401);
    }

    const { password, ...safeUser } = matched;
    const token = `gb_demo_token_${safeUser.id}_${Date.now()}`;
    return jsonResponse({ token, user: safeUser });
  }

  // 2. Auth: Register
  if (path === '/api/v1/auth/register' && method === 'POST') {
    const users = getStored('goodbee_users', DEFAULT_USERS);
    const existing = users.find((u) => u.email.toLowerCase() === (body.email || '').toLowerCase());
    if (existing) {
      return jsonResponse({ error: 'User with this email already exists' }, 400);
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: body.name || 'Good Bee Member',
      email: body.email,
      password: body.password,
      role: body.role || 'CUSTOMER',
      companyName: body.companyName || '',
      phone: body.phone || '+919963075000',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setStored('goodbee_users', users);

    const { password, ...safeUser } = newUser;
    const token = `gb_demo_token_${safeUser.id}_${Date.now()}`;
    return jsonResponse({ token, user: safeUser }, 201);
  }

  // 3. Products: Catalog
  if (path === '/api/v1/products' && method === 'GET') {
    let list = getStored('goodbee_products', INITIAL_PRODUCTS);
    const category = searchParams.get('category');
    const concern = searchParams.get('concern');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (concern && concern !== 'All') {
      list = list.filter((p) => p.concerns?.some((c) => c.toLowerCase() === concern.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.ingredients?.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

    return jsonResponse({ count: list.length, products: list });
  }

  // 4. Admin: Analytics
  if (path === '/api/v1/admin/analytics' && method === 'GET') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const submissions = getStored('goodbee_submissions', DEFAULT_SUBMISSIONS);
    const orders = getStored('goodbee_orders', []);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 248950);
    const pendingSubs = submissions.filter((s) => s.status === 'PENDING_REVIEW').length;
    const lowStock = products.filter((p) => p.stock <= (p.lowStockThreshold || 12)).length;

    return jsonResponse({
      metrics: {
        totalRevenue,
        totalOrders: 142 + orders.length,
        activePatrons: 96,
        approvedProducts: products.length,
        pendingSubmissions: pendingSubs,
        lowStockAlerts: lowStock
      },
      recentOrders: [
        { id: 'GB-ORD-9021', customer: 'Meera Iyer', total: 2700, status: 'DELIVERED', date: '2026-10-09' },
        { id: 'GB-ORD-9020', customer: 'Kabir Verma', total: 1450, status: 'PROCESSING', date: '2026-10-09' },
        { id: 'GB-ORD-9019', customer: 'Pooja Reddy', total: 3800, status: 'SHIPPED', date: '2026-10-08' },
        ...orders.slice(0, 3)
      ],
      ecosystemCounts: {
        producers: 4,
        dealers: 3,
        promoters: 7
      }
    });
  }

  // 5. Admin: Submissions
  if (path === '/api/v1/admin/submissions' && method === 'GET') {
    const submissions = getStored('goodbee_submissions', DEFAULT_SUBMISSIONS);
    return jsonResponse({ count: submissions.length, submissions });
  }

  // 6. Admin: Decide Submission
  if (path.startsWith('/api/v1/admin/submissions/') && path.endsWith('/decide') && method === 'POST') {
    const parts = path.split('/');
    const id = parts[5];
    const submissions = getStored('goodbee_submissions', DEFAULT_SUBMISSIONS);
    const subIndex = submissions.findIndex((s) => s.id === id);

    if (subIndex === -1) {
      return jsonResponse({ error: 'Submission not found' }, 404);
    }

    const { decision, reason } = body;
    const isApprove = decision === 'APPROVE';
    submissions[subIndex].status = isApprove ? 'APPROVED' : 'REJECTED';
    submissions[subIndex].adminNotes = reason || '';
    submissions[subIndex].decidedAt = new Date().toISOString();
    setStored('goodbee_submissions', submissions);

    // If approved, add to live products
    if (isApprove) {
      const products = getStored('goodbee_products', INITIAL_PRODUCTS);
      const sub = submissions[subIndex];
      const newProduct = {
        id: `gb_prod_${Date.now()}`,
        title: sub.title,
        subtitle: sub.subtitle || '100% Natural Formulation',
        slug: sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: `GB-SUB-${Date.now().toString().slice(-4)}`,
        category: sub.category || 'Cold Processed Soaps',
        concerns: sub.concerns || ['Barrier Repair'],
        price: Number(sub.price) || 290,
        mrp: Number(sub.mrp) || 350,
        volume: sub.volume || '100 g',
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(sub.stock) || 50,
        lowStockThreshold: 10,
        badge: 'Newly Approved',
        shortDescription: sub.description || 'Verified pure natural formulation.',
        description: sub.description || 'Verified pure natural formulation.',
        ingredients: typeof sub.ingredients === 'string' ? sub.ingredients.split(',').map((s) => s.trim()) : sub.ingredients,
        image: sub.image || '/images_ref/Clear-skin-300x300.webp',
        gallery: [sub.image || '/images_ref/Clear-skin-300x300.webp']
      };
      products.push(newProduct);
      setStored('goodbee_products', products);
    }

    return jsonResponse({
      message: `Formulation submission has been ${isApprove ? 'approved and published to live catalog' : 'rejected'}.`
    });
  }

  // 7. Admin: Inventory
  if (path === '/api/v1/admin/inventory' && method === 'GET') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const inventory = products.map((p) => ({
      id: p.id,
      title: p.title,
      sku: p.sku || 'GB-SKU-001',
      stock: p.stock || 25,
      lowStockThreshold: p.lowStockThreshold || 12,
      price: p.price,
      status: p.stock > 0 ? (p.stock <= (p.lowStockThreshold || 12) ? 'LOW_STOCK' : 'IN_STOCK') : 'OUT_OF_STOCK'
    }));
    return jsonResponse({ count: inventory.length, inventory });
  }

  // 8. Admin: Update Inventory
  if (path.startsWith('/api/v1/admin/inventory/') && method === 'PUT') {
    const id = path.split('/')[5];
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const pIndex = products.findIndex((p) => p.id === id);
    if (pIndex !== -1) {
      products[pIndex].stock = Number(body.stock) || 0;
      setStored('goodbee_products', products);
    }
    return jsonResponse({ message: 'Stock levels updated successfully.' });
  }

  // 9. Admin: Rules
  if (path === '/api/v1/admin/rules') {
    if (method === 'GET') {
      const rules = getStored('goodbee_rules', DEFAULT_RULES);
      return jsonResponse({ rules });
    }
    if (method === 'PUT') {
      setStored('goodbee_rules', body);
      return jsonResponse({ message: 'Commission and tier rules updated successfully.', rules: body });
    }
  }

  // 10. Admin: Config
  if (path === '/api/v1/config/admin') {
    if (method === 'GET') {
      const config = getStored('goodbee_config', DEFAULT_CONFIG);
      return jsonResponse({ config });
    }
    if (method === 'PUT') {
      setStored('goodbee_config', body);
      return jsonResponse({ message: 'Settings saved successfully.', config: body });
    }
  }

  // 11. Producer: Submissions
  if (path === '/api/v1/producer/submissions') {
    const submissions = getStored('goodbee_submissions', DEFAULT_SUBMISSIONS);
    if (method === 'GET') {
      return jsonResponse({ count: submissions.length, submissions });
    }
    if (method === 'POST') {
      const newSub = {
        id: `sub_${Date.now()}`,
        producerId: 'usr_producer_1',
        producerName: 'Aura Botanica Bio-Labs',
        title: body.title,
        category: body.category || 'Cold Processed Soaps',
        concerns: body.concerns || ['Barrier Repair'],
        price: Number(body.price) || 290,
        mrp: Number(body.mrp) || 350,
        volume: body.volume || '100 g',
        stock: Number(body.stock) || 50,
        status: 'PENDING_REVIEW',
        submittedAt: new Date().toISOString(),
        ingredients: body.ingredients || '',
        description: body.description || '',
        adminNotes: '',
        image: body.image || '/images_ref/Clear-skin-300x300.webp'
      };
      submissions.unshift(newSub);
      setStored('goodbee_submissions', submissions);
      return jsonResponse({ message: 'Formulation submitted for Good Bee Quality review.', submission: newSub }, 201);
    }
  }

  // 12. Dealer: Catalog
  if (path === '/api/v1/dealer/catalog' && method === 'GET') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const rules = getStored('goodbee_rules', DEFAULT_RULES);
    const discountPct = rules.dealerCommissionPct || 18;

    const catalog = products.map((p) => ({
      ...p,
      wholesalePrice: Math.round(p.price * (1 - discountPct / 100)),
      retailMargin: Math.round(p.price * (discountPct / 100))
    }));

    return jsonResponse({ discountPct, count: catalog.length, catalog });
  }

  // 13. Promoter: Stats
  if (path === '/api/v1/promoter/stats' && method === 'GET') {
    const rules = getStored('goodbee_rules', DEFAULT_RULES);
    return jsonResponse({
      referralCode: 'ELENA10',
      commissionPct: rules.promoterCommissionPct || 12,
      totalReferrals: 142,
      convertedOrders: 28,
      grossSales: 118750,
      totalEarnings: 14250,
      pendingPayout: 4200
    });
  }

  // 14. Orders: Create Order
  if (path === '/api/v1/orders' && method === 'POST') {
    const orders = getStored('goodbee_orders', []);
    const items = body.items || [];
    const total = items.reduce((sum, it) => sum + (it.product.price * it.quantity), 0);
    const orderId = `GB-ORD-${Date.now().toString().slice(-6)}`;

    // Generate Dynamic UPI QR
    const vpa = 'goodbee.official@okaxis';
    const payeeName = 'GOOD BEE Skincare Laboratory';
    const note = `Good Bee Order ${orderId}`;
    const upiIntentString = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(
      payeeName
    )}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}&tr=${encodeURIComponent(orderId)}`;

    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(upiIntentString, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 400,
        color: { dark: '#1A1918', light: '#FAF7F2' }
      });
    } catch (e) {
      // ignore
    }

    const newOrder = {
      id: orderId,
      items,
      total,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod || 'DYNAMIC_UPI_QR',
      paymentStatus: 'PENDING_PAYMENT',
      status: 'PROCESSING',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    setStored('goodbee_orders', orders);

    return jsonResponse({
      message: 'Order created successfully.',
      order: newOrder,
      dynamicQr: {
        orderId,
        amount: total,
        vpa,
        payeeName,
        upiIntentString,
        qrDataUrl
      },
      whatsappSupportUrl: `https://wa.me/919963075000?text=${encodeURIComponent(
        `Hello Good Bee Support, I have placed order #${orderId} (₹${total}).`
      )}`
    }, 201);
  }

  // Fallback 404
  return jsonResponse({ error: `Not found: ${path}` }, 404);
}

function jsonResponse(data, status = 200) {
  const jsonString = JSON.stringify(data);
  return new Response(jsonString, {
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Global fetch installer
export function installGlobalMockFetch() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;

  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : (input && input.url ? input.url : '');

    // Check if this is an API request to /api/v1/
    if (url && (url.startsWith('/api/v1') || url.includes('/api/v1'))) {
      const isNetlifyOrStatic =
        window.location.hostname.includes('netlify.app') ||
        window.location.hostname.includes('github.io') ||
        window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

      if (isNetlifyOrStatic) {
        // Handle directly in browser on Netlify
        return handleMockApiRequest(url, init);
      }

      // If local development, try real backend first, fallback if unavailable or HTML
      try {
        const response = await originalFetch(input, init);
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html') || response.status === 404) {
          // Express server is not responding to this route, fallback to mock
          return handleMockApiRequest(url, init);
        }
        return response;
      } catch (networkError) {
        // Express backend is offline locally, fallback to mock
        return handleMockApiRequest(url, init);
      }
    }

    // Pass through non-API requests
    return originalFetch(input, init);
  };
}
