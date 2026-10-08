import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Droplets, FlaskConical, ShieldCheck } from 'lucide-react';

export default function Hero({ onExplore, onRoutine }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Parallax layers
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const bgGlowY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const beeFlightX = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const beeFlightY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const badgeParallax = useTransform(scrollYProgress, [0, 1], [0, -35]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative overflow-hidden bg-brand-ivory pt-8 pb-24 lg:pt-16 lg:pb-32"
    >
      {/* Background Parallax Soft Glows */}
      <motion.div
        style={{ y: bgGlowY }}
        className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-gold/15 rounded-full blur-3xl pointer-events-none"
      />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-cream/90 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Animated Bee Motif with Scroll-linked Flight Path */}
      <motion.div
        style={{ x: beeFlightX, y: beeFlightY }}
        className="absolute top-10 right-20 hidden lg:block opacity-60 pointer-events-none z-20"
      >
        <div className="relative">
          <svg width="240" height="130" viewBox="0 0 240 130" fill="none">
            <path
              d="M10,95 C70,25 140,120 200,45"
              stroke="#C5A880"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
          <motion.img
            src="/assets/good-bee-logo.png"
            alt="Bee Motif"
            className="w-10 h-10 rounded-full absolute -top-1 right-8 shadow-sm"
            animate={{ y: [0, -4, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Copy with Parallax */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8 text-center lg:text-left"
          >
            {/* Positioning Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-gold/30 text-xs uppercase tracking-widest text-brand-gold-dark font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              100% Natural Skincare • Research-Driven Formulation
            </div>

            {/* Major Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-charcoal font-medium leading-[1.12] tracking-tight">
              Nature, Refined <br className="hidden sm:inline" />
              Through <span className="italic font-normal text-brand-gold-dark">Research.</span>
            </h1>

            {/* Positioning Paragraph */}
            <p className="text-base sm:text-lg text-brand-charcoal/80 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
              Good Bee develops 100% natural skincare formulations created after high-end botanical and active-stabilization research. We harmonize raw biological potency with clean laboratory precision to restore your skin barrier.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-8 py-4 bg-brand-charcoal text-brand-ivory text-xs font-semibold tracking-widest uppercase rounded-full hover:bg-brand-gold-dark transition-all duration-300 shadow-luxury flex items-center justify-center gap-3 group"
              >
                <span>Explore Formulations</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onRoutine}
                className="w-full sm:w-auto px-8 py-4 bg-transparent text-brand-charcoal text-xs font-semibold tracking-widest uppercase rounded-full border border-brand-gold/50 hover:bg-brand-cream transition-all duration-300 flex items-center justify-center"
              >
                Diagnostic Concerns
              </button>
            </div>

            {/* Trust Standard Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-brand-gold/20 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-brand-gold-dark">
                  <Droplets className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">100% Natural</span>
                </div>
                <p className="text-[11px] text-brand-muted">Zero artificial synthetics</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-brand-gold-dark">
                  <FlaskConical className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">High-End Research</span>
                </div>
                <p className="text-[11px] text-brand-muted">Active stabilization</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-brand-gold-dark">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Batch Traceable</span>
                </div>
                <p className="text-[11px] text-brand-muted">Verified pure origins</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-brand-gold-dark">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Mindful Craft</span>
                </div>
                <p className="text-[11px] text-brand-muted">Ethical partner network</p>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Hero Visual Product Display with Parallax Float */}
          <div className="lg:col-span-5 relative">
            <motion.div
              style={{ y: imageY }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Outer Elegant Frame */}
              <div className="relative rounded-3xl overflow-hidden border border-brand-gold/30 shadow-luxury bg-brand-cream p-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-brand-sand/30">
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85"
                    alt="Good Bee Golden Royal Propolis Serum"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent" />

                  {/* Floating Product Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-brand-ivory/95 backdrop-blur-md p-4 rounded-xl border border-brand-gold/30 shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold-dark block">
                        Flagship Formulation
                      </span>
                      <h4 className="font-serif text-base text-brand-charcoal font-semibold">
                        Golden Royal Propolis Nectar
                      </h4>
                      <p className="text-xs text-brand-muted">Bio-Fermented Honey & Plant Squalane</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-brand-charcoal block">₹1,890</span>
                      <span className="text-[10px] text-emerald-800 font-medium">In Stock</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Parallax Floating Gold Medal Badge */}
              <motion.div
                style={{ y: badgeParallax }}
                className="absolute -top-4 -left-4 bg-brand-ivory rounded-full p-2 border border-brand-gold/40 shadow-luxury hidden sm:flex items-center gap-2 z-20"
              >
                <img
                  src="/assets/good-bee-logo.png"
                  alt="Good Bee Emblem"
                  className="w-8 h-8 rounded-full"
                />
                <div className="pr-3 text-left">
                  <p className="text-[10px] font-bold text-brand-charcoal uppercase tracking-wider">Good Bee Standard</p>
                  <p className="text-[9px] text-brand-muted">100% Pure Origin</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
