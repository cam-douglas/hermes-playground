import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fire,
  githubChuteLedger,
  linearChuteTicket,
  slackChuteAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  DEMO_FINGERPRINT,
  DEMO_SECRET_LENGTH,
  DEMO_SECRET_NAME,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  seed44868Leaked,
  seed71654Burned,
  seed77084Brokered,
  seed82796Echoed,
  seed90301Gap,
  seedClear,
  seedMasked,
  seedRetained,
  seedTyped,
  seedVaulted,
  verdictOf,
} from "./chute.mjs";
import { handle } from "./index.mjs";

test("1 seed 90301 gap is gap, slack alarm, idleWord clear", () => {
  const seed = seed90301Gap();
  const result = decide(seed);
  assert.equal(result.verdict, "gap");
  assert.equal(result.state, "gap");
  assert.equal(result.decision, "gap");
  assert.equal(classify(seed.probe), "gap");
  assert.equal(verdictOf(seed.probe), "gap");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.idleWord, "clear");
  assert.equal(IDLE_WORD, "clear");
  assert.doesNotMatch(result.idleWord, /chute/i);
  assert.doesNotMatch(result.idleWord, /paired/i);
  assert.doesNotMatch(result.idleWord, /kernel/i);
  assert.doesNotMatch(result.idleWord, /latched/i);
  assert.equal(result.session, "90301-gap");
  assert.equal(result.issue, 90301);
  assert.equal(result.askUserSecretAvailable, false);
  assert.equal(result.onlyPromptBox, true);
  assert.equal(result.chuteGap, true);
  assert.match(result.feed, /no AskUserSecret/);
  assert.equal(decideSeed(90301).verdict, "gap");
  assert.equal(decideSeed("gap").verdict, "gap");
});

test("2 idle/clear/{} is clear, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "clear");
  assert.equal(result.idleWord, "clear");
  assert.equal(result.verdict, "clear");
  assert.equal(result.decision, "clear");
  assert.equal(result.alarm, false);
  assert.equal(classify({}), "clear");
  assert.equal(classify(emptyProbe()), "clear");
  assert.doesNotMatch(result.state, /chute/i);
  assert.doesNotMatch(result.idleWord, /chute/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "clear");
  assert.equal(cleared.idleWord, "clear");
  assert.equal(cleared.secretInTranscript, false);
  const empty = decide({});
  assert.equal(empty.verdict, "clear");
  assert.equal(empty.idleWord, "clear");
  assert.equal(decide(seedClear()).verdict, "clear");
});

test("3 masked: AskUserSecret panel; value never in transcript", () => {
  const result = decide(seedMasked());
  assert.equal(result.verdict, "masked");
  assert.equal(result.chuteMasked, true);
  assert.equal(result.alarm, false);
  assert.equal(result.channel, "askUserSecret");
  assert.equal(result.sessionMemory, true);
  assert.equal(result.secretInTranscript, false);
  assert.equal(result.secretInModelContext, false);
  assert.equal(result.secretName, DEMO_SECRET_NAME);
  assert.equal(result.secretLength, DEMO_SECRET_LENGTH);
  assert.equal(result.fingerprint, DEMO_FINGERPRINT);
  assert.match(result.feed, /Secret received/);
  assert.match(result.feed, /GITHUB_TOKEN/);
  assert.match(result.feed, /40 chars/);
  assert.match(result.feed, /fp a3f1c8e2/);
  assert.match(result.feed, /session memory/);
  assert.equal(decideSeed("masked").verdict, "masked");
});

