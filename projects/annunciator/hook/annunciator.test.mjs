import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BACKGROUND_AGENTS,
  BANNED_NAMES,
  BYPASS_PERMISSIONS,
  CASCADE_WINDOW,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  DIED_ON_429,
  DRIP_SECONDS_MAX,
  DRIP_SECONDS_MIN,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HELPERS,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INTERACTIVE_REPL,
  ISSUE_URL,
  LABELS,
  LOW_PRIORITY_TOKEN,
  MARK,
  MISSING_PAYLOAD_FIELDS,
  NOT_PRODUCTS,
  PARENT_SESSION_STAMP,
  PAYLOAD_FIELDS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  RATE_LIMIT_ERROR,
  REPORTER,
  SEEDED_WORD,
  SKIP_TRANSCRIPT,
  STOPFAILURE_HOOKS,
  STOPFAILURE_MEANING,
  TITLE,
  TWO_N_CASCADE,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isDark,
  isSpurious,
  normalize,
  score,
  seedCousin,
  seedDark,
  seedDelegatedObservationSkip,
  seedFourteenHooksCascade,
  seedHasClearRepro,
  seedHelperForkStopfailure,
  seedHold,
  seedLowPriorityIdleDrip,
  seedMissingQuerySource,
  seedRateLimitNullRetry,
  seedSkipTranscriptFork,
  seedSpurious,
  seedSubagent429Parent,
} from "./annunciator.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./annunciator.mjs", import.meta.url));
}

test("main-turn-only board + helpers unlit → dark", () => {
  const result = analyze({
    boardDark: true,
    mainTurnOnly: true,
    helperForkStopFailure: false,
    subagent429Parent: false,
    lowPriorityIdleDrip: false,
    fourteenHooksCascade: false,
    querySourcePresent: true,
  });
  assert.equal(result.verdict, "dark");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.spurious, false);
  assert.equal(result.dark, true);
  assert.equal(isDark(result.ticket), true);
  assert.equal(isSpurious(result.ticket), false);
});

test("helper fork + parent session stamp + 14 hooks → spurious", () => {
  const result = analyze({
    helperForkStopFailure: true,
    parentSessionStamp: true,
    skipTranscript: true,
    subagent429Parent: true,
    lowPriorityIdleDrip: true,
    fourteenHooksCascade: true,
    missingQuerySource: true,
    stopFailureHooks: 14,
    diedOn429: 7,
    backgroundAgents: 9,
    noTranscriptLine: true,
    hasClearRepro: true,
    boardDark: false,
    mainTurnOnly: false,
  });
  assert.equal(result.verdict, "spurious");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.spurious, true);
  assert.equal(isSpurious(result.ticket), true);
  assert.ok(result.chips.includes("spurious"));
  assert.ok(result.chips.includes("helper-fork-stopfailure"));
  assert.ok(result.chips.includes("fourteen-hooks-cascade"));
  assert.ok(!result.chips.includes("dark"));
});

test("idle dark is a hold; board stays dark until real main turn ends on API error", () => {
  const result = analyze(seedDark());
  assert.equal(result.verdict, "dark");
  assert.equal(result.idleWord, "dark");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.spurious, false);
  assert.equal(result.dark, true);
  assert.ok(result.chips.includes("dark"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("spurious"));
  assert.equal(result.ticket.boardDark, true);
  assert.equal(result.ticket.mainTurnOnly, true);
  assert.equal(result.ticket.helperForkStopFailure, false);
  assert.match(result.contrast.case, /dark/i);
  assert.doesNotMatch(
    result.idleWord,
    /sealed|rebound|fenced|swept|tolled|mute|honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|opened|stalled|fused|forged|attributed/i,
  );
});

test("empty ticket and empty stdin classify dark", () => {
  assert.equal(classify(emptyTicket()), "dark");
  assert.equal(classify(""), "dark");
  assert.equal(classify(null), "dark");
  assert.equal(decideSeed("dark").verdict, "dark");
  assert.equal(decideSeed("open").verdict, "dark");
});

