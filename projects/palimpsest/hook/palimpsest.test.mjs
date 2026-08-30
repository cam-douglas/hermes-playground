import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  DEFAULT_TIMEOUT_MS,
  DEMO_REWRITTEN,
  FEATURED_ISSUE,
  IDLE_WORD,
  MODEL_TIMEOUT_MS,
  SAME_CLASS_90726,
  SIGTERM_EXIT,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  isCommandOnly,
  isIdle,
  parseTranscript,
  reasonsOf,
  score,
  seed90725,
  seedBgDropped,
  seedControl,
  seedMergedKeeps,
  seedPartialWrite,
  seedPostRewriteCliff,
  seedReset,
  seedScraped,
  seedSiblingLost,
  seedTimeoutKilled,
  seedTranscriptLies,
  seedUnderwrit,
  siblingsLost,
  underwritOf,
  verdictOf,
} from "./palimpsest.mjs";
import { handle } from "./index.mjs";

const PRIOR_IDLES =
  /plated|collated|unheard|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|empty|mute|idle|silent|^palimpsest$|^escutcheon$|^lacuna$|^ambo$|^spile$|^tappet$|^quoin$|^gaff$/;

function assertIdleNeverPalimpsest(result) {
  assert.equal(result.idleWord, "underwrit");
  assert.equal(IDLE_WORD, "underwrit");
  assert.doesNotMatch(result.idleWord, /palimpsest/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

test("1 seed 90725 scraped is scraped, never underwrit", () => {
  const seed = seedScraped();
  const result = decide(seed);
  assert.equal(result.verdict, "scraped");
  assert.equal(result.state, "scraped");
  assert.equal(classify(seed.palimpsest), "scraped");
  assert.equal(verdictOf(seed.palimpsest), "scraped");
  assert.notEqual(result.verdict, "underwrit");
  assert.equal(result.alarm, true);
  assert.equal(result.scraped, true);
  assert.equal(result.underwrit, false);
  assertIdleNeverPalimpsest(result);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.scrapedTriad, true);
  assert.equal(result.facts.commandOnly, true);
  assert.ok(result.facts.lost.includes("timeout"));
  assert.match(result.feed, /Scraped|command-only|#90725/i);
  assert.equal(decideSeed("scraped").verdict, "scraped");
  assert.equal(decideSeed("90725").verdict, "scraped");
  assert.equal(decide(seed90725()).verdict, "scraped");
});

test("2 idle/empty/{} is underwrit, never the product name, never a prior idle", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.verdict, "underwrit");
  assert.equal(result.alarm, false);
  assert.equal(result.underwrit, true);
  assert.equal(classify({}), "underwrit");
  assert.equal(classify(emptyProbe()), "underwrit");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).underwrit, true);
  assertIdleNeverPalimpsest(result);
  assert.equal(decide({ action: "bail" }).verdict, "underwrit");
  assert.equal(decide({}).verdict, "underwrit");
  assert.equal(decide(seedReset()).verdict, "underwrit");
});

test("3 honest underwrit hold: merge keeps siblings, timeout honored", () => {
  const result = decide(seedUnderwrit());
  assert.equal(result.verdict, "underwrit");
  assert.equal(result.alarm, false);
  assert.equal(result.underwrit, true);
  assert.equal(result.facts.honest, true);
  assert.equal(result.facts.siblingsPreserved, true);
  assert.equal(result.facts.timeoutHonored, true);
  assert.equal(result.facts.observedTimeoutMs, MODEL_TIMEOUT_MS);
  assert.match(result.feed, /Underwrit|siblings preserved|idle word is underwrit/i);
  assert.equal(decideSeed("control").verdict, "underwrit");
  assert.equal(decide(seedControl()).underwrit, true);
  assert.equal(underwritOf(seedUnderwrit().palimpsest), true);
});

test("4 underwrit must not be confused with scraped or a named fail", () => {
  const hold = decide(seedUnderwrit());
  const scraped = decide(seedScraped());
  const sibling = decide(seedSiblingLost());
  assert.equal(hold.verdict, "underwrit");
  assert.equal(scraped.verdict, "scraped");
  assert.equal(sibling.verdict, "sibling-lost");
  assert.notEqual(hold.verdict, scraped.verdict);
  assert.equal(hold.underwrit, true);
  assert.equal(scraped.underwrit, false);
});

test("5 parseTranscript scores command-only rewrite + 2m SIGTERM as scraped", () => {
  const transcript = [
    "PreToolUse hookSpecificOutput.updatedInput:",
    JSON.stringify({ command: DEMO_REWRITTEN }),
    'assistant tool_use timeout: 600000',
    "Command timed out after 2m 0s",
    "exit 143",
    "updatedInput is missing or empty, falling back to original tool input",
  ].join("\n");
  const probe = parseTranscript(transcript);
  assert.equal(isCommandOnly(probe.updatedInput) || siblingsLost(probe.originalInput, probe.updatedInput).includes("timeout"), true);
  const result = score(probe);
  assert.notEqual(result.verdict, "underwrit");
  assert.equal(result.underwrit, false);
  assert.ok(
    result.verdict === "scraped" ||
      result.verdict === "timeout-killed" ||
      result.verdict === "transcript-lies",
  );
});

