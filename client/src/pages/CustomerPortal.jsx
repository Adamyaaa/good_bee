import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Package, Award, MapPin, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';

export default function CustomerPortal({ onNavigateHome }) {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders or fallback to customer test orders
    setOrders([
      {
        id: 'GB-ORD-90821',
        total: 1890,
        status: 'PROCESSING',
        date: '2026-10-07',
        paymentMethod: 'DYNAMIC_UPI_QR',
        items: [
          {
            title: 'Golden Royal Propolis Restorative Nectar',
            price: 1890,
            quantity: 1
          }
        ]
      }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="py-10 bg-brand-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-gold/25">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-brand-charcoal text-brand-gold">
              <User className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold-dark block">
                Patron Dashboard
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-semibold">
                Welcome, {user ? user.name : 'Valued Patron'}
              </h1>
              <p className="text-xs text-brand-muted">
                {user ? user.email : 'customer@goodbee.com'} • Active Member
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

        {/* Loyalty Reward Card */}
        <div className="bg-gradient-to-r from-brand-charcoal via-brand-charcoal-soft to-brand-charcoal text-brand-ivory p-6 sm:p-8 rounded-3xl border border-brand-gold/40 shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-gold-light text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-brand-gold" />
              <span>Good Bee Patron Privilege</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium">
              You Have <span className="text-brand-gold font-bold">{user?.loyaltyPoints || 340}</span> Bee-Coins
            </h2>
            <p className="text-xs text-brand-sand/80 max-w-md font-sans">
              Earn 1 point for every ₹20 spent. Redeemable directly as ₹{user?.loyaltyPoints || 340} off any future pure formulation orders.
            </p>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-6 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold uppercase tracking-wider rounded-full hover:bg-brand-gold-light transition-colors shadow-md"
          >
            Redeem on Formulations
          </button>
        </div>

        {/* Order History */}
        <div className="bg-brand-cream/40 p-6 rounded-3xl border border-brand-gold/25 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-brand-charcoal">
              Order History & Tracking
            </h3>
            <span className="text-xs text-brand-muted">{orders.length} order placed</span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-brand-ivory rounded-2xl border border-brand-gold/20 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-charcoal">{ord.id}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-muted">Placed on {ord.date} via {ord.paymentMethod}</p>
                  <p className="text-xs font-medium text-brand-charcoal">
                    {ord.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-brand-muted block">Invoice Total</span>
                    <span className="font-serif text-base font-bold text-brand-charcoal">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/919963075000?text=${encodeURIComponent(
                      `Hello Good Bee Support, I would like a dispatch update on order #${ord.id}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-brand-cream border border-brand-gold/30 text-emerald-800 hover:bg-emerald-50 transition-colors"
                    title="Track via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
