import React, { useState, useEffect } from 'react';
import Hero from '../components/storefront/Hero';
import ShopByConcern from '../components/storefront/ShopByConcern';
import ScrollyBrandStory from '../components/storefront/ScrollyBrandStory';
import ProductCard from '../components/storefront/ProductCard';
import { GoodBeeApi } from '../services/api';
import { ArrowRight, Sparkles, FlaskConical, Award, Star, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Home({ onNavigate, onSelectProduct }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoodBeeApi.fetchProducts()
      .then((products) => {
        setFeaturedProducts(products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-0">
      
      {/* Editorial Hero */}
      <Hero
        onExplore={() => onNavigate('shop')}
        onRoutine={() => {
          const el = document.getElementById('shop-by-concern');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Target Skin Concerns */}
      <div id="shop-by-concern">
        <ShopByConcern
          onSelectConcern={(concern) => onNavigate('shop', { filterConcern: concern })}
        />
      </div>

      {/* Flagship Formulations / Bestsellers */}
      <section className="py-20 bg-brand-cream/40 border-t border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
                Curated Formulations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium mt-1">
                Good Bee Bestsellers
              </h2>
              <p className="text-sm text-brand-charcoal/70 max-w-xl mt-1">
                Bio-active restorative serums and creams formulated after high-end natural active-stabilization research.
              </p>
            </div>

            <button
              onClick={() => onNavigate('shop')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-brand-gold-dark hover:text-brand-charcoal transition-colors group"
            >
              <span>Explore All Formulations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-brand-sand/30 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onViewDetails={onSelectProduct}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* The Pure Cycle Scrollytelling Story */}
      <ScrollyBrandStory />

      {/* Research & Formulation Philosophy Section */}
      <section id="research-story" className="py-24 bg-brand-ivory relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
                Formulation Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-charcoal font-medium leading-tight">
                Where 100% Natural Meets High-End Research.
              </h2>
              <p className="text-brand-charcoal/80 text-sm sm:text-base leading-relaxed font-sans">
                Many natural brands rely solely on traditional mixing without verifying active compound preservation. At Good Bee, every natural ingredient undergoes rigorous active-stabilization research.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-gold-dark">
                    <FlaskConical className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-brand-charcoal">
                      Active Stabilization Research
                    </h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Ensures raw botanical enzymes, flavonoids, and phytosterols do not degrade under atmospheric exposure.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-full bg-brand-cream border border-brand-gold/30 text-brand-gold-dark">
                    <ShieldCheck className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-brand-charcoal">
                      Zero Synthetic Compromises
                    </h4>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      No synthetic parabens, artificial fragrances, silicones, sulfates, or petroleum by-products.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-brand-gold/30 shadow-luxury bg-brand-cream aspect-[4/3]">
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

      {/* Producer & Ethical Partner Spotlight */}
      <section id="producer-spotlight" className="py-20 bg-brand-cream/60 border-t border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
            Collaborative Ecosystem
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
            Formulated in Concert With Artisanal Labs & Botanists
          </h2>
          <p className="text-sm text-brand-charcoal/70 max-w-2xl mx-auto">
            Good Bee works with qualified producer partners and biotechnology labs. Every formulation submission is audited by our Quality & Research team before release.
          </p>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('login', { defaultRole: 'PRODUCER' })}
              className="px-8 py-3.5 bg-brand-charcoal text-brand-ivory text-xs font-bold tracking-wider uppercase rounded-full hover:bg-brand-gold-dark transition-colors shadow-luxury inline-flex items-center gap-2"
            >
              <span>Explore Producer & Partner Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Customer Stories & Verified Reviews */}
      <section className="py-20 bg-brand-ivory border-t border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
              Good Bee Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
              Real Skin Transformations
            </h2>
            <p className="text-xs text-brand-charcoal/70">
              Patrons sharing visible results from pure botanical research routines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Kavita Menon',
                city: 'Bengaluru',
                product: 'Golden Royal Propolis Restorative Nectar',
                quote: 'My sensitized, flaking skin barrier calmed down in less than a week. It absorbs like silk without any oily heaviness.',
                rating: 5
              },
              {
                name: 'Dr. Radhika Iyer',
                city: 'Mumbai',
                product: 'Botanical Ceramide Barrier Cream',
                quote: 'As someone meticulous about ingredient safety, Good Bee’s lamellar lipid research is genuinely impressive. Highly recommended.',
                rating: 5
              },
              {
                name: 'Siddharth Rao',
                city: 'New Delhi',
                product: 'Honey Blossom Enzyme Cleanser',
                quote: 'Gentlest cleanser I have used. Cleans congested pores thoroughly without leaving the tight, parched feeling of regular foaming washes.',
                rating: 5
              }
            ].map((story, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-brand-cream/30 border border-brand-gold/25 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-600 gap-1">
                    {[...Array(story.rating)].map((_, idx) => (
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
                  <p className="text-[10px] text-brand-gold-dark font-medium mt-1 truncate">
                    Used: {story.product}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
