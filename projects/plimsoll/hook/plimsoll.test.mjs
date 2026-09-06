import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  seedOverladen,
  seedTrimmed,
  classifyDraught,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  COUSINS
} from "./plimsoll.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");

test("empty / idle probe is overladen", () => {
  const out = decide({});
  assert.equal(out.verdict, "overladen");
  assert.equal(out.overladen, true);
  assert.equal(out.trimmed, false);
  assert.ok(ALARM.has("overladen"));
});

test("seeded overladen scores overladen with evidence chips", () => {
  const out = decide(seedOverladen());
  assert.equal(out.verdict, "overladen");
  assert.equal(out.overladen, true);
  assert.ok(out.chips.includes("overladen"));
  assert.ok(out.chips.includes("stale-previous-count"));
  assert.ok(out.chips.includes("reinject-jump"));
  assert.ok(out.chips.includes("no-reactive-compact"));
  assert.ok(out.chips.includes("manual-compact-ok"));
});

test("resume 400 without compact scores overladen", () => {
  const out = decide({
    resume: true,
    promptTooLong: true,
    compactAttempted: false,
    previousTurnTokens: 646000,
    resumeTokens: 1043785
  });
  assert.equal(out.verdict, "overladen");
  assert.equal(out.draught.resume, true);
  assert.equal(out.draught.promptTooLong, true);
  assert.ok(out.chips.includes("reinject-jump"));
});

test("trimmed seed is a hold", () => {
  const out = decide(seedTrimmed());
  assert.equal(out.verdict, "trimmed");
  assert.equal(out.trimmed, true);
  assert.equal(out.overladen, false);
  assert.ok(HOLD.has(out.verdict));
});

test("evaluated-against-sent fixture scores trimmed", () => {
  const out = decide({
    seed: "trimmed",
    trimmed: true,
    evaluatedAgainstSent: true
  });
  assert.equal(out.verdict, "trimmed");
  assert.equal(out.trimmed, true);
  assert.match(out.reasons.join(" "), /actually be sent/);
});

test("stale-previous-count chip", () => {
  const out = decide({
    seed: "stale-previous-count",
    stalePreviousCount: true,
    previousTurnTokens: 646000
  });
  assert.equal(out.verdict, "stale-previous-count");
  assert.equal(out.overladen, true);
  assert.ok(ALARM.has("stale-previous-count"));
  assert.match(out.reasons.join(" "), /previous turn/);
  assert.match(out.reasons.join(" "), /CLAUDE.md/);
  assert.match(out.reasons.join(" "), /\.claude\/rules/);
});

test("reinject-jump chip", () => {
  const out = decide({
    seed: "reinject-jump",
    reinjectJump: true,
    previousTurnTokens: 646000,
    resumeTokens: 1043785,
    jump: 398000
  });
  assert.equal(out.verdict, "reinject-jump");
  assert.match(out.reasons.join(" "), /646k/);
  assert.match(out.reasons.join(" "), /398k/);
  assert.match(out.reasons.join(" "), /1043785/);
  assert.match(out.reasons.join(" "), /third/);
});

test("no-reactive-compact chip", () => {
  const out = decide({
    seed: "no-reactive-compact",
    noReactiveCompact: true,
    promptTooLong: true,
    compactAttempted: false
  });
  assert.equal(out.verdict, "no-reactive-compact");
  assert.match(out.reasons.join(" "), /1043785/);
  assert.match(out.reasons.join(" "), /1000000/);
  assert.match(out.reasons.join(" "), /400/);
});

test("manual-compact-ok chip", () => {
  const out = decide({
    seed: "manual-compact-ok",
    manualCompactOk: true
  });
  assert.equal(out.verdict, "manual-compact-ok");
  assert.equal(out.overladen, true);
  assert.match(out.reasons.join(" "), /\/compact/);
  assert.match(out.reasons.join(" "), /succeeds/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [91709, 85489] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.overladen, true);
  assert.match(out.reasons.join(" "), /#92434/);
  assert.match(out.reasons.join(" "), /#91709/);
  assert.match(out.reasons.join(" "), /#85489/);
  assert.match(out.reasons.join(" "), /auto-compact is off/);
  assert.match(out.reasons.join(" "), /repeatedly/);
});

test("classifyDraught reads fixture objects", () => {
  const draught = classifyDraught({
    resume: true,
    previousTurnTokens: 646000,
    resumeTokens: 1043785,
    windowMax: 1000000,
    promptTooLong: true,
    error: MEASURED.error
  });
  assert.equal(draught.previousTurnTokens, 646000);
  assert.equal(draught.resumeTokens, 1043785);
  assert.equal(draught.jump, 397785);
  assert.equal(draught.promptTooLong, true);
  assert.equal(draught.windowMax, 1000000);
  assert.equal(draught.resume, true);
});

test("measured table matches the issue", () => {
  assert.equal(MEASURED.previousTurnTokensApprox, 646000);
  assert.equal(MEASURED.resumeTokens, 1043785);
  assert.equal(MEASURED.windowMax, 1000000);
  assert.equal(MEASURED.jumpApprox, 398000);
  assert.equal(MEASURED.window200kThresholdApprox, 167000);
  assert.equal(MEASURED.ruleCount, 40);
  assert.equal(MEASURED.ruleLines, 500);
  assert.deepEqual(MEASURED.versions, ["2.1.261", "2.1.257"]);
  assert.equal(MEASURED.untested, "2.1.263");
  assert.equal(MEASURED.error, "prompt is too long: 1043785 tokens > 1000000 maximum");
  assert.match(MEASURED.instructionShare, /third/);
});

test("HOLD is trimmed only", () => {
  assert.deepEqual([...HOLD], ["trimmed"]);
  assert.equal(ALARM.has("trimmed"), false);
  for (const chip of [
    "overladen",
    "stale-previous-count",
    "reinject-jump",
    "no-reactive-compact",
    "manual-compact-ok",
    "cousins"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, [
    "overladen",
    "trimmed",
    "stale-previous-count",
    "reinject-jump",
    "no-reactive-compact",
    "manual-compact-ok",
    "cousins"
  ]);
});

test("cousins table is cite-only #91709 #85489", () => {
  assert.deepEqual(COUSINS.map((c) => c.id), [91709, 85489]);
});

test("living page is a dry-dock Plimsoll board, not a clone", () => {
  assert.match(page, /Libre Baskerville/);
  assert.match(page, /Nunito Sans/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Bebas/);
  assert.doesNotMatch(page, /Barlow/);
  assert.match(page, /overladen/);
  assert.match(page, /trimmed/);
  assert.match(page, /#92434/);
  assert.match(page, /Plimsoll/);
  assert.match(page, /embed/);
  assert.match(page, /harbour lamp|harbour-lamp|load.line|draught|teak|chalk/i);
});

test("page does not reuse prior idle or seeded words", () => {
  assert.doesNotMatch(page, /\bdefocused\b/);
  assert.doesNotMatch(page, /\bskimmed\b/);
  assert.doesNotMatch(page, /\bhangfired\b/);
  assert.doesNotMatch(page, /\bpreheating\b/);
  assert.doesNotMatch(page, /\bsaturating\b/);
  assert.doesNotMatch(page, /\bmislabeled\b/);
});
