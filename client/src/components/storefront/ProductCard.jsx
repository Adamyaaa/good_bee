import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onViewDetails, idx = 0 }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const effectiveMrp =
    product.mrp && product.mrp > product.price
      ? product.mrp
      : Math.round(product.price * 1.25);

  const discountPercent = Math.round(((effectiveMrp - product.price) / effectiveMrp) * 100);

  // Nat Habit Style Motivation Badges (Best Seller, Frequently Bought, Most Loved)
  const inspirationBadge =
    product.badge ||
    (idx % 3 === 0
      ? 'BEST SELLER'
      : idx % 3 === 1
      ? 'FREQUENTLY BOUGHT'
      : 'MOST LOVED');

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(product)}
      className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* 1:1 Aspect Square Product Image Stage (Matches Nat Habit & Native 300x300 Resolution) */}
      <div className="relative aspect-square overflow-hidden bg-[#FAF7F2]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Nat Habit Inspired Dark Pill Badges Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-[#1e1e1e] text-white rounded shadow-sm">
            {inspirationBadge}
          </span>
          {discountPercent > 0 && (
            <span className="px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase bg-rose-600 text-white rounded shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails && onViewDetails(product);
            }}
            className="px-3 py-1.5 rounded-lg bg-white/95 text-gray-800 text-xs font-semibold shadow-md hover:bg-purple-50 hover:text-[#5B0868] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Volume Stamp */}
        {product.volume && (
          <span className="absolute bottom-2 right-2 text-[9px] font-medium bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-gray-700 border border-gray-200">
            {product.volume}
          </span>
        )}
      </div>

      {/* Card Content (Nat Habit Style Clean Editorial Layout) */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1">
          {/* Title */}
          <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1e1e1e] leading-snug group-hover:text-[#5B0868] transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Subtitle / Key Actives */}
          <p className="text-[11px] sm:text-xs text-gray-500 font-sans line-clamp-1 leading-normal">
            {product.subtitle || product.shortDescription}
          </p>

          {/* 5-Star Rating Below Product */}
          <div className="flex items-center gap-1 pt-0.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-[11px] text-gray-900">
              {product.rating || '4.8'}
            </span>
            <span className="text-[10px] text-gray-500">
              ({product.reviewsCount || '97'})
            </span>
          </div>

          {/* Primary Concern Pill & Stock */}
          <div className="pt-0.5 flex items-center justify-between gap-1 flex-wrap">
            {product.concerns && product.concerns.length > 0 && (
              <span className="inline-block text-[9px] uppercase tracking-wider px-2 py-0.5 bg-purple-50 text-[#5B0868] font-semibold rounded border border-purple-200">
                {product.concerns[0]}
              </span>
            )}
            {typeof product.stock === 'number' && product.stock > 0 && product.stock < 10 && (
              <span className="text-[9px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                Low batch stock
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-sm sm:text-base font-bold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {effectiveMrp > product.price && (
                <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                  ₹{effectiveMrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] text-gray-400 block">Inclusive of taxes</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-1 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#5B0868] hover:bg-[#480653] text-white shadow-xs hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
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
