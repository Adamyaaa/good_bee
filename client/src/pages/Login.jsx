import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, User, ArrowRight, AlertCircle, Lock } from 'lucide-react';

export default function Login({ defaultRole = 'CUSTOMER', onLoggedIn, onBack }) {
  const { login, register, quickSwitchRole } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const u = await login(email, password);
        onLoggedIn(u);
      } else {
        const u = await register({ name, email, password, role: 'CUSTOMER' });
        onLoggedIn(u);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminFill = () => {
    setMode('login');
    setEmail('admin@goodbee.com');
    setPassword('admin');
  };

  const handlePatronFill = () => {
    setMode('login');
    setEmail('customer@goodbee.com');
    setPassword('customer');
  };

  return (
    <div className="py-12 bg-brand-ivory min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-white p-1.5 border border-brand-gold/40 shadow-sm flex items-center justify-center">
            <img
              src="/assets/goodbee-white-logo.png"
              alt="Good Bee Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="font-serif text-3xl font-medium text-brand-charcoal">
            {mode === 'login' ? 'Good Bee Patron Account' : 'Join Good Bee'}
          </h2>
          <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
            {mode === 'login'
              ? 'Sign in to access your orders, customized skincare rituals, and patron privileges.'
              : 'Create your account for express checkout, order tracking, and complimentary consultations.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-brand-cream/50 p-7 sm:p-8 rounded-3xl border border-brand-gold/30 shadow-luxury space-y-6">
          
          {/* Mode Tabs */}
          <div className="flex border-b border-brand-gold/20 pb-3 gap-6 text-sm">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`font-semibold pb-1 transition-colors relative ${
                mode === 'login' ? 'text-brand-charcoal' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Sign In
              {mode === 'login' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold" />}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`font-semibold pb-1 transition-colors relative ${
                mode === 'register' ? 'text-brand-charcoal' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Create Account
              {mode === 'register' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold" />}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block mb-1.5 font-medium text-brand-charcoal">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal placeholder-brand-muted/60"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block mb-1.5 font-medium text-brand-charcoal">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal placeholder-brand-muted/60"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-medium text-brand-charcoal">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={handlePatronFill}
                    className="text-[10px] text-brand-gold-dark hover:underline font-medium"
                  >
                    Fill Patron Demo
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal placeholder-brand-muted/60"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-gold-dark transition-colors shadow-luxury flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Account' : 'Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Discreet Admin Login Helper for Store Owners */}
          <div className="pt-4 border-t border-brand-gold/15 flex items-center justify-between text-[11px] text-brand-muted">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-gold" />
              <span>Store Administrator?</span>
            </span>
            <button
              type="button"
              onClick={handleAdminFill}
              className="text-brand-gold-dark hover:text-brand-charcoal hover:underline font-semibold"
            >
              Fill Admin Credentials
            </button>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="text-xs text-brand-muted hover:text-brand-charcoal underline"
          >
            Return to Storefront
          </button>
        </div>

      </div>
    </div>
  );
}
