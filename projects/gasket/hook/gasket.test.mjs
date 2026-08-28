import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubGasketLedger,
  linearGasketTicket,
  slackGasketAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  cloneProbe,
  decide,
  decideSeed,
  discardedOf,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  leakOf,
  reasonsOf,
  score,
  sealedOf,
  seed83035Nested,
  seed87163Dry,
  seed89762Skipped,
  seed90355Dropped,
  seedBlown,
  seedMade,
  seedOpen,
  seedSheared,
  seedTight,
  seedWarned,
  skippedOf,
  verdictOf,
} from "./gasket.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverGasket(result) {
  assert.equal(result.idleWord, "tight");
  assert.equal(IDLE_WORD, "tight");
  assert.doesNotMatch(result.idleWord, /gasket/i);
  assert.doesNotMatch(result.state, /gasket/i);
  assert.doesNotMatch(IDLE_WORD, /gasket/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(result.idleWord, /banked|seated|latched|stocked|roosted/);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.sealed, "boolean");
  assert.equal(typeof result.leak, "boolean");
  assert.equal(typeof result.discarded, "boolean");
  assert.equal(typeof result.skipped, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90355 dropped is dropped, slack, linear, idleWord tight", () => {
  const seed = seed90355Dropped();
  const result = decide(seed);
  assert.equal(result.verdict, "dropped");
  assert.equal(result.state, "dropped");
  assert.equal(result.decision, "dropped");
  assert.equal(classify(seed.probe), "dropped");
  assert.equal(verdictOf(seed.probe), "dropped");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.jointDropped, true);
  assert.equal(result.jointTight, false);
  assert.equal(result.sealed, false);
  assert.equal(result.discarded, true);
  assert.equal(result.leak, false);
  assertIdleNeverGasket(result);
  assert.equal(result.session, "90355-dropped");
  assert.equal(result.issue, 90355);
  assert.equal(result.projectSettingsHasStrictAllowlist, true);
  assert.equal(result.sandboxEnabled, true);
  assert.equal(result.userOrManagedOrCliScope, false);
  assert.equal(result.startupWarning, false);
  assert.equal(result.debugMentionsDiscard, false);
  assert.equal(result.statusMentionsDiscard, false);
  assert.equal(result.sandboxPanelMentionsDiscard, false);
  assert.equal(result.doctorMentionsDiscard, false);
  assert.match(result.feed, /discarded at resolution/);
  assert.equal(decideSeed(90355).verdict, "dropped");
  assert.equal(decideSeed("dropped").verdict, "dropped");
  assert.equal(decideSeed("90355-dropped").verdict, "dropped");
});

test("2 idle/empty/{} is tight, never the product name, never empty, never banked/seated", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "tight");
  assert.equal(result.verdict, "tight");
  assert.equal(result.decision, "tight");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.sealed, true);
  assert.equal(result.leak, false);
  assert.equal(classify({}), "tight");
  assert.equal(classify(emptyProbe()), "tight");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverGasket(result);
  const seated = decide({ action: "seat" });
  assert.equal(seated.state, "tight");
  assert.equal(seated.idleWord, "tight");
  assert.equal(seated.sandboxEnabled, false);
  assert.doesNotMatch(seated.state, /gasket/i);
  assert.doesNotMatch(seated.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "tight");
  assert.equal(empty.idleWord, "tight");
});

test("3 blown: sandbox looks on, host reached, fail-open", () => {
  const result = decide(seedBlown());
  assert.equal(result.verdict, "blown");
  assert.equal(result.sandboxEnabled, true);
  assert.equal(result.projectSettingsHasStrictAllowlist, true);
  assert.equal(result.nonAllowlistedHostReached, true);
  assert.equal(result.bashEgressBlocked, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.leak, true);
  assert.match(result.feed, /fail-open/);
  assert.equal(decideSeed("blown").verdict, "blown");
});

