import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubDamperLedger,
  linearDamperTicket,
  slackDamperAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  bridgedOf,
  classify,
  cloneProbe,
  consentedOf,
  damperClosedOf,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  flueOpenOf,
  forbiddenIdleWords,
  isIdle,
  reasonsOf,
  score,
  seed77517Lit,
  seed89146Forced,
  seed89568Ajar,
  seed90341Defaulted,
  seedBanked,
  seedBridged,
  seedDisclosed,
  seedDrawn,
  seedSealed,
  seedVented,
  verdictOf,
} from "./damper.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverDamper(result) {
  assert.equal(result.idleWord, "banked");
  assert.equal(IDLE_WORD, "banked");
  assert.doesNotMatch(result.idleWord, /damper/i);
  assert.doesNotMatch(result.state, /damper/i);
  assert.doesNotMatch(IDLE_WORD, /damper/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.flueOpen, "boolean");
  assert.equal(typeof result.damperClosed, "boolean");
  assert.equal(typeof result.consented, "boolean");
  assert.equal(typeof result.bridged, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90341 defaulted is defaulted, slack, linear, idleWord banked", () => {
  const seed = seed90341Defaulted();
  const result = decide(seed);
  assert.equal(result.verdict, "defaulted");
  assert.equal(result.state, "defaulted");
  assert.equal(result.decision, "defaulted");
  assert.equal(classify(seed.probe), "defaulted");
  assert.equal(verdictOf(seed.probe), "defaulted");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.plateDefaulted, true);
  assert.equal(result.plateBanked, false);
  assert.equal(result.flueOpen, true);
  assert.equal(result.damperClosed, false);
  assert.equal(result.consented, false);
  assert.equal(result.bridged, true);
  assertIdleNeverDamper(result);
  assert.equal(result.session, "90341-defaulted");
  assert.equal(result.issue, 90341);
  assert.equal(result.neverInvokedRc, true);
  assert.equal(result.disableClaudeAiConnectorsTrue, true);
  assert.equal(result.rcActive, true);
  assert.equal(result.liveRemoteUrl, true);
  assert.equal(result.toolResultsCrossing, true);
  assert.equal(result.fileContentsExposed, true);
  assert.equal(result.seenAutoOnNotification, true);
  assert.equal(result.remoteControlAtStartupAbsent, true);
  assert.match(result.feed, /disableClaudeAiConnectors true ignored/);
  assert.equal(decideSeed(90341).verdict, "defaulted");
  assert.equal(decideSeed("defaulted").verdict, "defaulted");
  assert.equal(decideSeed("90341-defaulted").verdict, "defaulted");
});

test("2 idle/empty/{} is banked, never the product name, never empty", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "banked");
  assert.equal(result.verdict, "banked");
  assert.equal(result.decision, "banked");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.flueOpen, false);
  assert.equal(result.damperClosed, true);
  assert.equal(classify({}), "banked");
  assert.equal(classify(emptyProbe()), "banked");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverDamper(result);
  const cleared = decide({ action: "bank" });
  assert.equal(cleared.state, "banked");
  assert.equal(cleared.idleWord, "banked");
  assert.equal(cleared.rcActive, false);
  assert.doesNotMatch(cleared.state, /damper/i);
  assert.doesNotMatch(cleared.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "banked");
  assert.equal(empty.idleWord, "banked");
});

test("3 drawn: RC on, never /rc, draft pulling", () => {
  const result = decide(seedDrawn());
  assert.equal(result.verdict, "drawn");
  assert.equal(result.neverInvokedRc, true);
  assert.equal(result.rcActive, true);
  assert.equal(result.disableClaudeAiConnectorsTrue, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.flueOpen, true);
  assert.match(result.feed, /draft is pulling/);
  assert.equal(decideSeed("drawn").verdict, "drawn");
});

