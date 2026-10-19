import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Sun, 
  Moon, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShoppingBag, 
  Flame, 
  Layers, 
  Award, 
  Check, 
  ChevronRight,
  Info
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

// 3 Curated Regimens modeled like Plum & Dot & Key's iconic application guides
export const ROUTINES = {
  am: {
    id: 'am',
    name: 'AM Glass Skin Glow',
    tagline: 'Wake up dull skin & seal 72H dewy hydration before facing pollution',
    icon: Sun,
    badge: 'MORNING REGIMEN',
    timeEst: '3 Minutes',
    colorTheme: {
      tabActive: 'bg-[#5B0868] text-white shadow-sm',
      pill: 'bg-purple-50 text-[#5B0868] border-purple-200',
      accentGlow: 'transparent',
      cardBorder: 'border-purple-200',
      badgeBg: 'bg-[#5B0868] text-white'
    },
    bundleDiscount: 20,
    steps: [
      {
        stepNumber: '01',
        category: 'CLEANSE & AWAKEN',
        productId: 'gb_prod_clear_skin_soap',
        title: 'Clear Skin Neem & Eucalyptus Cold-Process Bar',
        volume: '100 g',
        price: 275,
        mrp: 325,
        image: '/images_ref/Clear-skin-300x300.webp',
        rating: 4.9,
        reviewsCount: 215,
        texture: 'Cushioning Micro-Lather',
        textureColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        howToApply: {
          dose: 'Lather for 10 seconds between wet palms',
          gesture: 'Massage upward circular motions across face & neck for 60 seconds',
          waterTemp: 'Rinse with cool or lukewarm water (never hot)',
          proTip: 'Focus around your nose folds and jawline where overnight sebum collects.'
        },
        aiActiveScore: '99.2% Sebum Balancing'
      },
      {
        stepNumber: '02',
        category: 'TONE & DEW MIST',
        productId: 'gb_prod_pink_lotus',
        title: 'Pink Lotus Pure Botanical Hydrosol Mist',
        volume: '100 ml',
        price: 850,
        mrp: 999,
        image: '/images_ref/Pink-Lotus-300x300.webp',
        rating: 4.9,
        reviewsCount: 142,
        texture: 'Weightless Micro-Fine Dew',
        textureColor: 'bg-rose-50 text-rose-800 border-rose-200',
        howToApply: {
          dose: '3 to 4 generous spritzes holding bottle 6 inches away',
          gesture: 'Gently press and tap into skin with clean palms — do not wipe off',
          waterTemp: 'Keep refrigerated in summer for an instant depuffing cryo-glow',
          proTip: 'Apply your serum while skin is still visibly damp to triple active absorption!'
        },
        aiActiveScore: '98.8% Cellular Hydration'
      },
      {
        stepNumber: '03',
        category: 'TREAT & NOURISH',
        productId: 'gb_prod_geranium',
        title: 'Good Bee Geranium Bio-Harmonizing Nectar',
        volume: '15 ml',
        price: 1250,
        mrp: 1500,
        image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.17-300x300.webp',
        rating: 4.8,
        reviewsCount: 64,
        texture: 'Silky Honey-Gold Elixir',
        textureColor: 'bg-amber-50 text-amber-900 border-amber-200',
        howToApply: {
          dose: '3 to 4 concentrated drops',
          gesture: 'Warm between fingertips, press gently into cheeks, forehead and chin',
          waterTemp: 'Never rub briskly; let skin drink in the bio-active terpenes',
          proTip: 'Pat downwards on neck and collarbone to promote natural lymphatic drainage.'
        },
        aiActiveScore: '99.5% Antioxidant Shield'
      },
      {
        stepNumber: '04',
        category: 'LOCK & GLAZE',
        productId: 'gb_prod_donkey_milk_soap',
        title: 'Donkey Milk Ceramide Restorative Soufflé Bar',
        volume: '100 g',
        price: 380,
        mrp: 450,
        image: '/images_ref/Donkey-Milk-Soap-300x300.webp',
        rating: 5.0,
        reviewsCount: 178,
        texture: 'Velvet Ceramide Lipid Glaze',
        textureColor: 'bg-orange-50 text-orange-900 border-orange-200',
        howToApply: {
          dose: 'Work a silky layer with damp fingertips',
          gesture: 'Smooth upwards in lifting strokes to lock in all active moisture',
          waterTemp: 'Leaves a breathable, non-sticky glass-skin finish',
          proTip: 'Always follow with your favourite broad-spectrum SPF 50 as the final step!'
        },
        aiActiveScore: '99.9% 72H Barrier Seal'
      }
    ]
  },
  pm: {
    id: 'pm',
    name: 'PM Deep Barrier Repair',
    tagline: 'Reset cellular fatigue, reverse sun damage, and wake up with plump bouncy skin',
    icon: Moon,
    badge: 'NIGHT RECOVERY',
    timeEst: '4 Minutes',
    colorTheme: {
      tabActive: 'bg-[#5B0868] text-white shadow-sm',
      pill: 'bg-purple-50 text-[#5B0868] border-purple-200',
      accentGlow: 'transparent',
      cardBorder: 'border-purple-200',
      badgeBg: 'bg-[#5B0868] text-white'
    },
    bundleDiscount: 20,
    steps: [
      {
        stepNumber: '01',
        category: 'DEEP DETOX CLEANSE',
        productId: 'gb_prod_charcoal_soap',
        title: 'Activated Bamboo Charcoal Deep Detox Bar',
        volume: '100 g',
        price: 285,
        mrp: 340,
        image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.13-300x300.webp',
        rating: 4.8,
        reviewsCount: 139,
        texture: 'Rich Velvet Purifying Foam',
        textureColor: 'bg-slate-100 text-slate-800 border-slate-300',
        howToApply: {
          dose: 'Work into a creamy dark foam with warm water',
          gesture: 'Massage over congested T-zone and forehead to dissolve sunscreen & pollution',
          waterTemp: 'Rinse with warm water to release impurities trapped in pores',
          proTip: 'Let the lather sit for 30 seconds on oily zones before rinsing.'
        },
        aiActiveScore: '98.5% Micro-Pollutant Lift'
      },
      {
        stepNumber: '02',
        category: 'HYDRATION HYDROSOL',
        productId: 'gb_prod_pink_lotus',
        title: 'Pink Lotus Pure Botanical Hydrosol Mist',
        volume: '100 ml',
        price: 850,
        mrp: 999,
        image: '/images_ref/Pink-Lotus-300x300.webp',
        rating: 4.9,
        reviewsCount: 142,
        texture: 'Cooling Botanical Nectar Mist',
        textureColor: 'bg-pink-50 text-pink-800 border-pink-200',
        howToApply: {
          dose: '4 to 5 generous cloud sprays',
          gesture: 'Press gently into face with palms, taking deep breaths of natural lotus aroma',
          waterTemp: 'Natural aromatherapeutic compounds calm nighttime nervous system',
          proTip: 'Layer twice (the 2-skin method) if you sleep in air conditioning.'
        },
        aiActiveScore: '99.1% Transepidermal Hydration'
      },
      {
        stepNumber: '03',
        category: 'CELLULAR RESTORATION',
        productId: 'gb_prod_frankincense',
        title: 'Pure Wild Frankincense Cell-Renewal Oil',
        volume: '15 ml',
        price: 1450,
        mrp: 1750,
        image: '/images_ref/Frankin-300x300.webp',
        rating: 4.9,
        reviewsCount: 86,
        texture: 'Golden Royal Resin Elixir',
        textureColor: 'bg-amber-50 text-amber-900 border-amber-300',
        howToApply: {
          dose: '3 concentrated drops warmed in palms',
          gesture: 'Press firmly into smile lines, forehead, and under-eye orbital bone',
          waterTemp: 'Active boswellic acids stimulate overnight collagen regeneration',
          proTip: 'Perform 1 minute of gentle upward facial massage to release facial tension.'
        },
        aiActiveScore: '99.8% Overnight Cell Turnover'
      },
      {
        stepNumber: '04',
        category: 'CERAMIDE BARRIER WRAP',
        productId: 'gb_prod_donkey_milk_soap',
        title: 'Donkey Milk Ceramide Restorative Soufflé Bar',
        volume: '100 g',
        price: 380,
        mrp: 450,
        image: '/images_ref/Donkey-Milk-Soap-300x300.webp',
        rating: 5.0,
        reviewsCount: 178,
        texture: 'Ultra-Rich Protective Butter',
        textureColor: 'bg-purple-50 text-purple-900 border-purple-200',
        howToApply: {
          dose: 'Apply cushioning balm layer across entire face',
          gesture: 'Pat smooth until comfortable cushion barrier forms',
          waterTemp: 'Acts as a natural sleeping mask preventing overnight hydration loss',
          proTip: 'Wake up to zero dry flakes and velvety baby-soft bounce.'
        },
        aiActiveScore: '100% Epidermal Lipid Replenishment'
      }
    ]
  },
  blemish: {
    id: 'blemish',
    name: 'Acne & Blemish Reset',
    tagline: 'Target active pimples, soothe flaming redness, and fade stubborn acne marks naturally',
    icon: Zap,
    badge: '48H CLARIFYING REGIMEN',
    timeEst: '2 Minutes',
    colorTheme: {
      tabActive: 'bg-[#5B0868] text-white shadow-sm',
      pill: 'bg-purple-50 text-[#5B0868] border-purple-200',
      accentGlow: 'transparent',
      cardBorder: 'border-purple-200',
      badgeBg: 'bg-[#5B0868] text-white'
    },
    bundleDiscount: 20,
    steps: [
      {
        stepNumber: '01',
        category: 'PORE CLARIFYING CLEANSE',
        productId: 'gb_prod_clear_skin_soap',
        title: 'Clear Skin Neem & Eucalyptus Cold-Process Bar',
        volume: '100 g',
        price: 275,
        mrp: 325,
        image: '/images_ref/Clear-skin-300x300.webp',
        rating: 4.9,
        reviewsCount: 215,
        texture: 'Antibacterial Herbal Lather',
        textureColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        howToApply: {
          dose: 'Work lather between wet hands for 15 seconds',
          gesture: 'Massage gently over active breakout zones without scrubbing or popping',
          waterTemp: 'Rinse with cool water to soothe inflamed capillaries',
          proTip: 'Leave the neem lather on active pimples for 30 seconds before rinsing.'
        },
        aiActiveScore: '99.4% P. Acnes Inhibition'
      },
      {
        stepNumber: '02',
        category: 'SEBUM HARMONIZATION',
        productId: 'gb_prod_lemongrass',
        title: 'Pure Lemongrass Citral Balancing Essence',
        volume: '15 ml',
        price: 850,
        mrp: 1050,
        image: '/images_ref/Lemongrass-300x300.webp',
        rating: 4.9,
        reviewsCount: 72,
        texture: 'Clarifying Botanical Drop',
        textureColor: 'bg-teal-50 text-teal-900 border-teal-200',
        howToApply: {
          dose: '1 drop diluted in hydrosol or water',
          gesture: 'Dab directly over congested pores, blackheads, and chin breakouts',
          waterTemp: 'Natural citral isomers dissolve stubborn follicular oil plugs',
          proTip: 'Use morning and evening for rapid pore tightening.'
        },
        aiActiveScore: '98.9% Follicular Oil Dissolution'
      },
      {
        stepNumber: '03',
        category: 'MARK FADING & TONE',
        productId: 'gb_prod_turmeric_soap',
        title: 'Turmeric Rhizome Oil Glow Polish Bar',
        volume: '100 g',
        price: 295,
        mrp: 345,
        image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.26-1-300x300.webp',
        rating: 4.9,
        reviewsCount: 167,
        texture: 'Golden Curcumin Cream Lather',
        textureColor: 'bg-amber-50 text-amber-900 border-amber-200',
        howToApply: {
          dose: 'Silky golden foam',
          gesture: 'Glide over hyperpigmented spots and post-inflammatory erythema marks',
          waterTemp: 'Curcuminoids break up localized melanin deposition',
          proTip: 'Consistent use visibly fades dark post-acne scars in 14 days.'
        },
        aiActiveScore: '99.1% Post-Acne Mark Clearance'
      },
      {
        stepNumber: '04',
        category: 'BARRIER CALM & SEAL',
        productId: 'gb_prod_donkey_milk_soap',
        title: 'Donkey Milk Ceramide Restorative Soufflé Bar',
        volume: '100 g',
        price: 380,
        mrp: 450,
        image: '/images_ref/Donkey-Milk-Soap-300x300.webp',
        rating: 5.0,
        reviewsCount: 178,
        texture: 'Soothing Lipid Shield',
        textureColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        howToApply: {
          dose: 'Light nourishing touch',
          gesture: 'Smooth gently over entire face to prevent acne treatments from drying out skin',
          waterTemp: 'Calms redness without clogging pores (100% non-comedogenic)',
          proTip: 'Never skip moisturizing oily skin — dehydration triggers more oil production!'
        },
        aiActiveScore: '100% Non-Comedogenic Hydration'
      }
    ]
  }
};

