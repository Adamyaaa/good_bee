import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUpRight, ShieldCheck, MapPin } from 'lucide-react';
import SocialLinksRow from './SocialIcons';

export default function Footer({ onNavigate, onOpenTrackOrder }) {
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

  const rawNumber = siteContent.whatsappNumber;
  const phoneNumber = (!rawNumber || rawNumber.includes('987654')) ? '+91-9963075000' : rawNumber;
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const greeting = siteContent.whatsappGreeting || 'Hello Good Bee Concierge, I would like guidance on natural skincare formulations.';

  return (
    <footer className="bg-brand-charcoal text-brand-ivory pt-16 pb-12 border-t border-brand-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Statement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-brand-charcoal-muted/30 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-auto sm:h-14 flex items-center justify-center flex-shrink-0">
                <img
                  src="/assets/goodbee-bee-mark.png"
                  alt="Good Bee Emblem"
                  className="h-full w-auto object-contain filter invert brightness-200"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-serif text-3xl sm:text-4xl tracking-[0.22em] font-medium text-brand-ivory leading-none">
                  GOOD BEE
                </h3>
                <p className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-brand-gold-light font-sans font-medium mt-1.5 leading-none">
                  100% Natural Skincare • Research-Driven
                </p>
              </div>
            </div>
            <p className="text-xs text-brand-sand/80 max-w-md leading-relaxed font-sans">
              Good Bee develops 100% natural skincare formulations crafted after high-end botanical and active-stabilization research. Harmonizing pure raw ingredients with modern laboratory precision.
            </p>
            <div className="pt-1">
              <span className="text-[10px] uppercase tracking-widest text-brand-gold-light/90 block mb-2 font-semibold">Connect with Good Bee:</span>
              <SocialLinksRow iconClassName="w-4 h-4" />
            </div>
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
              Partner Ecosystem
            </h4>
            <ul className="space-y-2 text-brand-sand/70">
              <li>
                <button onClick={() => onNavigate('login', { defaultRole: 'CUSTOMER' })} className="hover:text-brand-gold transition-colors text-left">
                  Good Being Club (Patrons)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login', { defaultRole: 'DEALER' })} className="hover:text-brand-gold transition-colors text-left flex items-center gap-1.5">
                  <span>Wholesale & Stockist Desk</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-300 font-mono">B2B</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login', { defaultRole: 'PRODUCER' })} className="hover:text-brand-gold transition-colors text-left flex items-center gap-1.5">
                  <span>Vendor & Botanical Suppliers</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300">LAB</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenTrackOrder?.()}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Order Tracking & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login', { defaultRole: 'ADMIN' })} className="hover:text-brand-gold transition-colors text-brand-sand/50 text-[11px] block text-left">
                  Store Admin Suite
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
                  <span>WhatsApp: {phoneNumber}</span>
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
