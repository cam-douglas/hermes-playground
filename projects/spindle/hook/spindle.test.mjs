import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  FEATURED_ISSUE,
  FILED_AT,
  FIRST_SEEN,
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
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  RUN_IN_BACKGROUND,
  SEEDED_WORD,
  TASK_OUTPUT,
  TEMP_ROOT,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isFenced,
  isSwept,
  normalize,
  score,
  seedCousin,
  seedFenced,
  seedHasClearRepro,
  seedHold,
  seedMtimeFalseLiveness,
  seedMultiSession,
  seedOutputTruncated,
  seedSharedTempRoot,
  seedSiblingLive,
  seedSilentDeletion,
  seedStartupCleanup,
  seedSwept,
} from "./spindle.mjs";

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
  return fileURLToPath(new URL("./spindle.mjs", import.meta.url));
}

test("sibling dirs untouched + process/lock liveness → fenced", () => {
  const result = analyze({
    siblingDirsUntouched: true,
    processLockLiveness: true,
    outputDeleted: false,
    siblingLive: true,
    startupCleanup: true,
  });
  assert.equal(result.verdict, "fenced");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.swept, false);
  assert.equal(result.fenced, true);
  assert.equal(isFenced(result.ticket), true);
  assert.equal(isSwept(result.ticket), false);
});

test("startup cleanup + sibling live + output deleted → swept", () => {
  const result = analyze({
    startupCleanup: true,
    siblingLive: true,
    outputDeleted: true,
    outputTruncated: true,
    mtimeLiveness: true,
    silentDeletion: true,
    multiSession: true,
    sharedTempRoot: true,
    siblingDirsUntouched: false,
  });
  assert.equal(result.verdict, "swept");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.swept, true);
  assert.equal(isSwept(result.ticket), true);
  assert.ok(result.chips.includes("swept"));
  assert.ok(result.chips.includes("sibling-live"));
  assert.ok(result.chips.includes("mtime-false-liveness"));
  assert.ok(!result.chips.includes("fenced"));
});

test("idle fenced is a hold; cleanup never touches alive sibling dirs", () => {
  const result = analyze(seedFenced());
  assert.equal(result.verdict, "fenced");
  assert.equal(result.idleWord, "fenced");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.swept, false);
  assert.equal(result.fenced, true);
  assert.ok(result.chips.includes("fenced"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("swept"));
  assert.equal(result.ticket.siblingDirsUntouched, true);
  assert.equal(result.ticket.processLockLiveness, true);
  assert.equal(result.ticket.outputDeleted, false);
  assert.match(result.contrast.case, /fenced/i);
  assert.doesNotMatch(
    result.idleWord,
    /tolled|mute|honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed/i,
  );
});

test("empty ticket and empty stdin classify fenced", () => {
  assert.equal(classify(emptyTicket()), "fenced");
  assert.equal(classify(""), "fenced");
  assert.equal(classify(null), "fenced");
  assert.equal(decideSeed("fenced").verdict, "fenced");
  assert.equal(decideSeed("open").verdict, "fenced");
});

test("seeded swept #91402 is alarm with mtime false-liveness and silent deletion", () => {
  const result = analyze(seedSwept());
  assert.equal(result.verdict, "swept");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.swept, true);
  assert.ok(result.chips.includes("swept"));
  assert.ok(result.chips.includes("sibling-live"));
  assert.ok(result.chips.includes("mtime-false-liveness"));
  assert.ok(result.chips.includes("startup-cleanup"));
  assert.ok(result.chips.includes("shared-temp-root"));
  assert.ok(result.chips.includes("output-truncated"));
  assert.ok(result.chips.includes("silent-deletion"));
  assert.ok(result.chips.includes("multi-session"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("fenced"));
  assert.match(result.contrast.case, /swept/i);
  assert.equal(result.ticket.startupCleanup, true);
  assert.equal(result.ticket.siblingLive, true);
  assert.equal(result.ticket.outputDeleted, true);
  assert.equal(result.ticket.mtimeLiveness, true);
  assert.equal(result.ticket.version, VERSION);
  assert.equal(result.ticket.reporter, REPORTER);
});

