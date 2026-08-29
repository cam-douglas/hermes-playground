import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubCinchLedger,
  linearPackTicket,
  slackCinchAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  clonePack,
  decide,
  decideSeed,
  emptyAction,
  emptyPack,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  hasReachableLeaf,
  isIdle,
  omittedOf,
  parseSessionTrace,
  reasonsOf,
  rootPresent,
  score,
  seedCinched,
  seedControl,
  seedDelivered,
  seedDropped,
  seedHalted,
  seedLoose,
  seedOmitted,
  seedPartial,
  seedPhantom,
  seedSlipped,
  seedTrusted,
  seed90506,
  verdictOf,
} from "./cinch.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverCinch(result) {
  assert.equal(result.idleWord, "cinched");
  assert.equal(IDLE_WORD, "cinched");
  assert.doesNotMatch(result.idleWord, /cinch$/i);
  assert.doesNotMatch(IDLE_WORD, /^cinch$/i);
  assert.doesNotMatch(result.idleWord, /mount|folder|slip|pack|girth/i);
  assert.doesNotMatch(
    result.idleWord,
    /gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.missing));
  assert.ok(Array.isArray(result.extra));
  assert.equal(typeof result.cinched, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90506 omitted is omitted, slack, linear, idleWord cinched", () => {
  const seed = seedOmitted();
  const result = decide(seed);
  assert.equal(result.verdict, "omitted");
  assert.equal(result.state, "omitted");
  assert.equal(result.decision, "omitted");
  assert.equal(classify(seed.pack), "omitted");
  assert.equal(verdictOf(seed.pack), "omitted");
  assert.notEqual(result.verdict, "cinched");
  assert.notEqual(result.verdict, "delivered");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.tackOmitted, true);
  assert.equal(result.omitted, true);
  assert.equal(result.cinched, false);
  assertIdleNeverCinch(result);
  assert.equal(result.session, "90506-omitted");
  assert.equal(result.issue, 90506);
  assert.ok(result.missing.includes("engines"));
  assert.ok(result.missing.includes("Outputs"));
  assert.equal(result.leafProceed, true);
  assert.equal(result.shipped, true);
  assert.equal(result.hasSurvivingLeaf, true);
  assert.match(result.feed, /leaf treated as proceed|primary #90506/i);
  assert.equal(decideSeed("omitted").verdict, "omitted");
  assert.equal(decideSeed("90506-omitted").verdict, "omitted");
});

test("2 idle/empty/{} is cinched, never the product name, never mount", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "cinched");
  assert.equal(result.verdict, "cinched");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.cinched, true);
  assert.equal(classify({}), "cinched");
  assert.equal(classify(emptyPack()), "cinched");
  assert.equal(isIdle(emptyPack()), true);
  assertIdleNeverCinch(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "cinched");
  assert.equal(bailed.idleWord, "cinched");
  const empty = decide({});
  assert.equal(empty.verdict, "cinched");
});

test("3 control interactive session stays cinched", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "cinched");
  assert.equal(result.alarm, false);
  assert.equal(result.missing.length, 0);
  assert.equal(result.leafProceed, false);
  assert.match(result.feed, /Cinched/);
  assert.equal(decideSeed("control").verdict, "cinched");
  assert.equal(decideSeed("healthy").verdict, "cinched");
});

test("4 delivered: incomplete pack presented as complete, not omitted", () => {
  const result = decide(seedDelivered());
  assert.equal(result.verdict, "delivered");
  assert.equal(result.delivered, true);
  assert.equal(result.omitted, false);
  assert.equal(result.shipped, true);
  assert.equal(result.leafProceed, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /presented as complete|Delivered/);
  assert.equal(decideSeed("delivered").verdict, "delivered");
});

test("5 dropped: two or more expected folders missing", () => {
  const result = decide(seedDropped());
  assert.equal(result.verdict, "dropped");
  assert.ok(result.missing.length >= 2);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /two or more|Dropped/);
  assert.equal(decideSeed("dropped").verdict, "dropped");
});

test("6 slipped: one trusted folder missing this run", () => {
  const result = decide(seedSlipped());
  assert.equal(result.verdict, "slipped");
  assert.equal(result.missing.length, 1);
  assert.ok(result.trustedMiss.includes("brief"));
  assert.equal(result.alarm, true);
  assert.match(result.feed, /one trusted folder|Slipped/);
  assert.equal(decideSeed("slipped").verdict, "slipped");
});

