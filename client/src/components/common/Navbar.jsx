import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X, Shield, Sparkles, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onScrollTo, onOpenPortal }) {
  const { itemCount, setIsDrawerOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  // Read dynamic site content from CMS if modified by Admin
  const siteContent = (() => {
    try {
      return JSON.parse(localStorage.getItem('goodbee_site_content') || '{}');
    } catch (e) {
      return {};
    }
  })();

  const cleanWhatsappPhone = (siteContent.whatsappNumber || '+919963075000').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-ivory/80 backdrop-blur-md border-b border-brand-gold/20 transition-all shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-brand-charcoal text-brand-sand px-4 py-1.5 text-xs font-medium tracking-wider flex items-center justify-between text-center overflow-hidden">
        <div className="hidden md:flex items-center gap-2 text-brand-gold-light">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>Formulated through High-End Active Stabilization Research</span>
        </div>
        <div className="mx-auto flex items-center gap-3">
          <span>{siteContent.announcement || 'Complimentary Delivery Across India on Orders Above ₹999'}</span>
          <span className="hidden sm:inline text-brand-gold">•</span>
          <span className="hidden sm:inline text-brand-gold-light">{siteContent.announcementSub || '100% Natural Active Ingredients'}</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs">
          <a
            href={`https://wa.me/${cleanWhatsappPhone}?text=Hello%20Good%20Bee%20Concierge%2C%20I%20need%20assistance%20with%20natural%20skincare%20formulations.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-sand hover:text-brand-gold transition-colors font-medium"
          >
            Direct Concierge: {siteContent.whatsappNumber || '+91 99630 75000'}
          </a>
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
              className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white p-1 border border-brand-gold/30 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                <img
                  src="/assets/goodbee-white-logo.png"
                  alt="Good Bee Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-lg sm:text-2xl tracking-[0.18em] sm:tracking-[0.25em] font-normal text-brand-charcoal block leading-none">
                  GOOD BEE
                </span>
                <span className="hidden sm:block text-[9px] tracking-[0.3em] text-brand-gold-dark font-sans uppercase font-medium mt-1.5">
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
                          {user.role === 'ADMIN' ? 'Store Administrator' : 'Patron Member'}
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
                        {user.role === 'ADMIN' ? 'Store Control Tower' : 'My Patron Account & Orders'}
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
                        <p className="text-xs text-brand-muted">Welcome to Good Bee</p>
                        <p className="text-xs font-semibold text-brand-charcoal">Patron Account</p>
                      </div>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('CUSTOMER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-brand-cream font-medium flex items-center justify-between"
                      >
                        <span>Sign In / Create Account</span>
                        <span className="text-[10px] text-brand-gold-dark font-sans tracking-wide">Enter →</span>
                      </button>
                      <div className="border-t border-brand-gold/15 my-1" />
                      <a
                        href="https://wa.me/919963075000?text=Hello%20Good%20Bee%2C%20I%20would%20like%20to%20track%20my%20order."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-1.5 text-xs text-brand-muted hover:text-brand-charcoal transition-colors"
                      >
                        Track An Order
                      </a>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('ADMIN');
                        }}
                        className="w-full text-left px-4 py-1.5 text-[11px] text-brand-muted/70 hover:text-brand-gold-dark flex items-center gap-1.5"
                      >
                        <Shield className="w-3 h-3 text-brand-gold/60" />
                        <span>Store Admin Access</span>
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
              onOpenPortal('CUSTOMER');
            }}
            className="block w-full text-left text-sm font-bold text-brand-gold-dark py-2"
          >
            My Patron Account
          </button>
        </div>
      )}
    </header>
  );
}
