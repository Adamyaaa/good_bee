import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X, Shield, ChevronDown, Package, FlaskConical } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onScrollTo, onOpenPortal, onOpenTrackOrder, onOpenSurprise }) {
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
    onScrollTo('formulations');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 w-full transition-all duration-300 bg-white shadow-sm border-b border-gray-100">
      
      {/* 1. Plum-Style Berry-Purple Top Announcement Bar */}
      <div className="bg-[#5B0868] text-white py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium tracking-wide overflow-hidden select-none">
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
            <div key={idx} className="flex items-center whitespace-nowrap px-8 gap-3">
              <span className="font-sans font-medium text-white">{item.text}</span>
              {item.isGift && (
                <button
                  type="button"
                  onClick={onOpenSurprise}
                  className="px-2.5 py-0.5 rounded-full bg-white hover:bg-amber-100 text-[#5B0868] text-[9px] font-bold tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
                >
                  Claim 15%
                </button>
              )}
              {item.isWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsappPhone}?text=Hello%20Good%20Bee%20Concierge%2C%20I%20need%20assistance%20with%20natural%20skincare%20formulations.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-200 hover:text-white underline text-[10px] font-bold uppercase"
                >
                  Chat →
                </a>
              )}
              <span className="text-white/40 pl-4">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Pure White Navbar (Exact Plum Goodness Hierarchy) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#5B0868] focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Brand Logo & Plum-Style "Shop" Pill */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => onScrollTo('hero')}
              className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
            >
              <div className="h-9 sm:h-11 w-auto flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
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
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.16em] font-medium text-[#1e1e1e] block leading-none">
                  GOOD BEE
                </span>
              </div>
            </button>

            {/* Plum Signature Purple "Shop" Button */}
            <button
              onClick={() => onScrollTo('formulations')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              Shop
            </button>
          </div>

          {/* Center Nav Links in Crisp Charcoal */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium tracking-wide text-gray-700">
            <button
              onClick={() => onScrollTo('how-to-apply')}
              className="hover:text-[#5B0868] transition-colors py-1 font-semibold text-[#5B0868] cursor-pointer"
            >
              How To Apply
            </button>

            <button
              onClick={() => onScrollTo('ai-formulation-lab')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer"
            >
              AI Diagnostic
            </button>

            <button
              onClick={() => onScrollTo('shop-by-concern')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer"
            >
              By Concern
            </button>

            <button
              onClick={() => onScrollTo('formulations')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer"
            >
              Categories
            </button>

            <button
              onClick={() => onScrollTo('scrolly-story')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer"
            >
              The Pure Cycle
            </button>

            <button
              onClick={() => onScrollTo('research-story')}
              className="hover:text-[#5B0868] transition-colors py-1 cursor-pointer"
            >
              About Us
            </button>
          </nav>

          {/* Right Action Utilities (Search Bar, Account, Cart) */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            
            {/* Plum-Style Inline Search Pill (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
              <input
                type="text"
                placeholder="Search for formulations, soaps, oils..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-56 2xl:w-64 pl-9 pr-4 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#5B0868] focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Mobile / Compact Search Toggle */}
            <button
              onClick={() => onScrollTo('formulations')}
              className="xl:hidden p-2 text-gray-700 hover:text-[#5B0868] transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account / Portal Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="p-2 text-gray-700 hover:text-[#5B0868] transition-colors cursor-pointer"
                title="Account"
              >
                <User className="w-5 h-5" />
              </button>

              {portalDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setPortalDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <span className="inline-block mt-1 text-[10px] tracking-wider uppercase px-2 py-0.5 bg-purple-50 text-[#5B0868] font-bold rounded">
                          {user.role === 'ADMIN' ? 'Store Administrator' : 'Patron Member'}
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
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-[10px] text-[#5B0868] font-bold uppercase tracking-wider">Good Bee Ecosystem</p>
                        <p className="text-xs font-semibold text-gray-800">Select Portal Access</p>
                      </div>

                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('CUSTOMER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-purple-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#5B0868]" />
                          <span>Good Being Club</span>
                        </span>
                        <span className="text-[10px] text-[#5B0868] font-bold">Patron →</span>
                      </button>

                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('DEALER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-purple-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-blue-600" />
                          <span>Wholesale & Stockist</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">B2B</span>
                      </button>

                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('PRODUCER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-purple-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Vendors & Botanical Labs</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">SUPPLIER</span>
                      </button>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenTrackOrder?.();
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-gray-700 hover:bg-purple-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>Track Live Order</span>
                        <span className="text-[10px] text-[#5B0868] font-bold">Live Hub →</span>
                      </button>

                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('ADMIN');
                        }}
                        className="w-full text-left px-4 py-1.5 text-[11px] text-gray-400 hover:text-[#5B0868] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Shield className="w-3 h-3 text-gray-400" />
                        <span>Store Admin Suite</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger with Plum Purple Accent */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-gray-700 hover:text-[#5B0868] transition-colors group cursor-pointer"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#5B0868] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
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
              onScrollTo('ai-formulation-lab');
            }}
            className="w-full text-left text-sm font-semibold text-gray-700 py-2 border-b border-gray-100"
          >
            AI Skin Diagnostic
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
            My Patron Account
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
