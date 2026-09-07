import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  seedSlipped,
  seedSighted,
  classify,
  unwrapProgram,
  denyConsulted,
  isAssignment,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  COUSINS,
  REPROS,
  EIGHT_UNWRAP
} from "./cringle.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");

test("empty / idle probe is slipped", () => {
  const out = decide({});
  assert.equal(out.verdict, "slipped");
  assert.equal(out.slipped, true);
  assert.equal(out.sighted, false);
  assert.ok(ALARM.has("slipped"));
});

test("seeded slipped scores slipped with evidence chips", () => {
  const out = decide(seedSlipped());
  assert.equal(out.verdict, "slipped");
  assert.equal(out.slipped, true);
  assert.ok(out.chips.includes("slipped"));
  assert.ok(out.chips.includes("wrapper-shift"));
});

test("sighted seed is a hold", () => {
  const out = decide(seedSighted());
  assert.equal(out.verdict, "sighted");
  assert.equal(out.sighted, true);
  assert.equal(out.slipped, false);
  assert.ok(HOLD.has(out.verdict));
});

test("sighted fixture scores sighted", () => {
  const out = decide({
    seed: "sighted",
    sighted: true,
    slipped: false,
    command: REPROS.unknownWrapper
  });
  assert.equal(out.verdict, "sighted");
  assert.equal(out.sighted, true);
  assert.match(out.reasons.join(" "), /sighted|unwrap-aware|escalate/i);
});

test("eight-unwrap chip", () => {
  const out = decide({
    seed: "eight-unwrap",
    eightUnwrap: true,
    command: REPROS.listedUnwrap
  });
  assert.equal(out.verdict, "eight-unwrap");
  assert.equal(out.slipped, false);
  assert.ok(ALARM.has("eight-unwrap"));
  assert.match(out.reasons.join(" "), /timeout/);
  assert.match(out.reasons.join(" "), /noglob/);
  assert.match(out.reasons.join(" "), /ax\(\)/);
});

