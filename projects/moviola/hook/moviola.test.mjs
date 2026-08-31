import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BURN_AFTER,
  BURN_BEFORE,
  BURN_MULTIPLIER,
  CACHE_CREATION_AFTER,
  CACHE_CREATION_BEFORE,
  CACHE_READ_BEFORE,
  CACHE_READ_FLOOR,
  CHIPS,
  CLI,
  COLLAPSE_AT,
  FEATURED_ISSUE,
  FILED_AT,
  FULL_PAGE_COLLAPSED,
  HOLD_VERDICTS,
  IDLE_WORD,
  IMAGE_TOKEN_WEIGHT,
  LABELS,
  MARK,
  NEARBY_BOUNDARY,
  PAGE_IMAGE_THRESHOLD,
  PHRASE,
  PRIMARY_ISSUES,
  PROMPT_TOTAL_DROP,
  SAME_CLASS,
  TITLE,
  ISSUE_URL,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  cloneTicket,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isLatchedHold,
  isRecutSignature,
  parseUsageJsonl,
  score,
  seedBurned,
  seedCollapsed,
  seedEvicted,
  seedLatched,
  seedMutated,
  seedOneInOneOut,
  seedPrefixRewritten,
  seedRecached,
  seedRecut,
  seedSilent,
} from "./moviola.mjs";

function readData(name) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./moviola.mjs", import.meta.url));
}

test("90716 seed is recut/alarm — earliest images dropped, prefix mutated, full re-cache", () => {
  const seed = seedRecut();
  const result = score(seed);
  assert.equal(result.verdict, "recut");
  assert.equal(result.recut, true);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.idleWord, "latched");
  assert.equal(IDLE_WORD, "latched");
  assert.doesNotMatch(result.idleWord, /moviola|^film$|^trim$|^cache$|^image$|^prefix$/i);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.imageCount, 41);
  assert.equal(seed.prefixMutated, true);
  assert.equal(seed.earliestDropped, true);
  assert.equal(seed.cacheRead, CACHE_READ_FLOOR);
  assert.equal(seed.cacheCreation, CACHE_CREATION_AFTER);
  assert.equal(seed.burnRate, BURN_MULTIPLIER);
  assert.equal(seed.tokensPerHour, BURN_AFTER);
  assert.equal(seed.contextManagement, null);
  assert.equal(analyze(seed).featured, true);
  assert.equal(isRecutSignature(seed), true);
  assert.ok(result.chips.includes("recut"));
  assert.ok(result.chips.includes("collapsed"));
  assert.ok(!result.chips.includes("latched"));
});

test("latched seed is latched/hold — prefix byte-stable, cache_read amortizing", () => {
  const seed = seedLatched();
  const result = score(seed);
  assert.equal(result.verdict, "latched");
  assert.equal(result.latched, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.idleWord, "latched");
  assert.equal(seed.cacheRead, CACHE_READ_BEFORE);
  assert.equal(seed.cacheCreation, CACHE_CREATION_BEFORE);
  assert.equal(seed.imageCount, 24);
  assert.equal(seed.prefixMutated, false);
  assert.equal(isLatchedHold(seed), true);
  assert.ok(result.chips.includes("latched"));
});

test("empty / healthy ticket lands on latched; emptyTicket is the seeded recut", () => {
  assert.equal(score({}).verdict, "latched");
  assert.equal(score({ prefixStable: true, cacheRead: CACHE_READ_BEFORE, cacheCreation: CACHE_CREATION_BEFORE }).verdict, "latched");
  assert.equal(emptyTicket().seed, "recut");
  assert.equal(score(emptyTicket()).verdict, "recut");
  assert.equal(cloneTicket({ cache_read: 26314, prefix_mutated: true, pageImages: 41 }).cacheRead, 26314);
});

test("decideSeed covers every named verdict and 90716 alias", () => {
  for (const name of VERDICTS) {
    const result = decideSeed(name);
    assert.equal(result.verdict, name, name);
    assert.equal(result.idleWord, "latched");
    assert.doesNotMatch(result.idleWord, /moviola|^film$|^trim$|^cache$|^image$|^prefix$/i);
  }
  assert.equal(decide({ action: "90716" }).verdict, "recut");
  assert.equal(decide({ action: "recut" }).verdict, "recut");
  assert.equal(decide({ action: "latched" }).verdict, "latched");
});