test("4 nested #83035: parent sandbox replaced by nested project file", () => {
  const result = decide(seed83035Nested());
  assert.equal(result.verdict, "nested");
  assert.equal(result.issue, 83035);
  assert.equal(result.nestedProjectReplacedParent, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.leak, true);
  assert.match(result.feed, /nested project's settings/);
  assert.equal(decideSeed(83035).verdict, "nested");
  assert.equal(decideSeed("nested").verdict, "nested");
});

test("5 skipped #89762: Bash gated, WebFetch/Write not", () => {
  const result = decide(seed89762Skipped());
  assert.equal(result.verdict, "skipped");
  assert.equal(result.issue, 89762);
  assert.equal(result.bashEgressBlocked, true);
  assert.equal(result.webfetchEgressBlocked, false);
  assert.equal(result.writeGated, false);
  assert.equal(result.skipped, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.match(result.feed, /WebFetch or Write/);
  assert.equal(decideSeed(89762).verdict, "skipped");
});

test("6 open: allowlist theater, no runtime, traffic unrestricted", () => {
  const result = decide(seedOpen());
  assert.equal(result.verdict, "open");
  assert.equal(result.sandboxEnabled, false);
  assert.equal(result.projectSettingsHasStrictAllowlist, true);
  assert.equal(result.nonAllowlistedHostReached, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.leak, true);
  assert.match(result.feed, /allowlist theater/);
  assert.equal(decideSeed("open").verdict, "open");
});

test("7 dry #87163: network keys, sandbox.enabled absent, dispatcher never invokes", () => {
  const result = decide(seed87163Dry());
  assert.equal(result.verdict, "dry");
  assert.equal(result.issue, 87163);
  assert.equal(result.projectSettingsHasStrictAllowlist, true);
  assert.equal(result.sandboxEnabled, false);
  assert.equal(result.nonAllowlistedHostReached, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /dispatcher never invokes/);
  assert.equal(decideSeed(87163).verdict, "dry");
});

test("8 warned: socat/bwrap missing but a warning fired", () => {
  const result = decide(seedWarned());
  assert.equal(result.verdict, "warned");
  assert.equal(result.issue, 34044);
  assert.equal(result.socatOrBwrapMissing, true);
  assert.equal(result.warningFired, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /warning actually fired/);
  assert.equal(decideSeed(34044).verdict, "warned");
});

test("9 sheared: schema UNDOCUMENTED, no scope note, runtime drops the key", () => {
  const result = decide(seedSheared());
  assert.equal(result.verdict, "sheared");
  assert.equal(result.schemaSaysUndocumented, true);
  assert.equal(result.schemaMarksScope, false);
  assert.equal(result.projectSettingsHasStrictAllowlist, true);
  assert.equal(result.discarded, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /UNDOCUMENTED/);
  assert.equal(decideSeed("sheared").verdict, "sheared");
});

test("10 made: right-scope hold, sandbox on, Bash denied", () => {
  const result = decide(seedMade());
  assert.equal(result.verdict, "made");
  assert.equal(result.userOrManagedOrCliScope, true);
  assert.equal(result.sandboxEnabled, true);
  assert.equal(result.bashEgressBlocked, true);
  assert.equal(result.sealed, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /right rack/);
  assert.equal(decideSeed("made").verdict, "made");
});

test("11 tight seed is tight and never alarms", () => {
  const result = decide(seedTight());
  assert.equal(result.verdict, "tight");
  assert.equal(result.sandboxEnabled, false);
  assert.equal(result.sealed, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Tight/);
  assert.equal(decideSeed("tight").verdict, "tight");
});

test("12 score() idle probe is tight and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "tight");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.sealed, true);
  assert.equal(result.leak, false);
  assert.equal(result.discarded, false);
  assert.equal(result.skipped, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "tight",
    "dropped",
    "blown",
    "nested",
    "skipped",
    "open",
    "dry",
    "warned",
    "sheared",
    "made",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["dropped", "blown", "nested", "open", "sheared"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["dropped", "blown", "open"]);
  assert.equal(IDLE_WORD, "tight");
  assert.doesNotMatch(IDLE_WORD, /gasket/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /banked|seated|latched|stocked|roosted/);
  assert.doesNotMatch(VERDICTS.join(" "), /gasket/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["tight", seedTight],
    ["dropped", seed90355Dropped],
    ["blown", seedBlown],
    ["nested", seed83035Nested],
    ["skipped", seed89762Skipped],
    ["open", seedOpen],
    ["dry", seed87163Dry],
    ["warned", seedWarned],
    ["sheared", seedSheared],
    ["made", seedMade],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: dropped stays dropped", () => {
  const result = decide({ ...seed90355Dropped(), action: "admit" });
  assert.equal(result.verdict, "dropped");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /gasket/i);
  assert.doesNotMatch(result.verdict, /tight/);
});

test("16 press scores dropped", () => {
  const result = decide({ ...seed90355Dropped(), action: "press" });
  assert.equal(result.verdict, "dropped");
  assert.equal(result.action, "press");
  assert.equal(result.projectSettingsHasStrictAllowlist, true);
});

test("17 seat / clear returns idle tight", () => {
  const seated = decide({ ...seed90355Dropped(), action: "seat" });
  assert.equal(seated.verdict, "tight");
  assert.equal(seated.action, "seat");
  assert.equal(seated.projectSettingsHasStrictAllowlist, false);
  assert.equal(isIdle(seated.probe), true);
  assertIdleNeverGasket(seated);
  const cleared = decide({ ...seedBlown(), action: "clear" });
  assert.equal(cleared.verdict, "tight");
  assert.equal(cleared.action, "seat");
  assert.equal(isIdle(cleared.probe), true);
});

test("18 cut on idle produces blown fail-open", () => {
  const result = decide({ action: "cut", probe: emptyProbe() });
  assert.equal(result.verdict, "blown");
  assert.equal(result.action, "cut");
  assert.equal(result.nonAllowlistedHostReached, true);
  assert.equal(result.sandboxEnabled, true);
  assert.equal(result.leak, true);
});

test("19 cut on a dropped probe becomes blown", () => {
  const result = decide({ ...seed90355Dropped(), action: "cut" });
  assert.equal(result.verdict, "blown");
  assert.equal(result.action, "cut");
  assert.equal(result.nonAllowlistedHostReached, true);
});

test("20 observe marks the schema/doctor/status check and does not lie", () => {
  const result = decide({ ...seed90355Dropped(), action: "observe" });
  assert.equal(result.verdict, "dropped");
  assert.equal(result.action, "observe");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Observe checked/.test(line)));
});

