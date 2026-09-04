import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BANNED_NAMES,
  BREAK_VERSION,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  DESKTOP_VERSION,
  DIFFERENT_CLASS,
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
  PACKAGE_FAMILY,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  RUN_PATH,
  SEEDED_WORD,
  STARTUP_TASK,
  STARTUP_TASK_STATE,
  TITLE,
  TOGGLE_VERSION,
  UPDATED_AT,
  UPDATES_SINCE,
  USER_ENABLED_ONCE,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isLive,
  isOrphaned,
  normalize,
  orphanedPattern,
  score,
  seedBound,
  seedLive,
  seedOrphaned,
} from "./relict.mjs";

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
  return fileURLToPath(new URL("./relict.mjs", import.meta.url));
}

test("StartupTask enabled + path current → live", () => {
  const result = analyze({
    persistHold: true,
    live: true,
    orphaned: false,
    runKeyWritten: false,
    packageFolderExists: true,
    testPath: true,
    startupTaskDeclared: true,
    startupTaskState: 1,
    userEnabledStartupOnce: 1,
    silentFail: false,
    mechanism: "startup-task",
  });
  assert.equal(result.verdict, "live");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.orphaned, false);
  assert.equal(result.live, true);
  assert.equal(isLive(result.ticket), true);
  assert.equal(isOrphaned(result.ticket), false);
});

test("versioned Run key + missing folder + silent fail → orphaned", () => {
  const result = analyze({
    persistHold: false,
    live: false,
    orphaned: true,
    runKeyWritten: true,
    runKeyPath: RUN_PATH,
    runKeyVersion: TOGGLE_VERSION,
    currentPackageVersion: DESKTOP_VERSION,
    packageFolderExists: false,
    testPath: false,
    startupApproved: false,
    startupTaskState: 0,
    userEnabledStartupOnce: 0,
    silentFail: true,
    mechanism: "run-key",
  });
  assert.equal(result.verdict, "orphaned");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.orphaned, true);
  assert.equal(isOrphaned(result.ticket), true);
  assert.ok(result.chips.includes("orphaned"));
  assert.ok(result.chips.includes("versioned"));
  assert.ok(result.chips.includes("silent"));
  assert.ok(result.chips.includes("run-key"));
  assert.ok(result.chips.includes("missing-folder"));
  assert.ok(!result.chips.includes("live"));
});

test("outcrop-shaped payload without seed flags still scores orphaned", () => {
  const result = analyze({
    runKeyWritten: true,
    testPath: false,
    silentFail: true,
  });
  assert.equal(result.verdict, "orphaned");
  assert.equal(orphanedPattern(result.ticket), true);
});

test("idle live is a hold; the StartupTask stays current", () => {
  const result = analyze(seedLive());
  assert.equal(result.verdict, "live");
  assert.equal(result.idleWord, "live");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.orphaned, false);
  assert.ok(result.chips.includes("live"));
  assert.ok(result.chips.includes("bound"));
  assert.ok(!result.chips.includes("orphaned"));
  assert.equal(result.ticket.persistHold, true);
  assert.equal(result.ticket.startupTaskState, 1);
  assert.equal(result.ticket.testPath, true);
  assert.doesNotMatch(
    result.idleWord,
    /set|scrapped|pure|scorched|cold|voided|banked|rewritten|keyed|strayed|scrubbed|pulled|enacted|withheld|masked|bled/i,
  );
});

test("empty ticket and empty stdin classify live", () => {
  assert.equal(classify(emptyTicket()), "live");
  assert.equal(classify(""), "live");
  assert.equal(classify(null), "live");
  assert.equal(decideSeed("live").verdict, "live");
  assert.equal(decideSeed("open").verdict, "live");
});

test("seeded orphaned #92173 is alarm with outcrop chips", () => {
  const result = analyze(seedOrphaned());
  assert.equal(result.verdict, "orphaned");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("orphaned"));
  assert.ok(result.chips.includes("versioned"));
  assert.ok(result.chips.includes("silent"));
  assert.ok(result.chips.includes("demoted"));
  assert.ok(result.chips.includes("run-key"));
  assert.ok(result.chips.includes("missing-folder"));
  assert.ok(!result.chips.includes("live"));
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.desktopVersion, DESKTOP_VERSION);
  assert.equal(result.ticket.updatesSinceBreak, UPDATES_SINCE);
  assert.equal(result.ticket.startupTaskState, STARTUP_TASK_STATE);
  assert.equal(result.ticket.testPath, false);
});

test("data fixtures classify live / bound vs orphaned / named chips", () => {
  assert.equal(classify(readData("live.json")), "live");
  assert.equal(classify(readData("orphaned.json")), "orphaned");
  assert.equal(classify(readData("92173.json")), "orphaned");
  assert.equal(classify(readData("bound.json")), "bound");
  assert.equal(classify(readData("versioned.json")), "versioned");
  assert.equal(classify(readData("silent.json")), "silent");
  assert.equal(classify(readData("demoted.json")), "demoted");
  assert.equal(classify(readData("approved.json")), "approved");
  assert.equal(classify(readData("startup-task.json")), "startup-task");
  assert.equal(classify(readData("run-key.json")), "run-key");
  assert.equal(classify(readData("missing-folder.json")), "missing-folder");
});

