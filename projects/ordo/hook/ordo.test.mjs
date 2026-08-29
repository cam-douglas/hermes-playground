import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubOrdoLedger,
  linearMissalTicket,
  slackOrdoAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneOffice,
  decide,
  decideSeed,
  emptyAction,
  emptyOffice,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  hollowOf,
  isIdle,
  isUnknownResult,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90515,
  seedAppointed,
  seedBuiltin,
  seedCacheOk,
  seedControl,
  seedHollow,
  seedLoud,
  seedMissing,
  seedOfficial,
  seedResolved,
  seedSilent,
  seedStale,
  seedUnknown,
  silentOf,
  verdictOf,
} from "./ordo.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverOrdo(result) {
  assert.equal(result.idleWord, "appointed");
  assert.equal(IDLE_WORD, "appointed");
  assert.doesNotMatch(result.idleWord, /ordo/i);
  assert.doesNotMatch(IDLE_WORD, /^ordo$/i);
  assert.doesNotMatch(result.idleWord, /missal|office|rubric|kalendar/i);
  assert.doesNotMatch(
    result.idleWord,
    /cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.appointed, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90515 silent is silent, slack, linear, idleWord appointed", () => {
  const seed = seedSilent();
  const result = decide(seed);
  assert.equal(result.verdict, "silent");
  assert.equal(result.state, "silent");
  assert.equal(result.decision, "silent");
  assert.equal(classify(seed.office), "silent");
  assert.equal(verdictOf(seed.office), "silent");
  assert.notEqual(result.verdict, "appointed");
  assert.notEqual(result.verdict, "hollow");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.missalSilent, true);
  assert.equal(result.silent, true);
  assert.equal(result.appointed, false);
  assertIdleNeverOrdo(result);
  assert.equal(result.session, "90515-silent");
  assert.equal(result.issue, 90515);
  assert.equal(result.command, "/ppp:analyze-incident");
  assert.match(result.result, /Unknown command/);
  assert.equal(result.numTurns, 0);
  assert.equal(result.isError, false);
  assert.equal(result.exitCode, 0);
  assert.equal(result.silentTrio, true);
  assert.equal(result.filesHealthy, true);
  assert.match(result.feed, /is_error false|primary #90515/i);
  assert.equal(decideSeed("silent").verdict, "silent");
  assert.equal(decideSeed("90515-silent").verdict, "silent");
  assert.equal(decideSeed(90515).verdict, "silent");
});

test("2 idle/empty/{} is appointed, never the product name, never missal", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "appointed");
  assert.equal(result.verdict, "appointed");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.appointed, true);
  assert.equal(classify({}), "appointed");
  assert.equal(classify(emptyOffice()), "appointed");
  assert.equal(isIdle(emptyOffice()), true);
  assertIdleNeverOrdo(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "appointed");
  assert.equal(bailed.idleWord, "appointed");
  const empty = decide({});
  assert.equal(empty.verdict, "appointed");
});

test("3 control same plugin command stays appointed", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "appointed");
  assert.equal(result.alarm, false);
  assert.equal(result.command, "/ppp:analyze-incident");
  assert.ok(result.numTurns > 0);
  assert.equal(isUnknownResult(result.result), false);
  assert.match(result.feed, /Appointed/);
  assert.equal(decideSeed("control").verdict, "appointed");
  assert.equal(decideSeed("healthy").verdict, "appointed");
});

test("4 hollow: num_turns 0 and error string stored as the result", () => {
  const result = decide(seedHollow());
  assert.equal(result.verdict, "hollow");
  assert.equal(result.hollow, true);
  assert.equal(result.silent, false);
  assert.equal(result.storedAsResult, true);
  assert.equal(result.numTurns, 0);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /stored as the analysis result|Hollow/);
  assert.equal(decideSeed("hollow").verdict, "hollow");
});

test("5 unknown: Unknown command without the silent-success envelope", () => {
  const result = decide(seedUnknown());
  assert.equal(result.verdict, "unknown");
  assert.equal(result.unknown, true);
  assert.equal(result.silentTrio, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /did not resolve|Unknown/);
  assert.equal(decideSeed("unknown").verdict, "unknown");
  assert.equal(decideSeed(64669).verdict, "unknown");
});

