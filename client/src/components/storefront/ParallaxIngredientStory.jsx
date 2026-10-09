import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Droplets, Shield, Award } from 'lucide-react';

const ACTIVES = [
  {
    name: 'Natural Bee Wax & Himalayan Deodar',
    origin: 'Source-Identified Forest Apiaries & High Himalayas',
    role: 'Antimicrobial Barrier Shield & Moisture Lock',
    bioactive: 'Natural Wax Esters & Cedrene Terpenes',
    offset: [-20, 40],
    image: '/images_ref/Clear-skin-300x300.webp'
  },
  {
    name: 'Indigenous A2 Cow Milk & Shea Butter',
    origin: 'Ethical Dairy & Cold-Milled Karité Fruit',
    role: 'Biomimetic Lipid Replenishment & Baby-Soft Skin',
    bioactive: 'Natural Ceramides & Beta-Casein Proteins',
    offset: [40, -30],
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.25-1-300x300.webp'
  },
  {
    name: 'Steam-Distilled Frankincense Resin',
    origin: 'Wild-Harvested Boswellia Carterii Gum',
    role: 'Cellular Renewal & Deep Tissue Toning',
    bioactive: 'Active Alpha-Thujene & Boswellic Terpenes',
    offset: [-30, 30],
    image: '/images_ref/Frankin-300x300.webp'
  },
  {
    name: 'Pink Lotus Petals & Sweet Almond',
    origin: 'Hand-Gathered Nelumbo Blossoms & Cold-Pressed Prunus',
    role: 'Dewy Conditioning & Lip Moisture Barrier',
    bioactive: 'Flavonoid Glycosides & Natural Vitamin E',
    offset: [30, -40],
    image: '/images_ref/Pink-Lotus-300x300.webp'
  }
];

export default function ParallaxIngredientStory() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  return (
    <section
      ref={containerRef}
      id="ingredients"
      className="py-24 bg-brand-ivory relative overflow-hidden border-t border-brand-gold/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark">
            Cellular Botanical Actives
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-charcoal font-medium">
            Active-Stabilized Botanical Potency
          </h2>
          <p className="text-brand-charcoal/70 text-sm sm:text-base font-normal">
            Every botanical extract in Good Bee formulations is chosen for proven active density and standardized to ensure consistent cellular benefits.
          </p>
        </div>

        {/* 4 Multi-Speed Parallax Active Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACTIVES.map((active, idx) => {
            const y = useTransform(scrollYProgress, [0, 1], active.offset);

            return (
              <motion.div
                key={active.name}
                style={{ y }}
                className="bg-brand-cream/60 rounded-3xl border border-brand-gold/30 p-5 space-y-4 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-sand/40 border border-brand-gold/20">
                    <img
                      src={active.image}
                      alt={active.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/50 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider text-brand-gold-light bg-brand-charcoal/80 px-2 py-0.5 rounded">
                      Standardized Active
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-semibold text-brand-charcoal">
                      {active.name}
                    </h3>
                    <p className="text-[11px] text-brand-gold-dark font-medium mt-0.5">
                      {active.origin}
                    </p>
                  </div>

                  <div className="p-3 bg-brand-ivory rounded-xl border border-brand-gold/20 space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold text-brand-muted block">
                      Target Benefit:
                    </span>
                    <p className="text-brand-charcoal font-medium">{active.role}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-gold/15 text-[10px] text-brand-muted font-mono">
                  Active Molecule: <span className="text-brand-charcoal font-semibold">{active.bioactive}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
