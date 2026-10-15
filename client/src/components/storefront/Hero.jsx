import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Droplets, FlaskConical, ShieldCheck, Sparkles, Pause, Play } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    badge: '100% NATURAL • HIGH-END RESEARCH',
    title: 'NATURE X RESEARCH',
    highlightWord: 'RESEARCH',
    subtitle: 'Where raw botanical bio-actives meet laboratory active-stabilization for deep cellular glow.',
    ctaText: 'SHOP NOW',
    ctaAction: 'explore',
    image: '/assets/goodbee-hero-model.jpg',
    objectPosition: 'object-[center_28%]',
    accentColor: 'text-amber-300'
  },
  {
    id: 'slide-2',
    badge: 'COLD-CURED FOR 6 WEEKS • ZERO SULPHATES',
    title: 'KASHMIR SAFFRON X DONKEY MILK',
    highlightWord: 'DONKEY MILK',
    subtitle: 'The silk cold-lather ritual with raw Kashmir saffron stigmas for intensive barrier renewal.',
    ctaText: 'SHOP COLD-PROCESS',
    ctaAction: 'explore',
    image: '/images_ref/Donkey-Milk-Soap-300x300.webp',
    objectPosition: 'object-center',
    accentColor: 'text-amber-200'
  },
  {
    id: 'slide-3',
    badge: 'CLINICAL DERMA-ACTIVE COMPLEX',
    title: '48H BREAKOUT RESET',
    highlightWord: 'BREAKOUT RESET',
    subtitle: 'Zero comedogenic oils. Pure neem, frankincense, and botanical hydrosols to soothe redness.',
    ctaText: 'SHOP BY CONCERN',
    ctaAction: 'concern',
    image: '/images_ref/Clear-skin-300x300.webp',
    objectPosition: 'object-center',
    accentColor: 'text-emerald-300'
  },
  {
    id: 'slide-4',
    badge: 'WILD HARVESTED • FIRST STEAM DISTILLATION',
    title: 'SACRED LOTUS & OILS',
    highlightWord: 'OILS',
    subtitle: 'Single-batch artisanal extractions preserving volatile terpenes and pure biological flavonoids.',
    ctaText: 'EXPLORE BOTANICALS',
    ctaAction: 'explore',
    image: '/images_ref/Pink-Lotus-300x300.webp',
    objectPosition: 'object-center',
    accentColor: 'text-rose-200'
  }
];

export default function Hero({ onExplore, onRoutine }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-advance slides every 5.5 seconds (paused on hover)
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

  const handleCtaClick = (action) => {
    if (action === 'concern') {
      onRoutine?.();
    } else {
      onExplore?.();
    }
  };

  return (
    <section id="hero" className="relative w-full bg-brand-charcoal overflow-hidden select-none">
      
      {/* 1. Full-Bleed Bonkers-Style Cinematic Carousel Container */}
      <div
        className="relative w-full min-h-[88vh] sm:min-h-[92vh] lg:min-h-[98vh] flex items-center justify-center pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 overflow-hidden"
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
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            {/* Background Media Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover ${slide.objectPosition} filter brightness-[0.78] contrast-[1.08]`}
            />

            {/* Bonkers Moody Dark Vignette Overlays for Maximum Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Desktop Left/Right Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/40 hover:bg-slate-950/80 backdrop-blur-md text-white border border-white/20 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group shadow-2xl"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-white/80 group-hover:text-white" />
        </button>

        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/40 hover:bg-slate-950/80 backdrop-blur-md text-white border border-white/20 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group shadow-2xl"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-white/80 group-hover:text-white" />
        </button>

        {/* 2. Bonkers-Style Centered Hero Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 sm:space-y-4"
            >
              {/* Category / Collection Tag Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-amber-300 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>{slide.badge}</span>
              </div>

              {/* Bold Bonkers Headline (Big, Impactful, Uppercase) */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black tracking-wider text-white uppercase drop-shadow-2xl leading-tight">
                {slide.title}
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-xs sm:text-sm lg:text-base text-gray-200 font-light max-w-xl mx-auto leading-relaxed drop-shadow font-sans">
                {slide.subtitle}
              </p>

              {/* Iconic Bonkers White Rounded Pill CTA Button */}
              <div className="pt-2 sm:pt-4 flex justify-center">
                <button
                  onClick={() => handleCtaClick(slide.ctaAction)}
                  className="px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-slate-950 font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.22em] rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.5)] hover:bg-amber-400 hover:text-slate-950 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 3. Bonkers-Style Bottom Slide Indicator Dots */}
          <div className="pt-4 sm:pt-6 flex items-center justify-center gap-2.5">
            {HERO_SLIDES.map((s, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full focus:outline-none ${
                    isActive
                      ? 'w-8 h-2 bg-white shadow-lg'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Small Discreet Pause/Play indicator in corner */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white/70 hover:text-white text-xs border border-white/10 transition-colors"
          title={isPaused ? 'Resume Carousel' : 'Pause Carousel'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 4. Luxury Botanical Trust Strip Directly Below Carousel */}
      <div className="bg-brand-ivory border-t border-b border-brand-gold/25 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-brand-charcoal">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-cream border border-brand-gold/30 text-brand-gold flex-shrink-0">
              <Droplets className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                100% Pure Botanical
              </h4>
              <p className="text-[11px] text-brand-muted">Zero artificial synthetics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-cream border border-brand-gold/30 text-brand-gold flex-shrink-0">
              <FlaskConical className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                High-End Research
              </h4>
              <p className="text-[11px] text-brand-muted">Active enzyme stabilization</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-cream border border-brand-gold/30 text-brand-gold flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                Batch Traceable
              </h4>
              <p className="text-[11px] text-brand-muted">Single-source apiary origins</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-cream border border-brand-gold/30 text-brand-gold flex-shrink-0">
              <Sparkles className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                Ethical Craft
              </h4>
              <p className="text-[11px] text-brand-muted">Fair farmer-partner trade</p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
