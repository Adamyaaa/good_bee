import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  X,
  ArrowRight,
  Star,
  ShoppingBag
} from 'lucide-react';
import { CONCERNS_DATA } from '../../data/concernsData';
import { GoodBeeApi } from '../../services/api';

export default function ShopByConcernCircleBar({
  selectedConcernId,
  onSelectConcern,
  variant = 'section', // 'section' (home section with header) or 'compact' (top bar for filter page)
  showSearchBar = false,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onSelectProduct,
  searchPlaceholder,
  className = ''
}) {
  const scrollContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Search state
  const [internalQuery, setInternalQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [matchingConcerns, setMatchingConcerns] = useState([]);

  const effectiveSearchQuery = searchValue !== undefined ? searchValue : internalQuery;

  // Load products once for search autocomplete suggestions
  useEffect(() => {
    let isMounted = true;
    GoodBeeApi.fetchProducts({}).then((prods) => {
      if (isMounted && Array.isArray(prods)) {
        setAllProducts(prods);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Update suggestions when effectiveSearchQuery changes
  useEffect(() => {
    const q = effectiveSearchQuery.trim().toLowerCase();
    if (q.length < 2) {
      setMatchingProducts([]);
      setMatchingConcerns([]);
      return;
    }

    // Match products
    const filteredP = allProducts.filter((p) =>
      p.title?.toLowerCase().includes(q) ||
      p.subtitle?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.shortDescription?.toLowerCase().includes(q) ||
      p.ingredients?.some((ing) => ing.toLowerCase().includes(q))
    ).slice(0, 5);
    setMatchingProducts(filteredP);

    // Match concern categories
    const filteredC = CONCERNS_DATA.filter((c) =>
      c.label.toLowerCase().includes(q) ||
      c.tagline?.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    ).slice(0, 3);
    setMatchingConcerns(filteredC);
  }, [effectiveSearchQuery, allProducts]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  // Drag-to-scroll support
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    if (searchValue === undefined) {
      setInternalQuery(val);
    }
    if (onSearchChange) {
      onSearchChange(val);
    }
    setIsDropdownOpen(val.trim().length > 0);
  };

  const handleClearSearch = () => {
    if (searchValue === undefined) {
      setInternalQuery('');
    }
    if (onSearchChange) {
      onSearchChange('');
    }
    setIsDropdownOpen(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(effectiveSearchQuery.trim());
    }
  };

  const handleSelectProductItem = (prod) => {
    setIsDropdownOpen(false);
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      window.location.hash = `#product=${prod.id}`;
    }
  };

  const handleSelectConcernItem = (concern) => {
    setIsDropdownOpen(false);
    if (onSelectConcern) {
      onSelectConcern(concern);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      
      {/* 1. Optional Top Panel Search Bar (Plum & Nat Habit Inspired) */}
      {showSearchBar && (
        <div className="max-w-xl sm:max-w-2xl mx-auto px-3 sm:px-4 mb-2.5 sm:mb-4 relative">
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center bg-[#FAF8F5] hover:bg-white focus-within:bg-white border border-purple-200/90 hover:border-[#5B0868] focus-within:border-[#5B0868] rounded-full shadow-xs transition-all duration-200 px-3 sm:px-4 py-1.5 sm:py-2.5 gap-2 sm:gap-2.5 focus-within:ring-2 focus-within:ring-purple-100"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B0868] flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={effectiveSearchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => {
                if (effectiveSearchQuery.trim().length > 1) {
                  setIsDropdownOpen(true);
                }
              }}
              placeholder={
                searchPlaceholder ||
                'Search natural formulations, soaps, oils...'
              }
              className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-sans"
            />
            {effectiveSearchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-xs transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 active:scale-95"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Autocomplete Suggestions Flyout */}
          {isDropdownOpen && effectiveSearchQuery.trim().length > 1 && (
            <div
              ref={dropdownRef}
              className="absolute left-2 right-2 sm:left-auto sm:right-auto sm:w-[600px] mt-2 bg-white rounded-2xl shadow-2xl border border-purple-100 py-3 z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2"
            >
              {/* Category / Concern quick links */}
              {matchingConcerns.length > 0 && (
                <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Suggested Categories
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingConcerns.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectConcernItem(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-[#5B0868] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#5B0868]" />
                        <span>{c.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Products */}
              {matchingProducts.length > 0 ? (
                <div>
                  <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Matching Formulations ({matchingProducts.length})
                  </div>
                  <div className="divide-y divide-gray-50">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProductItem(p)}
                        className="px-4 py-2.5 hover:bg-purple-50/50 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-100 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = '/assets/goodbee-skincare-hero.jpg';
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#1e1e1e] truncate">
                              {p.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 truncate">
                              {p.subtitle || p.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#5B0868]">
                              ₹{p.price}
                            </span>
                            {p.mrp && p.mrp > p.price && (
                              <span className="text-[10px] text-gray-400 line-through block">
                                ₹{p.mrp}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#5B0868] hover:underline font-semibold flex items-center gap-0.5">
                            <span>View</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 pt-2.5 mt-1 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      Press Enter to view all results in Formulations
                    </span>
                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      className="text-[#5B0868] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>See all</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : matchingConcerns.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-gray-500">
                  No botanical formulations found for "{effectiveSearchQuery}". Try "Rose", "Soap", "Oil", or "Winter".
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* 2. Section Header (only shown if variant === 'section') */}
      {variant === 'section' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#5B0868] text-[11px] font-bold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#5B0868]" />
                <span>Shop By Concern & Botanical Need</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1e1e1e] font-medium tracking-tight">
                Targeted Care for Real Skin & Scalp Concerns
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl font-sans">
                Select your unique concern to discover active-stabilized plant solutions, ritual pairing guides, and verified diagnostics.
              </p>
            </div>
            <div className="text-xs text-[#5B0868] font-semibold hidden sm:flex items-center gap-1">
              <span>Scroll to explore all 8 categories</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Outer Wrapper with Scroll Buttons */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Left Arrow Button (Desktop only, mobile uses natural touch swipe) */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 border border-purple-200 shadow-md text-gray-700 hover:text-[#5B0868] hover:bg-purple-50 items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Right Arrow Button (Desktop only, mobile uses natural touch swipe) */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 border border-purple-200 shadow-md text-gray-700 hover:text-[#5B0868] hover:bg-purple-50 items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`flex items-start gap-3 sm:gap-6 lg:gap-8 overflow-x-auto py-2 px-2 sm:px-3 no-scrollbar select-none cursor-grab active:cursor-grabbing touch-pan-x ${
            isDragging ? 'scroll-auto' : 'scroll-smooth'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {CONCERNS_DATA.map((item) => {
            const isSelected = selectedConcernId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectConcern && onSelectConcern(item)}
                className="group flex flex-col items-center flex-shrink-0 w-[72px] sm:w-[84px] cursor-pointer focus:outline-none transition-transform duration-300 active:scale-95 sm:hover:-translate-y-1"
              >
                {/* Circular Photo Container */}
                <div className="relative">
                  {/* Outer Circular Ring: Exact Match to Nat Habit / Plum Reference */}
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] transition-all duration-300 flex items-center justify-center flex-shrink-0 ${
                      item.isPromo
                        ? 'border-2 border-rose-600 ring-2 ring-rose-200 ring-offset-1 shadow-xs'
                        : isSelected
                        ? 'border-2 border-[#5B0868] ring-2 ring-purple-200 ring-offset-1 shadow-xs'
                        : 'border-[1.5px] border-[#F5BEBE] hover:border-[#5B0868] hover:shadow-xs'
                    }`}
                  >
                    {/* Inner Photo Circle */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-amber-50/50 relative">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />

                      {/* Nat Habit Exact Match: Flash Deals 40% OFF overlay badge */}
                      {item.isPromo && (
                        <div className="absolute inset-0 bg-rose-900/45 backdrop-blur-[0.5px] flex flex-col items-center justify-center text-white px-1">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight text-white drop-shadow leading-none">
                            Flash Deals
                          </span>
                          <span className="text-[11px] sm:text-[12px] font-black text-amber-200 tracking-tighter leading-none mt-0.5">
                            40% OFF
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Circle Label Underneath (Zero Purple Badges on top) */}
                <span
                  className={`mt-1.5 sm:mt-2 text-center text-[11px] sm:text-xs font-medium leading-tight sm:leading-snug transition-colors line-clamp-2 max-w-[70px] sm:max-w-[82px] ${
                    isSelected
                      ? 'text-[#5B0868] font-bold'
                      : 'text-gray-800 group-hover:text-[#5B0868]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
