import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_SITE_CONTENT } from '../services/mockBackend';
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
  Image as ImageIcon,
  Copy,
  Star,
  Tag,
  Percent,
  FlaskConical,
  Compass,
  FileText
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
  'Therapeutic Body Care',
  'Custom Category...'
];

export default function AdminDashboard({ onNavigateHome }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('ANALYTICS'); // 'ANALYTICS', 'ORDERS', 'PRODUCTS', 'SITE_CONTENT'
  const [siteCmsSubTab, setSiteCmsSubTab] = useState('ANNOUNCE_HERO'); // 'ANNOUNCE_HERO', 'PHILOSOPHY', 'SOURCING', 'TESTIMONIALS', 'COUPONS', 'GATEWAYS'
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
    customCategory: '',
    concerns: 'Barrier Repair',
    price: 290,
    mrp: 350,
    stock: 50,
    lowStockThreshold: 10,
    volume: '100 g / 3.5 oz.',
    image: '/images_ref/Frankin-300x300.webp',
    ingredients: '',
    description: '',
    ritual: '',
    researchNotes: '',
    badge: '100% Natural'
  });

  // Testimonials mini-modal state
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialModalMode, setTestimonialModalMode] = useState('CREATE'); // 'CREATE' or 'EDIT'
  const [activeTestimonialForm, setActiveTestimonialForm] = useState({
    id: null,
    name: '',
    city: '',
    product: '',
    quote: '',
    rating: 5
  });

  // Coupons mini-modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [activeCouponForm, setActiveCouponForm] = useState({
    code: '',
    discountPct: 10,
    minOrder: 500,
    active: true,
    description: ''
  });

  // Site content CMS state
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);

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
      customCategory: '',
      concerns: 'Barrier Repair, Hydration',
      price: 290,
      mrp: 350,
      stock: 50,
      lowStockThreshold: 10,
      volume: '100 g / 3.5 oz.',
      image: PRESET_IMAGES[0].url,
      ingredients: 'Organic Cold-Pressed Oils, Botanical Extracts, Pure Essential Oils',
      description: 'Slow-cured 100% natural botanical formulation crafted through active stabilization research.',
      ritual: 'Glide gently over damp skin and massage into a creamy lather before rinsing.',
      researchNotes: 'Gas chromatography verified single-origin batch purity.',
      badge: '100% Natural'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setModalMode('EDIT');
    setActiveProductForm({
      id: prod.id,
      title: prod.title || '',
      subtitle: prod.subtitle || '',
      category: CATEGORIES.includes(prod.category) ? prod.category : 'Custom Category...',
      customCategory: CATEGORIES.includes(prod.category) ? '' : (prod.category || ''),
      concerns: Array.isArray(prod.concerns) ? prod.concerns.join(', ') : (prod.concerns || ''),
      price: prod.price || 290,
      mrp: prod.mrp || Math.round((prod.price || 290) * 1.25),
      stock: prod.stock ?? 30,
      lowStockThreshold: prod.lowStockThreshold || 10,
      volume: prod.volume || '100 g',
      image: prod.image || PRESET_IMAGES[0].url,
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients.join(', ') : (prod.ingredients || ''),
      description: prod.description || prod.shortDescription || '',
      ritual: prod.ritual || '',
      researchNotes: prod.researchNotes || '',
      badge: prod.badge || '100% Natural'
    });
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = async (prod) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };
      const duplicated = {
        ...prod,
        id: undefined,
        title: `${prod.title} (Clone)`,
        sku: `GB-${Date.now().toString().slice(-5)}`
      };
      const res = await fetch('/api/v1/admin/products', {
        method: 'POST',
        headers,
        body: JSON.stringify(duplicated)
      });
      if (res.ok) {
        setActionSuccess(`Duplicated formulation "${prod.title}" successfully!`);
        setTimeout(() => setActionSuccess(''), 3000);
        loadAllAdminData();
      }
    } catch (err) {
      alert('Failed to duplicate product');
    }
  };

  const handleSaveProductModal = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      const chosenCategory = activeProductForm.category === 'Custom Category...'
        ? (activeProductForm.customCategory || 'Artisanal Formulations')
        : activeProductForm.category;

      const payload = {
        ...activeProductForm,
        category: chosenCategory,
        price: Number(activeProductForm.price),
        mrp: Number(activeProductForm.mrp),
        stock: Number(activeProductForm.stock),
        lowStockThreshold: Number(activeProductForm.lowStockThreshold || 10),
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
    if (e && e.preventDefault) e.preventDefault();
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
      setActionSuccess(data.message || 'Site content updated and published live across storefront!');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert('Error saving site content');
    }
  };

  // Testimonial management handlers
  const handleOpenAddTestimonial = () => {
    setTestimonialModalMode('CREATE');
    setActiveTestimonialForm({
      id: null,
      name: '',
      city: '',
      product: products[0]?.title || 'Good Bee Pure Formulation',
      quote: '',
      rating: 5
    });
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (t) => {
    setTestimonialModalMode('EDIT');
    setActiveTestimonialForm(t);
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = (e) => {
    e.preventDefault();
    const currentList = siteContent.testimonials || [];
    let updatedList;
    if (testimonialModalMode === 'CREATE') {
      const newT = {
        ...activeTestimonialForm,
        id: `test_${Date.now()}`
      };
      updatedList = [newT, ...currentList];
    } else {
      updatedList = currentList.map((item) =>
        item.id === activeTestimonialForm.id ? activeTestimonialForm : item
      );
    }
    const updated = { ...siteContent, testimonials: updatedList };
    setSiteContent(updated);
    setIsTestimonialModalOpen(false);
    fetch('/api/v1/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updated)
    }).catch(() => {});
    setActionSuccess('Patron story updated!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleDeleteTestimonial = (id) => {
    if (!window.confirm('Delete this patron review?')) return;
    const updatedList = (siteContent.testimonials || []).filter((t) => t.id !== id);
    const updated = { ...siteContent, testimonials: updatedList };
    setSiteContent(updated);
    fetch('/api/v1/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updated)
    }).catch(() => {});
    setActionSuccess('Review deleted.');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // Coupon handlers
  const handleOpenAddCoupon = () => {
    setActiveCouponForm({
      code: '',
      discountPct: 15,
      minOrder: 999,
      active: true,
      description: 'Exclusive natural beauty discount'
    });
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    const currentList = siteContent.coupons || [];
    const codeUpper = activeCouponForm.code.trim().toUpperCase();
    if (!codeUpper) return;
    const filtered = currentList.filter((c) => c.code.toUpperCase() !== codeUpper);
    const updatedList = [...filtered, { ...activeCouponForm, code: codeUpper }];
    const updated = { ...siteContent, coupons: updatedList };
    setSiteContent(updated);
    setIsCouponModalOpen(false);
    fetch('/api/v1/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updated)
    }).catch(() => {});
    setActionSuccess(`Coupon ${codeUpper} saved!`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleDeleteCoupon = (code) => {
    const updatedList = (siteContent.coupons || []).filter((c) => c.code !== code);
    const updated = { ...siteContent, coupons: updatedList };
    setSiteContent(updated);
    fetch('/api/v1/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updated)
    }).catch(() => {});
    setActionSuccess(`Coupon ${code} removed.`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleToggleCoupon = (code) => {
    const updatedList = (siteContent.coupons || []).map((c) =>
      c.code === code ? { ...c, active: !c.active } : c
    );
    const updated = { ...siteContent, coupons: updatedList };
    setSiteContent(updated);
    fetch('/api/v1/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updated)
    }).catch(() => {});
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
                                    onClick={() => handleDuplicateProduct(p)}
                                    className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                                    title="Duplicate / Clone Formulation"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
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
                            onClick={() => handleDuplicateProduct(p)}
                            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-semibold"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
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
          <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            
            {/* Header & Quick Save */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <span>Global Site Content & Visual CMS</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Full control over headlines, brand stories, patron reviews, discount coupons, and concierge channels.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveSiteContent}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl uppercase tracking-wider text-xs transition-colors shadow-sm self-start sm:self-auto"
              >
                Publish Site Live
              </button>
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex flex-wrap gap-2 pb-2">
              {[
                { id: 'ANNOUNCE_HERO', label: 'Announcement & Hero', icon: Sparkles },
                { id: 'PHILOSOPHY', label: 'Research Philosophy', icon: FlaskConical },
                { id: 'SOURCING', label: 'Apiary Sourcing', icon: Compass },
                { id: 'TESTIMONIALS', label: `Patron Reviews (${siteContent.testimonials?.length || 0})`, icon: Star },
                { id: 'COUPONS', label: `Coupons & Offers (${siteContent.coupons?.length || 0})`, icon: Percent },
                { id: 'GATEWAYS', label: 'Concierge & UPI', icon: MessageCircle }
              ].map((sub) => {
                const Icon = sub.icon;
                const isActive = siteCmsSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSiteCmsSubTab(sub.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSaveSiteContent} className="space-y-6 text-xs">

              {/* Sub-Tab 1: Announcement Bar & Hero Stage */}
              {siteCmsSubTab === 'ANNOUNCE_HERO' && (
                <div className="space-y-6">
                  {/* Announcement Bar */}
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                    <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                      Top Announcement Bar
                    </span>
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Primary Banner Notice</label>
                      <input
                        type="text"
                        value={siteContent.announcement || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, announcement: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        placeholder="Complimentary Delivery Across India on Orders Above ₹999"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-slate-300 font-medium">Secondary Value Badge</label>
                        <input
                          type="text"
                          value={siteContent.announcementSub || ''}
                          onChange={(e) => setSiteContent({ ...siteContent, announcementSub: e.target.value })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                          placeholder="100% Natural Active Ingredients"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-slate-300 font-medium">Free Delivery Minimum Cart (₹)</label>
                        <input
                          type="number"
                          value={siteContent.freeDeliveryThreshold || 999}
                          onChange={(e) => setSiteContent({ ...siteContent, freeDeliveryThreshold: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Stage Editorial */}
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                    <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                      Hero Editorial Stage
                    </span>
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Positioning Pill Badge</label>
                      <input
                        type="text"
                        value={siteContent.heroBadge || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, heroBadge: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Major Hero Headline</label>
                      <input
                        type="text"
                        value={siteContent.heroHeadline || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, heroHeadline: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-serif text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Brand Positioning Paragraph</label>
                      <textarea
                        rows={3}
                        value={siteContent.heroDescription || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, heroDescription: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-slate-300 font-medium">Primary CTA Button Label</label>
                        <input
                          type="text"
                          value={siteContent.heroCtaPrimary || 'Explore Pure Formulations'}
                          onChange={(e) => setSiteContent({ ...siteContent, heroCtaPrimary: e.target.value })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-slate-300 font-medium">Secondary CTA Button Label</label>
                        <input
                          type="text"
                          value={siteContent.heroCtaSecondary || 'Diagnostic Concerns'}
                          onChange={(e) => setSiteContent({ ...siteContent, heroCtaSecondary: e.target.value })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Formulation Philosophy & Research Story */}
              {siteCmsSubTab === 'PHILOSOPHY' && (
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                    Formulation Philosophy Section (#research-story)
                  </span>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Section Subtitle / Badge</label>
                    <input
                      type="text"
                      value={siteContent.philosophyBadge || 'Formulation Philosophy'}
                      onChange={(e) => setSiteContent({ ...siteContent, philosophyBadge: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Philosophy Major Headline</label>
                    <input
                      type="text"
                      value={siteContent.philosophyTitle || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, philosophyTitle: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-serif text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Philosophy Core Explanation</label>
                    <textarea
                      rows={3}
                      value={siteContent.philosophyDescription || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, philosophyDescription: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <label className="block text-amber-400 font-bold">Research Pillar 1</label>
                      <input
                        type="text"
                        value={siteContent.philosophyCard1Title || 'Active Stabilization Research'}
                        onChange={(e) => setSiteContent({ ...siteContent, philosophyCard1Title: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        placeholder="Card 1 Title"
                      />
                      <textarea
                        rows={2}
                        value={siteContent.philosophyCard1Text || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, philosophyCard1Text: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                        placeholder="Card 1 Text"
                      />
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <label className="block text-amber-400 font-bold">Research Pillar 2</label>
                      <input
                        type="text"
                        value={siteContent.philosophyCard2Title || 'Zero Synthetic Compromises'}
                        onChange={(e) => setSiteContent({ ...siteContent, philosophyCard2Title: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        placeholder="Card 2 Title"
                      />
                      <textarea
                        rows={2}
                        value={siteContent.philosophyCard2Text || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, philosophyCard2Text: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                        placeholder="Card 2 Text"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: Apiary Sourcing & Traceability */}
              {siteCmsSubTab === 'SOURCING' && (
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                    Traceable Origin & Apiaries (#producer-spotlight)
                  </span>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Sourcing Subtitle / Badge</label>
                    <input
                      type="text"
                      value={siteContent.sourcingBadge || 'Traceable Origin & Sourcing'}
                      onChange={(e) => setSiteContent({ ...siteContent, sourcingBadge: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Sourcing Section Headline</label>
                    <input
                      type="text"
                      value={siteContent.sourcingTitle || 'Ethical Apiaries & Artisanal Extraction Laboratories'}
                      onChange={(e) => setSiteContent({ ...siteContent, sourcingTitle: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-serif text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Sourcing Narrative Description</label>
                    <textarea
                      rows={3}
                      value={siteContent.sourcingDescription || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, sourcingDescription: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Call to Action Button Text</label>
                    <input
                      type="text"
                      value={siteContent.sourcingCtaText || 'Explore Pure Formulations'}
                      onChange={(e) => setSiteContent({ ...siteContent, sourcingCtaText: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Tab 4: Patron Reviews & Stories */}
              {siteCmsSubTab === 'TESTIMONIALS' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                        Patron Stories & Real Skin Transformations (#stories)
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">Manage customer review cards displayed on the storefront</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenAddTestimonial}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Patron Story</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Stories Section Header</label>
                      <input
                        type="text"
                        value={siteContent.storiesTitle || 'Real Skin Transformations'}
                        onChange={(e) => setSiteContent({ ...siteContent, storiesTitle: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Stories Section Subtitle</label>
                      <input
                        type="text"
                        value={siteContent.storiesSubtitle || 'Patrons sharing visible results from pure botanical research routines.'}
                        onChange={(e) => setSiteContent({ ...siteContent, storiesSubtitle: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {(siteContent.testimonials || []).map((t, idx) => (
                      <div
                        key={t.id || idx}
                        className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(t.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-xs text-slate-400 ml-2 font-mono">({t.rating || 5}/5)</span>
                          </div>
                          <p className="font-serif italic text-white text-sm">"{t.quote}"</p>
                          <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[11px] pt-1">
                            <span className="font-semibold text-slate-200">{t.name}</span>
                            <span>•</span>
                            <span>{t.city}</span>
                            {t.product && (
                              <>
                                <span>•</span>
                                <span className="text-amber-400/90 font-medium truncate">Used: {t.product}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditTestimonial(t)}
                            className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800 transition-colors"
                            title="Edit Review"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 rounded-xl border border-slate-800 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Tab 5: Coupons & Promo Codes */}
              {siteCmsSubTab === 'COUPONS' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                        Promotional Coupons & Store Offers
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">Create discount codes for customer checkouts</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenAddCoupon}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Promo Code</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {(siteContent.coupons || []).map((cpn) => (
                      <div
                        key={cpn.code}
                        className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-amber-500/30">
                              {cpn.code}
                            </span>
                            <span className="text-xs font-bold text-white">{cpn.discountPct}% OFF</span>
                          </div>
                          <p className="text-xs text-slate-300">{cpn.description || 'Special formulation offer'}</p>
                          <p className="text-[11px] text-slate-500 font-mono">Min Order: ₹{cpn.minOrder || 0}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleCoupon(cpn.code)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                              cpn.active
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {cpn.active ? 'ACTIVE' : 'PAUSED'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCoupon(cpn.code)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Tab 6: Concierge & UPI Gateways */}
              {siteCmsSubTab === 'GATEWAYS' && (
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <span className="font-mono uppercase text-[10px] text-emerald-400 font-bold block">
                    Concierge Routing, Contacts & UPI Gateway
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">WhatsApp Phone (+CountryCode)</label>
                      <input
                        type="text"
                        value={siteContent.whatsappNumber || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, whatsappNumber: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                        placeholder="+919963075000"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Customer Care Email</label>
                      <input
                        type="email"
                        value={siteContent.supportEmail || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, supportEmail: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                        placeholder="care@goodbee.in"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">UPI VPA Address</label>
                      <input
                        type="text"
                        value={siteContent.upiVpa || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, upiVpa: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                        placeholder="goodbee.official@okaxis"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Merchant Display Name</label>
                      <input
                        type="text"
                        value={siteContent.payeeName || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, payeeName: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                        placeholder="GOOD BEE Skincare Laboratory"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">WhatsApp Default Greeting Message</label>
                    <input
                      type="text"
                      value={siteContent.whatsappGreeting || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, whatsappGreeting: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                      placeholder="Hello Good Bee Concierge, I would like guidance on pure skincare formulations."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Studio / Apiary Physical Address</label>
                      <input
                        type="text"
                        value={siteContent.storeAddress || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, storeAddress: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                        placeholder="Survey No. 42, Western Ghats Botanical Reserve, Wayanad / Bengaluru Studio"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-300 font-medium">Customer Support Hours</label>
                      <input
                        type="text"
                        value={siteContent.operatingHours || ''}
                        onChange={(e) => setSiteContent({ ...siteContent, operatingHours: e.target.value })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                        placeholder="Mon – Sat: 9:30 AM – 7:00 PM IST"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Main Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl uppercase tracking-wider text-xs transition-colors shadow-sm"
                >
                  Publish All Site Content Live
                </button>
                <span className="text-[11px] text-slate-500">Updates sync instantly to all storefront visitors</span>
              </div>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
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

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-slate-300 font-medium">Subtitle / Botanical Extraction Claim</label>
                  <input
                    type="text"
                    value={activeProductForm.subtitle || ''}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, subtitle: e.target.value })}
                    placeholder="e.g. 100% Natural Steam-Distilled Resin Extract"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Category with Custom Option */}
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
                    placeholder="e.g. 100 g / 3.5 oz. or 100 ml"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {activeProductForm.category === 'Custom Category...' && (
                <div>
                  <label className="block mb-1 text-amber-400 font-medium">Custom Category Name</label>
                  <input
                    type="text"
                    required
                    value={activeProductForm.customCategory || ''}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, customCategory: e.target.value })}
                    placeholder="e.g. Artisanal Body Elixirs"
                    className="w-full p-2.5 bg-slate-950 border border-amber-500 rounded-xl text-white focus:outline-none"
                  />
                </div>
              )}

              {/* Promotional Badge */}
              <div>
                <label className="block mb-1.5 text-slate-300 font-medium">Promotional Badge</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['100% Natural', 'Bestseller', 'New Formulation', 'Limited Batch', 'Traditional Heritage', 'Award Winner'].map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => setActiveProductForm({ ...activeProductForm, badge })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                        activeProductForm.badge === badge
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={activeProductForm.badge || ''}
                  onChange={(e) => setActiveProductForm({ ...activeProductForm, badge: e.target.value })}
                  placeholder="Or enter custom badge text"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              {/* Price, MRP, Stock, Low Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Alert Level &le;</label>
                  <input
                    type="number"
                    value={activeProductForm.lowStockThreshold || 10}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, lowStockThreshold: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-400 font-mono text-sm focus:outline-none focus:border-amber-400"
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
                  rows={2}
                  value={activeProductForm.description}
                  onChange={(e) => setActiveProductForm({ ...activeProductForm, description: e.target.value })}
                  placeholder="Detail the active stabilization and benefits..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Daily Application Ritual (How to Use)</label>
                  <textarea
                    rows={2}
                    value={activeProductForm.ritual || ''}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, ritual: e.target.value })}
                    placeholder="e.g. Warm 2 drops in palms and press into skin."
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Research Verification Note</label>
                  <textarea
                    rows={2}
                    value={activeProductForm.researchNotes || ''}
                    onChange={(e) => setActiveProductForm({ ...activeProductForm, researchNotes: e.target.value })}
                    placeholder="e.g. Gas chromatography batch purity verified."
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
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

      {/* TESTIMONIAL CREATE / EDIT MODAL */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">
                {testimonialModalMode === 'CREATE' ? 'Add New Patron Story' : 'Edit Patron Review'}
              </h3>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Patron Name</label>
                  <input
                    type="text"
                    required
                    value={activeTestimonialForm.name}
                    onChange={(e) => setActiveTestimonialForm({ ...activeTestimonialForm, name: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    placeholder="e.g. Kavita Menon"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">City / Location</label>
                  <input
                    type="text"
                    required
                    value={activeTestimonialForm.city}
                    onChange={(e) => setActiveTestimonialForm({ ...activeTestimonialForm, city: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    placeholder="e.g. Bengaluru"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-medium">Formulation Used</label>
                <input
                  type="text"
                  value={activeTestimonialForm.product}
                  onChange={(e) => setActiveTestimonialForm({ ...activeTestimonialForm, product: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  placeholder="e.g. Good Bee Frankincense Pure Essential Oil"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-medium">Star Rating (1 - 5)</label>
                <select
                  value={activeTestimonialForm.rating}
                  onChange={(e) => setActiveTestimonialForm({ ...activeTestimonialForm, rating: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-medium">Review Quote</label>
                <textarea
                  rows={3}
                  required
                  value={activeTestimonialForm.quote}
                  onChange={(e) => setActiveTestimonialForm({ ...activeTestimonialForm, quote: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed"
                  placeholder="Share the visible skin result..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPON CREATE MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Create Promo Discount Code</h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-300 font-medium">Coupon Code (e.g. WELCOME15)</label>
                <input
                  type="text"
                  required
                  value={activeCouponForm.code}
                  onChange={(e) => setActiveCouponForm({ ...activeCouponForm, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-slate-950 border border-amber-500 rounded-xl text-amber-300 font-mono font-bold text-sm"
                  placeholder="WELCOME15"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Discount (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={activeCouponForm.discountPct}
                    onChange={(e) => setActiveCouponForm({ ...activeCouponForm, discountPct: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Min Order (₹)</label>
                  <input
                    type="number"
                    value={activeCouponForm.minOrder}
                    onChange={(e) => setActiveCouponForm({ ...activeCouponForm, minOrder: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-medium">Offer Description</label>
                <input
                  type="text"
                  value={activeCouponForm.description}
                  onChange={(e) => setActiveCouponForm({ ...activeCouponForm, description: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  placeholder="15% off on your first order"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
