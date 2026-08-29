import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubFuseeLedger,
  linearFuseeTicket,
  slackFuseeAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  EARLY_27_DAYS_MS,
  EARLY_3H40M_MS,
  EARLY_95_DAYS_MS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneProbe,
  clusterOf,
  decide,
  decideSeed,
  earlyFault,
  earlyMsOf,
  earlyOf,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  isPrematureTask,
  kindOf,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90485Early,
  seedAhead,
  seedHeld,
  seedJumped,
  seedPremature,
  seedRaced,
  seedSprung,
  seedTrue,
  seedVoided,
  seedWound,
  sprungOf,
  timestampsHeld,
  verdictOf,
  woundOf,
} from "./fusee.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverFusee(result) {
  assert.equal(result.idleWord, "wound");
  assert.equal(IDLE_WORD, "wound");
  assert.doesNotMatch(result.idleWord, /fusee/i);
  assert.doesNotMatch(IDLE_WORD, /fusee/i);
  assert.doesNotMatch(result.idleWord, /clock|early|empty|schedule/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /bound|stilled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|stabled/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.wound, "boolean");
  assert.equal(typeof result.early, "boolean");
  assert.equal(typeof result.sprung, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90485 early is early, slack, linear, idleWord wound", () => {
  const seed = seed90485Early();
  const result = decide(seed);
  assert.equal(result.verdict, "early");
  assert.equal(result.state, "early");
  assert.equal(result.decision, "early");
  assert.equal(classify(seed.probe), "early");
  assert.equal(verdictOf(seed.probe), "early");
  assert.notEqual(result.verdict, "wound");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.dialEarly, true);
  assert.equal(result.dialWound, false);
  assert.equal(result.wound, false);
  assert.equal(result.early, true);
  assert.equal(result.sprung, false);
  assertIdleNeverFusee(result);
  assert.equal(result.session, "90485-early");
  assert.equal(result.issue, 90485);
  assert.equal(result.kind, "cron");
  assert.equal(result.earlyByMs, EARLY_95_DAYS_MS);
  assert.equal(result.cronExpression, "0 2 1 11 *");
  assert.match(result.feed, /95 days|DST fleet/i);
  assert.ok(result.cluster.includes("raced"));
  assert.ok(result.cluster.includes("jumped"));
  assert.ok(result.cluster.includes("sprung"));
  assert.ok(!result.cluster.includes("early"));
  assert.ok(!result.cluster.includes("wound"));
  assert.equal(decideSeed(90485).verdict, "early");
  assert.equal(decideSeed("early").verdict, "early");
  assert.equal(decideSeed("90485-early").verdict, "early");
});

test("2 idle/empty/{} is wound, never the product name, never empty, never bound", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "wound");
  assert.equal(result.verdict, "wound");
  assert.equal(result.decision, "wound");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.wound, true);
  assert.equal(result.early, false);
  assert.equal(classify({}), "wound");
  assert.equal(classify(emptyProbe()), "wound");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverFusee(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "wound");
  assert.equal(bailed.idleWord, "wound");
  assert.equal(bailed.earlyByMs, 0);
  assert.doesNotMatch(bailed.state, /fusee/i);
  assert.doesNotMatch(bailed.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "wound");
  assert.equal(empty.idleWord, "wound");
});

test("3 sprung: spring released before the dial, no kind", () => {
  const result = decide(seedSprung());
  assert.equal(result.verdict, "sprung");
  assert.equal(result.kind, "");
  assert.ok(result.earlyByMs > 0);
  assert.ok(result.earlyByMs < EARLY_95_DAYS_MS);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.sprung, true);
  assert.match(result.feed, /spring released/i);
  assert.equal(decideSeed("sprung").verdict, "sprung");
});

test("4 raced: days+ early, not the 95-day DST case", () => {
  const result = decide(seedRaced());
  assert.equal(result.verdict, "raced");
  assert.equal(result.earlyByMs, EARLY_27_DAYS_MS);
  assert.equal(result.kind, "cron");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /days\+/i);
  assert.equal(decideSeed("raced").verdict, "raced");
});

