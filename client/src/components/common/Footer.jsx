import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, ArrowUpRight, ShieldCheck, MapPin } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [siteContent, setSiteContent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('goodbee_site_content') || '{}');
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setSiteContent(JSON.parse(localStorage.getItem('goodbee_site_content') || '{}'));
      } catch (e) {}
    };
    window.addEventListener('goodbee_site_content_updated', handleUpdate);
    return () => window.removeEventListener('goodbee_site_content_updated', handleUpdate);
  }, []);

  const cleanPhone = (siteContent.whatsappNumber || '+919963075000').replace(/[^0-9]/g, '');
  const greeting = siteContent.whatsappGreeting || 'Hello Good Bee Concierge, I would like guidance on natural skincare formulations.';

  return (
    <footer className="bg-brand-charcoal text-brand-ivory pt-16 pb-12 border-t border-brand-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Statement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-brand-charcoal-muted/30 items-center">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-1 border border-brand-gold/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                <img
                  src="/assets/goodbee-white-logo.png"
                  alt="Good Bee Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl tracking-[0.2em] font-medium text-brand-ivory">
                  GOOD BEE
                </h3>
                <p className="text-[10px] tracking-widest uppercase text-brand-gold-light">
                  100% Natural Skincare • High-End Research
                </p>
              </div>
            </div>
            <p className="text-xs text-brand-sand/80 max-w-md leading-relaxed font-sans">
              Good Bee develops 100% natural skincare formulations crafted after high-end botanical and active-stabilization research. Harmonizing pure raw ingredients with modern laboratory precision.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-4 items-start lg:items-center justify-end">
            <div className="bg-brand-charcoal-soft border border-brand-gold/25 rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-brand-gold flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold block text-brand-ivory">Batch Purity Protocol</span>
                <span className="text-[11px] text-brand-sand/70">Ethical testing without synthetic fillers</span>
              </div>
            </div>
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full bg-brand-gold text-brand-charcoal text-xs font-bold uppercase tracking-wider hover:bg-brand-gold-light transition-colors flex items-center gap-2"
            >
              <span>Direct Concierge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4-Column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-brand-charcoal-muted/30 text-xs">
          
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-brand-gold-light uppercase">
              Formulations
            </h4>
            <ul className="space-y-2 text-brand-sand/70">
              <li>
                <button onClick={() => onNavigate('shop', { filterCategory: 'Cold Processed Soaps' })} className="hover:text-brand-gold transition-colors">
                  Cold Processed Soaps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filterCategory: 'Pure Essential Oils' })} className="hover:text-brand-gold transition-colors">
                  Pure Essential Oils
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filterCategory: 'Lip & Facial Care' })} className="hover:text-brand-gold transition-colors">
                  Lip & Facial Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filterCategory: 'Botanical Mists' })} className="hover:text-brand-gold transition-colors">
                  Botanical Hydrosol Mists
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-brand-gold-light uppercase">
              Targeted Concerns
            </h4>
            <ul className="space-y-2 text-brand-sand/70">
              <li>
                <button onClick={() => onNavigate('shop', { filterConcern: 'Barrier Repair' })} className="hover:text-brand-gold transition-colors">
                  Barrier Repair
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filterConcern: 'Acne & Blemishes' })} className="hover:text-brand-gold transition-colors">
                  Acne & Blemishes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filterConcern: 'Pigmentation & Tone' })} className="hover:text-brand-gold transition-colors">
                  Pigmentation & Tone
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filterConcern: 'Dryness & Moisture Deficit' })} className="hover:text-brand-gold transition-colors">
                  Moisture Deficit
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-brand-gold-light uppercase">
              Patron Services
            </h4>
            <ul className="space-y-2 text-brand-sand/70">
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-brand-gold transition-colors">
                  My Patron Account
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/919963075000?text=Hello%20Good%20Bee%2C%20I%20would%20like%20to%20track%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors block"
                >
                  Order Tracking & Delivery
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919963075000?text=Hello%20Good%20Bee%20Team%2C%20I%20am%20interested%20in%20Wholesale%20and%20Stockist%20opportunities."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors block"
                >
                  Wholesale & Stockist Inquiries
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('login', { defaultRole: 'ADMIN' })} className="hover:text-brand-gold transition-colors text-brand-sand/50 text-[11px]">
                  Store Admin Access
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-brand-gold-light uppercase">
              Direct Concierge
            </h4>
            <ul className="space-y-2 text-brand-sand/70">
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: {siteContent.whatsappNumber || '+91 99630 75000'}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteContent.supportEmail || 'care@goodbee.in'}`}
                  className="hover:text-brand-gold transition-colors"
                >
                  {siteContent.supportEmail || 'care@goodbee.in'}
                </a>
              </li>
              <li>Web: www.goodbee.in</li>
              <li>{siteContent.operatingHours || 'Mon – Sat: 9:30 AM – 7:00 PM IST'}</li>
              {siteContent.storeAddress && (
                <li className="text-[11px] text-brand-sand/50 pt-1 leading-relaxed">
                  {siteContent.storeAddress}
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Regulatory & Purity Notice */}
        <div className="pt-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-[11px] text-brand-sand/60 gap-4">
          <p>© {new Date().getFullYear()} GOOD BEE Skincare. All rights reserved. 100% Natural Botanical Formulations.</p>
          <p className="max-w-xl text-center sm:text-right">
            Good Bee formulations are derived from 100% natural botanicals and developed after high-end active-stabilization research. Batch specs are independently monitored.
          </p>
        </div>

      </div>
    </footer>
  );
}
