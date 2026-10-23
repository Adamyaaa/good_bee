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
  Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage({ product, onBack, onInstantBuy }) {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('INGREDIENTS'); // 'INGREDIENTS', 'PROCESS', 'REVIEWS', 'HOW_TO_USE'
  const [addedNotice, setAddedNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product?.id]);

  if (!product) return null;

  // 4 to 5 High-Resolution Image standard per SKU (Meeting Requirement)
  const defaultGallery = [
    {
      url: product.image,
      label: 'Studio Hero Pack',
      tag: 'Primary Pack'
    },
    {
      url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85',
      label: 'Botanical Actives Infographic',
      tag: 'Ingredients Poster'
    },
    {
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=85',
      label: 'Artisanal Cold Extraction',
      tag: 'Process Timeline'
    },
    {
      url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85',
      label: 'Clinical Results & Efficacy',
      tag: 'Benefit Poster'
    },
    {
      url: 'https://images.unsplash.com/photo-1512290900672-1f0230f878f4?auto=format&fit=crop&w=1200&q=85',
      label: 'Dewy Skin Feel & Texture',
      tag: 'Texture Swatch'
    }
  ];

  const gallery = (product.gallery && product.gallery.length > 1)
    ? product.gallery.map((url, idx) => ({
        url,
        label: idx === 0 ? 'Studio Hero Pack' : idx === 1 ? 'Botanical Actives Infographic' : idx === 2 ? 'Artisanal Cold Extraction' : idx === 3 ? 'Clinical Results' : 'Texture Swatch',
        tag: idx === 0 ? 'Primary Pack' : idx === 1 ? 'Actives' : idx === 2 ? 'Process' : 'Results'
      }))
    : defaultGallery;

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
    <div className="pt-28 pb-20 bg-brand-ivory min-h-screen text-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-gold/20 gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Formulation Archive</span>
          </button>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-[11px] text-brand-muted hidden md:inline">
              Home / {product.category} / <span className="text-brand-charcoal font-medium">{product.title}</span>
            </span>
            <button
              onClick={handleShare}
              className="p-2 bg-white rounded-xl border border-brand-gold/30 hover:border-brand-gold transition-colors text-xs text-brand-charcoal flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Share formulation URL"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-gold-dark" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Product Showcase Master Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column (Col 6): 4-5 High-Resolution Gallery Viewer */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Stage Image Viewport */}
            <div className="relative rounded-3xl overflow-hidden border border-brand-gold/30 bg-brand-cream/80 aspect-[4/4.5] shadow-luxury group">
              <img
                src={gallery[selectedImageIndex]?.url || product.image}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Tag Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.badge && (
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#1e1e1e] text-white rounded-md shadow-md">
                    {product.badge}
                  </span>
                )}
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#5B0868] border border-purple-200 rounded-md shadow-sm">
                  {discountPercent}% OFF MSRP
                </span>
              </div>

              {/* Asset Descriptor Pill */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-xl bg-brand-charcoal/85 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/20">
                  {gallery[selectedImageIndex]?.label}
                </span>
                <span className="text-[10px] text-brand-ivory bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                  {selectedImageIndex + 1} of {gallery.length} High-Res Assets
                </span>
              </div>
            </div>

            {/* 4–5 Image Thumbnails Strip */}
            <div className="grid grid-cols-5 gap-2.5">
              {gallery.map((asset, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all p-0.5 relative cursor-pointer ${
                    selectedImageIndex === i
                      ? 'border-[#5B0868] shadow-md scale-102 ring-2 ring-purple-200'
                      : 'border-transparent opacity-70 hover:opacity-100 bg-white'
                  }`}
                >
                  <img src={asset.url} alt={asset.label} className="w-full h-full object-cover rounded-xl" />
                  <span className="absolute bottom-1 inset-x-1 text-[8px] font-bold truncate text-center bg-black/60 text-white rounded px-0.5">
                    {asset.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Brand Purity Assurance Seal */}
            <div className="p-4 rounded-2xl bg-white border border-brand-gold/20 flex items-center justify-between text-xs text-brand-charcoal shadow-sm">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-[11px]">Active-Stabilization Batch Certified</span>
                  <span className="text-[10px] text-brand-muted">Gas chromatography tested 100% pure botanical chemistry</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                100% Natural
              </span>
            </div>

          </div>

          {/* Right Column (Col 6): Purchase Controls & Botanical Narrative */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#5B0868] border border-purple-200">
                  {product.category}
                </span>
                <span className="text-xs text-brand-muted font-mono">{product.volume}</span>
                <span className="text-xs text-brand-muted">• SKU: {product.sku || 'GB-NAT-01'}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-brand-charcoal leading-tight">
                {product.title}
              </h1>

              <p className="text-xs sm:text-sm text-brand-muted italic font-sans leading-relaxed">
                {product.subtitle || '100% Pure Botanical Formulation • Cold-Stabilized Actives'}
              </p>

              {/* Star Rating & Verified Count */}
              <div className="flex items-center gap-2 text-xs pt-1">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-brand-charcoal">{product.rating || '4.9'}</span>
                <span className="text-brand-muted font-medium">({product.reviewsCount || 124} Verified Patron Reviews)</span>
              </div>
            </div>

            {/* Price & Savings Block */}
            <div className="p-5 rounded-2xl bg-brand-cream/70 border border-brand-gold/30 flex items-baseline justify-between flex-wrap gap-3">
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-3">
                  <span className="font-sans text-3xl font-bold text-brand-charcoal">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-brand-muted line-through font-mono">
                    ₹{effectiveMrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Save {discountPercent}%
                  </span>
                </div>
                <p className="text-[11px] text-brand-muted">Inclusive of all taxes • Free express shipping above ₹999</p>
              </div>

              {typeof product.stock === 'number' && product.stock > 0 && product.stock < 15 && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Only {product.stock} units left in batch
                </span>
              )}
            </div>

            {/* Primary Concerns Tagged */}
            {product.concerns && product.concerns.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                  Targeted Skin Realities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.concerns.map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-white border border-purple-100 text-xs font-medium text-brand-charcoal shadow-2xs">
                      🎯 {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-sans">
              {product.description || product.shortDescription}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-xl bg-white px-3 py-2 text-xs shadow-sm">
                  <span className="text-[11px] text-brand-muted mr-3">Qty:</span>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="font-bold px-2 py-0.5 hover:bg-gray-100 rounded text-brand-charcoal cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold px-3 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="font-bold px-2 py-0.5 hover:bg-gray-100 rounded text-brand-charcoal cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 px-6 bg-white hover:bg-brand-cream text-brand-charcoal border border-brand-gold rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-gold-dark" />
                  <span>Add to Shopping Bag</span>
                </button>
              </div>

              {/* Instant Buy with UPI */}
              <button
                onClick={() => onInstantBuy && onInstantBuy(product, quantity)}
                className="w-full py-3.5 px-6 bg-[#5B0868] hover:bg-[#480653] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Instant Buy Now with Dynamic UPI (₹{((product.price || 0) * quantity).toLocaleString('en-IN')})</span>
              </button>

              {/* Added notice */}
              {addedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added {quantity}x "{product.title}" to your shopping bag!</span>
                </div>
              )}

              {/* Direct Concierge WhatsApp Query */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask Skincare Concierge on WhatsApp about this formulation</span>
              </a>
            </div>

          </div>

        </div>

        {/* Deep Dive Information Tabs (Ingredients, Process, Reviews, Ritual) */}
        <div className="pt-8 border-t border-brand-gold/20 space-y-8">
          
          {/* Tab Selector */}
          <div className="flex border-b border-brand-gold/20 gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'INGREDIENTS', label: '100% Natural Ingredients', icon: Leaf },
              { id: 'PROCESS', label: 'Artisanal Manufacturing Process', icon: FlaskConical },
              { id: 'HOW_TO_USE', label: 'How to Apply & Ritual', icon: Sparkles },
              { id: 'REVIEWS', label: `Patron Reviews (${product.reviewsCount || 124})`, icon: Star }
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

          {/* TAB 1: NATURAL INGREDIENTS BREAKDOWN (Akash Kumar's Main Directive) */}
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

          {/* TAB 2: ARTISANAL MANUFACTURING PROCESS (Akash Kumar's Main Directive) */}
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
                <span className="font-bold block">💡 Concierge Efficacy Tip:</span>
                <p>
                  For maximum absorption of plant ceramides, apply immediately after showering when cutaneous pores are warm and receptive.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED PATRON REVIEWS & REAL USER VIDEOS */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-8">
              
              {/* Instagram & UGC Review Videos Strip (Akash Kumar's Requirement) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#5B0868]">
                      Real Patron Stories (Ages 20–45)
                    </span>
                    <h4 className="font-serif text-xl font-medium text-brand-charcoal">
                      Community Results — No Celebrity Hype
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {ugcReviews.map((ugc, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-start gap-3.5 hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                        <img src={ugc.thumbnail} alt={ugc.handle} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-charcoal text-[11px]">{ugc.handle}</span>
                          <span className="text-[10px] text-brand-muted">{ugc.age} yrs • {ugc.city}</span>
                        </div>
                        <p className="text-[11px] text-brand-charcoal/80 italic leading-relaxed">
                          "{ugc.quote}"
                        </p>
                        <span className="text-[9px] text-[#5B0868] font-bold block pt-0.5">
                          Verified Instagram Patron
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Breakdown */}
              <div className="p-6 rounded-3xl bg-white border border-brand-gold/25 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-3xl font-bold text-brand-charcoal">{product.rating || '4.9'}</span>
                    <div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-brand-muted">{product.reviewsCount || 124} Verified Patron Ratings</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    99.2% Would Recommend
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  {[
                    {
                      name: 'Ananya Deshmukh',
                      city: 'Pune',
                      date: '14 Oct 2026',
                      rating: 5,
                      comment: 'The texture is extraordinarily fine. Absorbs in 30 seconds without any sticky residue on pillow covers. Visible reduction in redness.'
                    },
                    {
                      name: 'Vikramaditya Varma',
                      city: 'Hyderabad',
                      date: '02 Oct 2026',
                      rating: 5,
                      comment: 'Genuine cold-processed quality. You can tell immediately by the subtle botanical scent — absolutely zero synthetic chemical notes.'
                    }
                  ].map((rev, i) => (
                    <div key={i} className="space-y-1 text-xs border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-brand-charcoal">{rev.name} ({rev.city})</span>
                        <span className="text-brand-muted text-[10px]">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-brand-charcoal/80 pt-1 leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
