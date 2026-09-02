import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  ARCH,
  ASK_RUNTIME_CONSTANTS,
  BANNED_NAMES,
  CHIPS,
  CLI_PROJECTS,
  CLI_RESUME,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  DESKTOP_SESSIONS,
  DESKTOP_VERSION,
  ENSURE_STORAGE_DIR,
  ERRNO,
  ERRNO_CODE,
  FEATURED_ISSUE,
  FILED_AT,
  FILESYSTEM,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  EINVAL_LINES,
  ISSUE_URL,
  LABELS,
  LAST_SUCCESS,
  LAST_WORKING,
  FIRST_FAILURE,
  LOCAL_JSON,
  MARK,
  MKDIR_PRIVATE,
  NOT_PRODUCTS,
  O_DIRECT,
  O_DIRECTORY,
  O_NOFOLLOW,
  OPEN_FLAGS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  STORAGE_DIR,
  TITLE,
  VERDICTS,
  VERSION,
  WRITE_SESSION_TO_DISK,
  X86_O_DIRECTORY,
  X86_O_NOFOLLOW,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isLatched,
  isVanished,
  normalize,
  score,
  seedAarch64NativeOk,
  seedCliResumeSurvives,
  seedCousin,
  seedEinvalOpen,
  seedEnsureStorageDir,
  seedHardcodedX86Flags,
  seedHasClearRepro,
  seedHold,
  seedLatched,
  seedOdirectPoison,
  seedOvernightSessionLost,
  seedRuntimeRegression,
  seedSeventyThreeEinval,
  seedSidebarVanish,
  seedVanished,
} from "./reliquary.mjs";

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
  return fileURLToPath(new URL("./reliquary.mjs", import.meta.url));
}

test("vault latched + relic seated + no EINVAL → latched", () => {
  const result = analyze({
    vaultLatched: true,
    relicSeated: true,
    einvalOpen: false,
    hardcodedX86Flags: false,
    sidebarVanish: false,
    overnightSessionLost: false,
    aarch64NativeOk: true,
  });
  assert.equal(result.verdict, "latched");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.vanished, false);
  assert.equal(result.latched, true);
  assert.equal(isLatched(result.ticket), true);
  assert.equal(isVanished(result.ticket), false);
});

test("EINVAL + hardcoded x86 flags + aarch64 → vanished", () => {
  const result = analyze({
    einvalOpen: true,
    hardcodedX86Flags: true,
    odirectPoison: true,
    sidebarVanish: true,
    overnightSessionLost: true,
    seventyThreeEinval: true,
    runtimeRegression: true,
    errno: -22,
    hasClearRepro: true,
    vaultLatched: false,
    relicSeated: false,
  });
  assert.equal(result.verdict, "vanished");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.vanished, true);
  assert.equal(isVanished(result.ticket), true);
  assert.ok(result.chips.includes("vanished"));
  assert.ok(result.chips.includes("einval-open"));
  assert.ok(result.chips.includes("hardcoded-x86-flags"));
  assert.ok(!result.chips.includes("latched"));
});

test("idle latched is a hold; vault latched closed; overnight relic seated", () => {
  const result = analyze(seedLatched());
  assert.equal(result.verdict, "latched");
  assert.equal(result.idleWord, "latched");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.vanished, false);
  assert.equal(result.latched, true);
  assert.ok(result.chips.includes("latched"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("vanished"));
  assert.equal(result.ticket.vaultLatched, true);
  assert.equal(result.ticket.relicSeated, true);
  assert.equal(result.ticket.einvalOpen, false);
  assert.match(result.contrast.case, /latched/i);
  assert.doesNotMatch(
    result.idleWord,
    /sealed|rebound|dark|spurious|fenced|swept|tolled|mute|honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|opened|stalled|fused|forged|attributed/i,
  );
});

test("empty ticket and empty stdin classify latched", () => {
  assert.equal(classify(emptyTicket()), "latched");
  assert.equal(classify(""), "latched");
  assert.equal(classify(null), "latched");
  assert.equal(decideSeed("latched").verdict, "latched");
  assert.equal(decideSeed("open").verdict, "latched");
});

