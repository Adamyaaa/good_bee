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
import ShopByConcern from './components/storefront/ShopByConcern';
import InteractiveSpaCatalog from './components/storefront/InteractiveSpaCatalog';
import ScrollyBrandStory from './components/storefront/ScrollyBrandStory';
import ParallaxIngredientStory from './components/storefront/ParallaxIngredientStory';
import ProductQuickViewModal from './components/storefront/ProductQuickViewModal';
import PortalModal from './components/portal/PortalModal';
import Checkout from './pages/Checkout';

// Icons for editorial sections
import { FlaskConical, ShieldCheck, ArrowRight, Star } from 'lucide-react';

function SpaLandingContent() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  // Modal states for seamless SPA experience
  const [selectedConcern, setSelectedConcern] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [portalModalConfig, setPortalModalConfig] = useState({ isOpen: false, role: 'CUSTOMER' });

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

  // Smooth scroll handler
  const handleScrollTo = (id) => {
    setIsCheckoutOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
      />

      {/* If Checkout is triggered, render on top or full modal */}
      {isCheckoutOpen ? (
        <main className="flex-grow">
          <Checkout
            onBack={() => setIsCheckoutOpen(false)}
            onNavigateHome={() => setIsCheckoutOpen(false)}
          />
        </main>
      ) : (
        <main className="flex-grow space-y-0">
          
          {/* 1. Multi-Layer Parallax Hero Section */}
          <Hero
            onExplore={() => handleScrollTo('formulations')}
            onRoutine={() => handleScrollTo('shop-by-concern')}
          />

          {/* 2. Interactive Diagnostic Skin Concerns */}
          <div id="shop-by-concern">
            <ShopByConcern
              onSelectConcern={(concern) => {
                setSelectedConcern(concern);
                handleScrollTo('formulations');
              }}
            />
          </div>

          {/* 3. Real-Time Interactive Formulations Catalog */}
          <InteractiveSpaCatalog
            activeConcern={selectedConcern}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />

          {/* 4. Pinned Scrollytelling Stage ("The Pure Cycle") */}
          <ScrollyBrandStory />

          {/* 5. Differential Parallax Botanical Actives Story */}
          <ParallaxIngredientStory />

          {/* 6. High-End Research & Active Stabilization Philosophy */}
          {/* 6. High-End Research & Active Stabilization Philosophy */}
          <section id="research-story" className="py-24 bg-brand-ivory relative border-t border-brand-gold/20">
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
          <section id="producer-spotlight" className="py-20 bg-brand-cream/60 border-t border-brand-gold/20">
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
                  className="px-8 py-3.5 bg-brand-charcoal text-brand-ivory text-xs font-bold tracking-wider uppercase rounded-full hover:bg-brand-gold-dark transition-colors shadow-luxury inline-flex items-center gap-2"
                >
                  <span>{siteContent.sourcingCtaText || 'Explore Pure Formulations'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/${(siteContent.whatsappNumber || '+919963075000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(siteContent.whatsappGreeting || 'Hello Good Bee Team, I would like to learn more about your botanical sourcing and harvests.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 bg-brand-ivory border border-brand-gold/40 text-brand-charcoal text-xs font-semibold tracking-wider uppercase rounded-full hover:bg-brand-cream transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <span>Inquire with Concierge</span>
                </a>
              </div>
            </div>
          </section>

          {/* 8. Customer Stories / UGC */}
          <section id="stories" className="py-20 bg-brand-ivory border-t border-brand-gold/20">
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
      />

      {/* Global Slide-Over Shopping Bag */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Floating WhatsApp Concierge */}
      <WhatsAppConcierge />

      {/* Product Quick-View Inspection Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onInstantBuy={handleInstantBuy}
        />
      )}

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
