import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Play,
  ShieldCheck,
  Leaf,
  Award,
  Droplets,
  Truck,
  ShoppingBag,
  Eye,
  Check,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    headline: 'Nature, Stabilized.',
    description:
      'Small-batch cold-cured beeswax soaps, pure essential oils & botanical mists.',
    ctaPrimary: 'Shop Bestsellers',
    ctaPrimaryTarget: 'bestsellers',
    ctaSecondary: 'Build Routine',
    ctaSecondaryTarget: 'how-to-apply',
    image: '/assets/goodbee-skincare-hero.jpg',
    objectPosition: 'object-[right_center]',
    spotlightProduct: {
      id: 'gb_prod_donkey_milk_soap',
      title: 'Donkey Milk Cold Processed Soap',
      price: 380,
      mrp: 450,
      volume: '100 g',
      category: 'Cold Processed Soaps',
      image: '/images_ref/Donkey-Milk-Soap-300x300.webp'
    }
  },
  {
    id: 'slide-2',
    headline: 'Pure Botanical Drops.',
    description:
      'Steam-distilled single-origin oils for calm, resilient skin.',
    ctaPrimary: 'Explore Oils',
    ctaPrimaryTarget: 'bestsellers',
    ctaSecondary: 'By Concern',
    ctaSecondaryTarget: 'shop-by-concern',
    image: '/assets/goodbee-skincare-hero-2.jpg',
    objectPosition: 'object-[center_20%]',
    spotlightProduct: {
      id: 'gb_prod_frankincense',
      title: 'Frankincense Pure Essential Oil',
      price: 1450,
      mrp: 1750,
      volume: '15 ml',
      category: 'Pure Essential Oils',
      image: '/images_ref/Frankin-300x300.webp'
    }
  },
  {
    id: 'slide-3',
    headline: 'Zero Synthetics.',
    description:
      '100% natural glycerin, forest beeswax & slow botanical infusions.',
    ctaPrimary: 'Browse All',
    ctaPrimaryTarget: 'formulations',
    ctaSecondary: 'Key Botanicals',
    ctaSecondaryTarget: 'ingredients',
    image: '/assets/goodbee-hero-model.jpg',
    objectPosition: 'object-center',
    spotlightProduct: {
      id: 'gb_prod_pink_lip_balm',
      title: 'Tinted Pink Moisturizing Lip Balm',
      price: 349,
      mrp: 425,
      volume: '5 g',
      category: 'Lip & Facial Care',
      image: '/images_ref/Pink-Lotus-300x300.webp'
    }
  }
];

const TRUST_PILLARS = [
  { icon: ShieldCheck, label: '6-Week Cold Cured' },
  { icon: Leaf, label: '100% Natural Actives' },
  { icon: Award, label: 'Ayush & ISO 22716' },
  { icon: Droplets, label: 'Single-Origin Apiaries' },
  { icon: Truck, label: 'Free Shipping ₹999+' }
];

