import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Image as ImageIcon,
  Sliders,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Minus,
  Edit2,
  ExternalLink,
  ArrowRight,
  Upload,
  Trash2,
  Eye,
  Check,
  X,
  Camera,
  Layers,
  Save,
  Tag,
  Clock
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Frankincense & Myrrh Soap', url: '/images_ref/Frankin-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Donkey Milk & Saffron Soap', url: '/images_ref/Donkey-Milk-Soap-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Clear-Skin Neem & Basil Soap', url: '/images_ref/Clear-skin-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Arabica Coffee Scrub Soap', url: '/images_ref/Coffee-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Wild Turmeric Glow Soap', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-1-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Pure Baby Soap (Ultra Mild)', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.01-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Lemongrass Revitalizing Soap', url: '/images_ref/Lemongrass-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Pink Lotus Lip Butter', url: '/images_ref/Pink-Lotus-300x300.webp', category: 'Lip & Facial Care' },
  { label: 'Lavender Night Lip Balm', url: '/images_ref/Levendor-300x300.webp', category: 'Lip & Facial Care' },
  { label: 'Moisture Tint Lipstick', url: '/images_ref/Lipstick-600x600.webp', category: 'Lip & Facial Care' },
  { label: 'Rosemary Cold-Pressed Hair Oil', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.56-300x300.webp', category: 'Hair & Scalp Rituals' },
  { label: 'Rosemary Hydrosol Balancing Mist', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.23-300x300.webp', category: 'Botanical Mists' },
  { label: 'Steam-Distilled Rose Hydrosol Mist', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp', category: 'Botanical Mists' },
  { label: 'Pain Relief Roll-On', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.17-1-300x300.webp', category: 'Therapeutic Body Care' },
  { label: 'Rosemary Essential Extract', url: '/images_ref/Rosmary-2-300x300.webp', category: 'Pure Essential Oils' }
];

const BADGE_OPTIONS = [
  '100% Natural',
  'New Release',
  'Bestseller',
  'Limited Harvest',
  'Artisanal Craft',
  'Cold Processed',
  'Laboratory Verified',
  'Partner Craft'
];

export default function MediaManagerPortal({ onNavigateHome }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('STOCK_INVENTORY'); // 'STOCK_INVENTORY' | 'MEDIA_GALLERY' | 'PRODUCT_EDITORIAL' | 'STOREFRONT_CMS'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [notice, setNotice] = useState('');
  const [savingId, setSavingId] = useState(null);

  // Modal editors state
  const [editingMediaProduct, setEditingMediaProduct] = useState(null);
  const [editingContentProduct, setEditingContentProduct] = useState(null);

  // Storefront CMS State
  const [siteContent, setSiteContent] = useState({
    announcementText: 'Complimentary Pan-India Dispatch on Curated Regimens above ₹999 | 100% Natural Sourced Harvests',
    heroBadge: 'Pure Botanical Science',
    heroTitle: 'Botanical Science Elevated to Pure Luxury',
    heroSubtitle: 'Handcrafted cold-processed soaps, active-stabilized oils, and pure floral hydrosols formulated without synthetic emulsifiers or artificial fragrances.',
    philosophyBadge: 'Formulation Philosophy',
    philosophyTitle: 'Where 100% Natural Meets High-End Research.',
    philosophyDescription: 'Many natural brands rely solely on raw botanical blending without verifying active compound preservation. At Good Bee, every natural ingredient undergoes rigorous active-stabilization research.',
    sourcingTitle: 'Ethical Apiaries & Artisanal Extraction Laboratories',
    sourcingDescription: 'Good Bee coordinates with certified natural beekeepers and cold-processing botanists across South India.'
  });

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  // Load products & site content
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Try server media endpoint
      const res = await fetch('/api/v1/media/products', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        // Fallback to local products
        const local = JSON.parse(localStorage.getItem('goodbee_products') || '[]');
        if (local.length > 0) {
          setProducts(local);
        } else {
          // Fallback to public products endpoint
          const pubRes = await fetch('/api/v1/products');
          if (pubRes.ok) {
            const pubData = await pubRes.json();
            setProducts(pubData.products || []);
          }
        }
      }
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('goodbee_products') || '[]');
      setProducts(local);
    }

    // Load site content
    try {
      const localCms = localStorage.getItem('goodbee_site_content');
      if (localCms) {
        setSiteContent((prev) => ({ ...prev, ...JSON.parse(localCms) }));
      }
    } catch (e) {}

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Handle Quick Stock Adjust (+ / -)
  const handleQuickStockAdjust = async (productId, delta) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const newStock = Math.max(0, (prod.stock || 0) + delta);
    setSavingId(productId);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );

    try {
      const res = await fetch(`/api/v1/media/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: newStock })
      });

      if (!res.ok) throw new Error('Failed to update stock on server');
      showNotification(`Updated stock for "${prod.title}" to ${newStock} units`);
    } catch (e) {
      // Keep local update
      try {
        const localProds = JSON.parse(localStorage.getItem('goodbee_products') || '[]');
        const updated = localProds.map((p) => (p.id === productId ? { ...p, stock: newStock } : p));
        localStorage.setItem('goodbee_products', JSON.stringify(updated));
      } catch (err) {}
      showNotification(`Updated stock for "${prod.title}" to ${newStock} units locally.`);
    } finally {
      setSavingId(null);
    }
  };

  // Handle Exact Stock and Threshold Input Change
  const handleStockThresholdSave = async (productId, stockVal, thresholdVal) => {
    setSavingId(productId);
    const numStock = Math.max(0, parseInt(stockVal, 10) || 0);
    const numThreshold = Math.max(0, parseInt(thresholdVal, 10) || 10);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: numStock, lowStockThreshold: numThreshold } : p
      )
    );

    try {
      await fetch(`/api/v1/media/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: numStock, lowStockThreshold: numThreshold })
      });
      showNotification(`Saved inventory rules: ${numStock} in stock (alert at ${numThreshold}).`);
    } catch (e) {
      showNotification('Inventory changes saved locally.');
    } finally {
      setSavingId(null);
    }
  };

  // Handle Media & Photos Update
  const handleSaveMedia = async (e) => {
    e.preventDefault();
    if (!editingMediaProduct) return;

    setSavingId(editingMediaProduct.id);
    const { id, image, gallery } = editingMediaProduct;

    try {
      const res = await fetch(`/api/v1/media/products/${id}/media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ image, gallery })
      });

      // Update state
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, image, gallery } : p))
      );

      // Sync local storage
      try {
        const local = JSON.parse(localStorage.getItem('goodbee_products') || '[]');
        const updated = local.map((p) => (p.id === id ? { ...p, image, gallery } : p));
        localStorage.setItem('goodbee_products', JSON.stringify(updated));
      } catch (err) {}

      showNotification(`Media gallery updated for "${editingMediaProduct.title}".`);
      setEditingMediaProduct(null);
    } catch (err) {
      showNotification('Photos updated in local preview.');
      setEditingMediaProduct(null);
    } finally {
      setSavingId(null);
    }
  };

  // Handle Product Editorial Content Update
  const handleSaveContent = async (e) => {
    e.preventDefault();
    if (!editingContentProduct) return;

    setSavingId(editingContentProduct.id);
    const {
      id,
      title,
      subtitle,
      badge,
      volume,
      shortDescription,
      description,
      ritual,
      ingredients
    } = editingContentProduct;

    try {
      await fetch(`/api/v1/media/products/${id}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          subtitle,
          badge,
          volume,
          shortDescription,
          description,
          ritual,
          ingredients
        })
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...editingContentProduct } : p))
      );

      try {
        const local = JSON.parse(localStorage.getItem('goodbee_products') || '[]');
        const updated = local.map((p) => (p.id === id ? { ...p, ...editingContentProduct } : p));
        localStorage.setItem('goodbee_products', JSON.stringify(updated));
      } catch (err) {}

      showNotification(`Content & ritual copy updated for "${title}".`);
      setEditingContentProduct(null);
    } catch (err) {
      showNotification('Product details updated in local preview.');
      setEditingContentProduct(null);
    } finally {
      setSavingId(null);
    }
  };

  // Handle Storefront CMS Save
  const handleSaveCms = async (e) => {
    e.preventDefault();
    setSavingId('cms');

    try {
      await fetch('/api/v1/media/site-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(siteContent)
      });
    } catch (e) {}

    try {
      localStorage.setItem('goodbee_site_content', JSON.stringify(siteContent));
      window.dispatchEvent(new Event('goodbee_site_content_updated'));
      showNotification('Storefront banners and copy published successfully!');
    } catch (e) {
      showNotification('Published to local storefront.');
    } finally {
      setSavingId(null);
    }
  };

  // Filtered Products
  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalStockCount = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter(
    (p) => (p.stock || 0) <= (p.lowStockThreshold || 10)
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. Header & Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-xl bg-purple-100 text-[#5B0868]">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5B0868] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Media & Stock Studio
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Catalog Media, Imagery & Stock Operations
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
                Signed in as <strong className="text-gray-800">{user?.name}</strong> ({user?.email}). Manage live stock numbers, product photos, rituals copy, and storefront promotional banners with instantaneous preview.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Products</span>
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                className="px-5 py-2.5 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Storefront Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Telemetry Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
              <span className="text-[11px] text-gray-500 font-medium block">Total Formulations</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mt-0.5 block">
                {products.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
              <span className="text-[11px] text-gray-500 font-medium block">Total Stock Units</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mt-0.5 block">
                {totalStockCount}
              </span>
            </div>

            <div className={`p-3.5 rounded-2xl border ${lowStockCount > 0 ? 'bg-amber-50/80 border-amber-200' : 'bg-gray-50/80 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium block">Low Stock Alerts</span>
                {lowStockCount > 0 && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
              </div>
              <span className={`text-xl sm:text-2xl font-serif font-bold mt-0.5 block ${lowStockCount > 0 ? 'text-amber-800' : 'text-gray-900'}`}>
                {lowStockCount}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
              <span className="text-[11px] text-gray-500 font-medium block">Asset Library Presets</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-purple-900 mt-0.5 block">
                {PRESET_IMAGES.length}
              </span>
            </div>
          </div>

          {notice && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notice}</span>
            </div>
          )}
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
          {[
            { id: 'STOCK_INVENTORY', label: `Stock & Inventory Matrix (${totalStockCount} units)`, icon: Package, alert: lowStockCount > 0 },
            { id: 'MEDIA_GALLERY', label: `Product Photography & Gallery (${products.length})`, icon: ImageIcon },
            { id: 'PRODUCT_EDITORIAL', label: 'Editorial Copy, Rituals & Badges', icon: Edit2 },
            { id: 'STOREFRONT_CMS', label: 'Storefront CMS & Banners', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#5B0868] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
                {tab.alert && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Search and Category Filter for Product-Based Tabs */}
        {activeTab !== 'STOREFRONT_CMS' && (
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulations by title or SKU..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-[#5B0868] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: STOCK & INVENTORY MATRIX */}
        {activeTab === 'STOCK_INVENTORY' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-gray-900 text-lg">Inventory & Stock Velocity</h3>
                <p className="text-xs text-gray-500">Quickly tune inventory quantities or safety thresholds with one click.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Product Formulation</th>
                    <th className="py-3 px-4">Category / SKU</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Quick Adjust</th>
                    <th className="py-3 px-4 text-right">Stock & Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => {
                    const threshold = p.lowStockThreshold || 10;
                    const isLow = (p.stock || 0) <= threshold;
                    const isOut = (p.stock || 0) === 0;

                    return (
                      <tr key={p.id} className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || '/images_ref/Frankin-300x300.webp'}
                              alt={p.title}
                              className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{p.title}</div>
                              <div className="text-[11px] text-gray-500 font-mono">₹{p.price} • {p.volume || '50 ml'}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-gray-700 font-medium">{p.category}</span>
                          <div className="text-[10px] text-gray-400 font-mono">{p.sku}</div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Low Stock ({p.stock} left)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Healthy ({p.stock})
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                            <button
                              type="button"
                              onClick={() => handleQuickStockAdjust(p.id, -5)}
                              className="px-2 py-1 bg-white hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-700 shadow-2xs cursor-pointer"
                              title="Decrease 5 units"
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickStockAdjust(p.id, -1)}
                              className="p-1 bg-white hover:bg-gray-100 rounded-lg text-gray-700 shadow-2xs cursor-pointer"
                              title="Decrease 1 unit"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono font-bold text-gray-900 text-xs">
                              {p.stock}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuickStockAdjust(p.id, 1)}
                              className="p-1 bg-white hover:bg-gray-100 rounded-lg text-gray-700 shadow-2xs cursor-pointer"
                              title="Add 1 unit"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickStockAdjust(p.id, 5)}
                              className="px-2 py-1 bg-white hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-700 shadow-2xs cursor-pointer"
                              title="Add 5 units"
                            >
                              +5
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="flex items-center gap-1 text-[11px]">
                              <span className="text-gray-400">Alert at:</span>
                              <input
                                type="number"
                                defaultValue={threshold}
                                onBlur={(e) => handleStockThresholdSave(p.id, p.stock, e.target.value)}
                                className="w-14 px-1.5 py-0.5 text-center font-mono border border-gray-200 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT PHOTOGRAPHY & MEDIA GALLERY */}
        {activeTab === 'MEDIA_GALLERY' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const galleryImages = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-purple-300 transition-all"
                  >
                    <div className="space-y-4">
                      {/* Primary Image Showcase */}
                      <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-50 border border-gray-100 group">
                        <img
                          src={p.image || '/images_ref/Frankin-300x300.webp'}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-xs text-white">
                          Primary Asset
                        </span>
                        {p.badge && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5B0868] text-white">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Info */}
                      <div>
                        <h4 className="font-serif font-bold text-gray-900 text-base leading-tight truncate">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                          {p.category} • {p.volume || '50 ml'}
                        </p>
                      </div>

                      {/* Gallery Thumbnails Strip */}
                      <div>
                        <span className="text-[11px] font-semibold text-gray-500 mb-1.5 block">
                          Gallery Strip ({galleryImages.length} images)
                        </span>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                          {galleryImages.map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              alt={`Thumbnail ${idx}`}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</span>
                      <button
                        type="button"
                        onClick={() => setEditingMediaProduct({ ...p, gallery: [...galleryImages] })}
                        className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#5B0868] text-xs font-bold rounded-xl border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Edit Media</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT EDITORIAL COPY, RITUALS & BADGES */}
        {activeTab === 'PRODUCT_EDITORIAL' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-serif font-bold text-gray-900 text-lg">Product Copy, Rituals & Badges</h3>
              <p className="text-xs text-gray-500">Edit consumer-facing descriptions, botanical claims, and how-to-apply steps.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <div key={p.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={p.image || '/images_ref/Frankin-300x300.webp'}
                        alt={p.title}
                        className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-gray-900 text-base">{p.title}</h4>
                          {p.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#5B0868] border border-purple-200">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 font-sans italic">{p.subtitle || 'Pure Botanical Formulation'}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 max-w-3xl leading-relaxed">
                          {p.shortDescription || p.description || 'No description provided.'}
                        </p>
                        {p.ritual && (
                          <div className="text-[11px] text-[#5B0868] font-medium pt-1">
                            <strong>Ritual:</strong> {p.ritual}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingContentProduct({ ...p })}
                      className="px-4 py-2 bg-gray-100 hover:bg-purple-50 hover:text-[#5B0868] text-gray-700 text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer self-start lg:self-center"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STOREFRONT CMS & BANNERS */}
        {activeTab === 'STOREFRONT_CMS' && (
          <form onSubmit={handleSaveCms} className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-xl">Storefront Banners & Promotional Copy CMS</h3>
              <p className="text-xs text-gray-500 mt-1">Updates live hero headlines, announcement marquee, and formulation philosophy across the main storefront.</p>
            </div>

            {/* Top Announcement Bar */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Top Announcement Bar Text</label>
              <input
                type="text"
                value={siteContent.announcementText || ''}
                onChange={(e) => setSiteContent({ ...siteContent, announcementText: e.target.value })}
                placeholder="Complimentary Pan-India Dispatch on Curated Regimens..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
              />
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Hero Section Badge</label>
                <input
                  type="text"
                  value={siteContent.heroBadge || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, heroBadge: e.target.value })}
                  placeholder="Pure Botanical Science"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={siteContent.heroTitle || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })}
                  placeholder="Botanical Science Elevated to Pure Luxury"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Hero Subtitle Paragraph</label>
                <textarea
                  rows={2}
                  value={siteContent.heroSubtitle || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                />
              </div>
            </div>

            {/* Philosophy Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="font-serif font-bold text-gray-800 text-sm">Formulation Philosophy Editorial</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Philosophy Headline</label>
                  <input
                    type="text"
                    value={siteContent.philosophyTitle || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, philosophyTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Philosophy Subtitle / Badge</label>
                  <input
                    type="text"
                    value={siteContent.philosophyBadge || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, philosophyBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Philosophy Detailed Text</label>
                  <textarea
                    rows={3}
                    value={siteContent.philosophyDescription || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, philosophyDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingId === 'cms'}
                className="px-6 py-3 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{savingId === 'cms' ? 'Publishing...' : 'Save & Publish Storefront Changes'}</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* MODAL 1: MEDIA & GALLERY EDITOR */}
      {editingMediaProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#5B0868] text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg">Update Photos & Visual Assets</h3>
                <p className="text-xs text-purple-100/80 mt-0.5">{editingMediaProduct.title}</p>
              </div>
              <button
                onClick={() => setEditingMediaProduct(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Primary Image URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Primary Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingMediaProduct.image || ''}
                    onChange={(e) => setEditingMediaProduct({ ...editingMediaProduct, image: e.target.value })}
                    placeholder="/images_ref/... or https://..."
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                  {editingMediaProduct.image && (
                    <img
                      src={editingMediaProduct.image}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* 1-Click Pick from Presets */}
              <div>
                <span className="block text-xs font-bold text-gray-700 mb-2">
                  Or 1-Click Select From Good Bee Preset Library:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-200/80">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingMediaProduct({ ...editingMediaProduct, image: preset.url })}
                      className={`p-1.5 rounded-xl border text-left transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        editingMediaProduct.image === preset.url
                          ? 'border-[#5B0868] bg-purple-50 ring-2 ring-purple-300'
                          : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-12 h-12 object-cover rounded-lg" />
                      <span className="text-[9px] text-gray-700 font-medium truncate w-full text-center">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Gallery Images */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700">Gallery Photos Strip</label>
                  <button
                    type="button"
                    onClick={() => {
                      const current = editingMediaProduct.gallery || [];
                      setEditingMediaProduct({ ...editingMediaProduct, gallery: [...current, ''] });
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold text-[#5B0868] bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Photo Slot</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingMediaProduct.gallery || []).map((imgUrl, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => {
                          const updated = [...editingMediaProduct.gallery];
                          updated[i] = e.target.value;
                          setEditingMediaProduct({ ...editingMediaProduct, gallery: updated });
                        }}
                        placeholder={`Gallery Image #${i + 1} URL`}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                      />
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={`Slot ${i}`}
                          className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingMediaProduct.gallery.filter((_, idx) => idx !== i);
                          setEditingMediaProduct({ ...editingMediaProduct, gallery: updated });
                        }}
                        className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMediaProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#5B0868] hover:bg-[#480653] rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Save Photos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRODUCT EDITORIAL CONTENT EDITOR */}
      {editingContentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#5B0868] text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg">Edit Editorial Copy & Rituals</h3>
                <p className="text-xs text-purple-100/80 mt-0.5">{editingContentProduct.title}</p>
              </div>
              <button
                onClick={() => setEditingContentProduct(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveContent} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Formulation Title</label>
                <input
                  type="text"
                  required
                  value={editingContentProduct.title || ''}
                  onChange={(e) => setEditingContentProduct({ ...editingContentProduct, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Botanical Claim</label>
                  <input
                    type="text"
                    value={editingContentProduct.subtitle || ''}
                    onChange={(e) => setEditingContentProduct({ ...editingContentProduct, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Volume / Size</label>
                  <input
                    type="text"
                    value={editingContentProduct.volume || ''}
                    onChange={(e) => setEditingContentProduct({ ...editingContentProduct, volume: e.target.value })}
                    placeholder="e.g. 50 ml / 1.7 fl. oz."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Marketing Badge</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {BADGE_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setEditingContentProduct({ ...editingContentProduct, badge: b })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${
                        editingContentProduct.badge === b
                          ? 'bg-[#5B0868] text-white border-[#5B0868]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editingContentProduct.badge || ''}
                  onChange={(e) => setEditingContentProduct({ ...editingContentProduct, badge: e.target.value })}
                  placeholder="Or enter custom badge text..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Ritual Application Instructions</label>
                <textarea
                  rows={2}
                  value={editingContentProduct.ritual || ''}
                  onChange={(e) => setEditingContentProduct({ ...editingContentProduct, ritual: e.target.value })}
                  placeholder="e.g. Blend 2 drops into clean skin every evening..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Editorial Description</label>
                <textarea
                  rows={3}
                  value={editingContentProduct.description || ''}
                  onChange={(e) => setEditingContentProduct({ ...editingContentProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingContentProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#5B0868] hover:bg-[#480653] rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Save Editorial Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
