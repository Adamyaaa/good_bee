import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CONCERNS_DATA } from '../../data/concernsData';

export default function ShopByConcernCircleBar({
  selectedConcernId,
  onSelectConcern,
  variant = 'section', // 'section' (home section with header) or 'compact' (top bar for filter page)
  className = ''
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

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

  return (
    <div className={`relative w-full ${className}`}>
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
              <span>Scroll to explore all 12 concerns</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Outer Wrapper with Scroll Buttons */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 border border-purple-200 shadow-md text-gray-700 hover:text-[#5B0868] hover:bg-purple-50 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 border border-purple-200 shadow-md text-gray-700 hover:text-[#5B0868] hover:bg-purple-50 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
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
          className={`flex items-start gap-4 sm:gap-6 lg:gap-8 overflow-x-auto py-3 px-3 no-scrollbar select-none cursor-grab active:cursor-grabbing ${
            isDragging ? 'scroll-auto' : 'scroll-smooth'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CONCERNS_DATA.map((item) => {
            const isSelected = selectedConcernId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectConcern && onSelectConcern(item)}
                className="group flex flex-col items-center flex-shrink-0 cursor-pointer focus:outline-none transition-transform duration-300 hover:-translate-y-1"
                style={{ width: '84px' }}
              >
                {/* Circular Photo Container */}
                <div className="relative">
                  {/* Outer Circular Ring: Exact Match to Nat Habit / Plum Reference */}
                  <div
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full p-[2px] transition-all duration-300 flex items-center justify-center ${
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

                  {/* Micro Top Badge if not promo (e.g. Bestseller, De-Puffs) */}
                  {!item.isPromo && item.badge && (
                    <div className="absolute -top-1 right-0 sm:-right-1">
                      <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-bold uppercase tracking-wider bg-[#5B0868] text-white shadow-sm border border-white leading-tight block">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Circle Label Underneath */}
                <span
                  className={`mt-2 text-center text-xs font-medium leading-snug transition-colors line-clamp-2 max-w-[82px] ${
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
