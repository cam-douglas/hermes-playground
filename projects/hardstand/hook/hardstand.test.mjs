import { test } from "node:test";
import assert from "node:assert/strict";
import { decide, seedRefused, seedCleared } from "./hardstand.mjs";

test("empty / idle probe is cleared", () => {
  const out = decide({});
  assert.equal(out.verdict, "cleared");
  assert.equal(out.cleared, true);
  assert.equal(out.refused, false);
});

test("seeded refused scores refused", () => {
  const out = decide(seedRefused());
  assert.equal(out.verdict, "refused");
  assert.equal(out.cleared, false);
  assert.equal(out.refused, true);
  assert.ok(out.chips.includes("refused"));
});

test("error text scores refused", () => {
  const out = decide({
    error: "[DispatchTools] start_code_task failed for ~/Projects: Another Claude Code session is already active in this directory."
  });
  assert.equal(out.verdict, "refused");
});

test("cleared seed is a hold", () => {
  const out = decide(seedCleared());
  assert.equal(out.verdict, "cleared");
  assert.equal(out.cleared, true);
});

test("dispatch-only chip", () => {
  const out = decide({ seed: "dispatch-only", dispatchOnly: true, refused: true });
  assert.equal(out.verdict, "dispatch-only");
});

test("exclusive-cwd is cousin hypothesis", () => {
  const out = decide({ seed: "exclusive-cwd", exclusiveCwd: true });
  assert.equal(out.verdict, "exclusive-cwd");
  assert.match(out.reasons.join(" "), /91745/);
});

test("stale-block is cousin #92462", () => {
  const out = decide({ seed: "stale-block", staleBlock: true });
  assert.equal(out.verdict, "stale-block");
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [91745, 92462] });
  assert.equal(out.verdict, "cousins");
});

test("worktree-workaround does not clear the parent pad", () => {
  const out = decide({ seed: "worktree-workaround", worktreeWorkaround: true });
  assert.equal(out.verdict, "worktree-workaround");
  assert.equal(out.cleared, false);
  assert.equal(out.refused, true);
});