export default function SkincareRoutineGuide({ onSelectProduct }) {
  const [activeTab, setActiveTab] = useState('am');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [addedItems, setAddedItems] = useState({});
  const [bundleAdded, setBundleAdded] = useState(false);
  const { addToCart, setIsDrawerOpen } = useCart();

  const routine = ROUTINES[activeTab];
  const activeStep = routine.steps[activeStepIndex] || routine.steps[0];

  // Calculate routine bundle prices
  const totalRoutinePrice = routine.steps.reduce((sum, s) => sum + s.price, 0);
  const totalRoutineMrp = routine.steps.reduce((sum, s) => sum + s.mrp, 0);
  const bundleDiscountedPrice = Math.round(totalRoutinePrice * (1 - routine.bundleDiscount / 100));
  const totalSaved = totalRoutineMrp - bundleDiscountedPrice;

  const handleAddSingleStep = (step) => {
    const productObj = {
      id: step.productId,
      title: step.title,
      price: step.price,
      mrp: step.mrp,
      image: step.image,
      volume: step.volume,
      category: step.category
    };
    addToCart(productObj, 1);
    setAddedItems((prev) => ({ ...prev, [step.productId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [step.productId]: false }));
    }, 2500);
  };

  const handleAddEntireRoutine = () => {
    routine.steps.forEach((step) => {
      const productObj = {
        id: step.productId,
        title: step.title,
        price: Math.round(step.price * (1 - routine.bundleDiscount / 100)),
        mrp: step.mrp,
        image: step.image,
        volume: step.volume,
        category: step.category
      };
      addToCart(productObj, 1);
    });
    setBundleAdded(true);
    setIsDrawerOpen(true);
    setTimeout(() => setBundleAdded(false), 3000);
  };

  return (
    <section id="how-to-apply" className="py-20 sm:py-28 bg-[#FAF7F2] relative border-t border-purple-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Clean Cosmetic Aesthetic */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#5B0868] text-xs font-bold uppercase tracking-widest shadow-sm">
            <span>DAILY REGIMEN GUIDE • HOW TO APPLY</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-charcoal font-medium leading-tight">
            How To Layer Your Good Bee Formulations
          </h2>

          <p className="text-sm sm:text-base text-brand-charcoal/75 max-w-2xl mx-auto font-sans leading-relaxed">
            Just like leading cosmetic clinical regimes, the secret to radiant glass skin is correct layering order, gentle micro-gestures, and active absorption windows.
          </p>

          {/* Interactive Routine Tabs (AM / PM / Acne Reset) */}
          <div className="pt-6 flex flex-wrap justify-center gap-2.5 sm:gap-4">
            {Object.values(ROUTINES).map((r) => {
              const IconComp = r.icon;
              const isSelected = activeTab === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveTab(r.id);
                    setActiveStepIndex(0);
                  }}
                  className={`flex items-center gap-2.5 px-5 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? r.colorTheme.tabActive
                      : 'bg-white text-brand-charcoal hover:bg-purple-50 border border-gray-200 shadow-sm'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#5B0868]'}`} />
                  <span>{r.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ml-1 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-brand-charcoal'
                  }`}>
                    {r.timeEst}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tagline Banner */}
        <div className="mb-10 text-center">
          <p className="text-xs sm:text-sm font-medium text-brand-charcoal/80 bg-white inline-block px-6 py-2 rounded-xl border border-purple-100 shadow-sm">
            <span className="font-semibold text-brand-charcoal">{routine.badge}:</span> {routine.tagline}
          </p>
        </div>

        {/* Main 4-Step Interactive Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* Left Column: Interactive Step Selector Cards (Desktop & Tablet) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-gold" />
                <span>The 4-Step Application Sequence</span>
              </span>
              <span className="text-xs text-brand-muted font-medium">Click step to view guide</span>
            </div>

            {routine.steps.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <motion.div
                  key={step.stepNumber}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center gap-4 ${
                    isActive
                      ? `bg-white shadow-xl ${routine.colorTheme.cardBorder} ring-2 ring-amber-400/40`
                      : 'bg-white/60 hover:bg-white border-brand-gold/20 hover:border-brand-gold/40 shadow-sm'
                  }`}
                >
                  {/* Step Number Circle */}
                  <div className={`w-11 h-11 rounded-full flex flex-col items-center justify-center flex-shrink-0 font-bold transition-colors ${
                    isActive
                      ? routine.colorTheme.badgeBg
                      : 'bg-brand-cream/80 text-brand-charcoal border border-brand-gold/30'
                  }`}>
                    <span className="text-[9px] font-sans uppercase tracking-tighter opacity-80">STEP</span>
                    <span className="text-sm font-mono leading-none">{step.stepNumber}</span>
                  </div>

                  {/* Step Brief Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
                      {step.category}
                    </span>
                    <h4 className="font-serif text-sm sm:text-base font-semibold text-brand-charcoal truncate">
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-brand-charcoal">₹{step.price}</span>
                      <span className="text-[11px] text-brand-muted line-through">₹{step.mrp}</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full border ${step.textureColor}`}>
                        {step.texture.split('•')[0]}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform ${
                    isActive ? 'text-amber-600 translate-x-1' : 'text-gray-300'
                  }`} />
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive "How to Apply" Active Stage */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeStep.stepNumber}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-xl relative overflow-hidden"
              >
                {/* Decorative Top Accent Stripe */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#5B0868]" />

                {/* Header of Active Step */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${routine.colorTheme.badgeBg}`}>
                        STEP {activeStep.stepNumber} • {activeStep.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-1">
                        {activeStep.aiActiveScore}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-brand-charcoal pt-1">
                      {activeStep.title}
                    </h3>
                  </div>

                  <div className="text-right sm:text-right flex-shrink-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-serif font-bold text-brand-charcoal">₹{activeStep.price}</span>
                      <span className="text-xs text-brand-muted line-through">₹{activeStep.mrp}</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">
                      Save {Math.round(((activeStep.mrp - activeStep.price) / activeStep.mrp) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Center Stage: Visual Thumbnail & How-To Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
                  
                  {/* Product Visual Box */}
                  <div className="md:col-span-5 relative group">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FBFBFA] border border-gray-200 shadow-sm flex items-center justify-center p-3">
                      <img
                        src={activeStep.image}
                        alt={activeStep.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-3 left-3 right-3 text-center">
                        <span className={`inline-block text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm border ${activeStep.textureColor}`}>
                          Texture: {activeStep.texture}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* "How to Apply" Step Breakdown (Plum & Dot & Key Style) */}
                  <div className="md:col-span-7 space-y-4">
                    
                    {/* Dose / Amount */}
                    <div className="flex items-start gap-3 bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                      <div className="p-1.5 rounded-lg bg-purple-100 text-[#5B0868] flex-shrink-0 mt-0.5">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-purple-950">
                          Recommended Amount
                        </h5>
                        <p className="text-xs text-brand-charcoal/85 mt-0.5 font-medium">
                          {activeStep.howToApply.dose}
                        </p>
                      </div>
                    </div>

                    {/* Application Motion / Gesture */}
                    <div className="flex items-start gap-3 bg-rose-50/40 p-3 rounded-xl border border-rose-100">
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-800 flex-shrink-0 mt-0.5">
                        <Sun className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-rose-950">
                          Application Gesture & Technique
                        </h5>
                        <p className="text-xs text-brand-charcoal/85 mt-0.5 font-medium leading-relaxed">
                          {activeStep.howToApply.gesture}
                        </p>
                      </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="flex items-start gap-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 flex-shrink-0 mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-emerald-950">
                          Dermatologist Glow Tip
                        </h5>
                        <p className="text-xs text-brand-charcoal/85 mt-0.5 leading-relaxed">
                          {activeStep.howToApply.proTip}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Footer Actions of Active Step */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free of synthetic sulfates, artificial perfumes & mineral oils</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleAddSingleStep(activeStep)}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {addedItems[activeStep.productId] ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add Step {activeStep.stepNumber} to Bag (₹{activeStep.price})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* 4-Step Regimen Bundle Offer Card (One-Click Routine Purchase like Dot & Key) */}
        <div className="relative rounded-2xl bg-[#5B0868] text-white p-6 sm:p-10 shadow-xl border border-purple-900/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Routine Summary & Micro Product Thumbnails */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-white/15 border border-white/25 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>SPECIAL REGIMEN BUNDLE OFFER • SAVE 20%</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium leading-tight text-white">
                Get The Complete 4-Step {routine.name}
              </h3>

              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-xl">
                Formulated to work synergistically. Layering all 4 steps boosts botanical active-stabilization efficacy and delivers visible results in under 7 days.
              </p>

              {/* Mini Step Thumbnails Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {routine.steps.map((step) => (
                  <div key={step.stepNumber} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/20 flex-shrink-0">
                      <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-amber-300 font-bold block">STEP {step.stepNumber}</span>
                      <span className="text-[11px] text-white font-medium truncate max-w-[110px] block">{step.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Bundle Pricing & One-Click Buy Button */}
            <div className="lg:col-span-5 bg-white/10 rounded-xl p-6 border border-white/20 text-center lg:text-right space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-purple-200 font-bold block">
                  Routine Value: <span className="line-through text-purple-300/80">₹{totalRoutineMrp}</span>
                </span>
                <div className="flex items-baseline justify-center lg:justify-end gap-3 mt-1">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-white">
                    ₹{bundleDiscountedPrice}
                  </span>
                  <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-bold">
                    SAVE ₹{totalSaved} (20% OFF)
                  </span>
                </div>
                <p className="text-[11px] text-purple-200 mt-1">
                  + Complimentary Pan-India Shipping & Botanical Sample Gift
                </p>
              </div>

              <button
                onClick={handleAddEntireRoutine}
                className="w-full py-4 px-8 rounded-xl bg-white hover:bg-purple-50 text-[#5B0868] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {bundleAdded ? (
                  <>
                    <Check className="w-5 h-5 text-[#5B0868]" />
                    <span>All 4 Items Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <span>Buy Complete 4-Step Routine (Save 20%)</span>
                    <ArrowRight className="w-4 h-4 text-[#5B0868]" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
