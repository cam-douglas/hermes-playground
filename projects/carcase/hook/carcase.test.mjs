import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNER,
  CHIPS,
  CLI,
  FEATURED_ISSUE,
  FILED_AT,
  HOLD_VERDICTS,
  IDLE_WORD,
  LABELS,
  NAV_ENTRIES,
  NEARBY_BOUNDARY,
  OS,
  PRIMARY_ISSUES,
  SAME_CLASS,
  SECOND_USER,
  SESSIONS_KILLED,
  STEALTH_LOG,
  STOP_ALL_LOG,
  TITLE,
  UMBRELLA,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  handle,
  isFittedHold,
  isGuttedSignature,
  looksStealthKill,
  score,
  seedChromeOnly,
  seedDummy,
  seedEmptied,
  seedFitted,
  seedGutted,
  seedHollow,
  seedOccupied,
  seedRestoredNav,
  seedStealthKilled,
  seedUnconsented,
} from "./carcase.mjs";

function readData(name) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

test("90867 seed is gutted/alarm — stealth relaunch restored chrome, processes gone", () => {
  const seed = seedGutted();
  const result = score(seed);
  assert.equal(result.verdict, "gutted");
  assert.equal(result.gutted, true);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.idleWord, "fitted");
  assert.equal(IDLE_WORD, "fitted");
  assert.doesNotMatch(result.idleWord, /carcase|cabinet|drawer|update|^window$/i);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.stealthRelaunch, true);
  assert.equal(seed.navRestored, true);
  assert.equal(seed.navEntryCount, 50);
  assert.equal(seed.sessionsKilled, 9);
  assert.equal(seed.processesRestarted, false);
  assert.equal(seed.cardsHealthy, true);
  assert.equal(seed.bannerUnreachable, true);
  assert.equal(seed.machineAwake, true);
  assert.equal(seed.userConsented, false);
  assert.equal(analyze(seed).featured, true);
  assert.equal(isGuttedSignature(seed), true);
  assert.ok(result.chips.includes("gutted"));
  assert.ok(result.chips.includes("hollow"));
  assert.ok(result.chips.includes("stealth-killed"));
  assert.ok(result.chips.includes("chrome-only"));
  assert.ok(result.chips.includes("emptied"));
  assert.ok(result.chips.includes("dummy"));
  assert.ok(!result.chips.includes("fitted"));
  assert.ok(!result.chips.includes("occupied"));
});

test("fitted seed is fitted/hold — drawers in, CLI children still running", () => {
  const seed = seedFitted();
  const result = score(seed);
  assert.equal(result.verdict, "fitted");
  assert.equal(result.fitted, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.idleWord, "fitted");
  assert.equal(seed.processesRestarted, true);
  assert.equal(seed.sessionsKilled, 0);
  assert.equal(isFittedHold(seed), true);
  assert.ok(result.chips.includes("fitted"));
  assert.ok(result.chips.includes("occupied"));
});

test("decideSeed covers every named verdict", () => {
  for (const name of VERDICTS) {
    const result = decideSeed(name);
    assert.equal(result.verdict, name, name);
    assert.equal(result.idleWord, "fitted");
    assert.doesNotMatch(result.idleWord, /carcase|^cabinet$|^drawer$|^update$|^window$/i);
  }
  assert.equal(decide({ action: "90867" }).verdict, "gutted");
  assert.equal(decide({ action: "gutted" }).verdict, "gutted");
  assert.equal(decide({ action: "fitted" }).verdict, "fitted");
});

test("rule: stealth relaunch + cards healthy + processes gone is alarm", () => {
  const ticket = {
    stealthRelaunch: true,
    navRestored: true,
    navEntryCount: 50,
    sessionsKilled: 9,
    processesRestarted: false,
    cardsHealthy: true,
    bannerUnreachable: true,
    machineAwake: true,
    userConsented: false,
    outputText: STEALTH_LOG,
  };
  const result = score(ticket);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(ALARM_VERDICTS.includes(result.verdict));
  assert.equal(isGuttedSignature(ticket), true);
});

test("rule: processesRestarted is fitted", () => {
  const ticket = {
    stealthRelaunch: true,
    navRestored: true,
    navEntryCount: 50,
    sessionsKilled: 0,
    processesRestarted: true,
    cardsHealthy: true,
    bannerUnreachable: false,
    userConsented: true,
    outputText: "sessions actually resume",
  };
  assert.equal(classify(ticket), "fitted");
  assert.equal(score(ticket).hold, true);
});

test("specific alarm classes from the issue facts", () => {
  assert.equal(score(seedHollow()).verdict, "hollow");
  assert.equal(score(seedStealthKilled()).verdict, "stealth-killed");
  assert.equal(score(seedChromeOnly()).verdict, "chrome-only");
  assert.equal(score(seedUnconsented()).verdict, "unconsented");
  assert.equal(score(seedEmptied()).verdict, "emptied");
  assert.equal(score(seedDummy()).verdict, "dummy");
  assert.equal(score(seedOccupied()).verdict, "occupied");
  assert.equal(score(seedOccupied()).hold, true);
  assert.equal(score(seedRestoredNav()).verdict, "restored-nav");
  assert.ok(chipsOf(seedDummy()).includes("dummy"));
  assert.ok(chipsOf(seedEmptied()).includes("emptied"));
  assert.ok(chipsOf(seedUnconsented()).includes("unconsented"));
  assert.ok(chipsOf(seedOccupied()).includes("occupied"));
  assert.equal(looksStealthKill(STOP_ALL_LOG), true);
  assert.equal(isFittedHold(seedGutted()), false);
});

