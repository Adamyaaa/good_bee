import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import AuthModal from '../components/common/AuthModal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('goodbee_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoterCode, setPromoterCode] = useState('');
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  // Authentication gating modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);

  useEffect(() => {
    localStorage.setItem('goodbee_cart', JSON.stringify(items));
  }, [items]);

  const executeAddToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
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
          quantity
        }
      ];
    });
    setIsDrawerOpen(true);
  };

  /**
   * Add to Cart with Authentication Check:
   * If user is not logged in, trigger the seamless AuthModal and preserve the target item.
   * After login/registration succeeds, the item is instantly added to the cart!
   */
  const addToCart = (product, quantity = 1) => {
    if (!user) {
      setPendingCartAction({ product, quantity });
      setIsAuthModalOpen(true);
      return false;
    }

    executeAddToCart(product, quantity);
    return true;
  };

  const handleAuthSuccess = () => {
    if (pendingCartAction) {
      executeAddToCart(pendingCartAction.product, pendingCartAction.quantity);
      setPendingCartAction(null);
    }
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setPromoterCode('');
    setIsDiscountApplied(false);
  };

  const applyPromoCode = (code) => {
    if (!code) return false;
    const clean = code.trim().toUpperCase();
    if (clean.includes('BEE') || clean.includes('ELENA') || clean.includes('10')) {
      setPromoterCode(clean);
      setIsDiscountApplied(true);
      return true;
    }
    return false;
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = isDiscountApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal - discount + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
        isDiscountApplied,
        subtotal,
        discount,
        shipping,
        total,
        itemCount
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
