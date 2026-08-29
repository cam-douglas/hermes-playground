import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubShuntLedger,
  linearShuntTicket,
  slackShuntAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  TYPE_LABEL,
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
  isIdle,
  misroutedOf,
  orphanedOf,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90463Misrouted,
  seedCrosstalk,
  seedDropped,
  seedOrphaned,
  seedRootbound,
  seedSidetracked,
  seedStabled,
  seedStalled,
  seedTandem,
  seedTypecast,
  stabledOf,
  verdictOf,
} from "./shunt.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverShunt(result) {
  assert.equal(result.idleWord, "stabled");
  assert.equal(IDLE_WORD, "stabled");
  assert.doesNotMatch(result.idleWord, /shunt/i);
  assert.doesNotMatch(IDLE_WORD, /shunt/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.stabled, "boolean");
  assert.equal(typeof result.misrouted, "boolean");
  assert.equal(typeof result.orphaned, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90463 misrouted is misrouted, slack, linear, idleWord stabled", () => {
  const seed = seed90463Misrouted();
  const result = decide(seed);
  assert.equal(result.verdict, "misrouted");
  assert.equal(result.state, "misrouted");
  assert.equal(result.decision, "misrouted");
  assert.equal(classify(seed.probe), "misrouted");
  assert.equal(verdictOf(seed.probe), "misrouted");
  assert.notEqual(result.verdict, "stabled");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.roadMisrouted, true);
  assert.equal(result.roadStabled, false);
  assert.equal(result.stabled, false);
  assert.equal(result.misrouted, true);
  assert.equal(result.orphaned, false);
  assertIdleNeverShunt(result);
  assert.equal(result.session, "90463-misrouted");
  assert.equal(result.issue, 90463);
  assert.equal(result.firstAnswerToParent, true);
  assert.equal(result.childProducedFollowUp, true);
  assert.equal(result.followUpToRoot, true);
  assert.equal(result.parentReceivedFollowUp, false);
  assert.equal(result.parentParkedWaiting, true);
  assert.equal(result.fromIsAgentType, true);
  assert.equal(result.fromResolves, false);
  assert.equal(result.nestedDepth, 2);
  assert.equal(result.keepaliveClearedAfterFirst, true);
  assert.equal(result.childFromLabel, TYPE_LABEL);
  assert.match(result.feed, /SECOND-ANSWER queued to root/i);
  assert.ok(result.cluster.includes("rootbound"));
  assert.ok(result.cluster.includes("typecast"));
  assert.ok(result.cluster.includes("stalled"));
  assert.ok(result.cluster.includes("sidetracked"));
  assert.ok(!result.cluster.includes("misrouted"));
  assert.ok(!result.cluster.includes("stabled"));
  assert.equal(decideSeed(90463).verdict, "misrouted");
  assert.equal(decideSeed("misrouted").verdict, "misrouted");
  assert.equal(decideSeed("90463-misrouted").verdict, "misrouted");
});

test("2 idle/empty/{} is stabled, never the product name, never empty, never drained", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "stabled");
  assert.equal(result.verdict, "stabled");
  assert.equal(result.decision, "stabled");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.stabled, true);
  assert.equal(result.misrouted, false);
  assert.equal(classify({}), "stabled");
  assert.equal(classify(emptyProbe()), "stabled");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverShunt(result);
  const seated = decide({ action: "shut" });
  assert.equal(seated.state, "stabled");
  assert.equal(seated.idleWord, "stabled");
  assert.equal(seated.firstAnswerToParent, false);
  assert.doesNotMatch(seated.state, /shunt/i);
  assert.doesNotMatch(seated.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "stabled");
  assert.equal(empty.idleWord, "stabled");
});

test("3 orphaned: child produced follow-up; parent already completed; no keepalive", () => {
  const result = decide(seedOrphaned());
  assert.equal(result.verdict, "orphaned");
  assert.equal(result.childProducedFollowUp, true);
  assert.equal(result.parentCompleted, true);
  assert.equal(result.parentHoldsKeepalive, false);
  assert.equal(result.followUpToRoot, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.orphaned, true);
  assert.match(result.feed, /orphaned/i);
  assert.equal(decideSeed("orphaned").verdict, "orphaned");
});

