import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

// Components
import ScrollProgress from './components/common/ScrollProgress';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WhatsAppConcierge from './components/common/WhatsAppConcierge';
import CartDrawer from './components/storefront/CartDrawer';

// SPA Sections
import Hero from './components/storefront/Hero';
import BestsellersCarousel from './components/storefront/BestsellersCarousel';
import SkincareRoutineGuide from './components/storefront/SkincareRoutineGuide';
import AiFormulationLab from './components/storefront/AiFormulationLab';
import ShopByConcern from './components/storefront/ShopByConcern';
import InteractiveSpaCatalog from './components/storefront/InteractiveSpaCatalog';
import ScrollyBrandStory from './components/storefront/ScrollyBrandStory';
import ParallaxIngredientStory from './components/storefront/ParallaxIngredientStory';
import ProductQuickViewModal from './components/storefront/ProductQuickViewModal';
import ProductDetailPage from './pages/ProductDetailPage';
import ConcernFilterPage from './pages/ConcernFilterPage';
import ShopByConcernCircleBar from './components/storefront/ShopByConcernCircleBar';
import { GoodBeeApi } from './services/api';
import ShopByReels from './components/storefront/ShopByReels';
import PortalModal from './components/portal/PortalModal';
import TrackOrderModal from './components/storefront/TrackOrderModal';
import SurpriseGiftModal from './components/storefront/SurpriseGiftModal';
import Checkout from './pages/Checkout';
import AuthPage from './pages/AuthPage';

import { motion, MotionConfig } from 'framer-motion';

// Icons for editorial sections
import { FlaskConical, ShieldCheck, ArrowRight, Star, Gift, GripVertical, Award, Leaf } from 'lucide-react';

