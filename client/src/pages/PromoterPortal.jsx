import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Copy, Check, TrendingUp, Users, DollarSign, ArrowRight, Share2 } from 'lucide-react';

export default function PromoterPortal({ onNavigateHome }) {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetch('/api/v1/promoter/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const referralCode = stats?.referralCode || user?.referralCode || 'ELENA10';
  const referralUrl = `https://goodbee.com/?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="py-10 bg-brand-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-gold/25">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-brand-charcoal text-brand-gold">
              <Megaphone className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold-dark block">
                Promoter & Brand Affiliate Studio
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-semibold">
                {user ? user.name : 'Brand Ambassador'}
              </h1>
              <p className="text-xs text-brand-muted">
                Commission Privilege: {stats?.commissionPct || 12}% of Net Attributed Revenue
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-4 py-2 bg-brand-cream border border-brand-gold/30 rounded-full text-xs font-medium text-brand-charcoal hover:bg-brand-sand/50"
          >
            Storefront
          </button>
        </div>

        {/* Affiliate Link Generator Card */}
        <div className="bg-brand-cream/60 p-6 rounded-3xl border border-brand-gold/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-brand-charcoal">
              Your Unique Attribution Assets
            </h3>
            <span className="text-xs text-brand-gold-dark font-semibold">10% Patron Discount + {stats?.commissionPct || 12}% Royalty</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-brand-ivory rounded-2xl border border-brand-gold/25 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block">
                Your Promoter Promo Code
              </span>
              <div className="flex items-center justify-between bg-brand-cream px-3 py-2 rounded-xl">
                <span className="font-mono text-sm font-bold text-brand-charcoal">{referralCode}</span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 bg-brand-charcoal text-brand-ivory text-xs font-semibold rounded-lg hover:bg-brand-gold-dark transition-colors flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-brand-ivory rounded-2xl border border-brand-gold/25 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block">
                Direct Tracking Link
              </span>
              <div className="flex items-center justify-between bg-brand-cream px-3 py-2 rounded-xl">
                <span className="font-mono text-xs text-brand-charcoal truncate max-w-xs">{referralUrl}</span>
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-1 bg-brand-charcoal text-brand-ivory text-xs font-semibold rounded-lg hover:bg-brand-gold-dark transition-colors flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-brand-cream/50 p-5 rounded-2xl border border-brand-gold/25 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">Total Attributed Sales</span>
            <p className="font-serif text-2xl font-bold text-brand-charcoal">
              ₹{(stats?.totalSalesVolume || 1890).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-brand-muted">{stats?.convertedOrdersCount || 1} verified conversions</p>
          </div>

          <div className="bg-brand-cream/50 p-5 rounded-2xl border border-brand-gold/25 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">Earned Commissions</span>
            <p className="font-serif text-2xl font-bold text-emerald-800">
              ₹{(stats?.earnedCommission || 14250).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">Ready for monthly settlement</p>
          </div>

          <div className="bg-brand-cream/50 p-5 rounded-2xl border border-brand-gold/25 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">Referral Clicks</span>
            <p className="font-serif text-2xl font-bold text-brand-charcoal">
              {stats?.totalReferralsCount || 14} Visits
            </p>
            <p className="text-[11px] text-brand-muted">From social & direct referrals</p>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-brand-cream/40 p-6 rounded-3xl border border-brand-gold/25 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-brand-charcoal">
            Settlement & Payout Ledger
          </h3>
          <div className="space-y-2 text-xs">
            {stats?.payoutHistory?.map((pay) => (
              <div key={pay.id} className="p-3 bg-brand-ivory rounded-xl border border-brand-gold/20 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-brand-charcoal block">{pay.id}</span>
                  <span className="text-[11px] text-brand-muted">Processed on {pay.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-brand-charcoal block">₹{pay.amount.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {pay.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
