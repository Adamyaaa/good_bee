export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  PRODUCER: 'PRODUCER',
  DEALER: 'DEALER',
  PROMOTER: 'PROMOTER',
  ADMIN: 'ADMIN'
};

export const PRODUCT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAYMENT_VERIFIED: 'PAYMENT_VERIFIED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const DEFAULT_CONFIG = {
  payment: {
    upiVpa: 'goodbee.official@okaxis',
    payeeName: 'GOOD BEE Skincare Laboratory',
    merchantCode: '5977',
    allowDynamicQr: true,
    currency: 'INR'
  },
  whatsapp: {
    phoneNumber: '+919963075000',
    welcomeMessage: 'Hello Good Bee Concierge, I would like guidance on pure skincare formulations.',
    enableConcierge: true
  },
  rules: {
    dealerCommissionPct: 18.0,
    promoterCommissionPct: 12.0,
    loyaltyPointsPerRupee: 0.05, // 1 point per 20 rupees
    loyaltyRedeemValuePerPoint: 1.0, // 1 point = 1 rupee
    lowStockSafetyThreshold: 15
  }
};