test("4 vented: user threw /rc, consented open", () => {
  const result = decide(seedVented());
  assert.equal(result.verdict, "vented");
  assert.equal(result.neverInvokedRc, false);
  assert.equal(result.rcActive, true);
  assert.equal(result.consented, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /on purpose/);
  assert.equal(decideSeed("vented").verdict, "vented");
});

test("5 ajar #89568: UI toggle off, RC on", () => {
  const result = decide(seed89568Ajar());
  assert.equal(result.verdict, "ajar");
  assert.equal(result.issue, 89568);
  assert.equal(result.uiDefaultToggleOff, true);
  assert.equal(result.rcActive, true);
  assert.equal(result.liveRemoteUrl, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.match(result.feed, /settings toggle is not a hold/);
  assert.equal(decideSeed(89568).verdict, "ajar");
  assert.equal(decideSeed("ajar").verdict, "ajar");
});

test("6 forced #89146: VS Code new tab auto-on", () => {
  const result = decide(seed89146Forced());
  assert.equal(result.verdict, "forced");
  assert.equal(result.issue, 89146);
  assert.equal(result.vscodeNewTab, true);
  assert.equal(result.rcActive, true);
  assert.equal(result.surface, "vscode");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /remoteControl=default ignored/);
  assert.equal(decideSeed(89146).verdict, "forced");
});

test("7 lit #77517: random auto-trigger", () => {
  const result = decide(seed77517Lit());
  assert.equal(result.verdict, "lit");
  assert.equal(result.issue, 77517);
  assert.equal(result.rcActive, true);
  assert.equal(result.neverInvokedRc, true);
  assert.equal(result.seenAutoOnNotification, false);
  assert.equal(result.liveRemoteUrl, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /auto-triggered/);
  assert.equal(decideSeed(77517).verdict, "lit");
});

test("8 bridged: live URL plus file disclosure", () => {
  const result = decide(seedBridged());
  assert.equal(result.verdict, "bridged");
  assert.equal(result.liveRemoteUrl, true);
  assert.equal(result.fileContentsExposed, true);
  assert.equal(result.disableClaudeAiConnectorsTrue, false);
  assert.equal(result.bridged, true);
  assert.equal(result.flueOpen, true);
  assert.match(result.feed, /file contents/);
  assert.equal(decideSeed("bridged").verdict, "bridged");
});

test("9 disclosed: tool results crossing without file-content claim", () => {
  const result = decide(seedDisclosed());
  assert.equal(result.verdict, "disclosed");
  assert.equal(result.toolResultsCrossing, true);
  assert.equal(result.fileContentsExposed, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /tool results crossing/);
  assert.equal(decideSeed("disclosed").verdict, "disclosed");
});

test("10 sealed: remoteControlAtStartup:false holds", () => {
  const result = decide(seedSealed());
  assert.equal(result.verdict, "sealed");
  assert.equal(result.remoteControlAtStartupFalse, true);
  assert.equal(result.rcActive, false);
  assert.equal(result.damperClosed, true);
  assert.equal(result.flueOpen, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /remoteControlAtStartup:false holds/);
  assert.equal(decideSeed("sealed").verdict, "sealed");
});

test("11 banked seed is banked and never alarms", () => {
  const result = decide(seedBanked());
  assert.equal(result.verdict, "banked");
  assert.equal(result.rcActive, false);
  assert.equal(result.damperClosed, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Banked/);
  assert.equal(decideSeed("banked").verdict, "banked");
});

