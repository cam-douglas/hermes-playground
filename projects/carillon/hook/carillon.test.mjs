import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNED_NAMES,
  BROKEN_FROM,
  BROKEN_SESSION_COUNT,
  BROKEN_TO,
  BROKEN_VERSION_COUNT,
  CHIPS,
  CLAUDE_COUSINS,
  CLAUDE_VERSION,
  CODEX_COUSIN,
  CODEX_COUSINS,
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
  LAST_WORKING_VERSION,
  MARK,
  MAX_PEALS_BROKEN,
  MAX_PEALS_WORKING,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PLUGIN_PEALED,
  PLUGIN_REGISTERED,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SETTINGS_FIRED,
  TITLE,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  inBrokenRange,
  inWorkingRange,
  normalize,
  score,
  seedAdditionalContextOne,
  seedCousin,
  seedFirstWins,
  seedHold,
  seedHooksCountLies,
  seedPealed,
  seedPluginOnlyDrop,
  seedRegisteredNotPealed,
  seedRegression216,
  seedReloadPluginsOk,
  seedSettingsAllFire,
  seedSilentNoError,
} from "./carillon.mjs";

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
  return fileURLToPath(new URL("./carillon.mjs", import.meta.url));
}

test("idle pealed is a hold; settings.json three SessionStart handlers all fire", () => {
  const result = analyze(seedPealed());
  assert.equal(result.verdict, "pealed");
  assert.equal(result.idleWord, "pealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.firstWins, false);
  assert.equal(result.pealed, true);
  assert.ok(result.chips.includes("pealed"));
  assert.ok(result.chips.includes("settings-all-fire"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("first-wins"));
  assert.equal(result.contrast.registered, 3);
  assert.equal(result.contrast.struck, 3);
  assert.equal(result.contrast.muted, 0);
  assert.doesNotMatch(
    result.idleWord,
    /first-wins|drained|pooled|warded|squatted|stationed|displaced|hung|marvered|unpinned|shed|sealed|rinsed|vacant|postern|sluice/i,
  );
});

test("empty ticket and empty stdin classify pealed", () => {
  assert.equal(classify(emptyTicket()), "pealed");
  assert.equal(classify(""), "pealed");
  assert.equal(classify(null), "pealed");
  assert.equal(decideSeed("pealed").verdict, "pealed");
});

test("3 settings → pealed/hold", () => {
  const result = analyze({
    settingsSessionStartRegistered: 3,
    settingsSessionStartDispatched: 3,
    pluginSessionStartRegistered: 0,
    pluginSessionStartDispatched: 0,
    additionalContextDelivered: 3,
    matcherPresent: true,
    outputText:
      "settings.json three SessionStart handlers all fire and delivered their additionalContext",
  });
  assert.equal(result.verdict, "pealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.ok(result.chips.includes("settings-all-fire"));
});

test("3 plugins → first-wins/alarm", () => {
  const result = analyze({
    pluginSessionStartRegistered: 3,
    pluginSessionStartDispatched: 1,
    hooksCount: 3,
    additionalContextDelivered: 1,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    source: "plugin",
    claudeVersion: "2.1.252",
    outputText: "first-wins; /hooks counts 3 plugins; only first peals; 1 struck + 2 muted",
  });
  assert.equal(result.verdict, "first-wins");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.firstWins, true);
  assert.ok(result.chips.includes("first-wins"));
  assert.ok(result.chips.includes("registered-not-pealed"));
  assert.ok(!result.chips.includes("pealed"));
  assert.equal(result.contrast.struck, 1);
  assert.equal(result.contrast.muted, 2);
});

test("registry count ≠ peal count", () => {
  const result = analyze({
    pluginSessionStartRegistered: 3,
    pluginSessionStartDispatched: 1,
    hooksCount: 3,
    source: "plugin",
    outputText: "registered-not-pealed; registry 3, peal 1",
  });
  assert.notEqual(result.ticket.pluginSessionStartRegistered, result.ticket.pluginSessionStartDispatched);
  assert.ok(result.chips.includes("registered-not-pealed"));
  assert.equal(result.flags.pluginMismatch, true);
});

test("v2.1.198 multiple peals", () => {
  const result = analyze({
    claudeVersion: "2.1.198",
    pluginSessionStartRegistered: 4,
    pluginSessionStartDispatched: 4,
    hooksCount: 4,
    additionalContextDelivered: 4,
    source: "plugin",
    outputText:
      "working; up to v2.1.198 multiple plugin SessionStart hooks ran per session, up to 4",
  });
  assert.ok(inWorkingRange("2.1.198"));
  assert.equal(result.verdict, "hold");
  assert.equal(result.hold, true);
  assert.equal(result.firstWins, false);
  assert.equal(result.ticket.pluginSessionStartDispatched, 4);
  assert.ok(result.ticket.pluginSessionStartDispatched > 1);
});

test("v2.1.216–252 never more than one", () => {
  for (const version of ["2.1.216", "2.1.252"]) {
    const result = analyze({
      claudeVersion: version,
      pluginSessionStartRegistered: 3,
      pluginSessionStartDispatched: 1,
      hooksCount: 3,
      additionalContextDelivered: 1,
      source: "plugin",
      errorLogged: false,
      outputText: `regression-216; ${version}; never more than one`,
    });
    assert.ok(inBrokenRange(version), version);
    assert.ok(result.ticket.pluginSessionStartDispatched <= 1, version);
    assert.ok(result.chips.includes("regression-216"), version);
    assert.equal(result.verdict, "first-wins", version);
  }
  assert.equal(BROKEN_VERSION_COUNT, 18);
  assert.equal(BROKEN_SESSION_COUNT, 85);
  assert.equal(MAX_PEALS_BROKEN, 1);
});

test("seeded first-wins #91250 is alarm with 1 struck + 2 muted", () => {
  const result = analyze(seedFirstWins());
  assert.equal(result.verdict, "first-wins");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.firstWins, true);
  assert.ok(result.chips.includes("first-wins"));
  assert.ok(result.chips.includes("registered-not-pealed"));
  assert.ok(result.chips.includes("plugin-only-drop"));
  assert.ok(result.chips.includes("silent-no-error"));
  assert.ok(result.chips.includes("hooks-count-lies"));
  assert.ok(result.chips.includes("reload-plugins-ok"));
  assert.ok(result.chips.includes("additionalContext-one"));
  assert.ok(result.chips.includes("regression-216"));
  assert.ok(!result.chips.includes("pealed"));
  assert.equal(result.contrast.registered, 3);
  assert.equal(result.contrast.struck, 1);
  assert.equal(result.contrast.muted, 2);
  assert.match(result.contrast.candle, /gutter/i);
});

test("data fixtures classify pealed vs first-wins vs named chips", () => {
  assert.equal(classify(readData("pealed.json")), "pealed");
  assert.equal(classify(readData("first-wins.json")), "first-wins");
  assert.equal(classify(readData("91250.json")), "first-wins");
  assert.equal(classify(readData("registered-not-pealed.json")), "registered-not-pealed");
  assert.equal(classify(readData("settings-all-fire.json")), "settings-all-fire");
  assert.equal(classify(readData("plugin-only-drop.json")), "plugin-only-drop");
  assert.equal(classify(readData("silent-no-error.json")), "silent-no-error");
  assert.equal(classify(readData("hooks-count-lies.json")), "hooks-count-lies");
  assert.equal(classify(readData("reload-plugins-ok.json")), "reload-plugins-ok");
  assert.equal(classify(readData("additionalContext-one.json")), "additionalContext-one");
  assert.equal(classify(readData("regression-216.json")), "regression-216");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("first-wins seed is alarm; pealed seed is hold; settings-all-fire is hold", () => {
  assert.equal(score(seedFirstWins()).alarm, true);
  assert.equal(score(seedFirstWins()).hold, false);
  assert.equal(score(seedPealed()).hold, true);
  assert.equal(score(seedPealed()).alarm, false);
  assert.equal(score(seedSettingsAllFire()).hold, true);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedRegression216()).alarm, true);
});

test("normalize seeds 91250 without ticket fields", () => {
  const ticket = normalize({ issue: 91250 });
  assert.equal(ticket.pluginSessionStartRegistered, 3);
  assert.equal(ticket.pluginSessionStartDispatched, 1);
  assert.equal(ticket.hooksCount, 3);
  assert.equal(ticket.additionalContextDelivered, 1);
  assert.equal(ticket.matcherPresent, false);
  assert.equal(ticket.errorLogged, false);
  assert.equal(classify(ticket), "first-wins");
});

test("score / decide / handle agree on first-wins vs pealed", () => {
  assert.equal(score(seedFirstWins()).verdict, "first-wins");
  assert.equal(decide(seedPealed()).verdict, "pealed");
  const fail = handle(seedFirstWins());
  const hold = handle(seedPealed());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91250/);
  assert.match(hold.hookSpecificOutput.additionalContext, /pealed/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("first-wins").verdict, "first-wins");
  assert.equal(decideSeed(91250).verdict, "first-wins");
  assert.equal(decideSeed("91250").verdict, "first-wins");
  assert.equal(decideSeed("pealed").verdict, "pealed");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("regression-216").verdict, "regression-216");
  assert.equal(decideSeed("settings-all-fire").verdict, "settings-all-fire");
  assert.equal(decideSeed("plugin-only-drop").verdict, "plugin-only-drop");
});

