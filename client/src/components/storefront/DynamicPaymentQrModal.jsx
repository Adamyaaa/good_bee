import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ArrowRight, ShieldCheck, MessageCircle, AlertCircle } from 'lucide-react';

export default function DynamicPaymentQrModal({
  order,
  dynamicQr,
  whatsappSupportUrl,
  onClose,
  onPaymentSuccess
}) {
  const [copied, setCopied] = useState(false);
  const [upiRef, setUpiRef] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!order || !dynamicQr) return null;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(dynamicQr.vpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setIsVerifying(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/v1/orders/${order.id}/verify-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiRef: upiRef || `UPI-TXN-${Date.now().toString().slice(-6)}` })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      onPaymentSuccess(data.order);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to verify payment. Please try again or reach out on WhatsApp.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-brand-ivory rounded-3xl border border-brand-gold/40 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 bg-brand-cream/80 border-b border-brand-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-full bg-brand-charcoal text-brand-gold">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif text-xl font-semibold text-brand-charcoal">
                Dynamic Payment QR
              </h3>
              <p className="text-xs text-brand-muted">Order #{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-charcoal hover:text-brand-gold-dark rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-center">
          
          {/* Bill Amount Display */}
          <div className="bg-brand-sand/30 rounded-2xl p-4 border border-brand-gold/30">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block">
              Exact Payable Bill Amount
            </span>
            <span className="font-serif text-3xl font-bold text-brand-charcoal mt-1 block">
              ₹{order.total.toLocaleString('en-IN')}.00
            </span>
            <span className="text-[11px] text-brand-gold-dark font-medium mt-1 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Dynamic Invoice Linked to Good Bee Merchant Account
            </span>
          </div>

          {/* Dynamic Vector QR Code Display */}
          <div className="relative inline-block mx-auto p-4 bg-brand-ivory rounded-2xl border-2 border-brand-gold shadow-luxury">
            <img
              src={dynamicQr.qrDataUrl}
              alt="Scan to pay via UPI"
              className="w-56 h-56 mx-auto object-contain rounded-lg"
            />
            <p className="text-[11px] text-brand-muted mt-2 font-medium">
              Scan with GPay, PhonePe, Paytm, or any UPI Bank App
            </p>
          </div>

          {/* VPA Copy Bar */}
          <div className="flex items-center justify-between bg-brand-cream px-4 py-2.5 rounded-xl border border-brand-gold/25 text-left text-xs">
            <div>
              <span className="text-brand-muted text-[10px] uppercase font-bold block">Payee VPA / UPI ID</span>
              <span className="font-mono text-brand-charcoal font-semibold">{dynamicQr.vpa}</span>
            </div>
            <button
              onClick={handleCopyVpa}
              className="px-3 py-1 bg-brand-charcoal text-brand-ivory text-[11px] font-semibold rounded-lg hover:bg-brand-gold-dark transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Direct Mobile UPI Intent Button (works on phones) */}
          <a
            href={dynamicQr.upiIntentString}
            className="block sm:hidden w-full py-3 bg-brand-gold-dark text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-brand-gold transition-colors text-center"
          >
            Open Installed UPI App Directly
          </a>

          {/* Verification Input & Action */}
          <div className="pt-2 border-t border-brand-gold/15 space-y-3 text-left">
            <label className="block text-xs font-medium text-brand-charcoal">
              UPI Transaction ID / UTR (Optional verification)
            </label>
            <input
              type="text"
              placeholder="e.g. 409821890123"
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-ivory border border-brand-gold/30 rounded-xl text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
            />

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleConfirmPayment}
              disabled={isVerifying}
              className="w-full py-3.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-brand-gold-dark transition-all duration-300 shadow-luxury flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isVerifying ? (
                <span>Confirming Transaction...</span>
              ) : (
                <>
                  <span>I Have Completed Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Direct WhatsApp Concierge Help */}
            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-transparent border border-emerald-700/40 text-emerald-800 text-xs font-semibold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Need Help? Send Screenshot on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
