import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ARCH,
  CHIPS,
  CLAIM_WALK,
  COUSINS,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NODE_VERSION,
  NOT_PRODUCTS,
  OS_NAME,
  PARENT_CPU_PCT,
  PATH_WORD,
  REPORTER,
  RG_ERROR_PHRASE,
  RG_EXIT_CODE,
  SEEDED_WORD,
  SHELL_NAME,
  TCC_TRACTS,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreClaim,
  scoreWalk,
  seedDeeded,
  seedHomesteaded,
  seedStaked,
  tccBlock,
  tccLine,
} from "./homestead.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function modelPath() {
  return fileURLToPath(new URL("./homestead.mjs", import.meta.url));
}

test("idle deeded is a hold; bounded project scan still answers", () => {
  const result = analyze(seedDeeded());
  assert.equal(result.verdict, "deeded");
  assert.equal(result.idleWord, "deeded");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.deeded, true);
  assert.equal(result.phrase, "admit deeded");
  assert.equal(result.parentResponds, true);
  assert.equal(result.scanBounded, true);
  assert.equal(result.hasGitRoot, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify deeded", () => {
  assert.equal(classify(emptyTicket()), "deeded");
  assert.equal(classify(""), "deeded");
  assert.equal(classify(null), "deeded");
  assert.equal(decide({}), "deeded");
});

test("#92932 path scores homesteaded from the unscoped HOME walk", () => {
  const result = analyze(seedHomesteaded());
  assert.equal(result.verdict, "homesteaded");
  assert.equal(result.pathWord, "homesteaded");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.homesteaded, true);
  assert.equal(result.phrase, "score homesteaded");
  assert.equal(result.cwdIsHome, true);
  assert.equal(result.hasGitRoot, false);
  assert.equal(result.unscopedHome, true);
  assert.equal(result.rgExited, true);
  assert.equal(result.parentResponds, false);
  assert.equal(result.parentBlocked, true);
  assert.equal(result.parentCpuPct, PARENT_CPU_PCT);
  assert.equal(result.lastDebugIsRgError, true);
  assert.ok(result.tccCount >= 8);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.pathWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("fixture toggle flips deeded vs homesteaded", () => {
  const deeded = scoreClaim(readData("deeded.json"));
  const homesteaded = scoreClaim(readData("homesteaded.json"));
  assert.equal(deeded.verdict, "deeded");
  assert.equal(homesteaded.verdict, "homesteaded");
  assert.notEqual(deeded.verdict, homesteaded.verdict);
  assert.equal(score(readData("deeded.json")), "deeded");
  assert.equal(score(readData("homesteaded.json")), "homesteaded");
  assert.equal(score(readData("92932.json")), "homesteaded");
});

test("staked is the bounded claim after permission-denied stderr", () => {
  const result = scoreClaim(readData("staked.json"));
  assert.equal(result.verdict, "staked");
  assert.equal(result.seededWord, "staked");
  assert.equal(result.hold, false);
  assert.equal(result.recover, true);
  assert.equal(result.parentResponds, true);
  assert.equal(result.permissionDeniedHandled, true);
  assert.equal(result.scanBounded, true);
  assert.equal(analyze(seedStaked()).verdict, "staked");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("unscoped-home.json")), "unscoped-home");
  assert.equal(classify(readData("tcc-wall.json")), "tcc-wall");
  assert.equal(classify(readData("rg-exited.json")), "rg-exited");
  assert.equal(classify(readData("parent-idle.json")), "parent-idle");
  assert.equal(classify(readData("safe-mode-ok.json")), "safe-mode-ok");
  assert.equal(classify(readData("bare-ok.json")), "bare-ok");
  assert.equal(classify(readData("mcp-ruled-out.json")), "mcp-ruled-out");
  assert.equal(classify(readData("git-root-ok.json")), "git-root-ok");
  assert.equal(classify(readData("last-debug-line.json")), "last-debug-line");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("before-after.json")), "before-after");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("published claim walk scores homesteaded at rg-exit and hang", () => {
  const night = scoreWalk(readData("walk.json"));
  assert.equal(night.verdict, "homesteaded");
  assert.ok(night.homesteadedCount >= 1);
  const hang = night.rows.find((row) => row.event === "parent-idle");
  assert.equal(hang.verdict, "homesteaded");
  assert.equal(hang.parentCpuPct, PARENT_CPU_PCT);
  const exit = night.rows.find((row) => row.event === "rg-exited");
  assert.equal(exit.verdict, "homesteaded");
  assert.equal(exit.rgExited, true);
});

