import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ACTUAL_WORKTREE,
  ALARM_VERDICTS,
  BACKGROUND_TASK_CHIP,
  BANNED_NAMES,
  CHIPS,
  CONTINUE_THIS_WORK,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  DUAL_PATH_COUNT,
  EXPECTED_WORKTREE,
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
  MEASURED_RATE,
  MEASURED_TOTAL,
  MEASURED_WRONG,
  MID_USE_MINUTES,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  POOLED_WORKTREES,
  PRIMARY_ISSUES,
  REBIND_TOKEN,
  REPORTER,
  RESET_DIRTY_TOKEN,
  SEEDED_WORD,
  TITLE,
  TRANSCRIPT_COUNT,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isRebound,
  isSealed,
  normalize,
  score,
  seedBranchBind,
  seedChipRelaunch,
  seedCousin,
  seedDataLoss,
  seedDirtyResetWipe,
  seedDualTranscriptPath,
  seedFolderSlotRecycle,
  seedHasClearRepro,
  seedHold,
  seedRebindWithoutAdd,
  seedRebound,
  seedSealed,
  seedWindowsFileLock,
  seedWrongWorktree,
} from "./caisson.mjs";

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
  return fileURLToPath(new URL("./caisson.mjs", import.meta.url));
}

test("branch-named cradle + dirty plates preserved → sealed", () => {
  const result = analyze({
    branchBound: true,
    dirtyCradlePreserved: true,
    correctCradle: true,
    wrongWorktree: false,
    dirtyResetWipe: false,
    cwdWrong: false,
    chipRelaunch: true,
  });
  assert.equal(result.verdict, "sealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.rebound, false);
  assert.equal(result.sealed, true);
  assert.equal(isSealed(result.ticket), true);
  assert.equal(isRebound(result.ticket), false);
});

test("chip relaunch + wrong worktree + cwd wrong → rebound", () => {
  const result = analyze({
    wrongWorktree: true,
    chipRelaunch: true,
    cwdWrong: true,
    titleCorrect: true,
    dirtyResetWipe: true,
    dataLoss: true,
    rebindWorktree: true,
    gitWorktreeAdd: false,
    dualTranscriptPath: true,
    folderSlotRecycle: true,
    windowsFileLock: true,
    hasClearRepro: true,
    branchBound: false,
    dirtyCradlePreserved: false,
    correctCradle: false,
  });
  assert.equal(result.verdict, "rebound");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.rebound, true);
  assert.equal(isRebound(result.ticket), true);
  assert.ok(result.chips.includes("rebound"));
  assert.ok(result.chips.includes("wrong-worktree"));
  assert.ok(result.chips.includes("dirty-reset-wipe"));
  assert.ok(!result.chips.includes("sealed"));
});

