import React, { useState } from 'react';
import { X, LogIn, UserPlus, User, CheckCircle2, AlertCircle, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { validatePasswordForRegistration } from '../../utils/passwordStrength';

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login', pendingProduct = null }) {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const loggedInUser = await login(email, password);
        if (onSuccess) onSuccess(loggedInUser);
        onClose();
      } else {
        const passwordCheck = validatePasswordForRegistration(password);
        if (!passwordCheck.isValid) {
          setErrorMsg(passwordCheck.message);
          setLoading(false);
          return;
        }

        const newUser = await register({
          name,
          email,
          password,
          phone,
          role: 'CUSTOMER'
        });
        if (onSuccess) onSuccess(newUser);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoKey) => {
    const demo = DEMO_ACCOUNTS[demoKey] || DEMO_ACCOUNTS.CUSTOMER;
    setEmail(demo.email);
    setPassword(demo.password);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#5B0868] text-white px-6 py-5 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="text-xl font-serif font-bold text-white">
            {mode === 'login' ? 'Sign In to Continue' : 'Create an Account'}
          </h3>
          <p className="text-xs text-purple-100/80 mt-1">
            {pendingProduct 
              ? `Please log in to add "${pendingProduct.title?.slice(0, 32)}..." to your shopping bag.`
              : 'Sign in to access your saved bag, orders, and skincare routines.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Customer Button for Convenience */}
          <div className="mb-4 p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#5B0868]" />
              <div className="text-left">
                <p className="text-xs font-semibold text-gray-900">Instant Test Account</p>
                <p className="text-[10px] text-gray-500">customer@goodbee.com / customer</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fillQuickDemo('CUSTOMER')}
              className="px-2.5 py-1 text-[11px] font-bold text-[#5B0868] bg-white rounded-lg border border-purple-200 hover:bg-purple-50 shadow-2xs transition-colors"
            >
              Fill Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868] pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'register' && (
                <PasswordStrengthMeter password={password} />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#5B0868] hover:bg-[#480653] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In & Continue</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Continue</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-gray-500">
                New to Good Bee?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className="font-bold text-[#5B0868] hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="font-bold text-[#5B0868] hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
