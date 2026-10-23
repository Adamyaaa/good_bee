import React, { useState } from 'react';
import {
  Activity,
  Shield,
  Sun,
  Droplets,
  ArrowRight,
  Zap,
  CheckCircle2,
  Sparkles,
  Eye,
  Heart,
  Play,
  RotateCcw
} from 'lucide-react';

const CONCERNS = [
  {
    id: 'hair-fall',
    name: 'Hair Fall & Weak Roots',
    category: 'Hair & Wellness',
    concernTag: 'Hair Fall',
    isHero: true, // Spotlight
    targetDemo: 'Ages 20–45 • Stress, hard water & post-monsoon shedding',
    lifeMoment: 'Excessive hair strands in comb & thinning scalp line',
    stat: 'Follicle anchor active',
    badge: 'Akash & Adamya Focus',
    lifestyleImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    productImg: '/images_ref/Rosmary-2-300x300.webp',
    productName: 'Good Bee Rosemary & Brahmi Scalp Oil',
    keyActives: 'Nilgiri Rosemary • Slow-Cooked Brahmi • Kalonji',
    highlights: ['Micro-circulation scalp boost', 'Strengthens root sheath', 'Zero mineral oil or silicones'],
    accentGradient: 'from-slate-950/95 via-slate-900/70 to-transparent',
    tagBg: 'bg-emerald-600 text-white'
  },
  {
    id: 'eye-care',
    name: 'Under-Eye Dark Circles & Screen Strain',
    category: 'Botanical Mists',
    concernTag: 'Eyes & Fatigue',
    isHero: false,
    targetDemo: 'Ages 20–35 • Late night laptop/mobile screen fatigue',
    lifeMoment: 'Puffy morning eyes & stubborn dark shadow rings',
    stat: 'Instantly de-puffs',
    badge: 'Screen Fatigue Relief',
    lifestyleImg: 'https://images.unsplash.com/photo-1512290900672-1f0230f878f4?auto=format&fit=crop&w=800&q=80',
    productImg: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.01-300x300.webp',
    productName: 'Steam-Distilled Pure Rose Hydrosol Mist',
    keyActives: 'Fresh Damask Rose Water • Pure Vitamin E',
    highlights: ['Cools ocular inflammation', 'Improves capillary tone'],
    accentGradient: 'from-slate-950/90 via-slate-900/60 to-transparent',
    tagBg: 'bg-rose-600 text-white'
  },
  {
    id: 'lip-care',
    name: 'Chapped, Peeling & Pigmented Lips',
    category: 'Lip & Facial Care',
    concernTag: 'Lip Conditioning',
    isHero: false,
    targetDemo: 'Ages 20–40 • AC office dehydration & matte lipstick damage',
    lifeMoment: 'Cracked winter lips & loss of natural rosy tint',
    stat: '100% natural seal',
    badge: 'Bestseller Routine',
    lifestyleImg: 'https://images.unsplash.com/photo-1588005560947-f132c02f4d85?auto=format&fit=crop&w=800&q=80',
    productImg: '/images_ref/Pink-Lotus-300x300.webp',
    productName: 'Tinted Pink Lotus & Beeswax Lip Balm',
    keyActives: 'Nilgiri Raw Beeswax • Pink Lotus • Cold Almond',
    highlights: ['Breathable lipid barrier', 'Effortless dewy natural tint'],
    accentGradient: 'from-slate-950/90 via-slate-900/60 to-transparent',
    tagBg: 'bg-amber-600 text-white'
  },
  {
    id: 'barrier-body',
    name: 'Body Roughness & Compromised Barrier',
    category: 'Cold Processed Soaps',
    concernTag: 'Barrier Repair',
    isHero: false,
    targetDemo: 'Ages 20–45 • Post-sun tanning, eczema & parched barrier',
    lifeMoment: 'Tight, burning redness & dull scaly body texture',
    stat: '98% soothing index',
    badge: 'Clinical Lipid Seal',
    lifestyleImg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    productImg: '/images_ref/Donkey-Milk-Soap-300x300.webp',
    productName: 'Donkey Milk & Saffron Cold Processed Bar',
    keyActives: 'Donkey Milk Ceramides • Kashmir Saffron',
    highlights: ['Rebuilds cellular lipid matrix', 'Calms tightness in 24h'],
    accentGradient: 'from-slate-950/90 via-slate-900/60 to-transparent',
    tagBg: 'bg-indigo-600 text-white'
  },
  {
    id: 'acne-pimples',
    name: 'Active Pimples, Acne & Red Flare-ups',
    category: 'Acne & Blemishes',
    concernTag: 'Acne & Blemishes',
    isHero: false,
    targetDemo: 'Ages 20–30 • Hormonal flare-ups & pollution congestion',
    lifeMoment: 'Painful forehead pimples & lingering red marks',
    stat: 'Calms redness in 24h',
    badge: 'Overnight Flush',
    lifestyleImg: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    productImg: '/images_ref/Clear-skin-300x300.webp',
    productName: 'Clear Skin Neem & Basil Cold Cured Soap',
    keyActives: 'Cold Neem Leaves • Tea Tree Terpenes • Basil',
    highlights: ['Flushes congested pores', 'Fades post-acne blemishes'],
    accentGradient: 'from-slate-950/90 via-slate-900/60 to-transparent',
    tagBg: 'bg-emerald-700 text-white'
  }
];

