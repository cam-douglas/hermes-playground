import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fire,
  githubTappetLedger,
  linearTappetTicket,
  slackTappetAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  OVERSIZE_BYTES,
  SLACK_VERDICTS,
  VERDICTS,
  WAVE_MINUTES,
  classify,
  cloneProbe,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  hookWasAttempted,
  isIdle,
  isOversize,
  reasonsOf,
  score,
  seed19643Slipped,
  seed31114Missed,
  seed40647Missed,
  seed75378Misfiled,
  seed78266Blind,
  seed79616Slipped,
  seed84021Oversize,
  seed85917Slipped,
  seed88086Inert,
  seed90296Missed,
  seed90296Slipped,
  seedFolded,
  seedMute,
  seedSeated,
  seedWave,
  verdictOf,
} from "./tappet.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverTappet(result) {
  assert.equal(result.idleWord, "seated");
  assert.equal(IDLE_WORD, "seated");
  assert.doesNotMatch(result.idleWord, /tappet/i);
  assert.doesNotMatch(result.state, /tappet/i);
  assert.doesNotMatch(IDLE_WORD, /tappet/i);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90296 missed is missed, slack + linear, idleWord seated", () => {
  const seed = seed90296Missed();
  const result = decide(seed);
  assert.equal(result.verdict, "missed");
  assert.equal(result.state, "missed");
  assert.equal(result.decision, "missed");
  assert.equal(classify(seed.probe), "missed");
  assert.equal(verdictOf(seed.probe), "missed");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.modeA, true);
  assert.equal(result.modeB, false);
  assertIdleNeverTappet(result);
  assert.equal(result.session, "90296-missed");
  assert.equal(result.issue, 90296);
  assert.equal(result.midTurn, true);
  assert.equal(result.hookSpawned, false);
  assert.equal(result.sideEffectFile, false);
  assert.match(result.feed, /mode A/);
  assert.equal(decideSeed(90296).verdict, "missed");
  assert.equal(decideSeed("missed").verdict, "missed");
});

test("2 idle/empty/{} is seated, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "seated");
  assert.equal(result.verdict, "seated");
  assert.equal(result.decision, "seated");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(classify({}), "seated");
  assert.equal(classify(emptyProbe()), "seated");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverTappet(result);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "seated");
  assert.equal(cleared.idleWord, "seated");
  assert.equal(cleared.midTurn, false);
  assert.doesNotMatch(cleared.state, /tappet/i);
  const empty = decide({});
  assert.equal(empty.verdict, "seated");
  assert.equal(empty.idleWord, "seated");
});

test("3 healthy seated injection: spawned + additionalContext in transcript", () => {
  const result = decide(seedSeated());
  assert.equal(result.verdict, "seated");
  assert.equal(result.hookSpawned, true);
  assert.equal(result.additionalContextReturned, true);
  assert.equal(result.additionalContextInTranscript, true);
  assert.equal(result.hookTelemetryPresent, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.valveSeated, true);
  assert.match(result.feed, /Seated/);
  assert.equal(decideSeed("seated").verdict, "seated");
});

test("4 slipped: hook ran, additionalContext missing from transcript", () => {
  const result = decide(seed90296Slipped());
  assert.equal(result.verdict, "slipped");
  assert.equal(result.issue, 90296);
  assert.equal(result.hookSpawned, true);
  assert.equal(result.additionalContextReturned, true);
  assert.equal(result.additionalContextInTranscript, false);
  assert.ok(result.sideEffectFile);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.modeB, true);
  assert.match(result.feed, /mode B/);
  assert.equal(decideSeed("slipped").verdict, "slipped");
  assert.equal(decideSeed("90296-slipped").verdict, "slipped");
});