test("6 loud: unknown AND is_error true", () => {
  const result = decide(seedLoud());
  assert.equal(result.verdict, "loud");
  assert.equal(result.isError, true);
  assert.equal(result.exitCode, 1);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /honest fail|Loud/);
  assert.equal(decideSeed("loud").verdict, "loud");
});

test("7 missing: plugin not actually enabled or cached", () => {
  const result = decide(seedMissing());
  assert.equal(result.verdict, "missing");
  assert.equal(result.pluginAbsent, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /not actually enabled|Missing/);
  assert.equal(decideSeed("missing").verdict, "missing");
});

test("8 stale: cache exists, headless resolver does not see it", () => {
  const result = decide(seedStale());
  assert.equal(result.verdict, "stale");
  assert.equal(result.resolved, false);
  assert.ok(result.office.cached || result.office.commandFile);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /resolver does not see|Stale/);
  assert.equal(decideSeed("stale").verdict, "stale");
  assert.equal(decideSeed(37862).verdict, "stale");
});

test("9 builtin: /context still works, proving -p is alive", () => {
  const result = decide(seedBuiltin());
  assert.equal(result.verdict, "builtin");
  assert.equal(result.isBuiltin, true);
  assert.equal(result.command, "/context");
  assert.ok(result.numTurns > 0);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /-p is alive|Builtin/);
  assert.equal(decideSeed("builtin").verdict, "builtin");
});

test("10 cache-ok: files on disk look healthy", () => {
  const result = decide(seedCacheOk());
  assert.equal(result.verdict, "cache-ok");
  assert.equal(result.filesHealthy, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /look healthy|Cache-ok/);
  assert.equal(decideSeed("cache-ok").verdict, "cache-ok");
});

test("11 resolved: parser has the office", () => {
  const result = decide(seedResolved());
  assert.equal(result.verdict, "resolved");
  assert.equal(result.resolved, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /parser has the office|Resolved/);
  assert.equal(decideSeed("resolved").verdict, "resolved");
});

test("12 score() idle office is appointed and never alarms", () => {
  const result = score(emptyOffice());
  assertScoreShape(result);
  assert.equal(result.verdict, "appointed");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.appointed, true);
  assert.equal(result.silent, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "appointed",
    "unknown",
    "silent",
    "hollow",
    "builtin",
    "missing",
    "loud",
    "stale",
    "resolved",
    "cache-ok",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["silent", "hollow", "unknown"]);
  assert.deepEqual(LINEAR_VERDICTS, ["silent"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "appointed");
  assert.doesNotMatch(IDLE_WORD, /ordo$|missal|cinched|gauged|stamped|overrun/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["appointed", seedAppointed],
    ["silent", seedSilent],
    ["hollow", seedHollow],
    ["unknown", seedUnknown],
    ["loud", seedLoud],
    ["missing", seedMissing],
    ["stale", seedStale],
    ["builtin", seedBuiltin],
    ["resolved", seedResolved],
    ["cache-ok", seedCacheOk],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().office), word, word);
    assert.equal(score(seed().office).verdict, word, word);
  }
});

test("15 admit does not lie: silent stays silent", () => {
  const result = decide({ ...seedSilent(), action: "admit" });
  assert.equal(result.verdict, "silent");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /appointed/);
});

test("16 bail / appointed / reset returns idle appointed", () => {
  const bailed = decide({ ...seedSilent(), action: "bail" });
  assert.equal(bailed.verdict, "appointed");
  assert.equal(isIdle(bailed.office), true);
  assertIdleNeverOrdo(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "appointed");
  assert.equal(decide({ action: "appointed" }).verdict, "appointed");
});

test("17 restore / silent produces the #90515 silent-unknown", () => {
  const result = decide({ action: "restore", office: emptyOffice() });
  assert.equal(result.verdict, "silent");
  assert.equal(result.action, "restore");
  assert.equal(result.command, "/ppp:analyze-incident");
  assert.equal(result.silentTrio, true);
  assert.equal(decide({ action: "silent" }).verdict, "silent");
});

