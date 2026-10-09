import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, FlaskConical, Package, Megaphone, User, LogOut, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
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

  // Draggable Resizing State
  const [drawerWidth, setDrawerWidth] = useState(() => {
    if (typeof window === 'undefined') return 980;
    try {
      const saved = localStorage.getItem('goodbee_portal_width');
      if (saved) {
        return Math.min(Math.max(Number(saved), 380), window.innerWidth);
      }
    } catch (e) {}
    return Math.min(Math.max(window.innerWidth * 0.72, 700), 1180);
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const prevWidthRef = useRef(drawerWidth);

  // Mouse drag listeners attached to window for smooth dragging anywhere
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      e.preventDefault();
      const newWidth = window.innerWidth - e.clientX;
      const minW = Math.min(380, window.innerWidth);
      const maxW = window.innerWidth;
      const clamped = Math.min(Math.max(newWidth, minW), maxW);
      setDrawerWidth(clamped);
      if (clamped >= window.innerWidth - 20) {
        setIsMaximized(true);
      } else {
        setIsMaximized(false);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      try {
        localStorage.setItem('goodbee_portal_width', String(drawerWidth));
      } catch (e) {}
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, drawerWidth]);

  // Touch support for tablets & mobile
  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const newWidth = window.innerWidth - touch.clientX;
      const minW = Math.min(360, window.innerWidth);
      const maxW = window.innerWidth;
      const clamped = Math.min(Math.max(newWidth, minW), maxW);
      setDrawerWidth(clamped);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleToggleMaximize = () => {
    if (isMaximized) {
      setDrawerWidth(prevWidthRef.current || 980);
      setIsMaximized(false);
    } else {
      prevWidthRef.current = drawerWidth;
      setDrawerWidth(window.innerWidth);
      setIsMaximized(true);
    }
  };

  if (!isOpen) return null;

  const activeRole = user ? user.role : selectedRole;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-charcoal/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        
        {/* Slide-over Window with dynamic draggable width */}
        <div
          style={{ width: `${drawerWidth}px` }}
          className={`relative max-w-full bg-brand-ivory border-l border-brand-gold/40 shadow-2xl flex flex-col justify-between overflow-y-auto ${
            isDragging ? 'select-none transition-none' : 'transition-[width] duration-200 ease-out'
          }`}
        >
          {/* Draggable Resize Handle on Left Border */}
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onTouchStart={() => setIsDragging(true)}
            onDoubleClick={handleToggleMaximize}
            className={`group absolute left-0 top-0 bottom-0 w-3.5 -translate-x-2 z-50 cursor-col-resize flex items-center justify-center select-none ${
              isDragging ? 'bg-amber-400/40 ring-1 ring-amber-400' : 'hover:bg-amber-400/25'
            }`}
            title="Drag with mouse to resize window (Double-click to toggle fullscreen)"
          >
            {/* Visual Grip Pill */}
            <div
              className={`w-1.5 h-16 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg ${
                isDragging
                  ? 'bg-amber-400 h-28 ring-2 ring-amber-400/60 scale-110'
                  : 'bg-brand-gold/80 group-hover:bg-amber-400 group-hover:h-24'
              }`}
            >
              <GripVertical className="w-2.5 h-2.5 text-slate-950 opacity-0 group-hover:opacity-100" />
            </div>

            {/* Live Pixel Indicator Badge while Dragging */}
            {isDragging && (
              <div className="absolute left-5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-950 text-amber-300 border border-amber-400/60 rounded-md font-mono text-[10px] whitespace-nowrap shadow-2xl pointer-events-none">
                ↔ {Math.round(drawerWidth)}px
              </div>
            )}
          </div>
          
          {/* Top Bar */}
          <div className="p-4 sm:p-5 bg-brand-charcoal text-brand-ivory flex items-center justify-between border-b border-brand-gold/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-1 border border-brand-gold/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                <img
                  src="/assets/goodbee-white-logo.png"
                  alt="Good Bee Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-brand-gold-light block">
                    {user?.role === 'ADMIN' ? 'Administrative Suite' : 'Good Bee Patron Account'}
                  </span>
                  <span className="hidden md:inline-block text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700/60">
                    Drag left border ↔
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-ivory">
                  {user ? (user.role === 'ADMIN' ? 'Store Control Tower' : `Welcome, ${user.name}`) : 'Sign In / Register'}
                </h3>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Maximize / Restore Toggle */}
              <button
                onClick={handleToggleMaximize}
                className="p-2 text-brand-sand hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                title={isMaximized ? 'Restore standard width' : 'Expand full screen'}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                )}
              </button>

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
