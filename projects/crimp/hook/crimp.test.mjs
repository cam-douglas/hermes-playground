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
  EMPTY_READS,
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
  MAX_PROCESSES,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  RENAME_READS,
  RENAME_TORN,
  REPORTER,
  SEEDED_WORD,
  STALE_TAIL_BYTES,
  STALE_TAIL_READS,
  TITLE,
  TORN_RATE,
  TORN_READS,
  TOTAL_READS,
  VERDICTS,
  VERSION,
  WILD_OCCURRENCES,
  WRITE_SITE,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isSwaged,
  isTorn,
  normalize,
  score,
  seedHold,
  seedSwaged,
  seedTorn,
  seedTruncate,
  seedStaleTail,
  seedLostUpdate,
} from "./crimp.mjs";

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
  return fileURLToPath(new URL("./crimp.mjs", import.meta.url));
}

test("atomic write + tmp+rename + no tear → swaged", () => {
  const result = analyze({
    atomicWrite: true,
    tmpRename: true,
    torn: false,
    unlockedRmw: false,
  });
  assert.equal(result.verdict, "swaged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.torn, false);
  assert.equal(result.swaged, true);
  assert.equal(isSwaged(result.ticket), true);
  assert.equal(isTorn(result.ticket), false);
});

test("unlocked RMW + truncate + stale-tail + lost-update → torn", () => {
  const result = analyze({
    unlockedRmw: true,
    torn: true,
    truncate: true,
    staleTail: true,
    lostUpdate: true,
    permissionsDrop: true,
    hooksDrop: true,
    hasClearRepro: true,
    atomicWrite: false,
    tmpRename: false,
  });
  assert.equal(result.verdict, "torn");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.torn, true);
  assert.equal(isTorn(result.ticket), true);
  assert.ok(result.chips.includes("torn"));
  assert.ok(result.chips.includes("truncate"));
  assert.ok(result.chips.includes("stale-tail"));
  assert.ok(result.chips.includes("lost-update"));
  assert.ok(!result.chips.includes("swaged"));
});

