import React, { useState } from 'react';
import { X, Star, ShoppingBag, Sparkles, MessageCircle, ShieldCheck, Droplets, FlaskConical, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductQuickViewModal({ product, onClose, onInstantBuy }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 1500);
  };

  const whatsappInquiryUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello Good Bee Concierge, I am inquiring regarding the ${product.title} (SKU: ${product.sku || 'N/A'}, ₹${product.price}). Could you provide guidance on its formulation?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-brand-ivory rounded-3xl border border-brand-gold/40 shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-brand-charcoal hover:text-brand-gold-dark bg-brand-cream/80 backdrop-blur-sm rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Gallery Col (5) */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-brand-gold/30 bg-brand-cream/80 aspect-[4/4.5] shadow-luxury">
              <img
                src={selectedImage || product.image}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-brand-charcoal text-brand-ivory rounded-md">
                  {product.badge}
                </span>
              )}
            </div>

            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-2">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border ${
                      selectedImage === img ? 'border-brand-gold' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Col (7) */}
          <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-cream text-brand-gold-dark border border-brand-gold/20">
                  {product.category}
                </span>
                <span className="text-xs text-brand-muted">{product.volume}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-brand-charcoal leading-snug">
                {product.title}
              </h2>

              <p className="text-xs text-brand-muted italic font-sans">{product.subtitle}</p>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-amber-600">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="font-bold text-brand-charcoal">{product.rating || '4.9'}</span>
                <span className="text-[11px] text-brand-muted">({product.reviewsCount || 100}+ reviews)</span>
              </div>

              {/* Price Row */}
              <div className="p-3 bg-brand-cream/60 rounded-xl border border-brand-gold/20 flex items-baseline gap-3">
                <span className="font-sans text-xl font-bold text-brand-charcoal">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-xs text-brand-muted line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-bold text-brand-gold-dark uppercase">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              <p className="text-xs text-brand-charcoal/80 leading-relaxed">
                {product.shortDescription || product.description}
              </p>

              {/* Disclosed Actives Snippet */}
              {product.ingredients && (
                <div className="p-3 rounded-xl bg-brand-sand/30 border border-brand-gold/20 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark block">
                    Active Botanical Compounds:
                  </span>
                  <p className="text-xs text-brand-charcoal font-medium">
                    {Array.isArray(product.ingredients) ? product.ingredients.slice(0, 3).join(' • ') : product.ingredients}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t border-brand-gold/20">
              <div className="flex items-center gap-3">
                {/* Qty */}
                <div className="flex items-center border border-brand-gold/40 rounded-full bg-brand-cream px-3 py-1.5 text-xs">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="font-bold px-1.5">-</button>
                  <span className="font-bold px-2.5">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="font-bold px-1.5">+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-gold-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onInstantBuy(product, quantity);
                  }}
                  className="px-5 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold uppercase tracking-wider rounded-full hover:bg-brand-gold-light transition-colors shadow-sm flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

              {addedNotice && (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Item added to your shopping bag.</span>
                </div>
              )}

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-transparent border border-emerald-700/30 text-emerald-800 text-xs font-semibold rounded-full hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Enquire via WhatsApp Concierge</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