function SpaLandingContent() {
  const { user } = useAuth();
  const { addToCart, setIsDrawerOpen } = useCart();

  // Modal states for seamless SPA experience
  const [selectedConcern, setSelectedConcern] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activePdpProduct, setActivePdpProduct] = useState(null);
  const [activeConcernPage, setActiveConcernPage] = useState(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isAuthPageOpen, setIsAuthPageOpen] = useState({ isOpen: false, mode: 'login' });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [portalModalConfig, setPortalModalConfig] = useState({ isOpen: false, role: 'CUSTOMER' });
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isSurpriseDragging, setIsSurpriseDragging] = useState(false);

  // Handle deep-link hashtag #product=<id_or_slug> & browser history (#checkout for BUG-UI-01)
  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#product=')) {
        const targetId = hash.replace('#product=', '');
        GoodBeeApi.fetchProducts().then((list) => {
          const found = list.find((p) => p.id === targetId || p.slug === targetId);
          if (found) {
            setActivePdpProduct(found);
            setIsCheckoutOpen(false);
            setActiveConcernPage(null);
            setIsAuthPageOpen({ isOpen: false, mode: 'login' });
          }
        });
      } else if (hash && hash.startsWith('#concern=')) {
        const targetConcern = hash.replace('#concern=', '');
        setActiveConcernPage(targetConcern);
        setIsCheckoutOpen(false);
        setActivePdpProduct(null);
        setIsAuthPageOpen({ isOpen: false, mode: 'login' });
      } else if (hash && hash.startsWith('#portal=')) {
        const targetRole = hash.replace('#portal=', '').toUpperCase();
        setPortalModalConfig({ isOpen: true, role: targetRole });
      } else if (hash === '#login' || hash === '#auth' || hash === '#register') {
        setIsAuthPageOpen({ isOpen: true, mode: hash === '#register' ? 'register' : 'login' });
        setIsCheckoutOpen(false);
        setActivePdpProduct(null);
        setActiveConcernPage(null);
      } else if (hash === '#checkout') {
        setIsCheckoutOpen(true);
        setActivePdpProduct(null);
        setActiveConcernPage(null);
        setIsAuthPageOpen({ isOpen: false, mode: 'login' });
      } else {
        // Any hash other than #checkout or empty hash closes checkout cleanly (BUG-UI-01)
        setIsCheckoutOpen(false);
        setIsAuthPageOpen({ isOpen: false, mode: 'login' });
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  // Surprise gift modal opens cleanly on user action (announcement bar, nav, or edge pill)
  // rather than interrupting first-time visitors mid-hero.

  // AUTH-50: Handle auth logout event & bfcache protection so back button never reveals protected portals
  React.useEffect(() => {
    const handleAuthLogout = () => {
      setPortalModalConfig({ isOpen: false, role: 'CUSTOMER' });
      setIsAuthPageOpen({ isOpen: false, mode: 'login' });
      if (window.location.hash.startsWith('#portal=')) {
        window.history.pushState(null, '', window.location.pathname);
      }
    };
    const handlePageShow = (e) => {
      if (e.persisted) {
        const storedUser = localStorage.getItem('goodbee_user');
        if (!storedUser) {
          setPortalModalConfig({ isOpen: false, role: 'CUSTOMER' });
        }
      }
    };
    window.addEventListener('goodbee_auth_logout', handleAuthLogout);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('goodbee_auth_logout', handleAuthLogout);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Dynamic site content loaded from CMS
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const stored = localStorage.getItem('goodbee_site_content');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('goodbee_site_content');
        if (stored) setSiteContent(JSON.parse(stored));
      } catch (e) {}
    };
    window.addEventListener('goodbee_site_content_updated', handleUpdate);
    return () => window.removeEventListener('goodbee_site_content_updated', handleUpdate);
  }, []);

  // Smooth scroll handler with fixed navbar clearance
  const handleScrollTo = (id) => {
    setIsCheckoutOpen(false);
    setActivePdpProduct(null);
    setActiveConcernPage(null);
    setIsAuthPageOpen({ isOpen: false, mode: 'login' });
    if (window.location.hash.startsWith('#concern=') || window.location.hash.startsWith('#product=') || window.location.hash === '#login' || window.location.hash === '#register' || window.location.hash === '#auth' || window.location.hash === '#checkout') {
      window.history.pushState(null, '', window.location.pathname);
    }
    setTimeout(() => {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(id);
      if (element) {
        const navOffset = 115;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = Math.max(0, elementPosition - navOffset);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 60);
  };

  const handleOpenPortal = (role = 'CUSTOMER') => {
    setPortalModalConfig({ isOpen: true, role });
  };

  const handleOpenCheckout = () => {
    setIsDrawerOpen(false);
    setIsCheckoutOpen(true);
    if (window.location.hash !== '#checkout') {
      window.history.pushState({ modal: 'checkout' }, '', '#checkout');
    }
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    if (window.location.hash === '#checkout') {
      if (window.history.length > 1 && window.history.state?.modal === 'checkout') {
        window.history.back();
      } else {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  };

  const handleInstantBuy = (product, quantity = 1) => {
    addToCart(product, quantity);
    handleOpenCheckout();
  };

  return (
    <div className="min-h-screen overflow-x-clip flex flex-col justify-between selection:bg-brand-gold selection:text-brand-charcoal bg-brand-ivory text-brand-charcoal">
      
      {/* Top Reading Progress Bar */}
      <ScrollProgress />

      {/* Main Brand Navigation Bar */}
      <Navbar
        onScrollTo={handleScrollTo}
        onOpenPortal={handleOpenPortal}
        onOpenAuth={(mode = 'login') => {
          setIsAuthPageOpen({ isOpen: true, mode });
          window.location.hash = `#${mode}`;
        }}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
        onSearch={(query) => {
          setCatalogSearch(query);
          handleScrollTo('formulations');
        }}
      />

      {/* If Dedicated Auth Page is triggered, render full page */}
      {isAuthPageOpen.isOpen ? (
        <main className="flex-grow">
          <AuthPage
            initialMode={isAuthPageOpen.mode}
            onBack={() => {
              setIsAuthPageOpen({ isOpen: false, mode: 'login' });
              if (window.location.hash === '#login' || window.location.hash === '#register' || window.location.hash === '#auth') {
                window.history.pushState(null, '', window.location.pathname);
              }
            }}
            onAuthSuccess={(u) => {
              setIsAuthPageOpen({ isOpen: false, mode: 'login' });
              if (u && u.role) {
                // AUTH-10 & AUTH-01: Redirect to respective role portal upon successful authentication
                setPortalModalConfig({ isOpen: true, role: u.role });
                window.location.hash = `#portal=${u.role.toLowerCase()}`;
              } else {
                if (window.location.hash === '#login' || window.location.hash === '#register' || window.location.hash === '#auth') {
                  window.history.pushState(null, '', window.location.pathname);
                }
              }
            }}
          />
        </main>
      ) : isCheckoutOpen ? (
        <main className="flex-grow">
          <Checkout
            onBack={handleCloseCheckout}
            onNavigateHome={handleCloseCheckout}
          />
        </main>
      ) : activePdpProduct ? (
        <main className="flex-grow">
          <ProductDetailPage
            product={activePdpProduct}
            onBack={() => {
              setActivePdpProduct(null);
              if (window.location.hash.startsWith('#product=')) {
                window.history.pushState(null, '', window.location.pathname);
              }
            }}
            onInstantBuy={handleInstantBuy}
            onSelectProduct={(prod) => {
              setActivePdpProduct(prod);
              window.location.hash = `#product=${prod.id}`;
            }}
          />
        </main>
      ) : activeConcernPage ? (
        <main className="flex-grow">
          <ConcernFilterPage
            initialConcernId={activeConcernPage}
            onBack={() => {
              setActiveConcernPage(null);
              if (window.location.hash.startsWith('#concern=')) {
                window.history.pushState(null, '', window.location.pathname);
              }
            }}
            onSelectProduct={(prod) => {
              setActivePdpProduct(prod);
              window.location.hash = `#product=${prod.id}`;
            }}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        </main>
      ) : (
        <main className="flex-grow space-y-0 pt-[78px] sm:pt-[86px]">
          
          {/* Top Panel: Photo-Shaped Circular Category & Concern Navigation */}
          <div className="bg-white border-b border-gray-100 shadow-2xs py-1 sm:py-1.5">
            <ShopByConcernCircleBar
              variant="compact"
              onSelectConcern={(concern) => {
                const concernId = typeof concern === 'object' ? concern.id : concern;
                setActiveConcernPage(concernId);
                window.location.hash = `#concern=${concernId}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* 1. Product-First Split Editorial Hero & 5-Pillar Icon Trust Strip */}
          <Hero
            onExplore={() => handleScrollTo('bestsellers')}
            onRoutine={() => handleScrollTo('how-to-apply')}
            onQuickViewProduct={(prod) => setQuickViewProduct(prod)}
          />

          {/* 2. Top-of-Page Bestsellers Horizontal Shelf (NatHabit-Style Quick Discovery) */}
          <BestsellersCarousel
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onExploreAll={() => handleScrollTo('formulations')}
          />

          {/* 3. Visual Shop by Skin & Hair Concern Grid */}
          <div id="shop-by-concern" className="scroll-mt-28">
            <ShopByConcern
              onSelectConcern={(concern) => {
                const concernId = typeof concern === 'object' ? concern.id : concern;
                setActiveConcernPage(concernId);
                window.location.hash = `#concern=${concernId}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* 4. Interactive "Shop by Hero Botanical" Raw Ingredients Craft Strip */}
          <ParallaxIngredientStory
            onSelectIngredient={(keyword) => {
              setCatalogSearch(keyword);
              handleScrollTo('formulations');
            }}
          />

          {/* 5. Complete Filterable & Sortable Formulations Catalog */}
          <InteractiveSpaCatalog
            activeConcern={selectedConcern}
            externalSearchQuery={catalogSearch}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onExploreRoutines={() => handleScrollTo('how-to-apply')}
          />

          {/* 6. Interactive Daily Regimen & Personalized Skin Finder Zone */}
          <SkincareRoutineGuide
            onSelectProduct={(prod) => setQuickViewProduct(prod)}
          />

          <AiFormulationLab />

          {/* 7. Formulation Lifecycle Stage ("The Pure Cycle") */}
          <ScrollyBrandStory />

          {/* 8. Research, Active Stabilization & Accredited Sourcing */}
          <section id="research-story" className="py-16 sm:py-20 bg-[#FAF7F2] relative border-b border-brand-gold/20 scroll-mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                <div className="lg:col-span-6 space-y-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[10px] font-bold uppercase tracking-widest text-[#5B0868]">
                    {siteContent.philosophyBadge || 'Formulation Philosophy'}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl text-[#1A1918] font-medium leading-tight">
                    {siteContent.philosophyTitle || 'Where 100% Natural Meets Active-Stabilized Craft.'}
                  </h2>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-sans">
                    {siteContent.philosophyDescription || 'Many natural brands rely solely on raw mixing without verifying compound stability. At Good Bee, every natural ingredient undergoes cold-process curing or low-temperature steam extraction so active flavonoids and ceramides stay potent.'}
                  </p>
                  <div className="space-y-3.5 pt-1">
                    <div className="flex gap-3.5 items-start bg-white p-4 rounded-2xl border border-brand-gold/25">
                      <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[#5B0868] flex-shrink-0">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-semibold text-[#1A1918]">
                          {siteContent.philosophyCard1Title || 'Active Stabilization Research'}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                          {siteContent.philosophyCard1Text || 'Ensures raw botanical enzymes, boswellic terpenes, and phytosterols retain potency without thermal loss.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3.5 items-start bg-white p-4 rounded-2xl border border-brand-gold/25">
                      <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[#5B0868] flex-shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-semibold text-[#1A1918]">
                          {siteContent.philosophyCard2Title || 'Zero Synthetic Compromises'}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                          {siteContent.philosophyCard2Text || 'No synthetic parabens, artificial perfumes, sulfates, silicones, or petroleum waxes.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Authentic Good Bee Studio Craft Visuals + Declarative Active Retention Profile */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl p-2.5 border border-brand-gold/30 shadow-sm space-y-2.5">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2]">
                        <img
                          src="/images_ref/Levendor-300x300.webp"
                          alt="Raw Beeswax, Lavender & Cold-Pressed Botanicals"
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>
                      <div className="px-1 pb-1">
                        <p className="font-serif text-sm font-semibold text-[#1A1918]">Unrefined Forest Beeswax</p>
                        <p className="text-[11px] text-gray-600">Breathable moisture seal & natural esters</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-2.5 border border-brand-gold/30 shadow-sm space-y-2.5">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2]">
                        <img
                          src="/images_ref/Rosmary-2-300x300.webp"
                          alt="Whole Herb Slow Infusion & Rosemary Actives"
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>
                      <div className="px-1 pb-1">
                        <p className="font-serif text-sm font-semibold text-[#1A1918]">Slow Herbal Infusions</p>
                        <p className="text-[11px] text-gray-600">Batch-verified from harvest to bottle</p>
                      </div>
                    </div>
                  </div>

                  {/* Declarative SVG Active Stabilization vs Conventional Processing Chart */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-gold/25 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B0868] block">
                          Craft Benchmark
                        </span>
                        <h4 className="font-serif text-sm sm:text-base font-semibold text-[#1A1918]">
                          Cold-Stabilized Retention vs. Commercial Processing
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-semibold">
                        <span className="inline-flex items-center gap-1 text-[#5B0868]">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#5B0868] inline-block" />
                          Good Bee
                        </span>
                        <span className="inline-flex items-center gap-1 text-gray-500">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#E8DDCF] inline-block" />
                          Conventional
                        </span>
                      </div>
                    </div>

                    <svg
                      viewBox="0 0 460 128"
                      className="w-full h-auto overflow-visible"
                      role="img"
                      aria-label="Comparison chart showing Good Bee cold-stabilized formulation retention versus conventional heat and SLS processing"
                    >
                      <title>Cold-Stabilized Formulation Retention vs Conventional Processing</title>
                      {[
                        { label: 'Natural Glycerin', gb: 100, conv: 15, y: 12 },
                        { label: 'Volatile Terpenes', gb: 98, conv: 34, y: 50 },
                        { label: 'Zero Synthetic Fillers', gb: 100, conv: 10, y: 88 }
                      ].map((row) => (
                        <g key={row.label} transform={`translate(0, ${row.y})`}>
                          <text x="0" y="13" className="fill-[#1A1918] text-[11px] font-semibold">
                            {row.label}
                          </text>
                          <line x1="145" y1="22" x2="430" y2="22" stroke="#E8DDCF" strokeDasharray="2,2" />
                          <rect x="145" y="2" width="275" height="9" rx="4.5" fill="#FAF7F2" />
                          <rect x="145" y="2" width={(275 * row.gb) / 100} height="9" rx="4.5" fill="#5B0868" />
                          <text x="426" y="10" className="fill-[#5B0868] text-[10px] font-bold">
                            {row.gb}%
                          </text>
                          <rect x="145" y="14" width="275" height="7" rx="3.5" fill="#FAF7F2" />
                          <rect x="145" y="14" width={(275 * row.conv) / 100} height="7" rx="3.5" fill="#C5A880" opacity="0.65" />
                          <text x="426" y="21" className="fill-[#635F59] text-[9px] font-medium">
                            {row.conv}%
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

              </div>

              {/* Traceable Origin & Accreditations Strip */}
              <div id="producer-spotlight" className="bg-white rounded-3xl border border-brand-gold/25 p-6 sm:p-8 shadow-xs scroll-mt-28">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B0868]">
                      {siteContent.sourcingBadge || 'Traceable Origin & Quality Accreditations'}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#1A1918] font-medium">
                      {siteContent.sourcingTitle || 'Ethical Apiaries & Artisanal Extraction Laboratories'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {siteContent.sourcingDescription || 'Good Bee partners with certified beekeepers and cold-processing botanists across South India. Every harvest undergoes batch purity verification before stabilization.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    {[
                      { title: 'India Organic (NPOP)', sub: 'Certified Botanical Sourcing' },
                      { title: 'Ayush GMP Certified', sub: 'Ministry of Ayush Standards' },
                      { title: 'ISO 22716 Cosmetics', sub: 'Audited Quality Control' }
                    ].map((cert) => (
                      <div key={cert.title} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-brand-gold/25 flex items-start gap-2.5">
                        <Award className="w-4 h-4 text-[#5B0868] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-serif font-semibold text-[#1A1918]">{cert.title}</p>
                          <p className="text-[10px] text-gray-600 mt-0.5">{cert.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Leaf className="w-4 h-4 text-[#586959]" />
                    <span>Single-origin transparency across all 19 SKUs</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleScrollTo('formulations')}
                      className="px-6 py-2.5 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>{siteContent.sourcingCtaText || 'Explore Pure Formulations'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`https://wa.me/${(siteContent.whatsappNumber || '+91-9963075000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(siteContent.whatsappGreeting || 'Hello Good Bee Team, I would like to learn more about your botanical sourcing and harvests.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#FAF7F2] border border-brand-gold/30 text-[#1A1918] text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-purple-50 hover:text-[#5B0868] transition-colors inline-flex items-center gap-2"
                    >
                      <span>Inquire with Concierge</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Ritual Stories Video Feed */}
          <ShopByReels onQuickViewProduct={(prod) => setQuickViewProduct(prod)} />

          {/* 10. Customer Stories / UGC */}
          <section id="stories" className="py-16 sm:py-20 bg-white border-t border-brand-gold/20 scroll-mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[10px] font-bold uppercase tracking-widest text-[#5B0868]">
                  {siteContent.storiesBadge || 'Good Bee Stories'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1918] font-medium">
                  {siteContent.storiesTitle || 'Real Skin Transformations'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {siteContent.storiesSubtitle || 'Patrons sharing visible results from pure botanical research routines.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {((siteContent.testimonials && siteContent.testimonials.length > 0) ? siteContent.testimonials : [
                  {
                    name: 'Kavita Menon',
                    city: 'Bengaluru',
                    concern: 'Sensitized Barrier',
                    productId: 'gb_prod_frankincense',
                    product: 'Good Bee Frankincense Pure Essential Oil',
                    quote: 'My sensitized, flaking skin barrier calmed down in less than a week. It absorbs like silk without any oily heaviness.',
                    rating: 5
                  },
                  {
                    name: 'Dr. Radhika Iyer',
                    city: 'Mumbai',
                    concern: 'Dryness & Sensitive Skin',
                    productId: 'gb_prod_donkey_milk_soap',
                    product: 'Good Bee Donkey Milk Cold Processed Soap',
                    quote: 'As someone meticulous about ingredient safety, Good Bee’s botanical purity and active stabilization is genuinely impressive. Highly recommended.',
                    rating: 5
                  },
                  {
                    name: 'Siddharth Rao',
                    city: 'New Delhi',
                    concern: 'Congested Pores & Tan',
                    productId: 'gb_prod_sunnipindi_soap',
                    product: 'Good Bee Sunnipindi Cold Processed Soap',
                    quote: 'Gentlest cleanser bar I have used. Cleans congested pores thoroughly without leaving the tight, parched feeling of regular commercial washes.',
                    rating: 5
                  }
                ]).map((story, i) => (
                  <div
                    key={story.id || i}
                    className="p-6 rounded-2xl bg-[#FAF7F2] border border-brand-gold/25 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex text-amber-500 gap-0.5">
                          {[...Array(story.rating || 5)].map((_, idx) => (
                            <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {story.concern && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-[#5B0868] border border-purple-200">
                            {story.concern}
                          </span>
                        )}
                      </div>
                      <p className="font-serif text-base text-[#1A1918] italic leading-relaxed">
                        "{story.quote}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-brand-gold/15 space-y-2">
                      <div>
                        <p className="font-serif text-sm font-semibold text-[#1A1918]">{story.name}</p>
                        <p className="text-[11px] text-gray-500">{story.city} • Verified Patron</p>
                      </div>
                      {story.product && (
                        <button
                          type="button"
                          onClick={() => {
                            GoodBeeApi.fetchProducts().then((list) => {
                              const found = list.find(
                                (p) => p.id === story.productId || p.title === story.product
                              );
                              if (found) setQuickViewProduct(found);
                              else handleScrollTo('formulations');
                            });
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl bg-white border border-brand-gold/25 hover:border-[#5B0868]/40 text-[11px] text-[#5B0868] font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer"
                        >
                          <span className="truncate">Used: {story.product}</span>
                          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
      )}

      {/* Global Comprehensive Footer */}
      <Footer
        onNavigate={(dest, params) => {
          if (params?.filterConcern || params?.filterCategory) {
            setSelectedConcern(params.filterConcern || params.filterCategory);
            handleScrollTo('formulations');
          } else if (params?.defaultRole) {
            handleOpenPortal(params.defaultRole);
          } else {
            handleScrollTo('hero');
          }
        }}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Global Slide-Over Shopping Bag */}
      <CartDrawer onCheckout={handleOpenCheckout} />

      {/* Floating WhatsApp Concierge */}
      <WhatsAppConcierge />

      {/* Docked Surprise Gift Edge Badge (Repositioned lower-left so it never overlaps Hero controls) */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -180, bottom: 80 }}
        dragMomentum={false}
        dragElastic={0.05}
        onDragStart={() => setIsSurpriseDragging(true)}
        onDragEnd={() => {
          setTimeout(() => setIsSurpriseDragging(false), 120);
        }}
        className="hidden lg:flex fixed left-0 bottom-20 z-30 items-center"
      >
        <button
          onClick={(e) => {
            if (isSurpriseDragging) {
              e.preventDefault();
              return;
            }
            setIsSurpriseOpen(true);
          }}
          className="bg-[#5B0868] hover:bg-[#480653] text-white pl-1.5 pr-2.5 py-2.5 rounded-r-xl shadow-lg border-y border-r border-purple-300/30 flex items-center gap-1.5 group cursor-grab active:cursor-grabbing select-none transition-shadow active:shadow-2xl"
          title="Claim Mystery Skincare Surprise Gift (Slide up/down to adjust position)"
        >
          <GripVertical className="w-3 h-3 text-purple-200/50 group-hover:text-purple-200 transition-colors pointer-events-none" />
          <Gift className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform pointer-events-none" />
          <span className="text-[9px] font-bold tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 text-white pointer-events-none">
            15% OFF
          </span>
        </button>
      </motion.div>

      {/* Product Quick-View Inspection Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onInstantBuy={handleInstantBuy}
          onOpenDedicatedPage={(prod) => {
            setQuickViewProduct(null);
            setActivePdpProduct(prod);
            window.location.hash = `#product=${prod.id}`;
          }}
        />
      )}

      {/* Live Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Surprise Gift Mobile Lead Capture Modal */}
      <SurpriseGiftModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
      />

      {/* Multi-Role Partner Console Slide-Over Modal */}
      <PortalModal
        isOpen={portalModalConfig.isOpen}
        initialRole={portalModalConfig.role}
        onClose={() => setPortalModalConfig({ isOpen: false, role: 'CUSTOMER' })}
      />

    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <CartProvider>
          <SpaLandingContent />
        </CartProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
