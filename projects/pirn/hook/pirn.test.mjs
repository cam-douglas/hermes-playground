import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubPirnLedger,
  linearPirnTicket,
  slackPirnAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CAP_CHARS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  beamedOf,
  classify,
  clonePirn,
  croppedOf,
  decide,
  decideSeed,
  emptyAction,
  emptyPirn,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  reasonsOf,
  score,
  seed90544,
  seedBeamed,
  seedControl,
  seedCropped,
  seedLooped,
  seedMidcut,
  seedReset,
  seedTagged,
  seedThrice,
  parseSessionTrace,
  verdictOf,
} from "./pirn.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverPirn(result) {
  assert.equal(result.idleWord, "beamed");
  assert.equal(IDLE_WORD, "beamed");
  assert.doesNotMatch(result.idleWord, /pirn/i);
  assert.doesNotMatch(IDLE_WORD, /^pirn$/i);
  assert.doesNotMatch(result.idleWord, /empty|truncat|crop|snip|cut/i);
  assert.doesNotMatch(
    result.idleWord,
    /snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.beamed, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90544 cropped is cropped, slack, linear, idleWord beamed", () => {
  const seed = seedCropped();
  const result = decide(seed);
  assert.equal(result.verdict, "cropped");
  assert.equal(result.state, "cropped");
  assert.equal(result.decision, "cropped");
  assert.equal(classify(seed.pirn), "cropped");
  assert.equal(verdictOf(seed.pirn), "cropped");
  assert.notEqual(result.verdict, "beamed");
  assert.notEqual(result.verdict, "thrice");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.pirnCropped, true);
  assert.equal(result.cropped, true);
  assert.equal(result.beamed, false);
  assertIdleNeverPirn(result);
  assert.equal(result.session, "90544-cropped");
  assert.equal(result.issue, 90544);
  assert.equal(result.charCount, CAP_CHARS);
  assert.equal(result.truncated, true);
  assert.equal(result.instructionShaped, true);
  assert.equal(result.harnessTag, "settings-json");
  assert.equal(result.runs, 1);
  assert.equal(result.agentIdleGreen, true);
  assert.match(result.feed, /Cropped|primary #90544/i);
  assert.equal(decideSeed("cropped").verdict, "cropped");
  assert.equal(decideSeed("90544-cropped").verdict, "cropped");
  assert.equal(decideSeed(90544).verdict, "cropped");
});

test("2 idle/empty/{} is beamed, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "beamed");
  assert.equal(result.verdict, "beamed");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.beamed, true);
  assert.equal(classify({}), "beamed");
  assert.equal(classify(emptyPirn()), "beamed");
  assert.equal(isIdle(emptyPirn()), true);
  assert.equal(score(emptyPirn()).beamed, true);
  assertIdleNeverPirn(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "beamed");
  assert.equal(bailed.idleWord, "beamed");
  const empty = decide({});
  assert.equal(empty.verdict, "beamed");
  assert.match(empty.feed, /Beamed/);
});

test("3 control / seedBeamed stay beamed", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "beamed");
  assert.equal(result.alarm, false);
  assert.equal(result.runs, 1);
  assert.equal(result.truncated, false);
  assert.equal(result.instructionShaped, false);
  assert.match(result.feed, /Beamed/);
  assert.equal(decideSeed("control").verdict, "beamed");
  assert.equal(decideSeed("beamed").verdict, "beamed");
  assert.equal(decideSeed("healthy").verdict, "beamed");
  assert.equal(decide(seedBeamed()).verdict, "beamed");
});

