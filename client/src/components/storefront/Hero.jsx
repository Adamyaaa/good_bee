import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Droplets, FlaskConical, ShieldCheck, Heart } from 'lucide-react';

export default function Hero({ onExplore, onRoutine }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Smooth parallax layer transformations
  const textY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const modelY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const bgGlowY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const floatingCardY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-brand-ivory pt-4 pb-20 lg:pt-8 lg:pb-28"
    >
      {/* 1. Large High-Fashion Radiant Skincare Model — Seamless Blending Layer */}
      <motion.div
        style={{ y: modelY }}
        className="absolute inset-y-0 right-0 w-full lg:w-3/5 pointer-events-none select-none z-0 overflow-hidden"
      >
        {/* Model Portrait Image */}
        <img
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1800&q=88"
          alt="Good Bee Radiant Natural Skincare Model"
          className="w-full h-full object-cover object-[center_20%] lg:object-[center_15%] filter brightness-[1.02] contrast-[1.01]"
        />

        {/* Seamless Blending Masks & Gradient Overlays */}
        {/* Top Blend: Fades into the top navbar */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-ivory via-brand-ivory/70 to-transparent" />

        {/* Left Blend: Dissolves the image into the warm ivory editorial text area */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-3/4 bg-gradient-to-r from-brand-ivory via-brand-ivory/85 via-brand-ivory/40 to-transparent" />

        {/* Bottom Blend: Melts seamlessly into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-brand-ivory via-brand-ivory/90 to-transparent" />

        {/* Ambient Warm Champagne Glow behind the model */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl mix-blend-multiply" />
      </motion.div>

      {/* 2. Ambient Atmosphere & Floating Flight Trail */}
      <motion.div
        style={{ y: bgGlowY }}
        className="absolute -top-24 left-1/4 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Editorial Headline, Positioning & Actions (Col 7) */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8 text-center lg:text-left pt-6 lg:pt-0"
          >
            {/* Positioning Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-cream/90 backdrop-blur-md border border-brand-gold/40 text-[10px] uppercase tracking-[0.25em] text-brand-gold-dark font-medium shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              100% Natural Skincare • Research-Driven Formulation
            </div>

            {/* Major Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.2rem] text-brand-charcoal font-normal leading-[1.08] tracking-tight">
              Nature, Refined <br />
              Through <span className="font-editorial italic font-normal text-brand-gold-dark">Research.</span>
            </h1>

            {/* Brand Positioning Copy */}
            <p className="text-base sm:text-lg text-brand-charcoal/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans tracking-wide">
              Good Bee develops 100% natural skincare formulations created after high-end botanical and active-stabilization research. We harmonize raw biological potency with clean laboratory precision to restore your skin barrier to luminous health.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-8 py-4 bg-brand-charcoal text-brand-ivory text-[11px] font-medium tracking-[0.22em] uppercase rounded-full hover:bg-brand-gold-dark transition-all duration-300 shadow-luxury flex items-center justify-center gap-3 group"
              >
                <span>Explore Formulations</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onRoutine}
                className="w-full sm:w-auto px-8 py-4 bg-brand-ivory/80 backdrop-blur-md text-brand-charcoal text-[11px] font-medium tracking-[0.22em] uppercase rounded-full border border-brand-gold/60 hover:bg-brand-cream transition-all duration-300 flex items-center justify-center"
              >
                Diagnostic Concerns
              </button>
            </div>

            {/* Trust Standard Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-brand-gold/25 text-left">
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

          {/* Right Column: Floating Luxury Formulation Badge & Bee Motif (Col 5) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex flex-col items-center lg:items-end justify-center">
            
            {/* Floating Glassmorphic Product Card Layer */}
            <motion.div
              style={{ y: floatingCardY }}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-xs sm:max-w-sm w-full bg-brand-ivory/90 backdrop-blur-xl p-5 rounded-3xl border border-brand-gold/40 shadow-2xl space-y-4"
            >
              {/* Product Preview Thumbnail & Tag */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-brand-sand/40 border border-brand-gold/30 flex-shrink-0 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80"
                    alt="Golden Royal Propolis Restorative Nectar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold-dark block">
                    Flagship Formulation
                  </span>
                  <h4 className="font-serif text-base font-semibold text-brand-charcoal leading-tight">
                    Golden Royal Propolis Nectar
                  </h4>
                  <p className="text-[11px] text-brand-muted mt-0.5">Bio-Fermented Honey & Plant Squalane</p>
                </div>
              </div>

              {/* Research Metric Pill */}
              <div className="p-3 bg-brand-cream/80 rounded-2xl border border-brand-gold/25 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-muted block">Cellular Hydration Index</span>
                  <span className="font-serif text-sm font-bold text-brand-charcoal">+94% Lipid Restoration</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-muted block">Direct Price</span>
                  <span className="font-bold text-brand-charcoal">₹1,890</span>
                </div>
              </div>

              {/* Verified Purity Seal with Bee Emblem */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-brand-charcoal font-medium">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/good-bee-logo.png"
                    alt="Good Bee Seal"
                    className="w-6 h-6 rounded-full"
                  />
                  <span>100% Pure Botanical Origin</span>
                </div>
                <span className="text-emerald-800 text-[10px] font-bold uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Batch Verified
                </span>
              </div>
            </motion.div>

            {/* Floating Gold Emblem Badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 bg-brand-ivory/95 backdrop-blur-md rounded-full border border-brand-gold/50 shadow-luxury"
            >
              <img
                src="/assets/good-bee-logo.png"
                alt="Good Bee Emblem"
                className="w-7 h-7 rounded-full shadow-sm"
              />
              <div className="text-left pr-1">
                <span className="text-[10px] font-bold text-brand-charcoal uppercase tracking-wider block">
                  Artisanal Research Standard
                </span>
                <span className="text-[9px] text-brand-gold-dark font-medium block">
                  Cold-Stabilized Bio-Actives
                </span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
