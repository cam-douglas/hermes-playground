import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CONTRAST_85669,
  CONTRAST_PALE,
  DEMO_PRETOOL,
  DEMO_SPECIMENS,
  DEMO_STOP,
  DEMO_TITLE_COUNT,
  DEMO_UPS,
  DEMO_VERSION,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  engagedOf,
  feedOf,
  forbiddenIdleWords,
  handle,
  isIdle,
  parseTranscript,
  score,
  seed90784,
  seedAttachmentDifferent,
  seedContextOrphaned,
  seedControl,
  seedDoubledTitle,
  seedEngaged,
  seedFirstTurnRace,
  seedLogSaidSent,
  seedNoUserError,
  seedOtherHooksFine,
  seedPaleNotThis,
  seedReset,
  seedSessionLifetime,
  seedStickyDelivered,
  seedTranscriptBlank,
  verdictOf,
} from "./index.mjs";

const PRIOR_IDLES =
  /stood|muted|liveried|penned|underwrit|plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|\bmute\b|\bidle\b|silent|flat|kernel|valid|sealed|dry|intact|open|still|loose|even|quiet|cool|latched|upheld|sterling|home|^pawl$|^cenotaph$|^fetch$|^livery$|^pale$|^ambo$|^cotter$/;

function assertIdleNeverFailure(result) {
  assert.equal(result.idleWord, "engaged");
  assert.equal(IDLE_WORD, "engaged");
  assert.doesNotMatch(result.idleWord, /pawl/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

test("1 seed 90784 is doubled-title, never engaged", () => {
  const seed = seedDoubledTitle();
  const result = decide(seed);
  assert.equal(result.verdict, "doubled-title");
  assert.equal(result.state, "doubled-title");
  assert.equal(classify(seed), "doubled-title");
  assert.equal(verdictOf(seed), "doubled-title");
  assert.notEqual(result.verdict, "engaged");
  assert.equal(result.alarm, true);
  assert.equal(result.engaged, false);
  assert.equal(result.linear, true);
  assertIdleNeverFailure(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.primaryTriad, true);
  assert.equal(result.facts.doubled, true);
  assert.equal(result.facts.upsDead, true);
  assert.equal(result.facts.scriptRan, true);
  assert.equal(result.facts.logSent, true);
  assert.equal(result.facts.transcriptBlank, true);
  assert.equal(seed90784().titleRequestCount, DEMO_TITLE_COUNT);
  assert.equal(seed.userPromptSubmitCount, DEMO_UPS);
  assert.equal(seed.preToolUseCount, DEMO_PRETOOL);
  assert.equal(seed.stopCount, DEMO_STOP);
  assert.equal(seed.specimens, DEMO_SPECIMENS);
  assert.equal(seed.version, DEMO_VERSION);
});

test("2 idle probe is engaged", () => {
  const result = score(emptyProbe());
  assert.equal(result.verdict, "engaged");
  assert.equal(result.engaged, true);
  assert.equal(result.alarm, false);
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(engagedOf(emptyProbe()), true);
  assertIdleNeverFailure(result);
});

test("3 honest control is engaged", () => {
  const seed = seedEngaged();
  const result = decide(seed);
  assert.equal(result.verdict, "engaged");
  assert.equal(result.engaged, true);
  assert.equal(result.alarm, false);
  assert.equal(result.facts.honest, true);
  assert.equal(result.facts.primaryTriad, false);
  assert.equal(seedControl().userPromptSubmitFired, true);
  assert.match(feedOf("engaged"), /idle word is engaged/);
});

test("4 unique nearby seeds win their own class", () => {
  assert.equal(classify(seedFirstTurnRace()), "first-turn-race");
  assert.equal(classify(seedStickyDelivered()), "sticky-delivered");
  assert.equal(classify(seedContextOrphaned()), "context-orphaned");
  assert.equal(classify(seedOtherHooksFine()), "other-hooks-fine");
  assert.equal(classify(seedTranscriptBlank()), "transcript-blank");
  assert.equal(classify(seedLogSaidSent()), "log-said-sent");
  assert.equal(classify(seedNoUserError()), "no-user-error");
  assert.equal(classify(seedSessionLifetime()), "session-lifetime");
  assert.equal(classify(seedAttachmentDifferent()), "attachment-different");
  assert.equal(classify(seedPaleNotThis()), "pale-not-this");
  assert.equal(seedAttachmentDifferent().issue, CONTRAST_85669);
  assert.equal(seedPaleNotThis().issue, CONTRAST_PALE);
  assert.notEqual(classify(seedPaleNotThis()), "doubled-title");
  assert.notEqual(classify(seedAttachmentDifferent()), "engaged");
});

test("5 decideSeed and restore land on 90784", () => {
  assert.equal(decideSeed("90784").verdict, "doubled-title");
  assert.equal(decideSeed("doubled-title").verdict, "doubled-title");
  assert.equal(decide({ action: "restore" }).verdict, "doubled-title");
  assert.equal(decide({ action: "engaged" }).verdict, "engaged");
  assert.equal(decide(seedReset()).verdict, "engaged");
  assert.equal(decide(emptyAction("idle")).verdict, "engaged");
  assert.equal(decideSeed("pale-not-this").verdict, "pale-not-this");
  assert.equal(decideSeed("85669").verdict, "attachment-different");
});

test("6 parseTranscript reads doubled title + silent UPS", () => {
  const raw = readFileSync(
    fileURLToPath(new URL("../data/90784.jsonl", import.meta.url)),
    "utf8",
  );
  const probe = parseTranscript(raw);
  const result = score(probe);
  assert.equal(probe.doubledTitleRequest, true);
  assert.ok(probe.titleRequestCount >= 2);
  assert.equal(probe.logSaidAdditionalContext, true);
  assert.equal(probe.hookSpecificOutputInTranscript, false);
  assert.equal(result.verdict, "doubled-title");
  assert.equal(result.engaged, false);
});

test("7 handle alarm on doubled-title; allow on engaged", async () => {
  const jammed = await handle(seedDoubledTitle());
  assert.equal(jammed.hook_event_name, "UserPromptSubmit");
  assert.match(jammed.hookSpecificOutput.additionalContext, /#90784/);
  assert.equal(jammed.alarm, true);
  const hold = await handle(seedEngaged());
  assert.match(hold.hookSpecificOutput.additionalContext, /engaged/i);
  assert.equal(hold.engaged, true);
});

test("8 verdict list, idle word, and forbidden priors", () => {
  assert.deepEqual(VERDICTS, [
    "engaged",
    "doubled-title",
    "first-turn-race",
    "sticky-delivered",
    "context-orphaned",
    "other-hooks-fine",
    "transcript-blank",
    "log-said-sent",
    "no-user-error",
    "session-lifetime",
    "attachment-different",
    "pale-not-this",
  ]);
  assert.ok(ALARM_VERDICTS.includes("doubled-title"));
  assert.ok(LINEAR_VERDICTS.includes("doubled-title"));
  assert.ok(!ALARM_VERDICTS.includes("engaged"));
  const forbidden = forbiddenIdleWords();
  assert.ok(forbidden.includes("stood"));
  assert.ok(forbidden.includes("cenotaph"));
  assert.ok(forbidden.includes("pale"));
  assert.ok(!forbidden.includes("engaged"));
  assert.equal(analyze(seedDoubledTitle()).primaryTriad, true);
});
