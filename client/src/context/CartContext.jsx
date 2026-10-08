import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('goodbee_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoterCode, setPromoterCode] = useState('');
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  useEffect(() => {
    localStorage.setItem('goodbee_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
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
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
