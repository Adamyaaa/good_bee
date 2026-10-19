import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onViewDetails }) {
  const { addToCart } = useCart();

  const effectiveMrp =
    product.mrp && product.mrp > product.price
      ? product.mrp
      : Math.round(product.price * 1.25);

  const discountPercent = Math.round(((effectiveMrp - product.price) / effectiveMrp) * 100);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-200 flex flex-col justify-between">
      
      {/* Top Image Stage */}
      <div className="relative aspect-[4/4.5] overflow-hidden bg-[#FAF7F2]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-[#1e1e1e] text-white rounded-md shadow-sm">
              {product.badge}
            </span>
          )}
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-[#5B0868] border border-purple-200 rounded-md shadow-sm">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onViewDetails(product)}
            className="p-3 bg-white rounded-xl text-brand-charcoal hover:bg-purple-50 hover:text-[#5B0868] transition-colors shadow-md transform translate-y-2 group-hover:translate-y-0 duration-300 cursor-pointer"
            title="Inspect Formulation"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Stamp */}
        {product.volume && (
          <span className="absolute bottom-2.5 right-2.5 text-[10px] font-medium tracking-wider bg-brand-ivory/90 backdrop-blur-sm px-2 py-0.5 rounded text-brand-charcoal border border-brand-gold/20">
            {product.volume}
          </span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="font-serif text-lg font-medium text-brand-charcoal hover:text-brand-gold-dark cursor-pointer transition-colors leading-snug line-clamp-2"
          >
            {product.title}
          </h3>

          {/* 5-Star Rating Below Product */}
          <div className="flex items-center gap-1.5 pt-0.5 text-xs text-brand-charcoal/80">
            <div className="flex items-center text-amber-500 gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="font-bold text-xs text-brand-charcoal">{product.rating || '4.6'}</span>
            <span className="text-[11px] text-brand-muted font-medium">({product.reviewsCount || '97'})</span>
          </div>

          {/* Subtitle / Key Actives */}
          <p className="text-xs text-brand-muted line-clamp-1 font-sans">
            {product.subtitle || product.shortDescription}
          </p>

          {/* Primary Concern Pill & Low Stock Alert */}
          <div className="pt-1 flex items-center justify-between gap-1 flex-wrap">
            {product.concerns && product.concerns.length > 0 && (
              <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 bg-purple-50 text-[#5B0868] font-semibold rounded border border-purple-200">
                {product.concerns[0]}
              </span>
            )}
            {typeof product.stock === 'number' && product.stock > 0 && product.stock < 10 && (
              <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Only a few units remaining
              </span>
            )}
          </div>

          {/* Monthly Sales Proof */}
          <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-800 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span>2,500+ claimed this month</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-lg font-bold text-brand-charcoal">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="font-sans text-xs text-brand-muted line-through">
                ₹{effectiveMrp.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-300/50">
                {discountPercent}% OFF
              </span>
            </div>
            <span className="text-[10px] text-brand-muted block">Inclusive of all taxes</span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-2.5 rounded-xl bg-[#5B0868] hover:bg-[#480653] text-white transition-colors shadow-sm cursor-pointer"
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
