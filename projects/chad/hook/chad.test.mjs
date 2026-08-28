import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubChadLedger,
  linearChadTicket,
  slackChadAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  cloneProbe,
  clusterOf,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  carriedOf,
  isIdle,
  punchedOf,
  spoiltOf,
  reasonsOf,
  score,
  seed76616Miscast,
  seed88790Phantom,
  seed90407Punched,
  seedBlank,
  seedCarried,
  seedClear,
  seedDefaulted,
  seedForced,
  seedRubbered,
  seedSpoilt,
  verdictOf,
} from "./chad.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverChad(result) {
  assert.equal(result.idleWord, "spoilt");
  assert.equal(IDLE_WORD, "spoilt");
  assert.doesNotMatch(result.idleWord, /chad/i);
  assert.doesNotMatch(IDLE_WORD, /chad/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(result.idleWord, /laid|unlinked|tight|banked|seised|seated|latched|stocked|roosted/);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.spoilt, "boolean");
  assert.equal(typeof result.punched, "boolean");
  assert.equal(typeof result.carried, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90407 punched is punched, slack, linear, idleWord spoilt", () => {
  const seed = seed90407Punched();
  const result = decide(seed);
  assert.equal(result.verdict, "punched");
  assert.equal(result.state, "punched");
  assert.equal(result.decision, "punched");
  assert.equal(classify(seed.probe), "punched");
  assert.equal(verdictOf(seed.probe), "punched");
  assert.notEqual(result.verdict, "spoilt");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.ballotPunched, true);
  assert.equal(result.ballotSpoilt, false);
  assert.equal(result.spoilt, false);
  assert.equal(result.punched, true);
  assert.equal(result.carried, false);
  assertIdleNeverChad(result);
  assert.equal(result.session, "90407-punched");
  assert.equal(result.issue, 90407);
  assert.equal(result.reportedOption, "You run it (Recommended)");
  assert.equal(result.userNeverChose, true);
  assert.equal(result.userDeniesSelection, true);
  assert.equal(result.assistantActedOnResult, true);
  assert.equal(result.sideEffectLanded, true);
  assert.match(result.feed, /hanging chad|never chose|user denies/i);
  assert.ok(result.cluster.includes("carried"));
  assert.ok(result.cluster.includes("miscast"));
  assert.ok(result.cluster.includes("phantom"));
  assert.ok(result.cluster.includes("forced"));
  assert.ok(result.cluster.includes("defaulted"));
  assert.ok(!result.cluster.includes("punched"));
  assert.ok(!result.cluster.includes("spoilt"));
  assert.equal(decideSeed(90407).verdict, "punched");
  assert.equal(decideSeed("punched").verdict, "punched");
  assert.equal(decideSeed("90407-punched").verdict, "punched");
});

test("2 idle/empty/{} is spoilt, never the product name, never empty, never laid", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "spoilt");
  assert.equal(result.verdict, "spoilt");
  assert.equal(result.decision, "spoilt");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.spoilt, true);
  assert.equal(result.punched, false);
  assert.equal(classify({}), "spoilt");
  assert.equal(classify(emptyProbe()), "spoilt");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverChad(result);
  const seated = decide({ action: "shut" });
  assert.equal(seated.state, "spoilt");
  assert.equal(seated.idleWord, "spoilt");
  assert.equal(seated.reportedOption, "");
  assert.doesNotMatch(seated.state, /chad/i);
  assert.doesNotMatch(seated.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "spoilt");
  assert.equal(empty.idleWord, "spoilt");
});

test("3 blank: question dismissed unanswered", () => {
  const result = decide(seedBlank());
  assert.equal(result.verdict, "blank");
  assert.equal(result.questionDismissedUnanswered, true);
  assert.equal(result.userNeverChose, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /dismissed|unanswered/i);
  assert.equal(decideSeed("blank").verdict, "blank");
});

