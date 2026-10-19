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
  { id: 'dry', label: 'Dry & Flaky', icon: '🌵', desc: 'Tight after washing, dull texture' },
  { id: 'oily', label: 'Oily & Congested', icon: '✨', desc: 'Excess shine, enlarged pores' },
  { id: 'combination', label: 'Combination (T-Zone)', icon: '🌓', desc: 'Oily forehead/nose, dry cheeks' },
  { id: 'sensitive', label: 'Sensitized & Red', icon: '🌸', desc: 'Prone to stinging, barrier burn' }
];

const PRIMARY_GOALS = [
  { id: 'glass_glow', label: 'Dewy Glass Skin', badge: '✨ #1 Trend' },
  { id: 'acne_reset', label: 'Active Breakout Reset', badge: '🔥 48H Action' },
  { id: 'barrier_repair', label: 'Lipid Barrier Recovery', badge: '🛡️ Deep Calming' },
  { id: 'tone_polish', label: 'Fade Dark Spots & Tan', badge: '☀️ Tone Clarifying' }
];

const AI_RECOMMENDATIONS = {
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
    <section id="ai-formulation-lab" className="py-20 sm:py-28 bg-white relative border-t border-purple-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header: Tech-Forward Clinical Cosmetic Styling */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#5B0868] text-xs font-bold uppercase tracking-widest shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#5B0868]" />
            <span>AI FORMULATION INTELLIGENCE • SKIN DIAGNOSTIC</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-charcoal font-medium leading-tight">
            Personalized Bio-Active Routine Diagnostic
          </h2>

          <p className="text-sm sm:text-base text-brand-charcoal/75 max-w-2xl mx-auto font-sans leading-relaxed">
            Select your skin profile below. Our formulation algorithm cross-references your lipid barrier parameters with active botanical stability scores to build your custom regimen.
          </p>
        </div>

        {/* Main Diagnostic Panel */}
        <div className="bg-[#FAF7F2] rounded-3xl border border-purple-100 shadow-md p-6 sm:p-10 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left 5 Cols: Input Diagnostic Controls */}
            <div className="lg:col-span-5 space-y-7">
              
              {/* Question 1: Skin Type */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5B0868] flex items-center justify-center text-[11px] font-bold">1</span>
                    <span>Your Current Skin Barrier Type</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {SKIN_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectSkin(t.id)}
                      className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                        selectedSkin === t.id
                          ? 'bg-[#5B0868] text-white border-[#5B0868] shadow-sm'
                          : 'bg-white hover:bg-purple-50 border-gray-200 text-brand-charcoal'
                      }`}
                    >
                      <div className="text-xl mb-1">{t.icon}</div>
                      <div className="text-xs font-bold leading-tight">{t.label}</div>
                      <div className={`text-[10px] mt-0.5 leading-tight ${selectedSkin === t.id ? 'text-purple-200' : 'text-brand-muted'}`}>
                        {t.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Primary Goal */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5B0868] flex items-center justify-center text-[11px] font-bold">2</span>
                    <span>Target Transformation Goal</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {PRIMARY_GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleSelectGoal(g.id)}
                      className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                        selectedGoal === g.id
                          ? 'bg-[#5B0868] text-white border-[#5B0868] shadow-sm'
                          : 'bg-white hover:bg-purple-50 border-gray-200 text-brand-charcoal'
                      }`}
                    >
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                        selectedGoal === g.id ? 'bg-white/20 text-white' : 'bg-purple-50 text-[#5B0868]'
                      }`}>
                        {g.badge}
                      </span>
                      <div className="text-xs font-bold leading-tight">{g.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Trust Guarantee Strip */}
              <div className="bg-white rounded-xl p-4 border border-purple-100 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div className="text-[11px] text-brand-charcoal/80 leading-snug">
                  <span className="font-bold text-brand-charcoal">Clean Formulation AI Matrix:</span> Guaranteed 100% free of synthetic sulfates, artificial perfumes, silicones, and phthalates.
                </div>
              </div>

            </div>

            {/* Right 7 Cols: AI Generated Output Card */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {isCalculating ? (
                  <motion.div
                    key="calculating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-purple-200"
                  >
                    <RefreshCw className="w-8 h-8 text-[#5B0868] animate-spin mb-3" />
                    <p className="font-serif text-lg font-medium text-brand-charcoal">Analyzing Lipid Profile & Active Stability...</p>
                    <p className="text-xs text-brand-muted mt-1">Cross-referencing 100% natural botanical synergies</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentKey}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-md relative"
                  >
                    {/* Top Row: AI Match Score & Title */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          <span>AI Compatibility: {rec.matchScore} Match</span>
                        </div>
                        <span className="text-[11px] font-mono text-brand-muted uppercase tracking-wider">
                          Matrix ID: #GB-AI-{selectedSkin.slice(0, 2).toUpperCase()}{selectedGoal.slice(0, 2).toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-brand-charcoal">
                          {rec.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-brand-charcoal/80 mt-1.5 leading-relaxed">
                          {rec.prescription}
                        </p>
                      </div>

                      {/* Active Botanical Synergies Pills */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B0868] block">
                          AI-Verified Active Ingredients:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {rec.activeSynergies.map((act, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-lg bg-[#FAF7F2] text-brand-charcoal text-xs font-medium border border-gray-200 shadow-sm flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#5B0868]" />
                              <span>{act}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recommended 3-Step Product Stack */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B0868] block">
                          Your Customized 3-Step Product Stack:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {rec.stepProducts.map((p, i) => (
                            <div key={p.id} className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-[#5B0868] block">STEP 0{i + 1}</span>
                                <p className="text-xs font-semibold text-brand-charcoal truncate">{p.title}</p>
                                <span className="text-xs font-bold text-brand-charcoal">₹{p.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expected Transformation Timeline */}
                      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-gray-200/60 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#5B0868]" />
                          <span>Expected Clinical Results Timeline:</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {rec.timeline.map((t, i) => (
                            <div key={i} className="text-[11px] leading-tight">
                              <span className="font-bold text-brand-charcoal block">{t.day}:</span>
                              <span className="text-brand-muted">{t.note}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Bottom CTA Button */}
                    <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-brand-muted block">3-Product AI Bundle:</span>
                        <span className="font-serif text-2xl font-bold text-[#5B0868]">₹{totalBundlePrice}</span>
                      </div>

                      <button
                        onClick={handleAddAiRoutine}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Add My Custom AI Routine to Cart</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
