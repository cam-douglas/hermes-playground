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
  FILLER_CALLS,
  FILLER_SECONDS,
  FIRST_DURATION_MS,
  FIRST_TOKENS,
  FIRST_TOOL_USES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOTE_TEXT,
  NOT_PRODUCTS,
  PARK_RESULT,
  PATH_WORD,
  REINVOKE_FIRST_S,
  REINVOKE_SECOND_S,
  SECOND_TOKENS,
  SECOND_TOOL_USES,
  SEEDED_WORD,
  SLEEP_SECONDS,
  TASKSTOP_AFTER_S,
  TIMELINE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreEnvelope,
  scoreTimeline,
  seedEpitaphed,
  seedInscribed,
  seedParked,
  usageRise,
} from "./epitaph.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function modelPath() {
  return fileURLToPath(new URL("./epitaph.mjs", import.meta.url));
}

test("idle parked is a hold; honest parked status with a live child", () => {
  const result = analyze(seedParked());
  assert.equal(result.verdict, "parked");
  assert.equal(result.idleWord, "parked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.parked, true);
  assert.equal(result.phrase, "admit parked");
  assert.equal(result.childLive, true);
  assert.equal(result.status, "parked");
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify parked", () => {
  assert.equal(classify(emptyTicket()), "parked");
  assert.equal(classify(""), "parked");
  assert.equal(classify(null), "parked");
  assert.equal(decide({}), "parked");
});

test("#92952 path scores epitaphed from the first completed envelope", () => {
  const result = analyze(seedEpitaphed());
  assert.equal(result.verdict, "epitaphed");
  assert.equal(result.pathWord, "epitaphed");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.epitaphed, true);
  assert.equal(result.phrase, "score epitaphed");
  assert.equal(result.status, "completed");
  assert.equal(result.childLive, true);
  assert.equal(result.tokens, FIRST_TOKENS);
  assert.equal(result.toolUses, FIRST_TOOL_USES);
  assert.equal(result.durationMs, FIRST_DURATION_MS);
  assert.equal(result.finishedWord, true);
  assert.equal(result.parkingUtterance, true);
  assert.equal(result.noteContradicts, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.pathWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("fixture toggle flips parked vs epitaphed", () => {
  const parked = scoreEnvelope(readData("parked.json"));
  const epitaphed = scoreEnvelope(readData("epitaphed.json"));
  assert.equal(parked.verdict, "parked");
  assert.equal(epitaphed.verdict, "epitaphed");
  assert.notEqual(parked.verdict, epitaphed.verdict);
  assert.equal(score(readData("parked.json")), "parked");
  assert.equal(score(readData("epitaphed.json")), "epitaphed");
  assert.equal(score(readData("92952.json")), "epitaphed");
});

test("inscribed is the late-true-complete second notification", () => {
  const result = scoreEnvelope(readData("inscribed.json"));
  assert.equal(result.verdict, "inscribed");
  assert.equal(result.seededWord, "inscribed");
  assert.equal(result.hold, false);
  assert.equal(result.recover, true);
  assert.equal(result.status, "completed");
  assert.equal(result.childLive, false);
  assert.equal(result.tokens, SECOND_TOKENS);
  assert.equal(result.toolUses, SECOND_TOOL_USES);
  assert.equal(analyze(seedInscribed()).verdict, "inscribed");
});

test("published timeline scores epitaphed at the first completed envelope", () => {
  const night = scoreTimeline(readData("timeline.json"));
  assert.equal(night.verdict, "epitaphed");
  assert.ok(night.epitaphedCount >= 1);
  const first = night.rows.find((row) => row.event === "false-complete");
  assert.equal(first.verdict, "epitaphed");
  assert.equal(first.tokens, FIRST_TOKENS);
  const second = night.rows.find((row) => row.event === "true-complete");
  assert.equal(second.verdict, "inscribed");
  const park = night.rows.find((row) => row.event === "park");
  assert.equal(park.verdict, "parked");
});

test("TIMELINE constant matches the issue clocks", () => {
  assert.equal(TIMELINE[0].event, "spawn");
  assert.match(TIMELINE[0].prompt, /sleep 150/);
  const first = TIMELINE.find((row) => row.event === "false-complete");
  assert.equal(first.status, "completed");
  assert.equal(first.tokens, 99124);
  assert.equal(first.toolUses, 12);
  assert.equal(first.durationMs, 357035);
  assert.equal(first.liveBackgroundChildren, 1);
  assert.equal(first.result, PARK_RESULT);
  const second = TIMELINE.find((row) => row.event === "true-complete");
  assert.equal(second.tokens, 104094);
  assert.equal(second.toolUses, 16);
  const wakes = TIMELINE.filter((row) => row.event === "reinvoke");
  assert.equal(wakes[0].seconds, REINVOKE_FIRST_S);
  assert.equal(wakes[1].seconds, REINVOKE_SECOND_S);
  const stop = TIMELINE.find((row) => row.event === "task-stop");
  assert.equal(stop.secondsAfterReportedSuccess, TASKSTOP_AFTER_S);
  assert.equal(stop.contendingRebuild, true);
});

test("usage counters rise 99124→104094 and 12→16", () => {
  const rise = usageRise(FIRST_TOKENS, SECOND_TOKENS, FIRST_TOOL_USES, SECOND_TOOL_USES);
  assert.equal(rise.tokens, SECOND_TOKENS - FIRST_TOKENS);
  assert.equal(rise.tools, SECOND_TOOL_USES - FIRST_TOOL_USES);
  assert.equal(rise.rose, true);
  assert.equal(SLEEP_SECONDS, 150);
  assert.equal(FILLER_CALLS, 7);
  assert.equal(FILLER_SECONDS, 35);
});

test("carving an honest parked status flips epitaphed to parked", () => {
  const tape = {
    status: "completed",
    summary: 'Agent "…" finished',
    note: NOTE_TEXT,
    result: PARK_RESULT,
    liveBackgroundChildren: 1,
    sleepStillRunning: true,
  };
  assert.equal(scoreEnvelope(tape).verdict, "epitaphed");
  tape.status = "parked";
  tape.summary = "1 background task still running; you will be notified again";
  tape.note = "1 background task still running; you will be notified again";
  tape.result = "none — agent has not produced a final report";
  assert.equal(scoreEnvelope(tape).verdict, "parked");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [88001, 91503, 76594, 92095],
  );
  assert.equal(COUSINS.length, 4);
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("recension"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.ok(NOT_PRODUCTS.includes("remora"));
  assert.ok(NOT_PRODUCTS.includes("cenotaph"));
  assert.equal(classify(cousins), "cousins");
});

test("issue metadata matches #92952", () => {
  assert.equal(FEATURED_ISSUE, 92952);
  assert.ok(ISSUE_URL.includes("92952"));
  assert.ok(/status=completed/i.test(TITLE));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(HOLD.includes("parked"));
  assert.ok(ALARM.includes("epitaphed"));
  assert.ok(CHIPS.includes("inscribed"));
  assert.ok(VERDICTS.includes("live-child"));
  assert.ok(VERDICTS.includes("task-stop"));
  assert.ok(VERDICTS.includes("contending-rebuild"));
  assert.ok(VERDICTS.includes("status-check"));
  assert.ok(VERDICTS.includes("filler-calls"));
  assert.match(NOTE_TEXT, /no live background children/);
});

test("CLI scores fixtures without a server", () => {
  const parked = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/parked.json", import.meta.url))], { encoding: "utf8" });
  const epitaphed = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/epitaphed.json", import.meta.url))], { encoding: "utf8" });
  assert.equal(parked.status, 0, parked.stderr);
  assert.equal(epitaphed.status, 0, epitaphed.stderr);
  assert.equal(JSON.parse(parked.stdout).verdict, "parked");
  assert.equal(JSON.parse(epitaphed.stdout).verdict, "epitaphed");
});

test("handle exposes published hypothesis and first-envelope headline", () => {
  const result = handle(readData("92952.json"));
  assert.equal(result.published.issue, 92952);
  assert.equal(result.published.envelope.tokens, 99124);
  assert.equal(result.published.envelope.toolUses, 12);
  assert.equal(result.published.usageRise.tokens, "99124→104094");
  assert.equal(result.published.usageRise.tools, "12→16");
  assert.deepEqual(result.published.reinvokes, [109, 46]);
  assert.match(result.published.hypothesis, /background Bash child/);
  assert.match(fingerprint(seedEpitaphed()), /epitaphed\|status=completed\|child=live/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a stonecutter memorial bench, not recension oak or mirage desert", () => {
  const page = readPage();
  assert.match(page, /Old Standard TT/);
  assert.match(page, /Work Sans/);
  assert.match(page, /Ubuntu Mono/);
  assert.match(page, /stonecutter|memorial|masonry|epitaph tablet|limestone|chisel/i);
  assert.match(page, /score epitaphed or admit parked/i);
  assert.match(page, /inscribed/);
  assert.doesNotMatch(page, /Literata|Public Sans|JetBrains Mono/);
  assert.doesNotMatch(page, /Newsreader|Lexend|Fragment Mono/);
  assert.doesNotMatch(page, /Ibarra Real Nova|Red Hat Text|Red Hat Mono/);
  assert.doesNotMatch(page, /scriptorium collation|heat-haze|hull-clinging remora|iron bed bench|cadastral surveyor/);
  assert.doesNotMatch(page, /\bcollated\b/);
  assert.doesNotMatch(page, /\bstereotyped\b/);
  assert.doesNotMatch(page, /\bemended\b/);
  assert.doesNotMatch(page, /\bmiraged\b/);
  assert.doesNotMatch(page, /\bloosed\b/);
  assert.doesNotMatch(page, /\bclung\b/);
  assert.match(page, /#92952/);
  assert.match(page, /09:50/);
});
