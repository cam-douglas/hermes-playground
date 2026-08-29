import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubSpragLedger,
  linearSpragTicket,
  slackSpragAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
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
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  lockedFault,
  lockedOf,
  lockedRaceOf,
  mixedOf,
  overrunOf,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90494Locked,
  seedCached,
  seedHeld,
  seedLate,
  seedLive,
  seedMixed,
  seedOverrun,
  seedRefused,
  seedSpun,
  seedStale,
  verdictOf,
} from "./sprag.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverSprag(result) {
  assert.equal(result.idleWord, "overrun");
  assert.equal(IDLE_WORD, "overrun");
  assert.doesNotMatch(result.idleWord, /sprag/i);
  assert.doesNotMatch(IDLE_WORD, /sprag/i);
  assert.doesNotMatch(result.idleWord, /clutch|empty|failed|mcp|retry/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /pratique|bound|stilled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|stabled|wound/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.overrun, "boolean");
  assert.equal(typeof result.locked, "boolean");
  assert.equal(typeof result.mixed, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90494 locked is locked, slack, linear, idleWord overrun", () => {
  const seed = seed90494Locked();
  const result = decide(seed);
  assert.equal(result.verdict, "locked");
  assert.equal(result.state, "locked");
  assert.equal(result.decision, "locked");
  assert.equal(classify(seed.probe), "locked");
  assert.equal(verdictOf(seed.probe), "locked");
  assert.notEqual(result.verdict, "overrun");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.raceLocked, true);
  assert.equal(result.raceOverrun, false);
  assert.equal(result.overrun, false);
  assert.equal(result.locked, true);
  assert.equal(result.mixed, false);
  assertIdleNeverSprag(result);
  assert.equal(result.session, "90494-locked");
  assert.equal(result.issue, 90494);
  assert.equal(result.attachFailed, true);
  assert.equal(result.serverRunningNow, true);
  assert.equal(result.serverRunningAtBoot, false);
  assert.equal(result.retried, false);
  assert.equal(result.toolsAvailable, false);
  assert.match(result.feed, /later reachable|process lifetime|primary #90494/i);
  assert.ok(result.cluster.includes("late"));
  assert.ok(result.cluster.includes("cached"));
  assert.ok(!result.cluster.includes("locked"));
  assert.ok(!result.cluster.includes("overrun"));
  assert.equal(decideSeed(90494).verdict, "locked");
  assert.equal(decideSeed("locked").verdict, "locked");
  assert.equal(decideSeed("90494-locked").verdict, "locked");
});

test("2 idle/empty/{} is overrun, never the product name, never empty, never pratique", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "overrun");
  assert.equal(result.verdict, "overrun");
  assert.equal(result.decision, "overrun");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.overrun, true);
  assert.equal(result.locked, false);
  assert.equal(classify({}), "overrun");
  assert.equal(classify(emptyProbe()), "overrun");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverSprag(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "overrun");
  assert.equal(bailed.idleWord, "overrun");
  assert.equal(bailed.attachFailed, false);
  assert.doesNotMatch(bailed.state, /sprag/i);
  assert.doesNotMatch(bailed.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "overrun");
  assert.equal(empty.idleWord, "overrun");
});

test("3 mixed: No token data found on boot-pinned transport + current credentials", () => {
  const result = decide(seedMixed());
  assert.equal(result.verdict, "mixed");
  assert.equal(result.reconnectAttempted, true);
  assert.match(result.reconnectError, /No token data found/i);
  assert.equal(result.transportPinnedAtBoot, "http");
  assert.equal(result.transportNow, "stdio");
  assert.equal(result.tokenDataFound, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.mixed, true);
  assert.match(result.feed, /No token data found/i);
  assert.equal(decideSeed("mixed").verdict, "mixed");
  assert.equal(decideSeed("90494-mixed").verdict, "mixed");
});

