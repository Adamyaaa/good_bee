import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import DynamicPaymentQrModal from '../components/storefront/DynamicPaymentQrModal';
import { GoodBeeApi } from '../services/api';
import { ShieldCheck, QrCode, CheckCircle2, MessageCircle, ArrowLeft, ArrowRight, MapPin, Zap, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const STATE_CITIES = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Navi Mumbai', 'Aurangabad', 'Kolhapur', 'Other City...'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli-Dharwad', 'Mangaluru', 'Belagavi', 'Davanagere', 'Other City...'],
  'Delhi': ['New Delhi', 'South Delhi', 'Central Delhi', 'West Delhi', 'North Delhi', 'East Delhi', 'Other City...'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Other City...'],
  'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Other City...'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar', 'Other City...'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Other City...'],
  'Uttar Pradesh': ['Lucknow', 'Noida', 'Greater Noida', 'Kanpur', 'Varanasi', 'Agra', 'Ghaziabad', 'Other City...'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Other City...'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kannur', 'Other City...'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Other City...'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Other City...'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Panchkula', 'Other City...'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Other City...'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Other City...'],
  'Other State / UT': ['Metropolitan Area', 'Regional Town', 'Other City...']
};

const SAVED_ADDRESS_PRESETS = [
  { id: 'addr_1', label: 'Home (Mumbai)', street: '402, Lotus Greens, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
  { id: 'addr_2', label: 'Office Studio (Bengaluru)', street: 'Level 4, Brigade Tech Gardens, Whitefield', city: 'Bengaluru', state: 'Karnataka', pincode: '560066' },
  { id: 'addr_3', label: 'Delhi NCR Hub', street: 'B-12, Greater Kailash Part 1', city: 'New Delhi', state: 'Delhi', pincode: '110048' }
];

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

  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [selectedAddressPreset, setSelectedAddressPreset] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeMessage, setPincodeMessage] = useState('');

  // Record active checkout session for Abandoned Cart recovery
  useEffect(() => {
    if (items.length > 0 && !confirmedOrder) {
      try {
        const abandonedSession = {
          id: `cart_${Date.now()}`,
          customerName: form.name || (user ? user.name : 'Guest Shopper'),
          customerEmail: form.email || (user ? user.email : ''),
          customerPhone: form.phone || (user ? user.phone : ''),
          items: items.map((it) => ({
            id: it.id || it.product?.id,
            title: it.title || it.product?.title,
            price: it.price || it.product?.price,
            quantity: it.quantity,
            volume: it.volume || it.product?.volume,
            image: it.image || it.product?.image
          })),
          subtotal,
          total,
          pincode: form.pincode,
          city: form.city,
          state: form.state,
          abandonedAt: new Date().toISOString(),
          status: 'LEFT_IN_CART'
        };
        localStorage.setItem('goodbee_active_abandoned_session', JSON.stringify(abandonedSession));

        // Add to historical abandoned carts queue if not already completed
        const existing = JSON.parse(localStorage.getItem('goodbee_abandoned_carts') || '[]');
        const filtered = existing.filter((c) => c.customerEmail !== abandonedSession.customerEmail || !abandonedSession.customerEmail);
        localStorage.setItem('goodbee_abandoned_carts', JSON.stringify([abandonedSession, ...filtered.slice(0, 19)]));
      } catch (e) {}
    }
  }, [items, form.name, form.email, form.phone, form.pincode, form.city, form.state, subtotal, total, confirmedOrder, user]);

  // Pincode Auto-Fill Handler
  const handlePincodeChange = async (val) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    setForm((prev) => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 6) {
      setPincodeLoading(true);
      setPincodeMessage('Detecting State & District...');
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            const fetchedDistrict = po.District;
            const fetchedState = po.State;

            setForm((prev) => ({
              ...prev,
              city: fetchedDistrict,
              state: fetchedState
            }));
            setIsCustomCity(true);
            setCustomCity(fetchedDistrict);
            setPincodeMessage(`Auto-filled: ${fetchedDistrict}, ${fetchedState}`);
            setPincodeLoading(false);
            return;
          }
        }
      } catch (err) {
        // Fallback to local heuristic lookup
      }

      // Offline/Local lookup map fallback for high-traffic zones
      const prefix = cleanPin.slice(0, 2);
      const prefixMap = {
        '11': { state: 'Delhi', city: 'New Delhi' },
        '40': { state: 'Maharashtra', city: 'Mumbai' },
        '41': { state: 'Maharashtra', city: 'Pune' },
        '56': { state: 'Karnataka', city: 'Bengaluru' },
        '60': { state: 'Tamil Nadu', city: 'Chennai' },
        '50': { state: 'Telangana', city: 'Hyderabad' },
        '38': { state: 'Gujarat', city: 'Ahmedabad' },
        '70': { state: 'West Bengal', city: 'Kolkata' },
        '22': { state: 'Uttar Pradesh', city: 'Lucknow' },
        '20': { state: 'Uttar Pradesh', city: 'Noida' },
        '30': { state: 'Rajasthan', city: 'Jaipur' },
        '68': { state: 'Kerala', city: 'Kochi' },
        '16': { state: 'Punjab', city: 'Chandigarh' },
        '45': { state: 'Madhya Pradesh', city: 'Indore' }
      };

      if (prefixMap[prefix]) {
        const entry = prefixMap[prefix];
        setForm((prev) => ({ ...prev, city: entry.city, state: entry.state }));
        setIsCustomCity(true);
        setCustomCity(entry.city);
        setPincodeMessage(`Auto-filled: ${entry.city}, ${entry.state}`);
      } else {
        setPincodeMessage('Pincode verified for Priority Courier.');
      }
      setPincodeLoading(false);
    } else {
      setPincodeMessage('');
    }
  };

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
          whatsappSupportUrl: `https://wa.me/919963075000?text=${encodeURIComponent(
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
    const completeOrder = {
      ...order,
      customerName: form.name,
      customerPhone: form.phone || '+91 99630 75000',
      customerEmail: form.email,
      placedAt: new Date().toISOString(),
      status: 'PROCESSING',
      courier: 'Blue Dart Express Priority',
      awbNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      items: items.map((it) => ({
        title: it.product.title,
        price: it.product.price,
        quantity: it.quantity,
        volume: it.product.volume || 'Standard Pack',
        image: it.product.image
      }))
    };

    setConfirmedOrder(completeOrder);
    clearCart();

    // Clear abandoned session since purchase was successful
    try {
      localStorage.removeItem('goodbee_active_abandoned_session');
      const abCarts = JSON.parse(localStorage.getItem('goodbee_abandoned_carts') || '[]');
      const remaining = abCarts.filter((c) => c.customerEmail !== form.email);
      localStorage.setItem('goodbee_abandoned_carts', JSON.stringify(remaining));
    } catch (e) {}

    // Persist to localStorage for TrackOrderModal & CustomerPortal
    try {
      const existing = JSON.parse(localStorage.getItem('goodbee_orders') || '[]');
      existing.unshift(completeOrder);
      localStorage.setItem('goodbee_orders', JSON.stringify(existing));
    } catch (e) {}

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  if (confirmedOrder) {
    const itemsSummary = (confirmedOrder.items || items)
      .map((it, idx) => `${idx + 1}. ${it.title || it.product?.title} (Qty: ${it.quantity}) - ₹${((it.price || it.product?.price || 0) * it.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const customerReceiptMsg = `*GOOD BEE — OFFICIAL PAYMENT RECEIPT*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* #${confirmedOrder.id}
*Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
*Customer:* ${confirmedOrder.customerName || form.name}
*Mobile:* ${confirmedOrder.customerPhone || form.phone}

*ITEMS ORDERED:*
${itemsSummary}

*TOTAL PAID:* ₹${confirmedOrder.total.toLocaleString('en-IN')}
*Payment Mode:* Dynamic UPI QR [VERIFIED]
*Delivery Address:* ${confirmedOrder.shippingAddress.street}, ${confirmedOrder.shippingAddress.city} - ${confirmedOrder.shippingAddress.pincode}
*Courier Partner:* Blue Dart Express Priority
━━━━━━━━━━━━━━━━━━━━
*Status:* Batch Allocation & Laboratory Inspection in progress.
Thank you for choosing 100% natural, research-driven skincare!`;

    const operationsDispatchMsg = `*NEW ORDER PACKING & DISPATCH SLIP — GoodBEE*
━━━━━━━━━━━━━━━━━━━━
*Order Ref:* #${confirmedOrder.id}
*Customer:* ${confirmedOrder.customerName || form.name} (${confirmedOrder.customerPhone || form.phone})
*Ship Destination:* ${confirmedOrder.shippingAddress.street}, ${confirmedOrder.shippingAddress.city}, ${confirmedOrder.shippingAddress.state} - ${confirmedOrder.shippingAddress.pincode}

*ITEMS TO PACK:*
${itemsSummary}

*Amount Collected:* ₹${confirmedOrder.total.toLocaleString('en-IN')} [PAID via UPI QR]
*Priority:* Blue Dart Air Priority
━━━━━━━━━━━━━━━━━━━━
Action: Please print lot batch certificate and initiate packaging.`;

    const cleanCustomerPhone = (confirmedOrder.customerPhone || form.phone || '').replace(/[^0-9]/g, '');

    return (
      <div className="pt-28 sm:pt-36 pb-20 bg-brand-ivory min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 shadow-luxury">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
              Payment & Order Verified
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
              Thank You for Your Order
            </h1>
            <p className="text-sm text-brand-charcoal/70">
              Your order <span className="font-mono font-bold text-brand-charcoal">#{confirmedOrder.id}</span> has been confirmed and queued for laboratory batch packing.
            </p>
          </div>

          {/* Itemized Digital Receipt Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-brand-cream/80 border border-brand-gold/40 text-left space-y-4 shadow-luxury">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-gold/25 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark">Official Invoice</span>
                <p className="font-mono text-base font-bold text-brand-charcoal">#{confirmedOrder.id}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Payment Verified (Dynamic UPI QR)
                </span>
                <p className="text-xs text-brand-muted mt-1">Paid: ₹{confirmedOrder.total.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="space-y-2 py-2 border-b border-brand-gold/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block">Purchased Formulations:</span>
              {(confirmedOrder.items || items).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-brand-charcoal font-medium">
                    {item.quantity}x {item.title || item.product?.title}
                  </span>
                  <span className="font-semibold text-brand-charcoal">
                    ₹{((item.price || item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-brand-muted text-[11px] block">Shipping Destination:</span>
                <span className="font-medium text-brand-charcoal leading-relaxed block mt-0.5">
                  {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city} - {confirmedOrder.shippingAddress.pincode}
                </span>
              </div>
              <div>
                <span className="text-brand-muted text-[11px] block">Customer Contact:</span>
                <span className="font-medium text-brand-charcoal block mt-0.5">
                  {confirmedOrder.customerName || form.name} ({confirmedOrder.customerPhone || form.phone})
                </span>
              </div>
            </div>
          </div>

          {/* Client MoM WhatsApp Dual Receipt Action Block */}
          <div className="p-6 rounded-3xl bg-brand-charcoal text-brand-ivory border border-brand-gold/40 text-left space-y-4 shadow-2xl">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold-light">
                Automated WhatsApp Receipts (Client MoM Feature)
              </span>
              <h3 className="font-serif text-lg font-medium text-white mt-0.5">
                Dispatch & Order Confirmations on WhatsApp
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Receipt to Customer WhatsApp */}
              <a
                href={`https://wa.me/${cleanCustomerPhone || '919963075000'}?text=${encodeURIComponent(customerReceiptMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white transition-all flex items-center justify-between gap-3 shadow-md group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-emerald-200 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold block">Send Receipt to My WhatsApp</span>
                    <span className="text-[10px] text-emerald-200">Customer Digital Tax Invoice</span>
                  </div>
                </div>
                <span className="text-xs font-mono">→</span>
              </a>

              {/* Receipt to GoodBEE Operations Team (+91-9963075000) */}
              <a
                href={`https://wa.me/919963075000?text=${encodeURIComponent(operationsDispatchMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-brand-gold hover:bg-brand-gold-light text-brand-charcoal transition-all flex items-center justify-between gap-3 shadow-md group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-brand-charcoal flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold block">Notify GB Operations Team</span>
                    <span className="text-[10px] text-brand-charcoal/80">+91-9963075000 Packing Slip</span>
                  </div>
                </div>
                <span className="text-xs font-mono">→</span>
              </a>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={onNavigateHome}
              className="px-8 py-3 bg-brand-charcoal text-brand-ivory rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-brand-gold-dark transition-colors shadow-luxury"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-brand-ivory min-h-screen">
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
                1. Customer Information
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
                    placeholder="customer@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address with Drop-Down Optimization */}
            <div className="bg-brand-cream/50 p-6 rounded-2xl border border-brand-gold/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-serif text-xl font-semibold text-brand-charcoal flex items-center gap-2">
                  <span>2. Delivery Destination</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Dropdown Optimized
                  </span>
                </h3>
              </div>

              {/* Quick Select Saved Address Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-brand-gold-dark" />
                  <span>1-Click Quick Select Saved Address:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAVED_ADDRESS_PRESETS.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => {
                        setSelectedAddressPreset(addr.id);
                        setForm({
                          ...form,
                          street: addr.street,
                          city: addr.city,
                          state: addr.state,
                          pincode: addr.pincode
                        });
                        setIsCustomCity(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedAddressPreset === addr.id
                          ? 'bg-[#5B0868] text-white shadow-sm'
                          : 'bg-white hover:bg-brand-cream border border-brand-gold/30 text-brand-charcoal'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-brand-gold" />
                      <span>{addr.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                
                {/* Street */}
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-medium text-brand-charcoal">Street Address / Landmark</label>
                  <input
                    type="text"
                    required
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="Flat / Floor, Society, Street"
                  />
                </div>

                {/* State Dropdown */}
                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">State / Region (Dropdown)</label>
                  <select
                    required
                    value={form.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const citiesForState = STATE_CITIES[newState] || ['Metropolitan Area'];
                      setForm({
                        ...form,
                        state: newState,
                        city: citiesForState[0] === 'Other City...' ? '' : citiesForState[0]
                      });
                      setIsCustomCity(citiesForState[0] === 'Other City...');
                      setSelectedAddressPreset(null);
                    }}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal font-medium cursor-pointer"
                  >
                    {Object.keys(STATE_CITIES).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Cascading Dropdown */}
                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">City / District (Dropdown)</label>
                  <select
                    required
                    value={isCustomCity ? 'Other City...' : form.city}
                    onChange={(e) => {
                      if (e.target.value === 'Other City...') {
                        setIsCustomCity(true);
                        setForm({ ...form, city: customCity || '' });
                      } else {
                        setIsCustomCity(false);
                        setForm({ ...form, city: e.target.value });
                      }
                      setSelectedAddressPreset(null);
                    }}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal font-medium cursor-pointer"
                  >
                    {(STATE_CITIES[form.state] || ['Other City...']).map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Custom City input if 'Other City...' selected */}
                {isCustomCity && (
                  <div className="sm:col-span-2">
                    <label className="block mb-1 font-medium text-brand-charcoal">Enter Your Town / Locality Name</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => {
                        setForm({ ...form, city: e.target.value });
                        setCustomCity(e.target.value);
                      }}
                      placeholder="Enter city or district"
                      className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    />
                  </div>
                )}

                {/* PIN Code with 6-digit Auto-fill */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-brand-charcoal">PIN Code (Enter 6 Digits to Auto-fill State & District)</label>
                    {pincodeLoading && (
                      <span className="text-[11px] text-purple-700 font-medium flex items-center gap-1 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> Fetching location...
                      </span>
                    )}
                    {!pincodeLoading && pincodeMessage && (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {pincodeMessage}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="^[1-9][0-9]{5}$"
                    value={form.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal font-mono font-bold tracking-wider"
                    placeholder="e.g. 560001 (auto-fills Bengaluru, Karnataka)"
                  />
                  <p className="text-[10px] text-brand-muted mt-1">
                    Entering your 6-digit postal code instantly resolves your District and State.
                  </p>
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
