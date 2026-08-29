import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubBollardLedger,
  linearBollardTicket,
  slackBollardAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  DEMO_GAP_FATAL_SEC,
  DEMO_GAP_SHORT_SEC,
  DEMO_RSS_GIB,
  DEMO_SESSIONS_SHUT_DOWN,
  DEMO_SESSIONS_UNRESUMABLE,
  DEMO_SWAP_GIB,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  belayedOf,
  classify,
  cloneBollard,
  decide,
  decideSeed,
  emptyAction,
  emptyBollard,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  orphanedOf,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90581,
  seedBelayed,
  seedControl,
  seedCredStale,
  seedGapFatal,
  seedGapShort,
  seedMemThrash,
  seedOfflineLie,
  seedOrphaned,
  seedPoll401,
  seedReattachDenied,
  seedReset,
  seedSessionsDead,
  verdictOf,
} from "./bollard.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverBollard(result) {
  assert.equal(result.idleWord, "belayed");
  assert.equal(IDLE_WORD, "belayed");
  assert.doesNotMatch(result.idleWord, /bollard/i);
  assert.doesNotMatch(IDLE_WORD, /^bollard$/i);
  assert.doesNotMatch(result.idleWord, /empty|silent|mute|idle|dead/i);
  assert.doesNotMatch(
    result.idleWord,
    /rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung|moored/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.belayed, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90581 orphaned is orphaned, slack, linear, idleWord belayed, never belayed", () => {
  const seed = seedOrphaned();
  const result = decide(seed);
  assert.equal(result.verdict, "orphaned");
  assert.equal(result.state, "orphaned");
  assert.equal(result.decision, "orphaned");
  assert.equal(classify(seed.bollard), "orphaned");
  assert.equal(verdictOf(seed.bollard), "orphaned");
  assert.notEqual(result.verdict, "belayed");
  assert.notEqual(result.verdict, "gap-short");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.bollardOrphaned, true);
  assert.equal(result.orphaned, true);
  assert.equal(result.belayed, false);
  assertIdleNeverBollard(result);
  assert.equal(result.session, "90581-orphaned");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.supervisorGapSec, DEMO_GAP_FATAL_SEC);
  assert.equal(result.envDeleted, true);
  assert.equal(result.newEnvId, true);
  assert.equal(result.sessionsUnresumable, DEMO_SESSIONS_UNRESUMABLE);
  assert.match(result.feed, /Orphaned|primary #90581/i);
  assert.equal(decideSeed("orphaned").verdict, "orphaned");
  assert.equal(decideSeed("90581-orphaned").verdict, "orphaned");
  assert.equal(decideSeed(90581).verdict, "orphaned");
  assert.ok(DEMO_GAP_FATAL_SEC >= 10);
});

test("2 idle/empty/{} is belayed, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "belayed");
  assert.equal(result.verdict, "belayed");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.belayed, true);
  assert.equal(classify({}), "belayed");
  assert.equal(classify(emptyBollard()), "belayed");
  assert.equal(isIdle(emptyBollard()), true);
  assert.equal(score(emptyBollard()).belayed, true);
  assertIdleNeverBollard(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "belayed");
  assert.equal(bailed.idleWord, "belayed");
  const empty = decide({});
  assert.equal(empty.verdict, "belayed");
  assert.match(empty.feed, /Belayed/);
});

test("3 gap-short / control stays gap-short with belayed true", () => {
  const result = decide(seedGapShort());
  assert.equal(result.verdict, "gap-short");
  assert.equal(result.alarm, false);
  assert.equal(result.envPreserved, true);
  assert.equal(result.envDeleted, false);
  assert.equal(result.belayed, true);
  assert.ok(result.supervisorGapSec > 0 && result.supervisorGapSec <= 3);
  assert.match(result.feed, /Gap-short|preserved/);
  assert.equal(decideSeed("control").verdict, "gap-short");
  assert.equal(decideSeed("gap-short").verdict, "gap-short");
  assert.equal(decideSeed("healthy").verdict, "gap-short");
  assert.equal(decide(seedControl()).verdict, "gap-short");
  assert.equal(decide(seedControl()).belayed, true);
  assert.equal(DEMO_GAP_SHORT_SEC, 2);
});

test("4 poll-401: 401 on poll, 10 sessions shut down, same creds worked", () => {
  const result = decide(seedPoll401());
  assert.equal(result.verdict, "poll-401");
  assert.equal(result.bollardPoll401, true);
  assert.equal(result.poll401, true);
  assert.equal(result.sessionsShutDown, DEMO_SESSIONS_SHUT_DOWN);
  assert.equal(result.credsWorkedAfterRestart, true);
  assert.equal(result.envDeleted, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.belayed, false);
  assert.match(result.feed, /Poll-401|401/);
  assert.equal(decideSeed("poll-401").verdict, "poll-401");
});

