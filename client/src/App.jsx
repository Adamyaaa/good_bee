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
// Kept for client review: import ShopByReels from './components/storefront/ShopByReels';
import PortalModal from './components/portal/PortalModal';
import TrackOrderModal from './components/storefront/TrackOrderModal';
import SurpriseGiftModal from './components/storefront/SurpriseGiftModal';
import Checkout from './pages/Checkout';

import { motion } from 'framer-motion';

// Icons for editorial sections
import { FlaskConical, ShieldCheck, ArrowRight, Star, Gift, GripVertical } from 'lucide-react';

function SpaLandingContent() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  // Modal states for seamless SPA experience
  const [selectedConcern, setSelectedConcern] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activePdpProduct, setActivePdpProduct] = useState(null);
  const [activeConcernPage, setActiveConcernPage] = useState(null);

  // Handle deep-link hashtag #product=<id_or_slug>
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
          }
        });
      } else if (hash && hash.startsWith('#concern=')) {
        const targetConcern = hash.replace('#concern=', '');
        setActiveConcernPage(targetConcern);
        setIsCheckoutOpen(false);
        setActivePdpProduct(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [portalModalConfig, setPortalModalConfig] = useState({ isOpen: false, role: 'CUSTOMER' });
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isSurpriseDragging, setIsSurpriseDragging] = useState(false);

  // Auto-open surprise gift lead capture after delay if not already claimed
  React.useEffect(() => {
    try {
      const alreadyClaimed = sessionStorage.getItem('goodbee_surprise_claimed');
      if (!alreadyClaimed) {
        const timer = setTimeout(() => {
          setIsSurpriseOpen(true);
        }, 7000);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
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
    if (window.location.hash.startsWith('#concern=') || window.location.hash.startsWith('#product=')) {
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

  const handleInstantBuy = (product, quantity = 1) => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-gold selection:text-brand-charcoal bg-brand-ivory text-brand-charcoal">
      
      {/* Top Reading Progress Bar */}
      <ScrollProgress />

      {/* Main Brand Navigation Bar */}
      <Navbar
        onScrollTo={handleScrollTo}
        onOpenPortal={handleOpenPortal}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
      />

      {/* If Checkout is triggered, render on top or full modal */}
      {isCheckoutOpen ? (
        <main className="flex-grow">
          <Checkout
            onBack={() => setIsCheckoutOpen(false)}
            onNavigateHome={() => setIsCheckoutOpen(false)}
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
        <main className="flex-grow space-y-0">
          
          {/* 1. Bright & Luminous Cosmetic Hero Section */}
          <Hero
            onExplore={() => handleScrollTo('formulations')}
            onRoutine={() => handleScrollTo('how-to-apply')}
          />

          {/* Top Quick Concern & Story Circular Navigation Bar */}
          <div className="bg-white border-b border-purple-100 py-3 sm:py-4 shadow-xs">
            <ShopByConcernCircleBar
              variant="compact"
              onSelectConcern={(concern) => {
                const concernId = typeof concern === 'object' ? concern.id : concern;
                if (concernId === 'analyse-skin') {
                  handleScrollTo('ai-formulation-lab');
                  return;
                }
                setActiveConcernPage(concernId);
                window.location.hash = `#concern=${concernId}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* 2. Clinically Proven Regimen: How to Apply (Like Plum & Dot & Key) */}
          <SkincareRoutineGuide
            onSelectProduct={(prod) => setQuickViewProduct(prod)}
          />

          {/* 3. AI Formulation Lab & Skin Diagnostic Matcher */}
          <AiFormulationLab />

          {/* 4. Interactive Diagnostic Skin Concerns */}
          <div id="shop-by-concern" className="scroll-mt-28">
            <ShopByConcern
              onSelectConcern={(concern) => {
                const concernId = typeof concern === 'object' ? concern.id : concern;
                if (concernId === 'analyse-skin') {
                  handleScrollTo('ai-formulation-lab');
                  return;
                }
                setActiveConcernPage(concernId);
                window.location.hash = `#concern=${concernId}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* 5. Real-Time Interactive Formulations Catalog */}
          <InteractiveSpaCatalog
            activeConcern={selectedConcern}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />

          {/* 4. Life Moments "Shop by Reels" Feed (Code preserved - deferred pending client decision on Instagram vs Embedded) */}
          {/* <ShopByReels onQuickViewProduct={(prod) => setQuickViewProduct(prod)} /> */}

          {/* 5. Formulation Lifecycle Stage ("The Pure Cycle") */}
          <ScrollyBrandStory />

          {/* 5. Differential Parallax Botanical Actives Story */}
          <ParallaxIngredientStory />

          {/* 6. High-End Research & Active Stabilization Philosophy */}
          <section id="research-story" className="py-24 bg-brand-ivory relative border-t border-brand-gold/20 scroll-mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
                    {siteContent.philosophyBadge || 'Formulation Philosophy'}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-charcoal font-medium leading-tight">
                    {siteContent.philosophyTitle || 'Where 100% Natural Meets High-End Research.'}
                  </h2>
                  <p className="text-brand-charcoal/80 text-sm sm:text-base leading-relaxed font-sans">
                    {siteContent.philosophyDescription || 'Many natural brands rely solely on raw botanical blending without verifying active compound preservation. At Good Bee, every natural ingredient undergoes rigorous active-stabilization research.'}
                  </p>
                  <div className="space-y-4 pt-2">
                    <div className="flex gap-4 items-start">
                      <div className="p-2.5 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-gold-dark">
                        <FlaskConical className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-semibold text-brand-charcoal">
                          {siteContent.philosophyCard1Title || 'Active Stabilization Research'}
                        </h4>
                        <p className="text-xs text-brand-muted leading-relaxed">
                          {siteContent.philosophyCard1Text || 'Ensures raw botanical enzymes, flavonoids, and phytosterols do not degrade under atmospheric exposure.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="p-2.5 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-gold-dark">
                        <ShieldCheck className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-semibold text-brand-charcoal">
                          {siteContent.philosophyCard2Title || 'Zero Synthetic Compromises'}
                        </h4>
                        <p className="text-xs text-brand-muted leading-relaxed">
                          {siteContent.philosophyCard2Text || 'No synthetic parabens, artificial fragrances, silicones, sulfates, or petroleum by-products.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative">
                  <div className="relative rounded-3xl overflow-hidden border border-brand-gold/30 shadow-luxury bg-brand-cream aspect-[4/3]">
                    <img
                      src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80"
                      alt="Laboratory active extraction"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-brand-ivory">
                      <p className="font-serif text-xl font-medium">Standardized Pure Botanical Chemistry</p>
                      <p className="text-xs text-brand-sand/80">Every batch tracked from origin to jar.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 7. Artisanal Extraction Labs & Ethical Apiaries */}
          <section id="producer-spotlight" className="py-20 bg-brand-cream/60 border-t border-brand-gold/20 scroll-mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
                {siteContent.sourcingBadge || 'Traceable Origin & Sourcing'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
                {siteContent.sourcingTitle || 'Ethical Apiaries & Artisanal Extraction Laboratories'}
              </h2>
              <p className="text-sm text-brand-charcoal/70 max-w-2xl mx-auto leading-relaxed">
                {siteContent.sourcingDescription || 'Good Bee coordinates with certified natural beekeepers and cold-processing botanists across South India. Every harvest undergoes stringent batch purity verification before stabilization in our laboratory.'}
              </p>
              <div className="pt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => handleScrollTo('formulations')}
                  className="px-8 py-3.5 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{siteContent.sourcingCtaText || 'Explore Pure Formulations'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/${(siteContent.whatsappNumber || '+91-9963075000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(siteContent.whatsappGreeting || 'Hello Good Bee Team, I would like to learn more about your botanical sourcing and harvests.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 bg-white border border-gray-300 text-brand-charcoal text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-gray-50 transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <span>Inquire with Concierge</span>
                </a>
              </div>
            </div>
          </section>

          {/* 8. Customer Stories / UGC */}
          <section id="stories" className="py-20 bg-brand-ivory border-t border-brand-gold/20 scroll-mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
                  {siteContent.storiesBadge || 'Good Bee Stories'}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
                  {siteContent.storiesTitle || 'Real Skin Transformations'}
                </h2>
                <p className="text-xs text-brand-charcoal/70">
                  {siteContent.storiesSubtitle || 'Patrons sharing visible results from pure botanical research routines.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {((siteContent.testimonials && siteContent.testimonials.length > 0) ? siteContent.testimonials : [
                  {
                    name: 'Kavita Menon',
                    city: 'Bengaluru',
                    product: 'Good Bee Frankincense Pure Essential Oil',
                    quote: 'My sensitized, flaking skin barrier calmed down in less than a week. It absorbs like silk without any oily heaviness.',
                    rating: 5
                  },
                  {
                    name: 'Dr. Radhika Iyer',
                    city: 'Mumbai',
                    product: 'Good Bee Donkey Milk & Saffron Soap',
                    quote: 'As someone meticulous about ingredient safety, Good Bee’s botanical purity and active stabilization is genuinely impressive. Highly recommended.',
                    rating: 5
                  },
                  {
                    name: 'Siddharth Rao',
                    city: 'New Delhi',
                    product: 'Good Bee Sunnipindi Cold Processed Soap',
                    quote: 'Gentlest cleanser bar I have used. Cleans congested pores thoroughly without leaving the tight, parched feeling of regular commercial washes.',
                    rating: 5
                  }
                ]).map((story, i) => (
                  <div
                    key={story.id || i}
                    className="p-6 rounded-2xl bg-brand-cream/30 border border-brand-gold/25 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex text-amber-600 gap-1">
                        {[...Array(story.rating || 5)].map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <p className="font-serif text-base text-brand-charcoal italic leading-relaxed">
                        "{story.quote}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-brand-gold/15">
                      <p className="font-serif text-sm font-semibold text-brand-charcoal">{story.name}</p>
                      <p className="text-[11px] text-brand-muted">{story.city} • Verified Patron</p>
                      {story.product && (
                        <p className="text-[10px] text-brand-gold-dark font-medium mt-1 truncate">
                          Used: {story.product}
                        </p>
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
          if (params?.filterConcern) {
            setSelectedConcern(params.filterConcern);
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
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Floating WhatsApp Concierge */}
      <WhatsAppConcierge />

      {/* Docked Surprise Gift Edge Badge (Vertical Drag on Side Edge Only) */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -220, bottom: 220 }}
        dragMomentum={false}
        dragElastic={0.05}
        onDragStart={() => setIsSurpriseDragging(true)}
        onDragEnd={() => {
          setTimeout(() => setIsSurpriseDragging(false), 120);
        }}
        className="fixed left-0 top-[62%] -translate-y-1/2 z-30 flex items-center"
      >
        <button
          onClick={(e) => {
            if (isSurpriseDragging) {
              e.preventDefault();
              return;
            }
            setIsSurpriseOpen(true);
          }}
          className="bg-[#5B0868] hover:bg-[#480653] text-white pl-1.5 pr-3 py-3 rounded-r-xl shadow-xl border-y border-r border-purple-400/30 flex items-center gap-1.5 group cursor-grab active:cursor-grabbing select-none transition-shadow active:shadow-2xl"
          title="Claim Mystery Skincare Surprise Gift (Slide up/down to adjust position)"
        >
          <GripVertical className="w-3.5 h-3.5 text-purple-200/50 group-hover:text-purple-200 transition-colors pointer-events-none" />
          <Gift className="w-4 h-4 text-white group-hover:scale-110 transition-transform pointer-events-none" />
          <span className="text-[10px] font-bold tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 hidden sm:inline text-white pointer-events-none">
            15% OFF SURPRISE
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
    <AuthProvider>
      <CartProvider>
        <SpaLandingContent />
      </CartProvider>
    </AuthProvider>
  );
}
