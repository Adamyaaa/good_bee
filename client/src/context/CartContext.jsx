import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import AuthModal from '../components/common/AuthModal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('goodbee_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoterCode, setPromoterCode] = useState(() => localStorage.getItem('goodbee_coupon') || '');
  const [isDiscountApplied, setIsDiscountApplied] = useState(() => Boolean(localStorage.getItem('goodbee_coupon')));
  const [couponFeedback, setCouponFeedback] = useState({ message: '', isError: false });

  // Authentication gating modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('goodbee_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  // Valid Coupons & Rules Matrix (SHOP-20, SHOP-21)
  const VALID_COUPONS = {
    'BOTANICAL10': { discountPct: 10, minSubtotal: 0, description: '10% Off Sitewide' },
    'BEE10': { discountPct: 10, minSubtotal: 0, description: '10% Welcome Privilege' },
    'ELENA10': { discountPct: 10, minSubtotal: 0, description: '10% Brand Ambassador Discount' },
    'HONEY15': { discountPct: 15, minSubtotal: 0, description: '15% First Order Surprise' },
    'PUREBEE15': { discountPct: 15, minSubtotal: 1500, description: '15% Off Orders Above ₹1,500' }
  };

  /**
   * SHOP-11: Clamped Add to Cart
   * Never accepts 0, negative values, or NaN. Always enforces clean positive quantity.
   */
  const executeAddToCart = (product, quantity = 1) => {
    const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(99, item.quantity + cleanQty) } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          subtitle: product.subtitle,
          price: product.price,
          mrp: product.mrp,
          image: product.image,
          sku: product.sku,
          volume: product.volume,
          quantity: cleanQty
        }
      ];
    });
    setIsDrawerOpen(true);
  };

  /**
   * Add to Cart (frictionless guest & signed-in shopping bag)
   */
  const addToCart = (product, quantity = 1) => {
    executeAddToCart(product, quantity);
    return true;
  };

  const handleAuthSuccess = () => {
    if (pendingCartAction) {
      executeAddToCart(pendingCartAction.product, pendingCartAction.quantity);
      setPendingCartAction(null);
    }
  };

  /**
   * SHOP-11: Update Quantity Guard
   * If newQty <= 0 or invalid, removes item completely. Upper bound clamped at 99.
   */
  const updateQuantity = (id, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(id);
      return;
    }
    const clampedQty = Math.min(99, qty);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: clampedQty } : item)));
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setPromoterCode('');
    setIsDiscountApplied(false);
    localStorage.removeItem('goodbee_coupon');
    setCouponFeedback({ message: '', isError: false });
  };

  /**
   * SHOP-20 & SHOP-21: Coupon Validation Engine
   * Validates code existence, minimum cart value threshold, and returns clear feedback.
   */
  const applyPromoCode = (code) => {
    if (!code || !code.trim()) {
      const res = { success: false, message: 'Please enter a coupon code.' };
      setCouponFeedback({ message: res.message, isError: true });
      return res;
    }

    const clean = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[clean];

    if (!coupon) {
      const res = { success: false, message: 'Invalid coupon code. Try BOTANICAL10 or PUREBEE15.' };
      setCouponFeedback({ message: res.message, isError: true });
      return res;
    }

    if (coupon.minSubtotal > 0 && subtotal < coupon.minSubtotal) {
      const res = {
        success: false,
        message: `${clean} requires a minimum cart value of ₹${coupon.minSubtotal.toLocaleString('en-IN')}. Current subtotal: ₹${subtotal.toLocaleString('en-IN')}.`
      };
      setCouponFeedback({ message: res.message, isError: true });
      return res;
    }

    setPromoterCode(clean);
    setIsDiscountApplied(true);
    localStorage.setItem('goodbee_coupon', clean);
    const res = {
      success: true,
      message: `Coupon ${clean} applied! (${coupon.discountPct}% off)`
    };
    setCouponFeedback({ message: res.message, isError: false });
    return res;
  };

  const removePromoCode = () => {
    setPromoterCode('');
    setIsDiscountApplied(false);
    localStorage.removeItem('goodbee_coupon');
    setCouponFeedback({ message: 'Coupon removed.', isError: false });
  };

  // Safe Math Calculations (SHOP-10, SHOP-20, SHOP-23)
  const subtotal = items.reduce((sum, item) => sum + Math.max(0, item.price) * Math.max(1, item.quantity), 0);
  
  // Re-verify coupon minimum threshold against current subtotal
  const activeCoupon = VALID_COUPONS[promoterCode];
  const isCouponThresholdMet = Boolean(
    isDiscountApplied &&
    activeCoupon &&
    (activeCoupon.minSubtotal === 0 || subtotal >= activeCoupon.minSubtotal)
  );
  
  const discountPct = isCouponThresholdMet ? activeCoupon.discountPct : 0;
  const discount = Math.round(subtotal * (discountPct / 100));
  
  // SHOP-23: Free shipping threshold (₹999 rule)
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = items.reduce((sum, item) => sum + Math.max(1, item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
        promoterCode,
        applyPromoCode,
        removePromoCode,
        isDiscountApplied: isCouponThresholdMet,
        couponFeedback,
        subtotal,
        discount,
        shipping,
        total,
        itemCount,
        VALID_COUPONS
      }}
    >
      {children}
      {/* Global Auth Gate Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingCartAction(null);
        }}
        onSuccess={handleAuthSuccess}
        pendingProduct={pendingCartAction?.product}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
