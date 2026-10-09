import React, { useState } from 'react';
import { X, Shield, FlaskConical, Package, Megaphone, User, LogOut } from 'lucide-react';
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

  const activeRole = user ? user.role : selectedRole;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-charcoal/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-16">
        <div className="w-screen max-w-5xl bg-brand-ivory border-l border-brand-gold/40 shadow-2xl flex flex-col justify-between overflow-y-auto">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 bg-brand-charcoal text-brand-ivory flex items-center justify-between border-b border-brand-gold/30">
            <div className="flex items-center gap-3">
              <img
                src="/assets/good-bee-logo.png"
                alt="Good Bee Emblem"
                className="w-10 h-10 rounded-full border border-brand-gold/40"
              />
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-brand-gold-light block">
                  {user?.role === 'ADMIN' ? 'Administrative Suite' : 'Good Bee Patron Account'}
                </span>
                <h3 className="font-serif text-lg font-semibold text-brand-ivory">
                  {user ? (user.role === 'ADMIN' ? 'Store Control Tower' : `Welcome, ${user.name}`) : 'Sign In / Register'}
                </h3>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={() => logout()}
                  className="px-3 py-1.5 text-xs text-brand-sand hover:text-red-400 rounded-lg transition-colors flex items-center gap-1.5 border border-brand-gold/20 hover:border-red-400/40"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 text-brand-ivory hover:text-brand-gold transition-colors rounded-full"
                title="Return to Landing Page"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Portal Content Body */}
          <div className="flex-1 overflow-y-auto">
            {!user ? (
              <Login
                defaultRole={selectedRole}
                onLoggedIn={() => {}}
                onBack={onClose}
              />
            ) : user.role === 'ADMIN' ? (
              <AdminDashboard onNavigateHome={onClose} />
            ) : user.role === 'PRODUCER' ? (
              <ProducerPortal onNavigateHome={onClose} />
            ) : user.role === 'DEALER' ? (
              <DealerPortal onNavigateHome={onClose} />
            ) : user.role === 'PROMOTER' ? (
              <PromoterPortal onNavigateHome={onClose} />
            ) : (
              <CustomerPortal onNavigateHome={onClose} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
