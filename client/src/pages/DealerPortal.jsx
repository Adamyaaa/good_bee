import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, TrendingUp, ShoppingBag, ShieldCheck, FileSpreadsheet, ArrowRight, Check } from 'lucide-react';

export default function DealerPortal({ onNavigateHome }) {
  const { user, token } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [discountPct, setDiscountPct] = useState(18);
  const [loading, setLoading] = useState(true);
  const [orderNotice, setOrderNotice] = useState('');

  useEffect(() => {
    fetch('/api/v1/dealer/catalog', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setCatalog(data.catalog || []);
        if (data.discountPct) setDiscountPct(data.discountPct);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handlePlaceB2BOrder = (product) => {
    setOrderNotice(`Wholesale Purchase Order generated for 10 units of ${product.title} (₹${(product.wholesalePrice * 10).toLocaleString('en-IN')}). Routed to regional warehouse.`);
    setTimeout(() => setOrderNotice(''), 4000);
  };

  return (
    <div className="py-10 bg-brand-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-gold/25">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-brand-charcoal text-brand-gold">
              <Package className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold-dark block">
                Dealer & Regional Wholesale Desk
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-semibold">
                {user ? user.companyName || user.name : 'Wholesale Distributor'}
              </h1>
              <p className="text-xs text-brand-muted">
                Dealer Code: {user ? user.dealerCode || 'DLR-MUM-01' : 'DLR-MUM-01'} • GST: {user ? user.gstNumber || '27AABCU9603R1ZM' : 'Verified'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-brand-cream border border-brand-gold/30 rounded-xl text-xs font-semibold text-brand-charcoal">
              Wholesale Margin: <span className="text-emerald-800">{discountPct}% Off MSRP</span>
            </div>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-brand-cream border border-brand-gold/30 rounded-full text-xs font-medium text-brand-charcoal hover:bg-brand-sand/50"
            >
              Storefront
            </button>
          </div>
        </div>

        {orderNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{orderNotice}</span>
          </div>
        )}

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-brand-cream/50 p-5 rounded-2xl border border-brand-gold/25 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">Approved Margin</span>
            <p className="font-serif text-2xl font-bold text-brand-charcoal">{discountPct}% Configurable</p>
            <p className="text-[11px] text-brand-muted">Set dynamically via Admin Rules Engine</p>
          </div>
          <div className="bg-brand-cream/50 p-5 rounded-2xl border border-brand-gold/25 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">Approved Credit Line</span>
            <p className="font-serif text-2xl font-bold text-brand-charcoal">₹2,50,000</p>
            <p className="text-[11px] text-emerald-800 font-medium">Active (Net-30 Settlement)</p>
          </div>
          <div className="bg-brand-cream/50 p-5 rounded-2xl border border-brand-gold/25 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">Min Order Quantity</span>
            <p className="font-serif text-2xl font-bold text-brand-charcoal">5 Units / SKU</p>
            <p className="text-[11px] text-brand-muted">Priority batch packing</p>
          </div>
        </div>

        {/* Wholesale Catalog Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-brand-charcoal">
              Eligible Formulations Catalog (Wholesale Rates)
            </h3>
            <span className="text-xs text-brand-muted">{catalog.length} available formulations</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-brand-muted">Loading wholesale pricing...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.map((item) => (
                <div
                  key={item.id}
                  className="bg-brand-cream/40 rounded-2xl border border-brand-gold/30 p-5 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex gap-3 items-center">
                      <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-brand-sand/40 border border-brand-gold/20" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark px-1.5 py-0.5 rounded bg-brand-ivory border border-brand-gold/20">
                          {item.category}
                        </span>
                        <h4 className="font-serif text-base font-semibold text-brand-charcoal mt-1 line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-brand-muted">SKU: {item.sku}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-brand-ivory rounded-xl border border-brand-gold/20 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-brand-muted text-[10px] block">Public MSRP:</span>
                        <span className="font-semibold line-through text-brand-muted">₹{item.retailPrice}</span>
                      </div>
                      <div>
                        <span className="text-brand-gold-dark text-[10px] font-bold block">Dealer Rate:</span>
                        <span className="font-bold text-emerald-800 text-sm">₹{item.wholesalePrice}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-brand-charcoal/70 line-clamp-2">{item.shortDescription}</p>
                  </div>

                  <button
                    onClick={() => handlePlaceB2BOrder(item)}
                    className="w-full py-2.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-brand-gold-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Generate B2B PO (10 Units)</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
