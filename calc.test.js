// Run: node calc.test.js — checks against the examples printed in AIA's brochures.
const assert = require('assert');
const c = require('./calc.js');

// 20 Pay Life brochure: male 35, SA 1,000,000 → 22,300/yr
assert.strictEqual(c.premiumPay20('M', 35, 1000000), 22300);
// Discount bands
assert.strictEqual(c.pay20Discount(249999), 0);
assert.strictEqual(c.pay20Discount(250000), 1);
assert.strictEqual(c.pay20Discount(600000), 2);
assert.strictEqual(c.premiumPay20('F', 0, 100000), 1147);
assert.strictEqual(c.premiumPay20('M', 70, 100000), 7811);
assert.strictEqual(c.premiumPay20('M', 71, 100000), null);
assert.strictEqual(c.premiumPay20('M', 30, 50000), null);

// Senior Happy brochure: male 50, SA 200,000 → 11,960/yr
assert.strictEqual(c.premiumSenior('M', 50, 200000), 11960);
// Senior Happy brochure: female 50, SA 50,000 → "about 7 baht/day"
assert.strictEqual(c.premiumSenior('F', 50, 50000), 2501);
assert.strictEqual(Math.round(2501 / 365), 7);
assert.strictEqual(c.premiumSenior('F', 70, 200000), 21390);
assert.strictEqual(c.premiumSenior('M', 49, 100000), null);
assert.strictEqual(c.premiumSenior('M', 60, 300000), null);

// CI Plus age bands
assert.strictEqual(c.premiumCI('M', 35, 1000000), 3840);
assert.strictEqual(c.premiumCI('M', 36, 1000000), 5230);
assert.strictEqual(c.premiumCI('F', 0, 1000000), 2270);
assert.strictEqual(c.premiumCI('F', 60, 1000000), 26090);
assert.strictEqual(c.premiumCI('M', 61, 1000000), null);

console.log('All calculator checks passed');
