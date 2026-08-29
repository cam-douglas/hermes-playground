import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubGaffLedger,
  linearGaffTicket,
  slackGaffAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_FALSE_OK_ISSUE,
  DEMO_NOTIFICATION_90616,
  DEMO_NOTIFICATION_XML,
  DEMO_REPRO,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  RC_KILL_ISSUE,
  SIGKILL_ISSUE,
  SILENT_KILL_ISSUE,
  SLACK_VERDICTS,
  TURN_KILL_ISSUE,
  VERDICTS,
  analyze,
  billedOf,
  classify,
  cloneGaff,
  decide,
  decideSeed,
  emptyAction,
  emptyGaff,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  parseSessionTrace,
  parseTaskNotification,
  reasonsOf,
  score,
  seed90616,
  seedBilled,
  seedControl,
  seedEmptyOk,
  seedGroupReaped,
  seedHonestComplete,
  seedHoursLost,
  seedMidloop,
  seedReset,
  seedSigkilled,
  seedTruncated,
  seedTurnKilled,
  seedYanked,
  verdictOf,
  yankedOf,
} from "./gaff.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung|moored|stowed|caught/;

function assertIdleNeverGaff(result) {
  assert.equal(result.idleWord, "yanked");
  assert.equal(IDLE_WORD, "yanked");
  assert.doesNotMatch(result.idleWord, /gaff/i);
  assert.doesNotMatch(IDLE_WORD, /^gaff$/i);
  assert.doesNotMatch(result.idleWord, /empty|silent|mute|idle|dead/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.yanked, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90616 billed is billed, slack, linear, idleWord yanked, never yanked", () => {
  const seed = seedBilled();
  const result = decide(seed);
  assert.equal(result.verdict, "billed");
  assert.equal(result.state, "billed");
  assert.equal(result.decision, "billed");
  assert.equal(classify(seed.gaff), "billed");
  assert.equal(verdictOf(seed.gaff), "billed");
  assert.notEqual(result.verdict, "yanked");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.gaffBilled, true);
  assert.equal(result.billed, true);
  assert.equal(result.yanked, false);
  assertIdleNeverGaff(result);
  assert.equal(result.session, "90616-billed");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.reportedStatus, "completed");
  assert.equal(result.exitCode, 0);
  assert.equal(result.timeoutKilled, true);
  assert.match(result.feed, /Billed|primary #90616/i);
  assert.equal(decideSeed("billed").verdict, "billed");
  assert.equal(decideSeed("90616-billed").verdict, "billed");
  assert.equal(decideSeed(90616).verdict, "billed");
});

test("2 idle/empty/{} is yanked, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "yanked");
  assert.equal(result.verdict, "yanked");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.yanked, true);
  assert.equal(classify({}), "yanked");
  assert.equal(classify(emptyGaff()), "yanked");
  assert.equal(isIdle(emptyGaff()), true);
  assert.equal(score(emptyGaff()).yanked, true);
  assertIdleNeverGaff(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "yanked");
  assert.equal(bailed.idleWord, "yanked");
  const empty = decide({});
  assert.equal(empty.verdict, "yanked");
  assert.match(empty.feed, /Yanked/);
});

test("3 control timed_out/nonzero stays yanked with yanked true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "yanked");
  assert.equal(result.alarm, false);
  assert.equal(result.reportedStatus, "timed_out");
  assert.equal(result.exitCode, 137);
  assert.equal(result.timeoutKilled, true);
  assert.equal(result.yanked, true);
  assert.equal(result.honestKill, true);
  assert.match(result.feed, /Yanked|crook was seen|kill reported/i);
  assert.equal(decideSeed("control").verdict, "yanked");
  assert.equal(decideSeed("healthy").verdict, "yanked");
  assert.equal(decide(seedControl()).yanked, true);
});

test("4 honest complete (DONE present, no kill) is yanked", () => {
  const result = decide(seedHonestComplete());
  assert.equal(result.verdict, "yanked");
  assert.equal(result.donePresent, true);
  assert.equal(result.honestComplete, true);
  assert.equal(result.timeoutKilled, false);
  assert.equal(result.yanked, true);
  assert.equal(result.alarm, false);
});

test("5 hours-lost: remaining units + user told success, not billed", () => {
  const result = decide(seedHoursLost());
  assert.equal(result.verdict, "hours-lost");
  assert.equal(result.gaffHoursLost, true);
  assert.equal(result.remainingUnits, 36);
  assert.equal(result.userToldSuccess, true);
  assert.equal(result.timeoutKilled, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.yanked, false);
  assert.match(result.feed, /Hours-lost|remaining units/i);
  assert.equal(decideSeed("hours-lost").verdict, "hours-lost");
});

