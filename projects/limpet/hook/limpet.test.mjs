import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CHIPS,
  CORROBORATORS,
  CRON,
  FEATURED_ISSUE,
  HOLD_VERDICTS,
  IDLE_WORD,
  LOAD,
  PAIRS,
  PRIMARY_ISSUES,
  PROCESSES,
  REAPER_FINGERPRINT,
  RSS_GB,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  handle,
  score,
  seedBloated,
  seedClamped,
  seedEndTurnHeld,
  seedIdleAfterEnd,
  seedMacosPair,
  seedMcpChild,
  seedPaired,
  seedReaped,
  seedResumeStuck,
  seedShed,
  seedStacked,
  seedWindowsResume,
} from "./limpet.mjs";

function readData(name) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

test("clamped seed is clamped/alarm — #89275 41 pairs / 3.08 GB / load 82", () => {
  const seed = seedClamped();
  const result = score(seed);
  assert.equal(result.verdict, "clamped");
  assert.equal(result.clamped, true);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.shed, false);
  assert.equal(result.fresh, false);
  assert.equal(result.idleWord, "shed");
  assert.equal(IDLE_WORD, "shed");
  assert.doesNotMatch(result.idleWord, /limpet/i);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.pairCount, PAIRS);
  assert.equal(seed.processCount, PROCESSES);
  assert.equal(seed.rssGb, RSS_GB);
  assert.equal(seed.load, LOAD);
  assert.equal(seed.cronCadence, CRON);
  assert.equal(seed.version, VERSION);
  assert.equal(seed.stopReason, "end_turn");
  assert.equal(seed.sessionDone, true);
  assert.equal(seed.processResident, true);
  assert.equal(analyze(seed).leak, true);
  assert.ok(result.chips.includes("clamped"));
  assert.ok(result.chips.includes("paired"));
  assert.ok(result.chips.includes("stacked"));
  assert.ok(result.chips.includes("bloated"));
  assert.ok(result.chips.includes("idle-after-end"));
  assert.ok(result.chips.includes("end-turn-held"));
  assert.ok(result.chips.includes("macos-pair"));
});

test("shed seed is shed/hold — pool clear", () => {
  const result = score(seedShed());
  assert.equal(result.verdict, "shed");
  assert.equal(result.shed, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.clamped, false);
  assert.equal(result.fresh, true);
  assert.equal(result.idleWord, "shed");
  assert.equal(analyze(seedShed()).resident, false);
});

