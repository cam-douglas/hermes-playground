import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CACHE_PATH,
  CHIPS,
  CLI,
  FEATURED_ISSUE,
  FILED_AT,
  HOLD_VERDICTS,
  IDLE_WORD,
  LABELS,
  LOCAL_SKILLS_PATH,
  NAMESPACED_PREFIX,
  NEARBY_BOUNDARY,
  OS,
  PRIMARY_ISSUES,
  SCAN_NOTE,
  TITLE,
  VERDICTS,
  VERSION,
  WORKAROUND_NOTE,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  handle,
  isBlankSignature,
  isRosteredHold,
  looksScanRegress,
  score,
  seedBlank,
  seedCachePresent,
  seedDeferred,
  seedDuplicateWorkaround,
  seedLocalOk,
  seedMenuBlind,
  seedNamespaced,
  seedPostStart,
  seedRostered,
  seedScanRegress,
} from "./callboard.mjs";

function readData(name) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

test("90858 seed is blank/alarm — pre-session miss, Skill() still works", () => {
  const seed = seedBlank();
  const result = score(seed);
  assert.equal(result.verdict, "blank");
  assert.equal(result.blank, true);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.idleWord, "rostered");
  assert.equal(IDLE_WORD, "rostered");
  assert.doesNotMatch(result.idleWord, /callboard|board|cast|^skill$/i);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.preSessionMatch, false);
  assert.equal(seed.postFirstMessageMatch, true);
  assert.equal(seed.cachePresent, true);
  assert.equal(seed.manifestFresh, true);
  assert.equal(seed.localSkillsVisible, true);
  assert.equal(seed.skillCallable, true);
  assert.equal(seed.listSkillsShows, true);
  assert.equal(seed.duplicateEntries, false);
  assert.equal(seed.namespacedPrefix, NAMESPACED_PREFIX);
  assert.equal(analyze(seed).featured, true);
  assert.equal(isBlankSignature(seed), true);
  assert.ok(result.chips.includes("blank"));
  assert.ok(result.chips.includes("deferred"));
  assert.ok(result.chips.includes("cache-present"));
  assert.ok(!result.chips.includes("rostered"));
});

test("rostered seed is rostered/hold — pre-session autocomplete lists the skill", () => {
  const seed = seedRostered();
  const result = score(seed);
  assert.equal(result.verdict, "rostered");
  assert.equal(result.rostered, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.idleWord, "rostered");
  assert.equal(seed.preSessionMatch, true);
  assert.equal(seed.duplicateEntries, false);
  assert.equal(isRosteredHold(seed), true);
  assert.ok(result.chips.includes("rostered"));
});

test("decideSeed covers every named verdict", () => {
  for (const name of VERDICTS) {
    const result = decideSeed(name);
    assert.equal(result.verdict, name, name);
    assert.equal(result.idleWord, "rostered");
    assert.doesNotMatch(result.idleWord, /callboard|^board$|^cast$|^skill$/i);
  }
  assert.equal(decide({ action: "90858" }).verdict, "blank");
  assert.equal(decide({ action: "blank" }).verdict, "blank");
  assert.equal(decide({ action: "rostered" }).verdict, "rostered");
});

test("rule: pre-session miss + callable skill is alarm", () => {
  const ticket = {
    preSessionMatch: false,
    postFirstMessageMatch: true,
    cachePresent: true,
    manifestFresh: true,
    localSkillsVisible: true,
    skillCallable: true,
    listSkillsShows: true,
    namespacedPrefix: "anthropic-skills:",
    outputText: "new-chat slash autocomplete lists nothing for anthropic-skills:*",
  };
  const result = score(ticket);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(ALARM_VERDICTS.includes(result.verdict));
  assert.equal(isBlankSignature(ticket), true);
});

test("rule: pre-session match without duplicate entries is rostered", () => {
  const ticket = {
    preSessionMatch: true,
    postFirstMessageMatch: true,
    cachePresent: true,
    skillCallable: true,
    listSkillsShows: true,
    duplicateEntries: false,
    namespacedPrefix: "anthropic-skills:",
    outputText: "cloud/plugin skills appear in new-chat autocomplete before any message",
  };
  assert.equal(classify(ticket), "rostered");
  assert.equal(score(ticket).hold, true);
});

test("specific alarm classes from the issue facts", () => {
  assert.equal(score(seedDeferred()).verdict, "deferred");
  assert.equal(score(seedCachePresent()).verdict, "cache-present");
  assert.equal(score(seedLocalOk()).verdict, "local-ok");
  assert.equal(score(seedPostStart()).verdict, "post-start");
  assert.equal(score(seedDuplicateWorkaround()).verdict, "duplicate-workaround");
  assert.equal(score(seedNamespaced()).verdict, "namespaced");
  assert.equal(score(seedScanRegress()).verdict, "scan-regress");
  assert.equal(score(seedMenuBlind()).verdict, "menu-blind");
  assert.ok(chipsOf(seedCachePresent()).includes("cache-present"));
  assert.ok(chipsOf(seedLocalOk()).includes("local-ok"));
  assert.ok(chipsOf(seedDuplicateWorkaround()).includes("duplicate-workaround"));
  assert.ok(chipsOf(seedMenuBlind()).includes("menu-blind"));
  assert.equal(looksScanRegress(SCAN_NOTE), true);
  assert.equal(isRosteredHold(seedDuplicateWorkaround()), false);
});

