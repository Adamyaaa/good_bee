import React, { useState } from 'react';
import { Package, Search, X, CheckCircle2, Clock, Truck, MapPin, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TrackOrderModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [error, setError] = useState('');

  // Sample order fallback if customer has not yet ordered
  const DEMO_ORDER = {
    id: 'GB-89211',
    customerName: 'Aaditya Sharma',
    customerPhone: '+91 99630 75000',
    placedAt: 'Yesterday, 4:15 PM',
    status: 'DISPATCHED',
    courier: 'Blue Dart Express Premium',
    awbNumber: 'BD-883920184IN',
    estimatedDelivery: 'Tomorrow, by 6:00 PM',
    destination: 'Bengaluru, Karnataka - 560034',
    items: [
      {
        title: 'Good Bee Frankincense Pure Essential Oil',
        volume: '15 ml',
        price: 1450,
        quantity: 1,
        image: '/images_ref/Frankin-300x300.webp'
      },
      {
        title: 'Good Bee Donkey Milk & Saffron Soap',
        volume: '125 g',
        price: 499,
        quantity: 2,
        image: '/images_ref/Donkey-Milk-Soap-300x300.webp'
      }
    ],
    total: 2448,
    steps: [
      { title: 'Order Verified & Harvest Allocated', date: 'Yesterday, 4:15 PM', done: true },
      { title: 'Lab Batch Tested & Active-Stabilized', date: 'Yesterday, 7:30 PM', done: true },
      { title: 'Dispatched via Blue Dart Air Hub', date: 'Today, 9:00 AM', done: true, active: true },
      { title: 'Out for Delivery to Destination', date: 'Expected Tomorrow', done: false }
    ]
  };

  const handleTrack = (queryToUse) => {
    const query = (queryToUse || searchQuery).trim();
    if (!query) {
      setError('Please enter an Order ID or Mobile Number.');
      return;
    }

    setError('');

    try {
      // Check localStorage orders first
      const orders = JSON.parse(localStorage.getItem('goodbee_orders') || '[]');
      const found = orders.find(
        (o) =>
          o.id?.toLowerCase().includes(query.toLowerCase()) ||
          o.customerPhone?.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, ''))
      );

      if (found) {
        setTrackedOrder({
          ...DEMO_ORDER,
          id: found.id,
          customerName: found.customerName || 'Good Bee Patron',
          customerPhone: found.customerPhone || query,
          total: found.total || 1450,
          items: found.items || DEMO_ORDER.items,
          placedAt: found.createdAt ? new Date(found.createdAt).toLocaleDateString() : 'Recent'
        });
        return;
      }
    } catch (e) {}

    // Fallback to Demo Order
    setTrackedOrder({
      ...DEMO_ORDER,
      id: query.startsWith('GB') ? query : `GB-${query.slice(-5) || '89211'}`
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative bg-brand-ivory rounded-3xl border-2 border-brand-gold/50 shadow-2xl max-w-2xl w-full overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-brand-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-brand-charcoal font-medium">
                Track Your Shipment
              </h3>
              <p className="text-xs text-brand-charcoal/70">
                Live consignment status from our South India extraction lab to your doorstep
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-muted hover:text-brand-charcoal hover:bg-brand-cream/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="pt-5 pb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. GB-89211) or Mobile Number"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-4 pr-10 py-3 bg-white border border-brand-gold/40 rounded-xl text-sm font-medium text-brand-charcoal focus:outline-none focus:border-brand-gold shadow-sm font-sans placeholder:text-brand-muted"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-brand-gold-dark hover:text-brand-charcoal transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-brand-charcoal text-brand-ivory text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-gold-dark transition-colors shadow-sm flex items-center gap-2"
            >
              <span>Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {error && <p className="text-xs text-rose-600 font-medium mt-1.5">{error}</p>}

          {!trackedOrder && (
            <div className="mt-3 flex items-center gap-2 text-xs text-brand-muted">
              <span>Quick test:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('GB-89211');
                  handleTrack('GB-89211');
                }}
                className="text-brand-gold-dark font-semibold underline hover:text-brand-charcoal transition-colors"
              >
                Try sample order #GB-89211
              </button>
            </div>
          )}
        </div>

        {/* Tracking Details Body */}
        {trackedOrder && (
          <div className="overflow-y-auto space-y-5 pr-1 mt-2">
            
            {/* Status Summary Banner */}
            <div className="p-4 rounded-2xl bg-brand-cream/80 border border-brand-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-charcoal">
                    Order #{trackedOrder.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-800 text-white shadow-sm">
                    In Transit
                  </span>
                </div>
                <p className="text-xs text-brand-charcoal/80 mt-1">
                  Courier: <strong>{trackedOrder.courier}</strong> (AWB: <span className="font-mono">{trackedOrder.awbNumber}</span>)
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-brand-muted uppercase font-semibold block">Estimated Delivery</span>
                <span className="text-xs font-bold text-emerald-800 font-sans block">{trackedOrder.estimatedDelivery}</span>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="space-y-4 px-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Fulfillment Milestones</h4>
              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-gold/30">
                {trackedOrder.steps.map((step, i) => (
                  <div key={i} className="relative">
                    <span
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                        step.done
                          ? 'bg-emerald-700 text-white'
                          : 'bg-brand-sand/60 text-brand-charcoal'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                    </span>
                    <div>
                      <p className={`text-xs font-semibold ${step.done ? 'text-brand-charcoal' : 'text-brand-muted'}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-brand-muted">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Action */}
            <div className="p-3 bg-white rounded-xl border border-brand-gold/20 flex items-center justify-between text-xs text-brand-charcoal">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>Destination: <strong>{trackedOrder.destination}</strong></span>
              </div>
              <a
                href={`https://wa.me/919963075000?text=${encodeURIComponent(
                  `Hello Good Bee Concierge, I would like live GPS tracking update for my consignment #${trackedOrder.id} (AWB: ${trackedOrder.awbNumber}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-[11px] font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Live Update</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
