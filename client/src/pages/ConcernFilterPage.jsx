import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { CONCERNS_DATA, getConcernById } from '../data/concernsData';
import { GoodBeeApi } from '../services/api';
import ShopByConcernCircleBar from '../components/storefront/ShopByConcernCircleBar';
import ProductCard from '../components/storefront/ProductCard';

export default function ConcernFilterPage({
  initialConcernId = 'winter-care',
  onBack,
  onSelectProduct,
  onQuickView
}) {
  const [activeConcern, setActiveConcern] = useState(() => getConcernById(initialConcernId));
  const [activeSubPill, setActiveSubPill] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync when initialConcernId changes
  useEffect(() => {
    if (initialConcernId) {
      const found = getConcernById(initialConcernId);
      if (found) {
        setActiveConcern(found);
        setActiveSubPill('all');
        setSearchQuery('');
      }
    }
  }, [initialConcernId]);

  // Fetch and filter products whenever concern, subPill, or search changes
  useEffect(() => {
    fetchFilteredProducts();
  }, [activeConcern, activeSubPill, searchQuery, sortBy]);

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const allList = await GoodBeeApi.fetchProducts({});
      let filtered = [];

      // 1. Filter by active category / sub-pill
      if (activeSubPill !== 'all') {
        const subPillObj = activeConcern.subPills?.find((p) => p.id === activeSubPill);
        if (subPillObj && subPillObj.productIds && subPillObj.productIds.length > 0) {
          filtered = allList.filter((p) => subPillObj.productIds.includes(p.id));
        } else {
          filtered = allList.filter((p) => activeConcern.productIds?.includes(p.id));
        }
      } else {
        if (activeConcern.productIds && activeConcern.productIds.length > 0) {
          filtered = allList.filter((p) => activeConcern.productIds.includes(p.id));
        } else {
          filtered = allList;
        }
      }

      // 2. Search query filter within this category
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.ingredients?.some((ing) => ing.toLowerCase().includes(q))
        );
      }

      // 3. Sorting
      if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setProducts(filtered);
    } catch (err) {
      console.error('Error fetching concern formulations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNewConcern = (concernItem) => {
    setActiveConcern(concernItem);
    setActiveSubPill('all');
    setSearchQuery('');
    window.location.hash = `#concern=${concernItem.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1918] pt-[82px] sm:pt-[90px] pb-20">
      
      {/* 1. Top Breadcrumb & Return Action */}
      <div className="bg-white border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs font-medium text-gray-500">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#5B0868] transition-colors cursor-pointer font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-[#5B0868] font-bold truncate max-w-[200px] sm:max-w-none">
              {activeConcern.label}
            </span>
          </div>

          <button
            onClick={onBack}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-[#5B0868] hover:text-[#480653] font-semibold cursor-pointer"
          >
            <span>Return to Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Photo-Shaped Circular Navigation Bar */}
      <div className="bg-white border-b border-gray-100 py-1.5 shadow-2xs">
        <ShopByConcernCircleBar
          variant="compact"
          selectedConcernId={activeConcern.id}
          onSelectConcern={handleSelectNewConcern}
        />
      </div>

      {/* 3. Theme-Aligned Editorial Concern Spotlight Banner */}
      {activeConcern.editorialBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="rounded-3xl overflow-hidden bg-white border border-brand-gold/30 shadow-xs grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Left Column: Problem Whisper vs Botanical Reply */}
            <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5B0868] border border-purple-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                  Concern Focus • {activeConcern.label}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#1A1918] font-medium tracking-tight">
                  {activeConcern.editorialBanner.whisperTopic}{' '}
                  <span className="text-gray-600 font-normal italic">{activeConcern.editorialBanner.whisperSubtitle}</span>
                </h2>
              </div>

              <div className="w-14 h-0.5 bg-brand-gold/60" />

              <div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#5B0868] font-medium tracking-tight">
                  {activeConcern.editorialBanner.replyTopic}
                </h3>
                <p className="text-sm sm:text-base text-[#1A1918]/80 font-sans mt-1">
                  {activeConcern.editorialBanner.replySubtitle}
                </p>
              </div>
            </div>

            {/* Right Column: Clean Framed Local Visual Stage */}
            <div className="md:col-span-5 p-4 sm:p-6 bg-[#FAF7F2] h-full flex items-center justify-center border-t md:border-t-0 md:border-l border-brand-gold/20">
              <div className="w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden bg-white p-2 border border-brand-gold/25 shadow-sm">
                <img
                  src={activeConcern.image || activeConcern.editorialBanner.image}
                  alt={activeConcern.label}
                  className="w-full h-full object-cover object-center rounded-xl"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images_ref/Frankin-300x300.webp';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Diagnostic Headline & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-brand-gold/20 pb-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1918] font-medium tracking-tight">
              {activeConcern.ritualHeadline || `Your Curated Ritual for ${activeConcern.label}`}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-sans mt-1">
              {activeConcern.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activeConcern.label}...`}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-[16px] sm:text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#5B0868]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:border-[#5B0868] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Sticky Sub-Category Filter Pills Row */}
      <div className="apple-glass-chrome border-y border-brand-gold/20 sticky top-[78px] sm:top-[86px] z-30 shadow-2xs mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="flex-shrink-0 pr-2 border-r border-gray-200 flex items-center">
              <span className="p-1.5 text-gray-700 bg-white rounded-lg border border-gray-200 flex items-center gap-1.5 text-xs font-semibold">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B0868]" />
                <span className="text-[11px] uppercase tracking-wider hidden sm:inline">Filter</span>
              </span>
            </div>

            {activeConcern.subPills?.map((pill) => {
              const isActive = activeSubPill === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveSubPill(pill.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-[#5B0868] text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-[#5B0868] border border-gray-200'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Filtered Products Grid (Shared Honest ProductCard) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 h-80 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-brand-gold/25 p-8 space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-[#5B0868] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-medium text-gray-900">
              No matching formulations for this filter
            </h3>
            <p className="text-xs text-gray-500 font-sans leading-relaxed">
              Try selecting 'All' sub-filters or reset the search query to explore all botanical formulations.
            </p>
            <button
              onClick={() => {
                setActiveSubPill('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                idx={idx}
                onViewDetails={(prod) => {
                  if (onSelectProduct) onSelectProduct(prod);
                  else if (onQuickView) onQuickView(prod);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 7. Concern-Specific 3-Step Botanical Routine Guide */}
      {activeConcern.ritual && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
            
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5B0868]">
                Application Ritual & Botanical Method
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-gray-900">
                {activeConcern.ritual.headline || `The 3-Step Routine for ${activeConcern.label}`}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-sans">
                Follow this sequenced botanical method to achieve clinically verified results and maximum active retention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gray-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold text-[#5B0868]/40">01</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#5B0868]">
                    Purify
                  </span>
                </div>
                <h4 className="font-serif text-base font-semibold text-gray-900">Gentle Cleansing Base</h4>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  {activeConcern.ritual.step1}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gray-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold text-[#5B0868]/40">02</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#5B0868]">
                    Hydrate
                  </span>
                </div>
                <h4 className="font-serif text-base font-semibold text-gray-900">Cellular Water Infusion</h4>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  {activeConcern.ritual.step2}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-gray-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold text-[#5B0868]/40">03</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#5B0868]">
                    Seal
                  </span>
                </div>
                <h4 className="font-serif text-base font-semibold text-gray-900">Active Nutrient Seal</h4>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  {activeConcern.ritual.step3}
                </p>
              </div>

            </div>

            {/* Quality Guarantee Banner */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Cold-Stabilized Botanical Actives</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Petrochemicals, SLS, or Parabens</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Transparent Batch Lab Test Traceability</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
