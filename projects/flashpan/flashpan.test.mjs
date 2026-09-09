import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BIRTH_STAT,
  CHIPS,
  CLUSTER_MS,
  CLUSTER_SPAN_S,
  COUSINS,
  DAILY_BIRTHS_BASELINE_MAX,
  DAILY_BIRTHS_BASELINE_MIN,
  FEATURED_ISSUE,
  FILED_AT,
  FIRST_OBSERVED,
  FLASH_WALK,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PRODUCT,
  REPORTER,
  RESTART_WINDOW_BIRTHS,
  RESTART_WINDOW_MINUTES,
  SEEDED_WORD,
  SESSION_PATH,
  STAMP_CLUSTER,
  STATE,
  STILL_OCCURRING,
  TASKS_STOPPED,
  TITLE,
  VERDICTS,
  ZERO_BIRTH_DATES,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedFlashpanned,
  seedFlashed,
  seedPrimed,
} from "./flashpan.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
}

function readCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../catalog.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./flashpan.mjs", import.meta.url));
}

test("idle primed is a hold; lastRunAt advances only with a session birth", () => {
  const result = analyze(seedPrimed());
  assert.equal(result.verdict, "primed");
  assert.equal(result.idleWord, "primed");
  assert.equal(IDLE_WORD, "primed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.primed, true);
  assert.equal(result.phrase, "admit primed");
  assert.equal(result.lastRunAtHonest, true);
  assert.equal(result.sessionBorn, true);
  assert.equal(result.failedRunSurfaced, true);
  assert.equal(result.stampCluster, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify primed", () => {
  assert.equal(classify(emptyTicket()), "primed");
  assert.equal(classify(""), "primed");
  assert.equal(classify(null), "primed");
  assert.equal(decide({}), "primed");
});

test("#93015 seeded path scores flashed from lastRunAt without a session birth", () => {
  const result = analyze(seedFlashed());
  assert.equal(result.verdict, "flashed");
  assert.equal(result.seededWord, "flashed");
  assert.equal(SEEDED_WORD, "flashed");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.flashed, true);
  assert.equal(result.phrase, "score flashed");
  assert.equal(result.lastRunAtStamped, true);
  assert.equal(result.lastRunAtFresh, true);
  assert.equal(result.sessionBorn, false);
  assert.equal(result.failedRunSurfaced, false);
  assert.equal(result.notification, false);
  assert.equal(result.error, false);
  assert.equal(result.enabled, true);
  assert.equal(result.nextRunAtSensibile, true);
  assert.equal(result.runNowLaunched, false);
  assert.equal(result.stampCluster, true);
  assert.equal(result.clusterMs, 430);
  assert.equal(result.dailyBirths, 0);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is flashpanned; named flashpanned seed holds the path", () => {
  assert.equal(PATH_WORD, "flashpanned");
  const result = analyze(seedFlashpanned());
  assert.equal(result.verdict, "flashpanned");
  assert.equal(result.pathWord, "flashpanned");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("flashpanned.json")), "flashpanned");
});

test("fixture toggle flips primed vs flashed", () => {
  const primed = scoreGate(readData("primed.json"));
  const flashed = scoreGate(readData("flashed.json"));
  assert.equal(primed.verdict, "primed");
  assert.equal(flashed.verdict, "flashed");
  assert.notEqual(primed.verdict, flashed.verdict);
  assert.equal(score(readData("primed.json")), "primed");
  assert.equal(score(readData("flashed.json")), "flashed");
  assert.equal(score(readData("93015.json")), "flashed");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("lastRunAt-false-signal.json")), "lastRunAt-false-signal");
  assert.equal(classify(readData("zero-births.json")), "zero-births");
  assert.equal(classify(readData("stamp-cluster.json")), "stamp-cluster");
  assert.equal(classify(readData("run-now-same-fail.json")), "run-now-same-fail");
  assert.equal(classify(readData("birth-time-not-mtime.json")), "birth-time-not-mtime");
  assert.equal(classify(readData("no-failed-run-state.json")), "no-failed-run-state");
  assert.equal(classify(readData("silent-healthy-registry.json")), "silent-healthy-registry");
  assert.equal(classify(readData("restart-window-only.json")), "restart-window-only");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published flash walk scores flashed after lastRunAt stamps without a birth", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "flashed");
  assert.ok(night.flashedCount >= 1);
  const stamp = night.rows.find((row) => row.event === "lastRunAt-false-signal");
  assert.equal(stamp.verdict, "flashed");
  assert.equal(stamp.lastRunAtStamped, true);
  assert.equal(stamp.sessionBorn, false);
  const births = night.rows.find((row) => row.event === "zero-births");
  assert.equal(births.verdict, "flashed");
  assert.equal(births.dailyBirths, 0);
  const cluster = night.rows.find((row) => row.event === "stamp-cluster");
  assert.equal(cluster.verdict, "flashed");
  assert.equal(cluster.stampCluster, true);
  assert.equal(cluster.clusterMs, 430);
  const runNow = night.rows.find((row) => row.event === "run-now-same-fail");
  assert.equal(runNow.verdict, "flashed");
  assert.equal(runNow.runNowLaunched, false);
  const quiet = night.rows.find((row) => row.event === "no-failed-run-state");
  assert.equal(quiet.verdict, "flashed");
  assert.equal(quiet.failedRunSurfaced, false);
  const registry = night.rows.find((row) => row.event === "silent-healthy-registry");
  assert.equal(registry.verdict, "flashed");
  assert.equal(registry.enabled, true);
  const restart = night.rows.find((row) => row.event === "restart-window-only");
  assert.equal(restart.restartWindowBirths, 6);
  assert.equal(restart.restartWindowMinutes, 25);
  const clock = night.rows.find((row) => row.event === "birth-time-not-mtime");
  assert.equal(clock.birthTimeUsed, true);
  assert.equal(clock.mtimeMisleading, true);
});