test("seeded spurious #91419 is alarm with helper forks and 14-hook cascade", () => {
  const result = analyze(seedSpurious());
  assert.equal(result.verdict, "spurious");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.spurious, true);
  assert.ok(result.chips.includes("spurious"));
  assert.ok(result.chips.includes("helper-fork-stopfailure"));
  assert.ok(result.chips.includes("subagent-429-parent"));
  assert.ok(result.chips.includes("low-priority-idle-drip"));
  assert.ok(result.chips.includes("fourteen-hooks-cascade"));
  assert.ok(result.chips.includes("missing-query-source"));
  assert.ok(result.chips.includes("skip-transcript-fork"));
  assert.ok(result.chips.includes("rate-limit-null-retry"));
  assert.ok(result.chips.includes("delegated-observation-skip"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("dark"));
  assert.match(result.contrast.case, /spurious/i);
  assert.equal(result.ticket.helperForkStopFailure, true);
  assert.equal(result.ticket.parentSessionStamp, true);
  assert.equal(result.ticket.skipTranscript, true);
  assert.equal(result.ticket.version, VERSION);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.backgroundAgents, BACKGROUND_AGENTS);
  assert.equal(result.ticket.diedOn429, DIED_ON_429);
  assert.equal(result.ticket.stopFailureHooks, STOPFAILURE_HOOKS);
  assert.deepEqual(result.ticket.helpers, [...HELPERS]);
});

test("data fixtures classify dark vs spurious vs named chips", () => {
  assert.equal(classify(readData("dark.json")), "dark");
  assert.equal(classify(readData("spurious.json")), "spurious");
  assert.equal(classify(readData("91419.json")), "spurious");
  assert.equal(classify(readData("helper-fork-stopfailure.json")), "helper-fork-stopfailure");
  assert.equal(classify(readData("subagent-429-parent.json")), "subagent-429-parent");
  assert.equal(classify(readData("low-priority-idle-drip.json")), "low-priority-idle-drip");
  assert.equal(classify(readData("fourteen-hooks-cascade.json")), "fourteen-hooks-cascade");
  assert.equal(classify(readData("missing-query-source.json")), "missing-query-source");
  assert.equal(classify(readData("skip-transcript-fork.json")), "skip-transcript-fork");
  assert.equal(classify(readData("rate-limit-null-retry.json")), "rate-limit-null-retry");
  assert.equal(classify(readData("delegated-observation-skip.json")), "delegated-observation-skip");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("spurious seed is alarm; dark / hold are holds", () => {
  assert.equal(score(seedSpurious()).alarm, true);
  assert.equal(score(seedSpurious()).hold, false);
  assert.equal(score(seedDark()).hold, true);
  assert.equal(score(seedDark()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedHelperForkStopfailure()).alarm, true);
  assert.equal(score(seedFourteenHooksCascade()).alarm, true);
});

test("normalize seeds 91419 without ticket fields", () => {
  const ticket = normalize({ issue: 91419 });
  assert.equal(ticket.helperForkStopFailure, true);
  assert.equal(ticket.parentSessionStamp, true);
  assert.equal(ticket.fourteenHooksCascade, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "spurious");
});

test("score / decide / handle agree on spurious vs dark", () => {
  assert.equal(score(seedSpurious()).verdict, "spurious");
  assert.equal(decide(seedDark()).verdict, "dark");
  const fail = handle(seedSpurious());
  const hold = handle(seedDark());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91419/);
  assert.match(fail.hookSpecificOutput.additionalContext, /StopFailure/);
  assert.match(hold.hookSpecificOutput.additionalContext, /dark/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("spurious").verdict, "spurious");
  assert.equal(decideSeed(91419).verdict, "spurious");
  assert.equal(decideSeed("91419").verdict, "spurious");
  assert.equal(decideSeed("dark").verdict, "dark");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("helper-fork-stopfailure").verdict, "helper-fork-stopfailure");
  assert.equal(decideSeed("fourteen-hooks-cascade").verdict, "fourteen-hooks-cascade");
  assert.equal(decideSeed("missing-query-source").verdict, "missing-query-source");
});

