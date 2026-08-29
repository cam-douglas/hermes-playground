import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubSpileLedger,
  linearSpileTicket,
  slackSpileAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  DEMO_DECLARED_TIMEOUT_SEC,
  DEMO_EOF_SEC,
  DEMO_HOURS_SECOND_SEC,
  DEMO_OPEN_PIPE_SHORT_SEC,
  DEMO_PROBE_SEC,
  DEMO_SELF_TIMEOUT_SEC,
  DEMO_TIMEOUT_IGNORED_SEC,
  DEMO_WEDGE_SEC,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  bungedOf,
  classify,
  cloneSpile,
  decide,
  decideSeed,
  emptyAction,
  emptySpile,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90585,
  seedBunged,
  seedControl,
  seedHoursHeld,
  seedNoEof,
  seedOpenPipe,
  seedParentBlind,
  seedReset,
  seedScriptAlive,
  seedSelfTimeout,
  seedTimeoutIgnored,
  seedUnretracted,
  seedWedge,
  verdictOf,
  wedgeOf,
} from "./spile.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverSpile(result) {
  assert.equal(result.idleWord, "bunged");
  assert.equal(IDLE_WORD, "bunged");
  assert.doesNotMatch(result.idleWord, /spile/i);
  assert.doesNotMatch(IDLE_WORD, /^spile$/i);
  assert.doesNotMatch(result.idleWord, /empty|silent|mute|idle|dead/i);
  assert.doesNotMatch(
    result.idleWord,
    /belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung|moored/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.bunged, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90585 wedge is wedge, slack, linear, idleWord bunged, never bunged", () => {
  const seed = seedWedge();
  const result = decide(seed);
  assert.equal(result.verdict, "wedge");
  assert.equal(result.state, "wedge");
  assert.equal(result.decision, "wedge");
  assert.equal(classify(seed.spile), "wedge");
  assert.equal(verdictOf(seed.spile), "wedge");
  assert.notEqual(result.verdict, "bunged");
  assert.notEqual(result.verdict, "self-timeout");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.spileWedge, true);
  assert.equal(result.wedge, true);
  assert.equal(result.bunged, false);
  assertIdleNeverSpile(result);
  assert.equal(result.session, "90585-wedge");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.observedBlockSec, DEMO_WEDGE_SEC);
  assert.equal(result.declaredTimeoutSec, DEMO_DECLARED_TIMEOUT_SEC);
  assert.equal(result.pipeOpen, true);
  assert.equal(result.eofDelivered, false);
  assert.equal(result.parentEnforcedTimeout, false);
  assert.equal(result.statusMessageStuck, true);
  assert.equal(result.notificationsHeld, true);
  assert.match(result.feed, /Wedge|primary #90585/i);
  assert.equal(decideSeed("wedge").verdict, "wedge");
  assert.equal(decideSeed("90585-wedge").verdict, "wedge");
  assert.equal(decideSeed(90585).verdict, "wedge");
  assert.ok(DEMO_WEDGE_SEC >= 5400);
  assert.ok(DEMO_WEDGE_SEC > DEMO_DECLARED_TIMEOUT_SEC);
});

test("2 idle/empty/{} is bunged, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "bunged");
  assert.equal(result.verdict, "bunged");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.bunged, true);
  assert.equal(classify({}), "bunged");
  assert.equal(classify(emptySpile()), "bunged");
  assert.equal(isIdle(emptySpile()), true);
  assert.equal(score(emptySpile()).bunged, true);
  assertIdleNeverSpile(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "bunged");
  assert.equal(bailed.idleWord, "bunged");
  const empty = decide({});
  assert.equal(empty.verdict, "bunged");
  assert.match(empty.feed, /Bunged/);
});

test("3 control bunged stays bunged with bunged true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "bunged");
  assert.equal(result.alarm, false);
  assert.equal(result.eofDelivered, true);
  assert.equal(result.pipeOpen, false);
  assert.equal(result.bunged, true);
  assert.equal(result.observedBlockSec, DEMO_EOF_SEC);
  assert.match(result.feed, /Bunged|EOF/);
  assert.equal(decideSeed("control").verdict, "bunged");
  assert.equal(decideSeed("healthy").verdict, "bunged");
  assert.equal(decide(seedControl()).bunged, true);
  assert.equal(DEMO_EOF_SEC, 0.052);
});

