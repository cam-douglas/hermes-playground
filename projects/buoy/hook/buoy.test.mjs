import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LAYER_FLOATING,
  LAYER_NORMAL,
  MARK,
  MEASURED,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  VERSION,
  WINDOW_LEVEL,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isAloft,
  isMoored,
  normalize,
  score,
  seedAloft,
  seedFloating,
  seedHold,
  seedLatchCaptured,
  seedMoored,
} from "./buoy.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./buoy.mjs", import.meta.url));
}

test("persist layer + layer 0 + latch clear → moored", () => {
  const result = analyze({
    persistLayer: true,
    moored: true,
    aloft: false,
    layer: 0,
    wasAlwaysOnTop: false,
    latchCaptured: false,
  });
  assert.equal(result.verdict, "moored");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.aloft, false);
  assert.equal(result.moored, true);
  assert.equal(isMoored(result.ticket), true);
  assert.equal(isAloft(result.ticket), false);
});

test("layer 3 + wasAlwaysOnTop latch → aloft", () => {
  const result = analyze({
    persistLayer: false,
    moored: false,
    aloft: true,
    layer: 3,
    wasAlwaysOnTop: true,
    latchCaptured: true,
    stealthRelaunch: true,
    cuSidePanel: true,
    dockedRestored: true,
    layer3Sticky: true,
    noAlwaysOnTopPref: true,
    fullQuitClears: true,
  });
  assert.equal(result.verdict, "aloft");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.aloft, true);
  assert.equal(isAloft(result.ticket), true);
  assert.ok(result.chips.includes("aloft"));
  assert.ok(result.chips.includes("floating"));
  assert.ok(result.chips.includes("latch-captured"));
  assert.ok(!result.chips.includes("moored"));
});

test("idle moored is a hold; the waterline is a mooring", () => {
  const result = analyze(seedMoored());
  assert.equal(result.verdict, "moored");
  assert.equal(result.idleWord, "moored");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.aloft, false);
  assert.ok(result.chips.includes("moored"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("aloft"));
  assert.equal(result.ticket.persistLayer, true);
  assert.equal(result.ticket.layer, LAYER_NORMAL);
  assert.doesNotMatch(
    result.idleWord,
    /resolved|literal|sealed|blanked|attested|usurped|swaged|torn|homed|crossed|armed|unheard/i,
  );
});

test("empty ticket and empty stdin classify moored", () => {
  assert.equal(classify(emptyTicket()), "moored");
  assert.equal(classify(""), "moored");
  assert.equal(classify(null), "moored");
  assert.equal(decideSeed("moored").verdict, "moored");
  assert.equal(decideSeed("open").verdict, "moored");
});

test("seeded aloft #91569 is alarm with layer-3 latch", () => {
  const result = analyze(seedAloft());
  assert.equal(result.verdict, "aloft");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("aloft"));
  assert.ok(result.chips.includes("floating"));
  assert.ok(result.chips.includes("latch-captured"));
  assert.ok(result.chips.includes("stealth-relaunch"));
  assert.ok(result.chips.includes("cu-side-panel"));
  assert.ok(result.chips.includes("docked-restored"));
  assert.ok(result.chips.includes("layer-3-sticky"));
  assert.ok(result.chips.includes("no-always-on-top-pref"));
  assert.ok(result.chips.includes("full-quit-clears"));
  assert.ok(!result.chips.includes("moored"));
  assert.equal(result.ticket.wasAlwaysOnTop, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.appVersion, VERSION);
  assert.equal(result.ticket.layer, LAYER_FLOATING);
  assert.equal(result.ticket.measured, MEASURED);
});

