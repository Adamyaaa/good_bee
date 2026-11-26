import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer({ onCheckout }) {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    total,
    applyPromoCode,
    removePromoCode,
    promoterCode,
    isDiscountApplied,
    couponFeedback
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [localFeedback, setLocalFeedback] = useState({ text: '', isError: false });

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setLocalFeedback({ text: res.message, isError: !res.success });
  };

  // SHOP-44 & SHOP-45: WhatsApp Concierge Order Payload Generator
  const cleanPhone = '919963075000';
  const itemsText = items.map((it) => `• ${it.quantity}x ${it.title} (₹${(it.price * it.quantity).toLocaleString('en-IN')})`).join('\n');
  const waCartMsg = `*Hello Good Bee Concierge, I would like to place an order via WhatsApp:*
━━━━━━━━━━━━━━━━━━━━
${itemsText}
━━━━━━━━━━━━━━━━━━━━
*Bag Subtotal:* ₹${subtotal.toLocaleString('en-IN')}${discount > 0 ? `\n*Coupon Discount (${promoterCode}):* -₹${discount.toLocaleString('en-IN')}` : ''}
*Shipping:* ${shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}
*Final Payable Total:* ₹${total.toLocaleString('en-IN')}

Please confirm order formulation availability and delivery dispatch.`;
  const whatsappOrderUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waCartMsg)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div
        className="absolute inset-0 bg-brand-charcoal/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-ivory border-l border-brand-gold/30 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-brand-gold/20 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl text-[#1A1918] font-semibold">Your Shopping Bag</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#5B0868] text-white font-bold">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-brand-charcoal hover:text-[#5B0868] transition-colors rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-purple-50/60 px-6 py-3 border-b border-brand-gold/20">
            <div className="flex items-center justify-between text-xs text-[#1A1918] font-medium mb-1.5">
              <span>
                {remainingForFree === 0 ? (
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    ✓ You have unlocked Complimentary Pan-India Delivery
                  </span>
                ) : (
                  <span>Add ₹{remainingForFree} more for Complimentary Shipping</span>
                )}
              </span>
              <span className="font-bold text-[#5B0868]">₹999</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-purple-200/70">
              <div
                className="h-full bg-[#5B0868] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-brand-gold/30 flex items-center justify-center p-2 shadow-sm">
                  <img
                    src="/assets/goodbee-bee-mark-gold.png"
                    alt="Good Bee Emblem"
                    className="w-full h-full object-contain opacity-90"
                  />
                </div>
                <h3 className="font-serif text-xl text-brand-charcoal font-medium">Your bag is currently empty</h3>
                <p className="text-xs text-brand-muted max-w-xs mx-auto">
                  Explore our cold-cured beeswax soaps, steam-distilled essential oils, and botanical mists.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-6 py-2.5 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-brand-gold/25 bg-white shadow-2xs flex gap-3.5 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover bg-brand-sand/40 border border-brand-gold/20 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-brand-charcoal truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-brand-muted">{item.volume}</p>
                    <p className="text-xs font-bold text-brand-charcoal mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-brand-muted hover:text-red-700 transition-colors p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center border border-brand-gold/30 rounded-lg bg-brand-ivory px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-0.5 text-brand-charcoal hover:text-brand-gold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-brand-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-0.5 text-brand-charcoal hover:text-brand-gold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-brand-gold/20 bg-brand-cream/50 space-y-4">
              
              {/* Promo Code Input & Feedback (SHOP-20, SHOP-21) */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-brand-gold-dark absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. BOTANICAL10, PUREBEE15)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-[16px] sm:text-xs uppercase bg-brand-ivory border border-brand-gold/30 rounded-lg focus:outline-none focus:border-brand-gold"
                    data-testid="coupon-input"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  data-testid="apply-coupon-btn"
                >
                  Apply
                </button>
              </form>

              {isDiscountApplied ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Applied: <strong>{promoterCode}</strong> (-₹{discount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-emerald-900 underline text-[10px] font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (localFeedback.text || couponFeedback.message) ? (
                <div className={`p-2.5 rounded-xl text-[11px] flex items-center gap-1.5 ${
                  (localFeedback.isError || couponFeedback.isError)
                    ? 'bg-rose-50 border border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}>
                  {(localFeedback.isError || couponFeedback.isError) ? (
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
                  )}
                  <span>{localFeedback.text || couponFeedback.message}</span>
                </div>
              ) : null}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-brand-charcoal/80 border-t border-brand-gold/15 pt-3">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-brand-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-brand-charcoal pt-1.5 border-t border-brand-gold/15">
                  <span>Final Payable Total</span>
                  <span className="font-serif text-lg text-brand-charcoal">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Dynamic QR Highlight Note */}
              <div className="p-2.5 rounded-lg bg-brand-sand/50 border border-brand-gold/30 flex items-center gap-2 text-[11px] text-brand-charcoal">
                <ShieldCheck className="w-4 h-4 text-brand-gold-dark flex-shrink-0" />
                <span>Dynamic Bill-to-QR enabled. Instant zero-fee checkout via any UPI app.</span>
              </div>

              {/* Dual Action: Proceed to Checkout & Order on WhatsApp (SHOP-44, SHOP-45) */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onCheckout();
                  }}
                  className="w-full py-3.5 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                  data-testid="proceed-to-checkout-btn"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
                  data-testid="order-on-whatsapp-btn"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Order on WhatsApp Concierge</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