test("data fixtures classify fenced vs swept vs named chips", () => {
  assert.equal(classify(readData("fenced.json")), "fenced");
  assert.equal(classify(readData("swept.json")), "swept");
  assert.equal(classify(readData("91402.json")), "swept");
  assert.equal(classify(readData("sibling-live.json")), "sibling-live");
  assert.equal(classify(readData("mtime-false-liveness.json")), "mtime-false-liveness");
  assert.equal(classify(readData("startup-cleanup.json")), "startup-cleanup");
  assert.equal(classify(readData("shared-temp-root.json")), "shared-temp-root");
  assert.equal(classify(readData("output-truncated.json")), "output-truncated");
  assert.equal(classify(readData("silent-deletion.json")), "silent-deletion");
  assert.equal(classify(readData("multi-session.json")), "multi-session");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("swept seed is alarm; fenced / hold are holds", () => {
  assert.equal(score(seedSwept()).alarm, true);
  assert.equal(score(seedSwept()).hold, false);
  assert.equal(score(seedFenced()).hold, true);
  assert.equal(score(seedFenced()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedSiblingLive()).alarm, true);
  assert.equal(score(seedStartupCleanup()).alarm, true);
});

test("normalize seeds 91402 without ticket fields", () => {
  const ticket = normalize({ issue: 91402 });
  assert.equal(ticket.startupCleanup, true);
  assert.equal(ticket.siblingLive, true);
  assert.equal(ticket.outputDeleted, true);
  assert.equal(ticket.mtimeLiveness, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "swept");
});

test("score / decide / handle agree on swept vs fenced", () => {
  assert.equal(score(seedSwept()).verdict, "swept");
  assert.equal(decide(seedFenced()).verdict, "fenced");
  const fail = handle(seedSwept());
  const hold = handle(seedFenced());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91402/);
  assert.match(fail.hookSpecificOutput.additionalContext, /mtime false-liveness/);
  assert.match(hold.hookSpecificOutput.additionalContext, /fenced/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("swept").verdict, "swept");
  assert.equal(decideSeed(91402).verdict, "swept");
  assert.equal(decideSeed("91402").verdict, "swept");
  assert.equal(decideSeed("fenced").verdict, "fenced");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("sibling-live").verdict, "sibling-live");
  assert.equal(decideSeed("mtime-false-liveness").verdict, "mtime-false-liveness");
  assert.equal(decideSeed("startup-cleanup").verdict, "startup-cleanup");
});

