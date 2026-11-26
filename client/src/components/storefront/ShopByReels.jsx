import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ShoppingBag, Eye, Sparkles, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const REELS_DATA = [
  {
    id: 'reel-1',
    title: 'The Silk Cold-Lather Ritual',
    subtitle: 'Creamy Donkey Milk & Almond Saponification',
    creator: '@goodbee.rituals',
    duration: '0:18',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-washing-with-soap-under-water-43286-large.mp4',
    posterUrl: '/images_ref/Donkey-Milk-Soap-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_donkey_milk_soap',
      title: 'Good Bee Donkey Milk Cold Processed Soap',
      price: 380,
      mrp: 450,
      volume: '100 g',
      image: '/images_ref/Donkey-Milk-Soap-300x300.webp',
      badge: '6-Week Cold Cured'
    },
    lifeMoment: 'Post-sun dry skin barrier recovery with raw donkey milk ceramides & beeswax.'
  },
  {
    id: 'reel-2',
    title: 'Beeswax & Lotus Barrier Seal',
    subtitle: 'Unrefined Pink Lotus & Vitamin E Balm',
    creator: '@botanical.glow',
    duration: '0:14',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-a-face-tonic-43275-large.mp4',
    posterUrl: '/images_ref/Pink-Lotus-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_pink_lip_balm',
      title: 'Good Bee Tinted Pink Moisturizing Lip Balm',
      price: 349,
      mrp: 425,
      volume: '5 g',
      image: '/images_ref/Pink-Lotus-300x300.webp',
      badge: 'Bestseller'
    },
    lifeMoment: 'Effortless rosy flush & breathable moisture lock without petrolatum.'
  },
  {
    id: 'reel-3',
    title: 'Clarifying Neem & Eucalyptus Bar',
    subtitle: 'Say No to Chemical Soap Bathing',
    creator: '@skin.science.lab',
    duration: '0:22',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-cleansing-skin-with-foam-43280-large.mp4',
    posterUrl: '/images_ref/Clear-skin-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_clear_skin_soap',
      title: 'Good Bee Clear Skin Cold Processed Soap',
      price: 275,
      mrp: 325,
      volume: '100 g',
      image: '/images_ref/Clear-skin-300x300.webp',
      badge: 'Acne Defense'
    },
    lifeMoment: 'Calms redness and clears congested pores without harsh SLS stripping.'
  },
  {
    id: 'reel-4',
    title: 'One Drop Boswellia Melt',
    subtitle: 'Wild Frankincense Resin Elixir',
    creator: '@pure.aromatherapy',
    duration: '0:16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-applying-cosmetic-oil-to-skin-43277-large.mp4',
    posterUrl: '/images_ref/Frankin-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_frankincense',
      title: 'Good Bee Frankincense Pure Essential Oil',
      price: 1450,
      mrp: 1750,
      volume: '15 ml',
      image: '/images_ref/Frankin-300x300.webp',
      badge: '100% Pure'
    },
    lifeMoment: 'Nightly cellular renewal ritual that absorbs like liquid silk.'
  },
  {
    id: 'reel-5',
    title: 'Nilgiri Rosemary Scalp Massage',
    subtitle: 'Slow-Infused Brahmi, Amla & Kalonji',
    creator: '@herbal.heritage',
    duration: '0:19',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soap-bar-in-water-with-bubbles-43292-large.mp4',
    posterUrl: '/images_ref/Rosmary-2-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_hair_oil',
      title: 'Good Bee Brahmi & Neem Hair Oil',
      price: 750,
      mrp: 890,
      volume: '100 ml',
      image: '/images_ref/Rosmary-2-300x300.webp',
      badge: 'Scalp Vitality'
    },
    lifeMoment: 'Invigorates dormant roots and calms flaky scalps naturally.'
  }
];