test("6 empty-ok: 0-byte + completed exit 0", () => {
  const result = decide(seedEmptyOk());
  assert.equal(result.verdict, "empty-ok");
  assert.equal(result.gaffEmptyOk, true);
  assert.equal(result.emptyOutput, true);
  assert.equal(result.exitCode, 0);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.yanked, false);
  assert.match(result.feed, /Empty-ok|0-byte/i);
});

test("7 sigkilled: traps never fire without the billed pentad", () => {
  const result = decide(seedSigkilled());
  assert.equal(result.verdict, "sigkilled");
  assert.equal(result.gaffSigkilled, true);
  assert.equal(result.trapsNeverFired, true);
  assert.equal(result.timeoutKilled, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.yanked, false);
  assert.match(result.feed, /Sigkilled|SIGKILL|#87055/i);
  assert.equal(decideSeed(87055).verdict, "sigkilled");
});

test("8 group-reaped: after-marker missing", () => {
  const result = decide(seedGroupReaped());
  assert.equal(result.verdict, "group-reaped");
  assert.equal(result.gaffGroupReaped, true);
  assert.equal(result.afterMarkerMissing, true);
  assert.equal(result.processGroupReaped, true);
  assert.equal(result.alarm, false);
  assert.equal(result.yanked, false);
  assert.match(result.feed, /Group-reaped|after-marker/i);
});

test("9 turn-killed: turn boundary + status mismatch", () => {
  const result = decide(seedTurnKilled());
  assert.equal(result.verdict, "turn-killed");
  assert.equal(result.gaffTurnKilled, true);
  assert.equal(result.turnBoundary, true);
  assert.equal(result.statusMismatch, true);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.equal(result.yanked, false);
  assert.match(result.feed, /Turn-killed|turn boundary|#88754/i);
  assert.equal(decideSeed(88754).verdict, "turn-killed");
});

test("10 midloop: prefix of N then completed", () => {
  const result = decide(seedMidloop());
  assert.equal(result.verdict, "midloop");
  assert.equal(result.gaffMidloop, true);
  assert.equal(result.midloopPrefix, true);
  assert.equal(result.seenIterations, 1);
  assert.equal(result.expectedIterations, 10);
  assert.equal(result.alarm, false);
  assert.equal(result.yanked, false);
  assert.match(result.feed, /Midloop|prefix/i);
});

test("11 truncated: mid-stream, no DONE/TOTAL", () => {
  const result = decide(seedTruncated());
  assert.equal(result.verdict, "truncated");
  assert.equal(result.gaffTruncated, true);
  assert.equal(result.outputTruncated, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.yanked, false);
  assert.match(result.feed, /Truncated|mid-stream|DONE/i);
});

test("12 score() idle gaff is yanked and never alarms", () => {
  const result = score(emptyGaff());
  assertScoreShape(result);
  assert.equal(result.verdict, "yanked");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.yanked, true);
  assert.equal(result.billed, false);
});

test("13 verdict vocabulary is exactly the nine words", () => {
  assert.deepEqual(VERDICTS, [
    "yanked",
    "billed",
    "truncated",
    "midloop",
    "sigkilled",
    "group-reaped",
    "turn-killed",
    "empty-ok",
    "hours-lost",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "billed",
    "truncated",
    "empty-ok",
    "hours-lost",
    "sigkilled",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["billed", "hours-lost"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "yanked");
  assert.doesNotMatch(IDLE_WORD, /gaff$|posted|bunged|silent|stowed|caught/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["yanked", seedReset],
    ["billed", seedBilled],
    ["truncated", seedTruncated],
    ["midloop", seedMidloop],
    ["sigkilled", seedSigkilled],
    ["group-reaped", seedGroupReaped],
    ["turn-killed", seedTurnKilled],
    ["empty-ok", seedEmptyOk],
    ["hours-lost", seedHoursLost],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().gaff), word, word);
    assert.equal(score(seed().gaff).verdict, word, word);
  }
});

test("15 admit does not lie: billed stays billed; hours-lost stays hours-lost", () => {
  const billed = decide({ ...seedBilled(), action: "admit" });
  assert.equal(billed.verdict, "billed");
  assert.equal(billed.action, "admit");
  assert.equal(billed.yanked, false);
  assert.doesNotMatch(billed.verdict, /yanked/);
  const lost = decide({ ...seedHoursLost(), action: "admit" });
  assert.equal(lost.verdict, "hours-lost");
  const sig = decide({ ...seedSigkilled(), action: "admit" });
  assert.equal(sig.verdict, "sigkilled");
});

test("16 bail / yanked / reset returns idle yanked", () => {
  const bailed = decide({ ...seedBilled(), action: "bail" });
  assert.equal(bailed.verdict, "yanked");
  assert.equal(isIdle(bailed.gaff), true);
  assertIdleNeverGaff(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "yanked");
  assert.equal(decide({ action: "yanked" }).verdict, "yanked");
  assert.equal(decide(seedReset()).verdict, "yanked");
  assert.equal(decide(seedYanked()).verdict, "yanked");
});

test("17 restore / billed produces the #90616 billed stage", () => {
  const result = decide({ action: "restore", gaff: emptyGaff() });
  assert.equal(result.verdict, "billed");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.yanked, false);
  assert.equal(decide({ action: "billed" }).verdict, "billed");
});