test("18 official marketplace plugin is the same silent class", () => {
  const result = decide(seedOfficial());
  assert.equal(result.verdict, "silent");
  assert.equal(result.command, "/pr-review-toolkit:review-pr");
  assert.match(result.result, /Unknown command: \/pr-review-toolkit:review-pr/);
  assert.equal(result.exitCode, 0);
  assert.equal(result.isError, false);
});

test("19 healthy plugin claim does not make silent appointed", () => {
  const office = {
    command: "/ppp:analyze-incident",
    result: "Unknown command: /ppp:analyze-incident",
    numTurns: 0,
    isError: false,
    exitCode: 0,
    enabled: true,
    installed: true,
    cached: true,
    commandFile: "commands/analyze-incident.md",
    scored: true,
  };
  assert.equal(classify(office), "silent");
  assert.equal(score(office).appointed, false);
  assert.equal(score(office).filesHealthy, true);
  assert.equal(silentOf(office), true);
});

test("20 flagsOf matches slack / github; linear follows silent", () => {
  assert.deepEqual(flagsOf("silent"), {
    slack: true,
    linear: true,
    github: true,
    alarm: true,
  });
  assert.deepEqual(flagsOf("hollow"), {
    slack: true,
    linear: false,
    github: true,
    alarm: true,
  });
  assert.deepEqual(flagsOf("unknown"), {
    slack: true,
    linear: false,
    github: true,
    alarm: true,
  });
  assert.deepEqual(flagsOf("appointed"), {
    slack: false,
    linear: false,
    github: true,
    alarm: false,
  });
  assert.deepEqual(flagsOf("loud"), {
    slack: false,
    linear: false,
    github: true,
    alarm: false,
  });
});