test("4 carried: assistant acted, side effect landed, no denial", () => {
  const result = decide(seedCarried());
  assert.equal(result.verdict, "carried");
  assert.equal(result.assistantActedOnResult, true);
  assert.equal(result.sideEffectLanded, true);
  assert.equal(result.userNeverChose, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.carried, true);
  assert.match(result.feed, /side effect landed/i);
  assert.equal(decideSeed("carried").verdict, "carried");
});

test("5 miscast #76616: Enter or focus-click submitted Recommended", () => {
  const result = decide(seed76616Miscast());
  assert.equal(result.verdict, "miscast");
  assert.equal(result.issue, 76616);
  assert.equal(result.focusClickSelected, true);
  assert.equal(result.enterWhileTyping, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /focus-click|Enter/i);
  assert.equal(decideSeed(76616).verdict, "miscast");
});

test("6 phantom #88790: result indistinguishable from a human answer", () => {
  const result = decide(seed88790Phantom());
  assert.equal(result.verdict, "phantom");
  assert.equal(result.issue, 88790);
  assert.equal(result.resultIndistinguishableFromHuman, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /provenance is missing/i);
  assert.equal(decideSeed(88790).verdict, "phantom");
});

test("7 rubbered: Recommended default without a deliberate pick", () => {
  const result = decide(seedRubbered());
  assert.equal(result.verdict, "rubbered");
  assert.equal(result.recommendedWasHighlighted, true);
  assert.equal(result.deliberateSelectionVerified, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /rubber-stamp|Recommended default/i);
  assert.equal(decideSeed("rubbered").verdict, "rubbered");
});

test("8 forced: mid-turn message auto-resolved the question", () => {
  const result = decide(seedForced());
  assert.equal(result.verdict, "forced");
  assert.equal(result.midTurnMessageAutoResolved, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.match(result.feed, /mid-turn message/i);
  assert.equal(decideSeed("forced").verdict, "forced");
});

test("9 defaulted: first/Recommended option by accident of UI default", () => {
  const result = decide(seedDefaulted());
  assert.equal(result.verdict, "defaulted");
  assert.equal(result.reportedOption, "You run it (Recommended)");
  assert.equal(result.recommendedWasHighlighted, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /UI default/i);
  assert.equal(decideSeed("defaulted").verdict, "defaulted");
});

test("10 clear: verified deliberate selection with human provenance", () => {
  const result = decide(seedClear());
  assert.equal(result.verdict, "clear");
  assert.equal(result.deliberateSelectionVerified, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /deliberate selection/i);
  assert.equal(decideSeed("clear").verdict, "clear");
});

test("11 spoilt seed is spoilt and never alarms", () => {
  const result = decide(seedSpoilt());
  assert.equal(result.verdict, "spoilt");
  assert.equal(result.reportedOption, "");
  assert.equal(result.spoilt, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Spoilt/);
  assert.equal(decideSeed("spoilt").verdict, "spoilt");
});

test("12 score() idle probe is spoilt and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "spoilt");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.spoilt, true);
  assert.equal(result.punched, false);
  assert.equal(result.carried, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "spoilt",
    "punched",
    "blank",
    "carried",
    "miscast",
    "phantom",
    "rubbered",
    "forced",
    "defaulted",
    "clear",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["punched", "carried", "miscast", "phantom", "forced"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["punched", "carried", "phantom"]);
  assert.equal(IDLE_WORD, "spoilt");
  assert.doesNotMatch(IDLE_WORD, /chad/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /laid|unlinked|tight|banked|seised|seated|latched/);
  assert.doesNotMatch(VERDICTS.join(" "), /chad|unlinked|wraith|kist|knock/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["spoilt", seedSpoilt],
    ["punched", seed90407Punched],
    ["blank", seedBlank],
    ["carried", seedCarried],
    ["miscast", seed76616Miscast],
    ["phantom", seed88790Phantom],
    ["rubbered", seedRubbered],
    ["forced", seedForced],
    ["defaulted", seedDefaulted],
    ["clear", seedClear],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: punched stays punched", () => {
  const result = decide({ ...seed90407Punched(), action: "admit" });
  assert.equal(result.verdict, "punched");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /spoilt/);
  assert.doesNotMatch(result.verdict, /chad$/i);
});

test("16 score / stamp scores punched", () => {
  const result = decide({ ...seed90407Punched(), action: "score" });
  assert.equal(result.verdict, "punched");
  assert.equal(result.action, "score");
  assert.equal(result.userNeverChose, true);
  const stamped = decide({ ...seed90407Punched(), action: "stamp" });
  assert.equal(stamped.verdict, "punched");
  assert.equal(stamped.action, "stamp");
});

test("17 shut / seat / spoilt returns idle spoilt", () => {
  const shut = decide({ ...seed90407Punched(), action: "shut" });
  assert.equal(shut.verdict, "spoilt");
  assert.equal(shut.action, "shut");
  assert.equal(shut.reportedOption, "");
  assert.equal(isIdle(shut.probe), true);
  assertIdleNeverChad(shut);
  const seated = decide({ ...seedCarried(), action: "seat" });
  assert.equal(seated.verdict, "spoilt");
  assert.equal(isIdle(seated.probe), true);
  const spoilt = decide({ ...seedForced(), action: "spoilt" });
  assert.equal(spoilt.verdict, "spoilt");
});

test("18 punch on idle produces punched ballot", () => {
  const result = decide({ action: "punch", probe: emptyProbe() });
  assert.equal(result.verdict, "punched");
  assert.equal(result.action, "punch");
  assert.equal(result.userNeverChose, true);
  assert.equal(result.reportedOption, "You run it (Recommended)");
  assert.equal(result.punched, true);
});

test("19 punch on a blank probe becomes punched", () => {
  const result = decide({ ...seedBlank(), action: "punch" });
  assert.equal(result.verdict, "punched");
  assert.equal(result.action, "punch");
  assert.equal(result.userNeverChose, true);
});

test("20 clear control is the healthy hold, never idle spoilt", () => {
  const result = decide({ ...seed90407Punched(), action: "clear" });
  assert.equal(result.verdict, "clear");
  assert.equal(result.action, "clear");
  assert.equal(result.deliberateSelectionVerified, true);
  assert.equal(result.spoilt, false);
  assert.equal(result.punched, false);
});

test("21 ledger marks the ballot check and does not lie", () => {
  const result = decide({ ...seed90407Punched(), action: "ledger" });
  assert.equal(result.verdict, "punched");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Precinct checked/.test(line)));
});