test("5 folded: mid-turn merge, no turn.started, hook did spawn", () => {
  const result = decide(seedFolded());
  assert.equal(result.verdict, "folded");
  assert.equal(result.midTurn, true);
  assert.equal(result.turnStarted, false);
  assert.equal(result.hookSpawned, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /no turn.started/);
  assert.equal(decideSeed("folded").verdict, "folded");
});

test("6 mute: scored attempt with zero hook-execution telemetry", () => {
  const result = decide(seedMute());
  assert.equal(result.verdict, "mute");
  assert.equal(result.hookTelemetryPresent, false);
  assert.equal(result.hookAttempted, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /zero hook-execution telemetry/);
  assert.equal(decideSeed("mute").verdict, "mute");
});

test("7 oversize: output over 10K silently dropped", () => {
  const result = decide(seed84021Oversize());
  assert.equal(result.verdict, "oversize");
  assert.equal(result.issue, 84021);
  assert.ok(result.outputBytes > 10000);
  assert.equal(result.dropped, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /over 10K/);
  assert.equal(decideSeed(84021).verdict, "oversize");
});

test("8 misfiled: SessionStart additionalContext redelivered as origin:human", () => {
  const result = decide(seed75378Misfiled());
  assert.equal(result.verdict, "misfiled");
  assert.equal(result.issue, 75378);
  assert.equal(result.originHumanRedelivery, true);
  assert.equal(result.event, "SessionStart");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /origin:human/);
  assert.equal(decideSeed(75378).verdict, "misfiled");
});

test("9 inert: logged succeeded, never injected", () => {
  const result = decide(seed88086Inert());
  assert.equal(result.verdict, "inert");
  assert.equal(result.issue, 88086);
  assert.equal(result.loggedSucceeded, true);
  assert.equal(result.additionalContextInTranscript, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /logged as succeeded/);
  assert.equal(decideSeed(88086).verdict, "inert");
});

test("10 blind: systemMessage returned, never rendered in Desktop / VS Code", () => {
  const result = decide(seed78266Blind());
  assert.equal(result.verdict, "blind");
  assert.equal(result.issue, 78266);
  assert.equal(result.systemMessageReturned, true);
  assert.equal(result.systemMessageRendered, false);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.match(result.feed, /never rendered/);
  assert.equal(decideSeed(78266).verdict, "blind");
});

test("11 wave: ~30 min loss window that self-recovers", () => {
  const result = decide(seedWave());
  assert.equal(result.verdict, "wave");
  assert.equal(result.lossWindowMinutes, 30);
  assert.equal(result.recovered, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /self-recovers/);
  assert.equal(decideSeed("wave").verdict, "wave");
});

test("12 first-match: idle seated beats every later class", () => {
  assert.equal(classify({}), "seated");
  assert.equal(classify(emptyProbe()), "seated");
});

test("13 first-match: misfiled beats oversize when origin:human redelivery is set", () => {
  assert.equal(
    classify({
      originHumanRedelivery: true,
      outputBytes: 14000,
      dropped: true,
    }),
    "misfiled",
  );
});

test("14 first-match: oversize beats inert when output is dropped", () => {
  assert.equal(
    classify({
      outputBytes: 14000,
      dropped: true,
      loggedSucceeded: true,
      additionalContextInTranscript: false,
    }),
    "oversize",
  );
});

test("15 first-match: inert beats blind when logged succeeded", () => {
  assert.equal(
    classify({
      loggedSucceeded: true,
      additionalContextInTranscript: false,
      systemMessageReturned: true,
      systemMessageRendered: false,
    }),
    "inert",
  );
});

test("16 first-match: blind beats wave when systemMessage is unrendered", () => {
  assert.equal(
    classify({
      systemMessageReturned: true,
      systemMessageRendered: false,
      lossWindowMinutes: 30,
      recovered: true,
    }),
    "blind",
  );
});

test("17 first-match: wave beats missed when the window recovered", () => {
  assert.equal(
    classify({
      lossWindowMinutes: 30,
      recovered: true,
      midTurn: true,
      hookSpawned: false,
    }),
    "wave",
  );
});

