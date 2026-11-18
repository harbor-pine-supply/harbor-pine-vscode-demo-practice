import { test } from "node:test";
import assert from "node:assert/strict";
import { subtotal, formatCents } from "../src/order.js";

test("subtotal adds line totals in cents", () => {
  assert.equal(subtotal([{ unitCents: 1299, qty: 2 }, { unitCents: 450, qty: 1 }]), 3048);
});

test("formatCents formats cents as dollars", () => {
  assert.equal(formatCents(3048), "$30.48");
  assert.equal(formatCents(-250), "-$2.50");
});
