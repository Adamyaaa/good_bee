import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X, Shield, Sparkles, ChevronDown, Package, FlaskConical, Cpu } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onScrollTo, onOpenPortal, onOpenTrackOrder, onOpenSurprise }) {
  const { itemCount, setIsDrawerOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

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

  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-md'
          : 'bg-white/90 backdrop-blur-md border-b border-amber-200/50 shadow-sm'
      }`}
    >
      {/* Top Announcement Bar - Continuous Smooth Marquee Moving Right (Bright Cosmetic Gradient) */}
      <div className="relative bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white py-1.5 text-[11px] sm:text-xs font-medium tracking-wider overflow-hidden border-b border-white/20 select-none shadow-inner">
        {/* Subtle Edge Gradients for Smooth In/Out Fades */}
        <div className="absolute left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-amber-500 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-amber-600 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track moving towards the right */}
        <div className="animate-marquee-right flex items-center">
          {[
            { text: '✨ Formulated through High-End Active Stabilization Research', badge: 'LAB-STABILIZED' },
            { text: siteContent.announcement || '🚚 Complimentary Delivery Across India on Orders Above ₹999', badge: 'FREE SHIPPING' },
            { text: '🌿 100% Natural Active Ingredients • Zero Artificial Synthetics', badge: '100% PURE' },
            { text: '🎁 Claim 15% Off Your First Order • Use Code HONEY15', isGift: true, badge: 'OFFER' },
            { text: `💬 Direct Botanical Concierge: ${phoneNumber}`, isWhatsapp: true, badge: 'WHATSAPP' },
            { text: '🔬 Derm-Tested Formulations for Barrier Repair & Breakout Reset', badge: 'CLINICAL' },
            { text: '✨ Formulated through High-End Active Stabilization Research', badge: 'LAB-STABILIZED' },
            { text: siteContent.announcement || '🚚 Complimentary Delivery Across India on Orders Above ₹999', badge: 'FREE SHIPPING' },
            { text: '🌿 100% Natural Active Ingredients • Zero Artificial Synthetics', badge: '100% PURE' },
            { text: '🎁 Claim 15% Off Your First Order • Use Code HONEY15', isGift: true, badge: 'OFFER' },
            { text: `💬 Direct Botanical Concierge: ${phoneNumber}`, isWhatsapp: true, badge: 'WHATSAPP' },
            { text: '🔬 Derm-Tested Formulations for Barrier Repair & Breakout Reset', badge: 'CLINICAL' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center whitespace-nowrap px-6 gap-3">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/25 text-white font-bold uppercase tracking-widest border border-white/30">
                {item.badge}
              </span>
              <span className="text-white font-sans font-medium">{item.text}</span>
              {item.isGift && (
                <button
                  type="button"
                  onClick={onOpenSurprise}
                  className="px-2.5 py-0.5 rounded-full bg-white hover:bg-amber-100 text-amber-900 text-[9px] font-bold tracking-wider transition-colors uppercase shadow-sm cursor-pointer"
                >
                  Claim 15%
                </button>
              )}
              {item.isWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsappPhone}?text=Hello%20Good%20Bee%20Concierge%2C%20I%20need%20assistance%20with%20natural%20skincare%20formulations.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-100 hover:text-white underline text-[10px] font-bold uppercase"
                >
                  Chat →
                </a>
              )}
              <span className="text-white/60 pl-3">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-charcoal hover:text-amber-600 focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo - Seamless Cosmetic Presentation */}
          <div className="flex items-center">
            <button
              onClick={() => onScrollTo('hero')}
              className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
            >
              <div className="h-10 sm:h-12 w-auto flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/goodbee-bee-mark-gold.png"
                  alt="Good Bee Emblem"
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    e.target.src = '/assets/goodbee-bee-mark.png';
                  }}
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] font-medium text-brand-charcoal block leading-none">
                  GOOD BEE
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-amber-700 font-sans uppercase font-bold mt-1.5 leading-none">
                  100% Natural Skincare • Research
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links - Bright Cosmetic Hierarchy */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold tracking-wider uppercase text-brand-charcoal/80">
            {/* Direct How to Apply Highlight Button */}
            <button
              onClick={() => onScrollTo('how-to-apply')}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 border border-amber-300 text-amber-950 font-bold hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>How To Apply</span>
            </button>

            {/* AI Lab Diagnostic */}
            <button
              onClick={() => onScrollTo('ai-formulation-lab')}
              className="hover:text-amber-600 transition-colors py-1 flex items-center gap-1 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-rose-500" />
              <span>AI Diagnostic</span>
            </button>

            <button
              onClick={() => onScrollTo('shop-by-concern')}
              className="hover:text-amber-600 transition-colors py-1 cursor-pointer"
            >
              By Concern
            </button>

            <button
              onClick={() => onScrollTo('formulations')}
              className="hover:text-amber-600 transition-colors py-1 cursor-pointer"
            >
              Catalog
            </button>

            <button
              onClick={() => onScrollTo('scrolly-story')}
              className="hover:text-amber-600 transition-colors py-1 flex items-center gap-1 text-amber-800 cursor-pointer"
            >
              <span>The Pure Cycle</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            </button>

            <button
              onClick={() => onScrollTo('research-story')}
              className="hover:text-amber-600 transition-colors py-1 cursor-pointer"
            >
              Our Research
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            
            <button
              onClick={() => onScrollTo('formulations')}
              className="p-2 text-brand-charcoal hover:text-amber-600 transition-colors cursor-pointer"
              title="Search Formulations"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Portal / Account Menu */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-1.5 p-2 text-brand-charcoal hover:text-amber-600 transition-colors rounded-full cursor-pointer"
                title="Account & Ecosystem Portals"
              >
                <User className="w-5 h-5" />
                {user && (
                  <span className="hidden md:inline text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-100 border border-amber-300 rounded-full text-amber-900">
                    {user.role}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-brand-muted hidden sm:inline" />
              </button>

              {portalDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-amber-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setPortalDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-brand-gold/15">
                        <p className="text-xs text-brand-muted">Signed in as</p>
                        <p className="text-sm font-semibold text-brand-charcoal truncate">{user.name}</p>
                        <span className="inline-block mt-1 text-[10px] tracking-wider uppercase px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 font-medium rounded">
                          {user.role === 'ADMIN' ? 'Store Administrator' : 'Patron Member'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal(user.role);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-amber-50 transition-colors flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        {user.role === 'ADMIN' ? 'Store Control Tower' : 'My Patron Account & Orders'}
                      </button>
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-brand-gold/15">
                        <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Good Bee Ecosystem</p>
                        <p className="text-xs font-semibold text-brand-charcoal">Select Portal Access</p>
                      </div>

                      {/* Good Being Club */}
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('CUSTOMER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-amber-50 font-medium flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-amber-600" />
                          <span>Good Being Club</span>
                        </span>
                        <span className="text-[10px] text-amber-800 font-sans font-bold">Patron →</span>
                      </button>

                      {/* Wholesaler / Stockist */}
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('DEALER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-amber-50 font-medium flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-blue-700" />
                          <span>Wholesale & Stockist</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold font-mono">B2B</span>
                      </button>

                      {/* Vendor / Supplier */}
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('PRODUCER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-amber-50 font-medium flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Vendors & Botanical Labs</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold">SUPPLIER</span>
                      </button>

                      <div className="border-t border-brand-gold/15 my-1" />

                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenTrackOrder?.();
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-brand-charcoal hover:bg-amber-50 transition-colors font-medium flex items-center justify-between cursor-pointer"
                      >
                        <span>Track Live Order</span>
                        <span className="text-[10px] text-amber-800 font-sans tracking-wide font-bold">Live Hub →</span>
                      </button>

                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('ADMIN');
                        }}
                        className="w-full text-left px-4 py-1.5 text-[11px] text-brand-muted hover:text-amber-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Shield className="w-3 h-3 text-amber-600/60" />
                        <span>Store Admin Suite</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger with Bright Cosmetic Pill */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-brand-charcoal hover:text-amber-700 transition-colors group cursor-pointer border border-amber-200"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-amber-200 px-6 py-6 space-y-4 text-brand-charcoal shadow-2xl animate-in slide-in-from-top-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('how-to-apply');
            }}
            className="w-full text-left text-sm font-bold text-amber-800 py-2 border-b border-amber-100 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>How To Apply (Daily Regimen)</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('ai-formulation-lab');
            }}
            className="w-full text-left text-sm font-bold text-rose-700 py-2 border-b border-amber-100 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-rose-500" />
            <span>AI Skin Diagnostic</span>
          </button>
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
              onOpenPortal('CUSTOMER');
            }}
            className="block w-full text-left text-sm font-bold text-amber-800 py-2 border-b border-brand-gold/15"
          >
            My Patron Account
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrackOrder?.();
            }}
            className="w-full text-left text-sm font-semibold text-brand-charcoal py-2 border-b border-brand-gold/15 flex items-center justify-between"
          >
            <span>Track Order & Delivery</span>
            <span className="text-xs text-amber-800 font-sans font-bold">Live Hub →</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSurprise?.();
            }}
            className="block w-full text-left text-sm font-bold text-amber-700 py-2 border-b border-brand-gold/15"
          >
            🎁 Claim Surprise Gift (15% OFF)
          </button>

          {/* Mobile Socials */}
          <div className="pt-3 flex items-center justify-between text-xs text-brand-charcoal/70">
            <span className="font-semibold text-amber-800 uppercase tracking-wider text-[11px]">Follow Good Bee:</span>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/goodbee.skincare" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-amber-50 text-amber-800 hover:text-amber-900 transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/goodbee.skincare" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-amber-50 text-amber-800 hover:text-amber-900 transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@goodbee-skincare" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-amber-50 text-amber-800 hover:text-amber-900 transition-colors">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