test("idle swaged is a hold; the crimp is an atomic join", () => {
  const result = analyze(seedSwaged());
  assert.equal(result.verdict, "swaged");
  assert.equal(result.idleWord, "swaged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.torn, false);
  assert.ok(result.chips.includes("swaged"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("torn"));
  assert.equal(result.ticket.atomicWrite, true);
  assert.equal(result.ticket.tmpRename, true);
  assert.doesNotMatch(
    result.idleWord,
    /homed|armed|unheard|unbolted|snagged|reeved|fouled|creased|bled|latched|vanished|sealed|rebound|dark|spurious|fenced|swept|tolled|mute|discarded|arrested|indexed|chocked|clasped|sprung|hinged|pealed|crossed/i,
  );
});

test("empty ticket and empty stdin classify swaged", () => {
  assert.equal(classify(emptyTicket()), "swaged");
  assert.equal(classify(""), "swaged");
  assert.equal(classify(null), "swaged");
  assert.equal(decideSeed("swaged").verdict, "swaged");
  assert.equal(decideSeed("open").verdict, "swaged");
});

test("seeded torn #91520 is alarm with both tear shapes and lost update", () => {
  const result = analyze(seedTorn());
  assert.equal(result.verdict, "torn");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("torn"));
  assert.ok(result.chips.includes("truncate"));
  assert.ok(result.chips.includes("stale-tail"));
  assert.ok(result.chips.includes("lost-update"));
  assert.ok(result.chips.includes("permissions-drop"));
  assert.ok(result.chips.includes("hooks-drop"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("swaged"));
  assert.equal(result.ticket.unlockedRmw, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.concurrentSessions, MAX_PROCESSES);
});

test("data fixtures classify swaged vs torn vs named chips", () => {
  assert.equal(classify(readData("swaged.json")), "swaged");
  assert.equal(classify(readData("torn.json")), "torn");
  assert.equal(classify(readData("91520.json")), "torn");
  assert.equal(classify(readData("truncate.json")), "truncate");
  assert.equal(classify(readData("stale-tail.json")), "stale-tail");
  assert.equal(classify(readData("lost-update.json")), "lost-update");
  assert.equal(classify(readData("permissions-drop.json")), "permissions-drop");
  assert.equal(classify(readData("hooks-drop.json")), "hooks-drop");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("torn seed is alarm; swaged / hold are holds", () => {
  assert.equal(score(seedTorn()).alarm, true);
  assert.equal(score(seedTorn()).hold, false);
  assert.equal(score(seedSwaged()).hold, true);
  assert.equal(score(seedSwaged()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedTruncate()).alarm, true);
  assert.equal(score(seedStaleTail()).alarm, true);
  assert.equal(score(seedLostUpdate()).alarm, true);
});

test("normalize seeds 91520 without ticket fields", () => {
  const ticket = normalize({ issue: 91520 });
  assert.equal(ticket.unlockedRmw, true);
  assert.equal(ticket.torn, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "torn");
});

test("score / decide / handle agree on torn vs swaged", () => {
  assert.equal(score(seedTorn()).verdict, "torn");
  assert.equal(decide(seedSwaged()).verdict, "swaged");
  const fail = handle(seedTorn());
  const hold = handle(seedSwaged());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91520/);
  assert.match(fail.hookSpecificOutput.additionalContext, /unlocked|non-atomic|RMW/i);
  assert.match(hold.hookSpecificOutput.additionalContext, /swaged/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("torn").verdict, "torn");
  assert.equal(decideSeed(91520).verdict, "torn");
  assert.equal(decideSeed("91520").verdict, "torn");
  assert.equal(decideSeed("swaged").verdict, "swaged");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("truncate").verdict, "truncate");
  assert.equal(decideSeed("stale-tail").verdict, "stale-tail");
  assert.equal(decideSeed("lost-update").verdict, "lost-update");
});

test("CLI scores fixture strings and data files", () => {
  const torn = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91520.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(torn.status, 0, torn.stderr);
  assert.equal(JSON.parse(torn.stdout).verdict, "torn");
  assert.equal(JSON.parse(torn.stdout).alarm, true);

  const swaged = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/swaged.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(swaged.status, 0, swaged.stderr);
  assert.equal(JSON.parse(swaged.stdout).verdict, "swaged");
  assert.equal(JSON.parse(swaged.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    { encoding: "utf8", input: '{"unlockedRmw":true,"torn":true}\n' },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "torn");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91520);
  assert.deepEqual([...PRIMARY_ISSUES], [91520]);
  assert.equal(COUSIN_ISSUE, 79403);
  assert.deepEqual([...COUSINS], [79403, 82167, 76749, 2810, 78764]);
  assert.equal(FILED_AT, "2026-09-02T14:21:59Z");
  assert.equal(REPORTER, "Lukasmolvaer");
  assert.equal(VERSION, "2.1.258");
  assert.equal(PLATFORM, "Ubuntu 24.04.4 LTS on WSL2");
  assert.equal(WRITE_SITE, "writeUserSettingsAndPush");
  assert.equal(TORN_RATE, "1.3%");
  assert.equal(TORN_READS, 2791);
  assert.equal(TOTAL_READS, 213861);
  assert.equal(EMPTY_READS, 2498);
  assert.equal(STALE_TAIL_READS, 293);
  assert.equal(STALE_TAIL_BYTES, 313);
  assert.equal(RENAME_TORN, 0);
  assert.equal(RENAME_READS, 162217);
  assert.equal(WILD_OCCURRENCES, 9);
  assert.equal(MAX_PROCESSES, 10);
  assert.equal(IDLE_WORD, "swaged");
  assert.equal(SEEDED_WORD, "torn");
  assert.notEqual(IDLE_WORD, "torn");
  assert.match(TITLE, /unlocked, non-atomic read-modify-write/);
  assert.match(ISSUE_URL, /91520/);
  assert.match(PHRASE, /tears under concurrent pliers/);
  assert.match(PHRASE, /admit the settings already tore/);
  assert.match(HUB_LINE, /02:50 crimp/);
  assert.match(MARK, /02:50/);
  assert.match(MARK, /#125/);
  assert.match(MARK, /#91520/);
  assert.match(CONTRAST_NOTE, /SETTINGS.JSON UNLOCKED NON-ATOMIC RMW/);
  assert.match(CONTRAST_NOTE, /writeUserSettingsAndPush/);
  assert.match(CONTRAST_NOTE, /1\.3%/);
  assert.match(CONTRAST_NOTE, /Lukasmolvaer/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /flock\/tmp\+rename/);
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("platform:wsl"));
  assert.ok(NOT_PRODUCTS.includes("jackfield"));
  assert.ok(NOT_PRODUCTS.includes("tocsin"));
  assert.ok(BANNED_NAMES.includes("Jackfield"));
  assert.ok(BANNED_NAMES.includes("Tocsin"));
  assert.ok(FORBIDDEN_IDLE.includes("homed"));
  assert.ok(FORBIDDEN_IDLE.includes("crossed"));
  assert.deepEqual([...HOLD_VERDICTS], ["swaged", "hold"]);
  assert.ok(CHIPS.includes("swaged"));
  assert.ok(CHIPS.includes("torn"));
});

test("page is a crimping bench, not a jackfield clone", () => {
  const page = readPage();
  assert.match(page, /Spectral/);
  assert.match(page, /Public Sans/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /02:50 \/ hermes catalog #125 \/ #91520/);
  assert.match(page, /Crimp the join/);
  assert.match(page, /Pin idle swaged/);
  assert.match(page, /Pin seeded torn/);
  assert.match(page, /admit the settings already tore/i);
  assert.match(page, /Score the swage/);
  assert.match(page, /embed=1/);
  assert.doesNotMatch(page, /Brygada 1918|Atkinson Hyperlegible|DM Mono/);
  assert.doesNotMatch(page, /Fraunces|Source Sans 3|IBM Plex/);
  assert.doesNotMatch(page, /Piazzolla|Nunito|Roboto Mono/);
  assert.doesNotMatch(page, /Literata|Red Hat|EB Garamond|Hanken|Noto Sans Mono/);
  assert.doesNotMatch(page, /Crimson Pro|Plus Jakarta|Ubuntu Mono/);
  assert.doesNotMatch(page, /Patch the jackfield|Sound the tocsin|Score the cloth/);
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Crimp thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /SETTINGS.JSON UNLOCKED NON-ATOMIC RMW/);
  assert.match(readme, /#91520/);
  assert.match(readme, /swaged/);
  assert.match(readme, /torn/);
  assert.match(readme, /writeUserSettingsAndPush/);
  assert.match(readme, /Lukasmolvaer/);
  assert.match(readme, /NOT Jackfield/);
  assert.match(readme, /NOT Tocsin/);
  assert.match(readme, /NOT Bolter/);
  assert.match(readme, /NOT Deadeye/);
  assert.match(readme, /NOT Reglet/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Public Sans/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /catalog #125/);
  assert.doesNotMatch(readme, /DESKTOP CROSS-MACHINE SESSION MIX-UP/);
});

test("cousin isolation stays swaged / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "swaged");
  assert.equal(decideSeed(79403).verdict, "swaged");
  assert.equal(classify({ issue: 82167 }), "swaged");
});
