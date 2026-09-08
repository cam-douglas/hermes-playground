import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  CHIPS,
  COUSINS,
  FEATURED_ISSUE,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OVERNIGHT_LOST,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  classifyEvent,
  decide,
  emptyTicket,
  handle,
  parseClock,
  score,
  scoreDispatch,
  scoreNight,
  seedConfirmed,
  seedMiraged,
} from "./mirage.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function modelPath() {
  return fileURLToPath(new URL("./mirage.mjs", import.meta.url));
}

test("idle confirmed is a hold; healthy triple", () => {
  const result = analyze(seedConfirmed());
  assert.equal(result.verdict, "confirmed");
  assert.equal(result.idleWord, "confirmed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.confirmed, true);
  assert.equal(result.phrase, "admit confirmed");
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
  }
});

test("empty ticket and empty stdin classify confirmed", () => {
  assert.equal(classify(emptyTicket()), "confirmed");
  assert.equal(classify(""), "confirmed");
  assert.equal(classify(null), "confirmed");
  assert.equal(decide({}), "confirmed");
});

test("#92920 path scores miraged from published log shape", () => {
  const result = analyze(seedMiraged());
  assert.equal(result.verdict, "miraged");
  assert.equal(result.seededWord, "miraged");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.miraged, true);
  assert.equal(result.lastRunLie, true);
  assert.equal(result.phrase, "score miraged");
  assert.equal(result.lastRunAt, "2026-09-08T09:21:00Z");
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
  }
});

test("fixture toggle flips confirmed vs miraged", () => {
  const confirmed = scoreDispatch(readData("confirmed.json"));
  const miraged = scoreDispatch(readData("miraged.json"));
  assert.equal(confirmed.verdict, "confirmed");
  assert.equal(miraged.verdict, "miraged");
  assert.notEqual(confirmed.verdict, miraged.verdict);
  assert.equal(score(readData("confirmed.json")), "confirmed");
  assert.equal(score(readData("miraged.json")), "miraged");
  assert.equal(score(readData("92920.json")), "miraged");
});

test("overnight-loss scores 3 lost of 18 with late confirm cousin", () => {
  const night = scoreNight(readData("overnight-loss.json"));
  assert.equal(night.verdict, "overnight-loss");
  assert.equal(night.lost, 3);
  assert.equal(night.late, 1);
  assert.equal(night.total, 18);
  assert.ok(night.lost === OVERNIGHT_LOST);
  const voc = night.tasks.find((row) => row.name === "voc-weekly-incremental");
  assert.equal(voc.verdict, "miraged");
  const morning = night.tasks.find((row) => row.name === "morning-checkin-daily");
  assert.equal(morning.verdict, "late-confirm");
});

test("late-confirm after stale is not the idle confirmed triple", () => {
  const result = scoreDispatch(readData("late-confirm.json"));
  assert.equal(result.verdict, "late-confirm");
  assert.equal(result.hold, false);
});

test("event classifier reads CCDScheduledTasks verbs", () => {
  assert.equal(classifyEvent("Spawning new session for scheduled task x"), "spawn");
  assert.equal(classifyEvent("Dispatch acknowledged by renderer: x"), "ack");
  assert.equal(classifyEvent("Cleared stale pending dispatch for: x"), "stale");
  assert.equal(classifyEvent("Confirmed task run for: x"), "confirm");
  assert.equal(classifyEvent("Starting local session"), "session");
  assert.equal(classifyEvent("Delaying dispatch for x by 265s (jitter)"), "jitter");
  assert.equal(classifyEvent("Skipping dispatch for x: global_limit (active=3, limit=3)"), "limit");
});

test("clock parser and ~12 min stale span", () => {
  assert.equal(parseClock("03:12:59"), ((3 * 60 + 12) * 60 + 59) * 1000);
  const scored = scoreDispatch(readData("miraged.json"));
  assert.ok(scored.staleMs > 7 * 60 * 1000);
  assert.ok(scored.staleMs < 16 * 60 * 1000);
});

test("adding confirm to a miraged tape flips to confirmed", () => {
  const tape = {
    events: [
      { t: "03:12:59", message: "Spawning new session for scheduled task voc-weekly-incremental" },
      { t: "03:12:59", message: "Dispatch acknowledged by renderer: voc-weekly-incremental" },
      { t: "03:13:00", message: "Confirmed task run for: voc-weekly-incremental" },
    ],
  };
  assert.equal(scoreDispatch(tape).verdict, "confirmed");
  tape.events.pop();
  tape.events.push({
    t: "03:21:00",
    message: "Cleared stale pending dispatch for: voc-weekly-incremental",
  });
  assert.equal(scoreDispatch(tape).verdict, "miraged");
});

test("cousins are cite-only closed issues; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [74432, 73927, 76304, 77596, 60144],
  );
  assert.equal(COUSINS.length, 5);
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("remora"));
  assert.ok(NOT_PRODUCTS.includes("ukase"));
  assert.equal(classify(cousins), "cousins");
});

test("issue metadata matches #92920", () => {
  assert.equal(FEATURED_ISSUE, 92920);
  assert.ok(ISSUE_URL.includes("92920"));
  assert.ok(/dispatch acknowledged by renderer/i.test(TITLE));
  assert.ok(LABELS.includes("area:desktop"));
  assert.ok(HOLD.includes("confirmed"));
  assert.ok(ALARM.includes("miraged"));
  assert.ok(CHIPS.includes("overnight-loss"));
  assert.ok(VERDICTS.includes("lastrun-lie"));
});

test("CLI scores fixtures without a server", () => {
  const confirmed = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/confirmed.json", import.meta.url))], { encoding: "utf8" });
  const miraged = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/miraged.json", import.meta.url))], { encoding: "utf8" });
  assert.equal(confirmed.status, 0);
  assert.equal(miraged.status, 0);
  assert.equal(JSON.parse(confirmed.stdout).verdict, "confirmed");
  assert.equal(JSON.parse(miraged.stdout).verdict, "miraged");
});

test("handle exposes published hypothesis and overnight counts", () => {
  const result = handle(readData("92920.json"));
  assert.equal(result.published.issue, 92920);
  assert.equal(result.published.overnight.lost, 3);
  assert.equal(result.published.overnight.dispatches, 18);
  assert.match(result.published.hypothesis, /lastRunAt/);
});

test("living page is a desert observatory, not remora hull or iron bed", () => {
  const page = readPage();
  assert.match(page, /Newsreader/);
  assert.match(page, /Lexend/);
  assert.match(page, /Fragment Mono/);
  assert.match(page, /desert|observatory|mirage|oasis|haze/i);
  assert.match(page, /score miraged or admit confirmed/i);
  assert.doesNotMatch(page, /Ibarra Real Nova|Red Hat Text|Vollkorn|Cabin|Ubuntu Mono/);
  assert.doesNotMatch(page, /hull-clinging remora|iron bed bench|cadastral surveyor|scriptorium rubricator|deck sheave/);
  assert.match(page, /#92920/);
  assert.match(page, /07:50/);
});