const APPLICATION_STEPS = [
  {
    step: '01',
    title: 'Purify with Cold-Cured Bar',
    category: 'Cleansing',
    time: '60 Seconds',
    instruction: 'Lather between damp hands with tepid water. Massage creamy botanical foam into skin without harsh scrubbing.',
    img: '/images_ref/Donkey-Milk-Soap-300x300.webp'
  },
  {
    step: '02',
    title: 'Hydrate with Steam-Distilled Mist',
    category: 'Cellular Water',
    time: 'Instant Absorption',
    instruction: 'Hold 6 inches away and mist face and neck. Press gently with warm palms to flood dermal pores with water-soluble actives.',
    img: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp'
  },
  {
    step: '03',
    title: 'Seal with Cold-Stabilized Botanical Oil',
    category: 'Active Sealing',
    time: 'Overnight Therapy',
    instruction: 'Warm 2–3 drops between fingertips. Press into damp skin or scalp roots to lock in nutrients with unrefined natural waxes.',
    img: '/images_ref/Rosmary-2-300x300.webp'
  }
];

export default function ShopByConcern({ onSelectConcern }) {
  const [activeConcernPill, setActiveConcernPill] = useState('All');
  const heroConcern = CONCERNS.find((c) => c.isHero);
  const otherConcerns = CONCERNS.filter((c) => !c.isHero);

  const handlePillClick = (concernCategory, label) => {
    setActiveConcernPill(label);
    onSelectConcern(concernCategory);
  };

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header: Fresh Nat-Habit Inspired Diagnostic Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#5B0868] text-[11px] font-bold tracking-wider uppercase shadow-sm">
              <Zap className="w-3.5 h-3.5 text-[#5B0868]" />
              <span>Concern-Based Formulation Diagnostics (Ages 20–45)</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
              Real Concerns. 100% Pure Plant Solutions.
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 max-w-2xl leading-relaxed">
              Targeted botanical actives for modern skin and hair challenges — from post-monsoon hair fall to late-night eye strain and barrier redness. 1-click jump to verified solutions.
            </p>
          </div>

          <button
            onClick={() => onSelectConcern('All')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#5B0868] hover:text-[#480653] transition-colors group self-start md:self-end cursor-pointer"
          >
            <span>View All 19 Formulations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Nat Habit-Inspired Quick Concern Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { label: 'All Concerns', category: 'All' },
            { label: 'Hair Fall & Scalp', category: 'Hair & Wellness' },
            { label: 'Under-Eye & Screen Strain', category: 'Botanical Mists' },
            { label: 'Dry & Chapped Lips', category: 'Lip & Facial Care' },
            { label: 'Skin Barrier & Body', category: 'Cold Processed Soaps' },
            { label: 'Acne & Breakouts', category: 'Acne & Blemishes' }
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handlePillClick(pill.category, pill.label)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeConcernPill === pill.label
                  ? 'bg-[#5B0868] text-white shadow-md scale-105'
                  : 'bg-white text-brand-charcoal hover:bg-purple-50 border border-gray-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Bento Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Spotlight Card: Hair Fall (Meeting Directive) */}
          {heroConcern && (
            <div
              onClick={() => onSelectConcern(heroConcern.category)}
              className="lg:col-span-7 group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between min-h-[480px]"
            >
              {/* Background Lifestyle Visual */}
              <div className="absolute inset-0 z-0">
                <img
                  src={heroConcern.lifestyleImg}
                  alt={heroConcern.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${heroConcern.accentGradient} opacity-90 group-hover:opacity-95 transition-opacity`} />
              </div>

              {/* Card Header */}
              <div className="relative z-10 p-6 sm:p-8 flex items-start justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    {heroConcern.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold border border-white/30">
                    {heroConcern.stat}
                  </span>
                </div>

                <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-[11px] text-white">
                  {heroConcern.targetDemo}
                </span>
              </div>

              {/* Card Bottom Content */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-end justify-between gap-6">
                <div className="space-y-3 max-w-md text-white">
                  <span className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold block">
                    Concern Spotlight
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-tight text-white">
                    {heroConcern.name}
                  </h3>
                  <p className="text-xs text-white/90 font-light leading-relaxed">
                    "{heroConcern.lifeMoment}"
                  </p>
                  
                  {/* Quick Feature Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {heroConcern.highlights.map((h, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-300" />
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-300 group-hover:text-emerald-100 transition-colors">
                    <span>Jump to Sales & Formulations</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>

                {/* Floating Product Pack */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/95 backdrop-blur-md p-2 border border-emerald-200 shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform self-end">
                  <img
                    src={heroConcern.productImg}
                    alt={heroConcern.productName}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Right Column Bento Cards (Eyes, Lips, Barrier, Acne) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherConcerns.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectConcern(c.category)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white aspect-[4/5] shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-1 flex flex-col justify-between p-4"
              >
                {/* Background Image */}
                <img
                  src={c.lifestyleImg}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Vignette Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${c.accentGradient} opacity-90 group-hover:opacity-95 transition-opacity`} />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider border border-white/30">
                    {c.badge}
                  </span>
                  <span className="text-[10px] text-white/90 font-medium">
                    {c.stat}
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 space-y-1.5 text-white">
                  <div className="w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm p-1 border border-white/40 mb-2 shadow">
                    <img src={c.productImg} alt={c.name} className="w-full h-full object-contain rounded" />
                  </div>
                  <h4 className="font-serif text-base font-semibold leading-snug">
                    {c.name}
                  </h4>
                  <p className="text-[10px] text-white/80 line-clamp-1 italic">
                    {c.lifeMoment}
                  </p>
                  <div className="pt-1 border-t border-white/20 flex items-center justify-between text-[10px] text-purple-200 font-medium">
                    <span className="truncate max-w-[120px]">{c.keyActives}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Visual Cosmetic Application Guides ("How to Apply" Regimen) */}
        <div className="mt-12 pt-8 border-t border-purple-100 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B0868]">
              Application Method & Efficacy Ritual
            </span>
            <h3 className="font-serif text-2xl font-medium text-brand-charcoal">
              How to Apply: The Pure Botanical 3-Step Routine
            </h3>
            <p className="text-xs text-brand-muted">
              Scientifically sequenced for optimum active ingredient penetration and barrier stabilization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {APPLICATION_STEPS.map((s, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-[#5B0868]/40">
                      {s.step}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#5B0868] border border-purple-200">
                      {s.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="w-12 h-12 rounded-xl object-contain bg-[#FAF7F2] p-1 border border-purple-100 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-brand-muted tracking-wider block">{s.category}</span>
                      <h4 className="font-serif text-base font-semibold text-brand-charcoal">{s.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans">
                    {s.instruction}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => onSelectConcern(s.category === 'Cleansing' ? 'Cold Processed Soaps' : s.category === 'Cellular Water' ? 'Botanical Mists' : 'Pure Essential Oils')}
                    className="text-xs font-semibold text-[#5B0868] hover:text-[#480653] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Formulations</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
