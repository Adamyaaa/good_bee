import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';

const HERO_BOTANICALS = [
  {
    name: 'Forest Beeswax & Deodar',
    role: 'Breathable moisture seal',
    searchKeyword: 'Bee Wax',
    image: '/images_ref/Levendor-300x300.webp'
  },
  {
    name: 'Donkey & Desi A2 Milk',
    role: 'Gentle ceramide barrier care',
    searchKeyword: 'Milk',
    image: '/images_ref/Donkey-Milk-Soap-300x300.webp'
  },
  {
    name: 'Wild Frankincense Resin',
    role: 'Firmness & skin calm',
    searchKeyword: 'Frankincense',
    image: '/images_ref/Frankin-300x300.webp'
  },
  {
    name: 'Nilgiri Rosemary & Brahmi',
    role: 'Scalp & follicle vitality',
    searchKeyword: 'Rosemary',
    image: '/images_ref/Rosmary-2-300x300.webp'
  }
];

export default function ParallaxIngredientStory({ onSelectIngredient }) {
  return (
    <section
      id="ingredients"
      className="py-10 sm:py-12 bg-white relative border-b border-brand-gold/20 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Header */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1918] font-medium">
            Key Botanicals
          </h2>
          <span className="text-xs font-semibold text-[#5B0868] hidden sm:inline">
            Tap to filter formulations
          </span>
        </div>

        {/* Clean 4-Column Interactive Ingredient Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {HERO_BOTANICALS.map((active) => (
            <button
              key={active.name}
              type="button"
              onClick={() => onSelectIngredient?.(active.searchKeyword)}
              className="group text-left bg-[#FAF7F2] rounded-2xl border border-brand-gold/25 hover:border-[#5B0868]/45 hover:bg-white p-3 sm:p-4 space-y-3 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2.5 w-full">
                <div className="aspect-square rounded-xl overflow-hidden bg-white border border-brand-gold/20">
                  <img
                    src={active.image}
                    alt={active.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1A1918] group-hover:text-[#5B0868] transition-colors">
                    {active.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">
                    {active.role}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-gold/15 w-full flex items-center justify-between text-[11px] font-bold text-[#5B0868]">
                <span>Shop Actives</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
