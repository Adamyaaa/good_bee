import React, { useState } from 'react';
import {
  Building2,
  Percent,
  Search,
  Plus,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Sliders,
  X,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

export default function WholesalerManager({
  wholesalers = [],
  onUpdateCommission,
  onAddWholesaler,
  token
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [inlineMargin, setInlineMargin] = useState(20);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const [newWholesalerForm, setNewWholesalerForm] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    gstNumber: '',
    tier: 'Gold Tier Partner',
    commissionMarginPct: 22
  });

  const filteredWholesalers = wholesalers.filter((w) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      w.companyName?.toLowerCase().includes(q) ||
      w.name?.toLowerCase().includes(q) ||
      w.dealerCode?.toLowerCase().includes(q) ||
      w.city?.toLowerCase().includes(q) ||
      w.gstNumber?.toLowerCase().includes(q);

    const matchesTier =
      tierFilter === 'ALL' ||
      (tierFilter === 'PLATINUM' && (w.tier?.includes('Platinum') || w.commissionMarginPct >= 25)) ||
      (tierFilter === 'GOLD' && (w.tier?.includes('Gold') || (w.commissionMarginPct >= 20 && w.commissionMarginPct < 25))) ||
      (tierFilter === 'SILVER' && (w.tier?.includes('Silver') || w.commissionMarginPct < 20));

    return matchesSearch && matchesTier;
  });

  const avgMargin = wholesalers.length
    ? (wholesalers.reduce((sum, w) => sum + Number(w.commissionMarginPct || 20), 0) / wholesalers.length).toFixed(1)
    : '20.0';

  const totalWholesaleSpend = wholesalers.reduce((sum, w) => sum + Number(w.totalSpend || 0), 0);
  const totalWholesaleOrders = wholesalers.reduce((sum, w) => sum + Number(w.totalOrders || 0), 0);

  const handleStartEdit = (w) => {
    setEditingId(w.id);
    setInlineMargin(Number(w.commissionMarginPct) || 20);
  };

  const handleApplyPreset = (wholesalerId, presetPct) => {
    onUpdateCommission(wholesalerId, presetPct);
    setNotice(`Updated margin to ${presetPct}% for wholesale partner.`);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleSaveInline = (wholesalerId) => {
    onUpdateCommission(wholesalerId, Number(inlineMargin));
    setEditingId(null);
    setNotice(`Custom margin of ${inlineMargin}% saved successfully.`);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newWholesalerForm.companyName || !newWholesalerForm.email) return;

    onAddWholesaler(newWholesalerForm);
    setIsAddModalOpen(false);
    setNewWholesalerForm({
      companyName: '',
      name: '',
      email: '',
      phone: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      gstNumber: '',
      tier: 'Gold Tier Partner',
      commissionMarginPct: 22
    });
    setNotice(`New wholesaler "${newWholesalerForm.companyName}" onboarded!`);
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Metrics Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Active Wholesalers</span>
            <Building2 className="w-4 h-4 text-[#5B0868]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">{wholesalers.length}</p>
          <p className="text-[10px] text-emerald-700 font-medium">B2B Regional Stockist Matrix</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Average Margin Rate</span>
            <Percent className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">{avgMargin}%</p>
          <p className="text-[10px] text-gray-500">Tier Range: 17.0% – 35.0%</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Cumulative B2B Volume</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            ₹{totalWholesaleSpend.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-gray-500">{totalWholesaleOrders} B2B POs Completed</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Min. Order Value (MOV)</span>
            <ShieldCheck className="w-4 h-4 text-[#C5A265]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#5B0868]">₹15,000</p>
          <p className="text-[10px] text-gray-500 font-medium">Wholesale Floor Protection</p>
        </div>
      </div>

      {notice && (
        <div className="p-3 sm:p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wholesaler, GSTIN, city or code..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5B0868]"
          />
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mr-1 hidden sm:inline">
            Tier:
          </span>
          {[
            { id: 'ALL', label: `All (${wholesalers.length})` },
            { id: 'PLATINUM', label: 'Platinum (25%+)' },
            { id: 'GOLD', label: 'Gold (20-24%)' },
            { id: 'SILVER', label: 'Silver (<20%)' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTierFilter(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                tierFilter === t.id
                  ? 'bg-[#5B0868] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 border border-gray-200/60'
              }`}
            >
              {t.label}
            </button>
          ))}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#5B0868] hover:bg-[#480653] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap ml-auto cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Wholesaler</span>
          </button>
        </div>

      </div>

      {/* Wholesalers Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-gray-900">Wholesaler Network & Margin Allocation</h3>
            <p className="text-xs text-gray-500">Per-wholesaler percentage overrides directly configure B2B catalog pricing</p>
          </div>
          <span className="text-xs font-mono text-[#5B0868] bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg font-semibold">
            Showing {filteredWholesalers.length} of {wholesalers.length} Wholesalers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-600 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Wholesaler Entity</th>
                <th className="py-3.5 px-4">Location & GSTIN</th>
                <th className="py-3.5 px-4">Partner Tier</th>
                <th className="py-3.5 px-4 text-center">Assigned Margin %</th>
                <th className="py-3.5 px-4">Sample Pricing (₹1,000 MSRP)</th>
                <th className="py-3.5 px-4 text-right">Lifetime POs</th>
                <th className="py-3.5 px-4 text-right">Quick Presets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredWholesalers.map((w) => {
                const currentMargin = Number(w.commissionMarginPct || 20);
                const wholesaleSample = Math.round(1000 * (1 - currentMargin / 100));
                const savingsSample = 1000 - wholesaleSample;
                const isEditing = editingId === w.id;

                return (
                  <tr key={w.id} className="hover:bg-purple-50/20 transition-colors">
                    
                    {/* Entity Details */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="space-y-0.5">
                        <span className="font-serif font-bold text-gray-900 text-sm block">
                          {w.companyName || w.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span className="font-mono text-[#5B0868] font-semibold">{w.dealerCode || 'DLR-GB'}</span>
                          <span>•</span>
                          <span>{w.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-2 pt-0.5">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {w.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {w.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location & GSTIN */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-gray-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>{w.city || 'Mumbai'}, {w.state || 'Maharashtra'}</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 inline-block">
                          GST: {w.gstNumber || '27AABCU0000R1ZX'}
                        </span>
                      </div>
                    </td>

                    {/* Partner Tier */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border inline-block ${
                        w.tier?.includes('Platinum') || currentMargin >= 25
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : w.tier?.includes('Gold') || currentMargin >= 20
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {w.tier || 'Standard Wholesale Partner'}
                      </span>
                    </td>

                    {/* Assigned Commission Margin % */}
                    <td className="py-4 px-4 text-center">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#5B0868] shadow-xs">
                          <input
                            type="number"
                            min="5"
                            max="45"
                            step="0.5"
                            value={inlineMargin}
                            onChange={(e) => setInlineMargin(e.target.value)}
                            className="w-16 p-1 text-center font-bold text-[#5B0868] bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none"
                          />
                          <span className="text-xs font-bold text-gray-500">%</span>
                          <button
                            onClick={() => handleSaveInline(w.id)}
                            className="px-2 py-1 bg-[#5B0868] hover:bg-[#480653] text-white rounded-lg text-[10px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-gray-400 hover:text-gray-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartEdit(w)}
                          className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50/50 border border-purple-200/80 hover:border-[#5B0868] transition-colors"
                          title="Click to enter custom percentage"
                        >
                          <span className="font-mono text-sm font-bold text-[#5B0868]">
                            {currentMargin}%
                          </span>
                          <span className="text-[10px] text-gray-400 group-hover:text-[#5B0868] transition-colors">
                            ✏️
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Dynamic Price Preview */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-xs">₹{wholesaleSample}</span>
                          <span className="text-[10px] text-gray-400 line-through">₹1,000</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          Dealer saves ₹{savingsSample} / unit
                        </span>
                      </div>
                    </td>

                    {/* Lifetime Volume */}
                    <td className="py-4 px-4 text-right">
                      <div className="space-y-0.5 font-mono">
                        <span className="font-bold text-gray-900 block">₹{(w.totalSpend || 0).toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-gray-500">{w.totalOrders || 0} orders</span>
                      </div>
                    </td>

                    {/* Quick Tier Presets */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {[18, 20, 22, 25].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => handleApplyPreset(w.id, preset)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              Math.round(currentMargin) === preset
                                ? 'bg-[#5B0868] text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
                            }`}
                            title={`Set to ${preset}% margin`}
                          >
                            {preset}%
                          </button>
                        ))}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Wholesaler Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B0868] font-bold">
                  B2B Channel Expansion
                </span>
                <h3 className="font-serif text-xl font-bold text-gray-900 mt-0.5">
                  Onboard Wholesale Partner
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Company / Agency Name</label>
                <input
                  type="text"
                  required
                  value={newWholesalerForm.companyName}
                  onChange={(e) => setNewWholesalerForm({ ...newWholesalerForm, companyName: e.target.value })}
                  placeholder="e.g. Malabar Premium Herbals Pvt Ltd"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-[#5B0868] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">Primary Representative</label>
                  <input
                    type="text"
                    required
                    value={newWholesalerForm.name}
                    onChange={(e) => setNewWholesalerForm({ ...newWholesalerForm, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-[#5B0868] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">GSTIN Number</label>
                  <input
                    type="text"
                    value={newWholesalerForm.gstNumber}
                    onChange={(e) => setNewWholesalerForm({ ...newWholesalerForm, gstNumber: e.target.value })}
                    placeholder="27AABCU1234R1ZM"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#5B0868] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newWholesalerForm.email}
                    onChange={(e) => setNewWholesalerForm({ ...newWholesalerForm, email: e.target.value })}
                    placeholder="orders@partner.com"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-[#5B0868] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">Contact Phone</label>
                  <input
                    type="text"
                    value={newWholesalerForm.phone}
                    onChange={(e) => setNewWholesalerForm({ ...newWholesalerForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-[#5B0868] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">City</label>
                  <input
                    type="text"
                    value={newWholesalerForm.city}
                    onChange={(e) => setNewWholesalerForm({ ...newWholesalerForm, city: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-[#5B0868] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">State</label>
                  <input
                    type="text"
                    value={newWholesalerForm.state}
                    onChange={(e) => setNewWholesalerForm({ ...newWholesalerForm, state: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-[#5B0868] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">Partner Tier</label>
                  <select
                    value={newWholesalerForm.tier}
                    onChange={(e) => setNewWholesalerForm({ ...newWholesalerForm, tier: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-[#5B0868] focus:outline-none"
                  >
                    <option value="Platinum Apex Partner">Platinum Apex (25%+)</option>
                    <option value="Gold Tier Partner">Gold Tier (20–24%)</option>
                    <option value="Silver Regional Hub">Silver Regional (15–19%)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">Initial Margin %</label>
                  <input
                    type="number"
                    min="5"
                    max="45"
                    step="0.5"
                    required
                    value={newWholesalerForm.commissionMarginPct}
                    onChange={(e) => setNewWholesalerForm({ ...newWholesalerForm, commissionMarginPct: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold focus:border-[#5B0868] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-purple-900 text-[11px] leading-relaxed">
                <p>
                  <strong>Margin Safeguard:</strong> This individual percentage will automatically calculate wholesale pricing for this account while upholding the ₹15,000 Minimum Order Value protection.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5B0868] hover:bg-[#480653] text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm & Onboard
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