test("21 helpers and reasons", () => {
  assert.equal(silentOf(seedSilent().office), true);
  assert.equal(silentOf(emptyOffice()), false);
  assert.equal(hollowOf(seedHollow().office), true);
  const reasons = reasonsOf(seedSilent().office, "silent");
  assert.ok(reasons.some((row) => /#90515/.test(row)));
});

test("22 forbidden idle list includes ordo, missal, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("ordo"));
  assert.ok(words.includes("missal"));
  assert.ok(words.includes("cinched"));
  assert.ok(words.includes("gauged"));
  assert.ok(words.includes("stamped"));
  assert.ok(words.includes("larder"));
  assert.ok(words.includes("cinch"));
  assert.ok(!words.includes("appointed"));
});

test("23 demo sinks: Slack on alarm; Linear on silent; GitHub always", async () => {
  const silent = decide(seedSilent());
  const slack = slackOrdoAlarm(silent, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubOrdoLedger(silent, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub ordo-ledger/);
  const linear = linearMissalTicket(silent, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearMissalTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackOrdoAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(silent, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("24 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const silent = decide(seedSilent());
  const slack = slackOrdoAlarm(silent, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubOrdoLedger(silent, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearMissalTicket(silent, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("25 handle alarm classes deny; appointed / loud / missing / stale / builtin / cache-ok / resolved / control allow", async () => {
  const silent = await handle(seedSilent(), {});
  assert.equal(silent.permissionDecision, "deny");
  assert.match(silent.hookSpecificOutput.decision.message, /silent/);
  const hollow = await handle(seedHollow(), {});
  assert.equal(hollow.permissionDecision, "deny");
  const unknown = await handle(seedUnknown(), {});
  assert.equal(unknown.permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /appointed/);
  assert.equal((await handle(seedLoud(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedMissing(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedStale(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedBuiltin(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedCacheOk(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedResolved(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
});

test("26 listen GET health and POST empty body is appointed", async () => {
  const server = listen(19516);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19516/health");
  const info = await health.json();
  assert.equal(info.product, "ordo");
  assert.match(info.verbs, /silent/);
  const res = await fetch("http://127.0.0.1:19516/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "appointed");
  assert.equal(body.idleWord, "appointed");
  const scored = await fetch("http://127.0.0.1:19516/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedSilent()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "silent");
  await new Promise((resolve) => server.close(resolve));
});

test("27 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19517);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19517/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("28 parseSessionTrace reads #90515 silent-unknown JSON", () => {
  const office = parseSessionTrace(
    '{"result":"Unknown command: /ppp:analyze-incident","num_turns":0,"is_error":false,"exitCode":0}',
  );
  assert.equal(classify(office), "silent");
  assert.equal(office.numTurns, 0);
  assert.equal(office.isError, false);
});

test("29 parseSessionTrace reads a stored-result as hollow", () => {
  const office = parseSessionTrace(
    "the service recorded the step as successful and stored the error string as the analysis result",
  );
  assert.equal(classify(office), "hollow");
});

test("30 nested missal / probe / office fields clone", () => {
  const office = cloneOffice({
    missal: seedSilent().office,
  });
  assert.equal(classify(office), "silent");
});

test("31 fire live slack posts when fetch ok", async () => {
  const silent = decide(seedSilent());
  const events = await fire(silent, { ORDO_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted silent/);
});

test("32 desk HTML sanity: idle word appointed, seeded silent, not cinch/ullage/visa/sprag", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /appointed/);
  assert.match(html, /Score/);
  assert.match(html, /silent/);
  assert.match(html, /90515/);
  assert.match(html, /seedOf\("silent"\)|office = seedOf\("silent"\)|missal = seedOf\("silent"\)/);
  assert.match(html, /const IDLE_WORD = "appointed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "ordo"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "cinched"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "gauged"/);
  assert.match(html, /parchment-leaf|rubric-rule|kalendar-hours|appointed-office|red-letter|missal-gutter/i);
  assert.match(html, /16:50 Sydney · ordo/);
  assert.match(html, /written plugin command is not a hold/i);
  assert.doesNotMatch(html, /class="leather-cinch"|class="brass-buckle"|class="strap-holes"|class="oil-lamp"|class="bridle-hooks"/);
  assert.doesNotMatch(html, /class="passport-folio"|class="brass-stamp"|class="teal-stripe"|class="ink-pad"/);
  assert.doesNotMatch(html, /class="clutch-cut"|class="inner-race"|class="sprag-wedge"/);
  assert.doesNotMatch(html, /class="oak-case"|class="fusee-drum"|class="enamel-face"/);
  assert.doesNotMatch(html, /class="oak-cask"|class="iron-hoop"|class="bung-seal"|class="gauging-rod"/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Libre Baskerville|Source Sans 3/);
  assert.doesNotMatch(html, /Teko|Atkinson Hyperlegible|Bodoni Moda/);
  assert.doesNotMatch(html, /Spectral|Nunito Sans/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Ordo/);
  assert.match(html, /Cormorant Garamond|Crimson Pro/);
  assert.match(html, /reset-to-appointed|Reset · appointed|reset to appointed/i);
  assert.match(html, /restore-to-silent|Restore · silent|restore to silent/i);
});

test("33 HTML why-not names Larder, Tappet, Reed, Assay, Cinch, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Larder/);
  assert.match(html, /NOT Tappet/);
  assert.match(html, /NOT Reed/);
  assert.match(html, /NOT Assay/);
  assert.match(html, /NOT Cinch/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Ordo is a larder/i);
  assert.doesNotMatch(html, /Ordo is a cinch/i);
});

test("34 README names contrasts and appointed idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Larder/);
  assert.match(readme, /NOT Tappet/);
  assert.match(readme, /NOT Reed/);
  assert.match(readme, /NOT Assay/);
  assert.match(readme, /NOT Cinch/);
  assert.match(readme, /\*\*appointed\*\*/);
  assert.match(readme, /#90515/);
  assert.doesNotMatch(readme, /idle word is ordo/i);
  assert.doesNotMatch(readme, /idle word is cinched/i);
});

test("35 #90515 miniature has unknown + is_error false + exit 0 + healthy cache", () => {
  const facts = analyze(seedSilent().office);
  assert.equal(facts.unknown, true);
  assert.equal(facts.isErrorFalse, true);
  assert.equal(facts.exit0, true);
  assert.equal(facts.numTurns, 0);
  assert.equal(facts.filesHealthy, true);
  assert.equal(classify(seed90515().office), "silent");
});

test("36 Slack skip on appointed / loud / missing / stale / builtin / cache-ok / resolved / control", () => {
  for (const seed of [seedAppointed, seedControl, seedLoud, seedMissing, seedStale, seedBuiltin, seedCacheOk, seedResolved]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackOrdoAlarm(result, {}).summary, /Would skip Slack/);
  }
});
