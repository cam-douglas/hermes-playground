import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubLazaretLedger,
  linearLazaretTicket,
  slackLazaretAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  BUDGET_15_MIN_MS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  asFileKind,
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
  lostFault,
  lostOf,
  lostSeatOf,
  parseSessionTrace,
  pratiqueOf,
  reasonsOf,
  refusedOf,
  score,
  seed90326Lost,
  seedCordoned,
  seedFalse,
  seedHeld,
  seedPassed,
  seedPratique,
  seedRefused,
  seedStranded,
  seedTimed,
  seedYellow,
  verdictOf,
} from "./lazaret.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverLazaret(result) {
  assert.equal(result.idleWord, "pratique");
  assert.equal(IDLE_WORD, "pratique");
  assert.doesNotMatch(result.idleWord, /lazaret/i);
  assert.doesNotMatch(IDLE_WORD, /lazaret/i);
  assert.doesNotMatch(result.idleWord, /quarantine|empty|malware|reminder/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /bound|stilled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|stabled|wound/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.pratique, "boolean");
  assert.equal(typeof result.refused, "boolean");
  assert.equal(typeof result.lost, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90326 lost is lost, slack, linear, idleWord pratique", () => {
  const seed = seed90326Lost();
  const result = decide(seed);
  assert.equal(result.verdict, "lost");
  assert.equal(result.state, "lost");
  assert.equal(result.decision, "lost");
  assert.equal(classify(seed.probe), "lost");
  assert.equal(verdictOf(seed.probe), "lost");
  assert.notEqual(result.verdict, "pratique");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.billLost, true);
  assert.equal(result.billPratique, false);
  assert.equal(result.pratique, false);
  assert.equal(result.refused, false);
  assert.equal(result.lost, true);
  assertIdleNeverLazaret(result);
  assert.equal(result.session, "90326-lost");
  assert.equal(result.issue, 90326);
  assert.equal(result.fileKind, "legitimate");
  assert.equal(result.reminderFired, true);
  assert.equal(result.humanPresent, false);
  assert.equal(result.timedOut, true);
  assert.equal(result.workDone, false);
  assert.equal(result.budgetMs, BUDGET_15_MIN_MS);
  assert.match(result.feed, /15-minute|unattended|no files written/i);
  assert.ok(result.cluster.includes("refused"));
  assert.ok(result.cluster.includes("timed"));
  assert.ok(result.cluster.includes("yellow"));
  assert.ok(!result.cluster.includes("lost"));
  assert.ok(!result.cluster.includes("pratique"));
  assert.equal(decideSeed(90326).verdict, "lost");
  assert.equal(decideSeed("lost").verdict, "lost");
  assert.equal(decideSeed("90326-lost").verdict, "lost");
});

test("2 idle/empty/{} is pratique, never the product name, never empty, never wound", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "pratique");
  assert.equal(result.verdict, "pratique");
  assert.equal(result.decision, "pratique");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.pratique, true);
  assert.equal(result.lost, false);
  assert.equal(classify({}), "pratique");
  assert.equal(classify(emptyProbe()), "pratique");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverLazaret(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "pratique");
  assert.equal(bailed.idleWord, "pratique");
  assert.equal(bailed.reminderFired, false);
  assert.doesNotMatch(bailed.state, /lazaret/i);
  assert.doesNotMatch(bailed.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "pratique");
  assert.equal(empty.idleWord, "pratique");
});

test("3 refused: interactive subagent refused a legitimate module", () => {
  const result = decide(seedRefused());
  assert.equal(result.verdict, "refused");
  assert.equal(result.humanPresent, true);
  assert.equal(result.fileKind, "legitimate");
  assert.equal(result.probe.refused, true);
  assert.equal(result.timedOut, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.refused, true);
  assert.match(result.feed, /interactive subagent refused/i);
  assert.equal(decideSeed("refused").verdict, "refused");
  assert.equal(decideSeed(52272).verdict, "refused");
});

test("4 stranded: confirmation asked, nobody in the session", () => {
  const result = decide(seedStranded());
  assert.equal(result.verdict, "stranded");
  assert.equal(result.humanPresent, false);
  assert.equal(result.confirmationRequested, true);
  assert.equal(result.timedOut, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /nobody in the session/i);
  assert.equal(decideSeed("stranded").verdict, "stranded");
});

