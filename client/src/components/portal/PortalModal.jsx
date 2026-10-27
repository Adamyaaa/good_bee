import React, { useState } from 'react';
import { X, Shield, FlaskConical, Package, User, LogOut, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Portals
import ProducerPortal from '../../pages/ProducerPortal';
import DealerPortal from '../../pages/DealerPortal';
import PromoterPortal from '../../pages/PromoterPortal';
import CustomerPortal from '../../pages/CustomerPortal';
import AdminDashboard from '../../pages/AdminDashboard';
import Login from '../../pages/Login';

export default function PortalModal({ initialRole = null, isOpen, onClose }) {
  const { user, logout, quickSwitchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(initialRole || (user ? user.role : 'CUSTOMER'));

  if (!isOpen) return null;

  const currentRole = user ? user.role : selectedRole;

  const ROLES = [
    { id: 'ADMIN', label: 'Admin Suite', badge: 'Operations', icon: Shield, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    { id: 'PRODUCER', label: 'Vendor & Labs', badge: 'Supplier', icon: FlaskConical, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 'DEALER', label: 'Wholesale Desk', badge: 'B2B', icon: Package, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { id: 'CUSTOMER', label: 'Patron Club', badge: 'Retail', icon: User, color: 'text-amber-800 bg-amber-50 border-amber-200' }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    if (user && quickSwitchRole) {
      quickSwitchRole(roleId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* 1. Dedicated Portal Header Navigation */}
      <header className="bg-white border-b border-gray-200 shadow-xs flex-shrink-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
            
            {/* Left Brand & Portal Emblem */}
            <div className="flex items-center gap-3">
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
                      Partner Console
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-sans block mt-0.5">
                    {currentRole === 'ADMIN'
                      ? 'Storefront Control Tower & Analytics'
                      : currentRole === 'PRODUCER'
                      ? 'Botanical Sourcing, Lot Submissions & QC Testing'
                      : currentRole === 'DEALER'
                      ? 'B2B Regional Wholesale & Bulk Purchase Orders'
                      : 'Patron Membership & Formulation Rewards'}
                  </span>
                </div>
              </button>
            </div>

            {/* Center Role Quick-Switcher Pills (Client Demonstration & Ease of Navigation) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#5B0868] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-200/70 text-gray-600'
                      }`}
                    >
                      {r.badge}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Utilities (User, Return to Storefront) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user && (
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-gray-800 leading-tight">
                    {user.name || user.email}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {user.role} Verified
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
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap ${
                    isActive
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

      {/* 2. Main Scrollable Portal Canvas */}
      <main className="flex-1 overflow-y-auto bg-[#FAF7F2]">
        {!user ? (
          <div className="max-w-md mx-auto py-12 px-4">
            <Login
              defaultRole={selectedRole}
              onLoggedIn={() => {}}
              onBack={onClose}
            />
          </div>
        ) : currentRole === 'ADMIN' ? (
          <AdminDashboard onNavigateHome={onClose} />
        ) : currentRole === 'PRODUCER' ? (
          <ProducerPortal onNavigateHome={onClose} />
        ) : currentRole === 'DEALER' ? (
          <DealerPortal onNavigateHome={onClose} />
        ) : currentRole === 'PROMOTER' ? (
          <PromoterPortal onNavigateHome={onClose} />
        ) : (
          <CustomerPortal onNavigateHome={onClose} />
        )}
      </main>

    </div>
  );
}
