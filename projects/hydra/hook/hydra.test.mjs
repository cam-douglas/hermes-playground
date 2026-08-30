import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  AUTHOR,
  CHIPS,
  CORROBORATORS,
  FEATURED_ISSUE,
  FILED_AT,
  HOLD_VERDICTS,
  IDLE_WORD,
  LABELS,
  OBSERVATIONS,
  OS,
  PRIMARY_ISSUES,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  handle,
  score,
  seedAlreadyAdded,
  seedCloneBack,
  seedDualLedger,
  seedExcised,
  seedKnownAuthoritative,
  seedMinuteLater,
  seedReCloned,
  seedRegrown,
  seedSettingsOnly,
  seedSilentReturn,
} from "./hydra.mjs";

function readData(name) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

test("90856 seed is regrown/alarm — settings cut, known ledger returned, clone back", () => {
  const seed = seedRegrown();
  const result = score(seed);
  assert.equal(result.verdict, "regrown");
  assert.equal(result.regrown, true);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.excised, false);
  assert.equal(result.idleWord, "excised");
  assert.equal(IDLE_WORD, "excised");
  assert.doesNotMatch(result.idleWord, /hydra/i);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.removedFromSettings, true);
  assert.equal(seed.presentInKnown, true);
  assert.equal(seed.cloneExists, true);
  assert.equal(seed.minutesSinceRemoval, 1);
  assert.equal(seed.reAddReportsAlreadyAdded, true);
  assert.equal(seed.knownLastUpdated, "18:03");
  assert.equal(seed.settingsHadEntry, true);
  assert.equal(seed.version, VERSION);
  assert.equal(analyze(seed).regrownPattern, true);
  assert.ok(result.chips.includes("regrown"));
  assert.ok(result.chips.includes("re-cloned"));
  assert.ok(result.chips.includes("clone-back"));
  assert.ok(result.chips.includes("dual-ledger"));
  assert.ok(result.chips.includes("settings-only"));
  assert.ok(result.chips.includes("known-authoritative"));
  assert.ok(result.chips.includes("silent-return"));
  assert.ok(result.chips.includes("already-added"));
  assert.ok(result.chips.includes("minute-later"));
  assert.ok(!result.chips.includes("excised"));
});

test("excised seed is excised/hold — both ledgers and clone gone", () => {
  const result = score(seedExcised());
  assert.equal(result.verdict, "excised");
  assert.equal(result.excised, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.idleWord, "excised");
  assert.equal(analyze(seedExcised()).excised, true);
  assert.ok(result.chips.includes("excised"));
});

test("decideSeed covers every named verdict", () => {
  for (const name of VERDICTS) {
    const result = decideSeed(name);
    assert.equal(result.verdict, name, name);
    assert.equal(result.idleWord, "excised");
    assert.doesNotMatch(result.idleWord, /hydra/i);
  }
  assert.equal(decide({ action: "90856" }).verdict, "regrown");
  assert.equal(decide({ action: "regrown" }).verdict, "regrown");
  assert.equal(decide({ action: "excised" }).verdict, "excised");
});

test("rule: settings gone + known back + clone back is alarm", () => {
  const ticket = {
    removedFromSettings: true,
    presentInKnown: true,
    cloneExists: true,
    minutesSinceRemoval: 1,
    settingsHadEntry: true,
  };
  const result = score(ticket);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(ALARM_VERDICTS.includes(result.verdict));
  assert.equal(analyze(ticket).regrownPattern, true);
});

test("rule: gone from settings AND known AND clone is excised", () => {
  const ticket = {
    removedFromSettings: true,
    presentInKnown: false,
    cloneExists: false,
    settingsHadEntry: true,
  };
  assert.equal(classify(ticket), "excised");
  assert.equal(score(ticket).hold, true);
});

