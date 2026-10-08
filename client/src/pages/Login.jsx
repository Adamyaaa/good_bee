import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function Login({ defaultRole = 'CUSTOMER', onLoggedIn, onBack }) {
  const { login, register, quickSwitchRole } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [companyName, setCompanyName] = useState('');
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
        const u = await register({ name, email, password, role, companyName });
        onLoggedIn(u);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const u = await quickSwitchRole(demoEmail, demoPass);
      onLoggedIn(u);
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-brand-ivory min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <img
            src="/assets/good-bee-logo.png"
            alt="Good Bee Emblem"
            className="w-16 h-16 mx-auto rounded-full border border-brand-gold/40 shadow-sm"
          />
          <h2 className="font-serif text-3xl font-medium text-brand-charcoal">
            {mode === 'login' ? 'Good Bee Portal Access' : 'Join the Good Bee Ecosystem'}
          </h2>
          <p className="text-xs text-brand-muted">
            Authenticate to access Customer, Producer, Dealer, Promoter, or Admin features.
          </p>
        </div>

        {/* Quick Role Tester Strip */}
        <div className="bg-brand-cream/80 p-4 rounded-2xl border border-brand-gold/30 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-brand-gold-dark">
            <span>Instant Role Demo Switcher</span>
            <span className="text-[10px] text-brand-muted font-normal">Click any role to test</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@goodbee.com', 'admin')}
              className="p-2 bg-brand-ivory hover:bg-brand-gold hover:text-white rounded-lg border border-brand-gold/30 text-left font-medium transition-colors"
            >
              👑 <span className="font-bold">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('producer@goodbee.com', 'producer')}
              className="p-2 bg-brand-ivory hover:bg-brand-gold hover:text-white rounded-lg border border-brand-gold/30 text-left font-medium transition-colors"
            >
              🔬 <span className="font-bold">Producer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('dealer@goodbee.com', 'dealer')}
              className="p-2 bg-brand-ivory hover:bg-brand-gold hover:text-white rounded-lg border border-brand-gold/30 text-left font-medium transition-colors"
            >
              📦 <span className="font-bold">Dealer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('promoter@goodbee.com', 'promoter')}
              className="p-2 bg-brand-ivory hover:bg-brand-gold hover:text-white rounded-lg border border-brand-gold/30 text-left font-medium transition-colors"
            >
              📣 <span className="font-bold">Promoter</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('customer@goodbee.com', 'customer')}
              className="p-2 bg-brand-ivory hover:bg-brand-gold hover:text-white rounded-lg border border-brand-gold/30 text-left font-medium transition-colors col-span-2 sm:col-span-1"
            >
              🌸 <span className="font-bold">Customer</span>
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-brand-cream/40 p-8 rounded-3xl border border-brand-gold/30 shadow-luxury space-y-6">
          
          {/* Mode Tabs */}
          <div className="flex border-b border-brand-gold/20 pb-3 gap-6 text-sm">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`font-semibold pb-1 transition-colors relative ${
                mode === 'login' ? 'text-brand-charcoal' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Sign In
              {mode === 'login' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold" />}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`font-semibold pb-1 transition-colors relative ${
                mode === 'register' ? 'text-brand-charcoal' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Register Account
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
              <>
                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">Full Name / Entity Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">Ecosystem Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal font-medium"
                  >
                    <option value="CUSTOMER">Customer / Patron</option>
                    <option value="PRODUCER">Producer / Lab Partner</option>
                    <option value="DEALER">Dealer / Regional Distributor</option>
                    <option value="PROMOTER">Promoter / Brand Affiliate</option>
                  </select>
                </div>

                {['PRODUCER', 'DEALER'].includes(role) && (
                  <div>
                    <label className="block mb-1 font-medium text-brand-charcoal">Company or Lab Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                      placeholder="e.g. Pure Botanica Laboratories"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block mb-1 font-medium text-brand-charcoal">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-brand-charcoal">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-gold-dark transition-colors shadow-luxury flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Portal' : 'Create Ecosystem Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

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
