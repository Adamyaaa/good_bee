import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  QrCode,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Edit2,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Frankincense & Myrrh Soap', url: '/images_ref/Frankin-300x300.webp' },
  { label: 'Donkey Milk & Saffron Soap', url: '/images_ref/Donkey-Milk-Soap-300x300.webp' },
  { label: 'Clear-Skin Neem & Basil Soap', url: '/images_ref/Clear-skin-300x300.webp' },
  { label: 'Arabica Coffee Scrub Soap', url: '/images_ref/Coffee-300x300.webp' },
  { label: 'Pure Baby Soap (Ultra Mild)', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.01-300x300.webp' },
  { label: 'Wild Turmeric Glow Soap', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-1-300x300.webp' },
  { label: 'Pink Lotus Lip Butter', url: '/images_ref/Pink-Lotus-300x300.webp' },
  { label: 'Lavender Night Lip Balm', url: '/images_ref/Levendor-300x300.webp' },
  { label: 'Moisture Tint Lipstick', url: '/images_ref/Lipstick-600x600.webp' },
  { label: 'Rosemary Cold-Pressed Hair Oil', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.56-300x300.webp' },
  { label: 'Steam-Distilled Rose Hydrosol Mist', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp' },
  { label: 'Rosemary Hydrosol Balancing Mist', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.23-300x300.webp' },
  { label: 'Pain Relief Roll-On', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.17-1-300x300.webp' },
  { label: 'Lemongrass Revitalizing Soap', url: '/images_ref/Lemongrass-300x300.webp' },
  { label: 'Rosemary Essential Extract', url: '/images_ref/Rosmary-2-300x300.webp' }
];

const CATEGORIES = [
  'Cold Processed Soaps',
  'Pure Essential Oils',
  'Lip & Facial Care',
  'Botanical Mists',
  'Hair & Scalp Rituals',
  'Therapeutic Body Care'
];

export default function AdminDashboard({ onNavigateHome }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('ANALYTICS'); // 'ANALYTICS', 'ORDERS', 'PRODUCTS', 'SITE_CONTENT'
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Quick edit stock & price inline state
  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineStock, setInlineStock] = useState(0);
  const [inlinePrice, setInlinePrice] = useState(0);

  // Full product modal state (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('CREATE'); // 'CREATE' or 'EDIT'
  const [activeProductForm, setActiveProductForm] = useState({
    id: null,
    title: '',
    subtitle: '',
    category: 'Cold Processed Soaps',
    concerns: 'Barrier Repair',
    price: 290,
    mrp: 350,
    stock: 50,
    volume: '100 g / 3.5 oz.',
    image: '/images_ref/Frankin-300x300.webp',
    ingredients: '',
    description: '',
    badge: '100% Natural'
  });

  // Site content CMS state
  const [siteContent, setSiteContent] = useState({
    announcement: 'Complimentary Delivery Across India on Orders Above ₹999',
    announcementSub: '100% Natural Active Ingredients',
    heroBadge: '100% Natural Skincare • Research-Driven Formulation',
    heroHeadline: 'Nature, Refined Through Research.',
    heroDescription: 'Good Bee develops 100% natural skincare formulations created after high-end botanical and active-stabilization research. We harmonize raw biological potency with clean laboratory precision to restore your skin barrier to luminous health.',
    whatsappNumber: '+919963075000',
    supportEmail: 'care@goodbee.in',
    upiVpa: 'goodbee.official@okaxis',
    payeeName: 'GOOD BEE Skincare Laboratory'
  });

  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, [token]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Load analytics
      const resAna = await fetch('/api/v1/admin/analytics', { headers });
      const anaData = await resAna.json();
      setAnalytics(anaData);

      // Load orders
      const resOrd = await fetch('/api/v1/admin/orders', { headers });
      const ordData = await resOrd.json();
      setOrders(ordData.orders || []);

      // Load full products list
      const resProd = await fetch('/api/v1/admin/products', { headers });
      const prodData = await resProd.json();
      setProducts(prodData.products || []);

      // Load site content CMS
      const resSite = await fetch('/api/v1/admin/site-content', { headers });
      const siteData = await resSite.json();
      if (siteData.content) setSiteContent(siteData.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order status');

      setActionSuccess(data.message || `Order #${orderId} marked as ${newStatus}`);
      setTimeout(() => setActionSuccess(''), 4000);
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveInlineStockPrice = async (id) => {
    try {
      const res = await fetch(`/api/v1/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stock: Number(inlineStock),
          price: Number(inlinePrice)
        })
      });

      if (res.ok) {
        setActionSuccess('Stock and price updated successfully.');
        setInlineEditId(null);
        setTimeout(() => setActionSuccess(''), 3000);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreateProduct = () => {
    setModalMode('CREATE');
    setActiveProductForm({
      id: null,
      title: '',
      subtitle: 'Pure Botanical Active Formulation',
      category: 'Cold Processed Soaps',
      concerns: 'Barrier Repair',
      price: 290,
      mrp: 350,
      stock: 50,
      volume: '100 g / 3.5 oz.',
      image: PRESET_IMAGES[0].url,
      ingredients: 'Organic Cold-Pressed Oils, Botanical Extracts, Pure Essential Oils',
      description: 'Slow-cured 100% natural botanical formulation crafted through active stabilization research.',
      badge: 'New Formulation'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setModalMode('EDIT');
    setActiveProductForm({
      id: prod.id,
      title: prod.title || '',
      subtitle: prod.subtitle || '',
      category: prod.category || 'Cold Processed Soaps',
      concerns: Array.isArray(prod.concerns) ? prod.concerns.join(', ') : (prod.concerns || ''),
      price: prod.price || 290,
      mrp: prod.mrp || 350,
      stock: prod.stock ?? 30,
      volume: prod.volume || '100 g',
      image: prod.image || PRESET_IMAGES[0].url,
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients.join(', ') : (prod.ingredients || ''),
      description: prod.description || prod.shortDescription || '',
      badge: prod.badge || '100% Natural'
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProductModal = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      const payload = {
        ...activeProductForm,
        price: Number(activeProductForm.price),
        mrp: Number(activeProductForm.mrp),
        stock: Number(activeProductForm.stock),
        concerns: activeProductForm.concerns.split(',').map((s) => s.trim()).filter(Boolean),
        ingredients: activeProductForm.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
      };

      let res;
      if (modalMode === 'CREATE') {
        res = await fetch('/api/v1/admin/products', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/v1/admin/products/${activeProductForm.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      setActionSuccess(data.message || 'Product saved successfully!');
      setIsProductModalOpen(false);
      setTimeout(() => setActionSuccess(''), 4000);
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the live storefront?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/v1/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setActionSuccess(`"${title}" has been removed from the catalog.`);
        setTimeout(() => setActionSuccess(''), 3000);
        loadAllAdminData();
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleSaveSiteContent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/site-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(siteContent)
      });
      const data = await res.json();
      setActionSuccess(data.message || 'Site content updated and published live!');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert('Error saving site content');
    }
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'PROCESSING').length;

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch =
      !productSearch ||
      p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-1 border border-amber-500/40 flex items-center justify-center flex-shrink-0 shadow-sm">
            <img
              src="/assets/goodbee-white-logo.png"
              alt="Good Bee Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">
                Master Control Tower
              </span>
              <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] bg-slate-800 border border-slate-700 text-slate-300 rounded font-mono">
                Storefront CMS v2.0
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-white">
              Good Bee Store Administration
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          <button
            onClick={loadAllAdminData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-2 sm:px-4 sm:py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-lg transition-colors"
          >
            Public Storefront
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 flex-1 w-full">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
          {[
            { id: 'ANALYTICS', label: 'Overview Telemetry', icon: LayoutDashboard },
            { id: 'ORDERS', label: `Patron Orders (${pendingOrdersCount} Pending)`, icon: ShoppingBag, badge: pendingOrdersCount > 0 },
            { id: 'PRODUCTS', label: `Catalog CMS & Products (${products.length})`, icon: Package },
            { id: 'SITE_CONTENT', label: 'Site Content & Gateway CMS', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:px-4 sm:py-3 text-[11px] sm:text-xs border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {actionSuccess && (
          <div className="p-3 sm:p-4 bg-emerald-950 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 1. OVERVIEW TELEMETRY TAB */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-950 p-3.5 sm:p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                  <span>Gross Sales</span>
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
                <div className="font-serif text-xl sm:text-3xl font-bold text-white truncate">
                  ₹{analytics?.metrics?.totalRevenue?.toLocaleString('en-IN') || '1,25,400'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-emerald-400 mt-1.5 sm:mt-2 font-mono">
                  +18.4% month
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 sm:p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                  <span>Patron Orders</span>
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                </div>
                <div className="font-serif text-xl sm:text-3xl font-bold text-white">
                  {orders.length}
                </div>
                <div className="text-[10px] sm:text-[11px] text-amber-400 mt-1.5 sm:mt-2 font-mono">
                  {pendingOrdersCount} requiring dispatch
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 sm:p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                  <span>Live Formulations</span>
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                </div>
                <div className="font-serif text-xl sm:text-3xl font-bold text-white">
                  {products.length}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 sm:mt-2 font-mono truncate">
                  Fully editable catalog
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 sm:p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                  <span>Low Stock Warnings</span>
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                </div>
                <div className="font-serif text-xl sm:text-3xl font-bold text-white">
                  {products.filter((p) => (p.stock ?? 25) <= 10).length}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 sm:mt-2 font-mono">
                  &le; 10 units alert
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Orders Box */}
              <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Latest Incoming Orders</h3>
                    <p className="text-xs text-slate-400">Real-time patron purchases</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('ORDERS')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {orders.slice(0, 4).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-mono font-bold text-amber-400">{ord.id}</td>
                          <td className="p-3 text-slate-200">{ord.customerName}</td>
                          <td className="p-3 font-bold text-white">₹{ord.total}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                              {ord.paymentMethod === 'DYNAMIC_UPI_QR' ? 'UPI' : 'COD'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : ord.status === 'DISPATCHED'
                                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                                : 'bg-amber-950 text-amber-300 border border-amber-700'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fast Quick Powers Box */}
              <div className="lg:col-span-4 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Admin Power Shortcuts</h3>
                  <p className="text-xs text-slate-400 mt-1">Instant catalog & storefront controls</p>
                  
                  <div className="space-y-2.5 mt-4">
                    <button
                      onClick={handleOpenCreateProduct}
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Formulation</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('PRODUCTS')}
                      className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Package className="w-4 h-4 text-amber-400" />
                      <span>Manage All {products.length} Products</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('SITE_CONTENT')}
                      className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <span>Edit Site Headlines & Gateways</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  💡 Changes made in the Admin CMS reflect immediately on the live customer storefront.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. PATRON ORDERS & FULFILMENT TAB */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Patron Orders & Fulfilment</h3>
                <p className="text-xs text-slate-400">
                  Verify customer delivery addresses, initiate one-click WhatsApp dispatch alerts, and update delivery milestones.
                </p>
              </div>
              <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                Total Orders: <span className="font-bold text-amber-400">{orders.length}</span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-slate-950 p-12 text-center rounded-2xl border border-slate-800 text-slate-400 space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm">No customer orders placed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const cleanPhone = ord.customerPhone?.replace(/[^0-9]/g, '') || '919963075000';
                  const whatsappMsg = encodeURIComponent(
                    `Hello ${ord.customerName}, regarding your Good Bee Order #${ord.id}: Your 100% pure botanical formulations are currently being prepared for dispatch.`
                  );

                  return (
                    <div
                      key={ord.id}
                      className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-amber-400">
                            {ord.id}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : ord.status === 'DISPATCHED'
                              ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {ord.status}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 border border-slate-700 text-slate-300">
                            {ord.paymentMethod === 'DYNAMIC_UPI_QR' ? 'UPI PAID' : 'COD'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                        <div className="md:col-span-4 space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                          <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                            Patron Delivery Details
                          </span>
                          <p className="font-semibold text-white text-sm">{ord.customerName}</p>
                          <p className="text-slate-300 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ord.customerEmail}</span>
                          </p>
                          <p className="text-slate-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ord.customerPhone}</span>
                          </p>
                          <p className="text-slate-400 flex items-start gap-1.5 pt-1 border-t border-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                            <span>{ord.shippingAddress}</span>
                          </p>

                          <div className="pt-2">
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 px-3 bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-600/50 text-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium text-[11px]"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>WhatsApp Patron Directly</span>
                            </a>
                          </div>
                        </div>

                        <div className="md:col-span-5 space-y-2">
                          <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block">
                            Formulation Items
                          </span>
                          <div className="space-y-2">
                            {ord.items?.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-2 bg-slate-900/40 rounded-xl border border-slate-800/60"
                              >
                                {it.product?.image && (
                                  <img
                                    src={it.product.image}
                                    alt={it.product.title}
                                    className="w-10 h-10 object-cover rounded-lg border border-slate-700 flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium truncate">{it.product?.title || 'Skincare Item'}</p>
                                  <p className="text-[11px] text-slate-400">Qty: {it.quantity} &times; ₹{it.product?.price}</p>
                                </div>
                                <span className="font-bold text-white">₹{(it.product?.price || 0) * it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-3 flex flex-col justify-between bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                          <div>
                            <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block">
                              Total Order Value
                            </span>
                            <div className="font-serif text-2xl font-bold text-white mt-1">
                              ₹{ord.total}
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-800">
                            <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                              Milestone Status:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'DISPATCHED')}
                                className={`py-2 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                                  ord.status === 'DISPATCHED'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                Dispatched
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'DELIVERED')}
                                className={`py-2 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                                  ord.status === 'DELIVERED'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                Delivered
                              </button>
                            </div>
                            {ord.status !== 'PROCESSING' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'PROCESSING')}
                                className="w-full py-1 text-[10px] text-slate-400 hover:text-amber-400 underline"
                              >
                                Reset to Processing
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. CATALOG CMS & FULL PRODUCT EDITOR */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Product Formulations Catalog CMS</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono">
                    {filteredProducts.length} items
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Add new skincare products, edit clinical details, active ingredients, pricing, or delete items.
                </p>
              </div>

              <button
                onClick={handleOpenCreateProduct}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search formulations by title or ingredient..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Categories ({products.length})</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Formulation</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3">Concerns</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.map((p) => {
                      const isInline = inlineEditId === p.id;

                      return (
                        <tr key={p.id} className="hover:bg-slate-900/50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {p.image && (
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="w-12 h-12 object-cover rounded-xl border border-slate-700 flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0 max-w-xs">
                                <p className="font-semibold text-white truncate">{p.title}</p>
                                <span className="text-[10px] text-amber-400/90 font-mono">{p.volume || '100 g'}</span>
                                {p.badge && (
                                  <span className="ml-2 text-[9px] px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-300">{p.category}</td>
                          <td className="p-3 font-bold text-white">
                            {isInline ? (
                              <input
                                type="number"
                                value={inlinePrice}
                                onChange={(e) => setInlinePrice(e.target.value)}
                                className="w-20 p-1 bg-slate-900 border border-amber-500 rounded text-amber-300 font-mono text-xs focus:outline-none"
                              />
                            ) : (
                              <span>₹{p.price}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {isInline ? (
                              <input
                                type="number"
                                value={inlineStock}
                                onChange={(e) => setInlineStock(e.target.value)}
                                className="w-20 p-1 bg-slate-900 border border-amber-500 rounded text-amber-300 font-mono text-xs focus:outline-none"
                              />
                            ) : (
                              <span className="font-mono text-slate-200">{p.stock ?? 30} units</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-400 text-[11px] max-w-xs truncate">
                            {Array.isArray(p.concerns) ? p.concerns.join(', ') : p.concerns}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (p.stock ?? 30) > 10
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : (p.stock ?? 30) > 0
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {(p.stock ?? 30) > 0 ? ((p.stock ?? 30) <= 10 ? 'LOW STOCK' : 'IN STOCK') : 'OUT OF STOCK'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isInline ? (
                                <>
                                  <button
                                    onClick={() => handleSaveInlineStockPrice(p.id)}
                                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setInlineEditId(null)}
                                    className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setInlineEditId(p.id);
                                      setInlineStock(p.stock ?? 30);
                                      setInlinePrice(p.price);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                                    title="Quick Price/Stock Edit"
                                  >
                                    <Sliders className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                                    title="Edit Full Formulation"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id, p.title)}
                                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                                    title="Delete Formulation"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {filteredProducts.map((p) => {
                const isInline = inlineEditId === p.id;

                return (
                  <div
                    key={p.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-700 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-slate-400">{p.volume || '100 g'}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            (p.stock ?? 30) > 10
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {(p.stock ?? 30) > 0 ? `${p.stock} units` : 'OUT'}
                          </span>
                        </div>
                        <p className="font-semibold text-white text-xs mt-0.5 truncate">{p.title}</p>
                        <p className="text-[11px] text-slate-400">{p.category}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Price</span>
                        {isInline ? (
                          <input
                            type="number"
                            value={inlinePrice}
                            onChange={(e) => setInlinePrice(e.target.value)}
                            className="w-full mt-1 p-1 bg-slate-950 border border-amber-500 rounded text-amber-300 font-mono text-xs focus:outline-none"
                          />
                        ) : (
                          <span className="font-bold text-white text-sm block">₹{p.price}</span>
                        )}
                      </div>

                      <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Stock</span>
                        {isInline ? (
                          <input
                            type="number"
                            value={inlineStock}
                            onChange={(e) => setInlineStock(e.target.value)}
                            className="w-full mt-1 p-1 bg-slate-950 border border-amber-500 rounded text-amber-300 font-mono text-xs focus:outline-none"
                          />
                        ) : (
                          <span className="font-mono text-slate-200 text-sm block">{p.stock ?? 30} units</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {isInline ? (
                        <>
                          <button
                            onClick={() => handleSaveInlineStockPrice(p.id)}
                            className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setInlineEditId(null)}
                            className="flex-1 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit Full Details</span>
                          </button>
                          <button
                            onClick={() => {
                              setInlineEditId(p.id);
                              setInlineStock(p.stock ?? 30);
                              setInlinePrice(p.price);
                            }}
                            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-semibold"
                            title="Quick Stock/Price"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="py-2 px-3 bg-slate-800 hover:bg-rose-900 text-rose-400 rounded-xl text-xs font-semibold"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* 4. SITE CONTENT & GATEWAYS CMS */}
        {activeTab === 'SITE_CONTENT' && (
          <div className="max-w-3xl bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Global Site Content & Gateway CMS</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Edit storefront announcement bar, hero section headlines, active copy, and customer care lines in real-time.
              </p>
            </div>

            <form onSubmit={handleSaveSiteContent} className="space-y-6 text-xs">
              
              {/* Announcement Bar CMS */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                  Top Announcement Bar
                </span>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Primary Banner Notice</label>
                  <input
                    type="text"
                    value={siteContent.announcement || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, announcement: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    placeholder="Complimentary Delivery Across India on Orders Above ₹999"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Secondary Value Badge</label>
                  <input
                    type="text"
                    value={siteContent.announcementSub || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, announcementSub: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    placeholder="100% Natural Active Ingredients"
                  />
                </div>
              </div>

              {/* Hero Section Editorial CMS */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                  Hero Editorial Stage
                </span>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Positioning Pill Badge</label>
                  <input
                    type="text"
                    value={siteContent.heroBadge || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, heroBadge: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Major Hero Headline</label>
                  <input
                    type="text"
                    value={siteContent.heroHeadline || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, heroHeadline: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-serif text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Brand Positioning Paragraph</label>
                  <textarea
                    rows={3}
                    value={siteContent.heroDescription || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, heroDescription: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed"
                  />
                </div>
              </div>

              {/* Payment & WhatsApp Concierge Routing */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <span className="font-mono uppercase text-[10px] text-emerald-400 font-bold block">
                  Payment & WhatsApp Concierge Routing
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">UPI VPA Address</label>
                    <input
                      type="text"
                      value={siteContent.upiVpa || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, upiVpa: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Merchant Display Name</label>
                    <input
                      type="text"
                      value={siteContent.payeeName || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, payeeName: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">WhatsApp Phone (+CountryCode)</label>
                    <input
                      type="text"
                      value={siteContent.whatsappNumber || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, whatsappNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Customer Care Email</label>
                    <input
                      type="email"
                      value={siteContent.supportEmail || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, supportEmail: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl uppercase tracking-wider text-xs transition-colors shadow-sm"
              >
                Publish Site Content Live
              </button>
            </form>
          </div>
        )}

      </div>

      {/* FULL PRODUCT CREATE / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  {modalMode === 'CREATE' ? 'Add New Formulation' : 'Edit Formulation Details'}
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                  {modalMode === 'CREATE' ? 'Create Store Product' : activeProductForm.title}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-4">
              
              <div>
                <label className="block mb-1 text-slate-300 font-medium">Product Title</label>
                <input
                  type="text"
                  required
                  value={activeProductForm.title}
                  onChange={(e) => setActiveProductForm({ ...activeProductForm, title: e.target.value })}
                  placeholder="e.g. Pure Steam-Distilled Rose & Saffron Hydrosol"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Category</label>
                  <select
                    value={activeProductForm.category}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 font-medium"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Net Volume / Weight</label>
                  <input
                    type="text"
                    value={activeProductForm.volume}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, volume: e.target.value })}
                    placeholder="e.g. 100 g / 3.5 oz."
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={activeProductForm.price}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, price: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono text-sm focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">MRP (₹)</label>
                  <input
                    type="number"
                    value={activeProductForm.mrp}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, mrp: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={activeProductForm.stock}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, stock: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Product Imagery</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Pick authentic preset or custom URL</span>
                </div>

                <div className="flex items-center gap-3">
                  {activeProductForm.image && (
                    <img
                      src={activeProductForm.image}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-xl border border-slate-700 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) setActiveProductForm({ ...activeProductForm, image: e.target.value });
                      }}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                    >
                      <option value="">-- Choose from Authentic Preset Photos --</option>
                      {PRESET_IMAGES.map((img) => (
                        <option key={img.url} value={img.url}>{img.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={activeProductForm.image}
                      onChange={(e) => setActiveProductForm({ ...activeProductForm, image: e.target.value })}
                      placeholder="Or enter direct image path / URL"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-medium">Target Concerns (comma-separated)</label>
                <input
                  type="text"
                  value={activeProductForm.concerns}
                  onChange={(e) => setActiveProductForm({ ...activeProductForm, concerns: e.target.value })}
                  placeholder="Barrier Repair, Acne & Blemishes, Moisture Deficit"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-medium">Active Ingredients (comma-separated)</label>
                <input
                  type="text"
                  value={activeProductForm.ingredients}
                  onChange={(e) => setActiveProductForm({ ...activeProductForm, ingredients: e.target.value })}
                  placeholder="Raw Honey, Donkey Milk, Wild Saffron, Organic Coconut Oil"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-medium">Formulation Description & Clinical Benefits</label>
                <textarea
                  rows={3}
                  value={activeProductForm.description}
                  onChange={(e) => setActiveProductForm({ ...activeProductForm, description: e.target.value })}
                  placeholder="Detail the active stabilization and benefits..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors shadow-sm"
                >
                  {modalMode === 'CREATE' ? 'Add to Live Catalog' : 'Update Formulation'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
