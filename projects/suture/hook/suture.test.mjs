import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubSutureLedger, linearUnrecoveredTearTicket, slackTearAlarm } from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  VERDICTS,
  decide,
  decideSeed,
  emptyAction,
  emptyTray,
  hasIncompleteTool,
  lastCompleteToolBoundary,
  seed33949,
  seed46987,
  seed47252,
  seed54434,
  seed70217,
  snapshotToCheckpoint,
} from "./suture.mjs";
import { handle } from "./index.mjs";

test("1 seed 46987 is partial, alarm, idleWord sealed, incomplete tool after checkpoint", () => {
  const seed = seed46987();
  const result = decide(seed);
  assert.equal(result.verdict, "partial");
  assert.equal(result.state, "partial");
  assert.equal(result.decision, "partial");
  assert.equal(result.alarm, true);
  assert.equal(result.idleWord, "sealed");
  assert.equal(IDLE_WORD, "sealed");
  assert.doesNotMatch(result.idleWord, /suture/i);
  assert.equal(result.session, "46987");
  assert.equal(result.issue, 46987);
  assert.equal(result.tear.kind, "idle_timeout");
  assert.match(result.tear.message, /Stream idle timeout - partial response received/);
  assert.equal(result.incompleteTool, true);
  assert.ok(result.checkpoint >= 0);
  assert.equal(result.events[result.checkpoint].type, "tool_result");
  assert.equal(result.events[result.checkpoint].id, "tu1");
  assert.equal(hasIncompleteTool(result.events), true);
  assert.equal(decideSeed(46987).verdict, "partial");
  assert.equal(decideSeed(seed46987).verdict, "partial");
  assert.equal(decideSeed("46987").verdict, "partial");
});

test("2 idle/clear/{} is sealed, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "sealed");
  assert.equal(result.idleWord, "sealed");
  assert.equal(result.verdict, "sealed");
  assert.equal(result.decision, "sealed");
  assert.equal(result.alarm, false);
  assert.deepEqual(emptyTray().events, []);
  assert.equal(emptyTray().tear, null);
  assert.doesNotMatch(result.state, /suture/i);
  assert.doesNotMatch(result.idleWord, /suture/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "sealed");
  assert.equal(cleared.idleWord, "sealed");
  assert.equal(cleared.events.length, 0);
  assert.equal(cleared.tear, null);
  assert.doesNotMatch(cleared.state, /suture/i);
  assert.doesNotMatch(cleared.idleWord, /suture/i);
  const empty = decide({});
  assert.equal(empty.verdict, "sealed");
  assert.equal(empty.idleWord, "sealed");
  assert.doesNotMatch(empty.idleWord, /suture/i);
});

test("3 seed 54434 is stalled, connection still open, no message_stop", () => {
  const result = decide(seed54434());
  assert.equal(result.verdict, "stalled");
  assert.equal(result.alarm, true);
  assert.equal(result.issue, 54434);
  assert.equal(result.connection, "open");
  assert.equal(result.messageStop, false);
  assert.equal(result.tear.kind, "stall");
  assert.match(result.tear.message, /message_stop/);
  assert.ok(!result.events.some((event) => event.type === "message_stop"));
});

test("4 seed 70217 is torn, connection closed mid-response after content blocks", () => {
  const result = decide(seed70217());
  assert.equal(result.verdict, "torn");
  assert.equal(result.alarm, true);
  assert.equal(result.connection, "closed");
  assert.equal(result.messageStop, false);
  assert.equal(result.tear.kind, "mid_close");
  assert.match(result.tear.message, /Connection closed mid-response/);
  assert.ok(result.events.some((event) => event.type === "content_block_delta"));
  assert.ok(result.events.some((event) => event.type === "content_block_stop"));
});

