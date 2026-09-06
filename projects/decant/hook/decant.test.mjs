import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decide,
  seedSkimmed,
  seedIntact,
  classifyPour,
  normalizeMarker,
  HOLD,
  ALARM
} from "./decant.mjs";

test("empty / idle probe is skimmed", () => {
  const out = decide({});
  assert.equal(out.verdict, "skimmed");
  assert.equal(out.skimmed, true);
  assert.equal(out.intact, false);
  assert.ok(ALARM.has("skimmed"));
});

test("seeded skimmed scores skimmed with evidence chips", () => {
  const out = decide(seedSkimmed());
  assert.equal(out.verdict, "skimmed");
  assert.equal(out.skimmed, true);
  assert.ok(out.chips.includes("skimmed"));
  assert.ok(out.chips.includes("path-only"));
  assert.ok(out.chips.includes("marker-unset"));
  assert.ok(out.chips.includes("probed-0-of-8"));
  assert.ok(out.chips.includes("disclaimer-path-merge"));
});

test("desktop fixture fields score skimmed", () => {
  const out = decide({
    route: "desktop",
    varCount: 45,
    pathKind: "full-login",
    probedHitCount: 0,
    marker: "unset"
  });
  assert.equal(out.verdict, "skimmed");
  assert.equal(out.pour.desktopSkim, true);
  assert.ok(out.chips.includes("path-only"));
  assert.ok(out.chips.includes("probed-0-of-8"));
});

test("intact seed is a hold", () => {
  const out = decide(seedIntact());
  assert.equal(out.verdict, "intact");
  assert.equal(out.intact, true);
  assert.equal(out.skimmed, false);
  assert.ok(HOLD.has(out.verdict));
});

test("terminal full fixture scores intact", () => {
  const out = decide({
    route: "terminal",
    varCount: 67,
    pathKind: "full-login",
    probedHitCount: 8,
    marker: "set"
  });
  assert.equal(out.verdict, "intact");
  assert.equal(out.intact, true);
  assert.match(out.reasons.join(" "), /terminal/);
});

test("vscode full fixture scores intact", () => {
  const out = decide(seedIntact("vscode"));
  assert.equal(out.verdict, "intact");
  assert.equal(out.pour.route, "vscode");
  assert.equal(out.pour.varCount, 72);
  assert.equal(out.pour.probedHitCount, 8);
});

test("rider and zed full routes score intact", () => {
  const rider = decide(seedIntact("rider"));
  const zed = decide({
    route: "zed",
    varCount: 58,
    pathKind: "full-login",
    probedHitCount: 8,
    marker: "set"
  });
  assert.equal(rider.verdict, "intact");
  assert.equal(rider.pour.varCount, 94);
  assert.equal(zed.verdict, "intact");
});

test("path-only chip", () => {
  const out = decide({ seed: "path-only", pathOnly: true });
  assert.equal(out.verdict, "path-only");
  assert.equal(out.skimmed, true);
  assert.ok(ALARM.has("path-only"));
  assert.match(out.reasons.join(" "), /PATH/);
  assert.match(out.reasons.join(" "), /401/);
});

test("marker-unset chip", () => {
  const out = decide({ seed: "marker-unset", marker: "unset" });
  assert.equal(out.verdict, "marker-unset");
  assert.match(out.reasons.join(" "), /MARKER_FROM_ZPROFILE/);
  assert.match(out.reasons.join(" "), /UNSET/);
  assert.match(out.reasons.join(" "), /zprofile/);
});

test("probed-0-of-8 chip", () => {
  const out = decide({ seed: "probed-0-of-8", probedHitCount: 0 });
  assert.equal(out.verdict, "probed-0-of-8");
  assert.match(out.reasons.join(" "), /0\/8/);
  assert.match(out.reasons.join(" "), /8\/8/);
});

test("disclaimer-path-merge chip", () => {
  const out = decide({
    seed: "disclaimer-path-merge",
    disclaimerPathMerge: true,
    route: "disclaimer",
    varCount: 45,
    pathKind: "full-login",
    probedHitCount: 0
  });
  assert.equal(out.verdict, "disclaimer-path-merge");
  assert.match(out.reasons.join(" "), /14→45/);
  assert.match(out.reasons.join(" "), /PATH merge only/);
});

test("spawn-inherits chip", () => {
  const out = decide({ seed: "spawn-inherits", spawnInherits: true });
  assert.equal(out.verdict, "spawn-inherits");
  assert.match(out.reasons.join(" "), /hooks/);
  assert.match(out.reasons.join(" "), /stdio MCP/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [90074, 82890] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.skimmed, true);
  assert.match(out.reasons.join(" "), /#92515/);
  assert.match(out.reasons.join(" "), /#90074/);
  assert.match(out.reasons.join(" "), /#82890/);
  assert.match(out.reasons.join(" "), /ProgramData/);
  assert.match(out.reasons.join(" "), /DISPLAY/);
});

test("classifyPour reads fixture objects", () => {
  const pour = classifyPour({
    route: "desktop",
    varCount: 45,
    pathKind: "full",
    probedHitCount: 0,
    marker: "UNSET"
  });
  assert.equal(pour.route, "desktop");
  assert.equal(pour.varCount, 45);
  assert.equal(pour.pathKind, "full-login");
  assert.equal(pour.probedHitCount, 0);
  assert.equal(pour.marker, "unset");
  assert.equal(pour.desktopSkim, true);
  assert.equal(pour.intactRoute, false);
});

test("normalizeMarker accepts issue spellings", () => {
  assert.equal(normalizeMarker("UNSET"), "unset");
  assert.equal(normalizeMarker(1), "set");
  assert.equal(normalizeMarker("1"), "set");
});

test("HOLD is intact only", () => {
  assert.deepEqual([...HOLD], ["intact"]);
  assert.equal(ALARM.has("intact"), false);
  for (const chip of [
    "skimmed",
    "path-only",
    "marker-unset",
    "probed-0-of-8",
    "disclaimer-path-merge",
    "spawn-inherits",
    "cousins"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
});