test("4 late: server started after the claude process", () => {
  const result = decide(seedLate());
  assert.equal(result.verdict, "late");
  assert.equal(result.serverRunningAtBoot, false);
  assert.equal(result.serverRunningNow, true);
  assert.equal(result.attachFailed, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /started after the claude process/i);
  assert.equal(decideSeed("late").verdict, "late");
  assert.equal(decideSeed(84778).verdict, "late");
});

test("5 refused: ConnectionRefused at boot", () => {
  const result = decide(seedRefused());
  assert.equal(result.verdict, "refused");
  assert.equal(result.attachFailed, true);
  assert.equal(result.serverRunningNow, false);
  assert.match(result.reconnectError, /ConnectionRefused/i);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /ConnectionRefused at boot/i);
  assert.equal(decideSeed("refused").verdict, "refused");
});

test("6 cached: failed connection cached for process lifetime", () => {
  const result = decide(seedCached());
  assert.equal(result.verdict, "cached");
  assert.equal(result.attachFailed, true);
  assert.equal(result.retried, false);
  assert.equal(result.observed, true);
  assert.equal(result.toolsAvailable, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /cached for process lifetime/i);
  assert.equal(decideSeed("cached").verdict, "cached");
  assert.equal(decideSeed(81042).verdict, "cached");
});

test("7 stale: reconnect used boot-pinned transport", () => {
  const result = decide(seedStale());
  assert.equal(result.verdict, "stale");
  assert.equal(result.reconnectAttempted, true);
  assert.equal(result.transportPinnedAtBoot, "http");
  assert.equal(result.tokenDataFound, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /boot-pinned transport/i);
  assert.equal(decideSeed("stale").verdict, "stale");
  assert.equal(decideSeed(83044).verdict, "stale");
});

test("8 spun: recovered only by full process restart", () => {
  const result = decide(seedSpun());
  assert.equal(result.verdict, "spun");
  assert.equal(result.processRestarted, true);
  assert.equal(result.toolsAvailable, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /full process restart/i);
  assert.equal(decideSeed("spun").verdict, "spun");
});

test("9 held: classification uncertain", () => {
  const result = decide(seedHeld());
  assert.equal(result.verdict, "held");
  assert.equal(result.attachFailed, true);
  assert.equal(result.processRestarted, true);
  assert.equal(result.toolsAvailable, false);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /classification uncertain/i);
  assert.equal(decideSeed("held").verdict, "held");
  assert.equal(decideSeed(85766).verdict, "held");
});

test("10 live: server was up at boot, connected, tools available", () => {
  const result = decide(seedLive());
  assert.equal(result.verdict, "live");
  assert.equal(result.serverRunningAtBoot, true);
  assert.equal(result.toolsAvailable, true);
  assert.equal(result.attachFailed, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /up at boot/i);
  assert.equal(decideSeed("live").verdict, "live");
});

test("11 overrun seed is overrun and never alarms", () => {
  const result = decide(seedOverrun());
  assert.equal(result.verdict, "overrun");
  assert.equal(result.attachFailed, false);
  assert.equal(result.overrun, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Overrun/);
  assert.equal(decideSeed("overrun").verdict, "overrun");
});

test("12 score() idle probe is overrun and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "overrun");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.overrun, true);
  assert.equal(result.locked, false);
  assert.equal(result.mixed, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "overrun",
    "locked",
    "mixed",
    "late",
    "refused",
    "cached",
    "stale",
    "spun",
    "held",
    "live",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["locked", "mixed", "late", "refused", "cached", "stale"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["locked", "mixed"]);
  assert.equal(IDLE_WORD, "overrun");
  assert.doesNotMatch(IDLE_WORD, /sprag/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /clutch|failed|mcp|retry|pratique|wound|bound|stilled/);
  assert.doesNotMatch(VERDICTS.join(" "), /empty|sprag|pratique|wound|bound|stilled/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["overrun", seedOverrun],
    ["locked", seed90494Locked],
    ["mixed", seedMixed],
    ["late", seedLate],
    ["refused", seedRefused],
    ["cached", seedCached],
    ["stale", seedStale],
    ["spun", seedSpun],
    ["held", seedHeld],
    ["live", seedLive],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: locked stays locked", () => {
  const result = decide({ ...seed90494Locked(), action: "admit" });
  assert.equal(result.verdict, "locked");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /overrun/);
  assert.doesNotMatch(result.verdict, /sprag/i);
});

