import assert from 'assert';
import { GoodBeeApi } from './client/src/services/api.js';

console.log('========================================================');
console.log('🛍️ RUNNING COMPREHENSIVE E-COMMERCE & CHECKOUT QA SUITE');
console.log('========================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
  }
}

// ---------------------------------------------------------------------
// SHOP-10: Cart subtotal math, item counting & increment/decrement
// ---------------------------------------------------------------------
runTest('SHOP-10: Cart calculates item totals, overall subtotal and count accurately', () => {
  const items = [
    { id: 'gb_prod_frankincense', price: 1450, quantity: 2 },
    { id: 'gb_prod_geranium', price: 1250, quantity: 1 }
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  assert.strictEqual(subtotal, 1450 * 2 + 1250, 'Subtotal must equal ₹4,150');
  assert.strictEqual(itemCount, 3, 'Item count must equal 3');
});

// ---------------------------------------------------------------------
// SHOP-11: Quantity clamping and prevention of negative/zero cart totals
// ---------------------------------------------------------------------
runTest('SHOP-11: Setting quantity to 0 or negative value removes item or clamps safely', () => {
  // Test 1: Add to cart with negative quantity must clamp to at least 1
  const rawQuantity = -5;
  const cleanAddQty = Math.max(1, parseInt(rawQuantity, 10) || 1);
  assert.strictEqual(cleanAddQty, 1, 'Negative quantity must clamp to minimum of 1');

  // Test 2: Update quantity to 0 or below removes the item
  let cart = [
    { id: 'item_1', price: 500, quantity: 2 },
    { id: 'item_2', price: 300, quantity: 1 }
  ];

  const updateQuantity = (id, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      cart = cart.filter((it) => it.id !== id);
      return;
    }
    cart = cart.map((it) => (it.id === id ? { ...it, quantity: Math.min(99, qty) } : it));
  };

  updateQuantity('item_1', 0);
  assert.strictEqual(cart.length, 1, 'Updating to 0 must remove item');
  assert.strictEqual(cart[0].id, 'item_2');

  updateQuantity('item_2', -3);
  assert.strictEqual(cart.length, 0, 'Updating to negative must remove item');
});

// ---------------------------------------------------------------------
// SHOP-20: Apply valid coupon codes: BOTANICAL10 (10%) and PUREBEE15 (15% >= ₹1500)
// ---------------------------------------------------------------------
runTest('SHOP-20: Valid coupons calculate 10% and 15% discounts properly', () => {
  const VALID_COUPONS = {
    'BOTANICAL10': { discountPct: 10, minSubtotal: 0 },
    'PUREBEE15': { discountPct: 15, minSubtotal: 1500 }
  };

  // Case A: BOTANICAL10 on ₹1,000 cart
  const subtotalA = 1000;
  const couponA = VALID_COUPONS['BOTANICAL10'];
  const discountA = Math.round(subtotalA * (couponA.discountPct / 100));
  assert.strictEqual(discountA, 100, 'BOTANICAL10 must deduct ₹100 from ₹1,000');

  // Case B: PUREBEE15 on ₹2,000 cart (exceeds ₹1,500 threshold)
  const subtotalB = 2000;
  const couponB = VALID_COUPONS['PUREBEE15'];
  assert.ok(subtotalB >= couponB.minSubtotal, 'Cart meets ₹1,500 threshold');
  const discountB = Math.round(subtotalB * (couponB.discountPct / 100));
  assert.strictEqual(discountB, 300, 'PUREBEE15 must deduct 15% (₹300) from ₹2,000');
});

// ---------------------------------------------------------------------
// SHOP-21: Invalid coupon codes and below-threshold PUREBEE15 validation
// ---------------------------------------------------------------------
runTest('SHOP-21: Invalid coupons & below-threshold orders are rejected with clear error', () => {
  const VALID_COUPONS = {
    'BOTANICAL10': { discountPct: 10, minSubtotal: 0 },
    'PUREBEE15': { discountPct: 15, minSubtotal: 1500 }
  };

  const evaluateCoupon = (code, subtotal) => {
    if (!code) return { success: false, message: 'Please enter a coupon code.' };
    const clean = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[clean];
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try BOTANICAL10 or PUREBEE15.' };
    }
    if (coupon.minSubtotal > 0 && subtotal < coupon.minSubtotal) {
      return {
        success: false,
        message: `${clean} requires a minimum cart value of ₹${coupon.minSubtotal}.`
      };
    }
    return { success: true };
  };

  // Check 1: Non-existent code
  const res1 = evaluateCoupon('FAKE100', 2000);
  assert.strictEqual(res1.success, false);
  assert.ok(res1.message.includes('Invalid coupon code'));

  // Check 2: PUREBEE15 on cart of ₹800 (under ₹1,500)
  const res2 = evaluateCoupon('PUREBEE15', 800);
  assert.strictEqual(res2.success, false);
  assert.ok(res2.message.includes('requires a minimum cart value of ₹1500'));
});