test("FLASH_WALK constant matches the issue lastRunAt path", () => {
  assert.equal(FLASH_WALK[0].event, "lastRunAt-false-signal");
  assert.equal(FLASH_WALK[0].lastRunAtStamped, true);
  assert.equal(FLASH_WALK[0].sessionBorn, false);
  const cluster = FLASH_WALK.find((row) => row.event === "stamp-cluster");
  assert.equal(cluster.clusterMs, 430);
  assert.equal(cluster.stampCluster, true);
  const births = FLASH_WALK.find((row) => row.event === "zero-births");
  assert.equal(births.dailyBirths, 0);
  const runNow = FLASH_WALK.find((row) => row.event === "run-now-same-fail");
  assert.equal(runNow.runNowLaunched, false);
  const quiet = FLASH_WALK.find((row) => row.event === "no-failed-run-state");
  assert.equal(quiet.failedRunSurfaced, false);
  const restart = FLASH_WALK.find((row) => row.event === "restart-window-only");
  assert.equal(restart.restartWindowBirths, 6);
});

test("issue constants encode only #93015 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93015);
  assert.ok(ISSUE_URL.includes("93015"));
  assert.match(TITLE, /stamp lastRunAt/);
  assert.match(TITLE, /never launch a session/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:routines"));
  assert.equal(REPORTER, "sathishrao02");
  assert.equal(FILED_AT, "2026-09-09T06:39:28Z");
  assert.match(PRODUCT, /desktop app/);
  assert.match(PRODUCT, /macOS 15\.6/);
  assert.equal(SESSION_PATH, "~/.claude/projects/<project>/<uuid>.jsonl");
  assert.equal(BIRTH_STAT, "stat -f '%SB'");
  assert.equal(CLUSTER_MS, 430);
  assert.equal(CLUSTER_SPAN_S, 0.43);
  assert.equal(DAILY_BIRTHS_BASELINE_MIN, 8);
  assert.equal(DAILY_BIRTHS_BASELINE_MAX, 12);
  assert.deepEqual([...ZERO_BIRTH_DATES], ["2026-09-06", "2026-09-07", "2026-09-09"]);
  assert.equal(RESTART_WINDOW_BIRTHS, 6);
  assert.equal(RESTART_WINDOW_MINUTES, 25);
  assert.equal(TASKS_STOPPED, 8);
  assert.equal(FIRST_OBSERVED, "2026-09-06");
  assert.equal(STILL_OCCURRING, "2026-09-09");
  assert.equal(STAMP_CLUSTER.length, 3);
  assert.equal(STAMP_CLUSTER[0].at, "04:11:21.158Z");
  assert.equal(STAMP_CLUSTER[1].at, "04:11:21.160Z");
  assert.equal(STAMP_CLUSTER[2].at, "04:11:21.586Z");
  assert.ok(HOLD.includes("primed"));
  assert.ok(ALARM.includes("flashed"));
  assert.ok(ALARM.includes("flashpanned"));
  assert.ok(CHIPS.includes("stamp-cluster"));
  assert.ok(VERDICTS.includes("zero-births"));
  assert.ok(VERDICTS.includes("run-now-same-fail"));
  assert.ok(VERDICTS.includes("birth-time-not-mtime"));
  assert.ok(VERDICTS.includes("walk"));
});

