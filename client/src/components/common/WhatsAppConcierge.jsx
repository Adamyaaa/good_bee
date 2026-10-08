import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    conciergeUrl: 'https://wa.me/919876543210?text=Hello%20Good%20Bee%20Concierge,%20I%20would%20like%20guidance%20on%20pure%20skincare%20formulations.',
    phoneNumber: '+91 98765 43210',
    enabled: true
  });

  useEffect(() => {
    fetch('/api/v1/config/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.whatsapp) {
          setConfig(data.whatsapp);
        }
      })
      .catch(() => {});
  }, []);

  if (!config.enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Interactive Popup Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 bg-brand-ivory rounded-2xl border border-brand-gold/40 shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between pb-2 border-b border-brand-gold/15">
            <div className="flex items-center gap-2">
              <img
                src="/assets/good-bee-logo.png"
                alt="Good Bee Emblem"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h4 className="font-serif text-sm font-semibold text-brand-charcoal">
                  Good Bee Concierge
                </h4>
                <p className="text-[10px] text-emerald-700 font-medium">Online for Skincare Guidance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-brand-muted hover:text-brand-charcoal p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-brand-charcoal/80 my-3 font-sans leading-relaxed">
            Need guidance on active formulations, batch certificates, or help with a custom routine? Chat directly with our skincare advisors.
          </p>

          <a
            href={config.conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Start WhatsApp Chat</span>
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-800 text-white shadow-luxury hover:bg-emerald-900 transition-all duration-300 hover:scale-105 border border-emerald-600/30"
        title="Good Bee WhatsApp Concierge"
      >
        <MessageCircle className="w-5 h-5 text-emerald-200" />
        <span className="text-xs font-semibold tracking-wider hidden sm:inline">
          Consult Concierge
        </span>
      </button>
    </div>
  );
}