test("5 ahead: fireAt one-off ran ~3h40m early", () => {
  const result = decide(seedAhead());
  assert.equal(result.verdict, "ahead");
  assert.equal(result.kind, "fireAt");
  assert.equal(result.earlyByMs, EARLY_3H40M_MS);
  assert.ok(result.fireAt);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /fireAt one-off/i);
  assert.equal(decideSeed("ahead").verdict, "ahead");
});

test("6 jumped: cron slot jumped early by hours", () => {
  const result = decide(seedJumped());
  assert.equal(result.verdict, "jumped");
  assert.equal(result.kind, "cron");
  assert.ok(result.earlyByMs > 0);
  assert.ok(result.earlyByMs < EARLY_27_DAYS_MS);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /cron slot jumped/i);
  assert.equal(decideSeed("jumped").verdict, "jumped");
});

test("7 premature: trial-cancellation evaluation before its window", () => {
  const result = decide(seedPremature());
  assert.equal(result.verdict, "premature");
  assert.equal(result.earlyByMs, EARLY_27_DAYS_MS);
  assert.match(result.source, /evaluation/i);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /evaluation\/decision/i);
  assert.equal(decideSeed("premature").verdict, "premature");
});

test("8 voided: wall-clock guard caught the early fire", () => {
  const result = decide(seedVoided());
  assert.equal(result.verdict, "voided");
  assert.equal(result.guardCaught, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /wall-clock guard/i);
  assert.equal(decideSeed("voided").verdict, "voided");
});

test("9 held: lastRunAt/nextRunAt inconsistent with actual", () => {
  const result = decide(seedHeld());
  assert.equal(result.verdict, "held");
  assert.equal(result.lastRunAt, "");
  assert.ok(result.nextRunAt);
  assert.equal(result.earlyByMs, 0);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /inconsistent/i);
  assert.equal(decideSeed("held").verdict, "held");
  assert.equal(decideSeed(77657).verdict, "held");
});

test("10 true: configured time matches actual dispatch", () => {
  const result = decide(seedTrue());
  assert.equal(result.verdict, "true");
  assert.equal(result.configuredAt, result.dispatchedAt);
  assert.equal(result.earlyByMs, 0);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /matches actual dispatch/i);
  assert.equal(decideSeed("true").verdict, "true");
});

test("11 wound seed is wound and never alarms", () => {
  const result = decide(seedWound());
  assert.equal(result.verdict, "wound");
  assert.equal(result.earlyByMs, 0);
  assert.equal(result.wound, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Wound/);
  assert.equal(decideSeed("wound").verdict, "wound");
});

test("12 score() idle probe is wound and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "wound");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.wound, true);
  assert.equal(result.early, false);
  assert.equal(result.sprung, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "wound",
    "early",
    "sprung",
    "raced",
    "ahead",
    "jumped",
    "premature",
    "voided",
    "held",
    "true",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "early",
    "sprung",
    "raced",
    "ahead",
    "jumped",
    "premature",
    "voided",
  ]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["early", "sprung", "raced", "ahead", "premature"]);
  assert.equal(IDLE_WORD, "wound");
  assert.doesNotMatch(IDLE_WORD, /fusee/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /clock|early|schedule|bound|stilled|stabled/);
  assert.doesNotMatch(VERDICTS.join(" "), /empty|fusee|bound|stilled|stabled/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["wound", seedWound],
    ["early", seed90485Early],
    ["sprung", seedSprung],
    ["raced", seedRaced],
    ["ahead", seedAhead],
    ["jumped", seedJumped],
    ["premature", seedPremature],
    ["voided", seedVoided],
    ["held", seedHeld],
    ["true", seedTrue],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: early stays early", () => {
  const result = decide({ ...seed90485Early(), action: "admit" });
  assert.equal(result.verdict, "early");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /wound/);
  assert.doesNotMatch(result.verdict, /fusee/i);
});