test("5 cordoned: reminder fired, work stopped, waiting", () => {
  const result = decide(seedCordoned());
  assert.equal(result.verdict, "cordoned");
  assert.equal(result.reminderFired, true);
  assert.equal(result.workDone, false);
  assert.equal(result.confirmationRequested, true);
  assert.equal(result.timedOut, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /work stopped, waiting/i);
  assert.equal(decideSeed("cordoned").verdict, "cordoned");
});

test("6 yellow: reminder fired on a legitimate file", () => {
  const result = decide(seedYellow());
  assert.equal(result.verdict, "yellow");
  assert.equal(result.fileKind, "legitimate");
  assert.equal(result.reminderFired, true);
  assert.equal(result.probe.refused, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /yellow jack is not a hold/i);
  assert.equal(decideSeed("yellow").verdict, "yellow");
});

test("7 false: classified false-positive", () => {
  const result = decide(seedFalse());
  assert.equal(result.verdict, "false");
  assert.equal(result.fileKind, "legitimate");
  assert.equal(result.humanPresent, true);
  assert.equal(result.probe.refused, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /false-positive/i);
  assert.equal(decideSeed("false").verdict, "false");
});

test("8 timed: budget exhausted waiting for confirm", () => {
  const result = decide(seedTimed());
  assert.equal(result.verdict, "timed");
  assert.equal(result.timedOut, true);
  assert.equal(result.confirmationRequested, true);
  assert.equal(result.humanPresent, true);
  assert.equal(result.probe.refused, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /budget exhausted/i);
  assert.equal(decideSeed("timed").verdict, "timed");
});

test("9 held: reminder fired, classification uncertain", () => {
  const result = decide(seedHeld());
  assert.equal(result.verdict, "held");
  assert.equal(result.fileKind, "unknown");
  assert.equal(result.reminderFired, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /classification uncertain/i);
  assert.equal(decideSeed("held").verdict, "held");
  assert.equal(decideSeed(47027).verdict, "held");
});

test("10 passed: human confirmed, work proceeded", () => {
  const result = decide(seedPassed());
  assert.equal(result.verdict, "passed");
  assert.equal(result.confirmationReceived, true);
  assert.equal(result.workDone, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /human confirmed/i);
  assert.equal(decideSeed("passed").verdict, "passed");
});

test("11 pratique seed is pratique and never alarms", () => {
  const result = decide(seedPratique());
  assert.equal(result.verdict, "pratique");
  assert.equal(result.reminderFired, false);
  assert.equal(result.pratique, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Pratique/);
  assert.equal(decideSeed("pratique").verdict, "pratique");
});

test("12 score() idle probe is pratique and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "pratique");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.pratique, true);
  assert.equal(result.refused, false);
  assert.equal(result.lost, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "pratique",
    "refused",
    "lost",
    "stranded",
    "cordoned",
    "yellow",
    "false",
    "timed",
    "held",
    "passed",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "refused",
    "lost",
    "stranded",
    "cordoned",
    "yellow",
    "false",
    "timed",
  ]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["refused", "lost", "stranded", "false"]);
  assert.equal(IDLE_WORD, "pratique");
  assert.doesNotMatch(IDLE_WORD, /lazaret/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /quarantine|malware|reminder|wound|bound|stilled/);
  assert.doesNotMatch(VERDICTS.join(" "), /empty|lazaret|wound|bound|stilled/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["pratique", seedPratique],
    ["lost", seed90326Lost],
    ["refused", seedRefused],
    ["stranded", seedStranded],
    ["cordoned", seedCordoned],
    ["yellow", seedYellow],
    ["false", seedFalse],
    ["timed", seedTimed],
    ["held", seedHeld],
    ["passed", seedPassed],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: lost stays lost", () => {
  const result = decide({ ...seed90326Lost(), action: "admit" });
  assert.equal(result.verdict, "lost");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /pratique/);
  assert.doesNotMatch(result.verdict, /lazaret/i);
});

