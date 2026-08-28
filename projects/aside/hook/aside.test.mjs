import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fire,
  githubAsideLedger,
  linearAsideTicket,
  slackAsideAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  DEMO_ANSWER,
  DEMO_PREAMBLE,
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
  seed86108Forked,
  seed90314Preamble,
  seedGhost,
  seedHeard,
  seedInherited,
  seedMuted,
  seedNoticed,
  seedPoisoned,
  seedSticky,
  seedToolish,
  verdictOf,
} from "./aside.mjs";
import { handle } from "./index.mjs";

function assertIdleNeverAside(result) {
  assert.equal(result.idleWord, "heard");
  assert.equal(IDLE_WORD, "heard");
  assert.doesNotMatch(result.idleWord, /aside/i);
  assert.doesNotMatch(result.state, /aside/i);
  assert.doesNotMatch(IDLE_WORD, /aside/i);
}

test("1 seed 90314 preamble is preamble, slack alarm, idleWord heard", () => {
  const seed = seed90314Preamble();
  const result = decide(seed);
  assert.equal(result.verdict, "preamble");
  assert.equal(result.state, "preamble");
  assert.equal(result.decision, "preamble");
  assert.equal(classify(seed.probe), "preamble");
  assert.equal(verdictOf(seed.probe), "preamble");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assertIdleNeverAside(result);
  assert.equal(result.session, "90314-preamble");
  assert.equal(result.issue, 90314);
  assert.equal(result.preambleText, DEMO_PREAMBLE);
  assert.equal(result.silentEnd, true);
  assert.equal(result.hasText, true);
  assert.equal(result.noticeSuppressed, true);
  assert.equal(result.wingPreamble, true);
  assert.match(result.feed, /Let me check that file/);
  assert.match(result.feed, /silent end/);
  assert.equal(decideSeed(90314).verdict, "preamble");
  assert.equal(decideSeed("preamble").verdict, "preamble");
});

test("2 idle/heard/{} is heard, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "heard");
  assert.equal(result.verdict, "heard");
  assert.equal(result.decision, "heard");
  assert.equal(result.alarm, false);
  assert.equal(classify({}), "heard");
  assert.equal(classify(emptyProbe()), "heard");
  assertIdleNeverAside(result);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "heard");
  assert.equal(cleared.idleWord, "heard");
  assert.equal(cleared.silentEnd, false);
  assert.doesNotMatch(cleared.state, /aside/i);
  const empty = decide({});
  assert.equal(empty.verdict, "heard");
  assert.equal(empty.idleWord, "heard");
  assert.equal(decide(seedHeard()).verdict, "heard");
  assert.equal(decide(seedHeard()).fullAnswer, true);
  assert.equal(decide(seedHeard()).answerText, DEMO_ANSWER);
  assert.equal(decide(seedHeard()).toolAttempted, false);
});

test("3 muted: notice suppressed because any text existed", () => {
  const result = decide(seedMuted());
  assert.equal(result.verdict, "muted");
  assert.equal(result.hasText, true);
  assert.equal(result.noticeSuppressed, true);
  assert.equal(result.zeroText, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /suppressed the tool-notice/);
  assert.equal(decideSeed("muted").verdict, "muted");
});

test("4 poisoned: prior truncation sticks; later /btw also fails", () => {
  const result = decide(seedPoisoned());
  assert.equal(result.verdict, "poisoned");
  assert.equal(result.issue, 90314);
  assert.equal(result.priorTruncation, true);
  assert.equal(result.laterBtwFails, true);
  assert.equal(result.btwHistoryAppended, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(decideSeed("poisoned").verdict, "poisoned");
});

test("5 toolish: model attempted a tool in the side channel", () => {
  const result = decide(seedToolish());
  assert.equal(result.verdict, "toolish");
  assert.equal(result.toolAttempted, true);
  assert.equal(result.toolName, "Read");
  assert.equal(result.toolsForbidden, true);
  assert.equal(result.alarm, true);
  assert.equal(decideSeed("toolish").verdict, "toolish");
});

test("6 inherited: tool-first CLAUDE.md / SessionStart infected the wing", () => {
  const result = decide(seedInherited());
  assert.equal(result.verdict, "inherited");
  assert.equal(result.inheritedToolFirst, true);
  assert.equal(result.toolsForbidden, true);
  assert.equal(result.toolAttempted, false);
  assert.equal(result.alarm, true);
  assert.equal(decideSeed("inherited").verdict, "inherited");
});

test("7 ghost: no transcript artifact for the /btw exchange", () => {
  const result = decide(seedGhost());
  assert.equal(result.verdict, "ghost");
  assert.equal(result.ghost, true);
  assert.equal(result.skipTranscript, true);
  assert.equal(result.inTranscript, false);
  assert.equal(result.wingGhost, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /skipTranscript/);
  assert.equal(decideSeed("ghost").verdict, "ghost");
});

test("8 sticky: session-wide all-or-nothing failure mode", () => {
  const result = decide(seedSticky());
  assert.equal(result.verdict, "sticky");
  assert.equal(result.sessionSticky, true);
  assert.equal(result.laterBtwFails, false);
  assert.equal(result.alarm, true);
  assert.equal(decideSeed("sticky").verdict, "sticky");
});

test("9 noticed: zero-text path correctly showed the tool-notice", () => {
  const result = decide(seedNoticed());
  assert.equal(result.verdict, "noticed");
  assert.equal(result.zeroText, true);
  assert.equal(result.noticeShown, true);
  assert.equal(result.toolAttempted, true);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /zero-text path/);
  assert.equal(decideSeed("noticed").verdict, "noticed");
});

