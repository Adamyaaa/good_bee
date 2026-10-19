import React, { useState, useEffect } from 'react';
import { Gift, X, Check, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SurpriseGiftModal({ isOpen, onClose }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleReveal = (e) => {
    e.preventDefault();
    const cleanNumber = mobileNumber.replace(/[^0-9]/g, '');
    if (cleanNumber.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    setError('');
    setIsSubmitted(true);

    // Save lead in localStorage for Admin inspection
    try {
      const existingLeads = JSON.parse(localStorage.getItem('goodbee_leads') || '[]');
      existingLeads.unshift({
        mobile: cleanNumber,
        claimedAt: new Date().toISOString(),
        voucher: 'PUREBEE15',
        gift: '10ml Frankincense Honey Elixir'
      });
      localStorage.setItem('goodbee_leads', JSON.stringify(existingLeads));
      sessionStorage.setItem('goodbee_surprise_claimed', 'true');
    } catch (err) {}

    // Trigger luxury celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A880', '#D4AF37', '#10B981', '#FAF7F2']
      });
    } catch (err) {}
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('PUREBEE15');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative bg-brand-ivory rounded-3xl border-2 border-brand-gold/50 shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-8 text-center animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-brand-muted hover:text-brand-charcoal hover:bg-brand-cream/80 transition-colors"
          aria-label="Close surprise popup"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Top Gift Emblem */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 p-0.5 border border-purple-200 shadow-md flex items-center justify-center mb-4">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-[#5B0868]" />
              </div>
            </div>

            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#5B0868] bg-purple-50 px-3 py-1 rounded-xl border border-purple-200 inline-block mb-2">
              Patron Welcome Surprise
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-medium leading-tight">
              Unlock Your Sacred Botanical Gift
            </h3>

            <p className="text-xs text-brand-charcoal/70 my-3 leading-relaxed font-sans">
              Enter your WhatsApp number to reveal a <strong>complimentary 10ml Frankincense Honey Elixir</strong> + instant <strong>15% OFF voucher</strong> on your first order.
            </p>

            <form onSubmit={handleReveal} className="space-y-3 pt-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-semibold text-brand-muted">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength="10"
                  required
                  placeholder="Enter 10-digit WhatsApp Number"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value.replace(/[^0-9]/g, ''));
                    if (error) setError('');
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-brand-charcoal focus:outline-none focus:border-[#5B0868] focus:ring-1 focus:ring-[#5B0868] shadow-sm font-mono placeholder:font-sans"
                />
              </div>

              {error && <p className="text-xs text-rose-600 font-medium text-left">{error}</p>}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#5B0868] hover:bg-[#480653] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Reveal My Surprise</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="pt-4 flex items-center justify-center gap-2 text-[10.5px] text-brand-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero spam guarantee • 100% pure botanical community</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 border border-purple-200 text-[#5B0868] flex items-center justify-center shadow-md animate-in zoom-in-75 duration-300">
              <Gift className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-medium">
              Surprise Unlocked!
            </h3>

            <p className="text-xs text-brand-charcoal/80">
              We’ve reserved your <strong>10ml Frankincense Honey Elixir</strong>. Apply the code below during checkout to activate your 15% discount:
            </p>

            <div className="p-4 bg-purple-50/50 border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#5B0868] tracking-wider uppercase block">Your VIP Code</span>
                <span className="font-mono text-xl font-extrabold tracking-widest text-brand-charcoal">PUREBEE15</span>
              </div>
              <button
                onClick={handleCopyCode}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                  copied
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#5B0868] text-white hover:bg-[#480653]'
                }`}
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </span>
                ) : (
                  'Copy Code'
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#5B0868] hover:bg-[#480653] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              Shop Formulations Now →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
