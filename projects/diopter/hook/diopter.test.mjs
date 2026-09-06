import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decide,
  seedDefocused,
  seedSharp,
  classifyLens,
  HOLD,
  ALARM,
  UUID_A,
  UUID_B,
  MEASURED,
  DIFF
} from "./diopter.mjs";

test("empty / idle probe is defocused", () => {
  const out = decide({});
  assert.equal(out.verdict, "defocused");
  assert.equal(out.defocused, true);
  assert.equal(out.sharp, false);
  assert.ok(ALARM.has("defocused"));
});

test("seeded defocused scores defocused with evidence chips", () => {
  const out = decide(seedDefocused());
  assert.equal(out.verdict, "defocused");
  assert.equal(out.defocused, true);
  assert.ok(out.chips.includes("defocused"));
  assert.ok(out.chips.includes("uuid-diff"));
  assert.ok(out.chips.includes("rewrite-16157"));
  assert.ok(out.chips.includes("cache-miss"));
});

test("next-session UUID-only change scores defocused", () => {
  const out = decide({
    request: "next-session",
    wall: 30.6,
    input_tokens: 16157,
    toolsIdentical: true,
    messagesIdentical: true,
    systemDiffers: true
  });
  assert.equal(out.verdict, "defocused");
  assert.equal(out.lens.nextSession, true);
  assert.equal(out.lens.rewrite, true);
  assert.ok(out.chips.includes("rewrite-16157"));
});

test("sharp seed is a hold", () => {
  const out = decide(seedSharp());
  assert.equal(out.verdict, "sharp");
  assert.equal(out.sharp, true);
  assert.equal(out.defocused, false);
  assert.ok(HOLD.has(out.verdict));
});

test("normalised UUID fixture scores sharp", () => {
  const out = decide({
    seed: "sharp",
    sharp: true,
    uuidNormalized: true,
    wall: 0.4,
    input_tokens: 5
  });
  assert.equal(out.verdict, "sharp");
  assert.equal(out.sharp, true);
  assert.match(out.reasons.join(" "), /0\.4/);
  assert.match(out.reasons.join(" "), /5/);
});

test("uuid-diff chip", () => {
  const out = decide({
    seed: "uuid-diff",
    uuidDiff: true,
    toolsIdentical: true,
    messagesIdentical: true,
    systemDiffers: true
  });
  assert.equal(out.verdict, "uuid-diff");
  assert.equal(out.defocused, true);
  assert.ok(ALARM.has("uuid-diff"));
  assert.match(out.reasons.join(" "), /223,596/);
  assert.match(out.reasons.join(" "), /50,534/);
  assert.match(out.reasons.join(" "), /7,483/);
  assert.match(out.reasons.join(" "), /metadata.user_id/);
});

test("cache-miss chip", () => {
  const out = decide({ seed: "cache-miss", cacheMiss: true });
  assert.equal(out.verdict, "cache-miss");
  assert.match(out.reasons.join(" "), /system\+tools/);
  assert.match(out.reasons.join(" "), /[Hh]osted/);
});

test("rewrite-16157 chip", () => {
  const out = decide({
    seed: "rewrite-16157",
    rewrite16157: true,
    input_tokens: 16157,
    wall: 30.6
  });
  assert.equal(out.verdict, "rewrite-16157");
  assert.match(out.reasons.join(" "), /16,157/);
  assert.match(out.reasons.join(" "), /30\.6/);
  assert.match(out.reasons.join(" "), /223,596/);
});

test("normalized-hit chip admits the cache hit", () => {
  const out = decide({
    seed: "normalized-hit",
    normalizedHit: true,
    uuidNormalized: true,
    wall: 0.4,
    input_tokens: 5
  });
  assert.equal(out.verdict, "normalized-hit");
  assert.equal(out.sharp, true);
  assert.equal(out.defocused, false);
  assert.ok(out.chips.includes("normalized-hit"));
  assert.ok(out.chips.includes("sharp"));
  assert.match(out.reasons.join(" "), /131\.7/);
  assert.match(out.reasons.join(" "), /17\.3/);
  assert.match(out.reasons.join(" "), /8\.3/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [77306, 92033, 90953] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.defocused, true);
  assert.match(out.reasons.join(" "), /#92524/);
  assert.match(out.reasons.join(" "), /#77306/);
  assert.match(out.reasons.join(" "), /#92033/);
  assert.match(out.reasons.join(" "), /#90953/);
  assert.match(out.reasons.join(" "), /system_changed/);
});

test("classifyLens reads fixture objects", () => {
  const lens = classifyLens({
    request: "next-session",
    wall: 30.6,
    input_tokens: 16157,
    toolsIdentical: true,
    messagesIdentical: true,
    systemDiffers: true,
    uuidA: UUID_A,
    uuidB: UUID_B
  });
  assert.equal(lens.inputTokens, 16157);
  assert.equal(lens.wall, 30.6);
  assert.equal(lens.rewrite, true);
  assert.equal(lens.toolsIdentical, true);
  assert.equal(lens.messagesIdentical, true);
  assert.equal(lens.systemDiffers, true);
  assert.equal(lens.uuidA, UUID_A);
  assert.equal(lens.uuidB, UUID_B);
  assert.equal(lens.toolsChars, DIFF.toolsChars);
});

test("measured table matches the issue", () => {
  assert.equal(MEASURED.cold.wall, 104.3);
  assert.equal(MEASURED.cold.inputTokens, 65303);
  assert.equal(MEASURED.identical.wall, 0.3);
  assert.equal(MEASURED.identical.inputTokens, 5);
  assert.equal(MEASURED.nextSession.wall, 30.6);
  assert.equal(MEASURED.nextSession.inputTokens, 16157);
  assert.equal(MEASURED.normalised.wall, 0.4);
  assert.equal(MEASURED.normalised.inputTokens, 5);
  assert.deepEqual(MEASURED.mcp, [131.7, 17.3, 8.3]);
});

test("HOLD is sharp only", () => {
  assert.deepEqual([...HOLD], ["sharp"]);
  assert.equal(ALARM.has("sharp"), false);
  for (const chip of [
    "defocused",
    "uuid-diff",
    "cache-miss",
    "rewrite-16157",
    "normalized-hit",
    "cousins"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
});
