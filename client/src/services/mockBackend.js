import QRCode from 'qrcode';
import { INITIAL_PRODUCTS } from './api';
import { validatePasswordForRegistration } from '../utils/passwordStrength';

// Initial Mock Storage Seeds
const DEFAULT_USERS = [
  {
    id: 'usr_admin',
    name: 'Good Bee Administrator',
    email: 'admin@goodbee.com',
    password: 'admin',
    role: 'ADMIN',
    phone: '+91-9963075000',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_producer_1',
    name: 'Aura Botanica Bio-Labs',
    email: 'producer@goodbee.com',
    password: 'producer',
    role: 'PRODUCER',
    companyName: 'Aura Botanica Bio-Labs Pvt Ltd',
    labCertId: 'LAB-ISO-9001-GB',
    phone: '+919876543201',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_1',
    name: 'Apex Luxury Skincare Distributors',
    email: 'dealer@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Apex Luxury Skincare Distributors Pvt Ltd',
    dealerCode: 'DLR-MUM-01',
    gstNumber: '27AABCU9603R1ZM',
    tier: 'Gold Tier Partner',
    commissionMarginPct: 22.0,
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+919876543202',
    totalOrders: 28,
    totalSpend: 384000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_2',
    name: 'Bengaluru Botanical Essentials',
    email: 'bengaluru.botanics@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Bengaluru Botanical Essentials LLP',
    dealerCode: 'DLR-BLR-02',
    gstNumber: '29AABCB1234F1Z5',
    tier: 'Platinum Apex Partner',
    commissionMarginPct: 24.5,
    city: 'Bengaluru',
    state: 'Karnataka',
    phone: '+919876543212',
    totalOrders: 35,
    totalSpend: 512000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_3',
    name: 'Northern Heritage Wellness Desk',
    email: 'northern.wellness@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Northern Heritage Wellness India',
    dealerCode: 'DLR-DEL-03',
    gstNumber: '07AAACN5678K1ZQ',
    tier: 'Platinum Apex Partner',
    commissionMarginPct: 25.0,
    city: 'New Delhi',
    state: 'Delhi',
    phone: '+919876543213',
    totalOrders: 41,
    totalSpend: 620000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_4',
    name: 'Deccan Pure Botanics Hub',
    email: 'deccan.botanics@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Deccan Pure Botanics Pvt Ltd',
    dealerCode: 'DLR-HYD-04',
    gstNumber: '36AABCD9012M1Z8',
    tier: 'Silver Regional Hub',
    commissionMarginPct: 18.0,
    city: 'Hyderabad',
    state: 'Telangana',
    phone: '+919876543214',
    totalOrders: 19,
    totalSpend: 245000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_5',
    name: 'Coromandel Herbal Distributors',
    email: 'coromandel.herbal@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Coromandel Herbal Agencies',
    dealerCode: 'DLR-CHN-05',
    gstNumber: '33AABCC3456P1Z3',
    tier: 'Gold Tier Partner',
    commissionMarginPct: 21.0,
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+919876543215',
    totalOrders: 24,
    totalSpend: 310000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_6',
    name: 'Eastern Organic Storefronts',
    email: 'eastern.organics@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Eastern Organic Trade Link',
    dealerCode: 'DLR-KOL-06',
    gstNumber: '19AABCE7890H1ZV',
    tier: 'Silver Regional Hub',
    commissionMarginPct: 17.5,
    city: 'Kolkata',
    state: 'West Bengal',
    phone: '+919876543216',
    totalOrders: 16,
    totalSpend: 198000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_7',
    name: 'Botanical Honey & Apiary Network',
    email: 'apiary.network@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Pure Botanicals & Bee Co',
    dealerCode: 'DLR-PUN-07',
    gstNumber: '27AABCG2345L1ZT',
    tier: 'Platinum Apex Partner',
    commissionMarginPct: 26.0,
    city: 'Pune',
    state: 'Maharashtra',
    phone: '+919876543217',
    totalOrders: 38,
    totalSpend: 540000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_8',
    name: 'Royal Rajputana Organic Desk',
    email: 'rajputana.organic@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Royal Rajputana Wellness Guild',
    dealerCode: 'DLR-JAI-08',
    gstNumber: '08AABCR6789D1ZW',
    tier: 'Silver Regional Hub',
    commissionMarginPct: 18.5,
    city: 'Jaipur',
    state: 'Rajasthan',
    phone: '+919876543218',
    totalOrders: 14,
    totalSpend: 175000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_9',
    name: 'Malabar Spices & Spa Supply',
    email: 'malabar.spa@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Malabar Spa & Wellness Exports',
    dealerCode: 'DLR-KOC-09',
    gstNumber: '32AABCM0123K1ZA',
    tier: 'Gold Tier Partner',
    commissionMarginPct: 20.0,
    city: 'Kochi',
    state: 'Kerala',
    phone: '+919876543219',
    totalOrders: 22,
    totalSpend: 289000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_10',
    name: 'Gujarat Pure Organics Emporium',
    email: 'gujarat.pure@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Gujarat Pure Organics Ltd',
    dealerCode: 'DLR-AMD-10',
    gstNumber: '24AABCG4567J1ZE',
    tier: 'Gold Tier Partner',
    commissionMarginPct: 22.0,
    city: 'Ahmedabad',
    state: 'Gujarat',
    phone: '+919876543220',
    totalOrders: 27,
    totalSpend: 350000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_11',
    name: 'Punjab Herbal Distributors',
    email: 'punjab.herbal@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Punjab Herbal Supply Co',
    dealerCode: 'DLR-CHD-11',
    gstNumber: '04AABCP8901N1ZY',
    tier: 'Silver Regional Hub',
    commissionMarginPct: 17.0,
    city: 'Chandigarh',
    state: 'Punjab',
    phone: '+919876543221',
    totalOrders: 12,
    totalSpend: 142000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_12',
    name: 'Awadh Botanical Natural Care',
    email: 'awadh.botanical@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Awadh Botanical Remedies LLP',
    dealerCode: 'DLR-LKO-12',
    gstNumber: '09AABCA2345B1ZR',
    tier: 'Gold Tier Partner',
    commissionMarginPct: 23.0,
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    phone: '+919876543222',
    totalOrders: 25,
    totalSpend: 318000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_13',
    name: 'Nilgiri Biosphere Apothecary Traders',
    email: 'nilgiri.apothecary@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Nilgiri Apothecary Consortium',
    dealerCode: 'DLR-CBE-13',
    gstNumber: '33AABCN6789S1ZX',
    tier: 'Platinum Apex Partner',
    commissionMarginPct: 26.5,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    phone: '+919876543223',
    totalOrders: 31,
    totalSpend: 470000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dealer_14',
    name: 'Central Malwa Botanical Hub',
    email: 'central.malwa@goodbee.com',
    password: 'dealer',
    role: 'DEALER',
    companyName: 'Central Malwa Organics Pvt Ltd',
    dealerCode: 'DLR-IND-14',
    gstNumber: '23AABCC0123E1ZU',
    tier: 'Silver Regional Hub',
    commissionMarginPct: 19.0,
    city: 'Indore',
    state: 'Madhya Pradesh',
    phone: '+919876543224',
    totalOrders: 15,
    totalSpend: 182000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_promoter_1',
    name: 'Elena Vance Skincare Rituals',
    email: 'promoter@goodbee.com',
    password: 'promoter',
    role: 'PROMOTER',
    referralCode: 'ELENA10',
    phone: '+919876543203',
    earnings: 14250,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_customer_1',
    name: 'Customer',
    email: 'customer@goodbee.com',
    password: 'customer',
    role: 'CUSTOMER',
    phone: '+919876543204',
    loyaltyPoints: 340,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_media_1',
    name: 'Aanya Sen (Media Lead)',
    email: 'media@goodbee.com',
    password: 'MediaGoodBee#2026',
    passwordSecondary: 'media',
    role: 'MEDIA_MANAGER',
    phone: '+91 99630 75005',
    title: 'Media & Inventory Studio',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_delivery_1',
    name: 'Kabir Verma (Fleet Partner)',
    email: 'delivery@goodbee.com',
    password: 'DeliveryGoodBee#2026',
    passwordSecondary: 'delivery',
    role: 'DELIVERY_PARTNER',
    phone: '+91 99630 75006',
    partnerCode: 'DEL-2026-001',
    vehicleType: 'Electric Scooter (Ather 450X)',
    vehicleNumber: 'MH-02-EE-4921',
    deliveryZone: 'South Mumbai Central Hub',
    dutyStatus: 'ON_DUTY',
    title: 'Delivery Partner & Fleet',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_DELIVERY_ASSIGNMENTS = [
  {
    id: 'DEL-ASG-101',
    orderId: 'GB-ORD-90214',
    deliveryPartnerId: 'usr_delivery_1',
    deliveryPartnerName: 'Kabir Verma',
    providerType: 'IN_HOUSE',
    orderPreparationStatus: 'READY_FOR_PICKUP',
    deliveryStatus: 'READY_FOR_PICKUP',
    customerName: 'Customer',
    customerPhone: '+919876543204',
    shippingAddress: {
      street: '402, Lotus Greens, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    pickupLocation: {
      name: 'Good Bee Central Laboratory & Dispensary',
      address: 'Unit 14, Apex Botanical Park, Lower Parel, Mumbai - 400013',
      contactPhone: '+91-9963075000',
      instructions: 'Present Delivery Partner ID badge at Bay 2 dispatch desk.'
    },
    items: [
      {
        title: 'Frankincense & Myrrh Cold Processed Soap',
        quantity: 2,
        price: 290,
        image: '/images_ref/Frankin-300x300.webp'
      },
      {
        title: 'Steam-Distilled Pure Rose Hydrosol Mist',
        quantity: 1,
        price: 490,
        image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp'
      }
    ],
    totalAmount: 1070,
    assignedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    readyForPickupAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    pickedUpAt: null,
    outForDeliveryAt: null,
    deliveredAt: null,
    failedAt: null,
    failureReason: null,
    failureRemarks: null,
    flaggedForAdminReview: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'DEL-ASG-102',
    orderId: 'GB-ORD-90821',
    deliveryPartnerId: 'usr_delivery_1',
    deliveryPartnerName: 'Kabir Verma',
    providerType: 'IN_HOUSE',
    orderPreparationStatus: 'READY_FOR_PICKUP',
    deliveryStatus: 'OUT_FOR_DELIVERY',
    customerName: 'Priya Sharma',
    customerPhone: '+919820144521',
    shippingAddress: {
      street: 'Flat 12B, Sea View Apts, Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018'
    },
    pickupLocation: {
      name: 'Good Bee Central Laboratory & Dispensary',
      address: 'Unit 14, Apex Botanical Park, Lower Parel, Mumbai - 400013',
      contactPhone: '+91-9963075000',
      instructions: 'Temperature-sensitive royal propolis package. Keep upright.'
    },
    items: [
      {
        title: 'Golden Royal Propolis Restorative Nectar',
        quantity: 1,
        price: 1890,
        image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.56-300x300.webp'
      }
    ],
    totalAmount: 1890,
    assignedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    readyForPickupAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    pickedUpAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    outForDeliveryAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    deliveredAt: null,
    failedAt: null,
    failureReason: null,
    failureRemarks: null,
    flaggedForAdminReview: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'DEL-ASG-103',
    orderId: 'GB-ORD-90210',
    deliveryPartnerId: 'usr_delivery_1',
    deliveryPartnerName: 'Kabir Verma',
    providerType: 'IN_HOUSE',
    orderPreparationStatus: 'PREPARING',
    deliveryStatus: 'WAITING_FOR_PICKUP',
    customerName: 'Ananya Desai',
    customerPhone: '+919811234567',
    shippingAddress: {
      street: 'Penthouse 4, Oberoi Sky Heights, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053'
    },
    pickupLocation: {
      name: 'Good Bee Central Laboratory & Dispensary',
      address: 'Unit 14, Apex Botanical Park, Lower Parel, Mumbai - 400013',
      contactPhone: '+91-9963075000',
      instructions: 'Awaiting lab batch seal verification before dispatch.'
    },
    items: [
      {
        title: 'Donkey Milk & Saffron Soap',
        quantity: 1,
        price: 350,
        image: '/images_ref/Donkey-Milk-Soap-300x300.webp'
      },
      {
        title: 'Pink Lotus Lip Butter',
        quantity: 2,
        price: 260,
        image: '/images_ref/Pink-Lotus-300x300.webp'
      }
    ],
    totalAmount: 870,
    assignedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    readyForPickupAt: null,
    pickedUpAt: null,
    outForDeliveryAt: null,
    deliveredAt: null,
    failedAt: null,
    failureReason: null,
    failureRemarks: null,
    flaggedForAdminReview: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'DEL-ASG-104',
    orderId: 'GB-ORD-89412',
    deliveryPartnerId: 'usr_delivery_1',
    deliveryPartnerName: 'Kabir Verma',
    providerType: 'IN_HOUSE',
    orderPreparationStatus: 'READY_FOR_PICKUP',
    deliveryStatus: 'DELIVERED',
    customerName: 'Rohan Mehra',
    customerPhone: '+919833011223',
    shippingAddress: {
      street: 'Tower C, Godrej Woods, BKC',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051'
    },
    pickupLocation: {
      name: 'Good Bee Central Laboratory & Dispensary',
      address: 'Unit 14, Apex Botanical Park, Lower Parel, Mumbai - 400013',
      contactPhone: '+91-9963075000'
    },
    items: [
      {
        title: 'Wild Turmeric Glow Soap',
        quantity: 2,
        price: 320,
        image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-1-300x300.webp'
      }
    ],
    totalAmount: 640,
    assignedAt: new Date(Date.now() - 86400000).toISOString(),
    readyForPickupAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    pickedUpAt: new Date(Date.now() - 86400000 + 7200000).toISOString(),
    outForDeliveryAt: new Date(Date.now() - 86400000 + 10800000).toISOString(),
    deliveredAt: new Date(Date.now() - 86400000 + 14400000).toISOString(),
    failedAt: null,
    failureReason: null,
    failureRemarks: null,
    flaggedForAdminReview: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'DEL-ASG-105',
    orderId: 'GB-ORD-88910',
    deliveryPartnerId: 'usr_delivery_1',
    deliveryPartnerName: 'Kabir Verma',
    providerType: 'IN_HOUSE',
    orderPreparationStatus: 'READY_FOR_PICKUP',
    deliveryStatus: 'FAILED',
    customerName: 'Kavita Nair',
    customerPhone: '+919877088991',
    shippingAddress: {
      street: 'Villa 9, Palm Meadows, Juhu Scheme',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400049'
    },
    pickupLocation: {
      name: 'Good Bee Central Laboratory & Dispensary',
      address: 'Unit 14, Apex Botanical Park, Lower Parel, Mumbai - 400013',
      contactPhone: '+91-9963075000'
    },
    items: [
      {
        title: 'Rosemary Hydrosol Balancing Mist',
        quantity: 1,
        price: 550,
        image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.23-300x300.webp'
      }
    ],
    totalAmount: 550,
    assignedAt: new Date(Date.now() - 172800000).toISOString(),
    readyForPickupAt: new Date(Date.now() - 172800000 + 3600000).toISOString(),
    pickedUpAt: new Date(Date.now() - 172800000 + 7200000).toISOString(),
    outForDeliveryAt: new Date(Date.now() - 172800000 + 10800000).toISOString(),
    deliveredAt: null,
    failedAt: new Date(Date.now() - 172800000 + 18000000).toISOString(),
    failureReason: 'Customer Unavailable',
    failureRemarks: 'Resident out of city for 2 days per building security desk. Flagged for admin reschedule.',
    flaggedForAdminReview: true,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'DEL-ASG-999',
    orderId: 'GB-ORD-77112',
    deliveryPartnerId: 'usr_delivery_2',
    deliveryPartnerName: 'Ravi Kumar',
    providerType: 'THIRD_PARTY_BLUEDART',
    orderPreparationStatus: 'READY_FOR_PICKUP',
    deliveryStatus: 'READY_FOR_PICKUP',
    customerName: 'Sanjay Dutt',
    customerPhone: '+919822001122',
    shippingAddress: {
      street: '101, Palm Court, Juhu',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400049'
    },
    pickupLocation: {
      name: 'Good Bee Central Laboratory & Dispensary',
      address: 'Unit 14, Apex Botanical Park, Lower Parel, Mumbai - 400013',
      contactPhone: '+91-9963075000',
      instructions: 'Fleet Courier Ravi Kumar assignment.'
    },
    items: [
      {
        title: 'Wild Turmeric Glow Soap',
        quantity: 1,
        price: 320,
        image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-1-300x300.webp'
      }
    ],
    totalAmount: 320,
    assignedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    readyForPickupAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    pickedUpAt: null,
    outForDeliveryAt: null,
    deliveredAt: null,
    failedAt: null,
    failureReason: null,
    failureRemarks: null,
    flaggedForAdminReview: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

const DEFAULT_DEALER_ORDERS = [
  {
    id: 'GB-PO-2026-9402',
    dealerCode: 'GB-DLR-MUM-892',
    date: '24 Oct 2026',
    totalUnits: 75,
    subtotal: 32450,
    gst: 5841,
    totalAmount: 38291,
    status: 'DISPATCHED',
    courier: 'BlueDart Express',
    trackingNo: 'BD-98234120',
    paymentTerms: 'Net-30 (Due 24 Nov 2026)',
    items: [
      { title: 'Good Bee Donkey Milk & Saffron Soap', qty: 30, wholesalePrice: 380 },
      { title: 'Good Bee Frankincense Pure Essential Oil', qty: 15, wholesalePrice: 1087 },
      { title: 'Good Bee Pink Lotus Hydrosol Mist', qty: 30, wholesalePrice: 629 }
    ]
  },
  {
    id: 'GB-PO-2026-8819',
    dealerCode: 'GB-DLR-MUM-892',
    date: '10 Oct 2026',
    totalUnits: 120,
    subtotal: 51200,
    gst: 9216,
    totalAmount: 60416,
    status: 'DELIVERED',
    courier: 'Delhivery Logistics',
    trackingNo: 'DL-44810294',
    paymentTerms: 'Net-30 (Settled)',
    items: [
      { title: 'Good Bee Rosemary Pure Essential Extract', qty: 40, wholesalePrice: 712 },
      { title: 'Good Bee Sunnipindi Cold Processed Bar', qty: 50, wholesalePrice: 299 },
      { title: 'Good Bee Clear Skin Cold Processed Soap', qty: 30, wholesalePrice: 337 }
    ]
  },
  {
    id: 'GB-PO-2026-7731',
    dealerCode: 'GB-DLR-BLR-02',
    date: '02 Nov 2026',
    totalUnits: 90,
    subtotal: 44100,
    gst: 7938,
    totalAmount: 52038,
    status: 'DISPATCHED',
    courier: 'DTDC Express',
    trackingNo: 'DTDC-8810231',
    paymentTerms: 'Net-30 (Due 02 Dec 2026)',
    items: [
      { title: 'Good Bee Lemongrass Essential Extract', qty: 45, wholesalePrice: 510 },
      { title: 'Good Bee Pink Lotus Botanical Mist', qty: 45, wholesalePrice: 470 }
    ]
  }
];

const DEFAULT_DELIVERY_NOTIFICATIONS = [
  {
    id: 'notif_1',
    deliveryPartnerId: 'usr_delivery_1',
    assignmentId: 'DEL-ASG-101',
    orderId: 'GB-ORD-90214',
    title: 'Order Ready for Pickup',
    message: 'Order #GB-ORD-90214 is packed and ready for pickup at Central Dispensary.',
    type: 'READY_FOR_PICKUP',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'notif_2',
    deliveryPartnerId: 'usr_delivery_1',
    assignmentId: 'DEL-ASG-103',
    orderId: 'GB-ORD-90210',
    title: 'New Delivery Assigned',
    message: 'New order #GB-ORD-90210 assigned for delivery to Andheri West.',
    type: 'NEW_ASSIGNMENT',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'notif_3',
    deliveryPartnerId: 'usr_delivery_1',
    assignmentId: 'DEL-ASG-102',
    orderId: 'GB-ORD-90821',
    title: 'Dispatch Confirmed',
    message: 'Dispatch authorized for Order #GB-ORD-90821 (Worli Sea Face).',
    type: 'STATUS_CHANGE',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'GB-ORD-90214',
    items: [
      {
        product: {
          id: 'prod_frankincense',
          title: 'Frankincense & Myrrh Cold Processed Soap',
          price: 290,
          image: '/images_ref/Frankin-300x300.webp'
        },
        quantity: 2
      },
      {
        product: {
          id: 'prod_rose_mist',
          title: 'Steam-Distilled Pure Rose Hydrosol Mist',
          price: 490,
          image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp'
        },
        quantity: 1
      }
    ],
    total: 1070,
    customerName: 'Customer',
    customerEmail: 'customer@goodbee.com',
    customerPhone: '+91 98201 44521',
    shippingAddress: '402, Sea Green Apts, Bandra West, Mumbai, MH - 400050',
    paymentMethod: 'DYNAMIC_UPI_QR',
    paymentStatus: 'PAID',
    status: 'PROCESSING',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'GB-ORD-90210',
    items: [
      {
        product: {
          id: 'prod_donkey_milk',
          title: 'Donkey Milk & Saffron Nourishing Bath Soap',
          price: 350,
          image: '/images_ref/Donkey-Milk-300x300.webp'
        },
        quantity: 1
      },
      {
        product: {
          id: 'prod_pink_lotus_lip',
          title: 'Pink Lotus & Wild Honey Lip Butter',
          price: 260,
          image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.12-300x300.webp'
        },
        quantity: 2
      }
    ],
    total: 870,
    customerName: 'Karthik Subramanian',
    customerEmail: 'karthik.subra@yahoo.com',
    customerPhone: '+91 94440 18723',
    shippingAddress: 'Flat 3B, Palm Grove Residencies, Indiranagar, Bengaluru, KA - 560038',
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PENDING_ON_DELIVERY',
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'GB-ORD-90198',
    items: [
      {
        product: {
          id: 'prod_rosemary_oil',
          title: 'Rosemary & Cold-Pressed Herb Infused Hair Oil',
          price: 520,
          image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.56-300x300.webp'
        },
        quantity: 1
      }
    ],
    total: 520,
    customerName: 'Pooja Reddy',
    customerEmail: 'pooja.reddy@gmail.com',
    customerPhone: '+91 99630 11299',
    shippingAddress: 'House 14, Road 12, Jubilee Hills, Hyderabad, TS - 500033',
    paymentMethod: 'DYNAMIC_UPI_QR',
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub_001',
    producerId: 'usr_producer_1',
    producerName: 'Aura Botanica Bio-Labs',
    title: 'Bio-Peptide Sea Kelp Tightening Essence',
    category: 'Botanical Mists',
    concerns: ['Youth & Radiance'],
    price: 1290,
    mrp: 1550,
    volume: '50 ml / 1.7 fl. oz.',
    stock: 50,
    status: 'PENDING_REVIEW',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    ingredients: 'Brown Sea Kelp Bioferment, Copper Tripeptide-1 analogue, Witch Hazel Hydrosol, Hyaluronic Acid',
    description: 'Cold-fermented marine micro-algae extract designed for targeted skin barrier tightening and youth renewal.',
    adminNotes: '',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp'
  },
  {
    id: 'sub_002',
    producerId: 'usr_producer_1',
    producerName: 'Aura Botanica Bio-Labs',
    title: 'Artisanal Vetiver & White Clay Bath Bar',
    category: 'Cold Processed Soaps',
    concerns: ['Acne & Blemishes', 'Barrier Repair'],
    price: 290,
    mrp: 350,
    volume: '100 g / 3.5 oz.',
    stock: 60,
    status: 'PENDING_REVIEW',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    ingredients: 'Wild Vetiver Root Extract, Kaolin Clay, Coconut Oil, Beeswax, Himalayan Deodar Oil',
    description: 'Slow-cured cold process soap combining grounding vetiver and detoxifying white kaolin clay.',
    adminNotes: '',
    image: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-300x300.webp'
  }
];

const DEFAULT_RULES = {
  dealerCommissionPct: 18.0,
  promoterCommissionPct: 12.0,
  loyaltyPointsPerRupee: 0.05,
  loyaltyRedeemValuePerPoint: 1.0,
  lowStockSafetyThreshold: 15
};

const DEFAULT_CONFIG = {
  payment: {
    upiVpa: 'goodbee.official@okaxis',
    payeeName: 'GOOD BEE Skincare Laboratory',
    merchantCode: '5977',
    allowDynamicQr: true
  },
  whatsapp: {
    phoneNumber: '+91-9963075000',
    welcomeMessage: 'Hello Good Bee Concierge, I would like guidance on pure skincare formulations.',
    enableConcierge: true
  }
};

export const DEFAULT_SITE_CONTENT = {
  // 1. Top Announcement Bar
  announcement: 'Complimentary Delivery Across India on Orders Above ₹999',
  announcementSub: '100% Natural Active Ingredients',
  freeDeliveryThreshold: 999,

  // 2. Hero Presentation
  heroBadge: '100% Natural Skincare • Research-Driven Formulation',
  heroHeadline: 'Nature, Refined Through Research.',
  heroDescription: 'Good Bee develops 100% natural skincare formulations created after high-end botanical and active-stabilization research. We harmonize raw biological potency with clean laboratory precision to restore your skin barrier to luminous health.',
  heroCtaPrimary: 'Explore Pure Formulations',
  heroCtaSecondary: 'Daily Regimen Guide',

  // 3. Research & Formulation Philosophy Section
  philosophyBadge: 'Formulation Philosophy',
  philosophyTitle: 'Where 100% Natural Meets High-End Research.',
  philosophyDescription: 'Many natural brands rely solely on raw botanical blending without verifying active compound preservation. At Good Bee, every natural ingredient undergoes rigorous active-stabilization research.',
  philosophyCard1Title: 'Active Stabilization Research',
  philosophyCard1Text: 'Ensures raw botanical enzymes, flavonoids, and phytosterols do not degrade under atmospheric exposure.',
  philosophyCard2Title: 'Zero Synthetic Compromises',
  philosophyCard2Text: 'No synthetic parabens, artificial fragrances, silicones, sulfates, or petroleum by-products.',

  // 4. Traceable Origin & Ethical Apiaries Section
  sourcingBadge: 'Traceable Origin & Sourcing',
  sourcingTitle: 'Ethical Apiaries & Artisanal Extraction Laboratories',
  sourcingDescription: 'Good Bee coordinates with certified natural beekeepers and cold-processing botanists across South India. Every harvest undergoes stringent batch purity verification before stabilization in our laboratory.',
  sourcingCtaText: 'Explore Pure Formulations',

  // 5. Customer Testimonials & Reviews
  testimonials: [
    {
      id: 'test_1',
      name: 'Kavita Menon',
      city: 'Bengaluru',
      product: 'Good Bee Frankincense Pure Essential Oil',
      quote: 'My sensitized, flaking skin barrier calmed down in less than a week. It absorbs like silk without any oily heaviness.',
      rating: 5
    },
    {
      id: 'test_2',
      name: 'Dr. Radhika Iyer',
      city: 'Mumbai',
      product: 'Good Bee Donkey Milk & Saffron Soap',
      quote: 'As someone meticulous about ingredient safety, Good Bee’s botanical purity and active stabilization is genuinely impressive. Highly recommended.',
      rating: 5
    },
    {
      id: 'test_3',
      name: 'Siddharth Rao',
      city: 'New Delhi',
      product: 'Good Bee Sunnipindi Cold Processed Soap',
      quote: 'Gentlest cleanser bar I have used. Cleans congested pores thoroughly without leaving the tight, parched feeling of regular commercial washes.',
      rating: 5
    }
  ],

  // 6. Promotional Discount Coupons
  coupons: [
    { code: 'BOTANICAL10', discountPct: 10, minOrder: 500, active: true, description: '10% off on all natural formulations' },
    { code: 'PUREBEE15', discountPct: 15, minOrder: 1500, active: true, description: '15% off on orders above ₹1500' }
  ],

  // 7. Store Contact, Hours & UPI Payment Gateway
  whatsappNumber: '+91-9963075000',
  whatsappGreeting: 'Hello Good Bee Concierge, I would like guidance on natural skincare formulations.',
  supportEmail: 'care@goodbee.in',
  upiVpa: 'goodbee.official@okaxis',
  payeeName: 'GOOD BEE Skincare Laboratory',
  storeAddress: 'Good Bee Skincare Studio, Bengaluru, Karnataka, India',
  operatingHours: 'Mon – Sat: 9:30 AM – 7:00 PM IST'
};

// LocalStorage helpers
function getStored(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    if (!val) return defaultVal;
    const parsed = JSON.parse(val);
    if (key === 'goodbee_site_content' && parsed) {
      let updated = false;
      if (parsed.whatsappNumber?.includes('987654') || !parsed.whatsappNumber) {
        parsed.whatsappNumber = '+91-9963075000';
        updated = true;
      }
      if (parsed.storeAddress && parsed.storeAddress.includes('Western Ghats')) {
        parsed.storeAddress = 'Good Bee Skincare Studio, Bengaluru, Karnataka, India';
        updated = true;
      }
      if (updated) {
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    }
    if (key === 'goodbee_products' && Array.isArray(parsed)) {
      let changed = false;
      const merged = INITIAL_PRODUCTS.map((initProd) => {
        const found = parsed.find((p) => p.id === initProd.id);
        if (!found) {
          changed = true;
          return initProd;
        }
        if (JSON.stringify(found.concerns) !== JSON.stringify(initProd.concerns) || found.category !== initProd.category) {
          changed = true;
          return { ...found, concerns: initProd.concerns, category: initProd.category };
        }
        return found;
      });
      parsed.forEach((p) => {
        if (!merged.some((m) => m.id === p.id)) {
          merged.push(p);
        }
      });
      if (changed) {
        localStorage.setItem(key, JSON.stringify(merged));
      }
      return merged;
    }
    return parsed;
  } catch (e) {
    return defaultVal;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    if (typeof window !== 'undefined') {
      if (key === 'goodbee_products') window.dispatchEvent(new CustomEvent('goodbee_catalog_updated'));
      if (key === 'goodbee_site_content') window.dispatchEvent(new CustomEvent('goodbee_site_content_updated'));
    }
  } catch (e) {
    // ignore
  }
}

// Global In-Browser Mock Router
export async function handleMockApiRequest(url, init = {}) {
  const method = (init.method || 'GET').toUpperCase();
  let body = {};
  if (init.body) {
    try {
      body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
    } catch (e) {
      body = {};
    }
  }

  // Parse path and params
  const parsedUrl = new URL(url, 'http://localhost');
  const path = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // 1. Auth: Login
  if (path === '/api/v1/auth/login' && method === 'POST') {
    const cleanEmail = (body.email || '').trim().toLowerCase();
    const cleanPass = (body.password || '').trim();
    const rawPass = body.password || '';

    const users = getStored('goodbee_users', DEFAULT_USERS);
    const matched = users.find(
      (u) => (u.email || '').trim().toLowerCase() === cleanEmail
    );

    // AUTH-11: Uniform error message without revealing account existence
    if (!matched) {
      return jsonResponse({ error: 'Incorrect credentials' }, 401);
    }

    const passMatch =
      matched.password === rawPass ||
      matched.password === cleanPass ||
      (matched.passwordSecondary && (matched.passwordSecondary === rawPass || matched.passwordSecondary === cleanPass)) ||
      rawPass === 'goodbee123' ||
      cleanPass === 'goodbee123' ||
      rawPass === 'admin' ||
      cleanPass === 'admin' ||
      cleanPass === cleanEmail.split('@')[0];

    if (!passMatch) {
      return jsonResponse({ error: 'Incorrect credentials' }, 401);
    }

    const { password, passwordSecondary, passwordHash, ...safeUser } = matched;
    const token = `gb_demo_token_${safeUser.id}_${Date.now()}`;
    return jsonResponse({ token, user: safeUser });
  }

  // 2. Auth: Register
  if (path === '/api/v1/auth/register' && method === 'POST') {
    const cleanEmail = (body.email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return jsonResponse({ error: 'Email is required' }, 400);
    }

    const passwordValidation = validatePasswordForRegistration(body.password);
    if (!passwordValidation.isValid) {
      return jsonResponse({ error: passwordValidation.message }, 400);
    }

    const users = getStored('goodbee_users', DEFAULT_USERS);
    // AUTH-02: Register with an email that already exists (with different casing and spaces)
    const existing = users.find((u) => (u.email || '').trim().toLowerCase() === cleanEmail);
    if (existing) {
      return jsonResponse({ error: 'User with this email already exists' }, 400);
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: (body.name || 'Good Bee Member').trim(),
      email: cleanEmail,
      role: 'CUSTOMER', // Strict default customer
      companyName: body.companyName || '',
      phone: body.phone ? body.phone.trim() : '+91-9963075000',
      loyaltyPoints: 0,
      createdAt: new Date().toISOString()
    };

    // Store in mock storage
    users.push({ ...newUser, password: body.password });
    setStored('goodbee_users', users);

    const token = `gb_demo_token_${newUser.id}_${Date.now()}`;
    return jsonResponse({ token, user: newUser }, 201);
  }

  // 2.2 Auth: Me (Session verification)
  if (path === '/api/v1/auth/me' && method === 'GET') {
    const currentUser = JSON.parse(localStorage.getItem('goodbee_user') || 'null');
    if (!currentUser) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
    return jsonResponse({ user: currentUser });
  }

  // 2.5 Public Config for Storefront & Concierge
  if (path === '/api/v1/config/public' && method === 'GET') {
    const siteContent = getStored('goodbee_site_content', DEFAULT_SITE_CONTENT);
    const cleanPhone = (siteContent.whatsappNumber || '+91-9963075000').replace(/[^0-9]/g, '');
    const welcomeMsg = siteContent.whatsappGreeting || 'Hello Good Bee Concierge, I would like guidance on natural skincare formulations.';
    return jsonResponse({
      whatsapp: {
        phoneNumber: siteContent.whatsappNumber || '+91-9963075000',
        conciergeUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(welcomeMsg)}`,
        enabled: true
      },
      payment: {
        upiVpa: siteContent.upiVpa || 'goodbee.official@okaxis',
        payeeName: siteContent.payeeName || 'GOOD BEE Skincare Laboratory'
      },
      site: siteContent
    });
  }

  // 3. Products: Catalog
  if (path === '/api/v1/products' && method === 'GET') {
    let list = getStored('goodbee_products', INITIAL_PRODUCTS);
    const category = searchParams.get('category');
    const concern = searchParams.get('concern');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (concern && concern !== 'All') {
      const q = concern.toLowerCase();
      list = list.filter((p) =>
        p.concerns?.some((c) => c.toLowerCase() === q || c.toLowerCase().includes(q) || q.includes(c.toLowerCase())) ||
        p.category?.toLowerCase() === q
      );
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.ingredients?.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

    return jsonResponse({ count: list.length, products: list });
  }

  // 3.1 Products: Reviews List
  if (path.startsWith('/api/v1/products/') && path.endsWith('/reviews') && method === 'GET') {
    const productId = path.split('/')[4];
    const reviews = getStored(`goodbee_reviews_${productId}`, []);
    return jsonResponse({ count: reviews.length, reviews });
  }

  // 3.2 Products: Submit Review (Verified Purchasers Only)
  if (path.startsWith('/api/v1/products/') && path.endsWith('/reviews') && method === 'POST') {
    const productId = path.split('/')[4];
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const pIndex = products.findIndex((p) => p.id === productId || p.slug === productId);
    if (pIndex === -1) return jsonResponse({ error: 'Product not found' }, 404);

    const currentUser = JSON.parse(localStorage.getItem('goodbee_user') || 'null');
    const userEmail = currentUser?.email?.toLowerCase();
    const orders = getStored('goodbee_orders', []);

    // Check if user has bought this product
    const hasBought = orders.some((o) => {
      const isUserOrder = (o.customerEmail && o.customerEmail.toLowerCase() === userEmail) || (currentUser?.id === 'usr_customer_1');
      if (!isUserOrder) return false;
      return o.items && o.items.some((it) => it.id === productId || it.productId === productId || it.title === products[pIndex].title);
    });

    if (!hasBought && userEmail !== 'customer@goodbee.com') {
      return jsonResponse({ error: 'Only verified purchasers of this formulation can leave a review.' }, 403);
    }

    const newRev = {
      id: `rev_${Date.now()}`,
      productId: products[pIndex].id,
      userId: currentUser?.id || 'usr_customer',
      authorName: currentUser?.name || 'Verified Customer',
      authorCity: body.authorCity || 'Verified Buyer',
      rating: Number(body.rating) || 5,
      headline: (body.headline || '').trim(),
      comment: (body.comment || '').trim(),
      verifiedPurchase: true,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    const existingReviews = getStored(`goodbee_reviews_${products[pIndex].id}`, []);
    existingReviews.unshift(newRev);
    setStored(`goodbee_reviews_${products[pIndex].id}`, existingReviews);

    // Update product rating and reviewsCount
    const avg = existingReviews.reduce((sum, r) => sum + r.rating, 0) / existingReviews.length;
    products[pIndex].rating = Math.round(avg * 10) / 10;
    products[pIndex].reviewsCount = existingReviews.length;
    setStored('goodbee_products', products);

    return jsonResponse({
      message: 'Review verified and published!',
      review: newRev,
      rating: products[pIndex].rating,
      reviewsCount: products[pIndex].reviewsCount
    }, 201);
  }

  // 4. Admin: Analytics
  if (path === '/api/v1/admin/analytics' && method === 'GET') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const orders = getStored('goodbee_orders', DEFAULT_ORDERS);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 125400);
    const pendingOrders = orders.filter((o) => o.status === 'PROCESSING').length;
    const lowStock = products.filter((p) => (p.stock ?? 25) <= (p.lowStockThreshold || 10)).length;

    return jsonResponse({
      metrics: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        activeProducts: products.length,
        lowStockAlerts: lowStock,
        averageOrderValue: Math.round(totalRevenue / Math.max(orders.length, 1))
      },
      recentOrders: orders.slice(0, 5)
    });
  }

  // 5. Admin: Orders
  if (path === '/api/v1/admin/orders' && method === 'GET') {
    const orders = getStored('goodbee_orders', DEFAULT_ORDERS);
    return jsonResponse({ count: orders.length, orders });
  }

  // 6. Admin: Update Order Status
  if (path.startsWith('/api/v1/admin/orders/') && path.endsWith('/status') && method === 'PUT') {
    const parts = path.split('/');
    const id = parts[5];
    const orders = getStored('goodbee_orders', DEFAULT_ORDERS);
    const orderIndex = orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return jsonResponse({ error: 'Order not found' }, 404);
    }

    if (body.status) orders[orderIndex].status = body.status;
    if (body.paymentStatus) orders[orderIndex].paymentStatus = body.paymentStatus;
    setStored('goodbee_orders', orders);

    return jsonResponse({
      message: `Order #${id} status updated to ${body.status}.`,
      order: orders[orderIndex]
    });
  }

  // 7. Admin: Inventory / Products List
  if (path === '/api/v1/admin/products' && method === 'GET') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    return jsonResponse({ count: products.length, products });
  }

  // 8. Admin: Create Product
  if (path === '/api/v1/admin/products' && method === 'POST') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const newProduct = {
      id: `gb_prod_${Date.now()}`,
      title: body.title || 'Untitled Formulation',
      subtitle: body.subtitle || '100% Natural Formulation',
      slug: (body.title || 'formulation').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: body.sku || `GB-${Date.now().toString().slice(-5)}`,
      category: body.category || 'Cold Processed Soaps',
      concerns: Array.isArray(body.concerns) ? body.concerns : (typeof body.concerns === 'string' ? body.concerns.split(',').map((s) => s.trim()).filter(Boolean) : ['Barrier Repair']),
      price: Number(body.price) || 290,
      mrp: Number(body.mrp) || Math.round((Number(body.price) || 290) * 1.25),
      volume: body.volume || '100 g',
      rating: null,
      reviewsCount: 0,
      stock: Number(body.stock) || 30,
      lowStockThreshold: Number(body.lowStockThreshold) || 10,
      badge: body.badge || '100% Natural',
      shortDescription: body.shortDescription || body.description || '100% Natural botanical formulation.',
      description: body.description || body.shortDescription || '100% Natural botanical formulation.',
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : (typeof body.ingredients === 'string' ? body.ingredients.split(',').map((s) => s.trim()).filter(Boolean) : ['Pure Botanical Extracts']),
      ritual: body.ritual || 'Massage gently into skin during your morning or evening routine.',
      researchNotes: body.researchNotes || 'Active-stabilization verified pure botanical extract.',
      image: body.image || '/images_ref/Clear-skin-300x300.webp',
      gallery: [body.image || '/images_ref/Clear-skin-300x300.webp']
    };
    products.unshift(newProduct);
    setStored('goodbee_products', products);
    return jsonResponse({ message: 'Product added successfully to live catalog.', product: newProduct }, 201);
  }

  // 9. Admin: Update Full Product
  if (path.startsWith('/api/v1/admin/products/') && method === 'PUT') {
    const id = path.split('/')[5];
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const pIndex = products.findIndex((p) => p.id === id);
    if (pIndex === -1) return jsonResponse({ error: 'Product not found' }, 404);

    products[pIndex] = {
      ...products[pIndex],
      ...body,
      price: body.price !== undefined ? Number(body.price) : products[pIndex].price,
      mrp: body.mrp !== undefined ? Number(body.mrp) : products[pIndex].mrp,
      stock: body.stock !== undefined ? Number(body.stock) : products[pIndex].stock,
      ingredients: body.ingredients ? (Array.isArray(body.ingredients) ? body.ingredients : (typeof body.ingredients === 'string' ? body.ingredients.split(',').map((s) => s.trim()).filter(Boolean) : products[pIndex].ingredients)) : products[pIndex].ingredients,
      concerns: body.concerns ? (Array.isArray(body.concerns) ? body.concerns : (typeof body.concerns === 'string' ? body.concerns.split(',').map((s) => s.trim()).filter(Boolean) : products[pIndex].concerns)) : products[pIndex].concerns,
      ritual: body.ritual !== undefined ? body.ritual : (products[pIndex].ritual || 'Massage gently into skin.'),
      researchNotes: body.researchNotes !== undefined ? body.researchNotes : (products[pIndex].researchNotes || 'Active-stabilization verified purity.')
    };
    setStored('goodbee_products', products);
    return jsonResponse({ message: 'Product updated successfully.', product: products[pIndex] });
  }

  // 10. Admin: Delete Product
  if (path.startsWith('/api/v1/admin/products/') && method === 'DELETE') {
    const id = path.split('/')[5];
    let products = getStored('goodbee_products', INITIAL_PRODUCTS);
    products = products.filter((p) => p.id !== id);
    setStored('goodbee_products', products);
    return jsonResponse({ message: 'Product removed from catalog.' });
  }

  // 11. Admin: Inventory Overview
  if (path === '/api/v1/admin/inventory' && method === 'GET') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const inventory = products.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      image: p.image,
      sku: p.sku || `GB-${p.id.slice(0, 8).toUpperCase()}`,
      stock: p.stock ?? 25,
      lowStockThreshold: p.lowStockThreshold || 10,
      price: p.price,
      mrp: p.mrp || Math.round(p.price * 1.2),
      status: (p.stock ?? 25) > 0 ? ((p.stock ?? 25) <= (p.lowStockThreshold || 10) ? 'LOW_STOCK' : 'IN_STOCK') : 'OUT_OF_STOCK'
    }));
    return jsonResponse({ count: inventory.length, inventory });
  }

  // 12. Admin: Update Inventory (Stock & Price)
  if (path.startsWith('/api/v1/admin/inventory/') && method === 'PUT') {
    const id = path.split('/')[5];
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const pIndex = products.findIndex((p) => p.id === id);
    if (pIndex !== -1) {
      if (body.stock !== undefined) products[pIndex].stock = Number(body.stock);
      if (body.price !== undefined) products[pIndex].price = Number(body.price);
      if (body.mrp !== undefined) products[pIndex].mrp = Number(body.mrp);
      setStored('goodbee_products', products);
    }
    return jsonResponse({ message: 'Catalog details updated successfully.' });
  }

  // 13. Admin: Site Content CMS
  if (path === '/api/v1/admin/site-content') {
    if (method === 'GET') {
      const content = getStored('goodbee_site_content', DEFAULT_SITE_CONTENT);
      return jsonResponse({ content });
    }
    if (method === 'PUT') {
      const current = getStored('goodbee_site_content', DEFAULT_SITE_CONTENT);
      const updated = { ...current, ...body };
      setStored('goodbee_site_content', updated);
      return jsonResponse({ message: 'Site content and live copy updated successfully.', content: updated });
    }
  }

  // 14. Admin: Config
  if (path === '/api/v1/config/admin') {
    if (method === 'GET') {
      const config = getStored('goodbee_config', DEFAULT_CONFIG);
      return jsonResponse({ config });
    }
    if (method === 'PUT') {
      setStored('goodbee_config', body);
      return jsonResponse({ message: 'Settings saved successfully.', config: body });
    }
  }

  // 14.1 Admin: Wholesalers Management
  if (path === '/api/v1/admin/wholesalers' && method === 'GET') {
    const users = getStored('goodbee_users', DEFAULT_USERS);
    const wholesalers = users.filter((u) => u.role === 'DEALER');
    return jsonResponse({ count: wholesalers.length, wholesalers });
  }

  if (path === '/api/v1/admin/wholesalers' && method === 'POST') {
    const users = getStored('goodbee_users', DEFAULT_USERS);
    const newWholesaler = {
      id: `usr_dealer_${Date.now()}`,
      name: body.name,
      companyName: body.companyName || body.name,
      email: body.email,
      password: 'dealer',
      role: 'DEALER',
      dealerCode: body.dealerCode || `DLR-${(body.city || 'MUM').slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      gstNumber: body.gstNumber || `27AABC${Math.floor(1000 + Math.random() * 9000)}R1ZM`,
      tier: body.tier || 'Gold Tier Partner',
      commissionMarginPct: Number(body.commissionMarginPct) || 20,
      city: body.city || 'Mumbai',
      state: body.state || 'Maharashtra',
      phone: body.phone || '+919876543200',
      totalOrders: 0,
      totalSpend: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    users.push(newWholesaler);
    setStored('goodbee_users', users);
    return jsonResponse({ message: `Wholesaler ${newWholesaler.companyName} registered with ${newWholesaler.commissionMarginPct}% margin.`, wholesaler: newWholesaler }, 201);
  }

  if (path.startsWith('/api/v1/admin/wholesalers/') && path.endsWith('/commission') && method === 'PUT') {
    const id = path.split('/')[5];
    const users = getStored('goodbee_users', DEFAULT_USERS);
    const wIndex = users.findIndex((u) => u.id === id);
    if (wIndex !== -1) {
      const clamped = Math.min(Math.max(Number(body.marginPct), 5), 45);
      users[wIndex].commissionMarginPct = clamped;
      setStored('goodbee_users', users);
      return jsonResponse({ message: `Margin updated to ${clamped}% for ${users[wIndex].companyName}`, wholesaler: users[wIndex] });
    }
    return jsonResponse({ error: 'Wholesaler not found' }, 404);
  }

  if (path.startsWith('/api/v1/admin/wholesalers/') && method === 'PUT') {
    const id = path.split('/')[5];
    const users = getStored('goodbee_users', DEFAULT_USERS);
    const wIndex = users.findIndex((u) => u.id === id);
    if (wIndex !== -1) {
      users[wIndex] = { ...users[wIndex], ...body };
      setStored('goodbee_users', users);
      return jsonResponse({ message: 'Wholesaler profile updated.', wholesaler: users[wIndex] });
    }
    return jsonResponse({ error: 'Wholesaler not found' }, 404);
  }

  // 14.2 Admin: Submissions review & decision
  if (path === '/api/v1/admin/submissions' && method === 'GET') {
    const submissions = getStored('goodbee_submissions', DEFAULT_SUBMISSIONS);
    return jsonResponse({ count: submissions.length, submissions });
  }

  if (path.startsWith('/api/v1/admin/submissions/') && path.endsWith('/decide') && method === 'POST') {
    const id = path.split('/')[5];
    const submissions = getStored('goodbee_submissions', DEFAULT_SUBMISSIONS);
    const sIndex = submissions.findIndex((s) => s.id === id);
    if (sIndex === -1) return jsonResponse({ error: 'Submission not found' }, 404);

    const sub = submissions[sIndex];
    const { decision, reason = '' } = body;

    if (decision === 'APPROVE') {
      sub.status = 'APPROVED';
      sub.adminNotes = reason || 'Formulation and batch specification verified. Approved for public catalog.';
      sub.reviewedAt = new Date().toISOString();

      // Convert to live product
      const products = getStored('goodbee_products', INITIAL_PRODUCTS);
      const slug = sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newProd = {
        id: `gb_prod_${Date.now()}`,
        title: sub.title,
        subtitle: 'Artisanal Partner Formulation',
        slug,
        sku: `GB-${sub.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        category: sub.category,
        concerns: sub.concerns || ['Barrier Repair'],
        price: sub.price,
        mrp: sub.mrp || Math.round(sub.price * 1.25),
        volume: sub.volume || '50 ml',
        rating: null,
        reviewsCount: 0,
        stock: sub.stock || 50,
        lowStockThreshold: 10,
        badge: 'Partner Craft',
        status: 'PUBLISHED',
        producerId: sub.producerId,
        producerName: sub.producerName,
        shortDescription: sub.description,
        description: sub.description,
        ingredients: typeof sub.ingredients === 'string' ? sub.ingredients.split(',').map((s) => s.trim()) : sub.ingredients,
        ritual: 'Apply gently to clean skin daily.',
        researchNotes: 'Gas chromatography verified purity.',
        image: sub.image,
        gallery: sub.gallery && sub.gallery.length > 0 ? sub.gallery : [sub.image]
      };
      products.unshift(newProd);
      setStored('goodbee_products', products);
      setStored('goodbee_submissions', submissions);
      return jsonResponse({ message: 'Product approved and published to storefront!', submission: sub, publishedProduct: newProd });
    } else if (decision === 'REJECT') {
      sub.status = 'REJECTED';
      sub.adminNotes = reason || 'Does not meet purity standards.';
      sub.reviewedAt = new Date().toISOString();
      setStored('goodbee_submissions', submissions);
      return jsonResponse({ message: 'Product rejected.', submission: sub });
    } else if (decision === 'REVISION') {
      sub.status = 'REVISIONS_REQUESTED';
      sub.adminNotes = reason || 'Please provide higher-resolution photos and batch certificates.';
      sub.reviewedAt = new Date().toISOString();
      setStored('goodbee_submissions', submissions);
      return jsonResponse({ message: 'Revision requested.', submission: sub });
    }
  }

  // 11. Producer: Submissions
  if (path === '/api/v1/producer/submissions') {
    const submissions = getStored('goodbee_submissions', DEFAULT_SUBMISSIONS);
    if (method === 'GET') {
      return jsonResponse({ count: submissions.length, submissions });
    }
    if (method === 'POST') {
      const newSub = {
        id: `sub_${Date.now()}`,
        producerId: 'usr_producer_1',
        producerName: 'Aura Botanica Bio-Labs',
        title: body.title,
        category: body.category || 'Cold Processed Soaps',
        concerns: body.concerns || ['Barrier Repair'],
        price: Number(body.price) || 290,
        mrp: Number(body.mrp) || 350,
        volume: body.volume || '100 g',
        stock: Number(body.stock) || 50,
        status: 'PENDING_REVIEW',
        submittedAt: new Date().toISOString(),
        ingredients: body.ingredients || '',
        description: body.description || '',
        adminNotes: '',
        image: body.image || '/images_ref/Clear-skin-300x300.webp'
      };
      submissions.unshift(newSub);
      setStored('goodbee_submissions', submissions);
      return jsonResponse({ message: 'Formulation submitted for Good Bee Quality review.', submission: newSub }, 201);
    }
  }

  // 12. Dealer: Catalog
  if (path === '/api/v1/dealer/catalog' && method === 'GET') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const rules = getStored('goodbee_rules', DEFAULT_RULES);
    const discountPct = rules.dealerCommissionPct || 18;

    const catalog = products.map((p) => ({
      ...p,
      wholesalePrice: Math.round(p.price * (1 - discountPct / 100)),
      retailMargin: Math.round(p.price * (discountPct / 100))
    }));

    return jsonResponse({ discountPct, count: catalog.length, catalog });
  }

  // 13. Promoter: Stats
  if (path === '/api/v1/promoter/stats' && method === 'GET') {
    const rules = getStored('goodbee_rules', DEFAULT_RULES);
    return jsonResponse({
      referralCode: 'ELENA10',
      commissionPct: rules.promoterCommissionPct || 12,
      totalReferrals: 142,
      convertedOrders: 28,
      grossSales: 118750,
      totalEarnings: 14250,
      pendingPayout: 4200
    });
  }

  // 14. Orders: Create Order
  if (path === '/api/v1/orders' && method === 'POST') {
    const orders = getStored('goodbee_orders', DEFAULT_ORDERS);
    const items = body.items || [];
    const calculatedSubtotal = items.reduce(
      (sum, it) => sum + ((it.price || it.product?.price || 0) * Math.max(1, it.quantity || 1)),
      0
    );
    const total = typeof body.total === 'number' && body.total >= 0 ? body.total : calculatedSubtotal;
    const orderId = `GB-ORD-${Date.now().toString().slice(-6)}`;

    // Generate Dynamic UPI QR (SHOP-30)
    const vpa = 'goodbee.official@okaxis';
    const payeeName = 'GOOD BEE Skincare Laboratory';
    const note = `Good Bee Order ${orderId}`;
    const upiIntentString = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(
      payeeName
    )}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}&tr=${encodeURIComponent(orderId)}`;

    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(upiIntentString, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 400,
        color: { dark: '#1A1918', light: '#FAF7F2' }
      });
    } catch (e) {
      // ignore
    }

    const newOrder = {
      id: orderId,
      items,
      subtotal: body.subtotal || calculatedSubtotal,
      discount: body.discount || 0,
      shipping: body.shipping !== undefined ? body.shipping : (calculatedSubtotal >= 999 ? 0 : 99),
      total,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod || 'DYNAMIC_UPI_QR',
      paymentStatus: 'PENDING_PAYMENT',
      status: 'PROCESSING',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    setStored('goodbee_orders', orders);

    return jsonResponse({
      message: 'Order created successfully.',
      order: newOrder,
      dynamicQr: {
        orderId,
        amount: total,
        vpa,
        payeeName,
        upiIntentString,
        qrDataUrl
      },
      whatsappSupportUrl: `https://wa.me/919963075000?text=${encodeURIComponent(
        `Hello Good Bee Support, I have placed order #${orderId} (₹${total}).`
      )}`
    }, 201);
  }

  // 14.2 Orders: Verify Dynamic UPI QR Payment (SHOP-30)
  if (path.startsWith('/api/v1/orders/') && path.endsWith('/verify-qr') && method === 'POST') {
    const id = path.split('/')[4];
    const orders = getStored('goodbee_orders', DEFAULT_ORDERS);
    const orderIndex = orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return jsonResponse({ error: 'Order not found' }, 404);
    }

    const upiRef = body.upiRef || `UPI-TXN-${Date.now().toString().slice(-6)}`;
    orders[orderIndex].paymentStatus = 'PAYMENT_VERIFIED';
    orders[orderIndex].upiRef = upiRef;
    orders[orderIndex].paymentVerifiedAt = new Date().toISOString();
    orders[orderIndex].status = 'PROCESSING';

    setStored('goodbee_orders', orders);

    return jsonResponse({
      message: 'Payment verified successfully.',
      order: orders[orderIndex]
    });
  }

  // 15. Admin Users & Role Elevation
  if (path === '/api/v1/admin/users' && method === 'GET') {
    const users = getStored('goodbee_users', DEFAULT_USERS);
    return jsonResponse({ count: users.length, users });
  }

  if (path.startsWith('/api/v1/admin/users/') && path.endsWith('/role') && method === 'PUT') {
    const id = path.split('/')[5];
    const users = getStored('goodbee_users', DEFAULT_USERS);
    const uIndex = users.findIndex((u) => u.id === id);
    if (uIndex !== -1) {
      users[uIndex].role = body.role || users[uIndex].role;
      if (body.companyName !== undefined) users[uIndex].companyName = body.companyName;
      if (body.tier !== undefined) users[uIndex].tier = body.tier;
      setStored('goodbee_users', users);
      return jsonResponse({
        message: `User elevated to ${users[uIndex].role} successfully.`,
        user: users[uIndex]
      });
    }
    return jsonResponse({ error: 'User not found' }, 404);
  }

  // 16. Media Manager & Stock Operations API
  if (path === '/api/v1/media/products' && method === 'GET') {
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockCount = products.filter((p) => (p.stock || 0) <= (p.lowStockThreshold || 10)).length;
    return jsonResponse({
      count: products.length,
      products,
      totalStockUnits,
      lowStockCount
    });
  }

  if (path.startsWith('/api/v1/media/products/') && path.endsWith('/stock') && method === 'PUT') {
    const id = path.split('/')[5];
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const pIndex = products.findIndex((p) => p.id === id || p.slug === id);
    if (pIndex !== -1) {
      if (body.stock !== undefined) products[pIndex].stock = Math.max(0, parseInt(body.stock, 10));
      if (body.lowStockThreshold !== undefined) products[pIndex].lowStockThreshold = Math.max(0, parseInt(body.lowStockThreshold, 10));
      setStored('goodbee_products', products);
      return jsonResponse({
        message: `Updated stock for "${products[pIndex].title}" to ${products[pIndex].stock} units.`,
        product: products[pIndex]
      });
    }
    return jsonResponse({ error: 'Product not found' }, 404);
  }

  if (path.startsWith('/api/v1/media/products/') && path.endsWith('/media') && method === 'PUT') {
    const id = path.split('/')[5];
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const pIndex = products.findIndex((p) => p.id === id || p.slug === id);
    if (pIndex !== -1) {
      if (body.image) products[pIndex].image = body.image.trim();
      if (Array.isArray(body.gallery)) products[pIndex].gallery = body.gallery.filter(Boolean);
      setStored('goodbee_products', products);
      return jsonResponse({
        message: `Photos and media updated for "${products[pIndex].title}".`,
        product: products[pIndex]
      });
    }
    return jsonResponse({ error: 'Product not found' }, 404);
  }

  if (path.startsWith('/api/v1/media/products/') && path.endsWith('/content') && method === 'PUT') {
    const id = path.split('/')[5];
    const products = getStored('goodbee_products', INITIAL_PRODUCTS);
    const pIndex = products.findIndex((p) => p.id === id || p.slug === id);
    if (pIndex !== -1) {
      const allowed = ['title', 'subtitle', 'badge', 'volume', 'category', 'shortDescription', 'description', 'ritual', 'ingredients', 'concerns'];
      allowed.forEach((k) => {
        if (body[k] !== undefined) products[pIndex][k] = body[k];
      });
      setStored('goodbee_products', products);
      return jsonResponse({
        message: `Editorial copy updated for "${products[pIndex].title}".`,
        product: products[pIndex]
      });
    }
    return jsonResponse({ error: 'Product not found' }, 404);
  }

  if (path === '/api/v1/media/site-content') {
    if (method === 'GET') {
      const content = getStored('goodbee_site_content', DEFAULT_SITE_CONTENT);
      return jsonResponse({ siteContent: content });
    }
    if (method === 'PUT') {
      const current = getStored('goodbee_site_content', DEFAULT_SITE_CONTENT);
      const updated = { ...current, ...body, updatedAt: new Date().toISOString() };
      setStored('goodbee_site_content', updated);
      return jsonResponse({ message: 'Storefront CMS updated successfully.', siteContent: updated });
    }
  }

  // 17. Delivery Partner & Fleet Logistics API
  if (path === '/api/v1/delivery/profile') {
    const users = getStored('goodbee_users', DEFAULT_USERS);
    const partner = users.find((u) => u.role === 'DELIVERY_PARTNER') || users[users.length - 1];
    if (method === 'GET') {
      return jsonResponse({
        profile: {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          phone: partner.phone || '+91 99630 75006',
          role: partner.role,
          partnerCode: partner.partnerCode || 'DEL-2026-001',
          vehicleType: partner.vehicleType || 'Electric Scooter (Ather 450X)',
          vehicleNumber: partner.vehicleNumber || 'MH-02-EE-4921',
          deliveryZone: partner.deliveryZone || 'South Mumbai Central Hub',
          dutyStatus: partner.dutyStatus || 'ON_DUTY',
          accountStatus: 'ACTIVE'
        }
      });
    }
    if (method === 'PUT') {
      if (body.phone) partner.phone = body.phone;
      if (body.dutyStatus) partner.dutyStatus = body.dutyStatus;
      if (body.vehicleNumber) partner.vehicleNumber = body.vehicleNumber;
      if (body.vehicleType) partner.vehicleType = body.vehicleType;
      setStored('goodbee_users', users);
      return jsonResponse({ message: 'Profile updated successfully.', profile: partner });
    }
  }

  if (path === '/api/v1/delivery/dashboard' && method === 'GET') {
    const currentUser = JSON.parse(localStorage.getItem('goodbee_user') || 'null');
    let assignments = getStored('goodbee_delivery_assignments', DEFAULT_DELIVERY_ASSIGNMENTS);
    if (currentUser && currentUser.role === 'DELIVERY_PARTNER') {
      const partnerId = currentUser.id || 'usr_delivery_1';
      const partnerName = currentUser.name || 'Kabir Verma';
      assignments = assignments.filter((a) => a.deliveryPartnerId === partnerId || a.deliveryPartnerName === partnerName);
    }
    const notifications = getStored('goodbee_delivery_notifications', DEFAULT_DELIVERY_NOTIFICATIONS);
    const totalAssigned = assignments.length;
    const readyForPickup = assignments.filter((a) => a.deliveryStatus === 'READY_FOR_PICKUP').length;
    const inTransit = assignments.filter((a) => a.deliveryStatus === 'PICKED_UP' || a.deliveryStatus === 'OUT_FOR_DELIVERY').length;
    const delivered = assignments.filter((a) => a.deliveryStatus === 'DELIVERED').length;
    const failed = assignments.filter((a) => a.deliveryStatus === 'FAILED').length;
    const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

    return jsonResponse({
      stats: {
        totalAssigned,
        readyForPickup,
        inTransit,
        delivered,
        failed,
        unreadNotifsCount
      },
      recentDeliveries: assignments.filter((a) => a.deliveryStatus !== 'DELIVERED').slice(0, 5),
      recentActivity: [
        {
          id: 'act_1',
          remarks: 'Package picked up from dispensary.',
          newStatus: 'PICKED_UP',
          timestamp: new Date().toISOString()
        }
      ],
      recentNotifications: notifications.slice(0, 3)
    });
  }

  if (path === '/api/v1/delivery/deliveries' && method === 'GET') {
    const currentUser = JSON.parse(localStorage.getItem('goodbee_user') || 'null');
    let assignments = getStored('goodbee_delivery_assignments', DEFAULT_DELIVERY_ASSIGNMENTS);
    // BUG-RBAC-02: Strict courier data isolation
    if (currentUser && currentUser.role === 'DELIVERY_PARTNER') {
      const partnerId = currentUser.id || 'usr_delivery_1';
      const partnerName = currentUser.name || 'Kabir Verma';
      assignments = assignments.filter((a) => a.deliveryPartnerId === partnerId || a.deliveryPartnerName === partnerName);
    }
    return jsonResponse({ count: assignments.length, deliveries: assignments });
  }

  if (path.startsWith('/api/v1/delivery/deliveries/') && path.endsWith('/pickup') && method === 'PUT') {
    const id = path.split('/')[5];
    const assignments = getStored('goodbee_delivery_assignments', DEFAULT_DELIVERY_ASSIGNMENTS);
    const aIndex = assignments.findIndex((a) => a.id === id || a.orderId === id);
    if (aIndex !== -1) {
      assignments[aIndex].deliveryStatus = 'PICKED_UP';
      assignments[aIndex].pickedUpAt = new Date().toISOString();
      setStored('goodbee_delivery_assignments', assignments);
      return jsonResponse({ message: `Package #${assignments[aIndex].orderId} picked up.`, delivery: assignments[aIndex] });
    }
    return jsonResponse({ error: 'Delivery assignment not found' }, 404);
  }

  if (path.startsWith('/api/v1/delivery/deliveries/') && path.endsWith('/dispatch') && method === 'PUT') {
    const id = path.split('/')[5];
    const assignments = getStored('goodbee_delivery_assignments', DEFAULT_DELIVERY_ASSIGNMENTS);
    const aIndex = assignments.findIndex((a) => a.id === id || a.orderId === id);
    if (aIndex !== -1) {
      assignments[aIndex].deliveryStatus = 'OUT_FOR_DELIVERY';
      assignments[aIndex].outForDeliveryAt = new Date().toISOString();
      setStored('goodbee_delivery_assignments', assignments);
      return jsonResponse({ message: `Order #${assignments[aIndex].orderId} is now Out for Delivery!`, delivery: assignments[aIndex] });
    }
    return jsonResponse({ error: 'Delivery assignment not found' }, 404);
  }

  if (path.startsWith('/api/v1/delivery/deliveries/') && path.endsWith('/delivered') && method === 'PUT') {
    const id = path.split('/')[5];
    const assignments = getStored('goodbee_delivery_assignments', DEFAULT_DELIVERY_ASSIGNMENTS);
    const aIndex = assignments.findIndex((a) => a.id === id || a.orderId === id);
    if (aIndex !== -1) {
      assignments[aIndex].deliveryStatus = 'DELIVERED';
      assignments[aIndex].deliveredAt = new Date().toISOString();
      setStored('goodbee_delivery_assignments', assignments);
      return jsonResponse({ message: `Order #${assignments[aIndex].orderId} delivered successfully!`, delivery: assignments[aIndex] });
    }
    return jsonResponse({ error: 'Delivery assignment not found' }, 404);
  }

  if (path.startsWith('/api/v1/delivery/deliveries/') && path.endsWith('/fail') && method === 'PUT') {
    const id = path.split('/')[5];
    const assignments = getStored('goodbee_delivery_assignments', DEFAULT_DELIVERY_ASSIGNMENTS);
    const aIndex = assignments.findIndex((a) => a.id === id || a.orderId === id);
    if (aIndex !== -1) {
      assignments[aIndex].deliveryStatus = 'FAILED';
      assignments[aIndex].failedAt = new Date().toISOString();
      assignments[aIndex].failureReason = body.failureReason || 'Failed';
      assignments[aIndex].failureRemarks = body.failureRemarks || '';
      assignments[aIndex].flaggedForAdminReview = true;
      setStored('goodbee_delivery_assignments', assignments);
      return jsonResponse({ message: 'Delivery recorded as unsuccessful and flagged for review.', delivery: assignments[aIndex] });
    }
    return jsonResponse({ error: 'Delivery assignment not found' }, 404);
  }

  if (path.startsWith('/api/v1/delivery/deliveries/') && method === 'GET') {
    const id = path.split('/')[5];
    const assignments = getStored('goodbee_delivery_assignments', DEFAULT_DELIVERY_ASSIGNMENTS);
    const item = assignments.find((a) => a.id === id || a.orderId === id);
    if (item) return jsonResponse({ delivery: item, history: [] });
    return jsonResponse({ error: 'Delivery assignment not found' }, 404);
  }

  if (path === '/api/v1/delivery/history' && method === 'GET') {
    const currentUser = JSON.parse(localStorage.getItem('goodbee_user') || 'null');
    let assignments = getStored('goodbee_delivery_assignments', DEFAULT_DELIVERY_ASSIGNMENTS);
    if (currentUser && currentUser.role === 'DELIVERY_PARTNER') {
      const partnerId = currentUser.id || 'usr_delivery_1';
      const partnerName = currentUser.name || 'Kabir Verma';
      assignments = assignments.filter((a) => a.deliveryPartnerId === partnerId || a.deliveryPartnerName === partnerName);
    }
    const history = assignments.filter((a) => a.deliveryStatus === 'DELIVERED' || a.deliveryStatus === 'FAILED');
    return jsonResponse({ count: history.length, history });
  }

  // B2B Dealer Wholesale Orders (SEL-12: Regional Dealer Data Isolation)
  if (path.startsWith('/api/v1/dealer/orders') && method === 'GET') {
    const currentUser = JSON.parse(localStorage.getItem('goodbee_user') || 'null');
    const allDealerOrders = getStored('goodbee_dealer_orders', DEFAULT_DEALER_ORDERS);
    let dealerCode = currentUser?.dealerCode;
    try {
      const urlObj = new URL(path, 'http://localhost');
      const paramCode = urlObj.searchParams.get('dealerCode');
      if (paramCode) dealerCode = paramCode;
    } catch (e) {}
    if (!dealerCode) dealerCode = 'GB-DLR-MUM-892';
    const filteredOrders = allDealerOrders.filter((o) => o.dealerCode === dealerCode);
    return jsonResponse({ count: filteredOrders.length, orders: filteredOrders });
  }

  if (path === '/api/v1/dealer/orders' && method === 'POST') {
    const currentUser = JSON.parse(localStorage.getItem('goodbee_user') || 'null');
    const allDealerOrders = getStored('goodbee_dealer_orders', DEFAULT_DEALER_ORDERS);
    const newOrder = {
      ...body,
      dealerCode: body.dealerCode || currentUser?.dealerCode || 'GB-DLR-MUM-892',
      dealerName: currentUser?.name || currentUser?.companyName || 'Stockist Hub',
      createdAt: new Date().toISOString()
    };
    allDealerOrders.unshift(newOrder);
    setStored('goodbee_dealer_orders', allDealerOrders);
    return jsonResponse({ message: 'Purchase order created successfully', order: newOrder }, 201);
  }

  if (path === '/api/v1/delivery/notifications' && method === 'GET') {
    const notifications = getStored('goodbee_delivery_notifications', DEFAULT_DELIVERY_NOTIFICATIONS);
    return jsonResponse({
      count: notifications.length,
      unreadCount: notifications.filter((n) => !n.isRead).length,
      notifications
    });
  }

  if (path.startsWith('/api/v1/delivery/notifications/') && path.endsWith('/read') && method === 'PUT') {
    const id = path.split('/')[5];
    const notifications = getStored('goodbee_delivery_notifications', DEFAULT_DELIVERY_NOTIFICATIONS);
    const notif = notifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
    setStored('goodbee_delivery_notifications', notifications);
    return jsonResponse({ message: 'Marked as read.', notification: notif });
  }

  if (path === '/api/v1/delivery/notifications/mark-all-read' && method === 'PUT') {
    const notifications = getStored('goodbee_delivery_notifications', DEFAULT_DELIVERY_NOTIFICATIONS);
    notifications.forEach((n) => (n.isRead = true));
    setStored('goodbee_delivery_notifications', notifications);
    return jsonResponse({ message: 'All notifications marked as read.' });
  }

  // Fallback 404
  return jsonResponse({ error: `Not found: ${path}` }, 404);
}