test("16 score / stamp / throw scores locked", () => {
  const result = decide({ ...seed90494Locked(), action: "score" });
  assert.equal(result.verdict, "locked");
  assert.equal(result.action, "score");
  assert.equal(result.attachFailed, true);
  const stamped = decide({ ...seed90494Locked(), action: "stamp" });
  assert.equal(stamped.verdict, "locked");
  assert.equal(stamped.action, "stamp");
  const thrown = decide({ ...seed90494Locked(), action: "throw" });
  assert.equal(thrown.verdict, "locked");
  assert.equal(thrown.action, "score");
});

test("17 bail / overrun returns idle overrun", () => {
  const bailed = decide({ ...seed90494Locked(), action: "bail" });
  assert.equal(bailed.verdict, "overrun");
  assert.equal(bailed.action, "bail");
  assert.equal(bailed.attachFailed, false);
  assert.equal(isIdle(bailed.probe), true);
  assertIdleNeverSprag(bailed);
  const idle = decide({ ...seedCached(), action: "overrun" });
  assert.equal(idle.verdict, "overrun");
  const still = decide({ ...seedRefused(), action: "still" });
  assert.equal(still.verdict, "overrun");
});

test("18 race on idle produces locked 90494 strike", () => {
  const result = decide({ action: "race", probe: emptyProbe() });
  assert.equal(result.verdict, "locked");
  assert.equal(result.action, "race");
  assert.equal(result.issue, 90494);
  assert.equal(result.locked, true);
});

test("19 race on a late probe becomes locked", () => {
  const result = decide({ ...seedLate(), action: "race" });
  assert.equal(result.verdict, "locked");
  assert.equal(result.action, "race");
  assert.equal(result.attachFailed, true);
});

test("20 ledger marks the race sound and does not lie", () => {
  const result = decide({ ...seed90494Locked(), action: "ledger" });
  assert.equal(result.verdict, "locked");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Race sounded/.test(line)));
});

test("21 observe on cached stays cached", () => {
  const result = decide({ ...seedCached(), action: "observe" });
  assert.equal(result.verdict, "cached");
  assert.equal(result.observed, true);
  assert.equal(result.attachFailed, true);
});

test("22 locked beats late/cached/refused when the full #90494 signature is present", () => {
  assert.equal(
    classify({
      serverRunningAtBoot: false,
      serverRunningNow: true,
      attachFailed: true,
      retried: false,
      processRestarted: false,
      toolsAvailable: false,
      reconnectError: "ConnectionRefused",
    }),
    "locked",
  );
  assert.equal(lockedFault(seed90494Locked().probe), true);
  assert.equal(lockedRaceOf(seed90494Locked().probe), true);
});

test("23 mixed requires reconnect token mismatch without the full locked race", () => {
  assert.equal(
    classify({
      attachFailed: true,
      retried: true,
      reconnectAttempted: true,
      reconnectError: "No token data found",
      transportPinnedAtBoot: "http",
      transportNow: "stdio",
      tokenDataFound: false,
      serverRunningNow: true,
    }),
    "mixed",
  );
});

test("24 late is server-after-process without attachFailed", () => {
  assert.equal(
    classify({
      serverRunningAtBoot: false,
      serverRunningNow: true,
      attachFailed: false,
    }),
    "late",
  );
});

test("25 refused is ConnectionRefused at boot with server still down", () => {
  assert.equal(
    classify({
      attachFailed: true,
      serverRunningAtBoot: false,
      serverRunningNow: false,
      reconnectError: "ConnectionRefused",
    }),
    "refused",
  );
});

