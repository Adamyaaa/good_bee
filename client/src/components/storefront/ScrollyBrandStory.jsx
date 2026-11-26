import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Search, FlaskConical, Sun, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const STORY_STEPS = [
  {
    step: '01',
    shortLabel: 'Mindful Sourcing',
    title: 'Single-Origin Botanicals',
    icon: Leaf,
    image: '/images_ref/Rosmary-2-300x300.webp',
    description:
      'Wild forest beeswax, cold-pressed oils, and herbs harvested at peak maturity.'
  },
  {
    step: '02',
    shortLabel: 'Active Isolation',
    title: 'Low-Temperature Extraction',
    icon: Search,
    image: '/images_ref/Frankin-300x300.webp',
    description:
      'Steam hydro-distillation preserves active terpenes with zero synthetic solvents.'
  },
  {
    step: '03',
    shortLabel: 'Cold-Cure Aging',
    title: '6-Week Cold-Processed Bars',
    icon: FlaskConical,
    image: '/images_ref/Clear-skin-300x300.webp',
    description:
      'Retains 100% natural glycerin—never stripped by sulfates or artificial foamers.'
  },
  {
    step: '04',
    shortLabel: 'Skin Ritual',
    title: 'Daily Barrier Radiance',
    icon: Sun,
    image: '/assets/goodbee-craft-lifestyle.jpg',
    description:
      'Weightless absorption that restores barrier bounce AM and PM.'
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
    <section id="scrolly-story" className="py-10 sm:py-14 bg-white border-b border-brand-gold/20 relative overflow-hidden scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Clean Top Header */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1918] font-medium">
            Our Craft
          </h2>

          <div className="flex items-center gap-2">
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
              title="Previous Stage"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-full border border-brand-gold/30 bg-[#FAF7F2] text-gray-800 hover:bg-purple-50 hover:text-[#5B0868] transition-colors cursor-pointer"
              title="Next Stage"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Stage Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
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
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-[#5B0868] text-white border-[#5B0868] shadow-sm'
                    : 'bg-[#FAF7F2] border-brand-gold/25 text-[#1A1918] hover:bg-purple-50/60'
                }`}
              >
                <StepIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-300' : 'text-[#5B0868]'}`} />
                <span className="font-serif text-xs sm:text-sm font-semibold truncate">{s.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Stage Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#FAF7F2] rounded-3xl p-5 sm:p-7 border border-brand-gold/25">
          <div className="md:col-span-7 space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="space-y-2.5"
              >
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B0868]">
                  <Icon className="w-4 h-4" />
                  <span>Step {step.step} / 04</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#1A1918] font-medium">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed max-w-xl">
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-[260px] bg-white rounded-2xl p-2.5 border border-brand-gold/25 shadow-sm">
              <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F2]">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