test("5 offline-lie: server said offline while journal continuous", () => {
  const result = decide(seedOfflineLie());
  assert.equal(result.verdict, "offline-lie");
  assert.equal(result.bollardOfflineLie, true);
  assert.equal(result.serverSaidOffline, true);
  assert.equal(result.stillLogging, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.belayed, false);
  assert.match(result.feed, /Offline-lie|offline/);
  assert.equal(decideSeed("offline-lie").verdict, "offline-lie");
});

test("6 mem-thrash: 24.2 GiB RSS + 2.4 GiB swap, still logging", () => {
  const result = decide(seedMemThrash());
  assert.equal(result.verdict, "mem-thrash");
  assert.equal(result.bollardMemThrash, true);
  assert.equal(result.rssGiB, DEMO_RSS_GIB);
  assert.equal(result.swapGiB, DEMO_SWAP_GIB);
  assert.equal(result.stillLogging, true);
  assert.equal(result.serverSaidOffline, false);
  assert.equal(result.alarm, true);
  assert.equal(result.belayed, false);
  assert.match(result.feed, /Mem-thrash|24\.2/);
  assert.equal(decideSeed("mem-thrash").verdict, "mem-thrash");
});

test("7 gap-fatal: supervisor absence ≥10s without env deletion", () => {
  const result = decide(seedGapFatal());
  assert.equal(result.verdict, "gap-fatal");
  assert.equal(result.bollardGapFatal, true);
  assert.ok(result.supervisorGapSec >= 10);
  assert.equal(result.envDeleted, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.belayed, false);
  assert.match(result.feed, /Gap-fatal|≥~10|10s/);
  assert.equal(decideSeed("gap-fatal").verdict, "gap-fatal");
});

test("8 sessions-dead: shutting down N active sessions, no poll-401", () => {
  const result = decide(seedSessionsDead());
  assert.equal(result.verdict, "sessions-dead");
  assert.equal(result.bollardSessionsDead, true);
  assert.equal(result.sessionsShutDown, DEMO_SESSIONS_SHUT_DOWN);
  assert.equal(result.poll401, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.belayed, false);
  assert.match(result.feed, /Sessions-dead|active session/);
  assert.equal(decideSeed("sessions-dead").verdict, "sessions-dead");
});

test("9 cred-stale: token expired in-process; disk creds fine", () => {
  const result = decide(seedCredStale());
  assert.equal(result.verdict, "cred-stale");
  assert.equal(result.bollardCredStale, true);
  assert.equal(result.credsWorkedAfterRestart, true);
  assert.equal(result.poll401, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.belayed, false);
  assert.match(result.feed, /Cred-stale|expired token/);
  assert.equal(decideSeed("cred-stale").verdict, "cred-stale");
});

test("10 reattach-denied: start a fresh environment", () => {
  const result = decide(seedReattachDenied());
  assert.equal(result.verdict, "reattach-denied");
  assert.equal(result.bollardReattachDenied, true);
  assert.equal(result.reattachAllowed, false);
  assert.equal(result.alarm, true);
  assert.equal(result.belayed, false);
  assert.match(result.feed, /Reattach-denied|fresh environment/);
  assert.equal(decideSeed("reattach-denied").verdict, "reattach-denied");
});

test("11 score() idle bollard is belayed and never alarms", () => {
  const result = score(emptyBollard());
  assertScoreShape(result);
  assert.equal(result.verdict, "belayed");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.belayed, true);
  assert.equal(result.orphaned, false);
});

test("12 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "belayed",
    "gap-short",
    "gap-fatal",
    "poll-401",
    "orphaned",
    "sessions-dead",
    "cred-stale",
    "mem-thrash",
    "offline-lie",
    "reattach-denied",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "orphaned",
    "gap-fatal",
    "sessions-dead",
    "poll-401",
    "offline-lie",
    "mem-thrash",
    "cred-stale",
    "reattach-denied",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["orphaned", "gap-fatal", "sessions-dead", "poll-401"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "belayed");
  assert.doesNotMatch(IDLE_WORD, /bollard$|rove|keyed|moored|silent/);
});

