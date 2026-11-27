import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CONCERNS_DATA } from '../../data/concernsData';

export default function ShopByConcernCircleBar({
  selectedConcernId,
  onSelectConcern,
  variant = 'compact',
  className = ''
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
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
      const scrollAmount = direction === 'left' ? -240 : 240;
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
      
      {/* Optional Header (for full section view if needed) */}
      {variant === 'section' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#5B0868] text-[11px] font-bold tracking-wider uppercase mb-1.5">
            <span>Shop By Concern & Botanical Need</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1e1e1e] font-medium tracking-tight">
            Targeted Care for Real Skin & Scalp Concerns
          </h2>
        </div>
      )}

      {/* Outer Wrapper with Centered Scroll Container */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Left Arrow Button (Desktop only) */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden sm:flex absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 border border-purple-200 shadow-md text-gray-700 hover:text-[#5B0868] hover:bg-purple-50 items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Right Arrow Button (Desktop only) */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden sm:flex absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 border border-purple-200 shadow-md text-gray-700 hover:text-[#5B0868] hover:bg-purple-50 items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Horizontal Scroll Track: Centered on Tablet & Desktop */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`flex items-start justify-start md:justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-7 overflow-x-auto py-1 px-2 sm:px-3 no-scrollbar select-none cursor-grab active:cursor-grabbing touch-pan-x ${
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
                className="group flex flex-col items-center flex-shrink-0 w-[62px] sm:w-[68px] md:w-[74px] cursor-pointer focus:outline-none transition-transform duration-200 active:scale-95 sm:hover:-translate-y-0.5"
              >
                {/* Circular Photo Container */}
                <div className="relative">
                  <div
                    className={`w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] md:w-[60px] md:h-[60px] rounded-full p-[2px] transition-all duration-300 flex items-center justify-center flex-shrink-0 ${
                      item.isPromo
                        ? 'border-2 border-rose-600 ring-2 ring-rose-100 shadow-xs'
                        : isSelected
                        ? 'border-2 border-[#5B0868] ring-2 ring-purple-100 shadow-sm'
                        : 'border-[1.5px] border-brand-gold/50 group-hover:border-[#5B0868] group-hover:shadow-sm'
                    }`}
                  >
                    {/* Inner Photo Circle */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-brand-cream relative">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />

                      {/* Flash Deals 40% OFF overlay badge */}
                      {item.isPromo && (
                        <div className="absolute inset-0 bg-rose-900/55 backdrop-blur-[0.5px] flex flex-col items-center justify-center text-white px-0.5">
                          <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-tight text-white drop-shadow leading-none">
                            Flash
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-black text-amber-200 tracking-tighter leading-none mt-0.5">
                            40% OFF
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Circle Label Underneath */}
                <span
                  className={`mt-1 text-center text-[10px] sm:text-[11px] font-medium leading-tight transition-colors line-clamp-1 max-w-[64px] sm:max-w-[70px] md:max-w-[76px] ${
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