test("21 observe on made stays made", () => {
  const result = decide({ ...seedMade(), action: "observe" });
  assert.equal(result.verdict, "made");
  assert.equal(result.observed, true);
  assert.equal(result.userOrManagedOrCliScope, true);
});

test("22 make produces a right-scope hold", () => {
  const result = decide({ ...seed90355Dropped(), action: "make" });
  assert.equal(result.action, "make");
  assert.equal(result.verdict, "made");
  assert.equal(result.userOrManagedOrCliScope, true);
  assert.equal(result.sandboxEnabled, true);
  assert.equal(result.bashEgressBlocked, true);
  assert.equal(result.sealed, true);
});

test("23 make on idle produces made", () => {
  const result = decide({ action: "make", probe: emptyProbe() });
  assert.equal(result.verdict, "made");
  assert.equal(result.sealed, true);
});

test("24 nested beats dropped when both nested-replace and project key", () => {
  assert.equal(
    classify({
      nestedProjectReplacedParent: true,
      projectSettingsHasStrictAllowlist: true,
      sandboxEnabled: true,
    }),
    "nested",
  );
});

test("25 skipped beats blown when Bash is gated", () => {
  assert.equal(
    classify({
      projectSettingsHasStrictAllowlist: true,
      sandboxEnabled: true,
      bashEgressBlocked: true,
      webfetchEgressBlocked: false,
      writeGated: false,
      nonAllowlistedHostReached: true,
    }),
    "skipped",
  );
});

test("26 blown requires sandbox on plus host reached plus Bash not holding", () => {
  assert.equal(
    classify({
      projectSettingsHasStrictAllowlist: true,
      sandboxEnabled: true,
      nonAllowlistedHostReached: true,
    }),
    "blown",
  );
  assert.equal(
    classify({
      projectSettingsHasStrictAllowlist: true,
      sandboxEnabled: true,
    }),
    "dropped",
  );
});

test("27 open does not steal dry (host reached vs dispatcher never invoked)", () => {
  assert.equal(classify(seedOpen().probe), "open");
  assert.equal(classify(seed87163Dry().probe), "dry");
  assert.notEqual(seedOpen().probe.nonAllowlistedHostReached, seed87163Dry().probe.nonAllowlistedHostReached);
});

test("28 sheared requires UNDOCUMENTED and does not steal dropped", () => {
  assert.equal(classify(seed90355Dropped().probe), "dropped");
  assert.equal(classify(seedSheared().probe), "sheared");
  assert.equal(seed90355Dropped().probe.schemaSaysUndocumented, false);
  assert.equal(seedSheared().probe.schemaSaysUndocumented, true);
});

