import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BLOCKER_SESSION,
  CHIPS,
  CHILD_SESSION,
  CONCURRENT_SESSIONS,
  COUSINS,
  DESKTOP_VERSION,
  DISPATCH_PARENT_ORIGIN,
  DISPATCH_TOOLS,
  ELECTRON,
  ERROR_PHRASE,
  ERROR_TEXT,
  EXCLUSIVE_CWD,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GATE_WALK,
  HOLD,
  IDLE_TIMER_HIDDEN_S,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LAST_TURN_MINUTES,
  NOT_PRODUCTS,
  OS_NAME,
  PATH_WORD,
  PREVIOUS_DESKTOP,
  REPORTER,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  VERSION,
  WARM_LIFECYCLE_ARM,
  alreadyActiveLine,
  analyze,
  classify,
  decide,
  emptyTicket,
  errorBlock,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedDetached,
  seedInterlocked,
  seedPassable,
} from "./interlock.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function modelPath() {
  return fileURLToPath(new URL("./interlock.mjs", import.meta.url));
}

test("idle passable is a hold; folder open for Dispatch, no live query", () => {
  const result = analyze(seedPassable());
  assert.equal(result.verdict, "passable");
  assert.equal(result.idleWord, "passable");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.passable, true);
  assert.equal(result.phrase, "admit passable");
  assert.equal(result.queryPresent, false);
  assert.equal(result.warmed, false);
  assert.equal(result.dispatchBlocked, false);
  assert.equal(result.turnInFlight, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify passable", () => {
  assert.equal(classify(emptyTicket()), "passable");
  assert.equal(classify(""), "passable");
  assert.equal(classify(null), "passable");
  assert.equal(decide({}), "passable");
});

test("#92976 path scores interlocked from the UI-warmed idle guard", () => {
  const result = analyze(seedInterlocked());
  assert.equal(result.verdict, "interlocked");
  assert.equal(result.pathWord, "interlocked");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.interlocked, true);
  assert.equal(result.phrase, "score interlocked");
  assert.equal(result.queryPresent, true);
  assert.equal(result.warmed, true);
  assert.equal(result.turnInFlight, false);
  assert.equal(result.exclusiveCwd, true);
  assert.equal(result.dispatchBlocked, true);
  assert.equal(result.errorAlreadyActive, true);
  assert.equal(result.lastTurnMinutesAgo, LAST_TURN_MINUTES);
  assert.equal(result.sessionId, BLOCKER_SESSION);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.pathWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("fixture toggle flips passable vs interlocked", () => {
  const passable = scoreGate(readData("passable.json"));
  const interlocked = scoreGate(readData("interlocked.json"));
  assert.equal(passable.verdict, "passable");
  assert.equal(interlocked.verdict, "interlocked");
  assert.notEqual(passable.verdict, interlocked.verdict);
  assert.equal(score(readData("passable.json")), "passable");
  assert.equal(score(readData("interlocked.json")), "interlocked");
  assert.equal(score(readData("92976.json")), "interlocked");
});

test("detached is the seeded recover: query released, busy-check only", () => {
  const result = scoreGate(readData("detached.json"));
  assert.equal(result.verdict, "detached");
  assert.equal(result.seededWord, "detached");
  assert.equal(result.hold, false);
  assert.equal(result.recover, true);
  assert.equal(result.queryPresent, false);
  assert.equal(result.busyCheckOnly, true);
  assert.equal(result.exclusiveCwd, false);
  assert.equal(result.dispatchBlocked, false);
  assert.equal(analyze(seedDetached()).verdict, "detached");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("stale-records-fixed.json")), "stale-records-fixed");
  assert.equal(classify(readData("ui-warm-relock.json")), "ui-warm-relock");
  assert.equal(classify(readData("query-present-idle.json")), "query-present-idle");
  assert.equal(classify(readData("warm-lifecycle-when-hidden.json")), "warm-lifecycle-when-hidden");
  assert.equal(classify(readData("exclusivecwd-hardcoded.json")), "exclusivecwd-hardcoded");
  assert.equal(classify(readData("concurrent-local-ok.json")), "concurrent-local-ok");
  assert.equal(classify(readData("dispatch-only-block.json")), "dispatch-only-block");
  assert.equal(classify(readData("timeline.json")), "timeline");
  assert.equal(classify(readData("cifs-non-git.json")), "cifs-non-git");
  assert.equal(classify(readData("no-archive-tool.json")), "no-archive-tool");
  assert.equal(classify(readData("error-already-active.json")), "error-already-active");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("before-after.json")), "before-after");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("published gate walk scores interlocked after the 10:55 warm", () => {
  const night = scoreWalk(readData("walk.json"));
  assert.equal(night.verdict, "interlocked");
  assert.ok(night.interlockedCount >= 1);
  const success = night.rows.find((row) => row.event === "start-success");
  assert.equal(success.verdict, "passable");
  assert.equal(success.startCodeTaskSucceeded, true);
  const warm = night.rows.find((row) => row.event === "ui-warm");
  assert.equal(warm.verdict, "interlocked");
  assert.equal(warm.warmed, true);
  assert.equal(warm.queryPresent, true);
  const fail = night.rows.find((row) => row.event === "start-fail");
  assert.equal(fail.verdict, "interlocked");
  assert.equal(fail.dispatchBlocked, true);
  assert.equal(fail.errorAlreadyActive, true);
});

