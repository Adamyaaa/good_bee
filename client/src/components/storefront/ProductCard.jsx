import React from 'react';
import { Star, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onViewDetails }) {
  const { addToCart } = useCart();

  const effectiveMrp =
    product.mrp && product.mrp > product.price
      ? product.mrp
      : Math.round(product.price * 1.25);

  const discountPercent = Math.round(((effectiveMrp - product.price) / effectiveMrp) * 100);

  return (
    <div className="group relative bg-brand-ivory rounded-2xl border border-brand-gold/25 overflow-hidden transition-all duration-400 hover:shadow-luxury hover:border-brand-gold flex flex-col justify-between">
      
      {/* Top Image Stage */}
      <div className="relative aspect-[4/4.5] overflow-hidden bg-brand-cream/60">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-brand-charcoal text-brand-ivory rounded-md shadow-sm">
              {product.badge}
            </span>
          )}
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-brand-gold text-brand-charcoal rounded-md shadow-sm">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-brand-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onViewDetails(product)}
            className="p-3 bg-brand-ivory rounded-full text-brand-charcoal hover:bg-brand-gold transition-colors shadow-md transform translate-y-2 group-hover:translate-y-0 duration-300"
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

          {/* Primary Concern Pill */}
          {product.concerns && product.concerns.length > 0 && (
            <div className="pt-1">
              <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 bg-brand-cream text-brand-gold-dark font-semibold rounded border border-brand-gold/20">
                {product.concerns[0]}
              </span>
            </div>
          )}
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
            className="p-2.5 rounded-full bg-brand-charcoal text-brand-ivory hover:bg-brand-gold-dark transition-colors shadow-sm"
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
