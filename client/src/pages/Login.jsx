import React, { useState, useEffect } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { Shield, Sparkles, User, Package, FlaskConical, ArrowRight, AlertCircle, CheckCircle2, Building, Key } from 'lucide-react';

const ROLE_TABS = [
  { id: 'CUSTOMER', label: 'Good Being Club', sublabel: 'Patron Loyalty', icon: User, demoKey: 'CUSTOMER', color: 'text-amber-800' },
  { id: 'DEALER', label: 'Wholesaler / Stockist', sublabel: 'B2B Bulk Rates', icon: Package, demoKey: 'DEALER', color: 'text-blue-800' },
  { id: 'PRODUCER', label: 'Vendor / Supplier', sublabel: 'Botanical Apiaries', icon: FlaskConical, demoKey: 'PRODUCER', color: 'text-emerald-800' },
  { id: 'ADMIN', label: 'Store Admin', sublabel: 'Control Tower', icon: Shield, demoKey: 'ADMIN', color: 'text-slate-800' }
];

export default function Login({ defaultRole = 'CUSTOMER', onLoggedIn, onBack }) {
  const { login, register } = useAuth();
  const [selectedRole, setSelectedRole] = useState(defaultRole || 'CUSTOMER');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill inputs when changing role in login mode for convenience
  const handleSelectRole = (roleId) => {
    setSelectedRole(roleId);
    setErrorMsg('');
    const demo = DEMO_ACCOUNTS[roleId];
    if (demo && mode === 'login') {
      setEmail(demo.email);
      setPassword(demo.password);
    }
  };

  useEffect(() => {
    if (defaultRole && DEMO_ACCOUNTS[defaultRole]) {
      handleSelectRole(defaultRole);
    }
  }, [defaultRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const u = await login(email, password);
        onLoggedIn?.(u);
      } else {
        const u = await register({
          name,
          email,
          password,
          phone,
          role: selectedRole,
          companyName,
          gstNumber
        });
        onLoggedIn?.(u);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const currentTab = ROLE_TABS.find((t) => t.id === selectedRole) || ROLE_TABS[0];
  const CurrentIcon = currentTab.icon;

  return (
    <div className="py-10 bg-brand-ivory min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Brand Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-white p-1 border border-brand-gold/40 shadow-sm flex items-center justify-center">
            <img
              src="/assets/goodbee-white-logo.png"
              alt="Good Bee Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-brand-charcoal">
            Good Bee Ecosystem Access
          </h2>
          <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
            Select your partnership role to access your dedicated portal, real-time inventory, batch verification, or customer privileges.
          </p>
        </div>

        {/* 5-Role Horizontal Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-brand-cream/80 p-2 rounded-2xl border border-brand-gold/30 shadow-sm">
          {ROLE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedRole === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectRole(tab.id)}
                className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-charcoal text-brand-ivory shadow-luxury'
                    : 'bg-brand-ivory/60 hover:bg-brand-ivory text-brand-charcoal border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-gold' : 'text-brand-muted'}`} />
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />}
                </div>
                <div>
                  <p className="font-serif text-xs font-semibold truncate leading-tight">{tab.label}</p>
                  <p className={`text-[9px] truncate ${isSelected ? 'text-brand-sand' : 'text-brand-muted'}`}>{tab.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Container Card */}
        <div className="bg-brand-cream/60 p-6 sm:p-8 rounded-3xl border border-brand-gold/30 shadow-luxury space-y-5">
          
          {/* Active Role Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-ivory border border-brand-gold/25">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-brand-charcoal text-brand-gold">
                <CurrentIcon className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-gold-dark block">
                  Active Portal Destination
                </span>
                <span className="font-serif text-sm font-semibold text-brand-charcoal">
                  {currentTab.label} Desk
                </span>
              </div>
            </div>

            {/* Quick Demo Fill Button */}
            <button
              type="button"
              onClick={() => handleSelectRole(selectedRole)}
              className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] font-bold tracking-wide transition-colors flex items-center gap-1.5 shadow-sm"
              title="Auto-fill demo credentials for this role"
            >
              <Key className="w-3 h-3 text-amber-700" />
              <span>Use {currentTab.label.split('/')[0].trim()} Demo</span>
            </button>
          </div>

          {/* Mode Tabs (Sign In / Register) */}
          <div className="flex border-b border-brand-gold/20 pb-2.5 gap-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); handleSelectRole(selectedRole); }}
              className={`pb-1 transition-colors relative ${
                mode === 'login' ? 'text-brand-charcoal font-bold' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Sign In to {currentTab.label}
              {mode === 'login' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold" />}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`pb-1 transition-colors relative ${
                mode === 'register' ? 'text-brand-charcoal font-bold' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Register New Partner Account
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-medium text-brand-charcoal">Full Name / Primary Contact</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                      placeholder="e.g. Aaditya Sharma"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-brand-charcoal">Mobile / WhatsApp No.</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                      placeholder="+91-9963075000"
                    />
                  </div>
                </div>

                {/* Role Specific Business Inputs */}
                {(selectedRole === 'DEALER' || selectedRole === 'PRODUCER') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block mb-1 font-medium text-brand-charcoal">
                        {selectedRole === 'DEALER' ? 'Wholesale Business / Firm Name' : 'Apiary / Laboratory Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                        placeholder={selectedRole === 'DEALER' ? 'e.g. Apex Skincare LLP' : 'e.g. Nilgiri Botanical Labs'}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-brand-charcoal">
                        {selectedRole === 'DEALER' ? 'GSTIN Number (for 18% Tax Invoicing)' : 'Harvest Batch / Lab License ID'}
                      </label>
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        className="w-full p-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                        placeholder={selectedRole === 'DEALER' ? '27AABCU9603R1ZM' : 'LAB-ISO-9001-GB'}
                      />
                    </div>
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
                placeholder={DEMO_ACCOUNTS[selectedRole]?.email || 'name@example.com'}
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
              className="w-full py-3 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-gold-dark transition-colors shadow-luxury flex items-center justify-center gap-2 mt-3"
            >
              {loading ? (
                <span>Authenticating Partner...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? `Enter ${currentTab.label} Desk` : `Complete Registration as ${currentTab.label}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Footer Strip */}
          <div className="pt-3 border-t border-brand-gold/20 flex flex-wrap items-center justify-between text-[11px] text-brand-muted gap-2">
            <span>Demo logins enabled for client review:</span>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_TABS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRole(r.id)}
                  className={`px-2 py-0.5 rounded border text-[10px] font-semibold transition-colors ${
                    selectedRole === r.id
                      ? 'bg-brand-gold text-brand-charcoal border-brand-charcoal'
                      : 'bg-brand-ivory hover:bg-brand-cream border-brand-gold/30 text-brand-charcoal'
                  }`}
                >
                  {r.label.split('/')[0].trim()}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Back to Storefront Link */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="text-xs text-brand-muted hover:text-brand-charcoal underline"
          >
            ← Return to Storefront
          </button>
        </div>

      </div>
    </div>
  );
}
