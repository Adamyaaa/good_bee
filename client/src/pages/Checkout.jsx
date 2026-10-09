import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import DynamicPaymentQrModal from '../components/storefront/DynamicPaymentQrModal';
import { GoodBeeApi } from '../services/api';
import { ShieldCheck, QrCode, CheckCircle2, MessageCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Checkout({ onBack, onNavigateHome }) {
  const { items, subtotal, discount, shipping, total, promoterCode, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    street: '402, High Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    paymentMethod: 'DYNAMIC_UPI_QR'
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [dynamicQrData, setDynamicQrData] = useState(null);
  const [whatsappSupportUrl, setWhatsappSupportUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!items.length) return;

    setPlacingOrder(true);
    const orderId = `GB-ORD-${Date.now().toString().slice(-6)}`;

    try {
      let data = null;
      try {
        const res = await fetch('/api/v1/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            customerName: form.name,
            customerEmail: form.email,
            customerPhone: form.phone,
            shippingAddress: {
              street: form.street,
              city: form.city,
              state: form.state,
              pincode: form.pincode
            },
            promoterCode,
            paymentMethod: form.paymentMethod
          })
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (err) {
        // Fallback for static Netlify host
      }

      // If backend was not reached or Netlify static host
      if (!data || !data.order) {
        const qr = await GoodBeeApi.generateClientDynamicQr(orderId, total);
        data = {
          order: {
            id: orderId,
            total,
            items,
            customerName: form.name,
            shippingAddress: {
              street: form.street,
              city: form.city,
              state: form.state,
              pincode: form.pincode
            },
            paymentMethod: form.paymentMethod,
            paymentStatus: 'PENDING_PAYMENT'
          },
          dynamicQr: qr,
          whatsappSupportUrl: `https://wa.me/919876543210?text=${encodeURIComponent(
            `Hello Good Bee Support, I have placed order #${orderId} (₹${total}).`
          )}`
        };
      }

      setActiveOrder(data.order);
      setDynamicQrData(data.dynamicQr);
      setWhatsappSupportUrl(data.whatsappSupportUrl);

      if (form.paymentMethod === 'DYNAMIC_UPI_QR' && data.dynamicQr) {
        setShowQrModal(true);
      } else {
        handlePaymentSuccess(data.order);
      }
    } catch (err) {
      alert(err.message || 'Error creating order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = (order) => {
    setShowQrModal(false);
    setConfirmedOrder(order);
    clearCart();

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  if (confirmedOrder) {
    return (
      <div className="py-20 bg-brand-ivory min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 shadow-luxury">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
              Payment & Order Verified
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
              Thank You for Your Patronage
            </h1>
            <p className="text-sm text-brand-charcoal/70">
              Your order <span className="font-mono font-bold text-brand-charcoal">#{confirmedOrder.id}</span> has been confirmed and queued for laboratory batch packing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-cream/60 border border-brand-gold/30 text-left space-y-3">
            <div className="flex justify-between text-xs pb-2 border-b border-brand-gold/20">
              <span className="text-brand-muted">Amount Paid:</span>
              <span className="font-bold text-brand-charcoal">₹{confirmedOrder.total.toLocaleString('en-IN')} via Dynamic UPI QR</span>
            </div>
            <div className="flex justify-between text-xs pb-2 border-b border-brand-gold/20">
              <span className="text-brand-muted">Delivery Address:</span>
              <span className="font-medium text-brand-charcoal text-right">
                {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city} - {confirmedOrder.shippingAddress.pincode}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-brand-muted">UPI Ref / Status:</span>
              <span className="font-mono text-emerald-800 font-semibold">{confirmedOrder.upiRef || 'PAID'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello Good Bee Concierge, I just completed order #${confirmedOrder.id} (₹${confirmedOrder.total}). Could you verify my dispatch details?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-800 text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Track Dispatch on WhatsApp</span>
            </a>

            <button
              onClick={onNavigateHome}
              className="px-6 py-3 bg-brand-charcoal text-brand-ivory rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-brand-gold-dark transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-brand-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-brand-muted hover:text-brand-charcoal transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <h1 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form (Col 7) */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
            
            {/* Customer Details */}
            <div className="bg-brand-cream/50 p-6 rounded-2xl border border-brand-gold/30 space-y-4">
              <h3 className="font-serif text-xl font-semibold text-brand-charcoal">
                1. Patron Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-medium text-brand-charcoal">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="patron@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-brand-cream/50 p-6 rounded-2xl border border-brand-gold/30 space-y-4">
              <h3 className="font-serif text-xl font-semibold text-brand-charcoal">
                2. Shipping Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-medium text-brand-charcoal">Street Address / Landmark</label>
                  <input
                    type="text"
                    required
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="Apartment, Studio, Floor"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">State</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-medium text-brand-charcoal">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                  />
                </div>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div className="bg-brand-cream/50 p-6 rounded-2xl border border-brand-gold/30 space-y-4">
              <h3 className="font-serif text-xl font-semibold text-brand-charcoal">
                3. Payment Method
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-brand-gold bg-brand-ivory cursor-pointer shadow-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="DYNAMIC_UPI_QR"
                    checked={form.paymentMethod === 'DYNAMIC_UPI_QR'}
                    onChange={() => setForm({ ...form, paymentMethod: 'DYNAMIC_UPI_QR' })}
                    className="mt-1 text-brand-gold focus:ring-brand-gold"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-brand-charcoal">
                        Dynamic Payment QR (All UPI Apps)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-gold text-brand-charcoal">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      Dynamically generated for the exact ₹{total} invoice amount. Zero fees via GPay, PhonePe, Paytm, or BHIM.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-brand-gold/30 bg-brand-ivory/60 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={form.paymentMethod === 'COD'}
                    onChange={() => setForm({ ...form, paymentMethod: 'COD' })}
                    className="mt-1 text-brand-gold focus:ring-brand-gold"
                  />
                  <div>
                    <span className="font-semibold text-xs text-brand-charcoal">
                      Cash on Delivery / Courier Settlement
                    </span>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      Pay upon delivery to the courier partner.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder || items.length === 0}
              className="w-full py-4 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-brand-gold-dark transition-all duration-300 shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {placingOrder ? (
                <span>Generating Dynamic Invoice QR...</span>
              ) : (
                <>
                  <span>Place Order & Pay ₹{total.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Bag Summary (Col 5) */}
          <div className="lg:col-span-5 bg-brand-cream/60 p-6 rounded-2xl border border-brand-gold/30 space-y-6">
            <h3 className="font-serif text-xl font-semibold text-brand-charcoal">
              Order Summary ({items.length} items)
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3 items-center border-b border-brand-gold/15 pb-3">
                  <img src={it.image} alt={it.title} className="w-12 h-12 rounded-lg object-cover bg-brand-sand/40" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-xs font-semibold text-brand-charcoal truncate">{it.title}</h5>
                    <p className="text-[11px] text-brand-muted">Qty: {it.quantity} × ₹{it.price}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-charcoal">
                    ₹{(it.quantity * it.price).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-brand-gold/20 pt-4 text-brand-charcoal/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promoter Benefit ({promoterCode})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-brand-charcoal pt-2 border-t border-brand-gold/20">
                <span>Payable Total</span>
                <span className="font-serif text-xl text-brand-charcoal">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-brand-sand/50 rounded-xl border border-brand-gold/20 flex items-center gap-2 text-[11px] text-brand-charcoal">
              <ShieldCheck className="w-4 h-4 text-brand-gold-dark flex-shrink-0" />
              <span>100% Secure Transaction. Configured for Good Bee official accounts.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic QR Modal */}
      {showQrModal && activeOrder && dynamicQrData && (
        <DynamicPaymentQrModal
          order={activeOrder}
          dynamicQr={dynamicQrData}
          whatsappSupportUrl={whatsappSupportUrl}
          onClose={() => setShowQrModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