test("specific alarm classes", () => {
  assert.equal(score(seedReCloned()).verdict, "re-cloned");
  assert.equal(score(seedDualLedger()).verdict, "dual-ledger");
  assert.equal(score(seedSettingsOnly()).verdict, "settings-only");
  assert.equal(score(seedKnownAuthoritative()).verdict, "known-authoritative");
  assert.equal(score(seedSilentReturn()).verdict, "silent-return");
  assert.equal(score(seedAlreadyAdded()).verdict, "already-added");
  assert.equal(score(seedMinuteLater()).verdict, "minute-later");
  assert.equal(score(seedCloneBack()).verdict, "clone-back");
  assert.ok(chipsOf(seedReCloned()).includes("re-cloned"));
  assert.ok(chipsOf(seedCloneBack()).includes("clone-back"));
  assert.ok(chipsOf(seedAlreadyAdded()).includes("already-added"));
  assert.ok(chipsOf(seedMinuteLater()).includes("minute-later"));
});

test("local fingerprint files keep issue numbers and #90856 facts only", () => {
  const primary = readData("90856.json");
  const excised = readData("excised.json");
  const prints = readData("fingerprints.json");
  const chips = readData("chips.json");
  assert.equal(primary.issue, 90856);
  assert.equal(primary.removedFromSettings, true);
  assert.equal(primary.presentInKnown, true);
  assert.equal(primary.cloneExists, true);
  assert.equal(primary.minutesSinceRemoval, 1);
  assert.equal(primary.knownLastUpdated, "18:03");
  assert.equal(primary.version, "2.1.247");
  assert.equal(primary.os, "macOS 26.4.1");
  assert.equal(score(primary).verdict, "regrown");
  assert.equal(excised.issue, 90856);
  assert.equal(score(excised).verdict, "excised");
  assert.equal(prints.primary[0].issue, 90856);
  assert.equal(prints.idleWord, "excised");
  assert.deepEqual(
    prints.primary.map((row) => row.issue),
    [...PRIMARY_ISSUES],
  );
  assert.deepEqual(
    prints.corroborators.map((row) => row.issue),
    [...CORROBORATORS],
  );
  assert.equal(prints.primary[0].observations.length, 3);
  assert.equal(prints.primary[0].observations[2].cloneRecreated, "18:17:36");
  assert.equal(AUTHOR, "adamjsimon");
  assert.equal(FILED_AT, "2026-08-30T22:50:05Z");
  assert.equal(TITLE, primary.title);
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:macos", "area:plugins"]);
  assert.ok(Array.isArray(chips.seeds));
  for (const name of ALARM_VERDICTS) {
    assert.ok(
      chips.seeds.some((row) => row.seed === name),
      name,
    );
  }
});

test("handle alarms on regrown and allows excised", async () => {
  const fail = await handle(seedRegrown());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#90856/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedExcised());
  assert.equal(hold.excised, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /excised/i);
});

test("verdict and chip lists; idle is never hydra", () => {
  assert.deepEqual(VERDICTS, [
    "excised",
    "regrown",
    "re-cloned",
    "dual-ledger",
    "settings-only",
    "known-authoritative",
    "silent-return",
    "already-added",
    "minute-later",
    "clone-back",
  ]);
  assert.deepEqual(CHIPS, [...VERDICTS]);
  assert.ok(HOLD_VERDICTS.includes("excised"));
  assert.ok(!HOLD_VERDICTS.includes("hydra"));
  assert.doesNotMatch(IDLE_WORD, /hydra/i);
  assert.deepEqual(
    OBSERVATIONS.map((row) => row.marketplace),
    ["A", "B", "C"],
  );
});

test("living page seeds regrown and names excised idle", () => {
  const html = readPage();
  assert.match(html, /regrown/);
  assert.match(html, /excised/);
  assert.match(html, /Idle word:\s*excised/);
  assert.match(html, /#90856/);
  assert.match(html, /08:50 Sydney · hydra/);
  assert.match(html, /Libre Baskerville/);
  assert.match(html, /DM Sans/);
  assert.match(html, /JetBrains Mono/);
  assert.match(html, /2\.1\.247/);
  assert.match(html, /18:17:36/);
  assert.match(html, /already added/i);
  assert.doesNotMatch(html, /Idle word:\s*hydra/i);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /Figtree/);
  assert.doesNotMatch(html, /Cormorant Garamond/);
  assert.doesNotMatch(html, /millimetre/);
});