test("4 rootbound: notification queued to root", () => {
  const result = decide(seedRootbound());
  assert.equal(result.verdict, "rootbound");
  assert.equal(result.notificationQueuedToRoot, true);
  assert.equal(result.firstAnswerToParent, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /queued to the root/i);
  assert.equal(decideSeed("rootbound").verdict, "rootbound");
});

test("5 typecast: from=general-purpose does not resolve", () => {
  const result = decide(seedTypecast());
  assert.equal(result.verdict, "typecast");
  assert.equal(result.fromIsAgentType, true);
  assert.equal(result.fromResolves, false);
  assert.equal(result.childFromLabel, TYPE_LABEL);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /general-purpose/i);
  assert.equal(decideSeed("typecast").verdict, "typecast");
});

test("6 stalled: parent parked waiting", () => {
  const result = decide(seedStalled());
  assert.equal(result.verdict, "stalled");
  assert.equal(result.parentParkedWaiting, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /parked waiting/i);
  assert.equal(decideSeed("stalled").verdict, "stalled");
});

test("7 tandem: parent running and holds keepalive; first delivery live", () => {
  const result = decide(seedTandem());
  assert.equal(result.verdict, "tandem");
  assert.equal(result.parentRunning, true);
  assert.equal(result.parentHoldsKeepalive, true);
  assert.equal(result.firstAnswerToParent, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /keepalive held/i);
  assert.equal(decideSeed("tandem").verdict, "tandem");
});

test("8 dropped: child produced follow-up that neither road took", () => {
  const result = decide(seedDropped());
  assert.equal(result.verdict, "dropped");
  assert.equal(result.childProducedFollowUp, true);
  assert.equal(result.parentReceivedFollowUp, false);
  assert.equal(result.followUpToRoot, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /neither parent nor root/i);
  assert.equal(decideSeed("dropped").verdict, "dropped");
});

test("9 crosstalk: reply addressed by requester", () => {
  const result = decide(seedCrosstalk());
  assert.equal(result.verdict, "crosstalk");
  assert.equal(result.replyAddressedByRequester, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /addressed by requester/i);
  assert.equal(decideSeed("crosstalk").verdict, "crosstalk");
});

test("10 sidetracked: nested depth ≥ 2 without a scored misroute", () => {
  const result = decide(seedSidetracked());
  assert.equal(result.verdict, "sidetracked");
  assert.equal(result.nestedDepth, 2);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /nested depth/i);
  assert.equal(decideSeed("sidetracked").verdict, "sidetracked");
});

test("11 stabled seed is stabled and never alarms", () => {
  const result = decide(seedStabled());
  assert.equal(result.verdict, "stabled");
  assert.equal(result.firstAnswerToParent, false);
  assert.equal(result.stabled, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Stabled/);
  assert.equal(decideSeed("stabled").verdict, "stabled");
});

test("12 score() idle probe is stabled and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "stabled");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.stabled, true);
  assert.equal(result.misrouted, false);
  assert.equal(result.orphaned, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "stabled",
    "misrouted",
    "orphaned",
    "rootbound",
    "typecast",
    "stalled",
    "tandem",
    "dropped",
    "crosstalk",
    "sidetracked",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["misrouted", "orphaned", "rootbound", "typecast"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["misrouted", "orphaned", "rootbound"]);
  assert.equal(IDLE_WORD, "stabled");
  assert.doesNotMatch(IDLE_WORD, /shunt/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /drained|flat|fit|spoilt|laid|unlinked|tight|seised|seated|latched/);
  assert.doesNotMatch(VERDICTS.join(" "), /empty|shunt|drained|flat|fit|spoilt/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["stabled", seedStabled],
    ["misrouted", seed90463Misrouted],
    ["orphaned", seedOrphaned],
    ["rootbound", seedRootbound],
    ["typecast", seedTypecast],
    ["stalled", seedStalled],
    ["tandem", seedTandem],
    ["dropped", seedDropped],
    ["crosstalk", seedCrosstalk],
    ["sidetracked", seedSidetracked],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: misrouted stays misrouted", () => {
  const result = decide({ ...seed90463Misrouted(), action: "admit" });
  assert.equal(result.verdict, "misrouted");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /stabled/);
  assert.doesNotMatch(result.verdict, /shunt/i);
});

