import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubLeatLedger,
  linearLeatTicket,
  slackLeatAlarm,
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
  guidanceFault,
  isIdle,
  parseSessionTrace,
  racingOf,
  reasonsOf,
  score,
  seed90475Racing,
  seedCapped,
  seedFlooded,
  seedLingering,
  seedLive,
  seedPromoted,
  seedShut,
  seedSpun,
  seedStilled,
  seedUnbounded,
  stilledOf,
  unboundedOf,
  verdictOf,
} from "./leat.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverLeat(result) {
  assert.equal(result.idleWord, "stilled");
  assert.equal(IDLE_WORD, "stilled");
  assert.doesNotMatch(result.idleWord, /leat/i);
  assert.doesNotMatch(IDLE_WORD, /leat/i);
  assert.doesNotMatch(result.idleWord, /millrace|sluice/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|stabled/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.stilled, "boolean");
  assert.equal(typeof result.racing, "boolean");
  assert.equal(typeof result.unbounded, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90475 racing is racing, slack, linear, idleWord stilled", () => {
  const seed = seed90475Racing();
  const result = decide(seed);
  assert.equal(result.verdict, "racing");
  assert.equal(result.state, "racing");
  assert.equal(result.decision, "racing");
  assert.equal(classify(seed.probe), "racing");
  assert.equal(verdictOf(seed.probe), "racing");
  assert.notEqual(result.verdict, "stilled");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.raceRacing, true);
  assert.equal(result.raceStilled, false);
  assert.equal(result.stilled, false);
  assert.equal(result.racing, true);
  assert.equal(result.unbounded, false);
  assertIdleNeverLeat(result);
  assert.equal(result.session, "90475-racing");
  assert.equal(result.issue, 90475);
  assert.equal(result.sleepBlocked, true);
  assert.equal(result.recommendedUntil, true);
  assert.equal(result.hasIterationCap, false);
  assert.equal(result.hasDeadline, false);
  assert.equal(result.wroteUntilLoop, true);
  assert.equal(result.promotedToBackground, true);
  assert.equal(result.backgroundStillLive, true);
  assert.equal(result.daysAlive, 5);
  assert.equal(result.restartBlocked, true);
  assert.match(result.feed, /unbounded until/i);
  assert.ok(result.cluster.includes("unbounded"));
  assert.ok(result.cluster.includes("promoted"));
  assert.ok(result.cluster.includes("lingering"));
  assert.ok(!result.cluster.includes("racing"));
  assert.ok(!result.cluster.includes("stilled"));
  assert.equal(decideSeed(90475).verdict, "racing");
  assert.equal(decideSeed("racing").verdict, "racing");
  assert.equal(decideSeed("90475-racing").verdict, "racing");
});

test("2 idle/empty/{} is stilled, never the product name, never empty, never drained", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "stilled");
  assert.equal(result.verdict, "stilled");
  assert.equal(result.decision, "stilled");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.stilled, true);
  assert.equal(result.racing, false);
  assert.equal(classify({}), "stilled");
  assert.equal(classify(emptyProbe()), "stilled");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverLeat(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "stilled");
  assert.equal(bailed.idleWord, "stilled");
  assert.equal(bailed.sleepBlocked, false);
  assert.doesNotMatch(bailed.state, /leat/i);
  assert.doesNotMatch(bailed.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "stilled");
  assert.equal(empty.idleWord, "stilled");
});

test("3 unbounded: sleep blocked + recommended until, no cap, no deadline, loop not written", () => {
  const result = decide(seedUnbounded());
  assert.equal(result.verdict, "unbounded");
  assert.equal(result.sleepBlocked, true);
  assert.equal(result.recommendedUntil, true);
  assert.equal(result.hasIterationCap, false);
  assert.equal(result.hasDeadline, false);
  assert.equal(result.wroteUntilLoop, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.unbounded, true);
  assert.match(result.feed, /open until-loop/i);
  assert.equal(decideSeed("unbounded").verdict, "unbounded");
});

