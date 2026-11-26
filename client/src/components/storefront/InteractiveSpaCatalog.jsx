import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { GoodBeeApi } from '../../services/api';

const CATEGORIES = [
  'All',
  'Cold Processed Soaps',
  'Pure Essential Oils',
  'Lip & Facial Care',
  'Botanical Mists',
  'Hair & Wellness'
];
const CONCERNS = [
  'All',
  'Hair Fall & Scalp',
  'Barrier Repair',
  'Acne & Blemishes',
  'Pigmentation & Tone',
  'Dryness & Moisture Deficit',
  'Youth & Radiance'
];

export default function InteractiveSpaCatalog({
  activeConcern = 'All',
  onQuickView,
  externalSearchQuery = '',
  onExploreRoutines
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedConcern, setSelectedConcern] = useState(activeConcern);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
      if (externalSearchQuery) {
        setSelectedCategory('All');
        setSelectedConcern('All');
      }
    }
  }, [externalSearchQuery]);

  useEffect(() => {
    if (!activeConcern || activeConcern === 'All') {
      setSelectedCategory('All');
      setSelectedConcern('All');
      return;
    }

    const matchedCat = CATEGORIES.find((cat) => cat.toLowerCase() === activeConcern.toLowerCase());
    if (matchedCat) {
      setSelectedCategory(matchedCat);
      setSelectedConcern('All');
      return;
    }

    const matchedConcern = CONCERNS.find(
      (c) =>
        c.toLowerCase() === activeConcern.toLowerCase() ||
        c.toLowerCase().includes(activeConcern.toLowerCase()) ||
        activeConcern.toLowerCase().includes(c.toLowerCase())
    );
    if (matchedConcern) {
      setSelectedConcern(matchedConcern);
      setSelectedCategory('All');
      return;
    }

    setSelectedConcern(activeConcern);
  }, [activeConcern]);

  useEffect(() => {
    fetchProducts();
    const handleCatalogUpdate = () => fetchProducts();
    window.addEventListener('goodbee_catalog_updated', handleCatalogUpdate);
    return () => window.removeEventListener('goodbee_catalog_updated', handleCatalogUpdate);
  }, [selectedCategory, selectedConcern, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedConcern !== 'All') params.concern = selectedConcern;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const list = await GoodBeeApi.fetchProducts(params);
      setProducts(list || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sortBy === 'price-low') copy.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [products, sortBy]);

  const hasFilters = selectedCategory !== 'All' || selectedConcern !== 'All' || searchQuery.trim() !== '';

  const resetAll = () => {
    setSelectedCategory('All');
    setSelectedConcern('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="formulations" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-brand-gold/20 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header + Combo Routine Value Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#5B0868] text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
              <span>Complete Formulation Archive</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1918] font-medium">
              Explore All Good Bee Formulations
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Filter by category, target skin concern, or active botanical. Every SKU is small-batch traceable.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onExploreRoutines?.()}
            className="self-start lg:self-end inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Shop 4-Step Routine Combos (Save 20%)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Filter & Sort Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-gold/25 shadow-xs space-y-3.5">
          
          {/* Top Row: Category Pills + Search + Sort */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1">
                Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#5B0868] text-white shadow-2xs'
                      : 'bg-[#FAF7F2] text-gray-800 hover:bg-purple-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search actives or SKUs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-gray-200 rounded-xl text-[16px] sm:text-xs text-[#1A1918] focus:outline-none focus:border-[#5B0868] focus:bg-white"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort formulations"
                className="px-3 py-2 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-[#5B0868] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Bottom Row: Concern Pills */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1">
              Concern:
            </span>
            {CONCERNS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedConcern(c)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                  selectedConcern === c
                    ? 'bg-[#5B0868] text-white font-semibold shadow-2xs'
                    : 'bg-[#FAF7F2] border border-gray-200 text-gray-800 hover:bg-purple-50'
                }`}
              >
                {c}
              </button>
            ))}

            {hasFilters && (
              <button
                type="button"
                onClick={resetAll}
                className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-800 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

        {/* Catalog Grid */}
        <div>
          <div className="flex justify-between items-center text-xs text-gray-600 mb-5">
            <span>
              Showing <strong className="text-[#1A1918]">{sortedProducts.length}</strong> pure botanical formulation{sortedProducts.length === 1 ? '' : 's'}
              {searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ''}
            </span>
            <span className="text-[#5B0868] font-medium hidden sm:inline">
              Tap any card for full ingredient breakdown & batch specs
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-white/80 animate-pulse" />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-brand-gold/25 p-8 space-y-3">
              <p className="font-serif text-lg text-[#1A1918]">No formulations found for this filter combination</p>
              <button
                type="button"
                onClick={resetAll}
                className="px-5 py-2.5 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {sortedProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  idx={idx}
                  onViewDetails={onQuickView}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
