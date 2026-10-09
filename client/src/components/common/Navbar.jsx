import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X, Shield, Sparkles, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onScrollTo, onOpenPortal }) {
  const { itemCount, setIsDrawerOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-ivory/80 backdrop-blur-md border-b border-brand-gold/20 transition-all shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-brand-charcoal text-brand-sand px-4 py-1.5 text-xs font-medium tracking-wider flex items-center justify-between text-center overflow-hidden">
        <div className="hidden md:flex items-center gap-2 text-brand-gold-light">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>Formulated through High-End Active Stabilization Research</span>
        </div>
        <div className="mx-auto flex items-center gap-3">
          <span>Complimentary Delivery Across India on Orders Above ₹999</span>
          <span className="hidden sm:inline text-brand-gold">•</span>
          <span className="hidden sm:inline text-brand-gold-light">100% Natural Active Ingredients</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs">
          <button
            onClick={() => onOpenPortal('PRODUCER')}
            className="text-brand-sand hover:text-brand-gold transition-colors font-medium"
          >
            Partner Ecosystem
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-charcoal hover:text-brand-gold focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onScrollTo('hero')}
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <img
                src="/assets/good-bee-logo.png"
                alt="Good Bee Emblem"
                className="w-12 h-12 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-brand-charcoal block leading-none">
                  GOOD BEE
                </span>
                <span className="text-[9px] tracking-[0.25em] text-brand-gold-dark font-sans uppercase font-medium mt-1 block">
                  Natural Skincare • Research
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Single-Page Section Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider uppercase text-brand-charcoal/90">
            <button
              onClick={() => onScrollTo('formulations')}
              className="hover:text-brand-gold-dark transition-colors py-1"
            >
              Catalog
            </button>
            <button
              onClick={() => onScrollTo('shop-by-concern')}
              className="hover:text-brand-gold-dark transition-colors py-1"
            >
              By Concern
            </button>
            <button
              onClick={() => onScrollTo('scrolly-story')}
              className="hover:text-brand-gold-dark transition-colors py-1 flex items-center gap-1 text-brand-gold-dark"
            >
              <span>The Pure Cycle</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            </button>
            <button
              onClick={() => onScrollTo('ingredients')}
              className="hover:text-brand-gold-dark transition-colors py-1"
            >
              Botanical Actives
            </button>
            <button
              onClick={() => onScrollTo('research-story')}
              className="hover:text-brand-gold-dark transition-colors py-1"
            >
              Our Research
            </button>
            <button
              onClick={() => onScrollTo('producer-spotlight')}
              className="hover:text-brand-gold-dark transition-colors py-1"
            >
              Artisanal Labs
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            <button
              onClick={() => onScrollTo('formulations')}
              className="p-2 text-brand-charcoal hover:text-brand-gold-dark transition-colors"
              title="Search Formulations"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Portal / Account Menu */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-1.5 p-2 text-brand-charcoal hover:text-brand-gold-dark transition-colors rounded-full"
                title="Account & Ecosystem Portals"
              >
                <User className="w-5 h-5" />
                {user && (
                  <span className="hidden md:inline text-[10px] font-bold uppercase px-2 py-0.5 bg-brand-cream border border-brand-gold/30 rounded-full text-brand-gold-dark">
                    {user.role}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-brand-muted hidden sm:inline" />
              </button>

              {portalDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-brand-ivory border border-brand-gold/30 rounded-2xl shadow-luxury py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setPortalDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-brand-gold/15">
                        <p className="text-xs text-brand-muted">Signed in as</p>
                        <p className="text-sm font-semibold text-brand-charcoal truncate">{user.name}</p>
                        <span className="inline-block mt-1 text-[10px] tracking-wider uppercase px-2 py-0.5 bg-brand-sand/60 text-brand-charcoal font-medium rounded">
                          {user.role} Account
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal(user.role);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-brand-cream transition-colors flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-4 h-4 text-brand-gold" />
                        Open {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Console
                      </button>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-brand-gold/15">
                        <p className="text-xs text-brand-muted">Single-Page Ecosystem Access</p>
                        <p className="text-xs font-semibold text-brand-charcoal">Launch Portal Console</p>
                      </div>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('CUSTOMER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-brand-cream font-medium"
                      >
                        🌸 Patron Sign In / Register
                      </button>
                      <div className="border-t border-brand-gold/15 my-1" />
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('PRODUCER');
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-brand-charcoal hover:bg-brand-cream"
                      >
                        🔬 Producer & Lab Submission Desk
                      </button>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('DEALER');
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-brand-charcoal hover:bg-brand-cream"
                      >
                        📦 Dealer & Wholesale Portal
                      </button>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('PROMOTER');
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-brand-charcoal hover:bg-brand-cream"
                      >
                        📣 Promoter Affiliate Studio
                      </button>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('ADMIN');
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs font-semibold text-brand-gold-dark hover:bg-brand-cream"
                      >
                        👑 Enterprise Admin Control Tower
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-brand-charcoal hover:text-brand-gold-dark transition-colors group"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-charcoal text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-brand-ivory shadow-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-cream border-b border-brand-gold/30 px-6 py-6 space-y-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('formulations');
            }}
            className="block w-full text-left text-sm font-medium text-brand-charcoal py-2 border-b border-brand-gold/15"
          >
            Formulation Catalog
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('shop-by-concern');
            }}
            className="block w-full text-left text-sm font-medium text-brand-charcoal py-2 border-b border-brand-gold/15"
          >
            Shop by Concern
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('scrolly-story');
            }}
            className="block w-full text-left text-sm font-medium text-brand-charcoal py-2 border-b border-brand-gold/15"
          >
            The Pure Cycle (Scrollytelling)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('ingredients');
            }}
            className="block w-full text-left text-sm font-medium text-brand-charcoal py-2 border-b border-brand-gold/15"
          >
            Botanical Actives & Parallax
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPortal('PRODUCER');
            }}
            className="block w-full text-left text-sm font-bold text-brand-gold-dark py-2"
          >
            Partner Ecosystem Portals
          </button>
        </div>
      )}
    </header>
  );
}
