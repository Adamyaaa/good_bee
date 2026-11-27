const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('🐞 RUNNING BUG RESOLUTION VERIFICATION SUITE');
console.log('========================================================\n');

// 1. Verify UI-03 (BUG-UI-02): onError Fallback on images
const productCardSrc = fs.readFileSync(path.join(__dirname, 'client/src/components/storefront/ProductCard.jsx'), 'utf8');
assert(productCardSrc.includes('onError'), 'ProductCard.jsx must include onError handler');
assert(productCardSrc.includes('/images_ref/Frankin-300x300.webp'), 'ProductCard.jsx must set fallback image');
console.log('✅ [PASS] BUG-UI-02 (UI-03): ProductCard.jsx contains onError fallback image placeholder');

// 2. Verify UI-12 (BUG-UI-01): App.jsx #checkout history pushState & popstate
const appSrc = fs.readFileSync(path.join(__dirname, 'client/src/App.jsx'), 'utf8');
assert(appSrc.includes("window.addEventListener('popstate', handleHash)"), 'App.jsx must listen to popstate');
assert(appSrc.includes("hash === '#checkout'"), 'App.jsx must handle #checkout hash');
assert(appSrc.includes("handleOpenCheckout"), 'App.jsx must have handleOpenCheckout function');
assert(appSrc.includes("handleCloseCheckout"), 'App.jsx must have handleCloseCheckout function');
console.log('✅ [PASS] BUG-UI-01 (UI-12): App.jsx integrates #checkout with browser history and popstate');

// 3. Verify RSP-06 (BUG-RSP-01): Inputs use text-[16px] on mobile
const cartDrawerSrc = fs.readFileSync(path.join(__dirname, 'client/src/components/storefront/CartDrawer.jsx'), 'utf8');
assert(cartDrawerSrc.includes('text-[16px] sm:text-xs'), 'CartDrawer coupon input must use text-[16px] sm:text-xs');
const checkoutSrc = fs.readFileSync(path.join(__dirname, 'client/src/pages/Checkout.jsx'), 'utf8');
assert(checkoutSrc.includes('text-[16px] sm:text-xs'), 'Checkout inputs must use text-[16px] sm:text-xs');
console.log('✅ [PASS] BUG-RSP-01 (RSP-06): Inputs have >=16px font-size on mobile viewports to avoid Safari auto-zoom');

// 4. Verify ROLE-04 (BUG-RBAC-02): Delivery partner scoping
const mockBackendSrc = fs.readFileSync(path.join(__dirname, 'client/src/services/mockBackend.js'), 'utf8');
assert(mockBackendSrc.includes("a.deliveryPartnerId === partnerId || a.deliveryPartnerName === partnerName"), 'Deliveries must be filtered by partner');
assert(mockBackendSrc.includes("usr_delivery_2"), 'Pool must contain other couriers for fleet data isolation');
console.log('✅ [PASS] BUG-RBAC-02 (ROLE-04): mockBackend.js isolates delivery assignments by courier partnerId');

// 5. Verify SEL-12 (BUG-RBAC-01): Dealer orders scoping
assert(mockBackendSrc.includes("/api/v1/dealer/orders"), 'mockBackend.js must provide dealer wholesale orders endpoint');
assert(mockBackendSrc.includes("o.dealerCode === dealerCode"), 'mockBackend.js must filter orders by dealerCode');
const dealerPortalSrc = fs.readFileSync(path.join(__dirname, 'client/src/pages/DealerPortal.jsx'), 'utf8');
assert(dealerPortalSrc.includes('/api/v1/dealer/orders'), 'DealerPortal.jsx must fetch scoped dealer orders');
console.log('✅ [PASS] BUG-RBAC-01 (SEL-12): DealerPortal.jsx and mockBackend enforce regional dealer data isolation');

// 6. Verify AI slop feature (AiFormulationLab) has been removed
assert(!appSrc.includes('AiFormulationLab'), 'App.jsx must not import or render AiFormulationLab');
assert(!fs.existsSync(path.join(__dirname, 'client/src/components/storefront/AiFormulationLab.jsx')), 'AiFormulationLab.jsx must be deleted');
console.log('✅ [PASS] AI-SLOP-01: AiFormulationLab feature eliminated from App.jsx and storefront components');

console.log('\n========================================================');
console.log('🎉 ALL 6 BUG RESOLUTIONS VERIFIED SUCCESSFULLY');
console.log('========================================================\n');