test("29 made requires right scope plus Bash denied plus no host reach", () => {
  assert.equal(
    classify({
      userOrManagedOrCliScope: true,
      sandboxEnabled: true,
      bashEgressBlocked: true,
    }),
    "made",
  );
  assert.equal(
    classify({
      userOrManagedOrCliScope: true,
      sandboxEnabled: true,
      bashEgressBlocked: true,
      nonAllowlistedHostReached: true,
    }),
    "tight",
  );
});

test("30 warned requires missing dep AND a fired warning", () => {
  assert.equal(
    classify({ socatOrBwrapMissing: true, warningFired: true, sandboxEnabled: true }),
    "warned",
  );
  assert.equal(
    classify({
      projectSettingsHasStrictAllowlist: true,
      sandboxEnabled: true,
      socatOrBwrapMissing: false,
    }),
    "dropped",
  );
});

test("31 nested flange / ring / joint fields clone", () => {
  const probe = cloneProbe({
    flange: { projectSettingsHasStrictAllowlist: true, sandboxEnabled: true },
  });
  assert.equal(classify(probe), "dropped");
  const ring = cloneProbe({
    ring: { nestedProjectReplacedParent: true, sandboxEnabled: true },
  });
  assert.equal(classify(ring), "nested");
});

test("32 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("dropped"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("blown"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("nested"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("open"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("sheared"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("tight"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("made"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("dry"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("skipped"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("warned"), { slack: false, linear: false, github: true, alarm: false });
});

test("33 sealed / leak / discarded / skipped helpers", () => {
  assert.equal(sealedOf(seed90355Dropped().probe), false);
  assert.equal(discardedOf(seed90355Dropped().probe), true);
  assert.equal(leakOf(seed90355Dropped().probe), false);
  assert.equal(skippedOf(seed90355Dropped().probe), false);
  assert.equal(sealedOf(emptyProbe()), true);
  assert.equal(sealedOf(seedMade().probe), true);
  assert.equal(leakOf(seedBlown().probe), true);
  assert.equal(leakOf(seedOpen().probe), true);
  assert.equal(leakOf(seed89762Skipped().probe), true);
  assert.equal(discardedOf(seedSheared().probe), true);
  assert.equal(skippedOf(seed89762Skipped().probe), true);
});

test("34 feed and reasons never use gasket or empty as the idle word", () => {
  const tight = score(emptyProbe());
  assert.equal(tight.idleWord, "tight");
  assert.doesNotMatch(tight.feed, /idle word is gasket/i);
  assert.doesNotMatch(tight.feed, /idle word is empty/i);
  assert.ok(tight.reasons.every((line) => !/idle word is gasket/i.test(line)));
  assert.ok(tight.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "tight"), /Tight/);
  assert.ok(reasonsOf(emptyProbe(), "tight").some((line) => /idle word is tight/.test(line)));
});

test("35 forbidden idle list includes gasket, empty, banked, seated, latched", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("gasket"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("banked"));
  assert.ok(words.includes("seated"));
  assert.ok(words.includes("latched"));
  assert.ok(words.includes("stocked"));
  assert.ok(words.includes("roosted"));
  assert.ok(!words.includes("tight"));
});