test("10 #86108 forked: fork on completed /btw re-submits original", () => {
  const result = decide(seed86108Forked());
  assert.equal(result.verdict, "forked");
  assert.equal(result.issue, 86108);
  assert.equal(result.forkResubmits, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(decideSeed(86108).verdict, "forked");
  assert.equal(decideSeed("forked").verdict, "forked");
});

test("11 first-match: forked beats poisoned when the fork also re-submits", () => {
  const verdict = classify({
    forkResubmits: true,
    priorTruncation: true,
    laterBtwFails: true,
  });
  assert.equal(verdict, "forked");
});

test("12 first-match: poisoned beats sticky when later /btw also fails", () => {
  const verdict = classify({
    priorTruncation: true,
    laterBtwFails: true,
    sessionSticky: true,
    preambleText: DEMO_PREAMBLE,
    silentEnd: true,
  });
  assert.equal(verdict, "poisoned");
});

test("13 first-match: sticky beats preamble when the session latch is up", () => {
  const verdict = classify({
    sessionSticky: true,
    preambleText: DEMO_PREAMBLE,
    silentEnd: true,
    inheritedToolFirst: true,
  });
  assert.equal(verdict, "sticky");
});

test("14 first-match: preamble beats muted when the classic silent end is present", () => {
  const verdict = classify({
    preambleText: DEMO_PREAMBLE,
    silentEnd: true,
    hasText: true,
    noticeSuppressed: true,
  });
  assert.equal(verdict, "preamble");
});

test("15 first-match: muted beats noticed when any text existed", () => {
  const verdict = classify({
    hasText: true,
    noticeSuppressed: true,
    noticeShown: true,
    zeroText: false,
    toolAttempted: true,
  });
  assert.equal(verdict, "muted");
});

test("16 first-match: noticed beats ghost when zero-text showed the notice", () => {
  const verdict = classify({
    noticeShown: true,
    zeroText: true,
    ghost: true,
    toolAttempted: true,
    skipTranscript: true,
  });
  assert.equal(verdict, "noticed");
});

test("17 first-match: ghost beats toolish when the missing artifact is the class", () => {
  const verdict = classify({
    ghost: true,
    toolAttempted: true,
    skipTranscript: true,
    channel: "btw",
  });
  assert.equal(verdict, "ghost");
});

test("18 first-match: toolish beats inherited when the model already called a tool", () => {
  const verdict = classify({
    toolAttempted: true,
    inheritedToolFirst: true,
    toolsForbidden: true,
  });
  assert.equal(verdict, "toolish");
});

test("19 first-match: inherited beats heard when tool-first context is present", () => {
  const verdict = classify({
    inheritedToolFirst: true,
    fullAnswer: true,
    channel: "btw",
  });
  assert.equal(verdict, "inherited");
});

test("20 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "heard",
    "preamble",
    "muted",
    "poisoned",
    "toolish",
    "inherited",
    "ghost",
    "sticky",
    "noticed",
    "forked",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "preamble",
    "muted",
    "poisoned",
    "toolish",
    "inherited",
    "ghost",
    "sticky",
    "forked",
  ]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["preamble", "poisoned"]);
  assert.equal(IDLE_WORD, "heard");
  assert.doesNotMatch(IDLE_WORD, /aside/i);
  assert.doesNotMatch(VERDICTS.join(" "), /aside/i);
});

