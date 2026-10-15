import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ShoppingBag, Eye, Sparkles, ChevronLeft, ChevronRight, X, Heart, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const REELS_DATA = [
  {
    id: 'reel-1',
    title: 'The Silk Cold-Lather Ritual',
    subtitle: 'Creamy Donkey Milk & Saffron Saponification',
    creator: '@goodbee.rituals',
    duration: '0:18',
    likes: '4.8k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-washing-with-soap-under-water-43286-large.mp4',
    posterUrl: '/images_ref/Donkey-Milk-Soap-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_donkey_milk',
      title: 'Good Bee Donkey Milk & Saffron Soap',
      price: 499,
      mrp: 650,
      image: '/images_ref/Donkey-Milk-Soap-300x300.webp',
      badge: 'Bestseller'
    },
    lifeMoment: 'Post-sun dry skin barrier recovery with raw Kashmir saffron lather.'
  },
  {
    id: 'reel-2',
    title: 'Morning Dew Awakening',
    subtitle: 'Pure Steam-Distilled Pink Lotus Cloud',
    creator: '@botanical.glow',
    duration: '0:14',
    likes: '6.2k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-a-face-tonic-43275-large.mp4',
    posterUrl: '/images_ref/Pink-Lotus-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_pink_lotus',
      title: 'Good Bee Pink Lotus Hydrosol Facial Mist',
      price: 899,
      mrp: 1150,
      image: '/images_ref/Pink-Lotus-300x300.webp',
      badge: 'Hydrosol Mist'
    },
    lifeMoment: 'Instant AC room tightness relief. Zero sticky dermal residue.'
  },
  {
    id: 'reel-3',
    title: '48h Pimple & Breakout Reset',
    subtitle: 'Cold Neem Terpenes & Eucalyptus Active',
    creator: '@skin.science.lab',
    duration: '0:22',
    likes: '8.9k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-cleansing-skin-with-foam-43280-large.mp4',
    posterUrl: '/images_ref/Clear-skin-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_clear_skin',
      title: 'Good Bee Clear Skin Cold Processed Soap',
      price: 449,
      mrp: 599,
      image: '/images_ref/Clear-skin-300x300.webp',
      badge: 'Acne Defense'
    },
    lifeMoment: 'Calms redness, purges congested pores without harsh stinging.'
  },
  {
    id: 'reel-4',
    title: 'One Drop Boswellia Melt',
    subtitle: 'Sacred Frankincense Resin Extract',
    creator: '@pure.aromatherapy',
    duration: '0:16',
    likes: '3.9k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-applying-cosmetic-oil-to-skin-43277-large.mp4',
    posterUrl: '/images_ref/Frankin-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_frankincense',
      title: 'Good Bee Frankincense Pure Essential Oil',
      price: 1450,
      mrp: 1850,
      image: '/images_ref/Frankin-300x300.webp',
      badge: '100% Pure'
    },
    lifeMoment: 'Nightly cell recovery ritual. Absorbs like liquid silk.'
  },
  {
    id: 'reel-5',
    title: 'Traditional Sunnipindi Bath Polish',
    subtitle: 'Raw Ground Botanicals & Forest Beeswax',
    creator: '@herbal.heritage',
    duration: '0:19',
    likes: '5.1k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soap-bar-in-water-with-bubbles-43292-large.mp4',
    posterUrl: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-300x300.webp',
    taggedProduct: {
      id: 'gb_prod_sunnipindi',
      title: 'Good Bee Sunnipindi Cold Processed Soap',
      price: 399,
      mrp: 499,
      image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-300x300.webp',
      badge: 'Artisanal'
    },
    lifeMoment: 'Gentle exfoliating micro-texture that clears dull dead cells.'
  }
];

