import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  APP_VERSION,
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  DIFFERENT_CLASS,
  ERASED_COUNT,
  EXIT_CODE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HOOK_EVENT,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  NODE_VERSION,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  PYTHON_VERSION,
  REPORTER,
  SEEDED_WORD,
  TITLE,
  UPDATED_AT,
  VERDICTS,
  WINDOW_SECONDS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isScrapped,
  isSet,
  normalize,
  score,
  seedHold,
  seedSet,
  seedScrapped,
  scrappedPattern,
} from "./hellbox.mjs";

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
  return fileURLToPath(new URL("./hellbox.mjs", import.meta.url));
}

test("repointed CLAUDE_PROJECT_DIR + prompt reaches model → set", () => {
  const result = analyze({
    persistHold: true,
    set: true,
    scrapped: false,
    changeDirectory: true,
    projectDirRepointed: true,
    claudeProjectDir: "/adopted/project",
    launchDir: "/scratch/launch-workspace",
    adoptedDir: "/adopted/project",
    enoent: false,
    exitCode: 0,
    promptErased: false,
    promptReachedModel: true,
  });
  assert.equal(result.verdict, "set");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.scrapped, false);
  assert.equal(result.set, true);
  assert.equal(isSet(result.ticket), true);
  assert.equal(isScrapped(result.ticket), false);
});

test("sticky launch dir + ENOENT + exit 2 deny → scrapped", () => {
  const result = analyze({
    persistHold: false,
    set: false,
    scrapped: true,
    changeDirectory: true,
    projectDirRepointed: false,
    claudeProjectDir: "/scratch/launch-workspace",
    launchDir: "/scratch/launch-workspace",
    adoptedDir: "/adopted/project",
    enoent: true,
    exitCode: 2,
    treatExit2AsDeny: true,
    promptErased: true,
    promptReachedModel: false,
  });
  assert.equal(result.verdict, "scrapped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.scrapped, true);
  assert.equal(isScrapped(result.ticket), true);
  assert.ok(result.chips.includes("scrapped"));
  assert.ok(result.chips.includes("sticky"));
  assert.ok(result.chips.includes("enoent"));
  assert.ok(result.chips.includes("exit2"));
  assert.ok(result.chips.includes("erase"));
  assert.ok(!result.chips.includes("set"));
});

test("form-shaped payload without seed flags still scores scrapped", () => {
  const result = analyze({
    enoent: true,
    exitCode: 2,
    treatExit2AsDeny: true,
  });
  assert.equal(result.verdict, "scrapped");
  assert.equal(scrappedPattern(result.ticket), true);
});

test("idle set is a hold; the standing line stays in the form", () => {
  const result = analyze(seedSet());
  assert.equal(result.verdict, "set");
  assert.equal(result.idleWord, "set");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.scrapped, false);
  assert.ok(result.chips.includes("set"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("scrapped"));
  assert.equal(result.ticket.persistHold, true);
  assert.equal(result.ticket.projectDirRepointed, true);
  assert.equal(result.ticket.promptReachedModel, true);
  assert.doesNotMatch(
    result.idleWord,
    /pure|scorched|cold|voided|banked|rewritten|keyed|strayed|scrubbed|pulled|enacted|withheld|masked|bled/i,
  );
});

test("empty ticket and empty stdin classify set", () => {
  assert.equal(classify(emptyTicket()), "set");
  assert.equal(classify(""), "set");
  assert.equal(classify(null), "set");
  assert.equal(decideSeed("set").verdict, "set");
  assert.equal(decideSeed("open").verdict, "set");
});

test("seeded scrapped #92168 is alarm with composing chips", () => {
  const result = analyze(seedScrapped());
  assert.equal(result.verdict, "scrapped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("scrapped"));
  assert.ok(result.chips.includes("sticky"));
  assert.ok(result.chips.includes("enoent"));
  assert.ok(result.chips.includes("exit2"));
  assert.ok(result.chips.includes("erase"));
  assert.ok(result.chips.includes("launch-pin"));
  assert.ok(!result.chips.includes("set"));
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.appVersion, APP_VERSION);
  assert.equal(result.ticket.consecutiveErased, ERASED_COUNT);
  assert.equal(result.ticket.windowSeconds, WINDOW_SECONDS);
  assert.equal(result.ticket.exitCode, EXIT_CODE);
});

test("data fixtures classify set / hold vs scrapped / named chips", () => {
  assert.equal(classify(readData("set.json")), "set");
  assert.equal(classify(readData("scrapped.json")), "scrapped");
  assert.equal(classify(readData("92168.json")), "scrapped");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("sticky.json")), "sticky");
  assert.equal(classify(readData("enoent.json")), "enoent");
  assert.equal(classify(readData("exit2.json")), "exit2");
  assert.equal(classify(readData("erase.json")), "erase");
  assert.equal(classify(readData("launch-pin.json")), "launch-pin");
});

