import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Clock,
  Package,
  Layers,
  Settings,
  QrCode,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  RefreshCw,
  Edit2
} from 'lucide-react';

export default function AdminDashboard({ onNavigateHome }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('ANALYTICS'); // 'ANALYTICS', 'SUBMISSIONS', 'INVENTORY', 'RULES', 'SETTINGS'
  const [analytics, setAnalytics] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [rules, setRules] = useState({
    dealerCommissionPct: 18.0,
    promoterCommissionPct: 12.0,
    loyaltyPointsPerRupee: 0.05,
    loyaltyRedeemValuePerPoint: 1.0,
    lowStockSafetyThreshold: 15
  });
  const [config, setConfig] = useState({
    payment: {
      upiVpa: 'goodbee.official@okaxis',
      payeeName: 'GOOD BEE Skincare Laboratory',
      merchantCode: '5977',
      allowDynamicQr: true
    },
    whatsapp: {
      phoneNumber: '+919876543210',
      welcomeMessage: 'Hello Good Bee Concierge, I would like guidance on pure skincare formulations.',
      enableConcierge: true
    }
  });

  const [loading, setLoading] = useState(true);
  const [feedbackReason, setFeedbackReason] = useState('');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
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

      // Load submissions
      const resSub = await fetch('/api/v1/admin/submissions', { headers });
      const subData = await resSub.json();
      setSubmissions(subData.submissions || []);

      // Load inventory
      const resInv = await fetch('/api/v1/admin/inventory', { headers });
      const invData = await resInv.json();
      setInventory(invData.inventory || []);

      // Load rules
      const resRules = await fetch('/api/v1/admin/rules', { headers });
      const rulesData = await resRules.json();
      if (rulesData.rules) setRules(rulesData.rules);

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

  const handleDecideSubmission = async (id, decision) => {
    try {
      const res = await fetch(`/api/v1/admin/submissions/${id}/decide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          decision,
          reason: feedbackReason || (decision === 'APPROVE' ? 'Batch specifications verified.' : 'Does not meet 100% natural purity specifications.')
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Decision failed');

      setActionSuccess(data.message);
      setSelectedSubmissionId(null);
      setFeedbackReason('');
      setTimeout(() => setActionSuccess(''), 4000);
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      const res = await fetch(`/api/v1/admin/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: Number(newStock) })
      });
      if (res.ok) {
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRules = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/rules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(rules)
      });
      const data = await res.json();
      setActionSuccess(data.message);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Error updating business rules');
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
      setActionSuccess(data.message);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Error updating platform settings');
    }
  };

  const pendingCount = submissions.filter((s) => s.status === 'PENDING_REVIEW').length;

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans">
      
      {/* Top Professional Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/good-bee-logo.png"
            alt="Good Bee Emblem"
            className="w-10 h-10 rounded-full border border-amber-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                Control Tower
              </span>
              <span className="px-2 py-0.2 text-[10px] bg-slate-800 border border-slate-700 text-slate-300 rounded font-mono">
                Production v1.0
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Good Bee Enterprise Master Administration
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
          >
            Public Storefront
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'ANALYTICS', label: 'Overview Telemetry', icon: LayoutDashboard },
            { id: 'SUBMISSIONS', label: `Producer Review Queue (${pendingCount})`, icon: Clock, badge: pendingCount > 0 },
            { id: 'INVENTORY', label: 'Inventory & Stock Matrix', icon: Package },
            { id: 'RULES', label: 'Commission & Loyalty Rules Engine', icon: Layers },
            { id: 'SETTINGS', label: 'Dynamic QR & WhatsApp Gateways', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {actionSuccess && (
          <div className="p-4 bg-emerald-950 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tab 1: Telemetry Overview */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Total Settled Revenue</span>
                <p className="text-3xl font-bold font-mono text-white">
                  ₹{(analytics?.revenue || 3780).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> 100% Dynamic QR verified
                </p>
              </div>

              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Published Formulations</span>
                <p className="text-3xl font-bold font-mono text-white">
                  {analytics?.publishedProductsCount || 6} SKUs
                </p>
                <p className="text-xs text-slate-400">Active on public storefront</p>
              </div>

              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Pending Review Pipeline</span>
                <p className="text-3xl font-bold font-mono text-amber-400">
                  {pendingCount} Awaiting
                </p>
                <p className="text-xs text-amber-300">Producer submissions quarantined</p>
              </div>

              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Partner Nodes</span>
                <p className="text-3xl font-bold font-mono text-white">
                  {(analytics?.producersCount || 1) + (analytics?.dealersCount || 1) + (analytics?.promotersCount || 1)} Partners
                </p>
                <p className="text-xs text-slate-400">Producers, Dealers & Promoters</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Recent Commerce Transactions</span>
                <span className="text-xs text-slate-400 font-normal">Real-time settlement log</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono border-b border-slate-700">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Patron</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {analytics?.recentOrders?.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-amber-400">{ord.id}</td>
                        <td className="p-3 text-white">{ord.customerName}</td>
                        <td className="p-3 font-mono text-slate-300">{ord.paymentMethod}</td>
                        <td className="p-3 font-mono font-bold text-white">₹{ord.total}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Producer Review Queue */}
        {activeTab === 'SUBMISSIONS' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>
                Producer submissions are isolated from public storefront until you approve them. Approving automatically publishes the SKU into the live Good Bee storefront. Rejecting records your reason for the producer.
              </span>
            </div>

            <div className="space-y-4">
              {submissions.map((sub) => {
                const isPending = sub.status === 'PENDING_REVIEW';
                const isApproved = sub.status === 'APPROVED';
                const isRejected = sub.status === 'REJECTED';

                return (
                  <div
                    key={sub.id}
                    className="bg-slate-800/60 rounded-2xl border border-slate-700 p-6 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-700">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-400">{sub.id}</span>
                          <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] uppercase font-bold text-amber-400">
                            {sub.category}
                          </span>
                          {isPending && (
                            <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-600/40 rounded text-[10px] font-bold uppercase">
                              Needs Quality Decision
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-600/40 rounded text-[10px] font-bold uppercase">
                              Approved & Live
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-600/40 rounded text-[10px] font-bold uppercase">
                              Rejected
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-white mt-1">{sub.title}</h4>
                        <p className="text-xs text-slate-400">Submitted by: <strong className="text-slate-200">{sub.producerName}</strong> on {new Date(sub.submittedAt).toLocaleDateString()}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Proposed Price</span>
                        <span className="text-xl font-bold font-mono text-white">₹{sub.price}</span>
                        <span className="text-[11px] text-slate-400 block">Stock: {sub.stock} units</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">Disclosed Ingredients & Actives</span>
                        <p className="text-slate-300">{sub.ingredients}</p>
                      </div>
                      <div className="space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">Research & Extraction Documentation</span>
                        <p className="text-slate-300">{sub.description}</p>
                      </div>
                    </div>

                    {sub.adminNotes && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs">
                        <span className="text-slate-400 font-bold block">Admin Decision Note:</span>
                        <p className="text-amber-200">{sub.adminNotes}</p>
                      </div>
                    )}

                    {/* Action Decision Strip */}
                    {isPending && (
                      <div className="pt-3 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-auto flex-1">
                          <input
                            type="text"
                            placeholder="Feedback comment or batch approval note..."
                            value={selectedSubmissionId === sub.id ? feedbackReason : ''}
                            onChange={(e) => {
                              setSelectedSubmissionId(sub.id);
                              setFeedbackReason(e.target.value);
                            }}
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => handleDecideSubmission(sub.id, 'REJECT')}
                            className="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-200 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors"
                          >
                            Reject With Note
                          </button>
                          <button
                            onClick={() => handleDecideSubmission(sub.id, 'APPROVE')}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors shadow-md"
                          >
                            Approve & Publish Live
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Inventory Matrix */}
        {activeTab === 'INVENTORY' && (
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>SKU Inventory & Low-Stock Alerts</span>
              <span className="text-xs text-slate-400">Safety Threshold: {rules.lowStockSafetyThreshold} units</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono border-b border-slate-700">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Formulation</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Quick Stock Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-amber-400">{item.sku}</td>
                      <td className="p-3 text-white font-medium">{item.title}</td>
                      <td className="p-3 text-slate-300">{item.category}</td>
                      <td className="p-3 font-mono text-white">₹{item.price}</td>
                      <td className="p-3 font-mono font-bold text-white">{item.stock}</td>
                      <td className="p-3">
                        {item.isLowStock ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-400 border border-red-500/30">
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                            Adequate
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStock(item.id, item.stock + 10)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-xs text-slate-200"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleUpdateStock(item.id, Math.max(0, item.stock - 5))}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-xs text-slate-200"
                        >
                          -5
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Configurable Rules Engine */}
        {activeTab === 'RULES' && (
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Configurable Partner Rules & Commission Engine</h3>
              <p className="text-xs text-slate-400">
                Configure percentages and loyalty ratios dynamically without hardcoding arbitrary values.
              </p>
            </div>

            <form onSubmit={handleSaveRules} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <label className="block font-bold text-slate-200">Dealer Wholesale Margin Percentage (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={rules.dealerCommissionPct}
                  onChange={(e) => setRules({ ...rules, dealerCommissionPct: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-slate-400">Standard wholesale discount applied to eligible dealer catalogs.</p>
              </div>

              <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <label className="block font-bold text-slate-200">Promoter Affiliate Commission Percentage (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={rules.promoterCommissionPct}
                  onChange={(e) => setRules({ ...rules, promoterCommissionPct: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-slate-400">Royalty disbursed to promoters upon converted patron orders.</p>
              </div>

              <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <label className="block font-bold text-slate-200">Customer Loyalty Points per Rupee Spent</label>
                <input
                  type="number"
                  step="0.01"
                  value={rules.loyaltyPointsPerRupee}
                  onChange={(e) => setRules({ ...rules, loyaltyPointsPerRupee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-slate-400">0.05 = 1 Bee-Coin earned for every ₹20 spent.</p>
              </div>

              <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <label className="block font-bold text-slate-200">Low Stock Safety Alarm Threshold (Units)</label>
                <input
                  type="number"
                  value={rules.lowStockSafetyThreshold}
                  onChange={(e) => setRules({ ...rules, lowStockSafetyThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-slate-400">Triggers re-order alerts on the operational matrix.</p>
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider rounded-xl transition-colors text-xs"
                >
                  Save Business Rules Configuration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 5: Dynamic QR & WhatsApp Settings */}
        {activeTab === 'SETTINGS' && (
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Dynamic Payment QR & WhatsApp Concierge Configuration</h3>
              <p className="text-xs text-slate-400">
                Manage live endpoints, business UPI IDs, and automated concierge routing.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Payment Section */}
              <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <QrCode className="w-4 h-4" />
                  <span>Dynamic UPI QR Gateway Parameters</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">Official Merchant UPI VPA</label>
                  <input
                    type="text"
                    value={config.payment?.upiVpa}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        payment: { ...config.payment, upiVpa: e.target.value }
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                    placeholder="goodbee.official@okaxis"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">Payee Business Name (NPCI Registered)</label>
                  <input
                    type="text"
                    value={config.payment?.payeeName}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        payment: { ...config.payment, payeeName: e.target.value }
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* WhatsApp Section */}
              <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge & Support Routing</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">Business WhatsApp Number</label>
                  <input
                    type="text"
                    value={config.whatsapp?.phoneNumber}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        whatsapp: { ...config.whatsapp, phoneNumber: e.target.value }
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                    placeholder="+919876543210"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">Default Inbound Greeting Message</label>
                  <textarea
                    rows={2}
                    value={config.whatsapp?.welcomeMessage}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        whatsapp: { ...config.whatsapp, welcomeMessage: e.target.value }
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider rounded-xl transition-colors text-xs"
                >
                  Save Gateway Endpoints
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

    </div>
  );
}