test("21 every seeded class classifies to itself", () => {
  const rows = [
    ["heard", seedHeard],
    ["preamble", seed90314Preamble],
    ["muted", seedMuted],
    ["poisoned", seedPoisoned],
    ["toolish", seedToolish],
    ["inherited", seedInherited],
    ["ghost", seedGhost],
    ["sticky", seedSticky],
    ["noticed", seedNoticed],
    ["forked", seed86108Forked],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
  }
});

test("22 admit does not lie: preamble stays preamble", () => {
  const result = decide({ ...seed90314Preamble(), action: "admit" });
  assert.equal(result.verdict, "preamble");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /aside/i);
});

test("23 ask on inherited wing produces preamble (the bug)", () => {
  const result = decide({ ...seedInherited(), action: "ask" });
  assert.equal(result.verdict, "preamble");
  assert.equal(result.action, "ask");
  assert.equal(result.preambleText, DEMO_PREAMBLE);
  assert.equal(result.silentEnd, true);
  assert.equal(result.noticeSuppressed, true);
  assert.equal(result.fullAnswer, false);
});

test("24 ask on a quiet wing produces heard", () => {
  const result = decide({ action: "ask", probe: emptyProbe() });
  assert.equal(result.verdict, "heard");
  assert.equal(result.action, "ask");
  assert.equal(result.fullAnswer, true);
  assert.equal(result.answerText, DEMO_ANSWER);
  assert.equal(result.toolAttempted, false);
  assertIdleNeverAside(result);
});

test("25 demo sinks: Slack on alarm verdicts; Linear on preamble/poisoned; GitHub always", async () => {
  const preamble = decide(seed90314Preamble());
  const slack = slackAsideAlarm(preamble, {});
  assert.match(slack.summary, /Would post to Slack/);
  assert.equal(slack.mode, "demo");
  assert.match(linearAsideTicket(preamble, {}).summary, /Would open a Linear/);
  assert.match(githubAsideLedger(preamble, {}).summary, /Would open a GitHub aside-ledger/);
  const poisoned = decide(seedPoisoned());
  assert.match(slackAsideAlarm(poisoned, {}).summary, /Would post to Slack/);
  assert.match(linearAsideTicket(poisoned, {}).summary, /Would open a Linear/);
  const heard = decide(seedHeard());
  assert.match(slackAsideAlarm(heard, {}).summary, /Would skip Slack/);
  assert.match(linearAsideTicket(heard, {}).summary, /Would skip Linear/);
  const noticed = decide(seedNoticed());
  assert.match(slackAsideAlarm(noticed, {}).summary, /Would skip Slack/);
  const fired = await fire(preamble, {});
  assert.equal(fired.events.length, 3);
  assert.equal(fired.events.every((row) => row.ok === true), true);
});

test("26 handle scores default seed and deny on preamble", async () => {
  const out = await handle(seed90314Preamble(), {});
  assert.equal(out.verdict, "preamble");
  assert.equal(out.permissionDecision, "deny");
  assert.equal(out.idleWord, "heard");
  assert.doesNotMatch(out.idleWord, /aside/i);
  assert.ok(Array.isArray(out.sinks));
  const idle = await handle({ action: "clear" }, {});
  assert.equal(idle.verdict, "heard");
  assert.equal(idle.permissionDecision, "allow");
  assert.doesNotMatch(idle.verdict, /aside/i);
});

test("27 no invented issue numbers on seeds", () => {
  const allowed = new Set([90314, 86108, null]);
  const seeds = [
    seedHeard(),
    seed90314Preamble(),
    seedMuted(),
    seedPoisoned(),
    seedToolish(),
    seedInherited(),
    seedGhost(),
    seedSticky(),
    seedNoticed(),
    seed86108Forked(),
  ];
  for (const seed of seeds) {
    assert.ok(allowed.has(seed.issue), String(seed.issue));
  }
});

test("28 idle word is never the product name on any packed result", () => {
  const seeds = [
    seedHeard(),
    seed90314Preamble(),
    seedMuted(),
    seedPoisoned(),
    seedToolish(),
    seedInherited(),
    seedGhost(),
    seedSticky(),
    seedNoticed(),
    seed86108Forked(),
    { action: "clear" },
    {},
  ];
  for (const seed of seeds) {
    const packed = decide(seed);
    assert.equal(packed.idleWord, "heard");
    assert.doesNotMatch(packed.idleWord, /aside/i);
    assert.doesNotMatch(packed.state, /aside/i);
    assert.ok(VERDICTS.includes(packed.verdict), packed.verdict);
  }
  assert.match(feedOf(seed90314Preamble().probe, "preamble"), /Let me check that file/);
  assert.match(feedOf(emptyProbe(), "heard"), /wing quiet/);
});
