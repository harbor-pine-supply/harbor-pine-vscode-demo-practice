// Order totals for Harbor & Pine Supply. All money is integer cents.
export function subtotal(lines) {
  return lines.reduce((sum, l) => sum + l.unitCents * l.qty, 0);
}

// Total number of items: the sum of qty over the lines. Each qty must be a
// whole number of 1 or more; anything else (0, negative, 1.5, "2", missing)
// throws a TypeError, as issue #2 asks.
export function itemCount(lines) {
  return lines.reduce((count, l) => {
    if (!Number.isInteger(l.qty) || l.qty < 1) {
      throw new TypeError("qty must be a whole number of 1 or more");
    }
    return count + l.qty;
  }, 0);
}

export function formatCents(cents) {
  if (!Number.isInteger(cents)) throw new TypeError("cents must be an integer");
  const sign = cents < 0 ? "-" : "";
  return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
}

// 10% off for members: 90% of the subtotal, rounded to the nearest cent,
// half a cent rounds up. Integer arithmetic only.
export function applyLoyaltyDiscount(subtotalCents, isMember) {
  if (!Number.isInteger(subtotalCents)) throw new TypeError("subtotalCents must be an integer");
  if (subtotalCents < 0) throw new RangeError("subtotalCents must not be negative");
  if (!isMember) return subtotalCents;
  return Math.floor((subtotalCents * 9 + 5) / 10);
}