test("12 score() idle probe is banked and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "banked");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.flueOpen, false);
  assert.equal(result.damperClosed, true);
  assert.equal(result.consented, false);
  assert.equal(result.bridged, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "banked",
    "drawn",
    "vented",
    "ajar",
    "forced",
    "defaulted",
    "bridged",
    "disclosed",
    "sealed",
    "lit",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["defaulted", "drawn", "forced", "disclosed"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["defaulted", "disclosed"]);
  assert.equal(IDLE_WORD, "banked");
  assert.doesNotMatch(IDLE_WORD, /damper/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(VERDICTS.join(" "), /damper/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["banked", seedBanked],
    ["drawn", seedDrawn],
    ["vented", seedVented],
    ["ajar", seed89568Ajar],
    ["forced", seed89146Forced],
    ["defaulted", seed90341Defaulted],
    ["bridged", seedBridged],
    ["disclosed", seedDisclosed],
    ["sealed", seedSealed],
    ["lit", seed77517Lit],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: defaulted stays defaulted", () => {
  const result = decide({ ...seed90341Defaulted(), action: "admit" });
  assert.equal(result.verdict, "defaulted");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /damper/i);
  assert.doesNotMatch(result.verdict, /banked/);
});

test("16 throw scores defaulted", () => {
  const result = decide({ ...seed90341Defaulted(), action: "throw" });
  assert.equal(result.verdict, "defaulted");
  assert.equal(result.action, "throw");
  assert.equal(result.rcActive, true);
});

test("17 bank / clear returns idle banked", () => {
  const banked = decide({ ...seed90341Defaulted(), action: "bank" });
  assert.equal(banked.verdict, "banked");
  assert.equal(banked.action, "bank");
  assert.equal(banked.rcActive, false);
  assert.equal(isIdle(banked.probe), true);
  assertIdleNeverDamper(banked);
  const cleared = decide({ ...seedDrawn(), action: "clear" });
  assert.equal(cleared.verdict, "banked");
  assert.equal(cleared.action, "bank");
  assert.equal(isIdle(cleared.probe), true);
});

test("18 draw on idle produces drawn draft", () => {
  const result = decide({ action: "draw", probe: emptyProbe() });
  assert.equal(result.verdict, "drawn");
  assert.equal(result.action, "draw");
  assert.equal(result.rcActive, true);
  assert.equal(result.neverInvokedRc, true);
  assert.equal(result.flueOpen, true);
});

test("19 draw on a defaulted probe stays defaulted", () => {
  const result = decide({ ...seed90341Defaulted(), action: "draw" });
  assert.equal(result.verdict, "defaulted");
  assert.equal(result.action, "draw");
  assert.equal(result.rcActive, true);
});

test("20 observe marks the stamp check and does not lie", () => {
  const result = decide({ ...seed90341Defaulted(), action: "observe" });
  assert.equal(result.verdict, "defaulted");
  assert.equal(result.action, "observe");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Observe checked/.test(line)));
});

test("21 observe on sealed stays sealed", () => {
  const result = decide({ ...seedSealed(), action: "observe" });
  assert.equal(result.verdict, "sealed");
  assert.equal(result.observed, true);
  assert.equal(result.remoteControlAtStartupFalse, true);
});

test("22 sever disconnects RC; defaulted falls to banked", () => {
  const result = decide({ ...seed90341Defaulted(), action: "sever" });
  assert.equal(result.action, "sever");
  assert.equal(result.rcActive, false);
  assert.equal(result.liveRemoteUrl, false);
  assert.equal(result.toolResultsCrossing, false);
  assert.equal(result.fileContentsExposed, false);
  assert.equal(result.verdict, "banked");
});

test("23 sever on sealed stays sealed", () => {
  const result = decide({ ...seedSealed(), action: "sever" });
  assert.equal(result.verdict, "sealed");
  assert.equal(result.remoteControlAtStartupFalse, true);
  assert.equal(result.rcActive, false);
  assert.equal(result.damperClosed, true);
});

test("24 forced beats ajar when both vscode and toggle-off", () => {
  assert.equal(
    classify({
      neverInvokedRc: true,
      uiDefaultToggleOff: true,
      vscodeNewTab: true,
      rcActive: true,
    }),
    "forced",
  );
});

