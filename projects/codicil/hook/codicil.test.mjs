import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AGENT_SHA,
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
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  TEAMMATE_SHA,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isRewritten,
  isSealed,
  normalize,
  score,
  seedHold,
  seedSealed,
  seedRewritten,
  seedHeadMoved,
  seedMessageUsurp,
  seedTreeIdentical,
} from "./codicil.mjs";

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
  return fileURLToPath(new URL("./codicil.mjs", import.meta.url));
}

test("recheck HEAD + no move + no blind amend → sealed", () => {
  const result = analyze({
    recheckHead: true,
    headMoved: false,
    rewritten: false,
    amendBlind: false,
  });
  assert.equal(result.verdict, "sealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.rewritten, false);
  assert.equal(result.sealed, true);
  assert.equal(isSealed(result.ticket), true);
  assert.equal(isRewritten(result.ticket), false);
});

test("blind amend + head-moved + message-usurp + tree-identical → rewritten", () => {
  const result = analyze({
    amendBlind: true,
    rewritten: true,
    headMoved: true,
    messageUsurp: true,
    treeIdentical: true,
    sharedTree: true,
    hasClearRepro: true,
    recheckHead: false,
  });
  assert.equal(result.verdict, "rewritten");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.rewritten, true);
  assert.equal(isRewritten(result.ticket), true);
  assert.ok(result.chips.includes("rewritten"));
  assert.ok(result.chips.includes("head-moved"));
  assert.ok(result.chips.includes("message-usurp"));
  assert.ok(result.chips.includes("tree-identical"));
  assert.ok(!result.chips.includes("sealed"));
});

