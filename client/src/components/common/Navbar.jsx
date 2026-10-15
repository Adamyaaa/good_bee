import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X, Shield, Sparkles, ChevronDown, Package, FlaskConical } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-brand-gold/30 shadow-luxury'
          : 'bg-gradient-to-b from-black/85 via-black/40 to-transparent border-b border-transparent'
      }`}
    >
      {/* Top Announcement Bar - Continuous Smooth Marquee Moving Right (Invisible/Glass backdrop) */}
      <div className="relative bg-black/25 backdrop-blur-[2px] text-white py-1.5 text-[11px] sm:text-xs font-medium tracking-wider overflow-hidden border-b border-white/10 select-none">
        {/* Subtle Edge Gradients for Smooth In/Out Fades */}
        <div className="absolute left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-brand-charcoal to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-brand-charcoal to-transparent z-10 pointer-events-none" />

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
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold-light border border-brand-gold/30 font-bold uppercase tracking-widest">
                {item.badge}
              </span>
              <span className="text-brand-ivory font-sans">{item.text}</span>
              {item.isGift && (
                <button
                  type="button"
                  onClick={onOpenSurprise}
                  className="px-2 py-0.5 rounded-full bg-brand-gold hover:bg-brand-gold-light text-brand-charcoal text-[9px] font-bold tracking-wider transition-colors uppercase shadow-sm cursor-pointer"
                >
                  Claim 15%
                </button>
              )}
              {item.isWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsappPhone}?text=Hello%20Good%20Bee%20Concierge%2C%20I%20need%20assistance%20with%20natural%20skincare%20formulations.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gold hover:underline text-[10px] font-bold uppercase"
                >
                  Chat →
                </a>
              )}
              <span className="text-brand-gold/50 pl-3">•</span>
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
              className="p-2 text-white hover:text-amber-300 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo - Seamless Luxury Presentation */}
          <div className="flex items-center">
            <button
              onClick={() => onScrollTo('hero')}
              className="flex items-center gap-3.5 group text-left focus:outline-none"
            >
              <div className="h-10 sm:h-12 w-auto flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/goodbee-bee-mark-white.png"
                  alt="Good Bee Emblem"
                  className="h-full w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] font-medium text-white block leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  GOOD BEE
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-amber-300 font-sans uppercase font-semibold mt-1.5 leading-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                  100% Natural Skincare • Research
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Single-Page Section Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider uppercase text-white/90">
            <button
              onClick={() => onScrollTo('formulations')}
              className="hover:text-amber-300 transition-colors py-1 drop-shadow-sm"
            >
              Catalog
            </button>
            <button
              onClick={() => onScrollTo('shop-by-concern')}
              className="hover:text-amber-300 transition-colors py-1 drop-shadow-sm"
            >
              By Concern
            </button>
            <button
              onClick={() => onScrollTo('scrolly-story')}
              className="hover:text-amber-300 transition-colors py-1 flex items-center gap-1 text-amber-300 drop-shadow-sm"
            >
              <span>The Pure Cycle</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </button>
            <button
              onClick={() => onScrollTo('ingredients')}
              className="hover:text-amber-300 transition-colors py-1 drop-shadow-sm"
            >
              Botanical Actives
            </button>
            <button
              onClick={() => onScrollTo('research-story')}
              className="hover:text-amber-300 transition-colors py-1 drop-shadow-sm"
            >
              Our Research
            </button>
            <button
              onClick={() => onScrollTo('producer-spotlight')}
              className="hover:text-amber-300 transition-colors py-1 drop-shadow-sm"
            >
              Artisanal Labs
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            <button
              onClick={() => onScrollTo('formulations')}
              className="p-2 text-white/90 hover:text-amber-300 transition-colors drop-shadow-sm"
              title="Search Formulations"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Portal / Account Menu */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-1.5 p-2 text-white/90 hover:text-amber-300 transition-colors rounded-full"
                title="Account & Ecosystem Portals"
              >
                <User className="w-5 h-5" />
                {user && (
                  <span className="hidden md:inline text-[10px] font-bold uppercase px-2 py-0.5 bg-black/50 border border-amber-400/30 rounded-full text-amber-300">
                    {user.role}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-white/70 hidden sm:inline" />
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
                        <p className="text-[10px] text-brand-gold-dark font-bold uppercase tracking-wider">Good Bee Ecosystem</p>
                        <p className="text-xs font-semibold text-brand-charcoal">Select Portal Access</p>
                      </div>

                      {/* Good Being Club */}
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('CUSTOMER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-brand-cream font-medium flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-brand-gold" />
                          <span>Good Being Club</span>
                        </span>
                        <span className="text-[10px] text-brand-gold-dark font-sans">Patron →</span>
                      </button>

                      {/* Wholesaler / Stockist */}
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('DEALER');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-brand-cream font-medium flex items-center justify-between"
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
                        className="w-full text-left px-4 py-2 text-xs text-brand-charcoal hover:bg-brand-cream font-medium flex items-center justify-between"
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
                        className="w-full text-left px-4 py-1.5 text-xs text-brand-charcoal hover:bg-brand-cream transition-colors font-medium flex items-center justify-between"
                      >
                        <span>Track Live Order</span>
                        <span className="text-[10px] text-brand-gold-dark font-sans tracking-wide">Live Hub →</span>
                      </button>

                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onOpenPortal('ADMIN');
                        }}
                        className="w-full text-left px-4 py-1.5 text-[11px] text-brand-muted/70 hover:text-brand-gold-dark flex items-center gap-1.5"
                      >
                        <Shield className="w-3 h-3 text-brand-gold/60" />
                        <span>Store Admin Suite</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-white/90 hover:text-amber-300 transition-colors group"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform drop-shadow-sm" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-slate-950 shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-b border-brand-gold/30 px-6 py-6 space-y-4 text-white shadow-2xl animate-in slide-in-from-top-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('formulations');
            }}
            className="block w-full text-left text-sm font-medium text-white/90 py-2 border-b border-white/10"
          >
            Formulation Catalog
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('shop-by-concern');
            }}
            className="block w-full text-left text-sm font-medium text-white/90 py-2 border-b border-white/10"
          >
            Shop by Concern
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('scrolly-story');
            }}
            className="block w-full text-left text-sm font-medium text-white/90 py-2 border-b border-white/10"
          >
            The Pure Cycle (Scrollytelling)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollTo('ingredients');
            }}
            className="block w-full text-left text-sm font-medium text-white/90 py-2 border-b border-white/10"
          >
            Botanical Actives & Parallax
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPortal('CUSTOMER');
            }}
            className="block w-full text-left text-sm font-bold text-amber-300 py-2 border-b border-white/10"
          >
            My Patron Account
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrackOrder?.();
            }}
            className="w-full text-left text-sm font-semibold text-white py-2 border-b border-white/10 flex items-center justify-between"
          >
            <span>Track Order & Delivery</span>
            <span className="text-xs text-amber-300 font-sans font-medium">Live Hub →</span>
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
            <span className="font-semibold text-brand-gold-dark uppercase tracking-wider text-[11px]">Follow Good Bee:</span>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/goodbee.skincare" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-brand-cream text-brand-charcoal hover:text-brand-gold transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/goodbee.skincare" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-brand-cream text-brand-charcoal hover:text-brand-gold transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@goodbee-skincare" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-brand-cream text-brand-charcoal hover:text-brand-gold transition-colors">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
