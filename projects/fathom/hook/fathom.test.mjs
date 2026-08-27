import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubSoundingLedger, linearAckTicket, slackLostRuleAlarm } from "./adapters.mjs";
import {
  IDLE_WORD,
  decide,
  decideSeed,
  emptyAction,
  emptyBoard,
  seed25792,
  seed25884,
  seed59309,
  seed82184,
  seed89733,
} from "./fathom.mjs";
import { handle } from "./index.mjs";

test("1 seed89733 is ack, idleWord still, alarm true", () => {
  const seed = seed89733();
  const result = decide(seed);
  assert.equal(result.verdict, "ack");
  assert.equal(result.state, "ack");
  assert.equal(result.decision, "ack");
  assert.equal(result.alarm, true);
  assert.equal(result.idleWord, "still");
  assert.equal(IDLE_WORD, "still");
  assert.doesNotMatch(result.idleWord, /fathom/i);
  assert.match(result.draft, /average/i);
  assert.match(result.draft, /total/i);
  assert.equal(decideSeed(seed89733).verdict, "ack");
});

test("2 idle/clear is still, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "still");
  assert.equal(result.idleWord, "still");
  assert.equal(result.verdict, "still");
  assert.equal(result.decision, "still");
  assert.deepEqual(emptyBoard().pins, []);
  assert.doesNotMatch(result.state, /fathom/i);
  assert.doesNotMatch(result.idleWord, /fathom/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "still");
  assert.equal(cleared.idleWord, "still");
  assert.doesNotMatch(cleared.state, /fathom/i);
  assert.doesNotMatch(cleared.idleWord, /fathom/i);
  const empty = decide({});
  assert.equal(empty.verdict, "still");
  assert.doesNotMatch(empty.idleWord, /fathom/i);
});

test("3 seed82184 is lost", () => {
  const result = decide(seed82184());
  assert.equal(result.verdict, "lost");
  assert.equal(result.alarm, true);
  assert.match(result.draft, /landed|commit|shipped|merged/i);
  assert.equal(result.compacted, true);
  assert.equal(result.bound, false);
});

test("4 seed59309 spawn is lost, inherited false", () => {
  const result = decide(seed59309());
  assert.equal(result.verdict, "lost");
  assert.equal(result.action, "spawn");
  assert.equal(result.inherited, false);
  assert.equal(result.board.inherited, false);
  assert.equal(result.spawned, true);
  assert.match(result.draft, /Write CLAUDE\.md/);
});

test("5 seed25792 is lost, 42%", () => {
  const result = decide(seed25792());
  assert.equal(result.verdict, "lost");
  assert.match(result.draft, /42%/);
  assert.equal(result.compacted, true);
  assert.equal(result.alarm, true);
});

test("6 seed25884 is drift", () => {
  const result = decide(seed25884());
  assert.equal(result.verdict, "drift");
  assert.equal(result.bound, true);
  assert.equal(result.compacted, false);
  assert.match(result.draft, /as unknown/);
  assert.match(result.draft, /@ts-ignore/);
});

test("7 compact without bind is lost", () => {
  const result = decide({
    action: "compact",
    draft: "Eight cases sit on the sounding.",
    board: {
      pins: [{ id: "no-total", check: "forbid-total" }],
      compacted: false,
      bound: true,
      spawned: false,
      inherited: true,
      narrative: "standing rules were in the window",
    },
  });
  assert.equal(result.verdict, "lost");
  assert.equal(result.compacted, true);
  assert.equal(result.bound, false);
  assert.equal(result.alarm, true);
});

