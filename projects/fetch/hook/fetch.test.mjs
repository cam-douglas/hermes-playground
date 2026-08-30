import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  DEMO_CAPTURE,
  DEMO_SOURCE,
  DEMO_SUGGESTION,
  FEATURED_ISSUE,
  IDLE_WORD,
  RELATED_78177,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  isIdle,
  looksGhostOnPrompt,
  looksSuggestionSource,
  mutedOf,
  parseTranscript,
  reasonsOf,
  score,
  seed90755,
  seedByteIdentical,
  seedChannelBlind,
  seedControl,
  seedDefaultOn,
  seedFabricated,
  seedFakeApprove,
  seedGhosted,
  seedMuted,
  seedReset,
  seedScraped,
  seedSelfLoop,
  seedSuggestionSource,
  seedUnmarked,
  seedWatchdogFed,
  verdictOf,
} from "./fetch.mjs";
import { handle } from "./index.mjs";

const PRIOR_IDLES =
  /liveried|penned|underwrit|plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|\bmute\b|\bidle\b|silent|flat|^fetch$|^livery$|^pinfold$|^palimpsest$|^escutcheon$|^slype$|^chatelaine$|^fob$|^visa$|^sigil$|^hasp$|^knock$|^pleat$|^byline$|^scrim$|^chute$|^ambo$/;

function assertIdleNeverFetch(result) {
  assert.equal(result.idleWord, "muted");
  assert.equal(IDLE_WORD, "muted");
  assert.doesNotMatch(result.idleWord, /fetch/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

test("1 seed 90755 is ghosted/fabricated, never muted", () => {
  const seed = seedGhosted();
  const result = decide(seed);
  assert.ok(result.verdict === "ghosted" || result.verdict === "fabricated");
  assert.equal(result.state, result.verdict);
  assert.ok(classify(seed.fetch) === "ghosted" || classify(seed.fetch) === "fabricated");
  assert.ok(verdictOf(seed.fetch) === "ghosted" || verdictOf(seed.fetch) === "fabricated");
  assert.notEqual(result.verdict, "muted");
  assert.equal(result.alarm, true);
  assert.equal(result.muted, false);
  assertIdleNeverFetch(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.ghostedTriad, true);
  assert.equal(result.facts.ghostOnPrompt, true);
  assert.match(result.feed, /Ghosted|Fabricated|#90755/i);
  assert.equal(decideSeed("ghosted").verdict, "ghosted");
  assert.equal(decideSeed("90755").verdict, "ghosted");
  assert.notEqual(decide(seed90755()).verdict, "muted");
  assert.equal(decide(seedFabricated()).verdict, "fabricated");
});

test("2 idle/empty/{} is muted, never the product name, never a prior idle", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.verdict, "muted");
  assert.equal(result.alarm, false);
  assert.equal(result.muted, true);
  assert.equal(classify({}), "muted");
  assert.equal(classify(emptyProbe()), "muted");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).muted, true);
  assertIdleNeverFetch(result);
  assert.equal(decide({ action: "bail" }).verdict, "muted");
  assert.equal(decide({}).verdict, "muted");
  assert.equal(decide(seedReset()).verdict, "muted");
});

test("3 honest muted hold: suggestions off or marked, keyed-only", () => {
  const result = decide(seedMuted());
  assert.equal(result.verdict, "muted");
  assert.equal(result.alarm, false);
  assert.equal(result.muted, true);
  assert.equal(result.facts.honest, true);
  assert.equal(result.facts.suggestionsOff, true);
  assert.equal(result.facts.ghostedTriad, false);
  assert.match(result.feed, /Muted|keyed-only|idle word is muted/i);
  assert.equal(decideSeed("control").verdict, "muted");
  assert.equal(decide(seedControl()).muted, true);
  assert.equal(mutedOf(seedMuted().fetch), true);
});

test("4 muted must not be confused with ghosted or a named fail", () => {
  const hold = decide(seedMuted());
  const ghosted = decide(seedGhosted());
  const scraped = decide(seedScraped());
  assert.equal(hold.verdict, "muted");
  assert.equal(ghosted.verdict, "ghosted");
  assert.equal(scraped.verdict, "scraped");
  assert.notEqual(hold.verdict, ghosted.verdict);
  assert.equal(hold.muted, true);
  assert.equal(ghosted.muted, false);
});

test("5 parseTranscript scores ghost + capture-pane + prompt_suggestion as ghosted/fabricated", () => {
  const transcript = [
    "source=prompt_suggestion",
    "promptSuggestionEnabled default on",
    "ghost text on the ❯ input line",
    DEMO_SUGGESTION,
    "tmux capture-pane -p",
    DEMO_CAPTURE,
    "styling is stripped so ghost text is byte-identical",
    "watchdog resubmits stuck input",
    "220+ fabricated user messages",
  ].join("\n");
  const probe = parseTranscript(transcript);
  assert.equal(looksSuggestionSource(probe.suggestionSource), true);
  assert.equal(looksGhostOnPrompt(probe), true);
  const result = score(probe);
  assert.ok(
    result.verdict === "ghosted" ||
      result.verdict === "fabricated" ||
      result.verdict === "watchdog-fed" ||
      result.verdict === "scraped",
  );
  assert.equal(result.muted, false);
  assert.equal(result.alarm, true);
});

