import { test } from "node:test";
import assert from "node:assert/strict";
import { decide, seedRewritten, seedRemanent } from "./hysteresis.mjs";

test("empty / idle probe is remanent", () => {
  const out = decide({});
  assert.equal(out.verdict, "remanent");
  assert.equal(out.remanent, true);
  assert.equal(out.rewritten, false);
});

test("seeded rewritten scores rewritten", () => {
  const out = decide(seedRewritten());
  assert.equal(out.verdict, "rewritten");
  assert.equal(out.remanent, false);
  assert.equal(out.rewritten, true);
  assert.ok(out.chips.includes("rewritten"));
});

test("opus read=0 scores rewritten", () => {
  const out = decide({ opusRead: 0 });
  assert.equal(out.verdict, "rewritten");
});

test("remanent seed is a hold", () => {
  const out = decide(seedRemanent());
  assert.equal(out.verdict, "remanent");
  assert.equal(out.remanent, true);
});

test("sonnet-partial chip", () => {
  const out = decide({ seed: "sonnet-partial", sonnetPartial: true, rewritten: true });
  assert.equal(out.verdict, "sonnet-partial");
});

test("opus-full chip", () => {
  const out = decide({ seed: "opus-full", opusFull: true });
  assert.equal(out.verdict, "opus-full");
  assert.match(out.reasons.join(" "), /read=0/);
});

test("fable-preserved is a remanent hold", () => {
  const out = decide({ seed: "fable-preserved", fablePreserved: true });
  assert.equal(out.verdict, "fable-preserved");
  assert.equal(out.remanent, true);
  assert.equal(out.rewritten, false);
});

test("docs-mismatch chip", () => {
  const out = decide({ seed: "docs-mismatch", docsMismatch: true });
  assert.equal(out.verdict, "docs-mismatch");
});

test("dialog-false-alarm chip", () => {
  const out = decide({ seed: "dialog-false-alarm", dialogFalseAlarm: true });
  assert.equal(out.verdict, "dialog-false-alarm");
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [61984, 63962] });
  assert.equal(out.verdict, "cousins");
});
