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

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Try server endpoint first (or in-browser mock backend router)
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      if (res.ok) {
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
      } else {
        const errData = await res.json().catch(() => ({}));
        // AUTH-11: Uniform error without revealing account existence
        throw new Error(errData.error || 'Incorrect credentials');
      }
    } catch (e) {
      // Re-throw uniform error if server returned an explicit auth rejection
      if (e.message && !e.message.includes('fetch') && !e.message.includes('Failed to fetch')) {
        throw e;
      }
      // Server unreachable, fallback to client-side demo accounts
    }

    // 2. Client-side fallback for static Vercel hosting
    // Check pre-seeded demo accounts
    const matchDemo = Object.values(DEMO_ACCOUNTS).find(
      (acc) =>
        acc.email.toLowerCase() === cleanEmail &&
        (acc.password === cleanPass ||
          acc.password === password ||
          acc.passwordSecondary === cleanPass ||
          cleanPass === acc.email.split('@')[0])
    );

    if (matchDemo) {
      const authUser = { ...matchDemo };
      delete authUser.password;
      delete authUser.passwordSecondary;
      delete authUser.passwordHash;

      setUser(authUser);
      setToken(`demo_token_${authUser.role.toLowerCase()}`);
      localStorage.setItem('goodbee_user', JSON.stringify(authUser));
      localStorage.setItem('goodbee_token', `demo_token_${authUser.role.toLowerCase()}`);
      return authUser;
    }

    // Check custom registered users from localStorage
    try {
      const registry = JSON.parse(localStorage.getItem('goodbee_users_registry') || '[]');
      const matchCustom = registry.find(
        (acc) =>
          acc.email.toLowerCase() === cleanEmail &&
          (acc.passwordHash === hashPassword(cleanPass) || acc.password === cleanPass || acc.password === password)
      );
      if (matchCustom) {
        const authUser = { ...matchCustom };
        delete authUser.password;
        delete authUser.passwordSecondary;
        delete authUser.passwordHash;

        setUser(authUser);
        setToken(`custom_token_${authUser.id}`);
        localStorage.setItem('goodbee_user', JSON.stringify(authUser));
        localStorage.setItem('goodbee_token', `custom_token_${authUser.id}`);
        return authUser;
      }
    } catch (e) {}

    // AUTH-11: Return uniform error message without revealing account existence
    throw new Error('Incorrect credentials');
  };

  const register = async (formData) => {
    const { name, email, password, role = 'CUSTOMER', companyName, gstNumber, phone } = formData;
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    const passwordValidation = validatePasswordForRegistration(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    // AUTH-02: Email matching is case-normalized and trimmed of spaces
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Try server endpoint first
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, email: cleanEmail })
      });

      if (res.ok) {
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
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'User with this email already exists');
      }
    } catch (e) {
      if (e.message && !e.message.includes('fetch') && !e.message.includes('Failed to fetch')) {
        throw e;
      }
    }

    // 2. Client-side fallback: verify uniqueness
    const inDemo = Object.values(DEMO_ACCOUNTS).some(
      (acc) => (acc.email || '').trim().toLowerCase() === cleanEmail
    );
    let inRegistry = false;
    try {
      const registry = JSON.parse(localStorage.getItem('goodbee_users_registry') || '[]');
      inRegistry = registry.some((acc) => (acc.email || '').trim().toLowerCase() === cleanEmail);
    } catch (e) {}

    if (inDemo || inRegistry) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: 'CUSTOMER', // Strict default CUSTOMER role
      phone: phone ? phone.trim() : '+91 99630 75000',
      companyName: companyName || '',
      gstNumber: gstNumber || '',
      loyaltyPoints: 0
    };

    // AUTH-51: Store passwordHash only, NEVER plaintext password in browser storage
    try {
      const registry = JSON.parse(localStorage.getItem('goodbee_users_registry') || '[]');
      registry.push({ ...newUser, passwordHash: hashPassword(password) });
      localStorage.setItem('goodbee_users_registry', JSON.stringify(registry));
    } catch (e) {}

    setUser(newUser);
    setToken(`token_${newUser.id}`);
    localStorage.setItem('goodbee_user', JSON.stringify(newUser));
    localStorage.setItem('goodbee_token', `token_${newUser.id}`);
    return newUser;
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