test("16 score / stamp / throw scores early", () => {
  const result = decide({ ...seed90485Early(), action: "score" });
  assert.equal(result.verdict, "early");
  assert.equal(result.action, "score");
  assert.equal(result.earlyByMs, EARLY_95_DAYS_MS);
  const stamped = decide({ ...seed90485Early(), action: "stamp" });
  assert.equal(stamped.verdict, "early");
  assert.equal(stamped.action, "stamp");
  const thrown = decide({ ...seed90485Early(), action: "throw" });
  assert.equal(thrown.verdict, "early");
  assert.equal(thrown.action, "score");
});

test("17 bail / wound returns idle wound", () => {
  const bailed = decide({ ...seed90485Early(), action: "bail" });
  assert.equal(bailed.verdict, "wound");
  assert.equal(bailed.action, "bail");
  assert.equal(bailed.earlyByMs, 0);
  assert.equal(isIdle(bailed.probe), true);
  assertIdleNeverFusee(bailed);
  const idle = decide({ ...seedVoided(), action: "wound" });
  assert.equal(idle.verdict, "wound");
  const still = decide({ ...seedAhead(), action: "still" });
  assert.equal(still.verdict, "wound");
});

test("18 dial on idle produces early 90485 strike", () => {
  const result = decide({ action: "dial", probe: emptyProbe() });
  assert.equal(result.verdict, "early");
  assert.equal(result.action, "dial");
  assert.equal(result.earlyByMs, EARLY_95_DAYS_MS);
  assert.equal(result.early, true);
});

test("19 dial on a raced probe becomes early", () => {
  const result = decide({ ...seedRaced(), action: "dial" });
  assert.equal(result.verdict, "early");
  assert.equal(result.action, "dial");
  assert.equal(result.kind, "cron");
});

test("20 ledger marks the dial sound and does not lie", () => {
  const result = decide({ ...seed90485Early(), action: "ledger" });
  assert.equal(result.verdict, "early");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Dial sounded/.test(line)));
});

test("21 observe on voided stays voided", () => {
  const result = decide({ ...seedVoided(), action: "observe" });
  assert.equal(result.verdict, "voided");
  assert.equal(result.observed, true);
  assert.equal(result.guardCaught, true);
});

test("22 early beats raced/jumped/sprung when the full #90485 95-day signature is present", () => {
  assert.equal(
    classify({
      configuredAt: "2026-11-01T02:00:00.000+11:00",
      dispatchedAt: "2026-07-29T02:00:00.000+10:00",
      kind: "cron",
      cronExpression: "0 2 1 11 *",
      earlyByMs: EARLY_95_DAYS_MS,
    }),
    "early",
  );
  assert.equal(earlyFault(seed90485Early().probe), true);
});

test("23 voided is guard only, even when cron also jumped", () => {
  assert.equal(
    classify({
      kind: "cron",
      cronExpression: "0 18 * * *",
      earlyByMs: 2 * 3_600_000,
      guardCaught: true,
    }),
    "voided",
  );
});

test("24 ahead requires fireAt kind, not just any early", () => {
  assert.equal(classify({ keys: [] }), "wound");
  assert.equal(
    classify({
      kind: "fireAt",
      fireAt: "2026-08-29T12:00:00.000+10:00",
      configuredAt: "2026-08-29T12:00:00.000+10:00",
      dispatchedAt: "2026-08-29T08:20:00.000+10:00",
      earlyByMs: EARLY_3H40M_MS,
    }),
    "ahead",
  );
});

test("25 raced requires days+ without the 95-day or evaluation marker", () => {
  assert.equal(
    classify({
      kind: "cron",
      cronExpression: "0 9 25 9 *",
      earlyByMs: EARLY_27_DAYS_MS,
    }),
    "raced",
  );
  assert.equal(
    classify({
      kind: "cron",
      cronExpression: "0 9 25 9 *",
      earlyByMs: EARLY_27_DAYS_MS,
      session: "trial-cancellation evaluation",
    }),
    "premature",
  );
});

