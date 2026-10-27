import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Eye,
  Check,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Filter,
  RotateCcw
} from 'lucide-react';
import { CONCERNS_DATA, getConcernById } from '../data/concernsData';
import { GoodBeeApi } from '../services/api';
import { useCart } from '../context/CartContext';
import ShopByConcernCircleBar from '../components/storefront/ShopByConcernCircleBar';

export default function ConcernFilterPage({
  initialConcernId = 'hair-fall',
  onBack,
  onSelectProduct,
  onQuickView
}) {
  const { addToCart } = useCart();
  const [activeConcern, setActiveConcern] = useState(() => getConcernById(initialConcernId));
  const [activeSubPill, setActiveSubPill] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState(null);

  // Sync when initialConcernId changes
  useEffect(() => {
    if (initialConcernId) {
      const found = getConcernById(initialConcernId);
      if (found) {
        setActiveConcern(found);
        setActiveSubPill('all');
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
      let filtered = [...allList];

      const type = activeConcern.filterType;
      const targetVal = (activeConcern.filterValue || '').toLowerCase();

      if (type === 'deals') {
        filtered = filtered.filter((p) => (p.mrp && p.mrp > p.price) || p.badge);
      } else if (type === 'gifting') {
        filtered = filtered.filter(
          (p) =>
            p.category === 'Lip & Facial Care' ||
            p.category === 'Pure Essential Oils' ||
            p.id === 'gb_prod_donkey_milk_soap' ||
            p.id === 'gb_prod_rose_mist' ||
            p.id === 'gb_prod_pink_lip_balm' ||
            p.price > 450
        );
      } else if (type === 'trending') {
        filtered = filtered.filter(
          (p) =>
            p.rating >= 4.9 ||
            p.badge === 'Bestseller' ||
            (p.reviewsCount && p.reviewsCount >= 80)
        );
      } else if (type === 'face') {
        filtered = filtered.filter(
          (p) =>
            p.category === 'Lip & Facial Care' ||
            p.category === 'Botanical Mists' ||
            p.category === 'Pure Essential Oils' ||
            p.title.toLowerCase().includes('face') ||
            p.title.toLowerCase().includes('skin') ||
            p.concerns?.some((c) =>
              ['acne', 'pigmentation', 'radiance', 'tone', 'blemish'].some((k) =>
                c.toLowerCase().includes(k)
              )
            )
        );
      } else if (type === 'eyes-lips') {
        filtered = filtered.filter(
          (p) =>
            p.category === 'Lip & Facial Care' ||
            p.id === 'gb_prod_rose_mist' ||
            p.id === 'gb_prod_frankincense' ||
            p.concerns?.some((c) =>
              c.toLowerCase().includes('lip') ||
              c.toLowerCase().includes('eye') ||
              c.toLowerCase().includes('fatigue')
            )
        );
      } else if (type === 'baby') {
        filtered = filtered.filter(
          (p) =>
            p.id === 'gb_prod_baby_soap' ||
            p.id === 'gb_prod_donkey_milk_soap' ||
            p.concerns?.some((c) => c.toLowerCase().includes('baby'))
        );
      } else if (type === 'category') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === targetVal);
      } else if (type === 'diagnostic') {
        // AI Formulation lab view shows curated recommended starter formulations
        filtered = filtered.filter((p) => p.badge || p.rating >= 4.9);
      } else {
        // General concern match
        filtered = filtered.filter((p) =>
          p.concerns?.some(
            (c) =>
              c.toLowerCase().includes(targetVal) ||
              targetVal.includes(c.toLowerCase())
          ) || p.category?.toLowerCase() === targetVal
        );
      }

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

      // Additional client-side sub-filter if specific sub-pill is selected
      if (activeSubPill !== 'all') {
        const subPillObj = activeConcern.subPills?.find((p) => p.id === activeSubPill);
        if (subPillObj) {
          const term = subPillObj.label.toLowerCase();
          filtered = filtered.filter((p) => {
            if (activeSubPill === 'under-500') return p.price < 500;
            if (activeSubPill === 'under-1000') return p.price < 1000;
            if (activeSubPill === 'essential-oils' || activeSubPill === 'pure-rosemary' || activeSubPill === 'essential-pack') {
              return p.category === 'Pure Essential Oils';
            }
            if (activeSubPill === 'soaps' || activeSubPill === 'milks' || activeSubPill === 'luxury-milks') {
              return p.category === 'Cold Processed Soaps';
            }
            return (
              p.title.toLowerCase().includes(term) ||
              p.subtitle.toLowerCase().includes(term) ||
              p.category.toLowerCase().includes(term) ||
              p.concerns?.some((c) => c.toLowerCase().includes(term) || term.includes(c.toLowerCase())) ||
              p.ingredients?.some((ing) => ing.toLowerCase().includes(term))
            );
          });
        }
      }

      // Sorting
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
    // Update hash for seamless browser history without reload
    window.location.hash = `#concern=${concernItem.id}`;
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1e1e1e] pt-24 sm:pt-28 pb-20">
      
      {/* 1. Top Breadcrumb & Back Action Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs font-medium text-gray-500">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#5B0868] transition-colors cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span className="text-gray-300">/</span>
            <button
              onClick={() => {
                setActiveSubPill('all');
              }}
              className="text-gray-600 hover:text-[#5B0868] transition-colors cursor-pointer"
            >
              Concerns
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
            <span>Return to Main Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Photo-Shaped Circular Navigation Bar (Top Circle Switcher like Nat Habit) */}
      <div className="bg-white border-b border-purple-100 py-3 shadow-xs">
        <ShopByConcernCircleBar
          variant="compact"
          selectedConcernId={activeConcern.id}
          onSelectConcern={handleSelectNewConcern}
        />
      </div>

      {/* 3. Sub-Category / Filter Pills Row (Exact Nat Habit Inspiration Match) */}
      <div className="bg-white border-b border-gray-200 sticky top-18 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            
            {/* Filter Toggle Icon */}
            <div className="flex-shrink-0 pr-1 border-r border-gray-200 flex items-center">
              <span className="p-2 text-gray-700 bg-gray-50 rounded-lg flex items-center gap-1 text-xs font-semibold">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B0868]" />
                <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Filter</span>
              </span>
            </div>

            {/* Sub-Pills */}
            {activeConcern.subPills?.map((pill) => {
              const isActive = activeSubPill === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveSubPill(pill.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 border-2 border-rose-500 font-bold shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Main Section Header & Search / Sort Toolbar (Matching Image 2) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/80 pb-6">
          
          {/* Header Title (Nat Habit exact layout) */}
          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#1e1e1e] tracking-tight">
              Filter by Concerns
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-sans">
              {activeConcern.tagline}
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activeConcern.label}...`}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#5B0868] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:border-[#5B0868] cursor-pointer"
            >
              <option value="featured">Featured (Most Loved)</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Formulation Count Badge */}
            <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-[#5B0868] text-[11px] font-bold border border-purple-200">
              {products.length} Formulations
            </span>
          </div>

        </div>
      </div>

      {/* 5. Product Grid (Nat Habit Inspiration Matching Cards) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 h-80 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-4 max-w-lg mx-auto shadow-sm">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, idx) => {
              const effectiveMrp =
                product.mrp && product.mrp > product.price
                  ? product.mrp
                  : Math.round(product.price * 1.25);
              const discountPercent = Math.round(((effectiveMrp - product.price) / effectiveMrp) * 100);
              
              // Inspiration Badge Rotation (BEST SELLER, FREQUENTLY BOUGHT, MOST LOVED)
              const inspirationBadge =
                product.badge ||
                (idx % 3 === 0
                  ? 'BEST SELLER'
                  : idx % 3 === 1
                  ? 'FREQUENTLY BOUGHT'
                  : 'MOST LOVED');

              const isAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  
                  {/* Product Image Stage */}
                  <div className="relative aspect-square overflow-hidden bg-[#FAF7F2]">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Dark Pill Badges Top Left (Exact Nat Habit Match) */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-[#1e1e1e] text-white rounded shadow-sm">
                        {inspirationBadge}
                      </span>
                      {discountPercent > 0 && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase bg-rose-600 text-white rounded shadow-sm">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView && onQuickView(product);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/95 text-gray-800 text-xs font-semibold shadow-md hover:bg-purple-50 hover:text-[#5B0868] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                    </div>

                    {/* Volume Tag */}
                    {product.volume && (
                      <span className="absolute bottom-2 right-2 text-[9px] font-medium bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-gray-700 border border-gray-200">
                        {product.volume}
                      </span>
                    )}
                  </div>

                  {/* Card Content (Nat Habit Style Layout) */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    
                    <div className="space-y-1">
                      {/* Product Name */}
                      <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1e1e1e] leading-snug group-hover:text-[#5B0868] transition-colors line-clamp-2">
                        {product.title}
                      </h3>

                      {/* Subtitle / Clinical Benefit */}
                      <p className="text-[11px] sm:text-xs text-gray-600 font-sans line-clamp-1 leading-normal">
                        {product.subtitle || product.shortDescription}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 pt-0.5 text-xs">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="font-bold text-[11px] text-gray-900">
                          {product.rating || '4.9'}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          ({product.reviewsCount || '86'})
                        </span>
                      </div>
                    </div>

                    {/* Pricing & Add to Cart Action */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-sm sm:text-base font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                          {effectiveMrp > product.price && (
                            <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                              ₹{effectiveMrp}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-1 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#5B0868] hover:bg-[#480653] text-white shadow-xs hover:shadow-md'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Concern-Specific 3-Step Botanical Routine Guide (Diagnostic Ritual) */}
      {activeConcern.ritual && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
            
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5B0868]">
                Application Ritual & Diagnostic Routine
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