test("4 open-pipe: stdin kept open, no EOF yet, short duration", () => {
  const result = decide(seedOpenPipe());
  assert.equal(result.verdict, "open-pipe");
  assert.equal(result.spileOpenPipe, true);
  assert.equal(result.pipeOpen, true);
  assert.equal(result.eofDelivered, false);
  assert.equal(result.observedBlockSec, DEMO_OPEN_PIPE_SHORT_SEC);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.bunged, false);
  assert.match(result.feed, /Open-pipe|pipe kept open/i);
  assert.equal(decideSeed("open-pipe").verdict, "open-pipe");
});

test("5 no-eof: measured probe blocks exactly as long as the pipe stays open", () => {
  const result = decide(seedNoEof());
  assert.equal(result.verdict, "no-eof");
  assert.equal(result.spileNoEof, true);
  assert.equal(result.eofDelivered, false);
  assert.equal(result.pipeOpen, false);
  assert.equal(result.observedBlockSec, DEMO_PROBE_SEC);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.bunged, false);
  assert.match(result.feed, /No-eof|6\.003/);
  assert.equal(decideSeed("no-eof").verdict, "no-eof");
});

test("6 timeout-ignored: declared 5s, hook lives ~300s", () => {
  const result = decide(seedTimeoutIgnored());
  assert.equal(result.verdict, "timeout-ignored");
  assert.equal(result.spileTimeoutIgnored, true);
  assert.equal(result.declaredTimeoutSec, DEMO_DECLARED_TIMEOUT_SEC);
  assert.equal(result.observedBlockSec, DEMO_TIMEOUT_IGNORED_SEC);
  assert.ok(result.observedBlockSec > result.declaredTimeoutSec);
  assert.equal(result.parentEnforcedTimeout, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.bunged, false);
  assert.match(result.feed, /Timeout-ignored|timeout 5/i);
  assert.equal(decideSeed("timeout-ignored").verdict, "timeout-ignored");
});

test("7 hours-held: ~8h first freeze / ~1.5h second, no session-freeze extras", () => {
  const result = decide(seedHoursHeld());
  assert.equal(result.verdict, "hours-held");
  assert.equal(result.spileHoursHeld, true);
  assert.equal(result.observedBlockSec, DEMO_WEDGE_SEC);
  assert.ok(result.observedBlockSec >= DEMO_HOURS_SECOND_SEC);
  assert.equal(result.statusMessageStuck, false);
  assert.equal(result.notificationsHeld, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.bunged, false);
  assert.match(result.feed, /Hours-held|8h|1\.5h/);
  assert.equal(decideSeed("hours-held").verdict, "hours-held");
});

test("8 script-alive: hook process not terminated by parent", () => {
  const result = decide(seedScriptAlive());
  assert.equal(result.verdict, "script-alive");
  assert.equal(result.spileScriptAlive, true);
  assert.equal(result.hookStillAlive, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.bunged, false);
  assert.match(result.feed, /Script-alive|not terminated/);
  assert.equal(decideSeed("script-alive").verdict, "script-alive");
});

test("9 parent-blind: parent does not enforce timeout while blocked on stdin", () => {
  const result = decide(seedParentBlind());
  assert.equal(result.verdict, "parent-blind");
  assert.equal(result.spileParentBlind, true);
  assert.equal(result.parentEnforcedTimeout, false);
  assert.equal(result.declaredTimeoutSec, DEMO_DECLARED_TIMEOUT_SEC);
  assert.equal(result.alarm, true);
  assert.equal(result.bunged, false);
  assert.match(result.feed, /Parent-blind|does not enforce/);
  assert.equal(decideSeed("parent-blind").verdict, "parent-blind");
});