test("CLAIM_WALK constant matches the issue clocks", () => {
  assert.equal(CLAIM_WALK[0].event, "cwd");
  assert.equal(CLAIM_WALK[0].cwdIsHome, true);
  assert.equal(CLAIM_WALK[0].hasGitRoot, false);
  const hang = CLAIM_WALK.find((row) => row.event === "parent-idle");
  assert.equal(hang.parentResponds, false);
  assert.equal(hang.rgExited, true);
  assert.equal(hang.parentCpuPct, 0.1);
  assert.ok(hang.tccDenied.includes(".Trash"));
  assert.ok(hang.tccDenied.includes("Library/Mail"));
  assert.ok(hang.tccDenied.includes("Library/HomeKit"));
  const exit = CLAIM_WALK.find((row) => row.event === "rg-exited");
  assert.equal(exit.lastDebugIsRgError, true);
  assert.equal(exit.rgStillRunning, false);
});

test("TCC block reprints the published permission-denied shape", () => {
  const block = tccBlock();
  assert.match(block, /code=2/);
  assert.match(block, /Operation not permitted \(os error 1\)/);
  assert.match(block, /\.Trash/);
  assert.match(block, /Photos Library\.photoslibrary/);
  assert.match(block, /Library\/Messages/);
  assert.equal(tccLine(".Trash"), `rg: /Users/<user>/.Trash: ${RG_ERROR_PHRASE}`);
  assert.equal(TCC_TRACTS.length, 12);
  assert.equal(RG_EXIT_CODE, 2);
});

test("bounding the scan flips homesteaded to deeded", () => {
  const tape = {
    cwdIsHome: true,
    hasGitRoot: false,
    scanScope: "unscoped-home",
    scanBounded: false,
    tccDenied: [".Trash", "Library/Mail"],
    rgExited: true,
    parentResponds: false,
    parentBlocked: true,
    parentCpuPct: 0.1,
    permissionDeniedHandled: false,
  };
  assert.equal(scoreClaim(tape).verdict, "homesteaded");
  tape.scanScope = "cwd";
  tape.scanBounded = true;
  tape.parentResponds = true;
  tape.parentBlocked = false;
  tape.permissionDeniedHandled = true;
  assert.equal(scoreClaim(tape).verdict, "staked");
  tape.tccDenied = [];
  tape.cwdIsHome = false;
  tape.hasGitRoot = true;
  tape.scanScope = "project";
  assert.equal(scoreClaim(tape).verdict, "deeded");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [92784, 92908, 92036, 91881],
  );
  assert.equal(COUSINS.length, 4);
  assert.ok(NOT_PRODUCTS.includes("epitaph"));
  assert.ok(NOT_PRODUCTS.includes("cadastre"));
  assert.ok(NOT_PRODUCTS.includes("rushlight"));
  assert.ok(NOT_PRODUCTS.includes("recension"));
  assert.ok(NOT_PRODUCTS.includes("quill"));
  assert.equal(classify(cousins), "cousins");
});