test("rule: cache_read floor or ~40 page images with prefix mutation is recut", () => {
  const floor = {
    cacheRead: 26314,
    cacheCreation: 590100,
    prefixMutated: true,
    imageCount: 41,
  };
  const result = score(floor);
  assert.equal(result.verdict, "recut");
  assert.equal(result.alarm, true);
  assert.equal(isRecutSignature(floor), true);

  const crossed = { imageCount: 41, prefixMutated: true, pageImages: 41 };
  assert.equal(classify(crossed), "recut");

  const aliases = {
    cache_read: 26314,
    cache_creation: 590100,
    prefix_mutated: true,
    images: 45,
  };
  assert.equal(score(aliases).verdict, "recut");
});

test("specific alarm classes from the issue facts", () => {
  assert.equal(score(seedMutated()).verdict, "mutated");
  assert.equal(score(seedEvicted()).verdict, "evicted");
  assert.equal(score(seedRecached()).verdict, "recached");
  assert.equal(score(seedBurned()).verdict, "burned");
  assert.equal(score(seedCollapsed()).verdict, "collapsed");
  assert.equal(score(seedSilent()).verdict, "silent");
  assert.equal(score(seedOneInOneOut()).verdict, "one-in-one-out");
  assert.equal(score(seedPrefixRewritten()).verdict, "prefix-rewritten");
  assert.ok(chipsOf(seedCollapsed()).includes("collapsed"));
  assert.ok(chipsOf(seedBurned()).includes("burned"));
  assert.ok(chipsOf(seedEvicted()).includes("evicted"));
  assert.ok(chipsOf(seedOneInOneOut()).includes("one-in-one-out"));
  assert.equal(isLatchedHold(seedRecut()), false);
});

test("local fingerprint files keep issue numbers and #90716 facts only", () => {
  const primary = readData("90716.json");
  const hold = readData("latched.json");
  const recut = readData("recut.json");
  const mutated = readData("mutated.json");
  const evicted = readData("evicted.json");
  const recached = readData("recached.json");
  const burned = readData("burned.json");
  const collapsed = readData("collapsed.json");
  const silent = readData("silent.json");
  const oneOut = readData("one-in-one-out.json");
  const rewritten = readData("prefix-rewritten.json");
  const chips = readData("chips.json");
  assert.equal(primary.issue, 90716);
  assert.equal(primary.prefixMutated, true);
  assert.equal(primary.cacheRead, CACHE_READ_FLOOR);
  assert.equal(primary.cacheCreation, CACHE_CREATION_AFTER);
  assert.equal(score(primary).verdict, "recut");
  assert.equal(hold.issue, 90716);
  assert.equal(score(hold).verdict, "latched");
  assert.equal(score(recut).verdict, "recut");
  assert.equal(score(mutated).verdict, "mutated");
  assert.equal(score(evicted).verdict, "evicted");
  assert.equal(score(recached).verdict, "recached");
  assert.equal(score(burned).verdict, "burned");
  assert.equal(score(collapsed).verdict, "collapsed");
  assert.equal(score(silent).verdict, "silent");
  assert.equal(score(oneOut).verdict, "one-in-one-out");
  assert.equal(score(rewritten).verdict, "prefix-rewritten");
  assert.equal(chips.idleWord, "latched");
  assert.equal(FILED_AT, "2026-08-30T09:40:19Z");
  assert.equal(TITLE, primary.title);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:cost", "area:core"],
  );
  assert.ok(Array.isArray(chips.seeds));
  for (const name of ALARM_VERDICTS) {
    assert.ok(
      chips.seeds.some((row) => row.seed === name),
      name,
    );
  }
});

test("handle alarms on recut and allows latched", async () => {
  const fail = await handle(seedRecut());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#90716/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedLatched());
  assert.equal(hold.latched, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /latched/i);
});

test("CLI stdin JSON and file argument", () => {
  const latched = JSON.stringify({
    seed: "latched",
    prefixMutated: false,
    cacheRead: CACHE_READ_BEFORE,
    cacheCreation: CACHE_CREATION_BEFORE,
    imageCount: 24,
  });
  const piped = spawnSync(process.execPath, [hookPath()], {
    input: latched,
    encoding: "utf8",
  });
  assert.equal(piped.status, 0, piped.stderr);
  const fromStdin = JSON.parse(piped.stdout);
  assert.equal(fromStdin.verdict, "latched");
  assert.equal(fromStdin.hold, true);

  const recutFile = fileURLToPath(new URL("../data/90716.json", import.meta.url));
  const filed = spawnSync(process.execPath, [hookPath(), recutFile], { encoding: "utf8" });
  assert.equal(filed.status, 0, filed.stderr);
  const fromFile = JSON.parse(filed.stdout);
  assert.equal(fromFile.verdict, "recut");
  assert.equal(fromFile.alarm, true);
});

