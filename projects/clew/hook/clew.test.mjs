import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubClewLedger,
  linearClewTicket,
  slackClewAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  DEMO_LARGEST_ARG_BYTES,
  DEMO_LARGEST_ARG_KB,
  DEMO_TOTAL_DENY_COUNT,
  DEMO_WORKTREE_COUNT,
  DEMO_WORKTREE_DENY_COUNT,
  IDLE_WORD,
  LINEAR_VERDICTS,
  MAX_ARG_STRLEN,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneClew,
  decide,
  decideSeed,
  emptyAction,
  emptyClew,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  fouledOf,
  isIdle,
  parseSessionTrace,
  reasonsOf,
  roveOf,
  score,
  seed90569,
  seedCached,
  seedChoked,
  seedControl,
  seedFouled,
  seedGlobbed,
  seedJammed,
  seedOvercoiled,
  seedPruned,
  seedReset,
  seedRove,
  seedSwollen,
  seedTwinned,
  verdictOf,
} from "./clew.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverClew(result) {
  assert.equal(result.idleWord, "rove");
  assert.equal(IDLE_WORD, "rove");
  assert.doesNotMatch(result.idleWord, /clew/i);
  assert.doesNotMatch(IDLE_WORD, /^clew$/i);
  assert.doesNotMatch(result.idleWord, /empty|silent|mute|idle|dead/i);
  assert.doesNotMatch(
    result.idleWord,
    /keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.rove, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90569 fouled is fouled, slack, linear, idleWord rove, never rove", () => {
  const seed = seedFouled();
  const result = decide(seed);
  assert.equal(result.verdict, "fouled");
  assert.equal(result.state, "fouled");
  assert.equal(result.decision, "fouled");
  assert.equal(classify(seed.clew), "fouled");
  assert.equal(verdictOf(seed.clew), "fouled");
  assert.notEqual(result.verdict, "rove");
  assert.notEqual(result.verdict, "pruned");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.clewFouled, true);
  assert.equal(result.fouled, true);
  assert.equal(result.rove, false);
  assertIdleNeverClew(result);
  assert.equal(result.session, "90569-fouled");
  assert.equal(result.issue, 90569);
  assert.equal(result.worktreeCount, DEMO_WORKTREE_COUNT);
  assert.equal(result.worktreeDenyCount, DEMO_WORKTREE_DENY_COUNT);
  assert.equal(result.totalDenyCount, DEMO_TOTAL_DENY_COUNT);
  assert.equal(result.largestArgBytes, DEMO_LARGEST_ARG_BYTES);
  assert.equal(result.e2big, true);
  assert.equal(result.sleepFailed, true);
  assert.equal(result.spawnFailed, true);
  assert.match(result.feed, /Fouled|primary #90569/i);
  assert.equal(decideSeed("fouled").verdict, "fouled");
  assert.equal(decideSeed("90569-fouled").verdict, "fouled");
  assert.equal(decideSeed(90569).verdict, "fouled");
  assert.equal((130.7).toFixed(1), String(DEMO_LARGEST_ARG_KB));
  assert.ok(DEMO_LARGEST_ARG_BYTES > MAX_ARG_STRLEN);
});

test("2 idle/empty/{} is rove, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "rove");
  assert.equal(result.verdict, "rove");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.rove, true);
  assert.equal(classify({}), "rove");
  assert.equal(classify(emptyClew()), "rove");
  assert.equal(isIdle(emptyClew()), true);
  assert.equal(score(emptyClew()).rove, true);
  assertIdleNeverClew(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "rove");
  assert.equal(bailed.idleWord, "rove");
  const empty = decide({});
  assert.equal(empty.verdict, "rove");
  assert.match(empty.feed, /Rove/);
});

test("3 control / seedRove stay rove", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "rove");
  assert.equal(result.alarm, false);
  assert.equal(result.e2big, false);
  assert.equal(result.spawnFailed, false);
  assert.equal(result.rove, true);
  assert.ok(result.largestArgBytes < result.maxArgStrlen);
  assert.match(result.feed, /Rove/);
  assert.equal(decideSeed("control").verdict, "rove");
  assert.equal(decideSeed("rove").verdict, "rove");
  assert.equal(decideSeed("healthy").verdict, "rove");
  assert.equal(decide(seedRove()).verdict, "rove");
});