test("idle sealed is a hold; relaunch bound to correct branch-named cradle", () => {
  const result = analyze(seedSealed());
  assert.equal(result.verdict, "sealed");
  assert.equal(result.idleWord, "sealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.rebound, false);
  assert.equal(result.sealed, true);
  assert.ok(result.chips.includes("sealed"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("rebound"));
  assert.equal(result.ticket.branchBound, true);
  assert.equal(result.ticket.dirtyCradlePreserved, true);
  assert.equal(result.ticket.correctCradle, true);
  assert.equal(result.ticket.wrongWorktree, false);
  assert.match(result.contrast.case, /sealed/i);
  assert.doesNotMatch(
    result.idleWord,
    /fenced|swept|tolled|mute|honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|opened|stalled|fused|forged|attributed/i,
  );
});

test("empty ticket and empty stdin classify sealed", () => {
  assert.equal(classify(emptyTicket()), "sealed");
  assert.equal(classify(""), "sealed");
  assert.equal(classify(null), "sealed");
  assert.equal(decideSeed("sealed").verdict, "sealed");
  assert.equal(decideSeed("open").verdict, "sealed");
});

test("seeded rebound #91405 is alarm with rebindWorktree and Reset dirty wipe", () => {
  const result = analyze(seedRebound());
  assert.equal(result.verdict, "rebound");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.rebound, true);
  assert.ok(result.chips.includes("rebound"));
  assert.ok(result.chips.includes("wrong-worktree"));
  assert.ok(result.chips.includes("dirty-reset-wipe"));
  assert.ok(result.chips.includes("rebind-without-add"));
  assert.ok(result.chips.includes("dual-transcript-path"));
  assert.ok(result.chips.includes("chip-relaunch"));
  assert.ok(result.chips.includes("branch-bind"));
  assert.ok(result.chips.includes("folder-slot-recycle"));
  assert.ok(result.chips.includes("windows-file-lock"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(result.chips.includes("data-loss"));
  assert.ok(!result.chips.includes("sealed"));
  assert.match(result.contrast.case, /rebound/i);
  assert.equal(result.ticket.wrongWorktree, true);
  assert.equal(result.ticket.chipRelaunch, true);
  assert.equal(result.ticket.cwdWrong, true);
  assert.equal(result.ticket.dirtyResetWipe, true);
  assert.equal(result.ticket.version, VERSION);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.expectedWorktree, EXPECTED_WORKTREE);
  assert.equal(result.ticket.actualWorktree, ACTUAL_WORKTREE);
});

test("data fixtures classify sealed vs rebound vs named chips", () => {
  assert.equal(classify(readData("sealed.json")), "sealed");
  assert.equal(classify(readData("rebound.json")), "rebound");
  assert.equal(classify(readData("91405.json")), "rebound");
  assert.equal(classify(readData("wrong-worktree.json")), "wrong-worktree");
  assert.equal(classify(readData("dirty-reset-wipe.json")), "dirty-reset-wipe");
  assert.equal(classify(readData("rebind-without-add.json")), "rebind-without-add");
  assert.equal(classify(readData("dual-transcript-path.json")), "dual-transcript-path");
  assert.equal(classify(readData("chip-relaunch.json")), "chip-relaunch");
  assert.equal(classify(readData("branch-bind.json")), "branch-bind");
  assert.equal(classify(readData("folder-slot-recycle.json")), "folder-slot-recycle");
  assert.equal(classify(readData("windows-file-lock.json")), "windows-file-lock");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("data-loss.json")), "data-loss");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("rebound seed is alarm; sealed / hold are holds", () => {
  assert.equal(score(seedRebound()).alarm, true);
  assert.equal(score(seedRebound()).hold, false);
  assert.equal(score(seedSealed()).hold, true);
  assert.equal(score(seedSealed()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedWrongWorktree()).alarm, true);
  assert.equal(score(seedDirtyResetWipe()).alarm, true);
});

test("normalize seeds 91405 without ticket fields", () => {
  const ticket = normalize({ issue: 91405 });
  assert.equal(ticket.wrongWorktree, true);
  assert.equal(ticket.chipRelaunch, true);
  assert.equal(ticket.cwdWrong, true);
  assert.equal(ticket.dirtyResetWipe, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "rebound");
});

test("score / decide / handle agree on rebound vs sealed", () => {
  assert.equal(score(seedRebound()).verdict, "rebound");
  assert.equal(decide(seedSealed()).verdict, "sealed");
  const fail = handle(seedRebound());
  const hold = handle(seedSealed());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91405/);
  assert.match(fail.hookSpecificOutput.additionalContext, /rebindWorktree/);
  assert.match(hold.hookSpecificOutput.additionalContext, /sealed/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("rebound").verdict, "rebound");
  assert.equal(decideSeed(91405).verdict, "rebound");
  assert.equal(decideSeed("91405").verdict, "rebound");
  assert.equal(decideSeed("sealed").verdict, "sealed");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("wrong-worktree").verdict, "wrong-worktree");
  assert.equal(decideSeed("dirty-reset-wipe").verdict, "dirty-reset-wipe");
  assert.equal(decideSeed("rebind-without-add").verdict, "rebind-without-add");
});