test("26 nested race / clutch / sprag / bench fields clone", () => {
  const probe = cloneProbe({
    race: {
      serverRunningAtBoot: false,
      serverRunningNow: true,
      attachFailed: true,
      retried: false,
      processRestarted: false,
      toolsAvailable: false,
    },
  });
  assert.equal(classify(probe), "locked");
  const clutch = cloneProbe({
    clutch: {
      reconnectAttempted: true,
      reconnectError: "No token data found",
      tokenDataFound: false,
      retried: true,
      attachFailed: true,
      serverRunningNow: true,
    },
  });
  assert.equal(classify(clutch), "mixed");
});

test("27 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("locked"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("mixed"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("late"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("refused"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("cached"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("stale"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("overrun"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("held"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("spun"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("live"), { slack: false, linear: false, github: true, alarm: false });
});

test("28 overrun / locked / mixed helpers", () => {
  assert.equal(overrunOf(seed90494Locked().probe), false);
  assert.equal(lockedOf(seed90494Locked().probe), true);
  assert.equal(mixedOf(seed90494Locked().probe), false);
  assert.equal(overrunOf(emptyProbe()), true);
  assert.equal(mixedOf(seedMixed().probe), true);
  assert.equal(lockedOf(seedMixed().probe), false);
  assert.equal(overrunOf(seedLate().probe), false);
});

test("29 feed and reasons never use sprag or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "overrun");
  assert.doesNotMatch(idle.feed, /idle word is sprag/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.doesNotMatch(idle.feed, /idle word is pratique/i);
  assert.ok(idle.reasons.every((line) => !/idle word is sprag/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "overrun"), /Overrun/);
  assert.ok(reasonsOf(emptyProbe(), "overrun").some((line) => /idle word is overrun/.test(line)));
});

