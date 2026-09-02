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
  isAttested,
  isUsurped,
  normalize,
  score,
  seedHold,
  seedAttested,
  seedUsurped,
  seedHeadMoved,
  seedMessageDiscard,
  seedTeammateRewrite,
  seedNoRevParseGuard,
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

test("recheck HEAD + no move + no blind amend → attested", () => {
  const result = analyze({
    recheckHead: true,
    headMoved: false,
    usurped: false,
    amendBlind: false,
    noRevParseGuard: false,
  });
  assert.equal(result.verdict, "attested");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.usurped, false);
  assert.equal(result.attested, true);
  assert.equal(isAttested(result.ticket), true);
  assert.equal(isUsurped(result.ticket), false);
});

test("blind amend + head-moved + message-discard + tree-identical → usurped", () => {
  const result = analyze({
    amendBlind: true,
    noRevParseGuard: true,
    usurped: true,
    headMoved: true,
    teammateRewrite: true,
    messageDiscard: true,
    treeIdentical: true,
    sharedWorktree: true,
    hasClearRepro: true,
    recheckHead: false,
  });
  assert.equal(result.verdict, "usurped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.usurped, true);
  assert.equal(isUsurped(result.ticket), true);
  assert.ok(result.chips.includes("usurped"));
  assert.ok(result.chips.includes("head-moved"));
  assert.ok(result.chips.includes("message-discard"));
  assert.ok(result.chips.includes("tree-identical"));
  assert.ok(!result.chips.includes("attested"));
});

test("idle attested is a hold; the deed is an attested clause", () => {
  const result = analyze(seedAttested());
  assert.equal(result.verdict, "attested");
  assert.equal(result.idleWord, "attested");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.usurped, false);
  assert.ok(result.chips.includes("attested"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("usurped"));
  assert.equal(result.ticket.recheckHead, true);
  assert.equal(result.ticket.headMoved, false);
  assert.doesNotMatch(
    result.idleWord,
    /sealed|rewritten|swaged|torn|homed|crossed|armed|unheard|unbolted|snagged|reeved|fouled|creased|bled|latched|vanished|rebound|dark|spurious|fenced|swept|tolled|mute|discarded|arrested|indexed|chocked|clasped|sprung|hinged|pealed/i,
  );
});

test("empty ticket and empty stdin classify attested", () => {
  assert.equal(classify(emptyTicket()), "attested");
  assert.equal(classify(""), "attested");
  assert.equal(classify(null), "attested");
  assert.equal(decideSeed("attested").verdict, "attested");
  assert.equal(decideSeed("open").verdict, "attested");
});

test("seeded usurped #91513 is alarm with HEAD move and message discard", () => {
  const result = analyze(seedUsurped());
  assert.equal(result.verdict, "usurped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("usurped"));
  assert.ok(result.chips.includes("head-moved"));
  assert.ok(result.chips.includes("teammate-rewrite"));
  assert.ok(result.chips.includes("message-discard"));
  assert.ok(result.chips.includes("tree-identical"));
  assert.ok(result.chips.includes("no-rev-parse-guard"));
  assert.ok(result.chips.includes("shared-worktree"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("attested"));
  assert.equal(result.ticket.amendBlind, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.agentSha, AGENT_SHA);
  assert.equal(result.ticket.currentHead, TEAMMATE_SHA);
});

test("data fixtures classify attested vs usurped vs named chips", () => {
  assert.equal(classify(readData("attested.json")), "attested");
  assert.equal(classify(readData("usurped.json")), "usurped");
  assert.equal(classify(readData("91513.json")), "usurped");
  assert.equal(classify(readData("head-moved.json")), "head-moved");
  assert.equal(classify(readData("teammate-rewrite.json")), "teammate-rewrite");
  assert.equal(classify(readData("message-discard.json")), "message-discard");
  assert.equal(classify(readData("tree-identical.json")), "tree-identical");
  assert.equal(classify(readData("no-rev-parse-guard.json")), "no-rev-parse-guard");
  assert.equal(classify(readData("shared-worktree.json")), "shared-worktree");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("usurped seed is alarm; attested / hold are holds", () => {
  assert.equal(score(seedUsurped()).alarm, true);
  assert.equal(score(seedUsurped()).hold, false);
  assert.equal(score(seedAttested()).hold, true);
  assert.equal(score(seedAttested()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedHeadMoved()).alarm, true);
  assert.equal(score(seedMessageDiscard()).alarm, true);
  assert.equal(score(seedTeammateRewrite()).alarm, true);
  assert.equal(score(seedNoRevParseGuard()).alarm, true);
});

test("normalize seeds 91513 without ticket fields", () => {
  const ticket = normalize({ issue: 91513 });
  assert.equal(ticket.amendBlind, true);
  assert.equal(ticket.usurped, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "usurped");
});

test("score / decide / handle agree on usurped vs attested", () => {
  assert.equal(score(seedUsurped()).verdict, "usurped");
  assert.equal(decide(seedAttested()).verdict, "attested");
  const fail = handle(seedUsurped());
  const hold = handle(seedAttested());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91513/);
  assert.match(fail.hookSpecificOutput.additionalContext, /amend|HEAD|re-check/i);
  assert.match(hold.hookSpecificOutput.additionalContext, /attested/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("usurped").verdict, "usurped");
  assert.equal(decideSeed(91513).verdict, "usurped");
  assert.equal(decideSeed("91513").verdict, "usurped");
  assert.equal(decideSeed("attested").verdict, "attested");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("head-moved").verdict, "head-moved");
  assert.equal(decideSeed("teammate-rewrite").verdict, "teammate-rewrite");
  assert.equal(decideSeed("message-discard").verdict, "message-discard");
  assert.equal(decideSeed("no-rev-parse-guard").verdict, "no-rev-parse-guard");
});

test("CLI scores fixture strings and data files", () => {
  const usurped = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91513.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(usurped.status, 0, usurped.stderr);
  assert.equal(JSON.parse(usurped.stdout).verdict, "usurped");
  assert.equal(JSON.parse(usurped.stdout).alarm, true);

  const attested = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/attested.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(attested.status, 0, attested.stderr);
  assert.equal(JSON.parse(attested.stdout).verdict, "attested");
  assert.equal(JSON.parse(attested.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    { encoding: "utf8", input: '{"amendBlind":true,"usurped":true}\n' },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "usurped");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91513);
  assert.deepEqual([...PRIMARY_ISSUES], [91513]);
  assert.equal(COUSIN_ISSUE, 90943);
  assert.deepEqual([...COUSINS], [90943, 91349, 90146, 83311, 88967]);
  assert.equal(FILED_AT, "2026-09-02T13:55:40Z");
  assert.equal(REPORTER, "KinohTaGo");
  assert.equal(VERSION, "2.1.239");
  assert.equal(IDLE_WORD, "attested");
  assert.equal(SEEDED_WORD, "usurped");
  assert.notEqual(IDLE_WORD, "usurped");
  assert.notEqual(IDLE_WORD, "sealed");
  assert.notEqual(SEEDED_WORD, "rewritten");
  assert.match(TITLE, /git commit --amend/);
  assert.match(TITLE, /doesn't re-check HEAD/);
  assert.match(ISSUE_URL, /91513/);
  assert.match(PHRASE, /amends whichever deed sits on the desk/);
  assert.match(PHRASE, /Score the attestation or admit the HEAD already moved/);
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
  assert.ok(FORBIDDEN_IDLE.includes("torn"));
  assert.ok(FORBIDDEN_IDLE.includes("homed"));
  assert.ok(FORBIDDEN_IDLE.includes("crossed"));
  assert.ok(FORBIDDEN_IDLE.includes("armed"));
  assert.ok(FORBIDDEN_IDLE.includes("unheard"));
  assert.ok(FORBIDDEN_IDLE.includes("sealed"));
  assert.ok(FORBIDDEN_IDLE.includes("rewritten"));
  assert.deepEqual([...HOLD_VERDICTS], ["attested", "hold"]);
  assert.ok(CHIPS.includes("attested"));
  assert.ok(CHIPS.includes("usurped"));
  assert.ok(CHIPS.includes("teammate-rewrite"));
  assert.ok(CHIPS.includes("no-rev-parse-guard"));
  assert.ok(CHIPS.includes("shared-worktree"));
});

test("page is a probate desk, not a crimp clone", () => {
  const page = readPage();
  assert.match(page, /Cormorant Garamond/);
  assert.match(page, /Figtree/);
  assert.match(page, /Azeret Mono/);
  assert.match(page, /03:50 \/ hermes catalog #126 \/ #91513/);
  assert.match(page, /Attest the deed/);
  assert.match(page, /Pin idle attested/);
  assert.match(page, /Pin seeded usurped/);
  assert.match(page, /admit the HEAD already moved/i);
  assert.match(page, /Score the attestation/);
  assert.match(page, /embed=1/);
  assert.doesNotMatch(page, /Literata|Fragment Mono/);
  assert.doesNotMatch(page, /Spectral|Public Sans|JetBrains Mono/);
  assert.doesNotMatch(page, /Brygada 1918|Atkinson Hyperlegible|DM Mono/);
  assert.doesNotMatch(page, /Fraunces|Source Sans 3|IBM Plex/);
  assert.doesNotMatch(page, /Seal the clause|Crimp the join|Patch the jackfield|Sound the tocsin|Score the swage/);
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Codicil thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /SHARED MULTI-AGENT WORKTREE/);
  assert.match(readme, /#91513/);
  assert.match(readme, /attested/);
  assert.match(readme, /usurped/);
  assert.match(readme, /git commit --amend/);
  assert.match(readme, /KinohTaGo/);
  assert.match(readme, /NOT Crimp/);
  assert.match(readme, /NOT Jackfield/);
  assert.match(readme, /NOT Tocsin/);
  assert.match(readme, /NOT Bolter/);
  assert.match(readme, /NOT Deadeye/);
  assert.match(readme, /NOT Reglet/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Azeret Mono/);
  assert.match(readme, /catalog #126/);
  assert.match(readme, /Score the attestation/);
  assert.doesNotMatch(readme, /SETTINGS.JSON UNLOCKED NON-ATOMIC RMW/);
  assert.doesNotMatch(readme, /DESKTOP CROSS-MACHINE SESSION MIX-UP/);
  assert.doesNotMatch(readme, /Idle word: \*\*sealed\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*swaged\*\*/);
});

test("cousin isolation stays attested / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "attested");
  assert.equal(decideSeed(90943).verdict, "attested");
  assert.equal(classify({ issue: 91349 }), "attested");
});
