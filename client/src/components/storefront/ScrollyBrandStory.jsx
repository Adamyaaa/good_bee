import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Search, FlaskConical, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const STORY_STEPS = [
  {
    step: '01',
    shortLabel: 'Mindful Sourcing',
    title: 'Mindful Botanical Sourcing',
    subtitle: 'Wild & Cultivated Harvest',
    icon: Leaf,
    image: '/images_ref/Rosmary-2-300x300.webp',
    protocolBadge: 'Origin Verification Protocol',
    description:
      'Every active botanical begins with uncompromised biological purity. We source wild-collected forest beeswax, cold-pressed raw seed oils, and botanical herbs from sustainable regional growers who harvest at peak nutrient maturity.',
    highlights: [
      '100% natural, unadulterated botanical raw matter',
      'Non-destructive cold-pressing and traditional slow infusions',
      'Pesticide-free and source-identified origin'
    ]
  },
  {
    step: '02',
    shortLabel: 'Active Isolation',
    title: 'Laboratory Active Isolation',
    subtitle: 'Cold Stabilization Without Thermal Loss',
    icon: Search,
    image: '/images_ref/Frankin-300x300.webp',
    protocolBadge: 'Thermolabile Stabilization Protocol',
    description:
      'Natural ingredients lose potency if heated arbitrarily. Good Bee utilizes low-temperature steam hydro-distillation and nitrogen-shielded extraction to isolate pure volatile terpenes without thermal denaturation.',
    highlights: [
      'High-purity terpene and active ester retention',
      'Zero synthetic solvents, mineral oils, or petrochemicals',
      'Gas-chromatography verified batch purity'
    ]
  },
  {
    step: '03',
    shortLabel: 'Cold-Cure Curing',
    title: 'Source-Identified Cold Process Curing',
    subtitle: '6-Week Cold Saponification & Pure Beeswax',
    icon: FlaskConical,
    image: '/images_ref/Clear-skin-300x300.webp',
    protocolBadge: 'Bio-Lipid Curing Protocol',
    description:
      'Say NO to chemical soap bathing. Our cold-processed soaps preserve 100% natural glycerin and skin-soothing unsaponifiables, cured gently over six weeks with pure forest beeswax and Himalayan Deodar essential oils.',
    highlights: [
      'Traditional cold-cure saponification preserving natural glycerin',
      'Free from chemical foaming agents, sulfates, and parabens',
      'Source-identified single origin ingredients'
    ]
  },
  {
    step: '04',
    shortLabel: 'Skin Ritual',
    title: 'The Skin Transformation Ritual',
    subtitle: 'Cellular Restoration & Lasting Radiance',
    icon: Sparkles,
    image: '/assets/goodbee-hero-model.jpg',
    protocolBadge: 'Dermal Assimilation Protocol',
    description:
      'The result is skincare that feels sensorial, calm, and transformative. Your skin barrier is replenished with genuine cellular nutrition, resulting in enduring clarity, moisture resilience, and healthy luminosity.',
    highlights: [
      'Visible replenishment of barrier integrity',
      'Lightweight, rapid absorption with non-greasy satin finish',
      'Pure ritual designed for daily AM & PM consistency'
    ]
  }
];

export default function ScrollyBrandStory() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Smooth auto-play through phases with option to pause
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STORY_STEPS.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const step = STORY_STEPS[activeStep];
  const Icon = step.icon;

  const handleNext = () => {
    setIsAutoPlay(false);
    setActiveStep((prev) => (prev + 1) % STORY_STEPS.length);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setActiveStep((prev) => (prev - 1 + STORY_STEPS.length) % STORY_STEPS.length);
  };

  return (
    <section id="scrolly-story" className="py-20 lg:py-24 bg-brand-cream/60 border-y border-brand-gold/25 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-brand-gold/20 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark block">
              Formulation Lifecycle
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
              The Pure Cycle: Nature Refined Through Research
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 max-w-xl">
              Follow how Good Bee transforms raw, wild-collected botanicals into clinically stabilized, pure cosmetic formulations.
            </p>
          </div>

          {/* Autoplay & Navigation Controls */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="p-2 rounded-full border border-brand-gold/30 bg-brand-ivory text-brand-charcoal hover:bg-brand-gold/20 transition-colors"
              title={isAutoPlay ? 'Pause auto-cycle' : 'Play auto-cycle'}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5 text-brand-gold-dark" /> : <Play className="w-3.5 h-3.5 text-brand-gold-dark" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-brand-gold/30 bg-brand-ivory text-brand-charcoal hover:bg-brand-gold/20 transition-colors"
              title="Previous Phase"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-brand-gold/30 bg-brand-ivory text-brand-charcoal hover:bg-brand-gold/20 transition-colors"
              title="Next Phase"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Phase Tabs Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {STORY_STEPS.map((s, idx) => {
            const StepIcon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => {
                  setIsAutoPlay(false);
                  setActiveStep(idx);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'bg-brand-charcoal text-brand-ivory border-brand-charcoal shadow-luxury -translate-y-0.5'
                    : 'bg-brand-ivory/80 border-brand-gold/25 text-brand-charcoal hover:bg-brand-cream hover:border-brand-gold/50'
                }`}
              >
                {/* Active Progress Bar Underlay */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold" />
                )}

                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? 'text-brand-gold-light' : 'text-brand-gold-dark'}`}>
                    Phase {s.step}
                  </span>
                  <StepIcon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-gold' : 'text-brand-muted'}`} />
                </div>
                <h4 className="font-serif text-sm font-semibold truncate">
                  {s.shortLabel}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Narrative & Visual Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-brand-ivory/70 rounded-3xl p-6 sm:p-10 border border-brand-gold/30 shadow-luxury">
          
          {/* Left Narrative Stage (Col 6) */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-brand-charcoal text-brand-gold shadow-md">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold-dark block">
                      Phase {step.step} of 04 • {step.protocolBadge}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-semibold leading-tight">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold-dark">
                  {step.subtitle}
                </p>

                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-sans">
                  {step.description}
                </p>

                {/* Highlights List */}
                <div className="pt-2 space-y-2.5">
                  {step.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-brand-charcoal font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stepper Footer Controls */}
            <div className="flex items-center justify-between pt-5 border-t border-brand-gold/20 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-brand-muted">Phase Progress:</span>
                <span className="font-bold text-brand-charcoal">{step.step} / 04</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 text-brand-charcoal hover:text-brand-gold-dark font-medium transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <span className="text-brand-gold/40">•</span>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 text-brand-gold-dark hover:text-brand-charcoal font-bold transition-colors"
                >
                  <span>Next Phase</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Visual Stage (Col 6) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full rounded-3xl overflow-hidden border-2 border-brand-gold/40 shadow-luxury bg-brand-cream aspect-[4/3] max-h-[460px]">
              
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={step.image}
                  alt={step.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/85 via-brand-charcoal/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-brand-ivory space-y-1.5 pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold-light font-bold">
                  Good Bee Protocol • Stage {step.step}
                </span>
                <p className="font-serif text-xl sm:text-2xl font-medium leading-snug">
                  {step.title}
                </p>
                <p className="text-xs text-brand-sand/90 font-light">
                  Standardized under Good Bee purity & active stabilization research specifications.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
