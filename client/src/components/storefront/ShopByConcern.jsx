import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CONCERNS_DATA } from '../../data/concernsData';

const STARTING_PRICES = {
  'flash-deals': 275,
  'hair-care': 499,
  'face-care': 270,
  'lip-care': 299,
  'body-soaps': 220,
  'winter-care': 299,
  'pure-oils': 850,
  'baby-care': 340
};

export default function ShopByConcern({ onSelectConcern }) {
  const handleSelect = (concernItem) => {
    if (onSelectConcern) {
      onSelectConcern(concernItem);
    }
  };

  return (
    <section className="py-14 sm:py-18 bg-[#FAF7F2] border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#5B0868] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#5B0868]" />
              <span>Targeted Botanical Care</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1918] font-medium tracking-tight">
              Shop by Skin & Hair Concern
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl font-sans">
              Jump directly to cold-stabilized rituals tailored to your exact skin, scalp, lip, or barrier need.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5B0868] hidden md:inline">
            8 Curated Care Collections
          </span>
        </div>

        {/* 8-Card Concern Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {CONCERNS_DATA.map((concern) => {
            const count = concern.productIds?.length || 4;
            const startingAt = STARTING_PRICES[concern.id] || 275;
            return (
              <div
                key={concern.id}
                onClick={() => handleSelect(concern)}
                className="group relative bg-white rounded-2xl border border-brand-gold/25 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-[#5B0868]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl -mr-8 -mt-8 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-brand-gold/40 group-hover:border-[#5B0868] p-0.5 shadow-xs transition-all flex-shrink-0 bg-[#FAF7F2]">
                      <img
                        src={concern.image}
                        alt={concern.label}
                        className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${
                        concern.isPromo
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-purple-50 text-[#5B0868] border-purple-200'
                      }`}
                    >
                      {concern.badge || `${count} Items`}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-sm sm:text-base lg:text-lg font-semibold text-[#1A1918] group-hover:text-[#5B0868] transition-colors leading-snug">
                      {concern.label}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-600 font-sans mt-1 line-clamp-2 leading-relaxed">
                      {concern.tagline}
                    </p>
                  </div>
                </div>

                <div className="relative pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="font-semibold text-gray-700">
                    From ₹{startingAt}
                  </span>
                  <span className="font-bold text-[#5B0868] inline-flex items-center gap-1">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