test("7 phantom: listed/trusted/connected but unreachable", () => {
  const result = decide(seedPhantom());
  assert.equal(result.verdict, "phantom");
  assert.ok(result.unreachable.includes("Outputs"));
  assert.equal(result.alarm, true);
  assert.match(result.feed, /unreachable|Phantom/);
  assert.equal(decideSeed("phantom").verdict, "phantom");
  assert.equal(decideSeed(89813).verdict, "phantom");
});

test("8 trusted: Always-allow did not prevent the drop", () => {
  const result = decide(seedTrusted());
  assert.equal(result.verdict, "trusted");
  assert.ok(result.trustedMiss.length >= 2);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Trusted Cowork|Always-allow/);
  assert.equal(decideSeed("trusted").verdict, "trusted");
});

test("9 loose: UI/ledger green while the pack has shifted", () => {
  const result = decide(seedLoose());
  assert.equal(result.verdict, "loose");
  assert.equal(result.uiGreen, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /reads tight|Loose/);
  assert.equal(decideSeed("loose").verdict, "loose");
});

test("10 partial: subset of the expected mount set is present", () => {
  const result = decide(seedPartial());
  assert.equal(result.verdict, "partial");
  assert.equal(result.missing.length, 1);
  assert.ok(result.pack.mounted.includes("engines"));
  assert.equal(result.alarm, false);
  assert.match(result.feed, /subset|Partial/);
  assert.equal(decideSeed("partial").verdict, "partial");
});

test("11 halted: guard treated a missing root as a hard stop", () => {
  const result = decide(seedHalted());
  assert.equal(result.verdict, "halted");
  assert.equal(result.halted, true);
  assert.equal(result.shipped, false);
  assert.equal(result.leafProceed, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /hard stop|Halted|honest path/);
  assert.equal(decideSeed("halted").verdict, "halted");
});

test("12 score() idle pack is cinched and never alarms", () => {
  const result = score(emptyPack());
  assertScoreShape(result);
  assert.equal(result.verdict, "cinched");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.cinched, true);
  assert.equal(result.omitted, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "cinched",
    "slipped",
    "dropped",
    "phantom",
    "omitted",
    "partial",
    "trusted",
    "loose",
    "delivered",
    "halted",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["slipped", "dropped", "omitted", "delivered", "phantom", "loose"]);
  assert.deepEqual(LINEAR_VERDICTS, ["omitted", "delivered"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "cinched");
  assert.doesNotMatch(IDLE_WORD, /cinch$|mount|gauged|stamped|overrun/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["cinched", seedCinched],
    ["omitted", seedOmitted],
    ["delivered", seedDelivered],
    ["dropped", seedDropped],
    ["slipped", seedSlipped],
    ["phantom", seedPhantom],
    ["trusted", seedTrusted],
    ["loose", seedLoose],
    ["partial", seedPartial],
    ["halted", seedHalted],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().pack), word, word);
    assert.equal(score(seed().pack).verdict, word, word);
  }
});

test("15 admit does not lie: omitted stays omitted", () => {
  const result = decide({ ...seedOmitted(), action: "admit" });
  assert.equal(result.verdict, "omitted");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /cinched/);
});

test("16 bail / cinched / reset returns idle cinched", () => {
  const bailed = decide({ ...seedOmitted(), action: "bail" });
  assert.equal(bailed.verdict, "cinched");
  assert.equal(isIdle(bailed.pack), true);
  assertIdleNeverCinch(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "cinched");
  assert.equal(decide({ action: "cinched" }).verdict, "cinched");
});

test("17 restore / omitted produces the #90506 incident 3 omit", () => {
  const result = decide({ action: "restore", pack: emptyPack() });
  assert.equal(result.verdict, "omitted");
  assert.equal(result.action, "restore");
  assert.ok(result.missing.includes("engines"));
  assert.ok(result.missing.includes("Outputs"));
  assert.equal(decide({ action: "omitted" }).verdict, "omitted");
});