test("session JSONL usage parser detects the floor collapse", () => {
  const jsonl = [
    JSON.stringify({
      type: "assistant",
      message: {
        usage: {
          input_tokens: 80,
          cache_read_input_tokens: 658681,
          cache_creation_input_tokens: 3439,
        },
      },
    }),
    JSON.stringify({
      type: "assistant",
      message: {
        usage: {
          input_tokens: 80,
          cache_read_input_tokens: 26314,
          cache_creation_input_tokens: 590100,
        },
      },
    }),
  ].join("\n");
  const parsed = parseUsageJsonl(jsonl);
  assert.equal(parsed.turns.length, 2);
  assert.equal(parsed.collapsed, true);
  assert.equal(parsed.ticket.cacheRead, 26314);
  assert.equal(parsed.ticket.cacheCreation, 590100);
  assert.equal(score(parsed.ticket).verdict, "recut");
});

test("verdict and chip lists; idle is never moviola / film / trim / cache / image / prefix", () => {
  assert.deepEqual([...VERDICTS], [
    "latched",
    "recut",
    "mutated",
    "evicted",
    "recached",
    "burned",
    "collapsed",
    "silent",
    "one-in-one-out",
    "prefix-rewritten",
  ]);
  assert.ok(CHIPS.includes("recut"));
  assert.ok(HOLD_VERDICTS.includes("latched"));
  assert.ok(!HOLD_VERDICTS.includes("moviola"));
  assert.doesNotMatch(IDLE_WORD, /moviola|^film$|^trim$|^cache$|^image$|^prefix$/i);
  assert.equal(CLI, "2.1.220");
  assert.equal(CACHE_READ_FLOOR, 26314);
  assert.equal(CACHE_READ_BEFORE, 658681);
  assert.equal(CACHE_CREATION_BEFORE, 3439);
  assert.equal(CACHE_CREATION_AFTER, 590100);
  assert.equal(PAGE_IMAGE_THRESHOLD, 40);
  assert.equal(FULL_PAGE_COLLAPSED, 20);
  assert.equal(BURN_MULTIPLIER, 5.7);
  assert.equal(BURN_BEFORE, 12100000);
  assert.equal(BURN_AFTER, 68500000);
  assert.equal(IMAGE_TOKEN_WEIGHT, 3361);
  assert.equal(PROMPT_TOTAL_DROP, 54000);
  assert.deepEqual([...COLLAPSE_AT], [41, 45, 49]);
  assert.deepEqual([...PRIMARY_ISSUES], [90716]);
  assert.deepEqual([...SAME_CLASS], [86075, 89418, 90363, 90675, 35925]);
  assert.ok(NEARBY_BOUNDARY.includes(72226));
  assert.ok(NEARBY_BOUNDARY.includes(61091));
  assert.ok(NEARBY_BOUNDARY.includes(90881));
  assert.ok(NEARBY_BOUNDARY.includes(90802));
  assert.match(PHRASE, /recut print is not a hold/i);
  assert.match(MARK, /12:50/);
  assert.match(ISSUE_URL, /90716/);
});

test("living page seeds recut and names latched idle", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*latched/);
  assert.match(html, /latched/);
  assert.match(html, /recut/);
  assert.match(html, /mutated/);
  assert.match(html, /evicted/);
  assert.match(html, /recached/);
  assert.match(html, /burned/);
  assert.match(html, /collapsed/);
  assert.match(html, /silent/);
  assert.match(html, /one-in-one-out/);
  assert.match(html, /prefix-rewritten/);
  assert.match(html, /#90716/);
  assert.match(html, /#86075/);
  assert.match(html, /#89418/);
  assert.match(html, /#90363/);
  assert.match(html, /#90675/);
  assert.match(html, /35925/);
  assert.match(html, /12:50/);
  assert.match(html, /catalog #86/);
  assert.match(html, /26314/);
  assert.match(html, /658,?681/);
  assert.match(html, /590,?100/);
  assert.match(html, /5\.7/);
  assert.match(html, /Bewelge/);
  assert.match(html, /2\.1\.220/);
  assert.match(html, /Special Elite/);
  assert.match(html, /Source Serif/);
  assert.match(html, /Share Tech Mono/);
  assert.match(html, /REPRINT/);
  assert.match(html, /trim bin/i);
  assert.doesNotMatch(html, /Idle word:\s*moviola/i);
  assert.doesNotMatch(html, /Idle word:\s*film/i);
  assert.doesNotMatch(html, /Idle word:\s*trim/i);
  assert.doesNotMatch(html, /Idle word:\s*cache/i);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Atkinson/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Nunito/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /oak cabinet/);
  assert.doesNotMatch(html, /bakery maple/);
  assert.doesNotMatch(html, /marble hydra/);
  assert.doesNotMatch(html, /stage-door/);
});
