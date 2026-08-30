import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubTallyLedger,
  linearTallyTicket,
  slackTallyAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_CONTINUE_CWD,
  CODEX_LIFECYCLE,
  CONTRAST_40137,
  CONTRAST_71135,
  CONTRAST_78355,
  CONTRAST_84856,
  DEMO_BIRTH,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneProbe,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  isIdle,
  isOffTally,
  parseTallyJson,
  reasonsOf,
  score,
  seed90692,
  seedBaseFrozen,
  seedBirthCounted,
  seedChalked,
  seedControl,
  seedFalseLoss,
  seedKeepOrLose,
  seedMergedStillN,
  seedOriginZero,
  seedPushBlind,
  seedRemountGrew,
  seedReset,
  seedSquared,
  squaredOf,
  verdictOf,
} from "./tally.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|mute|idle|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|^nested$|^cut$|^switched$|^spilled$|^pale$|^tally$|^notch$|^chalk$|^quittance$|^remanet$|^ledger$|^stumpage$|^docket$|^waybill$|^manifest$|^arrear$|^reckon$|^escrow$|^staddle$|^kerf$|^freeboard$|^plimsoll$|^cadastre$|^bailey$|^soke$|^stile$/;

function assertIdleNeverTally(result) {
  assert.equal(result.idleWord, "squared");
  assert.equal(IDLE_WORD, "squared");
  assert.doesNotMatch(result.idleWord, /tally/i);
  assert.doesNotMatch(IDLE_WORD, /^tally$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.squared, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90692 false-loss is false-loss, slack, linear, idleWord squared, never squared", () => {
  const seed = seedFalseLoss();
  const result = decide(seed);
  assert.equal(result.verdict, "false-loss");
  assert.equal(result.state, "false-loss");
  assert.equal(result.decision, "false-loss");
  assert.equal(classify(seed.tally), "false-loss");
  assert.equal(verdictOf(seed.tally), "false-loss");
  assert.notEqual(result.verdict, "squared");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result["false-loss"], true);
  assert.equal(result.squared, false);
  assertIdleNeverTally(result);
  assert.equal(result.session, "90692-false-loss");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.birthCount, 3);
  assert.equal(result.facts.originCount, 0);
  assert.equal(result.facts.triad, true);
  assert.equal(result.facts.dialogClaimsLoss, true);
  assert.match(result.feed, /False-loss|origin\/main|primary #90692/i);
  assert.match(result.slackCopy, /Tally false-loss · birth 3 · origin 0/);
  assert.equal(decideSeed("false-loss").verdict, "false-loss");
  assert.equal(decideSeed("90692").verdict, "false-loss");
  assert.equal(decideSeed(90692).verdict, "false-loss");
  assert.equal(decide(seed90692()).verdict, "false-loss");
});

test("2 idle/empty/{} is squared, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "squared");
  assert.equal(result.verdict, "squared");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.squared, true);
  assert.equal(classify({}), "squared");
  assert.equal(classify(emptyProbe()), "squared");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).squared, true);
  assertIdleNeverTally(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "squared");
  assert.equal(bailed.idleWord, "squared");
  const empty = decide({});
  assert.equal(empty.verdict, "squared");
  assert.match(empty.feed, /Squared/);
});

test("3 honest squared hold: HEAD == CLAUDE_BASE; birth count 0", () => {
  const result = decide(seedSquared());
  assert.equal(result.verdict, "squared");
  assert.equal(result.alarm, false);
  assert.equal(result.squared, true);
  assert.equal(result.linear, false);
  assert.equal(result.facts.birthCount, 0);
  assert.equal(result.facts.originCount, 0);
  assert.equal(result.facts.head, DEMO_BIRTH);
  assert.equal(result.facts.claudeBase, DEMO_BIRTH);
  assert.match(result.feed, /Squared|HEAD == CLAUDE_BASE|idle word is squared/i);
  assert.equal(decideSeed("control").verdict, "squared");
  assert.equal(decideSeed("healthy").verdict, "squared");
  assert.equal(decide(seedControl()).squared, true);
  assert.equal(squaredOf(seedSquared().tally), true);
});

