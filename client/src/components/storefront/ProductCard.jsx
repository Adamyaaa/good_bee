import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CRAFT_TAG_BY_CATEGORY = {
  'Cold Processed Soaps': '6-Week Cold Cured • Beeswax',
  'Pure Essential Oils': 'Steam-Distilled • Single Origin',
  'Botanical Mists': 'Pure Hydro-Distillate • Zero Alcohol',
  'Lip & Facial Care': 'Raw Beeswax • Cold-Pressed Oils',
  'Hair & Wellness': 'Slow Botanical Infusion'
};

export default function ProductCard({ product, onViewDetails, idx = 0 }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const effectiveMrp =
    product.mrp && product.mrp > product.price
      ? product.mrp
      : Math.round(product.price * 1.25);

  const discountPercent = Math.round(((effectiveMrp - product.price) / effectiveMrp) * 100);

  const inspirationBadge =
    product.badge ||
    (idx % 3 === 0
      ? 'BESTSELLER'
      : idx % 3 === 1
      ? 'SMALL BATCH'
      : '100% NATURAL');

  const craftLabel = CRAFT_TAG_BY_CATEGORY[product.category] || '100% Natural • Lab Stabilized';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const added = addToCart(product);
    if (added !== false) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1600);
    }
  };

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(product)}
      className="group relative bg-white rounded-2xl border border-brand-gold/25 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#5B0868]/35 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* 1:1 Studio Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-[#FAF7F2]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images_ref/Frankin-300x300.webp';
          }}
        />

        {/* Top Left Craft & Savings Pills */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1 z-10">
          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-[#1A1918]/90 text-white rounded-md shadow-sm">
            {inspirationBadge}
          </span>
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-rose-600 text-white rounded-md shadow-sm">
              SAVE {discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Overlay on Desktop Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails && onViewDetails(product);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/95 text-gray-900 text-xs font-semibold shadow-md hover:bg-purple-50 hover:text-[#5B0868] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Volume Pill */}
        {product.volume && (
          <span className="absolute bottom-2 right-2 text-[9px] font-semibold bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-gray-800 border border-brand-gold/25 shadow-2xs">
            {product.volume.split('/')[0].trim()}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          <h3 className="font-serif text-sm sm:text-[15px] font-semibold text-[#1A1918] leading-snug group-hover:text-[#5B0868] transition-colors line-clamp-2 min-h-[2.4rem]">
            {product.title}
          </h3>

          {/* Verified Rating when present, or Honest Craft Method Proof when unrated */}
          <div className="flex items-center gap-1.5 text-xs">
            {product.reviewsCount && product.reviewsCount > 0 && product.rating ? (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                <span className="font-bold text-[11px] text-gray-900">
                  {Number(product.rating).toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-500">
                  ({product.reviewsCount})
                </span>
              </>
            ) : (
              <span className="text-[10px] text-[#586959] font-semibold flex items-center gap-1 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-[#586959] flex-shrink-0" />
                <span className="truncate">{craftLabel}</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-sm sm:text-base font-bold text-[#1A1918]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {effectiveMrp > product.price && (
              <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                ₹{effectiveMrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#5B0868] hover:bg-[#480653] text-white shadow-xs hover:shadow-md active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