test("4 promoted: foreground timeout moved the loop to background", () => {
  const result = decide(seedPromoted());
  assert.equal(result.verdict, "promoted");
  assert.equal(result.promotedToBackground, true);
  assert.equal(result.backgroundStillLive, true);
  assert.equal(result.sleepBlocked, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /bound discarded/i);
  assert.equal(decideSeed("promoted").verdict, "promoted");
});

test("5 lingering: background loop still live days later", () => {
  const result = decide(seedLingering());
  assert.equal(result.verdict, "lingering");
  assert.equal(result.backgroundStillLive, true);
  assert.equal(result.daysAlive, 5);
  assert.equal(result.restartBlocked, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /session boundary/i);
  assert.equal(decideSeed("lingering").verdict, "lingering");
});

test("6 flooded: three until-loops still alive", () => {
  const result = decide(seedFlooded());
  assert.equal(result.verdict, "flooded");
  assert.equal(result.taskCount, 3);
  assert.equal(result.backgroundStillLive, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /multiple racing/i);
  assert.equal(decideSeed("flooded").verdict, "flooded");
});

test("7 spun: PPID 1 / CPU spinning", () => {
  const result = decide(seedSpun());
  assert.equal(result.verdict, "spun");
  assert.equal(result.ppidOne, true);
  assert.equal(result.spunCpu, true);
  assert.equal(result.outputUnlinked, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /PPID 1/i);
  assert.equal(decideSeed("spun").verdict, "spun");
});

test("8 capped: healthy for-loop / timeout form", () => {
  const result = decide(seedCapped());
  assert.equal(result.verdict, "capped");
  assert.equal(result.hasIterationCap, true);
  assert.equal(result.hasDeadline, true);
  assert.equal(result.backgroundStillLive, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /bounded/i);
  assert.equal(decideSeed("capped").verdict, "capped");
});

test("9 live: .output mtime writing; restart blocked", () => {
  const result = decide(seedLive());
  assert.equal(result.verdict, "live");
  assert.equal(result.restartBlocked, true);
  assert.equal(result.outputMtimeLive, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /restart blocked/i);
  assert.equal(decideSeed("live").verdict, "live");
});

test("10 shut: TaskStop closed the race", () => {
  const result = decide(seedShut());
  assert.equal(result.verdict, "shut");
  assert.equal(result.taskStopped, true);
  assert.equal(result.backgroundStillLive, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /TaskStop/i);
  assert.equal(decideSeed("shut").verdict, "shut");
});

test("11 stilled seed is stilled and never alarms", () => {
  const result = decide(seedStilled());
  assert.equal(result.verdict, "stilled");
  assert.equal(result.sleepBlocked, false);
  assert.equal(result.stilled, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Stilled/);
  assert.equal(decideSeed("stilled").verdict, "stilled");
});

test("12 score() idle probe is stilled and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "stilled");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.stilled, true);
  assert.equal(result.racing, false);
  assert.equal(result.unbounded, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "stilled",
    "racing",
    "unbounded",
    "promoted",
    "lingering",
    "flooded",
    "spun",
    "capped",
    "live",
    "shut",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "racing",
    "unbounded",
    "promoted",
    "lingering",
    "flooded",
    "live",
  ]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["racing", "unbounded", "promoted", "lingering"]);
  assert.equal(IDLE_WORD, "stilled");
  assert.doesNotMatch(IDLE_WORD, /leat/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /drained|flat|fit|spoilt|laid|stabled|seised/);
  assert.doesNotMatch(VERDICTS.join(" "), /empty|leat|drained|flat|fit|spoilt|stabled/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["stilled", seedStilled],
    ["racing", seed90475Racing],
    ["unbounded", seedUnbounded],
    ["promoted", seedPromoted],
    ["lingering", seedLingering],
    ["flooded", seedFlooded],
    ["spun", seedSpun],
    ["capped", seedCapped],
    ["live", seedLive],
    ["shut", seedShut],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: racing stays racing", () => {
  const result = decide({ ...seed90475Racing(), action: "admit" });
  assert.equal(result.verdict, "racing");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /stilled/);
  assert.doesNotMatch(result.verdict, /leat/i);
});