test("CLI scores data files", () => {
  const rebound = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91405.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(rebound.status, 0, rebound.stderr);
  assert.equal(JSON.parse(rebound.stdout).verdict, "rebound");
  assert.equal(JSON.parse(rebound.stdout).alarm, true);

  const sealed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/sealed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(sealed.status, 0, sealed.stderr);
  assert.equal(JSON.parse(sealed.stdout).verdict, "sealed");
  assert.equal(JSON.parse(sealed.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91405);
  assert.deepEqual([...PRIMARY_ISSUES], [91405]);
  assert.equal(COUSIN_ISSUE, 79366);
  assert.deepEqual([...COUSINS], [79366]);
  assert.deepEqual(
    [...CROSS_ECOSYSTEM],
    ["openai/codex#42001", "openai/codex#42201"],
  );
  assert.equal(FILED_AT, "2026-09-02T06:21:58Z");
  assert.equal(REPORTER, "IT-RT");
  assert.equal(VERSION, "Claude Code Desktop");
  assert.equal(PLATFORM, "Windows 11");
  assert.equal(MEASURED_WRONG, 42);
  assert.equal(MEASURED_TOTAL, 44);
  assert.equal(MEASURED_RATE, "95.5%");
  assert.equal(TRANSCRIPT_COUNT, 1764);
  assert.equal(POOLED_WORKTREES, 44);
  assert.equal(DUAL_PATH_COUNT, 11);
  assert.equal(EXPECTED_WORKTREE, "clever-rosalind-ef53a2");
  assert.equal(ACTUAL_WORKTREE, "elegant-euler-7d5da0");
  assert.equal(REBIND_TOKEN, "rebindWorktree");
  assert.equal(RESET_DIRTY_TOKEN, "Reset dirty worktree");
  assert.equal(BACKGROUND_TASK_CHIP, "background-task chip");
  assert.equal(CONTINUE_THIS_WORK, "continue this work");
  assert.equal(MID_USE_MINUTES, 24);
  assert.equal(IDLE_WORD, "sealed");
  assert.equal(SEEDED_WORD, "rebound");
  assert.notEqual(IDLE_WORD, "rebound");
  assert.notEqual(IDLE_WORD, "fenced");
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
  assert.deepEqual([...HOLD_VERDICTS], ["sealed", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("rebound"));
  assert.ok(ALARM_VERDICTS.includes("wrong-worktree"));
  assert.ok(ALARM_VERDICTS.includes("dirty-reset-wipe"));
  assert.ok(!ALARM_VERDICTS.includes("sealed"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 13);
  assert.deepEqual(
    [...LABELS],
    [
      "bug",
      "has repro",
      "platform:windows",
      "area:core",
      "data-loss",
      "area:desktop",
    ],
  );
  assert.match(TITLE, /Worktree pool/);
  assert.match(TITLE, /wrong worktree/);
  assert.match(TITLE, /uncommitted work/);
  assert.match(ISSUE_URL, /91405/);
  assert.match(PHRASE, /reseats the wrong hull/i);
  assert.match(PHRASE, /admit rebound/);
  assert.match(HUB_LINE, /16:50 caisson/);
  assert.match(HUB_LINE, /admit rebound/);
  assert.match(MARK, /16:50/);
  assert.match(MARK, /#117/);
  assert.match(MARK, /#91405/);
  assert.match(CONTRAST_NOTE, /DESKTOP WORKTREE POOL/);
  assert.match(CONTRAST_NOTE, /rebindWorktree/);
  assert.match(CONTRAST_NOTE, /Reset dirty/);
  assert.match(CONTRAST_NOTE, /42\/44/);
  assert.match(CONTRAST_NOTE, /95\.5%/);
  assert.match(CONTRAST_NOTE, /1764|1,764/);
  assert.match(CONTRAST_NOTE, /IT-RT/);
  assert.match(CONTRAST_NOTE, /Windows 11/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("spindle"));
  assert.ok(NOT_PRODUCTS.includes("knell"));
  assert.ok(NOT_PRODUCTS.includes("tumbler"));
  assert.ok(NOT_PRODUCTS.includes("escapement"));
  assert.ok(NOT_PRODUCTS.includes("clew"));
  assert.ok(NOT_PRODUCTS.includes("hasp"));
  assert.ok(NOT_PRODUCTS.includes("berth"));
  assert.ok(NOT_PRODUCTS.includes("bollard"));
  assert.ok(BANNED_NAMES.includes("Spindle"));
  assert.ok(BANNED_NAMES.includes("Knell"));
  assert.ok(BANNED_NAMES.includes("Tumbler"));
  assert.ok(BANNED_NAMES.includes("Berth"));
  assert.ok(BANNED_NAMES.includes("Bollard"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "sealed");
  assert.equal(chips.seededWord, "rebound");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91405);
  assert.equal(fp.cousin, 79366);
  assert.deepEqual(fp.cousins, [79366]);
  assert.deepEqual(fp.crossEcosystem, ["openai/codex#42001", "openai/codex#42201"]);
  assert.equal(fp.reporter, "IT-RT");
  assert.equal(fp.version, "Claude Code Desktop");
  assert.equal(fp.platform, "Windows 11");
  assert.equal(fp.measuredWrong, 42);
  assert.equal(fp.measuredTotal, 44);
  assert.equal(fp.measuredRate, "95.5%");
  assert.equal(fp.transcriptCount, 1764);
  assert.equal(fp.rebindToken, "rebindWorktree");
  assert.equal(fp.resetDirtyToken, "Reset dirty worktree");
  assert.equal(fp.expectedWorktree, "clever-rosalind-ef53a2");
  assert.equal(fp.actualWorktree, "elegant-euler-7d5da0");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "rebound");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.wrongWorktree, true);
});

test("chipsOf on a raw rebound chip-relaunch ticket still marks rebound", () => {
  const chips = chipsOf({
    wrongWorktree: true,
    chipRelaunch: true,
    cwdWrong: true,
    dirtyResetWipe: true,
    dataLoss: true,
    outputText:
      "rebound; #91405; rebindWorktree to wrong slot; Reset dirty worktree; 42/44 (95.5%)",
  });
  assert.ok(chips.includes("rebound"));
  assert.ok(chips.includes("wrong-worktree"));
  assert.ok(chips.includes("dirty-reset-wipe"));
  assert.ok(!chips.includes("sealed"));
});

test("cousin #79366 is not conflated with rebound primary", () => {
  assert.notEqual(classify(seedCousin()), "rebound");
  assert.notEqual(classify({ issue: 79366 }), "rebound");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /79366|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become rebound", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "rebound", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91405);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedWrongWorktree()).verdict, "wrong-worktree");
  assert.equal(analyze(seedDirtyResetWipe()).verdict, "dirty-reset-wipe");
  assert.equal(analyze(seedRebindWithoutAdd()).verdict, "rebind-without-add");
  assert.equal(analyze(seedDualTranscriptPath()).verdict, "dual-transcript-path");
  assert.equal(analyze(seedChipRelaunch()).verdict, "chip-relaunch");
  assert.equal(analyze(seedBranchBind()).verdict, "branch-bind");
  assert.equal(analyze(seedFolderSlotRecycle()).verdict, "folder-slot-recycle");
  assert.equal(analyze(seedWindowsFileLock()).verdict, "windows-file-lock");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedDataLoss()).verdict, "data-loss");
  assert.equal(analyze(seedHold()).ticket.branchBound, true);
  assert.equal(isRebound(seedSealed()), false);
  assert.equal(isRebound(seedRebound()), true);
});

test("living page is a Caisson atelier, idle sealed, seeded rebound", () => {
  const html = readPage();
  assert.match(html, /<title>Caisson/);
  assert.match(html, /Idle word:\s*sealed/);
  assert.match(html, /sealed/);
  assert.match(html, /rebound/);
  assert.match(html, /wrong-worktree/);
  assert.match(html, /dirty-reset-wipe/);
  assert.match(html, /rebind-without-add/);
  assert.match(html, /dual-transcript-path/);
  assert.match(html, /chip-relaunch/);
  assert.match(html, /branch-bind/);
  assert.match(html, /folder-slot-recycle/);
  assert.match(html, /windows-file-lock/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /data-loss/);
  assert.match(html, /#91405/);
  assert.match(html, /#79366/);
  assert.match(html, /42001/);
  assert.match(html, /42201/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /16:50/);
  assert.match(html, /catalog #117/);
  assert.match(html, /rebindWorktree/);
  assert.match(html, /Reset dirty worktree/);
  assert.match(html, /42\/44/);
  assert.match(html, /95\.5%/);
  assert.match(html, /1764|1,764/);
  assert.match(html, /clever-rosalind-ef53a2/);
  assert.match(html, /elegant-euler-7d5da0/);
  assert.match(html, /background-task chip/);
  assert.match(html, /continue this work/);
  assert.match(html, /Windows 11/);
  assert.match(html, /Claude Code Desktop/);
  assert.match(html, /IT-RT/);
  assert.match(html, /family=Zilla\+Slab|Zilla Slab/);
  assert.match(html, /family=Epilogue|Epilogue/);
  assert.match(html, /family=Overpass\+Mono|Overpass Mono/);
  assert.match(html, /Score the seal/);
  assert.match(html, /Pin idle sealed/);
  assert.match(html, /Pin seeded rebound/);
  assert.match(html, /Admit rebound/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to sealed/);
  assert.match(html, /caisson|floating gate|cradle|hull|waterline|wash spray|pool basin/i);
  assert.match(html, /DESKTOP WORKTREE POOL|WRONG WORKTREE|rebindWorktree/i);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.match(html, /Stay OFF spindle chip-sweep/);
  assert.match(html, /knell mute-bell/);
  assert.match(html, /tumbler keyway/);
  assert.match(html, /escapement pallet/);
  assert.match(html, /carillon peal/);
  assert.match(html, /sluice millrace/);
  assert.match(html, /berth-card clone/);
  assert.match(html, /bollard clone/);
  assert.doesNotMatch(html, /Idle word:\s*rebound/i);
  assert.doesNotMatch(html, /Idle word:\s*fenced/i);
  assert.doesNotMatch(html, /Idle word:\s*swept/i);
  assert.doesNotMatch(html, /Idle word:\s*tolled/i);
  assert.doesNotMatch(html, /Idle word:\s*mute/i);
  assert.doesNotMatch(html, /Idle word:\s*honored/i);
  assert.doesNotMatch(html, /Idle word:\s*discarded/i);
  assert.doesNotMatch(html, /Idle word:\s*arrested/i);
  assert.doesNotMatch(html, /Idle word:\s*skipped/i);
  assert.doesNotMatch(html, /Idle word:\s*pooled/i);
  assert.doesNotMatch(html, /Pin idle rebound/);
  assert.doesNotMatch(html, /Pin idle fenced/);
  assert.doesNotMatch(html, /Pin idle swept/);
  assert.doesNotMatch(html, /Pin idle tolled/);
  assert.doesNotMatch(html, /Pin idle mute/);
  assert.doesNotMatch(html, /Score the purge/);
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
  assert.doesNotMatch(html, /family=Cardo|Cardo/);
  assert.doesNotMatch(html, /family=Hind|Hind/);
  assert.doesNotMatch(html, /family=Cousine|Cousine/);
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

test("README and page stay Caisson, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Caisson/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /DESKTOP WORKTREE POOL ASSIGNS CHIP-RELAUNCHED SESSIONS TO THE WRONG WORKTREE/i,
  );
  assert.match(readme, /NOT \*\*Spindle\*\*/);
  assert.match(readme, /NOT \*\*Knell\*\*/);
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /NOT \*\*Clew\*\*/);
  assert.match(readme, /NOT \*\*Hasp\*\*/);
  assert.match(readme, /NOT \*\*Berth\*\*/);
  assert.match(readme, /NOT \*\*Bollard\*\*/);
  assert.match(readme, /Product name stays \*\*Caisson\*\*/);
  assert.match(readme, /Idle word: \*\*sealed\*\*/);
  assert.match(readme, /#79366/);
  assert.match(readme, /42001/);
  assert.match(readme, /42201/);
  assert.match(readme, /rebindWorktree/);
  assert.match(readme, /Reset dirty worktree/);
  assert.match(readme, /42\/44/);
  assert.match(readme, /95\.5%/);
  assert.match(readme, /IT-RT/);
  assert.match(readme, /Windows 11/);
  assert.match(readme, /1764|1,764/);
  assert.doesNotMatch(readme, /^# Spindle/m);
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
  assert.doesNotMatch(readme, /^# Berth/m);
  assert.doesNotMatch(readme, /^# Bollard/m);
});
