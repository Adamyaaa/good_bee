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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
    <section id="how-to-apply" className="py-10 sm:py-14 bg-white relative border-b border-brand-gold/20 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Clean Header & Routine Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1918] font-medium">
              4-Step Daily Routines
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {routine.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.values(ROUTINES).map((r) => {
              const IconComp = r.icon;
              const isSelected = activeTab === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(r.id);
                    setActiveStepIndex(0);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#5B0868] text-white shadow-sm'
                      : 'bg-[#FAF7F2] text-gray-800 hover:bg-purple-50 border border-brand-gold/25'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#5B0868]'}`} />
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean 4-Column Step Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {routine.steps.map((step) => (
            <div
              key={step.stepNumber}
              onClick={() =>
                onSelectProduct &&
                onSelectProduct({
                  id: step.productId,
                  title: step.title,
                  price: step.price,
                  mrp: step.mrp,
                  image: step.image,
                  volume: step.volume,
                  category: step.category
                })
              }
              className="group bg-[#FAF7F2] rounded-2xl border border-brand-gold/25 hover:border-[#5B0868]/40 hover:bg-white p-3 sm:p-4 flex flex-col justify-between space-y-3 transition-all cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded-md bg-[#5B0868] text-white">
                    Step {step.stepNumber}
                  </span>
                  <span className="text-gray-500">{step.volume}</span>
                </div>

                <div className="aspect-square rounded-xl overflow-hidden bg-white border border-brand-gold/20">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h3 className="font-serif text-sm font-semibold text-[#1A1918] group-hover:text-[#5B0868] line-clamp-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 leading-snug">
                    {step.howToApply.dose}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-gold/15 flex items-center justify-between gap-2">
                <span className="font-serif text-sm font-bold text-[#1A1918]">₹{step.price}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddSingleStep(step);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    addedItems[step.productId]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-[#5B0868]/30 text-[#5B0868] hover:bg-[#5B0868] hover:text-white'
                  }`}
                >
                  {addedItems[step.productId] ? 'Added' : 'Add'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Single-Row Bundle Bar */}
        <div className="rounded-2xl bg-[#5B0868] text-white px-5 py-4 sm:px-7 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
              Bundle & Save 20%
            </span>
            <p className="font-serif text-lg sm:text-xl font-medium">
              Complete 4-Step {routine.name} —{' '}
              <span className="font-bold">₹{bundleDiscountedPrice}</span>{' '}
              <span className="text-xs line-through text-purple-200/80 ml-1">₹{totalRoutineMrp}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddEntireRoutine}
            className="px-6 py-3 rounded-xl bg-white hover:bg-purple-50 text-[#5B0868] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            {bundleAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Routine Added!</span>
              </>
            ) : (
              <>
                <span>Buy Complete 4-Step Routine</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
