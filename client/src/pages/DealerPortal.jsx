import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoodBeeApi } from '../services/api';
import {
  Package,
  TrendingUp,
  ShoppingBag,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  Check,
  Search,
  Filter,
  Download,
  Clock,
  Truck,
  CheckCircle2,
  FileText,
  Plus,
  Minus,
  Sparkles,
  Percent
} from 'lucide-react';

export default function DealerPortal({ onNavigateHome }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('CATALOG'); // 'CATALOG' | 'PO_DRAFT' | 'ORDERS'

  // B2B PO Cart State: { [productId]: quantity }
  const [poQuantities, setPoQuantities] = useState({});
  const [poCart, setPoCart] = useState([]);
  const [orderNotice, setOrderNotice] = useState('');
  const [generatedPo, setGeneratedPo] = useState(null);

  // Past Purchase Orders History
  const [pastOrders, setPastOrders] = useState([
    {
      id: 'GB-PO-2026-9402',
      date: '24 Oct 2026',
      totalUnits: 75,
      subtotal: 32450,
      gst: 5841,
      totalAmount: 38291,
      status: 'DISPATCHED',
      courier: 'BlueDart Express',
      trackingNo: 'BD-98234120',
      paymentTerms: 'Net-30 (Due 24 Nov 2026)',
      items: [
        { title: 'Good Bee Donkey Milk & Saffron Soap', qty: 30, wholesalePrice: 380 },
        { title: 'Good Bee Frankincense Pure Essential Oil', qty: 15, wholesalePrice: 1087 },
        { title: 'Good Bee Pink Lotus Hydrosol Mist', qty: 30, wholesalePrice: 629 }
      ]
    },
    {
      id: 'GB-PO-2026-8819',
      date: '10 Oct 2026',
      totalUnits: 120,
      subtotal: 51200,
      gst: 9216,
      totalAmount: 60416,
      status: 'DELIVERED',
      courier: 'Delhivery Logistics',
      trackingNo: 'DL-44810294',
      paymentTerms: 'Net-30 (Settled)',
      items: [
        { title: 'Good Bee Rosemary Pure Essential Extract', qty: 40, wholesalePrice: 712 },
        { title: 'Good Bee Sunnipindi Cold Processed Bar', qty: 50, wholesalePrice: 299 },
        { title: 'Good Bee Clear Skin Cold Processed Soap', qty: 30, wholesalePrice: 337 }
      ]
    }
  ]);

  // Load all 19 products
  useEffect(() => {
    setLoading(true);
    GoodBeeApi.fetchProducts({})
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          // Initialize MOQ of 10 for each product
          const initialQ = {};
          data.forEach((p) => {
            initialQ[p.id] = 10;
          });
          setPoQuantities(initialQ);
        }
      })
      .catch((err) => console.error('Error fetching wholesale products:', err))
      .finally(() => setLoading(false));
  }, []);

  // Compute wholesale price based on quantity tier
  // Tier 1: 5 - 24 units => 25% discount off MRP
  // Tier 2: 25 - 49 units => 30% discount off MRP
  // Tier 3: 50+ units => 35% discount off MRP
  const getWholesaleRate = (product, qty) => {
    const baseMrp = product.mrp || Math.round(product.price * 1.25);
    let discountPct = 0.25;
    if (qty >= 50) discountPct = 0.35;
    else if (qty >= 25) discountPct = 0.30;

    const unitPrice = Math.round(baseMrp * (1 - discountPct));
    return {
      unitPrice,
      baseMrp,
      discountPct: Math.round(discountPct * 100),
      savingsPerUnit: baseMrp - unitPrice
    };
  };

  const handleQtyChange = (productId, delta) => {
    setPoQuantities((prev) => {
      const current = prev[productId] || 10;
      const next = Math.max(5, current + delta); // Minimum MOQ is 5 units
      return { ...prev, [productId]: next };
    });
  };

  const handleSetExactQty = (productId, value) => {
    const val = parseInt(value, 10);
    setPoQuantities((prev) => ({
      ...prev,
      [productId]: isNaN(val) ? 5 : Math.max(5, val)
    }));
  };

  const handleAddProductToPo = (product) => {
    const qty = poQuantities[product.id] || 10;
    const rateInfo = getWholesaleRate(product, qty);

    setPoCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = { product, qty, rateInfo };
        return copy;
      }
      return [...prev, { product, qty, rateInfo }];
    });

    setOrderNotice(`Added ${qty} units of ${product.title} to B2B PO draft.`);
    setTimeout(() => setOrderNotice(''), 3500);
  };

  const handleRemoveFromPo = (productId) => {
    setPoCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // PO Totals
  const totalUnitsInPo = poCart.reduce((sum, item) => sum + item.qty, 0);
  const subtotalInPo = poCart.reduce(
    (sum, item) => sum + item.qty * item.rateInfo.unitPrice,
    0
  );
  const retailValueInPo = poCart.reduce(
    (sum, item) => sum + item.qty * item.rateInfo.baseMrp,
    0
  );
  const totalMarginSaved = retailValueInPo - subtotalInPo;
  const gstAmount = Math.round(subtotalInPo * 0.18);
  const grandTotal = subtotalInPo + gstAmount;

  const handleGenerateOfficialPo = () => {
    if (poCart.length === 0) return;

    const newPoId = `GB-PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newPoId,
      date: 'Today, Just Now',
      totalUnits: totalUnitsInPo,
      subtotal: subtotalInPo,
      gst: gstAmount,
      totalAmount: grandTotal,
      status: 'PROCESSING',
      courier: 'Pending Regional Dispatch',
      trackingNo: 'Pending Assignment',
      paymentTerms: 'Net-30 Invoice Dispatched',
      items: poCart.map((it) => ({
        title: it.product.title,
        qty: it.qty,
        wholesalePrice: it.rateInfo.unitPrice
      }))
    };

    setPastOrders([newOrder, ...pastOrders]);
    setGeneratedPo(newOrder);
    setPoCart([]);
    setActiveTab('ORDERS');
    setOrderNotice(`Purchase Order ${newPoId} submitted successfully! Net-30 proforma generated.`);
    setTimeout(() => setOrderNotice(''), 5000);
  };

  // Filter products
  const categoriesList = ['All', ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.ingredients?.some((ing) => ing.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-8 sm:py-10 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header / Account Credentials Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#5B0868] text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5B0868] px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                  Regional B2B Wholesale Portal
                </span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Net-30 Approved
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold mt-1">
                {user?.companyName || 'Maharashtra & Western India Stockist Hub'}
              </h1>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Dealer ID: <span className="font-mono text-gray-800 font-semibold">{user?.dealerCode || 'GB-DLR-MUM-892'}</span> • GSTIN:{' '}
                <span className="font-mono text-gray-800 font-semibold">{user?.gstNumber || '27AABCU9603R1ZM'}</span> • Priority Cold-Storage Sourcing
              </p>
            </div>
          </div>

          {/* Quick Credit Limit & Margin Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl text-right flex-1 sm:flex-none min-w-[140px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B0868] block">
                Approved Credit Line
              </span>
              <span className="text-lg font-black text-gray-900 font-sans">
                ₹2,50,000
              </span>
              <span className="text-[10px] text-emerald-700 font-medium block">
                ₹1,84,200 Available
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-right flex-1 sm:flex-none min-w-[140px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                Wholesale Margin
              </span>
              <span className="text-lg font-black text-amber-900 font-sans">
                Up to 35% Off
              </span>
              <span className="text-[10px] text-amber-800 font-medium block">
                Tiered Volume Rebate
              </span>
            </div>
          </div>
        </div>

        {/* Action Notice Banner */}
        {orderNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{orderNotice}</span>
            </div>
            {poCart.length > 0 && activeTab !== 'PO_DRAFT' && (
              <button
                onClick={() => setActiveTab('PO_DRAFT')}
                className="text-emerald-800 underline font-bold hover:text-emerald-950 text-xs ml-4"
              >
                View Draft PO ({poCart.length}) →
              </button>
            )}
          </div>
        )}

        {/* Tab Navigation: Catalog, Active PO Draft, Order History */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('CATALOG')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'CATALOG'
                  ? 'bg-[#5B0868] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Wholesale Formulation Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('PO_DRAFT')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 relative ${
                activeTab === 'PO_DRAFT'
                  ? 'bg-[#5B0868] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Active PO Draft</span>
              {poCart.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-black flex items-center justify-center">
                  {poCart.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ORDERS'
                  ? 'bg-[#5B0868] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Purchase Order History & Invoices ({pastOrders.length})</span>
            </button>
          </div>

          <span className="hidden lg:inline-block text-xs font-semibold text-gray-500">
            Min Order Quantity: <span className="text-[#5B0868] font-bold">5 Units / SKU</span>
          </span>
        </div>

        {/* TAB 1: WHOLESALE CATALOG */}
        {activeTab === 'CATALOG' && (
          <div className="space-y-6">
            
            {/* Search & Category Filter Pills */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search formulations, SKUs, botanical actives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#5B0868] shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#5B0868] text-white font-bold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Rebate Tier Info Strip */}
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-purple-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#5B0868] font-bold">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>Automated Volume Discount Tiers Applied at Checkout:</span>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <span className="px-2.5 py-1 bg-white rounded-lg border border-purple-200 font-medium">
                  5 - 24 units: <strong className="text-purple-800">25% Off MSRP</strong>
                </span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-pink-200 font-medium">
                  25 - 49 units: <strong className="text-rose-800">30% Off MSRP</strong>
                </span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-amber-200 font-medium">
                  50+ units: <strong className="text-amber-800 font-black">35% Off MSRP</strong>
                </span>
              </div>
            </div>

            {/* 19-Product Formulation Grid */}
            {loading ? (
              <div className="py-20 text-center text-sm text-gray-500">
                Loading all fresh Good Bee formulation batches...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-500 bg-white rounded-3xl border border-gray-200">
                No formulations found matching "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const currentQty = poQuantities[p.id] || 10;
                  const rate = getWholesaleRate(p, currentQty);

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-3xl border border-gray-200 p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-16 h-16 rounded-2xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = '/assets/goodbee-skincare-hero.jpg';
                            }}
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-50 text-[#5B0868] border border-purple-100 inline-block mb-1">
                              {p.category}
                            </span>
                            <h3 className="font-serif text-base font-semibold text-gray-900 truncate">
                              {p.title}
                            </h3>
                            <p className="text-[11px] text-gray-500 font-mono">
                              SKU: {p.sku || `GB-${p.id.substring(0, 6).toUpperCase()}`}
                            </p>
                          </div>
                        </div>

                        {/* Pricing Breakdown Card */}
                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-gray-400 block font-medium">Public MSRP:</span>
                            <span className="text-gray-500 line-through font-semibold text-xs">
                              ₹{rate.baseMrp}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#5B0868] font-bold block">
                              Dealer Rate ({rate.discountPct}% Off):
                            </span>
                            <span className="text-sm font-extrabold text-emerald-800">
                              ₹{rate.unitPrice} <span className="text-[10px] text-gray-500 font-normal">/ unit</span>
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 font-sans line-clamp-2 leading-relaxed">
                          {p.shortDescription || p.subtitle}
                        </p>
                      </div>

                      {/* Bulk Quantity Selector & Add to PO Action */}
                      <div className="pt-3 border-t border-gray-100 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-gray-700">Order Quantity:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleQtyChange(p.id, -5)}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
                              title="Decrease 5 units"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="5"
                              step="5"
                              value={currentQty}
                              onChange={(e) => handleSetExactQty(p.id, e.target.value)}
                              className="w-14 text-center py-1 rounded-lg border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5B0868]"
                            />
                            <button
                              onClick={() => handleQtyChange(p.id, 5)}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
                              title="Increase 5 units"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Total Batch Cost:</span>
                          <span className="font-bold text-gray-900 text-sm">
                            ₹{(rate.unitPrice * currentQty).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddProductToPo(p)}
                          className="w-full py-2.5 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add {currentQty} Units to PO</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE B2B PURCHASE ORDER DRAFT */}
        {activeTab === 'PO_DRAFT' && (
          <div className="space-y-6">
            {poCart.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-[#5B0868] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">Your B2B PO Draft is Empty</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Browse the Wholesale Formulation Catalog and add bulk units with automated volume discount tiers.
                </p>
                <button
                  onClick={() => setActiveTab('CATALOG')}
                  className="px-6 py-2.5 bg-[#5B0868] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Return to Wholesale Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* PO Items Table (Col 8) */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="font-serif text-xl font-bold text-gray-900">
                      Draft Purchase Order Items ({poCart.length} SKUs)
                    </h3>
                    <button
                      onClick={() => setPoCart([])}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Clear Draft
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {poCart.map((item) => (
                      <div key={item.product.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {item.product.title}
                            </h4>
                            <p className="text-xs text-gray-500 font-mono">
                              SKU: {item.product.sku || 'GB-ACTIVE'} • {item.qty} Units
                            </p>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                              {item.rateInfo.discountPct}% Volume Discount
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-6">
                          <div>
                            <span className="text-xs text-gray-400 block line-through">
                              ₹{(item.rateInfo.baseMrp * item.qty).toLocaleString('en-IN')}
                            </span>
                            <span className="text-base font-bold text-gray-900 font-sans">
                              ₹{(item.rateInfo.unitPrice * item.qty).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveFromPo(item.product.id)}
                            className="text-gray-400 hover:text-rose-600 p-1 rounded-lg"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PO Financial Settlement Summary (Col 4) */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
                  <h3 className="font-serif text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                    Wholesale Proforma Settlement
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Units:</span>
                      <span className="font-bold text-gray-900">{totalUnitsInPo} Units</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Retail Public MSRP Value:</span>
                      <span className="line-through text-gray-400">
                        ₹{retailValueInPo.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Your Wholesale Margin Savings:</span>
                      <span>- ₹{totalMarginSaved.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Wholesale Subtotal:</span>
                      <span className="font-bold text-gray-900">
                        ₹{subtotalInPo.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>GST @ 18% (Input Tax Credit):</span>
                      <span className="font-bold text-gray-900">
                        ₹{gstAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                      <span>Total Invoice Payable:</span>
                      <span className="text-lg text-[#5B0868]">
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-[#5B0868] space-y-1">
                    <span className="font-bold block">Payment Terms: Net-30 Settlement</span>
                    <p className="text-[11px] text-gray-600">
                      Invoice will be billed against your ₹2,50,000 active credit facility. Due 30 days after regional warehouse dispatch.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateOfficialPo}
                    className="w-full py-3 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Generate Official PO</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 3: PURCHASE ORDER HISTORY & INVOICES */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                Purchase Order Archive & Proforma Receipts
              </h3>
              <span className="text-xs text-gray-500">B2B Tax Invoices with GST Input Breakdown</span>
            </div>

            <div className="space-y-4">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B0868] flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-mono text-base font-bold text-gray-900">{order.id}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              order.status === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : order.status === 'DISPATCHED'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">Ordered: {order.date} • {order.totalUnits} Units</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-xs text-gray-400 block">Total Invoice:</span>
                        <span className="font-serif text-lg font-bold text-gray-900">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          alert(`Downloading Proforma Invoice PDF for ${order.id}...\n\nDealer: ${user?.companyName || 'Distributor'}\nTotal: ₹${order.totalAmount}\nTerms: ${order.paymentTerms}`);
                        }}
                        className="px-3.5 py-2 bg-gray-50 hover:bg-purple-50 text-[#5B0868] border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Details & Line Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px] mb-1.5">
                        Shipped Formulations:
                      </span>
                      <ul className="space-y-1">
                        {order.items.map((it, idx) => (
                          <li key={idx} className="flex justify-between text-gray-700">
                            <span className="truncate max-w-[240px]">• {it.title}</span>
                            <span className="font-semibold">{it.qty} units × ₹{it.wholesalePrice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-gray-600">
                        <span>Courier Partner:</span>
                        <span className="font-semibold text-gray-800">{order.courier}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Waybill / Tracking:</span>
                        <span className="font-mono font-bold text-blue-700">{order.trackingNo}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Settlement Status:</span>
                        <span className="font-semibold text-emerald-800">{order.paymentTerms}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