test("25 ajar beats defaulted when UI toggle is off", () => {
  assert.equal(
    classify({
      neverInvokedRc: true,
      uiDefaultToggleOff: true,
      disableClaudeAiConnectorsTrue: true,
      remoteControlAtStartupAbsent: true,
      rcActive: true,
      liveRemoteUrl: true,
    }),
    "ajar",
  );
});

test("26 defaulted requires connectors-disabled plus startup absent", () => {
  assert.equal(
    classify({
      neverInvokedRc: true,
      disableClaudeAiConnectorsTrue: true,
      remoteControlAtStartupAbsent: true,
      rcActive: true,
      liveRemoteUrl: true,
      toolResultsCrossing: true,
      fileContentsExposed: true,
    }),
    "defaulted",
  );
  assert.equal(
    classify({
      neverInvokedRc: true,
      disableClaudeAiConnectorsTrue: false,
      rcActive: true,
      seenAutoOnNotification: true,
    }),
    "drawn",
  );
});

test("27 bridged does not steal defaulted (connectors case)", () => {
  assert.equal(classify(seed90341Defaulted().probe), "defaulted");
  assert.equal(classify(seedBridged().probe), "bridged");
  assert.notEqual(seed90341Defaulted().probe.disableClaudeAiConnectorsTrue, seedBridged().probe.disableClaudeAiConnectorsTrue);
});

test("28 disclosed requires tool results and no file-content claim", () => {
  assert.equal(
    classify({
      neverInvokedRc: true,
      rcActive: true,
      toolResultsCrossing: true,
      fileContentsExposed: false,
      seenAutoOnNotification: true,
    }),
    "disclosed",
  );
  assert.equal(
    classify({
      neverInvokedRc: true,
      rcActive: true,
      toolResultsCrossing: true,
      fileContentsExposed: true,
      liveRemoteUrl: true,
    }),
    "bridged",
  );
});

test("29 sealed requires explicit false and RC off", () => {
  assert.equal(
    classify({ remoteControlAtStartupFalse: true, rcActive: false, neverInvokedRc: true }),
    "sealed",
  );
  assert.equal(
    classify({ remoteControlAtStartupFalse: true, rcActive: true, neverInvokedRc: false }),
    "vented",
  );
});

test("30 lit is the no-marker auto-trigger", () => {
  assert.equal(
    classify({ neverInvokedRc: true, rcActive: true, surface: "cli" }),
    "lit",
  );
  assert.equal(
    classify({
      neverInvokedRc: true,
      rcActive: true,
      seenAutoOnNotification: true,
    }),
    "drawn",
  );
});

test("31 liveRemoteUrl string is treated as a live URL", () => {
  const probe = cloneProbe({ liveRemoteUrl: "https://claude.ai/code/x" });
  assert.equal(probe.liveRemoteUrl, true);
  assert.equal(probe.remoteUrl, "https://claude.ai/code/x");
});

test("32 nested flue / plate / rc fields clone", () => {
  const probe = cloneProbe({
    flue: { rcActive: true, neverInvokedRc: true, seenAutoOnNotification: true },
  });
  assert.equal(classify(probe), "drawn");
  const plate = cloneProbe({
    plate: { vscodeNewTab: true, rcActive: true, neverInvokedRc: true },
  });
  assert.equal(classify(plate), "forced");
});

