import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, ShieldCheck, Droplets, FlaskConical, MessageCircle, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/storefront/ProductCard';

export default function ProductDetail({ productSlug, onBack, onSelectProduct, onInstantBuy }) {
  const [productData, setProductData] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [addedNotice, setAddedNotice] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);
    fetch(`/api/v1/products/${productSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProductData(data.product);
          setSelectedImage(data.product.image);
          setRelated(data.related || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load product detail', err);
        setLoading(false);
      });
  }, [productSlug]);

  if (loading) {
    return (
      <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-12 h-12 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-brand-muted tracking-widest uppercase">Loading Botanical Formulation...</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl text-brand-charcoal">Formulation not found</h2>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-gold-dark transition-colors"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const p = productData;
  const effectiveMrp = p.mrp && p.mrp > p.price ? p.mrp : Math.round(p.price * 1.25);
  const discountPercent = Math.round(((effectiveMrp - p.price) / effectiveMrp) * 100);

  const handleAddToCart = () => {
    addToCart(p, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const whatsappInquiryUrl = `https://wa.me/919963075000?text=${encodeURIComponent(
    `Hello Good Bee Concierge, I am inquiring regarding the ${p.title} (SKU: ${p.sku || 'N/A'}, ₹${p.price}). Could you provide guidance on its formulation?`
  )}`;

  return (
    <div className="pt-28 sm:pt-36 pb-16 bg-brand-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb / Back button */}
        <div className="flex items-center gap-2 text-xs text-brand-muted">
          <button onClick={onBack} className="hover:text-brand-charcoal flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
          <span>/</span>
          <span>{p.category}</span>
          <span>/</span>
          <span className="text-brand-charcoal font-medium truncate max-w-xs">{p.title}</span>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Gallery Stage (Col 6) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-brand-gold/30 bg-brand-cream/80 aspect-[4/4.5] shadow-luxury">
              <img
                src={selectedImage || p.image}
                alt={p.title}
                className="w-full h-full object-cover object-center"
              />
              {p.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-brand-charcoal text-brand-ivory rounded-lg shadow-sm">
                  {p.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {p.gallery && p.gallery.length > 1 && (
              <div className="flex gap-3">
                {p.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === imgUrl ? 'border-brand-gold shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions Stage (Col 6) */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-cream text-brand-gold-dark border border-brand-gold/20">
                  {p.category}
                </span>
                {p.volume && (
                  <span className="text-xs text-brand-muted font-medium">{p.volume}</span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium leading-tight">
                {p.title}
              </h1>

              <p className="text-sm text-brand-charcoal/80 font-sans italic">
                {p.subtitle}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <div className="flex text-amber-600">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="font-bold text-brand-charcoal">{p.rating || '4.9'}</span>
                <span className="text-brand-muted">({p.reviewsCount || 100} verified patron reviews)</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="p-4 rounded-2xl bg-brand-cream/50 border border-brand-gold/20 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-2xl font-bold text-brand-charcoal">
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-brand-muted line-through">
                  ₹{effectiveMrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded border border-emerald-300/50 uppercase tracking-wider">
                  Save {discountPercent}%
                </span>
              </div>
              <p className="text-[11px] text-brand-muted">
                Price inclusive of all taxes. Free courier delivery across India above ₹999.
              </p>
            </div>

            {/* Low Stock Alert (Only shown when under 10) */}
            {typeof p.stock === 'number' && p.stock > 0 && p.stock < 10 && (
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                <span className="text-xs text-rose-700 font-bold">
                  Only a few units remaining
                </span>
              </div>
            )}

            {/* Target Concerns */}
            {p.concerns && p.concerns.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                  Target Skin Concerns
                </span>
                <div className="flex flex-wrap gap-2">
                  {p.concerns.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 bg-purple-50 text-[#5B0868] text-xs rounded-lg border border-purple-200 font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-sans">
              {p.description || p.shortDescription}
            </p>

            {/* Purchase CTA Row */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                
                {/* Quantity picker */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 font-bold text-brand-charcoal hover:text-[#5B0868] text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-brand-charcoal">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 font-bold text-brand-charcoal hover:text-[#5B0868] text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-white text-brand-charcoal border border-gray-200 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#5B0868]" />
                  <span>Add to Bag</span>
                </button>

                {/* Instant Dynamic QR Buy Now */}
                <button
                  onClick={() => onInstantBuy(p, quantity)}
                  className="px-6 py-3.5 bg-[#5B0868] hover:bg-[#480653] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Direct checkout with dynamic UPI QR"
                >
                  <span>Buy Now</span>
                </button>

              </div>

              {addedNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{quantity} × {p.title} added to your bag.</span>
                </div>
              )}

              {/* Direct WhatsApp Concierge Inquiry */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-transparent border border-emerald-700/30 text-emerald-800 text-xs font-semibold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Consult Skincare Advisor on WhatsApp</span>
              </a>

            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-gold/15 text-xs text-brand-charcoal/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>100% Pure Botanical Origin</span>
              </div>
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-brand-gold" />
                <span>Active-Stabilization Research</span>
              </div>
            </div>

          </div>

        </div>

        {/* Deep Research & Active Composition Tabs */}
        <div className="bg-brand-cream/50 rounded-3xl border border-brand-gold/30 p-8 space-y-6">
          <div className="flex border-b border-brand-gold/20 gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-colors relative whitespace-nowrap ${
                activeTab === 'ingredients' ? 'text-brand-charcoal' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Active Botanical Composition
              {activeTab === 'ingredients' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('ritual')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-colors relative whitespace-nowrap ${
                activeTab === 'ritual' ? 'text-brand-charcoal' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              The Application Ritual
              {activeTab === 'ritual' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-colors relative whitespace-nowrap ${
                activeTab === 'research' ? 'text-brand-charcoal' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Research & Extraction Notes
              {activeTab === 'research' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold" />
              )}
            </button>
          </div>

          <div className="pt-2 text-sm text-brand-charcoal/80 font-sans leading-relaxed">
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <p className="text-xs text-brand-muted">
                  Full disclosed active ingredients. Every extract is cold-stabilized to maintain enzymatic and antioxidant integrity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {p.ingredients &&
                    p.ingredients.map((ing, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-brand-ivory rounded-xl border border-brand-gold/20 flex items-center gap-2.5 text-xs text-brand-charcoal font-medium"
                      >
                        <Droplets className="w-3.5 h-3.5 text-brand-gold-dark flex-shrink-0" />
                        <span>{ing}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'ritual' && (
              <div className="space-y-3 max-w-2xl">
                <h4 className="font-serif text-lg font-semibold text-brand-charcoal">Daily Recommended Ritual</h4>
                <p>{p.ritual || 'Dispense 3–4 drops onto freshly misted skin. Gently press into face and neck until absorbed.'}</p>
                <div className="p-4 rounded-xl bg-brand-sand/40 border border-brand-gold/20 text-xs text-brand-charcoal/80">
                  <span className="font-bold text-brand-gold-dark block mb-1">PRO-TIP:</span>
                  Best applied immediately post-cleansing while skin cells remain receptive to lamellar lipid integration.
                </div>
              </div>
            )}

            {activeTab === 'research' && (
              <div className="space-y-3 max-w-2xl">
                <h4 className="font-serif text-lg font-semibold text-brand-charcoal">Active Stabilization Protocol</h4>
                <p>{p.researchNotes || 'Cold-extracted under nitrogen shield to preserve delicate bio-flavonoids and enzymes.'}</p>
                <p className="text-xs text-brand-muted">
                  Good Bee products undergo rigorous stability audits across differing climatic humectant thresholds.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Formulations Carousel */}
        {related.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="font-serif text-2xl text-brand-charcoal font-semibold">
              Complementary Formulations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onViewDetails={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
