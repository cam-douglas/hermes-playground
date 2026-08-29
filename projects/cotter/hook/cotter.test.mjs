import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubCotterLedger,
  linearPinTicket,
  slackCotterAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  ISO_FIRE_AT,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneTray,
  decide,
  decideSeed,
  emptyAction,
  emptyTray,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  fireAtKind,
  isIdle,
  loadScheduledTasksFromDisk,
  poisonOf,
  reasonsOf,
  score,
  seed90533,
  seedControl,
  seedHollow,
  seedMuteMcp,
  seedPoison,
  seedSnug,
  seedVanish,
  seedWipe,
  snugOf,
  parseSessionTrace,
  verdictOf,
} from "./cotter.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverCotter(result) {
  assert.equal(result.idleWord, "snug");
  assert.equal(IDLE_WORD, "snug");
  assert.doesNotMatch(result.idleWord, /cotter/i);
  assert.doesNotMatch(IDLE_WORD, /^cotter$/i);
  assert.doesNotMatch(result.idleWord, /empty|fireAt|schedule|registry|poison/i);
  assert.doesNotMatch(
    result.idleWord,
    /hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.snug, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90533 poison is poison, slack, linear, idleWord snug", () => {
  const seed = seedPoison();
  const result = decide(seed);
  assert.equal(result.verdict, "poison");
  assert.equal(result.state, "poison");
  assert.equal(result.decision, "poison");
  assert.equal(classify(seed.tray), "poison");
  assert.equal(verdictOf(seed.tray), "poison");
  assert.notEqual(result.verdict, "snug");
  assert.notEqual(result.verdict, "wipe");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.trayPoison, true);
  assert.equal(result.poison, true);
  assert.equal(result.snug, false);
  assertIdleNeverCotter(result);
  assert.equal(result.session, "90533-poison");
  assert.equal(result.issue, 90533);
  assert.equal(result.taskCount, 35);
  assert.equal(result.stringPins, 1);
  assert.equal(result.zodRejected, true);
  assert.equal(result.poisonIndex, 33);
  assert.equal(result.darkHours, 55);
  assert.equal(result.proxiesGreen, true);
  assert.equal(result.dispatcherDark, true);
  assert.match(result.feed, /Poison|primary #90533/i);
  assert.equal(decideSeed("poison").verdict, "poison");
  assert.equal(decideSeed("90533-poison").verdict, "poison");
  assert.equal(decideSeed(90533).verdict, "poison");
});

test("2 idle/empty/{} is snug, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "snug");
  assert.equal(result.verdict, "snug");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.snug, true);
  assert.equal(classify({}), "snug");
  assert.equal(classify(emptyTray()), "snug");
  assert.equal(isIdle(emptyTray()), true);
  assert.equal(score(emptyTray()).snug, true);
  assertIdleNeverCotter(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "snug");
  assert.equal(bailed.idleWord, "snug");
  const empty = decide({});
  assert.equal(empty.verdict, "snug");
  assert.match(empty.feed, /Snug/);
});

test("3 control epoch-ms pins stay snug", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "snug");
  assert.equal(result.alarm, false);
  assert.equal(result.taskCount, 6);
  assert.equal(result.zodRejected, false);
  assert.equal(result.stringPins, 0);
  assert.match(result.feed, /Snug/);
  assert.equal(decideSeed("control").verdict, "snug");
  assert.equal(decideSeed("healthy").verdict, "snug");
});

test("4 wipe: scheduledTasks empty, definitions on disk", () => {
  const result = decide(seedWipe());
  assert.equal(result.verdict, "wipe");
  assert.equal(result.trayWipe, true);
  assert.equal(result.taskCount, 0);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /Wipe|#85565/);
  assert.equal(decideSeed("wipe").verdict, "wipe");
  assert.equal(decideSeed(85565).verdict, "wipe");
});