test("33 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("defaulted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("drawn"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("forced"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("disclosed"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("banked"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("sealed"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("ajar"), { slack: false, linear: false, github: true, alarm: false });
});

test("34 flueOpen / damperClosed / consented / bridged helpers", () => {
  assert.equal(flueOpenOf(seed90341Defaulted().probe), true);
  assert.equal(damperClosedOf(seed90341Defaulted().probe), false);
  assert.equal(consentedOf(seed90341Defaulted().probe), false);
  assert.equal(bridgedOf(seed90341Defaulted().probe), true);
  assert.equal(flueOpenOf(emptyProbe()), false);
  assert.equal(damperClosedOf(emptyProbe()), true);
  assert.equal(consentedOf(seedVented().probe), true);
  assert.equal(bridgedOf(seedDrawn().probe), false);
  assert.equal(damperClosedOf(seedSealed().probe), true);
});

test("35 feed and reasons never use damper or empty as the idle word", () => {
  const banked = score(emptyProbe());
  assert.equal(banked.idleWord, "banked");
  assert.doesNotMatch(banked.feed, /idle word is damper/i);
  assert.doesNotMatch(banked.feed, /idle word is empty/i);
  assert.ok(banked.reasons.every((line) => !/idle word is damper/i.test(line)));
  assert.ok(banked.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "banked"), /Banked/);
  assert.ok(reasonsOf(emptyProbe(), "banked").some((line) => /idle word is banked/.test(line)));
});

test("36 forbidden idle list includes damper and empty", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("damper"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("latched"));
  assert.ok(!words.includes("banked"));
});

test("37 demo sinks: Slack on alarm; Linear on defaulted/disclosed; GitHub always", async () => {
  const defaulted = decide(seed90341Defaulted());
  const slack = slackDamperAlarm(defaulted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubDamperLedger(defaulted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub damper-ledger/);
  const linear = linearDamperTicket(defaulted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const banked = decide(emptyAction("idle"));
  assert.match(slackDamperAlarm(banked, {}).summary, /Would skip Slack/);
  assert.match(linearDamperTicket(banked, {}).summary, /Would skip Linear/);
  const fired = await fire(defaulted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("38 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const defaulted = decide(seed90341Defaulted());
  const slack = slackDamperAlarm(defaulted, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubDamperLedger(defaulted, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearDamperTicket(defaulted, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("39 Slack skip on ajar / sealed / vented / lit / bridged", () => {
  for (const seed of [seed89568Ajar, seedSealed, seedVented, seed77517Lit, seedBridged]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackDamperAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("40 Linear only on defaulted and disclosed", () => {
  assert.equal(decide(seed90341Defaulted()).linear, true);
  assert.equal(decide(seedDisclosed()).linear, true);
  assert.equal(decide(seedDrawn()).linear, false);
  assert.equal(decide(seed89146Forced()).linear, false);
  assert.equal(decide(seedBanked()).linear, false);
});

test("41 GitHub ledger fires on idle/clear scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const cleared = decide({ action: "bank" });
  assert.equal(cleared.github, true);
});

test("42 handle defaulted / drawn / forced / disclosed deny", async () => {
  const defaulted = await handle(seed90341Defaulted(), {});
  assert.equal(defaulted.permissionDecision, "deny");
  assert.match(defaulted.hookSpecificOutput.decision.message, /defaulted/);
  const drawn = await handle(seedDrawn(), {});
  assert.equal(drawn.permissionDecision, "deny");
  const forced = await handle(seed89146Forced(), {});
  assert.equal(forced.permissionDecision, "deny");
  const disclosed = await handle(seedDisclosed(), {});
  assert.equal(disclosed.permissionDecision, "deny");
});

test("43 handle banked / sealed / vented allow", async () => {
  const banked = await handle({ action: "bank" }, {});
  assert.equal(banked.permissionDecision, "allow");
  assert.match(banked.hookSpecificOutput.decision.message, /banked/);
  const sealed = await handle(seedSealed(), {});
  assert.equal(sealed.permissionDecision, "allow");
  const vented = await handle(seedVented(), {});
  assert.equal(vented.permissionDecision, "allow");
});

test("44 listen GET health and POST empty body is banked", async () => {
  const server = listen(19341);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19341/health");
  const info = await health.json();
  assert.equal(info.product, "damper");
  assert.match(info.verbs, /defaulted/);
  const res = await fetch("http://127.0.0.1:19341/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "banked");
  assert.equal(body.idleWord, "banked");
  const scored = await fetch("http://127.0.0.1:19341/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90341Defaulted()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "defaulted");
  await new Promise((resolve) => server.close(resolve));
});

test("45 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19342);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19342/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19342/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("46 every verdict is uniquely first-match on its seed", () => {
  const map = {
    banked: seedBanked,
    drawn: seedDrawn,
    vented: seedVented,
    ajar: seed89568Ajar,
    forced: seed89146Forced,
    defaulted: seed90341Defaulted,
    bridged: seedBridged,
    disclosed: seedDisclosed,
    sealed: seedSealed,
    lit: seed77517Lit,
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

test("47 admit does not lie on every fault class", () => {
  const rows = [
    ["drawn", seedDrawn],
    ["ajar", seed89568Ajar],
    ["forced", seed89146Forced],
    ["defaulted", seed90341Defaulted],
    ["bridged", seedBridged],
    ["disclosed", seedDisclosed],
    ["sealed", seedSealed],
    ["lit", seed77517Lit],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("48 desk HTML sanity: idle word banked, seeded defaulted, chimney not night-latch", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /banked/);
  assert.match(html, /Throw/);
  assert.match(html, /Bank/);
  assert.match(html, /Draw/);
  assert.match(html, /Observe/);
  assert.match(html, /Sever/);
  assert.match(html, /defaulted/);
  assert.match(html, /90341/);
  assert.match(html, /seedOf\("defaulted"\)|probe = seedOf\("defaulted"\)/);
  assert.doesNotMatch(html, /Admit damper/);
  assert.doesNotMatch(html, /const IDLE_WORD = "damper"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.match(html, /const IDLE_WORD = "banked"/);
  assert.doesNotMatch(html, /Yale|night-latch|oxblood|thumb-turn/);
  assert.doesNotMatch(html, /stillroom|butcher-paper|oil-black|valve train|theatre wing/);
  assert.match(html, /chimney|flue|soot|ember|cast-iron|thermometer/i);
  assert.match(html, /89568/);
  assert.match(html, /89146/);
  assert.match(html, /77517/);
});

test("49 README names Snib contrast and banked idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Snib/);
  assert.match(readme, /NOT Cote \/ Nixie/);
  assert.match(readme, /\*\*banked\*\*/);
  assert.match(readme, /#90341|#90341/);
  assert.match(readme, /#89568|#89568/);
  assert.doesNotMatch(readme, /idle word is damper/i);
});

test("50 score() defaulted includes flueOpen and not consented", () => {
  const result = score(seed90341Defaulted().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "defaulted");
  assert.equal(result.flueOpen, true);
  assert.equal(result.damperClosed, false);
  assert.equal(result.consented, false);
  assert.equal(result.bridged, true);
});

test("51 fire live slack posts when fetch ok", async () => {
  const defaulted = decide(seed90341Defaulted());
  const events = await fire(defaulted, { DAMPER_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted defaulted/);
});

test("52 fire live github and linear paths", async () => {
  const defaulted = decide(seed90341Defaulted());
  const events = await fire(
    defaulted,
    {
      DAMPER_GITHUB_TOKEN: "tok",
      DAMPER_LINEAR_KEY: "lin",
      DAMPER_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "DAM-1", url: "https://linear.app/dam-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /DAM-1/);
});

test("53 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90341Defaulted().probe, "defaulted").some((line) => /#90341/.test(line)));
  assert.ok(reasonsOf(seed89568Ajar().probe, "ajar").some((line) => /#89568/.test(line)));
  assert.ok(reasonsOf(seed89146Forced().probe, "forced").some((line) => /#89146/.test(line)));
  assert.ok(reasonsOf(seed77517Lit().probe, "lit").some((line) => /#77517/.test(line)));
});

test("54 RC off with leftover flags and no sealed hold is banked", () => {
  assert.equal(
    classify({
      neverInvokedRc: true,
      disableClaudeAiConnectorsTrue: true,
      remoteControlAtStartupAbsent: true,
      seenAutoOnNotification: true,
      rcActive: false,
    }),
    "banked",
  );
});
