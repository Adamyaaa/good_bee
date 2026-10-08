import React from 'react';
import { Shield, Sparkles, Droplets, Sun, Activity, ArrowRight } from 'lucide-react';

const CONCERNS = [
  {
    id: 'Barrier Repair',
    name: 'Barrier Repair',
    subtitle: 'Sensitized & Weakened Skin',
    keyActives: 'Oat Ceramides & Propolis',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
    color: 'from-amber-900/60 to-brand-charcoal/80'
  },
  {
    id: 'Acne & Blemishes',
    name: 'Acne & Blemishes',
    subtitle: 'Congested Pores & Breakouts',
    keyActives: 'Willow Bark BHA & Honey Enzymes',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80',
    color: 'from-emerald-950/60 to-brand-charcoal/80'
  },
  {
    id: 'Pigmentation & Tone',
    name: 'Pigmentation & Tone',
    subtitle: 'Dark Spots & Uneven Texture',
    keyActives: 'Saffron Crocin & Licorice',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1608248597359-009d1b643a60?auto=format&fit=crop&w=700&q=80',
    color: 'from-amber-950/60 to-brand-charcoal/80'
  },
  {
    id: 'Dryness & Moisture Deficit',
    name: 'Moisture Deficit',
    subtitle: 'Flaking, Tight & Dehydrated Skin',
    keyActives: 'Plant Squalane & Hyaluronic Acid',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80',
    color: 'from-sky-950/60 to-brand-charcoal/80'
  },
  {
    id: 'Youth & Radiance',
    name: 'Youth & Radiance',
    subtitle: 'Fine Lines & Dull Complexion',
    keyActives: 'Standardized Bakuchiol & Rosehip',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80',
    color: 'from-stone-900/60 to-brand-charcoal/80'
  }
];

export default function ShopByConcern({ onSelectConcern }) {
  return (
    <section className="py-20 bg-brand-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
              Targeted Botanical Diagnostics
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
              Shop by Skin Concern
            </h2>
            <p className="text-sm text-brand-charcoal/70 max-w-xl">
              Discover research-backed formulations selected specifically to restore your personal skin equilibrium.
            </p>
          </div>

          <button
            onClick={() => onSelectConcern('All')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-brand-gold-dark hover:text-brand-charcoal transition-colors group"
          >
            <span>View All Diagnostics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Concern Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CONCERNS.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                onClick={() => onSelectConcern(c.id)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-cream/80 aspect-[3/4] shadow-sm hover:shadow-luxury transition-all duration-500 hover:-translate-y-1"
              >
                {/* Background Image */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Vignette Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${c.color} opacity-85 group-hover:opacity-90 transition-opacity`} />

                {/* Content Box */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between text-brand-ivory">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-full bg-brand-ivory/10 backdrop-blur-md border border-brand-ivory/20">
                      <Icon className="w-4 h-4 text-brand-gold-light" />
                    </span>
                    <span className="text-[10px] tracking-wider uppercase text-brand-gold-light font-medium">
                      Formulation
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-medium leading-snug text-brand-ivory">
                      {c.name}
                    </h3>
                    <p className="text-[11px] text-brand-sand/90 font-light">{c.subtitle}</p>
                    <div className="pt-2 border-t border-brand-ivory/15 flex items-center justify-between text-[11px] text-brand-gold-light font-medium">
                      <span className="truncate">{c.keyActives}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </div>
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