export default function ShopByReels({ onQuickViewProduct }) {
  const { addToCart } = useCart();
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);

  const handleOpenModal = (index) => {
    setActiveReelIndex(index);
    setIsModalOpen(true);
    setIsPlaying(true);
  };

  const handleNextReel = (e) => {
    e?.stopPropagation();
    setActiveReelIndex((prev) => (prev + 1) % REELS_DATA.length);
  };

  const handlePrevReel = (e) => {
    e?.stopPropagation();
    setActiveReelIndex((prev) => (prev - 1 + REELS_DATA.length) % REELS_DATA.length);
  };

  const handleInstantAdd = (e, product) => {
    e.stopPropagation();
    const ok = addToCart(product, 1);
    if (ok !== false) {
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1600);
    }
  };

  const currentReel = REELS_DATA[activeReelIndex];

  return (
    <section id="shop-by-reels" className="py-10 sm:py-14 bg-[#FAF7F2] text-[#1A1918] relative overflow-hidden border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Clean Header */}
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1918] font-medium">
            Ritual Stories
          </h2>
          <span className="text-xs font-semibold text-[#5B0868] hidden sm:inline">
            Tap to watch
          </span>
        </div>

        {/* Clean 5-Column Ritual Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {REELS_DATA.map((reel, index) => {
            const product = reel.taggedProduct;
            const isItemAdded = addedId === product.id;
            return (
              <div
                key={reel.id}
                onClick={() => handleOpenModal(index)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-gold/25 bg-white shadow-xs hover:shadow-xl hover:border-[#5B0868]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Framed Square-ish Top Stage */}
                <div className="relative aspect-[4/4.5] overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={reel.posterUrl}
                    alt={reel.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/80 via-[#1A1918]/15 to-transparent" />

                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-[#1A1918]/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                      {reel.duration}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/90 text-[#5B0868] flex items-center justify-center group-hover:bg-[#5B0868] group-hover:text-white transition-colors shadow-sm">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h3 className="font-serif text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                      {reel.title}
                    </h3>
                  </div>
                </div>

                {/* Bottom Tagged Product Strip */}
                <div className="p-2.5 sm:p-3 bg-white flex items-center justify-between gap-2 border-t border-gray-100">
                  <div className="min-w-0">
                    <p className="font-serif text-[11px] font-semibold text-[#1A1918] truncate leading-tight">
                      {product.title.replace('Good Bee ', '')}
                    </p>
                    <div className="flex items-baseline gap-1.5 text-[11px] mt-0.5">
                      <span className="font-bold text-[#1A1918]">₹{product.price}</span>
                      <span className="line-through text-gray-400 text-[9px]">₹{product.mrp}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleInstantAdd(e, product)}
                    className={`p-2 rounded-xl transition-colors flex-shrink-0 shadow-2xs cursor-pointer ${
                      isItemAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#5B0868] hover:bg-[#480653] text-white'
                    }`}
                    title="Add Tagged Formulation to Bag"
                    aria-label={`Add ${product.title} to bag`}
                  >
                    {isItemAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Reel Player Modal */}
      {isModalOpen && currentReel && (
        <div className="fixed inset-0 z-50 bg-[#1A1918]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white text-[#1A1918] hover:bg-purple-50 hover:text-[#5B0868] transition-all shadow-xl cursor-pointer"
            title="Close Reel"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handlePrevReel}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white text-[#1A1918] hover:text-[#5B0868] transition-all shadow-xl cursor-pointer"
            title="Previous Reel"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNextReel}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white text-[#1A1918] hover:text-[#5B0868] transition-all shadow-xl cursor-pointer"
            title="Next Reel"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border-2 border-brand-gold/50 shadow-2xl bg-black flex flex-col justify-between">
            <video
              src={currentReel.videoUrl}
              poster={currentReel.posterUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

            <div className="relative z-10 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-amber-200">
                  {currentReel.creator}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white cursor-pointer"
                  title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
              </div>
            </div>

            <div className="relative z-10 p-4 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 px-2 py-0.5 rounded bg-black/60 border border-white/20 inline-block">
                  {currentReel.taggedProduct.badge}
                </span>
                <h3 className="font-serif text-xl font-semibold leading-tight text-white">
                  {currentReel.title}
                </h3>
                <p className="text-xs text-gray-200 leading-relaxed">
                  "{currentReel.lifeMoment}"
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F2] text-[#1A1918] border border-brand-gold/40 shadow-2xl flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={currentReel.taggedProduct.image}
                    alt={currentReel.taggedProduct.title}
                    className="w-11 h-11 rounded-xl object-cover bg-white border border-brand-gold/25 flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="font-serif text-xs font-bold truncate leading-tight">
                      {currentReel.taggedProduct.title}
                    </p>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="font-bold text-sm text-[#1A1918]">₹{currentReel.taggedProduct.price}</span>
                      <span className="line-through text-[11px] text-gray-400">₹{currentReel.taggedProduct.mrp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onQuickViewProduct?.(currentReel.taggedProduct);
                    }}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-800 hover:text-[#5B0868] cursor-pointer"
                    title="Inspect Specs"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleInstantAdd(e, currentReel.taggedProduct)}
                    className="px-3 py-2 rounded-xl bg-[#5B0868] hover:bg-[#480653] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Bag</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-1">
                {REELS_DATA.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveReelIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeReelIndex === idx ? 'w-6 bg-amber-300' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`Reel ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
