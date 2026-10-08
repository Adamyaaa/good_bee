import QRCode from 'qrcode';
import { store } from '../db/store.js';

export class DynamicQrService {
  /**
   * Generates a standard NPCI UPI payment deep-link intent and vector QR data URL.
   * Format: upi://pay?pa={vpa}&pn={payeeName}&am={amount}&cu=INR&tn={transactionNote}&tr={orderId}
   */
  static async generateUpiPaymentQr({ orderId, amount, customNote = '' }) {
    const paymentConfig = store.config.payment;
    const vpa = paymentConfig.upiVpa || 'goodbee.official@okaxis';
    const payeeName = paymentConfig.payeeName || 'GOOD BEE Skincare Laboratory';
    const note = customNote || `Good Bee Order ${orderId}`;
    
    // Exact standard UPI deep link URL format
    const upiIntentString = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}&tr=${encodeURIComponent(orderId)}`;

    // Generate high-definition PNG / SVG QR Data URL with luxury styling
    const qrDataUrl = await QRCode.toDataURL(upiIntentString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#1A1918', // Deep Charcoal
        light: '#FAF7F2'  // Warm Ivory canvas background
      }
    });

    return {
      orderId,
      amount,
      vpa,
      payeeName,
      currency: 'INR',
      upiIntentString,
      qrDataUrl,
      generatedAt: new Date().toISOString()
    };
  }
}
