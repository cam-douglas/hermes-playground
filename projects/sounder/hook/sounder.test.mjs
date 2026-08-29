import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubSounderLedger,
  linearSounderTicket,
  slackSounderAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  DEMO_IDLE_HOURS,
  DEMO_WAITER_IDS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneSounder,
  decide,
  decideSeed,
  emptyAction,
  emptySounder,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  keyedOf,
  mutedOf,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90555,
  seedArmed,
  seedControl,
  seedCut,
  seedDeaf,
  seedDropped,
  seedKeyed,
  seedMuted,
  seedOrphaned,
  seedRelayed,
  seedReset,
  seedStalled,
  seedStranded,
  verdictOf,
} from "./sounder.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverSounder(result) {
  assert.equal(result.idleWord, "keyed");
  assert.equal(IDLE_WORD, "keyed");
  assert.doesNotMatch(result.idleWord, /sounder/i);
  assert.doesNotMatch(IDLE_WORD, /^sounder$/i);
  assert.doesNotMatch(result.idleWord, /empty|silent|mute|idle|dead/i);
  assert.doesNotMatch(
    result.idleWord,
    /housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.keyed, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90555 muted is muted, slack, linear, idleWord keyed", () => {
  const seed = seedMuted();
  const result = decide(seed);
  assert.equal(result.verdict, "muted");
  assert.equal(result.state, "muted");
  assert.equal(result.decision, "muted");
  assert.equal(classify(seed.sounder), "muted");
  assert.equal(verdictOf(seed.sounder), "muted");
  assert.notEqual(result.verdict, "keyed");
  assert.notEqual(result.verdict, "relayed");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.sounderMuted, true);
  assert.equal(result.muted, true);
  assert.equal(result.keyed, false);
  assertIdleNeverSounder(result);
  assert.equal(result.session, "90555-muted");
  assert.equal(result.issue, 90555);
  assert.equal(result.waiterCompleted, true);
  assert.equal(result.notificationDelivered, false);
  assert.equal(result.sessionReinvoked, false);
  assert.equal(result.humanInputRequired, true);
  assert.equal(result.idleHours, DEMO_IDLE_HOURS);
  assert.deepEqual(result.waiterIds, DEMO_WAITER_IDS.slice());
  assert.match(result.feed, /Muted|primary #90555/i);
  assert.equal(decideSeed("muted").verdict, "muted");
  assert.equal(decideSeed("90555-muted").verdict, "muted");
  assert.equal(decideSeed(90555).verdict, "muted");
});

test("2 idle/empty/{} is keyed, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "keyed");
  assert.equal(result.verdict, "keyed");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.keyed, true);
  assert.equal(classify({}), "keyed");
  assert.equal(classify(emptySounder()), "keyed");
  assert.equal(isIdle(emptySounder()), true);
  assert.equal(score(emptySounder()).keyed, true);
  assertIdleNeverSounder(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "keyed");
  assert.equal(bailed.idleWord, "keyed");
  const empty = decide({});
  assert.equal(empty.verdict, "keyed");
  assert.match(empty.feed, /Keyed/);
});

test("3 control / seedKeyed stay keyed", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "keyed");
  assert.equal(result.alarm, false);
  assert.equal(result.circuitArmed, true);
  assert.equal(result.waiterCompleted, false);
  assert.equal(result.sessionReinvoked, false);
  assert.match(result.feed, /Keyed/);
  assert.equal(decideSeed("control").verdict, "keyed");
  assert.equal(decideSeed("keyed").verdict, "keyed");
  assert.equal(decideSeed("healthy").verdict, "keyed");
  assert.equal(decide(seedKeyed()).verdict, "keyed");
});

test("4 stalled: sat idle for hours after waiter exit until human", () => {
  const result = decide(seedStalled());
  assert.equal(result.verdict, "stalled");
  assert.equal(result.sounderStalled, true);
  assert.equal(result.humanInputRequired, true);
  assert.equal(result.idleHours, DEMO_IDLE_HOURS);
  assert.equal(result.sessionReinvoked, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /Stalled|human input/);
  assert.equal(decideSeed("stalled").verdict, "stalled");
});

test("5 orphaned: waiter IDs exist, no wake attached", () => {
  const result = decide(seedOrphaned());
  assert.equal(result.verdict, "orphaned");
  assert.equal(result.sounderOrphaned, true);
  assert.ok(result.waiterIds.length > 0);
  assert.equal(result.sessionReinvoked, false);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Orphaned|waiter IDs/);
  assert.equal(decideSeed("orphaned").verdict, "orphaned");
});