test("10 unretracted: statusMessage stuck; notifications queued", () => {
  const result = decide(seedUnretracted());
  assert.equal(result.verdict, "unretracted");
  assert.equal(result.spileUnretracted, true);
  assert.equal(result.statusMessageStuck, true);
  assert.equal(result.notificationsHeld, true);
  assert.equal(result.alarm, true);
  assert.equal(result.bunged, false);
  assert.match(result.feed, /Unretracted|statusMessage|spinner/);
  assert.equal(decideSeed("unretracted").verdict, "unretracted");
});

test("11 self-timeout mitigation ends hang class; bunged false (parent still failed)", () => {
  const result = decide(seedSelfTimeout());
  assert.equal(result.verdict, "self-timeout");
  assert.equal(result.spileSelfTimeout, true);
  assert.equal(result.selfTimeoutWrapped, true);
  assert.equal(result.observedBlockSec, DEMO_SELF_TIMEOUT_SEC);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.bunged, false);
  assert.match(result.feed, /Self-timeout|timeout 2|2\.043/);
  assert.equal(decideSeed("self-timeout").verdict, "self-timeout");
});

test("12 score() idle spile is bunged and never alarms", () => {
  const result = score(emptySpile());
  assertScoreShape(result);
  assert.equal(result.verdict, "bunged");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.bunged, true);
  assert.equal(result.wedge, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "bunged",
    "open-pipe",
    "no-eof",
    "timeout-ignored",
    "wedge",
    "hours-held",
    "script-alive",
    "parent-blind",
    "self-timeout",
    "unretracted",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "wedge",
    "hours-held",
    "timeout-ignored",
    "open-pipe",
    "no-eof",
    "script-alive",
    "parent-blind",
    "unretracted",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["wedge", "hours-held", "timeout-ignored", "open-pipe"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "bunged");
  assert.doesNotMatch(IDLE_WORD, /spile$|belayed|rove|keyed|silent/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["bunged", seedReset],
    ["wedge", seedWedge],
    ["open-pipe", seedOpenPipe],
    ["no-eof", seedNoEof],
    ["timeout-ignored", seedTimeoutIgnored],
    ["hours-held", seedHoursHeld],
    ["script-alive", seedScriptAlive],
    ["parent-blind", seedParentBlind],
    ["unretracted", seedUnretracted],
    ["self-timeout", seedSelfTimeout],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().spile), word, word);
    assert.equal(score(seed().spile).verdict, word, word);
  }
});

test("15 admit does not lie: wedge stays wedge; timeout-ignored stays timeout-ignored", () => {
  const wedge = decide({ ...seedWedge(), action: "admit" });
  assert.equal(wedge.verdict, "wedge");
  assert.equal(wedge.action, "admit");
  assert.equal(wedge.bunged, false);
  assert.doesNotMatch(wedge.verdict, /bunged/);
  const ignored = decide({ ...seedTimeoutIgnored(), action: "admit" });
  assert.equal(ignored.verdict, "timeout-ignored");
  const hours = decide({ ...seedHoursHeld(), action: "admit" });
  assert.equal(hours.verdict, "hours-held");
});

test("16 bail / bunged / reset returns idle bunged", () => {
  const bailed = decide({ ...seedWedge(), action: "bail" });
  assert.equal(bailed.verdict, "bunged");
  assert.equal(isIdle(bailed.spile), true);
  assertIdleNeverSpile(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "bunged");
  assert.equal(decide({ action: "bunged" }).verdict, "bunged");
  assert.equal(decide(seedReset()).verdict, "bunged");
  assert.equal(decide(seedBunged()).verdict, "bunged");
});

test("17 restore / wedge produces the #90585 wedge tap", () => {
  const result = decide({ action: "restore", spile: emptySpile() });
  assert.equal(result.verdict, "wedge");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.bunged, false);
  assert.equal(decide({ action: "wedge" }).verdict, "wedge");
});

