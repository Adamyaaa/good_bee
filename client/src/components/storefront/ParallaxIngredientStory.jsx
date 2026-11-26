import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';

const HERO_BOTANICALS = [
  {
    name: 'Forest Beeswax & Deodar',
    origin: 'Source-Identified Apiaries & High Himalayas',
    role: 'Breathable Moisture Barrier & Antimicrobial Shield',
    bioactive: 'Natural Wax Esters & Cedrene Terpenes',
    searchKeyword: 'Bee Wax',
    image: '/images_ref/Levendor-300x300.webp'
  },
  {
    name: 'Donkey & Desi A2 Cow Milk',
    origin: 'Ethical Dairy & Cold-Milled Shea Butter',
    role: 'Biomimetic Ceramides & Gentle Acid-Mantle Care',
    bioactive: 'Natural Ceramides & Beta-Casein Proteins',
    searchKeyword: 'Milk',
    image: '/images_ref/Donkey-Milk-Soap-300x300.webp'
  },
  {
    name: 'Wild Frankincense Resin',
    origin: 'Wild-Harvested Boswellia Carterii Gum',
    role: 'Cellular Renewal, Fine-Line Toning & Calm',
    bioactive: 'Alpha-Thujene & Boswellic Terpenes',
    searchKeyword: 'Frankincense',
    image: '/images_ref/Frankin-300x300.webp'
  },
  {
    name: 'Nilgiri Rosemary & Brahmi',
    origin: 'Slow-Infused Whole Herbs & Steam Leaves',
    role: 'Follicle Micro-Circulation & Pore Clarifying',
    bioactive: '1,8-Cineole & Rosmarinic Flavonoids',
    searchKeyword: 'Rosemary',
    image: '/images_ref/Rosmary-2-300x300.webp'
  }
];

export default function ParallaxIngredientStory({ onSelectIngredient }) {
  return (
    <section
      id="ingredients"
      className="py-14 sm:py-18 bg-white relative border-b border-brand-gold/20 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#5B0868] text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
              <Leaf className="w-3.5 h-3.5 text-[#5B0868]" />
              <span>Shop by Hero Botanical</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1918] font-medium">
              Active-Stabilized Raw Ingredients
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-normal">
              Tap any signature botanical below to filter formulations crafted around its active bio-compounds.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5B0868] hidden md:inline">
            Zero Mineral Oils • Zero Synthetic Fragrance
          </span>
        </div>

        {/* Aligned 4-Column Interactive Ingredient Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HERO_BOTANICALS.map((active) => (
            <button
              key={active.name}
              type="button"
              onClick={() => onSelectIngredient?.(active.searchKeyword)}
              className="group text-left bg-[#FAF7F2] rounded-2xl border border-brand-gold/25 hover:border-[#5B0868]/45 hover:bg-white p-4 sm:p-5 space-y-3.5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3 w-full">
                {/* Crisp Padded Square Frame so 300x300 Studio Assets Stay Sharp */}
                <div className="bg-white rounded-2xl p-2.5 border border-brand-gold/20 shadow-2xs">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7F2]">
                    <img
                      src={active.image}
                      alt={active.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider text-white bg-[#1A1918]/85 px-2 py-0.5 rounded-md">
                      Cold-Stabilized
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1A1918] group-hover:text-[#5B0868] transition-colors">
                    {active.name}
                  </h3>
                  <p className="text-[11px] text-brand-gold-dark font-medium mt-0.5">
                    {active.origin}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-brand-gold/20 space-y-1 text-xs">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500 block">
                    Skin & Scalp Benefit
                  </span>
                  <p className="text-[#1A1918] font-medium leading-snug">{active.role}</p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-brand-gold/15 w-full flex items-center justify-between gap-2">
                <span className="text-[10px] text-gray-500 font-mono truncate">
                  {active.bioactive}
                </span>
                <span className="text-[11px] font-bold text-[#5B0868] inline-flex items-center gap-1 flex-shrink-0">
                  <span>Shop</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
