import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  seedRiven,
  seedArgbound,
  classify,
  rivenFragments,
  removeItemArgs,
  rivenWouldBlock,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  COUSINS,
  REPROS
} from "./kerf.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");

test("empty / idle probe is riven", () => {
  const out = decide({});
  assert.equal(out.verdict, "riven");
  assert.equal(out.riven, true);
  assert.equal(out.argbound, false);
  assert.ok(ALARM.has("riven"));
});

test("seeded riven scores riven with evidence chips", () => {
  const out = decide(seedRiven());
  assert.equal(out.verdict, "riven");
  assert.equal(out.riven, true);
  assert.ok(out.chips.includes("riven"));
  assert.ok(out.chips.includes("program-files-block"));
});

test("argbound seed is a hold", () => {
  const out = decide(seedArgbound());
  assert.equal(out.verdict, "argbound");
  assert.equal(out.argbound, true);
  assert.equal(out.riven, false);
  assert.ok(HOLD.has(out.verdict));
});

test("argument-bound fixture scores argbound", () => {
  const out = decide({
    seed: "argbound",
    argbound: true,
    riven: false,
    command: REPROS.programFiles,
    deleteTarget: MEASURED.deleteTarget
  });
  assert.equal(out.verdict, "argbound");
  assert.equal(out.argbound, true);
  assert.match(out.reasons.join(" "), /argument|TEMP|protected list/i);
});

test("baseline-pass chip", () => {
  const out = decide({
    seed: "baseline-pass",
    baselinePass: true,
    command: REPROS.baseline
  });
  assert.equal(out.verdict, "baseline-pass");
  assert.equal(out.riven, false);
  assert.ok(ALARM.has("baseline-pass"));
  assert.match(out.reasons.join(" "), /TEMP/);
  assert.match(out.reasons.join(" "), /passes/i);
});

test("nospace-pass chip", () => {
  const out = decide({
    seed: "nospace-pass",
    nospacePass: true,
    command: REPROS.nospace
  });
  assert.equal(out.verdict, "nospace-pass");
  assert.equal(out.riven, false);
  assert.match(out.reasons.join(" "), /Python314/);
  assert.match(out.reasons.join(" "), /passes/i);
});

test("program-files-block chip", () => {
  const out = decide({
    seed: "program-files-block",
    programFilesBlock: true,
    command: REPROS.programFiles
  });
  assert.equal(out.verdict, "program-files-block");
  assert.equal(out.riven, true);
  assert.ok(ALARM.has("program-files-block"));
  assert.match(out.reasons.join(" "), /C:\\Program/);
  assert.match(out.reasons.join(" "), /protected from removal/);
});

test("user-dir-block chip", () => {
  const out = decide({
    seed: "user-dir-block",
    userDirBlock: true,
    command: REPROS.userDir
  });
  assert.equal(out.verdict, "user-dir-block");
  assert.match(out.reasons.join(" "), /C:\\AI/);
  assert.match(out.reasons.join(" "), /AI Projects/);
  assert.match(out.reasons.join(" "), /user working dir/);
});

