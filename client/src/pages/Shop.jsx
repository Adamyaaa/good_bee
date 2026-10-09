import ProductCard from '../components/storefront/ProductCard';
import { GoodBeeApi } from '../services/api';
import { Filter, Search, X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Pure Essential Oils', 'Face Care', 'Concentrated Serums', 'Cleansers', 'Restorative Elixirs'];
const CONCERNS = [
  'All',
  'Barrier Repair',
  'Acne & Blemishes',
  'Pigmentation & Tone',
  'Dryness & Moisture Deficit',
  'Youth & Radiance'
];

export default function Shop({ initialConcern, initialCategory, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [selectedConcern, setSelectedConcern] = useState(initialConcern || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    if (initialConcern) setSelectedConcern(initialConcern);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialConcern, initialCategory]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedConcern, searchQuery, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedConcern !== 'All') params.concern = selectedConcern;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const list = await GoodBeeApi.fetchProducts(params);
      let sorted = [...list];
      if (sortBy === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        sorted.sort((a, b) => b.rating - a.rating);
      }
      setProducts(sorted);
    } catch (err) {
      console.error('Error fetching catalog', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedConcern('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' || selectedConcern !== 'All' || searchQuery !== '';

  return (
    <div className="py-12 bg-brand-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
            Good Bee Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
            100% Natural Skincare Formulations
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal/70">
            Engineered through high-end active stabilization research. Free from synthetic fillers and parabens.
          </p>
        </div>

        {/* Search & Sort Toolbar */}
        <div className="bg-brand-cream/60 border border-brand-gold/25 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-brand-gold-dark absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by ingredient, active, or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-brand-ivory border border-brand-gold/30 rounded-xl text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-brand-muted hover:text-brand-charcoal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-brand-ivory border border-brand-gold/30 rounded-xl text-xs font-semibold text-brand-charcoal"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold-dark" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-brand-charcoal">
              <span className="text-brand-muted hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-brand-ivory border border-brand-gold/30 rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold font-medium"
              >
                <option value="featured">Featured Curations</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filters Sidebar */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              showFiltersMobile ? 'block' : 'hidden lg:block'
            } bg-brand-cream/40 p-6 rounded-2xl border border-brand-gold/25`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                Refine Formulations
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-brand-gold-dark hover:underline font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-brand-charcoal block">Category</span>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-brand-charcoal text-brand-ivory font-semibold'
                        : 'text-brand-charcoal/80 hover:bg-brand-sand/50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="text-brand-gold font-bold">•</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Concern Filter */}
            <div className="space-y-2 pt-4 border-t border-brand-gold/20">
              <span className="text-xs font-semibold text-brand-charcoal block">Skin Concern</span>
              <div className="space-y-1">
                {CONCERNS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedConcern(c)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedConcern === c
                        ? 'bg-brand-charcoal text-brand-ivory font-semibold'
                        : 'text-brand-charcoal/80 hover:bg-brand-sand/50'
                    }`}
                  >
                    <span>{c}</span>
                    {selectedConcern === c && <span className="text-brand-gold font-bold">•</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Assurance Card */}
            <div className="p-4 rounded-xl bg-brand-sand/40 border border-brand-gold/30 text-xs text-brand-charcoal space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark block">
                The Good Bee Standard
              </span>
              <p className="text-[11px] text-brand-muted leading-relaxed">
                All catalog products are confirmed 100% natural and verified for active stability.
              </p>
            </div>
          </aside>

          {/* Product Cards Grid */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Filter tags header */}
            <div className="flex items-center justify-between text-xs text-brand-muted">
              <span>Showing {products.length} formulation{products.length === 1 ? '' : 's'}</span>
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-brand-charcoal font-medium">Filters active</span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 rounded-2xl bg-brand-sand/30 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-brand-cream/40 rounded-2xl border border-brand-gold/20 p-8 space-y-3">
                <h3 className="font-serif text-xl text-brand-charcoal font-medium">
                  No formulations found matching criteria
                </h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Try adjusting your skin concern or category filter, or clear search queries.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-gold-dark transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={onSelectProduct}
                  />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
