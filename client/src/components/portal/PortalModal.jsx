import React, { useState } from 'react';
import { X, Shield, FlaskConical, Package, User, LogOut, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Portals
import ProducerPortal from '../../pages/ProducerPortal';
import DealerPortal from '../../pages/DealerPortal';
import PromoterPortal from '../../pages/PromoterPortal';
import CustomerPortal from '../../pages/CustomerPortal';
import AdminDashboard from '../../pages/AdminDashboard';
import Login from '../../pages/Login';

export default function PortalModal({ initialRole = null, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const [requestedPortal, setRequestedPortal] = useState(initialRole || (user ? user.role : 'CUSTOMER'));

  React.useEffect(() => {
    if (initialRole) {
      setRequestedPortal(initialRole);
    }
  }, [initialRole]);

  if (!isOpen) return null;

  const currentRole = user ? user.role : requestedPortal;

  // Real Roles Configuration
  const ROLES = [
    { id: 'ADMIN', label: 'Admin Suite', badge: 'Control Tower', icon: Shield },
    { id: 'PRODUCER', label: 'Vendor & Labs', badge: 'Supplier', icon: FlaskConical },
    { id: 'DEALER', label: 'Wholesale Desk', badge: 'B2B Bulk', icon: Package },
    { id: 'CUSTOMER', label: 'My Account', badge: 'Customer Account', icon: User }
  ];

  // REAL ACCESS CONTROL ENFORCEMENT:
  // - If user is NOT logged in, show Login.
  // - If user IS logged in, verify if their role matches the requested portal:
  //   * ADMIN can view Admin Suite or inspect portals.
  //   * PRODUCER can ONLY access Vendor & Labs (PRODUCER).
  //   * DEALER can ONLY access Wholesale Desk (DEALER).
  //   * CUSTOMER can ONLY access My Account (CUSTOMER).
  const isAuthorized = user && (user.role === 'ADMIN' || user.role === requestedPortal);

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* 1. Portal Header Navigation */}
      <header className="bg-white border-b border-gray-200/80 shadow-xs flex-shrink-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
            
            {/* Left Brand & Portal Emblem */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
                title="Return to Good Bee Storefront"
              >
                <div className="h-8 sm:h-9 w-auto flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src="/assets/goodbee-bee-mark-gold.png"
                    alt="Good Bee Emblem"
                    className="h-full w-auto object-contain"
                    onError={(e) => {
                      e.target.src = '/assets/goodbee-bee-mark.png';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.14em] text-[#1e1e1e] leading-none">
                      GOOD BEE
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-purple-50 text-[#5B0868] border border-purple-200">
                      Partner Suites
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Center Role Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 bg-gray-50/80 p-1 rounded-xl border border-gray-200">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = requestedPortal === r.id;
                const userOwnsThisRole = user && (user.role === 'ADMIN' || user.role === r.id);

                return (
                  <button
                    key={r.id}
                    onClick={() => setRequestedPortal(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#5B0868] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                    {!userOwnsThisRole && user && (
                      <Lock className="w-3 h-3 text-gray-400 ml-0.5" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Utilities (User, Return to Storefront) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {user && (
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-gray-800 leading-tight">
                    {user.companyName || user.name || user.email}
                  </span>
                  <span className="text-[10px] text-purple-700 font-bold font-mono">
                    {user.role === 'CUSTOMER' ? 'Customer Account' : user.role === 'DEALER' ? 'Wholesaler' : user.role === 'PRODUCER' ? 'Botanical Vendor' : 'Admin'}
                  </span>
                </div>
              )}

              {user && (
                <button
                  onClick={() => logout()}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="px-3.5 sm:px-4 py-2 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Storefront</span>
              </button>
            </div>

          </div>

          {/* Mobile Role Switcher Strip */}
          <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-gray-100 no-scrollbar">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = requestedPortal === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRequestedPortal(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#5B0868] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* 2. Main Scrollable Portal Canvas with Real Gating */}
      <main className="flex-1 overflow-y-auto bg-[#FAF7F2]">
        {!user ? (
          <div className="max-w-md mx-auto py-12 px-4">
            <Login
              defaultRole={requestedPortal}
              onLoggedIn={() => {}}
              onBack={onClose}
            />
          </div>
        ) : !isAuthorized ? (
          /* Real Access Denied Screen */
          <div className="max-w-md mx-auto py-16 px-4 text-center">
            <div className="p-8 bg-white rounded-3xl border border-gray-200/80 shadow-md space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900">
                Access Restricted
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                You are currently signed in as <strong>{user.name}</strong> ({user.email}) with the role of{' '}
                <span className="font-bold text-purple-800">
                  {user.role === 'CUSTOMER' ? 'Good Being Club Member (Customer)' : user.role}
                </span>.
              </p>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-[#5B0868] text-left">
                <strong>Default Security Policy:</strong> New accounts default to Club Members. If you are an authorized Botanical Vendor or Wholesale Distributor, your Good Bee Administrator must elevate your account in the Admin Tower before you can access this desk.
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setRequestedPortal(user.role)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#5B0868] rounded-xl hover:bg-[#480653] transition-colors"
                >
                  Go to My {user.role === 'CUSTOMER' ? 'Club Member' : user.role} Portal
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Sign in with Different ID
                </button>
              </div>
            </div>
          </div>
        ) : requestedPortal === 'ADMIN' ? (
          <AdminDashboard onNavigateHome={onClose} />
        ) : requestedPortal === 'PRODUCER' ? (
          <ProducerPortal onNavigateHome={onClose} />
        ) : requestedPortal === 'DEALER' ? (
          <DealerPortal onNavigateHome={onClose} />
        ) : requestedPortal === 'PROMOTER' ? (
          <PromoterPortal onNavigateHome={onClose} />
        ) : (
          <CustomerPortal onNavigateHome={onClose} />
        )}
      </main>

    </div>
  );
}
