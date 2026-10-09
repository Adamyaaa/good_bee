import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { GoodBeeApi } from '../../services/api';

const CATEGORIES = ['All', 'Face Care', 'Concentrated Serums', 'Cleansers', 'Restorative Elixirs'];
const CONCERNS = [
  'All',
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
    if (activeConcern) {
      setSelectedConcern(activeConcern);
    }
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
    <section id="formulations" className="py-24 bg-brand-cream/30 border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
            Complete Formulation Archive
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-charcoal font-medium">
            Formulations & Targeted Diagnostics
          </h2>
          <p className="text-sm text-brand-charcoal/70">
            Filtered in real time. Every botanical active is cold-stabilized and batch traceable.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-brand-ivory p-6 rounded-3xl border border-brand-gold/30 shadow-sm space-y-4">
          
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-charcoal text-brand-ivory shadow-sm'
                      : 'bg-brand-cream/70 text-brand-charcoal hover:bg-brand-sand/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-3.5 h-3.5 text-brand-gold-dark absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search actives or formulations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-brand-cream/40 border border-brand-gold/30 rounded-full text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
              />
            </div>

          </div>

          {/* Bottom Row: Concern Pills */}
          <div className="pt-3 border-t border-brand-gold/15 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mr-1">
              Skin Concern:
            </span>
            {CONCERNS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedConcern(c)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedConcern === c
                    ? 'bg-brand-gold-dark text-white font-semibold shadow-sm'
                    : 'bg-brand-ivory border border-brand-gold/25 text-brand-charcoal/80 hover:bg-brand-cream'
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
            <span className="text-brand-gold-dark font-medium">Click any card to inspect active formulation specs</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-brand-sand/30 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-brand-ivory rounded-3xl border border-brand-gold/20 p-8 space-y-3">
              <p className="font-serif text-lg text-brand-charcoal">No formulations found for this combination</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedConcern('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2 bg-brand-charcoal text-brand-ivory text-xs rounded-full uppercase tracking-wider"
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