test("26 nested dial / fusee / cone / arbor fields clone", () => {
  const probe = cloneProbe({
    dial: {
      configuredAt: "2026-11-01T02:00:00.000+11:00",
      dispatchedAt: "2026-07-29T02:00:00.000+10:00",
      kind: "cron",
      cronExpression: "0 2 1 11 *",
      earlyByMs: EARLY_95_DAYS_MS,
    },
  });
  assert.equal(classify(probe), "early");
  const cone = cloneProbe({
    cone: {
      kind: "fireAt",
      fireAt: "2026-08-29T12:00:00.000+10:00",
      earlyByMs: EARLY_3H40M_MS,
    },
  });
  assert.equal(classify(cone), "ahead");
});

test("27 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("early"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("sprung"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("raced"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("ahead"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("jumped"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("premature"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("voided"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("wound"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("held"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("true"), { slack: false, linear: false, github: true, alarm: false });
});

test("28 wound / early / sprung helpers", () => {
  assert.equal(woundOf(seed90485Early().probe), false);
  assert.equal(earlyOf(seed90485Early().probe), true);
  assert.equal(sprungOf(seed90485Early().probe), false);
  assert.equal(woundOf(emptyProbe()), true);
  assert.equal(sprungOf(seedSprung().probe), true);
  assert.equal(earlyOf(seedSprung().probe), false);
  assert.equal(woundOf(seedAhead().probe), false);
});

test("29 feed and reasons never use fusee or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "wound");
  assert.doesNotMatch(idle.feed, /idle word is fusee/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.doesNotMatch(idle.feed, /idle word is early/i);
  assert.ok(idle.reasons.every((line) => !/idle word is fusee/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "wound"), /Wound/);
  assert.ok(reasonsOf(emptyProbe(), "wound").some((line) => /idle word is wound/.test(line)));
});