test("data fixtures classify moored vs aloft vs named chips", () => {
  assert.equal(classify(readData("moored.json")), "moored");
  assert.equal(classify(readData("aloft.json")), "aloft");
  assert.equal(classify(readData("floating.json")), "floating");
  assert.equal(classify(readData("latch-captured.json")), "latch-captured");
  assert.equal(classify(readData("91569.json")), "aloft");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("aloft seed is alarm; moored / hold are holds", () => {
  assert.equal(score(seedAloft()).alarm, true);
  assert.equal(score(seedAloft()).hold, false);
  assert.equal(score(seedMoored()).hold, true);
  assert.equal(score(seedMoored()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedFloating()).alarm, true);
  assert.equal(score(seedLatchCaptured()).alarm, true);
});

test("normalize seeds 91569 without ticket fields", () => {
  const ticket = normalize({ issue: 91569 });
  assert.equal(ticket.wasAlwaysOnTop, true);
  assert.equal(ticket.aloft, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "aloft");
});

test("score / decide / handle agree on aloft vs moored", () => {
  assert.equal(score(seedAloft()).verdict, "aloft");
  assert.equal(decide(seedMoored()).verdict, "moored");
  const fail = handle(seedAloft());
  const hold = handle(seedMoored());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91569/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /layer=3|Floating|latch/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /moored/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("aloft").verdict, "aloft");
  assert.equal(decideSeed(91569).verdict, "aloft");
  assert.equal(decideSeed("91569").verdict, "aloft");
  assert.equal(decideSeed("moored").verdict, "moored");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("floating").verdict, "floating");
  assert.equal(decideSeed("latch-captured").verdict, "latch-captured");
  assert.equal(decideSeed("stealth-relaunch").verdict, "stealth-relaunch");
  assert.equal(decideSeed("cu-side-panel").verdict, "cu-side-panel");
  assert.equal(decideSeed("docked-restored").verdict, "docked-restored");
  assert.equal(decideSeed("layer-3-sticky").verdict, "layer-3-sticky");
  assert.equal(
    decideSeed("no-always-on-top-pref").verdict,
    "no-always-on-top-pref",
  );
  assert.equal(decideSeed("full-quit-clears").verdict, "full-quit-clears");
});