test("wrapper-shift chip", () => {
  const out = decide({
    seed: "wrapper-shift",
    wrapperShift: true,
    command: REPROS.unknownWrapper
  });
  assert.equal(out.verdict, "wrapper-shift");
  assert.equal(out.slipped, true);
  assert.match(out.reasons.join(" "), /PATH/);
  assert.match(out.reasons.join(" "), /#31558/);
  assert.match(out.reasons.join(" "), /#4956/);
});

test("compound-caught chip", () => {
  const out = decide({
    seed: "compound-caught",
    compoundCaught: true,
    command: REPROS.compoundAnd
  });
  assert.equal(out.verdict, "compound-caught");
  assert.equal(out.slipped, false);
  assert.match(out.reasons.join(" "), /git add -A && git status/);
  assert.match(out.reasons.join(" "), /denied correctly/);
});

test("path-wrapper-bypass chip", () => {
  const out = decide({
    seed: "path-wrapper-bypass",
    pathWrapperBypass: true,
    command: REPROS.pathWrapper
  });
  assert.equal(out.verdict, "path-wrapper-bypass");
  assert.equal(out.slipped, true);
  assert.ok(ALARM.has("path-wrapper-bypass"));
  assert.match(out.reasons.join(" "), /103/);
  assert.match(out.reasons.join(" "), /657,373/);
  assert.match(out.reasons.join(" "), /2026-08-27T18:15:51Z/);
  assert.match(out.reasons.join(" "), /2026-09-06T16:57:28Z/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [49874, 31558, 4956] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.slipped, true);
  assert.match(out.reasons.join(" "), /#92542/);
  assert.match(out.reasons.join(" "), /#49874/);
  assert.match(out.reasons.join(" "), /#31558/);
  assert.match(out.reasons.join(" "), /#4956/);
  assert.match(out.reasons.join(" "), /#92539/);
});

test("unwrapProgram peels listed wrappers and assignments", () => {
  const listed = unwrapProgram(REPROS.listedUnwrap);
  assert.equal(listed.program, "git");
  assert.equal(listed.listedUnwrapped, true);
  assert.equal(listed.unknownWrapper, false);
  const assigned = unwrapProgram(REPROS.assignmentThenGit);
  assert.equal(assigned.program, "git");
  assert.equal(assigned.assignmentStripped, true);
  const unknown = unwrapProgram(REPROS.unknownWrapper);
  assert.equal(unknown.program, "mywrap");
  assert.equal(unknown.unknownWrapper, true);
  assert.deepEqual(unknown.rest, ["git", "add", "-A"]);
});

test("denyConsulted sees git on bare and listed unwrap, misses unknown wrapper", () => {
  const bare = denyConsulted(REPROS.bareDenied);
  assert.equal(bare.consulted, true);
  assert.equal(bare.slipped, false);
  const listed = denyConsulted(REPROS.listedUnwrap);
  assert.equal(listed.consulted, true);
  const unknown = denyConsulted(REPROS.unknownWrapper);
  assert.equal(unknown.consulted, false);
  assert.equal(unknown.slipped, true);
  const compound = denyConsulted(REPROS.compoundAnd);
  assert.equal(compound.consulted, true);
});

test("isAssignment only matches leading VAR=value", () => {
  assert.equal(isAssignment("FOO=1"), true);
  assert.equal(isAssignment("git"), false);
  assert.equal(isAssignment("=nope"), false);
});

test("classify reads fixture objects", () => {
  const cringle = classify({
    slipped: true,
    command: REPROS.unknownWrapper,
    platform: "linux"
  });
  assert.equal(cringle.slipped, true);
  assert.equal(cringle.unknownWrapper, true);
  assert.equal(cringle.program, "mywrap");
  assert.equal(cringle.denyConsulted, false);
  assert.equal(cringle.os, MEASURED.os);
});

test("measured table matches the issue", () => {
  assert.equal(MEASURED.issue, 92542);
  assert.match(MEASURED.title, /8-item unwrap list/);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:linux",
    "area:security",
    "area:bash",
    "area:permissions"
  ]);
  assert.equal(MEASURED.updated, "2026-09-06T19:38:38Z");
  assert.equal(MEASURED.os, "Linux");
  assert.equal(MEASURED.version, "2.1.258");
  assert.equal(MEASURED.denyRule, "Bash(git add -A*)");
  assert.equal(MEASURED.impactFiles, 103);
  assert.equal(MEASURED.impactInsertions, 657373);
  assert.equal(MEASURED.denials.length, 6);
  assert.equal(MEASURED.bypasses.length, 4);
  assert.deepEqual(EIGHT_UNWRAP, [
    "timeout",
    "time",
    "nice",
    "stdbuf",
    "nohup",
    "command",
    "builtin",
    "noglob"
  ]);
});

test("HOLD is sighted only", () => {
  assert.deepEqual([...HOLD], ["sighted"]);
  assert.equal(ALARM.has("sighted"), false);
  for (const chip of [
    "slipped",
    "eight-unwrap",
    "wrapper-shift",
    "compound-caught",
    "path-wrapper-bypass",
    "cousins"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, [
    "slipped",
    "sighted",
    "eight-unwrap",
    "wrapper-shift",
    "compound-caught",
    "path-wrapper-bypass",
    "cousins"
  ]);
});

test("cousins table is cite-only permissions/Bash matching neighbourhood", () => {
  assert.deepEqual(COUSINS.map((c) => c.id), [49874, 31558, 4956]);
});

test("living page is a sailmaker's loft, not a clone", () => {
  assert.match(page, /Alegreya/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /Fira Code/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /JetBrains/);
  assert.doesNotMatch(page, /Archivo Black/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Bebas/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /Anybody/);
  assert.match(page, /slipped/);
  assert.match(page, /sighted/);
  assert.match(page, /#92542/);
  assert.match(page, /Cringle/);
  assert.match(page, /embed/);
  assert.match(page, /sail|cringle|grommet|loft|brass|rope|canvas|teak/i);
  assert.match(page, /#e4d5b7|#142033|#c4a15a|#f4efe4|#4a2f1a|#1c3d6e/);
});

test("page does not reuse prior idle or seeded words", () => {
  assert.doesNotMatch(page, /\briven\b/);
  assert.doesNotMatch(page, /\bargbound\b/);
  assert.doesNotMatch(page, /\baccruing\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bsheared\b/);
  assert.doesNotMatch(page, /\bfayed\b/);
  assert.doesNotMatch(page, /\boverladen\b/);
  assert.doesNotMatch(page, /\btrimmed\b/);
  assert.doesNotMatch(page, /\bdefocused\b/);
  assert.doesNotMatch(page, /\bskimmed\b/);
  assert.doesNotMatch(page, /\bhangfired\b/);
  assert.doesNotMatch(page, /\bpreheating\b/);
  assert.doesNotMatch(page, /\bsaturating\b/);
  assert.doesNotMatch(page, /\bmislabeled\b/);
  assert.doesNotMatch(page, /\btruncated\b/);
  assert.doesNotMatch(page, /\bkerf\b/i);
  assert.doesNotMatch(page, /demurrage/i);
  assert.doesNotMatch(page, /scarph/i);
  assert.doesNotMatch(page, /plimsoll/i);
});
