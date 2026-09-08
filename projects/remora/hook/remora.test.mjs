import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  CHIPS,
  CHILD_SLEEP_MS,
  COUSINS,
  FEATURED_ISSUE,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  POST_TOOL_USE_WAIT_MS,
  RECOVERY_WORD,
  SEEDED_WORD,
  SLOW_HOOK_LOG,
  STATE,
  TITLE,
  TOOL_DISPATCH_MS,
  TOOL_USE_ID,
  VERDICTS,
  VERSION,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  modelTiming,
  score,
  seedClung,
  seedLoosed,
  seedRehitched,
  soundHull,
} from "./remora.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./remora.mjs", import.meta.url));
}

test("idle loosed is a hold; no descendant grip", () => {
  const result = analyze(seedLoosed());
  assert.equal(result.verdict, "loosed");
  assert.equal(result.idleWord, "loosed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.clung, false);
  assert.ok(result.chips.includes("loosed"));
  assert.ok(!result.chips.includes("clung"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
  }
});

test("empty ticket and empty stdin classify loosed", () => {
  assert.equal(classify(emptyTicket()), "loosed");
  assert.equal(classify(""), "loosed");
  assert.equal(classify(null), "loosed");
  assert.equal(decide({}), "loosed");
});

test("#92934 path scores clung with published timings", () => {
  const result = analyze(seedClung());
  assert.equal(result.verdict, "clung");
  assert.equal(result.seededWord, "clung");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.parentExited, true);
  assert.equal(result.childHolds, true);
  assert.equal(result.timing.toolDispatchMs, TOOL_DISPATCH_MS);
  assert.equal(result.timing.postToolUseWaitMs, POST_TOOL_USE_WAIT_MS);
  assert.equal(result.timing.childHoldMs, CHILD_SLEEP_MS);
  assert.match(result.slowHookLog, /91931ms/);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.verdict, word);
  }
});

test("async:true / rehitched avoids the sync wait", () => {
  const result = analyze(seedRehitched());
  assert.equal(result.verdict, "rehitched");
  assert.equal(result.recover, true);
  assert.equal(result.asyncBypass, true);
  assert.equal(result.timing.postToolUseWaitMs, 0);
  assert.equal(result.childHolds, true);
});

test("fixtures encode only published #92934 facts", () => {
  const primary = readData("92934.json");
  assert.equal(primary.issue, 92934);
  assert.equal(primary.seed, "clung");
  assert.equal(primary.toolUseId, TOOL_USE_ID);
  assert.equal(primary.toolDispatchMs, 925);
  assert.equal(primary.postToolUseWaitMs, 91931);
  assert.equal(primary.version, VERSION);
  assert.equal(primary.os, "Windows 11 Pro 10.0.26100");
  assert.equal(primary.separateFrom.issue, 90049);
  assert.equal(classify(primary), "clung");
  assert.equal(classify(readData("loosed.json")), "loosed");
  assert.equal(classify(readData("rehitched.json")), "rehitched");
  assert.equal(classify(readData("parent-exited.json")), "parent-exited");
  assert.equal(classify(readData("child-holds.json")), "child-holds");
  assert.equal(classify(readData("redirected-stdio.json")), "redirected-stdio");
  assert.equal(classify(readData("sync-stall.json")), "sync-stall");
  assert.equal(classify(readData("async-bypass.json")), "async-bypass");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("before-after.json")), "before-after");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("soundHull reconstructs parent-exit vs child-hold without sleeping", () => {
  const hull = soundHull(seedClung());
  assert.equal(hull.verdict, "clung");
  assert.equal(hull.story[0].ms, 925);
  assert.equal(hull.story[1].state, "exited-0");
  assert.equal(hull.story[2].state, "holds");
  assert.equal(hull.story[3].state, "held");
  const loosed = soundHull(seedLoosed());
  assert.equal(loosed.story[3].state, "loosed");
});

test("modelTiming does not invent Job Object facts", () => {
  const timing = modelTiming(seedClung());
  assert.equal(timing.parentExited, true);
  assert.equal(timing.childHolds, true);
  assert.equal(timing.asyncBypass, false);
  const text = JSON.stringify(handle(seedClung()));
  assert.doesNotMatch(text, /Job Object confirmed/i);
});

test("cousins cite-only #90049; do not re-ship Deadletter", () => {
  assert.equal(COUSINS[0].issue, 90049);
  assert.equal(COUSINS[0].citeOnly, true);
  assert.ok(NOT_PRODUCTS.includes("deadletter"));
  assert.ok(NOT_PRODUCTS.includes("procrustes"));
});

test("page fonts and vocabulary stay remora-specific", () => {
  const page = readPage();
  assert.match(page, /Ibarra Real Nova/);
  assert.match(page, /Red Hat Text/);
  assert.match(page, /Red Hat Mono/);
  assert.match(page, /loosed/);
  assert.match(page, /clung/);
  assert.match(page, /rehitched/);
  assert.doesNotMatch(page, /Vollkorn|Cabin|Ubuntu Mono/);
  assert.doesNotMatch(page, /Newsreader|Figtree|JetBrains Mono/);
  assert.doesNotMatch(page, /Crimson Pro|Work Sans|Cousine/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.doesNotMatch(page, /\breceipted\b/);
});

test("CLI scores a fixture file", () => {
  const fixture = fileURLToPath(new URL("../data/92934.json", import.meta.url));
  const ran = spawnSync(process.execPath, [hookPath(), fixture], {
    encoding: "utf8",
  });
  assert.equal(ran.status, 0);
  const parsed = JSON.parse(ran.stdout);
  assert.equal(parsed.verdict, "clung");
  assert.equal(parsed.issue, FEATURED_ISSUE);
});

test("constants match the live issue", () => {
  assert.equal(TITLE, "Windows: synchronous PostToolUse delays tool results until a persistent child exits");
  assert.equal(STATE, "OPEN");
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:windows", "area:hooks"]);
  assert.equal(ISSUE_URL, "https://github.com/anthropics/claude-code/issues/92934");
  assert.equal(SLOW_HOOK_LOG, "Slow PostToolUse hooks: 91931ms for PowerShell (1 hooks)");
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(ALARM.includes("clung"));
  assert.ok(HOLD.includes("loosed"));
  assert.equal(score({ seed: "clung" }).verdict, "clung");
  assert.match(fingerprint(seedClung()), /clung\|parent-exited\|child-holds/);
});