test("orphaned seed is alarm; live / bound are holds", () => {
  assert.equal(score(seedOrphaned()).alarm, true);
  assert.equal(score(seedOrphaned()).hold, false);
  assert.equal(score(seedLive()).hold, true);
  assert.equal(score(seedLive()).alarm, false);
  assert.equal(score(seedBound()).hold, true);
});

test("normalize seeds 92173 without ticket fields", () => {
  const ticket = normalize({ issue: 92173 });
  assert.equal(ticket.orphaned, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "orphaned");
});

test("score / decide / handle agree on orphaned vs live", () => {
  assert.equal(score(seedOrphaned()).verdict, "orphaned");
  assert.equal(decide(seedLive()).verdict, "live");
  const fail = handle(seedOrphaned());
  const hold = handle(seedLive());
  const working = handle(seedBound());
  assert.match(fail.hookSpecificOutput.additionalContext, /#92173/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /HKCU|Run|missing|silent/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /live/i);
  assert.match(working.hookSpecificOutput.additionalContext, /bound/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("orphaned").verdict, "orphaned");
  assert.equal(decideSeed(92173).verdict, "orphaned");
  assert.equal(decideSeed("92173").verdict, "orphaned");
  assert.equal(decideSeed("live").verdict, "live");
  assert.equal(decideSeed("bound").verdict, "bound");
  assert.equal(decideSeed("versioned").verdict, "versioned");
  assert.equal(decideSeed("silent").verdict, "silent");
  assert.equal(decideSeed("demoted").verdict, "demoted");
  assert.equal(decideSeed("approved").verdict, "approved");
  assert.equal(decideSeed("startup-task").verdict, "startup-task");
  assert.equal(decideSeed("run-key").verdict, "run-key");
  assert.equal(decideSeed("missing-folder").verdict, "missing-folder");
});

test("CLI scores fixture strings and data files", () => {
  const orphaned = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/92173.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(orphaned.status, 0, orphaned.stderr);
  assert.equal(JSON.parse(orphaned.stdout).verdict, "orphaned");
  assert.equal(JSON.parse(orphaned.stdout).alarm, true);

  const live = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/live.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(live.status, 0, live.stderr);
  assert.equal(JSON.parse(live.stdout).verdict, "live");
  assert.equal(JSON.parse(live.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input: '{"runKeyWritten":true,"testPath":false,"silentFail":true}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "orphaned");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 92173);
  assert.deepEqual([...PRIMARY_ISSUES], [92173]);
  assert.equal(COUSIN_ISSUE, 92167);
  assert.deepEqual([...COUSINS], [92167, 89912, 91482, 85689]);
  assert.deepEqual([...DIFFERENT_CLASS], [91750]);
  assert.equal(FILED_AT, "2026-09-04T17:51:50Z");
  assert.equal(UPDATED_AT, "2026-09-04T17:52:47Z");
  assert.equal(REPORTER, "iamsteamboat");
  assert.equal(PLATFORM, "Windows 11 Home 10.0.26200");
  assert.equal(DESKTOP_VERSION, "1.46388.1.0");
  assert.equal(PACKAGE_FAMILY, "Claude_pzs8sxrjxfjjc");
  assert.equal(TOGGLE_VERSION, "1.24012.11.0");
  assert.equal(BREAK_VERSION, "1.25927.0.0");
  assert.equal(UPDATES_SINCE, 9);
  assert.equal(STARTUP_TASK, "ClaudeStartup");
  assert.equal(STARTUP_TASK_STATE, 0);
  assert.equal(USER_ENABLED_ONCE, 0);
  assert.equal(IDLE_WORD, "live");
  assert.equal(SEEDED_WORD, "orphaned");
  assert.notEqual(IDLE_WORD, "orphaned");
  assert.notEqual(IDLE_WORD, "set");
  assert.notEqual(IDLE_WORD, "scrapped");
  assert.match(TITLE, /launch at startup/);
  assert.match(TITLE, /WindowsApps/);
  assert.match(TITLE, /HKCU/);
  assert.match(ISSUE_URL, /92173/);
  assert.match(PHRASE, /Score the relict/);
  assert.match(PHRASE, /admit the path already orphaned/);
  assert.match(HUB_LINE, /04:50 relict/);
  assert.match(HUB_LINE, /a relict that keeps a versioned WindowsApps Run path/);
  assert.match(MARK, /04:50/);
  assert.match(MARK, /#141/);
  assert.match(MARK, /#92173/);
  assert.match(CONTRAST_NOTE, /1\.46388\.1\.0/);
  assert.match(CONTRAST_NOTE, /iamsteamboat/);
  assert.match(CONTRAST_NOTE, /nine updates/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /StartupTask/);
  assert.ok(LABELS.includes("invalid"));
  assert.ok(NOT_PRODUCTS.includes("hellbox"));
  assert.ok(NOT_PRODUCTS.includes("cupel"));
  assert.ok(NOT_PRODUCTS.includes("reliquary"));
  assert.ok(BANNED_NAMES.includes("Hellbox"));
  assert.ok(BANNED_NAMES.includes("Cupel"));
  assert.ok(BANNED_NAMES.includes("Reliquary"));
  assert.ok(FORBIDDEN_IDLE.includes("set"));
  assert.ok(FORBIDDEN_IDLE.includes("scrapped"));
  assert.deepEqual([...HOLD_VERDICTS], ["live", "bound"]);
  assert.ok(CHIPS.includes("live"));
  assert.ok(CHIPS.includes("orphaned"));
  assert.ok(CHIPS.includes("versioned"));
  assert.ok(CHIPS.includes("silent"));
  assert.ok(VERDICTS.includes("run-key"));
  assert.ok(VERDICTS.includes("startup-task"));
  assert.ok(VERDICTS.includes("missing-folder"));
  assert.match(RUN_PATH, /1\.24012\.11\.0/);
});

test("page is a glacial-relict fossil-outcrop desk, not a leftover clone", () => {
  const page = readPage();
  assert.match(page, /Spectral/);
  assert.match(page, /Manrope/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /04:50 \/ hermes catalog #141 \/ #92173/);
  assert.match(page, /Score the relict/);
  assert.match(page, /Pin idle live/);
  assert.match(page, /Pin seeded orphaned/);
  assert.match(page, /admit the path already orphaned/i);
  assert.match(page, /embed/);
  assert.match(page, /relict|outcrop|fossil|calcite|amber|oxide|slate/i);
  assert.match(page, /href="\/"/);
  assert.doesNotMatch(page, /trapdoor|stone-pit|voided|moonbeam|hatch/);
  assert.doesNotMatch(page, /bone-ash|fineness|bullion|slag charcoal/);
  assert.doesNotMatch(page, /composing stick|hellbox|vermilion scrap|standing line/);
  assert.doesNotMatch(page, /Fraunces|DM Sans|IBM Plex Mono/);
  assert.doesNotMatch(page, /Newsreader|Figtree|Source Code Pro/);
  assert.doesNotMatch(page, /Eczar|Schibsted Grotesk|Martian Mono/);
  assert.doesNotMatch(page, /Bodoni Moda|Outfit/);
  assert.doesNotMatch(
    page,
    /Score the form|Score the cupel|Score the trapdoor|Score the wick|Score the drum|Score the gelatin|Score the chamber|Score the mask/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Relict thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /#92173/);
  assert.match(readme, /live/);
  assert.match(readme, /orphaned/);
  assert.match(readme, /iamsteamboat/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Hellbox/);
  assert.match(readme, /NOT Cupel/);
  assert.match(readme, /NOT Reliquary/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /catalog #141/);
  assert.match(readme, /Score the relict/);
  assert.doesNotMatch(readme, /Idle word: \*\*set\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*pure\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*scrapped\*\*/);
  assert.doesNotMatch(readme, /letterpress composing/);
  assert.doesNotMatch(readme, /bone-ash assay/);
  assert.doesNotMatch(readme, /trapdoor dungeon/);
});

test("cousin isolation stays live / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "live");
  assert.equal(decideSeed(92167).verdict, "live");
  assert.equal(classify({ issue: 92167 }), "live");
  assert.equal(classify({ issue: 89912 }), "live");
  assert.equal(classify({ issue: 91482 }), "live");
  assert.equal(classify({ issue: 85689 }), "live");
  assert.equal(classify({ issue: 91750 }), "live");
  const cousins = readData("cousins.json");
  assert.equal(cousins.primary, 92173);
  assert.deepEqual(
    cousins.rows.map((row) => row.issue),
    [92167, 89912, 91482, 85689, 91750],
  );
});

test("banned idle words never appear as the idle word", () => {
  assert.ok(!FORBIDDEN_IDLE.includes(IDLE_WORD));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("no real credentials or exploit payloads in fixtures or page", () => {
  const files = [
    "92173.json",
    "live.json",
    "orphaned.json",
    "versioned.json",
    "silent.json",
    "demoted.json",
    "approved.json",
    "startup-task.json",
    "run-key.json",
    "missing-folder.json",
    "bound.json",
    "chips.json",
    "cousins.json",
    "fixtures.json",
  ];
  for (const name of files) {
    const raw = readFileSync(
      fileURLToPath(new URL(`../data/${name}`, import.meta.url)),
      "utf8",
    );
    assert.doesNotMatch(raw, /sk-ant-|ort01-|oat01-/);
    assert.doesNotMatch(raw, /rm -rf|curl .*\| *sh|BEGIN (RSA|OPENSSH) PRIVATE KEY/);
  }
  const page = readPage();
  assert.doesNotMatch(page, /sk-ant-|ort01-|oat01-/);
});
