import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CONTRAST_50527,
  CONTRAST_63375,
  CONTRAST_63553,
  CONTRAST_65938,
  CONTRAST_86198,
  DEMO_ASSEMBLED_INDEX,
  DEMO_DISK_DANGLING,
  DEMO_DISK_RESULT,
  DEMO_DISK_USE,
  DEMO_SPECIMENS,
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
  feedOf,
  forbiddenIdleWords,
  handle,
  isIdle,
  parseTranscript,
  reasonsOf,
  score,
  seed90771,
  seedAdvisorKept,
  seedAwaySummary,
  seedBricked,
  seedControl,
  seedDisabledClears,
  seedOnDiskOk,
  seedPairSplit,
  seedRecovered,
  seedReset,
  seedStood,
  seedTeammateInjected,
  seedUseDropped,
  seedVacant,
  seedWidowed,
  stoodOf,
  verdictOf,
} from "./index.mjs";

const PRIOR_IDLES =
  /muted|liveried|penned|underwrit|plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|\bmute\b|\bidle\b|silent|flat|kernel|valid|sealed|dry|intact|open|still|loose|even|quiet|cool|latched|upheld|sterling|home|^cenotaph$|^fetch$|^livery$|^pinfold$|^palimpsest$|^sigil$|^suture$|^coda$|^husk$|^waif$/;

function assertIdleNeverCenotaph(result) {
  assert.equal(result.idleWord, "stood");
  assert.equal(IDLE_WORD, "stood");
  assert.doesNotMatch(result.idleWord, /cenotaph/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

test("1 seed 90771 is widowed (and bricked), never stood", () => {
  const seed = seedWidowed();
  const result = decide(seed);
  assert.equal(result.verdict, "widowed");
  assert.equal(result.state, "widowed");
  assert.equal(classify(seed), "widowed");
  assert.equal(verdictOf(seed), "widowed");
  assert.notEqual(result.verdict, "stood");
  assert.equal(result.alarm, true);
  assert.equal(result.stood, false);
  assert.equal(result.linear, true);
  assertIdleNeverCenotaph(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.widowedTriad, true);
  assert.equal(result.facts.diskOk, true);
  assert.equal(result.facts.useDropped, true);
  assert.equal(result.facts.advisorKept, true);
  assert.equal(result.facts.vacant, true);
  assert.equal(result.facts.bricked, true);
  assert.match(result.feed, /Widowed|#90771/i);
  assert.equal(decideSeed("widowed").verdict, "widowed");
  assert.equal(decideSeed("90771").verdict, "widowed");
  assert.notEqual(decide(seed90771()).verdict, "stood");
  assert.equal(seed.diskUseCount, DEMO_DISK_USE);
  assert.equal(seed.diskResultCount, DEMO_DISK_RESULT);
  assert.equal(seed.diskDangling, DEMO_DISK_DANGLING);
  assert.equal(seed.assembledResultAtMessageIndex, DEMO_ASSEMBLED_INDEX);
  assert.equal(seed.specimens, DEMO_SPECIMENS);
});

test("2 idle/empty/{} is stood, never the product name, never a prior idle", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.verdict, "stood");
  assert.equal(result.alarm, false);
  assert.equal(result.stood, true);
  assert.equal(classify({}), "stood");
  assert.equal(classify(emptyProbe()), "stood");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).stood, true);
  assertIdleNeverCenotaph(result);
  assert.equal(decide({ action: "bail" }).verdict, "stood");
  assert.equal(decide({}).verdict, "stood");
  assert.equal(decide(seedReset()).verdict, "stood");
});

test("3 honest stood hold: assembled pair co-located, no 400", () => {
  const result = decide(seedStood());
  assert.equal(result.verdict, "stood");
  assert.equal(result.alarm, false);
  assert.equal(result.stood, true);
  assert.equal(result.facts.honest, true);
  assert.equal(result.facts.widowedTriad, false);
  assert.equal(result.facts.useDropped, false);
  assert.match(result.feed, /Stood|co-located|idle word is stood/i);
  assert.equal(decideSeed("control").verdict, "stood");
  assert.equal(decide(seedControl()).stood, true);
  assert.equal(stoodOf(seedStood()), true);
});