test("16 score / stamp / throw scores racing", () => {
  const result = decide({ ...seed90475Racing(), action: "score" });
  assert.equal(result.verdict, "racing");
  assert.equal(result.action, "score");
  assert.equal(result.sleepBlocked, true);
  const stamped = decide({ ...seed90475Racing(), action: "stamp" });
  assert.equal(stamped.verdict, "racing");
  assert.equal(stamped.action, "stamp");
  const thrown = decide({ ...seed90475Racing(), action: "throw" });
  assert.equal(thrown.verdict, "racing");
  assert.equal(thrown.action, "score");
});

test("17 bail / stilled returns idle stilled", () => {
  const bailed = decide({ ...seed90475Racing(), action: "bail" });
  assert.equal(bailed.verdict, "stilled");
  assert.equal(bailed.action, "bail");
  assert.equal(bailed.sleepBlocked, false);
  assert.equal(isIdle(bailed.probe), true);
  assertIdleNeverLeat(bailed);
  const idle = decide({ ...seedUnbounded(), action: "stilled" });
  assert.equal(idle.verdict, "stilled");
  const still = decide({ ...seedPromoted(), action: "still" });
  assert.equal(still.verdict, "stilled");
});

test("18 race on idle produces racing channel", () => {
  const result = decide({ action: "race", probe: emptyProbe() });
  assert.equal(result.verdict, "racing");
  assert.equal(result.action, "race");
  assert.equal(result.sleepBlocked, true);
  assert.equal(result.recommendedUntil, true);
  assert.equal(result.racing, true);
});

test("19 race on a lingering probe becomes racing", () => {
  const result = decide({ ...seedLingering(), action: "race" });
  assert.equal(result.verdict, "racing");
  assert.equal(result.action, "race");
  assert.equal(result.wroteUntilLoop, true);
});

test("20 ledger marks the race sound and does not lie", () => {
  const result = decide({ ...seed90475Racing(), action: "ledger" });
  assert.equal(result.verdict, "racing");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Race sounded/.test(line)));
});

test("21 observe on unbounded stays unbounded", () => {
  const result = decide({ ...seedUnbounded(), action: "observe" });
  assert.equal(result.verdict, "unbounded");
  assert.equal(result.observed, true);
  assert.equal(result.recommendedUntil, true);
});

test("22 racing beats unbounded/promoted/lingering when the full #90475 signature is present", () => {
  assert.equal(
    classify({
      sleepBlocked: true,
      recommendedUntil: true,
      hasIterationCap: false,
      hasDeadline: false,
      wroteUntilLoop: true,
      promotedToBackground: true,
      backgroundStillLive: true,
      daysAlive: 5,
      restartBlocked: true,
    }),
    "racing",
  );
  assert.equal(guidanceFault(seed90475Racing().probe), true);
});

test("23 unbounded is guidance only, without the written loop", () => {
  assert.equal(
    classify({
      sleepBlocked: true,
      recommendedUntil: true,
      hasIterationCap: false,
      hasDeadline: false,
    }),
    "unbounded",
  );
});

test("24 promoted requires promotion + still live, not just a timeout", () => {
  assert.equal(classify({ foregroundTimeoutMs: 600000 }), "stilled");
  assert.equal(
    classify({
      promotedToBackground: true,
      backgroundStillLive: true,
    }),
    "promoted",
  );
});

test("25 lingering requires days alive and a live background loop", () => {
  assert.equal(classify({ daysAlive: 5 }), "stilled");
  assert.equal(
    classify({
      backgroundStillLive: true,
      daysAlive: 5,
    }),
    "lingering",
  );
});

