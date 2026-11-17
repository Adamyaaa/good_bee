import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Leaf,
  Droplets,
  Heart,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ initialMode = 'login', onBack, onAuthSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const u = await login(email, password);
        setSuccessMsg(`Welcome back, ${u.name}!`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(u);
          else if (onBack) onBack();
        }, 800);
      } else {
        const u = await register({
          name,
          email,
          password,
          phone,
          role: 'CUSTOMER'
        });
        setSuccessMsg(`Account created successfully! Welcome to the Good Being Club.`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(u);
          else if (onBack) onBack();
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between selection:bg-purple-100 selection:text-purple-900">
      
      {/* Top Floating Return Navigation */}
      <nav className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#5B0868] transition-colors p-2 rounded-xl hover:bg-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        <div className="flex items-center gap-2">
          <img
            src="/assets/goodbee-bee-mark-gold.png"
            alt="Good Bee Emblem"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              e.target.src = '/assets/goodbee-bee-mark.png';
            }}
          />
          <span className="font-serif text-lg font-bold tracking-[0.14em] text-gray-900 hidden sm:inline">
            GOOD BEE
          </span>
        </div>
      </nav>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden">
          
          {/* Left Hero / Brand Vignette (5 Cols) */}
          <div className="lg:col-span-5 bg-[#5B0868] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 block">
                Natural &bull; Cold-Stabilized Botanicals
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl font-medium leading-tight">
                Pure farm-origin skincare crafted with integrity.
              </h2>

              <p className="text-xs text-purple-100/90 leading-relaxed font-sans">
                Sign in to manage your orders, track batch-certified shipments, and access personalized routine consultations.
              </p>
            </div>

            {/* Feature Perks Badges */}
            <div className="relative z-10 space-y-3 pt-6 border-t border-white/15 my-6">
              <div className="flex items-center gap-3 text-xs text-purple-100">
                <div className="p-1.5 rounded-lg bg-white/15 text-amber-300"><Droplets className="w-4 h-4" /></div>
                <span>100% Steam-Distilled Pure Botanicals</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-purple-100">
                <div className="p-1.5 rounded-lg bg-white/15 text-emerald-300"><Leaf className="w-4 h-4" /></div>
                <span>Zero Parabens, Artificial Sulphates, or Microplastics</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-purple-100">
                <div className="p-1.5 rounded-lg bg-white/15 text-pink-300"><Heart className="w-4 h-4" /></div>
                <span>Ethically Sourced from Sustainable Farm Cooperatives</span>
              </div>
            </div>

            <div className="relative z-10 text-[11px] text-purple-200/80 font-medium">
              Good Bee Botanical Skincare
            </div>
          </div>

          {/* Right Form Card (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            
            {/* Switch Tabs (Login vs Register) */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">
                  {mode === 'login' ? 'Customer Sign In' : 'Create an Account'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {mode === 'login' 
                    ? 'Enter your registered credentials to access your bag & orders.' 
                    : 'Create your account to track orders and save your delivery details.'}
                </p>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mode === 'login' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mode === 'register' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}



            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Legal Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Radhika Deshmukh"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#5B0868] hover:bg-[#480653] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : mode === 'login' ? (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Footer Note */}
            <p className="mt-6 text-center text-xs text-gray-500">
              {mode === 'login' ? (
                <>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg('');
                    }}
                    className="font-bold text-[#5B0868] hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="font-bold text-[#5B0868] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </p>

          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="p-4 text-center text-[11px] text-gray-400">
        &copy; {new Date().getFullYear()} Good Bee Skincare Platform &bull; Western Ghats Botanical Extraction Laboratory
      </footer>

    </div>
  );
}