test("5 hollow: lastFired advances, zero work", () => {
  const result = decide(seedHollow());
  assert.equal(result.verdict, "hollow");
  assert.equal(result.trayHollow, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Hollow|#89811/);
  assert.equal(decideSeed("hollow").verdict, "hollow");
  assert.equal(decideSeed(89811).verdict, "hollow");
});

test("6 vanish: recurring gone, spent one-time remain", () => {
  const result = decide(seedVanish());
  assert.equal(result.verdict, "vanish");
  assert.equal(result.trayVanish, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Vanish|#83600/);
  assert.equal(decideSeed("vanish").verdict, "vanish");
  assert.equal(decideSeed(83600).verdict, "vanish");
});

test("7 mute-mcp: scheduled-task tools absent", () => {
  const result = decide(seedMuteMcp());
  assert.equal(result.verdict, "mute-mcp");
  assert.equal(result.trayMuteMcp, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Mute-mcp|#88308/);
  assert.equal(decideSeed("mute-mcp").verdict, "mute-mcp");
  assert.equal(decideSeed(88308).verdict, "mute-mcp");
});

test("8 score() idle tray is snug and never alarms", () => {
  const result = score(emptyTray());
  assertScoreShape(result);
  assert.equal(result.verdict, "snug");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.snug, true);
  assert.equal(result.poison, false);
});

test("9 verdict vocabulary is exactly the six words", () => {
  assert.deepEqual(VERDICTS, ["snug", "poison", "wipe", "hollow", "vanish", "mute-mcp"]);
  assert.deepEqual(SLACK_VERDICTS, ["poison", "wipe", "hollow", "vanish", "mute-mcp"]);
  assert.deepEqual(LINEAR_VERDICTS, ["poison", "wipe"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "snug");
  assert.doesNotMatch(IDLE_WORD, /cotter$|hung|appointed|cinched|gauged|stamped|overrun|wound/);
});

test("10 every seeded class classifies to itself", () => {
  const rows = [
    ["snug", seedSnug],
    ["poison", seedPoison],
    ["wipe", seedWipe],
    ["hollow", seedHollow],
    ["vanish", seedVanish],
    ["mute-mcp", seedMuteMcp],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().tray), word, word);
    assert.equal(score(seed().tray).verdict, word, word);
  }
});

test("11 admit does not lie: poison stays poison", () => {
  const result = decide({ ...seedPoison(), action: "admit" });
  assert.equal(result.verdict, "poison");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /snug/);
});

test("12 bail / snug / reset returns idle snug", () => {
  const bailed = decide({ ...seedPoison(), action: "bail" });
  assert.equal(bailed.verdict, "snug");
  assert.equal(isIdle(bailed.tray), true);
  assertIdleNeverCotter(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "snug");
  assert.equal(decide({ action: "snug" }).verdict, "snug");
});

test("13 restore / poison produces the #90533 poison tray", () => {
  const result = decide({ action: "restore", tray: emptyTray() });
  assert.equal(result.verdict, "poison");
  assert.equal(result.action, "restore");
  assert.equal(result.taskCount, 35);
  assert.equal(decide({ action: "poison" }).verdict, "poison");
});