test("CLI scores data files", () => {
  const first = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91250.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(first.status, 0, first.stderr);
  assert.equal(JSON.parse(first.stdout).verdict, "first-wins");
  assert.equal(JSON.parse(first.stdout).alarm, true);

  const pealed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/pealed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(pealed.status, 0, pealed.stderr);
  assert.equal(JSON.parse(pealed.stdout).verdict, "pealed");
  assert.equal(JSON.parse(pealed.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91250);
  assert.deepEqual([...PRIMARY_ISSUES], [91250]);
  assert.equal(COUSIN_ISSUE, 88086);
  assert.equal(CODEX_COUSIN, 39895);
  assert.deepEqual([...CLAUDE_COUSINS], [88086, 88650, 83643, 75972, 76297, 78455, 10373]);
  assert.deepEqual([...CODEX_COUSINS], [39895, 42079, 34321]);
  assert.deepEqual([...COUSINS], [88086, 88650, 83643, 75972, 76297, 78455, 10373, 39895, 42079, 34321]);
  assert.equal(FILED_AT, "2026-09-01T15:19:35Z");
  assert.equal(CLAUDE_VERSION, "2.1.252");
  assert.equal(LAST_WORKING_VERSION, "2.1.198");
  assert.equal(BROKEN_FROM, "2.1.216");
  assert.equal(BROKEN_TO, "2.1.252");
  assert.equal(BROKEN_VERSION_COUNT, 18);
  assert.equal(BROKEN_SESSION_COUNT, 85);
  assert.equal(MAX_PEALS_BROKEN, 1);
  assert.equal(MAX_PEALS_WORKING, 4);
  assert.equal(PLATFORM, "windows");
  assert.equal(REPORTER, "thoeltig");
  assert.equal(SETTINGS_FIRED, 3);
  assert.equal(PLUGIN_REGISTERED, 3);
  assert.equal(PLUGIN_PEALED, 1);
  assert.equal(IDLE_WORD, "pealed");
  assert.equal(SEEDED_WORD, "first-wins");
  assert.notEqual(IDLE_WORD, "first-wins");
  assert.notEqual(IDLE_WORD, "warded");
  assert.notEqual(IDLE_WORD, "drained");
  assert.deepEqual([...HOLD_VERDICTS], ["pealed", "hold", "settings-all-fire"]);
  assert.ok(ALARM_VERDICTS.includes("first-wins"));
  assert.ok(ALARM_VERDICTS.includes("registered-not-pealed"));
  assert.ok(!ALARM_VERDICTS.includes("pealed"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 11);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:hooks", "regression", "area:plugins"],
  );
  assert.match(TITLE, /Only one SessionStart hook executes/);
  assert.match(ISSUE_URL, /91250/);
  assert.match(PHRASE, /registers three bells and strikes one/i);
  assert.match(HUB_LINE, /04:50 carillon/);
  assert.match(HUB_LINE, /admit pealed/);
  assert.match(MARK, /04:50/);
  assert.match(MARK, /#105/);
  assert.match(MARK, /#91250/);
  assert.match(CONTRAST_NOTE, /PLUGIN SESSIONSTART FIRST-WINS/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("postern"));
  assert.ok(NOT_PRODUCTS.includes("sluice"));
  assert.ok(NOT_PRODUCTS.includes("alidade"));
  assert.ok(NOT_PRODUCTS.includes("callboard"));
  assert.ok(BANNED_NAMES.includes("Peal"));
  assert.ok(BANNED_NAMES.includes("Belfry"));
  assert.ok(BANNED_NAMES.includes("Postern"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "pealed");
  assert.equal(chips.seededWord, "first-wins");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91250);
  assert.equal(fp.cousin, 88086);
  assert.deepEqual(fp.cousins, [88086, 88650, 83643, 75972, 76297, 78455, 10373, 39895, 42079, 34321]);
  assert.deepEqual(fp.claudeCousins, [88086, 88650, 83643, 75972, 76297, 78455, 10373]);
  assert.deepEqual(fp.codexCousins, [39895, 42079, 34321]);
  assert.equal(fp.claudeVersion, "2.1.252");
  assert.equal(fp.lastWorkingVersion, "2.1.198");
  assert.equal(fp.brokenVersionCount, 18);
  assert.equal(fp.brokenSessionCount, 85);
  assert.equal(fp.pluginRegistered, 3);
  assert.equal(fp.pluginPealed, 1);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "first-wins");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.pluginRegistered, 3);
  assert.equal(fixtures.narrativeNotFixture.pluginPealed, 1);
  assert.equal(fixtures.narrativeNotFixture.brokenVersionCount, 18);
});

test("chipsOf on a raw first-wins ticket still marks registry ≠ peal", () => {
  const chips = chipsOf({
    pluginSessionStartRegistered: 3,
    pluginSessionStartDispatched: 1,
    hooksCount: 3,
    additionalContextDelivered: 1,
    matcherPresent: false,
    errorLogged: false,
    reloadPluginsCountsAll: true,
    source: "plugin",
    claudeVersion: "2.1.252",
    outputText: "first-wins; /hooks counts 3 plugins; only first peals; no error",
  });
  assert.ok(chips.includes("first-wins"));
  assert.ok(chips.includes("registered-not-pealed"));
  assert.ok(chips.includes("hooks-count-lies"));
  assert.ok(!chips.includes("pealed"));
});

test("cousin #88086 is not conflated with first-wins", () => {
  assert.notEqual(classify(seedCousin()), "first-wins");
  assert.notEqual(classify({ issue: 88086 }), "first-wins");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /88086|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become first-wins", () => {
  for (const issue of [88086, 88650, 83643, 75972, 76297, 78455, 10373, 39895, 42079, 34321]) {
    assert.notEqual(classify({ issue }), "first-wins", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91250);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedRegisteredNotPealed()).verdict, "registered-not-pealed");
  assert.equal(analyze(seedSettingsAllFire()).verdict, "settings-all-fire");
  assert.equal(analyze(seedPluginOnlyDrop()).verdict, "plugin-only-drop");
  assert.equal(analyze(seedSilentNoError()).verdict, "silent-no-error");
  assert.equal(analyze(seedHooksCountLies()).verdict, "hooks-count-lies");
  assert.equal(analyze(seedReloadPluginsOk()).verdict, "reload-plugins-ok");
  assert.equal(analyze(seedAdditionalContextOne()).verdict, "additionalContext-one");
  assert.equal(analyze(seedRegression216()).verdict, "regression-216");
  assert.equal(analyze(seedHold()).ticket.claudeVersion, "2.1.198");
  assert.equal(analyze(seedFirstWins()).flags.noMatcher, true);
});