test("6 nearby flags win their own seeds", () => {
  assert.equal(decide(seedScraped()).verdict, "scraped");
  assert.equal(decide(seedFabricated()).verdict, "fabricated");
  assert.equal(decide(seedFakeApprove()).verdict, "fake-approve");
  assert.equal(decide(seedSelfLoop()).verdict, "self-loop");
  assert.equal(decide(seedUnmarked()).verdict, "unmarked");
  assert.equal(decide(seedDefaultOn()).verdict, "default-on");
  assert.equal(decide(seedChannelBlind()).verdict, "channel-blind");
  assert.equal(decide(seedByteIdentical()).verdict, "byte-identical");
  assert.equal(decide(seedWatchdogFed()).verdict, "watchdog-fed");
  assert.equal(decide(seedSuggestionSource()).verdict, "suggestion-source");
  assert.equal(decide(seedFabricated()).muted, false);
  assert.equal(decide(seedFabricated()).alarm, true);
  assert.match(feedOf("fake-approve"), /Yes, go ahead|approval/i);
  assert.match(feedOf("suggestion-source"), /prompt_suggestion/);
});

test("7 admit does not lie: ghosted stays ghosted; restore shows #90755", () => {
  const admitted = decide({ action: "admit", fetch: seedGhosted().fetch });
  assert.equal(admitted.verdict, "ghosted");
  assert.equal(admitted.muted, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "ghosted");
  assert.equal(restored.facts.ghostedTriad, true);
  assert.equal(decide(seedReset()).verdict, "muted");
  assert.equal(decide({ action: "control" }).verdict, "muted");
});

test("8 handle deny on ghosted, allow on muted", async () => {
  const deny = await handle(seedGhosted());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "ghosted");
  const allow = await handle(seedMuted());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "muted");
  const fabricated = await handle(seedFabricated());
  assert.equal(fabricated.permissionDecision, "deny");
  assert.equal(fabricated.verdict, "fabricated");
});

test("9 verdicts locked; idle never a banned name; fail chips never muted", () => {
  assert.deepEqual(VERDICTS, [
    "muted",
    "ghosted",
    "scraped",
    "fabricated",
    "fake-approve",
    "self-loop",
    "unmarked",
    "default-on",
    "channel-blind",
    "byte-identical",
    "watchdog-fed",
    "suggestion-source",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("fetch"));
  assert.ok(banned.includes("liveried"));
  assert.ok(banned.includes("penned"));
  assert.ok(banned.includes("underwrit"));
  assert.ok(banned.includes("plated"));
  assert.ok(banned.includes("livery"));
  assert.ok(banned.includes("byline"));
  assert.ok(!banned.includes("muted"));
  assert.ok(ALARM_VERDICTS.includes("ghosted"));
  assert.ok(ALARM_VERDICTS.includes("fabricated"));
  assert.ok(!ALARM_VERDICTS.includes("muted"));
  for (const seed of [
    seedGhosted(),
    seedScraped(),
    seedFabricated(),
    seedFakeApprove(),
    seedSelfLoop(),
    seedUnmarked(),
    seedDefaultOn(),
    seedChannelBlind(),
    seedByteIdentical(),
    seedWatchdogFed(),
    seedSuggestionSource(),
  ]) {
    const result = decide(seed);
    assert.notEqual(result.verdict, "muted");
    assert.equal(result.muted, false);
  }
});

test("10 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Livery/i);
  assert.match(readme, /NOT \**Pinfold/i);
  assert.match(readme, /NOT \**Palimpsest/i);
  assert.match(readme, /NOT \**Escutcheon/i);
  assert.match(readme, /NOT \**Byline/i);
  assert.match(readme, /NOT \**Chatelaine/i);
  assert.match(readme, /NOT \**Slype/i);
  assert.match(readme, /muted/);
  assert.match(readme, /NEVER use muted for a failure/i);
  assert.match(readme, /#90755/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*muted\*\*/);
});

test("11 constants cite real issues only", () => {
  assert.equal(FEATURED_ISSUE, 90755);
  assert.equal(RELATED_78177, 78177);
  assert.match(reasonsOf(seedGhosted().fetch, "ghosted").join("\n"), /#90755/);
  assert.equal(analyze(seedGhosted().fetch).ghostedTriad, true);
  assert.equal(analyze(seedMuted().fetch).honest, true);
});

test("12 JSON probe shape scores suggestion/capture/submit/approval", () => {
  const probe = {
    promptSuggestionEnabled: true,
    suggestionSource: DEMO_SOURCE,
    ghostText: DEMO_SUGGESTION,
    capturePaneText: DEMO_CAPTURE,
    composerMarked: false,
    channelsActive: true,
    recentKeystrokes: false,
    submittedAsUser: true,
    approvalText: DEMO_SUGGESTION,
    watchdogFed: true,
    selfLoop: true,
    fabricatedCount: 220,
    headless: true,
    version: "2.1.251",
  };
  const result = score(probe);
  assert.ok(result.verdict === "ghosted" || result.verdict === "fabricated");
  assert.equal(result.muted, false);
  assert.equal(result.alarm, true);
  assert.ok(Array.isArray(result.reasons));
  assert.ok(result.reasons.length > 0);
});