test("GATE_WALK constant matches the issue clocks", () => {
  assert.equal(GATE_WALK[0].event, "stop-hook");
  assert.equal(GATE_WALK[0].t, "10:28");
  const stop = GATE_WALK.find((row) => row.event === "stop-session");
  assert.equal(stop.t, "10:35");
  assert.equal(stop.queryPresent, false);
  assert.equal(stop.folderPassable, true);
  const success = GATE_WALK.find((row) => row.event === "start-success");
  assert.equal(success.t, "10:43");
  assert.equal(success.startCodeTaskSucceeded, true);
  assert.equal(success.childSession, CHILD_SESSION);
  const warm = GATE_WALK.find((row) => row.event === "ui-warm");
  assert.equal(warm.t, "10:55");
  assert.equal(warm.warmed, true);
  assert.equal(warm.queryPresent, true);
  const fail = GATE_WALK.find((row) => row.event === "start-fail");
  assert.equal(fail.t, "11:15");
  assert.equal(fail.error, ERROR_TEXT);
  assert.equal(fail.lastTurnMinutesAgo, 47);
  assert.equal(fail.exclusiveCwd, true);
  assert.equal(fail.concurrentLocalOk, true);
});

test("error block reprints the published already-active shape", () => {
  const block = errorBlock();
  assert.match(block, /already active in this directory/);
  assert.match(block, /local_4c2ba47d/);
  assert.equal(alreadyActiveLine(), ERROR_TEXT);
  assert.equal(ERROR_PHRASE, "already active");
  assert.match(ERROR_TEXT, /Failed to start code session/);
});

test("warming an idle session flips passable to interlocked; detach recovers", () => {
  const tape = {
    queryPresent: false,
    warmed: false,
    turnInFlight: false,
    exclusiveCwd: true,
    dispatchBlocked: false,
    sessionStopped: true,
    staleRecordsSkipped: true,
    folderPassable: true,
  };
  assert.equal(scoreGate(tape).verdict, "passable");
  tape.queryPresent = true;
  tape.warmed = true;
  tape.folderPassable = false;
  assert.equal(scoreGate(tape).verdict, "interlocked");
  tape.detached = true;
  tape.queryPresent = false;
  tape.warmed = false;
  tape.previouslyWarmed = true;
  tape.busyCheckOnly = true;
  tape.exclusiveCwd = false;
  tape.dispatchBlocked = false;
  tape.folderPassable = true;
  assert.equal(scoreGate(tape).verdict, "detached");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [91745, 92452, 92462],
  );
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].state, "CLOSED");
  assert.equal(COUSINS[1].state, "OPEN");
  assert.equal(COUSINS[2].state, "CLOSED");
  assert.ok(NOT_PRODUCTS.includes("shibboleth"));
  assert.ok(NOT_PRODUCTS.includes("homestead"));
  assert.ok(NOT_PRODUCTS.includes("epitaph"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.ok(NOT_PRODUCTS.includes("remora"));
  assert.equal(classify(cousins), "cousins");
});

