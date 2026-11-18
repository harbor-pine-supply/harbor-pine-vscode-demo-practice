---
description: Ask the second-opinion reviewer for a readiness verdict at a gate (after a plan, or before a pull request merges). Run it only when a person asks.
disable-model-invocation: true
allowed-tools: Bash(node scripts/review.mjs *)
---

Run `node scripts/review.mjs $ARGUMENTS` and show its output exactly as printed.
Don't act on the verdict and don't change any files: a person decides what happens next.
