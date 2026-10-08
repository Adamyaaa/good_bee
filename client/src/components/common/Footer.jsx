import React from 'react';
import { Sparkles, MessageCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-brand-charcoal text-brand-ivory pt-16 pb-12 border-t border-brand-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Statement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-brand-charcoal-muted/30 items-center">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/good-bee-logo.png"
                alt="Good Bee Emblem"
                className="w-12 h-12 rounded-full border border-brand-gold/40"
              />
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
            <button
              onClick={() => onNavigate('login')}
              className="px-5 py-3 rounded-full bg-brand-gold text-brand-charcoal text-xs font-bold uppercase tracking-wider hover:bg-brand-gold-light transition-colors flex items-center gap-2"
            >
              <span>Partner Ecosystem</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
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
                <button onClick={() => onNavigate('shop', { filterCategory: 'Face Care' })} className="hover:text-brand-gold transition-colors">
                  Face Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filterCategory: 'Concentrated Serums' })} className="hover:text-brand-gold transition-colors">
                  Concentrated Serums
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filterCategory: 'Cleansers' })} className="hover:text-brand-gold transition-colors">
                  Purifying Cleansers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filterCategory: 'Restorative Elixirs' })} className="hover:text-brand-gold transition-colors">
                  Restorative Elixirs
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
                <button onClick={() => onNavigate('login', { defaultRole: 'PRODUCER' })} className="hover:text-brand-gold transition-colors">
                  Producer & Lab Ingestion
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login', { defaultRole: 'DEALER' })} className="hover:text-brand-gold transition-colors">
                  Dealer Wholesale Desk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login', { defaultRole: 'PROMOTER' })} className="hover:text-brand-gold transition-colors">
                  Promoter Affiliate Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login', { defaultRole: 'ADMIN' })} className="hover:text-brand-gold transition-colors font-semibold text-brand-gold-light">
                  Admin Command Tower
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-brand-gold-light uppercase">
              Direct Concierge
            </h4>
            <ul className="space-y-2 text-brand-sand/70">
              <li>WhatsApp: +91 98765 43210</li>
              <li>concierge@goodbee.com</li>
              <li>Mon – Sat: 9:30 AM – 7:00 PM IST</li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-brand-gold-light font-medium">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Live Skin Assistance
                </span>
              </li>
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