test("4 thrice: three full runs beat cropped", () => {
  const result = decide(seedThrice());
  assert.equal(result.verdict, "thrice");
  assert.equal(result.pirnThrice, true);
  assert.equal(result.runs, 3);
  assert.equal(result.reRun, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /Thrice|#90544/);
  assert.equal(decideSeed("thrice").verdict, "thrice");
});

test("5 tagged: instruction-shaped prefix only", () => {
  const result = decide(seedTagged());
  assert.equal(result.verdict, "tagged");
  assert.equal(result.pirnTagged, true);
  assert.equal(result.truncated, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Tagged|settings-json/);
  assert.equal(decideSeed("tagged").verdict, "tagged");
});

test("6 looped: SendMessage re-ask re-ran after truncate", () => {
  const result = decide(seedLooped());
  assert.equal(result.verdict, "looped");
  assert.equal(result.pirnLooped, true);
  assert.equal(result.reRun, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Looped|re-run|resume/i);
  assert.equal(decideSeed("looped").verdict, "looped");
});

test("7 midcut: truncation cuts mid-sentence", () => {
  const result = decide(seedMidcut());
  assert.equal(result.verdict, "midcut");
  assert.equal(result.pirnMidcut, true);
  assert.equal(result.midSentence, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Midcut|mid-sentence/);
  assert.equal(decideSeed("midcut").verdict, "midcut");
});

test("8 score() idle pirn is beamed and never alarms", () => {
  const result = score(emptyPirn());
  assertScoreShape(result);
  assert.equal(result.verdict, "beamed");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.beamed, true);
  assert.equal(result.cropped, false);
});

test("9 verdict vocabulary is exactly the six words", () => {
  assert.deepEqual(VERDICTS, ["beamed", "cropped", "thrice", "tagged", "looped", "midcut"]);
  assert.deepEqual(SLACK_VERDICTS, ["cropped", "thrice", "tagged", "looped", "midcut"]);
  assert.deepEqual(LINEAR_VERDICTS, ["cropped", "thrice"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "beamed");
  assert.doesNotMatch(IDLE_WORD, /pirn$|snug|hung|appointed|cinched|wound|stabled/);
});

test("10 every seeded class classifies to itself", () => {
  const rows = [
    ["beamed", seedReset],
    ["cropped", seedCropped],
    ["thrice", seedThrice],
    ["tagged", seedTagged],
    ["looped", seedLooped],
    ["midcut", seedMidcut],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().pirn), word, word);
    assert.equal(score(seed().pirn).verdict, word, word);
  }
});

test("11 admit does not lie: cropped stays cropped; thrice stays thrice", () => {
  const cropped = decide({ ...seedCropped(), action: "admit" });
  assert.equal(cropped.verdict, "cropped");
  assert.equal(cropped.action, "admit");
  assert.doesNotMatch(cropped.verdict, /beamed/);
  const thrice = decide({ ...seedThrice(), action: "admit" });
  assert.equal(thrice.verdict, "thrice");
});

test("12 bail / beamed / reset returns idle beamed", () => {
  const bailed = decide({ ...seedCropped(), action: "bail" });
  assert.equal(bailed.verdict, "beamed");
  assert.equal(isIdle(bailed.pirn), true);
  assertIdleNeverPirn(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "beamed");
  assert.equal(decide({ action: "beamed" }).verdict, "beamed");
  assert.equal(decide(seedReset()).verdict, "beamed");
});

test("13 restore / cropped produces the #90544 cropped pirn", () => {
  const result = decide({ action: "restore", pirn: emptyPirn() });
  assert.equal(result.verdict, "cropped");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, 90544);
  assert.equal(decide({ action: "cropped" }).verdict, "cropped");
});