test("6 nearby flags win their own seeds", () => {
  assert.equal(decide(seedSiblingLost()).verdict, "sibling-lost");
  assert.equal(decide(seedTimeoutKilled()).verdict, "timeout-killed");
  assert.equal(decide(seedTimeoutKilled()).facts.exitCode, SIGTERM_EXIT);
  assert.equal(decide(seedTimeoutKilled()).facts.observedTimeoutMs, DEFAULT_TIMEOUT_MS);
  assert.equal(decide(seedBgDropped()).verdict, "bg-dropped");
  assert.equal(decide(seedPartialWrite()).verdict, "partial-write");
  assert.equal(decide(seedTranscriptLies()).verdict, "transcript-lies");
  assert.equal(decide(seedPostRewriteCliff()).verdict, "post-rewrite-cliff");
  assert.equal(decide(seedPostRewriteCliff()).issue, SAME_CLASS_90726);
  assert.equal(decide(seedMergedKeeps()).verdict, "merged-keeps");
  assert.equal(decide(seedMergedKeeps()).underwrit, false);
  assert.equal(decide(seedMergedKeeps()).alarm, false);
  assert.match(feedOf("post-rewrite-cliff"), /#90726/);
  assert.match(feedOf("merged-keeps"), /timeout honored/i);
});

test("7 admit does not lie: scraped stays scraped; restore shows #90725", () => {
  const admitted = decide({ action: "admit", palimpsest: seedScraped().palimpsest });
  assert.equal(admitted.verdict, "scraped");
  assert.equal(admitted.underwrit, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "scraped");
  assert.equal(restored.facts.scrapedTriad, true);
  assert.equal(decide(seedReset()).verdict, "underwrit");
  assert.equal(decide({ action: "control" }).verdict, "underwrit");
});

test("8 handle deny on scraped, allow on underwrit", async () => {
  const deny = await handle(seedScraped());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "scraped");
  const allow = await handle(seedUnderwrit());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "underwrit");
  const keep = await handle(seedMergedKeeps());
  assert.equal(keep.permissionDecision, "allow");
  assert.equal(keep.verdict, "merged-keeps");
});

test("9 verdicts locked; idle never a banned name; fail chips never underwrit", () => {
  assert.deepEqual(VERDICTS, [
    "underwrit",
    "scraped",
    "sibling-lost",
    "timeout-killed",
    "bg-dropped",
    "partial-write",
    "transcript-lies",
    "post-rewrite-cliff",
    "merged-keeps",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("palimpsest"));
  assert.ok(banned.includes("plated"));
  assert.ok(banned.includes("collated"));
  assert.ok(banned.includes("unheard"));
  assert.ok(banned.includes("escutcheon"));
  assert.ok(banned.includes("lacuna"));
  assert.ok(!banned.includes("underwrit"));
  assert.ok(ALARM_VERDICTS.includes("scraped"));
  assert.ok(!ALARM_VERDICTS.includes("underwrit"));
  assert.ok(!ALARM_VERDICTS.includes("merged-keeps"));
  for (const seed of [
    seedScraped(),
    seedSiblingLost(),
    seedTimeoutKilled(),
    seedBgDropped(),
    seedPartialWrite(),
    seedTranscriptLies(),
    seedPostRewriteCliff(),
    seedMergedKeeps(),
  ]) {
    const result = decide(seed);
    assert.notEqual(result.verdict, "underwrit");
    assert.equal(result.underwrit, false);
  }
});

test("10 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Spile/i);
  assert.match(readme, /NOT \**Tappet/i);
  assert.match(readme, /NOT \**Ambo/i);
  assert.match(readme, /NOT \**Quoin/i);
  assert.match(readme, /NOT \**Gaff/i);
  assert.match(readme, /NOT \**Escutcheon/i);
  assert.match(readme, /NOT \**Lacuna/i);
  assert.match(readme, /underwrit/);
  assert.match(readme, /NEVER use underwrit for a failure/i);
  assert.match(readme, /#90725/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*underwrit\*\*/);
});

test("11 constants cite real issues only", () => {
  assert.equal(FEATURED_ISSUE, 90725);
  assert.equal(SAME_CLASS_90726, 90726);
  assert.match(reasonsOf(seedScraped().palimpsest, "scraped").join("\n"), /#90725/);
  assert.equal(analyze(seedScraped().palimpsest).scrapedTriad, true);
  assert.equal(analyze(seedUnderwrit().palimpsest).honest, true);
});

test("12 JSON probe shape scores original/updated/observed/exit", () => {
  const probe = {
    originalInput: {
      command: "sleep 600",
      timeout: 600000,
      run_in_background: false,
      description: "long parchment scrape",
    },
    updatedInput: { command: "sleep 600 && echo scraped" },
    observedTimeoutMs: 120000,
    exitCode: 143,
    autoBackgrounded: false,
    transcriptShowsTimeout: true,
  };
  const result = score(probe);
  assert.equal(result.verdict, "scraped");
  assert.equal(result.underwrit, false);
  assert.equal(result.alarm, true);
  assert.ok(Array.isArray(result.reasons));
  assert.ok(result.reasons.length > 0);
});
