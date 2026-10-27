import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import ShopByConcernCircleBar from './ShopByConcernCircleBar';
import { CONCERNS_DATA } from '../../data/concernsData';

const APPLICATION_STEPS = [
  {
    step: '01',
    title: 'Purify with Cold-Cured Bar',
    category: 'Cleansing',
    time: '60 Seconds',
    instruction: 'Lather between damp hands with tepid water. Massage creamy botanical foam into skin without harsh scrubbing.',
    img: '/images_ref/Donkey-Milk-Soap-300x300.webp',
    targetConcern: 'body-soaps'
  },
  {
    step: '02',
    title: 'Hydrate with Steam-Distilled Mist',
    category: 'Cellular Water',
    time: 'Instant Absorption',
    instruction: 'Hold 6 inches away and mist face and neck. Press gently with warm palms to flood dermal pores with water-soluble actives.',
    img: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp',
    targetConcern: 'face-care'
  },
  {
    step: '03',
    title: 'Seal with Cold-Stabilized Botanical Oil',
    category: 'Active Sealing',
    time: 'Overnight Therapy',
    instruction: 'Warm 2–3 drops between fingertips. Press into damp skin or scalp roots to lock in nutrients with unrefined natural waxes.',
    img: '/images_ref/Rosmary-2-300x300.webp',
    targetConcern: 'hair-care'
  }
];

export default function ShopByConcern({ onSelectConcern }) {
  const [activeConcernPill, setActiveConcernPill] = useState('all');

  const handleCircleClick = (concernItem) => {
    if (onSelectConcern) {
      onSelectConcern(concernItem);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF7F2] to-white border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Photo-Shaped Circular Concern Navigation Bar (Image 1 Feature) */}
        <ShopByConcernCircleBar
          variant="section"
          onSelectConcern={handleCircleClick}
        />

        {/* Quick Concern Spotlight Grid: 4 Top Concern Banners */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CONCERNS_DATA.slice(1, 5).map((concern) => (
            <div
              key={concern.id}
              onClick={() => handleCircleClick(concern)}
              className="group relative bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle accent background gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-70 group-hover:opacity-100 transition-opacity" />

              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-200 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                    <img
                      src={concern.image}
                      alt={concern.label}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#5B0868] border border-purple-200">
                    {concern.badge || 'Formulation'}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-semibold text-gray-900 group-hover:text-[#5B0868] transition-colors">
                    {concern.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-sans mt-1 line-clamp-2 leading-relaxed">
                    {concern.tagline}
                  </p>
                </div>
              </div>

              <div className="relative pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#5B0868]">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Visual Cosmetic Application Guides ("How to Apply" Regimen) */}
        <div className="mt-14 pt-10 border-t border-purple-100 space-y-6">
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
                className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
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
                      <span className="text-[10px] font-bold uppercase text-brand-muted tracking-wider block">
                        {s.category}
                      </span>
                      <h4 className="font-serif text-base font-semibold text-brand-charcoal">
                        {s.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans">
                    {s.instruction}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => {
                      const found = CONCERNS_DATA.find((c) => c.id === s.targetConcern) || CONCERNS_DATA[1];
                      handleCircleClick(found);
                    }}
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