test("4 #71654 burned: live PAT in transcript/history/paste-cache", () => {
  const result = decide(seed71654Burned());
  assert.equal(result.verdict, "burned");
  assert.equal(result.issue, 71654);
  assert.equal(result.liveCredentialInTranscript, true);
  assert.equal(result.secretInTranscript, true);
  assert.equal(result.secretInHistory, true);
  assert.equal(result.secretInPasteCache, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(decideSeed(71654).verdict, "burned");
  assert.equal(decideSeed("burned").verdict, "burned");
});

test("5 #82796 echoed: model printed the secret", () => {
  const result = decide(seed82796Echoed());
  assert.equal(result.verdict, "echoed");
  assert.equal(result.issue, 82796);
  assert.equal(result.modelPrintedSecret, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(decideSeed(82796).verdict, "echoed");
  assert.equal(decideSeed("echoed").verdict, "echoed");
});

test("6 typed: user pasted into the prompt box", () => {
  const result = decide(seedTyped());
  assert.equal(result.verdict, "typed");
  assert.equal(result.channel, "prompt");
  assert.equal(result.secretInPrompt, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(decideSeed("typed").verdict, "typed");
});

test("7 #77084 brokered: USE via env inject, never READ", () => {
  const result = decide(seed77084Brokered());
  assert.equal(result.verdict, "brokered");
  assert.equal(result.issue, 77084);
  assert.equal(result.channel, "envInject");
  assert.equal(result.agentCanUse, true);
  assert.equal(result.agentCanRead, false);
  assert.equal(result.secretInModelContext, false);
  assert.equal(result.alarm, false);
  assert.equal(decideSeed(77084).verdict, "brokered");
  assert.equal(decideSeed("brokered").verdict, "brokered");
});

test("8 retained: would reach /bug five-year store", () => {
  const result = decide(seedRetained());
  assert.equal(result.verdict, "retained");
  assert.equal(result.issue, 78344);
  assert.equal(result.wouldReachBugRetention, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(decideSeed(78344).verdict, "retained");
  assert.equal(decideSeed("retained").verdict, "retained");
});

test("9 vaulted: OS keychain / provider vault path", () => {
  const result = decide(seedVaulted());
  assert.equal(result.verdict, "vaulted");
  assert.equal(result.channel, "vault");
  assert.equal(result.alarm, false);
  assert.equal(decideSeed("vaulted").verdict, "vaulted");
});

test("10 #44868 leaked: .env read into transcript", () => {
  const result = decide(seed44868Leaked());
  assert.equal(result.verdict, "leaked");
  assert.equal(result.issue, 44868);
  assert.equal(result.fileReadIntoTranscript, true);
  assert.equal(result.secretInTranscript, true);
  assert.equal(result.alarm, true);
  assert.equal(decideSeed(44868).verdict, "leaked");
  assert.equal(decideSeed(58043).verdict, "leaked");
  assert.equal(decideSeed(59094).verdict, "leaked");
  assert.equal(decideSeed("leaked").verdict, "leaked");
});

test("11 first-match: echoed beats burned when the model printed a live credential", () => {
  const verdict = classify({
    liveCredentialInTranscript: true,
    secretInTranscript: true,
    secretInHistory: true,
    secretInPasteCache: true,
    modelPrintedSecret: true,
  });
  assert.equal(verdict, "echoed");
});

test("12 first-match: burned beats leaked when a live credential is already on disk", () => {
  const verdict = classify({
    liveCredentialInTranscript: true,
    fileReadIntoTranscript: true,
    secretInTranscript: true,
  });
  assert.equal(verdict, "burned");
});

test("13 first-match: leaked beats retained when the file path already wrote the transcript", () => {
  const verdict = classify({
    fileReadIntoTranscript: true,
    secretInTranscript: true,
    wouldReachBugRetention: true,
  });
  assert.equal(verdict, "leaked");
});

test("14 first-match: retained beats typed when /bug would keep the paste", () => {
  const verdict = classify({
    channel: "prompt",
    secretInPrompt: true,
    wouldReachBugRetention: true,
  });
  assert.equal(verdict, "retained");
});

test("15 first-match: typed beats gap when the user pasted into the only box", () => {
  const verdict = classify({
    channel: "prompt",
    secretInPrompt: true,
    onlyPromptBox: true,
    askUserSecretAvailable: false,
    gap: true,
  });
  assert.equal(verdict, "typed");
});

test("16 first-match: vaulted beats brokered on a keychain path", () => {
  const verdict = classify({
    channel: "vault",
    agentCanUse: true,
    agentCanRead: false,
    sessionMemory: true,
  });
  assert.equal(verdict, "vaulted");
});

test("17 first-match: brokered beats masked after env inject", () => {
  const verdict = classify({
    channel: "envInject",
    sessionMemory: true,
    agentCanUse: true,
    agentCanRead: false,
  });
  assert.equal(verdict, "brokered");
});

test("18 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "clear",
    "typed",
    "masked",
    "burned",
    "echoed",
    "retained",
    "brokered",
    "vaulted",
    "leaked",
    "gap",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["typed", "burned", "echoed", "retained", "leaked", "gap"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["burned", "echoed"]);
});

test("19 every seeded class classifies to itself", () => {
  const rows = [
    ["clear", seedClear],
    ["typed", seedTyped],
    ["masked", seedMasked],
    ["burned", seed71654Burned],
    ["echoed", seed82796Echoed],
    ["retained", seedRetained],
    ["brokered", seed77084Brokered],
    ["vaulted", seedVaulted],
    ["leaked", seed44868Leaked],
    ["gap", seed90301Gap],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
  }
});

test("20 admit does not lie: gap stays gap", () => {
  const result = decide({ ...seed90301Gap(), action: "admit" });
  assert.equal(result.verdict, "gap");
  assert.equal(result.action, "admit");
});

test("21 drop uses the sanctioned panel: gap becomes masked", () => {
  const result = decide({ ...seed90301Gap(), action: "drop" });
  assert.equal(result.verdict, "masked");
  assert.equal(result.action, "drop");
  assert.equal(result.channel, "askUserSecret");
  assert.equal(result.sessionMemory, true);
  assert.equal(result.secretInTranscript, false);
});

test("22 inject brokers a masked intake: USE never READ", () => {
  const result = decide({ ...seedMasked(), action: "inject" });
  assert.equal(result.verdict, "brokered");
  assert.equal(result.action, "inject");
  assert.equal(result.agentCanUse, true);
  assert.equal(result.agentCanRead, false);
  assert.equal(result.secretInModelContext, false);
});

test("23 demo sinks: Slack on alarm verdicts; Linear on burned/echoed; GitHub always", async () => {
  const gap = decide(seed90301Gap());
  const slack = slackChuteAlarm(gap, {});
  assert.match(slack.summary, /Would post to Slack/);
  assert.equal(slack.mode, "demo");
  assert.match(linearChuteTicket(gap, {}).summary, /Would skip Linear/);
  assert.match(githubChuteLedger(gap, {}).summary, /Would open a GitHub chute-ledger/);
  const burned = decide(seed71654Burned());
  assert.match(slackChuteAlarm(burned, {}).summary, /Would post to Slack/);
  assert.match(linearChuteTicket(burned, {}).summary, /Would open a Linear/);
  const echoed = decide(seed82796Echoed());
  assert.match(linearChuteTicket(echoed, {}).summary, /Would open a Linear/);
  const masked = decide(seedMasked());
  assert.match(slackChuteAlarm(masked, {}).summary, /Would skip Slack/);
  assert.match(linearChuteTicket(masked, {}).summary, /Would skip Linear/);
  const fired = await fire(gap, {});
  assert.equal(fired.events.length, 3);
  assert.equal(fired.events.every((row) => row.ok === true), true);
});

test("24 handle scores default seed and deny on gap", async () => {
  const out = await handle(seed90301Gap(), {});
  assert.equal(out.verdict, "gap");
  assert.equal(out.permissionDecision, "deny");
  assert.equal(out.idleWord, "clear");
  assert.ok(Array.isArray(out.sinks));
  const idle = await handle({ action: "clear" }, {});
  assert.equal(idle.verdict, "clear");
  assert.equal(idle.permissionDecision, "allow");
});

test("25 no invented issue numbers on seeds", () => {
  const allowed = new Set([90301, 71654, 82796, 77084, 78344, 44868, null]);
  const seeds = [
    seedClear(),
    seedTyped(),
    seedMasked(),
    seed71654Burned(),
    seed82796Echoed(),
    seedRetained(),
    seed77084Brokered(),
    seedVaulted(),
    seed44868Leaked(),
    seed90301Gap(),
  ];
  for (const seed of seeds) {
    assert.ok(allowed.has(seed.issue), String(seed.issue));
  }
});

test("26 never ships a real secret value — fingerprints, names, lengths only", () => {
  const seeds = [
    seedMasked(),
    seed71654Burned(),
    seed82796Echoed(),
    seedTyped(),
    seed77084Brokered(),
    seedRetained(),
    seedVaulted(),
    seed44868Leaked(),
  ];
  const leak = /ghp_|gho_|github_pat_|sk-|AKIA|xox[baprs]-|BEGIN [A-Z ]+PRIVATE KEY/;
  for (const seed of seeds) {
    const packed = JSON.stringify(decide(seed));
    assert.doesNotMatch(packed, leak);
    assert.equal(String(seed.probe.fingerprint || "").length, 8);
  }
  assert.match(feedOf(seedMasked().probe, "masked"), /fp a3f1c8e2/);
  assert.doesNotMatch(feedOf(seedMasked().probe, "masked"), leak);
});
