import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Search, FlaskConical, Sun, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const STORY_STEPS = [
  {
    step: '01',
    shortLabel: 'Mindful Sourcing',
    title: 'Mindful Botanical Sourcing',
    subtitle: 'Wild & Cultivated Harvest',
    icon: Leaf,
    image: '/images_ref/Rosmary-2-300x300.webp',
    isSquareAsset: true,
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
    isSquareAsset: true,
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
    isSquareAsset: true,
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
    icon: Sun,
    image: '/assets/goodbee-hero-model.jpg',
    isSquareAsset: false,
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
    <section id="scrolly-story" className="py-16 lg:py-20 bg-white border-y border-brand-gold/20 relative overflow-hidden scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-brand-gold/20 gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[10px] font-bold uppercase tracking-widest text-[#5B0868]">
              Formulation Lifecycle
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1918] font-medium">
              The Pure Cycle: Nature Refined Through Research
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Follow how Good Bee transforms wild-collected botanicals into cold-stabilized, batch-verified formulations.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              type="button"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="p-2 rounded-full border border-brand-gold/30 bg-[#FAF7F2] text-[#5B0868] hover:bg-purple-50 transition-colors cursor-pointer"
              title={isAutoPlay ? 'Pause auto-cycle' : 'Play auto-cycle'}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-full border border-brand-gold/30 bg-[#FAF7F2] text-gray-800 hover:bg-purple-50 hover:text-[#5B0868] transition-colors cursor-pointer"
              title="Previous Phase"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-full border border-brand-gold/30 bg-[#FAF7F2] text-gray-800 hover:bg-purple-50 hover:text-[#5B0868] transition-colors cursor-pointer"
              title="Next Phase"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Phase Tabs Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {STORY_STEPS.map((s, idx) => {
            const StepIcon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  setIsAutoPlay(false);
                  setActiveStep(idx);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  isActive
                    ? 'bg-[#5B0868] text-white border-[#5B0868] shadow-md -translate-y-0.5'
                    : 'bg-[#FAF7F2] border-brand-gold/25 text-[#1A1918] hover:bg-purple-50/60 hover:border-[#5B0868]/35'
                }`}
              >
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold" />
                )}

                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? 'text-amber-200' : 'text-[#5B0868]'}`}>
                    Phase {s.step}
                  </span>
                  <StepIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-brand-gold-dark'}`} />
                </div>
                <h4 className="font-serif text-sm font-semibold truncate">
                  {s.shortLabel}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Narrative & Framed Visual Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 lg:p-10 border border-brand-gold/25 shadow-sm">
          
          {/* Left Narrative Stage */}
          <div className="lg:col-span-7 space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-[#5B0868] text-white shadow-sm">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B0868] block">
                      Phase {step.step} of 04 • {step.protocolBadge}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#1A1918] font-semibold leading-tight">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
                  {step.subtitle}
                </p>

                <p className="text-sm text-gray-700 leading-relaxed font-sans">
                  {step.description}
                </p>

                <div className="pt-1 space-y-2">
                  {step.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#1A1918] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between pt-4 border-t border-brand-gold/20 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Phase Progress:</span>
                <span className="font-bold text-[#1A1918]">{step.step} / 04</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 text-gray-700 hover:text-[#5B0868] font-medium transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <span className="text-brand-gold/50">•</span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 text-[#5B0868] hover:text-[#480653] font-bold transition-colors cursor-pointer"
                >
                  <span>Next Phase</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Framed Visual Stage (No Low-Res Stretch) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-[380px] bg-white rounded-3xl p-3 border border-brand-gold/30 shadow-luxury">
              <div className="relative w-full rounded-2xl overflow-hidden bg-[#FAF7F2] aspect-square">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeStep}
                    src={step.image}
                    alt={step.title}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/80 via-[#1A1918]/15 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1 pointer-events-none">
                  <span className="text-[10px] uppercase tracking-widest text-amber-200 font-bold block">
                    Good Bee Protocol • Stage {step.step}
                  </span>
                  <p className="font-serif text-lg font-medium leading-snug">
                    {step.title}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