test("reversed-order-block chip", () => {
  const out = decide({
    seed: "reversed-order-block",
    reversedOrder: true,
    command: REPROS.reversed
  });
  assert.equal(out.verdict, "reversed-order-block");
  assert.equal(out.riven, true);
  assert.match(out.reasons.join(" "), /BEFORE Remove-Item/);
  assert.match(out.reasons.join(" "), /not proximity/i);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [73882, 73524] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.riven, true);
  assert.match(out.reasons.join(" "), /#92539/);
  assert.match(out.reasons.join(" "), /#73882/);
  assert.match(out.reasons.join(" "), /#73524/);
  assert.match(out.reasons.join(" "), /#92543/);
  assert.match(out.reasons.join(" "), /#92542/);
});

test("rivenFragments cleaves at the first space and keeps the leading quote", () => {
  const program = rivenFragments(REPROS.programFiles);
  const hit = program.find((f) => f.hadSpace);
  assert.ok(hit);
  assert.equal(hit.cleaved, "\"C:\\Program");
  assert.equal(hit.quoteKept, true);
  const user = rivenFragments(REPROS.userDir).find((f) => f.hadSpace);
  assert.ok(user);
  assert.equal(user.cleaved, "\"C:\\AI");
  const nospace = rivenFragments(REPROS.nospace);
  assert.ok(nospace.some((f) => f.cleaved.includes("Python314")));
  assert.ok(nospace.every((f) => !f.hadSpace));
});

test("removeItemArgs binds the real delete argument", () => {
  const args = removeItemArgs(REPROS.programFiles);
  assert.ok(args.includes("$t"));
  const riven = rivenWouldBlock(REPROS.programFiles);
  assert.equal(riven.blocked, true);
  assert.equal(riven.fragment, "\"C:\\Program");
  const clean = rivenWouldBlock(REPROS.baseline);
  assert.equal(clean.blocked, false);
  const nospace = rivenWouldBlock(REPROS.nospace);
  assert.equal(nospace.blocked, false);
});

test("classify reads fixture objects", () => {
  const kerf = classify({
    riven: true,
    command: REPROS.programFiles,
    deleteTarget: MEASURED.deleteTarget,
    platform: "windows"
  });
  assert.equal(kerf.riven, true);
  assert.equal(kerf.hasVerb, true);
  assert.equal(kerf.spacedMention, true);
  assert.equal(kerf.blockedFragment, "\"C:\\Program");
  assert.equal(kerf.deleteTarget, MEASURED.deleteTarget);
  assert.equal(kerf.windows, true);
});

test("measured table matches the issue", () => {
  assert.equal(MEASURED.issue, 92539);
  assert.match(MEASURED.title, /path with a space/);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:windows", "area:sandbox"]);
  assert.equal(MEASURED.updated, "2026-09-06T19:25:55Z");
  assert.equal(MEASURED.os, "Windows 11 Pro 10.0.22631");
  assert.equal(MEASURED.powershell, "7.6.5");
  assert.equal(MEASURED.model, "Opus 4.5");
  assert.match(MEASURED.errorProgram, /protected from removal/);
  assert.match(MEASURED.errorProgram, /C:\\Program/);
  assert.match(MEASURED.errorUserDir, /C:\\AI/);
  assert.equal(MEASURED.deleteTarget, "$env:TEMP\\probe.txt");
  assert.equal(MEASURED.spacedProgram, "C:\\Program Files\\Git\\bin\\bash.exe");
  assert.equal(MEASURED.spacedUserDir, "C:\\AI Projects\\README.md");
});

test("HOLD is argbound only", () => {
  assert.deepEqual([...HOLD], ["argbound"]);
  assert.equal(ALARM.has("argbound"), false);
  for (const chip of [
    "riven",
    "baseline-pass",
    "nospace-pass",
    "program-files-block",
    "user-dir-block",
    "reversed-order-block",
    "cousins"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, [
    "riven",
    "argbound",
    "baseline-pass",
    "nospace-pass",
    "program-files-block",
    "user-dir-block",
    "reversed-order-block",
    "cousins"
  ]);
});

test("cousins table is cite-only Remove-Item guard neighbourhood", () => {
  assert.deepEqual(COUSINS.map((c) => c.id), [73882, 73524]);
});

test("living page is a joiner's kerf-gauge bench, not a clone", () => {
  assert.match(page, /Libre Baskerville/);
  assert.match(page, /DM Sans/);
  assert.match(page, /Space Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Nunito/);
  assert.match(page, /riven/);
  assert.match(page, /argbound/);
  assert.match(page, /#92539/);
  assert.match(page, /Kerf/);
  assert.match(page, /embed/);
  assert.match(page, /kerf|sawyer|joiner|gauge|mill|brass|chalk/i);
  assert.match(page, /#3a2a1a|#f3ead7|#c4a35a|#2c3a6a|#e07a2a|#1a120c/);
});

test("page does not reuse prior idle or seeded words", () => {
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
  assert.doesNotMatch(page, /demurrage/i);
  assert.doesNotMatch(page, /scarph/i);
  assert.doesNotMatch(page, /plimsoll/i);
});
