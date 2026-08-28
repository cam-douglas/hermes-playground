import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fire,
  githubSnibLedger,
  linearSnibIncident,
  slackSnibAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  FAIL_CLOSED,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  seed87863Phantom,
  seed90265Dismissed,
  seed90265Revoked,
  seed90265Unobserved,
  seed90266Open,
  seedAttached,
  seedLatched,
  seedRestored,
  verdictOf,
} from "./snib.mjs";
import { handle } from "./index.mjs";

test("1 seed 90265 dismissed is dismissed, fail-closed, idleWord latched", () => {
  const seed = seed90265Dismissed();
  const result = decide(seed);
  assert.equal(result.verdict, "dismissed");
  assert.equal(result.state, "dismissed");
  assert.equal(result.decision, "dismissed");
  assert.equal(classify(seed.probe), "dismissed");
  assert.equal(verdictOf(seed.probe), "dismissed");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.idleWord, "latched");
  assert.equal(IDLE_WORD, "latched");
  assert.doesNotMatch(result.idleWord, /snib/i);
  assert.doesNotMatch(result.idleWord, /locked/i);
  assert.doesNotMatch(result.idleWord, /upheld/i);
  assert.doesNotMatch(result.idleWord, /sterling/i);
  assert.doesNotMatch(result.idleWord, /home/i);
  assert.equal(result.session, "90265-dismissed");
  assert.equal(result.issue, 90265);
  assert.equal(result.modalChoice, "not-now");
  assert.equal(result.liveSessionStillAttached, true);
  assert.equal(result.toolExecutionAfterDecline, true);
  assert.equal(result.hostLogMentionsVerify, false);
  assert.equal(result.doorAjar, true);
  assert.equal(result.snibThrown, true);
  assert.equal(result.latchInStrike, false);
  assert.equal(decideSeed(90265).verdict, "dismissed");
  assert.equal(decideSeed("dismissed").verdict, "dismissed");
});

test("2 idle/clear/{} is latched, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "latched");
  assert.equal(result.idleWord, "latched");
  assert.equal(result.verdict, "latched");
  assert.equal(result.decision, "latched");
  assert.equal(result.alarm, false);
  assert.equal(classify({}), "latched");
  assert.equal(classify(emptyProbe()), "latched");
  assert.doesNotMatch(result.state, /snib/i);
  assert.doesNotMatch(result.idleWord, /snib/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "latched");
  assert.equal(cleared.idleWord, "latched");
  assert.equal(cleared.enrolledCount, 0);
  const empty = decide({});
  assert.equal(empty.verdict, "latched");
  assert.equal(empty.idleWord, "latched");
});

test("3 #90265 revoked: enrolled wiped, live session still attached", () => {
  const result = decide(seed90265Revoked());
  assert.equal(result.verdict, "revoked");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.issue, 90265);
  assert.equal(result.revokedAll, true);
  assert.equal(result.enrolledCount, 0);
  assert.equal(result.liveSessionStillAttached, true);
  assert.equal(decideSeed("revoked").verdict, "revoked");
});

test("4 #90265 unobserved: host log heartbeats only", () => {
  const result = decide(seed90265Unobserved());
  assert.equal(result.verdict, "unobserved");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.hostLogMentionsVerify, false);
  assert.equal(result.liveSessionStillAttached, true);
  assert.ok(result.modalShown || result.cookieOnly);
  assert.ok(result.reasons.some((row) => /host log silent/i.test(row)));
  assert.equal(decideSeed("unobserved").verdict, "unobserved");
});

test("5 #90266 open: no enforcement toggle, cookie-only attachment", () => {
  const result = decide(seed90266Open());
  assert.equal(result.verdict, "open");
  assert.equal(result.issue, 90266);
  assert.equal(result.enforcementToggleAvailable, false);
  assert.equal(result.cookieOnly, true);
  assert.equal(result.liveSessionStillAttached, true);
  assert.equal(result.hostLogMentionsVerify, true);
  assert.equal(result.alarm, false);
  assert.equal(decideSeed(90266).verdict, "open");
});

test("6 #87863 phantom: dead 404 environment, modal shown", () => {
  const result = decide(seed87863Phantom());
  assert.equal(result.verdict, "phantom");
  assert.equal(result.issue, 87863);
  assert.equal(result.envGone404, true);
  assert.equal(result.modalShown, true);
  assert.equal(result.alarm, false);
  assert.equal(decideSeed(87863).verdict, "phantom");
});

test("7 attached: never-enrolled device, cookie only", () => {
  const result = decide(seedAttached());
  assert.equal(result.verdict, "attached");
  assert.equal(result.enrolledCount, 0);
  assert.equal(result.cookieOnly, true);
  assert.equal(result.liveSessionStillAttached, true);
  assert.equal(result.enforcementToggleAvailable, true);
  assert.equal(result.alarm, false);
  assert.equal(decideSeed("attached").verdict, "attached");
});

test("8 restored: decline or revoke actually dropped the session", () => {
  const result = decide(seedRestored());
  assert.equal(result.verdict, "restored");
  assert.equal(result.restored, true);
  assert.equal(result.liveSessionStillAttached, false);
  assert.equal(result.alarm, false);
  assert.equal(result.snibThrown, false);
  assert.equal(decideSeed("restored").verdict, "restored");
});

