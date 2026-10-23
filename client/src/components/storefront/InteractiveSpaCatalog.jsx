import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';
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

export default function InteractiveSpaCatalog({ activeConcern = 'All', onQuickView }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedConcern, setSelectedConcern] = useState(activeConcern);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <section id="formulations" className="py-24 bg-white border-t border-purple-100 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#5B0868] text-xs font-bold uppercase tracking-widest shadow-sm">
            <span>COMPLETE FORMULATION ARCHIVE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-charcoal font-medium">
            Formulations & Targeted Diagnostics
          </h2>
          <p className="text-sm text-brand-charcoal/70">
            Filtered in real time. Every botanical active is cold-stabilized and batch traceable.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
          
          {/* Top Row: Search + Category Pills */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mr-1">
                Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#5B0868] text-white shadow-sm'
                      : 'bg-white text-brand-charcoal hover:bg-purple-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search actives or formulations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-brand-charcoal focus:outline-none focus:border-[#5B0868]"
              />
            </div>

          </div>

          {/* Bottom Row: Concern Pills */}
          <div className="pt-3 border-t border-gray-200/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mr-1">
              Skin Concern:
            </span>
            {CONCERNS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedConcern(c)}
                className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  selectedConcern === c
                    ? 'bg-[#5B0868] text-white font-semibold shadow-sm'
                    : 'bg-white border border-gray-200 text-brand-charcoal hover:bg-purple-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

        </div>

        {/* Catalog Grid */}
        <div>
          <div className="flex justify-between items-center text-xs text-brand-muted mb-6">
            <span>Displaying {products.length} pure botanical formulation{products.length === 1 ? '' : 's'}</span>
            <span className="text-[#5B0868] font-medium">Click any card to inspect active formulation specs</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF7F2] rounded-2xl border border-gray-200 p-8 space-y-3">
              <p className="font-serif text-lg text-brand-charcoal">No formulations found for this combination</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedConcern('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2 bg-[#5B0868] hover:bg-[#480653] text-white text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
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
