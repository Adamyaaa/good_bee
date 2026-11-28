import { store } from '../db/store.js';

export class WhatsAppService {
  static getBaseNumber(overridePhone) {
    const rawNumber = overridePhone || store.config.whatsapp.phoneNumber || '+91-9963075000';
    return String(rawNumber).replace(/[^0-9]/g, '');
  }

  static createConciergeUrl(message = '', overridePhone = '', overrideGreeting = '') {
    const phone = this.getBaseNumber(overridePhone);
    const defaultMsg =
      overrideGreeting ||
      store.config.whatsapp.welcomeMessage ||
      'Hello Good Bee Concierge, I would like guidance on pure skincare formulations.';
    const text = encodeURIComponent(message || defaultMsg);
    return `https://wa.me/${phone}?text=${text}`;
  }

  static createProductInquiryUrl(product, overridePhone = '') {
    const phone = this.getBaseNumber(overridePhone);
    const text = encodeURIComponent(
      `Hello Good Bee Concierge, I am inquiring about the ${product.title} (SKU: ${product.sku || 'N/A'}, Price: ₹${product.price}). Could you provide guidance on its suitability for my skin?`
    );
    return `https://wa.me/${phone}?text=${text}`;
  }

  static createOrderSupportUrl(orderId, total, overridePhone = '') {
    const phone = this.getBaseNumber(overridePhone);
    const text = encodeURIComponent(
      `Hello Good Bee Support, I have an inquiry regarding my order #${orderId} (Value: ₹${total}). Could you assist me with the status?`
    );
    return `https://wa.me/${phone}?text=${text}`;
  }
}
