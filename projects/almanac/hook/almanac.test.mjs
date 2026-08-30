import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CRON_EXPR,
  FEATURED_ISSUE,
  IDLE_WORD,
  JOB_IDS,
  LINEAR_VERDICTS,
  NEXT_LABEL,
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
  datedOf,
  handle,
  isIdle,
  parseTranscript,
  score,
  seed90804,
  seedAnnual,
  seedControl,
  seedDated,
  seedEmptied,
  seedEnds3d,
  seedFired,
  seedGazetted,
  seedLooped,
  seedNext364d,
  seedNotFound,
  seedOneShotLie,
  seedReset,
  verdictOf,
} from "./index.mjs";

const PRIOR_IDLES =
  /backed|voucher|cued|fresh|engaged|stood|muted|liveried|penned|underwrit|plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|\bmute\b|\bidle\b|silent|flat|kernel|valid|sealed|dry|intact|open|still|loose|even|quiet|cool|latched|upheld|sterling|home|receipted|vouched|^almanac$|^kindling$|^deadband$|^pawl$|^cenotaph$|^fetch$/;

function assertIdleNeverFailure(result) {
  assert.equal(result.idleWord, "dated");
  assert.equal(IDLE_WORD, "dated");
  assert.doesNotMatch(result.idleWord, /almanac/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
  if (result.alarm || result.verdict !== "dated") {
    assert.notEqual(result.verdict, "dated");
    assert.equal(result.dated, false);
    assert.equal(result.fresh, false);
  }
}

test("1 seed 90804 panel Loop vs empty ledger is looped, never dated", () => {
  const seed = seedLooped();
  const result = decide(seed);
  assert.equal(result.verdict, "looped");
  assert.equal(result.state, "looped");
  assert.equal(classify(seed), "looped");
  assert.equal(verdictOf(seed), "looped");
  assert.notEqual(result.verdict, "dated");
  assert.equal(result.alarm, true);
  assert.equal(result.dated, false);
  assert.equal(result.fresh, false);
  assert.equal(result.linear, true);
  assertIdleNeverFailure(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.primaryTriad, true);
  assert.equal(result.facts.loopLabel, true);
  assert.equal(result.facts.listEmpty, true);
  assert.equal(result.facts.deleteMiss, true);
  assert.equal(seed90804().cronExpression, CRON_EXPR);
  assert.deepEqual(seed.jobIds, JOB_IDS.slice());
  assert.equal(seed.nextLabel, NEXT_LABEL);
  assert.equal(seed.recurring, false);
});

test("2 idle probe is dated", () => {
  const result = score(emptyProbe());
  assert.equal(result.verdict, "dated");
  assert.equal(result.dated, true);
  assert.equal(result.fresh, true);
  assert.equal(result.alarm, false);
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(datedOf(emptyProbe()), true);
  assert.equal(freshOf(emptyProbe()), true);
  assertIdleNeverFailure(result);
});

test("3 honest reconciled page survives as dated", () => {
  const hold = decide(seedDated());
  assert.equal(hold.verdict, "dated");
  assert.equal(hold.dated, true);
  assert.equal(hold.fresh, true);
  assert.equal(hold.alarm, false);
  assert.equal(hold.facts.honest, true);
  assert.equal(hold.facts.primaryTriad, false);
  assert.equal(seedControl().panelReconciled, true);
  assert.match(feedOf("dated"), /idle word is dated/);
  assert.notEqual(hold.verdict, "looped");
});

test("4 unique nearby seeds win their own class", () => {
  assert.equal(classify(seedAnnual()), "annual");
  assert.equal(classify(seedFired()), "fired");
  assert.equal(classify(seedEmptied()), "emptied");
  assert.equal(classify(seedNotFound()), "not-found");
  assert.equal(classify(seedNext364d()), "next-364d");
  assert.equal(classify(seedEnds3d()), "ends-3d");
  assert.equal(classify(seedOneShotLie()), "one-shot-lie");
  assert.equal(classify(seedGazetted()), "gazetted");
  assert.notEqual(classify(seedAnnual()), "looped");
  assert.notEqual(classify(seedFired()), "dated");
});

test("5 decideSeed and restore land on 90804", () => {
  assert.equal(decideSeed("90804").verdict, "looped");
  assert.equal(decideSeed("looped").verdict, "looped");
  assert.equal(decide({ action: "restore" }).verdict, "looped");
  assert.equal(decide({ action: "dated" }).verdict, "dated");
  assert.equal(decide(seedReset()).verdict, "dated");
  assert.equal(decide(emptyAction("idle")).verdict, "dated");
  assert.equal(decideSeed("not-found").verdict, "not-found");
  assert.equal(decideSeed("one-shot-lie").verdict, "one-shot-lie");
});

test("6 parseTranscript reads 90804 three-signal split", () => {
  const raw = readFileSync(
    fileURLToPath(new URL("../data/90804.jsonl", import.meta.url)),
    "utf8",
  );
  const probe = parseTranscript(raw);
  const result = score(probe);
  assert.equal(probe.panelShowsLoop, true);
  assert.equal(probe.cronListEmpty, true);
  assert.equal(probe.cronDeleteNotFound, true);
  assert.equal(probe.oneShotFired, true);
  assert.equal(probe.recurring, false);
  assert.ok(probe.jobIds.includes("1a6f1a3f"));
  assert.ok(probe.jobIds.includes("92d0877f"));
  assert.equal(result.verdict, "looped");
  assert.equal(result.dated, false);
  assert.equal(result.fresh, false);
  assert.equal(result.alarm, true);
});

test("7 handle alarm on looped; allow on dated", async () => {
  const jammed = await handle(seedLooped());
  assert.equal(jammed.hook_event_name, "Stop");
  assert.match(jammed.hookSpecificOutput.additionalContext, /#90804/);
  assert.equal(jammed.alarm, true);
  assert.equal(jammed.hookSpecificOutput.additionalContext.startsWith("Almanac dated"), false);
  const hold = await handle(seedDated());
  assert.match(hold.hookSpecificOutput.additionalContext, /dated/i);
  assert.equal(hold.dated, true);
  assert.equal(hold.fresh, true);
});

test("8 verdict list, idle word, and forbidden priors", () => {
  assert.deepEqual(VERDICTS, [
    "dated",
    "looped",
    "annual",
    "fired",
    "emptied",
    "not-found",
    "next-364d",
    "ends-3d",
    "one-shot-lie",
    "gazetted",
  ]);
  assert.ok(ALARM_VERDICTS.includes("looped"));
  assert.ok(ALARM_VERDICTS.includes("annual"));
  assert.ok(LINEAR_VERDICTS.includes("looped"));
  assert.ok(!ALARM_VERDICTS.includes("dated"));
  const forbidden = forbiddenIdleWords();
  assert.ok(forbidden.includes("backed"));
  assert.ok(forbidden.includes("voucher"));
  assert.ok(forbidden.includes("almanac"));
  assert.ok(!forbidden.includes("dated"));
  assert.equal(analyze(seedLooped()).primaryTriad, true);
});
