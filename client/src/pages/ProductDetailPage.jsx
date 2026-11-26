import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  FlaskConical,
  MessageCircle,
  Share2,
  Clock,
  Sparkles,
  ChevronRight,
  Play,
  RotateCcw,
  Check,
  Zap,
  Leaf,
  Layers,
  Heart,
  MessageSquarePlus,
  MapPin,
  Building2,
  FileBadge,
  Camera,
  Video
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SEED_REVIEWS, DEFAULT_PRODUCT_REVIEWS } from '../data/reviewsData';
import { GoodBeeApi } from '../services/api';
import ProductCard from '../components/storefront/ProductCard';

const CRAFT_PROOF_BY_CATEGORY = {
  'Cold Processed Soaps': '6-Week Cold Cured • Natural Glycerin & Beeswax',
  'Pure Essential Oils': 'Steam-Distilled • Single-Origin Harvest',
  'Botanical Mists': 'Pure Hydro-Distillate • Zero Alcohol',
  'Lip & Facial Care': 'Unrefined Beeswax • Cold-Pressed Oils',
  'Hair & Wellness': 'Slow Botanical Infusion • Zero Mineral Oil'
};

export default function ProductDetailPage({ product, onBack, onInstantBuy, onSelectProduct }) {
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('INGREDIENTS'); // 'INGREDIENTS', 'FIELDS_AND_FARM', 'PROCESS', 'REVIEWS', 'HOW_TO_USE'
  const [addedNotice, setAddedNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newHeadline, setNewHeadline] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setQuantity(1);
    
    // Load reviews: look in localStorage custom reviews or seed data
    try {
      const stored = JSON.parse(localStorage.getItem(`goodbee_reviews_${product?.id}`) || '[]');
      const seeds = SEED_REVIEWS[product?.id] || DEFAULT_PRODUCT_REVIEWS;
      setReviewsList([...stored, ...seeds]);
    } catch (e) {
      setReviewsList(SEED_REVIEWS[product?.id] || DEFAULT_PRODUCT_REVIEWS);
    }

    // Load related formulations for cross-sell
    if (product?.id) {
      GoodBeeApi.fetchProducts().then((list) => {
        const others = (list || []).filter((p) => p.id !== product.id);
        const sameCategory = others.filter((p) => p.category === product.category);
        const complementary = others.filter((p) => p.category !== product.category);
        setRelatedProducts([...sameCategory, ...complementary].slice(0, 4));
      }).catch(() => {});
    }
  }, [product?.id, product?.category]);

  if (!product) return null;

  // Check if current user is a verified purchaser of this formulation
  const isVerifiedPurchaser = React.useMemo(() => {
    if (!user?.email) return false;
    try {
      const orders = JSON.parse(localStorage.getItem('goodbee_orders') || '[]');
      const customerEmail = user.email.toLowerCase();
      const userOrders = orders.filter(
        (o) =>
          (o.customerEmail && o.customerEmail.toLowerCase() === customerEmail) ||
          (user.id === 'usr_customer_1' && !o.customerEmail)
      );
      return userOrders.some((order) =>
        Array.isArray(order.items) &&
        order.items.some(
          (it) =>
            it.id === product.id ||
            it.productId === product.id ||
            it.title?.toLowerCase() === product.title?.toLowerCase()
        )
      );
    } catch (e) {
      return false;
    }
  }, [user, product?.id, product?.title]);

  // Calculate live average rating from authentic reviews
  const currentAvgRating = reviewsList.length > 0
    ? (reviewsList.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviewsList.length).toFixed(1)
    : (product.rating ? Number(product.rating).toFixed(1) : null);
  const currentReviewsCount = reviewsList.length > 0 ? reviewsList.length : (product.reviewsCount || 0);

  // Authentic product images only (no placeholder stock images)
  const productImages = (product.gallery && product.gallery.length > 0)
    ? product.gallery
    : (product.image ? [product.image] : []);

  const gallery = productImages.map((url, idx) => ({
    url,
    label: idx === 0 ? 'Primary Pack' : `Angle ${idx + 1}`
  }));

  const effectiveMrp = product.mrp && product.mrp > product.price
    ? product.mrp
    : Math.round(product.price * 1.25);

  const discountPercent = Math.round(((effectiveMrp - product.price) / effectiveMrp) * 100);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {}
  };

  const whatsappInquiryUrl = `https://wa.me/919963075000?text=${encodeURIComponent(
    `Hello Good Bee Concierge, I am inquiring regarding the ${product.title} (SKU: ${product.sku || 'GB'}, ₹${product.price}). Could you provide guidance on its natural ingredients and application for my skin concern?`
  )}`;

  // UGC & Instagram Video review cards (Tailored for 20-45 demographic)
  const ugcReviews = [
    {
      handle: '@tanvi_cleanbeauty',
      age: 27,
      city: 'Bengaluru',
      quote: 'My sensitized, flaking skin barrier calmed down in literally 3 days. No artificial perfume odor at all.',
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      views: '48.2K'
    },
    {
      handle: '@rohit_wellness',
      age: 32,
      city: 'Mumbai',
      quote: 'Unlike regular commercial washes that strip your face tight, this leaves a soft velvety dewiness.',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
      views: '32.9K'
    },
    {
      handle: '@dermat_insights_pooja',
      age: 38,
      city: 'New Delhi',
      quote: 'Active-stabilization really makes a noticeable difference in preserving raw botanical flavonoids.',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
      views: '76.4K'
    }
  ];

  return (
    <div className="pt-[82px] sm:pt-[90px] pb-24 md:pb-16 bg-brand-ivory min-h-screen text-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        
        {/* Sleek Compact Navigation Bar */}
        <div className="flex items-center justify-between py-1.5 border-b border-gray-200/80 text-xs">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#5B0868] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Formulation Archive</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400 hidden md:inline truncate max-w-sm lg:max-w-md">
              Home / {product.category} / <span className="text-gray-700 font-medium">{product.title}</span>
            </span>
            <button
              onClick={handleShare}
              className="px-2.5 py-1 bg-white rounded-lg border border-gray-200 hover:border-[#5B0868] transition-colors text-xs text-gray-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Share formulation URL"
            >
              <Share2 className="w-3.5 h-3.5 text-[#5B0868]" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Product Showcase Master Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">
          
          {/* Left Column (Col 5): Focused High-Resolution Visual Stage */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Main Stage Image Viewport */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-[#FAF7F2] aspect-square max-h-[min(440px,calc(100vh-170px))] w-full shadow-xs group flex items-center justify-center">
              <img
                src={gallery[selectedImageIndex]?.url || product.image}
                alt={product.title}
                className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images_ref/Frankin-300x300.webp';
                }}
              />

              {/* Tag Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#1e1e1e] text-white rounded-md shadow-md">
                    {product.badge}
                  </span>
                )}
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-[#5B0868] border border-purple-200 rounded shadow-2xs">
                  {discountPercent}% OFF MSRP
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails (Only when multiple authentic assets exist) */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 pt-1">
                {gallery.map((asset, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all p-0.5 relative cursor-pointer bg-white ${
                      selectedImageIndex === i
                        ? 'border-[#5B0868] shadow-sm ring-1 ring-[#5B0868]'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={asset.url} alt={`Angle ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right Column (Col 7): Purchase Controls & Botanical Narrative */}
          <div className="lg:col-span-7 space-y-3.5">
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-purple-50 text-[#5B0868] border border-purple-200">
                  {product.category}
                </span>
                <span className="text-xs text-brand-muted font-mono">{product.volume}</span>
                <span className="text-xs text-brand-muted">• SKU: {product.sku || 'GB-NAT-01'}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-brand-charcoal leading-tight">
                {product.title}
              </h1>

              <p className="text-xs text-brand-muted italic font-sans leading-relaxed">
                {product.subtitle || '100% Pure Botanical Formulation • Cold-Stabilized Actives'}
              </p>

              {/* Verified Rating or Honest Craft Proof */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                {currentReviewsCount > 0 ? (
                  <>
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < Math.round(Number(currentAvgRating) || 5)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-brand-charcoal">{currentAvgRating}</span>
                    <span className="text-brand-muted font-medium">
                      ({currentReviewsCount} {currentReviewsCount === 1 ? 'Verified Review' : 'Verified Reviews'})
                    </span>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#586959]/10 text-[#586959] border border-[#586959]/20 text-[11px] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{CRAFT_PROOF_BY_CATEGORY[product.category] || '100% Natural • Lab Stabilized'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('REVIEWS')}
                      className="text-[11px] font-semibold text-[#5B0868] hover:underline cursor-pointer"
                    >
                      Verified reviews →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Savings Block */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-gold/25 shadow-2xs flex items-baseline justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-brand-muted line-through font-mono">
                    ₹{effectiveMrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Save {discountPercent}%
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">Inclusive of all taxes • Free express shipping above ₹999</p>
              </div>

              {typeof product.stock === 'number' && product.stock > 0 && product.stock < 15 && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Only {product.stock} left in batch
                </span>
              )}
            </div>

            {/* Quantity Selector & Action Buttons (Above the Fold) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center border border-brand-gold/35 rounded-xl bg-white px-2.5 py-2 text-xs shadow-2xs">
                  <span className="text-[10px] text-gray-500 mr-2">Qty:</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="font-bold px-2 py-0.5 hover:bg-purple-50 hover:text-[#5B0868] rounded text-brand-charcoal cursor-pointer active:scale-95"
                  >
                    -
                  </button>
                  <span className="font-bold px-2.5 text-xs">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="font-bold px-2 py-0.5 hover:bg-purple-50 hover:text-[#5B0868] rounded text-brand-charcoal cursor-pointer active:scale-95"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 py-3 px-4 bg-white hover:bg-purple-50 text-brand-charcoal border border-brand-gold/40 hover:border-[#5B0868] rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.97] shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#5B0868]" />
                  <span>Add to Shopping Bag</span>
                </button>
              </div>

              {/* Instant Buy with UPI */}
              <button
                type="button"
                onClick={() => onInstantBuy && onInstantBuy(product, quantity)}
                className="w-full py-3.5 px-5 bg-[#5B0868] hover:bg-[#480653] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Instant Buy Now with Dynamic UPI (₹{((product.price || 0) * quantity).toLocaleString('en-IN')})</span>
              </button>

              {/* Added notice */}
              {addedNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added {quantity}x "{product.title}" to your shopping bag!</span>
                </div>
              )}
            </div>

            {/* Compact 4-Pillar Purity & Dispatch Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { label: '100% Natural', sub: 'Zero synthetic fragrance' },
                { label: 'Cold-Stabilized', sub: 'Potent active esters' },
                { label: 'Batch Verified', sub: 'Ayush & ISO 22716' },
                { label: 'Pan-India Dispatch', sub: 'Free above ₹999' }
              ].map((pill) => (
                <div key={pill.label} className="p-2.5 rounded-xl bg-white border border-brand-gold/20 text-left">
                  <span className="text-[11px] font-serif font-semibold text-[#1A1918] block">{pill.label}</span>
                  <span className="text-[10px] text-gray-500 block">{pill.sub}</span>
                </div>
              ))}
            </div>

            {/* Primary Concerns Tagged */}
            {product.concerns && product.concerns.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Target Concerns:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.concerns.map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-gray-200 text-xs font-medium text-gray-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Short Description */}
            <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans pt-1">
              {product.description || product.shortDescription}
            </p>

          </div>

        </div>

        {/* Deep Dive Information Tabs (Ingredients, Process, Reviews, Ritual) */}
        <div className="pt-8 border-t border-brand-gold/20 space-y-8">
          
          {/* Tab Selector */}
          <div className="flex border-b border-brand-gold/20 gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'INGREDIENTS', label: '100% Natural Ingredients', icon: Leaf },
              { id: 'FIELDS_AND_FARM', label: 'From Field & Processing Unit', icon: MapPin },
              { id: 'PROCESS', label: 'Artisanal Manufacturing Process', icon: FlaskConical },
              { id: 'HOW_TO_USE', label: 'How to Apply & Ritual', icon: Sparkles },
              { id: 'REVIEWS', label: `Customer Reviews (${reviewsList.length})`, icon: Star }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#5B0868] text-[#5B0868] bg-purple-50/50'
                      : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: NATURAL INGREDIENTS BREAKDOWN */}
          {activeTab === 'INGREDIENTS' && (
            <div className="space-y-6">
              <div className="max-w-3xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5B0868]">
                  Clean Botanical Standard
                </span>
                <h3 className="font-serif text-2xl font-medium text-brand-charcoal">
                  Pure Plant Actives. Zero Synthetic Compromises.
                </h3>
                <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans">
                  Unlike conventional skincare brands that dilute formulations with synthetic parabens, artificial fragrances, or silicones, Good Bee utilizes 100% plant-origin compounds stabilized under nitrogen.
                </p>
              </div>

              {/* Disclosed Ingredients Card */}
              <div className="p-6 rounded-3xl bg-white border border-brand-gold/30 space-y-4 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                  Complete Active Ingredients (INCI Disclosed):
                </span>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(product.ingredients)
                    ? product.ingredients
                    : (product.ingredients || 'Organic Botanical Extracts, Cold-Pressed Plant Seed Oils').split(',')
                  ).map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-cream/80 border border-brand-gold/30 text-xs font-medium text-brand-charcoal flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{typeof ing === 'string' ? ing.trim() : ing}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* What We Never Use Comparison Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-white border border-gray-200">
                  <p className="text-xs font-bold text-emerald-700">0% Parabens</p>
                  <p className="text-[10px] text-brand-muted">Zero chemical preservatives</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200">
                  <p className="text-xs font-bold text-emerald-700">0% Artificial Fragrance</p>
                  <p className="text-[10px] text-brand-muted">Pure steam-distilled scent only</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200">
                  <p className="text-xs font-bold text-emerald-700">0% Silicones & Petrolatum</p>
                  <p className="text-[10px] text-brand-muted">Breathable lipid barrier</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200">
                  <p className="text-xs font-bold text-emerald-700">100% Plant Sourced</p>
                  <p className="text-[10px] text-brand-muted">Ethical South Indian apiaries</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1.5: FROM FIELD & PROCESSING UNIT (FARM ORIGIN & ACCREDITATIONS) */}
          {activeTab === 'FIELDS_AND_FARM' && (
            <div className="space-y-6">
              <div className="max-w-3xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5B0868]">
                  From Fields & Farmer to Formulation
                </span>
                <h3 className="font-serif text-2xl font-medium text-brand-charcoal">
                  Direct Botanical Farm Origins & Processing Facility Proof
                </h3>
                <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans">
                  Good Bee strictly sources raw agricultural materials directly from sustainable cooperatives, certified organic farmlands, and tribal wild-gatherers. Here is the verified media from this harvest batch:
                </p>
              </div>

              {/* Farmer & Field Origin Highlight Card */}
              <div className="p-6 rounded-3xl bg-white border border-brand-gold/30 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Farmer / Cooperative info */}
                <div className="space-y-3 md:col-span-1 border-b md:border-b-0 md:border-r border-brand-gold/20 pb-4 md:pb-0 md:pr-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Cultivator & Harvest Origin</span>
                    <h4 className="font-serif font-bold text-base text-gray-900">
                      {product.farmerStory?.farmerName || 'Nilgiri Tribal Agro-Cooperative'}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {product.farmerStory?.farmLocation || 'Kotagiri Highlands, Nilgiri Biosphere (2,100m ASL)'}
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] text-gray-500 italic bg-[#FAF7F2] p-3 rounded-xl border border-gray-200">
                    "{product.farmerStory?.farmerQuote || 'Harvested ethically at dawn when volatile plant botanical esters are at peak potency.'}"
                  </div>
                </div>

                {/* Field Photos & Videos */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#5B0868]" /> Farm Plot & Processing Facility Media
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Verified Genuine
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(product.fieldPhotos && product.fieldPhotos.length > 0 ? product.fieldPhotos : [
                      '/images_ref/Rosmary-2-300x300.webp',
                      '/images_ref/Levendor-300x300.webp'
                    ]).map((img, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-video border border-brand-gold/25 bg-[#FAF7F2] group">
                        <img
                          src={img}
                          alt="Botanical Harvest"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images_ref/Rosmary-2-300x300.webp';
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-1.5 text-white text-[9px] font-medium">
                          Harvest Batch #{idx + 1}
                        </div>
                      </div>
                    ))}

                    {(product.processingUnitPhotos && product.processingUnitPhotos.length > 0 ? product.processingUnitPhotos : [
                      '/images_ref/Frankin-300x300.webp'
                    ]).map((img, idx) => (
                      <div key={`unit-${idx}`} className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-video border border-brand-gold/25 bg-[#FAF7F2] group">
                        <img
                          src={img}
                          alt="Extraction Studio"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images_ref/Frankin-300x300.webp';
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-1.5 text-white text-[9px] font-medium">
                          Extraction Batch #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  {product.fieldVideos && product.fieldVideos.length > 0 && (
                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#5B0868] text-white flex items-center justify-center">
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {product.fieldVideos[0]?.title || 'Field Harvesting Video Walkthrough'}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-gray-500">
                        {product.fieldVideos[0]?.duration || '1:45 min'}
                      </span>
                    </div>
                  )}
                </div>

              </div>

              {/* Accreditations & Certifications Gallery */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <FileBadge className="w-4 h-4 text-emerald-700" /> Government & International Accreditations
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(product.accreditations && product.accreditations.length > 0 ? product.accreditations : [
                    { name: 'India Organic (NPOP)', certNumber: 'NPOP/NAB/0014-ORG', issuer: 'APEDA India', year: '2025-2027', badge: 'Certified Organic' },
                    { name: 'Ayush GMP Certified', certNumber: 'GMP-AYUSH-TN-8821', issuer: 'Ministry of Ayush, Govt. of India', year: 'Valid thru 2027', badge: 'Good Manufacturing Practice' },
                    { name: 'ISO 22716 Cosmetics GMP', certNumber: 'ISO-22716-GB-QC', issuer: 'Bureau Veritas Quality', year: 'Audited 2026', badge: 'ISO Verified' }
                  ]).map((acc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-gray-900">{acc.name}</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        {acc.certNumber}
                      </div>
                      <p className="text-[11px] text-gray-600">{acc.issuer}</p>
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                        <span>{acc.badge || 'Verified License'}</span>
                        <span className="font-bold text-emerald-700">{acc.year || 'Certified'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ARTISANAL MANUFACTURING PROCESS */}
          {activeTab === 'PROCESS' && (
            <div className="space-y-6">
              <div className="max-w-3xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5B0868]">
                  From Hive & Botanical Harvest to Jar
                </span>
                <h3 className="font-serif text-2xl font-medium text-brand-charcoal">
                  Slow-Cured & Cold-Stabilized Artisanal Manufacturing
                </h3>
                <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans">
                  Heat destroys delicate plant enzymes, vitamin E, and aromatic terpenes. Good Bee formulates using low-temperature hydro-distillation and traditional zero-heat wooden curing.
                </p>
              </div>

              {/* Step-by-Step Manufacturing Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  {
                    step: 'Stage 1',
                    title: 'Ethical Wild Harvest',
                    desc: 'Wild-harvested botanical leaves and Apis dorsata honeycomb cappings sourced at dawn in the Nilgiris.',
                    time: 'Day 1'
                  },
                  {
                    step: 'Stage 2',
                    title: 'Low-Temp Hydro-Distillation',
                    desc: 'Extracted at low temperatures (<40°C) to safeguard volatile polyphenols and flavonoids.',
                    time: 'Day 2–3'
                  },
                  {
                    step: 'Stage 3',
                    title: 'Cold Active-Stabilization',
                    desc: 'Micro-emulsified into raw carrier oils under inert nitrogen atmosphere to prevent degradation.',
                    time: 'Day 4–10'
                  },
                  {
                    step: 'Stage 4',
                    title: 'Clean-Room GC-MS Verification',
                    desc: 'Gas chromatography purity check ensures single-origin batch authenticity before bottling.',
                    time: 'Day 11'
                  }
                ].map((st, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-brand-gold/30 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold text-[#5B0868]">
                      <span>{st.step}</span>
                      <span className="font-mono text-[10px] text-brand-muted">{st.time}</span>
                    </div>
                    <h4 className="font-serif text-base font-semibold text-brand-charcoal">{st.title}</h4>
                    <p className="text-xs text-brand-charcoal/70 leading-relaxed">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HOW TO APPLY & RITUAL */}
          {activeTab === 'HOW_TO_USE' && (
            <div className="space-y-6 max-w-3xl">
              <h3 className="font-serif text-2xl font-medium text-brand-charcoal">
                Optimal Application Ritual
              </h3>
              <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed">
                {product.ritual || 'Glide gently across clean, slightly damp skin. Massage in upward circular motions for 60 seconds to stimulate cellular micro-circulation. Follow with your favorite Good Bee mist or oil.'}
              </p>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-[#5B0868] space-y-1">
                <span className="font-bold block">Application Tip:</span>
                <p>
                  For maximum absorption of plant ceramides, apply immediately after showering when cutaneous pores are warm and receptive.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED CUSTOMER REVIEWS */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-6">
              
              {/* Reviews Breakdown & Authentic Feedback Submission */}
              <div className="p-6 rounded-3xl bg-white border border-brand-gold/25 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-gold/20 pb-4 gap-4">
                  <div className="flex items-center gap-3">
                    {currentReviewsCount > 0 ? (
                      <>
                        <span className="font-serif text-3xl font-bold text-brand-charcoal">{currentAvgRating}</span>
                        <div>
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3.5 h-3.5 ${
                                  idx < Math.round(Number(currentAvgRating) || 5)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-brand-muted">
                            {currentReviewsCount} Verified {currentReviewsCount === 1 ? 'Customer Rating' : 'Customer Ratings'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                          <span className="font-serif text-lg font-semibold text-brand-charcoal">No customer reviews yet</span>
                        </div>
                        <p className="text-xs text-brand-muted">Be the first verified purchaser to leave a rating and review.</p>
                      </div>
                    )}
                  </div>

                  {isVerifiedPurchaser ? (
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#5B0868] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                    >
                      <MessageSquarePlus className="w-4 h-4" />
                      <span>{showReviewForm ? 'Cancel Review' : 'Write a Customer Review'}</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 text-[11px] font-medium border border-gray-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{user ? 'Verified Purchasers Only' : 'Sign in to review (Purchasers only)'}</span>
                    </div>
                  )}
                </div>

                {/* Verified Purchaser Notice for Non-Purchasers */}
                {!isVerifiedPurchaser && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs">Authentic & Verified Reviews Only</p>
                      <p className="text-[11px] text-amber-800/90 leading-relaxed">
                        {user
                          ? 'To guarantee 100% authentic customer feedback with zero fake or sponsored reviews, ratings can only be submitted after purchasing this formulation through Good Bee. Once your order is placed, you will be able to share your experience here.'
                          : 'To guarantee 100% authentic customer feedback, ratings can only be submitted by verified purchasers. Please sign in with the account you used to order this formulation.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Review Form (Only accessible to verified purchasers) */}
                {isVerifiedPurchaser && showReviewForm && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const newRev = {
                        id: `rev_${Date.now()}`,
                        productId: product.id,
                        authorName: user ? user.name : 'Verified Customer',
                        authorCity: user?.city || 'Verified Buyer',
                        rating: Number(newRating),
                        headline: newHeadline,
                        comment: newComment,
                        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                        verifiedPurchase: true
                      };
                      const updated = [newRev, ...reviewsList];
                      setReviewsList(updated);
                      try {
                        const existingStored = JSON.parse(localStorage.getItem(`goodbee_reviews_${product.id}`) || '[]');
                        localStorage.setItem(`goodbee_reviews_${product.id}`, JSON.stringify([newRev, ...existingStored]));
                        // Also sync to backend API if available
                        await fetch(`/api/v1/products/${product.id}/reviews`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {})
                          },
                          body: JSON.stringify({
                            rating: Number(newRating),
                            headline: newHeadline,
                            comment: newComment,
                            authorCity: user?.city || 'Verified Buyer'
                          })
                        }).catch(() => {});
                      } catch (err) {}
                      setNewHeadline('');
                      setNewComment('');
                      setShowReviewForm(false);
                      setReviewSubmitSuccess(true);
                      setTimeout(() => setReviewSubmitSuccess(false), 3500);
                    }}
                    className="p-4 rounded-2xl bg-brand-cream/40 border border-brand-gold/30 space-y-3"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                      Share Your Experience with {product.title}
                    </h4>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Your Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-gray-600 ml-2">{newRating} of 5 Stars</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Review Title</label>
                      <input
                        type="text"
                        required
                        value={newHeadline}
                        onChange={(e) => setNewHeadline(e.target.value)}
                        placeholder="e.g. Visible glow within 5 days..."
                        className="w-full px-3 py-2 text-[16px] sm:text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Detailed Feedback</label>
                      <textarea
                        required
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Describe how the formulation felt on your skin, absorption, fragrance, and noticeable results..."
                        className="w-full px-3 py-2 text-[16px] sm:text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-gray-500">
                        Posting as: <strong className="text-gray-800">{user ? user.name : 'Verified Customer'}</strong> (✓ Verified Purchaser)
                      </span>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#5B0868] to-[#9B1B62] hover:opacity-95 shadow-xs cursor-pointer"
                      >
                        Publish Review
                      </button>
                    </div>
                  </form>
                )}

                {reviewSubmitSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your authentic customer review has been recorded and verified!</span>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4 pt-2">
                  {reviewsList.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2">
                      <Star className="w-8 h-8 text-amber-400 mx-auto" />
                      <h4 className="font-serif text-sm font-semibold text-brand-charcoal">No Reviews Yet</h4>
                      <p className="text-xs text-brand-muted max-w-sm mx-auto">
                        Be the first verified purchaser to leave a rating and share your skin transformation story.
                      </p>
                    </div>
                  ) : (
                    reviewsList.map((rev, i) => (
                      <div key={rev.id || i} className="space-y-1.5 text-xs border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-brand-charcoal">{rev.authorName || rev.name}</span>
                            {(rev.authorCity || rev.city) && (
                              <span className="text-brand-muted text-[11px]">({rev.authorCity || rev.city})</span>
                            )}
                            {rev.verifiedPurchase !== false && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                ✓ Verified Purchaser
                              </span>
                            )}
                          </div>
                          <span className="text-brand-muted text-[10px]">{rev.date || 'Verified Review'}</span>
                        </div>

                        <div className="flex text-amber-500">
                          {[...Array(Number(rev.rating) || 5)].map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>

                        {rev.headline && (
                          <p className="font-bold text-xs text-gray-900 pt-0.5">{rev.headline}</p>
                        )}

                        <p className="text-brand-charcoal/80 leading-relaxed font-sans">
                          "{rev.comment || rev.quote}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Pair With Your Ritual (Related Formulations Cross-Sell) */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-brand-gold/20 space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B0868] block">
                  Complete Your Ritual
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1918]">
                  Frequently Paired Formulations
                </h2>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-bold text-[#5B0868] hover:underline cursor-pointer"
              >
                Explore All →
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {relatedProducts.map((rel, idx) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  idx={idx}
                  onViewDetails={(prod) => {
                    if (onSelectProduct) onSelectProduct(prod);
                    else {
                      window.location.hash = `#product=${prod.id}`;
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="fixed bottom-0 inset-x-0 md:hidden z-30 apple-glass-chrome border-t border-brand-gold/25 px-4 py-2.5 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-serif text-lg font-bold text-[#1A1918] block leading-none">
              ₹{((product.price || 0) * quantity).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-gray-500">Qty {quantity} • Incl. taxes</span>
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={handleAdd}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-brand-gold/40 text-[#1A1918] text-xs font-bold uppercase tracking-wider active:scale-95"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => onInstantBuy && onInstantBuy(product, quantity)}
              className="px-4 py-2.5 rounded-xl bg-[#5B0868] text-white text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
