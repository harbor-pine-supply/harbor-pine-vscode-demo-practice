# Plan: item count (issue #2)

## Decision (a person, 2026-11-18)
- Approved. The scope is `itemCount(lines)` and its tests, as the acceptance criteria say.
- Printing the count on a receipt is a separate issue: #11.

## Acceptance criteria (from the issue)
- `itemCount(lines)` in `src/order.js` returns the sum of `qty` over the order lines
- An empty order has 0 items
- A line whose `qty` isn't a positive whole number throws a `TypeError`
- Tests cover an empty order, one line, several lines, and a bad quantity

## Plan (written by Claude Code in plan mode; only its last line, where it saved its own copy, is left out)
I've written the plan for #2 and haven't changed any code.

**Before I build it, there's one gap to know about.** The issue says receipts should show the count, but the repo has no receipt code yet. `src/order.js` only has `subtotal`, `formatCents` and `applyLoyaltyDiscount`. The acceptance criteria only ask for the `itemCount(lines)` function and its tests, so this change won't put the count on an actual receipt. That would need a follow-up issue.

**What I'll do:**
- **`src/order.js`:** add `itemCount(lines)`, written the same way as `subtotal`. It adds up `qty` across the lines, and an empty order gives 0.
  - If a line's `qty` isn't a whole number of 1 or more, it throws a `TypeError`. That includes 0, negative numbers, `1.5`, the string `"2"`, and a missing `qty`.
  - The issue asks for `TypeError` even for 0 and negative quantities, so I'm following that. It differs from `applyLoyaltyDiscount`, which throws `RangeError` for negative amounts.
- **`test/order.test.js`:** add these tests:
  - an empty order gives 0
  - one line with qty 2 gives 2
  - three lines (2 + 1 + 5) give 8
  - each bad quantity throws `TypeError`
- **`docs/plans/item-count.md`:** save the approved plan here, as was done for the loyalty discount.
- **Workflow:** work on a `feat/item-count` branch and open a pull request that references #2.

To check it, I'll run `npm test` on Node 22 and confirm that the existing and new tests all pass.

