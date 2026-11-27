import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Truck,
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Search,
  Filter,
  Check,
  X,
  ChevronRight,
  RefreshCw,
  Bell,
  User,
  ShieldCheck,
  ExternalLink,
  Navigation,
  FileText,
  AlertCircle,
  HelpCircle,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

const FAILURE_REASONS = [
  'Customer Unavailable / Door Locked',
  'Incorrect / Incomplete Address',
  'Customer Requested Reschedule',
  'Customer Refused Package',
  'Severe Weather / Road Inaccessible',
  'Contact Number Unreachable'
];

export default function DeliveryPartnerPortal({ onNavigateHome }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'DELIVERIES' | 'HISTORY' | 'NOTIFICATIONS' | 'PROFILE'
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Core Data
  const [stats, setStats] = useState({
    totalAssigned: 0,
    readyForPickup: 0,
    inTransit: 0,
    delivered: 0,
    failed: 0,
    unreadNotifsCount: 0
  });
  const [deliveries, setDeliveries] = useState([]);
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState({
    name: user?.name || 'Kabir Verma',
    email: user?.email || 'delivery@goodbee.com',
    phone: user?.phone || '+91 99630 75006',
    partnerCode: 'DEL-2026-001',
    vehicleType: 'Electric Scooter (Ather 450X)',
    vehicleNumber: 'MH-02-EE-4921',
    deliveryZone: 'South Mumbai Central Hub',
    dutyStatus: 'ON_DUTY',
    accountStatus: 'ACTIVE'
  });

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [failureModalDelivery, setFailureModalDelivery] = useState(null);
  const [failureReason, setFailureReason] = useState(FAILURE_REASONS[0]);
  const [failureRemarks, setFailureRemarks] = useState('');

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  // Fetch all delivery partner data
  const loadPartnerData = async () => {
    setLoading(true);
    try {
      // 1. Dashboard & stats
      const dashRes = await fetch('/api/v1/delivery/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (dashRes.ok) {
        const dData = await dashRes.json();
        setStats(dData.stats || {});
      }

      // 2. Assigned deliveries
      const delRes = await fetch('/api/v1/delivery/deliveries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (delRes.ok) {
        const delData = await delRes.json();
        setDeliveries(delData.deliveries || []);
      }

      // 3. Delivery History
      const histRes = await fetch('/api/v1/delivery/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (histRes.ok) {
        const hData = await histRes.json();
        setHistory(hData.history || []);
      }

      // 4. Notifications
      const notifRes = await fetch('/api/v1/delivery/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (notifRes.ok) {
        const nData = await notifRes.json();
        setNotifications(nData.notifications || []);
      }

      // 5. Profile
      const profRes = await fetch('/api/v1/delivery/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (profRes.ok) {
        const pData = await profRes.json();
        if (pData.profile) setProfile(pData.profile);
      }
    } catch (e) {
      console.warn('[DeliveryPortal] Fallback to local sync', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartnerData();
  }, [token]);

  // Status Action: Confirm Package Pickup
  const handleConfirmPickup = async (assignmentId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/delivery/deliveries/${assignmentId}/pickup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to confirm pickup');

      showNotification(data.message || 'Package pickup confirmed!');
      loadPartnerData();
      if (selectedDelivery?.id === assignmentId) {
        setSelectedDelivery((prev) => ({ ...prev, deliveryStatus: 'PICKED_UP' }));
      }
    } catch (err) {
      showNotification(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Status Action: Mark Out For Delivery
  const handleMarkOutForDelivery = async (assignmentId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/delivery/deliveries/${assignmentId}/dispatch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch package');

      showNotification(data.message || 'Order is now Out for Delivery!');
      loadPartnerData();
      if (selectedDelivery?.id === assignmentId) {
        setSelectedDelivery((prev) => ({ ...prev, deliveryStatus: 'OUT_FOR_DELIVERY' }));
      }
    } catch (err) {
      showNotification(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Status Action: Confirm Delivered
  const handleConfirmDelivered = async (assignmentId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/delivery/deliveries/${assignmentId}/delivered`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ deliveryNotes: 'Handed directly to recipient.' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to confirm delivery');

      showNotification(data.message || 'Delivery marked as successful!');
      loadPartnerData();
      setSelectedDelivery(null);
    } catch (err) {
      showNotification(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Status Action: Report Failed Delivery
  const handleReportFailed = async (e) => {
    e.preventDefault();
    if (!failureModalDelivery) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/delivery/deliveries/${failureModalDelivery.id}/fail`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          failureReason,
          failureRemarks
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit report');

      showNotification(data.message || 'Unsuccessful delivery recorded and flagged for review.');
      setFailureModalDelivery(null);
      setFailureRemarks('');
      loadPartnerData();
      setSelectedDelivery(null);
    } catch (err) {
      showNotification(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Duty Status Toggle
  const handleToggleDuty = async () => {
    const nextStatus = profile.dutyStatus === 'ON_DUTY' ? 'OFF_DUTY' : 'ON_DUTY';
    setProfile((prev) => ({ ...prev, dutyStatus: nextStatus }));
    try {
      await fetch('/api/v1/delivery/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ dutyStatus: nextStatus })
      });
      showNotification(`Driver status changed to: ${nextStatus === 'ON_DUTY' ? 'On Duty' : 'Off Duty'}`);
    } catch (e) {}
  };

  // Mark single notification read
  const handleMarkNotificationRead = async (notifId, targetOrderId) => {
    try {
      await fetch(`/api/v1/delivery/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
      );
      if (targetOrderId) {
        const found = deliveries.find((d) => d.orderId === targetOrderId || d.id === targetOrderId);
        if (found) {
          setSelectedDelivery(found);
        } else {
          setActiveTab('DELIVERIES');
          setSearchQuery(targetOrderId);
        }
      }
    } catch (e) {}
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = async () => {
    try {
      await fetch('/api/v1/delivery/notifications/mark-all-read', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showNotification('All notifications marked as read.');
    } catch (e) {}
  };

  // Filtered Deliveries List
  const filteredDeliveries = deliveries.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      d.orderId?.toLowerCase().includes(q) ||
      d.customerName?.toLowerCase().includes(q) ||
      d.shippingAddress?.city?.toLowerCase().includes(q) ||
      d.shippingAddress?.pincode?.includes(q);

    let matchesStatus = true;
    if (statusFilter === 'READY_FOR_PICKUP') {
      matchesStatus = d.deliveryStatus === 'READY_FOR_PICKUP';
    } else if (statusFilter === 'PICKED_UP') {
      matchesStatus = d.deliveryStatus === 'PICKED_UP';
    } else if (statusFilter === 'OUT_FOR_DELIVERY') {
      matchesStatus = d.deliveryStatus === 'OUT_FOR_DELIVERY';
    } else if (statusFilter === 'PREPARING') {
      matchesStatus = d.deliveryStatus === 'WAITING_FOR_PICKUP';
    } else if (statusFilter === 'FAILED') {
      matchesStatus = d.deliveryStatus === 'FAILED';
    }

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">

        {/* 1. Header Banner with Driver Duty Switch & Notification Indicator */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-xl bg-sky-100 text-sky-800">
                  <Truck className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  Fleet & Logistics Console
                </span>
                <span className="text-[11px] font-mono text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-lg">
                  ID: {profile.partnerCode}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Delivery Partner Operations
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
                Signed in as <strong className="text-gray-800">{profile.name}</strong> • {profile.deliveryZone} ({profile.vehicleType})
              </p>
            </div>

            {/* Top Action Utilities: Duty Toggle, Notifications, Refresh */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Duty Toggle Pill */}
              <button
                type="button"
                onClick={handleToggleDuty}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer shadow-2xs ${
                  profile.dutyStatus === 'ON_DUTY'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${profile.dutyStatus === 'ON_DUTY' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                <span>{profile.dutyStatus === 'ON_DUTY' ? 'On Duty (Active)' : 'Off Duty'}</span>
              </button>

              {/* In-App Notifications Shortcut */}
              <button
                type="button"
                onClick={() => setActiveTab('NOTIFICATIONS')}
                className="relative p-2.5 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl transition-colors cursor-pointer"
                title="View In-App Delivery Notifications"
              >
                <Bell className="w-4 h-4" />
                {stats.unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {stats.unreadNotifsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={loadPartnerData}
                disabled={loading}
                className="p-2.5 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl transition-colors cursor-pointer"
                title="Sync Live Deliveries"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                className="px-4 py-2 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {notice && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notice}</span>
            </div>
          )}
        </div>

        {/* 2. Top Navigation Tabs */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
          {[
            { id: 'DASHBOARD', label: 'Dashboard', icon: Layers },
            { id: 'DELIVERIES', label: `My Deliveries (${deliveries.filter((d) => d.deliveryStatus !== 'DELIVERED').length})`, icon: Package, badge: stats.readyForPickup > 0 },
            { id: 'HISTORY', label: `Delivery History (${history.length})`, icon: Clock },
            { id: 'NOTIFICATIONS', label: `Notifications (${stats.unreadNotifsCount})`, icon: Bell, alert: stats.unreadNotifsCount > 0 },
            { id: 'PROFILE', label: 'My Profile', icon: User }
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
                    ? 'bg-[#5B0868] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
                {tab.alert && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* 4 Summary Cards Derived from Partner Data */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div
                onClick={() => { setActiveTab('DELIVERIES'); setStatusFilter('ALL'); }}
                className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Assigned</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-[#5B0868] group-hover:scale-110 transition-transform">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-2">
                  {stats.totalAssigned}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Across all route dispatches</p>
              </div>

              <div
                onClick={() => { setActiveTab('DELIVERIES'); setStatusFilter('READY_FOR_PICKUP'); }}
                className={`p-5 rounded-3xl border shadow-xs transition-all cursor-pointer group ${
                  stats.readyForPickup > 0 ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400' : 'bg-white border-gray-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ready for Pickup</span>
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 group-hover:scale-110 transition-transform">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-900 mt-2">
                  {stats.readyForPickup}
                </div>
                <p className="text-[11px] text-amber-700/80 mt-1">Awaiting driver pickup at hub</p>
              </div>

              <div
                onClick={() => { setActiveTab('DELIVERIES'); setStatusFilter('OUT_FOR_DELIVERY'); }}
                className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs hover:border-sky-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">In Transit</span>
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-700 group-hover:scale-110 transition-transform">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-2">
                  {stats.inTransit}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Picked up / Out for delivery</p>
              </div>

              <div
                onClick={() => { setActiveTab('HISTORY'); }}
                className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Delivered</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-900 mt-2">
                  {stats.delivered}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Completed successfully</p>
              </div>
            </div>

            {/* Active Deliveries Run-Sheet */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-gray-900 text-base sm:text-lg">Today's Active Run-Sheet</h3>
                  <p className="text-xs text-gray-500">Live parcels currently assigned to your route.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('DELIVERIES')}
                  className="text-xs font-bold text-[#5B0868] hover:text-[#480653] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Deliveries</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {deliveries.filter((d) => d.deliveryStatus !== 'DELIVERED').length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No active deliveries pending on your route.</p>
                    <p className="text-xs text-gray-400">New dispatches from the lab will alert you automatically.</p>
                  </div>
                ) : (
                  deliveries
                    .filter((d) => d.deliveryStatus !== 'DELIVERED')
                    .map((item) => (
                      <div key={item.id} className="p-4 sm:p-5 hover:bg-gray-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className={`p-2.5 rounded-2xl shrink-0 ${
                            item.deliveryStatus === 'OUT_FOR_DELIVERY'
                              ? 'bg-sky-100 text-sky-800'
                              : item.deliveryStatus === 'READY_FOR_PICKUP'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            <Package className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm">#{item.orderId}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                                item.deliveryStatus === 'OUT_FOR_DELIVERY'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : item.deliveryStatus === 'READY_FOR_PICKUP'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : item.deliveryStatus === 'PICKED_UP'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}>
                                {item.deliveryStatus.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-gray-800">{item.customerName}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                              <span className="truncate max-w-xs">{item.shippingAddress.street}, {item.shippingAddress.city} - {item.shippingAddress.pincode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {item.deliveryStatus === 'READY_FOR_PICKUP' && (
                            <button
                              type="button"
                              onClick={() => handleConfirmPickup(item.id)}
                              disabled={actionLoading}
                              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Pickup Package</span>
                            </button>
                          )}

                          {item.deliveryStatus === 'PICKED_UP' && (
                            <button
                              type="button"
                              onClick={() => handleMarkOutForDelivery(item.id)}
                              disabled={actionLoading}
                              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>Start Route</span>
                            </button>
                          )}

                          {item.deliveryStatus === 'OUT_FOR_DELIVERY' && (
                            <button
                              type="button"
                              onClick={() => handleConfirmDelivered(item.id)}
                              disabled={actionLoading}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Delivered</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedDelivery(item)}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY DELIVERIES */}
        {activeTab === 'DELIVERIES' && (
          <div className="space-y-4">
            {/* Filter Chips & Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, customer name, or pincode..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
                <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                {[
                  { id: 'ALL', label: 'All Active' },
                  { id: 'PREPARING', label: 'Preparing at Lab' },
                  { id: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
                  { id: 'PICKED_UP', label: 'Picked Up' },
                  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === f.id
                        ? 'bg-[#5B0868] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deliveries Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDeliveries.length === 0 ? (
                <div className="md:col-span-2 bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-200/80">
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <h4 className="font-serif font-bold text-gray-800 text-base">No deliveries matching criteria</h4>
                  <p className="text-xs text-gray-400 mt-1">Try clearing your search query or switching filters.</p>
                </div>
              ) : (
                filteredDeliveries.map((item) => {
                  const isReady = item.deliveryStatus === 'READY_FOR_PICKUP';
                  const isPicked = item.deliveryStatus === 'PICKED_UP';
                  const isOut = item.deliveryStatus === 'OUT_FOR_DELIVERY';

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-purple-300 transition-all space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Header: Order ID & Status Badges */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gray-900 text-sm">#{item.orderId}</span>
                            <span className="text-[10px] text-gray-400 font-mono">({new Date(item.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {/* Read-Only Preparation Status */}
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 uppercase">
                              Lab: {item.orderPreparationStatus.replace(/_/g, ' ')}
                            </span>
                            {/* Delivery Status */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                              isOut
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : isReady
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : isPicked
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {item.deliveryStatus.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Address */}
                        <div className="p-3 bg-gray-50/80 rounded-2xl space-y-1.5 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">{item.customerName}</span>
                            <a
                              href={`tel:${item.customerPhone}`}
                              className="text-[11px] font-bold text-[#5B0868] flex items-center gap-1 hover:underline"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{item.customerPhone}</span>
                            </a>
                          </div>
                          <div className="text-xs text-gray-600 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                            <span>{item.shippingAddress.street}, {item.shippingAddress.city} - {item.shippingAddress.pincode}</span>
                          </div>
                        </div>

                        {/* Items Summary */}
                        <div>
                          <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                            Package Contents ({item.items.reduce((s, it) => s + it.quantity, 0)} items • ₹{item.totalAmount}):
                          </span>
                          <div className="space-y-1">
                            {item.items.map((prod, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
                                <span className="truncate max-w-[240px]">• {prod.title}</span>
                                <span className="font-mono text-gray-500 font-medium">x{prod.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDelivery(item)}
                          className="text-xs font-bold text-[#5B0868] hover:text-[#480653] flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Full Delivery Sheet</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {isReady && (
                            <button
                              type="button"
                              onClick={() => handleConfirmPickup(item.id)}
                              disabled={actionLoading}
                              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm Pickup</span>
                            </button>
                          )}

                          {isPicked && (
                            <button
                              type="button"
                              onClick={() => handleMarkOutForDelivery(item.id)}
                              disabled={actionLoading}
                              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>Start Route</span>
                            </button>
                          )}

                          {isOut && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleConfirmDelivered(item.id)}
                                disabled={actionLoading}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Delivered</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setFailureModalDelivery(item)}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                                title="Report Delivery Failure"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DELIVERY HISTORY */}
        {activeTab === 'HISTORY' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-serif font-bold text-gray-900 text-lg">Completed Delivery Log & Archives</h3>
              <p className="text-xs text-gray-500">Historical records of delivered packages and recorded incident reports. Read-only audit.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer & City</th>
                    <th className="py-3 px-4">Outcome Status</th>
                    <th className="py-3 px-4">Completion Date</th>
                    <th className="py-3 px-4">Remarks / Admin Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        No delivery history records found.
                      </td>
                    </tr>
                  ) : (
                    history.map((h) => (
                      <tr key={h.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          #{h.orderId}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{h.customerName}</div>
                          <div className="text-[11px] text-gray-400">{h.shippingAddress?.city || 'Mumbai'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {h.deliveryStatus === 'DELIVERED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Delivered</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Failed ({h.failureReason || 'Incomplete'})</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                          {h.deliveredAt ? new Date(h.deliveredAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : (h.failedAt ? new Date(h.failedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'N/A')}
                        </td>
                        <td className="py-3.5 px-4">
                          {h.failureRemarks ? (
                            <span className="text-rose-700 text-[11px] block">{h.failureRemarks}</span>
                          ) : (
                            <span className="text-gray-500 text-[11px]">Direct handover to patron.</span>
                          )}
                          {h.flaggedForAdminReview && (
                            <span className="text-[10px] text-amber-700 font-bold uppercase block mt-0.5">
                              • Flagged for Admin Review
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-serif font-bold text-gray-900 text-lg">In-App Delivery Alerts</h3>
                <p className="text-xs text-gray-500">Real-time dispatches, lab packaging readiness, and route updates.</p>
              </div>
              <button
                type="button"
                onClick={handleMarkAllNotificationsRead}
                className="text-xs font-bold text-[#5B0868] hover:text-[#480653] cursor-pointer"
              >
                Mark all as read
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Bell className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm">No notifications currently.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkNotificationRead(n.id, n.orderId)}
                    className={`py-4 px-3 rounded-2xl flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                      !n.isRead ? 'bg-purple-50/40 hover:bg-purple-50/70' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        n.type === 'READY_FOR_PICKUP'
                          ? 'bg-amber-100 text-amber-800'
                          : n.type === 'NEW_ASSIGNMENT'
                          ? 'bg-purple-100 text-[#5B0868]'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900">{n.title}</h4>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#5B0868]" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-xs font-bold text-[#5B0868] hover:underline shrink-0"
                    >
                      View Order →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: MY PROFILE */}
        {activeTab === 'PROFILE' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-xl">Delivery Partner Profile</h3>
              <p className="text-xs text-gray-500 mt-1">Operational details and assigned fleet vehicle information.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Partner Identifier</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono font-bold text-gray-800">
                  {profile.partnerCode}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assigned Operational Hub</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800">
                  {profile.deliveryZone}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Fleet Vehicle Model</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800">
                  {profile.vehicleType}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Vehicle License Plate</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono font-bold text-gray-800">
                  {profile.vehicleNumber}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Driver Contact Number</label>
                <div className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800">
                  {profile.phone}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Duty Status</label>
                <div className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">{profile.dutyStatus}</span>
                  <button
                    type="button"
                    onClick={handleToggleDuty}
                    className="text-[11px] font-bold text-[#5B0868] hover:underline"
                  >
                    Change Status
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-[#5B0868] space-y-1">
              <strong>Role Security Policy:</strong> Your account is registered as an In-House Delivery Partner for Good Bee. Modifications to your role, operational assignments, or credentials are administrator-governed through the central Control Tower.
            </div>
          </div>
        )}

      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-100 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-[#1A1918] text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-200 block">
                  Delivery Manifest #{selectedDelivery.orderId}
                </span>
                <h3 className="font-serif font-bold text-lg mt-0.5">{selectedDelivery.customerName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDelivery(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Customer Contact & Navigation Links */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                <span className="font-bold text-gray-700 block text-[11px] uppercase tracking-wider">
                  Customer Delivery Destination
                </span>
                <p className="text-sm font-semibold text-gray-900">{selectedDelivery.customerName}</p>
                <p className="text-gray-600">
                  {selectedDelivery.shippingAddress.street}, {selectedDelivery.shippingAddress.city} - {selectedDelivery.shippingAddress.pincode}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                  <a
                    href={`tel:${selectedDelivery.customerPhone}`}
                    className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl text-gray-800 font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#5B0868]" />
                    <span>Call ({selectedDelivery.customerPhone})</span>
                  </a>

                  <a
                    href={`https://wa.me/${selectedDelivery.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedDelivery.customerName}, I am Kabir Verma from Good Bee logistics arriving with your skincare formulation order #${selectedDelivery.orderId}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-xl text-emerald-800 font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedDelivery.shippingAddress.street}, ${selectedDelivery.shippingAddress.city} ${selectedDelivery.shippingAddress.pincode}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-sky-50 border border-sky-300 hover:bg-sky-100 rounded-xl text-sky-800 font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Navigation className="w-3.5 h-3.5 text-sky-600" />
                    <span>Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Pickup Hub Details */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                  Pickup Location & Bay Instructions
                </span>
                <p className="font-semibold text-gray-900">{selectedDelivery.pickupLocation.name}</p>
                <p className="text-gray-600">{selectedDelivery.pickupLocation.address}</p>
                <div className="p-2 bg-white/80 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Instructions:</strong> {selectedDelivery.pickupLocation.instructions}
                </div>
              </div>

              {/* Dual Lifecycle Timelines */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-gray-900 text-sm">Fulfillment Timelines</h4>

                {/* 1. Order Preparation (Read-Only) */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    1. Warehouse Preparation Progress (Lab Governed)
                  </span>
                  <div className="flex items-center gap-2">
                    {['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].map((st, i) => (
                      <React.Fragment key={st}>
                        <div className="flex items-center gap-1 font-bold text-[10px]">
                          <span className={`w-2 h-2 rounded-full ${
                            selectedDelivery.orderPreparationStatus === st || (st === 'CONFIRMED')
                              ? 'bg-emerald-600'
                              : 'bg-gray-300'
                          }`} />
                          <span className="text-gray-700">{st.replace(/_/g, ' ')}</span>
                        </div>
                        {i < 2 && <span className="text-gray-300">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* 2. Delivery Progress */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    2. Delivery Progress Timeline
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-gray-700">
                      <span>• Assigned to Driver:</span>
                      <span className="font-mono text-gray-500">{new Date(selectedDelivery.assignedAt).toLocaleTimeString()}</span>
                    </div>
                    {selectedDelivery.pickedUpAt && (
                      <div className="flex items-center justify-between text-gray-700">
                        <span>• Picked up from Hub:</span>
                        <span className="font-mono text-gray-500">{new Date(selectedDelivery.pickedUpAt).toLocaleTimeString()}</span>
                      </div>
                    )}
                    {selectedDelivery.outForDeliveryAt && (
                      <div className="flex items-center justify-between text-gray-700">
                        <span>• Dispatched Out for Delivery:</span>
                        <span className="font-mono text-gray-500">{new Date(selectedDelivery.outForDeliveryAt).toLocaleTimeString()}</span>
                      </div>
                    )}
                    {selectedDelivery.deliveredAt && (
                      <div className="flex items-center justify-between text-emerald-800 font-bold">
                        <span>• Delivered to Patron:</span>
                        <span className="font-mono">{new Date(selectedDelivery.deliveredAt).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Package Items */}
              <div className="space-y-2">
                <span className="font-bold text-gray-700 block text-[11px] uppercase tracking-wider">
                  Order Items Breakdown
                </span>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                  {selectedDelivery.items.map((prod, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-2.5">
                        <img src={prod.image || '/images_ref/Frankin-300x300.webp'} alt={prod.title} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-medium text-gray-900">{prod.title}</span>
                      </div>
                      <span className="font-mono font-bold text-gray-700">Qty: {prod.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedDelivery(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedDelivery.deliveryStatus === 'READY_FOR_PICKUP' && (
                  <button
                    type="button"
                    onClick={() => handleConfirmPickup(selectedDelivery.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Pickup</span>
                  </button>
                )}

                {selectedDelivery.deliveryStatus === 'PICKED_UP' && (
                  <button
                    type="button"
                    onClick={() => handleMarkOutForDelivery(selectedDelivery.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Start Route</span>
                  </button>
                )}

                {selectedDelivery.deliveryStatus === 'OUT_FOR_DELIVERY' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelivered(selectedDelivery.id)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Delivered</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFailureModalDelivery(selectedDelivery);
                      }}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Report Issue
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT FAILED DELIVERY MODAL */}
      {failureModalDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden">
            <div className="bg-rose-600 text-white p-5">
              <h3 className="font-serif font-bold text-lg">Report Unsuccessful Delivery</h3>
              <p className="text-xs text-rose-100 mt-0.5">Order #{failureModalDelivery.orderId} • {failureModalDelivery.customerName}</p>
            </div>

            <form onSubmit={handleReportFailed} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Predefined Failure Reason</label>
                <select
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                >
                  {FAILURE_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Remarks for Admin Review</label>
                <textarea
                  rows={3}
                  required
                  value={failureRemarks}
                  onChange={(e) => setFailureRemarks(e.target.value)}
                  placeholder="e.g. Ring bell 3 times, gate security confirmed resident out of station until tomorrow..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[11px] text-rose-900 leading-relaxed">
                <strong>Notice:</strong> This incident will be flagged directly to the Good Bee Operations Desk for customer outreach and reschedule planning.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFailureModalDelivery(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  {actionLoading ? 'Recording...' : 'Submit Failure Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