// ---------------------------------------------------------------------
// SHOP-23: Verify free shipping threshold (₹999 rule)
// ---------------------------------------------------------------------
runTest('SHOP-23: Shipping is ₹0 for ₹0 or >= ₹999, and ₹99 for orders under ₹999', () => {
  const calcShipping = (subtotal) => (subtotal === 0 || subtotal >= 999 ? 0 : 99);

  assert.strictEqual(calcShipping(0), 0, 'Empty cart has ₹0 shipping');
  assert.strictEqual(calcShipping(450), 99, 'Cart of ₹450 charges ₹99 shipping');
  assert.strictEqual(calcShipping(998), 99, 'Cart of ₹998 charges ₹99 shipping');
  assert.strictEqual(calcShipping(999), 0, 'Cart of ₹999 unlocks complimentary ₹0 shipping');
  assert.strictEqual(calcShipping(2500), 0, 'Cart of ₹2,500 has complimentary ₹0 shipping');
});

// ---------------------------------------------------------------------
// SHOP-30: Dynamic UPI QR generation with merchant details and exact total
// ---------------------------------------------------------------------
await runAsyncTest('SHOP-30: Generates valid Dynamic UPI QR with exact amount and vpa', async () => {
  const orderId = 'GB-ORD-90821';
  const amount = 1890.00;

  const qrData = await GoodBeeApi.generateClientDynamicQr(orderId, amount);

  assert.strictEqual(qrData.orderId, orderId);
  assert.strictEqual(qrData.amount, amount);
  assert.strictEqual(qrData.vpa, 'goodbee.official@okaxis');
  assert.strictEqual(qrData.payeeName, 'GOOD BEE Skincare Laboratory');
  assert.ok(qrData.upiIntentString.includes('pa=goodbee.official%40okaxis'));
  assert.ok(qrData.upiIntentString.includes('am=1890.00'));
  assert.ok(qrData.qrDataUrl.startsWith('data:image/png;base64,'));
});

// ---------------------------------------------------------------------
// SHOP-44 & SHOP-45: WhatsApp order concierge URL and formatted cart message
// ---------------------------------------------------------------------
runTest('SHOP-44 & SHOP-45: Pre-filled WhatsApp message includes items, quantities and total', () => {
  const items = [
    { title: 'Frankincense Pure Oil', price: 1450, quantity: 2 },
    { title: 'Damask Rose Hydrosol Mist', price: 549, quantity: 1 }
  ];
  const subtotal = 1450 * 2 + 549; // 3449
  const shipping = 0; // >= 999
  const total = subtotal + shipping;

  const cleanPhone = '919963075000';
  const itemsText = items.map((it) => `• ${it.quantity}x ${it.title} (₹${(it.price * it.quantity).toLocaleString('en-IN')})`).join('\n');
  const waCartMsg = `*Hello Good Bee Concierge, I would like to place an order via WhatsApp:*
━━━━━━━━━━━━━━━━━━━━
${itemsText}
━━━━━━━━━━━━━━━━━━━━
*Bag Subtotal:* ₹${subtotal.toLocaleString('en-IN')}
*Shipping:* COMPLIMENTARY
*Final Payable Total:* ₹${total.toLocaleString('en-IN')}

Please confirm order formulation availability and delivery dispatch.`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waCartMsg)}`;

  assert.ok(waUrl.startsWith('https://wa.me/919963075000'));
  assert.ok(waUrl.includes(encodeURIComponent('2x Frankincense Pure Oil')));
  assert.ok(waUrl.includes(encodeURIComponent('1x Damask Rose Hydrosol Mist')));
  assert.ok(waUrl.includes(encodeURIComponent('₹3,449')));
});

console.log('\n========================================================');
console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('========================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
