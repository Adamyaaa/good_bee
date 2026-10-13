import React from 'react';
import { Activity, Shield, Sun, Droplets, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const CONCERNS = [
  {
    id: 'Acne & Blemishes',
    name: 'Active Pimples & Breakouts',
    category: 'Acne & Blemishes',
    isHero: true, // Bento Spotlight
    lifeMoment: 'Late-night stress breakouts & hormonal acne',
    stat: 'Calms redness in 24h',
    badge: '🔥 #1 Gen-Z Concern Focus',
    lifestyleImg: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    productImg: '/images_ref/Clear-skin-300x300.webp',
    keyActives: 'Neem Extract • Tea Tree • Eucalyptus Terpenes',
    highlights: ['Non-comedogenic pore flush', 'Reduces active inflammation', 'Prevents post-acne marks'],
    accentGradient: 'from-emerald-950/80 via-emerald-900/60 to-brand-charcoal/90'
  },
  {
    id: 'Barrier Repair',
    name: 'Compromised Skin Barrier',
    category: 'Barrier Repair',
    isHero: false,
    lifeMoment: 'Over-exfoliation, burning & sensitized redness',
    stat: '98% soothing index',
    badge: 'Post-Sun / Barrier Reset',
    lifestyleImg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    productImg: '/images_ref/Donkey-Milk-Soap-300x300.webp',
    keyActives: 'Donkey Milk Ceramides • Raw Organic Beeswax',
    highlights: ['Deep epidermal lipid seal', 'Relieves tightness in minutes'],
    accentGradient: 'from-amber-950/80 via-amber-900/60 to-brand-charcoal/90'
  },
  {
    id: 'Pigmentation & Tone',
    name: 'Dark Spots & Acne Marks',
    category: 'Pigmentation & Tone',
    isHero: false,
    lifeMoment: 'Stubborn post-acne spots & uneven sun tan',
    stat: 'Fades marks naturally',
    badge: 'Targeted Tone Polish',
    lifestyleImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    productImg: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.26-1-300x300.webp',
    keyActives: 'Cold-Infused Turmeric • Raw Beeswax Infusion',
    highlights: ['Clarifies cellular debris', 'Even luminous skin tone'],
    accentGradient: 'from-amber-900/80 via-yellow-950/60 to-brand-charcoal/90'
  },
  {
    id: 'Dryness & Moisture Deficit',
    name: 'AC Dehydration & Flaking',
    category: 'Dryness & Moisture Deficit',
    isHero: false,
    lifeMoment: 'Air-conditioned office skin & morning tight flaking',
    stat: 'Instant bouncy plump',
    badge: 'Deep Dermal Hydration',
    lifestyleImg: 'https://images.unsplash.com/photo-1512290900672-1f0230f878f4?auto=format&fit=crop&w=600&q=80',
    productImg: '/images_ref/Pink-Lotus-300x300.webp',
    keyActives: 'Pink Lotus Hydrosol • Cold-Pressed Almond Oil',
    highlights: ['Non-greasy all-day shield', 'Silky, supple finish'],
    accentGradient: 'from-rose-950/80 via-pink-950/60 to-brand-charcoal/90'
  },
  {
    id: 'Youth & Radiance',
    name: 'Fine Lines & Dull Fatigue',
    category: 'Youth & Radiance',
    isHero: false,
    lifeMoment: 'Nightly cell recovery & collagen protection ritual',
    stat: '100% steam distilled',
    badge: 'Cellular Renewal',
    lifestyleImg: 'https://images.unsplash.com/photo-1608248597359-009f0a2d24bd?auto=format&fit=crop&w=600&q=80',
    productImg: '/images_ref/Frankin-300x300.webp',
    keyActives: 'Sacred Boswellia Frankincense Terpenes',
    highlights: ['Stimulates cellular firmness', 'Aromatherapeutic calm'],
    accentGradient: 'from-stone-900/80 via-stone-950/60 to-brand-charcoal/90'
  }
];

export default function ShopByConcern({ onSelectConcern }) {
  const heroConcern = CONCERNS.find((c) => c.isHero);
  const otherConcerns = CONCERNS.filter((c) => !c.isHero);

  return (
    <section className="py-20 bg-brand-ivory border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: More Images, Less Words, Gen-Z / Bento Concept */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300/60 text-emerald-900 text-[11px] font-bold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Targeted Skin Concern Diagnostics</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium">
              Real Skin Moments. Pure Botanical Solutions.
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 max-w-xl">
              From overnight pimple breakouts to sensitized barrier flare-ups — discover high-potency formulations crafted for your daily skin reality.
            </p>
          </div>

          <button
            onClick={() => onSelectConcern('All')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-gold-dark hover:text-brand-charcoal transition-colors group self-start md:self-end"
          >
            <span>Explore All Solutions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Modern Bento Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bento Spotlight Card: Pimple / Acne / Breakouts Focus */}
          {heroConcern && (
            <div
              onClick={() => onSelectConcern(heroConcern.category)}
              className="lg:col-span-7 group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-emerald-700/30 bg-brand-cream shadow-luxury hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between min-h-[460px]"
            >
              {/* Background Lifestyle Visual */}
              <div className="absolute inset-0 z-0">
                <img
                  src={heroConcern.lifestyleImg}
                  alt={heroConcern.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${heroConcern.accentGradient} opacity-90 group-hover:opacity-95 transition-opacity`} />
              </div>

              {/* Card Header Pills */}
              <div className="relative z-10 p-6 sm:p-8 flex items-start justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-brand-ivory text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    {heroConcern.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-brand-ivory/20 backdrop-blur-md text-brand-ivory text-[10px] font-semibold border border-brand-ivory/30">
                    {heroConcern.stat}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-brand-charcoal/60 backdrop-blur-md border border-brand-gold/30 text-[11px] text-brand-sand">
                  <span>Life Moment:</span>
                  <span className="text-brand-ivory font-medium italic">Breakouts & Flare-ups</span>
                </div>
              </div>

              {/* Card Bottom Content & Floating Product Overlay */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-end justify-between gap-6">
                <div className="space-y-3 max-w-md text-brand-ivory">
                  <span className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold block">
                    Concern Spotlight
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-tight text-brand-ivory">
                    {heroConcern.name}
                  </h3>
                  <p className="text-xs text-brand-sand/90 font-light leading-relaxed">
                    "{heroConcern.lifeMoment}"
                  </p>
                  
                  {/* Quick Feature Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {heroConcern.highlights.map((h, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand-ivory/15 backdrop-blur-sm border border-brand-ivory/20 text-brand-ivory">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-300 group-hover:text-brand-gold-light transition-colors">
                    <span>Explore Formulation Catalog</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>

                {/* Floating Clear Skin Product Pack */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-brand-ivory/90 backdrop-blur-md p-2 border border-brand-gold/40 shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform self-end">
                  <img
                    src={heroConcern.productImg}
                    alt="Good Bee Clear Skin Soap"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Right Column Bento Cards (Remaining 4 Concerns) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherConcerns.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectConcern(c.category)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-cream/80 aspect-[4/5] shadow-sm hover:shadow-luxury transition-all duration-400 hover:-translate-y-1 flex flex-col justify-between p-4"
              >
                {/* Background Image */}
                <img
                  src={c.lifestyleImg}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Vignette Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${c.accentGradient} opacity-85 group-hover:opacity-90 transition-opacity`} />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-brand-charcoal/70 backdrop-blur-md text-brand-ivory text-[9px] font-bold uppercase tracking-wider border border-brand-gold/30">
                    {c.badge}
                  </span>
                  <span className="text-[10px] text-brand-sand/90 font-medium">
                    {c.stat}
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 space-y-1.5 text-brand-ivory">
                  <div className="w-10 h-10 rounded-lg bg-brand-ivory/90 backdrop-blur-sm p-1 border border-brand-gold/30 mb-2 shadow">
                    <img src={c.productImg} alt={c.name} className="w-full h-full object-contain rounded" />
                  </div>
                  <h4 className="font-serif text-base font-semibold leading-snug">
                    {c.name}
                  </h4>
                  <p className="text-[10px] text-brand-sand/80 line-clamp-1 italic">
                    {c.lifeMoment}
                  </p>
                  <div className="pt-1 border-t border-brand-ivory/15 flex items-center justify-between text-[10px] text-brand-gold-light font-medium">
                    <span className="truncate max-w-[120px]">{c.keyActives}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Life Moment Highlights Strip below */}
        <div className="mt-8 pt-6 border-t border-brand-gold/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-brand-cream/50 border border-brand-gold/20">
            <p className="text-xs font-bold text-brand-charcoal">Breakout Calming</p>
            <p className="text-[10px] text-brand-muted">Overnight anti-bacterial active relief</p>
          </div>
          <div className="p-3 rounded-xl bg-brand-cream/50 border border-brand-gold/20">
            <p className="text-xs font-bold text-brand-charcoal">Ceramide Sealing</p>
            <p className="text-[10px] text-brand-muted">Donkey milk lipids repair tight barrier</p>
          </div>
          <div className="p-3 rounded-xl bg-brand-cream/50 border border-brand-gold/20">
            <p className="text-xs font-bold text-brand-charcoal">Post-Acne Fade</p>
            <p className="text-[10px] text-brand-muted">Cold-turmeric active clears marks</p>
          </div>
          <div className="p-3 rounded-xl bg-brand-cream/50 border border-brand-gold/20">
            <p className="text-xs font-bold text-brand-charcoal">Deep Dermal Dew</p>
            <p className="text-[10px] text-brand-muted">Pink lotus hydrosol hydration lock</p>
          </div>
        </div>

      </div>
    </section>
  );
}
