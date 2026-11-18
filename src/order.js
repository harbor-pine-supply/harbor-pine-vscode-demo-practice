// Order totals for Harbor & Pine Supply. All money is integer cents.
export function subtotal(lines) {
  return lines.reduce((sum, l) => sum + l.unitCents * l.qty, 0);
}

export function formatCents(cents) {
  if (!Number.isInteger(cents)) throw new TypeError("cents must be an integer");
  const sign = cents < 0 ? "-" : "";
  return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
}
