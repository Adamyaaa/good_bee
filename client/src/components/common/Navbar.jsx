import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X, Shield, ChevronDown, Package, FlaskConical } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onScrollTo, onOpenPortal, onOpenAuth, onOpenTrackOrder, onOpenSurprise, onSearch }) {
  const { itemCount, setIsDrawerOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  // Read dynamic site content from CMS if modified by Admin
  const [siteContent, setSiteContent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('goodbee_site_content') || '{}');
    } catch (e) {
      return {};
    }
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      try {
        setSiteContent(JSON.parse(localStorage.getItem('goodbee_site_content') || '{}'));
      } catch (e) {}
    };
    window.addEventListener('goodbee_site_content_updated', handleUpdate);
    return () => window.removeEventListener('goodbee_site_content_updated', handleUpdate);
  }, []);

  const rawNumber = siteContent.whatsappNumber;
  const phoneNumber = (!rawNumber || rawNumber.includes('987654')) ? '+91-9963075000' : rawNumber;
  const cleanWhatsappPhone = phoneNumber.replace(/[^0-9]/g, '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
    }
    onScrollTo('formulations');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 w-full transition-all duration-300 bg-white shadow-sm border-b border-gray-100">
      
      {/* 1. Plum-Style Berry-Purple Top Announcement Bar */}
      <div className="bg-[#5B0868] text-white py-1 text-[10px] sm:text-[11px] font-medium tracking-normal overflow-hidden select-none">
        <div className="animate-marquee-right flex items-center">
          {[
            { text: 'Buy any 3 Good Bee formulations @ flat 30% off + free botanical gift', isOffer: true },
            { text: siteContent.announcement || 'Complimentary Delivery Across India on Orders Above ₹999' },
            { text: 'Chemistry with heart • 100% Vegan & Cold-Stabilized Actives' },
            { text: `WhatsApp Concierge for Skincare Guidance: ${phoneNumber}`, isWhatsapp: true },
            { text: 'Claim 15% Off Your First Order • Use Code HONEY15', isGift: true },
            { text: 'Buy any 3 Good Bee formulations @ flat 30% off + free botanical gift', isOffer: true },
            { text: siteContent.announcement || 'Complimentary Delivery Across India on Orders Above ₹999' },
            { text: 'Chemistry with heart • 100% Vegan & Cold-Stabilized Actives' },
            { text: `WhatsApp Concierge for Skincare Guidance: ${phoneNumber}`, isWhatsapp: true },
            { text: 'Claim 15% Off Your First Order • Use Code HONEY15', isGift: true }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center whitespace-nowrap px-6 gap-2.5">
              <span className="font-sans font-medium text-white">{item.text}</span>
              {item.isGift && (
                <button
                  type="button"
                  onClick={onOpenSurprise}
                  className="px-2 py-0.5 rounded-full bg-white hover:bg-amber-100 text-[#5B0868] text-[8px] font-bold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
                >
                  Claim 15%
                </button>
              )}
              {item.isWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsappPhone}?text=Hello%20Good%20Bee%20Concierge%2C%20I%20need%20assistance%20with%20natural%20skincare%20formulations.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-200 hover:text-white underline text-[9px] font-bold uppercase"
                >
                  Chat →
                </a>
              )}
              <span className="text-white/40 pl-3">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Pure White Navbar (Sleek Compact Proportions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          
          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-700 hover:text-[#5B0868] focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Left Brand Logo & Plum-Style "Shop" Pill */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => onScrollTo('hero')}
              className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
            >
              <div className="h-7 sm:h-8 w-auto flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/goodbee-bee-mark-gold.png"
                  alt="Good Bee Emblem"
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    e.target.src = '/assets/goodbee-bee-mark.png';
                  }}
                />
              </div>
              <div className="flex items-center">
                <span className="font-serif text-lg sm:text-2xl tracking-[0.14em] font-medium text-[#1e1e1e] block leading-none">
                  GOOD BEE
                </span>
              </div>
            </button>

            {/* Plum Signature Purple "Shop" Button */}
            <button
              onClick={() => onScrollTo('formulations')}
              className="hidden sm:inline-flex items-center justify-center px-3 py-1 rounded-md bg-[#5B0868] hover:bg-[#480653] text-white text-[11px] font-bold tracking-wider uppercase transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              Shop
            </button>
          </div>

          {/* Center Nav Links in Crisp Charcoal */}
          <nav className="hidden lg:flex items-center space-x-5 text-[11px] font-medium tracking-wide text-gray-700">
            <button
              onClick={() => onScrollTo('how-to-apply')}
              className="hover:text-[#5B0868] transition-colors py-0.5 font-semibold text-[#5B0868] cursor-pointer"
            >
              How To Apply
            </button>

            <button
              onClick={() => onScrollTo('shop-by-concern')}
              className="hover:text-[#5B0868] transition-colors py-0.5 cursor-pointer"
            >
              By Concern
            </button>

            <button
              onClick={() => onScrollTo('formulations')}
              className="hover:text-[#5B0868] transition-colors py-0.5 cursor-pointer"
            >
              Categories
            </button>

            <button
              onClick={() => onScrollTo('scrolly-story')}
              className="hover:text-[#5B0868] transition-colors py-0.5 cursor-pointer"
            >
              The Pure Cycle
            </button>

            <button
              onClick={() => onScrollTo('research-story')}
              className="hover:text-[#5B0868] transition-colors py-0.5 cursor-pointer"
            >
              About Us
            </button>
          </nav>

          {/* Right Action Utilities (Search Bar, Account, Cart) */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            
            {/* Plum-Style Inline Search Pill (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
              <input
                type="text"
                placeholder="Search formulations, soaps, oils..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  onSearch?.(e.target.value);
                }}
                className="w-44 2xl:w-56 pl-8 pr-3 py-1 rounded-md bg-gray-50 border border-gray-200 text-[11px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#5B0868] focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
            </form>

            {/* Mobile / Compact Search Toggle */}
            <button
              onClick={() => onScrollTo('formulations')}
              className="xl:hidden p-1.5 text-gray-700 hover:text-[#5B0868] transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* CONDITIONAL AUTH CONTROLS:
                - LOGGED OUT: Show clean "Log In" & "Sign Up" buttons in place of Cart & Profile icons.
                - LOGGED IN: Show Profile Icon (with user initial badge/dropdown) and Shopping Bag. */}
            {!user ? (
              <div className="flex items-center gap-1 sm:gap-2 ml-1">
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('login') : onOpenPortal('CUSTOMER')}
                  className="px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-[#5B0868] hover:bg-purple-50 rounded-xl transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('register') : onOpenPortal('CUSTOMER')}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#5B0868] to-[#9B1B62] hover:opacity-95 rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <>
                {/* Account / Portal Dropdown (Logged in only) */}
                <div className="relative">
                  <button
                    onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                    className="p-1 text-gray-700 hover:text-[#5B0868] transition-colors cursor-pointer flex items-center gap-1 rounded-xl hover:bg-gray-50"
                    title="Account"
                  >
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-[#5B0868] font-bold text-xs flex items-center justify-center border border-purple-200 shadow-2xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </button>

                  {portalDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setPortalDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <span className="inline-block mt-1 text-[10px] tracking-wider uppercase px-2 py-0.5 bg-gray-100 text-gray-700 font-bold rounded">
                          {user.role === 'ADMIN' ? 'Store Administrator' : user.role === 'DEALER' ? 'Wholesaler Partner' : user.role === 'PRODUCER' ? 'Botanical Vendor' : 'Customer Account'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal(user.role);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-[#5B0868]" />
                        <span>{user.role === 'ADMIN' ? 'Store Control Tower' : 'My Orders & Account'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Shopping Bag Trigger with Plum Purple Accent (Logged in only) */}
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="relative p-1.5 text-gray-700 hover:text-[#5B0868] transition-colors group cursor-pointer"
                  aria-label="View Shopping Bag"
                >
                  <ShoppingBag className="w-4 h-4 group-hover:scale-105 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#5B0868] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-6 space-y-4 text-gray-800 shadow-2xl animate-in slide-in-from-top-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('how-to-apply');
            }}
            className="w-full text-left text-sm font-semibold text-[#5B0868] py-2 border-b border-gray-100"
          >
            How To Apply (Daily Regimen)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('formulations');
            }}
            className="block w-full text-left text-sm font-medium text-gray-700 py-2 border-b border-gray-100"
          >
            Categories & Formulations
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('shop-by-concern');
            }}
            className="block w-full text-left text-sm font-medium text-gray-700 py-2 border-b border-gray-100"
          >
            Shop by Concern
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('scrolly-story');
            }}
            className="block w-full text-left text-sm font-medium text-gray-700 py-2 border-b border-gray-100"
          >
            The Pure Cycle (Scrollytelling)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPortal('CUSTOMER');
            }}
            className="block w-full text-left text-sm font-bold text-[#5B0868] py-2 border-b border-gray-100"
          >
            My Customer Account
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrackOrder?.();
            }}
            className="w-full text-left text-sm font-semibold text-gray-700 py-2 border-b border-gray-100 flex items-center justify-between"
          >
            <span>Track Order & Delivery</span>
            <span className="text-xs text-[#5B0868] font-bold">Live Hub →</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSurprise?.();
            }}
            className="block w-full text-left text-sm font-bold text-amber-700 py-2 border-b border-gray-100"
          >
            Claim Surprise Gift (15% OFF)
          </button>

          {/* Mobile Socials */}
          <div className="pt-3 flex items-center justify-between text-xs text-gray-600">
            <span className="font-semibold text-[#5B0868] uppercase tracking-wider text-[11px]">Follow Good Bee:</span>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/goodbee.skincare" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-purple-50 text-[#5B0868] hover:bg-purple-100 transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/goodbee.skincare" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-purple-50 text-[#5B0868] hover:bg-purple-100 transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@goodbee-skincare" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-purple-50 text-[#5B0868] hover:bg-purple-100 transition-colors">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
