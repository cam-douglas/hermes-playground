import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  seedSheared,
  seedFayed,
  classify,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  COUSINS
} from "./scarph.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");

test("empty / idle probe is sheared", () => {
  const out = decide({});
  assert.equal(out.verdict, "sheared");
  assert.equal(out.sheared, true);
  assert.equal(out.fayed, false);
  assert.ok(ALARM.has("sheared"));
});

test("seeded sheared scores sheared with evidence chips", () => {
  const out = decide(seedSheared());
  assert.equal(out.verdict, "sheared");
  assert.equal(out.sheared, true);
  assert.ok(out.chips.includes("sheared"));
  assert.ok(out.chips.includes("argv-ceiling"));
  assert.ok(out.chips.includes("backslash-halved"));
  assert.ok(out.chips.includes("silent-cut"));
});

test("dash-c over window without END scores sheared", () => {
  const out = decide({
    viaDashC: true,
    argvLength: 8190,
    startSeen: true,
    endSeen: false,
    unexpectedEof: true,
    halved: true
  });
  assert.equal(out.verdict, "sheared");
  assert.equal(out.joint.viaDashC, true);
  assert.equal(out.joint.overWindow, true);
  assert.ok(out.chips.includes("argv-ceiling"));
});

test("fayed seed is a hold", () => {
  const out = decide(seedFayed());
  assert.equal(out.verdict, "fayed");
  assert.equal(out.fayed, true);
  assert.equal(out.sheared, false);
  assert.ok(HOLD.has(out.verdict));
});

test("stdin / temp-file fixture scores fayed", () => {
  const out = decide({
    seed: "fayed",
    fayed: true,
    viaStdin: true,
    tempFile: true
  });
  assert.equal(out.verdict, "fayed");
  assert.equal(out.fayed, true);
  assert.match(out.reasons.join(" "), /stdin|temp file|bash -s/);
});

test("argv-ceiling chip", () => {
  const out = decide({
    seed: "argv-ceiling",
    argvCeiling: true,
    argvLength: 8190
  });
  assert.equal(out.verdict, "argv-ceiling");
  assert.equal(out.sheared, true);
  assert.ok(ALARM.has("argv-ceiling"));
  assert.match(out.reasons.join(" "), /8,181/);
  assert.match(out.reasons.join(" "), /8,190/);
  assert.match(out.reasons.join(" "), /32,767/);
  assert.match(out.reasons.join(" "), /7,815/);
  assert.match(out.reasons.join(" "), /7,000/);
});

test("backslash-halved chip", () => {
  const out = decide({
    seed: "backslash-halved",
    backslashHalved: true,
    halved: true
  });
  assert.equal(out.verdict, "backslash-halved");
  assert.match(out.reasons.join(" "), /A\\\\B/);
  assert.match(out.reasons.join(" "), /MS-CRT/);
  assert.match(out.reasons.join(" "), /MSYS2/);
  assert.match(out.reasons.join(" "), /byte-exact/);
});

test("silent-cut chip", () => {
  const out = decide({
    seed: "silent-cut",
    silentCut: true,
    startSeen: true,
    endSeen: false
  });
  assert.equal(out.verdict, "silent-cut");
  assert.match(out.reasons.join(" "), /8100/);
  assert.match(out.reasons.join(" "), /8180/);
  assert.match(out.reasons.join(" "), /8190/);
  assert.match(out.reasons.join(" "), /unexpected EOF/);
  assert.match(out.reasons.join(" "), /phantom/);
});

test("stdin-bypass chip", () => {
  const out = decide({
    seed: "stdin-bypass",
    stdinBypass: true
  });
  assert.equal(out.verdict, "stdin-bypass");
  assert.equal(out.sheared, true);
  assert.match(out.reasons.join(" "), /stdin/);
  assert.match(out.reasons.join(" "), /temp file/);
  assert.match(out.reasons.join(" "), /8,100/);
});