test("4 stood must not be confused with widowed or a named fail", () => {
  const hold = decide(seedStood());
  const widowed = decide(seedWidowed());
  const bricked = decide(seedBricked());
  assert.equal(hold.verdict, "stood");
  assert.equal(widowed.verdict, "widowed");
  assert.equal(bricked.verdict, "bricked");
  assert.notEqual(hold.verdict, widowed.verdict);
  assert.equal(hold.stood, true);
  assert.equal(widowed.stood, false);
});

test("5 parseTranscript scores 90771 numbers as widowed", () => {
  const transcript = [
    "Orphaned advisor_tool_result after away/return re-assembly",
    "119 tool_use / 119 tool_result, 0 dangling",
    "messages.3.content.0: unexpected tool_use_id found in advisor_tool_result",
    "Each advisor_tool_result block must have a corresponding server_tool_use block before it",
    "server_tool_use dropped from assembled prefix",
    "away_summary between last OK turn and first 400",
    "NO compaction record",
    "session bricked with a 400",
    "cold claude --resume recovers",
    "4 specimens",
    "Claude Code 2.1.251",
    "#90771",
  ].join("\n");
  const probe = parseTranscript(transcript);
  assert.equal(probe.diskUseCount, 119);
  assert.equal(probe.diskResultCount, 119);
  assert.equal(probe.diskDangling, 0);
  assert.equal(probe.assembledHasAdvisorResult, true);
  assert.equal(probe.assembledHasServerToolUse, false);
  const result = score(probe);
  assert.equal(result.verdict, "widowed");
  assert.equal(result.stood, false);
  assert.equal(result.alarm, true);
});

test("6 nearby flags win their own seeds", () => {
  assert.equal(decide(seedBricked()).verdict, "bricked");
  assert.equal(decide(seedAwaySummary()).verdict, "away-summary");
  assert.equal(decide(seedTeammateInjected()).verdict, "teammate-injected");
  assert.equal(decide(seedOnDiskOk()).verdict, "on-disk-ok");
  assert.equal(decide(seedRecovered()).verdict, "recovered");
  assert.equal(decide(seedVacant()).verdict, "vacant");
  assert.equal(decide(seedAdvisorKept()).verdict, "advisor-kept");
  assert.equal(decide(seedUseDropped()).verdict, "use-dropped");
  assert.equal(decide(seedPairSplit()).verdict, "pair-split");
  assert.equal(decide(seedDisabledClears()).verdict, "disabled-clears");
  assert.equal(decide(seedBricked()).stood, false);
  assert.equal(decide(seedBricked()).alarm, true);
  assert.equal(decide(seedOnDiskOk()).alarm, false);
  assert.equal(decide(seedRecovered()).alarm, false);
  assert.equal(decide(seedDisabledClears()).alarm, false);
  assert.match(feedOf("away-summary"), /away_summary|compaction/i);
  assert.match(feedOf("teammate-injected"), /teammate/i);
  assert.match(feedOf("vacant"), /index 3/);
  assert.match(feedOf("use-dropped"), /server_tool_use missing/);
  assert.match(feedOf("pair-split"), /co-located/);
  assert.match(feedOf("disabled-clears"), /disabling the advisor tool/);
});

test("7 admit does not lie: widowed stays widowed; restore shows #90771", () => {
  const admitted = decide({ action: "admit", cenotaph: seedWidowed() });
  assert.equal(admitted.verdict, "widowed");
  assert.equal(admitted.stood, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "widowed");
  assert.equal(restored.facts.widowedTriad, true);
  assert.equal(decide(seedReset()).verdict, "stood");
  assert.equal(decide({ action: "control" }).verdict, "stood");
});

test("8 handle deny on widowed, allow on stood", async () => {
  const deny = await handle(seedWidowed());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "widowed");
  const allow = await handle(seedStood());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "stood");
  const bricked = await handle(seedBricked());
  assert.equal(bricked.permissionDecision, "deny");
  assert.equal(bricked.verdict, "bricked");
  const recovered = await handle(seedRecovered());
  assert.equal(recovered.permissionDecision, "allow");
  assert.equal(recovered.verdict, "recovered");
});