test("local fingerprint files keep issue numbers and #90858 facts only", () => {
  const primary = readData("90858.json");
  const hold = readData("rostered.json");
  const cache = readData("cache-present.json");
  const local = readData("local-ok.json");
  const post = readData("post-start.json");
  const dupe = readData("duplicate-workaround.json");
  const named = readData("namespaced.json");
  const prints = readData("fingerprints.json");
  const chips = readData("chips.json");
  assert.equal(primary.issue, 90858);
  assert.equal(primary.preSessionMatch, false);
  assert.equal(primary.postFirstMessageMatch, true);
  assert.equal(primary.cachePresent, true);
  assert.equal(primary.skillCallable, true);
  assert.equal(score(primary).verdict, "blank");
  assert.equal(hold.issue, 90858);
  assert.equal(score(hold).verdict, "rostered");
  assert.equal(score(cache).verdict, "cache-present");
  assert.equal(score(local).verdict, "local-ok");
  assert.equal(score(post).verdict, "post-start");
  assert.equal(score(dupe).verdict, "duplicate-workaround");
  assert.equal(score(named).verdict, "namespaced");
  assert.equal(prints.primary[0].issue, 90858);
  assert.equal(prints.idleWord, "rostered");
  assert.deepEqual(
    prints.primary.map((row) => row.issue),
    [...PRIMARY_ISSUES],
  );
  assert.equal(FILED_AT, "2026-08-30T23:41:14Z");
  assert.equal(TITLE, primary.title);
  assert.deepEqual(
    [...LABELS],
    ["has repro", "platform:macos", "regression", "area:skills", "area:plugins"],
  );
  assert.ok(Array.isArray(chips.seeds));
  for (const name of ALARM_VERDICTS) {
    assert.ok(
      chips.seeds.some((row) => row.seed === name),
      name,
    );
  }
});

test("handle alarms on blank and allows rostered", async () => {
  const fail = await handle(seedBlank());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#90858/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedRostered());
  assert.equal(hold.rostered, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /rostered/i);
});

test("verdict and chip lists; idle is never callboard / board / cast / skill", () => {
  assert.deepEqual(VERDICTS, [
    "rostered",
    "blank",
    "deferred",
    "cache-present",
    "local-ok",
    "post-start",
    "duplicate-workaround",
    "namespaced",
    "scan-regress",
    "menu-blind",
  ]);
  assert.ok(CHIPS.includes("blank"));
  assert.ok(HOLD_VERDICTS.includes("rostered"));
  assert.ok(!HOLD_VERDICTS.includes("callboard"));
  assert.doesNotMatch(IDLE_WORD, /callboard|^board$|^cast$|^skill$/i);
  assert.equal(CLI, "2.1.169");
  assert.equal(OS, "Darwin 24.6.0");
  assert.equal(VERSION, "1.40609.0");
  assert.equal(NAMESPACED_PREFIX, "anthropic-skills:");
  assert.match(CACHE_PATH, /skills-plugin/);
  assert.equal(LOCAL_SKILLS_PATH, "~/.claude/skills");
  assert.deepEqual([...NEARBY_BOUNDARY], [82732]);
  assert.match(SCAN_NOTE, /2\.1\.161/);
  assert.match(WORKAROUND_NOTE, /TWO autocomplete entries/);
});

test("living page seeds blank and names rostered idle", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*rostered/);
  assert.match(html, /rostered/);
  assert.match(html, /blank/);
  assert.match(html, /deferred/);
  assert.match(html, /cache-present/);
  assert.match(html, /local-ok/);
  assert.match(html, /post-start/);
  assert.match(html, /duplicate-workaround/);
  assert.match(html, /namespaced/);
  assert.match(html, /scan-regress/);
  assert.match(html, /menu-blind/);
  assert.match(html, /#90858/);
  assert.match(html, /#82732/);
  assert.match(html, /10:50 Sydney · callboard/);
  assert.match(html, /Playfair Display/);
  assert.match(html, /DM Sans/);
  assert.match(html, /IBM Plex Mono/);
  assert.match(html, /anthropic-skills:/);
  assert.match(html, /1\.40609\.0/);
  assert.match(html, /2\.1\.169/);
  assert.match(html, /Darwin 24\.6\.0/);
  assert.match(html, /skills-plugin/);
  assert.doesNotMatch(html, /Idle word:\s*callboard/i);
  assert.doesNotMatch(html, /Idle word:\s*board/i);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Karla/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Teko/);
  assert.doesNotMatch(html, /millimetre/);
  assert.doesNotMatch(html, /bakery maple/);
  assert.doesNotMatch(html, /marble hydra/);
  assert.doesNotMatch(html, /tide-pool/);
});