test("22 observe on blank stays blank", () => {
  const result = decide({ ...seedBlank(), action: "observe" });
  assert.equal(result.verdict, "blank");
  assert.equal(result.observed, true);
  assert.equal(result.questionDismissedUnanswered, true);
});

test("23 punched beats carried when the user never chose", () => {
  assert.equal(
    classify({
      reportedOption: "You run it (Recommended)",
      userNeverChose: true,
      assistantActedOnResult: true,
      sideEffectLanded: true,
    }),
    "punched",
  );
});

test("24 blank beats carried when the question was dismissed unanswered", () => {
  assert.equal(
    classify({
      questionDismissedUnanswered: true,
      assistantActedOnResult: true,
    }),
    "blank",
  );
});

test("25 clear beats carried when deliberate selection is verified", () => {
  assert.equal(
    classify({
      reportedOption: "I'll handle it",
      deliberateSelectionVerified: true,
      assistantActedOnResult: true,
    }),
    "clear",
  );
});

test("26 punched requires a reported option the user denies", () => {
  assert.equal(
    classify({
      userNeverChose: true,
      userDeniesSelection: true,
    }),
    "spoilt",
  );
  assert.equal(
    classify({
      reportedOption: "You run it (Recommended)",
      userNeverChose: true,
    }),
    "punched",
  );
});

test("27 nested ballot / booth / punch / ledger fields clone", () => {
  const probe = cloneProbe({
    ballot: {
      reportedOption: "You run it (Recommended)",
      userNeverChose: true,
    },
  });
  assert.equal(classify(probe), "punched");
  const booth = cloneProbe({
    booth: { questionDismissedUnanswered: true },
  });
  assert.equal(classify(booth), "blank");
});