test("18 first-match: missed beats folded when the hook never spawned", () => {
  assert.equal(
    classify({
      midTurn: true,
      hookSpawned: false,
      turnStarted: false,
    }),
    "missed",
  );
});

test("19 first-match: folded beats slipped when turn.started is missing", () => {
  assert.equal(
    classify({
      midTurn: true,
      hookSpawned: true,
      turnStarted: false,
      additionalContextReturned: true,
      additionalContextInTranscript: false,
    }),
    "folded",
  );
});

test("20 first-match: slipped beats mute when additionalContext never seated", () => {
  assert.equal(
    classify({
      hookSpawned: true,
      additionalContextReturned: true,
      additionalContextInTranscript: false,
      hookTelemetryPresent: false,
      event: "UserPromptSubmit",
    }),
    "slipped",
  );
});

test("21 first-match: mute beats healthy seated when telemetry is absent", () => {
  assert.equal(
    classify({
      hookSpawned: true,
      additionalContextInTranscript: true,
      additionalContextReturned: true,
      hookTelemetryPresent: false,
      event: "UserPromptSubmit",
    }),
    "mute",
  );
});

test("22 score() returns verdict, reasons, feed, slack, linear, github", () => {
  const result = score(seed90296Missed().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "missed");
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.ok(result.reasons.length > 0);
  assert.match(result.feed, /Missed/);
});

test("23 score() idle probe is seated and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "seated");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
});

test("24 score() seated seed never fires Slack or Linear", () => {
  const result = score(seedSeated().probe);
  assert.equal(result.verdict, "seated");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.alarm, false);
});

test("25 score() blind never fires Slack or Linear", () => {
  const result = score(seed78266Blind().probe);
  assert.equal(result.verdict, "blind");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
});

test("26 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "seated",
    "missed",
    "slipped",
    "folded",
    "mute",
    "oversize",
    "misfiled",
    "inert",
    "blind",
    "wave",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "missed",
    "slipped",
    "folded",
    "mute",
    "oversize",
    "misfiled",
    "inert",
    "wave",
  ]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["missed", "slipped", "inert"]);
  assert.equal(IDLE_WORD, "seated");
  assert.doesNotMatch(IDLE_WORD, /tappet/i);
  assert.doesNotMatch(VERDICTS.join(" "), /tappet/i);
});

