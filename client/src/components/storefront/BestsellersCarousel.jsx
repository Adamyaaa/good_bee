import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { GoodBeeApi } from '../../services/api';

const FILTER_TABS = [
  { id: 'all', label: 'Most Loved' },
  { id: 'Cold Processed Soaps', label: 'Cold-Cured Soaps' },
  { id: 'Pure Essential Oils', label: 'Pure Oils' },
  { id: 'mists-lips', label: 'Mists & Lip Care' },
  { id: 'Hair & Wellness', label: 'Hair & Wellness' }
];

const CURATED_BESTSELLER_IDS = [
  'gb_prod_donkey_milk_soap',
  'gb_prod_frankincense',
  'gb_prod_clear_skin_soap',
  'gb_prod_pink_lip_balm',
  'gb_prod_hair_oil',
  'gb_prod_rose_mist',
  'gb_prod_turmeric_soap',
  'gb_prod_geranium'
];

export default function BestsellersCarousel({ onQuickView, onExploreAll }) {
  const [allProducts, setAllProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const load = () => {
      GoodBeeApi.fetchProducts()
        .then((list) => {
          if (mounted) {
            setAllProducts(list || []);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) setLoading(false);
        });
    };
    load();
    window.addEventListener('goodbee_catalog_updated', load);
    return () => {
      mounted = false;
      window.removeEventListener('goodbee_catalog_updated', load);
    };
  }, []);

  const displayedProducts = React.useMemo(() => {
    if (!allProducts.length) return [];
    if (activeTab === 'all') {
      const priority = CURATED_BESTSELLER_IDS
        .map((id) => allProducts.find((p) => p.id === id))
        .filter(Boolean);
      return priority.length >= 4 ? priority : allProducts.slice(0, 8);
    }
    if (activeTab === 'mists-lips') {
      return allProducts.filter(
        (p) => p.category === 'Botanical Mists' || p.category === 'Lip & Facial Care'
      );
    }
    return allProducts.filter((p) => p.category === activeTab);
  }, [allProducts, activeTab]);

  const scrollTrack = (dir) => {
    if (!trackRef.current) return;
    const step = Math.max(280, trackRef.current.clientWidth * 0.75);
    trackRef.current.scrollBy({
      left: dir === 'left' ? -step : step,
      behavior: 'smooth'
    });
  };

  return (
    <section
      id="bestsellers"
      className="py-12 sm:py-16 bg-white border-b border-brand-gold/20 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header + Carousel Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#5B0868] text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#5B0868]" />
              <span>Fresh Small-Batch Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1918] font-medium">
              Good Bee Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Discover our most-loved cold-cured beeswax soaps, pure essential oils, and botanical mists.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              type="button"
              onClick={() => scrollTrack('left')}
              className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-purple-50 border border-brand-gold/35 text-gray-800 hover:text-[#5B0868] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Scroll bestsellers left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTrack('right')}
              className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-purple-50 border border-brand-gold/35 text-gray-800 hover:text-[#5B0868] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Scroll bestsellers right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onExploreAll?.()}
              className="ml-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#5B0868] text-[#5B0868] hover:text-white border border-purple-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>View All 19</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTER_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (trackRef.current) trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#5B0868] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-gray-700 hover:bg-purple-50 hover:text-[#5B0868] border border-brand-gold/25'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Horizontal 4-Up Scrollable Product Shelf */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-brand-cream/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedProducts.map((product, idx) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[68%] sm:w-[45%] md:w-[31%] lg:w-[calc(25%-15px)] snap-start"
              >
                <ProductCard
                  product={product}
                  idx={idx}
                  onViewDetails={onQuickView}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
