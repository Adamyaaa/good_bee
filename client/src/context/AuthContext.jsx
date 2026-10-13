import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

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
    title: 'Good Being Club Member'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('goodbee_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Ananya Sharma') {
          parsed.name = 'Customer';
          localStorage.setItem('goodbee_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('goodbee_token') || 'gb_token_demo');

  const login = async (email, password) => {
    // 1. Try server endpoint first
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('goodbee_user', JSON.stringify(data.user));
        localStorage.setItem('goodbee_token', data.token);
        return data.user;
      }
    } catch (e) {
      // Server unreachable, fallback to client-side demo accounts
    }

    // 2. Client-side fallback for static Vercel hosting
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check pre-seeded demo accounts
    const matchDemo = Object.values(DEMO_ACCOUNTS).find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPass
    );

    if (matchDemo) {
      const authUser = { ...matchDemo };
      delete authUser.password;
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
        (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPass
      );
      if (matchCustom) {
        const authUser = { ...matchCustom };
        delete authUser.password;
        setUser(authUser);
        setToken(`custom_token_${authUser.id}`);
        localStorage.setItem('goodbee_user', JSON.stringify(authUser));
        localStorage.setItem('goodbee_token', `custom_token_${authUser.id}`);
        return authUser;
      }
    } catch (e) {}

    throw new Error('Invalid email or password. Use demo buttons or register an account.');
  };

  const register = async (formData) => {
    // 1. Try server endpoint first
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('goodbee_user', JSON.stringify(data.user));
        localStorage.setItem('goodbee_token', data.token);
        return data.user;
      }
    } catch (e) {}

    // 2. Client-side fallback
    const { name, email, password, role = 'CUSTOMER', companyName, gstNumber, phone } = formData;
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: role.toUpperCase(),
      phone: phone || '+91 99630 75000',
      companyName: companyName || '',
      gstNumber: gstNumber || '',
      dealerCode: role.toUpperCase() === 'DEALER' ? `DLR-${Date.now().toString().slice(-4)}` : undefined,
      referralCode: role.toUpperCase() === 'PROMOTER' ? `${name.replace(/\s+/g, '').toUpperCase()}10` : undefined,
      loyaltyPoints: role.toUpperCase() === 'CUSTOMER' ? 150 : 0
    };

    try {
      const registry = JSON.parse(localStorage.getItem('goodbee_users_registry') || '[]');
      registry.push({ ...newUser, password });
      localStorage.setItem('goodbee_users_registry', JSON.stringify(registry));
    } catch (e) {}

    setUser(newUser);
    setToken(`token_${newUser.id}`);
    localStorage.setItem('goodbee_user', JSON.stringify(newUser));
    localStorage.setItem('goodbee_token', `token_${newUser.id}`);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('goodbee_user');
    localStorage.removeItem('goodbee_token');
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
