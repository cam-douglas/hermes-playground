import { test } from "node:test";
import assert from "node:assert/strict";
import { decide, seedPreheating, seedLit, HOLD, ALARM, CONTROL } from "./glowplug.mjs";

test("empty / idle probe is preheating", () => {
  const out = decide({});
  assert.equal(out.verdict, "preheating");
  assert.equal(out.preheating, true);
  assert.equal(out.lit, false);
});

test("seeded preheating scores preheating", () => {
  const out = decide(seedPreheating());
  assert.equal(out.verdict, "preheating");
  assert.equal(out.preheating, true);
  assert.ok(out.chips.includes("preheating"));
  assert.ok(out.chips.includes("gap-skills-idle"));
  assert.ok(out.chips.includes("gap-scheduler"));
});

test("silent gaps score preheating with chips", () => {
  const out = decide({ gapSkillsIdleSec: 59.7, gapSchedulerSec: 38.4 });
  assert.equal(out.verdict, "preheating");
  assert.ok(out.chips.includes("gap-skills-idle"));
  assert.ok(out.chips.includes("gap-scheduler"));
});

test("lit seed is a hold", () => {
  const out = decide(seedLit());
  assert.equal(out.verdict, "lit");
  assert.equal(out.lit, true);
  assert.equal(out.preheating, false);
  assert.ok(HOLD.has(out.verdict));
});

test("empty config 6s is lit", () => {
  const out = decide({
    seed: "lit",
    lit: true,
    emptyConfig: true,
    wallSec: 6
  });
  assert.equal(out.verdict, "lit");
  assert.match(out.reasons.join(" "), /6s/);
});

test("gap-skills-idle chip", () => {
  const out = decide({ seed: "gap-skills-idle", gapSkillsIdleSec: 59.7 });
  assert.equal(out.verdict, "gap-skills-idle");
  assert.equal(out.preheating, true);
  assert.ok(ALARM.has("gap-skills-idle"));
  assert.match(out.reasons.join(" "), /59\.7/);
  assert.match(out.reasons.join(" "), /skills\] idle/);
});

test("gap-scheduler chip", () => {
  const out = decide({ seed: "gap-scheduler", gapSchedulerSec: 38.4 });
  assert.equal(out.verdict, "gap-scheduler");
  assert.match(out.reasons.join(" "), /ScheduledTasks/);
});

test("skills-removed-persists chip", () => {
  const out = decide({ seed: "skills-removed-persists", skillsRemoved: true });
  assert.equal(out.verdict, "skills-removed-persists");
  assert.match(out.reasons.join(" "), /85\.5/);
  assert.match(out.reasons.join(" "), /not only skill scanning/);
});

test("nonessential-traffic-noop chip", () => {
  const out = decide({ seed: "nonessential-traffic-noop", nonessentialTraffic: true });
  assert.equal(out.verdict, "nonessential-traffic-noop");
  assert.match(out.reasons.join(" "), /127\.9/);
  assert.match(out.reasons.join(" "), /no effect/);
});

test("cert-store-bundled-noop chip", () => {
  const out = decide({ seed: "cert-store-bundled-noop", certStoreBundled: true });
  assert.equal(out.verdict, "cert-store-bundled-noop");
  assert.match(out.reasons.join(" "), /115\.3/);
  assert.match(out.reasons.join(" "), /#84478/);
});

test("empty-config-fast is a control, not a preheat", () => {
  const out = decide({ seed: "empty-config-fast", emptyConfig: true });
  assert.equal(out.verdict, "empty-config-fast");
  assert.equal(out.preheating, false);
  assert.equal(out.lit, true);
  assert.ok(CONTROL.has("empty-config-fast"));
  assert.match(out.reasons.join(" "), /6s/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [84478, 83988] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.preheating, true);
  assert.match(out.reasons.join(" "), /#85050/);
  assert.match(out.reasons.join(" "), /#84478/);
  assert.match(out.reasons.join(" "), /#83988/);
});
