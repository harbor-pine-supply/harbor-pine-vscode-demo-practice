import { test } from "node:test";
import assert from "node:assert/strict";
import { subtotal, formatCents, applyLoyaltyDiscount } from "../src/order.js";

test("subtotal adds line totals in cents", () => {
  assert.equal(subtotal([{ unitCents: 1299, qty: 2 }, { unitCents: 450, qty: 1 }]), 3048);
});

test("formatCents formats cents as dollars", () => {
  assert.equal(formatCents(3048), "$30.48");
  assert.equal(formatCents(-250), "-$2.50");
});

test("applyLoyaltyDiscount gives members 10% off", () => {
  assert.equal(applyLoyaltyDiscount(3000, true), 2700);
});

test("applyLoyaltyDiscount charges non-members the full subtotal", () => {
  assert.equal(applyLoyaltyDiscount(3048, false), 3048);
});

test("applyLoyaltyDiscount rounds an exact half cent up (rule A)", () => {
  assert.equal(applyLoyaltyDiscount(1005, true), 905);
});

test("applyLoyaltyDiscount rounds to the nearest cent", () => {
  assert.equal(applyLoyaltyDiscount(1234, true), 1111);
});

test("applyLoyaltyDiscount always returns whole cents", () => {
  for (let cents = 0; cents <= 999; cents++) {
    assert.ok(Number.isInteger(applyLoyaltyDiscount(cents, true)), `member, ${cents}`);
    assert.ok(Number.isInteger(applyLoyaltyDiscount(cents, false)), `non-member, ${cents}`);
  }
});

test("applyLoyaltyDiscount rejects bad input", () => {
  assert.throws(() => applyLoyaltyDiscount(10.5, true), TypeError);
  assert.throws(() => applyLoyaltyDiscount("1000", true), TypeError);
  assert.throws(() => applyLoyaltyDiscount(-100, true), RangeError);
  assert.throws(() => applyLoyaltyDiscount(-100, false), RangeError);
});