test("local fingerprint files keep issue numbers and #90867 facts only", () => {
  const primary = readData("90867.json");
  const hold = readData("fitted.json");
  const hollow = readData("hollow.json");
  const stealth = readData("stealth-killed.json");
  const chrome = readData("chrome-only.json");
  const unconsented = readData("unconsented.json");
  const emptied = readData("emptied.json");
  const dummy = readData("dummy.json");
  const occupied = readData("occupied.json");
  const restored = readData("restored-nav.json");
  const prints = readData("fingerprints.json");
  const chips = readData("chips.json");
  assert.equal(primary.issue, 90867);
  assert.equal(primary.stealthRelaunch, true);
  assert.equal(primary.processesRestarted, false);
  assert.equal(primary.cardsHealthy, true);
  assert.equal(primary.sessionsKilled, 9);
  assert.equal(primary.navEntryCount, 50);
  assert.equal(score(primary).verdict, "gutted");
  assert.equal(hold.issue, 90867);
  assert.equal(score(hold).verdict, "fitted");
  assert.equal(score(hollow).verdict, "hollow");
  assert.equal(score(stealth).verdict, "stealth-killed");
  assert.equal(score(chrome).verdict, "chrome-only");
  assert.equal(score(unconsented).verdict, "unconsented");
  assert.equal(score(emptied).verdict, "emptied");
  assert.equal(score(dummy).verdict, "dummy");
  assert.equal(score(occupied).verdict, "occupied");
  assert.equal(score(restored).verdict, "restored-nav");
  assert.equal(prints.primary[0].issue, 90867);
  assert.equal(prints.idleWord, "fitted");
  assert.deepEqual(
    prints.primary.map((row) => row.issue),
    [...PRIMARY_ISSUES],
  );
  assert.equal(FILED_AT, "2026-08-31T01:47:30Z");
  assert.equal(TITLE, primary.title);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:desktop"],
  );
  assert.ok(Array.isArray(chips.seeds));
  for (const name of ALARM_VERDICTS) {
    assert.ok(
      chips.seeds.some((row) => row.seed === name),
      name,
    );
  }
});

test("handle alarms on gutted and allows fitted", async () => {
  const fail = await handle(seedGutted());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#90867/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedFitted());
  assert.equal(hold.fitted, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /fitted/i);
});

test("verdict and chip lists; idle is never carcase / cabinet / drawer / update / window", () => {
  assert.deepEqual(VERDICTS, [
    "fitted",
    "gutted",
    "hollow",
    "stealth-killed",
    "chrome-only",
    "unconsented",
    "emptied",
    "dummy",
    "occupied",
    "restored-nav",
  ]);
  assert.ok(CHIPS.includes("gutted"));
  assert.ok(HOLD_VERDICTS.includes("fitted"));
  assert.ok(!HOLD_VERDICTS.includes("carcase"));
  assert.doesNotMatch(IDLE_WORD, /carcase|^cabinet$|^drawer$|^update$|^window$/i);
  assert.equal(CLI, "2.1.246");
  assert.equal(OS, "Windows 11 Pro 10.0.26200 x64");
  assert.equal(VERSION, "1.37937.3");
  assert.equal(NAV_ENTRIES, 50);
  assert.equal(SESSIONS_KILLED, 9);
  assert.equal(UMBRELLA, 90172);
  assert.deepEqual([...SAME_CLASS], [90874, 40969]);
  assert.ok(NEARBY_BOUNDARY.includes(90870));
  assert.ok(NEARBY_BOUNDARY.includes(86556));
  assert.match(BANNER, /computer_unreachable/);
  assert.match(SECOND_USER, /ALREADY RUNNING IN my computer/);
});

test("living page seeds gutted and names fitted idle", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*fitted/);
  assert.match(html, /fitted/);
  assert.match(html, /gutted/);
  assert.match(html, /hollow/);
  assert.match(html, /stealth-killed/);
  assert.match(html, /chrome-only/);
  assert.match(html, /unconsented/);
  assert.match(html, /emptied/);
  assert.match(html, /dummy/);
  assert.match(html, /occupied/);
  assert.match(html, /restored-nav/);
  assert.match(html, /#90867/);
  assert.match(html, /#90874/);
  assert.match(html, /#40969/);
  assert.match(html, /#90172/);
  assert.match(html, /jalalAzhmatkhan/);
  assert.match(html, /11:50 Sydney · carcase/);
  assert.match(html, /Libre Baskerville/);
  assert.match(html, /Atkinson Hyperlegible/);
  assert.match(html, /Red Hat Mono/);
  assert.match(html, /1\.37937\.3/);
  assert.match(html, /2\.1\.246/);
  assert.match(html, /Windows 11 Pro 10\.0\.26200/);
  assert.match(html, /stealth-relaunch/);
  assert.match(html, /local-session-stop-all/);
  assert.match(html, /computer_unreachable/);
  assert.match(html, /9 PTYs stopped/);
  assert.doesNotMatch(html, /Idle word:\s*carcase/i);
  assert.doesNotMatch(html, /Idle word:\s*cabinet/i);
  assert.doesNotMatch(html, /Idle word:\s*drawer/i);
  assert.doesNotMatch(html, /Idle word:\s*manikin/i);
  assert.doesNotMatch(html, /family=Instrument\+Serif/);
  assert.doesNotMatch(html, /family=Nunito/);
  assert.doesNotMatch(html, /family=Spline/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Mono/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Karla/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Teko/);
  assert.doesNotMatch(html, /millimetre/);
  assert.doesNotMatch(html, /bakery maple/);
  assert.doesNotMatch(html, /marble hydra/);
  assert.doesNotMatch(html, /tide-pool/);
  assert.doesNotMatch(html, /glass-eye/);
  assert.doesNotMatch(html, /#6b3a2a/);
});
