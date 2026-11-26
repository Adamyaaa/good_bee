import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(() => {
    try {
      const sc = JSON.parse(localStorage.getItem('goodbee_site_content') || '{}');
      let phone = sc.whatsappNumber || '+91-9963075000';
      if (phone.includes('987654')) phone = '+91-9963075000';
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const greeting = sc.whatsappGreeting || 'Hello Good Bee Concierge, I would like guidance on pure skincare formulations.';
      return {
        conciergeUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`,
        phoneNumber: phone,
        enabled: true
      };
    } catch (e) {
      return {
        conciergeUrl: 'https://wa.me/919963075000?text=Hello%20Good%20Bee%20Concierge,%20I%20would%20like%20guidance%20on%20pure%20skincare%20formulations.',
        phoneNumber: '+91-9963075000',
        enabled: true
      };
    }
  });

  const loadConfig = () => {
    fetch('/api/v1/config/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.whatsapp) {
          setConfig(data.whatsapp);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadConfig();
    window.addEventListener('goodbee_site_content_updated', loadConfig);
    return () => window.removeEventListener('goodbee_site_content_updated', loadConfig);
  }, []);

  if (!config.enabled) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-40 flex flex-col items-end">
      {/* Interactive Popup Bubble */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-brand-ivory rounded-2xl border border-brand-gold/40 shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between pb-2 border-b border-brand-gold/15">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-brand-gold/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                <img
                  src="/assets/goodbee-white-logo.png"
                  alt="Good Bee Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
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
            className="w-full py-2.5 bg-[#5B0868] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#480653] transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Start WhatsApp Chat</span>
          </a>
        </div>
      )}

      {/* Compact Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#5B0868] text-white shadow-lg hover:bg-[#480653] transition-all duration-300 hover:scale-105 border border-purple-300/30 cursor-pointer"
        title="Good Bee WhatsApp Concierge"
        aria-label="Consult Skincare Concierge"
      >
        <MessageCircle className="w-4 h-4 text-white" />
        <span className="text-[11px] font-bold tracking-wide hidden md:inline">
          Concierge
        </span>
      </button>
    </div>
  );
}
