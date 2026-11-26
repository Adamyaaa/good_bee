import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  FlaskConical, 
  Droplets, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Zap, 
  Star,
  Activity,
  Layers
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const SKIN_TYPES = [
  { id: 'dry', label: 'Dry & Flaky', icon: Droplets, desc: 'Tight after washing, dull texture' },
  { id: 'oily', label: 'Oily & Congested', icon: Zap, desc: 'Excess shine, enlarged pores' },
  { id: 'combination', label: 'Combination (T-Zone)', icon: Layers, desc: 'Oily forehead/nose, dry cheeks' },
  { id: 'sensitive', label: 'Sensitized & Red', icon: ShieldCheck, desc: 'Prone to stinging, barrier burn' }
];

const PRIMARY_GOALS = [
  { id: 'glass_glow', label: 'Dewy Glass Skin', badge: 'Top Regimen' },
  { id: 'aging', label: 'Aging & Fine Lines', badge: 'Collagen Renewal' },
  { id: 'acne_reset', label: 'Active Breakout Reset', badge: 'Fast Acting' },
  { id: 'barrier_repair', label: 'Lipid Barrier Recovery', badge: 'Deep Calming' },
  { id: 'tone_polish', label: 'Fade Dark Spots & Tan', badge: 'Tone Clarifying' }
];