test("seeded vanished #91433 is alarm with EINVAL latch and overnight loss", () => {
  const result = analyze(seedVanished());
  assert.equal(result.verdict, "vanished");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.vanished, true);
  assert.ok(result.chips.includes("vanished"));
  assert.ok(result.chips.includes("einval-open"));
  assert.ok(result.chips.includes("odirect-poison"));
  assert.ok(result.chips.includes("hardcoded-x86-flags"));
  assert.ok(result.chips.includes("aarch64-native-ok"));
  assert.ok(result.chips.includes("sidebar-vanish"));
  assert.ok(result.chips.includes("cli-resume-survives"));
  assert.ok(result.chips.includes("seventy-three-einval"));
  assert.ok(result.chips.includes("runtime-regression"));
  assert.ok(result.chips.includes("overnight-session-lost"));
  assert.ok(result.chips.includes("ensure-storage-dir"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("latched"));
  assert.match(result.contrast.case, /vanished/i);
  assert.equal(result.ticket.einvalOpen, true);
  assert.equal(result.ticket.hardcodedX86Flags, true);
  assert.equal(result.ticket.errno, ERRNO);
  assert.equal(result.ticket.errnoCode, ERRNO_CODE);
  assert.equal(result.ticket.version, VERSION);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.einvalLines, EINVAL_LINES);
  assert.equal(result.ticket.arch, ARCH);
});

test("data fixtures classify latched vs vanished vs named chips", () => {
  assert.equal(classify(readData("latched.json")), "latched");
  assert.equal(classify(readData("vanished.json")), "vanished");
  assert.equal(classify(readData("91433.json")), "vanished");
  assert.equal(classify(readData("einval.json")), "einval-open");
  assert.equal(classify(readData("einval-open.json")), "einval-open");
  assert.equal(classify(readData("odirect.json")), "odirect-poison");
  assert.equal(classify(readData("odirect-poison.json")), "odirect-poison");
  assert.equal(classify(readData("hardcoded-x86-flags.json")), "hardcoded-x86-flags");
  assert.equal(classify(readData("aarch64-native-ok.json")), "aarch64-native-ok");
  assert.equal(classify(readData("sidebar-vanish.json")), "sidebar-vanish");
  assert.equal(classify(readData("cli-resume-survives.json")), "cli-resume-survives");
  assert.equal(classify(readData("seventy-three-einval.json")), "seventy-three-einval");
  assert.equal(classify(readData("runtime-2.1.247.json")), "runtime-regression");
  assert.equal(classify(readData("regression.json")), "runtime-regression");
  assert.equal(classify(readData("overnight-session-lost.json")), "overnight-session-lost");
  assert.equal(classify(readData("ensure-storage-dir.json")), "ensure-storage-dir");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("vanished seed is alarm; latched / hold are holds", () => {
  assert.equal(score(seedVanished()).alarm, true);
  assert.equal(score(seedVanished()).hold, false);
  assert.equal(score(seedLatched()).hold, true);
  assert.equal(score(seedLatched()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedEinvalOpen()).alarm, true);
  assert.equal(score(seedRuntimeRegression()).alarm, true);
});

test("normalize seeds 91433 without ticket fields", () => {
  const ticket = normalize({ issue: 91433 });
  assert.equal(ticket.einvalOpen, true);
  assert.equal(ticket.hardcodedX86Flags, true);
  assert.equal(ticket.sidebarVanish, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "vanished");
});

test("score / decide / handle agree on vanished vs latched", () => {
  assert.equal(score(seedVanished()).verdict, "vanished");
  assert.equal(decide(seedLatched()).verdict, "latched");
  const fail = handle(seedVanished());
  const hold = handle(seedLatched());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91433/);
  assert.match(fail.hookSpecificOutput.additionalContext, /EINVAL/);
  assert.match(hold.hookSpecificOutput.additionalContext, /latched/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("vanished").verdict, "vanished");
  assert.equal(decideSeed(91433).verdict, "vanished");
  assert.equal(decideSeed("91433").verdict, "vanished");
  assert.equal(decideSeed("latched").verdict, "latched");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("einval-open").verdict, "einval-open");
  assert.equal(decideSeed("odirect-poison").verdict, "odirect-poison");
  assert.equal(decideSeed("hardcoded-x86-flags").verdict, "hardcoded-x86-flags");
  assert.equal(decideSeed("runtime-regression").verdict, "runtime-regression");
});

