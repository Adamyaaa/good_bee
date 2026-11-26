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
    <section className="py-10 sm:py-12 bg-[#FAF7F2] border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Clean Minimal Header */}
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1918] font-medium tracking-tight">
            Shop by Concern
          </h2>
          <span className="text-xs font-semibold text-[#5B0868] hidden sm:inline">
            8 Targeted Collections
          </span>
        </div>

        {/* 8-Card Compact Concern Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CONCERNS_DATA.map((concern) => {
            const startingAt = STARTING_PRICES[concern.id] || 275;
            return (
              <div
                key={concern.id}
                onClick={() => handleSelect(concern)}
                className="group bg-white rounded-2xl border border-brand-gold/25 p-3.5 sm:p-4 shadow-xs hover:shadow-lg hover:border-[#5B0868]/40 transition-all duration-200 cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-brand-gold/30 group-hover:border-[#5B0868] flex-shrink-0 bg-[#FAF7F2]">
                  <img
                    src={concern.image}
                    alt={concern.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1A1918] group-hover:text-[#5B0868] transition-colors leading-snug truncate">
                    {concern.label}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] sm:text-xs">
                    <span className="font-medium text-gray-600">From ₹{startingAt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5B0868] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