test("14 flagsOf matches slack / github; linear follows cropped/thrice", () => {
  assert.deepEqual(flagsOf("cropped"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("thrice"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("tagged"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("looped"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("midcut"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("beamed"), { slack: false, linear: false, github: true, alarm: false });
});

test("15 helpers, reasons, analyze, priority", () => {
  assert.equal(croppedOf(seedCropped().pirn), true);
  assert.equal(beamedOf(emptyPirn()), true);
  assert.equal(beamedOf(seedCropped().pirn), false);
  const reasons = reasonsOf(seedCropped().pirn, "cropped");
  assert.ok(reasons.some((row) => /#90544/.test(row)));
  const facts = analyze(seedThrice().pirn);
  assert.equal(facts.thriceShape, true);
  assert.equal(facts.croppedShape, true);
  assert.equal(classify(seedThrice().pirn), "thrice");
  assert.equal(classify(seed90544().pirn), "cropped");
});

test("16 forbidden idle list includes pirn, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("pirn"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("crop"));
  assert.ok(words.includes("snip"));
  assert.ok(words.includes("cut"));
  assert.ok(words.includes("snug"));
  assert.ok(words.includes("shunt"));
  assert.ok(words.includes("cotter"));
  assert.ok(!words.includes("beamed"));
});

test("17 demo sinks: Slack on alarm; Linear on cropped; GitHub always", async () => {
  const cropped = decide(seedCropped());
  const slack = slackPirnAlarm(cropped, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubPirnLedger(cropped, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub pirn-ledger/);
  const linear = linearPirnTicket(cropped, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearPirnTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackPirnAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(cropped, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("18 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const cropped = decide(seedCropped());
  const slack = slackPirnAlarm(cropped, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubPirnLedger(cropped, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearPirnTicket(cropped, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("19 handle alarm classes deny; beamed / control allow", async () => {
  const cropped = await handle(seedCropped(), {});
  assert.equal(cropped.permissionDecision, "deny");
  assert.match(cropped.hookSpecificOutput.decision.message, /cropped/);
  assert.equal((await handle(seedThrice(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedTagged(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedLooped(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedMidcut(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /beamed/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
});

test("20 listen GET health and POST empty body is beamed", async () => {
  const server = listen(19636);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19636/health");
  const info = await health.json();
  assert.equal(info.product, "pirn");
  assert.match(info.verbs, /cropped/);
  const res = await fetch("http://127.0.0.1:19636/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "beamed");
  assert.equal(body.idleWord, "beamed");
  const scored = await fetch("http://127.0.0.1:19636/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedCropped()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "cropped");
  await new Promise((resolve) => server.close(resolve));
});

test("21 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19637);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19637/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("22 parseSessionTrace reads a settings-json cropped report", () => {
  const pirn = parseSessionTrace(
    "[harness: subagent output matched instruction-shaped pattern(s): settings-json.] ... [result truncated — ask the agent for the rest via SendMessage]",
  );
  assert.equal(classify(pirn), "cropped");
});

test("23 parseSessionTrace reads thrice, looped, midcut, tagged", () => {
  assert.equal(
    classify(parseSessionTrace("three Opus 5 runs. SendMessage re-ask re-ran and truncated again.")),
    "thrice",
  );
  assert.equal(
    classify(parseSessionTrace("SendMessage re-ran the agent on a full transcript resume after truncate.")),
    "looped",
  );
  assert.equal(
    classify(parseSessionTrace("result truncated mid-sentence in section 3")),
    "midcut",
  );
  assert.equal(
    classify(parseSessionTrace("harness: instruction-shaped pattern settings-json")),
    "tagged",
  );
});

test("24 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90544,
    source: "idle_notification",
    harnessTag: "settings-json",
    instructionShaped: true,
    resultChars: 2500,
    capChars: 2500,
    truncated: true,
    truncationMarker: true,
    midSentence: true,
    runs: 1,
    reRun: false,
    fullReportProduced: true,
    deliveredToParent: true,
    sonnetControlOk: true,
    filePathWorkaround: false,
    agentIdleGreen: true,
    scored: false,
  });
  assert.equal(result.verdict, "cropped");
  const thrice = score({
    instructionShaped: true,
    harnessTag: "settings-json",
    truncated: true,
    truncationMarker: true,
    runs: 3,
    reRun: true,
    resultChars: 2500,
    capChars: 2500,
  });
  assert.equal(thrice.verdict, "thrice");
});

test("25 nested pirn / probe fields clone", () => {
  const pirn = clonePirn({ probe: seedCropped().pirn });
  assert.equal(classify(pirn), "cropped");
});

test("26 fire live slack posts when fetch ok", async () => {
  const cropped = decide(seedCropped());
  const events = await fire(cropped, { PIRN_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted cropped/);
});

test("27 desk HTML sanity: idle word beamed, seeded cropped, not cotter/fob/ordo/cinch/ullage", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /beamed/);
  assert.match(html, /Score/);
  assert.match(html, /cropped/);
  assert.match(html, /90544/);
  assert.match(html, /seedOf\("cropped"\)|pirn = seedOf\("cropped"\)/);
  assert.match(html, /const IDLE_WORD = "beamed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "pirn"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "snug"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stabled"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "hung"/);
  assert.match(html, /loom-shed|oak-frame|pirn-rack|yarn-package|brass-shears|harness-ribbon|idle-lamp|complete-lamp|costing-reel|thrice-reel|winder-crank|shuttle-race/i);
  assert.match(html, /19:50 Sydney · pirn/);
  assert.match(html, /first delivery is not a hold/i);
  assert.doesNotMatch(html, /class="pin-tray"|class="felt-bed"|class="split-pin"|class="caliper-beam"|class="grease-gauge"|class="axle-jig"/);
  assert.doesNotMatch(html, /class="fob-rail"|class="brass-hook"|class="room-tag"|class="night-clerk"|class="brass-plate"/);
  assert.doesNotMatch(html, /class="parchment-leaf"|class="rubric-rule"|class="kalendar-hours"|class="missal-gutter"/);
  assert.doesNotMatch(html, /class="leather-cinch"|class="brass-buckle"|class="strap-holes"|class="oil-lamp"|class="bridle-hooks"/);
  assert.doesNotMatch(html, /class="passport-folio"|class="brass-stamp"|class="teal-stripe"|class="ink-pad"/);
  assert.doesNotMatch(html, /class="oak-cask"|class="iron-hoop"|class="bung-seal"|class="gauging-rod"/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Italiana|Newsreader/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Spectral|Nunito Sans/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Pirn/);
  assert.match(html, /Syne|Literata|IBM Plex Mono/);
  assert.match(html, /Reset · beamed|reset to beamed/i);
  assert.match(html, /Restore · cropped|restore to cropped/i);
});

test("28 HTML why-not names Shunt, Cote, Husk, Coda, Aside, Suture, Cotter", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Shunt/);
  assert.match(html, /NOT Cote/);
  assert.match(html, /NOT Husk/);
  assert.match(html, /NOT Coda/);
  assert.match(html, /NOT Aside/);
  assert.match(html, /NOT Suture/);
  assert.match(html, /NOT Cotter/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("29 README names contrasts and beamed idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Shunt\*\*|NOT Shunt/);
  assert.match(readme, /NOT \*\*Cote\*\*|NOT Cote/);
  assert.match(readme, /NOT \*\*Aside\*\*|NOT Aside/);
  assert.match(readme, /NOT \*\*Cotter\*\*|NOT Cotter/);
  assert.match(readme, /\*\*beamed\*\*/);
  assert.match(readme, /#90544/);
  assert.doesNotMatch(readme, /idle word is pirn/i);
  assert.doesNotMatch(readme, /idle word is snug/i);
});

test("30 green idle lamps do not force beamed when cropped or tagged", () => {
  const cropped = score({
    instructionShaped: true,
    harnessTag: "settings-json",
    truncated: true,
    truncationMarker: true,
    resultChars: 2500,
    capChars: 2500,
    runs: 1,
    agentIdleGreen: true,
    deliveredToParent: true,
    fullReportProduced: true,
  });
  assert.equal(cropped.verdict, "cropped");
  assert.equal(cropped.agentIdleGreen, true);
  assert.equal(cropped.beamed, false);
  const tagged = score({
    instructionShaped: true,
    harnessTag: "settings-json",
    agentIdleGreen: true,
    deliveredToParent: true,
    fullReportProduced: true,
    runs: 1,
  });
  assert.equal(tagged.verdict, "tagged");
});

test("31 beamed hold requires a clean single delivery", () => {
  const hold = score({
    instructionShaped: false,
    truncated: false,
    truncationMarker: false,
    runs: 1,
    reRun: false,
    deliveredToParent: true,
    fullReportProduced: true,
    resultChars: 1840,
    capChars: 2500,
    agentIdleGreen: true,
  });
  assert.equal(hold.verdict, "beamed");
  const workaround = score({
    instructionShaped: false,
    truncated: false,
    truncationMarker: false,
    runs: 1,
    reRun: false,
    deliveredToParent: true,
    fullReportProduced: false,
    filePathWorkaround: true,
    resultChars: 40,
  });
  assert.equal(workaround.verdict, "beamed");
});

test("32 Slack skip on beamed / control", () => {
  for (const seed of [seedReset, seedControl, seedBeamed]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackPirnAlarm(result, {}).summary, /Would skip Slack/);
  }
});