test("CLI scores data files", () => {
  const spurious = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91419.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(spurious.status, 0, spurious.stderr);
  assert.equal(JSON.parse(spurious.stdout).verdict, "spurious");
  assert.equal(JSON.parse(spurious.stdout).alarm, true);

  const dark = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/dark.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(dark.status, 0, dark.stderr);
  assert.equal(JSON.parse(dark.stdout).verdict, "dark");
  assert.equal(JSON.parse(dark.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91419);
  assert.deepEqual([...PRIMARY_ISSUES], [91419]);
  assert.equal(COUSIN_ISSUE, 87972);
  assert.deepEqual([...COUSINS], [87972, 91414, 91408, 91396]);
  assert.deepEqual([...CROSS_ECOSYSTEM], []);
  assert.equal(FILED_AT, "2026-09-02T07:17:32Z");
  assert.equal(REPORTER, "KamilDev");
  assert.equal(VERSION, "Claude Code 2.1.258");
  assert.equal(PLATFORM, "Windows 11");
  assert.equal(BACKGROUND_AGENTS, 9);
  assert.equal(DIED_ON_429, 7);
  assert.equal(STOPFAILURE_HOOKS, 14);
  assert.equal(CASCADE_WINDOW, "about a minute");
  assert.equal(DRIP_SECONDS_MIN, 20);
  assert.equal(DRIP_SECONDS_MAX, 30);
  assert.equal(STOPFAILURE_MEANING, "the turn ended on an API error");
  assert.equal(SKIP_TRANSCRIPT, true);
  assert.equal(PARENT_SESSION_STAMP, "parent session_id");
  assert.equal(RATE_LIMIT_ERROR, "rate_limit");
  assert.deepEqual([...HELPERS], [
    "prompt_suggestion",
    "away_summary",
    "extract_memories",
    "agent_summary",
  ]);
  assert.deepEqual([...PAYLOAD_FIELDS], [
    "error",
    "error_details",
    "last_assistant_message",
  ]);
  assert.deepEqual([...MISSING_PAYLOAD_FIELDS], [
    "querySource",
    "query_source",
    "agent_id",
  ]);
  assert.equal(LOW_PRIORITY_TOKEN, "/low-priority");
  assert.equal(BYPASS_PERMISSIONS, "bypassPermissions");
  assert.equal(INTERACTIVE_REPL, "Interactive REPL");
  assert.equal(TWO_N_CASCADE, "2N");
  assert.equal(IDLE_WORD, "dark");
  assert.equal(SEEDED_WORD, "spurious");
  assert.notEqual(IDLE_WORD, "spurious");
  assert.match(TITLE, /StopFailure fires for internal helper queries/);
  assert.match(ISSUE_URL, /91419/);
  assert.match(PHRASE, /lights for a helper/i);
  assert.match(PHRASE, /admit the turn never ran/);
  assert.match(HUB_LINE, /17:50 annunciator/);
  assert.match(HUB_LINE, /admit the turn never ran/);
  assert.match(MARK, /17:50/);
  assert.match(MARK, /#118/);
  assert.match(MARK, /#91419/);
  assert.match(CONTRAST_NOTE, /STOPFAILURE FALSELY FIRES/);
  assert.match(CONTRAST_NOTE, /parent session_id/i);
  assert.match(CONTRAST_NOTE, /14 HOOKS/i);
  assert.match(CONTRAST_NOTE, /2\.1\.258/);
  assert.match(CONTRAST_NOTE, /Windows/i);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("caisson"));
  assert.ok(NOT_PRODUCTS.includes("spindle"));
  assert.ok(NOT_PRODUCTS.includes("knell"));
  assert.ok(NOT_PRODUCTS.includes("tumbler"));
  assert.ok(NOT_PRODUCTS.includes("escapement"));
  assert.ok(NOT_PRODUCTS.includes("berth"));
  assert.ok(NOT_PRODUCTS.includes("bollard"));
  assert.ok(BANNED_NAMES.includes("Caisson"));
  assert.ok(BANNED_NAMES.includes("Spindle"));
  assert.ok(BANNED_NAMES.includes("Knell"));
  assert.ok(BANNED_NAMES.includes("Tumbler"));
  assert.ok(BANNED_NAMES.includes("Berth"));
  assert.ok(BANNED_NAMES.includes("Bollard"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("area:hooks"));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(HOLD_VERDICTS.includes("dark"));
  assert.ok(ALARM_VERDICTS.includes("spurious"));
  assert.deepEqual([...CHIPS], [...VERDICTS]);
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "dark");
  assert.equal(chips.seededWord, "spurious");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91419);
  assert.equal(fp.cousin, 87972);
  assert.deepEqual(fp.cousins, [87972, 91414, 91408, 91396]);
  assert.equal(fp.reporter, "KamilDev");
  assert.equal(fp.version, "Claude Code 2.1.258");
  assert.equal(fp.platform, "Windows 11");
  assert.equal(fp.backgroundAgents, 9);
  assert.equal(fp.diedOn429, 7);
  assert.equal(fp.stopFailureHooks, 14);
  assert.equal(fp.dripSecondsMin, 20);
  assert.equal(fp.dripSecondsMax, 30);
  assert.deepEqual(fp.helpers, [...HELPERS]);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "spurious");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.helperForkStopFailure, true);
});

