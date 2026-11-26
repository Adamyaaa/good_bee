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
    <header className="fixed top-0 inset-x-0 z-40 w-full max-w-[100vw] overflow-x-clip transition-all duration-300 apple-glass-chrome shadow-xs border-b border-brand-gold/20">
      
      {/* 1. Berry-Purple Top Announcement Bar */}
      <div className="bg-[#5B0868] text-white py-1.5 text-[10px] sm:text-[11px] font-medium tracking-normal overflow-hidden select-none">
        <div className="animate-marquee-right flex items-center">
          {[
            { text: 'Build Any 4-Step Routine @ 20% OFF + Complimentary Sample Gift', isOffer: true },
            { text: siteContent.announcement || 'Complimentary Pan-India Shipping on Orders Above ₹999' },
            { text: '6-Week Cold-Cured Beeswax Soaps & Steam-Distilled Botanicals' },
            { text: `WhatsApp Skincare Concierge: ${phoneNumber}`, isWhatsapp: true },
            { text: 'Unlock 15% OFF Your First Order • Use Code HONEY15', isGift: true },
            { text: 'Build Any 4-Step Routine @ 20% OFF + Complimentary Sample Gift', isOffer: true },
            { text: siteContent.announcement || 'Complimentary Pan-India Shipping on Orders Above ₹999' },
            { text: '6-Week Cold-Cured Beeswax Soaps & Steam-Distilled Botanicals' },
            { text: `WhatsApp Skincare Concierge: ${phoneNumber}`, isWhatsapp: true },
            { text: 'Unlock 15% OFF Your First Order • Use Code HONEY15', isGift: true }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center whitespace-nowrap px-6 gap-2.5">
              <span className="font-sans font-medium text-white">{item.text}</span>
              {item.isGift && (
                <button
                  type="button"
                  onClick={onOpenSurprise}
                  className="px-2 py-0.5 rounded-full bg-white hover:bg-amber-100 text-[#5B0868] text-[9px] font-bold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
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

      {/* 2. Main Pure White Navbar (Single-Line Sleek Proportions) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-12 sm:h-14">
          
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

          {/* Left Brand Logo & Signature "Shop" Pill */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => onScrollTo('hero')}
              className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer flex-shrink-0"
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
              <span className="font-serif text-base sm:text-xl tracking-[0.15em] font-medium text-[#1e1e1e] whitespace-nowrap leading-none">
                GOOD BEE
              </span>
            </button>

            <button
              onClick={() => onScrollTo('bestsellers')}
              className="hidden sm:inline-flex items-center justify-center px-3 py-1 rounded-md bg-[#5B0868] hover:bg-[#480653] text-white text-[11px] font-bold tracking-wider uppercase transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Shop
            </button>
          </div>

          {/* Center Single-Line Nav Links */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-5 text-[11px] xl:text-xs font-medium tracking-wide text-gray-700">
            <button
              onClick={() => onScrollTo('bestsellers')}
              className="hover:text-[#5B0868] transition-colors py-1 font-semibold text-[#5B0868] cursor-pointer whitespace-nowrap"
            >
              Bestsellers
            </button>

            <button
              onClick={() => onScrollTo('shop-by-concern')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              By Concern
            </button>

            <button
              onClick={() => onScrollTo('ingredients')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              Botanicals
            </button>

            <button
              onClick={() => onScrollTo('formulations')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              All Products
            </button>

            <button
              onClick={() => onScrollTo('how-to-apply')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              Rituals
            </button>

            <button
              onClick={() => onScrollTo('scrolly-story')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              Our Craft
            </button>
          </nav>

          {/* Right Action Utilities (Search, Auth, Always-Visible Bag) */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            
            {/* Inline Search Pill (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
              <input
                type="text"
                placeholder="Search soaps, oils, mists..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  onSearch?.(e.target.value);
                }}
                className="w-44 2xl:w-52 pl-8 pr-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#5B0868] focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
            </form>

            {/* Mobile / Tablet Search Toggle */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="xl:hidden p-1.5 text-gray-700 hover:text-[#5B0868] transition-colors cursor-pointer"
              aria-label="Toggle search"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Auth Controls */}
            {!user ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('login') : onOpenPortal('CUSTOMER')}
                  className="px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-bold text-gray-700 hover:text-[#5B0868] hover:bg-purple-50 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('register') : onOpenPortal('CUSTOMER')}
                  className="hidden sm:inline-flex px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#5B0868] to-[#9B1B62] hover:opacity-95 rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  Sign Up
                </button>
              </div>
            ) : (
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
                        {user.role === 'ADMIN' ? 'Store Administrator' : user.role === 'DEALER' ? 'Wholesaler Partner' : user.role === 'PRODUCER' ? 'Botanical Vendor' : user.role === 'MEDIA_MANAGER' ? 'Media & Stock Lead' : user.role === 'DELIVERY_PARTNER' ? 'Delivery Fleet Partner' : user.role === 'PROMOTER' ? 'Affiliate Partner' : 'Customer Account'}
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
                      <span>
                        {user.role === 'ADMIN' ? 'Store Control Tower' : user.role === 'DEALER' ? 'Wholesale Desk' : user.role === 'PRODUCER' ? 'Vendor & Lab Desk' : user.role === 'MEDIA_MANAGER' ? 'Media & Stock Studio' : user.role === 'DELIVERY_PARTNER' ? 'Fleet Logistics Console' : user.role === 'PROMOTER' ? 'Promoter & Affiliate Desk' : 'My Orders & Account'}
                      </span>
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
            )}

            {/* Always-Visible Shopping Bag Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-1.5 rounded-xl text-gray-700 hover:text-[#5B0868] hover:bg-purple-50 transition-colors group cursor-pointer"
              aria-label="View Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-105 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#5B0868] text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border border-white shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Expandable Search Bar for Tablet / Mobile */}
      {searchOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white px-4 py-2.5">
          <form onSubmit={(e) => { handleSearchSubmit(e); setSearchOpen(false); }} className="max-w-7xl mx-auto relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search soaps, essential oils, hydrosols..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  onSearch?.(e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[16px] sm:text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#5B0868] focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[#5B0868] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Find
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-5 space-y-2 text-gray-800 shadow-2xl animate-in slide-in-from-top-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('bestsellers');
            }}
            className="w-full text-left text-sm font-semibold text-[#5B0868] py-2 border-b border-gray-100"
          >
            Shop Bestsellers
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
              onScrollTo('ingredients');
            }}
            className="block w-full text-left text-sm font-medium text-gray-700 py-2 border-b border-gray-100"
          >
            Hero Botanicals
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('formulations');
            }}
            className="block w-full text-left text-sm font-medium text-gray-700 py-2 border-b border-gray-100"
          >
            All Formulations
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('how-to-apply');
            }}
            className="w-full text-left text-sm font-medium text-gray-700 py-2 border-b border-gray-100"
          >
            Rituals & Skin Finder
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('scrolly-story');
            }}
            className="block w-full text-left text-sm font-medium text-gray-700 py-2 border-b border-gray-100"
          >
            The Pure Cycle (Our Craft)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPortal(user?.role || 'CUSTOMER');
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
          {!user && (
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth ? onOpenAuth('login') : onOpenPortal('CUSTOMER');
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-800"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth ? onOpenAuth('register') : onOpenPortal('CUSTOMER');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#5B0868] text-white text-xs font-bold uppercase tracking-wider"
              >
                Sign Up
              </button>
            </div>
          )}

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
