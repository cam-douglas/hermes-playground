import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  DEMO_SPECIMENS,
  DEMO_VERSION,
  ECHO_WINDOW_MS,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  PHASE2_DELTA_MS,
  PHASE3_DELTA_MS,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  freshOf,
  handle,
  isIdle,
  parseTranscript,
  score,
  seed90789,
  seedAtomicRename,
  seedCacheStale,
  seedContentAware,
  seedControl,
  seedDebounceMerge,
  seedForeignDropped,
  seedFresh,
  seedFullStringify,
  seedKeyResurrected,
  seedMultiWriter,
  seedPhase2Survive,
  seedReset,
  seedTimeBlind,
  seedWindow5s,
  verdictOf,
} from "./index.mjs";

const PRIOR_IDLES =
  /engaged|stood|muted|liveried|penned|underwrit|plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|\bmute\b|\bidle\b|silent|flat|kernel|valid|sealed|dry|intact|open|still|loose|even|quiet|cool|latched|upheld|sterling|home|^deadband$|^pawl$|^cenotaph$|^fetch$|^livery$|^pinfold$|^palimpsest$|^pale$|^ambo$|^cotter$/;

function assertIdleNeverFailure(result) {
  assert.equal(result.idleWord, "fresh");
  assert.equal(IDLE_WORD, "fresh");
  assert.doesNotMatch(result.idleWord, /deadband/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
  if (result.alarm || result.verdict !== "fresh") {
    assert.notEqual(result.verdict, "fresh");
    assert.equal(result.fresh, false);
  }
}

test("1 seed 90789 phase3 is time-blind, never fresh", () => {
  const seed = seedTimeBlind();
  const result = decide(seed);
  assert.equal(result.verdict, "time-blind");
  assert.equal(result.state, "time-blind");
  assert.equal(classify(seed), "time-blind");
  assert.equal(verdictOf(seed), "time-blind");
  assert.notEqual(result.verdict, "fresh");
  assert.equal(result.alarm, true);
  assert.equal(result.fresh, false);
  assert.equal(result.linear, true);
  assertIdleNeverFailure(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.primaryTriad, true);
  assert.equal(result.facts.timeBlind, true);
  assert.equal(result.facts.inWindow, true);
  assert.equal(result.facts.phase3, true);
  assert.equal(result.facts.clobber, true);
  assert.equal(seed90789().externalEditDeltaMs, PHASE3_DELTA_MS);
  assert.equal(seed.echoWindowMs, ECHO_WINDOW_MS);
  assert.equal(seed.specimens, DEMO_SPECIMENS);
  assert.equal(seed.version, DEMO_VERSION);
});

test("2 idle probe is fresh", () => {
  const result = score(emptyProbe());
  assert.equal(result.verdict, "fresh");
  assert.equal(result.fresh, true);
  assert.equal(result.alarm, false);
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(freshOf(emptyProbe()), true);
  assertIdleNeverFailure(result);
});

test("3 honest phase1 and phase2 survive as fresh", () => {
  const hold = decide(seedFresh());
  assert.equal(hold.verdict, "fresh");
  assert.equal(hold.fresh, true);
  assert.equal(hold.alarm, false);
  assert.equal(hold.facts.honest, true);
  assert.equal(hold.facts.primaryTriad, false);
  assert.equal(seedControl().cacheFresh, true);
  assert.match(feedOf("fresh"), /idle word is fresh/);

  const survive = decide(seedPhase2Survive());
  assert.equal(survive.verdict, "fresh");
  assert.equal(survive.fresh, true);
  assert.equal(survive.facts.phase2, true);
  assert.equal(survive.facts.inWindow, false);
  assert.equal(seedPhase2Survive().externalEditDeltaMs, PHASE2_DELTA_MS);
  assert.notEqual(survive.verdict, "time-blind");
});

test("4 unique nearby seeds win their own class", () => {
  assert.equal(classify(seedContentAware()), "content-aware");
  assert.equal(classify(seedWindow5s()), "window-5s");
  assert.equal(classify(seedCacheStale()), "cache-stale");
  assert.equal(classify(seedForeignDropped()), "foreign-dropped");
  assert.equal(classify(seedKeyResurrected()), "key-resurrected");
  assert.equal(classify(seedDebounceMerge()), "debounce-merge");
  assert.equal(classify(seedFullStringify()), "full-stringify");
  assert.equal(classify(seedAtomicRename()), "atomic-rename");
  assert.equal(classify(seedMultiWriter()), "key-resurrected");
  assert.notEqual(classify(seedContentAware()), "time-blind");
  assert.notEqual(classify(seedAtomicRename()), "fresh");
});

test("5 decideSeed and restore land on 90789", () => {
  assert.equal(decideSeed("90789").verdict, "time-blind");
  assert.equal(decideSeed("time-blind").verdict, "time-blind");
  assert.equal(decide({ action: "restore" }).verdict, "time-blind");
  assert.equal(decide({ action: "fresh" }).verdict, "fresh");
  assert.equal(decide(seedReset()).verdict, "fresh");
  assert.equal(decide(emptyAction("idle")).verdict, "fresh");
  assert.equal(decideSeed("phase2").verdict, "fresh");
  assert.equal(decideSeed("content-aware").verdict, "content-aware");
});

test("6 parseTranscript reads phase3 drop", () => {
  const raw = readFileSync(
    fileURLToPath(new URL("../data/90789.jsonl", import.meta.url)),
    "utf8",
  );
  const probe = parseTranscript(raw);
  const result = score(probe);
  assert.equal(probe.phase, 3);
  assert.equal(probe.timeOnlySuppress, true);
  assert.equal(probe.nextSaveClobber, true);
  assert.equal(result.verdict, "time-blind");
  assert.equal(result.fresh, false);
});

test("7 handle alarm on time-blind; allow on fresh", async () => {
  const jammed = await handle(seedTimeBlind());
  assert.equal(jammed.hook_event_name, "UserPromptSubmit");
  assert.match(jammed.hookSpecificOutput.additionalContext, /#90789/);
  assert.equal(jammed.alarm, true);
  assert.equal(jammed.hookSpecificOutput.additionalContext.startsWith("Deadband fresh"), false);
  const hold = await handle(seedFresh());
  assert.match(hold.hookSpecificOutput.additionalContext, /fresh/i);
  assert.equal(hold.fresh, true);
});

test("8 verdict list, idle word, and forbidden priors", () => {
  assert.deepEqual(VERDICTS, [
    "fresh",
    "time-blind",
    "content-aware",
    "window-5s",
    "cache-stale",
    "foreign-dropped",
    "key-resurrected",
    "debounce-merge",
    "full-stringify",
    "atomic-rename",
  ]);
  assert.ok(ALARM_VERDICTS.includes("time-blind"));
  assert.ok(LINEAR_VERDICTS.includes("time-blind"));
  assert.ok(!ALARM_VERDICTS.includes("fresh"));
  const forbidden = forbiddenIdleWords();
  assert.ok(forbidden.includes("engaged"));
  assert.ok(forbidden.includes("pawl"));
  assert.ok(forbidden.includes("stood"));
  assert.ok(!forbidden.includes("fresh"));
  assert.equal(analyze(seedTimeBlind()).primaryTriad, true);
});