test("14 flagsOf matches slack / github; linear follows poison/wipe", () => {
  assert.deepEqual(flagsOf("poison"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("wipe"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("hollow"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("vanish"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("mute-mcp"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("snug"), { slack: false, linear: false, github: true, alarm: false });
});

test("15 helpers, reasons, fireAtKind, Zod reject", () => {
  assert.equal(poisonOf(seedPoison().tray), true);
  assert.equal(snugOf(emptyTray()), true);
  assert.equal(snugOf(seedPoison().tray), false);
  const reasons = reasonsOf(seedPoison().tray, "poison");
  assert.ok(reasons.some((row) => /#90533/.test(row)));
  assert.equal(fireAtKind(ISO_FIRE_AT), "iso");
  assert.equal(fireAtKind(1_724_731_200_000), "epoch");
  const load = loadScheduledTasksFromDisk(seedPoison().tray);
  assert.equal(load.ok, false);
  assert.equal(load.poisonIndex, 33);
  assert.equal(load.received, "string");
  assert.deepEqual(load.path, ["scheduledTasks", 33, "fireAt"]);
});

test("16 forbidden idle list includes cotter, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("cotter"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("hung"));
  assert.ok(words.includes("appointed"));
  assert.ok(words.includes("cinched"));
  assert.ok(words.includes("wound"));
  assert.ok(words.includes("fusee"));
  assert.ok(!words.includes("snug"));
});

test("17 demo sinks: Slack on alarm; Linear on poison; GitHub always", async () => {
  const poisoned = decide(seedPoison());
  const slack = slackCotterAlarm(poisoned, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubCotterLedger(poisoned, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub cotter-ledger/);
  const linear = linearPinTicket(poisoned, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearPinTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackCotterAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(poisoned, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("18 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const poisoned = decide(seedPoison());
  const slack = slackCotterAlarm(poisoned, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubCotterLedger(poisoned, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearPinTicket(poisoned, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("19 handle alarm classes deny; snug / control allow", async () => {
  const poisoned = await handle(seedPoison(), {});
  assert.equal(poisoned.permissionDecision, "deny");
  assert.match(poisoned.hookSpecificOutput.decision.message, /poison/);
  assert.equal((await handle(seedWipe(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedHollow(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedVanish(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedMuteMcp(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /snug/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
});

test("20 listen GET health and POST empty body is snug", async () => {
  const server = listen(19626);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19626/health");
  const info = await health.json();
  assert.equal(info.product, "cotter");
  assert.match(info.verbs, /poison/);
  const res = await fetch("http://127.0.0.1:19626/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "snug");
  assert.equal(body.idleWord, "snug");
  const scored = await fetch("http://127.0.0.1:19626/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedPoison()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "poison");
  await new Promise((resolve) => server.close(resolve));
});

test("21 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19627);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19627/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("22 parseSessionTrace reads a ZodError poison", () => {
  const tray = parseSessionTrace(
    'ZodError: scheduledTasks[33].fireAt Invalid input: expected number, received string. update_scheduled_task wrote ISO-8601.',
  );
  assert.equal(classify(tray), "poison");
});

test("23 parseSessionTrace reads wipe, hollow, vanish, mute", () => {
  assert.equal(
    classify(parseSessionTrace("Desktop update silently wiped scheduledTasks: []")),
    "wipe",
  );
  assert.equal(
    classify(parseSessionTrace("scheduled tasks report success but silently perform zero work. last_fired_at advances")),
    "hollow",
  );
  assert.equal(
    classify(parseSessionTrace("recurring task vanished twice. Scheduled task not found.")),
    "vanish",
  );
  assert.equal(
    classify(parseSessionTrace("mcp__scheduled-tasks tools missing from session context")),
    "mute-mcp",
  );
});

test("24 one ISO string in JSON rejects the whole registry", () => {
  const tray = parseSessionTrace(
    JSON.stringify({
      scheduledTasks: [
        { id: "ok", fireAt: 1724731200000 },
        { id: "bad", fireAt: "2026-08-27T07:30:00+01:00" },
      ],
    }),
  );
  const load = loadScheduledTasksFromDisk(tray);
  assert.equal(load.ok, false);
  assert.equal(classify(tray), "poison");
});

test("25 nested tray / registry / probe fields clone", () => {
  const tray = cloneTray({ registry: seedPoison().tray });
  assert.equal(classify(tray), "poison");
});

test("26 fire live slack posts when fetch ok", async () => {
  const poisoned = decide(seedPoison());
  const events = await fire(poisoned, { COTTER_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted poison/);
});

test("27 desk HTML sanity: idle word snug, seeded poison, not fob/ordo/cinch/ullage", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /snug/);
  assert.match(html, /Score/);
  assert.match(html, /poison/);
  assert.match(html, /90533/);
  assert.match(html, /seedOf\("poison"\)|tray = seedOf\("poison"\)/);
  assert.match(html, /const IDLE_WORD = "snug"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "cotter"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "hung"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "appointed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "cinched"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "wound"/);
  assert.match(html, /pin-tray|felt-bed|pin-slot|split-pin|caliper-beam|grease-gauge|pressure-gauge|dispatch-lamp|shop-ticket|axle-jig/i);
  assert.match(html, /18:50 Sydney · cotter/);
  assert.match(html, /written (fireAt|schedule) is not a hold/i);
  assert.doesNotMatch(html, /class="fob-rail"|class="brass-hook"|class="room-tag"|class="night-clerk"|class="brass-plate"/);
  assert.doesNotMatch(html, /class="parchment-leaf"|class="rubric-rule"|class="kalendar-hours"|class="missal-gutter"/);
  assert.doesNotMatch(html, /class="leather-cinch"|class="brass-buckle"|class="strap-holes"|class="oil-lamp"|class="bridle-hooks"/);
  assert.doesNotMatch(html, /class="passport-folio"|class="brass-stamp"|class="teal-stripe"|class="ink-pad"/);
  assert.doesNotMatch(html, /class="oak-cask"|class="iron-hoop"|class="bung-seal"|class="gauging-rod"/);
  assert.doesNotMatch(html, /Italiana|IBM Plex Mono|Newsreader/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Libre Baskerville|Source Sans 3/);
  assert.doesNotMatch(html, /Spectral|Nunito Sans/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Cotter/);
  assert.match(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.match(html, /Reset · snug|reset to snug/i);
  assert.match(html, /Restore · poison|restore to poison/i);
});

test("28 HTML why-not names Fusee, Cinch, Reveille, Fob, Ordo, Ullage, Visa", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Fusee/);
  assert.match(html, /NOT Cinch/);
  assert.match(html, /NOT Reveille/);
  assert.match(html, /NOT Fob/);
  assert.match(html, /NOT Ordo/);
  assert.match(html, /NOT Ullage/);
  assert.match(html, /NOT Visa/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("29 README names contrasts and snug idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Fusee/);
  assert.match(readme, /NOT Cinch/);
  assert.match(readme, /NOT Fob/);
  assert.match(readme, /NOT Ordo/);
  assert.match(readme, /NOT Ullage/);
  assert.match(readme, /\*\*snug\*\*/);
  assert.match(readme, /#90533/);
  assert.doesNotMatch(readme, /idle word is cotter/i);
  assert.doesNotMatch(readme, /idle word is hung/i);
});

test("30 #90533 miniature one ISO string rejects the tray", () => {
  const facts = analyze(seedPoison().tray);
  assert.equal(facts.zodRejected, true);
  assert.equal(facts.stringPins, 1);
  assert.equal(facts.poisonIndex, 33);
  assert.equal(classify(seed90533().tray), "poison");
});

test("31 Slack skip on snug / control", () => {
  for (const seed of [seedSnug, seedControl]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackCotterAlarm(result, {}).summary, /Would skip Slack/);
  }
});