test("16 score / stamp / throw scores misrouted", () => {
  const result = decide({ ...seed90463Misrouted(), action: "score" });
  assert.equal(result.verdict, "misrouted");
  assert.equal(result.action, "score");
  assert.equal(result.firstAnswerToParent, true);
  const stamped = decide({ ...seed90463Misrouted(), action: "stamp" });
  assert.equal(stamped.verdict, "misrouted");
  assert.equal(stamped.action, "stamp");
  const thrown = decide({ ...seed90463Misrouted(), action: "throw" });
  assert.equal(thrown.verdict, "misrouted");
  assert.equal(thrown.action, "score");
});

test("17 shut / bail / stabled returns idle stabled", () => {
  const shut = decide({ ...seed90463Misrouted(), action: "shut" });
  assert.equal(shut.verdict, "stabled");
  assert.equal(shut.action, "shut");
  assert.equal(shut.firstAnswerToParent, false);
  assert.equal(isIdle(shut.probe), true);
  assertIdleNeverShunt(shut);
  const bailed = decide({ ...seedOrphaned(), action: "bail" });
  assert.equal(bailed.verdict, "stabled");
  assert.equal(isIdle(bailed.probe), true);
  const idle = decide({ ...seedTypecast(), action: "stabled" });
  assert.equal(idle.verdict, "stabled");
});

test("18 road on idle produces misrouted yard", () => {
  const result = decide({ action: "road", probe: emptyProbe() });
  assert.equal(result.verdict, "misrouted");
  assert.equal(result.action, "road");
  assert.equal(result.firstAnswerToParent, true);
  assert.equal(result.followUpToRoot, true);
  assert.equal(result.misrouted, true);
});

test("19 road on a stalled probe becomes misrouted", () => {
  const result = decide({ ...seedStalled(), action: "road" });
  assert.equal(result.verdict, "misrouted");
  assert.equal(result.action, "road");
  assert.equal(result.childProducedFollowUp, true);
});

test("20 ledger marks the road sound and does not lie", () => {
  const result = decide({ ...seed90463Misrouted(), action: "ledger" });
  assert.equal(result.verdict, "misrouted");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Road sounded/.test(line)));
});

test("21 observe on typecast stays typecast", () => {
  const result = decide({ ...seedTypecast(), action: "observe" });
  assert.equal(result.verdict, "typecast");
  assert.equal(result.observed, true);
  assert.equal(result.fromIsAgentType, true);
});

test("22 misrouted beats rootbound when the full #90463 signature is present", () => {
  assert.equal(
    classify({
      firstAnswerToParent: true,
      childProducedFollowUp: true,
      followUpToRoot: true,
      parentReceivedFollowUp: false,
      parentParkedWaiting: true,
      fromIsAgentType: true,
      fromResolves: false,
      nestedDepth: 2,
      keepaliveClearedAfterFirst: true,
    }),
    "misrouted",
  );
});

test("23 rootbound is follow-up to root without the full misroute", () => {
  assert.equal(
    classify({
      notificationQueuedToRoot: true,
    }),
    "rootbound",
  );
});

test("24 typecast requires from=type and unresolved, not a follow-up to root", () => {
  assert.equal(
    classify({
      fromIsAgentType: true,
      fromResolves: false,
      childFromLabel: "general-purpose",
    }),
    "typecast",
  );
  assert.equal(
    classify({
      fromIsAgentType: true,
      fromResolves: false,
      followUpToRoot: true,
    }),
    "rootbound",
  );
});