test("26 nested race / gate / channel / wheel fields clone", () => {
  const probe = cloneProbe({
    race: {
      sleepBlocked: true,
      recommendedUntil: true,
      wroteUntilLoop: true,
      promotedToBackground: true,
      backgroundStillLive: true,
      daysAlive: 5,
    },
  });
  assert.equal(classify(probe), "racing");
  const gate = cloneProbe({
    gate: { recommendedUntil: true, sleepBlocked: true },
  });
  assert.equal(classify(gate), "unbounded");
});

test("27 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("racing"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("unbounded"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("promoted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("lingering"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("flooded"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("live"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("stilled"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("spun"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("capped"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("shut"), { slack: false, linear: false, github: true, alarm: false });
});

test("28 stilled / racing / unbounded helpers", () => {
  assert.equal(stilledOf(seed90475Racing().probe), false);
  assert.equal(racingOf(seed90475Racing().probe), true);
  assert.equal(unboundedOf(seed90475Racing().probe), false);
  assert.equal(stilledOf(emptyProbe()), true);
  assert.equal(unboundedOf(seedUnbounded().probe), true);
  assert.equal(racingOf(seedUnbounded().probe), false);
  assert.equal(stilledOf(seedPromoted().probe), false);
});

test("29 feed and reasons never use leat or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "stilled");
  assert.doesNotMatch(idle.feed, /idle word is leat/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.ok(idle.reasons.every((line) => !/idle word is leat/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "stilled"), /Stilled/);
  assert.ok(reasonsOf(emptyProbe(), "stilled").some((line) => /idle word is stilled/.test(line)));
});

test("30 forbidden idle list includes leat, millrace, sluice, empty, drained, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("leat"));
  assert.ok(words.includes("millrace"));
  assert.ok(words.includes("sluice"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("drained"));
  assert.ok(words.includes("flat"));
  assert.ok(words.includes("fit"));
  assert.ok(words.includes("spoilt"));
  assert.ok(words.includes("laid"));
  assert.ok(words.includes("stabled"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("flume"));
  assert.ok(words.includes("oubliette"));
  assert.ok(words.includes("shunt"));
  assert.ok(words.includes("sump"));
  assert.ok(words.includes("quench"));
  assert.ok(!words.includes("stilled"));
});

test("31 demo sinks: Slack on alarm; Linear on racing/unbounded/promoted/lingering; GitHub always", async () => {
  const racing = decide(seed90475Racing());
  const slack = slackLeatAlarm(racing, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubLeatLedger(racing, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub leat-ledger/);
  const linear = linearLeatTicket(racing, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const capped = decide(seedCapped());
  const linearSkip = linearLeatTicket(capped, {});
  assert.equal(linearSkip.mode, "demo");
  assert.match(linearSkip.summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackLeatAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearLeatTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(racing, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("32 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const racing = decide(seed90475Racing());
  const slack = slackLeatAlarm(racing, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubLeatLedger(racing, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearLeatTicket(racing, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("33 Slack skip on stilled / spun / capped / shut", () => {
  for (const seed of [seedStilled, seedSpun, seedCapped, seedShut]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackLeatAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("34 Linear only on racing, unbounded, promoted, and lingering", () => {
  assert.equal(decide(seed90475Racing()).linear, true);
  assert.equal(decide(seedUnbounded()).linear, true);
  assert.equal(decide(seedPromoted()).linear, true);
  assert.equal(decide(seedLingering()).linear, true);
  assert.equal(decide(seedFlooded()).linear, false);
  assert.equal(decide(seedLive()).linear, false);
  assert.equal(decide(seedStilled()).linear, false);
});

test("35 GitHub ledger fires on idle/bail scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.github, true);
});

test("36 handle racing / unbounded / promoted / lingering / flooded / live deny", async () => {
  const racing = await handle(seed90475Racing(), {});
  assert.equal(racing.permissionDecision, "deny");
  assert.match(racing.hookSpecificOutput.decision.message, /racing/);
  const unbounded = await handle(seedUnbounded(), {});
  assert.equal(unbounded.permissionDecision, "deny");
  const promoted = await handle(seedPromoted(), {});
  assert.equal(promoted.permissionDecision, "deny");
  const lingering = await handle(seedLingering(), {});
  assert.equal(lingering.permissionDecision, "deny");
  const flooded = await handle(seedFlooded(), {});
  assert.equal(flooded.permissionDecision, "deny");
  const live = await handle(seedLive(), {});
  assert.equal(live.permissionDecision, "deny");
});

test("37 handle stilled / spun / capped / shut allow", async () => {
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /stilled/);
  const spun = await handle(seedSpun(), {});
  assert.equal(spun.permissionDecision, "allow");
  const capped = await handle(seedCapped(), {});
  assert.equal(capped.permissionDecision, "allow");
  const shut = await handle(seedShut(), {});
  assert.equal(shut.permissionDecision, "allow");
});

test("38 listen GET health and POST empty body is stilled", async () => {
  const server = listen(19090);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19090/health");
  const info = await health.json();
  assert.equal(info.product, "leat");
  assert.match(info.verbs, /racing/);
  const res = await fetch("http://127.0.0.1:19090/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "stilled");
  assert.equal(body.idleWord, "stilled");
  const scored = await fetch("http://127.0.0.1:19090/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90475Racing()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "racing");
  await new Promise((resolve) => server.close(resolve));
});

test("39 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19091);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19091/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19091/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("40 every verdict is uniquely first-match on its seed", () => {
  const map = {
    stilled: seedStilled,
    racing: seed90475Racing,
    unbounded: seedUnbounded,
    promoted: seedPromoted,
    lingering: seedLingering,
    flooded: seedFlooded,
    spun: seedSpun,
    capped: seedCapped,
    live: seedLive,
    shut: seedShut,
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
    ["racing", seed90475Racing],
    ["unbounded", seedUnbounded],
    ["promoted", seedPromoted],
    ["lingering", seedLingering],
    ["flooded", seedFlooded],
    ["spun", seedSpun],
    ["capped", seedCapped],
    ["live", seedLive],
    ["shut", seedShut],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("42 desk HTML sanity: idle word stilled, seeded racing, not shunt/sump/pleat", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /stilled/);
  assert.match(html, /Score/);
  assert.match(html, /Bail/);
  assert.match(html, /racing/);
  assert.match(html, /90475/);
  assert.match(html, /seedOf\("racing"\)|probe = seedOf\("racing"\)/);
  assert.doesNotMatch(html, /Admit leat/);
  assert.doesNotMatch(html, /const IDLE_WORD = "leat"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "drained"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stabled"/);
  assert.match(html, /const IDLE_WORD = "stilled"/);
  assert.match(html, /sluice|millrace|mill wheel|brass|moss|channel/i);
  assert.match(html, /08:50 Sydney · leat/);
  assert.match(html, /blocked sleep is not a hold/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="booth"|class="punchcard"|class="ballot"/);
  assert.doesNotMatch(html, /class="flange"|class="packing"|class="chest"|class="hinge"|class="lid"/);
  assert.doesNotMatch(html, /class="shop"|class="needle-rail"|class="felt"/);
  assert.doesNotMatch(html, /class="grate-bar"|class="cistern"|class="sludge"|class="pump-house"/);
  assert.doesNotMatch(html, /class="rails"|class="siding"|class="wagons"|class="signal-box"/);
  assert.doesNotMatch(html, /--shed:|--pitch:|--pine:|--sawdust:/);
  assert.doesNotMatch(html, /--shop:|--felt:|--wool:|--worsted:/);
  assert.doesNotMatch(html, /--concrete:|--bilge:|--silt:|--ochre:/);
  assert.doesNotMatch(html, /--night:|--wagon:/);
  assert.doesNotMatch(html, /Cormorant|Outfit/);
  assert.doesNotMatch(html, /Barlow Condensed|Source Code Pro/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Leat/);
  assert.match(html, /Fraunces|IBM Plex Mono/);
});

test("43 HTML why-not names Shunt, Sump, Quench, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Shunt/);
  assert.match(html, /NOT Sump/);
  assert.match(html, /NOT Quench/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Leat is a railway/i);
  assert.doesNotMatch(html, /Leat is a basement/i);
  assert.doesNotMatch(html, /this is a night yard/i);
});

test("44 README names Shunt / Sump / Quench contrast and stilled idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Shunt/);
  assert.match(readme, /NOT Sump/);
  assert.match(readme, /NOT Quench/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*stilled\*\*/);
  assert.match(readme, /#90475|#90475/);
  assert.match(readme, /#88702|#88702/);
  assert.match(readme, /#89625|#89625/);
  assert.doesNotMatch(readme, /idle word is leat/i);
  assert.doesNotMatch(readme, /idle word is drained/i);
  assert.doesNotMatch(readme, /idle word is stabled/i);
  assert.doesNotMatch(readme, /Leat is a railway/i);
});

test("45 score() racing includes racing and not stilled", () => {
  const result = score(seed90475Racing().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "racing");
  assert.equal(result.stilled, false);
  assert.equal(result.racing, true);
  assert.equal(result.unbounded, false);
});

test("46 fire live slack posts when fetch ok", async () => {
  const racing = decide(seed90475Racing());
  const events = await fire(racing, { LEAT_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted racing/);
});

test("47 fire live github and linear paths", async () => {
  const racing = decide(seed90475Racing());
  const events = await fire(
    racing,
    {
      LEAT_GITHUB_TOKEN: "tok",
      LEAT_LINEAR_KEY: "lin",
      LEAT_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "LEA-1", url: "https://linear.app/lea-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /LEA-1/);
});

test("48 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90475Racing().probe, "racing").some((line) => /#90475/.test(line)));
  assert.ok(reasonsOf(seedUnbounded().probe, "unbounded").some((line) => /#90475/.test(line)));
  assert.ok(reasonsOf(seedPromoted().probe, "promoted").some((line) => /#88702/.test(line)));
  assert.ok(reasonsOf(seedSpun().probe, "spun").some((line) => /#89625/.test(line)));
});

test("49 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const racing = decide(seed90475Racing());
  const slack = slackLeatAlarm(racing, {});
  const github = githubLeatLedger(racing, {});
  const linear = linearLeatTicket(racing, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(racing, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("50 catalog wiring: 36 products, Fusee featured, Leat listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 36);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Fusee");
  const leat = catalog.products.find((row) => row.slug === "leat");
  assert.ok(leat);
  assert.equal(leat.featured, false);
  assert.equal(leat.href, "/leat/");
  assert.equal(leat.day, "2026-08-29");
  assert.match(leat.summary, /08:50|blocked sleep is not a hold|stilled/);
  const shunt = catalog.products.find((row) => row.slug === "shunt");
  assert.ok(shunt);
  assert.equal(shunt.featured, false);
  assert.match(shunt.summary, /07:50|first delivery is not a hold|stabled/);
  const sump = catalog.products.find((row) => row.slug === "sump");
  assert.ok(sump);
  assert.equal(sump.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "fusee");
  assert.equal(slugs[1], "iota");
  assert.ok(slugs.includes("sump"));
  assert.ok(slugs.includes("pleat"));
  assert.ok(slugs.includes("knock"));
  assert.ok(!slugs.includes("millrace"));
  assert.ok(!slugs.includes("sluice"));
  assert.ok(!slugs.includes("flume"));
});

test("51 vercel rewrite order puts /fusee before /iota, /leat and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/fusee");
  assert.equal(sources[1], "/fusee/");
  assert.equal(sources[2], "/iota");
  assert.equal(sources[3], "/iota/");
  assert.ok(sources.includes("/sump"));
  assert.ok(sources.includes("/pleat"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/fusee") < sources.indexOf("/iota"));
  assert.ok(sources.indexOf("/iota") < sources.indexOf("/leat"));
  assert.ok(sources.indexOf("/leat/") < sources.indexOf("/:slug"));
});

test("52 hours.json keeps the 08:50 Sydney Leat ship after Fusee", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-fusee");
  const leat = hours.find((row) => row.stem === "2026-08-29-leat");
  assert.ok(leat);
  assert.equal(leat.date, "2026-08-29");
  assert.equal(leat.time, "08:50");
  assert.equal(leat.tz, "Australia/Sydney");
  assert.equal(leat.title, "Leat");
  assert.equal(leat.kind, "ship");
  assert.match(leat.note, /stilled/);
  assert.match(leat.note, /Shunt/);
  assert.match(leat.note, /Sump/);
  assert.equal(hours[1].stem, "2026-08-29-iota");
  assert.equal(hours[2].stem, "2026-08-29-leat");
});

test("53 clusterOf on #90475 includes unbounded promoted lingering live", () => {
  const cluster = clusterOf(seed90475Racing().probe, "racing");
  assert.ok(cluster.includes("unbounded"));
  assert.ok(cluster.includes("promoted"));
  assert.ok(cluster.includes("lingering"));
  assert.ok(cluster.includes("live"));
});

test("54 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    sleepBlocked: "true",
    recommendedUntil: "true",
    hasIterationCap: "false",
    hasDeadline: "false",
    wroteUntilLoop: "true",
    promotedToBackground: "true",
    backgroundStillLive: "true",
    daysAlive: "5",
    restartBlocked: "true",
  });
  assert.equal(probe.sleepBlocked, true);
  assert.equal(probe.hasIterationCap, false);
  assert.equal(probe.daysAlive, 5);
  assert.equal(probe.wroteUntilLoop, true);
  assert.equal(classify(probe), "racing");
});

test("55 parseSessionTrace detects sleep-block / until guidance / promotion from pasted transcript", () => {
  const parsed = parseSessionTrace(`
sleep 30
Bash tool blocks it. Block message recommended: until <check>; do sleep 2; done
agent writes the unbounded loop: until ready; do sleep 2; done
foreground timeout promoted to background
still running five days later
desktop refuses restart: there's a running task here
.output mtime still writing
`);
  assert.equal(parsed.sleepBlocked, true);
  assert.equal(parsed.recommendedUntil, true);
  assert.equal(parsed.wroteUntilLoop, true);
  assert.equal(parsed.promotedToBackground, true);
  assert.equal(parsed.backgroundStillLive, true);
  assert.equal(parsed.daysAlive, 5);
  assert.equal(parsed.restartBlocked, true);
  assert.equal(parsed.hasIterationCap, false);
  assert.equal(parsed.hasDeadline, false);
});

test("56 shut action scores TaskStop, not idle stilled", () => {
  const result = decide({ ...seed90475Racing(), action: "shut" });
  assert.equal(result.verdict, "shut");
  assert.equal(result.action, "shut");
  assert.equal(result.taskStopped, true);
  assert.equal(result.backgroundStillLive, false);
  assert.equal(result.alarm, false);
});

test("57 flooded beats racing when three loops are still live", () => {
  assert.equal(
    classify({
      sleepBlocked: true,
      recommendedUntil: true,
      wroteUntilLoop: true,
      taskCount: 3,
      backgroundStillLive: true,
    }),
    "flooded",
  );
});

test("58 env example lists LEAT_SLACK_WEBHOOK, LEAT_GITHUB_TOKEN, LEAT_LINEAR_KEY", () => {
  const env = readFileSync(fileURLToPath(new URL("../.env.example", import.meta.url)), "utf8");
  assert.match(env, /LEAT_SLACK_WEBHOOK/);
  assert.match(env, /LEAT_GITHUB_TOKEN/);
  assert.match(env, /LEAT_LINEAR_KEY/);
});