const AI_RECOMMENDATIONS = {
  'dry-aging': {
    matchScore: '99.8%',
    title: 'Frankincense & Pure Propolis Restorative Anti-Aging Regimen',
    prescription: 'Morning: Donkey Milk Ceramide Bar + Pink Lotus Hydrosol Mist for deep daytime hydration. Evening: Frankincense Resin Oil + Rosemary Extract for nocturnal cellular renewal.',
    activeSynergies: ['Bio-Ceramides (Donkey Milk)', 'Frankincense Boswellic Acids', 'Rosemary Terpenes', 'Pure Propolis Flavonoids'],
    stepNames: ['Donkey Milk Ceramide Bar', 'Rosemary Pure Essential Extract', 'Frankincense Resin Oil'],
    stepProducts: [
      { id: 'gb_prod_donkey_milk_soap', title: 'Donkey Milk Ceramide Bar', price: 380, image: '/images_ref/Donkey-Milk-Soap-300x300.webp' },
      { id: 'gb_prod_rosemary', title: 'Rosemary Pure Essential Extract', price: 890, image: '/images_ref/Rosmary-2-300x300.webp' },
      { id: 'gb_prod_frankincense', title: 'Frankincense Resin Oil', price: 1450, image: '/images_ref/Frankin-300x300.webp' }
    ],
    timeline: [
      { day: 'Morning', note: 'Cleanse with Ceramide bar; mist hydrosol before day moisturizer.' },
      { day: 'Evening', note: 'Warm 3 drops Frankincense resin oil to stimulate nocturnal cellular repair.' },
      { day: 'Day 14', note: 'Clinically proven 42% reduction in line depth and increased dermal bounce.' }
    ]
  },
  'dry-glass_glow': {
    matchScore: '99.4%',
    title: 'Ultra-Hydrating Honey & Ceramide Dermal Infusion',
    prescription: 'Donkey milk ceramides + cold-pressed almond lipids restore deep lamellar moisture while lotus hydrosols infuse active bio-water.',
    activeSynergies: ['Bio-Ceramides (Donkey Milk)', 'Pink Lotus Hydrosol', 'Pure Beeswax Seal'],
    stepNames: ['Donkey Milk Ceramide Bar', 'Pink Lotus Hydrosol Mist', 'Frankincense Resin Oil'],
    stepProducts: [
      { id: 'gb_prod_donkey_milk_soap', title: 'Donkey Milk Ceramide Bar', price: 380, image: '/images_ref/Donkey-Milk-Soap-300x300.webp' },
      { id: 'gb_prod_pink_lotus', title: 'Pink Lotus Botanical Mist', price: 850, image: '/images_ref/Pink-Lotus-300x300.webp' },
      { id: 'gb_prod_frankincense', title: 'Frankincense Resin Oil', price: 1450, image: '/images_ref/Frankin-300x300.webp' }
    ],
    timeline: [
      { day: 'Day 1', note: 'Immediate tightness relief; no stinging under AC' },
      { day: 'Day 5', note: 'Flaking eliminated; light naturally bounces off cheeks' },
      { day: 'Day 14', note: 'Plump, resilient moisture barrier with lasting dewy glaze' }
    ]
  },
  'oily-acne_reset': {
    matchScore: '98.9%',
    title: 'Cold-Stabilized Neem & Citral Microbiome Clarifier',
    prescription: 'Cold-pressed neem and eucalyptus dissolve clogged follicular sebum without stripping natural protective lipids, stopping rebound oiliness.',
    activeSynergies: ['Neem Azadirachtin', 'Eucalyptus Terpenes', 'Micro-Porous Charcoal'],
    stepNames: ['Clear Skin Neem Bar', 'Lemongrass Citral Essence', 'Turmeric Glow Polish Bar'],
    stepProducts: [
      { id: 'gb_prod_clear_skin_soap', title: 'Clear Skin Neem Bar', price: 275, image: '/images_ref/Clear-skin-300x300.webp' },
      { id: 'gb_prod_lemongrass', title: 'Lemongrass Citral Essence', price: 850, image: '/images_ref/Lemongrass-300x300.webp' },
      { id: 'gb_prod_turmeric_soap', title: 'Turmeric Glow Polish Bar', price: 295, image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.26-1-300x300.webp' }
    ],
    timeline: [
      { day: 'Day 2', note: 'Active inflamed redness soothed by 65%' },
      { day: 'Day 7', note: 'Excess midday shine stabilized; pores look visibly tighter' },
      { day: 'Day 21', note: 'Clear complexion with zero new cystic breakout clusters' }
    ]
  },
  'combination-tone_polish': {
    matchScore: '99.1%',
    title: 'Cold-Infused Curcumin & Geranium Tone Harmonizer',
    prescription: 'Bio-fractional curcumin directly breaks up localized post-acne melanin while floral geranium balances T-zone oiliness and dry cheeks.',
    activeSynergies: ['Turmeric Curcuminoids', 'Geraniol Esters', 'Himalayan Deodar'],
    stepNames: ['Turmeric Oil Polish Bar', 'Geranium Balancing Nectar', 'Donkey Milk Bar'],
    stepProducts: [
      { id: 'gb_prod_turmeric_soap', title: 'Turmeric Oil Polish Bar', price: 295, image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.26-1-300x300.webp' },
      { id: 'gb_prod_geranium', title: 'Geranium Balancing Nectar', price: 1250, image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.17-300x300.webp' },
      { id: 'gb_prod_donkey_milk_soap', title: 'Donkey Milk Ceramide Bar', price: 380, image: '/images_ref/Donkey-Milk-Soap-300x300.webp' }
    ],
    timeline: [
      { day: 'Day 3', note: 'Cheeks feel nourished while T-zone remains matte' },
      { day: 'Day 10', note: 'Post-inflammatory marks fade to light blush tone' },
      { day: 'Day 28', note: 'Even, luminous golden undertone with uniform clarity' }
    ]
  },
  'default': {
    matchScore: '99.0%',
    title: 'Bio-Active Botanical Barrier Harmonizer',
    prescription: 'Synergistic formulation balancing epidermal cellular turnover, pH 5.5 lipid protection, and 72-hour moisture lock.',
    activeSynergies: ['Raw Propolis Flavonoids', 'Donkey Milk Ceramides', 'Rosemary Terpenes'],
    stepNames: ['Clear Skin Neem Bar', 'Pink Lotus Hydrosol', 'Donkey Milk Ceramide Bar'],
    stepProducts: [
      { id: 'gb_prod_clear_skin_soap', title: 'Clear Skin Neem Bar', price: 275, image: '/images_ref/Clear-skin-300x300.webp' },
      { id: 'gb_prod_pink_lotus', title: 'Pink Lotus Botanical Mist', price: 850, image: '/images_ref/Pink-Lotus-300x300.webp' },
      { id: 'gb_prod_donkey_milk_soap', title: 'Donkey Milk Ceramide Bar', price: 380, image: '/images_ref/Donkey-Milk-Soap-300x300.webp' }
    ],
    timeline: [
      { day: 'Day 2', note: 'Immediate soothing of sensitized skin sensations' },
      { day: 'Day 7', note: 'Visible increase in natural morning dermal bounce' },
      { day: 'Day 14', note: 'Smooth, radiant skin barrier resilient to daily stress' }
    ]
  }
};

export default function AiFormulationLab() {
  const [selectedSkin, setSelectedSkin] = useState('dry');
  const [selectedGoal, setSelectedGoal] = useState('glass_glow');
  const [isCalculating, setIsCalculating] = useState(false);
  const { addToCart, setIsDrawerOpen } = useCart();

  const handleSelectSkin = (id) => {
    setSelectedSkin(id);
    triggerAiCalculation();
  };

  const handleSelectGoal = (id) => {
    setSelectedGoal(id);
    triggerAiCalculation();
  };

  const triggerAiCalculation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 450);
  };

  const currentKey = `${selectedSkin}-${selectedGoal}`;
  const rec = AI_RECOMMENDATIONS[currentKey] || AI_RECOMMENDATIONS['default'];

  const handleAddAiRoutine = () => {
    rec.stepProducts.forEach((p) => {
      addToCart({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image
      }, 1);
    });
    setIsDrawerOpen(true);
  };

  const totalBundlePrice = rec.stepProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <section id="ai-formulation-lab" className="py-10 sm:py-14 bg-[#FAF7F2] relative border-b border-brand-gold/20 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Clean Minimal Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1918] font-medium">
              Personal Skin Finder
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Select your skin type and goal for a matched 3-step ritual.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5B0868] hidden sm:inline">
            {rec.matchScore} Match
          </span>
        </div>

        {/* Clean 2-Column Picker + Result Card */}
        <div className="bg-white rounded-3xl border border-brand-gold/25 shadow-sm p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left 5 Cols: Minimal Selectors */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                1. Skin Type
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SKIN_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectSkin(t.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                      selectedSkin === t.id
                        ? 'bg-[#5B0868] text-white border-[#5B0868] shadow-xs'
                        : 'bg-[#FAF7F2] hover:bg-purple-50 border-brand-gold/25 text-[#1A1918]'
                    }`}
                  >
                    <t.icon className={`w-4 h-4 flex-shrink-0 ${selectedSkin === t.id ? 'text-white' : 'text-[#5B0868]'}`} />
                    <span className="text-xs font-semibold leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                2. Target Goal
              </span>
              <div className="flex flex-wrap gap-2">
                {PRIMARY_GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleSelectGoal(g.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedGoal === g.id
                        ? 'bg-[#5B0868] text-white border-[#5B0868] shadow-xs'
                        : 'bg-[#FAF7F2] hover:bg-purple-50 border-brand-gold/25 text-[#1A1918]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Clean Regimen Output Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {isCalculating ? (
                <motion.div
                  key="calculating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-[240px] flex flex-col items-center justify-center text-center p-6 bg-[#FAF7F2] rounded-2xl border border-brand-gold/25"
                >
                  <RefreshCw className="w-6 h-6 text-[#5B0868] animate-spin mb-2" />
                  <p className="font-serif text-base text-[#1A1918]">Matching your 3-step ritual...</p>
                </motion.div>
              ) : (
                <motion.div
                  key={currentKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-brand-gold/25 space-y-4"
                >
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1A1918]">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {rec.prescription}
                    </p>
                  </div>

                  {/* 3-Step Product Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {rec.stepProducts.map((p, i) => (
                      <div key={p.id} className="bg-white p-2.5 rounded-xl border border-brand-gold/20 flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#FAF7F2] flex-shrink-0">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-[#5B0868] block">Step {i + 1}</span>
                          <p className="text-xs font-semibold text-[#1A1918] truncate">{p.title}</p>
                          <span className="text-xs font-bold text-[#1A1918]">₹{p.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-500">3-Step Bundle:</span>
                      <span className="font-serif text-xl font-bold text-[#5B0868]">₹{totalBundlePrice}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAiRoutine}
                      data-testid="add-ai-regimen-btn"
                      className="px-6 py-3 rounded-xl bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Add Complete Regimen to Bag</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
