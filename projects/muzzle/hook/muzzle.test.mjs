import { test } from "node:test";
import assert from "node:assert/strict";
import { decide, seedLeaking, seedExcised, HOLD, ALARM } from "./muzzle.mjs";

test("empty / idle probe is leaking", () => {
  const out = decide({});
  assert.equal(out.verdict, "leaking");
  assert.equal(out.leaking, true);
  assert.equal(out.excised, false);
});

test("seeded leaking scores leaking", () => {
  const out = decide(seedLeaking());
  assert.equal(out.verdict, "leaking");
  assert.equal(out.leaking, true);
  assert.ok(out.chips.includes("leaking"));
});

test("skill_listing present scores leaking", () => {
  const out = decide({ skillListingPresent: true });
  assert.equal(out.verdict, "leaking");
});

test("excised seed is a hold", () => {
  const out = decide(seedExcised());
  assert.equal(out.verdict, "excised");
  assert.equal(out.excised, true);
  assert.equal(out.leaking, false);
  assert.ok(HOLD.has(out.verdict));
});

test("bare-excised is a hold", () => {
  const out = decide({ seed: "bare-excised", bare: true, attachmentsRemoved: true });
  assert.equal(out.verdict, "bare-excised");
  assert.equal(out.excised, true);
  assert.ok(HOLD.has("bare-excised"));
});

test("safe-mode-leak chip", () => {
  const out = decide({ seed: "safe-mode-leak", safeMode: true });
  assert.equal(out.verdict, "safe-mode-leak");
  assert.equal(out.leaking, true);
  assert.ok(ALARM.has("safe-mode-leak"));
});

test("disable-slash-leak chip", () => {
  const out = decide({ seed: "disable-slash-leak", disableSlash: true });
  assert.equal(out.verdict, "disable-slash-leak");
  assert.match(out.reasons.join(" "), /disable-slash-commands/);
});

test("log-suppressed-only chip", () => {
  const out = decide({ seed: "log-suppressed-only", logSuppressed: true });
  assert.equal(out.verdict, "log-suppressed-only");
  assert.match(out.reasons.join(" "), /Sending N skills/);
});

test("agent-tool-killed is a special bare side-effect", () => {
  const out = decide({ seed: "agent-tool-killed", agentToolKilled: true });
  assert.equal(out.verdict, "agent-tool-killed");
  assert.equal(out.excised, true);
  assert.equal(out.leaking, false);
  assert.equal(out.agentToolKilled, true);
  assert.match(out.note, /Agent-tool/);
  assert.ok(out.chips.includes("agent-tool-killed"));
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [60251, 89327] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.leaking, true);
});