test("living page is a Carillon peal board, idle pealed, seeded first-wins", () => {
  const html = readPage();
  assert.match(html, /<title>Carillon/);
  assert.match(html, /Idle word:\s*pealed/);
  assert.match(html, /pealed/);
  assert.match(html, /first-wins/);
  assert.match(html, /registered-not-pealed/);
  assert.match(html, /settings-all-fire/);
  assert.match(html, /plugin-only-drop/);
  assert.match(html, /silent-no-error/);
  assert.match(html, /hooks-count-lies/);
  assert.match(html, /reload-plugins-ok/);
  assert.match(html, /additionalContext-one/);
  assert.match(html, /regression-216/);
  assert.match(html, /#91250/);
  assert.match(html, /#88086/);
  assert.match(html, /#88650/);
  assert.match(html, /#83643/);
  assert.match(html, /#75972/);
  assert.match(html, /#76297/);
  assert.match(html, /#78455/);
  assert.match(html, /#10373/);
  assert.match(html, /39895/);
  assert.match(html, /42079/);
  assert.match(html, /34321/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /04:50/);
  assert.match(html, /catalog #105/);
  assert.match(html, /2\.1\.252/);
  assert.match(html, /2\.1\.198/);
  assert.match(html, /2\.1\.216/);
  assert.match(html, /18 versions/);
  assert.match(html, /85 sessions/);
  assert.match(html, /Playfair\+Display|Playfair Display/);
  assert.match(html, /Source\+Serif\+4|Source Serif 4/);
  assert.match(html, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Score the peal/);
  assert.match(html, /Pin idle pealed/);
  assert.match(html, /Pin seeded first-wins/);
  assert.match(html, /Admit pealed/);
  assert.match(html, /peal board|carillon console|belfry/i);
  assert.match(html, /PLUGIN SESSIONSTART FIRST-WINS/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*first-wins/i);
  assert.doesNotMatch(html, /Idle word:\s*warded/i);
  assert.doesNotMatch(html, /Idle word:\s*drained/i);
  assert.doesNotMatch(html, /Pin idle drained/);
  assert.doesNotMatch(html, /Pin idle warded/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the gather/);
  assert.doesNotMatch(html, /Score the brim/);
  assert.doesNotMatch(html, /Score the vat/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Literata/);
  assert.doesNotMatch(html, /family=Inconsolata/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=EB\+Garamond/);
  assert.doesNotMatch(html, /family=Cormorant/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(html, new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.doesNotMatch(html, /millimeter-slider|mm-slider/);
  assert.doesNotMatch(html, /woodworking leftover/i);
});

test("README and page stay Carillon, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Carillon/m);
  assert.match(readme, /Why not a clone/);
  assert.match(readme, /NOT \*\*Callboard\*\*/);
  assert.match(readme, /NOT \*\*Postern\*\*/);
  assert.match(readme, /NOT \*\*Sluice\*\*/);
  assert.match(readme, /Product name stays \*\*Carillon\*\*/);
  assert.match(readme, /Idle word: \*\*pealed\*\*/);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
  assert.doesNotMatch(readme, /^# Alidade/m);
});