test("36 demo sinks: Slack on alarm; Linear on dropped/blown/open; GitHub always", async () => {
  const dropped = decide(seed90355Dropped());
  const slack = slackGasketAlarm(dropped, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubGasketLedger(dropped, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub gasket-ledger/);
  const linear = linearGasketTicket(dropped, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const tight = decide(emptyAction("idle"));
  assert.match(slackGasketAlarm(tight, {}).summary, /Would skip Slack/);
  assert.match(linearGasketTicket(tight, {}).summary, /Would skip Linear/);
  const fired = await fire(dropped, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("37 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const dropped = decide(seed90355Dropped());
  const slack = slackGasketAlarm(dropped, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubGasketLedger(dropped, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearGasketTicket(dropped, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("38 Slack skip on tight / made / dry / skipped / warned", () => {
  for (const seed of [seedTight, seedMade, seed87163Dry, seed89762Skipped, seedWarned]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackGasketAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("39 Linear only on dropped, blown, and open", () => {
  assert.equal(decide(seed90355Dropped()).linear, true);
  assert.equal(decide(seedBlown()).linear, true);
  assert.equal(decide(seedOpen()).linear, true);
  assert.equal(decide(seed83035Nested()).linear, false);
  assert.equal(decide(seedSheared()).linear, false);
  assert.equal(decide(seedTight()).linear, false);
});

test("40 GitHub ledger fires on idle/clear scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const seated = decide({ action: "seat" });
  assert.equal(seated.github, true);
});

test("41 handle dropped / blown / nested / open / sheared deny", async () => {
  const dropped = await handle(seed90355Dropped(), {});
  assert.equal(dropped.permissionDecision, "deny");
  assert.match(dropped.hookSpecificOutput.decision.message, /dropped/);
  const blown = await handle(seedBlown(), {});
  assert.equal(blown.permissionDecision, "deny");
  const nested = await handle(seed83035Nested(), {});
  assert.equal(nested.permissionDecision, "deny");
  const open = await handle(seedOpen(), {});
  assert.equal(open.permissionDecision, "deny");
  const sheared = await handle(seedSheared(), {});
  assert.equal(sheared.permissionDecision, "deny");
});

test("42 handle tight / made / dry / skipped / warned allow", async () => {
  const tight = await handle({ action: "seat" }, {});
  assert.equal(tight.permissionDecision, "allow");
  assert.match(tight.hookSpecificOutput.decision.message, /tight/);
  const made = await handle(seedMade(), {});
  assert.equal(made.permissionDecision, "allow");
  const dry = await handle(seed87163Dry(), {});
  assert.equal(dry.permissionDecision, "allow");
  const skipped = await handle(seed89762Skipped(), {});
  assert.equal(skipped.permissionDecision, "allow");
  const warned = await handle(seedWarned(), {});
  assert.equal(warned.permissionDecision, "allow");
});

test("43 listen GET health and POST empty body is tight", async () => {
  const server = listen(19355);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19355/health");
  const info = await health.json();
  assert.equal(info.product, "gasket");
  assert.match(info.verbs, /dropped/);
  const res = await fetch("http://127.0.0.1:19355/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "tight");
  assert.equal(body.idleWord, "tight");
  const scored = await fetch("http://127.0.0.1:19355/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90355Dropped()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "dropped");
  await new Promise((resolve) => server.close(resolve));
});

test("44 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19356);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19356/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19356/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("45 every verdict is uniquely first-match on its seed", () => {
  const map = {
    tight: seedTight,
    dropped: seed90355Dropped,
    blown: seedBlown,
    nested: seed83035Nested,
    skipped: seed89762Skipped,
    open: seedOpen,
    dry: seed87163Dry,
    warned: seedWarned,
    sheared: seedSheared,
    made: seedMade,
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

test("46 admit does not lie on every fault class", () => {
  const rows = [
    ["dropped", seed90355Dropped],
    ["blown", seedBlown],
    ["nested", seed83035Nested],
    ["skipped", seed89762Skipped],
    ["open", seedOpen],
    ["dry", seed87163Dry],
    ["warned", seedWarned],
    ["sheared", seedSheared],
    ["made", seedMade],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("47 desk HTML sanity: idle word tight, seeded dropped, steam flange not chimney", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /tight/);
  assert.match(html, /Press|Score/);
  assert.match(html, /Seat/);
  assert.match(html, /Observe/);
  assert.match(html, /Cut/);
  assert.match(html, /Make/);
  assert.match(html, /dropped/);
  assert.match(html, /90355/);
  assert.match(html, /seedOf\("dropped"\)|probe = seedOf\("dropped"\)/);
  assert.doesNotMatch(html, /Admit gasket/);
  assert.doesNotMatch(html, /const IDLE_WORD = "gasket"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "banked"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "seated"/);
  assert.match(html, /const IDLE_WORD = "tight"/);
  assert.match(html, /linen|lagging|brass union|red-lead|graphite|bourdon|packing|hessian|flange/i);
  assert.match(html, /00:50 Sydney · steam flange/);
  assert.match(html, /written project key is not a seal/i);
  assert.doesNotMatch(html, /class="stack"|class="soot"|class="embers"|flue °|draft gauge|cast-iron plate/);
  assert.doesNotMatch(html, /--soot:|--oil:|--ice:|--wash:/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
});

test("48 HTML why-not names Damper, Tappet, Snib, Knock, Reed, leftovers", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Damper/);
  assert.match(html, /NOT Tappet/);
  assert.match(html, /NOT Snib/);
  assert.match(html, /NOT Knock/);
  assert.match(html, /NOT Reed/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider/);
  assert.doesNotMatch(html, /Gasket is a chimney damper/i);
  assert.doesNotMatch(html, /Gasket is RC starting/i);
  assert.doesNotMatch(html, /this is a valve train/i);
});

test("49 README names Damper contrast and tight idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Damper/);
  assert.match(readme, /NOT Tappet/);
  assert.match(readme, /NOT Snib/);
  assert.match(readme, /NOT Knock/);
  assert.match(readme, /NOT Reed/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*tight\*\*/);
  assert.match(readme, /#90355|#90355/);
  assert.match(readme, /#89762|#89762/);
  assert.match(readme, /#83035|#83035/);
  assert.doesNotMatch(readme, /idle word is gasket/i);
  assert.doesNotMatch(readme, /Gasket is a chimney damper/i);
  assert.doesNotMatch(readme, /Remote Control auto-enable without consent\. A settings toggle/);
});

test("50 score() dropped includes discarded and not sealed", () => {
  const result = score(seed90355Dropped().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "dropped");
  assert.equal(result.sealed, false);
  assert.equal(result.discarded, true);
  assert.equal(result.leak, false);
  assert.equal(result.skipped, false);
});

test("51 fire live slack posts when fetch ok", async () => {
  const dropped = decide(seed90355Dropped());
  const events = await fire(dropped, { GASKET_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted dropped/);
});

test("52 fire live github and linear paths", async () => {
  const dropped = decide(seed90355Dropped());
  const events = await fire(
    dropped,
    {
      GASKET_GITHUB_TOKEN: "tok",
      GASKET_LINEAR_KEY: "lin",
      GASKET_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "GAS-1", url: "https://linear.app/gas-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /GAS-1/);
});

test("53 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90355Dropped().probe, "dropped").some((line) => /#90355/.test(line)));
  assert.ok(reasonsOf(seed83035Nested().probe, "nested").some((line) => /#83035/.test(line)));
  assert.ok(reasonsOf(seed89762Skipped().probe, "skipped").some((line) => /#89762/.test(line)));
  assert.ok(reasonsOf(seed87163Dry().probe, "dry").some((line) => /#87163/.test(line)));
  assert.ok(reasonsOf(seedWarned().probe, "warned").some((line) => /#34044/.test(line)));
  assert.ok(reasonsOf(seedSheared().probe, "sheared").some((line) => /#87545/.test(line)));
});

test("54 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const dropped = decide(seed90355Dropped());
  const slack = slackGasketAlarm(dropped, {});
  const github = githubGasketLedger(dropped, {});
  const linear = linearGasketTicket(dropped, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(dropped, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("55 catalog wiring: 26 products, Gasket featured, Damper listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 26);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Gasket");
  assert.equal(featured[0].slug, "gasket");
  assert.equal(featured[0].href, "/gasket/");
  assert.match(featured[0].summary, /00:50|steam flange|written project key is not a seal|tight/);
  const damper = catalog.products.find((row) => row.slug === "damper");
  assert.ok(damper);
  assert.equal(damper.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.ok(slugs.includes("cote"));
  assert.ok(slugs.includes("larder"));
  assert.ok(slugs.includes("tappet"));
});

test("56 vercel rewrite order puts /gasket before /damper and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/gasket");
  assert.equal(sources[1], "/gasket/");
  assert.ok(sources.includes("/damper"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/gasket") < sources.indexOf("/damper"));
  assert.ok(sources.indexOf("/gasket/") < sources.indexOf("/:slug"));
});

test("57 hours.json prepends the 00:50 Sydney Gasket ship", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-gasket");
  assert.equal(hours[0].date, "2026-08-29");
  assert.equal(hours[0].time, "00:50");
  assert.equal(hours[0].tz, "Australia/Sydney");
  assert.equal(hours[0].title, "Gasket");
  assert.equal(hours[0].kind, "ship");
  assert.match(hours[0].note, /tight/);
  assert.match(hours[0].note, /Damper/);
});

test("58 dry does not steal warned when socat is missing", () => {
  assert.equal(
    classify({
      projectSettingsHasStrictAllowlist: true,
      sandboxEnabled: false,
      socatOrBwrapMissing: true,
      warningFired: true,
    }),
    "warned",
  );
});

test("59 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    projectSettingsHasStrictAllowlist: "true",
    sandboxEnabled: "1",
    userOrManagedOrCliScope: "false",
  });
  assert.equal(probe.projectSettingsHasStrictAllowlist, true);
  assert.equal(probe.sandboxEnabled, true);
  assert.equal(probe.userOrManagedOrCliScope, false);
  assert.equal(classify(probe), "dropped");
});