test("13 every seeded class classifies to itself", () => {
  const rows = [
    ["belayed", seedReset],
    ["orphaned", seedOrphaned],
    ["gap-short", seedGapShort],
    ["gap-fatal", seedGapFatal],
    ["poll-401", seedPoll401],
    ["sessions-dead", seedSessionsDead],
    ["cred-stale", seedCredStale],
    ["mem-thrash", seedMemThrash],
    ["offline-lie", seedOfflineLie],
    ["reattach-denied", seedReattachDenied],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().bollard), word, word);
    assert.equal(score(seed().bollard).verdict, word, word);
  }
});

test("14 admit does not lie: orphaned stays orphaned; poll-401 stays poll-401", () => {
  const orphaned = decide({ ...seedOrphaned(), action: "admit" });
  assert.equal(orphaned.verdict, "orphaned");
  assert.equal(orphaned.action, "admit");
  assert.equal(orphaned.belayed, false);
  assert.doesNotMatch(orphaned.verdict, /belayed/);
  const poll = decide({ ...seedPoll401(), action: "admit" });
  assert.equal(poll.verdict, "poll-401");
  const offline = decide({ ...seedOfflineLie(), action: "admit" });
  assert.equal(offline.verdict, "offline-lie");
});

test("15 bail / belayed / reset returns idle belayed", () => {
  const bailed = decide({ ...seedOrphaned(), action: "bail" });
  assert.equal(bailed.verdict, "belayed");
  assert.equal(isIdle(bailed.bollard), true);
  assertIdleNeverBollard(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "belayed");
  assert.equal(decide({ action: "belayed" }).verdict, "belayed");
  assert.equal(decide(seedReset()).verdict, "belayed");
  assert.equal(decide(seedBelayed()).verdict, "belayed");
});

test("16 restore / orphaned produces the #90581 orphaned bollard", () => {
  const result = decide({ action: "restore", bollard: emptyBollard() });
  assert.equal(result.verdict, "orphaned");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.belayed, false);
  assert.equal(decide({ action: "orphaned" }).verdict, "orphaned");
});

