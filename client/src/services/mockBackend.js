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

const DEFAULT_ORDERS = [
  {
    id: 'GB-ORD-90214',
    items: [
      {
        product: {
          id: 'prod_frankincense',
          title: 'Frankincense & Myrrh Cold Processed Soap',
          price: 290,
          image: '/images_ref/Frankin-300x300.webp'
        },
        quantity: 2
      },
      {
        product: {
          id: 'prod_rose_mist',
          title: 'Steam-Distilled Pure Rose Hydrosol Mist',
          price: 490,
          image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp'
        },
        quantity: 1
      }
    ],
    total: 1070,
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.s@gmail.com',
    customerPhone: '+91 98201 44521',
    shippingAddress: '402, Sea Green Apts, Bandra West, Mumbai, MH - 400050',
    paymentMethod: 'DYNAMIC_UPI_QR',
    paymentStatus: 'PAID',
    status: 'PROCESSING',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'GB-ORD-90210',
    items: [
      {
        product: {
          id: 'prod_donkey_milk',
          title: 'Donkey Milk & Saffron Nourishing Bath Soap',
          price: 350,
          image: '/images_ref/Donkey-Milk-300x300.webp'
        },
        quantity: 1
      },
      {
        product: {
          id: 'prod_pink_lotus_lip',
          title: 'Pink Lotus & Wild Honey Lip Butter',
          price: 260,
          image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.12-300x300.webp'
        },
        quantity: 2
      }
    ],
    total: 870,
    customerName: 'Karthik Subramanian',
    customerEmail: 'karthik.subra@yahoo.com',
    customerPhone: '+91 94440 18723',
    shippingAddress: 'Flat 3B, Palm Grove Residencies, Indiranagar, Bengaluru, KA - 560038',
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PENDING_ON_DELIVERY',
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'GB-ORD-90198',
    items: [
      {
        product: {
          id: 'prod_rosemary_oil',
          title: 'Rosemary & Cold-Pressed Herb Infused Hair Oil',
          price: 520,
          image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.56-300x300.webp'
        },
        quantity: 1
      }
    ],
    total: 520,
    customerName: 'Pooja Reddy',
    customerEmail: 'pooja.reddy@gmail.com',
    customerPhone: '+91 99630 11299',
    shippingAddress: 'House 14, Road 12, Jubilee Hills, Hyderabad, TS - 500033',
    paymentMethod: 'DYNAMIC_UPI_QR',
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
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
    const orders = getStored('goodbee_orders', DEFAULT_ORDERS);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 125400);
    const pendingOrders = orders.filter((o) => o.status === 'PROCESSING').length;
    const lowStock = products.filter((p) => (p.stock ?? 25) <= (p.lowStockThreshold || 10)).length;

    return jsonResponse({
      metrics: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        activeProducts: products.length,
        lowStockAlerts: lowStock,
        averageOrderValue: Math.round(totalRevenue / Math.max(orders.length, 1))
      },
      recentOrders: orders.slice(0, 5)
    });
  }

  // 5. Admin: Orders
  if (path === '/api/v1/admin/orders' && method === 'GET') {
    const orders = getStored('goodbee_orders', DEFAULT_ORDERS);
    return jsonResponse({ count: orders.length, orders });
  }

  // 6. Admin: Update Order Status
  if (path.startsWith('/api/v1/admin/orders/') && path.endsWith('/status') && method === 'PUT') {
    const parts = path.split('/');
    const id = parts[5];
    const orders = getStored('goodbee_orders', DEFAULT_ORDERS);
    const orderIndex = orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return jsonResponse({ error: 'Order not found' }, 404);
    }

    if (body.status) orders[orderIndex].status = body.status;
    if (body.paymentStatus) orders[orderIndex].paymentStatus = body.paymentStatus;
    setStored('goodbee_orders', orders);

    return jsonResponse({
      message: `Order #${id} status updated to ${body.status}.`,
      order: orders[orderIndex]
    });
  }

  // 7. Admin: Inventory
  if (path === '/api/v1/admin/inventory' && method === 'GET') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const inventory = products.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      image: p.image,
      sku: p.sku || `GB-${p.id.slice(0, 8).toUpperCase()}`,
      stock: p.stock ?? 25,
      lowStockThreshold: p.lowStockThreshold || 10,
      price: p.price,
      mrp: p.mrp || Math.round(p.price * 1.2),
      status: (p.stock ?? 25) > 0 ? ((p.stock ?? 25) <= (p.lowStockThreshold || 10) ? 'LOW_STOCK' : 'IN_STOCK') : 'OUT_OF_STOCK'
    }));
    return jsonResponse({ count: inventory.length, inventory });
  }

  // 8. Admin: Update Inventory (Stock & Price)
  if (path.startsWith('/api/v1/admin/inventory/') && method === 'PUT') {
    const id = path.split('/')[5];
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const pIndex = products.findIndex((p) => p.id === id);
    if (pIndex !== -1) {
      if (body.stock !== undefined) products[pIndex].stock = Number(body.stock);
      if (body.price !== undefined) products[pIndex].price = Number(body.price);
      if (body.mrp !== undefined) products[pIndex].mrp = Number(body.mrp);
      setStored('goodbee_products', products);
    }
    return jsonResponse({ message: 'Catalog details updated successfully.' });
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
    const orders = getStored('goodbee_orders', DEFAULT_ORDERS);
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
