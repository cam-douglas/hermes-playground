import { test } from "node:test";
import assert from "node:assert/strict";
import { decide, seedThrashing, seedResponsive, HOLD, ALARM } from "./thrash.mjs";

test("empty / idle probe is thrashing", () => {
  const out = decide({});
  assert.equal(out.verdict, "thrashing");
  assert.equal(out.thrashing, true);
  assert.equal(out.responsive, false);
});

test("seeded thrashing scores thrashing", () => {
  const out = decide(seedThrashing());
  assert.equal(out.verdict, "thrashing");
  assert.equal(out.thrashing, true);
  assert.ok(out.chips.includes("thrashing"));
});

test("stallMs 40808 scores thrashing", () => {
  const out = decide({ stallMs: 40808 });
  assert.equal(out.verdict, "thrashing");
  assert.ok(out.chips.includes("event-loop-stall"));
});

test("rssMB 2646 scores thrashing with rss-balloon", () => {
  const out = decide({ rssMB: 2646 });
  assert.equal(out.verdict, "thrashing");
  assert.ok(out.chips.includes("rss-balloon"));
});

test("responsive seed is a hold", () => {
  const out = decide(seedResponsive());
  assert.equal(out.verdict, "responsive");
  assert.equal(out.responsive, true);
  assert.equal(out.thrashing, false);
  assert.ok(HOLD.has(out.verdict));
});

test("event-loop-stall chip", () => {
  const out = decide({ seed: "event-loop-stall", eventLoopStall: true });
  assert.equal(out.verdict, "event-loop-stall");
  assert.equal(out.thrashing, true);
  assert.ok(ALARM.has("event-loop-stall"));
  assert.match(out.reasons.join(" "), /40808ms/);
});

test("rss-balloon chip", () => {
  const out = decide({ seed: "rss-balloon", rssBalloon: true });
  assert.equal(out.verdict, "rss-balloon");
  assert.match(out.reasons.join(" "), /2646MB/);
});

test("cpu-bound-gap chip", () => {
  const out = decide({ seed: "cpu-bound-gap", cpuBoundGap: true });
  assert.equal(out.verdict, "cpu-bound-gap");
  assert.match(out.reasons.join(" "), /12 skills/);
});

test("safe-mode-still-stalls chip", () => {
  const out = decide({ seed: "safe-mode-still-stalls", safeMode: true });
  assert.equal(out.verdict, "safe-mode-still-stalls");
  assert.match(out.reasons.join(" "), /safe-mode/);
});

test("sleep-wake-mislabelled chip", () => {
  const out = decide({ seed: "sleep-wake-mislabelled", sleepWakeMislabelled: true });
  assert.equal(out.verdict, "sleep-wake-mislabelled");
  assert.match(out.reasons.join(" "), /misleading/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [89772, 91633, 88072, 92325, 91941] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.thrashing, true);
  assert.match(out.reasons.join(" "), /#88257/);
});