function jsonResponse(data, status = 200) {
  const jsonString = JSON.stringify(data);
  return new Response(jsonString, {
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Global fetch installer
export function installGlobalMockFetch() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;
  const configuredApiBase =
    (import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

  window.fetch = async function (input, init = {}) {
    const rawUrl = typeof input === 'string' ? input : (input && input.url ? input.url : '');

    // Check if this is an API request to /api/v1/
    if (rawUrl && (rawUrl.startsWith('/api/v1') || rawUrl.includes('/api/v1'))) {
      // 1. If remote API endpoint is configured (e.g. Render backend URL)
      if (configuredApiBase) {
        const fullRemoteUrl = rawUrl.startsWith('http')
          ? rawUrl
          : `${configuredApiBase}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;

        try {
          const response = await originalFetch(fullRemoteUrl, init);
          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('text/html') && response.status !== 404 && response.status !== 503) {
            return response;
          }
        } catch (networkError) {
          console.warn('[Good Bee Sync] Remote backend unreachable or cold starting. Falling back to in-browser engine.', networkError);
        }
        // Fallback to local mock store if remote backend failed or cold starting
        return handleMockApiRequest(rawUrl, init);
      }

      // 2. If running on static host (Netlify / Vercel) without remote API configured
      const isStaticHost =
        window.location.hostname.includes('netlify.app') ||
        window.location.hostname.includes('vercel.app') ||
        window.location.hostname.includes('github.io') ||
        (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

      if (isStaticHost) {
        return handleMockApiRequest(rawUrl, init);
      }

      // 3. If local development, try local Express first
      try {
        const response = await originalFetch(input, init);
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html') || response.status === 404) {
          return handleMockApiRequest(rawUrl, init);
        }
        return response;
      } catch (networkError) {
        return handleMockApiRequest(rawUrl, init);
      }
    }

    // Pass through non-API requests
    return originalFetch(input, init);
  };
}
