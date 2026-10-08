import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
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
    promoterCode,
    isDiscountApplied
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCode) return;
    const ok = applyPromoCode(inputCode);
    if (!ok) {
      setCouponError('Invalid code. Try BEE10 or ELENA10');
    } else {
      setCouponError('');
    }
  };

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
          <div className="p-6 border-b border-brand-gold/20 flex items-center justify-between bg-brand-cream/60">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl text-brand-charcoal font-semibold">Your Shopping Bag</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-gold text-brand-charcoal font-bold">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-brand-charcoal hover:text-brand-gold-dark transition-colors rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-brand-sand/40 px-6 py-3 border-b border-brand-gold/15">
            <div className="flex items-center justify-between text-xs text-brand-charcoal font-medium mb-1.5">
              <span>
                {remainingForFree === 0 ? (
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    ✓ You have unlocked Complimentary Delivery
                  </span>
                ) : (
                  <span>Add ₹{remainingForFree} more for Complimentary Shipping</span>
                )}
              </span>
              <span>₹999</span>
            </div>
            <div className="w-full h-1.5 bg-brand-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-gold transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-cream border border-brand-gold/30 flex items-center justify-center">
                  <img
                    src="/assets/good-bee-logo.png"
                    alt="Good Bee Emblem"
                    className="w-10 h-10 rounded-full opacity-60"
                  />
                </div>
                <h3 className="font-serif text-xl text-brand-charcoal font-medium">Your bag is currently empty</h3>
                <p className="text-xs text-brand-muted max-w-xs mx-auto">
                  Explore our research-backed botanical serums, creams, and restorative nectars.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-6 py-2.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-gold-dark transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-brand-gold/20 bg-brand-cream/30 flex gap-4 items-center"
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
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-brand-gold-dark absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Promoter or Loyalty Code"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-brand-ivory border border-brand-gold/30 rounded-lg focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-brand-gold-dark transition-colors"
                >
                  Apply
                </button>
              </form>

              {isDiscountApplied && (
                <div className="text-[11px] text-emerald-800 font-medium flex items-center justify-between">
                  <span>Code Applied: {promoterCode}</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              {couponError && (
                <div className="text-[11px] text-red-700 font-medium">{couponError}</div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-brand-charcoal/80 border-t border-brand-gold/15 pt-3">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-brand-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Privilege Discount</span>
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

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onCheckout();
                }}
                className="w-full py-4 bg-brand-charcoal text-brand-ivory text-xs font-semibold tracking-widest uppercase rounded-full hover:bg-brand-gold-dark transition-all duration-300 shadow-luxury flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
