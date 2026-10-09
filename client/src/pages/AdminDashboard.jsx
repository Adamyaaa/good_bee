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
  Truck,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';

export default function AdminDashboard({ onNavigateHome }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('ANALYTICS'); // 'ANALYTICS', 'ORDERS', 'INVENTORY', 'SETTINGS'
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [editStockVal, setEditStockVal] = useState(0);
  const [editPriceVal, setEditPriceVal] = useState(0);

  const [config, setConfig] = useState({
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

      // Load inventory
      const resInv = await fetch('/api/v1/admin/inventory', { headers });
      const invData = await resInv.json();
      setInventory(invData.inventory || []);

      // Load config
      const resConf = await fetch('/api/v1/config/admin', { headers });
      const confData = await resConf.json();
      if (confData.config) setConfig(confData.config);
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

  const handleSaveInventoryItem = async (id) => {
    try {
      const res = await fetch(`/api/v1/admin/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stock: Number(editStockVal),
          price: Number(editPriceVal)
        })
      });

      if (res.ok) {
        setActionSuccess('Inventory stock and price updated successfully.');
        setEditingInventoryId(null);
        setTimeout(() => setActionSuccess(''), 3000);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/config/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      setActionSuccess(data.message || 'Settings saved successfully');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Error updating configuration');
    }
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'PROCESSING').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Professional Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/good-bee-logo.png"
            alt="Good Bee Emblem"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-amber-500/40 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">
                Store Control Tower
              </span>
              <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] bg-slate-800 border border-slate-700 text-slate-300 rounded font-mono">
                Storefront v1.0
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
            { id: 'INVENTORY', label: 'Catalog & Stock Matrix', icon: Package },
            { id: 'SETTINGS', label: 'Dynamic QR & WhatsApp Gateways', icon: Settings }
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
          <div className="p-3 sm:p-4 bg-emerald-950 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
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
                  {analytics?.metrics?.totalOrders ?? orders.length}
                </div>
                <div className="text-[10px] sm:text-[11px] text-amber-400 mt-1.5 sm:mt-2 font-mono">
                  {pendingOrdersCount} pending
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 sm:p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                  <span>Formulations</span>
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                </div>
                <div className="font-serif text-xl sm:text-3xl font-bold text-white">
                  {inventory.length || 19}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 sm:mt-2 font-mono truncate">
                  100% natural actives
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 sm:p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                  <span>Low Stock</span>
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                </div>
                <div className="font-serif text-xl sm:text-3xl font-bold text-white">
                  {analytics?.metrics?.lowStockAlerts ?? 0}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 sm:mt-2 font-mono">
                  &le; 10 units alert
                </div>
              </div>
            </div>

            {/* Quick Orders Summary */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">Recent Patron Orders</h3>
                  <p className="text-xs text-slate-400">Live order activity across India</p>
                </div>
                <button
                  onClick={() => setActiveTab('ORDERS')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <span>View All Orders ({orders.length})</span>
                  <span>&rarr;</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Patron</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-amber-400">{ord.id}</td>
                        <td className="p-3 text-slate-200">{ord.customerName}</td>
                        <td className="p-3 text-slate-400">
                          {ord.items?.map((it) => `${it.product?.title || 'Item'} (x${it.quantity})`).join(', ') || 'Custom Routine'}
                        </td>
                        <td className="p-3 font-bold text-white">₹{ord.total}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                            {ord.paymentMethod === 'DYNAMIC_UPI_QR' ? 'UPI QR' : 'COD'}
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
          </div>
        )}

        {/* 2. PATRON ORDERS & FULFILMENT TAB (Replaced Producer Queue) */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Patron Orders & Fulfilment</h3>
                <p className="text-xs text-slate-400">
                  Manage shipping status, verify customer delivery addresses, and initiate WhatsApp dispatch alerts.
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
                <p className="text-xs text-slate-500">Orders placed on the storefront will appear here in real-time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const whatsappMsg = encodeURIComponent(
                    `Hello ${ord.customerName}, regarding your Good Bee Order #${ord.id}: Your pure natural formulations are currently being prepared for dispatch.`
                  );
                  const cleanPhone = ord.customerPhone?.replace(/[^0-9]/g, '') || '919963075000';

                  return (
                    <div
                      key={ord.id}
                      className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-colors"
                    >
                      {/* Top Header Row */}
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
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
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

                      {/* Content Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                        
                        {/* Patron Info */}
                        <div className="md:col-span-4 space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                          <span className="font-mono uppercase text-[10px] text-amber-400/80 font-bold block">
                            Patron Delivery Details
                          </span>
                          <p className="font-semibold text-white text-sm">{ord.customerName}</p>
                          <p className="text-slate-300 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>{ord.customerEmail}</span>
                          </p>
                          <p className="text-slate-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>{ord.customerPhone}</span>
                          </p>
                          <p className="text-slate-400 flex items-start gap-1.5 pt-1 border-t border-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0 mt-0.5" />
                            <span>{ord.shippingAddress}</span>
                          </p>

                          <div className="pt-2">
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-1.5 px-3 bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-600/50 text-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium text-[11px]"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>WhatsApp Patron Directly</span>
                            </a>
                          </div>
                        </div>

                        {/* Order Items Breakdown */}
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

                        {/* Total & Action Controls */}
                        <div className="md:col-span-3 flex flex-col justify-between bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                          <div>
                            <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block">
                              Total Order Value
                            </span>
                            <div className="font-serif text-2xl font-bold text-white mt-1">
                              ₹{ord.total}
                            </div>
                            <span className="text-[11px] text-slate-400">Complimentary delivery included</span>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-800">
                            <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                              Update Fulfilment:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'DISPATCHED')}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                                  ord.status === 'DISPATCHED'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                Dispatched
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'DELIVERED')}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors ${
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

        {/* 3. INVENTORY & CATALOG MATRIX */}
        {activeTab === 'INVENTORY' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Catalog & Stock Matrix</h3>
                <p className="text-xs text-slate-400">
                  Update live retail prices and inventory levels for all 19 Good Bee authentic formulations.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Total Products: <span className="font-bold text-amber-400">{inventory.length}</span>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {inventory.map((item) => {
                      const isEditing = editingInventoryId === item.id;

                      return (
                        <tr key={item.id} className="hover:bg-slate-900/50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-10 h-10 object-cover rounded-lg border border-slate-700 flex-shrink-0"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-white">{item.title}</p>
                                <span className="text-[10px] text-slate-400">100% Botanical Actives</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-300">{item.category}</td>
                          <td className="p-3 font-mono text-slate-400 text-[11px]">{item.sku}</td>
                          <td className="p-3 font-bold text-white">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPriceVal}
                                onChange={(e) => setEditPriceVal(e.target.value)}
                                className="w-20 p-1.5 bg-slate-900 border border-amber-500 rounded text-amber-300 font-mono text-xs focus:outline-none"
                              />
                            ) : (
                              <span>₹{item.price}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStockVal}
                                onChange={(e) => setEditStockVal(e.target.value)}
                                className="w-20 p-1.5 bg-slate-900 border border-amber-500 rounded text-amber-300 font-mono text-xs focus:outline-none"
                              />
                            ) : (
                              <span className="font-mono text-slate-200">{item.stock} units</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'IN_STOCK'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : item.status === 'LOW_STOCK'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleSaveInventoryItem(item.id)}
                                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingInventoryId(null)}
                                  className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingInventoryId(item.id);
                                  setEditStockVal(item.stock);
                                  setEditPriceVal(item.price);
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                                title="Edit Stock / Price"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
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
              {inventory.map((item) => {
                const isEditing = editingInventoryId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-700 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-slate-400">{item.sku}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'IN_STOCK'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : item.status === 'LOW_STOCK'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="font-semibold text-white text-xs mt-1 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400">{item.category}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Price</span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPriceVal}
                            onChange={(e) => setEditPriceVal(e.target.value)}
                            className="w-full mt-1 p-1 bg-slate-950 border border-amber-500 rounded text-amber-300 font-mono text-xs focus:outline-none"
                          />
                        ) : (
                          <span className="font-bold text-white text-sm mt-0.5 block">₹{item.price}</span>
                        )}
                      </div>

                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Remaining Stock</span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStockVal}
                            onChange={(e) => setEditStockVal(e.target.value)}
                            className="w-full mt-1 p-1 bg-slate-950 border border-amber-500 rounded text-amber-300 font-mono text-xs focus:outline-none"
                          />
                        ) : (
                          <span className="font-mono text-slate-200 text-sm mt-0.5 block">{item.stock} units</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-1">
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleSaveInventoryItem(item.id)}
                            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingInventoryId(null)}
                            className="w-full py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingInventoryId(item.id);
                            setEditStockVal(item.stock);
                            setEditPriceVal(item.price);
                          }}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-amber-400 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Stock & Price</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. SETTINGS & GATEWAYS TAB */}
        {activeTab === 'SETTINGS' && (
          <div className="max-w-2xl bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Store Gateways & Concierge Routing</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your verified UPI payment address and WhatsApp customer support line.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                  Dynamic UPI Payment Gateway
                </span>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">UPI VPA Address</label>
                  <input
                    type="text"
                    value={config.payment?.upiVpa || ''}
                    onChange={(e) =>
                      setConfig({ ...config, payment: { ...config.payment, upiVpa: e.target.value } })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400 text-white font-mono"
                    placeholder="goodbee.official@okaxis"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">This VPA is encoded into the live checkout QR code.</p>
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Merchant Payee Display Name</label>
                  <input
                    type="text"
                    value={config.payment?.payeeName || ''}
                    onChange={(e) =>
                      setConfig({ ...config, payment: { ...config.payment, payeeName: e.target.value } })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <span className="font-mono uppercase text-[10px] text-emerald-400 font-bold block">
                  WhatsApp Concierge Routing
                </span>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Support Phone Number (International format)</label>
                  <input
                    type="text"
                    value={config.whatsapp?.phoneNumber || ''}
                    onChange={(e) =>
                      setConfig({ ...config, whatsapp: { ...config.whatsapp, phoneNumber: e.target.value } })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400 text-white font-mono"
                    placeholder="+919963075000"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-medium">Initial Concierge Welcome Message</label>
                  <input
                    type="text"
                    value={config.whatsapp?.welcomeMessage || ''}
                    onChange={(e) =>
                      setConfig({ ...config, whatsapp: { ...config.whatsapp, welcomeMessage: e.target.value } })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl uppercase tracking-wider text-xs transition-colors"
              >
                Save Store Configuration
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