test("16 score / stamp / throw scores lost", () => {
  const result = decide({ ...seed90326Lost(), action: "score" });
  assert.equal(result.verdict, "lost");
  assert.equal(result.action, "score");
  assert.equal(result.timedOut, true);
  const stamped = decide({ ...seed90326Lost(), action: "stamp" });
  assert.equal(stamped.verdict, "lost");
  assert.equal(stamped.action, "stamp");
  const thrown = decide({ ...seed90326Lost(), action: "throw" });
  assert.equal(thrown.verdict, "lost");
  assert.equal(thrown.action, "score");
});

test("17 bail / pratique returns idle pratique", () => {
  const bailed = decide({ ...seed90326Lost(), action: "bail" });
  assert.equal(bailed.verdict, "pratique");
  assert.equal(bailed.action, "bail");
  assert.equal(bailed.reminderFired, false);
  assert.equal(isIdle(bailed.probe), true);
  assertIdleNeverLazaret(bailed);
  const idle = decide({ ...seedCordoned(), action: "pratique" });
  assert.equal(idle.verdict, "pratique");
  const still = decide({ ...seedRefused(), action: "still" });
  assert.equal(still.verdict, "pratique");
});

test("18 bill on idle produces lost 90326 strike", () => {
  const result = decide({ action: "bill", probe: emptyProbe() });
  assert.equal(result.verdict, "lost");
  assert.equal(result.action, "bill");
  assert.equal(result.issue, 90326);
  assert.equal(result.lost, true);
});

test("19 bill on a yellow probe becomes lost", () => {
  const result = decide({ ...seedYellow(), action: "bill" });
  assert.equal(result.verdict, "lost");
  assert.equal(result.action, "bill");
  assert.equal(result.fileKind, "legitimate");
});

test("20 ledger marks the bill sound and does not lie", () => {
  const result = decide({ ...seed90326Lost(), action: "ledger" });
  assert.equal(result.verdict, "lost");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Bill sounded/.test(line)));
});

test("21 observe on cordoned stays cordoned", () => {
  const result = decide({ ...seedCordoned(), action: "observe" });
  assert.equal(result.verdict, "cordoned");
  assert.equal(result.observed, true);
  assert.equal(result.reminderFired, true);
});

test("22 lost beats refused/stranded/timed when the full #90326 signature is present", () => {
  assert.equal(
    classify({
      reminderFired: true,
      fileKind: "legitimate",
      refused: true,
      humanPresent: false,
      confirmationRequested: true,
      confirmationReceived: false,
      timedOut: true,
      workDone: false,
      budgetMs: BUDGET_15_MIN_MS,
    }),
    "lost",
  );
  assert.equal(lostFault(seed90326Lost().probe), true);
  assert.equal(lostSeatOf(seed90326Lost().probe), true);
});

test("23 refused requires a legitimate refusal without the full lost seat", () => {
  assert.equal(
    classify({
      reminderFired: true,
      fileKind: "legitimate",
      refused: true,
      humanPresent: true,
    }),
    "refused",
  );
});

test("24 stranded is confirmation without a human and without timeout", () => {
  assert.equal(
    classify({
      reminderFired: true,
      fileKind: "legitimate",
      confirmationRequested: true,
      humanPresent: false,
      timedOut: false,
    }),
    "stranded",
  );
});

test("25 timed is budget death waiting, not the full lost refusal", () => {
  assert.equal(
    classify({
      reminderFired: true,
      fileKind: "legitimate",
      refused: false,
      humanPresent: true,
      confirmationRequested: true,
      timedOut: true,
    }),
    "timed",
  );
});

test("26 nested bill / lazaret / quay / lantern fields clone", () => {
  const probe = cloneProbe({
    bill: {
      reminderFired: true,
      fileKind: "legitimate",
      refused: true,
      humanPresent: false,
      confirmationRequested: true,
      timedOut: true,
      workDone: false,
    },
  });
  assert.equal(classify(probe), "lost");
  const quay = cloneProbe({
    quay: {
      reminderFired: true,
      fileKind: "legitimate",
      refused: true,
      humanPresent: true,
    },
  });
  assert.equal(classify(quay), "refused");
});

test("27 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("lost"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("refused"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("stranded"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("cordoned"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("yellow"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("false"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("timed"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("pratique"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("held"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("passed"), { slack: false, linear: false, github: true, alarm: false });
});