test("8 bind after compact with clean draft is bound, injection has MUST:", () => {
  const compacted = decide({
    action: "compact",
    draft: "Eight cases sit on the sounding.",
    board: {
      pins: [{ id: "no-total", check: "forbid-total", text: "plain" }],
      compacted: false,
      bound: true,
      spawned: false,
      inherited: true,
      narrative: "standing rules were in the window",
    },
  });
  assert.equal(compacted.verdict, "lost");
  const bound = decide({
    action: "bind",
    draft: "Eight cases sit on the sounding.",
    board: compacted.board,
  });
  assert.equal(bound.verdict, "bound");
  assert.equal(bound.bound, true);
  assert.equal(bound.inherited, true);
  assert.equal(bound.alarm, false);
  assert.match(bound.injection, /MUST:/);
});

test("9 acknowledge then violate is ack", () => {
  const result = decide({
    action: "acknowledge",
    draft: "Across the eight cases the average is 12.4 and the total is 99...",
    board: {
      pins: [{ id: "no-total", check: "forbid-total", acknowledged: false }],
      compacted: true,
      bound: false,
      spawned: false,
      inherited: true,
      narrative: "the model said it would hold the rule",
    },
  });
  assert.equal(result.verdict, "ack");
  assert.equal(result.alarm, true);
  assert.equal(result.pins[0].acknowledged, true);
});

test("10 slack skips on still, alarms on lost; 89733 mentions acknowledgment", () => {
  const still = slackLostRuleAlarm(decide({ action: "clear" }), {});
  assert.match(still.summary, /skip/i);
  assert.match(still.summary, /still/i);
  assert.doesNotMatch(still.summary, /fathom/i);

  const lost = slackLostRuleAlarm(decide(seed82184()), {});
  assert.equal(lost.mode, "demo");
  assert.match(lost.summary, /would post/i);
  assert.match(lost.summary, /lost/i);

  const ack = slackLostRuleAlarm(decide(seed89733()), {});
  assert.match(ack.summary, /acknowledgment/i);
  assert.match(ack.summary, /would post/i);
});

test("11 github/linear honest demo", () => {
  const result = decide(seed89733());
  const github = githubSoundingLedger(result, {});
  const linear = linearAckTicket(result, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /would append/i);
  assert.match(github.summary, /sounding/i);
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /would open/i);
  assert.doesNotMatch(github.summary, /\b200\b/);
  assert.doesNotMatch(linear.summary, /\b200\b/);
});

test("12 handle(seed89733) denies, sinks length 3", async () => {
  const out = await handle(seed89733(), {});
  assert.equal(out.ok, true);
  assert.equal(out.product, "fathom");
  assert.equal(out.verdict, "ack");
  assert.equal(out.permissionDecision, "deny");
  assert.equal(out.hookSpecificOutput.decision.interrupt, true);
  assert.equal(out.hook_event_name, "Stop");
  assert.equal(out.sinks.length, 3);
  assert.ok(out.sinks.every((row) => row.mode === "demo"));
});

test("13 fire demo without secrets", async () => {
  const sinks = await fire(decide(seed89733()), {});
  assert.equal(sinks.events.length, 3);
  const slack = sinks.events.find((row) => row.adapter === "slack");
  const github = sinks.events.find((row) => row.adapter === "github");
  const linear = sinks.events.find((row) => row.adapter === "linear");
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /would post/i);
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /would append/i);
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /would open/i);
  assert.doesNotMatch(JSON.stringify(sinks).toLowerCase(), /"mode":"live"/);
  assert.doesNotMatch(JSON.stringify(sinks), /\b200\b/);
});

test("14 bound draft does not alarm", () => {
  const result = decide({
    action: "bind",
    draft: "Eight cases sit on the sounding.",
    board: {
      pins: [{ id: "no-total", check: "forbid-total" }],
      compacted: true,
      bound: false,
      spawned: false,
      inherited: true,
      narrative: "re-bound after compact",
    },
  });
  assert.equal(result.verdict, "bound");
  assert.equal(result.alarm, false);
  const slack = slackLostRuleAlarm(result, {});
  const linear = linearAckTicket(result, {});
  assert.match(slack.summary, /skip/i);
  assert.match(linear.summary, /skip/i);
});
