# Plan: loyalty discount (issue #1)

Status: approved by a person on 2026-11-18. Written by Claude Code in plan mode; saved unchanged.

## Acceptance criteria (from the issue)
- `applyLoyaltyDiscount(subtotalCents, isMember)` returns the discounted subtotal in integer cents
- 10% off for members, rounded to the nearest cent (half a cent rounds up); non-members pay the full subtotal
- Tests cover a member, a non-member and a rounding case
- No floating-point money in the result

## Plan
I've written the plan for #1 and haven't changed any code.

**Before I build it, I need you to pick a rounding rule.** "10% off, rounded to the nearest cent (half a cent rounds up)" can mean two things, and they only differ when the subtotal ends in 5 cents:
- **A (my recommendation):** take 90% of the subtotal, then round it. For $10.05, 904.5 cents rounds up to **905**. This matches the issue's wording that the function returns the discounted subtotal, rounded.
- **B:** round the 10% discount first, then subtract it. The discount of 100.5 cents rounds up to 101, so the result is **904**. The customer gets the extra half cent.

If you'd rather have B, it's a one-line change.

**What I'll do:**
- **`src/order.js`:** add `applyLoyaltyDiscount(subtotalCents, isMember)`.
  - It rejects bad input the same way `formatCents` does: an error for amounts that aren't whole cents, and another for negative amounts.
  - Non-members get the subtotal back unchanged.
  - Members get `Math.floor((subtotalCents * 9 + 5) / 10)`. This uses only whole numbers, so the result is always whole cents with no floating-point money.
- **`test/order.test.js`:** add these tests:
  - member: 3000 → 2700
  - non-member: 3048 → 3048
  - rounding on an exact half: 1005 → 905 (this test locks in rule A)
  - rounding otherwise: 1234 → 1111
  - every result for subtotals 0–999 is whole cents
  - bad input throws
- **Workflow:** the README says main is protected, so I'll work on a `feat/loyalty-discount` branch and open a pull request that references #1.

To check it, I'll run `npm test` on Node 22 and confirm that the existing and new tests all pass.

The full plan is at `~\.pgs-demo\claude\plans\plan-this-change-don-t-enchanted-oasis.md`. Tell me A or B (or just "go" for A) and I'll implement it.