test("scrapped seed is alarm; set / hold are holds", () => {
  assert.equal(score(seedScrapped()).alarm, true);
  assert.equal(score(seedScrapped()).hold, false);
  assert.equal(score(seedSet()).hold, true);
  assert.equal(score(seedSet()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
});

test("normalize seeds 92168 without ticket fields", () => {
  const ticket = normalize({ issue: 92168 });
  assert.equal(ticket.scrapped, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "scrapped");
});

test("score / decide / handle agree on scrapped vs set", () => {
  assert.equal(score(seedScrapped()).verdict, "scrapped");
  assert.equal(decide(seedSet()).verdict, "set");
  const fail = handle(seedScrapped());
  const hold = handle(seedSet());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#92168/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /CLAUDE_PROJECT_DIR|ENOENT|exit 2/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /set/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("scrapped").verdict, "scrapped");
  assert.equal(decideSeed(92168).verdict, "scrapped");
  assert.equal(decideSeed("92168").verdict, "scrapped");
  assert.equal(decideSeed("set").verdict, "set");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("sticky").verdict, "sticky");
  assert.equal(decideSeed("enoent").verdict, "enoent");
  assert.equal(decideSeed("exit2").verdict, "exit2");
  assert.equal(decideSeed("erase").verdict, "erase");
  assert.equal(decideSeed("launch-pin").verdict, "launch-pin");
});

test("CLI scores fixture strings and data files", () => {
  const scrapped = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/92168.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(scrapped.status, 0, scrapped.stderr);
  assert.equal(JSON.parse(scrapped.stdout).verdict, "scrapped");
  assert.equal(JSON.parse(scrapped.stdout).alarm, true);

  const set = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/set.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(set.status, 0, set.stderr);
  assert.equal(JSON.parse(set.stdout).verdict, "set");
  assert.equal(JSON.parse(set.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input: '{"enoent":true,"exitCode":2,"treatExit2AsDeny":true}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "scrapped");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 92168);
  assert.deepEqual([...PRIMARY_ISSUES], [92168]);
  assert.equal(COUSIN_ISSUE, 88830);
  assert.deepEqual([...COUSINS], [88830, 81291, 87890]);
  assert.deepEqual([...DIFFERENT_CLASS], [92074]);
  assert.equal(FILED_AT, "2026-09-04T17:30:41Z");
  assert.equal(UPDATED_AT, "2026-09-04T17:32:10Z");
  assert.equal(REPORTER, "Rasherb69");
  assert.equal(PLATFORM, "macOS 26.5.2 arm64");
  assert.equal(APP_VERSION, "2.1.204");
  assert.equal(NODE_VERSION, "v24.15.0");
  assert.equal(PYTHON_VERSION, "3.14.5");
  assert.equal(HOOK_EVENT, "UserPromptSubmit");
  assert.equal(ERASED_COUNT, 4);
  assert.equal(WINDOW_SECONDS, 33);
  assert.equal(EXIT_CODE, 2);
  assert.equal(IDLE_WORD, "set");
  assert.equal(SEEDED_WORD, "scrapped");
  assert.notEqual(IDLE_WORD, "scrapped");
  assert.notEqual(IDLE_WORD, "pure");
  assert.notEqual(IDLE_WORD, "scorched");
  assert.match(TITLE, /change_directory/);
  assert.match(TITLE, /CLAUDE_PROJECT_DIR/);
  assert.match(TITLE, /ENOENT/);
  assert.match(ISSUE_URL, /92168/);
  assert.match(PHRASE, /Score the form/);
  assert.match(PHRASE, /admit the line already scrapped/);
  assert.match(HUB_LINE, /03:50 hellbox/);
  assert.match(HUB_LINE, /a hellbox that melts the standing line/);
  assert.match(MARK, /03:50/);
  assert.match(MARK, /#140/);
  assert.match(MARK, /#92168/);
  assert.match(CONTRAST_NOTE, /2\.1\.204/);
  assert.match(CONTRAST_NOTE, /Rasherb69/);
  assert.match(CONTRAST_NOTE, /four consecutive/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /CLAUDE_PROJECT_DIR/);
  assert.ok(LABELS.includes("area:hooks"));
  assert.ok(LABELS.includes("data-loss"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has-repro"));
  assert.ok(NOT_PRODUCTS.includes("cupel"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(BANNED_NAMES.includes("Cupel"));
  assert.ok(BANNED_NAMES.includes("Oubliette"));
  assert.ok(BANNED_NAMES.includes("Heddle"));
  assert.ok(FORBIDDEN_IDLE.includes("pure"));
  assert.ok(FORBIDDEN_IDLE.includes("scorched"));
  assert.deepEqual([...HOLD_VERDICTS], ["set", "hold"]);
  assert.ok(CHIPS.includes("set"));
  assert.ok(CHIPS.includes("scrapped"));
  assert.ok(CHIPS.includes("sticky"));
  assert.ok(CHIPS.includes("enoent"));
  assert.ok(VERDICTS.includes("exit2"));
  assert.ok(VERDICTS.includes("erase"));
  assert.ok(VERDICTS.includes("launch-pin"));
});

test("page is a letterpress composing room, not a leftover clone", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /DM Sans/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /03:50 \/ hermes catalog #140 \/ #92168/);
  assert.match(page, /Score the form/);
  assert.match(page, /Pin idle set/);
  assert.match(page, /Pin seeded scrapped/);
  assert.match(page, /admit the line already scrapped/i);
  assert.match(page, /embed/);
  assert.match(page, /hellbox|standing line|composing|lead type|vermilion/i);
  assert.match(page, /href="\/"/);
  assert.doesNotMatch(page, /trapdoor|stone-pit|voided|moonbeam|hatch/);
  assert.doesNotMatch(page, /bone-ash|fineness|bullion|slag charcoal/);
  assert.doesNotMatch(page, /Newsreader|Figtree|Source Code Pro/);
  assert.doesNotMatch(page, /Eczar|Schibsted Grotesk|Martian Mono/);
  assert.doesNotMatch(page, /Source Serif 4|Libre Franklin|JetBrains Mono/);
  assert.doesNotMatch(page, /Literata|Manrope|Cormorant|Bodoni|Outfit/);
  assert.doesNotMatch(
    page,
    /Score the cupel|Score the trapdoor|Score the wick|Score the drum|Score the gelatin|Score the chamber|Score the mask/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Hellbox thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /#92168/);
  assert.match(readme, /set/);
  assert.match(readme, /scrapped/);
  assert.match(readme, /Rasherb69/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Cupel/);
  assert.match(readme, /NOT Oubliette/);
  assert.match(readme, /NOT Ephemera/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /catalog #140/);
  assert.match(readme, /Score the form/);
  assert.doesNotMatch(readme, /Idle word: \*\*pure\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*cold\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*scorched\*\*/);
  assert.doesNotMatch(readme, /bone-ash assay/);
  assert.doesNotMatch(readme, /trapdoor dungeon/);
  assert.doesNotMatch(readme, /five-minute wick/);
});

test("cousin isolation stays set / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "set");
  assert.equal(decideSeed(88830).verdict, "set");
  assert.equal(classify({ issue: 88830 }), "set");
  assert.equal(classify({ issue: 81291 }), "set");
  assert.equal(classify({ issue: 87890 }), "set");
  assert.equal(classify({ issue: 92074 }), "set");
  const cousins = readData("cousins.json");
  assert.equal(cousins.primary, 92168);
  assert.deepEqual(
    cousins.rows.map((row) => row.issue),
    [88830, 81291, 87890, 92074],
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
    "92168.json",
    "set.json",
    "scrapped.json",
    "sticky.json",
    "enoent.json",
    "exit2.json",
    "erase.json",
    "launch-pin.json",
    "hold.json",
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