test("issue metadata matches #92976", () => {
  assert.equal(FEATURED_ISSUE, 92976);
  assert.ok(ISSUE_URL.includes("92976"));
  assert.match(TITLE, /start_code_task still blocked/);
  assert.match(TITLE, /1\.49585\.0/);
  assert.ok(LABELS.includes("area:desktop"));
  assert.ok(LABELS.includes("platform:linux"));
  assert.ok(LABELS.includes("regression"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(HOLD.includes("passable"));
  assert.ok(ALARM.includes("interlocked"));
  assert.ok(CHIPS.includes("detached"));
  assert.ok(VERDICTS.includes("stale-records-fixed"));
  assert.ok(VERDICTS.includes("ui-warm-relock"));
  assert.ok(VERDICTS.includes("query-present-idle"));
  assert.ok(VERDICTS.includes("warm-lifecycle-when-hidden"));
  assert.ok(VERDICTS.includes("exclusivecwd-hardcoded"));
  assert.ok(VERDICTS.includes("concurrent-local-ok"));
  assert.ok(VERDICTS.includes("dispatch-only-block"));
  assert.ok(VERDICTS.includes("cifs-non-git"));
  assert.ok(VERDICTS.includes("no-archive-tool"));
  assert.ok(VERDICTS.includes("error-already-active"));
  assert.equal(DESKTOP_VERSION, "1.49585.0");
  assert.equal(PREVIOUS_DESKTOP, "1.40609.1");
  assert.equal(VERSION, "2.1.260");
  assert.equal(ELECTRON, "44");
  assert.equal(OS_NAME, "Ubuntu 26.04 Hyper-V");
  assert.equal(REPORTER, "terrapin-lee");
  assert.equal(FILED_AT, "2026-09-09T02:34:59Z");
  assert.equal(WARM_LIFECYCLE_ARM, "when-hidden");
  assert.deepEqual([...IDLE_TIMER_HIDDEN_S], [900, 1800]);
  assert.equal(DISPATCH_PARENT_ORIGIN, "local");
  assert.equal(EXCLUSIVE_CWD, true);
  assert.equal(CONCURRENT_SESSIONS, 4);
  assert.ok(DISPATCH_TOOLS.includes("start_code_task"));
  assert.ok(!DISPATCH_TOOLS.includes("archive"));
  assert.ok(!DISPATCH_TOOLS.includes("release"));
});

test("CLI scores fixtures without a server", () => {
  const passable = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/passable.json", import.meta.url))], { encoding: "utf8" });
  const interlocked = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/interlocked.json", import.meta.url))], { encoding: "utf8" });
  assert.equal(passable.status, 0, passable.stderr);
  assert.equal(interlocked.status, 0, interlocked.stderr);
  assert.equal(JSON.parse(passable.stdout).verdict, "passable");
  assert.equal(JSON.parse(interlocked.stdout).verdict, "interlocked");
});

test("handle exposes published hypothesis and already-active headline", () => {
  const result = handle(readData("92976.json"));
  assert.equal(result.published.issue, 92976);
  assert.equal(result.published.desktopVersion, DESKTOP_VERSION);
  assert.equal(result.published.exclusiveCwd, true);
  assert.equal(result.published.warmLifecycleArm, "when-hidden");
  assert.equal(result.published.archiveToolPresent, false);
  assert.match(result.published.hypothesis, /UI warm attaches CLI/);
  assert.match(
    fingerprint(seedInterlocked()),
    /interlocked\|query=on\|warm=on\|turn=idle\|exclusive=on\|dispatch=block/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a plant interlock booth, not river-ford or prairie land-office", () => {
  const page = readPage();
  assert.match(page, /Chakra Petch/);
  assert.match(page, /Hind/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /plant|lockout|E-stop|hazard|graphite|safety yellow/i);
  assert.match(page, /score interlocked or admit passable/i);
  assert.match(page, /detached/);
  assert.doesNotMatch(page, /Cormorant Infant|Manrope/);
  assert.doesNotMatch(page, /Playfair Display|Figtree|Fira Code/);
  assert.doesNotMatch(page, /Old Standard TT|Work Sans|Ubuntu Mono/);
  assert.doesNotMatch(page, /Literata|Public Sans|JetBrains Mono/);
  assert.doesNotMatch(page, /Newsreader|Lexend|Fragment Mono/);
  assert.doesNotMatch(page, /Ibarra Real Nova|Red Hat Text|Red Hat Mono/);
  assert.doesNotMatch(page, /river-ford|watchword|password lodge|indigo bank|wet-stone/);
  assert.doesNotMatch(page, /prairie|land-office|homestead-claim|deed paper|survey stake/);
  assert.doesNotMatch(page, /stonecutter|memorial masonry|epitaph tablet/);
  assert.doesNotMatch(page, /scriptorium|collation desk|iron-gall/);
  assert.doesNotMatch(page, /heat-haze|false oasis/);
  assert.doesNotMatch(page, /\badmitted\b/);
  assert.doesNotMatch(page, /\bshibbolethed\b/);
  assert.doesNotMatch(page, /\bcountersigned\b/);
  assert.doesNotMatch(page, /\bdeeded\b/);
  assert.doesNotMatch(page, /\bhomesteaded\b/);
  assert.doesNotMatch(page, /\bparked\b/);
  assert.doesNotMatch(page, /\bepitaphed\b/);
  assert.doesNotMatch(page, /\bcollated\b/);
  assert.doesNotMatch(page, /\bstereotyped\b/);
  assert.doesNotMatch(page, /\bconfirmed\b/);
  assert.doesNotMatch(page, /\bmiraged\b/);
  assert.doesNotMatch(page, /\bloosed\b/);
  assert.doesNotMatch(page, /\bclung\b/);
  assert.match(page, /#92976/);
  assert.match(page, /12:50/);
});