test("27 every seeded class classifies to itself", () => {
  const rows = [
    ["seated", seedSeated],
    ["missed", seed90296Missed],
    ["slipped", seed90296Slipped],
    ["folded", seedFolded],
    ["mute", seedMute],
    ["oversize", seed84021Oversize],
    ["misfiled", seed75378Misfiled],
    ["inert", seed88086Inert],
    ["blind", seed78266Blind],
    ["wave", seedWave],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("28 admit does not lie: missed stays missed", () => {
  const result = decide({ ...seed90296Missed(), action: "admit" });
  assert.equal(result.verdict, "missed");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /tappet/i);
});

test("29 admit seated on a healthy probe stays seated", () => {
  const result = decide({ ...seedSeated(), action: "admit" });
  assert.equal(result.verdict, "seated");
  assert.equal(result.action, "admit");
  assertIdleNeverTappet(result);
});

test("30 strike on idle produces seated injection", () => {
  const result = decide({ action: "strike", probe: emptyProbe() });
  assert.equal(result.verdict, "seated");
  assert.equal(result.action, "strike");
  assert.equal(result.hookSpawned, true);
  assert.equal(result.additionalContextInTranscript, true);
  assert.equal(result.hookTelemetryPresent, true);
  assertIdleNeverTappet(result);
});

test("31 strike on a mid-turn missed probe stays missed", () => {
  const result = decide({ ...seed90296Missed(), action: "strike" });
  assert.equal(result.verdict, "missed");
  assert.equal(result.action, "strike");
  assert.equal(result.midTurn, true);
  assert.equal(result.hookSpawned, false);
});

test("32 #31114 corroboration classifies as missed", () => {
  const result = decide(seed31114Missed());
  assert.equal(result.verdict, "missed");
  assert.equal(result.issue, 31114);
  assert.equal(result.midTurn, true);
  assert.equal(result.hookSpawned, false);
  assert.equal(decideSeed(31114).verdict, "missed");
});

test("33 #40647 command skip classifies as missed", () => {
  const result = decide(seed40647Missed());
  assert.equal(result.verdict, "missed");
  assert.equal(result.issue, 40647);
  assert.equal(decideSeed(40647).verdict, "missed");
});

test("34 #19643 systemMessage not injected classifies as slipped", () => {
  const result = decide(seed19643Slipped());
  assert.equal(result.verdict, "slipped");
  assert.equal(result.issue, 19643);
  assert.equal(result.systemMessageReturned, true);
  assert.equal(decideSeed(19643).verdict, "slipped");
});

test("35 #85917 SubagentStop additionalContext classifies as slipped", () => {
  const result = decide(seed85917Slipped());
  assert.equal(result.verdict, "slipped");
  assert.equal(result.event, "SubagentStop");
  assert.equal(result.issue, 85917);
});

test("36 #79616 PostToolUse additionalContext classifies as slipped", () => {
  const result = decide(seed79616Slipped());
  assert.equal(result.verdict, "slipped");
  assert.equal(result.event, "PostToolUse");
  assert.equal(result.issue, 79616);
});

test("37 outputBytes 10000 is not oversize", () => {
  assert.equal(OVERSIZE_BYTES, 10000);
  assert.equal(
    classify({
      outputBytes: 10000,
      dropped: true,
      hookSpawned: true,
      additionalContextInTranscript: true,
      hookTelemetryPresent: true,
    }),
    "seated",
  );
  assert.equal(isOversize({ outputBytes: 10000, dropped: true }), false);
  assert.equal(isOversize({ outputBytes: 10001, dropped: true }), true);
});

test("38 outputBytes 10001 without dropped is not oversize", () => {
  assert.equal(
    classify({
      outputBytes: 14000,
      dropped: false,
      hookSpawned: true,
      additionalContextReturned: true,
      additionalContextInTranscript: true,
      hookTelemetryPresent: true,
    }),
    "seated",
  );
});

test("39 loss window 19 minutes is not wave", () => {
  assert.equal(WAVE_MINUTES, 20);
  assert.equal(
    classify({
      lossWindowMinutes: 19,
      recovered: true,
      hookSpawned: true,
      additionalContextInTranscript: true,
      hookTelemetryPresent: true,
    }),
    "seated",
  );
});

test("40 loss window 20 minutes recovered is wave", () => {
  assert.equal(
    classify({
      lossWindowMinutes: 20,
      recovered: true,
      hookSpawned: true,
      additionalContextInTranscript: true,
      hookTelemetryPresent: true,
    }),
    "wave",
  );
});

test("41 loss window without recovery is not wave", () => {
  assert.equal(
    classify({
      lossWindowMinutes: 30,
      recovered: false,
      hookSpawned: true,
      additionalContextInTranscript: true,
      hookTelemetryPresent: true,
    }),
    "seated",
  );
});

test("42 demo sinks: Slack on alarm verdicts; Linear on missed/slipped/inert; GitHub always", async () => {
  const missed = decide(seed90296Missed());
  const slack = slackTappetAlarm(missed, {});
  assert.match(slack.summary, /Would post to Slack/);
  assert.equal(slack.mode, "demo");
  assert.match(linearTappetTicket(missed, {}).summary, /Would open a Linear/);
  assert.match(githubTappetLedger(missed, {}).summary, /Would open a GitHub tappet-ledger/);
  const slipped = decide(seed90296Slipped());
  assert.match(slackTappetAlarm(slipped, {}).summary, /Would post to Slack/);
  assert.match(linearTappetTicket(slipped, {}).summary, /Would open a Linear/);
  const inert = decide(seed88086Inert());
  assert.match(slackTappetAlarm(inert, {}).summary, /Would post to Slack/);
  assert.match(linearTappetTicket(inert, {}).summary, /Would open a Linear/);
  const seated = decide(seedSeated());
  assert.match(slackTappetAlarm(seated, {}).summary, /Would skip Slack/);
  assert.match(linearTappetTicket(seated, {}).summary, /Would skip Linear/);
  const blind = decide(seed78266Blind());
  assert.match(slackTappetAlarm(blind, {}).summary, /Would skip Slack/);
  assert.match(linearTappetTicket(blind, {}).summary, /Would skip Linear/);
  const fired = await fire(missed, {});
  assert.equal(fired.events.length, 3);
  assert.equal(fired.events.every((row) => row.ok === true), true);
});

test("43 seated never fires Slack even when a webhook is present", () => {
  const seated = decide(seedSeated());
  const slack = slackTappetAlarm(seated, { TAPPET_SLACK_WEBHOOK: "https://hooks.example/x" });
  assert.match(slack.summary, /Would skip Slack/);
  assert.equal(slack.mode, "demo");
  assert.equal(seated.alarm, false);
});

test("44 missing secrets stay demo, never a fake live 200", () => {
  const missed = decide(seed90296Missed());
  assert.equal(slackTappetAlarm(missed, {}).mode, "demo");
  assert.equal(githubTappetLedger(missed, {}).mode, "demo");
  assert.equal(linearTappetTicket(missed, {}).mode, "demo");
  const seated = decide(seedSeated());
  assert.equal(slackTappetAlarm(seated, {}).mode, "demo");
  assert.equal(linearTappetTicket(seated, {}).mode, "demo");
});

test("45 live Slack plan only when webhook + alarm verdict", () => {
  const missed = decide(seed90296Missed());
  const live = slackTappetAlarm(missed, { TAPPET_SLACK_WEBHOOK: "https://hooks.example/x" });
  assert.equal(live.mode, "live");
  assert.equal(live.ok, null);
  assert.match(live.summary, /Posting missed/);
});

test("46 live GitHub plan only when token present", () => {
  const seated = decide(seedSeated());
  const live = githubTappetLedger(seated, { TAPPET_GITHUB_TOKEN: "tok" });
  assert.equal(live.mode, "live");
  assert.equal(live.tokenPresent, true);
  assert.match(live.line, /tappet/);
});

test("47 live Linear plan only when key + missed/slipped/inert", () => {
  const missed = decide(seed90296Missed());
  const live = linearTappetTicket(missed, { LINEAR_API_KEY: "lin_key" });
  assert.equal(live.mode, "live");
  assert.match(live.summary, /Opening Linear ticket/);
  const seated = decide(seedSeated());
  assert.equal(linearTappetTicket(seated, { LINEAR_API_KEY: "lin_key" }).mode, "demo");
});

test("48 handle scores default seed and deny on missed", async () => {
  const out = await handle(seed90296Missed(), {});
  assert.equal(out.verdict, "missed");
  assert.equal(out.permissionDecision, "deny");
  assert.equal(out.idleWord, "seated");
  assert.equal(out.hook_event_name, "UserPromptSubmit");
  assert.doesNotMatch(out.idleWord, /tappet/i);
  assert.ok(Array.isArray(out.sinks));
  const idle = await handle({ action: "clear" }, {});
  assert.equal(idle.verdict, "seated");
  assert.equal(idle.permissionDecision, "allow");
  assert.doesNotMatch(idle.verdict, /tappet/i);
});

test("49 handle seated allows; handle slipped denies", async () => {
  const seated = await handle(seedSeated(), {});
  assert.equal(seated.verdict, "seated");
  assert.equal(seated.permissionDecision, "allow");
  const slipped = await handle(seed90296Slipped(), {});
  assert.equal(slipped.verdict, "slipped");
  assert.equal(slipped.permissionDecision, "deny");
});

test("50 handle blind allows because blind is not an alarm", async () => {
  const out = await handle(seed78266Blind(), {});
  assert.equal(out.verdict, "blind");
  assert.equal(out.permissionDecision, "allow");
  assert.equal(out.alarm, false);
});

test("51 no invented issue numbers on seeds", () => {
  const allowed = new Set([
    90296, 31114, 40647, 19643, 88086, 84021, 85917, 78266, 75378, 79616, null,
  ]);
  const seeds = [
    seedSeated(),
    seed90296Missed(),
    seed31114Missed(),
    seed40647Missed(),
    seed90296Slipped(),
    seed19643Slipped(),
    seed85917Slipped(),
    seed79616Slipped(),
    seedFolded(),
    seedMute(),
    seed84021Oversize(),
    seed75378Misfiled(),
    seed88086Inert(),
    seed78266Blind(),
    seedWave(),
  ];
  for (const seed of seeds) {
    assert.ok(allowed.has(seed.issue), String(seed.issue));
  }
});

test("52 idle word is never the product name on any packed result", () => {
  const seeds = [
    seedSeated(),
    seed90296Missed(),
    seed90296Slipped(),
    seedFolded(),
    seedMute(),
    seed84021Oversize(),
    seed75378Misfiled(),
    seed88086Inert(),
    seed78266Blind(),
    seedWave(),
    { action: "clear" },
    {},
  ];
  for (const seed of seeds) {
    const packed = decide(seed);
    assert.equal(packed.idleWord, "seated");
    assert.doesNotMatch(packed.idleWord, /tappet/i);
    assert.doesNotMatch(packed.state, /tappet/i);
    assert.ok(VERDICTS.includes(packed.verdict), packed.verdict);
  }
});

test("53 idle word is never a reused product idle word", () => {
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("heard"));
  assert.ok(banned.includes("clear"));
  assert.ok(banned.includes("paired"));
  assert.ok(banned.includes("tappet"));
  assert.ok(!banned.includes("seated"));
  for (const word of banned) {
    assert.notEqual(IDLE_WORD, word, word);
  }
});

test("54 flagsOf seated: slack false, linear false, github true", () => {
  const flags = flagsOf("seated");
  assert.equal(flags.slack, false);
  assert.equal(flags.linear, false);
  assert.equal(flags.github, true);
  assert.equal(flags.alarm, false);
});

test("55 flagsOf missed: slack true, linear true, github true", () => {
  const flags = flagsOf("missed");
  assert.equal(flags.slack, true);
  assert.equal(flags.linear, true);
  assert.equal(flags.github, true);
  assert.equal(flags.alarm, true);
});

test("56 flagsOf folded: slack true, linear false", () => {
  const flags = flagsOf("folded");
  assert.equal(flags.slack, true);
  assert.equal(flags.linear, false);
});

test("57 flagsOf mute: slack true, linear false", () => {
  assert.equal(flagsOf("mute").slack, true);
  assert.equal(flagsOf("mute").linear, false);
});

test("58 flagsOf oversize: slack true, linear false", () => {
  assert.equal(flagsOf("oversize").slack, true);
  assert.equal(flagsOf("oversize").linear, false);
});

test("59 flagsOf misfiled: slack true, linear false", () => {
  assert.equal(flagsOf("misfiled").slack, true);
  assert.equal(flagsOf("misfiled").linear, false);
});

test("60 flagsOf wave: slack true, linear false", () => {
  assert.equal(flagsOf("wave").slack, true);
  assert.equal(flagsOf("wave").linear, false);
});

test("61 cloneProbe reads nested hook / valve objects", () => {
  const next = cloneProbe({
    hook: { event: "UserPromptSubmit", midTurn: true },
    valve: { hookSpawned: false },
  });
  assert.equal(next.event, "UserPromptSubmit");
  assert.equal(next.midTurn, true);
  assert.equal(next.hookSpawned, false);
});

test("62 cloneProbe accepts a string side-effect path", () => {
  const next = cloneProbe({ sideEffectFile: "/tmp/hook.out" });
  assert.equal(next.sideEffectFile, "/tmp/hook.out");
  assert.match(reasonsOf(next, "slipped").join(" "), /\/tmp\/hook.out/);
});

test("63 hookWasAttempted is false on idle and true on event", () => {
  assert.equal(hookWasAttempted(emptyProbe()), false);
  assert.equal(hookWasAttempted({ event: "UserPromptSubmit" }), true);
  assert.equal(hookWasAttempted({ hookAttempted: true }), true);
  assert.equal(hookWasAttempted({ scored: true }), true);
});

test("64 feed lines name each class", () => {
  assert.match(feedOf(emptyProbe(), "seated"), /Seated/);
  assert.match(feedOf(seed90296Missed().probe, "missed"), /Missed/);
  assert.match(feedOf(seed90296Slipped().probe, "slipped"), /Slipped/);
  assert.match(feedOf(seedFolded().probe, "folded"), /Folded/);
  assert.match(feedOf(seedMute().probe, "mute"), /Mute/);
  assert.match(feedOf(seed84021Oversize().probe, "oversize"), /Oversize/);
  assert.match(feedOf(seed75378Misfiled().probe, "misfiled"), /Misfiled/);
  assert.match(feedOf(seed88086Inert().probe, "inert"), /Inert/);
  assert.match(feedOf(seed78266Blind().probe, "blind"), /Blind/);
  assert.match(feedOf(seedWave().probe, "wave"), /Wave/);
});

test("65 reasons mention mode A and mode B on the primary seed", () => {
  const missed = reasonsOf(seed90296Missed().probe, "missed");
  assert.ok(missed.some((line) => /mode A/.test(line)));
  const slipped = reasonsOf(seed90296Slipped().probe, "slipped");
  assert.ok(slipped.some((line) => /mode B/.test(line)));
});

test("66 decideSeed accepts numeric and string keys", () => {
  assert.equal(decideSeed(90296).verdict, "missed");
  assert.equal(decideSeed("90296-slipped").verdict, "slipped");
  assert.equal(decideSeed("84021-oversize").verdict, "oversize");
  assert.equal(decideSeed("75378-misfiled").verdict, "misfiled");
  assert.equal(decideSeed("88086-inert").verdict, "inert");
  assert.equal(decideSeed("78266-blind").verdict, "blind");
});

test("67 nested action objects are accepted", () => {
  const result = decide({
    action: { action: "score", session: "nested", probe: seed90296Missed().probe },
  });
  assert.equal(result.verdict, "missed");
  assert.equal(result.action, "score");
  assert.equal(result.midTurn, true);
  assert.equal(result.hookSpawned, false);
});

test("68 fire with live Slack fetch records ok from response", async () => {
  const missed = decide(seed90296Missed());
  const fired = await fire(
    missed,
    { TAPPET_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({ ok: true, status: 200, json: async () => ({}) }),
  );
  assert.equal(fired.events[0].adapter, "slack");
  assert.equal(fired.events[0].ok, true);
});

test("69 fire with failing Slack fetch stays honest", async () => {
  const missed = decide(seed90296Missed());
  const fired = await fire(
    missed,
    { TAPPET_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({ ok: false, status: 500, json: async () => ({}) }),
  );
  assert.equal(fired.events[0].ok, false);
  assert.match(fired.events[0].summary, /HTTP 500/);
});

test("70 fire GitHub live uses tappet-ledger.jsonl", async () => {
  const seated = decide(seedSeated());
  const fired = await fire(
    seated,
    { TAPPET_GITHUB_TOKEN: "tok" },
    async (_url, init) => {
      const body = JSON.parse(init.body);
      assert.ok(body.files["tappet-ledger.jsonl"]);
      return { ok: true, status: 201, json: async () => ({ id: "g1" }) };
    },
  );
  const github = fired.events.find((row) => row.adapter === "github");
  assert.equal(github.ok, true);
  assert.match(github.summary, /g1/);
});

test("71 fire Linear live opens an issue when GraphQL succeeds", async () => {
  const missed = decide(seed90296Missed());
  const fired = await fire(
    missed,
    { LINEAR_API_KEY: "lin", TAPPET_LINEAR_TEAM: "team_1" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        data: { issueCreate: { success: true, issue: { id: "1", identifier: "T-1", url: "https://linear.app/t-1" } } },
      }),
    }),
  );
  const linear = fired.events.find((row) => row.adapter === "linear");
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /T-1/);
});