export default function ShopByReels({ onQuickViewProduct }) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const videoRefs = useRef({});

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
    addToCart(product, 1);
    setToastMessage(`Added ${product.title} to your bag!`);
    setIsDrawerOpen(true);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const currentReel = REELS_DATA[activeReelIndex];

  return (
    <section id="shop-by-reels" className="py-20 bg-brand-charcoal text-brand-ivory relative overflow-hidden border-t border-brand-gold/25">
      {/* Background ambient gold gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-gold/20 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold-light text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin" style={{ animationDuration: '6s' }} />
              <span>Life Moments In Motion</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-ivory font-medium">
              Shop by Reels
            </h2>
            <p className="text-xs sm:text-sm text-brand-sand/80 max-w-xl">
              Watch authentic botanical application rituals, rich cold-cure foam, and natural skin transformations. Tap any reel to inspect & shop tagged formulations live.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="text-xs text-brand-sand/60 hidden sm:inline">Tap to watch vertical format</span>
            <span className="px-2.5 py-1 rounded-full bg-brand-ivory/10 text-brand-gold-light text-xs font-semibold border border-brand-gold/30">
              5 Texture Stories
            </span>
          </div>
        </div>

        {/* 9:16 Vertical Reel Cards Horizontal Feed */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {REELS_DATA.map((reel, index) => {
            const product = reel.taggedProduct;
            return (
              <div
                key={reel.id}
                onClick={() => handleOpenModal(index)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-brand-gold/30 bg-brand-charcoal-soft aspect-[9/16] shadow-luxury hover:shadow-2xl hover:border-brand-gold transition-all duration-400 hover:-translate-y-1 flex flex-col justify-between p-3.5 sm:p-4"
              >
                {/* Background Video Poster / Thumbnail */}
                <img
                  src={reel.posterUrl}
                  alt={reel.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-brand-charcoal/60 group-hover:via-brand-charcoal/30 transition-all" />

                {/* Top Badge Row */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-brand-charcoal/80 backdrop-blur-md border border-brand-gold/30 text-brand-gold-light text-[9px] font-bold uppercase tracking-wider">
                    {reel.duration}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-brand-ivory/20 backdrop-blur-md flex items-center justify-center text-brand-ivory group-hover:bg-brand-gold group-hover:text-brand-charcoal transition-colors shadow">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Middle Play Pulsing Glow */}
                <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-3 py-1.5 rounded-full bg-brand-charcoal/80 backdrop-blur-md border border-brand-gold/60 text-brand-gold-light text-[11px] font-semibold flex items-center gap-1.5 shadow-lg">
                    <Play className="w-3 h-3 fill-brand-gold text-brand-gold" />
                    <span>Watch Ritual</span>
                  </div>
                </div>

                {/* Bottom Content & Tagged Product Pill */}
                <div className="relative z-10 space-y-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-brand-gold font-medium block">{reel.creator}</span>
                    <h3 className="font-serif text-sm sm:text-base font-semibold leading-snug line-clamp-2 text-brand-ivory">
                      {reel.title}
                    </h3>
                    <p className="text-[10px] text-brand-sand/80 line-clamp-1 italic">
                      "{reel.lifeMoment}"
                    </p>
                  </div>

                  {/* Floating Tagged Formulation Pill */}
                  <div className="p-2 rounded-2xl bg-brand-ivory/95 text-brand-charcoal backdrop-blur-md border border-brand-gold/40 shadow-lg flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-8 h-8 rounded-lg object-contain bg-brand-cream border border-brand-gold/30 flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="font-serif text-[11px] font-bold truncate leading-tight">
                          {product.title}
                        </p>
                        <div className="flex items-baseline gap-1.5 text-[10px]">
                          <span className="font-bold text-brand-charcoal">₹{product.price}</span>
                          <span className="line-through text-brand-muted text-[9px]">₹{product.mrp}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleInstantAdd(e, product)}
                      className="p-1.5 rounded-xl bg-brand-charcoal text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal transition-colors flex-shrink-0 shadow"
                      title="Add Tagged Formulation to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Fullscreen Reel Player Modal */}
      {isModalOpen && currentReel && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
          
          {/* Close Backdrop Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-brand-charcoal/80 border border-brand-gold/40 text-brand-ivory hover:text-brand-gold hover:bg-brand-charcoal transition-all shadow-xl"
            title="Close Reel"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows for Desktop */}
          <button
            onClick={handlePrevReel}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-3.5 rounded-full bg-brand-charcoal/80 border border-brand-gold/40 text-brand-ivory hover:text-brand-gold hover:scale-110 transition-all shadow-xl"
            title="Previous Reel"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextReel}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-3.5 rounded-full bg-brand-charcoal/80 border border-brand-gold/40 text-brand-ivory hover:text-brand-gold hover:scale-110 transition-all shadow-xl"
            title="Next Reel"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* 9:16 Reel Player Container */}
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-3xl overflow-hidden border-2 border-brand-gold/50 shadow-2xl bg-black flex flex-col justify-between">
            
            {/* HTML5 Video Element */}
            <video
              ref={(el) => {
                videoRefs.current[currentReel.id] = el;
              }}
              src={currentReel.videoUrl}
              poster={currentReel.posterUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />

            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

            {/* Top Modal Controls */}
            <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-brand-gold-light">
                  {currentReel.creator}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black text-white transition-colors"
                  title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black text-white transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
              </div>
            </div>

            {/* Reel Progress Bar */}
            <div className="relative z-10 px-4 pt-1">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-brand-gold animate-pulse w-3/4 rounded-full" />
              </div>
            </div>

            {/* Bottom Content & Tagged Product Card */}
            <div className="relative z-10 p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold-light px-2 py-0.5 rounded bg-black/50 border border-brand-gold/30 inline-block">
                  {currentReel.taggedProduct.badge}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold leading-tight text-white">
                  {currentReel.title}
                </h3>
                <p className="text-xs text-brand-sand/90 font-light leading-relaxed">
                  "{currentReel.lifeMoment}"
                </p>
              </div>

              {/* Tagged Formulation Box */}
              <div className="p-3.5 rounded-2xl bg-brand-ivory text-brand-charcoal border-2 border-brand-gold shadow-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={currentReel.taggedProduct.image}
                    alt={currentReel.taggedProduct.title}
                    className="w-12 h-12 rounded-xl object-contain bg-brand-cream border border-brand-gold/30 flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="font-serif text-xs font-bold truncate leading-tight">
                      {currentReel.taggedProduct.title}
                    </p>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="font-bold text-sm text-brand-charcoal">₹{currentReel.taggedProduct.price}</span>
                      <span className="line-through text-xs text-brand-muted">₹{currentReel.taggedProduct.mrp}</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                        25% OFF
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onQuickViewProduct?.(currentReel.taggedProduct);
                    }}
                    className="p-2 rounded-xl bg-brand-cream border border-brand-gold/40 text-brand-charcoal hover:bg-brand-gold transition-colors"
                    title="Inspect Specs"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleInstantAdd(e, currentReel.taggedProduct)}
                    className="px-3.5 py-2 rounded-xl bg-brand-charcoal text-brand-gold font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-dark hover:text-brand-ivory transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Bag</span>
                  </button>
                </div>
              </div>

              {/* Reel Navigation Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {REELS_DATA.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveReelIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeReelIndex === idx ? 'w-6 bg-brand-gold' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 border border-emerald-400 text-brand-ivory shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

    </section>
  );
}