test("reaped seed is reaped/hold", () => {
  const result = score(seedReaped());
  assert.equal(result.verdict, "reaped");
  assert.equal(result.reaped, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.ok(result.chips.includes("reaped"));
});

test("decideSeed covers every named verdict", () => {
  for (const name of VERDICTS) {
    const result = decideSeed(name);
    assert.equal(result.verdict, name, name);
    assert.equal(result.idleWord, "shed");
  }
  assert.equal(decide({ action: "89275" }).verdict, "clamped");
  assert.equal(decide({ action: "clamped" }).verdict, "clamped");
  assert.equal(decide({ action: "shed" }).verdict, "shed");
});

test("rule: end_turn + session done + process resident is a leak", () => {
  const ticket = {
    stopReason: "end_turn",
    sessionDone: true,
    processResident: true,
    pairCount: 3,
    platform: "macos",
  };
  const result = score(ticket);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(ALARM_VERDICTS.includes(result.verdict));
  assert.equal(analyze(ticket).leak, true);
});

test("rule: session done + no resident process is shed", () => {
  const ticket = {
    stopReason: "end_turn",
    sessionDone: true,
    processResident: false,
    pairCount: 0,
    processCount: 0,
  };
  assert.equal(classify(ticket), "shed");
  assert.equal(score(ticket).hold, true);
});

test("specific leak classes", () => {
  assert.equal(score(seedPaired()).verdict, "paired");
  assert.equal(score(seedStacked()).verdict, "stacked");
  assert.equal(score(seedBloated()).verdict, "bloated");
  assert.equal(score(seedIdleAfterEnd()).verdict, "idle-after-end");
  assert.equal(score(seedEndTurnHeld()).verdict, "end-turn-held");
  assert.equal(score(seedResumeStuck()).verdict, "resume-stuck");
  assert.equal(score(seedMcpChild()).verdict, "mcp-child");
  assert.equal(score(seedWindowsResume()).verdict, "windows-resume");
  assert.equal(score(seedMacosPair()).verdict, "macos-pair");
  assert.ok(chipsOf(seedWindowsResume()).includes("windows-resume"));
  assert.ok(chipsOf(seedMacosPair()).includes("macos-pair"));
  assert.ok(chipsOf(seedMcpChild()).includes("mcp-child"));
});

test("local fingerprint files keep issue numbers", () => {
  const clamped = readData("89275.json");
  const pair = readData("88918.json");
  const windows = readData("68626.json");
  const shed = readData("shed.json");
  const reaped = readData("reaped.json");
  const prints = readData("fingerprints.json");
  assert.equal(clamped.issue, 89275);
  assert.equal(clamped.pairCount, 41);
  assert.equal(clamped.rssGb, 3.08);
  assert.equal(clamped.load, 82);
  assert.equal(score(clamped).verdict, "clamped");
  assert.equal(pair.issue, 88918);
  assert.equal(pair.stopReason, "end_turn");
  assert.equal(windows.issue, 68626);
  assert.ok(/--resume/.test(windows.argv));
  assert.ok(windows.argv.includes("AskUserQuestion"));
  assert.equal(score(shed).verdict, "shed");
  assert.equal(score(reaped).verdict, "reaped");
  assert.equal(prints.primary[0].issue, 89275);
  assert.equal(prints.primary[0].pairs, 41);
  assert.deepEqual(
    prints.primary.map((row) => row.issue),
    [...PRIMARY_ISSUES],
  );
  assert.deepEqual(
    prints.corroborators.map((row) => row.issue),
    [...CORROBORATORS],
  );
});

test("handle alarms on clamped and allows shed", async () => {
  const fail = await handle(seedClamped());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#89275/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedShed());
  assert.equal(hold.shed, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /shed/i);
  const reaped = await handle(seedReaped());
  assert.match(reaped.hookSpecificOutput.additionalContext, /reaped/i);
});

test("verdict and chip lists; idle is never limpet", () => {
  assert.deepEqual(VERDICTS, [
    "shed",
    "clamped",
    "paired",
    "stacked",
    "bloated",
    "idle-after-end",
    "end-turn-held",
    "resume-stuck",
    "mcp-child",
    "reaped",
    "windows-resume",
    "macos-pair",
  ]);
  assert.deepEqual(CHIPS, [
    "clamped",
    "paired",
    "stacked",
    "bloated",
    "idle-after-end",
    "end-turn-held",
    "resume-stuck",
    "mcp-child",
    "reaped",
    "windows-resume",
    "macos-pair",
  ]);
  assert.ok(HOLD_VERDICTS.includes("shed"));
  assert.ok(HOLD_VERDICTS.includes("reaped"));
  assert.equal(REAPER_FINGERPRINT, "--disallowedTools AskUserQuestion");
  assert.doesNotMatch(IDLE_WORD, /limpet/i);
});

test("living page seeds clamped and names shed idle", () => {
  const html = readPage();
  assert.match(html, /clamped/);
  assert.match(html, /shed/);
  assert.match(html, /41/);
  assert.match(html, /3\.08/);
  assert.match(html, /Idle word:\s*shed/);
  assert.match(html, /#89275/);
  assert.match(html, /#88918/);
  assert.match(html, /#68626/);
  assert.doesNotMatch(html, /Idle word:\s*limpet/i);
  assert.match(html, /Cormorant Garamond/);
  assert.match(html, /Source Sans 3/);
  assert.match(html, /IBM Plex Mono/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /Figtree/);
});