test("5 seed 47252 is partial, ultraplan refine timeout, approval never appears", () => {
  const result = decide(seed47252());
  assert.equal(result.verdict, "partial");
  assert.equal(result.alarm, true);
  assert.equal(result.tear.kind, "ultraplan");
  assert.match(result.tear.message, /Stream idle timeout/);
  assert.equal(result.events.some((event) => event.name === "AskUserQuestion"), true);
  assert.equal(result.incompleteTool, true);
  assert.equal(result.events.some((event) => event.type === "tool_result"), false);
});

test("6 seed 33949 is stalled, hang with no client timeout", () => {
  const result = decide(seed33949());
  assert.equal(result.verdict, "stalled");
  assert.equal(result.alarm, true);
  assert.equal(result.connection, "open");
  assert.equal(result.messageStop, false);
  assert.equal(result.tear.kind, "stall");
  assert.match(result.tear.message, /no client-side timeout/);
});

test("7 suture of 46987 → resumed, checkpoint at last complete tool boundary", () => {
  const torn = decide(seed46987());
  assert.equal(torn.verdict, "partial");
  const sutured = decide({ action: "suture", tray: torn.tray });
  assert.equal(sutured.verdict, "resumed");
  assert.equal(sutured.state, "resumed");
  assert.equal(sutured.decision, "resumed");
  assert.equal(sutured.alarm, false);
  assert.equal(sutured.recovered, true);
  assert.equal(sutured.discarded, false);
  assert.equal(sutured.incompleteTool, false);
  assert.equal(sutured.events[sutured.events.length - 1].type, "tool_result");
  assert.equal(sutured.events[sutured.events.length - 1].id, "tu1");
  assert.equal(sutured.events.some((event) => event.id === "tu2"), false);
  assert.equal(lastCompleteToolBoundary(sutured.events), sutured.events.length - 1);
  assert.deepEqual(snapshotToCheckpoint(torn.events), sutured.events);
});

test("8 discard of 46987 → discarded, tray emptied", () => {
  const torn = decide(seed46987());
  const dropped = decide({ action: "discard", tray: torn.tray });
  assert.equal(dropped.verdict, "discarded");
  assert.equal(dropped.state, "discarded");
  assert.equal(dropped.decision, "discarded");
  assert.equal(dropped.alarm, false);
  assert.equal(dropped.discarded, true);
  assert.equal(dropped.recovered, false);
  assert.equal(dropped.events.length, 0);
  assert.equal(dropped.idleWord, "sealed");
});

test("9 hold keeps the tear verdict and still alarms", () => {
  const torn = decide(seed46987());
  const held = decide({ action: "hold", tray: torn.tray });
  assert.equal(held.verdict, "partial");
  assert.equal(held.held, true);
  assert.equal(held.alarm, true);
  assert.equal(held.recovered, false);
  assert.equal(held.discarded, false);
  const stalled = decide({ action: "hold", tray: decide(seed54434()).tray });
  assert.equal(stalled.verdict, "stalled");
  assert.equal(stalled.held, true);
  assert.equal(stalled.alarm, true);
});