test("silent lastRunAt stamp flips primed to flashed; birth-time proof recovers", () => {
  const tape = {
    lastRunAtStamped: true,
    lastRunAtFresh: true,
    lastRunAtHonest: true,
    sessionBorn: true,
    failedRunSurfaced: true,
    notification: true,
    error: false,
    enabled: true,
    nextRunAtSensibile: true,
    runNowLaunched: true,
    stampCluster: false,
    birthTimeUsed: true,
  };
  assert.equal(scoreGate(tape).verdict, "primed");
  tape.lastRunAtHonest = false;
  tape.sessionBorn = false;
  tape.failedRunSurfaced = false;
  tape.notification = false;
  tape.runNowLaunched = false;
  tape.stampCluster = true;
  tape.clusterMs = 430;
  tape.dailyBirths = 0;
  assert.equal(scoreGate(tape).verdict, "flashed");
  tape.lastRunAtHonest = true;
  tape.sessionBorn = true;
  tape.failedRunSurfaced = true;
  tape.notification = true;
  tape.runNowLaunched = true;
  tape.stampCluster = false;
  tape.dailyBirths = 10;
  assert.equal(scoreGate(tape).verdict, "primed");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [91527, 80671, 92429, 89936, 90215, 72195, 92972],
  );
  assert.equal(COUSINS.length, 7);
  assert.equal(COUSINS[0].issue, 91527);
  assert.equal(COUSINS[5].issue, 72195);
  assert.equal(COUSINS[5].state, "CLOSED");
  assert.equal(COUSINS[6].issue, 92972);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("secateurs"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("ferrule"));
  assert.ok(NOT_PRODUCTS.includes("hangfire"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.equal(classify(cousins), "cousins");
});

test("CLI scores fixtures without a server", () => {
  const primed = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/primed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const flashed = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/flashed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(primed.status, 0, primed.stderr);
  assert.equal(flashed.status, 0, flashed.stderr);
  assert.equal(JSON.parse(primed.stdout).verdict, "primed");
  assert.equal(JSON.parse(flashed.stdout).verdict, "flashed");
});

test("handle exposes published hypothesis and #93015 headline", () => {
  const result = handle(readData("93015.json"));
  assert.equal(result.published.issue, 93015);
  assert.equal(result.published.clusterMs, 430);
  assert.equal(result.published.restartWindowBirths, 6);
  assert.equal(result.published.tasksStopped, 8);
  assert.deepEqual(result.published.zeroBirthDates, [
    "2026-09-06",
    "2026-09-07",
    "2026-09-09",
  ]);
  assert.deepEqual(result.published.cousins, [
    91527, 80671, 92429, 89936, 90215, 72195, 92972,
  ]);
  assert.match(result.published.hypothesis, /session launcher fails closed/);
  assert.match(
    fingerprint(seedFlashed()),
    /flashed\|stamp=fresh\|birth=zero\|fail=silent\|cluster=<1s/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a flintlock flash-pan booth, not secateurs / palinode / frizzen", () => {
  const page = readPage();
  assert.match(page, /Newsreader/);
  assert.match(page, /Manrope/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /flash.?pan|priming-pan|priming pan|damp powder|flint/i);
  assert.match(page, /Score the flash/);
  assert.match(page, /Pin idle primed/);
  assert.match(page, /Pin seeded flashed/);
  assert.match(page, /Admit primed/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to primed/);
  assert.match(page, /score flashed or admit primed/i);
  assert.match(page, /primed/);
  assert.match(page, /flashed/);
  assert.match(page, /flashpanned/);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /16:50/);
  assert.match(page, /#243/);
  assert.match(page, /#93015/);
  assert.match(page, /lastRunAt/);
  assert.match(page, /0\.43|430/);
  assert.match(page, /stat -f '%SB'/);
  assert.doesNotMatch(page, /Bitter|Figtree|Cardo|Nunito/);
  assert.doesNotMatch(page, /Oswald|Source Sans 3|Share Tech Mono/);
  assert.doesNotMatch(page, /Chakra Petch|\bHind\b/);
  assert.doesNotMatch(page, /Bodoni Moda|Commissioner|Space Mono/);
  assert.doesNotMatch(page, /wax tablet|stylus|scraped|vellum|ink pot|ruling/i);
  assert.doesNotMatch(page, /bypass shears|wooden handle|steel blade|rule cane/i);
  assert.doesNotMatch(page, /gunmetal|oil-black|cyan instrument/i);
  assert.doesNotMatch(page, /plant-floor|E-stop|hazard stripe|safety yellow/i);
  assert.doesNotMatch(page, /\bsheared\b/);
  assert.doesNotMatch(page, /\bunretracted\b/);
  assert.doesNotMatch(page, /\bemended\b/);
  assert.doesNotMatch(page, /\bpalinoded\b/);
  assert.doesNotMatch(page, /\bsecateured\b/);
  assert.match(page, /NOT Secateurs/i);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Ferrule/i);
  assert.match(page, /NOT Interlock/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Flashpan/);
  assert.match(readme, /#93015/);
  assert.match(readme, /primed/);
  assert.match(readme, /flashed/);
  assert.match(readme, /flashpanned/);
  assert.match(readme, /lastRunAt/);
  assert.match(readme, /birth time/i);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Secateurs/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /NOT Interlock/i);
  assert.match(readme, /NOT Hangfire/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/flashpan/);
  assert.match(readme, /node --test projects\/flashpan\/flashpan\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #243 features Flashpan; Secateurs stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 243);
  assert.equal(catalog.products[0].name, "Flashpan");
  assert.equal(catalog.products[0].slug, "flashpan");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/flashpan/");
  assert.equal(catalog.products[0].day, "2026-09-09");
  const secateurs = catalog.products.find((row) => row.slug === "secateurs");
  assert.ok(secateurs);
  assert.equal(secateurs.featured, false);
  const palinode = catalog.products.find((row) => row.slug === "palinode");
  assert.ok(palinode);
  assert.equal(palinode.featured, false);
});
