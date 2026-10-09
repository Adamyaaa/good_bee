import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('goodbee_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('goodbee_token') || '');

  const login = async (email, password) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('Connection error. Please try again.');
    }

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('goodbee_user', JSON.stringify(data.user));
    localStorage.setItem('goodbee_token', data.token);
    return data.user;
  };

  const register = async (formData) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('Connection error. Please try again.');
    }

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('goodbee_user', JSON.stringify(data.user));
    localStorage.setItem('goodbee_token', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('goodbee_user');
    localStorage.removeItem('goodbee_token');
  };

  const quickSwitchRole = async (roleEmail, defaultPass) => {
    return login(roleEmail, defaultPass);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, quickSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