test("10 Slack adapter: no webhook → demo would-post; sealed skips", () => {
  const alarm = decide(seed46987());
  const slackAlarm = slackTearAlarm(alarm, {});
  assert.equal(slackAlarm.mode, "demo");
  assert.equal(slackAlarm.ok, true);
  assert.match(slackAlarm.summary, /would post/i);
  assert.match(slackAlarm.summary, /tear alarm/i);
  assert.doesNotMatch(slackAlarm.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const slackIdle = slackTearAlarm(idle, {});
  assert.equal(slackIdle.mode, "demo");
  assert.equal(slackIdle.ok, true);
  assert.match(slackIdle.summary, /skip/i);
  assert.match(slackIdle.summary, /sealed/i);
  assert.doesNotMatch(slackIdle.summary, /\b200\b/);
});

test("11 GitHub ledger: no token → demo row", () => {
  const alarm = decide(seed46987());
  const githubAlarm = githubSutureLedger(alarm, {});
  assert.equal(githubAlarm.mode, "demo");
  assert.equal(githubAlarm.ok, true);
  assert.match(githubAlarm.summary, /would append/i);
  assert.match(githubAlarm.summary, /suture ledger/i);
  assert.doesNotMatch(githubAlarm.summary, /\b200\b/);
});

test("12 Linear: no key → unrecovered-tear demo; sealed/resumed skip", () => {
  const alarm = decide(seed46987());
  const linearAlarm = linearUnrecoveredTearTicket(alarm, {});
  assert.equal(linearAlarm.mode, "demo");
  assert.equal(linearAlarm.ok, true);
  assert.match(linearAlarm.summary, /would open/i);
  assert.match(linearAlarm.summary, /unrecovered-tear/i);
  assert.doesNotMatch(linearAlarm.summary, /\b200\b/);

  const idle = decide({ action: "clear" });
  const linearIdle = linearUnrecoveredTearTicket(idle, {});
  assert.match(linearIdle.summary, /skip/i);
  assert.match(linearIdle.summary, /sealed/i);
  assert.doesNotMatch(linearIdle.summary, /\b200\b/);

  const resumed = decide({ action: "suture", tray: alarm.tray });
  const linearResumed = linearUnrecoveredTearTicket(resumed, {});
  assert.match(linearResumed.summary, /skip/i);
  assert.match(linearResumed.summary, /resumed/i);
});

test("13 handle() PostToolUse: alarm → deny; sealed → allow", async () => {
  const denied = await handle(seed46987(), {});
  assert.equal(denied.ok, true);
  assert.equal(denied.product, "suture");
  assert.equal(denied.verdict, "partial");
  assert.equal(denied.hook_event_name, "PostToolUse");
  assert.equal(denied.permissionDecision, "deny");
  assert.equal(denied.hookSpecificOutput.decision.interrupt, true);
  assert.equal(denied.sinks.length, 3);
  assert.ok(denied.sinks.every((row) => row.mode === "demo"));

  const allowed = await handle({ action: "clear" }, {});
  assert.equal(allowed.verdict, "sealed");
  assert.equal(allowed.permissionDecision, "allow");
  assert.equal(allowed.hookSpecificOutput.decision.interrupt, false);
  assert.doesNotMatch(allowed.state, /suture/i);
  assert.doesNotMatch(allowed.idleWord, /suture/i);
});

test("14 fire demo events are honest, never a fake live 200", async () => {
  const sinks = await fire(decide(seed46987()), {});
  assert.equal(sinks.events.length, 3);
  assert.deepEqual(
    sinks.events.map((row) => row.adapter),
    ["slack", "github", "linear"],
  );
  assert.ok(sinks.events.every((row) => row.mode === "demo"));
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});

test("15 alarm set is torn/stalled/partial; idle word is sealed", () => {
  assert.deepEqual([...VERDICTS], ["sealed", "torn", "stalled", "partial", "resumed", "discarded"]);
  assert.deepEqual([...ALARM_VERDICTS], ["torn", "stalled", "partial"]);
  assert.equal(ALARM_VERDICTS.includes("sealed"), false);
  assert.equal(ALARM_VERDICTS.includes("resumed"), false);
  assert.equal(ALARM_VERDICTS.includes("discarded"), false);
  assert.equal(IDLE_WORD, "sealed");
  assert.doesNotMatch(IDLE_WORD, /suture/i);
});

test("16 suture of 70217 with no complete tool pair resumes on an empty checkpoint", () => {
  const torn = decide(seed70217());
  assert.equal(torn.checkpoint, -1);
  const sutured = decide({ action: "suture", tray: torn.tray });
  assert.equal(sutured.verdict, "resumed");
  assert.equal(sutured.recovered, true);
  assert.equal(sutured.events.length, 0);
  assert.equal(sutured.alarm, false);
});