test("18 flagsOf matches slack / github; linear follows wedge/hours-held/timeout-ignored/open-pipe", () => {
  assert.deepEqual(flagsOf("wedge"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("hours-held"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("timeout-ignored"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("open-pipe"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("no-eof"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("script-alive"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("parent-blind"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("unretracted"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("self-timeout"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("bunged"), { slack: false, linear: false, github: true, alarm: false });
});

test("19 helpers, reasons, analyze, priority", () => {
  assert.equal(wedgeOf(seedWedge().spile), true);
  assert.equal(bungedOf(emptySpile()), true);
  assert.equal(bungedOf(seedWedge().spile), false);
  assert.equal(bungedOf(seedControl().spile), true);
  assert.equal(bungedOf(seedSelfTimeout().spile), false);
  const reasons = reasonsOf(seedWedge().spile, "wedge");
  assert.ok(reasons.some((row) => /#90585/.test(row)));
  const facts = analyze(seedWedge().spile);
  assert.equal(facts.wedgeShape, true);
  assert.equal(classify(seedWedge().spile), "wedge");
  assert.equal(classify(seed90585().spile), "wedge");
  assert.equal(classify(seedTimeoutIgnored().spile), "timeout-ignored");
  assert.equal(classify(seedHoursHeld().spile), "hours-held");
});

test("20 forbidden idle list includes spile, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("spile"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("belayed"));
  assert.ok(words.includes("rove"));
  assert.ok(words.includes("gauged"));
  assert.ok(words.includes("deadman"));
  assert.ok(words.includes("sounder"));
  assert.ok(words.includes("ullage"));
  assert.ok(!words.includes("bunged"));
});

test("21 demo sinks: Slack on alarm; Linear on wedge; GitHub always", async () => {
  const wedge = decide(seedWedge());
  const slack = slackSpileAlarm(wedge, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubSpileLedger(wedge, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub spile-ledger/);
  const linear = linearSpileTicket(wedge, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearSpileTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackSpileAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(wedge, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("22 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const wedge = decide(seedWedge());
  const slack = slackSpileAlarm(wedge, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubSpileLedger(wedge, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearSpileTicket(wedge, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("23 handle alarm classes deny; bunged / control / self-timeout allow", async () => {
  const wedge = await handle(seedWedge(), {});
  assert.equal(wedge.permissionDecision, "deny");
  assert.match(wedge.hookSpecificOutput.decision.message, /wedge/);
  assert.equal((await handle(seedOpenPipe(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedHoursHeld(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedTimeoutIgnored(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedNoEof(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedScriptAlive(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedParentBlind(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedUnretracted(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /bunged/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedSelfTimeout(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("24 listen GET health and POST empty body is bunged", async () => {
  const server = listen(19891);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19891/health");
  const info = await health.json();
  assert.equal(info.product, "spile");
  assert.match(info.verbs, /wedge/);
  const res = await fetch("http://127.0.0.1:19891/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "bunged");
  assert.equal(body.idleWord, "bunged");
  const scored = await fetch("http://127.0.0.1:19891/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedWedge()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "wedge");
  await new Promise((resolve) => server.close(resolve));
});

test("25 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19892);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19892/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("26 parseSessionTrace reads a #90585 wedge report", () => {
  const spile = parseSessionTrace(
    "session frozen on hook statusMessage. notifications held. pipe open no EOF. timeout 5 ignored. #90585 wedge after 8 hours.",
  );
  assert.equal(classify(spile), "wedge");
});

test("27 parseSessionTrace reads timeout-ignored, no-eof, self-timeout", () => {
  assert.equal(
    classify(parseSessionTrace("timeout-ignored lives >> 5s. 303244ms against declared 5.")),
    "timeout-ignored",
  );
  assert.equal(
    classify(parseSessionTrace("no-eof probe: time sh hook.sh < <(sleep 6) → 6.003s")),
    "no-eof",
  );
  assert.equal(
    classify(parseSessionTrace("self-timeout wrap timeout 2 dd verified 2.043s")),
    "self-timeout",
  );
});

test("28 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90585,
    source: "hook",
    pipeOpen: true,
    eofDelivered: false,
    declaredTimeoutSec: 5,
    observedBlockSec: 28800,
    hookStillAlive: true,
    parentEnforcedTimeout: false,
    statusMessageStuck: true,
    notificationsHeld: true,
    selfTimeoutWrapped: false,
    scored: false,
  });
  assert.equal(result.verdict, "wedge");
  assert.equal(result.bunged, false);
  const hold = score({
    pipeOpen: false,
    eofDelivered: true,
    declaredTimeoutSec: 5,
    observedBlockSec: 0.052,
    parentEnforcedTimeout: true,
  });
  assert.equal(hold.verdict, "bunged");
  assert.equal(hold.bunged, true);
});

test("29 nested spile / probe fields clone", () => {
  const spile = cloneSpile({ probe: seedWedge().spile });
  assert.equal(classify(spile), "wedge");
});

test("30 fire live slack posts when fetch ok", async () => {
  const wedge = decide(seedWedge());
  const events = await fire(
    wedge,
    { SPILE_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted wedge/);
});

test("31 cellar HTML sanity: idle word bunged, seeded wedge, not bollard/clew/sounder/ullage", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /bunged/);
  assert.match(html, /Score/);
  assert.match(html, /wedge/);
  assert.match(html, /90585/);
  assert.match(html, /seedOf\("wedge"\)|spile = seedOf\("wedge"\)/);
  assert.match(html, /const IDLE_WORD = "bunged"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "spile"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "belayed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "gauged"/);
  assert.match(
    html,
    /bung-station|barrel-head|bung-hole|brass-spile|wooden-bung|bung-mallet|drip-tray|fuse-lamp|stave-hoop|cellar-rail|malt-glow|hoop-band/i,
  );
  assert.match(html, /00:50 Sydney · spile/);
  assert.match(html, /open spile is not a hold/i);
  assert.doesNotMatch(html, /class="wet-pier"|class="bollard-plate"|class="quay-lamp"|class="hawser-eye"|class="tide-mark"|class="cast-iron"|class="pier-plank"|class="dock-ring"|class="salt-wash"/);
  assert.doesNotMatch(html, /class="sail-loft"|class="rigger-bench"|class="hemp-clew"|class="lignum-sheave"|class="loft-lantern"|class="yarn-ball"|class="load-line"/);
  assert.doesNotMatch(html, /class="night-office"|class="oak-desk"|class="brass-sounder"|class="straight-key"|class="ink-tape"|class="line-lamp"/);
  assert.doesNotMatch(html, /class="binnacle-house"|class="chart-table"|class="gyro-card"|class="mag-card"/);
  assert.doesNotMatch(html, /class="loom-shed"|class="oak-frame"|class="pirn-rack"|class="yarn-package"/);
  assert.doesNotMatch(html, /class="fob-rail"|class="brass-hook"|class="room-tag"|class="night-clerk"/);
  assert.doesNotMatch(html, /ullage-stick|gauging-rod|gauging rod|ullage stick/i);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /Yeseva One|Cabin|Anonymous Pro/);
  assert.doesNotMatch(html, /Bodoni Moda|Figtree|DM Mono/);
  assert.doesNotMatch(html, /Syne|Literata|IBM Plex Mono/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Italiana|Newsreader/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Spectral|Nunito Sans/);
  assert.doesNotMatch(html, /Alfa Slab One|Bitter|Space Mono/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Spile/);
  assert.match(html, /Calistoga|Commissioner|Inconsolata/);
  assert.match(html, /Reset · bunged|reset to bunged/i);
  assert.match(html, /Restore · #90585|restore to wedge/i);
  assert.match(html, /Admit bunged/);
});

test("32 HTML why-not names Sounder, Tappet, Quench, Leat, Ullage, Bollard", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Sounder/);
  assert.match(html, /NOT Tappet/);
  assert.match(html, /NOT Quench/);
  assert.match(html, /NOT Leat/);
  assert.match(html, /NOT Ullage/);
  assert.match(html, /NOT Bollard/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("33 README names contrasts and bunged idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Sounder\*\*|NOT Sounder|hook stdin pipe/);
  assert.match(readme, /NOT \*\*Tappet\*\*|NOT Tappet/);
  assert.match(readme, /NOT \*\*Quench\*\*|NOT Quench/);
  assert.match(readme, /NOT \*\*Leat\*\*|NOT Leat/);
  assert.match(readme, /NOT \*\*Ullage\*\*|NOT Ullage/);
  assert.match(readme, /\*\*bunged\*\*/);
  assert.match(readme, /#90585/);
  assert.match(readme, /\/spile\//);
  assert.doesNotMatch(readme, /idle word is spile/i);
  assert.doesNotMatch(readme, /idle word is belayed/i);
  assert.doesNotMatch(readme, /idle word is gauged/i);
});

test("34 seeded 90585 numbers produce wedge / bunged=false", () => {
  const wedge = score({
    pipeOpen: true,
    eofDelivered: false,
    declaredTimeoutSec: 5,
    observedBlockSec: 28800,
    hookStillAlive: true,
    parentEnforcedTimeout: false,
    statusMessageStuck: true,
    notificationsHeld: true,
  });
  assert.equal(wedge.verdict, "wedge");
  assert.equal(wedge.bunged, false);
  assert.equal(wedge.pipeOpen, true);
  assert.equal(wedge.observedBlockSec, 28800);
});

test("35 control EOF path produces bunged=true; wedge never bunged", () => {
  const hold = score({
    pipeOpen: false,
    eofDelivered: true,
    declaredTimeoutSec: 5,
    observedBlockSec: 0.052,
    parentEnforcedTimeout: true,
  });
  assert.equal(hold.verdict, "bunged");
  assert.equal(hold.bunged, true);
  const dead = score({
    pipeOpen: true,
    eofDelivered: false,
    declaredTimeoutSec: 5,
    observedBlockSec: 28800,
    hookStillAlive: true,
    parentEnforcedTimeout: false,
    statusMessageStuck: true,
    notificationsHeld: true,
  });
  assert.equal(dead.bunged, false);
  assert.equal(dead.verdict, "wedge");
});

test("36 Slack skip on bunged / control / self-timeout", () => {
  for (const seed of [seedReset, seedControl, seedSelfTimeout, seedBunged]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackSpileAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("37 wedge pentad wins over hours-held and timeout-ignored", () => {
  const result = score({
    pipeOpen: true,
    eofDelivered: false,
    declaredTimeoutSec: 5,
    observedBlockSec: 28800,
    hookStillAlive: true,
    parentEnforcedTimeout: false,
    statusMessageStuck: true,
    notificationsHeld: true,
  });
  assert.equal(result.verdict, "wedge");
  assert.equal(result.bunged, false);
});

test("38 timeout-ignored wins over open-pipe when declared timeout is exceeded", () => {
  const result = decide(seedTimeoutIgnored());
  assert.equal(result.verdict, "timeout-ignored");
  assert.equal(result.pipeOpen, true);
  assert.ok(result.observedBlockSec > 5);
  assert.ok(result.observedBlockSec < 5400);
  assert.notEqual(result.verdict, "open-pipe");
  assert.notEqual(result.verdict, "hours-held");
  assert.notEqual(result.verdict, "wedge");
});

test("39 admit still does not lie after wedge / hours-held", () => {
  const admitted = decide({ ...seedWedge(), action: "admit" });
  assert.equal(admitted.verdict, "wedge");
  assert.equal(admitted.bunged, false);
  const hours = decide({ ...seedHoursHeld(), action: "admit" });
  assert.equal(hours.verdict, "hours-held");
  assert.equal(hours.bunged, false);
});

test("40 README and cellar cite #90585 incidents and same-class issues", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /8h|8 hours|~8h/i);
  assert.match(readme, /1\.5h|1\.5 hours/i);
  assert.match(readme, /6\.003/);
  assert.match(readme, /87289/);
  assert.match(readme, /85250/);
  assert.match(readme, /78756/);
  assert.match(readme, /27550/);
  assert.doesNotMatch(readme, /idle word is bung |idle word is deadman|idle word is petcock/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /statusMessage/);
  assert.match(html, /87289/);
  assert.match(html, /85250/);
  assert.match(html, /78756/);
  assert.match(html, /27550/);
});
