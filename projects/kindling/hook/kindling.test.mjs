import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BUSY_DAY_ON_DISK,
  BUSY_DAY_SWITCHES,
  BUSY_DAY_UNUSED,
  DEMO_VERSION,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  VERDICTS,
  WEEK_UNUSED,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  freshOf,
  cuedOf,
  handle,
  isIdle,
  parseTranscript,
  score,
  seed90798,
  seedControl,
  seedCued,
  seedDeferred,
  seedDiscarded,
  seedHookAsh,
  seedInflated,
  seedLittered,
  seedOtelSkew,
  seedRemapped,
  seedReset,
  seedSessionStart,
  seedSwitchFocus,
  seedWarmed,
  verdictOf,
} from "./index.mjs";

const PRIOR_IDLES =
  /fresh|engaged|stood|muted|liveried|penned|underwrit|plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|\bmute\b|\bidle\b|silent|flat|kernel|valid|sealed|dry|intact|open|still|loose|even|quiet|cool|latched|upheld|sterling|home|^kindling$|^deadband$|^pawl$|^cenotaph$|^fetch$|^livery$|^fob$|^lacuna$|^fusee$|^damper$|^reveille$|^husk$|^wraith$/;

function assertIdleNeverFailure(result) {
  assert.equal(result.idleWord, "cued");
  assert.equal(IDLE_WORD, "cued");
  assert.doesNotMatch(result.idleWord, /kindling/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
  if (result.alarm || result.verdict !== "cued") {
    assert.notEqual(result.verdict, "cued");
    assert.equal(result.cued, false);
    assert.equal(result.fresh, false);
  }
}

test("1 seed 90798 throwaway is discarded, never cued", () => {
  const seed = seedDiscarded();
  const result = decide(seed);
  assert.equal(result.verdict, "discarded");
  assert.equal(result.state, "discarded");
  assert.equal(classify(seed), "discarded");
  assert.equal(verdictOf(seed), "discarded");
  assert.notEqual(result.verdict, "cued");
  assert.equal(result.alarm, true);
  assert.equal(result.cued, false);
  assert.equal(result.fresh, false);
  assert.equal(result.linear, true);
  assertIdleNeverFailure(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.primaryTriad, true);
  assert.equal(result.facts.unused, true);
  assert.equal(result.facts.remapped, true);
  assert.equal(result.facts.warmPreview, true);
  assert.equal(seed90798().unusedCount, BUSY_DAY_UNUSED);
  assert.equal(seed.focusSwitches, BUSY_DAY_SWITCHES);
  assert.equal(seed.cliSessionsOnDisk, BUSY_DAY_ON_DISK);
  assert.equal(seed.unusedWeek, WEEK_UNUSED);
  assert.equal(seed.version, DEMO_VERSION);
});

test("2 idle probe is cued", () => {
  const result = score(emptyProbe());
  assert.equal(result.verdict, "cued");
  assert.equal(result.cued, true);
  assert.equal(result.fresh, true);
  assert.equal(result.alarm, false);
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(cuedOf(emptyProbe()), true);
  assert.equal(freshOf(emptyProbe()), true);
  assertIdleNeverFailure(result);
});

test("3 honest reuse and deferred survive as cued", () => {
  const hold = decide(seedCued());
  assert.equal(hold.verdict, "cued");
  assert.equal(hold.cued, true);
  assert.equal(hold.fresh, true);
  assert.equal(hold.alarm, false);
  assert.equal(hold.facts.honest, true);
  assert.equal(hold.facts.primaryTriad, false);
  assert.equal(seedControl().warmReusesExisting, true);
  assert.match(feedOf("cued"), /idle word is cued/);

  const deferred = decide(seedDeferred());
  assert.equal(deferred.verdict, "cued");
  assert.equal(deferred.cued, true);
  assert.equal(deferred.facts.reuse, true);
  assert.equal(seedDeferred().warmDeferredUntilAttach, true);
  assert.notEqual(deferred.verdict, "discarded");
});

test("4 unique nearby seeds win their own class", () => {
  assert.equal(classify(seedWarmed()), "warmed");
  assert.equal(classify(seedSessionStart()), "session-start");
  assert.equal(classify(seedLittered()), "littered");
  assert.equal(classify(seedInflated()), "inflated");
  assert.equal(classify(seedRemapped()), "remapped");
  assert.equal(classify(seedSwitchFocus()), "switch-focus");
  assert.equal(classify(seedHookAsh()), "hook-ash");
  assert.equal(classify(seedOtelSkew()), "otel-skew");
  assert.notEqual(classify(seedWarmed()), "discarded");
  assert.notEqual(classify(seedInflated()), "cued");
});

test("5 decideSeed and restore land on 90798", () => {
  assert.equal(decideSeed("90798").verdict, "discarded");
  assert.equal(decideSeed("discarded").verdict, "discarded");
  assert.equal(decide({ action: "restore" }).verdict, "discarded");
  assert.equal(decide({ action: "cued" }).verdict, "cued");
  assert.equal(decide(seedReset()).verdict, "cued");
  assert.equal(decide(emptyAction("idle")).verdict, "cued");
  assert.equal(decideSeed("deferred").verdict, "cued");
  assert.equal(decideSeed("otel-skew").verdict, "otel-skew");
});

test("6 parseTranscript reads 90798 throwaway", () => {
  const raw = readFileSync(
    fileURLToPath(new URL("../data/90798.jsonl", import.meta.url)),
    "utf8",
  );
  const probe = parseTranscript(raw);
  const result = score(probe);
  assert.equal(probe.warmLifecyclePreview, true);
  assert.equal(probe.neverUsed, true);
  assert.equal(probe.sessionCountIncremented, true);
  assert.equal(result.verdict, "discarded");
  assert.equal(result.cued, false);
  assert.equal(result.fresh, false);
});

test("7 handle alarm on discarded; allow on cued", async () => {
  const jammed = await handle(seedDiscarded());
  assert.equal(jammed.hook_event_name, "SessionStart");
  assert.match(jammed.hookSpecificOutput.additionalContext, /#90798/);
  assert.equal(jammed.alarm, true);
  assert.equal(jammed.hookSpecificOutput.additionalContext.startsWith("Kindling cued"), false);
  const hold = await handle(seedCued());
  assert.match(hold.hookSpecificOutput.additionalContext, /cued/i);
  assert.equal(hold.cued, true);
  assert.equal(hold.fresh, true);
});

test("8 verdict list, idle word, and forbidden priors", () => {
  assert.deepEqual(VERDICTS, [
    "cued",
    "warmed",
    "discarded",
    "session-start",
    "littered",
    "inflated",
    "remapped",
    "switch-focus",
    "hook-ash",
    "otel-skew",
  ]);
  assert.ok(ALARM_VERDICTS.includes("discarded"));
  assert.ok(LINEAR_VERDICTS.includes("discarded"));
  assert.ok(!ALARM_VERDICTS.includes("cued"));
  const forbidden = forbiddenIdleWords();
  assert.ok(forbidden.includes("fresh"));
  assert.ok(forbidden.includes("deadband"));
  assert.ok(forbidden.includes("kindling"));
  assert.ok(!forbidden.includes("cued"));
  assert.equal(analyze(seedDiscarded()).primaryTriad, true);
});