test("issue metadata matches #92932", () => {
  assert.equal(FEATURED_ISSUE, 92932);
  assert.ok(ISSUE_URL.includes("92932"));
  assert.ok(/HOME with no git repo/i.test(TITLE));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(HOLD.includes("deeded"));
  assert.ok(ALARM.includes("homesteaded"));
  assert.ok(CHIPS.includes("staked"));
  assert.ok(VERDICTS.includes("unscoped-home"));
  assert.ok(VERDICTS.includes("tcc-wall"));
  assert.ok(VERDICTS.includes("rg-exited"));
  assert.ok(VERDICTS.includes("parent-idle"));
  assert.ok(VERDICTS.includes("mcp-ruled-out"));
  assert.ok(VERDICTS.includes("git-root-ok"));
  assert.ok(VERDICTS.includes("last-debug-line"));
  assert.equal(VERSION, "2.1.263");
  assert.equal(OS_NAME, "macOS 26.6.2 (Build 25G83)");
  assert.equal(NODE_VERSION, "v26.5.0");
  assert.equal(SHELL_NAME, "zsh");
  assert.equal(ARCH, "Apple Silicon Darwin");
  assert.equal(REPORTER, "mcorbett51090");
  assert.equal(FILED_AT, "2026-09-08T20:44:54Z");
});

test("CLI scores fixtures without a server", () => {
  const deeded = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/deeded.json", import.meta.url))], { encoding: "utf8" });
  const homesteaded = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/homesteaded.json", import.meta.url))], { encoding: "utf8" });
  assert.equal(deeded.status, 0, deeded.stderr);
  assert.equal(homesteaded.status, 0, homesteaded.stderr);
  assert.equal(JSON.parse(deeded.stdout).verdict, "deeded");
  assert.equal(JSON.parse(homesteaded.stdout).verdict, "homesteaded");
});

test("handle exposes published hypothesis and HOME-cwd headline", () => {
  const result = handle(readData("92932.json"));
  assert.equal(result.published.issue, 92932);
  assert.equal(result.published.parentCpuPct, 0.1);
  assert.equal(result.published.rgExitCode, 2);
  assert.ok(result.published.tccTracts.includes(".Trash"));
  assert.equal(result.published.mcpRuledOut, true);
  assert.match(result.published.hypothesis, /falls back to \$HOME/);
  assert.match(fingerprint(seedHomesteaded()), /homesteaded\|cwd=HOME\|git=no\|scope=HOME\|parent=hangs/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a prairie land-office claim desk, not cadastre baize or rushlight sconce", () => {
  const page = readPage();
  assert.match(page, /Playfair Display/);
  assert.match(page, /Figtree/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.match(page, /Fira Code/);
  assert.match(page, /prairie|land-office|homestead-claim|deed paper|survey stake|metes/i);
  assert.match(page, /score homesteaded or admit deeded/i);
  assert.match(page, /staked/);
  assert.doesNotMatch(page, /Old Standard TT|Work Sans|Ubuntu Mono/);
  assert.doesNotMatch(page, /Literata|Public Sans|JetBrains Mono/);
  assert.doesNotMatch(page, /Newsreader|Lexend|Fragment Mono/);
  assert.doesNotMatch(page, /green-baize|green baize|theodolite/);
  assert.doesNotMatch(page, /iron sconce|rush-pith|rushlight/i);
  assert.doesNotMatch(page, /stonecutter|memorial masonry|epitaph tablet/);
  assert.doesNotMatch(page, /\bparked\b/);
  assert.doesNotMatch(page, /\bepitaphed\b/);
  assert.doesNotMatch(page, /\binscribed\b/);
  assert.doesNotMatch(page, /\bcollated\b/);
  assert.doesNotMatch(page, /\bstereotyped\b/);
  assert.doesNotMatch(page, /\benrolled\b/);
  assert.doesNotMatch(page, /\bescheated\b/);
  assert.doesNotMatch(page, /\bsnuffed\b/);
  assert.doesNotMatch(page, /\btenured\b/);
  assert.match(page, /#92932/);
  assert.match(page, /10:50/);
});