test("4 squared must not be confused with false-loss, remount-grew, or keep-or-lose", () => {
  const hold = decide(seedSquared());
  const loss = decide(seedFalseLoss());
  const grew = decide(seedRemountGrew());
  const contrast = decide(seedKeepOrLose());
  assert.equal(hold.verdict, "squared");
  assert.equal(loss.verdict, "false-loss");
  assert.equal(grew.verdict, "remount-grew");
  assert.equal(contrast.verdict, "keep-or-lose");
  assert.notEqual(hold.verdict, loss.verdict);
  assert.notEqual(hold.verdict, grew.verdict);
  assert.equal(hold.squared, true);
  assert.equal(loss.squared, false);
  assert.equal(grew.squared, false);
  assert.equal(contrast.squared, false);
});

test("5 remount-grew: ff-only origin/main grew birth count while risk shrank", () => {
  const result = decide(seedRemountGrew());
  assert.equal(result.verdict, "remount-grew");
  assert.equal(result["remount-grew"], true);
  assert.equal(result.squared, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.birthCount, 4);
  assert.equal(result.facts.originCount, 0);
  assert.equal(result.facts.remountGrew, true);
  assert.equal(analyze(seedRemountGrew().tally).triad, false);
  assert.match(result.feed, /Remount-grew|ff-only|grew/i);
});

test("6 merged-still-n: regular merge keeps its own seed", () => {
  const result = decide(seedMergedStillN());
  assert.equal(result.verdict, "merged-still-n");
  assert.equal(result["merged-still-n"], true);
  assert.equal(result.squared, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.merged, true);
  assert.equal(result.facts.nearbyMergedStillN, true);
  assert.notEqual(result.verdict, "false-loss");
  assert.match(result.feed, /Merged-still-n|regular|N>0/i);
});

test("7 push-blind: already on the remote, dialog still chalks birth", () => {
  const result = decide(seedPushBlind());
  assert.equal(result.verdict, "push-blind");
  assert.equal(result["push-blind"], true);
  assert.equal(result.squared, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.pushed, true);
  assert.equal(result.facts.merged, false);
  assert.equal(analyze(seedPushBlind().tally).triad, false);
  assert.match(result.feed, /Push-blind|already on the remote/i);
});

test("8 origin-zero / base-frozen / chalked / birth-counted nearby flags win their own seeds", () => {
  const origin = decide(seedOriginZero());
  assert.equal(origin.verdict, "origin-zero");
  assert.equal(origin["origin-zero"], true);
  assert.equal(origin.squared, false);
  assert.equal(origin.facts.originCount, 0);
  assert.equal(analyze(seedOriginZero().tally).triad, false);

  const frozen = decide(seedBaseFrozen());
  assert.equal(frozen.verdict, "base-frozen");
  assert.equal(frozen["base-frozen"], true);
  assert.equal(frozen.facts.baseFrozen, true);

  const chalked = decide(seedChalked());
  assert.equal(chalked.verdict, "chalked");
  assert.equal(chalked.chalked, true);
  assert.equal(chalked.facts.birthCount, 5);

  const birth = decide(seedBirthCounted());
  assert.equal(birth.verdict, "birth-counted");
  assert.equal(birth["birth-counted"], true);
  assert.equal(birth.facts.baseline, "CLAUDE_BASE");
  assert.match(birth.feed, /Birth-counted|CLAUDE_BASE/i);
});