test("cousins stay cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [85856, 89392, 88311, 88561, 90421] });
  assert.equal(out.verdict, "cousins");
  assert.equal(out.sheared, true);
  assert.match(out.reasons.join(" "), /#92543/);
  assert.match(out.reasons.join(" "), /#85856/);
  assert.match(out.reasons.join(" "), /#89392/);
  assert.match(out.reasons.join(" "), /#88311/);
  assert.match(out.reasons.join(" "), /#88561/);
  assert.match(out.reasons.join(" "), /#90421/);
  assert.match(out.reasons.join(" "), /#92539/);
});

test("classify reads fixture objects", () => {
  const joint = classify({
    viaDashC: true,
    argvLength: 8190,
    startSeen: true,
    endSeen: false,
    unexpectedEof: true,
    error: MEASURED.error,
    platform: "windows"
  });
  assert.equal(joint.argvLength, 8190);
  assert.equal(joint.overWindow, true);
  assert.equal(joint.startSeen, true);
  assert.equal(joint.endSeen, false);
  assert.equal(joint.unexpectedEof, true);
  assert.equal(joint.viaDashC, true);
  assert.equal(joint.enametoolong, 32767);
});

test("measured table matches the issue", () => {
  assert.equal(MEASURED.cutWindowLow, 8181);
  assert.equal(MEASURED.cutWindowHigh, 8190);
  assert.deepEqual(MEASURED.okLengths, [8100, 8180]);
  assert.equal(MEASURED.failFrom, 8190);
  assert.equal(MEASURED.enametoolong, 32767);
  assert.equal(MEASURED.censusCommands, 7815);
  assert.equal(MEASURED.censusSessions, 37);
  assert.equal(MEASURED.truncationUnder8k, 0);
  assert.equal(MEASURED.failAt9kPlus, 25);
  assert.equal(MEASURED.failAt9kPlusOf, 29);
  assert.equal(MEASURED.userCeilingChars, 7000);
  assert.equal(MEASURED.userCeilingLines, 100);
  assert.deepEqual(MEASURED.versions, ["2.1.263"]);
  assert.equal(MEASURED.node, "v24.19.0");
  assert.equal(MEASURED.gitForWindows, "2.55.0");
  assert.equal(MEASURED.bash, "MSYS2 bash 5.3.15");
  assert.equal(MEASURED.os, "Windows 11 Enterprise");
  assert.match(MEASURED.error, /unexpected EOF/);
});

test("HOLD is fayed only", () => {
  assert.deepEqual([...HOLD], ["fayed"]);
  assert.equal(ALARM.has("fayed"), false);
  for (const chip of [
    "sheared",
    "argv-ceiling",
    "backslash-halved",
    "silent-cut",
    "stdin-bypass",
    "cousins"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, [
    "sheared",
    "fayed",
    "argv-ceiling",
    "backslash-halved",
    "silent-cut",
    "stdin-bypass",
    "cousins"
  ]);
});

test("cousins table is cite-only argv/CreateProcess neighbourhood", () => {
  assert.deepEqual(COUSINS.map((c) => c.id), [85856, 89392, 88311, 88561, 90421]);
});

test("living page is a shipwright scarph bench, not a clone", () => {
  assert.match(page, /Cormorant Garamond/);
  assert.match(page, /Outfit/);
  assert.match(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Bebas/);
  assert.doesNotMatch(page, /Barlow/);
  assert.match(page, /sheared/);
  assert.match(page, /fayed/);
  assert.match(page, /#92543/);
  assert.match(page, /Scarph/);
  assert.match(page, /embed/);
  assert.match(page, /scarph|faying|drift|resin|sawdust|oak|teak/i);
});

test("page does not reuse prior idle or seeded words", () => {
  assert.doesNotMatch(page, /\boverladen\b/);
  assert.doesNotMatch(page, /\btrimmed\b/);
  assert.doesNotMatch(page, /\bdefocused\b/);
  assert.doesNotMatch(page, /\bskimmed\b/);
  assert.doesNotMatch(page, /\bhangfired\b/);
  assert.doesNotMatch(page, /\bpreheating\b/);
  assert.doesNotMatch(page, /\bsaturating\b/);
  assert.doesNotMatch(page, /\bmislabeled\b/);
  assert.doesNotMatch(page, /\btruncated\b/);
});