test("CLI scores fixture strings and data files", () => {
  const aloft = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91569.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(aloft.status, 0, aloft.stderr);
  assert.equal(JSON.parse(aloft.stdout).verdict, "aloft");
  assert.equal(JSON.parse(aloft.stdout).alarm, true);

  const moored = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/moored.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(moored.status, 0, moored.stderr);
  assert.equal(JSON.parse(moored.stdout).verdict, "moored");
  assert.equal(JSON.parse(moored.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    { encoding: "utf8", input: '{"layer":3,"wasAlwaysOnTop":true}\n' },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "aloft");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91569);
  assert.deepEqual([...PRIMARY_ISSUES], [91569]);
  assert.equal(COUSIN_ISSUE, 89467);
  assert.deepEqual([...COUSINS], [89467, 66516, 91230]);
  assert.equal(FILED_AT, "2026-09-02T18:18:25Z");
  assert.equal(REPORTER, "junqiu-lei");
  assert.equal(VERSION, "1.40609.1");
  assert.equal(PLATFORM, "macOS (Darwin 25.5.0)");
  assert.equal(LAYER_NORMAL, 0);
  assert.equal(LAYER_FLOATING, 3);
  assert.equal(WINDOW_LEVEL, "NSFloatingWindowLevel");
  assert.equal(IDLE_WORD, "moored");
  assert.equal(SEEDED_WORD, "aloft");
  assert.notEqual(IDLE_WORD, "aloft");
  assert.notEqual(IDLE_WORD, "resolved");
  assert.notEqual(IDLE_WORD, "sealed");
  assert.notEqual(SEEDED_WORD, "literal");
  assert.notEqual(SEEDED_WORD, "blanked");
  assert.match(TITLE, /Floating level \(layer=3\)/);
  assert.match(TITLE, /Computer Use side panel/);
  assert.match(ISSUE_URL, /91569/);
  assert.match(PHRASE, /Score the layer/);
  assert.match(PHRASE, /admit the latch already captured/);
  assert.match(HUB_LINE, /06:50 buoy/);
  assert.match(MARK, /06:50/);
  assert.match(MARK, /#129/);
  assert.match(MARK, /#91569/);
  assert.match(CONTRAST_NOTE, /LAYER=3/);
  assert.match(CONTRAST_NOTE, /junqiu-lei/);
  assert.match(CONTRAST_NOTE, /kCGWindowLayer/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /wasAlwaysOnTop/);
  assert.ok(LABELS.includes("area:desktop"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has-repro"));
  assert.ok(NOT_PRODUCTS.includes("solecism"));
  assert.ok(NOT_PRODUCTS.includes("coffer"));
  assert.ok(NOT_PRODUCTS.includes("codicil"));
  assert.ok(BANNED_NAMES.includes("Solecism"));
  assert.ok(BANNED_NAMES.includes("Coffer"));
  assert.ok(FORBIDDEN_IDLE.includes("resolved"));
  assert.ok(FORBIDDEN_IDLE.includes("literal"));
  assert.ok(FORBIDDEN_IDLE.includes("sealed"));
  assert.deepEqual([...HOLD_VERDICTS], ["moored", "hold"]);
  assert.ok(CHIPS.includes("moored"));
  assert.ok(CHIPS.includes("aloft"));
  assert.ok(CHIPS.includes("floating"));
  assert.ok(CHIPS.includes("latch-captured"));
  assert.ok(CHIPS.includes("stealth-relaunch"));
});

test("page is a harbor sounding board, not a usage-desk or vault clone", () => {
  const page = readPage();
  assert.match(page, /Petrona/);
  assert.match(page, /Sora/);
  assert.match(page, /Fira Code/);
  assert.match(page, /06:50 \/ hermes catalog #129 \/ #91569/);
  assert.match(page, /Score the layer/);
  assert.match(page, /Pin idle moored/);
  assert.match(page, /Pin seeded aloft/);
  assert.match(page, /admit the latch already captured/i);
  assert.match(page, /embed=1/);
  assert.match(page, /layer stack|sounding/i);
  assert.doesNotMatch(page, /Source Serif 4|Work Sans|Inconsolata/);
  assert.doesNotMatch(page, /Spectral|Karla|IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond|Figtree|Azeret Mono/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains Mono/);
  assert.doesNotMatch(page, /Brygada 1918|Atkinson Hyperlegible|DM Mono/);
  assert.doesNotMatch(page, /Fraunces|Source Sans 3/);
  assert.doesNotMatch(
    page,
    /Score the parse|Score the seal|Attest the deed|Crimp the join|Patch the jackfield|Sound the tocsin|Score the swage|Score the attestation/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Buoy thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /FLOATING LEVEL \(LAYER=3\)/);
  assert.match(readme, /#91569/);
  assert.match(readme, /moored/);
  assert.match(readme, /aloft/);
  assert.match(readme, /junqiu-lei/);
  assert.match(readme, /NOT Solecism/);
  assert.match(readme, /NOT Coffer/);
  assert.match(readme, /NOT Codicil/);
  assert.match(readme, /Petrona/);
  assert.match(readme, /Sora/);
  assert.match(readme, /Fira Code/);
  assert.match(readme, /catalog #129/);
  assert.match(readme, /Score the layer/);
  assert.doesNotMatch(readme, /LITERAL --git-common-dir/);
  assert.doesNotMatch(readme, /WINDOWS OAUTH FILE-STORE/);
  assert.doesNotMatch(readme, /SHARED MULTI-AGENT WORKTREE/);
  assert.doesNotMatch(readme, /Idle word: \*\*resolved\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*sealed\*\*/);
});

test("cousin isolation stays moored / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "moored");
  assert.equal(decideSeed(89467).verdict, "moored");
  assert.equal(decideSeed(66516).verdict, "moored");
  assert.equal(decideSeed(91230).verdict, "moored");
  assert.equal(classify({ issue: 89467 }), "moored");
});

test("no real credentials in fixtures or page", () => {
  const files = [
    "91569.json",
    "moored.json",
    "aloft.json",
    "floating.json",
    "latch-captured.json",
    "hold.json",
    "fixtures.json",
    "fingerprints.json",
  ];
  for (const name of files) {
    const raw = readFileSync(
      fileURLToPath(new URL(`../data/${name}`, import.meta.url)),
      "utf8",
    );
    assert.doesNotMatch(raw, /sk-ant-|ort01-|oat01-/);
  }
  const page = readPage();
  assert.doesNotMatch(page, /sk-ant-|ort01-|oat01-/);
});