test("4 overcoiled: deny list grew two entries per worktree without bound", () => {
  const result = decide(seedOvercoiled());
  assert.equal(result.verdict, "overcoiled");
  assert.equal(result.clewOvercoiled, true);
  assert.ok(result.worktreeDenyCount >= 2 * result.worktreeCount);
  assert.equal(result.e2big, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Overcoiled|two entries/);
  assert.equal(decideSeed("overcoiled").verdict, "overcoiled");
});

test("5 choked: every Bash spawn fails with E2BIG", () => {
  const result = decide(seedChoked());
  assert.equal(result.verdict, "choked");
  assert.equal(result.clewChoked, true);
  assert.equal(result.sleepFailed, true);
  assert.equal(result.echoFailed, true);
  assert.equal(result.monitorFailed, true);
  assert.equal(result.e2big, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.rove, false);
  assert.match(result.feed, /Choked|sleep 5/);
  assert.equal(decideSeed("choked").verdict, "choked");
});

test("6 twinned: ~2 deny entries per worktree", () => {
  const result = decide(seedTwinned());
  assert.equal(result.verdict, "twinned");
  assert.equal(result.clewTwinned, true);
  assert.ok(result.worktreeCount > 0);
  const ratio = result.worktreeDenyCount / result.worktreeCount;
  assert.ok(ratio >= 1.8 && ratio <= 2.2);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Twinned|worktrees/);
  assert.equal(decideSeed("twinned").verdict, "twinned");
});

test("7 swollen: deny count unbounded vs baseline", () => {
  const result = decide(seedSwollen());
  assert.equal(result.verdict, "swollen");
  assert.equal(result.clewSwollen, true);
  assert.ok(result.totalDenyCount > 160 + 2 * result.worktreeCount);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Swollen|baseline/);
  assert.equal(decideSeed("swollen").verdict, "swollen");
});

test("8 jammed: single /bin/bash -c argument exceeds 128KB", () => {
  const result = decide(seedJammed());
  assert.equal(result.verdict, "jammed");
  assert.equal(result.clewJammed, true);
  assert.ok(result.largestArgBytes >= MAX_ARG_STRLEN);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.rove, false);
  assert.match(result.feed, /Jammed|MAX_ARG_STRLEN/);
  assert.equal(decideSeed("jammed").verdict, "jammed");
});

test("9 pruned: worktrees removed + profile rebuilt; spawn lives again", () => {
  const result = decide(seedPruned());
  assert.equal(result.verdict, "pruned");
  assert.equal(result.clewPruned, true);
  assert.equal(result.e2big, false);
  assert.equal(result.spawnFailed, false);
  assert.equal(result.rove, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /Pruned|spawn lives again/);
  assert.equal(decideSeed("pruned").verdict, "pruned");
});

test("10 cached: prune without restart still fouls", () => {
  const result = decide(seedCached());
  assert.equal(result.verdict, "cached");
  assert.equal(result.clewCached, true);
  assert.equal(result.profileCached, true);
  assert.equal(result.prunedButNotRestarted, true);
  assert.equal(result.alarm, true);
  assert.equal(result.rove, false);
  assert.match(result.feed, /Cached|#82840/);
  assert.equal(decideSeed("cached").verdict, "cached");
});

test("11 globbed: recursive deny globs expanded per-file", () => {
  const result = decide(seedGlobbed());
  assert.equal(result.verdict, "globbed");
  assert.equal(result.clewGlobbed, true);
  assert.equal(result.globExpandedPerFile, true);
  assert.equal(result.alarm, true);
  assert.equal(result.rove, false);
  assert.match(result.feed, /Globbed|#74081/);
  assert.equal(decideSeed("globbed").verdict, "globbed");
});

test("12 score() idle clew is rove and never alarms", () => {
  const result = score(emptyClew());
  assertScoreShape(result);
  assert.equal(result.verdict, "rove");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.rove, true);
  assert.equal(result.fouled, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "rove",
    "fouled",
    "overcoiled",
    "choked",
    "twinned",
    "swollen",
    "jammed",
    "pruned",
    "cached",
    "globbed",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "fouled",
    "overcoiled",
    "choked",
    "jammed",
    "swollen",
    "cached",
    "globbed",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["fouled", "choked", "jammed"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "rove");
  assert.doesNotMatch(IDLE_WORD, /clew$|keyed|housed|silent/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["rove", seedReset],
    ["fouled", seedFouled],
    ["overcoiled", seedOvercoiled],
    ["choked", seedChoked],
    ["twinned", seedTwinned],
    ["swollen", seedSwollen],
    ["jammed", seedJammed],
    ["pruned", seedPruned],
    ["cached", seedCached],
    ["globbed", seedGlobbed],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().clew), word, word);
    assert.equal(score(seed().clew).verdict, word, word);
  }
});