test("28 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("punched"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("carried"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("miscast"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("phantom"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("forced"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("spoilt"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("blank"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("rubbered"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("defaulted"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("clear"), { slack: false, linear: false, github: true, alarm: false });
});

test("29 spoilt / punched / carried helpers", () => {
  assert.equal(spoiltOf(seed90407Punched().probe), false);
  assert.equal(punchedOf(seed90407Punched().probe), true);
  assert.equal(carriedOf(seed90407Punched().probe), false);
  assert.equal(spoiltOf(emptyProbe()), true);
  assert.equal(carriedOf(seedCarried().probe), true);
  assert.equal(punchedOf(seedCarried().probe), false);
  assert.equal(spoiltOf(seedClear().probe), false);
});

test("30 feed and reasons never use chad or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "spoilt");
  assert.doesNotMatch(idle.feed, /idle word is chad/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.ok(idle.reasons.every((line) => !/idle word is chad/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "spoilt"), /Spoilt/);
  assert.ok(reasonsOf(emptyProbe(), "spoilt").some((line) => /idle word is spoilt/.test(line)));
});

test("31 forbidden idle list includes chad, empty, laid, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("chad"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("laid"));
  assert.ok(words.includes("unlinked"));
  assert.ok(words.includes("tight"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("livery"));
  assert.ok(words.includes("banked"));
  assert.ok(words.includes("knock"));
  assert.ok(words.includes("ballot"));
  assert.ok(!words.includes("spoilt"));
});