test("idle sealed is a hold; the will is a sealed clause", () => {
  const result = analyze(seedSealed());
  assert.equal(result.verdict, "sealed");
  assert.equal(result.idleWord, "sealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.rewritten, false);
  assert.ok(result.chips.includes("sealed"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("rewritten"));
  assert.equal(result.ticket.recheckHead, true);
  assert.equal(result.ticket.headMoved, false);
  assert.doesNotMatch(
    result.idleWord,
    /swaged|torn|homed|armed|unheard|unbolted|snagged|reeved|fouled|creased|bled|latched|vanished|rebound|dark|spurious|fenced|swept|tolled|mute|discarded|arrested|indexed|chocked|clasped|sprung|hinged|pealed|crossed/i,
  );
});

test("empty ticket and empty stdin classify sealed", () => {
  assert.equal(classify(emptyTicket()), "sealed");
  assert.equal(classify(""), "sealed");
  assert.equal(classify(null), "sealed");
  assert.equal(decideSeed("sealed").verdict, "sealed");
  assert.equal(decideSeed("open").verdict, "sealed");
});

test("seeded rewritten #91513 is alarm with HEAD move and message usurp", () => {
  const result = analyze(seedRewritten());
  assert.equal(result.verdict, "rewritten");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("rewritten"));
  assert.ok(result.chips.includes("head-moved"));
  assert.ok(result.chips.includes("message-usurp"));
  assert.ok(result.chips.includes("tree-identical"));
  assert.ok(result.chips.includes("shared-tree"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("sealed"));
  assert.equal(result.ticket.amendBlind, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.agentSha, AGENT_SHA);
  assert.equal(result.ticket.currentHead, TEAMMATE_SHA);
});

test("data fixtures classify sealed vs rewritten vs named chips", () => {
  assert.equal(classify(readData("sealed.json")), "sealed");
  assert.equal(classify(readData("rewritten.json")), "rewritten");
  assert.equal(classify(readData("91513.json")), "rewritten");
  assert.equal(classify(readData("head-moved.json")), "head-moved");
  assert.equal(classify(readData("message-usurp.json")), "message-usurp");
  assert.equal(classify(readData("tree-identical.json")), "tree-identical");
  assert.equal(classify(readData("shared-tree.json")), "shared-tree");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("rewritten seed is alarm; sealed / hold are holds", () => {
  assert.equal(score(seedRewritten()).alarm, true);
  assert.equal(score(seedRewritten()).hold, false);
  assert.equal(score(seedSealed()).hold, true);
  assert.equal(score(seedSealed()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedHeadMoved()).alarm, true);
  assert.equal(score(seedMessageUsurp()).alarm, true);
  assert.equal(score(seedTreeIdentical()).alarm, true);
});

test("normalize seeds 91513 without ticket fields", () => {
  const ticket = normalize({ issue: 91513 });
  assert.equal(ticket.amendBlind, true);
  assert.equal(ticket.rewritten, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "rewritten");
});

test("score / decide / handle agree on rewritten vs sealed", () => {
  assert.equal(score(seedRewritten()).verdict, "rewritten");
  assert.equal(decide(seedSealed()).verdict, "sealed");
  const fail = handle(seedRewritten());
  const hold = handle(seedSealed());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91513/);
  assert.match(fail.hookSpecificOutput.additionalContext, /amend|HEAD|re-check/i);
  assert.match(hold.hookSpecificOutput.additionalContext, /sealed/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("rewritten").verdict, "rewritten");
  assert.equal(decideSeed(91513).verdict, "rewritten");
  assert.equal(decideSeed("91513").verdict, "rewritten");
  assert.equal(decideSeed("sealed").verdict, "sealed");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("head-moved").verdict, "head-moved");
  assert.equal(decideSeed("message-usurp").verdict, "message-usurp");
  assert.equal(decideSeed("tree-identical").verdict, "tree-identical");
});

test("CLI scores fixture strings and data files", () => {
  const rewritten = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91513.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(rewritten.status, 0, rewritten.stderr);
  assert.equal(JSON.parse(rewritten.stdout).verdict, "rewritten");
  assert.equal(JSON.parse(rewritten.stdout).alarm, true);

  const sealed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/sealed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(sealed.status, 0, sealed.stderr);
  assert.equal(JSON.parse(sealed.stdout).verdict, "sealed");
  assert.equal(JSON.parse(sealed.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    { encoding: "utf8", input: '{"amendBlind":true,"rewritten":true}\n' },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "rewritten");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91513);
  assert.deepEqual([...PRIMARY_ISSUES], [91513]);
  assert.equal(COUSIN_ISSUE, 90943);
  assert.deepEqual([...COUSINS], [90943, 91349, 90146, 83311, 88967]);
  assert.equal(FILED_AT, "2026-09-02T13:55:40Z");
  assert.equal(REPORTER, "KinohTaGo");
  assert.equal(VERSION, "2.1.239");
  assert.equal(IDLE_WORD, "sealed");
  assert.equal(SEEDED_WORD, "rewritten");
  assert.notEqual(IDLE_WORD, "rewritten");
  assert.match(TITLE, /git commit --amend/);
  assert.match(TITLE, /doesn't re-check HEAD/);
  assert.match(ISSUE_URL, /91513/);
  assert.match(PHRASE, /amends whatever will is currently on the desk/);
  assert.match(PHRASE, /admit the teammate's HEAD already moved/);
  assert.match(HUB_LINE, /03:50 codicil/);
  assert.match(MARK, /03:50/);
  assert.match(MARK, /#126/);
  assert.match(MARK, /#91513/);
  assert.match(CONTRAST_NOTE, /SHARED MULTI-AGENT WORKTREE/);
  assert.match(CONTRAST_NOTE, /git commit --amend/);
  assert.match(CONTRAST_NOTE, /KinohTaGo/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /refuse amend when HEAD/);
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(NOT_PRODUCTS.includes("crimp"));
  assert.ok(NOT_PRODUCTS.includes("jackfield"));
  assert.ok(NOT_PRODUCTS.includes("tocsin"));
  assert.ok(BANNED_NAMES.includes("Crimp"));
  assert.ok(BANNED_NAMES.includes("Jackfield"));
  assert.ok(BANNED_NAMES.includes("Tocsin"));
  assert.ok(FORBIDDEN_IDLE.includes("swaged"));
  assert.ok(FORBIDDEN_IDLE.includes("crossed"));
  assert.deepEqual([...HOLD_VERDICTS], ["sealed", "hold"]);
  assert.ok(CHIPS.includes("sealed"));
  assert.ok(CHIPS.includes("rewritten"));
});

test("page is a probate desk, not a crimp clone", () => {
  const page = readPage();
  assert.match(page, /Literata/);
  assert.match(page, /Figtree/);
  assert.match(page, /Fragment Mono/);
  assert.match(page, /03:50 \/ hermes catalog #126 \/ #91513/);
  assert.match(page, /Seal the clause/);
  assert.match(page, /Pin idle sealed/);
  assert.match(page, /Pin seeded rewritten/);
  assert.match(page, /admit the teammate's HEAD already moved/i);
  assert.match(page, /Score the seal/);
  assert.match(page, /embed=1/);
  assert.doesNotMatch(page, /Spectral|Public Sans|JetBrains Mono/);
  assert.doesNotMatch(page, /Brygada 1918|Atkinson Hyperlegible|DM Mono/);
  assert.doesNotMatch(page, /Fraunces|Source Sans 3|IBM Plex/);
  assert.doesNotMatch(page, /Crimp the join|Patch the jackfield|Sound the tocsin|Score the swage/);
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Codicil thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /SHARED MULTI-AGENT WORKTREE/);
  assert.match(readme, /#91513/);
  assert.match(readme, /sealed/);
  assert.match(readme, /rewritten/);
  assert.match(readme, /git commit --amend/);
  assert.match(readme, /KinohTaGo/);
  assert.match(readme, /NOT Crimp/);
  assert.match(readme, /NOT Jackfield/);
  assert.match(readme, /NOT Tocsin/);
  assert.match(readme, /NOT Bolter/);
  assert.match(readme, /NOT Deadeye/);
  assert.match(readme, /NOT Reglet/);
  assert.match(readme, /Literata/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Fragment Mono/);
  assert.match(readme, /catalog #126/);
  assert.doesNotMatch(readme, /SETTINGS.JSON UNLOCKED NON-ATOMIC RMW/);
  assert.doesNotMatch(readme, /DESKTOP CROSS-MACHINE SESSION MIX-UP/);
});

test("cousin isolation stays sealed / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "sealed");
  assert.equal(decideSeed(90943).verdict, "sealed");
  assert.equal(classify({ issue: 91349 }), "sealed");
});