test("CLI scores data files", () => {
  const swept = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91402.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(swept.status, 0, swept.stderr);
  assert.equal(JSON.parse(swept.stdout).verdict, "swept");
  assert.equal(JSON.parse(swept.stdout).alarm, true);

  const fenced = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/fenced.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(fenced.status, 0, fenced.stderr);
  assert.equal(JSON.parse(fenced.stdout).verdict, "fenced");
  assert.equal(JSON.parse(fenced.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91402);
  assert.deepEqual([...PRIMARY_ISSUES], [91402]);
  assert.equal(COUSIN_ISSUE, 79879);
  assert.deepEqual([...COUSINS], [79879]);
  assert.deepEqual([...CROSS_ECOSYSTEM], ["openai/codex#35433"]);
  assert.equal(FILED_AT, "2026-09-02T05:44:45Z");
  assert.equal(REPORTER, "Row-Nation");
  assert.equal(VERSION, "2.1.211");
  assert.equal(PLATFORM, "Windows");
  assert.equal(FIRST_SEEN, "1 Sep 2026");
  assert.equal(RUN_IN_BACKGROUND, "run_in_background");
  assert.equal(TASK_OUTPUT, "tasks/<task-id>.output");
  assert.match(TEMP_ROOT, /LOCALAPPDATA/);
  assert.equal(IDLE_WORD, "fenced");
  assert.equal(SEEDED_WORD, "swept");
  assert.notEqual(IDLE_WORD, "swept");
  assert.notEqual(IDLE_WORD, "tolled");
  assert.notEqual(IDLE_WORD, "mute");
  assert.notEqual(IDLE_WORD, "honored");
  assert.notEqual(IDLE_WORD, "discarded");
  assert.notEqual(IDLE_WORD, "arrested");
  assert.notEqual(IDLE_WORD, "skipped");
  assert.notEqual(IDLE_WORD, "indexed");
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
  assert.notEqual(IDLE_WORD, "stationed");
  assert.deepEqual([...HOLD_VERDICTS], ["fenced", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("swept"));
  assert.ok(ALARM_VERDICTS.includes("sibling-live"));
  assert.ok(ALARM_VERDICTS.includes("mtime-false-liveness"));
  assert.ok(!ALARM_VERDICTS.includes("fenced"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 11);
  assert.deepEqual(
    [...LABELS],
    ["bug", "platform:windows", "area:core", "area:bash"],
  );
  assert.match(TITLE, /Startup cleanup/);
  assert.match(TITLE, /live sibling/);
  assert.match(TITLE, /Bash task output/);
  assert.match(ISSUE_URL, /91402/);
  assert.match(PHRASE, /sweeps a live sibling/i);
  assert.match(PHRASE, /admit swept/);
  assert.match(HUB_LINE, /15:50 spindle/);
  assert.match(HUB_LINE, /admit swept/);
  assert.match(MARK, /15:50/);
  assert.match(MARK, /#116/);
  assert.match(MARK, /#91402/);
  assert.match(CONTRAST_NOTE, /NEW-SESSION STARTUP CLEANUP/);
  assert.match(CONTRAST_NOTE, /mtime false-liveness/);
  assert.match(CONTRAST_NOTE, /run_in_background/);
  assert.match(CONTRAST_NOTE, /2\.1\.211/);
  assert.match(CONTRAST_NOTE, /Row-Nation/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("knell"));
  assert.ok(NOT_PRODUCTS.includes("tumbler"));
  assert.ok(NOT_PRODUCTS.includes("escapement"));
  assert.ok(NOT_PRODUCTS.includes("clew"));
  assert.ok(NOT_PRODUCTS.includes("hasp"));
  assert.ok(NOT_PRODUCTS.includes("shear"));
  assert.ok(NOT_PRODUCTS.includes("quire"));
  assert.ok(BANNED_NAMES.includes("Knell"));
  assert.ok(BANNED_NAMES.includes("Tumbler"));
  assert.ok(BANNED_NAMES.includes("Escapement"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "fenced");
  assert.equal(chips.seededWord, "swept");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91402);
  assert.equal(fp.cousin, 79879);
  assert.deepEqual(fp.cousins, [79879]);
  assert.deepEqual(fp.crossEcosystem, ["openai/codex#35433"]);
  assert.equal(fp.reporter, "Row-Nation");
  assert.equal(fp.version, "2.1.211");
  assert.equal(fp.platform, "Windows");
  assert.equal(fp.firstSeen, "1 Sep 2026");
  assert.equal(fp.taskOutput, "tasks/<task-id>.output");
  assert.match(fp.tempRoot, /LOCALAPPDATA/);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "swept");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.startupCleanup, true);
});

test("chipsOf on a raw swept startup-cleanup ticket still marks swept", () => {
  const chips = chipsOf({
    startupCleanup: true,
    siblingLive: true,
    outputDeleted: true,
    mtimeLiveness: true,
    silentDeletion: true,
    outputText:
      "swept; #91402; new-session startup cleanup deletes live sibling Bash task output; mtime false-liveness; silent",
  });
  assert.ok(chips.includes("swept"));
  assert.ok(chips.includes("sibling-live"));
  assert.ok(chips.includes("mtime-false-liveness"));
  assert.ok(!chips.includes("fenced"));
});

test("cousin #79879 is not conflated with swept primary", () => {
  assert.notEqual(classify(seedCousin()), "swept");
  assert.notEqual(classify({ issue: 79879 }), "swept");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /79879|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become swept", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "swept", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91402);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedSiblingLive()).verdict, "sibling-live");
  assert.equal(analyze(seedMtimeFalseLiveness()).verdict, "mtime-false-liveness");
  assert.equal(analyze(seedStartupCleanup()).verdict, "startup-cleanup");
  assert.equal(analyze(seedSharedTempRoot()).verdict, "shared-temp-root");
  assert.equal(analyze(seedOutputTruncated()).verdict, "output-truncated");
  assert.equal(analyze(seedSilentDeletion()).verdict, "silent-deletion");
  assert.equal(analyze(seedMultiSession()).verdict, "multi-session");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.siblingDirsUntouched, true);
  assert.equal(isSwept(seedFenced()), false);
  assert.equal(isSwept(seedSwept()), true);
});

test("living page is a Spindle atelier, idle fenced, seeded swept", () => {
  const html = readPage();
  assert.match(html, /<title>Spindle/);
  assert.match(html, /Idle word:\s*fenced/);
  assert.match(html, /fenced/);
  assert.match(html, /swept/);
  assert.match(html, /sibling-live/);
  assert.match(html, /mtime-false-liveness/);
  assert.match(html, /startup-cleanup/);
  assert.match(html, /shared-temp-root/);
  assert.match(html, /output-truncated/);
  assert.match(html, /silent-deletion/);
  assert.match(html, /multi-session/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91402/);
  assert.match(html, /#79879/);
  assert.match(html, /35433/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /15:50/);
  assert.match(html, /catalog #116/);
  assert.match(html, /startup cleanup/i);
  assert.match(html, /run_in_background/);
  assert.match(html, /tasks\/&lt;task-id&gt;\.output|tasks\/<task-id>\.output/);
  assert.match(html, /LOCALAPPDATA/);
  assert.match(html, /mtime/);
  assert.match(html, /2\.1\.211/);
  assert.match(html, /Windows/);
  assert.match(html, /Row-Nation/);
  assert.match(html, /1 Sep 2026/);
  assert.match(html, /family=Cardo|Cardo/);
  assert.match(html, /family=Hind|Hind/);
  assert.match(html, /family=Cousine|Cousine/);
  assert.match(html, /Score the purge/);
  assert.match(html, /Pin idle fenced/);
  assert.match(html, /Pin seeded swept/);
  assert.match(html, /Admit swept/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to fenced/);
  assert.match(html, /spindle|chip-sweep|shared ways|chip fence|chip ledger|headstock|swarf/i);
  assert.match(html, /NEW-SESSION STARTUP CLEANUP|LIVE SIBLING BASH TASK OUTPUTS|mtime false-liveness/i);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*swept/i);
  assert.doesNotMatch(html, /Idle word:\s*tolled/i);
  assert.doesNotMatch(html, /Idle word:\s*mute/i);
  assert.doesNotMatch(html, /Idle word:\s*honored/i);
  assert.doesNotMatch(html, /Idle word:\s*discarded/i);
  assert.doesNotMatch(html, /Idle word:\s*arrested/i);
  assert.doesNotMatch(html, /Idle word:\s*skipped/i);
  assert.doesNotMatch(html, /Pin idle swept/);
  assert.doesNotMatch(html, /Pin idle tolled/);
  assert.doesNotMatch(html, /Pin idle mute/);
  assert.doesNotMatch(html, /Score the mute/);
  assert.doesNotMatch(html, /Score the keyway/);
  assert.doesNotMatch(html, /Score the pallet/);
  assert.doesNotMatch(html, /Score the cross/);
  assert.doesNotMatch(html, /Score the block/);
  assert.doesNotMatch(html, /Score the pin/);
  assert.doesNotMatch(html, /Score the stick/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
  assert.doesNotMatch(html, /family=Bitter|Bitter/);
  assert.doesNotMatch(html, /family=Karla|Karla/);
  assert.doesNotMatch(html, /family=Inconsolata|Inconsolata/);
  assert.doesNotMatch(html, /family=Young\+Serif|Young Serif/);
  assert.doesNotMatch(html, /family=Figtree|Figtree/);
  assert.doesNotMatch(html, /family=Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(html, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(html, /family=Manrope|Manrope/);
  assert.doesNotMatch(html, /family=Azeret\+Mono|Azeret Mono/);
  assert.doesNotMatch(html, /family=Bodoni/);
  assert.doesNotMatch(html, /family=Jost/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
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
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Spindle, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Spindle/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /NEW-SESSION STARTUP CLEANUP DELETES LIVE SIBLING BASH TASK OUTPUTS|mtime false-liveness/i,
  );
  assert.match(readme, /NOT \*\*Knell\*\*/);
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /NOT \*\*Clew\*\*/);
  assert.match(readme, /NOT \*\*Hasp\*\*/);
  assert.match(readme, /NOT \*\*Quire\*\*/);
  assert.match(readme, /NOT \*\*Shear\*\*/);
  assert.match(readme, /Product name stays \*\*Spindle\*\*/);
  assert.match(readme, /Idle word: \*\*fenced\*\*/);
  assert.match(readme, /#79879/);
  assert.match(readme, /35433/);
  assert.match(readme, /run_in_background/);
  assert.match(readme, /2\.1\.211/);
  assert.match(readme, /Row-Nation/);
  assert.match(readme, /LOCALAPPDATA/);
  assert.match(readme, /1 Sep 2026/);
  assert.doesNotMatch(readme, /^# Knell/m);
  assert.doesNotMatch(readme, /^# Tumbler/m);
  assert.doesNotMatch(readme, /^# Escapement/m);
  assert.doesNotMatch(readme, /^# Geneva/m);
  assert.doesNotMatch(readme, /^# Scotch/m);
  assert.doesNotMatch(readme, /^# Fibula/m);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Carillon/m);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
});