test("17 flagsOf matches slack / github; linear follows orphaned/gap-fatal/sessions-dead/poll-401", () => {
  assert.deepEqual(flagsOf("orphaned"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("gap-fatal"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("sessions-dead"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("poll-401"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("offline-lie"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("mem-thrash"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("cred-stale"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("reattach-denied"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("gap-short"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("belayed"), { slack: false, linear: false, github: true, alarm: false });
});

test("18 helpers, reasons, analyze, priority", () => {
  assert.equal(orphanedOf(seedOrphaned().bollard), true);
  assert.equal(belayedOf(emptyBollard()), true);
  assert.equal(belayedOf(seedOrphaned().bollard), false);
  assert.equal(belayedOf(seedGapShort().bollard), true);
  const reasons = reasonsOf(seedOrphaned().bollard, "orphaned");
  assert.ok(reasons.some((row) => /#90581/.test(row)));
  const facts = analyze(seedOrphaned().bollard);
  assert.equal(facts.orphanedShape, true);
  assert.equal(classify(seedOrphaned().bollard), "orphaned");
  assert.equal(classify(seed90581().bollard), "orphaned");
  assert.equal(classify(seedPoll401().bollard), "poll-401");
  assert.equal(classify(seedGapFatal().bollard), "gap-fatal");
});

test("19 forbidden idle list includes bollard, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("bollard"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("rove"));
  assert.ok(words.includes("moored"));
  assert.ok(words.includes("hawse"));
  assert.ok(words.includes("hawser"));
  assert.ok(words.includes("clew"));
  assert.ok(words.includes("sounder"));
  assert.ok(!words.includes("belayed"));
});

test("20 demo sinks: Slack on alarm; Linear on orphaned; GitHub always", async () => {
  const orphaned = decide(seedOrphaned());
  const slack = slackBollardAlarm(orphaned, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubBollardLedger(orphaned, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub bollard-ledger/);
  const linear = linearBollardTicket(orphaned, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearBollardTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackBollardAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(orphaned, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("21 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const orphaned = decide(seedOrphaned());
  const slack = slackBollardAlarm(orphaned, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubBollardLedger(orphaned, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearBollardTicket(orphaned, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("22 handle alarm classes deny; belayed / control / gap-short allow", async () => {
  const orphaned = await handle(seedOrphaned(), {});
  assert.equal(orphaned.permissionDecision, "deny");
  assert.match(orphaned.hookSpecificOutput.decision.message, /orphaned/);
  assert.equal((await handle(seedPoll401(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedGapFatal(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedSessionsDead(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedOfflineLie(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedMemThrash(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedCredStale(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedReattachDenied(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /belayed/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedGapShort(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("23 listen GET health and POST empty body is belayed", async () => {
  const server = listen(19881);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19881/health");
  const info = await health.json();
  assert.equal(info.product, "bollard");
  assert.match(info.verbs, /orphaned/);
  const res = await fetch("http://127.0.0.1:19881/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "belayed");
  assert.equal(body.idleWord, "belayed");
  const scored = await fetch("http://127.0.0.1:19881/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedOrphaned()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "orphaned");
  await new Promise((resolve) => server.close(resolve));
});

test("24 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19882);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19882/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("25 parseSessionTrace reads a #90581 orphaned report", () => {
  const bollard = parseSessionTrace(
    "environment deleted. new environment ID. 14 sessions unresumable. #90581. orphaned after 10-11s gap.",
  );
  assert.equal(classify(bollard), "orphaned");
});

test("26 parseSessionTrace reads poll-401, offline-lie, gap-fatal", () => {
  assert.equal(
    classify(parseSessionTrace("Poll: Authentication failed (401): OAuth access token has expired.")),
    "poll-401",
  );
  assert.equal(
    classify(parseSessionTrace("14 sessions ended while this machine was offline. journal continuous.")),
    "offline-lie",
  );
  assert.equal(
    classify(parseSessionTrace("gap-fatal supervisor absence ≥~10s")),
    "gap-fatal",
  );
});

test("27 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90581,
    source: "rc",
    supervisorGapSec: 10.5,
    envPreserved: false,
    envDeleted: true,
    newEnvId: true,
    sessionsShutDown: 0,
    sessionsUnresumable: 14,
    poll401: false,
    credsWorkedAfterRestart: false,
    rssGiB: 0,
    swapGiB: 0,
    stillLogging: false,
    serverSaidOffline: false,
    reattachAllowed: false,
    scored: false,
  });
  assert.equal(result.verdict, "orphaned");
  assert.equal(result.belayed, false);
  const short = score({
    supervisorGapSec: 2,
    envPreserved: true,
    envDeleted: false,
    newEnvId: false,
  });
  assert.equal(short.verdict, "gap-short");
  assert.equal(short.belayed, true);
});

test("28 nested bollard / probe fields clone", () => {
  const bollard = cloneBollard({ probe: seedOrphaned().bollard });
  assert.equal(classify(bollard), "orphaned");
});

test("29 fire live slack posts when fetch ok", async () => {
  const orphaned = decide(seedOrphaned());
  const events = await fire(
    orphaned,
    { BOLLARD_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted orphaned/);
});

test("30 pier HTML sanity: idle word belayed, seeded orphaned, not clew/sounder/binnacle/pirn/fob", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /belayed/);
  assert.match(html, /Score/);
  assert.match(html, /orphaned/);
  assert.match(html, /90581/);
  assert.match(html, /seedOf\("orphaned"\)|bollard = seedOf\("orphaned"\)/);
  assert.match(html, /const IDLE_WORD = "belayed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "bollard"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "rove"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "moored"/);
  assert.match(
    html,
    /wet-pier|bollard-plate|quay-lamp|hawser-eye|tide-mark|cast-iron|pier-plank|dock-ring|salt-wash/i,
  );
  assert.match(html, /23:50 Sydney · bollard/);
  assert.match(html, /slack hawser is not a hold/i);
  assert.doesNotMatch(html, /class="sail-loft"|class="rigger-bench"|class="hemp-clew"|class="lignum-sheave"|class="loft-lantern"|class="yarn-ball"|class="load-line"/);
  assert.doesNotMatch(html, /class="night-office"|class="oak-desk"|class="brass-sounder"|class="straight-key"|class="ink-tape"|class="line-lamp"/);
  assert.doesNotMatch(html, /class="binnacle-house"|class="chart-table"|class="gyro-card"|class="mag-card"/);
  assert.doesNotMatch(html, /class="loom-shed"|class="oak-frame"|class="pirn-rack"|class="yarn-package"/);
  assert.doesNotMatch(html, /class="fob-rail"|class="brass-hook"|class="room-tag"|class="night-clerk"/);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /Yeseva One|Cabin|Anonymous Pro/);
  assert.doesNotMatch(html, /Bodoni Moda|Figtree|DM Mono/);
  assert.doesNotMatch(html, /Syne|Literata|IBM Plex Mono/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Italiana|Newsreader/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Spectral|Nunito Sans/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Bollard/);
  assert.match(html, /Alfa Slab One|Bitter|Space Mono/);
  assert.match(html, /Reset · belayed|reset to belayed/i);
  assert.match(html, /Restore · #90581|restore to orphaned/i);
});

test("31 HTML why-not names Clew, Sounder, Reveille, Cote, Binnacle, Hasp, Wicket, Parity", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Clew/);
  assert.match(html, /NOT Sounder/);
  assert.match(html, /NOT Reveille/);
  assert.match(html, /NOT Cote/);
  assert.match(html, /NOT Binnacle/);
  assert.match(html, /NOT Hasp/);
  assert.match(html, /NOT Wicket/);
  assert.match(html, /NOT Parity/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("32 README names contrasts and belayed idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Clew\*\*|NOT Clew|remote-control environment GC/);
  assert.match(readme, /NOT \*\*Sounder\*\*|NOT Sounder/);
  assert.match(readme, /NOT \*\*Reveille\*\*|NOT Reveille/);
  assert.match(readme, /NOT \*\*Cote\*\*|NOT Cote/);
  assert.match(readme, /\*\*belayed\*\*/);
  assert.match(readme, /#90581/);
  assert.match(readme, /\/bollard\//);
  assert.doesNotMatch(readme, /idle word is bollard/i);
  assert.doesNotMatch(readme, /idle word is rove/i);
  assert.doesNotMatch(readme, /idle word is moored/i);
});

test("33 seeded 90581 numbers produce orphaned / belayed=false", () => {
  const orphaned = score({
    supervisorGapSec: 10.5,
    envPreserved: false,
    envDeleted: true,
    newEnvId: true,
    sessionsUnresumable: 14,
    reattachAllowed: false,
  });
  assert.equal(orphaned.verdict, "orphaned");
  assert.equal(orphaned.belayed, false);
  assert.equal(orphaned.envDeleted, true);
  assert.equal(orphaned.sessionsUnresumable, 14);
});

test("34 gap-short requires 1–3s and env preserved; belayed true", () => {
  const hold = score({
    supervisorGapSec: 2,
    envPreserved: true,
    envDeleted: false,
    newEnvId: false,
  });
  assert.equal(hold.verdict, "gap-short");
  assert.equal(hold.belayed, true);
  const dead = score({
    supervisorGapSec: 10.5,
    envDeleted: true,
    newEnvId: true,
    sessionsUnresumable: 14,
  });
  assert.equal(dead.belayed, false);
  assert.equal(dead.verdict, "orphaned");
});

test("35 Slack skip on belayed / control / gap-short", () => {
  for (const seed of [seedReset, seedControl, seedGapShort, seedBelayed]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackBollardAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("36 orphaned pentad wins over gap-fatal and reattach-denied", () => {
  const result = score({
    supervisorGapSec: 11,
    envDeleted: true,
    newEnvId: true,
    sessionsUnresumable: 14,
    reattachAllowed: false,
  });
  assert.equal(result.verdict, "orphaned");
  assert.equal(result.belayed, false);
});

test("37 poll-401 wins over sessions-dead and 14s gap when poll401 is set", () => {
  const result = decide(seedPoll401());
  assert.equal(result.verdict, "poll-401");
  assert.equal(result.sessionsShutDown, 10);
  assert.ok(result.supervisorGapSec >= 10);
  assert.notEqual(result.verdict, "sessions-dead");
  assert.notEqual(result.verdict, "gap-fatal");
  assert.notEqual(result.verdict, "orphaned");
});

test("38 admit still does not lie after orphaned / offline-lie", () => {
  const admitted = decide({ ...seedOrphaned(), action: "admit" });
  assert.equal(admitted.verdict, "orphaned");
  assert.equal(admitted.belayed, false);
  const lie = decide({ ...seedOfflineLie(), action: "admit" });
  assert.equal(lie.verdict, "offline-lie");
  assert.equal(lie.belayed, false);
});

test("39 README and pier cite #90581 incidents and same-class issues", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /poll-time 401|Poll-time 401|poll 401/i);
  assert.match(readme, /24\.2/);
  assert.match(readme, /87213/);
  assert.match(readme, /78778/);
  assert.match(readme, /85639/);
  assert.match(readme, /35217/);
  assert.match(readme, /39863/);
  assert.match(readme, /36189/);
  assert.doesNotMatch(readme, /idle word is hawse|idle word is hawser|idle word is painter/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /environment deleted/);
  assert.match(html, /87213/);
  assert.match(html, /33041/);
  assert.match(html, /78597/);
  assert.match(html, /78778/);
  assert.match(html, /35217/);
});