test("9 latched: enrolled device, enforcement held, door shut", () => {
  const result = decide(seedLatched());
  assert.equal(result.verdict, "latched");
  assert.equal(result.enrolledCount > 0, true);
  assert.equal(result.enforcementToggleAvailable, true);
  assert.equal(result.cookieOnly, false);
  assert.equal(result.latchInStrike, true);
  assert.equal(result.doorAjar, false);
  assert.equal(result.alarm, false);
  assert.equal(decideSeed("latched").verdict, "latched");
});

test("10 restored via action drops a live dismissed session", () => {
  const result = decide({ ...seed90265Dismissed(), action: "restore" });
  assert.equal(result.verdict, "restored");
  assert.equal(result.liveSessionStillAttached, false);
  assert.equal(result.restored, true);
});

test("11 not-now action on a live cookie session is dismissed", () => {
  const result = decide({
    action: "not-now",
    probe: {
      plan: "max-individual",
      enrolledCount: 1,
      liveSessionStillAttached: true,
      cookieOnly: true,
    },
  });
  assert.equal(result.verdict, "dismissed");
  assert.equal(result.modalChoice, "not-now");
  assert.equal(result.toolExecutionAfterDecline, true);
});

test("12 revoke action keeps the live session and scores revoked", () => {
  const result = decide({
    action: "revoke",
    probe: {
      plan: "max-individual",
      enrolledCount: 3,
      liveSessionStillAttached: true,
      cookieOnly: true,
    },
  });
  assert.equal(result.verdict, "revoked");
  assert.equal(result.enrolledCount, 0);
  assert.equal(result.revokedAll, true);
  assert.equal(result.liveSessionStillAttached, true);
});

test("13 observe on heartbeat-only log is unobserved when not dismissed/revoked", () => {
  const result = decide({
    action: "observe",
    probe: {
      plan: "max-individual",
      enrolledCount: 2,
      liveSessionStillAttached: true,
      modalShown: true,
      cookieOnly: true,
      hostLog: "CCRClient heartbeat ok epoch=3",
    },
  });
  assert.equal(result.verdict, "unobserved");
  assert.equal(result.hostLogMentionsVerify, false);
});

test("14 restored also holds when session is read-only", () => {
  const result = classify({
    plan: "max-individual",
    restored: true,
    liveSessionStillAttached: true,
    sessionReadOnly: true,
  });
  assert.equal(result, "restored");
});

test("15 first-match: dismissed beats unobserved on the same Not now probe", () => {
  const verdict = classify({
    plan: "max-individual",
    enrolledCount: 2,
    liveSessionStillAttached: true,
    modalShown: true,
    modalChoice: "not-now",
    hostLogMentionsVerify: false,
    toolExecutionAfterDecline: true,
    cookieOnly: true,
  });
  assert.equal(verdict, "dismissed");
});

test("16 first-match: revoked beats unobserved when enrolled is wiped", () => {
  const verdict = classify({
    plan: "max-individual",
    enrolledCount: 0,
    revokedAll: true,
    liveSessionStillAttached: true,
    hostLogMentionsVerify: false,
    cookieOnly: true,
  });
  assert.equal(verdict, "revoked");
});

test("17 verdict vocabulary is exactly the eight words", () => {
  assert.deepEqual(VERDICTS, [
    "latched",
    "dismissed",
    "revoked",
    "unobserved",
    "attached",
    "phantom",
    "open",
    "restored",
  ]);
  assert.deepEqual(FAIL_CLOSED, ["dismissed", "revoked", "unobserved"]);
  assert.deepEqual(ALARM_VERDICTS, FAIL_CLOSED);
  assert.deepEqual(SLACK_VERDICTS, FAIL_CLOSED);
  assert.deepEqual(LINEAR_VERDICTS, ["dismissed", "revoked"]);
});

test("18 demo sinks: Slack/Linear fire only on the named verdicts; GitHub always", async () => {
  const dismissed = decide(seed90265Dismissed());
  const slack = slackSnibAlarm(dismissed, {});
  assert.match(slack.summary, /Would post to Slack/);
  assert.equal(slack.mode, "demo");
  const linear = linearSnibIncident(dismissed, {});
  assert.match(linear.summary, /Would open a Linear/);
  const github = githubSnibLedger(dismissed, {});
  assert.match(github.summary, /Would append a GitHub snib ledger/);
  const latched = decide(seedLatched());
  assert.match(slackSnibAlarm(latched, {}).summary, /Would skip Slack/);
  assert.match(linearSnibIncident(latched, {}).summary, /Would skip Linear/);
  const fired = await fire(dismissed, {});
  assert.equal(fired.events.length, 3);
  assert.equal(fired.events.every((row) => row.ok === true), true);
});

test("19 handle scores default seed and deny on dismissed", async () => {
  const out = await handle(seed90265Dismissed(), {});
  assert.equal(out.verdict, "dismissed");
  assert.equal(out.permissionDecision, "deny");
  assert.equal(out.idleWord, "latched");
  assert.ok(Array.isArray(out.sinks));
  const idle = await handle({ action: "clear" }, {});
  assert.equal(idle.verdict, "latched");
  assert.equal(idle.permissionDecision, "allow");
});
