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
    const loadRemoteContent = () => {
      fetch('/api/v1/config/public')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.site) {
            setSiteContent(data.site);
            try {
              localStorage.setItem('goodbee_site_content', JSON.stringify(data.site));
            } catch (e) {}
          }
        })
        .catch(() => {});
    };
    loadRemoteContent();

    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('goodbee_site_content');
        if (stored) setSiteContent(JSON.parse(stored));
      } catch (e) {}
      loadRemoteContent();
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
        <main className="flex-grow space-y-0 pt-[80px] sm:pt-[88px]">
          
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

          {/* 6. Interactive Daily Regimen Zone */}
          <SkincareRoutineGuide
            onSelectProduct={(prod) => setQuickViewProduct(prod)}
          />

          {/* 7. Craft Lifecycle */}
          <ScrollyBrandStory />

          {/* 8. Compact Accreditations Strip */}
          <section id="research-story" className="py-10 sm:py-12 bg-[#FAF7F2] border-b border-brand-gold/20 scroll-mt-28">
            <div id="producer-spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'India Organic (NPOP)', sub: 'Certified botanical sourcing' },
                  { title: 'Ayush GMP Certified', sub: 'Ministry of Ayush standards' },
                  { title: 'ISO 22716 Cosmetics', sub: 'Batch-verified extraction' }
                ].map((cert) => (
                  <div key={cert.title} className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-gold/25 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B0868] flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-serif font-semibold text-[#1A1918]">{cert.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{cert.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. Ritual Stories Video Feed */}
          <ShopByReels onQuickViewProduct={(prod) => setQuickViewProduct(prod)} />

          {/* 10. Customer Stories */}
          <section id="stories" className="py-10 sm:py-14 bg-white border-t border-brand-gold/20 scroll-mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1918] font-medium">
                  Patron Reviews
                </h2>
                <span className="text-xs font-semibold text-[#5B0868] hidden sm:inline">
                  Verified customers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {((siteContent.testimonials && siteContent.testimonials.length > 0) ? siteContent.testimonials : [
                  {
                    name: 'Kavita Menon',
                    city: 'Bengaluru',
                    productId: 'gb_prod_frankincense',
                    product: 'Frankincense Pure Essential Oil',
                    quote: 'My sensitized skin calmed down in under a week. Absorbs like silk.',
                    rating: 5
                  },
                  {
                    name: 'Dr. Radhika Iyer',
                    city: 'Mumbai',
                    productId: 'gb_prod_donkey_milk_soap',
                    product: 'Donkey Milk Cold Processed Soap',
                    quote: 'Rare botanical purity with natural glycerin intact. Gentle every single day.',
                    rating: 5
                  },
                  {
                    name: 'Siddharth Rao',
                    city: 'New Delhi',
                    productId: 'gb_prod_sunnipindi_soap',
                    product: 'Sunnipindi Cold Processed Soap',
                    quote: 'Cleans congested pores cleanly without leaving my skin tight or dry.',
                    rating: 5
                  }
                ]).map((story, i) => (
                  <div
                    key={story.id || i}
                    className="p-5 rounded-2xl bg-[#FAF7F2] border border-brand-gold/25 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(story.rating || 5)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="font-serif text-sm sm:text-base text-[#1A1918] italic leading-relaxed">
                        "{story.quote}"
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-brand-gold/15 flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#1A1918]">{story.name}, {story.city}</span>
                      {story.product && (
                        <button
                          type="button"
                          onClick={() => {
                            GoodBeeApi.fetchProducts().then((list) => {
                              const found = list.find(
                                (p) => p.id === story.productId || p.title === story.product || p.title === `Good Bee ${story.product}`
                              );
                              if (found) setQuickViewProduct(found);
                              else handleScrollTo('formulations');
                            });
                          }}
                          className="text-[11px] font-bold text-[#5B0868] hover:underline truncate max-w-[140px] cursor-pointer"
                        >
                          View →
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
      <WhatsAppConcierge bottomOffset={Boolean(activePdpProduct && !isCheckoutOpen && !isAuthPageOpen.isOpen)} />

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