test("32 demo sinks: Slack on alarm; Linear on punched/carried/phantom; GitHub always", async () => {
  const punched = decide(seed90407Punched());
  const slack = slackChadAlarm(punched, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubChadLedger(punched, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub chad-ledger/);
  const linear = linearChadTicket(punched, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackChadAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearChadTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(punched, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("33 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const punched = decide(seed90407Punched());
  const slack = slackChadAlarm(punched, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubChadLedger(punched, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearChadTicket(punched, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("34 Slack skip on spoilt / blank / rubbered / defaulted / clear", () => {
  for (const seed of [seedSpoilt, seedBlank, seedRubbered, seedDefaulted, seedClear]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackChadAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("35 Linear only on punched, carried, and phantom", () => {
  assert.equal(decide(seed90407Punched()).linear, true);
  assert.equal(decide(seedCarried()).linear, true);
  assert.equal(decide(seed88790Phantom()).linear, true);
  assert.equal(decide(seed76616Miscast()).linear, false);
  assert.equal(decide(seedForced()).linear, false);
  assert.equal(decide(seedSpoilt()).linear, false);
});

test("36 GitHub ledger fires on idle/shut scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const shut = decide({ action: "shut" });
  assert.equal(shut.github, true);
});

test("37 handle punched / carried / miscast / phantom / forced deny", async () => {
  const punched = await handle(seed90407Punched(), {});
  assert.equal(punched.permissionDecision, "deny");
  assert.match(punched.hookSpecificOutput.decision.message, /punched/);
  const carried = await handle(seedCarried(), {});
  assert.equal(carried.permissionDecision, "deny");
  const miscast = await handle(seed76616Miscast(), {});
  assert.equal(miscast.permissionDecision, "deny");
  const phantom = await handle(seed88790Phantom(), {});
  assert.equal(phantom.permissionDecision, "deny");
  const forced = await handle(seedForced(), {});
  assert.equal(forced.permissionDecision, "deny");
});

test("38 handle spoilt / blank / rubbered / defaulted / clear allow", async () => {
  const idle = await handle({ action: "shut" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /spoilt/);
  const blank = await handle(seedBlank(), {});
  assert.equal(blank.permissionDecision, "allow");
  const rubbered = await handle(seedRubbered(), {});
  assert.equal(rubbered.permissionDecision, "allow");
  const defaulted = await handle(seedDefaulted(), {});
  assert.equal(defaulted.permissionDecision, "allow");
  const cleared = await handle(seedClear(), {});
  assert.equal(cleared.permissionDecision, "allow");
});

test("39 listen GET health and POST empty body is spoilt", async () => {
  const server = listen(19047);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19047/health");
  const info = await health.json();
  assert.equal(info.product, "chad");
  assert.match(info.verbs, /punched/);
  const res = await fetch("http://127.0.0.1:19047/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "spoilt");
  assert.equal(body.idleWord, "spoilt");
  const scored = await fetch("http://127.0.0.1:19047/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90407Punched()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "punched");
  await new Promise((resolve) => server.close(resolve));
});

test("40 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19048);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19048/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19048/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("41 every verdict is uniquely first-match on its seed", () => {
  const map = {
    spoilt: seedSpoilt,
    punched: seed90407Punched,
    blank: seedBlank,
    carried: seedCarried,
    miscast: seed76616Miscast,
    phantom: seed88790Phantom,
    rubbered: seedRubbered,
    forced: seedForced,
    defaulted: seedDefaulted,
    clear: seedClear,
  };
  const seen = new Set();
  for (const [word, seed] of Object.entries(map)) {
    const got = classify(seed().probe);
    assert.equal(got, word, word);
    assert.equal(seen.has(got), false, word);
    seen.add(got);
  }
  assert.equal(seen.size, 10);
});

test("42 admit does not lie on every fault class", () => {
  const rows = [
    ["punched", seed90407Punched],
    ["blank", seedBlank],
    ["carried", seedCarried],
    ["miscast", seed76616Miscast],
    ["phantom", seed88790Phantom],
    ["rubbered", seedRubbered],
    ["forced", seedForced],
    ["defaulted", seedDefaulted],
    ["clear", seedClear],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("43 desk HTML sanity: idle word spoilt, seeded punched, chad not kist", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /spoilt/);
  assert.match(html, /Score/);
  assert.match(html, /Shut/);
  assert.match(html, /Punch/);
  assert.match(html, /Clear/);
  assert.match(html, /punched/);
  assert.match(html, /90407/);
  assert.match(html, /seedOf\("punched"\)|probe = seedOf\("punched"\)/);
  assert.doesNotMatch(html, /Admit chad/);
  assert.doesNotMatch(html, /const IDLE_WORD = "chad"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "laid"/);
  assert.match(html, /const IDLE_WORD = "spoilt"/);
  assert.match(html, /booth|ballot|punchcard|hanging|stamp|canvas|precinct/i);
  assert.match(html, /03:50 Sydney · chad/);
  assert.match(html, /reported selection is not a hold/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="bench"|class="bourdon"|class="lagging"|class="flange"|class="packing"/);
  assert.doesNotMatch(html, /class="chest"|class="hinge"|class="lid"/);
  assert.doesNotMatch(html, /--void:|--frost:|--ice:|--after:|--tomb:/);
  assert.doesNotMatch(html, /--oak:|--ash:|--linen:|--hessian:|--brass:|--lead:/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Chad/);
});

test("44 HTML why-not names Knock, Damper, Parity, Kist, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Knock/);
  assert.match(html, /NOT Damper/);
  assert.match(html, /NOT Parity/);
  assert.match(html, /NOT Kist|NOT Snib/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Chad is a permission-grant stall/i);
  assert.doesNotMatch(html, /Chad is a chimney damper/i);
  assert.doesNotMatch(html, /this is a livery of seisin/i);
});

test("45 README names Knock / Damper / Parity contrast and spoilt idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Knock/);
  assert.match(readme, /NOT Damper/);
  assert.match(readme, /NOT Parity/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*spoilt\*\*/);
  assert.match(readme, /#90407|#90407/);
  assert.match(readme, /#76616|#76616/);
  assert.match(readme, /#88790|#88790/);
  assert.doesNotMatch(readme, /idle word is chad/i);
  assert.doesNotMatch(readme, /idle word is laid/i);
  assert.doesNotMatch(readme, /Chad is a permission-grant stall/i);
});

test("46 score() punched includes punched and not spoilt", () => {
  const result = score(seed90407Punched().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "punched");
  assert.equal(result.spoilt, false);
  assert.equal(result.punched, true);
  assert.equal(result.carried, false);
});

test("47 fire live slack posts when fetch ok", async () => {
  const punched = decide(seed90407Punched());
  const events = await fire(punched, { CHAD_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted punched/);
});

test("48 fire live github and linear paths", async () => {
  const punched = decide(seed90407Punched());
  const events = await fire(
    punched,
    {
      CHAD_GITHUB_TOKEN: "tok",
      CHAD_LINEAR_KEY: "lin",
      CHAD_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "CHD-1", url: "https://linear.app/chd-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /CHD-1/);
});

test("49 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90407Punched().probe, "punched").some((line) => /#90407/.test(line)));
  assert.ok(reasonsOf(seed76616Miscast().probe, "miscast").some((line) => /#76616/.test(line)));
  assert.ok(reasonsOf(seed88790Phantom().probe, "phantom").some((line) => /#88790/.test(line)));
});

test("50 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const punched = decide(seed90407Punched());
  const slack = slackChadAlarm(punched, {});
  const github = githubChadLedger(punched, {});
  const linear = linearChadTicket(punched, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(punched, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("51 catalog wiring: 29 products, Chad featured, Kist listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 29);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Chad");
  assert.equal(featured[0].slug, "chad");
  assert.equal(featured[0].href, "/chad/");
  assert.equal(featured[0].day, "2026-08-29");
  assert.match(featured[0].summary, /03:50|hanging chad|reported selection is not a hold|spoilt/);
  const kist = catalog.products.find((row) => row.slug === "kist");
  assert.ok(kist);
  assert.equal(kist.featured, false);
  const wraith = catalog.products.find((row) => row.slug === "wraith");
  assert.ok(wraith);
  assert.equal(wraith.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "chad");
  assert.ok(slugs.includes("kist"));
  assert.ok(slugs.includes("wraith"));
  assert.ok(slugs.includes("knock"));
  assert.ok(!slugs.includes("livery"));
  assert.ok(!slugs.includes("ballot"));
  assert.ok(!slugs.includes("teller"));
});

test("52 vercel rewrite order puts /chad before /kist and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/chad");
  assert.equal(sources[1], "/chad/");
  assert.ok(sources.includes("/kist"));
  assert.ok(sources.includes("/wraith"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/chad") < sources.indexOf("/kist"));
  assert.ok(sources.indexOf("/chad/") < sources.indexOf("/:slug"));
  assert.ok(!sources.includes("/livery"));
});

test("53 hours.json prepends the 03:50 Sydney Chad ship", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-chad");
  assert.equal(hours[0].date, "2026-08-29");
  assert.equal(hours[0].time, "03:50");
  assert.equal(hours[0].tz, "Australia/Sydney");
  assert.equal(hours[0].title, "Chad");
  assert.equal(hours[0].kind, "ship");
  assert.match(hours[0].note, /spoilt/);
  assert.match(hours[0].note, /Kist/);
});

test("54 clusterOf on #90407 includes carried miscast phantom forced defaulted", () => {
  const cluster = clusterOf(seed90407Punched().probe, "punched");
  assert.deepEqual(
    cluster.filter((word) => ["carried", "miscast", "phantom", "forced", "defaulted"].includes(word)).sort(),
    ["carried", "defaulted", "forced", "miscast", "phantom"],
  );
});

test("55 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    reportedOption: "You run it (Recommended)",
    userNeverChose: "true",
    userDeniesSelection: "false",
    assistantActedOnResult: "true",
  });
  assert.equal(probe.userNeverChose, true);
  assert.equal(probe.userDeniesSelection, false);
  assert.equal(probe.assistantActedOnResult, true);
  assert.equal(classify(probe), "punched");
});