test("30 forbidden idle list includes sprag, clutch, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("sprag"));
  assert.ok(words.includes("clutch"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("failed"));
  assert.ok(words.includes("mcp"));
  assert.ok(words.includes("retry"));
  assert.ok(words.includes("pratique"));
  assert.ok(words.includes("bound"));
  assert.ok(words.includes("stilled"));
  assert.ok(words.includes("wound"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("reed"));
  assert.ok(words.includes("lazaret"));
  assert.ok(words.includes("fusee"));
  assert.ok(!words.includes("overrun"));
});

test("31 demo sinks: Slack on alarm; Linear on locked/mixed; GitHub always", async () => {
  const locked = decide(seed90494Locked());
  const slack = slackSpragAlarm(locked, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubSpragLedger(locked, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub sprag-ledger/);
  const linear = linearSpragTicket(locked, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedLive());
  const linearSkip = linearSpragTicket(honest, {});
  assert.equal(linearSkip.mode, "demo");
  assert.match(linearSkip.summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackSpragAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearSpragTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(locked, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("32 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const locked = decide(seed90494Locked());
  const slack = slackSpragAlarm(locked, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubSpragLedger(locked, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearSpragTicket(locked, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("33 Slack skip on overrun / held / spun / live", () => {
  for (const seed of [seedOverrun, seedHeld, seedSpun, seedLive]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackSpragAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("34 Linear only on locked and mixed", () => {
  assert.equal(decide(seed90494Locked()).linear, true);
  assert.equal(decide(seedMixed()).linear, true);
  assert.equal(decide(seedLate()).linear, false);
  assert.equal(decide(seedRefused()).linear, false);
  assert.equal(decide(seedCached()).linear, false);
  assert.equal(decide(seedStale()).linear, false);
  assert.equal(decide(seedHeld()).linear, false);
  assert.equal(decide(seedOverrun()).linear, false);
});

test("35 GitHub ledger fires on idle/bail scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.github, true);
});

test("36 handle locked / mixed / late / refused / cached / stale deny", async () => {
  const locked = await handle(seed90494Locked(), {});
  assert.equal(locked.permissionDecision, "deny");
  assert.match(locked.hookSpecificOutput.decision.message, /locked/);
  const mixed = await handle(seedMixed(), {});
  assert.equal(mixed.permissionDecision, "deny");
  const late = await handle(seedLate(), {});
  assert.equal(late.permissionDecision, "deny");
  const refused = await handle(seedRefused(), {});
  assert.equal(refused.permissionDecision, "deny");
  const cached = await handle(seedCached(), {});
  assert.equal(cached.permissionDecision, "deny");
  const stale = await handle(seedStale(), {});
  assert.equal(stale.permissionDecision, "deny");
});

test("37 handle overrun / held / spun / live allow", async () => {
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /overrun/);
  const held = await handle(seedHeld(), {});
  assert.equal(held.permissionDecision, "allow");
  const spun = await handle(seedSpun(), {});
  assert.equal(spun.permissionDecision, "allow");
  const live = await handle(seedLive(), {});
  assert.equal(live.permissionDecision, "allow");
});

test("38 listen GET health and POST empty body is overrun", async () => {
  const server = listen(19204);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19204/health");
  const info = await health.json();
  assert.equal(info.product, "sprag");
  assert.match(info.verbs, /locked/);
  const res = await fetch("http://127.0.0.1:19204/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "overrun");
  assert.equal(body.idleWord, "overrun");
  const scored = await fetch("http://127.0.0.1:19204/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90494Locked()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "locked");
  await new Promise((resolve) => server.close(resolve));
});

test("39 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19205);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19205/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19205/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("40 every verdict is uniquely first-match on its seed", () => {
  const map = {
    overrun: seedOverrun,
    locked: seed90494Locked,
    mixed: seedMixed,
    late: seedLate,
    refused: seedRefused,
    cached: seedCached,
    stale: seedStale,
    spun: seedSpun,
    held: seedHeld,
    live: seedLive,
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
    ["locked", seed90494Locked],
    ["mixed", seedMixed],
    ["late", seedLate],
    ["refused", seedRefused],
    ["cached", seedCached],
    ["stale", seedStale],
    ["spun", seedSpun],
    ["held", seedHeld],
    ["live", seedLive],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("42 desk HTML sanity: idle word overrun, seeded locked, not lazaret/fusee/reed", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /overrun/);
  assert.match(html, /Score/);
  assert.match(html, /Bail/);
  assert.match(html, /locked/);
  assert.match(html, /90494/);
  assert.match(html, /seedOf\("locked"\)|probe = seedOf\("locked"\)/);
  assert.doesNotMatch(html, /Admit sprag/);
  assert.doesNotMatch(html, /const IDLE_WORD = "sprag"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "pratique"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "wound"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "bound"/);
  assert.match(html, /const IDLE_WORD = "overrun"/);
  assert.match(html, /clutch|inner-race|outer-race|drain-plug|race-lamp|atf|sprag-wedge/i);
  assert.match(html, /12:50 Sydney · sprag/);
  assert.match(html, /failed attach at boot is not a hold/i);
  assert.doesNotMatch(html, /class="yellow-jack"|class="inspection-lantern"|class="ward"|class="tide-line"/);
  assert.doesNotMatch(html, /class="oak-case"|class="enamel-face"|class="fusee-drum"|class="winding-arbor"/);
  assert.doesNotMatch(html, /class="tappet"|class="valve-train"|class="camshaft"/);
  assert.doesNotMatch(html, /class="sluice"|class="raceway"|class="mill"/);
  assert.doesNotMatch(html, /class="rails"|class="siding"|class="wagons"|class="signal-box"/);
  assert.doesNotMatch(html, /class="compositor"|class="case-stand"|class="drawers"/);
  assert.doesNotMatch(html, /class="contacts"|class="reed-relay"|class="cabinet-glass"/);
  assert.doesNotMatch(html, /class="shelf"|class="stillroom"|class="jar"/);
  assert.doesNotMatch(html, /--jack:|--verdigris:|--harbour:|--lime:/);
  assert.doesNotMatch(html, /--midnight:|--gild:|--enamel:|--lampoil:|--arbor:/);
  assert.doesNotMatch(html, /Newsreader|Figtree/);
  assert.doesNotMatch(html, /Cormorant|Outfit/);
  assert.doesNotMatch(html, /Fraunces|IBM Plex Mono/);
  assert.doesNotMatch(html, /Barlow Condensed|Source Code Pro/);
  assert.doesNotMatch(html, /Playfair Display|IBM Plex Sans/);
  assert.doesNotMatch(html, /Bodoni Moda|Karla/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Sprag/);
  assert.match(html, /Teko|Atkinson Hyperlegible/);
});

test("43 HTML why-not names Reed, Lazaret, Fusee, Larder, Tappet, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Reed/);
  assert.match(html, /NOT Lazaret/);
  assert.match(html, /NOT Fusee/);
  assert.match(html, /NOT Larder/);
  assert.match(html, /NOT Tappet/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Sprag is a mill/i);
  assert.doesNotMatch(html, /Sprag is a railway/i);
  assert.doesNotMatch(html, /Sprag is a type-case/i);
  assert.doesNotMatch(html, /Sprag is a clock/i);
  assert.doesNotMatch(html, /Sprag is a lazaret/i);
  assert.doesNotMatch(html, /this is a night yard/i);
});

test("44 README names Reed / Lazaret / Fusee / Larder / Tappet contrast and overrun idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Reed/);
  assert.match(readme, /NOT Lazaret/);
  assert.match(readme, /NOT Fusee/);
  assert.match(readme, /NOT Larder/);
  assert.match(readme, /NOT Tappet/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*overrun\*\*/);
  assert.match(readme, /#90494|#90494/);
  assert.match(readme, /#84778|#84778/);
  assert.match(readme, /#81042|#81042/);
  assert.doesNotMatch(readme, /idle word is sprag/i);
  assert.doesNotMatch(readme, /idle word is pratique/i);
  assert.doesNotMatch(readme, /idle word is wound/i);
  assert.doesNotMatch(readme, /Sprag is a mill/i);
});

test("45 score() locked includes locked and not overrun", () => {
  const result = score(seed90494Locked().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "locked");
  assert.equal(result.overrun, false);
  assert.equal(result.locked, true);
  assert.equal(result.mixed, false);
});

test("46 fire live slack posts when fetch ok", async () => {
  const locked = decide(seed90494Locked());
  const events = await fire(locked, { SPRAG_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted locked/);
});

test("47 parseSessionTrace reads #90494 locked paste", () => {
  const probe = parseSessionTrace(
    "start claude while the server is not running yet. ConnectionRefused. start the server. curl succeeds. same process still failed. /clear still failed. #90494",
  );
  assert.equal(probe.attachFailed, true);
  assert.equal(probe.serverRunningNow, true);
  assert.equal(probe.issue, 90494);
  assert.equal(classify(probe), "locked");
});

test("48 parseSessionTrace reads mixed No token data found", () => {
  const probe = parseSessionTrace(
    "config migrated HTTP+bearer to stdio. /mcp reconnect fails No token data found. #90494",
  );
  assert.equal(probe.reconnectAttempted, true);
  assert.match(probe.reconnectError, /No token data found/i);
  assert.equal(probe.tokenDataFound, false);
});

test("49 analyze locked race exposes late start and cache", () => {
  const facts = analyze(seed90494Locked().probe);
  assert.equal(facts.lockedRace, true);
  assert.equal(facts.lateStart, true);
  assert.equal(facts.attachFailed, true);
  assert.equal(facts.toolsAvailable, false);
});

test("50 clutch / lock verbs produce locked strike", () => {
  assert.equal(decide({ action: "clutch" }).verdict, "locked");
  assert.equal(decide({ action: "lock" }).verdict, "locked");
  assert.equal(decide({ action: "freewheel" }).verdict, "live");
});
