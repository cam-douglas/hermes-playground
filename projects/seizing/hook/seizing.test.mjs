import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  decide,
  seedCulled,
  seedSole,
  classify,
  fingerprint,
  replacedError,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  COUSINS,
  IDLE_WORD,
  SEEDED_WORD
} from "./seizing.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");

const killedPwd = {
  command: "pwd",
  ran: true,
  outputFileCorrect: true,
  readBackFailed: true,
  exit: 137,
  error:
    "Command killed: its output file was replaced or could no longer be verified"
};

const aliveCall = {
  command: "echo hi && sleep 7 && echo alive",
  ran: true,
  exit: 0,
  output: "hi\nalive"
};

const culledProbe = {
  seed: "culled",
  nlink: [1, 2, 1],
  nlinkSpike: true,
  exitCode: 137,
  bashCalls: [killedPwd],
  culled: true
};

const soleProbe = {
  seed: "sole",
  nlink: [1],
  survived: true,
  bashCalls: [aliveCall],
  sole: true
};

test("primary 92586 fixture scores culled", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92586.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "culled");
  assert.equal(out.culled, true);
  assert.ok(out.chips.includes("culled"));
});

test("empty / idle probe is culled", () => {
  const out = decide({});
  assert.equal(out.verdict, "culled");
  assert.equal(out.culled, true);
  assert.equal(out.sole, false);
  assert.ok(ALARM.has("culled"));
});

test("seeded culled scores culled", () => {
  const out = decide(seedCulled());
  assert.equal(out.verdict, "culled");
  assert.equal(out.culled, true);
  assert.ok(out.chips.includes("culled"));
  assert.ok(out.chips.includes("nlink-spike"));
});

test("sole seed is a hold", () => {
  const out = decide(seedSole());
  assert.equal(out.verdict, "sole");
  assert.equal(out.sole, true);
  assert.equal(out.culled, false);
  assert.ok(HOLD.has(out.verdict));
});

test("ramdisk-ok chip", () => {
  const out = decide({ seed: "ramdisk-ok", ramdiskOk: true });
  assert.equal(out.verdict, "ramdisk-ok");
  assert.equal(out.sole, true);
  assert.ok(HOLD.has("ramdisk-ok"));
  assert.match(out.reasons.join(" "), /ramdisk|sparseimage|nlink stays 1/i);
});

test("nlink-spike chip", () => {
  const out = decide({ seed: "nlink-spike", nlinkSpike: true });
  assert.equal(out.verdict, "nlink-spike");
  assert.equal(out.culled, true);
  assert.match(out.reasons.join(" "), /stat -f %l/);
  assert.match(out.reasons.join(" "), /1→2→1/);
});

test("sigkill-5s chip", () => {
  const out = decide({ seed: "sigkill-5s", sigkill5s: true });
  assert.equal(out.verdict, "sigkill-5s");
  assert.ok(out.chips.includes("sigkill-5s"));
  assert.match(out.reasons.join(" "), /SIGTERM/);
  assert.match(out.reasons.join(" "), /\+5s/);
  assert.match(out.reasons.join(" "), /137/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [92590] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#92590/);
  assert.match(out.reasons.join(" "), /TMPDIR/);
  assert.match(out.reasons.join(" "), /Gland/);
  assert.match(out.reasons.join(" "), /Scarph/);
});

test("fingerprint detects nlink spike and exit 137", () => {
  assert.equal(replacedError(killedPwd.error), true);
  const print = fingerprint(culledProbe);
  assert.equal(print.spike, true);
  assert.equal(print.killed137, true);
  assert.equal(print.replaced, true);
});

test("fingerprint scores sole ramdisk timeline", () => {
  const print = fingerprint({
    ...soleProbe,
    ramdiskOk: true,
    tmpdir: "/Volumes/<apfs-ramdisk>/t"
  });
  assert.equal(print.survived, true);
  assert.equal(print.ramdisk, true);
  assert.equal(print.killed137, false);
  const out = decide({ ...soleProbe, seed: "sole" });
  assert.equal(out.sole, true);
  assert.equal(out.verdict, "sole");
});

test("fingerprint scores culled boot-volume timeline", () => {
  const print = fingerprint(culledProbe);
  assert.equal(print.spike, true);
  const out = decide({ ...culledProbe, seed: "culled" });
  assert.equal(out.verdict, "culled");
});

test("boot-volume CLAUDE_CODE_TMPDIR still culled", () => {
  const out = decide({
    seed: "culled",
    tmpdir: "~/cctmp",
    bootVolume: true,
    nlink: [1, 2, 1],
    exitCode: 137,
    culled: true
  });
  assert.equal(out.verdict, "culled");
  assert.equal(out.culled, true);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedCulled());
  assert.equal(idle.culled, true);
  const hold = classify(seedSole());
  assert.equal(hold.sole, true);
});

test("measured facts from #92586", () => {
  assert.equal(MEASURED.issue, 92586);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:macos",
    "area:bash",
    "area:sandbox"
  ]);
  assert.equal(MEASURED.updated, "2026-09-07T03:33:08Z");
  assert.equal(MEASURED.version, "2.1.263");
  assert.equal(MEASURED.alsoReproduced, "2.1.260");
  assert.equal(MEASURED.identityCheckSince, "2.1.251");
  assert.equal(MEASURED.reporter, "jskoo-dp");
  assert.equal(MEASURED.exitCode, 137);
  assert.equal(MEASURED.edr, "Genian Insights EDR (system extension)");
  assert.deepEqual(MEASURED.nlinkSequence, [1, 2, 1]);
  assert.equal(IDLE_WORD, "culled");
  assert.equal(SEEDED_WORD, "sole");
});

test("HOLD is sole / ramdisk-ok", () => {
  assert.ok(HOLD.has("sole"));
  assert.ok(HOLD.has("ramdisk-ok"));
  assert.equal(ALARM.has("sole"), false);
  for (const chip of ["culled", "nlink-spike", "sigkill-5s", "cousins"]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, [
    "culled",
    "sole",
    "nlink-spike",
    "sigkill-5s",
    "ramdisk-ok",
    "cousins"
  ]);
});

test("cousins table is cite-only TMPDIR neighbourhood", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [92590]
  );
});

test("living page is a bosun seizing bench, not a clone", () => {
  assert.match(page, /Libre Caslon Text/);
  assert.match(page, /Sora/);
  assert.match(page, /Inconsolata/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Martian Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Bebas/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Syne/);
  assert.match(page, /culled/);
  assert.match(page, /sole/);
  assert.match(page, /#92586/);
  assert.match(page, /Seizing/);
  assert.match(page, /embed/);
  assert.match(page, /seizing bench|spun yarn|wooden fid|copper nails|oak block|tarred hemp/i);
  assert.match(page, /92590/);
  assert.match(page, /nlink/);
});

test("page does not reuse prior idle or seeded words", () => {
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\broused\b/);
  assert.doesNotMatch(page, /\bslipped\b/);
  assert.doesNotMatch(page, /\bsighted\b/);
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
});
