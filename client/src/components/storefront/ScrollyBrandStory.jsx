import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Search, FlaskConical, Sparkles, CheckCircle2, ArrowDown } from 'lucide-react';

const STORY_STEPS = [
  {
    step: '01',
    title: 'Mindful Botanical Sourcing',
    subtitle: 'Wild & Cultivated Harvest',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    description:
      'Every active botanical begins with uncompromised biological purity. We source wild-collected forest bee propolis, floral extracts, and botanical oils from sustainable regional growers who harvest at peak nutrient maturity.',
    highlights: [
      '100% natural, unadulterated botanical raw matter',
      'Non-destructive cold-milling and artisanal extraction',
      'Pesticide-free and pesticide-tested origin'
    ]
  },
  {
    step: '02',
    title: 'Laboratory Active Isolation',
    subtitle: 'Cold Stabilization Without Thermal Loss',
    icon: Search,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    description:
      'Natural ingredients lose potency if heated arbitrarily. Our laboratory partners utilize subcritical and nitrogen-shielded extraction to isolate bio-flavonoids, sterols, and antioxidants without thermal denaturation.',
    highlights: [
      'High-purity flavonoid and lipid retention',
      'Zero synthetic solvents or petrochemical remnants',
      'Standardized compound concentration per batch'
    ]
  },
  {
    step: '03',
    title: 'Biomimetic Formulation Science',
    subtitle: 'Harmonized With the Human Skin Barrier',
    icon: FlaskConical,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
    description:
      'We research how botanical actives integrate with the human stratum corneum. Formulations are engineered using lamellar lipid structures so actives penetrate deeply rather than sitting occlusively on the surface.',
    highlights: [
      'Lamellar emulsification matching skin lipid bilayer',
      'Natural preservative systems derived from fermented lactobacillus',
      'pH balanced (4.8 - 5.5) to protect beneficial cutaneous microbiome'
    ]
  },
  {
    step: '04',
    title: 'The Skin Transformation Ritual',
    subtitle: 'Cellular Restoration & Lasting Radiance',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1512290900672-1f55b935b460?auto=format&fit=crop&w=1000&q=80',
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
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const [activeStep, setActiveStep] = useState(0);

  // Link scroll progress to active step
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      if (latest < 0.28) setActiveStep(0);
      else if (latest < 0.55) setActiveStep(1);
      else if (latest < 0.82) setActiveStep(2);
      else setActiveStep(3);
    });
  }, [scrollYProgress]);

  const step = STORY_STEPS[activeStep];
  const Icon = step.icon;

  return (
    <section
      ref={containerRef}
      id="scrolly-story"
      className="relative bg-brand-cream/60 border-y border-brand-gold/25"
      style={{ height: '320vh' }} // Generous scroll runway for pinned scrollytelling
    >
      {/* Pinned Sticky Viewport Container */}
      <div className="sticky top-20 h-[calc(100vh-80px)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Section Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-brand-gold/20">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark block">
              Scroll-Driven Formulation Lifecycle
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-brand-charcoal font-medium mt-1">
              The Pure Cycle: Nature Refined Through Research
            </h2>
          </div>

          {/* Interactive Step Switcher & Scroll Guide */}
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <span className="text-[11px] text-brand-muted uppercase font-bold tracking-wider mr-2 hidden md:inline">
              Scroll To Traverse:
            </span>
            {STORY_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  activeStep === idx
                    ? 'bg-brand-charcoal text-brand-ivory shadow-md scale-110'
                    : 'bg-brand-ivory border border-brand-gold/30 text-brand-charcoal hover:bg-brand-gold/20'
                }`}
              >
                {s.step}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Scrollytelling Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 max-h-[580px]">
          
          {/* Left Narrative Stage (Col 6) */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-brand-charcoal text-brand-gold shadow-sm">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
                    Phase {step.step} of 04
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-semibold">
                    {step.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold-dark">
                {step.subtitle}
              </p>

              <p className="text-sm sm:text-base text-brand-charcoal/80 leading-relaxed font-sans">
                {step.description}
              </p>

              {/* Highlights List */}
              <div className="pt-2 space-y-2">
                {step.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-brand-charcoal font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Scroll Indicator helper */}
            <div className="flex items-center gap-2 text-[11px] text-brand-muted pt-4 border-t border-brand-gold/15">
              <ArrowDown className="w-3.5 h-3.5 text-brand-gold animate-bounce" />
              <span>Scroll down continuously to advance through the laboratory cycle</span>
            </div>
          </div>

          {/* Right Visual Cross-Fade Stage (Col 6) */}
          <div className="lg:col-span-6 h-full flex items-center">
            <div className="relative w-full rounded-3xl overflow-hidden border-2 border-brand-gold/40 shadow-luxury bg-brand-sand/40 aspect-[4/3] lg:aspect-[5/4]">
              
              <motion.img
                key={activeStep}
                src={step.image}
                alt={step.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="w-full h-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-brand-ivory space-y-1 pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold-light font-bold">
                  Good Bee Protocol • Stage {step.step}
                </span>
                <p className="font-serif text-xl sm:text-2xl font-medium leading-snug">
                  {step.title}
                </p>
                <p className="text-xs text-brand-sand/90 font-light">
                  Standardized under Good Bee purity & research specifications.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