test("18 flagsOf matches slack / github; linear follows billed/hours-lost", () => {
  assert.deepEqual(flagsOf("billed"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("hours-lost"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("truncated"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("empty-ok"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("sigkilled"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("midloop"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("group-reaped"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("turn-killed"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("yanked"), { slack: false, linear: false, github: true, alarm: false });
});

test("19 helpers, reasons, analyze, priority", () => {
  assert.equal(billedOf(seedBilled().gaff), true);
  assert.equal(yankedOf(emptyGaff()), true);
  assert.equal(yankedOf(seedBilled().gaff), false);
  assert.equal(yankedOf(seedControl().gaff), true);
  assert.equal(yankedOf(seedSigkilled().gaff), false);
  const reasons = reasonsOf(seedBilled().gaff, "billed");
  assert.ok(reasons.some((row) => /#90616/.test(row)));
  const facts = analyze(seedBilled().gaff);
  assert.equal(facts.billedShape, true);
  assert.equal(classify(seedBilled().gaff), "billed");
  assert.equal(classify(seed90616().gaff), "billed");
  assert.equal(classify(seedHoursLost().gaff), "hours-lost");
});

test("20 forbidden idle list includes gaff, empty, leftover names, not yanked", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("gaff"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("posted"));
  assert.ok(words.includes("caught"));
  assert.ok(words.includes("stowed"));
  assert.ok(words.includes("sear"));
  assert.ok(words.includes("crook"));
  assert.ok(!words.includes("yanked"));
});

test("21 demo sinks: Slack on alarm; Linear on billed; GitHub always; never fake live 200", async () => {
  const billed = decide(seedBilled());
  const slack = slackGaffAlarm(billed, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubGaffLedger(billed, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub gaff-ledger/);
  const linear = linearGaffTicket(billed, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearGaffTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackGaffAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(billed, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200|live 200/.test(row.summary || "")));
});

test("22 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const billed = decide(seedBilled());
  const slack = slackGaffAlarm(billed, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubGaffLedger(billed, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearGaffTicket(billed, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("23 handle alarm classes deny; yanked / control / midloop / group-reaped / turn-killed allow", async () => {
  const billed = await handle(seedBilled(), {});
  assert.equal(billed.permissionDecision, "deny");
  assert.match(billed.hookSpecificOutput.decision.message, /billed/);
  assert.equal((await handle(seedHoursLost(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedEmptyOk(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedSigkilled(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedTruncated(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /yanked/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedMidloop(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedGroupReaped(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedTurnKilled(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("24 listen GET health and POST empty body is yanked", async () => {
  const server = listen(19921);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19921/health");
  const info = await health.json();
  assert.equal(info.product, "gaff");
  assert.match(info.verbs, /billed/);
  const res = await fetch("http://127.0.0.1:19921/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "yanked");
  assert.equal(body.idleWord, "yanked");
  const scored = await fetch("http://127.0.0.1:19921/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedBilled()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "billed");
  await new Promise((resolve) => server.close(resolve));
});

test("25 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19922);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19922/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("26 parse of the #90616 notification text is billed", () => {
  const gaff = parseTaskNotification(DEMO_NOTIFICATION_90616);
  assert.equal(classify(gaff), "billed");
  assert.equal(gaff.reportedStatus, "completed");
  assert.equal(gaff.exitCode, 0);
  assert.equal(gaff.timeoutKilled, true);
  const xml = parseTaskNotification(DEMO_NOTIFICATION_XML, DEMO_NOTIFICATION_90616);
  assert.equal(classify(xml), "billed");
  assert.match(DEMO_NOTIFICATION_90616, /<status>completed<\/status>|completed \(exit code 0\)/);
  assert.match(DEMO_NOTIFICATION_XML, /<status>completed<\/status>/);
  assert.match(DEMO_NOTIFICATION_XML, /<exit_code>0<\/exit_code>/);
});

test("27 parseSessionTrace reads billed, sigkilled, turn-killed", () => {
  assert.equal(
    classify(parseSessionTrace(DEMO_NOTIFICATION_90616)),
    "billed",
  );
  assert.equal(
    classify(parseSessionTrace("#87055 SIGKILL traps never fire daemonizing CLI completed (exit code 0)")),
    "sigkilled",
  );
  assert.equal(
    classify(parseSessionTrace("#88754 killed at turn boundary; status does not match the process")),
    "turn-killed",
  );
});

test("28 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90616,
    source: "hook",
    reportedStatus: "completed",
    exitCode: 0,
    timeoutKilled: true,
    harnessKill: true,
    outputTruncated: true,
    midloopPrefix: true,
    seenIterations: 4,
    expectedIterations: 40,
    remainingUnits: 36,
    userToldSuccess: true,
    scored: false,
  });
  assert.equal(result.verdict, "billed");
  assert.equal(result.yanked, false);
  const hold = score({
    reportedStatus: "timed_out",
    exitCode: 137,
    timeoutKilled: true,
  });
  assert.equal(hold.verdict, "yanked");
  assert.equal(hold.yanked, true);
});

test("29 nested gaff / probe fields clone", () => {
  const gaff = cloneGaff({ probe: seedBilled().gaff });
  assert.equal(classify(gaff), "billed");
});

test("30 fire live slack posts when fetch ok", async () => {
  const billed = decide(seedBilled());
  const events = await fire(
    billed,
    { GAFF_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted billed/);
});

test("31 music-hall HTML sanity: idle word yanked, seeded billed, not sear/cubby/grille", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /yanked/);
  assert.match(html, /Score/);
  assert.match(html, /billed/);
  assert.match(html, /90616/);
  assert.match(html, /seedOf\("billed"\)|gaff = seedOf\("billed"\)/);
  assert.match(html, /const IDLE_WORD = "yanked"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "gaff"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "posted"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "caught"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stowed"/);
  assert.match(
    html,
    /music-hall|house-curtain|proscenium-arch|footlight-row|brass-crook|playbill-card|call-sheet|marquee-board|stage-apron/i,
  );
  assert.match(html, /04:50 Sydney · gaff/);
  assert.match(html, /billed full house is not a hold/i);
  assert.doesNotMatch(html, /class="gunsmith-shop"|class="sear-rail"|class="walnut-stock"|class="blued-action"|class="sear-notch"/);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"|class="oak-bay"|class="brass-nameplate"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"|class="bronze-lattice"|class="grille-window"/);
  assert.doesNotMatch(html, /class="bung-station"|class="barrel-head"|class="bung-hole"|class="brass-spile"/);
  assert.doesNotMatch(html, /class="wet-pier"|class="bollard-plate"|class="quay-lamp"|class="hawser-eye"/);
  assert.doesNotMatch(html, /class="sail-loft"|class="rigger-bench"|class="hemp-clew"/);
  assert.doesNotMatch(html, /class="night-desk"|class="sounder-key"|class="telegraph-sounder"/);
  assert.doesNotMatch(html, /Calistoga|Commissioner|Inconsolata/);
  assert.doesNotMatch(html, /Playfair Display|Source Serif 4|JetBrains Mono/);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /Yeseva One|\bCabin\b|Anonymous Pro/);
  assert.doesNotMatch(html, /Alfa Slab One|Bitter|Space Mono/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Young Serif|Outfit|Red Hat Mono/);
  assert.doesNotMatch(html, /Newsreader|Barlow Condensed|IBM Plex Mono/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Gaff/);
  assert.match(html, /Abril Fatface|Bebas Neue|Cutive Mono/);
  assert.match(html, /Reset · yanked|reset to yanked/i);
  assert.match(html, /Restore · #90616|restore to billed/i);
  assert.match(html, /Admit yanked/);
});

test("32 HTML why-not names Spile, Sounder, Sear, Leat, Quench", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Spile/);
  assert.match(html, /NOT Sounder/);
  assert.match(html, /NOT Sear/);
  assert.match(html, /NOT Leat/);
  assert.match(html, /NOT Quench/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("33 README names contrasts and yanked idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Spile\*\*|NOT Spile/);
  assert.match(readme, /NOT \*\*Sounder\*\*|NOT Sounder/);
  assert.match(readme, /NOT \*\*Sear\*\*|NOT Sear/);
  assert.match(readme, /NOT \*\*Quench\*\*|NOT Quench/);
  assert.match(readme, /\*\*yanked\*\*/);
  assert.match(readme, /#90616/);
  assert.match(readme, /#87055/);
  assert.match(readme, /#88754/);
  assert.match(readme, /\/gaff\//);
  assert.doesNotMatch(readme, /idle word is gaff/i);
  assert.doesNotMatch(readme, /idle word is caught/i);
  assert.doesNotMatch(readme, /idle word is posted/i);
});

test("34 seeded 90616 numbers produce billed / yanked=false", () => {
  const billed = score({
    reportedStatus: "completed",
    exitCode: 0,
    timeoutKilled: true,
    harnessKill: true,
    outputTruncated: true,
    midloopPrefix: true,
    seenIterations: 4,
    expectedIterations: 40,
    remainingUnits: 36,
    userToldSuccess: true,
  });
  assert.equal(billed.verdict, "billed");
  assert.equal(billed.yanked, false);
  assert.equal(billed.timeoutKilled, true);
  assert.equal(billed.exitCode, 0);
});

test("35 control timed_out/nonzero produces yanked=true; billed never yanked", () => {
  const hold = score({
    reportedStatus: "timed_out",
    exitCode: 137,
    timeoutKilled: true,
  });
  assert.equal(hold.verdict, "yanked");
  assert.equal(hold.yanked, true);
  const lie = score({
    reportedStatus: "completed",
    exitCode: 0,
    timeoutKilled: true,
    outputTruncated: true,
  });
  assert.equal(lie.yanked, false);
  assert.equal(lie.verdict, "billed");
});

test("36 Slack skip on yanked / control / midloop / group-reaped / turn-killed", () => {
  for (const seed of [seedReset, seedControl, seedMidloop, seedGroupReaped, seedTurnKilled, seedYanked]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackGaffAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("37 billed pentad wins over hours-lost and truncated", () => {
  const result = score({
    reportedStatus: "completed",
    exitCode: 0,
    timeoutKilled: true,
    outputTruncated: true,
    midloopPrefix: true,
    remainingUnits: 36,
    userToldSuccess: true,
  });
  assert.equal(result.verdict, "billed");
  assert.equal(result.yanked, false);
});

test("38 hours-lost wins when remaining+told-success without timeout-kill", () => {
  const result = decide(seedHoursLost());
  assert.equal(result.verdict, "hours-lost");
  assert.equal(result.timeoutKilled, false);
  assert.notEqual(result.verdict, "billed");
  assert.notEqual(result.verdict, "truncated");
});

test("39 admit still does not lie after billed / hours-lost", () => {
  const admitted = decide({ ...seedBilled(), action: "admit" });
  assert.equal(admitted.verdict, "billed");
  assert.equal(admitted.yanked, false);
  const lost = decide({ ...seedHoursLost(), action: "admit" });
  assert.equal(lost.verdict, "hours-lost");
  assert.equal(lost.yanked, false);
});

test("40a HTML parse prefers JSON so timeoutKilled+completed is billed not truncated", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score({
    reportedStatus: "completed",
    exitCode: 0,
    timeoutKilled: true,
    outputTruncated: true,
  });
  assert.equal(probe.verdict, "billed");
  assert.equal(probe.yanked, false);
});

test("40 README and music-hall cite #90616 #87055 #88754 and nearby issues", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90616/);
  assert.match(readme, /87055/);
  assert.match(readme, /88754/);
  assert.match(readme, /84625/);
  assert.match(readme, /90490/);
  assert.match(readme, /19309/);
  assert.doesNotMatch(readme, /idle word is gaff |idle word is crook|idle word is caught/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /completed \(exit code 0\)|<status>completed<\/status>/);
  assert.match(html, /87055/);
  assert.match(html, /88754/);
  assert.match(html, /84625/);
  assert.match(html, /90490/);
  assert.match(html, /19309/);
  assert.match(html, new RegExp(String(SIGKILL_ISSUE)));
  assert.match(html, new RegExp(String(TURN_KILL_ISSUE)));
  assert.match(html, new RegExp(String(SILENT_KILL_ISSUE)));
  assert.match(html, new RegExp(String(RC_KILL_ISSUE)));
  assert.match(html, new RegExp(String(CODEX_FALSE_OK_ISSUE)));
  assert.match(html, /bqe403itt|Run pipeline/);
  assert.ok(DEMO_NOTIFICATION_90616.includes("completed (exit code 0)"));
  assert.match(DEMO_REPRO, /echo "DONE"/);
});