test("28 pratique / refused / lost helpers", () => {
  assert.equal(pratiqueOf(seed90326Lost().probe), false);
  assert.equal(lostOf(seed90326Lost().probe), true);
  assert.equal(refusedOf(seed90326Lost().probe), false);
  assert.equal(pratiqueOf(emptyProbe()), true);
  assert.equal(refusedOf(seedRefused().probe), true);
  assert.equal(lostOf(seedRefused().probe), false);
  assert.equal(pratiqueOf(seedYellow().probe), false);
});

test("29 feed and reasons never use lazaret or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "pratique");
  assert.doesNotMatch(idle.feed, /idle word is lazaret/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.doesNotMatch(idle.feed, /idle word is wound/i);
  assert.ok(idle.reasons.every((line) => !/idle word is lazaret/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "pratique"), /Pratique/);
  assert.ok(reasonsOf(emptyProbe(), "pratique").some((line) => /idle word is pratique/.test(line)));
});

test("30 forbidden idle list includes lazaret, quarantine, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("lazaret"));
  assert.ok(words.includes("quarantine"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("malware"));
  assert.ok(words.includes("reminder"));
  assert.ok(words.includes("bound"));
  assert.ok(words.includes("stilled"));
  assert.ok(words.includes("wound"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("fusee"));
  assert.ok(words.includes("iota"));
  assert.ok(words.includes("leat"));
  assert.ok(!words.includes("pratique"));
});

test("31 demo sinks: Slack on alarm; Linear on refused/lost/stranded/false; GitHub always", async () => {
  const lost = decide(seed90326Lost());
  const slack = slackLazaretAlarm(lost, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubLazaretLedger(lost, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub lazaret-ledger/);
  const linear = linearLazaretTicket(lost, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedPassed());
  const linearSkip = linearLazaretTicket(honest, {});
  assert.equal(linearSkip.mode, "demo");
  assert.match(linearSkip.summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackLazaretAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearLazaretTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(lost, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("32 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const lost = decide(seed90326Lost());
  const slack = slackLazaretAlarm(lost, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubLazaretLedger(lost, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearLazaretTicket(lost, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("33 Slack skip on pratique / held / passed", () => {
  for (const seed of [seedPratique, seedHeld, seedPassed]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackLazaretAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("34 Linear only on refused, lost, stranded, and false", () => {
  assert.equal(decide(seed90326Lost()).linear, true);
  assert.equal(decide(seedRefused()).linear, true);
  assert.equal(decide(seedStranded()).linear, true);
  assert.equal(decide(seedFalse()).linear, true);
  assert.equal(decide(seedCordoned()).linear, false);
  assert.equal(decide(seedYellow()).linear, false);
  assert.equal(decide(seedTimed()).linear, false);
  assert.equal(decide(seedHeld()).linear, false);
  assert.equal(decide(seedPratique()).linear, false);
});

test("35 GitHub ledger fires on idle/bail scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.github, true);
});

test("36 handle refused / lost / stranded / cordoned / yellow / false / timed deny", async () => {
  const lost = await handle(seed90326Lost(), {});
  assert.equal(lost.permissionDecision, "deny");
  assert.match(lost.hookSpecificOutput.decision.message, /lost/);
  const refused = await handle(seedRefused(), {});
  assert.equal(refused.permissionDecision, "deny");
  const stranded = await handle(seedStranded(), {});
  assert.equal(stranded.permissionDecision, "deny");
  const cordoned = await handle(seedCordoned(), {});
  assert.equal(cordoned.permissionDecision, "deny");
  const yellow = await handle(seedYellow(), {});
  assert.equal(yellow.permissionDecision, "deny");
  const classified = await handle(seedFalse(), {});
  assert.equal(classified.permissionDecision, "deny");
  const timed = await handle(seedTimed(), {});
  assert.equal(timed.permissionDecision, "deny");
});

test("37 handle pratique / held / passed allow", async () => {
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /pratique/);
  const held = await handle(seedHeld(), {});
  assert.equal(held.permissionDecision, "allow");
  const honest = await handle(seedPassed(), {});
  assert.equal(honest.permissionDecision, "allow");
});

test("38 listen GET health and POST empty body is pratique", async () => {
  const server = listen(19194);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19194/health");
  const info = await health.json();
  assert.equal(info.product, "lazaret");
  assert.match(info.verbs, /lost/);
  const res = await fetch("http://127.0.0.1:19194/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "pratique");
  assert.equal(body.idleWord, "pratique");
  const scored = await fetch("http://127.0.0.1:19194/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90326Lost()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "lost");
  await new Promise((resolve) => server.close(resolve));
});

test("39 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19195);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19195/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19195/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("40 every verdict is uniquely first-match on its seed", () => {
  const map = {
    pratique: seedPratique,
    lost: seed90326Lost,
    refused: seedRefused,
    stranded: seedStranded,
    cordoned: seedCordoned,
    yellow: seedYellow,
    false: seedFalse,
    timed: seedTimed,
    held: seedHeld,
    passed: seedPassed,
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
    ["lost", seed90326Lost],
    ["refused", seedRefused],
    ["stranded", seedStranded],
    ["cordoned", seedCordoned],
    ["yellow", seedYellow],
    ["false", seedFalse],
    ["timed", seedTimed],
    ["held", seedHeld],
    ["passed", seedPassed],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("42 desk HTML sanity: idle word pratique, seeded lost, not fusee/iota/leat", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /pratique/);
  assert.match(html, /Score/);
  assert.match(html, /Bail/);
  assert.match(html, /lost/);
  assert.match(html, /90326/);
  assert.match(html, /seedOf\("lost"\)|probe = seedOf\("lost"\)/);
  assert.doesNotMatch(html, /Admit lazaret/);
  assert.doesNotMatch(html, /const IDLE_WORD = "lazaret"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "wound"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "bound"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stilled"/);
  assert.match(html, /const IDLE_WORD = "pratique"/);
  assert.match(html, /lazaretto|yellow jack|bill of health|inspection lantern|pratique|spit of rock|salt/i);
  assert.match(html, /11:50 Sydney · lazaret/);
  assert.match(html, /written reminder is not a hold/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="booth"|class="punchcard"|class="ballot"/);
  assert.doesNotMatch(html, /class="flange"|class="packing"|class="chest"|class="hinge"|class="lid"/);
  assert.doesNotMatch(html, /class="shop"|class="needle-rail"|class="felt"/);
  assert.doesNotMatch(html, /class="grate-bar"|class="cistern"|class="sludge"|class="pump-house"/);
  assert.doesNotMatch(html, /class="rails"|class="siding"|class="wagons"|class="signal-box"/);
  assert.doesNotMatch(html, /class="sluice"|class="raceway"|class="mill"/);
  assert.doesNotMatch(html, /class="compositor"|class="case-stand"|class="drawers"/);
  assert.doesNotMatch(html, /class="oak-case"|class="enamel-face"|class="fusee-drum"|class="winding-arbor"/);
  assert.doesNotMatch(html, /--shed:|--pitch:|--pine:|--sawdust:/);
  assert.doesNotMatch(html, /--shop:|--felt:|--wool:|--worsted:/);
  assert.doesNotMatch(html, /--concrete:|--bilge:|--silt:|--ochre:/);
  assert.doesNotMatch(html, /--night:|--wagon:/);
  assert.doesNotMatch(html, /--moss:|--water:|--foam:|--algae:/);
  assert.doesNotMatch(html, /--ink:|--lead:|--vermilion:/);
  assert.doesNotMatch(html, /--midnight:|--gild:|--enamel:|--lampoil:|--arbor:/);
  assert.doesNotMatch(html, /Cormorant|Outfit/);
  assert.doesNotMatch(html, /Fraunces|IBM Plex Mono/);
  assert.doesNotMatch(html, /Barlow Condensed|Source Code Pro/);
  assert.doesNotMatch(html, /Playfair Display|IBM Plex Sans/);
  assert.doesNotMatch(html, /Bodoni Moda|Karla/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Lazaret/);
  assert.match(html, /Newsreader|Figtree/);
});

test("43 HTML why-not names Fusee, Iota, Leat, Knock, Scrim, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Fusee/);
  assert.match(html, /NOT Iota/);
  assert.match(html, /NOT Leat/);
  assert.match(html, /NOT Knock/);
  assert.match(html, /NOT Scrim/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Lazaret is a mill/i);
  assert.doesNotMatch(html, /Lazaret is a railway/i);
  assert.doesNotMatch(html, /Lazaret is a type-case/i);
  assert.doesNotMatch(html, /Lazaret is a clock/i);
  assert.doesNotMatch(html, /this is a night yard/i);
});

test("44 README names Fusee / Iota / Leat / Knock / Scrim contrast and pratique idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Fusee/);
  assert.match(readme, /NOT Iota/);
  assert.match(readme, /NOT Leat/);
  assert.match(readme, /NOT Knock/);
  assert.match(readme, /NOT Scrim/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*pratique\*\*/);
  assert.match(readme, /#90326|#90326/);
  assert.match(readme, /#52272|#52272/);
  assert.match(readme, /#49363|#49363/);
  assert.doesNotMatch(readme, /idle word is lazaret/i);
  assert.doesNotMatch(readme, /idle word is wound/i);
  assert.doesNotMatch(readme, /idle word is bound/i);
  assert.doesNotMatch(readme, /Lazaret is a mill/i);
});

test("45 score() lost includes lost and not pratique", () => {
  const result = score(seed90326Lost().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "lost");
  assert.equal(result.pratique, false);
  assert.equal(result.lost, true);
  assert.equal(result.refused, false);
});

test("46 fire live slack posts when fetch ok", async () => {
  const lost = decide(seed90326Lost());
  const events = await fire(lost, { LAZARET_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted lost/);
});

test("47 fire live github and linear paths", async () => {
  const lost = decide(seed90326Lost());
  const events = await fire(
    lost,
    {
      LAZARET_GITHUB_TOKEN: "tok",
      LAZARET_LINEAR_KEY: "lin",
      LAZARET_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "LAZ-1", url: "https://linear.app/laz-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /LAZ-1/);
});

test("48 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90326Lost().probe, "lost").some((line) => /#90326/.test(line)));
  assert.ok(reasonsOf(seedRefused().probe, "refused").some((line) => /#52272/.test(line)));
  assert.ok(reasonsOf(seedTimed().probe, "timed").some((line) => /#90326/.test(line)));
  assert.ok(reasonsOf(seedYellow().probe, "yellow").some((line) => /#49484|#50760/.test(line)));
});

test("49 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const lost = decide(seed90326Lost());
  const slack = slackLazaretAlarm(lost, {});
  const github = githubLazaretLedger(lost, {});
  const linear = linearLazaretTicket(lost, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(lost, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("50 catalog wiring: 37 products, Lazaret featured, Fusee listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 37);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Lazaret");
  assert.equal(featured[0].slug, "lazaret");
  assert.equal(featured[0].href, "/lazaret/");
  assert.equal(featured[0].day, "2026-08-29");
  assert.match(featured[0].summary, /11:50|written reminder is not a hold|pratique/);
  const fusee = catalog.products.find((row) => row.slug === "fusee");
  assert.ok(fusee);
  assert.equal(fusee.featured, false);
  assert.match(fusee.summary, /10:50|written cron is not a hold|wound/);
  const iota = catalog.products.find((row) => row.slug === "iota");
  assert.ok(iota);
  assert.equal(iota.featured, false);
  const leat = catalog.products.find((row) => row.slug === "leat");
  assert.ok(leat);
  assert.equal(leat.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "lazaret");
  assert.equal(slugs[1], "fusee");
  assert.ok(slugs.includes("iota"));
  assert.ok(slugs.includes("leat"));
  assert.ok(slugs.includes("knock"));
  assert.ok(!slugs.includes("quarantine"));
  assert.ok(!slugs.includes("lazaretto"));
  assert.ok(!slugs.includes("pratique"));
});

test("51 vercel rewrite order puts /lazaret before /fusee, /iota and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/lazaret");
  assert.equal(sources[1], "/lazaret/");
  assert.equal(sources[2], "/fusee");
  assert.equal(sources[3], "/fusee/");
  assert.ok(sources.includes("/fusee"));
  assert.ok(sources.includes("/iota"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/lazaret") < sources.indexOf("/fusee"));
  assert.ok(sources.indexOf("/fusee") < sources.indexOf("/iota"));
  assert.ok(sources.indexOf("/lazaret/") < sources.indexOf("/:slug"));
});

test("52 hours.json prepends the 11:50 Sydney Lazaret ship", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-lazaret");
  assert.equal(hours[0].date, "2026-08-29");
  assert.equal(hours[0].time, "11:50");
  assert.equal(hours[0].tz, "Australia/Sydney");
  assert.equal(hours[0].title, "Lazaret");
  assert.equal(hours[0].kind, "ship");
  assert.match(hours[0].note, /pratique/);
  assert.match(hours[0].note, /Fusee/);
  assert.match(hours[0].note, /Iota/);
  assert.match(hours[0].note, /37/);
  assert.equal(hours[1].stem, "2026-08-29-fusee");
});

test("53 clusterOf on #90326 includes refused timed yellow", () => {
  const cluster = clusterOf(seed90326Lost().probe, "lost");
  assert.ok(cluster.includes("refused"));
  assert.ok(cluster.includes("timed"));
  assert.ok(cluster.includes("yellow"));
});

test("54 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    reminderFired: "true",
    fileKind: "legitimate",
    refused: "true",
    humanPresent: "false",
    confirmationRequested: "true",
    confirmationReceived: "false",
    timedOut: "true",
    workDone: "false",
    budgetMs: String(BUDGET_15_MIN_MS),
  });
  assert.equal(probe.reminderFired, true);
  assert.equal(probe.refused, true);
  assert.equal(probe.humanPresent, false);
  assert.equal(probe.timedOut, true);
  assert.equal(probe.workDone, false);
  assert.equal(probe.budgetMs, BUDGET_15_MIN_MS);
  assert.equal(classify(probe), "lost");
});

test("55 parseSessionTrace detects #90326 unattended refusal / 15-minute budget", () => {
  const parsed = parseSessionTrace(`
This file is not malware. It is a legitimate server-side TypeScript module.
Per the system reminder, I must refuse to improve or augment this code.
please confirm and I'll proceed.
Nobody was in the session.
COPILOT_AGENT_TIMEOUT_MIN: 15
No files were written. Seat timed out waiting for a confirmation.
anthropics/claude-code#90326
unattended cloud seat Agent HQ
`);
  assert.equal(parsed.reminderFired, true);
  assert.equal(parsed.fileKind, "legitimate");
  assert.equal(parsed.refused, true);
  assert.equal(parsed.confirmationRequested, true);
  assert.equal(parsed.timedOut, true);
  assert.equal(parsed.workDone, false);
  assert.equal(parsed.issue, 90326);
  assert.equal(parsed.budgetMs, BUDGET_15_MIN_MS);
});

test("56 passed action scores a granted pratique, not idle pratique", () => {
  const result = decide({ ...seed90326Lost(), action: "passed" });
  assert.equal(result.verdict, "passed");
  assert.equal(result.action, "passed");
  assert.equal(result.workDone, true);
  assert.equal(result.alarm, false);
});

test("57 bill helpers: fileKind, lostSeat, analyze", () => {
  assert.equal(asFileKind("legitimate"), "legitimate");
  assert.equal(asFileKind("unknown"), "unknown");
  assert.equal(asFileKind("malware"), "malware");
  assert.equal(asFileKind("other"), "");
  assert.equal(lostSeatOf(seed90326Lost().probe), true);
  assert.equal(analyze(seed90326Lost().probe).lostSeat, true);
  assert.equal(analyze(seedYellow().probe).yellowJack, true);
});

test("58 env example lists LAZARET_SLACK_WEBHOOK, LAZARET_GITHUB_TOKEN, LAZARET_LINEAR_KEY", () => {
  const env = readFileSync(fileURLToPath(new URL("../.env.example", import.meta.url)), "utf8");
  assert.match(env, /LAZARET_SLACK_WEBHOOK/);
  assert.match(env, /LAZARET_GITHUB_TOKEN/);
  assert.match(env, /LAZARET_LINEAR_KEY/);
});