test("18 leaf under Outputs does not count as the Outputs root", () => {
  assert.equal(rootPresent("Outputs", ["Outputs/leaf"]), false);
  assert.equal(hasReachableLeaf("Outputs", ["Outputs/leaf"]), true);
  assert.equal(rootPresent("Outputs", ["Outputs"]), true);
  const facts = analyze(seedOmitted().pack);
  assert.ok(facts.missing.includes("Outputs"));
  assert.ok(facts.missing.includes("engines"));
  assert.equal(facts.hasSurvivingLeaf, true);
  assert.equal(classify(seedOmitted().pack), "omitted");
  assert.notEqual(classify(seedOmitted().pack), "cinched");
});

test("19 leaf-proceed + missing root is omitted, not cinched, even when a path exists", () => {
  const pack = {
    expected: ["engines", "Outputs"],
    mounted: ["Outputs/leaf"],
    trusted: ["engines", "Outputs"],
    listed: ["engines", "Outputs"],
    leafProceed: true,
    shipped: true,
    scored: true,
  };
  assert.equal(classify(pack), "omitted");
  assert.equal(score(pack).cinched, false);
  assert.ok(score(pack).missing.includes("engines"));
  assert.ok(score(pack).missing.includes("Outputs"));
});

test("20 flagsOf matches slack / github; linear follows omitted / delivered", () => {
  assert.deepEqual(flagsOf("omitted"), {
    slack: true,
    linear: true,
    github: true,
    alarm: true,
  });
  assert.deepEqual(flagsOf("delivered"), {
    slack: true,
    linear: true,
    github: true,
    alarm: true,
  });
  assert.deepEqual(flagsOf("dropped"), {
    slack: true,
    linear: false,
    github: true,
    alarm: true,
  });
  assert.deepEqual(flagsOf("cinched"), {
    slack: false,
    linear: false,
    github: true,
    alarm: false,
  });
  assert.deepEqual(flagsOf("halted"), {
    slack: false,
    linear: false,
    github: true,
    alarm: false,
  });
});