test("30 forbidden idle list includes fusee, clock, early, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("fusee"));
  assert.ok(words.includes("clock"));
  assert.ok(words.includes("early"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("schedule"));
  assert.ok(words.includes("bound"));
  assert.ok(words.includes("stilled"));
  assert.ok(words.includes("stabled"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("escapement"));
  assert.ok(words.includes("clepsydra"));
  assert.ok(words.includes("iota"));
  assert.ok(words.includes("leat"));
  assert.ok(!words.includes("wound"));
});

test("31 demo sinks: Slack on alarm; Linear on early/sprung/raced/ahead/premature; GitHub always", async () => {
  const early = decide(seed90485Early());
  const slack = slackFuseeAlarm(early, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubFuseeLedger(early, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub fusee-ledger/);
  const linear = linearFuseeTicket(early, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedTrue());
  const linearSkip = linearFuseeTicket(honest, {});
  assert.equal(linearSkip.mode, "demo");
  assert.match(linearSkip.summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackFuseeAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearFuseeTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(early, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("32 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const early = decide(seed90485Early());
  const slack = slackFuseeAlarm(early, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubFuseeLedger(early, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearFuseeTicket(early, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("33 Slack skip on wound / held / true", () => {
  for (const seed of [seedWound, seedHeld, seedTrue]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackFuseeAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("34 Linear only on early, sprung, raced, ahead, and premature", () => {
  assert.equal(decide(seed90485Early()).linear, true);
  assert.equal(decide(seedSprung()).linear, true);
  assert.equal(decide(seedRaced()).linear, true);
  assert.equal(decide(seedAhead()).linear, true);
  assert.equal(decide(seedPremature()).linear, true);
  assert.equal(decide(seedJumped()).linear, false);
  assert.equal(decide(seedVoided()).linear, false);
  assert.equal(decide(seedHeld()).linear, false);
  assert.equal(decide(seedWound()).linear, false);
});

test("35 GitHub ledger fires on idle/bail scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.github, true);
});

test("36 handle early / sprung / raced / ahead / jumped / premature / voided deny", async () => {
  const early = await handle(seed90485Early(), {});
  assert.equal(early.permissionDecision, "deny");
  assert.match(early.hookSpecificOutput.decision.message, /early/);
  const sprung = await handle(seedSprung(), {});
  assert.equal(sprung.permissionDecision, "deny");
  const raced = await handle(seedRaced(), {});
  assert.equal(raced.permissionDecision, "deny");
  const ahead = await handle(seedAhead(), {});
  assert.equal(ahead.permissionDecision, "deny");
  const jumped = await handle(seedJumped(), {});
  assert.equal(jumped.permissionDecision, "deny");
  const premature = await handle(seedPremature(), {});
  assert.equal(premature.permissionDecision, "deny");
  const voided = await handle(seedVoided(), {});
  assert.equal(voided.permissionDecision, "deny");
});

test("37 handle wound / held / true allow", async () => {
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /wound/);
  const held = await handle(seedHeld(), {});
  assert.equal(held.permissionDecision, "allow");
  const honest = await handle(seedTrue(), {});
  assert.equal(honest.permissionDecision, "allow");
});

test("38 listen GET health and POST empty body is wound", async () => {
  const server = listen(19192);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19192/health");
  const info = await health.json();
  assert.equal(info.product, "fusee");
  assert.match(info.verbs, /early/);
  const res = await fetch("http://127.0.0.1:19192/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "wound");
  assert.equal(body.idleWord, "wound");
  const scored = await fetch("http://127.0.0.1:19192/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90485Early()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "early");
  await new Promise((resolve) => server.close(resolve));
});

test("39 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19193);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19193/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19193/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("40 every verdict is uniquely first-match on its seed", () => {
  const map = {
    wound: seedWound,
    early: seed90485Early,
    sprung: seedSprung,
    raced: seedRaced,
    ahead: seedAhead,
    jumped: seedJumped,
    premature: seedPremature,
    voided: seedVoided,
    held: seedHeld,
    true: seedTrue,
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

test("41 admit does not lie on every fault class", () => {
  const rows = [
    ["early", seed90485Early],
    ["sprung", seedSprung],
    ["raced", seedRaced],
    ["ahead", seedAhead],
    ["jumped", seedJumped],
    ["premature", seedPremature],
    ["voided", seedVoided],
    ["held", seedHeld],
    ["true", seedTrue],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("42 desk HTML sanity: idle word wound, seeded early, not iota/leat/shunt", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /wound/);
  assert.match(html, /Score/);
  assert.match(html, /Bail/);
  assert.match(html, /early/);
  assert.match(html, /90485/);
  assert.match(html, /seedOf\("early"\)|probe = seedOf\("early"\)/);
  assert.doesNotMatch(html, /Admit fusee/);
  assert.doesNotMatch(html, /const IDLE_WORD = "fusee"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "bound"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stilled"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stabled"/);
  assert.match(html, /const IDLE_WORD = "wound"/);
  assert.match(html, /conical|fusee|escapement|mainspring|arbor|winding key|enamel/i);
  assert.match(html, /10:50 Sydney · fusee/);
  assert.match(html, /written cron is not a hold|written cron \/ fireAt is not a hold/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="booth"|class="punchcard"|class="ballot"/);
  assert.doesNotMatch(html, /class="flange"|class="packing"|class="chest"|class="hinge"|class="lid"/);
  assert.doesNotMatch(html, /class="shop"|class="needle-rail"|class="felt"/);
  assert.doesNotMatch(html, /class="grate-bar"|class="cistern"|class="sludge"|class="pump-house"/);
  assert.doesNotMatch(html, /class="rails"|class="siding"|class="wagons"|class="signal-box"/);
  assert.doesNotMatch(html, /class="sluice"|class="raceway"|class="mill"/);
  assert.doesNotMatch(html, /class="compositor"|class="case-stand"|class="drawers"/);
  assert.doesNotMatch(html, /--shed:|--pitch:|--pine:|--sawdust:/);
  assert.doesNotMatch(html, /--shop:|--felt:|--wool:|--worsted:/);
  assert.doesNotMatch(html, /--concrete:|--bilge:|--silt:|--ochre:/);
  assert.doesNotMatch(html, /--night:|--wagon:/);
  assert.doesNotMatch(html, /--moss:|--water:|--foam:|--algae:/);
  assert.doesNotMatch(html, /--ink:|--lead:|--vermilion:/);
  assert.doesNotMatch(html, /Cormorant|Outfit/);
  assert.doesNotMatch(html, /Fraunces|IBM Plex Mono/);
  assert.doesNotMatch(html, /Barlow Condensed|Source Code Pro/);
  assert.doesNotMatch(html, /Playfair Display|IBM Plex Sans/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Fusee/);
  assert.match(html, /Bodoni Moda|Karla/);
});

test("43 HTML why-not names Iota, Leat, Shunt, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Iota/);
  assert.match(html, /NOT Leat/);
  assert.match(html, /NOT Shunt/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Fusee is a mill/i);
  assert.doesNotMatch(html, /Fusee is a railway/i);
  assert.doesNotMatch(html, /Fusee is a type-case/i);
  assert.doesNotMatch(html, /this is a night yard/i);
});

test("44 README names Iota / Leat / Shunt contrast and wound idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Iota/);
  assert.match(readme, /NOT Leat/);
  assert.match(readme, /NOT Shunt/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*wound\*\*/);
  assert.match(readme, /#90485|#90485/);
  assert.match(readme, /#77657|#77657/);
  assert.match(readme, /#89942|#89942/);
  assert.doesNotMatch(readme, /idle word is fusee/i);
  assert.doesNotMatch(readme, /idle word is bound/i);
  assert.doesNotMatch(readme, /idle word is stilled/i);
  assert.doesNotMatch(readme, /Fusee is a mill/i);
});

test("45 score() early includes early and not wound", () => {
  const result = score(seed90485Early().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "early");
  assert.equal(result.wound, false);
  assert.equal(result.early, true);
  assert.equal(result.sprung, false);
});

test("46 fire live slack posts when fetch ok", async () => {
  const early = decide(seed90485Early());
  const events = await fire(early, { FUSEE_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted early/);
});

test("47 fire live github and linear paths", async () => {
  const early = decide(seed90485Early());
  const events = await fire(
    early,
    {
      FUSEE_GITHUB_TOKEN: "tok",
      FUSEE_LINEAR_KEY: "lin",
      FUSEE_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "FUS-1", url: "https://linear.app/fus-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /FUS-1/);
});

test("48 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90485Early().probe, "early").some((line) => /#90485/.test(line)));
  assert.ok(reasonsOf(seedAhead().probe, "ahead").some((line) => /#90485/.test(line)));
  assert.ok(reasonsOf(seedPremature().probe, "premature").some((line) => /#90485/.test(line)));
  assert.ok(reasonsOf(seedHeld().probe, "held").some((line) => /#77657/.test(line)));
});

test("49 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const early = decide(seed90485Early());
  const slack = slackFuseeAlarm(early, {});
  const github = githubFuseeLedger(early, {});
  const linear = linearFuseeTicket(early, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(early, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("50 catalog wiring: 36 products, Fusee featured, Iota listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 36);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Fusee");
  assert.equal(featured[0].slug, "fusee");
  assert.equal(featured[0].href, "/fusee/");
  assert.equal(featured[0].day, "2026-08-29");
  assert.match(featured[0].summary, /10:50|written cron is not a hold|wound/);
  const iota = catalog.products.find((row) => row.slug === "iota");
  assert.ok(iota);
  assert.equal(iota.featured, false);
  assert.match(iota.summary, /09:50|second casing is not a plot|bound/);
  const leat = catalog.products.find((row) => row.slug === "leat");
  assert.ok(leat);
  assert.equal(leat.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "fusee");
  assert.equal(slugs[1], "iota");
  assert.ok(slugs.includes("leat"));
  assert.ok(slugs.includes("knock"));
  assert.ok(!slugs.includes("escapement"));
  assert.ok(!slugs.includes("clepsydra"));
  assert.ok(!slugs.includes("mainspring"));
});

test("51 vercel rewrite order puts /fusee before /iota, /leat and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/fusee");
  assert.equal(sources[1], "/fusee/");
  assert.equal(sources[2], "/iota");
  assert.equal(sources[3], "/iota/");
  assert.ok(sources.includes("/leat"));
  assert.ok(sources.includes("/iota"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/fusee") < sources.indexOf("/iota"));
  assert.ok(sources.indexOf("/iota") < sources.indexOf("/leat"));
  assert.ok(sources.indexOf("/fusee/") < sources.indexOf("/:slug"));
});

test("52 hours.json prepends the 10:50 Sydney Fusee ship", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-fusee");
  assert.equal(hours[0].date, "2026-08-29");
  assert.equal(hours[0].time, "10:50");
  assert.equal(hours[0].tz, "Australia/Sydney");
  assert.equal(hours[0].title, "Fusee");
  assert.equal(hours[0].kind, "ship");
  assert.match(hours[0].note, /wound/);
  assert.match(hours[0].note, /Iota/);
  assert.match(hours[0].note, /36/);
  assert.equal(hours[1].stem, "2026-08-29-iota");
});

test("53 clusterOf on #90485 includes raced jumped sprung", () => {
  const cluster = clusterOf(seed90485Early().probe, "early");
  assert.ok(cluster.includes("raced"));
  assert.ok(cluster.includes("jumped"));
  assert.ok(cluster.includes("sprung"));
});

test("54 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    kind: "cron",
    cronExpression: "0 2 1 11 *",
    earlyByMs: String(EARLY_95_DAYS_MS),
    guardCaught: "false",
    reportedSuccess: "true",
    workDone: "true",
  });
  assert.equal(probe.reportedSuccess, true);
  assert.equal(probe.workDone, true);
  assert.equal(probe.guardCaught, false);
  assert.equal(probe.earlyByMs, EARLY_95_DAYS_MS);
  assert.equal(classify(probe), "early");
});

test("55 parseSessionTrace detects 95 days early / cron / #90485", () => {
  const parsed = parseSessionTrace(`
configuredAt 2026-11-01T02:00:00.000+11:00
dispatchedAt 2026-07-29T02:00:00.000+10:00
cronExpression 0 2 1 11 *
~95 days early
DST fleet rewrite
anthropics/claude-code#90485
`);
  assert.ok(parsed.configuredAt);
  assert.ok(parsed.dispatchedAt);
  assert.equal(parsed.kind, "cron");
  assert.equal(parsed.earlyByMs, EARLY_95_DAYS_MS);
  assert.equal(parsed.issue, 90485);
});

test("56 true action scores matching wall clocks, not idle wound", () => {
  const result = decide({ ...seed90485Early(), action: "true" });
  assert.equal(result.verdict, "true");
  assert.equal(result.action, "true");
  assert.equal(result.earlyByMs, 0);
  assert.equal(result.alarm, false);
});

test("57 dial helpers: earlyMs, kind, premature, held", () => {
  assert.equal(earlyMsOf({ earlyByMs: EARLY_95_DAYS_MS }), EARLY_95_DAYS_MS);
  assert.equal(kindOf({ cronExpression: "0 2 * * *" }), "cron");
  assert.equal(kindOf({ fireAt: "2026-08-29T12:00:00.000+10:00" }), "fireAt");
  assert.equal(isPrematureTask({ session: "trial-cancellation evaluation" }), true);
  assert.equal(timestampsHeld({ lastRunAt: "", nextRunAt: "later", reportedSuccess: true }), true);
  assert.equal(analyze(seed90485Early().probe).is95Day, true);
});

test("58 env example lists FUSEE_SLACK_WEBHOOK, FUSEE_GITHUB_TOKEN, FUSEE_LINEAR_KEY", () => {
  const env = readFileSync(fileURLToPath(new URL("../.env.example", import.meta.url)), "utf8");
  assert.match(env, /FUSEE_SLACK_WEBHOOK/);
  assert.match(env, /FUSEE_GITHUB_TOKEN/);
  assert.match(env, /FUSEE_LINEAR_KEY/);
});
