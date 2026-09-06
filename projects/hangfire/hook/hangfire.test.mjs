import { test } from "node:test";
import assert from "node:assert/strict";
import { decide, seedHangfired, seedExecuted, HOLD, ALARM } from "./hangfire.mjs";

test("empty / idle probe is hangfired", () => {
  const out = decide({});
  assert.equal(out.verdict, "hangfired");
  assert.equal(out.hangfired, true);
  assert.equal(out.executed, false);
});

test("seeded hangfired scores hangfired", () => {
  const out = decide(seedHangfired());
  assert.equal(out.verdict, "hangfired");
  assert.equal(out.hangfired, true);
  assert.ok(out.chips.includes("hangfired"));
  assert.ok(out.chips.includes("promptSource-queued"));
  assert.ok(out.chips.includes("plain-prompt-path"));
});

test("promptSource queued scores hangfired with chips", () => {
  const out = decide({ promptSource: "queued", nextAttachment: "total_tokens_reminder" });
  assert.equal(out.verdict, "hangfired");
  assert.ok(out.chips.includes("promptSource-queued"));
  assert.ok(out.chips.includes("plain-prompt-path"));
});

test("executed seed is a hold", () => {
  const out = decide(seedExecuted());
  assert.equal(out.verdict, "executed");
  assert.equal(out.executed, true);
  assert.equal(out.hangfired, false);
  assert.ok(HOLD.has(out.verdict));
});

test("compact_boundary + command stub is executed", () => {
  const out = decide({
    seed: "executed",
    executed: true,
    compactBoundary: true,
    commandStub: true,
    nextAttachment: "file-history-snapshot"
  });
  assert.equal(out.verdict, "executed");
  assert.match(out.reasons.join(" "), /compact_boundary/);
});

test("promptSource-queued chip", () => {
  const out = decide({ seed: "promptSource-queued", promptSource: "queued" });
  assert.equal(out.verdict, "promptSource-queued");
  assert.equal(out.hangfired, true);
  assert.ok(ALARM.has("promptSource-queued"));
  assert.match(out.reasons.join(" "), /promptSource/);
});

test("plain-prompt-path chip", () => {
  const out = decide({ seed: "plain-prompt-path", nextAttachment: "total_tokens_reminder" });
  assert.equal(out.verdict, "plain-prompt-path");
  assert.match(out.reasons.join(" "), /total_tokens_reminder/);
});

test("missing-compact-boundary chip", () => {
  const out = decide({ seed: "missing-compact-boundary", compactBoundary: false, queued: true });
  assert.equal(out.verdict, "missing-compact-boundary");
  assert.match(out.reasons.join(" "), /compact_boundary/);
});

test("long-args-suggestive chip", () => {
  const out = decide({ seed: "long-args-suggestive", argChars: 840 });
  assert.equal(out.verdict, "long-args-suggestive");
  assert.match(out.reasons.join(" "), /840/);
  assert.match(out.reasons.join(" "), /suggestive/);
});

test("idle-prompt-ok is a control, not a hangfire", () => {
  const out = decide({ seed: "idle-prompt-ok", idlePrompt: true });
  assert.equal(out.verdict, "idle-prompt-ok");
  assert.equal(out.hangfired, false);
  assert.equal(out.executed, true);
  assert.match(out.reasons.join(" "), /6\/6/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [85697, 76875, 92434, 92424, 90711] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.hangfired, true);
  assert.match(out.reasons.join(" "), /#92478/);
  assert.match(out.reasons.join(" "), /#85697/);
});
