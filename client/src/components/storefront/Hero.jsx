import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Pause, 
  Play,
  Heart
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    // The exact Plum Goodness aesthetic: Close-up macro skincare cream application on glowing skin in high-key daylight
    categoryTag: 'SCIENCE-BACKED SKINCARE • 100% NATURAL',
    editorialQuote: 'we have an equation.',
    editorialSubtitle: 'for real, dewy skin.',
    description: 'Where cold-stabilized bee propolis meets pure botanical actives. Zero harsh synthetics, zero artificial perfumes — just clean, clinical cellular bounce.',
    ctaPrimary: 'Shop Formulations',
    ctaPrimaryAction: 'explore',
    ctaSecondary: 'How To Apply',
    ctaSecondaryAction: 'routine',
    image: '/assets/goodbee-skincare-hero.jpg',
    objectPosition: 'object-[right_center]'
  },
  {
    id: 'slide-2',
    categoryTag: 'CONCENTRATED ACTIVE ELIXIR',
    editorialQuote: 'pure drops of radiance.',
    editorialSubtitle: 'nourish, tone & clarify.',
    description: 'Single-batch steam-distilled frankincense and floral geranium terpenes that absorb in seconds for lasting glass-skin glow.',
    ctaPrimary: 'Explore Elixirs',
    ctaPrimaryAction: 'explore',
    ctaSecondary: 'See Routine Guide',
    ctaSecondaryAction: 'routine',
    image: '/assets/goodbee-skincare-hero-2.jpg',
    objectPosition: 'object-[right_25%]'
  },
  {
    id: 'slide-3',
    categoryTag: 'COLD-CURED FOR 6 WEEKS',
    editorialQuote: 'the silk lather ritual.',
    editorialSubtitle: 'say no to chemical soap bathing.',
    description: 'Donkey milk ceramides, Kashmir saffron, and pure honey beeswax cured for 42 days to rebuild tight, flaking, or sensitized skin barriers.',
    ctaPrimary: 'Shop Cold-Process Soaps',
    ctaPrimaryAction: 'explore',
    ctaSecondary: 'View Regimen Steps',
    ctaSecondaryAction: 'routine',
    image: '/images_ref/Donkey-Milk-Soap-300x300.webp',
    objectPosition: 'object-center'
  },
  {
    id: 'slide-4',
    categoryTag: 'MICRO-DEW BOTANICAL FLORAL MISTS',
    editorialQuote: 'instant cellular hydration.',
    editorialSubtitle: 'pore tightening micro-mist.',
    description: 'Sacred pink lotus and wild rose hydro-distillates awaken tired morning skin and prime your skin to absorb serums 300% deeper.',
    ctaPrimary: 'Explore Mists',
    ctaPrimaryAction: 'explore',
    ctaSecondary: 'AM Glow Routine',
    ctaSecondaryAction: 'routine',
    image: '/images_ref/Pink-Lotus-300x300.webp',
    objectPosition: 'object-center'
  }
];

export default function Hero({ onExplore, onRoutine }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-advance slides every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchEndX.current - touchStartX.current > 50) {
      handlePrev();
    }
  };

  const slide = HERO_SLIDES[currentSlide];

  const handleAction = (action) => {
    if (action === 'routine') {
      const routineEl = document.getElementById('how-to-apply');
      if (routineEl) {
        routineEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        onRoutine?.();
      }
    } else {
      const formEl = document.getElementById('formulations');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        onExplore?.();
      }
    }
  };

  return (
    <section id="hero" className="relative w-full bg-white overflow-hidden select-none">
      
      {/* Main Full-Bleed Luminous Stage (Pure Daylight & High-Key Studio Lighting like Plum Goodness) */}
      <div
        className="relative w-full min-h-[68vh] sm:min-h-[74vh] lg:min-h-[78vh] flex items-center justify-start pt-3 sm:pt-5 lg:pt-6 pb-8 sm:pb-10 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Animated Background Media Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            {/* High-Key Bright Daylight Cosmetic Photography */}
            <img
              src={slide.image}
              alt={slide.editorialQuote}
              className={`w-full h-full object-cover ${slide.objectPosition} filter brightness-[1.05] contrast-[0.98]`}
            />

            {/* Plum-Inspired Daylight Left Fade (Gives Crisp Text Legibility While Keeping the Image Pure & Bright) */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:w-3/5 lg:w-1/2" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Desktop Left/Right Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-gray-200 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-gray-200 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Hero Content Stage: Plum-Style Poetic Minimalist Layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <div className="max-w-xl text-left space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${slide.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="space-y-3 sm:space-y-4"
              >
                {/* Category Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B0868]/10 border border-[#5B0868]/20 text-[#5B0868] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B0868] animate-pulse" />
                  <span>{slide.categoryTag}</span>
                </div>

                {/* Poetic Lowercase Headline (Exact Plum Goodness Style: "we have an equation.") */}
                <div className="space-y-1">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1e1e1e] font-normal tracking-tight leading-[1.08]">
                    {slide.editorialQuote}
                  </h1>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-[#5B0868] font-normal leading-tight">
                    {slide.editorialSubtitle}
                  </p>
                </div>

                {/* Subtitle Description */}
                <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed max-w-md pt-1">
                  {slide.description}
                </p>

                {/* Plum-Inspired Dual CTA Buttons */}
                <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-3">
                  {/* Purple Button */}
                  <button
                    onClick={() => handleAction(slide.ctaPrimaryAction)}
                    className="px-7 sm:px-8 py-3.5 bg-[#5B0868] hover:bg-[#480653] text-white font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{slide.ctaPrimary}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Clean White Button */}
                  <button
                    onClick={() => handleAction(slide.ctaSecondaryAction)}
                    className="px-6 sm:px-7 py-3.5 bg-white hover:bg-gray-50 text-[#1e1e1e] font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-xl border border-gray-300 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{slide.ctaSecondary}</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Slide Dots */}
            <div className="pt-2 flex items-center gap-2">
              {HERO_SLIDES.map((s, index) => {
                const isActive = index === currentSlide;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full focus:outline-none cursor-pointer ${
                      isActive
                        ? 'w-7 h-2 bg-[#5B0868]'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Small Discreet Pause/Play indicator */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 text-xs border border-gray-200 shadow-sm transition-colors cursor-pointer"
          title={isPaused ? 'Resume Carousel' : 'Pause Carousel'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Pure White Plum-Style Trust Ticker Strip Directly Below Hero */}
      <div className="bg-white border-y border-gray-100 py-3.5 px-4 overflow-hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-x-6 sm:gap-x-10 gap-y-2 text-xs sm:text-sm font-serif text-gray-700">
          <span className="flex items-center gap-1.5 font-medium text-[#5B0868]">
            <Heart className="w-3.5 h-3.5 fill-[#5B0868]" />
            <span>Chemistry with heart</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="font-medium">Science-first research</span>
          <span className="text-gray-300">|</span>
          <span className="font-medium text-emerald-800">100% pure botanical</span>
          <span className="text-gray-300">|</span>
          <span className="font-medium">Dermatologist tested</span>
          <span className="text-gray-300 hidden md:inline">|</span>
          <span className="font-medium text-amber-800 hidden md:inline">72H moisture lock</span>
          <span className="text-gray-300 hidden md:inline">|</span>
          <span className="font-medium hidden md:inline">Single-source apiary origin</span>
        </div>
      </div>

    </section>
  );
}
