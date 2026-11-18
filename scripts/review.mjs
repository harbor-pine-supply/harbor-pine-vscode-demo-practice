#!/usr/bin/env node
// Ask a second agent (Codex, from a different model family) for a readiness verdict.
// It gets only what it needs: the plan and acceptance criteria, and at the merge gate the diff
// and the test results. It runs read-only and changes nothing. A person makes the call.
//
//   node scripts/review.mjs plan  <plan.md>          after the plan, before any code
//   node scripts/review.mjs merge <plan.md> [base]   before a pull request merges

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const [gate, planFile, base = "main"] = process.argv.slice(2);
if (!["plan", "merge"].includes(gate) || !planFile) {
  console.error("usage: node scripts/review.mjs plan|merge <plan.md> [base]");
  process.exit(2);
}
const run = (cmd, args) => spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
const parts = [`PLAN AND ACCEPTANCE CRITERIA (${planFile}):\n${readFileSync(planFile, "utf8")}`];
if (gate === "merge") {
  const d = run("git", ["diff", `${base}...HEAD`]);
  // No evidence, no verdict: a failed or empty diff stops the review instead of reaching the reviewer
  if (d.status !== 0 || !d.stdout.trim()) { console.error(`git diff ${base}...HEAD failed or is empty; nothing to review`); process.exit(1); }
  parts.push(`DIFF (git diff ${base}...HEAD):\n${d.stdout}`);
  const t = spawnSync("npm", ["test"], { encoding: "utf8", shell: process.platform === "win32", maxBuffer: 16 * 1024 * 1024 });
  parts.push(`TEST RESULTS (npm test, exit code ${t.status}):\n${t.stdout}${t.stderr}`);
}

const ask = gate === "plan"
  ? "Review this plan against its acceptance criteria before any code is written."
  : "Review this change against its plan and acceptance criteria, using the diff and the test results.";
const prompt = `You are the reviewer at a gate. The builder was a different agent. ${ask}
Don't change any files. Be specific and brief. Use exactly this format:

VERDICT: READY | READY WITH FIXES | NOT READY
REASONS:
- (at most five bullets, each naming the file or the criterion)
FIXES:
- (only the changes needed before this can move on; "none" if READY)

${parts.join("\n\n")}`;

const codex = process.env.CODEX_BIN || "codex";
const r = spawnSync(codex, ["exec", "--sandbox", "read-only", "--color", "never", "-"], { input: prompt, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
if (r.status !== 0) { console.error(r.stderr || "codex exec failed"); process.exit(1); }
process.stdout.write(r.stdout.trim() + "\n");