export default function Hero({ onExplore, onRoutine, onQuickViewProduct }) {
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [spotlightAdded, setSpotlightAdded] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const heroRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const backdropY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -(py * 4.5), ry: px * 4.5 });
  };
  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
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
    if (touchStartX.current - touchEndX.current > 50) handleNext();
    if (touchEndX.current - touchStartX.current > 50) handlePrev();
  };

  const slide = HERO_SLIDES[currentSlide];
  const spotlight = slide.spotlightProduct;

  const scrollToTarget = (targetId) => {
    if (targetId === 'how-to-apply' && onRoutine) {
      const el = document.getElementById('how-to-apply');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else onRoutine();
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = 110;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    } else if (onExplore) {
      onExplore();
    }
  };

  const handleAddSpotlight = (e) => {
    e.stopPropagation();
    const ok = addToCart(spotlight, 1);
    if (ok !== false) {
      setSpotlightAdded(true);
      setTimeout(() => setSpotlightAdded(false), 1600);
    }
  };

  return (
    <section ref={heroRef} id="hero" className="relative w-full max-w-full bg-[#FAF7F2] overflow-hidden select-none">
      {/* Main Split Editorial & Product-First Stage */}
      <div
        className="relative w-full min-h-[440px] lg:min-h-[500px] flex items-center py-6 sm:py-8 lg:py-10 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* High-Resolution Daylight Editorial Backdrop with Subtle Scroll Depth */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            style={{ y: backdropY, scale: backdropScale }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.55 }}
            className="absolute inset-0 z-0 pointer-events-none will-change-transform"
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className={`w-full h-full object-cover ${slide.objectPosition}`}
            />
            {/* High-Contrast Warm Ivory Scrim for Crisp Typography on Both Mobile & Desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/94 to-[#FAF7F2]/75 sm:via-[#FAF7F2]/90 sm:to-[#FAF7F2]/25" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF7F2] to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Foreground Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left 7 Cols: Value Proposition & Dual Conversion CTAs */}
            <div className="lg:col-span-7 min-w-0 space-y-4 sm:space-y-5 text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`copy-${slide.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.36 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif text-[#1A1918] font-medium tracking-[-0.02em] leading-[1.06]">
                    {slide.headline}
                  </h1>

                  <p className="text-sm sm:text-base text-[#2D2B29] font-sans leading-relaxed max-w-lg">
                    {slide.description}
                  </p>

                  {/* Dual Conversion CTAs */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToTarget(slide.ctaPrimaryTarget)}
                      className="px-5 sm:px-7 py-3 sm:py-3.5 bg-[#5B0868] hover:bg-[#480653] text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>{slide.ctaPrimary}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollToTarget(slide.ctaSecondaryTarget)}
                      className="px-5 sm:px-6 py-3 sm:py-3.5 bg-white/95 hover:bg-white text-[#1A1918] font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-xl border border-brand-gold/40 shadow-sm transition-all duration-150 hover:border-[#5B0868]/40 hover:-translate-y-0.5 active:scale-[0.97] inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>{slide.ctaSecondary}</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Clean Slide Controls */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-800 border border-brand-gold/30 flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
                  aria-label="Previous Hero Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {HERO_SLIDES.map((s, index) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        index === currentSlide
                          ? 'w-7 h-2 bg-[#5B0868]'
                          : 'w-2 h-2 bg-gray-400/70 hover:bg-gray-600'
                      }`}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-800 border border-brand-gold/30 flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
                  aria-label="Next Hero Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-700 border border-brand-gold/30 flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
                  title={isPaused ? 'Resume Carousel' : 'Pause Carousel'}
                  aria-label={isPaused ? 'Resume Carousel' : 'Pause Carousel'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Product-First Formulation Spotlight Card with Subtle 3D Pointer Tilt */}
            <div className="lg:col-span-5 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`spot-${slide.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, rotateX: tilt.rx, rotateY: tilt.ry }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={resetTilt}
                  style={{ transformPerspective: 900 }}
                  onClick={() => onQuickViewProduct && onQuickViewProduct(spotlight)}
                  className="w-full max-w-md mx-auto lg:ml-auto bg-white/92 backdrop-blur-xl rounded-3xl border border-white/80 ring-1 ring-brand-gold/30 shadow-luxury p-4 sm:p-5 cursor-pointer group hover:ring-[#5B0868]/40 transition-shadow will-change-transform"
                >
                  <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center pb-3.5">
                    <div className="col-span-5 min-w-0">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] border border-brand-gold/25 shadow-xs">
                        <img
                          src={spotlight.image}
                          alt={spotlight.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    <div className="col-span-7 min-w-0 space-y-1.5 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark block truncate">
                        {spotlight.category} • {spotlight.volume}
                      </span>
                      <h2 className="font-serif text-sm sm:text-lg font-semibold text-[#1A1918] leading-snug group-hover:text-[#5B0868] transition-colors">
                        {spotlight.title}
                      </h2>
                      <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 pt-1">
                        <span className="font-serif text-base sm:text-xl font-bold text-[#1A1918]">
                          ₹{spotlight.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{spotlight.mrp.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {Math.round(((spotlight.mrp - spotlight.price) / spotlight.mrp) * 100)}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2.5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleAddSpotlight}
                      className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer ${
                        spotlightAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#5B0868] hover:bg-[#480653] text-white shadow-sm'
                      }`}
                    >
                      {spotlightAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickViewProduct && onQuickViewProduct(spotlight);
                      }}
                      className="py-2.5 px-3 sm:px-3.5 rounded-xl bg-[#FAF7F2] hover:bg-purple-50 text-[#1A1918] hover:text-[#5B0868] border border-brand-gold/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors active:scale-[0.97] cursor-pointer flex-shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      {/* Compact Single-Row Trust Strip Directly Below Hero */}
      <div className="bg-white border-y border-brand-gold/20 py-3 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {TRUST_PILLARS.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={pillar.label}
                className={`flex items-center gap-2 justify-start sm:justify-center ${
                  idx === 4 ? 'col-span-2 sm:col-span-1 justify-center' : ''
                }`}
              >
                <IconComp className="w-4 h-4 text-[#5B0868] flex-shrink-0" />
                <span className="text-xs font-serif font-semibold text-[#1A1918]">
                  {pillar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
