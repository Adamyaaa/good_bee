import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Droplets, 
  FlaskConical, 
  ShieldCheck, 
  Sparkles, 
  Pause, 
  Play,
  Sun,
  Award,
  Zap
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    badge: '✨ AI BIO-ACTIVE STABILIZATION • GLASS SKIN',
    headlinePrefix: 'THE HONEY-GLAZE',
    headlineMain: 'GLASS SKIN RITUAL',
    subtitle: 'Where 100% raw bee propolis meets cold active-stabilization research for lasting, dewy radiance.',
    ctaPrimary: 'SEE HOW TO APPLY',
    ctaPrimaryAction: 'routine',
    ctaSecondary: 'SHOP BESTSELLERS',
    ctaSecondaryAction: 'explore',
    image: '/assets/goodbee-hero-model.jpg',
    objectPosition: 'object-[center_28%]',
    glowColor: 'from-amber-400/30 via-rose-300/20 to-transparent',
    pillBg: 'bg-amber-500/10 border-amber-500/30 text-amber-900',
    statBadge: '💧 +72H Hydration Glaze'
  },
  {
    id: 'slide-2',
    badge: '🌿 COLD-CURED 6 WEEKS • DONKEY MILK CERAMIDES',
    headlinePrefix: 'PURE BOTANICAL',
    headlineMain: 'BARRIER RECOVERY',
    subtitle: 'Gentle retinol-analogous milk ceramides and Kashmir saffron to soothe burning, sensitized skin barriers.',
    ctaPrimary: 'EXPLORE PM REPAIR',
    ctaPrimaryAction: 'routine',
    ctaSecondary: 'DISCOVER SOAPS',
    ctaSecondaryAction: 'explore',
    image: '/images_ref/Donkey-Milk-Soap-300x300.webp',
    objectPosition: 'object-center',
    glowColor: 'from-orange-300/30 via-amber-200/20 to-transparent',
    pillBg: 'bg-orange-500/10 border-orange-500/30 text-orange-950',
    statBadge: '🛡️ 99.8% Dermal Lipid Seal'
  },
  {
    id: 'slide-3',
    badge: '⚡ 48H PORE RESET • ZERO COMEDOGENIC OILS',
    headlinePrefix: 'COLD-PRESSED NEEM',
    headlineMain: 'BREAKOUT CLEARANCE',
    subtitle: 'Microbiome-friendly eucalyptus terpenes and wild neem to dissolve follicular sebum without post-acne scars.',
    ctaPrimary: 'VIEW ACNE REGIMEN',
    ctaPrimaryAction: 'routine',
    ctaSecondary: 'SHOP CLEAR SKIN',
    ctaSecondaryAction: 'explore',
    image: '/images_ref/Clear-skin-300x300.webp',
    objectPosition: 'object-center',
    glowColor: 'from-emerald-300/30 via-teal-200/20 to-transparent',
    pillBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950',
    statBadge: '🌿 Calms Redness in 24h'
  },
  {
    id: 'slide-4',
    badge: '🌸 SINGLE-BATCH HYDRO-DISTILLATION • LOTUS & ROSE',
    headlinePrefix: 'MICRO-DEW CELLULAR',
    headlineMain: 'SACRED LOTUS GLOW',
    subtitle: 'First steam-distilled floral hydrosols packed with botanical flavonoids for immediate pore tightening.',
    ctaPrimary: 'VIEW MIST ROUTINE',
    ctaPrimaryAction: 'routine',
    ctaSecondary: 'EXPLORE FLORALS',
    ctaSecondaryAction: 'explore',
    image: '/images_ref/Pink-Lotus-300x300.webp',
    objectPosition: 'object-center',
    glowColor: 'from-rose-300/30 via-pink-200/20 to-transparent',
    pillBg: 'bg-rose-500/10 border-rose-500/30 text-rose-950',
    statBadge: '✨ 100% Steam Distilled'
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
    <section id="hero" className="relative w-full bg-gradient-to-b from-amber-50/70 via-rose-50/30 to-white overflow-hidden select-none">
      
      {/* 1. Luminous Ambient Cosmetic Lighting (Dot & Key / Plum Inspired) */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[400px] bg-gradient-to-br from-amber-200/40 via-rose-200/30 to-orange-100/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-[500px] h-[450px] bg-gradient-to-bl from-rose-200/35 via-pink-100/30 to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Main Full-Bleed Luminous Stage */}
      <div
        className="relative w-full min-h-[90vh] sm:min-h-[94vh] lg:min-h-[96vh] flex items-center justify-center pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Animated Background Media Slides with Bright Cosmetic Tones */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            {/* Background Media Image with High-Key, Clean Contrast */}
            <img
              src={slide.image}
              alt={slide.headlineMain}
              className={`w-full h-full object-cover ${slide.objectPosition} filter brightness-[1.03] contrast-[1.02]`}
            />

            {/* Bright, Luminous Cosmetic Gradient Overlays for Razor-Sharp Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/30" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Desktop Left/Right Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-brand-charcoal border border-brand-gold/30 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group shadow-lg cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-brand-charcoal/80 group-hover:text-brand-charcoal" />
        </button>

        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-brand-charcoal border border-brand-gold/30 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group shadow-lg cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-brand-charcoal/80 group-hover:text-brand-charcoal" />
        </button>

        {/* 2. Hero Content Stage (Bright, Fresh Cosmetic Brand Layout) */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 sm:space-y-5"
            >
              {/* Category / Collection Tag Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-amber-900 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{slide.badge}</span>
              </div>

              {/* Fresh, High-Energy Cosmetic Headline */}
              <div className="space-y-1">
                <span className="block text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-amber-700">
                  {slide.headlinePrefix}
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold tracking-tight text-brand-charcoal leading-[1.12]">
                  {slide.headlineMain}
                </h1>
              </div>

              {/* Luminous Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-brand-charcoal/80 max-w-2xl mx-auto font-sans leading-relaxed font-normal">
                {slide.subtitle}
              </p>

              {/* Floating Benefit Tag */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 border border-emerald-300/80 text-emerald-900 text-xs font-bold shadow-sm">
                  {slide.statBadge}
                </span>
              </div>

              {/* Dual Bright Cosmetic CTA Buttons */}
              <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                {/* Primary CTA: "See How to Apply" */}
                <button
                  onClick={() => handleAction(slide.ctaPrimaryAction)}
                  className="w-full sm:w-auto px-8 sm:px-9 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.18em] rounded-full shadow-[0_10px_25px_rgba(245,158,11,0.35)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{slide.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Secondary CTA: "Shop Bestsellers" */}
                <button
                  onClick={() => handleAction(slide.ctaSecondaryAction)}
                  className="w-full sm:w-auto px-7 sm:px-8 py-3.5 bg-white/90 hover:bg-white text-brand-charcoal font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.16em] rounded-full border border-brand-gold/40 hover:border-brand-gold shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{slide.ctaSecondary}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 3. Bottom Slide Indicator Dots */}
          <div className="pt-4 sm:pt-6 flex items-center justify-center gap-2.5">
            {HERO_SLIDES.map((s, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full focus:outline-none cursor-pointer ${
                    isActive
                      ? 'w-8 h-2.5 bg-amber-500 shadow-md'
                      : 'w-2.5 h-2.5 bg-brand-gold/40 hover:bg-amber-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Small Discreet Pause/Play indicator */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-white/70 hover:bg-white backdrop-blur-md text-brand-charcoal text-xs border border-brand-gold/30 shadow-sm transition-colors cursor-pointer"
          title={isPaused ? 'Resume Carousel' : 'Pause Carousel'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 4. Bright Cosmetic Trust Strip (Plum & Dot & Key Style) */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-rose-50/90 border-t border-b border-amber-200/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-brand-charcoal">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300/60 flex-shrink-0 shadow-sm">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                100% Pure Botanical
              </h4>
              <p className="text-[11px] text-brand-muted">Zero artificial synthetics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-800 border border-rose-300/60 flex-shrink-0 shadow-sm">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                AI Active Stabilization
              </h4>
              <p className="text-[11px] text-brand-muted">Enzyme & lipid retention</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300/60 flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                Dermatologist Tested
              </h4>
              <p className="text-[11px] text-brand-muted">Non-comedogenic & gentle</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-800 border border-orange-300/60 flex-shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                Visible Dewy Glaze
              </h4>
              <p className="text-[11px] text-brand-muted">Poreless, radiant bounce</p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