test("CLI scores data files", () => {
  const vanished = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91433.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(vanished.status, 0, vanished.stderr);
  assert.equal(JSON.parse(vanished.stdout).verdict, "vanished");
  assert.equal(JSON.parse(vanished.stdout).alarm, true);

  const latched = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/latched.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(latched.status, 0, latched.stderr);
  assert.equal(JSON.parse(latched.stdout).verdict, "latched");
  assert.equal(JSON.parse(latched.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91433);
  assert.deepEqual([...PRIMARY_ISSUES], [91433]);
  assert.equal(COUSIN_ISSUE, 91409);
  assert.deepEqual([...COUSINS], [91409, 88747, 91400, 91392]);
  assert.deepEqual([...CROSS_ECOSYSTEM], []);
  assert.equal(FILED_AT, "2026-09-02T08:33:26Z");
  assert.equal(REPORTER, "usman1501");
  assert.equal(VERSION, "2.1.247");
  assert.equal(LAST_WORKING, "2.1.237");
  assert.equal(DESKTOP_VERSION, "1.40609.0");
  assert.equal(PLATFORM, "Linux ARM64");
  assert.equal(ARCH, "aarch64");
  assert.equal(ERRNO, -22);
  assert.equal(ERRNO_CODE, "EINVAL");
  assert.equal(O_DIRECTORY, "O_DIRECTORY");
  assert.equal(O_NOFOLLOW, "O_NOFOLLOW");
  assert.equal(O_DIRECT, "O_DIRECT");
  assert.equal(X86_O_DIRECTORY, "0o200000");
  assert.equal(X86_O_NOFOLLOW, "0o400000");
  assert.equal(EINVAL_LINES, 73);
  assert.equal(LAST_SUCCESS, "2026-09-01 08:26");
  assert.equal(FIRST_FAILURE, "2026-09-01 09:07");
  assert.equal(STORAGE_DIR, "claude-code-sessions");
  assert.equal(DESKTOP_SESSIONS, "~/.config/Claude/claude-code-sessions");
  assert.equal(LOCAL_JSON, "local_*.json");
  assert.equal(CLI_PROJECTS, "~/.claude/projects/");
  assert.equal(CLI_RESUME, "claude --resume");
  assert.equal(MKDIR_PRIVATE, "mkdirPrivate");
  assert.equal(ENSURE_STORAGE_DIR, "ensureStorageDir");
  assert.equal(WRITE_SESSION_TO_DISK, "writeSessionToDisk");
  assert.equal(OPEN_FLAGS, "O_RDONLY|O_DIRECTORY|O_NOFOLLOW");
  assert.equal(FILESYSTEM, "ext4");
  assert.equal(ASK_RUNTIME_CONSTANTS, "require('fs').constants");
  assert.equal(IDLE_WORD, "latched");
  assert.equal(SEEDED_WORD, "vanished");
  assert.notEqual(IDLE_WORD, "vanished");
  assert.match(TITLE, /Linux ARM64/);
  assert.match(TITLE, /EINVAL/);
  assert.match(ISSUE_URL, /91433/);
  assert.match(PHRASE, /rejects the overnight session/i);
  assert.match(PHRASE, /admit the relic never seated/);
  assert.match(HUB_LINE, /18:50 reliquary/);
  assert.match(HUB_LINE, /admit the relic never seated/);
  assert.match(MARK, /18:50/);
  assert.match(MARK, /#119/);
  assert.match(MARK, /#91433/);
  assert.match(CONTRAST_NOTE, /DESKTOP LINUX ARM64 SESSION REGISTRY SAVES FAIL WITH EINVAL/);
  assert.match(CONTRAST_NOTE, /O_DIRECTORY/);
  assert.match(CONTRAST_NOTE, /O_NOFOLLOW/);
  assert.match(CONTRAST_NOTE, /O_DIRECT/);
  assert.match(CONTRAST_NOTE, /0o200000/);
  assert.match(CONTRAST_NOTE, /aarch64/i);
  assert.match(CONTRAST_NOTE, /2\.1\.237/);
  assert.match(CONTRAST_NOTE, /2\.1\.247/);
  assert.match(CONTRAST_NOTE, /73 EINVAL/);
  assert.match(CONTRAST_NOTE, /claude --resume/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("caisson"));
  assert.ok(NOT_PRODUCTS.includes("spindle"));
  assert.ok(NOT_PRODUCTS.includes("knell"));
  assert.ok(NOT_PRODUCTS.includes("tumbler"));
  assert.ok(NOT_PRODUCTS.includes("escapement"));
  assert.ok(NOT_PRODUCTS.includes("berth"));
  assert.ok(NOT_PRODUCTS.includes("bollard"));
  assert.ok(NOT_PRODUCTS.includes("reveille"));
  assert.ok(NOT_PRODUCTS.includes("callboard"));
  assert.ok(BANNED_NAMES.includes("Annunciator"));
  assert.ok(BANNED_NAMES.includes("Caisson"));
  assert.ok(BANNED_NAMES.includes("Spindle"));
  assert.ok(BANNED_NAMES.includes("Knell"));
  assert.ok(BANNED_NAMES.includes("Tumbler"));
  assert.ok(BANNED_NAMES.includes("Berth"));
  assert.ok(BANNED_NAMES.includes("Bollard"));
  assert.ok(BANNED_NAMES.includes("Reveille"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:linux"));
  assert.ok(LABELS.includes("regression"));
  assert.ok(LABELS.includes("data-loss"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.ok(HOLD_VERDICTS.includes("latched"));
  assert.ok(ALARM_VERDICTS.includes("vanished"));
  assert.deepEqual([...CHIPS], [...VERDICTS]);
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "latched");
  assert.equal(chips.seededWord, "vanished");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91433);
  assert.equal(fp.cousin, 91409);
  assert.deepEqual(fp.cousins, [91409, 88747, 91400, 91392]);
  assert.equal(fp.reporter, "usman1501");
  assert.equal(fp.version, "2.1.247");
  assert.equal(fp.lastWorking, "2.1.237");
  assert.equal(fp.platform, "Linux ARM64");
  assert.equal(fp.arch, "aarch64");
  assert.equal(fp.errno, -22);
  assert.equal(fp.errnoCode, "EINVAL");
  assert.equal(fp.einvalLines, 73);
  assert.equal(fp.x86ODirectory, "0o200000");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "vanished");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.einvalOpen, true);
});

test("chipsOf on a raw EINVAL ticket still marks vanished", () => {
  const chips = chipsOf({
    einvalOpen: true,
    hardcodedX86Flags: true,
    odirectPoison: true,
    errno: -22,
    outputText:
      "vanished; #91433; EINVAL; O_DIRECTORY; O_DIRECT; 0o200000; aarch64; ensureStorageDir; writeSessionToDisk",
  });
  assert.ok(chips.includes("vanished"));
  assert.ok(chips.includes("einval-open"));
  assert.ok(chips.includes("odirect-poison"));
  assert.ok(!chips.includes("latched"));
});

test("cousin #91409 is not conflated with vanished primary", () => {
  assert.notEqual(classify(seedCousin()), "vanished");
  assert.notEqual(classify({ issue: 91409 }), "vanished");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /91409|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become vanished", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "vanished", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91433);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedEinvalOpen()).verdict, "einval-open");
  assert.equal(analyze(seedOdirectPoison()).verdict, "odirect-poison");
  assert.equal(analyze(seedHardcodedX86Flags()).verdict, "hardcoded-x86-flags");
  assert.equal(analyze(seedAarch64NativeOk()).verdict, "aarch64-native-ok");
  assert.equal(analyze(seedSidebarVanish()).verdict, "sidebar-vanish");
  assert.equal(analyze(seedCliResumeSurvives()).verdict, "cli-resume-survives");
  assert.equal(analyze(seedSeventyThreeEinval()).verdict, "seventy-three-einval");
  assert.equal(analyze(seedRuntimeRegression()).verdict, "runtime-regression");
  assert.equal(analyze(seedOvernightSessionLost()).verdict, "overnight-session-lost");
  assert.equal(analyze(seedEnsureStorageDir()).verdict, "ensure-storage-dir");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.vaultLatched, true);
  assert.equal(isVanished(seedLatched()), false);
  assert.equal(isVanished(seedVanished()), true);
});

test("living page is a Reliquary atelier, idle latched, seeded vanished", () => {
  const html = readPage();
  assert.match(html, /<title>Reliquary/);
  assert.match(html, /Idle word:\s*latched/);
  assert.match(html, /latched/);
  assert.match(html, /vanished/);
  assert.match(html, /einval-open/);
  assert.match(html, /odirect-poison/);
  assert.match(html, /hardcoded-x86-flags/);
  assert.match(html, /aarch64-native-ok/);
  assert.match(html, /sidebar-vanish/);
  assert.match(html, /cli-resume-survives/);
  assert.match(html, /seventy-three-einval/);
  assert.match(html, /runtime-regression/);
  assert.match(html, /overnight-session-lost/);
  assert.match(html, /ensure-storage-dir/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91433/);
  assert.match(html, /#91409/);
  assert.match(html, /#88747/);
  assert.match(html, /#91400/);
  assert.match(html, /#91392/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /18:50/);
  assert.match(html, /catalog #119/);
  assert.match(html, /EINVAL/);
  assert.match(html, /-22/);
  assert.match(html, /O_DIRECTORY/);
  assert.match(html, /O_NOFOLLOW/);
  assert.match(html, /O_DIRECT/);
  assert.match(html, /0o200000/);
  assert.match(html, /aarch64/);
  assert.match(html, /Linux ARM64/);
  assert.match(html, /ensureStorageDir/);
  assert.match(html, /writeSessionToDisk/);
  assert.match(html, /mkdirPrivate/);
  assert.match(html, /claude-code-sessions/);
  assert.match(html, /local_\*\.json|local_\*.json|local_\*\.json/);
  assert.match(html, /2\.1\.237/);
  assert.match(html, /2\.1\.247/);
  assert.match(html, /73/);
  assert.match(html, /claude --resume/);
  assert.match(html, /usman1501/);
  assert.match(html, /family=Crimson\+Pro|Crimson Pro/);
  assert.match(html, /family=Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.match(html, /family=Ubuntu\+Mono|Ubuntu Mono/);
  assert.match(html, /Latch the vault/);
  assert.match(html, /Pin idle latched/);
  assert.match(html, /Pin seeded vanished/);
  assert.match(html, /Admit the relic never seated/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to latched/);
  assert.match(html, /reliquary|relic case|vault-latch|vault latch/i);
  assert.match(html, /DESKTOP LINUX ARM64|hardcoded x86|O_DIRECT/i);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.match(html, /Stay OFF annunciator lamps/);
  assert.match(html, /caisson berth/);
  assert.match(html, /spindle chip-sweep/);
  assert.match(html, /knell mute-bell/);
  assert.match(html, /tumbler keyway/);
  assert.match(html, /escapement pallet/);
  assert.match(html, /carillon peal/);
  assert.match(html, /sluice millrace/);
  assert.match(html, /reveille muster/);
  assert.match(html, /callboard roster/);
  assert.match(html, /berth-card clone/);
  assert.match(html, /bollard clone/);
  assert.doesNotMatch(html, /Idle word:\s*vanished/i);
  assert.doesNotMatch(html, /Idle word:\s*sealed/i);
  assert.doesNotMatch(html, /Idle word:\s*dark/i);
  assert.doesNotMatch(html, /Idle word:\s*spurious/i);
  assert.doesNotMatch(html, /Idle word:\s*rebound/i);
  assert.doesNotMatch(html, /Pin idle vanished/);
  assert.doesNotMatch(html, /Pin idle sealed/);
  assert.doesNotMatch(html, /Pin idle dark/);
  assert.doesNotMatch(html, /Score the seal/);
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
  assert.doesNotMatch(html, /family=Chakra\+Petch|Chakra Petch/);
  assert.doesNotMatch(html, /family=Barlow|Barlow/);
  assert.doesNotMatch(html, /family=Share\+Tech\+Mono|Share Tech Mono/);
  assert.doesNotMatch(html, /family=Zilla\+Slab|Zilla Slab/);
  assert.doesNotMatch(html, /family=Epilogue|Epilogue/);
  assert.doesNotMatch(html, /family=Overpass\+Mono|Overpass Mono/);
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

test("README and page stay Reliquary, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Reliquary/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /DESKTOP LINUX ARM64 SESSION REGISTRY SAVES FAIL WITH EINVAL BECAUSE HARDCODED X86 O_DIRECTORY\|O_NOFOLLOW BITS MEAN O_DIRECT ON AARCH64/i,
  );
  assert.match(readme, /NOT \*\*Annunciator\*\*/);
  assert.match(readme, /NOT \*\*Caisson\*\*/);
  assert.match(readme, /NOT \*\*Spindle\*\*/);
  assert.match(readme, /NOT \*\*Knell\*\*/);
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /NOT \*\*Berth\*\*/);
  assert.match(readme, /NOT \*\*Bollard\*\*/);
  assert.match(readme, /Product name stays \*\*Reliquary\*\*/);
  assert.match(readme, /Idle word: \*\*latched\*\*/);
  assert.match(readme, /#91409/);
  assert.match(readme, /#88747/);
  assert.match(readme, /#91400/);
  assert.match(readme, /#91392/);
  assert.match(readme, /EINVAL/);
  assert.match(readme, /O_DIRECTORY/);
  assert.match(readme, /O_DIRECT/);
  assert.match(readme, /0o200000/);
  assert.match(readme, /aarch64/);
  assert.match(readme, /ensureStorageDir/);
  assert.match(readme, /73/);
  assert.match(readme, /2\.1\.247/);
  assert.match(readme, /usman1501/);
  assert.match(readme, /Linux ARM64/);
  assert.doesNotMatch(readme, /^# Annunciator/m);
  assert.doesNotMatch(readme, /^# Caisson/m);
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
  assert.doesNotMatch(readme, /^# Reveille/m);
  assert.doesNotMatch(readme, /^# Callboard/m);
});