test("6 relayed: notification delivered and session woke", () => {
  const result = decide(seedRelayed());
  assert.equal(result.verdict, "relayed");
  assert.equal(result.sounderRelayed, true);
  assert.equal(result.notificationDelivered, true);
  assert.equal(result.sessionReinvoked, true);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Relayed|woke/);
  assert.equal(decideSeed("relayed").verdict, "relayed");
});

test("7 deaf: session still present but never heard the click", () => {
  const result = decide(seedDeaf());
  assert.equal(result.verdict, "deaf");
  assert.equal(result.sounderDeaf, true);
  assert.equal(result.sessionPresent, true);
  assert.equal(result.sessionReinvoked, false);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Deaf|never heard/);
  assert.equal(decideSeed("deaf").verdict, "deaf");
});

test("8 armed: resume auto-fires before any input", () => {
  const result = decide(seedArmed());
  assert.equal(result.verdict, "armed");
  assert.equal(result.sounderArmed, true);
  assert.equal(result.resumeAutofire, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Armed|#90534/);
  assert.equal(decideSeed("armed").verdict, "armed");
});

test("9 dropped: notification enqueued but never delivered", () => {
  const result = decide(seedDropped());
  assert.equal(result.verdict, "dropped");
  assert.equal(result.sounderDropped, true);
  assert.equal(result.enqueuedNotDelivered, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Dropped|#85534/);
  assert.equal(decideSeed("dropped").verdict, "dropped");
});

test("10 stranded: idle teammate never woken", () => {
  const result = decide(seedStranded());
  assert.equal(result.verdict, "stranded");
  assert.equal(result.sounderStranded, true);
  assert.equal(result.teammateIdle, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Stranded|#77300/);
  assert.equal(decideSeed("stranded").verdict, "stranded");
});

test("11 cut: headless kills run_in_background at turn end", () => {
  const result = decide(seedCut());
  assert.equal(result.verdict, "cut");
  assert.equal(result.sounderCut, true);
  assert.equal(result.headlessKilledAtTurnEnd, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Cut|#85129/);
  assert.equal(decideSeed("cut").verdict, "cut");
});

test("12 score() idle sounder is keyed and never alarms", () => {
  const result = score(emptySounder());
  assertScoreShape(result);
  assert.equal(result.verdict, "keyed");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.keyed, true);
  assert.equal(result.muted, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "keyed",
    "muted",
    "stalled",
    "orphaned",
    "relayed",
    "deaf",
    "armed",
    "dropped",
    "stranded",
    "cut",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "muted",
    "stalled",
    "orphaned",
    "deaf",
    "dropped",
    "stranded",
    "cut",
    "armed",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["muted", "stalled"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "keyed");
  assert.doesNotMatch(IDLE_WORD, /sounder$|housed|rung|beamed|silent/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["keyed", seedReset],
    ["muted", seedMuted],
    ["stalled", seedStalled],
    ["orphaned", seedOrphaned],
    ["relayed", seedRelayed],
    ["deaf", seedDeaf],
    ["armed", seedArmed],
    ["dropped", seedDropped],
    ["stranded", seedStranded],
    ["cut", seedCut],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().sounder), word, word);
    assert.equal(score(seed().sounder).verdict, word, word);
  }
});

test("15 admit does not lie: muted stays muted; stalled stays stalled", () => {
  const muted = decide({ ...seedMuted(), action: "admit" });
  assert.equal(muted.verdict, "muted");
  assert.equal(muted.action, "admit");
  assert.doesNotMatch(muted.verdict, /keyed/);
  const stalled = decide({ ...seedStalled(), action: "admit" });
  assert.equal(stalled.verdict, "stalled");
});

test("16 bail / keyed / reset returns idle keyed", () => {
  const bailed = decide({ ...seedMuted(), action: "bail" });
  assert.equal(bailed.verdict, "keyed");
  assert.equal(isIdle(bailed.sounder), true);
  assertIdleNeverSounder(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "keyed");
  assert.equal(decide({ action: "keyed" }).verdict, "keyed");
  assert.equal(decide(seedReset()).verdict, "keyed");
});

test("17 restore / muted produces the #90555 muted sounder", () => {
  const result = decide({ action: "restore", sounder: emptySounder() });
  assert.equal(result.verdict, "muted");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, 90555);
  assert.equal(decide({ action: "muted" }).verdict, "muted");
});

test("18 flagsOf matches slack / github; linear follows muted/stalled", () => {
  assert.deepEqual(flagsOf("muted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("stalled"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("orphaned"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("deaf"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("dropped"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("stranded"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("cut"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("armed"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("relayed"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("keyed"), { slack: false, linear: false, github: true, alarm: false });
});

test("19 helpers, reasons, analyze, priority", () => {
  assert.equal(mutedOf(seedMuted().sounder), true);
  assert.equal(keyedOf(emptySounder()), true);
  assert.equal(keyedOf(seedMuted().sounder), false);
  const reasons = reasonsOf(seedMuted().sounder, "muted");
  assert.ok(reasons.some((row) => /#90555/.test(row)));
  const facts = analyze(seedMuted().sounder);
  assert.equal(facts.mutedShape, true);
  assert.equal(facts.stalledShape, true);
  assert.equal(classify(seedMuted().sounder), "muted");
  assert.equal(classify(seed90555().sounder), "muted");
});

test("20 forbidden idle list includes sounder, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("sounder"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("rung"));
  assert.ok(words.includes("leat"));
  assert.ok(words.includes("binnacle"));
  assert.ok(!words.includes("keyed"));
});

test("21 demo sinks: Slack on alarm; Linear on muted; GitHub always", async () => {
  const muted = decide(seedMuted());
  const slack = slackSounderAlarm(muted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubSounderLedger(muted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub sounder-ledger/);
  const linear = linearSounderTicket(muted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearSounderTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackSounderAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(muted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("22 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const muted = decide(seedMuted());
  const slack = slackSounderAlarm(muted, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubSounderLedger(muted, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearSounderTicket(muted, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("23 handle alarm classes deny; keyed / control / relayed allow", async () => {
  const muted = await handle(seedMuted(), {});
  assert.equal(muted.permissionDecision, "deny");
  assert.match(muted.hookSpecificOutput.decision.message, /muted/);
  assert.equal((await handle(seedStalled(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedOrphaned(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedDeaf(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedArmed(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /keyed/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedRelayed(), {})).permissionDecision, "allow");
});

test("24 listen GET health and POST empty body is keyed", async () => {
  const server = listen(19746);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19746/health");
  const info = await health.json();
  assert.equal(info.product, "sounder");
  assert.match(info.verbs, /muted/);
  const res = await fetch("http://127.0.0.1:19746/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "keyed");
  assert.equal(body.idleWord, "keyed");
  const scored = await fetch("http://127.0.0.1:19746/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedMuted()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "muted");
  await new Promise((resolve) => server.close(resolve));
});

test("25 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19747);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19747/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("26 parseSessionTrace reads a #90555 muted report", () => {
  const sounder = parseSessionTrace(
    "Background Bash waiter with run_in_background completed. Notification never re-invoked the session. #90555.",
  );
  assert.equal(classify(sounder), "muted");
});

test("27 parseSessionTrace reads stalled, orphaned, deaf, armed", () => {
  assert.equal(
    classify(parseSessionTrace("session sat idle for hours after waiter exit until human input")),
    "stalled",
  );
  assert.equal(
    classify(parseSessionTrace("waiter IDs exist, no wake attached")),
    "orphaned",
  );
  assert.equal(
    classify(parseSessionTrace("session still present but never heard the click")),
    "deaf",
  );
  assert.equal(
    classify(parseSessionTrace("resume auto-fires armed background shells before any input #90534")),
    "armed",
  );
});

test("28 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90555,
    source: "bash",
    waiterCompleted: true,
    notificationDelivered: false,
    sessionReinvoked: false,
    humanInputRequired: true,
    idleHours: 6.25,
    waiterIds: ["br1ghbwl6", "bzuzeorji"],
    resumeAutofire: false,
    enqueuedNotDelivered: false,
    teammateIdle: false,
    headlessKilledAtTurnEnd: false,
    scored: false,
  });
  assert.equal(result.verdict, "muted");
  assert.equal(result.keyed, false);
  const armed = score({
    resumeAutofire: true,
    circuitArmed: true,
  });
  assert.equal(armed.verdict, "armed");
});

test("29 nested sounder / probe fields clone", () => {
  const sounder = cloneSounder({ probe: seedMuted().sounder });
  assert.equal(classify(sounder), "muted");
});

test("30 fire live slack posts when fetch ok", async () => {
  const muted = decide(seedMuted());
  const events = await fire(
    muted,
    { SOUNDER_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted muted/);
});

test("31 desk HTML sanity: idle word keyed, seeded muted, not binnacle/pirn/cotter/fob", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /keyed/);
  assert.match(html, /Score/);
  assert.match(html, /muted/);
  assert.match(html, /90555/);
  assert.match(html, /seedOf\("muted"\)|sounder = seedOf\("muted"\)/);
  assert.match(html, /const IDLE_WORD = "keyed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "sounder"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "housed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "rung"/);
  assert.match(
    html,
    /night-office|oak-desk|brass-sounder|straight-key|ink-tape|line-lamp|key-lever|tape-mark|armature-coil|blotter-pad/i,
  );
  assert.match(html, /21:50 Sydney · sounder/);
  assert.match(html, /completed waiter is not a hold/i);
  assert.doesNotMatch(html, /class="binnacle-house"|class="chart-table"|class="gyro-card"|class="mag-card"/);
  assert.doesNotMatch(html, /class="loom-shed"|class="oak-frame"|class="pirn-rack"|class="yarn-package"/);
  assert.doesNotMatch(html, /class="pin-tray"|class="felt-bed"|class="split-pin"|class="caliper-beam"/);
  assert.doesNotMatch(html, /class="fob-rail"|class="brass-hook"|class="room-tag"|class="night-clerk"/);
  assert.doesNotMatch(html, /class="parchment-leaf"|class="rubric-rule"|class="kalendar-hours"|class="missal-gutter"/);
  assert.doesNotMatch(html, /class="leather-cinch"|class="brass-buckle"|class="strap-holes"/);
  assert.doesNotMatch(html, /class="oak-cask"|class="iron-hoop"|class="bung-seal"|class="gauging-rod"/);
  assert.doesNotMatch(html, /class="stone-belfry"|class="bronze-bell"|class="slack-rope"|class="bell-cote"/);
  assert.doesNotMatch(html, /Bodoni Moda|Figtree|DM Mono/);
  assert.doesNotMatch(html, /Syne|Literata|IBM Plex Mono/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Italiana|Newsreader/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Spectral|Nunito Sans/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Sounder/);
  assert.match(html, /Yeseva One|Cabin|Anonymous Pro/);
  assert.match(html, /Reset · keyed|reset to keyed/i);
  assert.match(html, /Restore · #90555|restore to muted/i);
});

test("32 HTML why-not names Leat, Fusee, Cotter, Reveille, Shunt, Husk, Binnacle, Pirn", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Leat/);
  assert.match(html, /NOT Fusee/);
  assert.match(html, /NOT Cotter/);
  assert.match(html, /NOT Reveille/);
  assert.match(html, /NOT Shunt/);
  assert.match(html, /NOT Husk/);
  assert.match(html, /NOT Binnacle/);
  assert.match(html, /NOT Pirn/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("33 README names contrasts and keyed idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Leat\*\*|NOT Leat/);
  assert.match(readme, /NOT \*\*Fusee\*\*|NOT Fusee/);
  assert.match(readme, /NOT \*\*Binnacle\*\*|NOT Binnacle/);
  assert.match(readme, /NOT \*\*Pirn\*\*|NOT Pirn/);
  assert.match(readme, /\*\*keyed\*\*/);
  assert.match(readme, /#90555/);
  assert.match(readme, /\/sounder\//);
  assert.doesNotMatch(readme, /idle word is sounder/i);
  assert.doesNotMatch(readme, /idle word is housed/i);
});

test("34 completed waiter and clean exit do not force keyed when session never re-invoked", () => {
  const muted = score({
    waiterCompleted: true,
    notificationDelivered: false,
    sessionReinvoked: false,
    humanInputRequired: true,
    idleHours: 6.25,
    waiterIds: ["br1ghbwl6", "bzuzeorji"],
    sessionPresent: true,
    circuitArmed: true,
  });
  assert.equal(muted.verdict, "muted");
  assert.equal(muted.keyed, false);
  assert.equal(muted.waiterCompleted, true);
});

test("35 keyed hold requires an armed circuit that will wake without a human", () => {
  const hold = score({
    circuitArmed: true,
    waiterCompleted: false,
    notificationDelivered: false,
    sessionReinvoked: false,
    humanInputRequired: false,
    sessionPresent: true,
  });
  assert.equal(hold.verdict, "keyed");
});

test("36 Slack skip on keyed / control / relayed", () => {
  for (const seed of [seedReset, seedControl, seedKeyed, seedRelayed]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackSounderAlarm(result, {}).summary, /Would skip Slack/);
  }
});
