import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNED_NAMES,
  CHIPS,
  COMMENT_VERSION,
  COMMENTER,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  CYCLE_ACTUAL,
  CYCLE_EXPECTED,
  DEFAULT_MODE,
  FEATURED_ISSUE,
  FILED_AT,
  FLAG_DANGEROUSLY,
  FLAG_PERMISSION_MODE,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INTERFACE,
  ISSUE_URL,
  LABELS,
  MANAGED_SETTINGS,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLAN,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SETTINGS_LOCAL,
  SHIFT_TAB,
  STATUS_SOURCES,
  TITLE,
  USER_DEFAULT_MODE,
  USER_SETTINGS,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isIndexed,
  isJumped,
  normalize,
  score,
  seedCousin,
  seedCycleMissingBypass,
  seedFlagWorkaround,
  seedHasRepro,
  seedHold,
  seedIndexed,
  seedJumped,
  seedSettingsLoaded,
  seedUserAutoConflict,
  seedValueIgnored,
} from "./geneva.mjs";

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
  return fileURLToPath(new URL("./geneva.mjs", import.meta.url));
}

test("honored project-local + bypass in cycle → indexed", () => {
  const result = analyze({
    projectLocalHonored: true,
    bypassInCycle: true,
    sessionStartsBypass: true,
    valueApplied: true,
    settingsSourceListed: true,
    defaultModeBypass: true,
    settingsLocalPresent: true,
  });
  assert.equal(result.verdict, "indexed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.jumped, false);
  assert.equal(result.indexed, true);
  assert.equal(isIndexed(result.ticket), true);
  assert.equal(isJumped(result.ticket), false);
});

test("source listed + value ignored + bypass missing → jumped", () => {
  const result = analyze({
    settingsSourceListed: true,
    valueApplied: false,
    bypassInCycle: false,
    sessionStartsBypass: false,
    projectLocalHonored: false,
    defaultModeBypass: true,
    settingsLocalPresent: true,
  });
  assert.equal(result.verdict, "jumped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.jumped, true);
  assert.equal(isJumped(result.ticket), true);
  assert.ok(result.chips.includes("jumped"));
  assert.ok(result.chips.includes("settings-loaded"));
  assert.ok(result.chips.includes("value-ignored"));
  assert.ok(!result.chips.includes("indexed"));
});

test("idle indexed is a hold; project-local defaultMode honored", () => {
  const result = analyze(seedIndexed());
  assert.equal(result.verdict, "indexed");
  assert.equal(result.idleWord, "indexed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.jumped, false);
  assert.equal(result.indexed, true);
  assert.ok(result.chips.includes("indexed"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("jumped"));
  assert.equal(result.ticket.projectLocalHonored, true);
  assert.equal(result.ticket.bypassInCycle, true);
  assert.equal(result.ticket.sessionStartsBypass, true);
  assert.match(result.contrast.case, /indexed/i);
  assert.doesNotMatch(
    result.idleWord,
    /jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked/i,
  );
});

test("empty ticket and empty stdin classify indexed", () => {
  assert.equal(classify(emptyTicket()), "indexed");
  assert.equal(classify(""), "indexed");
  assert.equal(classify(null), "indexed");
  assert.equal(decideSeed("indexed").verdict, "indexed");
  assert.equal(decideSeed("open").verdict, "indexed");
});

test("seeded jumped #91296 is alarm with source listed and cycle missing bypass", () => {
  const result = analyze(seedJumped());
  assert.equal(result.verdict, "jumped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.jumped, true);
  assert.ok(result.chips.includes("jumped"));
  assert.ok(result.chips.includes("settings-loaded"));
  assert.ok(result.chips.includes("value-ignored"));
  assert.ok(result.chips.includes("cycle-missing-bypass"));
  assert.ok(result.chips.includes("flag-workaround"));
  assert.ok(result.chips.includes("user-auto-conflict"));
  assert.ok(result.chips.includes("has-repro"));
  assert.ok(!result.chips.includes("indexed"));
  assert.match(result.contrast.case, /jumped/i);
  assert.equal(result.ticket.settingsFile, SETTINGS_LOCAL);
  assert.equal(result.ticket.defaultMode, DEFAULT_MODE);
  assert.equal(result.ticket.version, VERSION);
  assert.equal(result.ticket.platform, PLATFORM);
  assert.deepEqual(result.ticket.cycleModes, [...CYCLE_ACTUAL]);
});

test("data fixtures classify indexed vs jumped vs named chips", () => {
  assert.equal(classify(readData("indexed.json")), "indexed");
  assert.equal(classify(readData("jumped.json")), "jumped");
  assert.equal(classify(readData("91296.json")), "jumped");
  assert.equal(classify(readData("settings-loaded.json")), "settings-loaded");
  assert.equal(classify(readData("value-ignored.json")), "value-ignored");
  assert.equal(classify(readData("cycle-missing.json")), "cycle-missing-bypass");
  assert.equal(classify(readData("flag-workaround.json")), "flag-workaround");
  assert.equal(classify(readData("user-auto-conflict.json")), "user-auto-conflict");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("settings-local.json")), "settings-loaded");
  assert.equal(classify(readData("defaultmode-bypass.json")), "value-ignored");
  assert.equal(classify(readData("status-sources.json")), "settings-loaded");
  assert.equal(classify(readData("macos-cli.json")), "has-repro");
});

test("jumped seed is alarm; indexed / hold are holds", () => {
  assert.equal(score(seedJumped()).alarm, true);
  assert.equal(score(seedJumped()).hold, false);
  assert.equal(score(seedIndexed()).hold, true);
  assert.equal(score(seedIndexed()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedSettingsLoaded()).alarm, true);
  assert.equal(score(seedValueIgnored()).alarm, true);
});

test("normalize seeds 91296 without ticket fields", () => {
  const ticket = normalize({ issue: 91296 });
  assert.equal(ticket.settingsSourceListed, true);
  assert.equal(ticket.valueApplied, false);
  assert.equal(ticket.bypassInCycle, false);
  assert.equal(ticket.projectLocalHonored, false);
  assert.equal(ticket.settingsFile, SETTINGS_LOCAL);
  assert.equal(ticket.defaultMode, DEFAULT_MODE);
  assert.equal(classify(ticket), "jumped");
});

test("score / decide / handle agree on jumped vs indexed", () => {
  assert.equal(score(seedJumped()).verdict, "jumped");
  assert.equal(decide(seedIndexed()).verdict, "indexed");
  const fail = handle(seedJumped());
  const hold = handle(seedIndexed());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91296/);
  assert.match(fail.hookSpecificOutput.additionalContext, /settings\.local\.json/);
  assert.match(hold.hookSpecificOutput.additionalContext, /indexed/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("jumped").verdict, "jumped");
  assert.equal(decideSeed(91296).verdict, "jumped");
  assert.equal(decideSeed("91296").verdict, "jumped");
  assert.equal(decideSeed("indexed").verdict, "indexed");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("settings-loaded").verdict, "settings-loaded");
  assert.equal(decideSeed("value-ignored").verdict, "value-ignored");
  assert.equal(decideSeed("cycle-missing-bypass").verdict, "cycle-missing-bypass");
  assert.equal(decideSeed("flag-workaround").verdict, "flag-workaround");
});

test("CLI scores data files", () => {
  const jumped = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91296.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(jumped.status, 0, jumped.stderr);
  assert.equal(JSON.parse(jumped.stdout).verdict, "jumped");
  assert.equal(JSON.parse(jumped.stdout).alarm, true);

  const indexed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/indexed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(indexed.status, 0, indexed.stderr);
  assert.equal(JSON.parse(indexed.stdout).verdict, "indexed");
  assert.equal(JSON.parse(indexed.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91296);
  assert.deepEqual([...PRIMARY_ISSUES], [91296]);
  assert.equal(COUSIN_ISSUE, 75235);
  assert.deepEqual([...COUSINS], [75235, 86478, 88051, 90415, 83421]);
  assert.deepEqual([...CROSS_ECOSYSTEM], []);
  assert.equal(FILED_AT, "2026-09-01T19:03:16Z");
  assert.equal(SETTINGS_LOCAL, ".claude/settings.local.json");
  assert.equal(USER_SETTINGS, "~/.claude/settings.json");
  assert.equal(MANAGED_SETTINGS, "/Library/Application Support/ClaudeCode/managed-settings.json");
  assert.equal(DEFAULT_MODE, "bypassPermissions");
  assert.equal(USER_DEFAULT_MODE, "auto");
  assert.deepEqual([...CYCLE_ACTUAL], ["default", "acceptEdits", "plan", "auto"]);
  assert.ok(CYCLE_EXPECTED.includes("bypassPermissions"));
  assert.match(STATUS_SOURCES, /Setting sources/);
  assert.match(STATUS_SOURCES, /Project local settings/);
  assert.equal(SHIFT_TAB, "Shift+Tab");
  assert.equal(FLAG_PERMISSION_MODE, "--permission-mode bypassPermissions");
  assert.equal(FLAG_DANGEROUSLY, "--dangerously-skip-permissions");
  assert.equal(VERSION, "2.1.257");
  assert.equal(COMMENT_VERSION, "2.1.258");
  assert.equal(PLATFORM, "macos");
  assert.equal(INTERFACE, "CLI terminal");
  assert.equal(PLAN, "Claude Max personal");
  assert.equal(REPORTER, "jimmyjayp");
  assert.equal(COMMENTER, "uyu423");
  assert.equal(IDLE_WORD, "indexed");
  assert.equal(SEEDED_WORD, "jumped");
  assert.notEqual(IDLE_WORD, "jumped");
  assert.notEqual(IDLE_WORD, "chocked");
  assert.notEqual(IDLE_WORD, "rolled");
  assert.notEqual(IDLE_WORD, "clasped");
  assert.notEqual(IDLE_WORD, "sprung");
  assert.notEqual(IDLE_WORD, "drained");
  assert.notEqual(IDLE_WORD, "hinged");
  assert.notEqual(IDLE_WORD, "pealed");
  assert.notEqual(IDLE_WORD, "warded");
  assert.notEqual(IDLE_WORD, "pooled");
  assert.notEqual(IDLE_WORD, "cased");
  assert.notEqual(IDLE_WORD, "aired");
  assert.notEqual(IDLE_WORD, "sifted");
  assert.notEqual(IDLE_WORD, "stocked");
  assert.deepEqual([...HOLD_VERDICTS], ["indexed", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("jumped"));
  assert.ok(ALARM_VERDICTS.includes("value-ignored"));
  assert.ok(ALARM_VERDICTS.includes("cycle-missing-bypass"));
  assert.ok(!ALARM_VERDICTS.includes("indexed"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 9);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:permissions"],
  );
  assert.match(TITLE, /bypassPermissions/);
  assert.match(TITLE, /settings\.local\.json/);
  assert.match(TITLE, /Shift\+Tab/);
  assert.match(ISSUE_URL, /91296/);
  assert.match(PHRASE, /cannot index bypass/i);
  assert.match(HUB_LINE, /11:50 geneva/);
  assert.match(HUB_LINE, /admit indexed/);
  assert.match(MARK, /11:50/);
  assert.match(MARK, /#112/);
  assert.match(MARK, /#91296/);
  assert.match(CONTRAST_NOTE, /settings\.local\.json/);
  assert.match(CONTRAST_NOTE, /SILENTLY IGNORED/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("scotch"));
  assert.ok(NOT_PRODUCTS.includes("fibula"));
  assert.ok(NOT_PRODUCTS.includes("postern"));
  assert.ok(NOT_PRODUCTS.includes("pintle"));
  assert.ok(BANNED_NAMES.includes("Settings"));
  assert.ok(BANNED_NAMES.includes("Scotch"));
  assert.ok(BANNED_NAMES.includes("Postern"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "indexed");
  assert.equal(chips.seededWord, "jumped");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91296);
  assert.equal(fp.cousin, 75235);
  assert.deepEqual(fp.cousins, [75235, 86478, 88051, 90415, 83421]);
  assert.equal(fp.settingsFile, ".claude/settings.local.json");
  assert.equal(fp.defaultMode, "bypassPermissions");
  assert.equal(fp.version, "2.1.257");
  assert.equal(fp.commentVersion, "2.1.258");
  assert.equal(fp.reporter, "jimmyjayp");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "jumped");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.valueIgnored, true);
});

test("chipsOf on a raw ignored-settings ticket still marks jumped", () => {
  const chips = chipsOf({
    settingsSourceListed: true,
    valueApplied: false,
    bypassInCycle: false,
    sessionStartsBypass: false,
    projectLocalHonored: false,
    outputText:
      "jumped; #91296; .claude/settings.local.json listed as a setting source but bypassPermissions missing from Shift+Tab cycle; value ignored",
  });
  assert.ok(chips.includes("jumped"));
  assert.ok(chips.includes("settings-loaded"));
  assert.ok(chips.includes("value-ignored"));
  assert.ok(chips.includes("cycle-missing-bypass"));
  assert.ok(!chips.includes("indexed"));
});

test("cousin #75235 is not conflated with jumped primary", () => {
  assert.notEqual(classify(seedCousin()), "jumped");
  assert.notEqual(classify({ issue: 75235 }), "jumped");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /75235|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become jumped", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "jumped", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91296);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedSettingsLoaded()).verdict, "settings-loaded");
  assert.equal(analyze(seedValueIgnored()).verdict, "value-ignored");
  assert.equal(analyze(seedCycleMissingBypass()).verdict, "cycle-missing-bypass");
  assert.equal(analyze(seedFlagWorkaround()).verdict, "flag-workaround");
  assert.equal(analyze(seedUserAutoConflict()).verdict, "user-auto-conflict");
  assert.equal(analyze(seedHasRepro()).verdict, "has-repro");
  assert.equal(analyze(seedHold()).ticket.projectLocalHonored, true);
  assert.equal(isJumped(seedIndexed()), false);
  assert.equal(isJumped(seedJumped()), true);
});

test("living page is a Geneva atelier, idle indexed, seeded jumped", () => {
  const html = readPage();
  assert.match(html, /<title>Geneva/);
  assert.match(html, /Idle word:\s*indexed/);
  assert.match(html, /indexed/);
  assert.match(html, /jumped/);
  assert.match(html, /settings-loaded/);
  assert.match(html, /value-ignored/);
  assert.match(html, /cycle-missing-bypass/);
  assert.match(html, /flag-workaround/);
  assert.match(html, /user-auto-conflict/);
  assert.match(html, /has-repro/);
  assert.match(html, /#91296/);
  assert.match(html, /#75235/);
  assert.match(html, /#86478/);
  assert.match(html, /#88051/);
  assert.match(html, /#90415/);
  assert.match(html, /#83421/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /11:50/);
  assert.match(html, /catalog #112/);
  assert.match(html, /settings\.local\.json/);
  assert.match(html, /bypassPermissions/);
  assert.match(html, /Shift\+Tab/);
  assert.match(html, /default/);
  assert.match(html, /acceptEdits/);
  assert.match(html, /plan/);
  assert.match(html, /auto/);
  assert.match(html, /Setting sources/);
  assert.match(html, /--permission-mode/);
  assert.match(html, /--dangerously-skip-permissions/);
  assert.match(html, /2\.1\.257/);
  assert.match(html, /2\.1\.258/);
  assert.match(html, /managed-settings\.json/);
  assert.match(html, /jimmyjayp/);
  assert.match(html, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.match(html, /family=Jost|Jost/);
  assert.match(html, /family=Space\+Mono|Space Mono/);
  assert.match(html, /Score the cross/);
  assert.match(html, /Pin idle indexed/);
  assert.match(html, /Pin seeded jumped/);
  assert.match(html, /Admit indexed/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to indexed/);
  assert.match(html, /maltese-cross|geneva-drive|watchmaker|enamel chapter-ring|jeweler's loupe|oil stone|steel driving pin|hairline/i);
  assert.match(html, /SILENTLY IGNORED/);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*jumped/i);
  assert.doesNotMatch(html, /Idle word:\s*chocked/i);
  assert.doesNotMatch(html, /Idle word:\s*rolled/i);
  assert.doesNotMatch(html, /Idle word:\s*clasped/i);
  assert.doesNotMatch(html, /Idle word:\s*sprung/i);
  assert.doesNotMatch(html, /Idle word:\s*drained/i);
  assert.doesNotMatch(html, /Idle word:\s*hinged/i);
  assert.doesNotMatch(html, /Idle word:\s*pealed/i);
  assert.doesNotMatch(html, /Idle word:\s*warded/i);
  assert.doesNotMatch(html, /Idle word:\s*pooled/i);
  assert.doesNotMatch(html, /Idle word:\s*cased/i);
  assert.doesNotMatch(html, /Idle word:\s*aired/i);
  assert.doesNotMatch(html, /Idle word:\s*sifted/i);
  assert.doesNotMatch(html, /Idle word:\s*stocked/i);
  assert.doesNotMatch(html, /Pin idle jumped/);
  assert.doesNotMatch(html, /Pin idle chocked/);
  assert.doesNotMatch(html, /Pin idle rolled/);
  assert.doesNotMatch(html, /Score the block/);
  assert.doesNotMatch(html, /Score the pin/);
  assert.doesNotMatch(html, /Score the stick/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
  assert.doesNotMatch(html, /family=Spectral/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Fira/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Work\+Sans/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=Source\+Code\+Pro/);
  assert.doesNotMatch(html, /family=Literata/);
  assert.doesNotMatch(html, /family=Atkinson/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Syne/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Geneva, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Geneva/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /settings\.local\.json.*bypassPermissions.*SILENTLY IGNORED|SILENTLY IGNORED.*settings\.local\.json/i,
  );
  assert.match(readme, /NOT \*\*Postern\*\*/);
  assert.match(readme, /NOT \*\*Pintle\*\*/);
  assert.match(readme, /NOT \*\*Scotch\*\*/);
  assert.match(readme, /NOT \*\*Fibula\*\*/);
  assert.match(readme, /NOT \*\*Virgule\*\*/);
  assert.match(readme, /NOT \*\*Riddle\*\*/);
  assert.match(readme, /NOT \*\*Garner\*\*/);
  assert.match(readme, /Product name stays \*\*Geneva\*\*/);
  assert.match(readme, /Idle word: \*\*indexed\*\*/);
  assert.match(readme, /#75235/);
  assert.match(readme, /#86478/);
  assert.match(readme, /settings\.local\.json/);
  assert.match(readme, /bypassPermissions/);
  assert.match(readme, /Shift\+Tab/);
  assert.match(readme, /--permission-mode/);
  assert.match(readme, /--dangerously-skip-permissions/);
  assert.match(readme, /2\.1\.257/);
  assert.match(readme, /2\.1\.258/);
  assert.match(readme, /jimmyjayp/);
  assert.doesNotMatch(readme, /^# Scotch/m);
  assert.doesNotMatch(readme, /^# Fibula/m);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
});