test("72 fire Linear live failure stays honest", async () => {
  const missed = decide(seed90296Missed());
  const fired = await fire(
    missed,
    { LINEAR_API_KEY: "lin" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({ errors: [{ message: "no team" }] }),
    }),
  );
  const linear = fired.events.find((row) => row.adapter === "linear");
  assert.equal(linear.ok, false);
  assert.match(linear.summary, /failed/);
});

test("73 listen serves health then can be closed", async () => {
  const server = listen(19296);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19296/health");
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.product, "tappet");
  assert.match(body.verbs, /seated/);
  await new Promise((resolve) => server.close(resolve));
});

test("74 listen POST scores a missed probe", async () => {
  const server = listen(19297);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19297/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90296Missed()),
  });
  const body = await res.json();
  assert.equal(body.verdict, "missed");
  assert.equal(body.permissionDecision, "deny");
  await new Promise((resolve) => server.close(resolve));
});

test("75 listen rejects non-JSON POST", async () => {
  const server = listen(19298);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19298/", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "not-json",
  });
  assert.equal(res.status, 400);
  await new Promise((resolve) => server.close(resolve));
});

test("76 listen rejects GET that is not health", async () => {
  const server = listen(19299);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19299/other");
  assert.equal(res.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("77 mode A and mode B stay distinguishable on #90296", () => {
  assert.equal(classify(seed90296Missed().probe), "missed");
  assert.equal(classify(seed90296Slipped().probe), "slipped");
  assert.notEqual(seed90296Missed().probe.hookSpawned, seed90296Slipped().probe.hookSpawned);
  assert.notEqual(
    seed90296Missed().probe.additionalContextReturned,
    seed90296Slipped().probe.additionalContextReturned,
  );
});

test("78 slack alarm list never includes seated or blind", () => {
  assert.equal(SLACK_VERDICTS.includes("seated"), false);
  assert.equal(SLACK_VERDICTS.includes("blind"), false);
  assert.equal(LINEAR_VERDICTS.includes("seated"), false);
  assert.equal(LINEAR_VERDICTS.includes("blind"), false);
});

test("79 score reasons always include spawn and transcript lines", () => {
  const seated = score(seedSeated().probe);
  assert.ok(seated.reasons.some((line) => /hook process spawned/.test(line)));
  assert.ok(seated.reasons.some((line) => /present in the model transcript/.test(line)));
  const missed = score(seed90296Missed().probe);
  assert.ok(missed.reasons.some((line) => /never spawned/.test(line)));
});

test("80 fire fetch throw stays honest", async () => {
  const missed = decide(seed90296Missed());
  const fired = await fire(
    missed,
    { TAPPET_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => {
      throw new Error("network down");
    },
  );
  assert.equal(fired.events[0].ok, false);
  assert.match(fired.events[0].summary, /network down/);
});