test("9 keep-or-lose: #84856 squash-ancestry tool is contrast, not this dialog", () => {
  const result = decide(seedKeepOrLose());
  assert.equal(result.verdict, "keep-or-lose");
  assert.equal(result["keep-or-lose"], true);
  assert.equal(result.squared, false);
  assert.equal(result.alarm, false);
  assert.equal(result.issue, CONTRAST_84856);
  assert.equal(isOffTally(seedKeepOrLose().tally), true);
  assert.equal(analyze(seedKeepOrLose().tally).triad, false);
  assert.match(result.feed, /Keep-or-lose|#84856|squash/i);
  assert.equal(decideSeed("84856").verdict, "keep-or-lose");
  assert.equal(decideSeed("squash").verdict, "keep-or-lose");
});

test("10 admit does not lie: false-loss stays false-loss; restore shows #90692", () => {
  const admitted = decide({ action: "admit", tally: seedFalseLoss().tally });
  assert.equal(admitted.verdict, "false-loss");
  assert.equal(admitted.squared, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "false-loss");
  assert.equal(restored.facts.triad, true);
  const reset = decide(seedReset());
  assert.equal(reset.verdict, "squared");
});

test("11 slack + linear fire on alarm verdicts; github ledger on every score", () => {
  for (const kind of SLACK_VERDICTS) {
    assert.ok(ALARM_VERDICTS.includes(kind));
    assert.ok(LINEAR_VERDICTS.includes(kind));
  }
  const loss = decide(seedFalseLoss());
  const slack = slackTallyAlarm(loss, {});
  assert.match(slack.summary, /Would post to Slack/);
  const linear = linearTallyTicket(loss, {});
  assert.match(linear.summary, /Would open a Linear ticket/);
  const github = githubTallyLedger(loss, {});
  assert.match(github.summary, /Would append a GitHub tally-ledger/);
  const hold = decide(seedSquared());
  assert.match(slackTallyAlarm(hold, {}).summary, /Would skip Slack/);
  assert.match(linearTallyTicket(hold, {}).summary, /Would skip Linear/);
});

test("12 fire() demo sinks without secrets", async () => {
  const result = decide(seedFalseLoss());
  const out = await fire(result, {});
  assert.equal(out.events.length, 3);
  assert.equal(out.events[0].adapter, "slack");
  assert.equal(out.events[1].adapter, "github");
  assert.equal(out.events[2].adapter, "linear");
  assert.ok(out.events.every((row) => row.mode === "demo"));
});

test("13 handle deny on false-loss, allow on squared", async () => {
  const deny = await handle(seedFalseLoss());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "false-loss");
  assert.ok(Array.isArray(deny.sinks));
  const allow = await handle(seedSquared());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "squared");
});

test("14 verdicts locked; idle never a banned name", () => {
  assert.deepEqual(VERDICTS, [
    "squared",
    "birth-counted",
    "false-loss",
    "merged-still-n",
    "push-blind",
    "base-frozen",
    "remount-grew",
    "origin-zero",
    "chalked",
    "keep-or-lose",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("tally"));
  assert.ok(banned.includes("notch"));
  assert.ok(banned.includes("bound"));
  assert.ok(!banned.includes("squared"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("15 parseTallyJson + cloneProbe + reasons + feed shapes", () => {
  const parsed = parseTallyJson({ birthCount: 3, originCount: 0, dialogClaimsLoss: true });
  assert.equal(parsed.birthCount, 3);
  assert.equal(parsed.originCount, 0);
  const cloned = cloneProbe({ tally: { birthCount: 1 } });
  assert.equal(cloned.birthCount, 1);
  const reasons = reasonsOf(seedFalseLoss().tally, "false-loss");
  assert.ok(reasons.some((row) => /#90692/.test(row)));
  assert.match(feedOf("squared"), /Squared/);
  assertScoreShape(score(seedFalseLoss().tally));
});

test("16 contrast constants and codex priors exist as citations, not clones", () => {
  assert.equal(CONTRAST_84856, 84856);
  assert.equal(CONTRAST_78355, 78355);
  assert.equal(CONTRAST_40137, 40137);
  assert.equal(CONTRAST_71135, 71135);
  assert.equal(CODEX_LIFECYCLE, 35383);
  assert.equal(CODEX_CONTINUE_CWD, 34352);
  assert.equal(FEATURED_ISSUE, 90692);
});

test("17 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Wicket/i);
  assert.match(readme, /NOT \**Fascia/i);
  assert.match(readme, /NOT \**Berth/i);
  assert.match(readme, /NOT \**Pale/i);
  assert.match(readme, /#84856/);
  assert.match(readme, /squared/);
  assert.match(readme, /NEVER use squared for a failure/i);
  assert.match(readme, /#90692/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*squared\*\*/);
});

test("18 listen health + handle keep-or-lose is allow (contrast, not alarm)", async () => {
  const contrast = await handle(seedKeepOrLose());
  assert.equal(contrast.verdict, "keep-or-lose");
  assert.equal(contrast.permissionDecision, "allow");
  const server = listen(0);
  await new Promise((resolve) => server.close(resolve));
});