test("chipsOf on a raw helper-fork ticket still marks spurious", () => {
  const chips = chipsOf({
    helperForkStopFailure: true,
    parentSessionStamp: true,
    skipTranscript: true,
    fourteenHooksCascade: true,
    stopFailureHooks: 14,
    outputText:
      "spurious; #91419; StopFailure; prompt_suggestion; fourteen StopFailure hooks; parent session_id",
  });
  assert.ok(chips.includes("spurious"));
  assert.ok(chips.includes("helper-fork-stopfailure"));
  assert.ok(chips.includes("fourteen-hooks-cascade"));
  assert.ok(!chips.includes("dark"));
});

test("cousin #87972 is not conflated with spurious primary", () => {
  assert.notEqual(classify(seedCousin()), "spurious");
  assert.notEqual(classify({ issue: 87972 }), "spurious");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /87972|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become spurious", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "spurious", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91419);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedHelperForkStopfailure()).verdict, "helper-fork-stopfailure");
  assert.equal(analyze(seedSubagent429Parent()).verdict, "subagent-429-parent");
  assert.equal(analyze(seedLowPriorityIdleDrip()).verdict, "low-priority-idle-drip");
  assert.equal(analyze(seedFourteenHooksCascade()).verdict, "fourteen-hooks-cascade");
  assert.equal(analyze(seedMissingQuerySource()).verdict, "missing-query-source");
  assert.equal(analyze(seedSkipTranscriptFork()).verdict, "skip-transcript-fork");
  assert.equal(analyze(seedRateLimitNullRetry()).verdict, "rate-limit-null-retry");
  assert.equal(analyze(seedDelegatedObservationSkip()).verdict, "delegated-observation-skip");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.boardDark, true);
  assert.equal(isSpurious(seedDark()), false);
  assert.equal(isSpurious(seedSpurious()), true);
});