test("15 admit does not lie: fouled stays fouled; choked stays choked", () => {
  const fouled = decide({ ...seedFouled(), action: "admit" });
  assert.equal(fouled.verdict, "fouled");
  assert.equal(fouled.action, "admit");
  assert.equal(fouled.rove, false);
  assert.doesNotMatch(fouled.verdict, /rove/);
  const choked = decide({ ...seedChoked(), action: "admit" });
  assert.equal(choked.verdict, "choked");
});

test("16 bail / rove / reset returns idle rove", () => {
  const bailed = decide({ ...seedFouled(), action: "bail" });
  assert.equal(bailed.verdict, "rove");
  assert.equal(isIdle(bailed.clew), true);
  assertIdleNeverClew(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "rove");
  assert.equal(decide({ action: "rove" }).verdict, "rove");
  assert.equal(decide(seedReset()).verdict, "rove");
});

test("17 restore / fouled produces the #90569 fouled clew", () => {
  const result = decide({ action: "restore", clew: emptyClew() });
  assert.equal(result.verdict, "fouled");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, 90569);
  assert.equal(result.rove, false);
  assert.equal(decide({ action: "fouled" }).verdict, "fouled");
});

test("18 flagsOf matches slack / github; linear follows fouled/choked/jammed", () => {
  assert.deepEqual(flagsOf("fouled"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("choked"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("jammed"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("overcoiled"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("swollen"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("cached"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("globbed"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("twinned"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("pruned"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("rove"), { slack: false, linear: false, github: true, alarm: false });
});

test("19 helpers, reasons, analyze, priority", () => {
  assert.equal(fouledOf(seedFouled().clew), true);
  assert.equal(roveOf(emptyClew()), true);
  assert.equal(roveOf(seedFouled().clew), false);
  const reasons = reasonsOf(seedFouled().clew, "fouled");
  assert.ok(reasons.some((row) => /#90569/.test(row)));
  const facts = analyze(seedFouled().clew);
  assert.equal(facts.fouledShape, true);
  assert.equal(facts.overcoiledShape, true);
  assert.equal(facts.chokedShape, true);
  assert.equal(classify(seedFouled().clew), "fouled");
  assert.equal(classify(seed90569().clew), "fouled");
});

test("20 forbidden idle list includes clew, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("clew"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("keyed"));
  assert.ok(words.includes("wicket"));
  assert.ok(words.includes("sounder"));
  assert.ok(words.includes("plimsoll"));
  assert.ok(!words.includes("rove"));
});

test("21 demo sinks: Slack on alarm; Linear on fouled; GitHub always", async () => {
  const fouled = decide(seedFouled());
  const slack = slackClewAlarm(fouled, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubClewLedger(fouled, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub clew-ledger/);
  const linear = linearClewTicket(fouled, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearClewTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackClewAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(fouled, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("22 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const fouled = decide(seedFouled());
  const slack = slackClewAlarm(fouled, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubClewLedger(fouled, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearClewTicket(fouled, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("23 handle alarm classes deny; rove / control / pruned / twinned allow", async () => {
  const fouled = await handle(seedFouled(), {});
  assert.equal(fouled.permissionDecision, "deny");
  assert.match(fouled.hookSpecificOutput.decision.message, /fouled/);
  assert.equal((await handle(seedOvercoiled(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedChoked(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedJammed(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedSwollen(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedCached(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedGlobbed(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /rove/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedPruned(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedTwinned(), {})).permissionDecision, "allow");
});

test("24 listen GET health and POST empty body is rove", async () => {
  const server = listen(19756);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19756/health");
  const info = await health.json();
  assert.equal(info.product, "clew");
  assert.match(info.verbs, /fouled/);
  const res = await fetch("http://127.0.0.1:19756/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "rove");
  assert.equal(body.idleWord, "rove");
  const scored = await fetch("http://127.0.0.1:19756/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedFouled()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "fouled");
  await new Promise((resolve) => server.close(resolve));
});

test("25 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19757);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19757/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("26 parseSessionTrace reads a #90569 fouled report", () => {
  const clew = parseSessionTrace(
    "261 worktrees. 524 worktree denies. 130.7KB single arg. E2BIG. even sleep 5 fails. #90569.",
  );
  assert.equal(classify(clew), "fouled");
});

test("27 parseSessionTrace reads overcoiled, choked, jammed, cached", () => {
  assert.equal(
    classify(parseSessionTrace("deny list grew two entries per registered worktree without bound")),
    "overcoiled",
  );
  assert.equal(
    classify(parseSessionTrace("every Bash spawn fails (sleep 5 / echo hello / monitor) with E2BIG")),
    "choked",
  );
  assert.equal(
    classify(parseSessionTrace("single /bin/bash -c argument exceeds 128KB MAX_ARG_STRLEN")),
    "jammed",
  );
  assert.equal(
    classify(parseSessionTrace("profile cached per session so prune without restart still fouls #82840")),
    "cached",
  );
});

test("28 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90569,
    source: "bash",
    worktreeCount: 261,
    worktreeDenyCount: 524,
    baselineDenyCount: 160,
    totalDenyCount: 687,
    largestArgBytes: DEMO_LARGEST_ARG_BYTES,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: true,
    spawnFailed: true,
    sleepFailed: true,
    echoFailed: true,
    monitorFailed: true,
    profileCached: false,
    prunedButNotRestarted: false,
    globExpandedPerFile: false,
    ancestorExpanded: false,
    scored: false,
  });
  assert.equal(result.verdict, "fouled");
  assert.equal(result.rove, false);
  const cached = score({
    profileCached: true,
    prunedButNotRestarted: true,
    e2big: true,
    spawnFailed: true,
    sleepFailed: true,
  });
  assert.equal(cached.verdict, "cached");
});

test("29 nested clew / probe fields clone", () => {
  const clew = cloneClew({ probe: seedFouled().clew });
  assert.equal(classify(clew), "fouled");
});

test("30 fire live slack posts when fetch ok", async () => {
  const fouled = decide(seedFouled());
  const events = await fire(
    fouled,
    { CLEW_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted fouled/);
});

test("31 loft HTML sanity: idle word rove, seeded fouled, not sounder/wicket/scant/binnacle/pirn", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /rove/);
  assert.match(html, /Score/);
  assert.match(html, /fouled/);
  assert.match(html, /90569/);
  assert.match(html, /seedOf\("fouled"\)|clew = seedOf\("fouled"\)/);
  assert.match(html, /const IDLE_WORD = "rove"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "clew"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "keyed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.match(
    html,
    /sail-loft|rigger-bench|hemp-clew|tarred-oak|brass-thimble|lignum-sheave|loft-lantern|yarn-ball|load-line/i,
  );
  assert.match(html, /22:50 Sydney · clew/);
  assert.match(html, /working-size coil is not a hold/i);
  assert.doesNotMatch(html, /class="night-office"|class="oak-desk"|class="brass-sounder"|class="straight-key"|class="ink-tape"|class="line-lamp"/);
  assert.doesNotMatch(html, /class="binnacle-house"|class="chart-table"|class="gyro-card"|class="mag-card"/);
  assert.doesNotMatch(html, /class="loom-shed"|class="oak-frame"|class="pirn-rack"|class="yarn-package"/);
  assert.doesNotMatch(html, /class="pin-tray"|class="felt-bed"|class="split-pin"|class="caliper-beam"/);
  assert.doesNotMatch(html, /class="fob-rail"|class="brass-hook"|class="room-tag"|class="night-clerk"/);
  assert.doesNotMatch(html, /class="parchment-leaf"|class="rubric-rule"|class="kalendar-hours"|class="missal-gutter"/);
  assert.doesNotMatch(html, /class="leather-cinch"|class="brass-buckle"|class="strap-holes"/);
  assert.doesNotMatch(html, /class="oak-cask"|class="iron-hoop"|class="bung-seal"|class="gauging-rod"/);
  assert.doesNotMatch(html, /class="stone-belfry"|class="bronze-bell"|class="slack-rope"|class="bell-cote"/);
  assert.doesNotMatch(html, /Yeseva One|Cabin|Anonymous Pro/);
  assert.doesNotMatch(html, /Bodoni Moda|Figtree|DM Mono/);
  assert.doesNotMatch(html, /Syne|Literata|IBM Plex Mono/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Italiana|Newsreader/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Spectral|Nunito Sans/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Clew/);
  assert.match(html, /Cinzel|Lora|Overpass Mono/);
  assert.match(html, /Reset · rove|reset to rove/i);
  assert.match(html, /Restore · #90569|restore to fouled/i);
});

test("32 HTML why-not names Wicket, Scant, Sump, Cinch, Hasp, Sounder", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Wicket/);
  assert.match(html, /NOT Scant/);
  assert.match(html, /NOT Sump/);
  assert.match(html, /NOT Cinch/);
  assert.match(html, /NOT Hasp/);
  assert.match(html, /NOT Sounder/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("33 README names contrasts and rove idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Wicket\*\*|NOT Wicket/);
  assert.match(readme, /NOT \*\*Scant\*\*|NOT Scant/);
  assert.match(readme, /NOT \*\*Sump\*\*|NOT Sump/);
  assert.match(readme, /NOT \*\*Sounder\*\*|NOT Sounder/);
  assert.match(readme, /\*\*rove\*\*/);
  assert.match(readme, /#90569/);
  assert.match(readme, /\/clew\//);
  assert.doesNotMatch(readme, /idle word is clew/i);
  assert.doesNotMatch(readme, /idle word is keyed/i);
});

test("34 seeded 90569 numbers produce fouled / rove=false", () => {
  const fouled = score({
    worktreeCount: 261,
    worktreeDenyCount: 524,
    baselineDenyCount: 160,
    totalDenyCount: 687,
    largestArgBytes: DEMO_LARGEST_ARG_BYTES,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: true,
    spawnFailed: true,
    sleepFailed: true,
    echoFailed: true,
    monitorFailed: true,
  });
  assert.equal(fouled.verdict, "fouled");
  assert.equal(fouled.rove, false);
  assert.equal(fouled.e2big, true);
  assert.equal(fouled.sleepFailed, true);
});

test("35 rove requires spawn lives and largestArgBytes < maxArgStrlen and e2big false", () => {
  const hold = score({
    worktreeCount: 2,
    worktreeDenyCount: 2,
    baselineDenyCount: 160,
    totalDenyCount: 162,
    largestArgBytes: 8192,
    maxArgStrlen: MAX_ARG_STRLEN,
    e2big: false,
    spawnFailed: false,
    sleepFailed: false,
  });
  assert.equal(hold.verdict, "rove");
  assert.equal(hold.rove, true);
  const dead = score({
    e2big: true,
    spawnFailed: true,
    sleepFailed: true,
    largestArgBytes: DEMO_LARGEST_ARG_BYTES,
    maxArgStrlen: MAX_ARG_STRLEN,
    worktreeCount: 261,
    worktreeDenyCount: 524,
    totalDenyCount: 687,
  });
  assert.equal(dead.rove, false);
});

test("36 Slack skip on rove / control / pruned / twinned", () => {
  for (const seed of [seedReset, seedControl, seedRove, seedPruned, seedTwinned]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackClewAlarm(result, {}).summary, /Would skip Slack/);
  }
});
