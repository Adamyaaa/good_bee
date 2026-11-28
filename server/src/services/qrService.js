import QRCode from 'qrcode';
import { getPlatformConfig, getSiteContent } from '../db/repo.js';

export class DynamicQrService {
  /**
   * Generates a standard NPCI UPI payment deep-link intent and vector QR data URL.
   * Format: upi://pay?pa={vpa}&pn={payeeName}&am={amount}&cu=INR&tn={transactionNote}&tr={orderId}
   */
  static async generateUpiPaymentQr({ orderId, amount, customNote = '' }) {
    const [platformConfig, siteContent] = await Promise.all([
      getPlatformConfig().catch(() => ({})),
      getSiteContent().catch(() => ({}))
    ]);
    const paymentConfig = platformConfig.payment || {};
    const vpa = siteContent.upiVpa || paymentConfig.upiVpa || 'goodbee.official@okaxis';
    const payeeName = siteContent.payeeName || paymentConfig.payeeName || 'GOOD BEE Skincare Laboratory';
    const note = customNote || `Good Bee Order ${orderId}`;

    const upiIntentString = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}&tr=${encodeURIComponent(orderId)}`;

    const qrDataUrl = await QRCode.toDataURL(upiIntentString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#1A1918',
        light: '#FAF7F2'
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