test("21 helpers and reasons", () => {
  assert.equal(omittedOf(seedOmitted().pack), true);
  assert.equal(omittedOf(emptyPack()), false);
  const reasons = reasonsOf(seedOmitted().pack, "omitted");
  assert.ok(reasons.some((row) => /#90506 incident 3/.test(row)));
});

test("22 forbidden idle list includes cinch, mount, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("cinch"));
  assert.ok(words.includes("mount"));
  assert.ok(words.includes("folder"));
  assert.ok(words.includes("gauged"));
  assert.ok(words.includes("stamped"));
  assert.ok(words.includes("ullage"));
  assert.ok(words.includes("fusee"));
  assert.ok(words.includes("wicket"));
  assert.ok(!words.includes("cinched"));
});

test("23 demo sinks: Slack on alarm; Linear on omitted/delivered; GitHub always", async () => {
  const omitted = decide(seedOmitted());
  const slack = slackCinchAlarm(omitted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubCinchLedger(omitted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub cinch-ledger/);
  const linear = linearPackTicket(omitted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearPackTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackCinchAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(omitted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("24 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const omitted = decide(seedOmitted());
  const slack = slackCinchAlarm(omitted, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubCinchLedger(omitted, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearPackTicket(omitted, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("25 handle alarm classes deny; cinched / halted / trusted / partial allow", async () => {
  const omitted = await handle(seedOmitted(), {});
  assert.equal(omitted.permissionDecision, "deny");
  assert.match(omitted.hookSpecificOutput.decision.message, /omitted/);
  const delivered = await handle(seedDelivered(), {});
  assert.equal(delivered.permissionDecision, "deny");
  const dropped = await handle(seedDropped(), {});
  assert.equal(dropped.permissionDecision, "deny");
  const slipped = await handle(seedSlipped(), {});
  assert.equal(slipped.permissionDecision, "deny");
  const phantom = await handle(seedPhantom(), {});
  assert.equal(phantom.permissionDecision, "deny");
  const loose = await handle(seedLoose(), {});
  assert.equal(loose.permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /cinched/);
  assert.equal((await handle(seedHalted(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedTrusted(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedPartial(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
});

test("26 listen GET health and POST empty body is cinched", async () => {
  const server = listen(19414);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19414/health");
  const info = await health.json();
  assert.equal(info.product, "cinch");
  assert.match(info.verbs, /omitted/);
  const res = await fetch("http://127.0.0.1:19414/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "cinched");
  assert.equal(body.idleWord, "cinched");
  const scored = await fetch("http://127.0.0.1:19414/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedOmitted()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "omitted");
  await new Promise((resolve) => server.close(resolve));
});

test("27 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19415);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19415/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("28 parseSessionTrace reads #90506 incident 3 prose", () => {
  const pack = parseSessionTrace(
    "Incident 3: engines + Outputs root missing, one leaf treated as proceed. VP report shipped with two sections silently omitted. #90506",
  );
  assert.equal(classify(pack), "omitted");
  assert.equal(pack.issue, 90506);
});

test("29 parseSessionTrace reads a hard stop as halted", () => {
  const pack = parseSessionTrace("guard treated a missing root as a hard stop — the honest path");
  assert.equal(classify(pack), "halted");
});

test("30 nested girth / probe / trace fields clone", () => {
  const pack = clonePack({
    girth: seedOmitted().pack,
  });
  assert.equal(classify(pack), "omitted");
});

test("31 fire live slack posts when fetch ok", async () => {
  const omitted = decide(seedOmitted());
  const events = await fire(omitted, { CINCH_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted omitted/);
});

test("32 desk HTML sanity: idle word cinched, seeded omitted, not ullage/visa/sprag/fusee", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /cinched/);
  assert.match(html, /Score/);
  assert.match(html, /omitted/);
  assert.match(html, /90506/);
  assert.match(html, /seedOf\("omitted"\)|probe = seedOf\("omitted"\)|pack = seedOf\("omitted"\)/);
  assert.match(html, /const IDLE_WORD = "cinched"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "cinch"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "gauged"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stamped"/);
  assert.match(html, /leather-cinch|brass-buckle|strap-holes|oil-lamp|bridle-hooks|pack-saddle/i);
  assert.match(html, /15:50 Sydney · cinch/);
  assert.match(html, /trusted-folders list is not a hold|Trusted-folders list is not a hold/i);
  assert.doesNotMatch(html, /class="passport-folio"|class="brass-stamp"|class="teal-stripe"|class="ink-pad"/);
  assert.doesNotMatch(html, /class="clutch-cut"|class="inner-race"|class="sprag-wedge"/);
  assert.doesNotMatch(html, /class="oak-case"|class="fusee-drum"|class="enamel-face"/);
  assert.doesNotMatch(html, /class="oak-cask"|class="iron-hoop"|class="bung-seal"|class="gauging-rod"/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Libre Baskerville|Source Sans 3/);
  assert.doesNotMatch(html, /Teko|Atkinson Hyperlegible|Bodoni Moda/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Cinch/);
  assert.match(html, /Spectral|Nunito Sans/);
  assert.match(html, /reset-to-cinched|Reset · cinched|reset to cinched/i);
  assert.match(html, /restore-to-omitted|Restore · omitted|restore to omitted/i);
});

test("33 HTML why-not names Fusee, Wicket, Larder, Hasp, Sprag, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Fusee/);
  assert.match(html, /NOT Wicket/);
  assert.match(html, /NOT Larder/);
  assert.match(html, /NOT Hasp/);
  assert.match(html, /NOT Sprag/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Cinch is a fusee/i);
  assert.doesNotMatch(html, /Cinch is a cellar/i);
});

test("34 README names contrasts and cinched idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Fusee/);
  assert.match(readme, /NOT Wicket/);
  assert.match(readme, /NOT Larder/);
  assert.match(readme, /NOT Hasp/);
  assert.match(readme, /NOT Sprag/);
  assert.match(readme, /\*\*cinched\*\*/);
  assert.match(readme, /#90506/);
  assert.doesNotMatch(readme, /idle word is cinch/i);
  assert.doesNotMatch(readme, /idle word is gauged/i);
});

test("35 #90506 miniature has engines + Outputs missing, leaf present, leafProceed", () => {
  const facts = analyze(seedOmitted().pack);
  assert.ok(facts.missing.includes("engines"));
  assert.ok(facts.missing.includes("Outputs"));
  assert.equal(facts.hasSurvivingLeaf, true);
  assert.equal(facts.leafProceed, true);
  assert.equal(facts.shipped, true);
  assert.equal(classify(seed90506().pack), "omitted");
});

test("36 Slack skip on cinched / halted / trusted / partial / control", () => {
  for (const seed of [seedCinched, seedControl, seedHalted, seedTrusted, seedPartial]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackCinchAlarm(result, {}).summary, /Would skip Slack/);
  }
});