test("living page is an Annunciator atelier, idle dark, seeded spurious", () => {
  const html = readPage();
  assert.match(html, /<title>Annunciator/);
  assert.match(html, /Idle word:\s*dark/);
  assert.match(html, /dark/);
  assert.match(html, /spurious/);
  assert.match(html, /helper-fork-stopfailure/);
  assert.match(html, /subagent-429-parent/);
  assert.match(html, /low-priority-idle-drip/);
  assert.match(html, /fourteen-hooks-cascade/);
  assert.match(html, /missing-query-source/);
  assert.match(html, /skip-transcript-fork/);
  assert.match(html, /rate-limit-null-retry/);
  assert.match(html, /delegated-observation-skip/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91419/);
  assert.match(html, /#87972/);
  assert.match(html, /#91414/);
  assert.match(html, /#91408/);
  assert.match(html, /#91396/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /17:50/);
  assert.match(html, /catalog #118/);
  assert.match(html, /StopFailure/);
  assert.match(html, /parent session_id/);
  assert.match(html, /prompt_suggestion/);
  assert.match(html, /away_summary/);
  assert.match(html, /extract_memories/);
  assert.match(html, /agent_summary/);
  assert.match(html, /skipTranscript/);
  assert.match(html, /\/low-priority/);
  assert.match(html, /14/);
  assert.match(html, /20–30|20-30/);
  assert.match(html, /2\.1\.258/);
  assert.match(html, /Windows 11/);
  assert.match(html, /KamilDev/);
  assert.match(html, /query_source|querySource/);
  assert.match(html, /family=Chakra\+Petch|Chakra Petch/);
  assert.match(html, /family=Barlow|Barlow/);
  assert.match(html, /family=Share\+Tech\+Mono|Share Tech Mono/);
  assert.match(html, /Dark the board/);
  assert.match(html, /Pin idle dark/);
  assert.match(html, /Pin seeded spurious/);
  assert.match(html, /Admit the turn never ran/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to dark/);
  assert.match(html, /annunciator|lamp board|false-alarm|window box|steel fascia/i);
  assert.match(html, /STOPFAILURE FALSELY FIRES|helper forks|parent session_id/i);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.match(html, /Stay OFF caisson dry-dock/);
  assert.match(html, /spindle chip-sweep/);
  assert.match(html, /knell mute-bell/);
  assert.match(html, /tumbler keyway/);
  assert.match(html, /escapement pallet/);
  assert.match(html, /carillon peal/);
  assert.match(html, /sluice millrace/);
  assert.match(html, /berth-card clone/);
  assert.match(html, /bollard clone/);
  assert.doesNotMatch(html, /Idle word:\s*spurious/i);
  assert.doesNotMatch(html, /Idle word:\s*sealed/i);
  assert.doesNotMatch(html, /Idle word:\s*rebound/i);
  assert.doesNotMatch(html, /Idle word:\s*fenced/i);
  assert.doesNotMatch(html, /Idle word:\s*swept/i);
  assert.doesNotMatch(html, /Idle word:\s*tolled/i);
  assert.doesNotMatch(html, /Idle word:\s*mute/i);
  assert.doesNotMatch(html, /Pin idle spurious/);
  assert.doesNotMatch(html, /Pin idle sealed/);
  assert.doesNotMatch(html, /Pin idle rebound/);
  assert.doesNotMatch(html, /Score the seal/);
  assert.doesNotMatch(html, /Score the purge/);
  assert.doesNotMatch(html, /Score the mute/);
  assert.doesNotMatch(html, /Score the keyway/);
  assert.doesNotMatch(html, /Score the pallet/);
  assert.doesNotMatch(html, /Score the cross/);
  assert.doesNotMatch(html, /Score the block/);
  assert.doesNotMatch(html, /Score the pin/);
  assert.doesNotMatch(html, /Score the stick/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
  assert.doesNotMatch(html, /family=Zilla\+Slab|Zilla Slab/);
  assert.doesNotMatch(html, /family=Epilogue|Epilogue/);
  assert.doesNotMatch(html, /family=Overpass\+Mono|Overpass Mono/);
  assert.doesNotMatch(html, /family=Cardo|Cardo/);
  assert.doesNotMatch(html, /family=Hind|Hind/);
  assert.doesNotMatch(html, /family=Cousine|Cousine/);
  assert.doesNotMatch(html, /family=Bitter|Bitter/);
  assert.doesNotMatch(html, /family=Karla|Karla/);
  assert.doesNotMatch(html, /family=Inconsolata|Inconsolata/);
  assert.doesNotMatch(html, /family=Young\+Serif|Young Serif/);
  assert.doesNotMatch(html, /family=Figtree|Figtree/);
  assert.doesNotMatch(html, /family=Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(html, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(html, /family=Manrope|Manrope/);
  assert.doesNotMatch(html, /family=Azeret\+Mono|Azeret Mono/);
  assert.doesNotMatch(html, /family=Bodoni/);
  assert.doesNotMatch(html, /family=Jost/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
  assert.doesNotMatch(html, /family=Spectral/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Fira/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Work\+Sans/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=Source\+Code\+Pro/);
  assert.doesNotMatch(html, /family=Literata/);
  assert.doesNotMatch(html, /family=Atkinson/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Syne/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Annunciator, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Annunciator/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /STOPFAILURE FALSELY FIRES FOR INTERNAL HELPER FORKS AND BACKGROUND SUBAGENT 429s ON THE PARENT SESSION_ID/i,
  );
  assert.match(readme, /NOT \*\*Caisson\*\*/);
  assert.match(readme, /NOT \*\*Spindle\*\*/);
  assert.match(readme, /NOT \*\*Knell\*\*/);
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /NOT \*\*Berth\*\*/);
  assert.match(readme, /NOT \*\*Bollard\*\*/);
  assert.match(readme, /Product name stays \*\*Annunciator\*\*/);
  assert.match(readme, /Idle word: \*\*dark\*\*/);
  assert.match(readme, /#87972/);
  assert.match(readme, /#91414/);
  assert.match(readme, /#91408/);
  assert.match(readme, /#91396/);
  assert.match(readme, /StopFailure/);
  assert.match(readme, /parent session_id/);
  assert.match(readme, /prompt_suggestion/);
  assert.match(readme, /14/);
  assert.match(readme, /2\.1\.258/);
  assert.match(readme, /KamilDev/);
  assert.match(readme, /Windows 11/);
  assert.doesNotMatch(readme, /^# Caisson/m);
  assert.doesNotMatch(readme, /^# Spindle/m);
  assert.doesNotMatch(readme, /^# Knell/m);
  assert.doesNotMatch(readme, /^# Tumbler/m);
  assert.doesNotMatch(readme, /^# Escapement/m);
  assert.doesNotMatch(readme, /^# Geneva/m);
  assert.doesNotMatch(readme, /^# Scotch/m);
  assert.doesNotMatch(readme, /^# Fibula/m);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Carillon/m);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
  assert.doesNotMatch(readme, /^# Berth/m);
  assert.doesNotMatch(readme, /^# Bollard/m);
});
