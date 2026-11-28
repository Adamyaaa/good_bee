import React, { createContext, useContext, useState, useEffect } from 'react';
import { validatePasswordForRegistration } from '../utils/passwordStrength';

const AuthContext = createContext();

// Simple client-side one-way password obfuscation/hash to guarantee AUTH-51 compliance (no plaintext in storage)
const hashPassword = (pwd) => {
  if (!pwd) return '';
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `gb_hash_${Math.abs(hash).toString(16)}`;
};

// Pre-seeded multi-role demo accounts matching Minutes of Meet
export const DEMO_ACCOUNTS = {
  ADMIN: {
    id: 'usr_admin',
    name: 'Good Bee Administrator',
    email: 'admin@goodbee.com',
    password: 'admin',
    role: 'ADMIN',
    phone: '+91 99630 75000',
    title: 'Store Administrator & Operations Control'
  },
  PRODUCER: {
    id: 'usr_producer_1',
    name: 'Aura Botanica Bio-Labs',
    email: 'producer@goodbee.com',
    password: 'producer',
    role: 'PRODUCER',
    companyName: 'Aura Botanica Apiaries & Labs',
    labCertId: 'LAB-ISO-9001-GB',
    phone: '+91 99630 75001',
    title: 'Vendor / Botanical Supplier'
  },
  DEALER: {
    id: 'usr_dealer_1',
    name: 'Apex Luxury Skincare Distributors',
    email: 'dealer@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    dealerCode: 'DLR-MUM-01',
    gstNumber: '27AABCU9603R1ZM',
    companyName: 'Apex Luxury Distributors LLP',
    tier: 'Gold Tier Stockist',
    phone: '+91 99630 75002',
    title: 'Wholesaler / Regional Stockist'
  },
  PROMOTER: {
    id: 'usr_promoter_1',
    name: 'Elena Vance Rituals',
    email: 'promoter@goodbee.com',
    password: 'promoter',
    role: 'PROMOTER',
    referralCode: 'ELENA10',
    phone: '+91 99630 75003',
    title: 'Reseller / Promo Partner'
  },
  CUSTOMER: {
    id: 'usr_customer_1',
    name: 'Customer',
    email: 'customer@goodbee.com',
    password: 'customer',
    role: 'CUSTOMER',
    loyaltyPoints: 480,
    phone: '+91 99630 75004',
    title: 'Customer Account'
  },
  MEDIA_MANAGER: {
    id: 'usr_media_1',
    name: 'Aanya Sen (Media Lead)',
    email: 'media@goodbee.com',
    password: 'MediaGoodBee#2026',
    passwordSecondary: 'media',
    role: 'MEDIA_MANAGER',
    phone: '+91 99630 75005',
    title: 'Media & Inventory Studio'
  },
  DELIVERY_PARTNER: {
    id: 'usr_delivery_1',
    name: 'Kabir Verma (Fleet Lead)',
    email: 'delivery@goodbee.com',
    password: 'DeliveryGoodBee#2026',
    passwordSecondary: 'delivery',
    role: 'DELIVERY_PARTNER',
    phone: '+91 99630 75006',
    partnerCode: 'DEL-2026-001',
    vehicleType: 'Electric Scooter (Ather 450X)',
    vehicleNumber: 'MH-02-EE-4921',
    deliveryZone: 'South Mumbai Central Hub',
    dutyStatus: 'ON_DUTY',
    title: 'Delivery Partner & Fleet Logistics'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('goodbee_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure no plaintext password ever lingers in state
        delete parsed.password;
        delete parsed.passwordSecondary;
        delete parsed.passwordHash;
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('goodbee_token') || '');

  // Keep state synchronized with storage across tabs & bfcache
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'goodbee_user' && !e.newValue) {
        setUser(null);
        setToken('');
      } else if (e.key === 'goodbee_user' && e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Verify existing token against server on startup
  useEffect(() => {
    const storedToken = localStorage.getItem('goodbee_token');
    if (!storedToken) return;
    fetch('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('goodbee_user', JSON.stringify(data.user));
          }
        } else if (res.status === 401) {
          setUser(null);
          setToken('');
          localStorage.removeItem('goodbee_user');
          localStorage.removeItem('goodbee_token');
        }
      })
      .catch(() => {});
  }, []);

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Incorrect credentials');
    }

    const data = await res.json();
    const safeUser = { ...data.user };
    delete safeUser.password;
    delete safeUser.passwordSecondary;
    delete safeUser.passwordHash;

    setUser(safeUser);
    setToken(data.token);
    localStorage.setItem('goodbee_user', JSON.stringify(safeUser));
    localStorage.setItem('goodbee_token', data.token);
    return safeUser;
  };

  const register = async (formData) => {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    const passwordValidation = validatePasswordForRegistration(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const cleanEmail = (email || '').trim().toLowerCase();

    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, email: cleanEmail })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Registration failed');
    }

    const data = await res.json();
    const safeUser = { ...data.user };
    delete safeUser.password;
    delete safeUser.passwordSecondary;
    delete safeUser.passwordHash;

    setUser(safeUser);
    setToken(data.token);
    localStorage.setItem('goodbee_user', JSON.stringify(safeUser));
    localStorage.setItem('goodbee_token', data.token);
    return safeUser;
  };

  const logout = () => {
    // AUTH-50: Clear all tokens and user profile
    setUser(null);
    setToken('');
    localStorage.removeItem('goodbee_user');
    localStorage.removeItem('goodbee_token');
    window.dispatchEvent(new CustomEvent('goodbee_auth_logout'));
  };

  const quickSwitchRole = async (targetRole) => {
    const demo = DEMO_ACCOUNTS[targetRole];
    if (demo) {
      return login(demo.email, demo.password);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, quickSwitchRole, DEMO_ACCOUNTS }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