test("25 orphaned requires completed parent without keepalive, not just a flag", () => {
  assert.equal(classify({ parentCompleted: true }), "stabled");
  assert.equal(
    classify({
      childProducedFollowUp: true,
      parentReceivedFollowUp: false,
      parentCompleted: true,
      parentHoldsKeepalive: false,
    }),
    "orphaned",
  );
});

test("26 nested road / frame / box / yard fields clone", () => {
  const probe = cloneProbe({
    road: {
      firstAnswerToParent: true,
      childProducedFollowUp: true,
      followUpToRoot: true,
      parentParkedWaiting: true,
      fromIsAgentType: true,
      nestedDepth: 2,
      keepaliveClearedAfterFirst: true,
    },
  });
  assert.equal(classify(probe), "misrouted");
  const frame = cloneProbe({
    frame: { notificationQueuedToRoot: true },
  });
  assert.equal(classify(frame), "rootbound");
});

test("27 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("misrouted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("orphaned"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("rootbound"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("typecast"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("stabled"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("stalled"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("tandem"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("dropped"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("crosstalk"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("sidetracked"), { slack: false, linear: false, github: true, alarm: false });
});

test("28 stabled / misrouted / orphaned helpers", () => {
  assert.equal(stabledOf(seed90463Misrouted().probe), false);
  assert.equal(misroutedOf(seed90463Misrouted().probe), true);
  assert.equal(orphanedOf(seed90463Misrouted().probe), false);
  assert.equal(stabledOf(emptyProbe()), true);
  assert.equal(orphanedOf(seedOrphaned().probe), true);
  assert.equal(misroutedOf(seedOrphaned().probe), false);
  assert.equal(stabledOf(seedRootbound().probe), false);
});

test("29 feed and reasons never use shunt or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "stabled");
  assert.doesNotMatch(idle.feed, /idle word is shunt/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.ok(idle.reasons.every((line) => !/idle word is shunt/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "stabled"), /Stabled/);
  assert.ok(reasonsOf(emptyProbe(), "stabled").some((line) => /idle word is stabled/.test(line)));
});

test("30 forbidden idle list includes shunt, shunted, empty, drained, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("shunt"));
  assert.ok(words.includes("shunted"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("drained"));
  assert.ok(words.includes("flat"));
  assert.ok(words.includes("fit"));
  assert.ok(words.includes("spoilt"));
  assert.ok(words.includes("laid"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("points"));
  assert.ok(words.includes("oubliette"));
  assert.ok(words.includes("cote"));
  assert.ok(words.includes("tappet"));
  assert.ok(words.includes("reveille"));
  assert.ok(!words.includes("stabled"));
});

test("31 demo sinks: Slack on alarm; Linear on misrouted/orphaned/rootbound; GitHub always", async () => {
  const misrouted = decide(seed90463Misrouted());
  const slack = slackShuntAlarm(misrouted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubShuntLedger(misrouted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub shunt-ledger/);
  const linear = linearShuntTicket(misrouted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const tandem = decide(seedTandem());
  const linearSkip = linearShuntTicket(tandem, {});
  assert.equal(linearSkip.mode, "demo");
  assert.match(linearSkip.summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackShuntAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearShuntTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(misrouted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("32 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const misrouted = decide(seed90463Misrouted());
  const slack = slackShuntAlarm(misrouted, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubShuntLedger(misrouted, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearShuntTicket(misrouted, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("33 Slack skip on stabled / stalled / tandem / dropped / crosstalk / sidetracked", () => {
  for (const seed of [seedStabled, seedStalled, seedTandem, seedDropped, seedCrosstalk, seedSidetracked]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackShuntAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("34 Linear only on misrouted, orphaned, and rootbound", () => {
  assert.equal(decide(seed90463Misrouted()).linear, true);
  assert.equal(decide(seedOrphaned()).linear, true);
  assert.equal(decide(seedRootbound()).linear, true);
  assert.equal(decide(seedTypecast()).linear, false);
  assert.equal(decide(seedStalled()).linear, false);
  assert.equal(decide(seedStabled()).linear, false);
});

test("35 GitHub ledger fires on idle/shut scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const shut = decide({ action: "shut" });
  assert.equal(shut.github, true);
});

test("36 handle misrouted / orphaned / rootbound / typecast deny", async () => {
  const misrouted = await handle(seed90463Misrouted(), {});
  assert.equal(misrouted.permissionDecision, "deny");
  assert.match(misrouted.hookSpecificOutput.decision.message, /misrouted/);
  const orphaned = await handle(seedOrphaned(), {});
  assert.equal(orphaned.permissionDecision, "deny");
  const rootbound = await handle(seedRootbound(), {});
  assert.equal(rootbound.permissionDecision, "deny");
  const typecast = await handle(seedTypecast(), {});
  assert.equal(typecast.permissionDecision, "deny");
});

test("37 handle stabled / stalled / tandem / dropped / crosstalk / sidetracked allow", async () => {
  const idle = await handle({ action: "shut" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /stabled/);
  const stalled = await handle(seedStalled(), {});
  assert.equal(stalled.permissionDecision, "allow");
  const tandem = await handle(seedTandem(), {});
  assert.equal(tandem.permissionDecision, "allow");
  const dropped = await handle(seedDropped(), {});
  assert.equal(dropped.permissionDecision, "allow");
  const crosstalk = await handle(seedCrosstalk(), {});
  assert.equal(crosstalk.permissionDecision, "allow");
  const sidetracked = await handle(seedSidetracked(), {});
  assert.equal(sidetracked.permissionDecision, "allow");
});

test("38 listen GET health and POST empty body is stabled", async () => {
  const server = listen(19080);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19080/health");
  const info = await health.json();
  assert.equal(info.product, "shunt");
  assert.match(info.verbs, /misrouted/);
  const res = await fetch("http://127.0.0.1:19080/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "stabled");
  assert.equal(body.idleWord, "stabled");
  const scored = await fetch("http://127.0.0.1:19080/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90463Misrouted()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "misrouted");
  await new Promise((resolve) => server.close(resolve));
});

test("39 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19081);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19081/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19081/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("40 every verdict is uniquely first-match on its seed", () => {
  const map = {
    stabled: seedStabled,
    misrouted: seed90463Misrouted,
    orphaned: seedOrphaned,
    rootbound: seedRootbound,
    typecast: seedTypecast,
    stalled: seedStalled,
    tandem: seedTandem,
    dropped: seedDropped,
    crosstalk: seedCrosstalk,
    sidetracked: seedSidetracked,
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
    ["misrouted", seed90463Misrouted],
    ["orphaned", seedOrphaned],
    ["rootbound", seedRootbound],
    ["typecast", seedTypecast],
    ["stalled", seedStalled],
    ["tandem", seedTandem],
    ["dropped", seedDropped],
    ["crosstalk", seedCrosstalk],
    ["sidetracked", seedSidetracked],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("42 desk HTML sanity: idle word stabled, seeded misrouted, not cote/sump/pleat", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /stabled/);
  assert.match(html, /Score/);
  assert.match(html, /Bail/);
  assert.match(html, /misrouted/);
  assert.match(html, /90463/);
  assert.match(html, /seedOf\("misrouted"\)|probe = seedOf\("misrouted"\)/);
  assert.doesNotMatch(html, /Admit shunt/);
  assert.doesNotMatch(html, /const IDLE_WORD = "shunt"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "drained"/);
  assert.match(html, /const IDLE_WORD = "stabled"/);
  assert.match(html, /signal|lever|wagon|lamp|rail|points/i);
  assert.match(html, /07:50 Sydney · shunt/);
  assert.match(html, /first delivery is not a hold/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="booth"|class="punchcard"|class="ballot"/);
  assert.doesNotMatch(html, /class="flange"|class="packing"|class="chest"|class="hinge"|class="lid"/);
  assert.doesNotMatch(html, /class="shop"|class="needle-rail"|class="felt"/);
  assert.doesNotMatch(html, /class="grate-bar"|class="cistern"|class="sludge"|class="pump-house"/);
  assert.doesNotMatch(html, /--shed:|--pitch:|--pine:|--sawdust:/);
  assert.doesNotMatch(html, /--shop:|--felt:|--wool:|--worsted:/);
  assert.doesNotMatch(html, /--concrete:|--bilge:|--silt:|--ochre:/);
  assert.doesNotMatch(html, /Cormorant|Outfit/);
  assert.doesNotMatch(html, /Space Grotesk|IBM Plex Mono/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Shunt/);
  assert.match(html, /Barlow Condensed|Source Code Pro/);
});

test("43 HTML why-not names Cote, Tappet, Reveille, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Cote/);
  assert.match(html, /NOT Tappet/);
  assert.match(html, /NOT Reveille/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Shunt is a dove-cote/i);
  assert.doesNotMatch(html, /Shunt is a valve train/i);
  assert.doesNotMatch(html, /this is a basement/i);
});

test("44 README names Cote / Tappet / Reveille contrast and stabled idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Cote/);
  assert.match(readme, /NOT Tappet/);
  assert.match(readme, /NOT Reveille/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*stabled\*\*/);
  assert.match(readme, /#90463|#90463/);
  assert.match(readme, /#77950|#77950/);
  assert.doesNotMatch(readme, /idle word is shunt/i);
  assert.doesNotMatch(readme, /idle word is drained/i);
  assert.doesNotMatch(readme, /Shunt is a dove-cote/i);
});

test("45 score() misrouted includes misrouted and not stabled", () => {
  const result = score(seed90463Misrouted().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "misrouted");
  assert.equal(result.stabled, false);
  assert.equal(result.misrouted, true);
  assert.equal(result.orphaned, false);
});

test("46 fire live slack posts when fetch ok", async () => {
  const misrouted = decide(seed90463Misrouted());
  const events = await fire(misrouted, { SHUNT_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted misrouted/);
});

test("47 fire live github and linear paths", async () => {
  const misrouted = decide(seed90463Misrouted());
  const events = await fire(
    misrouted,
    {
      SHUNT_GITHUB_TOKEN: "tok",
      SHUNT_LINEAR_KEY: "lin",
      SHUNT_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "SHN-1", url: "https://linear.app/shn-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /SHN-1/);
});

test("48 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90463Misrouted().probe, "misrouted").some((line) => /#90463/.test(line)));
  assert.ok(reasonsOf(seedTypecast().probe, "typecast").some((line) => /#90463|#77950/.test(line)));
  assert.ok(reasonsOf(seedOrphaned().probe, "orphaned").some((line) => /#75043|#76681/.test(line)));
});

test("49 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const misrouted = decide(seed90463Misrouted());
  const slack = slackShuntAlarm(misrouted, {});
  const github = githubShuntLedger(misrouted, {});
  const linear = linearShuntTicket(misrouted, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(misrouted, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("50 catalog wiring: 36 products, Fusee featured, Shunt and Sump listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 36);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Fusee");
  const shunt = catalog.products.find((row) => row.slug === "shunt");
  assert.ok(shunt);
  assert.equal(shunt.featured, false);
  assert.equal(shunt.href, "/shunt/");
  assert.equal(shunt.day, "2026-08-29");
  assert.match(shunt.summary, /07:50|first delivery is not a hold|stabled/);
  const sump = catalog.products.find((row) => row.slug === "sump");
  assert.ok(sump);
  assert.equal(sump.featured, false);
  assert.match(sump.summary, /06:50|null path is not a hold|drained/);
  const pleat = catalog.products.find((row) => row.slug === "pleat");
  assert.ok(pleat);
  assert.equal(pleat.featured, false);
  const scant = catalog.products.find((row) => row.slug === "scant");
  assert.ok(scant);
  assert.equal(scant.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "fusee");
  assert.equal(slugs[1], "iota");
  assert.ok(slugs.includes("pleat"));
  assert.ok(slugs.includes("scant"));
  assert.ok(slugs.includes("wicket"));
  assert.ok(slugs.includes("knock"));
  assert.ok(!slugs.includes("points"));
  assert.ok(!slugs.includes("siding"));
  assert.ok(!slugs.includes("oubliette"));
});

test("51 vercel rewrite order puts /shunt before /sump, /pleat and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/fusee");
  assert.equal(sources[1], "/fusee/");
  assert.equal(sources[2], "/iota");
  assert.equal(sources[3], "/iota/");
  assert.ok(sources.includes("/pleat"));
  assert.ok(sources.includes("/scant"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/fusee") < sources.indexOf("/iota"));
  assert.ok(sources.indexOf("/shunt") < sources.indexOf("/sump"));
  assert.ok(sources.indexOf("/shunt/") < sources.indexOf("/:slug"));
});

test("52 hours.json keeps the 07:50 Sydney Shunt ship after Fusee, Iota and Leat", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-fusee");
  const shunt = hours.find((row) => row.stem === "2026-08-29-shunt");
  assert.ok(shunt);
  assert.equal(shunt.date, "2026-08-29");
  assert.equal(shunt.time, "07:50");
  assert.equal(shunt.tz, "Australia/Sydney");
  assert.equal(shunt.title, "Shunt");
  assert.equal(shunt.kind, "ship");
  assert.match(shunt.note, /stabled/);
  assert.match(shunt.note, /Sump/);
  assert.match(shunt.note, /Pleat/);
  assert.equal(hours[3].stem, "2026-08-29-shunt");
});

test("53 clusterOf on #90463 includes rootbound typecast stalled sidetracked dropped orphaned", () => {
  const cluster = clusterOf(seed90463Misrouted().probe, "misrouted");
  assert.ok(cluster.includes("rootbound"));
  assert.ok(cluster.includes("typecast"));
  assert.ok(cluster.includes("stalled"));
  assert.ok(cluster.includes("sidetracked"));
  assert.ok(cluster.includes("dropped"));
  assert.ok(cluster.includes("orphaned"));
});

test("54 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    firstAnswerToParent: "true",
    childProducedFollowUp: "true",
    followUpToRoot: "true",
    parentParkedWaiting: "true",
    fromIsAgentType: "true",
    fromResolves: "false",
    nestedDepth: "2",
    keepaliveClearedAfterFirst: "true",
    childFromLabel: "general-purpose",
  });
  assert.equal(probe.firstAnswerToParent, true);
  assert.equal(probe.fromResolves, false);
  assert.equal(probe.nestedDepth, 2);
  assert.equal(probe.fromIsAgentType, true);
  assert.equal(classify(probe), "misrouted");
});

test("55 parseSessionTrace detects FIRST-ANSWER / SECOND-ANSWER / from=type from pasted transcript", () => {
  const parsed = parseSessionTrace(`
spawnDepth: 2
FIRST-ANSWER delivered_to_agent
child result: SECOND-ANSWER
attachment: queued_command delivered to the root
parent: Message sent to the child agent. Waiting for its second reply.
from="general-purpose"
No agent named 'general-purpose' is reachable
keepalive agent:<taskId> cleared after first notification
`);
  assert.equal(parsed.firstAnswerToParent, true);
  assert.equal(parsed.childProducedFollowUp, true);
  assert.equal(parsed.followUpToRoot, true);
  assert.equal(parsed.parentParkedWaiting, true);
  assert.equal(parsed.fromIsAgentType, true);
  assert.equal(parsed.fromResolves, false);
  assert.equal(parsed.nestedDepth, 2);
  assert.equal(parsed.childFromLabel, "general-purpose");
  assert.equal(parsed.keepaliveClearedAfterFirst, true);
});