test("9 verdicts locked; idle never a banned name; fail chips never stood", () => {
  assert.deepEqual(VERDICTS, [
    "stood",
    "widowed",
    "bricked",
    "away-summary",
    "teammate-injected",
    "on-disk-ok",
    "recovered",
    "vacant",
    "advisor-kept",
    "use-dropped",
    "pair-split",
    "disabled-clears",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("cenotaph"));
  assert.ok(banned.includes("muted"));
  assert.ok(banned.includes("liveried"));
  assert.ok(banned.includes("penned"));
  assert.ok(banned.includes("underwrit"));
  assert.ok(banned.includes("fetch"));
  assert.ok(banned.includes("sigil"));
  assert.ok(!banned.includes("stood"));
  assert.ok(ALARM_VERDICTS.includes("widowed"));
  assert.ok(ALARM_VERDICTS.includes("bricked"));
  assert.ok(ALARM_VERDICTS.includes("vacant"));
  assert.ok(ALARM_VERDICTS.includes("use-dropped"));
  assert.ok(ALARM_VERDICTS.includes("pair-split"));
  assert.ok(ALARM_VERDICTS.includes("away-summary"));
  assert.ok(ALARM_VERDICTS.includes("teammate-injected"));
  assert.ok(!ALARM_VERDICTS.includes("stood"));
  assert.ok(!ALARM_VERDICTS.includes("on-disk-ok"));
  assert.ok(!ALARM_VERDICTS.includes("recovered"));
  assert.ok(!ALARM_VERDICTS.includes("disabled-clears"));
  assert.deepEqual(LINEAR_VERDICTS, ["widowed", "bricked", "vacant"]);
  for (const seed of [
    seedWidowed(),
    seedBricked(),
    seedAwaySummary(),
    seedTeammateInjected(),
    seedOnDiskOk(),
    seedRecovered(),
    seedVacant(),
    seedAdvisorKept(),
    seedUseDropped(),
    seedPairSplit(),
    seedDisabledClears(),
  ]) {
    const result = decide(seed);
    assert.notEqual(result.verdict, "stood");
    assert.equal(result.stood, false);
  }
});

test("10 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Sigil/i);
  assert.match(readme, /NOT \**Suture/i);
  assert.match(readme, /NOT \**Coda/i);
  assert.match(readme, /NOT \**Husk/i);
  assert.match(readme, /NOT \**Palimpsest/i);
  assert.match(readme, /NOT \**Waif/i);
  assert.match(readme, /NOT \**Fetch/i);
  assert.match(readme, /NOT \**Livery/i);
  assert.match(readme, /NOT \**Pinfold/i);
  assert.match(readme, /stood/);
  assert.match(readme, /NEVER use stood for a failure/i);
  assert.match(readme, /#90771/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*stood\*\*/);
});

test("11 constants cite real issues only", () => {
  assert.equal(FEATURED_ISSUE, 90771);
  assert.equal(CONTRAST_50527, 50527);
  assert.equal(CONTRAST_63375, 63375);
  assert.equal(CONTRAST_65938, 65938);
  assert.equal(CONTRAST_86198, 86198);
  assert.equal(CONTRAST_63553, 63553);
  assert.match(reasonsOf(seedWidowed(), "widowed").join("\n"), /#90771/);
  assert.equal(analyze(seedWidowed()).widowedTriad, true);
  assert.equal(analyze(seedStood()).honest, true);
});

test("12 JSON probe shape scores 90771 widow numbers", () => {
  const probe = {
    diskUseCount: 119,
    diskResultCount: 119,
    diskDangling: 0,
    assembledHasServerToolUse: false,
    assembledHasAdvisorResult: true,
    assembledResultAtMessageIndex: 3,
    awaySummaryBetweenOkAnd400: true,
    teammateInjection: false,
    compactionRecord: false,
    subsequentTurn400: true,
    coldResumeRecovers: true,
    advisorDisabled: false,
    specimens: 4,
    version: "2.1.251",
  };
  const result = score(probe);
  assert.equal(result.verdict, "widowed");
  assert.equal(result.stood, false);
  assert.equal(result.alarm, true);
  assert.ok(Array.isArray(result.reasons));
  assert.ok(result.reasons.length > 0);
  assert.equal(result.facts.bricked, true);
  assert.equal(result.facts.vacant, true);
  assert.equal(result.facts.diskOk, true);
});
